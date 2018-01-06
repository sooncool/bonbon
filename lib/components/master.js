var nowFileName = "master.js";
var tcpServer = require("./tcpServer.js");
var starter = require("../util/starter.js");
var msgCoder = require("./msgCoder.js");

var servers = {};
var app = null;

module.exports.start = function (_app) {
    app = _app;
    startServer();
};

