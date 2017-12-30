var Package = require("../package.json");
var application = require("./application.js");


var bonbon = module.exports = {};

bonbon.version = Package.version;

bonbon.createApp = function () {
    bonbon.app = application;
    application.init();
    return application;
};