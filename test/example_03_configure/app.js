const app = require("./application");
//通过type配置服务器类型，gate网关服务器配置，connector前端服务器配置
app.configure("dddd")
    .then((self) => {
        console.log("Hello World");
        console.log(self)

        let cb = function name() {
            console.log("Hello World");
        };
        cb.call(self);
        console.log(self)
        // app.set("connectorConfig", {
        //     "connector": "ws",          //"ws" for cocos creator,  "net" for unity
        //     "encode": null,
        //     "decode": null
        // });
    })
    .then((self) => {
        console.log(self)
    })
    .catch((error) => {
        console.log("error");
    })

// var name = async function () {
//     let self = await app.configure("all");
//     console.log(self);
//     let cb = function name() {
//         console.log("Hello World");
//     };

//     cb.call(self);

//     console.log(self);
// }();
