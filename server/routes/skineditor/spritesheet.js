const express = require('express');
const router = express.Router();
const cors = require('cors')
const fse = require('fs-extra')
const JSZip = require("jszip")
const path = require('path')
const bodyParser = require('body-parser')
const ElapsedTime = require('elapsed-time')
const rimraf = require('rimraf')
const packer = require('gamefroot-texture-packer')
// const { first, second, third } = require('./path/to/first_file.js');
const execFile = require('child_process').execFile

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
//////////////////
connections = []
//////////////////
router.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
})
router.post('/', cors(corsOptions), function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (connections.includes(req.connection.remoteAddress) !== true) {
    connections.push(req.connection.remoteAddress)
    var IP_ADD = req.connection.remoteAddress
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
        fse.outputFile(path.join(__dirname, `../../assets/${IP_ADD}/${frameName}.png`), frameImage, {
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
        let _data = req.body.frame_data
        _data.map(frames => (createFramePng(frames.name + '0001', frames.image.split('base64,').pop())))
        setTimeout(() => resolve(), 600)
      })
    }
    //////////////////
    function spriteMaker() {
      return new Promise((resolve, reject) => {
        console.log('---- CREATE SHEET ----')
        packer(`server/assets/${IP_ADD}/*.png`, {
          format: 'json',
          trim: true,
          path: `server/assets/${IP_ADD}/data`
        }, err => {
          if (err) {
            reject(err)
          } else {
            rimraf(`server/assets/${IP_ADD}/*.png`, function() {
              resolve()
            })
          }
        })
      })
    }
    //////////////////
    function convertToXnb() {
      return new Promise((resolve, reject) => {
        let imageDir = __dirname + `/../../assets/${IP_ADD}/data/spritesheet-1.png`
        let sheetXnb = __dirname + `/../../assets/${IP_ADD}/data/spritesheetcunt.xnb`
        console.log('---- CONVERT ----')
        let ET = ElapsedTime.new().start()
        execFile('wine', [
          `${__dirname}/../../png_to_xnb.exe`, imageDir, sheetXnb
        ], (error, stdout, stderr) => {
          if (error !== null) {
            console.log(`exec error: ${error}`, reject());
          } else {
            resolve(console.log(`Converted in ${ET.getValue()}`))
          }
        })
      })
    }
    //////////////////
    function zipFiles() {
      return new Promise((resolve, reject) => {
        console.log('---- ZIPPING ----')
        let imageXnb = base64_encode(__dirname + `/../../assets/${IP_ADD}/data/spritesheetcunt.xnb`)
        let imageAtlas = base64_encode(__dirname + `/../../assets/${IP_ADD}/data/spritesheet-1.json`)
        let zip = new JSZip()
        zip.file('spritesheet.xnb', imageXnb, {base64: true})
        zip.file('atlas.json', imageAtlas, {base64: true})
        zip.generateNodeStream({type: 'nodebuffer', streamFiles: true}).pipe(fse.createWriteStream(__dirname + `/../../assets/${IP_ADD}/data/skin.zip`)).on('finish', function() {
          res.download(__dirname + `/../../assets/${IP_ADD}/data/skin.zip`, function(err) {
            if (err) {
              reject(err)
            } else {
              resolve(console.log('---- FINISHED ----'), connections = connections.filter(ip => ip !== req.connection.remoteAddress))
            }
          })
        })
      })
    }
    ////////////////
    async function init() {
      await createFrameMap()
      await spriteMaker()
      await convertToXnb()
      await zipFiles()
    }
    init()
  } else {
    res.sendStatus(403)
  }
})
module.exports = router
