const express = require('express');
const fse = require('fs-extra');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../config/config');
const webpackConfig = require('../webpack.config')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const jsonParser = bodyParser.json()
const spritesheet = require('spritesheet-js')
const uuidv4 = require('uuid/v4')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

const socketio = require('socket.io')

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8080;

// Configuration
// ================================================================================================

// Set up Mongoose
// mongoose.connect(isDev ? config.db_dev : config.db);
// mongoose.Promise = global.Promise;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// API routes
require('./routes')(app);

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({verbose: false}));

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
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}
//////////////////
var server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
});
//////////////////
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
// This creates our socket using the instance of the server
const io = socketio(server)

// This is what the socket.io syntax is like, we will work this later
// app.post('/localsheet/sendSprites',urlencodedParser, function(req, res, next) {
//   console.log(req.body)
//////////////////
//////////////////
// })
app.post('/sendframes', urlencodedParser, function(req, res) {
  var UUID = uuidv4()
  let base64String = req.body
  //////////////////
  function createFramePng(frameName, frameImage) {
    fse.outputFile(path.join(__dirname, `assets/export/${frameName}.jpeg`), frameImage, {
      encoding: 'base64'
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('The file was saved!');
      }
    })
  }
  //////////////////
  function createFrameMap() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('one')
        base64String.map(frames => (createFramePng(frames.name, frames.image.split('base64,').pop())))
        resolve();
      }, 0);
    });
  }
  //////////////////

  //////////////////
  function spriteMaker() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('two')
        spritesheet(`server/assets/export/*.jpeg`, {
          format: 'json',
          trim: false,
          fuzz: '1%',
          path: `server/assets/${SOCKETID}/`
        }, function(err) {
          if (err)
            throw err;
          console.log('spritesheet successfully generated');
        })
        resolve();
      }, 2000);
    });

  }

  //////////////////
  function removeFrames() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('three')
        rimraf('server/assets/export/*.jpeg', function() {
          console.log('all jpegs removed from exports');
        })
        resolve();
      }, 2000);
    });

  }
  //////////////////
  // console.log(req.body)
  createFrameMap().then(spriteMaker).then(removeFrames)
})
  //////////////////
  var queue = [];
  //////////////////
io.on('connection', socket => {
  SOCKETID = socket.id
  console.log('User connected', SOCKETID)
  queue.push(socket.id)

  socket.on('disconnect', () => {
    console.log('user disconnected', SOCKETID)
    fse.remove(path.join(__dirname, `assets/${SOCKETID}`));
    queue.indexOf(SOCKETID) !== 0 ? queue.splice(queue.indexOf(SOCKETID), 1) : queue = []
    console.log('queue is now ', queue)
  })
})
//////////////////
module.exports = app
