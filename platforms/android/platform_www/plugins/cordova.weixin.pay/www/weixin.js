cordova.define("cordova.weixin.pay.weixin", function(require, exports, module) {
/**
	

**/
var exec = require('cordova/exec');

module.exports = {
    sendPayReq: function(param,onSuccess,onError){
        exec(onSuccess, onError,"Weixin","sendPayReq",[param]);
    }
};
});
