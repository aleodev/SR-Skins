const express = require('express')
const fse = require('fs-extra')
const JSZip = require('jszip')
const path = require('path')
const bodyParser = require('body-parser')
// const ElapsedTime = require('elapsed-time')
const rimraf = require('rimraf')
const packer = require('gamefroot-texture-packer')
const execFile = require('child_process').execFile

module.exports = (app) => {
  // connections array to manage active ips executing a post request on /skineditor
  //////////////////
  connections = []
  // skin editor post request
  //////////////////
  app.post('/skineditor', function(req, res) {
    if (connections.includes(req.connection.remoteAddress) !== true) {
      connections.push(req.connection.remoteAddress)
      IP_ADD = req.connection.remoteAddress
      DATA_FOLDER = __dirname + `/../../assets/${IP_ADD}/data/`
      // encode data into base64 format
      //////////////////
      function base64_encode(file) {
        // read binary data
        let bitmap = fse.readFileSync(file)
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64')
      }
      // create/write a png from each piece of framedata
      //////////////////
      function createFramePng(frameName, frameImage) {
        return new Promise((resolve, reject) => {
          // create each frame with base64 data from the req.body
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
      // loop the "createFramePng" function to get all frames needed to be packed
      //////////////////
      function createFrameMap() {
        return new Promise((resolve, reject) => {
          console.log('---- CREATE IMAGES ----')
          let _data = req.body.frame_data
          // loop the frame creation, creating all frames in png format input by the user from the frontend
          _data.map(frames => (createFramePng(frames.name + '0001', frames.image.split('base64,').pop())))
          setTimeout(() => resolve(), 600)
        })
      }
      // pack the frames into a spritesheet png and corresponding json
      //////////////////
      function spriteMaker() {
        return new Promise((resolve, reject) => {
          console.log('---- CREATE SHEET ----')
          // pack all pngs made from the frame looping function into a png spritesheet and a json
          packer(`server/assets/${IP_ADD}/*.png`, {
            format: 'json',
            trim: true,
            path: `server/assets/${IP_ADD}/data`
          }, err => {
            if (err) {
              reject(err)
            } else {
              // remove all fodder pngs used in the making of the sheet
              rimraf(`server/assets/${IP_ADD}/*.png`, function() {
                resolve()
              })
            }
          })
        })
      }
      //////////////////
      // convert both the spritesheet to xnbs
      function sheetToXnb() {
        return new Promise((resolve, reject) => {
          let imageDir = DATA_FOLDER + 'spritesheet-1.png'
          let sheetXnb = DATA_FOLDER + 'spritesheetcunt.xnb'
          console.log('---- CONVERTING SPRITESHEET ----')
          // use the png to xnb converter with wine to convert the png spritesheet into xnb
          execFile('wineconsole', [
            `${__dirname}/../../png_to_xnb.exe`, imageDir, sheetXnb
          ], (error, stdout, stderr) => {
            if (error !== null) {
              console.log(`exec error: ${error}`, reject());
            } else {
              resolve()
            }
          })
        })
      }
      //////////////////
      // convert json to atlas xnb
      function jsonToAtlasXnb() {
        return new Promise((resolve, reject) => {
          console.log('---- CONVERTING JSON ----')
          let atlasGen = DATA_FOLDER + 'atlas_generator.exe'
          function atlasConv() {
            execFile('wineconsole', [atlasGen], (error, stdout, stderr) => {
              if (error !== null) {
                console.log(`exec error: ${error}`, reject());
              } else {
                resolve()
              }
            })
          }
          fse.pathExists(atlasGen, (err, exists) => {
            if (exists) {
              atlasConv()
            } else {
              fse.copy(__dirname + '/../../atlas_generator.exe', atlasGen).then(() => {
                atlasConv()
              }).catch(err => console.error(err, reject()))
            }
          })
        })
      }
      //////////////////
      // zip the spritesheet xnb and atlas xnb
      function zipFiles() {
        return new Promise((resolve, reject) => {
          console.log('---- ZIPPING ----')
          let imageXnb = base64_encode(DATA_FOLDER + 'spritesheetcunt.xnb')
          let imageAtlas = base64_encode(DATA_FOLDER + 'spritesheet-1.json')
          let skinZip = DATA_FOLDER + 'skin.zip'
          let zip = new JSZip()
          // zip both the xnb and json
          zip.file('spritesheet.xnb', imageXnb, {base64: true})
          zip.file('atlas.json', imageAtlas, {base64: true})
          // create the node stream for file gen
          zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
          //pipe the zip into file creation write stream with fse
            .pipe(fse.createWriteStream(skinZip))
          // when the file writing is finished, send a response to the client with the zip
            .on('finish', function() {
            res.download(skinZip, function(err) {
              if (err) {
                reject(err)
              } else {
                // remove the active ip address from the "connected" array to unblacklist their ip from requesting
                resolve(console.log('---- FINISHED ----'), connections = connections.filter(ip => ip !== req.connection.remoteAddress))
              }
            })
          })
        })
      }
      ////////////////
      // async function setup in order with all promises
      async function init() {
        await createFrameMap()
        await spriteMaker()
        await sheetToXnb()
        await jsonToAtlasXnb()
        await zipFiles()
      }
      // initialize the async functions
      init()
    } else {
      res.sendStatus(403)
    }
  })
}
