
var Application = module.exports = {};

// Application.configure =  function (type, cb) {
//     console.log(this);
//     if (type === "all") {
//         cb.call(this);
//         return;
//     }

//     var ts = type.split("|");
//     for (var i = 0; i < ts.length; i++) {
//         if (this.serverType == ts[i].trim()) {
//             cb.call(this);
//             break;
//         }
//     }
// };

Application.configure = async function (type) {
    console.log("+++", this);
    if (type === "all") {
        return this;
    }
    var ts = type.split("|");
    for (var i = 0; i < ts.length; i++) {
        if (this.serverType == ts[i].trim()) {
            return this;
            break;
        }
    }
};

