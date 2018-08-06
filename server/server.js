const express = require('express')
const helmet = require('helmet')
const fse = require('fs-extra')
const historyApiFallback = require('connect-history-api-fallback')
const mongoose = require('mongoose')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../config/config')
const webpackConfig = require('../webpack.config')
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
app.use(helmet())
app.disable('x-powered-by')
app.use(express.urlencoded({limit: '100mb', extended: false}))
app.use(express.json({limit: '100mb'}))

// API routes
const skineditor = require('./routes/skineditor/spritesheet')
const counters = require('./routes/api/counters')
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next()
})
app.use('/', counters)
app.use('/skineditor', skineditor)

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
app.listen(port, (err) => {
  if (err) {
    console.log(err)
  }
})
//////////////////

//////////////////
// const io = socketio(server)
// //////////////////
// var connected = []
// io.on('connection', socket => {
//   SOCKET_ID = socket.id
//   SOCKET_IP = socket.handshake.address
//   if (connected.some(e => e.address === SOCKET_IP) !== true) {
//     console.log('CONNECTED:'.bgGreen, `${SOCKET_ID}|${SOCKET_IP}`.underline)
//     connected.push({address: SOCKET_IP, sockets: [SOCKET_ID]})
//     console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
//   } else {
//     console.log('CONNECTED:'.bgGreen, `${SOCKET_ID}|${SOCKET_IP}`.underline)
//     connected[connected.findIndex(i => i.address === SOCKET_IP)].sockets.push(SOCKET_ID)
//     console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
//   }
//   socket.on('disconnect', () => {
//     let SOCKET_IP_INDEX = connected.findIndex(i => i.address === SOCKET_IP)
//     let SOCKET_ID_INDEX = connected[SOCKET_IP_INDEX].sockets.indexOf(SOCKET_ID)
//     if (connected[SOCKET_IP_INDEX].sockets.length >= 2) {
//       console.log('DISCONNECTED:'.bgRed, `${SOCKET_ID}|${SOCKET_IP}`.underline)
//       connected[SOCKET_IP_INDEX].sockets.splice(SOCKET_ID_INDEX, 1)
//       console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
//     } else {
//       console.log('DISCONNECTED:'.bgRed, `${SOCKET_ID}|${SOCKET_IP}`.underline)
//       connected.splice(connected.findIndex(i => i.address === SOCKET_IP), 1)
//       fse.remove(path.join(__dirname, `assets/${SOCKET_ID}`))
//       console.log('CONNECTIONS ARE NOW: '.bgMagenta, connected)
//     }
//   })
// })
///////////////
module.exports = app
