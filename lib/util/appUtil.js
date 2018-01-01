var path = require("path");
var fs = require("fs");

module.exports.defaultConfiguration = function(app){
    var args = parseArgs(process.argv);
    app.env = args.env === "production" ? "production" : "development";
    loadMaster(app);
    loadRpcServers(app);
    loadServers(app);
    loadRouteConfig(app);
    processArgs(app, args);
}

/**
 * 
 * @param {Object} args 启动时，参数配置
 */
var parseArgs = function (args) {
    var argsMap = {};
    var mainPos = 1;

    while (args[mainPos].indexOf('--') > 0) {
        mainPos++;
    }
    argsMap.main = args[mainPos];

    for (var i = (mainPos + 1); i < args.length; i++) {
        var arg = args[i];
        var sep = arg.indexOf('=');
        var key = arg.slice(0, sep);
        var value = arg.slice(sep + 1);
        if (!isNaN(Number(value)) && (value.indexOf('.') < 0)) {
            value = Number(value);
        }
        argsMap[key] = value;
    }

    return argsMap;
};

var loadMaster = function (app) {
    loadConfigBaseApp(app, "master", path.join(define.FILE_DIR.CONFIG, 'master.json'));
};

var loadRpcServers = function (app) {
    loadConfigBaseApp(app, "rpcServersConfig", path.join(define.FILE_DIR.CONFIG, 'rpc.json'));
};

var loadServers = function (app) {
    loadConfigBaseApp(app, "serversConfig", path.join(define.FILE_DIR.CONFIG, 'servers.json'));
};

var loadRouteConfig = function (app) {
    loadConfigBaseApp(app, "routeConfig", path.join(define.FILE_DIR.CONFIG, 'route.json'));
};

/**
 * 
 * @param {Object} app  application对象
 * @param {String} key  配置的键
 * @param {String} val  相对路径
 */
var loadConfigBaseApp = function (app, key, val) {
    var env = app.env;
    var originPath = path.join(app.base, val);
    if (fs.existsSync(originPath)) {
        var file = require(originPath);
        if (file[env]) {
            file = file[env];
        }
        app[key] = file;
    } else {
        console.error("ERROR-- no such file: " + originPath);
        process.exit();
    }
};

var processArgs = function (app, args) {

};