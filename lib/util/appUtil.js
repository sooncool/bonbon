var path = require("path");
var fs = require("fs");
var define = require("./define.js");
var master = require("../components/master.js");

module.exports.defaultConfiguration = function (app) {
    var args = parseArgs(process.argv);
    app.env = args.env === "production" ? "production" : "development";
    loadMaster(app);
    loadRpcServers(app);
    loadServers(app);
    loadRouteConfig(app);
    processArgs(app, args);
}

module.exports.startServer = function (app) {
    startPng(app);
    if (app.serverType === "master") {
        master.start(app);
    } else if (app.serverType === "rpc") {
        rpcServer.start(app);
        monitor.start(app);
    } else if (app.frontend) {
        rpcService.init(app);
        remoteFrontend.init(app);
        frontendServer.start(app);
        monitor.start(app);
    } else {
        rpcService.init(app);
        remoteBackend.init(app);
        backendServer.start(app);
        monitor.start(app);
    }
};

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

/**
 * master服务器，负责启动并管理所有服务器的增加和移除
 * @param {Object} app 
 * @param {Object} args 
 */
var processArgs = function (app, args) {
    app.main = args.main;
    app.serverType = args.serverType || "master";
    app.serverId = args.id || app.master.id;
    if (app.serverType === "master") {
        app.startMode = args.startMode === "alone" ? "alone" : "all";
        app.host = app.master.host;
        app.port = app.master.port;
    }
};

function startPng(app) {
    if (app.serverType !== "master" && app.startMode === "all") {
        return;
    }
    var lines = [
        "  ※----------------------------------------------------------※",
        "  ※  BBBBBB   OOOOOOO  N     N   BBBBBB   OOOOOOO  N     N   ※",
        "  ※  B     B  O     O  NN    N   B     B  O     O  NN    N   ※",
        "  ※  BBBBBBB  O     O  N  N  N   BBBBBBB  O     O  N  N  N   ※",
        "  ※  B     B  O     O  N   N N   B     B  O     O  N   N N   ※",
        "  ※  B     B  O     O  N    NN   B     B  O     O  N    NN   ※",
        "  ※  BBBBBBB  OOOOOOO  N     N   BBBBBBB  OOOOOOO  N     N   ※",
        "  ※                                                          ※",
        "  ※     Hello, BonBon !   version: 17.12.22-1.0.0            ※",
        "  ※----------------------------------------------------------※",
    ];
    var version = require("../bonbon.js").version;
    console.log("    ");
    for (var i = 0; i < lines.length; i++) {
        if (i === 8) {
            var j;
            var chars = lines[i].split('');
            for (j = 0; j < version.length; j++) {
                chars[34 + j] = version[j];
            }
            for (; j < 10; j++) {
                chars[34 + j] = " ";
            }
            lines[i] = chars.join('');
        }
        console.log(lines[i]);
    }
    console.log("       ");
}