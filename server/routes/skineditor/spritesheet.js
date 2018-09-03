const fse = require("fs-extra");
const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
// const ElapsedTime = require('elapsed-time')
const rimraf = require("rimraf");
const packer = require("gamefroot-texture-packer");
const { execFile } = require("child_process");

module.exports = app => {
  //////////////////
  // connections array to manage active ips executing a post request on /skineditor
  connections = [];
  // encode data into base64 format
  function base64_encode(file) {
    // read binary data
    let bitmap = fse.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString("base64");
  }
  //////////////////
  // skin editor post request
  app.post("/", function(req, res) {
    var ip =
      req.headers["x-forwarded-for"] ||
      (req.connection && req.connection.remoteAddress) ||
      "";
    console.log(ip);
    if (connections.includes(ip) !== true) {
      connections.push(ip);
      var IP_ADD = ip,
        _options = req.body.options,
        DATA_FOLDER = __dirname + `../../../../assets/${IP_ADD}/data`;
      //////////////////
      // loop the "createFramePng" function to get all frames needed to be packed
      function createFrames() {
        return new Promise((resolve, reject) => {
          console.log("---- CREATE IMAGES ----");
          let _data = req.body.frame_data;
          // loop the frame creation, creating all frames in png format input by the user from the frontend
          for (let anim of _data) {
            anim.image.map((frameImage, idx) => {
              fse.outputFile(
                path.join(
                  __dirname,
                  `../../assets/${IP_ADD}/${anim.name + "000" + (idx + 1)}.png`
                ),
                frameImage.split("base64,").pop(),
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
        });
      }
      //////////////////
      // pack the frames into a spritesheet png and corresponding json
      function spriteMaker() {
        return new Promise((resolve, reject) => {
          console.log("---- PACK FRAMES ----");
          // pack all pngs made from the frame looping function into a png spritesheet and a json
          packer(
            path.join(__dirname, `../../assets/${IP_ADD}/*.png`),
            {
              format: "json",
              trim: true,
              path: DATA_FOLDER,
              name: "spritesheet"
            },
            err => {
              if (err) {
                reject(err);
              } else {
                //remove all fodder pngs used in the making of the sheet
                rimraf(
                  path.join(__dirname, `../../assets/${IP_ADD}/*.png`),
                  () => {
                    resolve(
                      fs.rename(
                        `${DATA_FOLDER}spritesheet-1.json`,
                        `${DATA_FOLDER}atlas.json`
                      )
                    );
                  }
                );
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
            error => {
              if (error !== null) {
                console.log(`exec error: ${error}`, reject());
              } else {
                rimraf(`server/assets/${IP_ADD}/data/spritesheet-1.png`, () => {
                  fs.writeFile(
                    DATA_FOLDER + "config.txt",
                    _options.characterIdx,
                    err => {
                      if (err) reject(err);
                      resolve();
                    }
                  );
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
          // function atlasConv() {
          execFile(
            "wine",
            [
              `${__dirname}/server/atlas_generator.exe`,
              "-o",
              DATA_FOLDER + "atlas.json"
            ],
            error => {
              if (error !== null) {
                console.log(`exec error: ${error}`, reject());
              } else {
                rimraf(`server/assets/${IP_ADD}/data/atlas.json`, () => {
                  resolve();
                });
              }
            }
          );
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
            zip = new JSZip();
          // zip both the xnb and json
          zip.file(`animation_variant${_options.variant}.xnb`, sheetXnb, {
            base64: true
          });
          zip.file(`animation_atlas_variant${_options.variant}.xnb`, atlasXnb, {
            base64: true
          });
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
                  rimraf(`server/assets/${IP_ADD}`, () => {
                    connections = connections.filter(ip => ip !== ip);
                    resolve(console.log("---- CLEARED FOLDER ----"));
                  });
                  // remove the active ip address from the "connected" array to unblacklist their ip from requesting
                }
              });
            });
        });
      }

      ////////////////
      // async function setup in order with all promises
      async function init() {
        await createFrames();
        await spriteMaker();
        await sheetToXnb();
        await jsonToAtlasXnb();
        await zipFiles();
      }
      init();
      // initialize the async functions
    } else {
      res.sendStatus(403);
    }
  });
};
