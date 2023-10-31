// Console colors
var colors = require('colors');

// [INFO] console out
var info = function(message) {
    console.log(colors.cyan('[INFO]'), message);
}

// [ERROR] console out
var error = function(message) {
    console.error(colors.red('[ERROR]'), message);
}

// [SUCCESS] console out
var success = function(message) {
    console.log(colors.green('[SUCCESS]'), message);
}

// [AUTH] console out
var auth = function(message) {
    console.log(colors.yellow('[AUTH]'), message);
}

var warn = function(message) {
    console.warn(colors.brightYellow('[WARN]'), message);
}
var fs = function(message) {
    console.log(colors.brightMagenta('[FS]'), message);
}
var fsError = function(message) {
    console.error(colors.brightMagenta('[ FS'), colors.brightRed("Error"), colors.brightMagenta(']'), message);
}
var api = function(message) {
    console.log(colors.brightWhite("[API]"), message);
}
var apiError = function(message) {
    console.error(colors.brightGreen('[ API'), colors.brightRed("Error"), colors.brightGreen(']'), message);
}
// Module exports
module.exports.apiError = apiError;
module.exports.api = api;
module.exports.fsError = fsError;
module.exports.fs = fs;
module.exports.warn = warn;
module.exports.info = info;
module.exports.log = info;
module.exports.error = error;
module.exports.success = success;
module.exports.auth = auth;