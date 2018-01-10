var nowFileName = "tcpServer.js";
var net = require("net");
var msgCoder = require("./msgCoder.js");
var EventEmitter = require('events').EventEmitter;
var app = require("../bonbon.js").app;

/**
 * 
 * @param {Number} port 
 * @param {Function} startCb 
 * @param {Function} newClientCb 
 */
var tcpServer = function (port, startCb, newClientCb) {
    var server = net.createServer(function (socket) {
        newClientCb(new netsocket(socket));
    });
    server.listen(port, startCb);
};

module.exports = tcpServer;

//EventEmitter 的核心就是事件触发与事件监听器功能的封装。
class netsocket extends EventEmitter {
    constructor(socket) {
        super();
        this.socket = socket;
        this.msgBuf = { "len": 0, "buffer": Buffer.alloc(0) };

        var self = this;
        this.socket.on("close", function () {
            if (!self.die) {
                self.die = true;
                self.emit("close");
            }
        });
        this.socket.on("error", function () {
            if (!self.die) {
                self.die = true;
                self.emit("close");
            }
        });
        this.socket.on("data", function (data) {
            if (self.die) {
                self.close();
            } else {
                msgCoder.decode(self.msgBuf, data, function (err, msg) {
                    if (err) {
                        app.logger(nowFileName, "error", "- data too long, close the socket");
                        self.close();
                    } else {
                        self.emit("data", msg);
                    }
                });
            }
        });
    }

    send(data) {
        this.socket.write(data);
    };

    close() {
        this.socket.destroy();
        this.socket.emit("close");
    };
};