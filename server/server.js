const express = require('express')
const fse = require('fs-extra')
const historyApiFallback = require('connect-history-api-fallback')
const mongoose = require('mongoose')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../config/config')
const webpackConfig = require('../webpack.config')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({limit: '100mb', extended: false})
const jsonParser = bodyParser.json({limit: '100mb'})
const rimraf = require('rimraf')
const packer = require('gamefroot-texture-packer')
const dotenv = require('dotenv')
const envFile = dotenv.config().parsed
const colors = require('colors')

const socketio = require('socket.io')

const isDev = process.env.NODE_ENV !== 'production'

const port = isDev
  ? (envFile.DEV_P_ENV)
  : (envFile.PROD_P_ENV)

// Configuration
// ================================================================================================

// Set up Mongoose
// mongoose.connect(isDev ? config.db_dev : config.db)
// mongoose.Promise = global.Promise

const app = express()
app.use(express.urlencoded({limit: '100mb', extended: false}))
app.use(express.json({limit: '100mb'}))

// API routes
require('./routes')(app)

if (isDev) {
  const compiler = webpack(webpackConfig)

  app.use(historyApiFallback({verbose: false}))

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }))

  app.use(webpackHotMiddleware(compiler))
  app.use(express.static(path.resolve(__dirname, '../dist')))
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')))
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    res.end()
  })
}
//////////////////
var server = app.listen(port, (err) => {
  if (err) {
    console.log(err)
  }
})
//////////////////
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})
//////////////////
const io = socketio(server)
//////////////////
app.post('/skineditor', function(req, res) {
  var base64String = req.body
  //////////////////
  function createFramePng(frameName, frameImage) {
    return new Promise((resolve, reject) => {
      fse.outputFile(path.join(__dirname, `assets/${SOCKETID}/${frameName}.png`), frameImage, {
        encoding: 'base64'
      }, err => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  //////////////////
  function createFrameMap() {
    return new Promise((resolve, reject) => {
      console.log('---- CREATE IMAGES ----')
      base64String.map(frames => (createFramePng(frames.name, frames.image.split('base64,').pop())))
      setTimeout(() => resolve(), 600)
    })
  }
  //////////////////
  function spriteMaker() {
    return new Promise((resolve, reject) => {
      console.log('---- CREATE SHEET ----')
      packer(`server/assets/${SOCKETID}/*.png`, {
        format: 'json',
        trim: true,
        path: `server/assets/${SOCKETID}/data`
      }, err => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  //////////////////
  function removeFrames() {
    return new Promise(resolve => {
      console.log('---- REMOVE ----')
      rimraf(`server/assets/${SOCKETID}/*.png`, function() {
        resolve()
      })
    })
  }
  //////////////////
  function zipFiles() {
    console.log('CUNTAGEEEEE')
  }
  //////////////////
  function downloadFiles() {
    return new Promise((resolve, reject) => {
      console.log('---- DOWNLOAD ----')
      res.download(__dirname + `/assets/${SOCKETID}/data/spritesheet-1.png`, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve('---- FILE SENT ----')
        }
      })
    })
    // res.download(__dirname + `assets/${SOCKETID}/data/spritesheet-1.png`)
  }
  //////////////////
  async function init() {
    await createFrameMap()
    await spriteMaker()
    await removeFrames()
    await downloadFiles()
    zipFiles()
  }
  init()
})
//////////////////
var connected = []
io.on('connection', socket => {
  SOCKETID = socket.id
  console.log('CONNECTED:'.bgGreen, `${SOCKETID}`.underline)
  console.log(socket.handshake.address)
  connected.push(SOCKETID)
  console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
  socket.on('disconnect', () => {
    console.log('DISCONNECTED:'.bgRed, `${SOCKETID}`.underline)
    fse.remove(path.join(__dirname, `assets/${SOCKETID}`))
    connected.indexOf(SOCKETID) !== 0
      ? connected.splice(connected.indexOf(SOCKETID), 1)
      : connected = []
    console.log(socket.handshake.address)
    console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
  })
})
///////////////
module.exports = app
