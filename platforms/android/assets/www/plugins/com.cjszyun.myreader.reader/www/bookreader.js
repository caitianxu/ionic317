cordova.define("com.cjszyun.myreader.reader.BookRead", function(require, exports, module) {
var exec = require('cordova/exec');


module.exports = {
    reader: function(params,onSuccess,onError){
        exec(onSuccess, onError, "BookReader", "reader", [params]);
    }
};

});
