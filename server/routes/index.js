const fs = require("fs");
const path = require("path");

module.exports = app => {
  // API routes
  // fs.readdirSync(__dirname + "/api/").forEach(file => {
  //   require(`./api/${file.substr(0, file.indexOf("."))}`)(app);
  // });
  // fs.readdirSync(__dirname + "/skineditor/").forEach(file => {
  //   require(`./skineditor/${file.substr(0, file.indexOf("."))}`)(app);
  // });
  require(`./api/counters.js`)(app);
  require(`./skineditor/spritesheet.js`)(app);
};
