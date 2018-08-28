const fse = require("fs-extra");
const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
// const ElapsedTime = require('elapsed-time')
const rimraf = require("rimraf");
const packer = require("gamefroot-texture-packer");
const { exec, execFile } = require("child_process");

module.exports = app => {
  //////////////////
  // connections array to manage active ips executing a post request on /skineditor
  connections = [];
  //////////////////
  // skin editor post request
  app.post("/editor/custom", function(req, res) {
    if (connections.includes(req.connection.remoteAddress) !== true) {
      connections.push(req.connection.remoteAddress);
      IP_ADD = req.connection.remoteAddress;
      DATA_FOLDER = __dirname + `/../../assets/${IP_ADD}/data/`;
      rimraf(`server/assets/${IP_ADD}/data/*.png`, () => {
        rimraf(`server/assets/${IP_ADD}/data/*.xnb`, () => {
          rimraf(`server/assets/${IP_ADD}/data/*.json`, () => {});
        });
      });

      //////////////////
      // encode data into base64 format
      function base64_encode(file) {
        // read binary data
        let bitmap = fse.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString("base64");
      }
      //////////////////
      // create/write a png from each piece of framedata
      function createFramePng(frameName, frameImage) {
        return new Promise((resolve, reject) => {
          // create each frame with base64 data from the req.body
          fse.outputFile(
            path.join(__dirname, `../../assets/${IP_ADD}/${frameName}.png`),
            frameImage,
            {
              encoding: "base64"
            },
            err => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      }
      //////////////////
      // loop the "createFramePng" function to get all frames needed to be packed
      function createFrameMap() {
        return new Promise((resolve, reject) => {
          console.log("---- CREATE IMAGES ----");
          let _data = req.body.frame_data
          // loop the frame creation, creating all frames in png format input by the user from the frontend
          // _data.map(frames =>
          //   createFramePng(
          //     frames.name + "00011",
          //     frames.image.split("base64,").pop()
          //   )
          // );
          ////
          for (let anim of _data){
            anim.image.map((frameImage, idx) => {
                createFramePng(
                  anim.name + "0001" + (idx + 1),
                  frameImage.split("base64,").pop()
                )
            })
          }
          setTimeout(() => resolve(), 1000);
        })
      }
      //////////////////
      // pack the frames into a spritesheet png and corresponding json
      function spriteMaker() {
        return new Promise((resolve, reject) => {
          console.log("---- CREATE SHEET ----");
          // pack all pngs made from the frame looping function into a png spritesheet and a json
          packer(
            `server/assets/${IP_ADD}/*.png`,
            {
              format: "json",
              trim: true,
              path: `server/assets/${IP_ADD}/data`,
              name: "spritesheet"
            },
            err => {
              if (err) {
                reject(err);
              } else {
                //remove all fodder pngs used in the making of the sheet
                rimraf(`server/assets/${IP_ADD}/*.png`, function() {
                  resolve(
                    fs.rename(
                      `${DATA_FOLDER}spritesheet-1.json`,
                      `${DATA_FOLDER}atlas.json`
                    )
                  );
                });
              }
            }
          );
        });
      }
      //////////////////
      // convert both the spritesheet to xnbs
      function sheetToXnb() {
        return new Promise((resolve, reject) => {
          let imageDir = DATA_FOLDER + "spritesheet-1.png";
          console.log("---- CONVERTING SPRITESHEET ----");
          // use the png to xnb converter with wine to convert the png spritesheet into xnb
          execFile(
            "wine",
            [`${__dirname}/../../png_to_xnb.exe`, imageDir],
            (error, stdout, stderr) => {
              if (error !== null) {
                console.log(`exec error: ${error}`, reject());
              } else {
                rimraf(`server/assets/${IP_ADD}/data/spritesheet-1.png`, () => {
                  resolve();
                });
              }
            }
          );
        });
      }
      //////////////////
      // convert json to atlas xnb
      function jsonToAtlasXnb() {
        return new Promise((resolve, reject) => {
          console.log("---- CONVERTING JSON ----");
          let atlasGen = DATA_FOLDER + "atlas_generator.exe";
          function atlasConv() {
            exec(
              `wine atlas_generator.exe`,
              {
                cwd: DATA_FOLDER
              },
              (error, stdout, stderr) => {
                if (error !== null) {
                  console.log(`exec error: ${error}`, reject());
                } else {
                  rimraf(`server/assets/${IP_ADD}/data/atlas.json`, () => {
                    resolve();
                  });
                }
              }
            );
          }
          fse.pathExists(atlasGen, (err, exists) => {
            if (exists) {
              atlasConv();
            } else {
              fse
                .copy(__dirname + "/../../atlas_generator.exe", atlasGen)
                .then(() => {
                  atlasConv();
                })
                .catch(err => console.error(err, reject()));
            }
          });
        });
      }
      //////////////////
      // zip the spritesheet xnb and atlas xnb
      function zipFiles() {
        return new Promise((resolve, reject) => {
          console.log("---- ZIPPING ----");
          let sheetXnb = base64_encode(DATA_FOLDER + "spritesheet-1.xnb"),
            atlasXnb = base64_encode(DATA_FOLDER + "atlas.xnb"),
            skinZip = DATA_FOLDER + "skin.zip",
            _options = req.body.options,
            zip = new JSZip();
          // zip both the xnb and json
          zip.file(
            `animation_variant${_options.variant}.xnb`,
            sheetXnb,
            { base64: true }
          );
          zip.file(
            `animation_atlas_variant${_options.variant}.xnb`,
            atlasXnb,
            { base64: true }
          );
          // create the node stream for file gen
          zip
            .generateNodeStream({ type: "nodebuffer", streamFiles: true })
            //pipe the zip into file creation write stream with fse
            .pipe(fse.createWriteStream(skinZip))
            // when the file writing is finished, send a response to the client with the zip
            .on("finish", function() {
              res.download(skinZip, function(err) {
                if (err) {
                  reject(err);
                } else {
                  // remove the active ip address from the "connected" array to unblacklist their ip from requesting
                  resolve(
                    console.log("---- FINISHED ----"),
                    (connections = connections.filter(
                      ip => ip !== req.connection.remoteAddress
                    ))
                  );
                }
              });
            });
        });
      }
      ////////////////
      // async function setup in order with all promises
      async function init() {
        await createFrameMap();
        await spriteMaker();
        await sheetToXnb();
        await jsonToAtlasXnb();
        await zipFiles();
      }
      // initialize the async functions
      init();
    } else {
      res.sendStatus(403);
    }
  });
  app.post("/cuck", function(req, res) {
    res.send("YEAH")
  }
};
