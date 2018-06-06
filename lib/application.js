var nowFileName = "application";
var path = require("path");
var appUtil = null;

var Application = module.exports = {};

/**
 * 初始化服务器
 * 加载默认配置
 */
Application.init = function () {
    this.settings = {};             // key/value dictionary (app.set, app.get)
    this.clients = {};              // client map (only for frontend server)
    this.clientNum = 0;             // client num (only for frontend server)

    this.main = null;
    this.base = path.dirname(require.main.filename);
    this.env = "";

    this.master = null;           // master info (from the config)
    this.rpcServersConfig = null; // rpc servers info (from the config)
    this.serversConfig = null;    // servers info (from the config)
    this.servers = {};            // servers info (runtime servers info, developer can add or remove server dynamically)
    this.routeConfig = null;      // route info (from the config)
    this.serverToken = "admin";   // the password used when server register to another one

    this.host = null;             // current server ip
    this.port = null;             // current server port
    this.serverId = null;         // current server id
    this.serverType = null;       // current server type
    this.frontend = null;         // is frontend server ?
    this.noBack = null;           // frontend server need to connect to backend server ?
    this.startMode = null;        // start mode: all or alone
    this.startTime = null;        // current server start time

    this.router = {};             // the rule used when frontend server send message to backend server, to decide which one to choose
    this.rpc = null;              // used for rpc message
    this.rpcService = null;       // normal server use it to manage rpc server
    this.remoteBackend = null;    // backend server use it to manage frontend server connected to it (only for backend server)
    this.remoteFrontend = null;   // frontend server use it to manage backend server it connect to (only for frontend server with backend server)
    this.ifLogRoute = true;       // if frontend server log route when data coming
    this.logger = function () {   // bonbon framework print msg using this function
    };

    appUtil = require("./util/appUtil");
    appUtil.defaultConfiguration(this);
}

 Application.start = function () {
    this.startTime = new Date().getTime();
    appUtil.startServer(this);
};


Application.getBase = function () {
    return this.base;
};


Application.set = function (setting, val) {
    this.settings[setting] = val;
};


Application.get = function (setting) {
    return this.settings[setting];
};

Application.getAll = function () {
    return this.settings;
};

Application.delete = function (setting) {
    delete this.settings[setting];
};

Application.getMaster = function () {
    return this.master;
};

Application.getServers = function () {
    return this.servers;
};

Application.configure = function (type, cb) {
    if (type === "all") {
        cb.call(this);
        return;
    }
    var ts = type.split("|");
    for (var i = 0; i < ts.length; i++) {
        if (this.serverType == ts[i].trim()) {
            cb.call(this);
            break;
        }
    }
};

Application.onLog = function (cb) {
    if (typeof cb !== "function") {
        console.error("app.onLog() --- cb must be a function")
    }
    this.logger = cb;
};

Application.loadFile = function (dir) {
    dir = path.join(this.base, dir);
    return require(dir)
};