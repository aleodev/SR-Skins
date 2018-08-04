const express = require('express')
const helmet = require('helmet')
const fse = require('fs-extra')
const JSZip = require("jszip")
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
const execFile = require('child_process').execFile
const socketio = require('socket.io')
const cors = require('cors')
const ElapsedTime = require('elapsed-time')
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
app.use(helmet())
app.disable('x-powered-by')
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
  // res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type")
  next()
})
//////////////////
const io = socketio(server)
//////////////////

//////////////////
app.post('/skineditor', cors(), function(req, res) {
  console.log(req.connection.remoteAddress)
  console.log(req.socket.remoteAddress)
  var ET = ElapsedTime.new().start()
  var base64String = req.body
  //////////////////
  function base64_encode(file) {
    // read binary data
    let bitmap = fse.readFileSync(file)
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64')
  }
  //////////////////
  function createFramePng(frameName, frameImage) {
    return new Promise((resolve, reject) => {
      fse.outputFile(path.join(__dirname, `assets/${SOCKET_ID}/${frameName}.png`), frameImage, {
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
      base64String.map(frames => (createFramePng(frames.name + '0001', frames.image.split('base64,').pop())))
      setTimeout(() => resolve(), 600)
    })
  }
  //////////////////
  function spriteMaker() {
    return new Promise((resolve, reject) => {
      console.log('---- CREATE SHEET ----')
      packer(`server/assets/${SOCKET_ID}/*.png`, {
        format: 'json',
        trim: true,
        path: `server/assets/${SOCKET_ID}/data`
      }, err => {
        if (err) {
          reject(err)
        } else {
          rimraf(`server/assets/${SOCKET_ID}/*.png`, function() {
            resolve()
          })
        }
      })
    })
  }
  //////////////////
  function convertToXnb() {
    return new Promise((resolve, reject) => {
      let imageDir = __dirname + `/assets/${SOCKET_ID}/data/spritesheet-1.png`
      let sheetXnb = __dirname + `/assets/${SOCKET_ID}/data/spritesheetcunt.xnb`
      console.log('---- CONVERT ----')
      execFile('nohup', [isDev ? 'wine' : 'mono', `${__dirname}/png_to_xnb.exe`,'-c', `${imageDir}`, `${sheetXnb}`], (error, stdout, stderr) => {
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
        resolve()
      })
    })
  }
  //////////////////
  function zipFiles() {
    return new Promise((resolve, reject) => {
      console.log('---- DOWNLOAD ----')
      let imageXnb = base64_encode(__dirname + `/assets/${SOCKET_ID}/data/spritesheetcunt.xnb`)
      let imageAtlas = base64_encode(__dirname + `/assets/${SOCKET_ID}/data/spritesheet-1.json`)
      let zip = new JSZip()
      zip.file('spritesheet.xnb', imageXnb, {base64: true})
      zip.file('atlas.json', imageAtlas, {base64: true})
      zip.generateNodeStream({type: 'nodebuffer', streamFiles: true}).pipe(fse.createWriteStream(__dirname + `/assets/${SOCKET_ID}/data/skin.zip`)).on('finish', function() {
        res.download(__dirname + `/assets/${SOCKET_ID}/data/skin.zip`, function(err) {
          if (err) {
            reject(err)
          } else {
            resolve(console.log("---- ZIPPED ----"))
          }
        })
      })
    })
  }
  //////////////////
  async function init() {
    await createFrameMap()
    await spriteMaker()
    await convertToXnb()
    await zipFiles()
    console.log(ET.getValue())
  }
  init()
})
//////////////////
var connected = []
io.on('connection', socket => {
  SOCKET_ID = socket.id
  SOCKET_IP = socket.handshake.address
  if (connected.some(e => e.address === SOCKET_IP) !== true) {
    console.log('CONNECTED:'.bgGreen, `${SOCKET_ID}|${SOCKET_IP}`.underline)
    connected.push({address: SOCKET_IP, sockets: [SOCKET_ID]})
    console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
  } else {
    console.log('CONNECTED:'.bgGreen, `${SOCKET_ID}|${SOCKET_IP}`.underline)
    connected[connected.findIndex(i => i.address === SOCKET_IP)].sockets.push(SOCKET_ID)
    console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
  }
  socket.on('disconnect', () => {
    let SOCKET_IP_INDEX = connected.findIndex(i => i.address === SOCKET_IP)
    let SOCKET_ID_INDEX = connected[SOCKET_IP_INDEX].sockets.indexOf(SOCKET_ID)
    if(connected[SOCKET_IP_INDEX].sockets.length >= 2){
      console.log('DISCONNECTED:'.bgRed, `${SOCKET_ID}|${SOCKET_IP}`.underline)
      connected[SOCKET_IP_INDEX].sockets.splice(SOCKET_ID_INDEX, 1)
      console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
    } else {
      console.log('DISCONNECTED:'.bgRed, `${SOCKET_ID}|${SOCKET_IP}`.underline)
      connected.splice(connected.findIndex(i => i.address === SOCKET_IP), 1)
      fse.remove(path.join(__dirname, `assets/${SOCKET_ID}`))
      console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
    }
  })
})
///////////////
module.exports = app
