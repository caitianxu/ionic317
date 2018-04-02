webpackJsonp([0],{

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_register__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__resetpwd_resetpwd__ = __webpack_require__(270);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.param = {
            account: null,
            pwd: null
        };
    }
    LoginPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        this.service.statusBar.styleDefault();
    };
    LoginPage.prototype.backHome = function () {
        alert(jQuery.readerParam);
        if (jQuery.readerParam) {
            try {
                var options = {
                    ctxPath: this.service.ctxPath.toString(),
                    chid: jQuery.readerParam.chid + '',
                    pagenum: jQuery.readerParam.pagenum + '',
                    eventkey: jQuery.readerParam.eventkey + '',
                    bookid: jQuery.readerParam.bookid + '',
                    bookname: jQuery.readerParam.bookname + '',
                    booktype: jQuery.readerParam.booktype + '',
                    userid: this.service.LoginUserInfo.member_id.toString(),
                    token: this.service.LoginUserInfo.token.toString()
                };
                navigator.BookRead.reader(options);
            }
            catch (e) {
                alert(e);
            }
        }
        else {
            this.navCtrl.pop();
        }
    };
    //登录
    LoginPage.prototype.tologin = function () {
        var _this = this;
        if (!this.param.account) {
            this.service.dialogs.alert('请填写登录账号', '提示', '确定');
            return false;
        }
        if (!this.param.pwd) {
            this.service.dialogs.alert('请填写登录密码', '提示', '确定');
            return false;
        }
        this.service.post('/v2/api/mobile/login', this.param).then(function (success) {
            if (success.code == 0) {
                _this.service.LoginUserInfo = success.data;
                _this.service.LoginUserInfo.pwd = _this.param.pwd;
                _this.service.token = success.data.token;
                //存储用户信息
                localStorage.setItem('LoginUserInfo', JSON.stringify(_this.service.LoginUserInfo));
                _this.service.unRefreshBookshelf = true;
                console.log(_this.service.LoginUserInfo);
                _this.navCtrl.popToRoot();
            }
            else {
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
        }, function (error) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    //前往注册
    LoginPage.prototype.toregister = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register_register__["a" /* RegisterPage */]);
    };
    //找回密码
    LoginPage.prototype.resetpwd = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__resetpwd_resetpwd__["a" /* ResetpwdPage */]);
    };
    //进行注册
    LoginPage.prototype.reg_user = function (userId) {
        var _this = this;
        this.service.loadingStart();
        this.service.post("/v2/api/mobile/registe", {
            account: userId,
            pwd: '123456'
        }).then(function (success) {
            _this.service.post('/v2/api/mobile/login', {
                account: userId,
                pwd: '123456'
            }).then(function (success) {
                _this.service.loadingEnd();
                if (success.code == 0) {
                    _this.service.LoginUserInfo = success.data;
                    _this.service.LoginUserInfo.pwd = '123456';
                    _this.service.token = success.data.token;
                    //存储用户信息
                    localStorage.setItem('LoginUserInfo', JSON.stringify(_this.service.LoginUserInfo));
                    _this.service.unRefreshBookshelf = true;
                    _this.navCtrl.popToRoot();
                }
                else {
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
            }, function (err) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }, function (err) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    //微信登录
    LoginPage.prototype.weixin_login = function () {
        var _this = this;
        var scope = 'snsapi_userinfo';
        var state = '_' + (+new Date());
        Wechat.auth(scope, state, function (response) {
            var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx1726323de580e8ba&secret=80448ccbd8c9ef57a16d5a15d3dfc269&code=" + response.code + "&grant_type=authorization_code";
            _this.service.post('/v3/otherMember/getJSONString', {
                otherURL: url
            }).then(function (res) {
                var jsonData = JSON.parse(res.data);
                _this.reg_user(jsonData.openid);
                // let url_1 = "https://api.weixin.qq.com/sns/userinfo?access_token=" + jsonData.access_token + "&openid=" + jsonData.openid + "&lang=zh_CN";
                // this.service.post('/v3/otherMember/getJSONString', {
                //   otherURL: url_1
                // }).then(res_1 => {
                //   alert(res_1.data)
                // })
            }, function (err) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }, function (reason) {
            _this.service.dialogs.alert(reason, '提示', '确定');
        });
    };
    //qq 登录
    LoginPage.prototype.qq_login = function () {
        var _this = this;
        var args = {
            client: QQSDK.ClientType.QQ
        };
        QQSDK.checkClientInstalled(function () {
            QQSDK.ssoLogin(function (result) {
                _this.reg_user(result.userid);
            }, function (failReason) {
                console.log(JSON.stringify(failReason));
            }, args);
        }, function (error) {
            _this.service.dialogs.alert('未检测到QQ应用的安装，无法使用QQ第三方登录', '提示', '确定');
        }, args);
    };
    //微博登录
    LoginPage.prototype.weibo_login = function () {
        var _this = this;
        WeiboSDK.ssoLogin(function (args) {
            console.log(JSON.stringify(args));
            _this.reg_user(args.userId);
            // alert('access token is ' + args.access_token);
            // alert('userId is ' + args.userId);
            // alert('expires_time is ' + new Date(parseInt(args.expires_time)) + ' TimeStamp is ' + args.expires_time);
        }, function (failReason) {
            _this.service.dialogs.alert(failReason, '提示', '确定');
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\login\login.html"*/'<ion-content>\n\n  <div class="login-back">\n\n    <button ion-button [hidden]="!service.LoginUserInfo" (tap)="backHome()"\n\n    style="margin:0;padding:0;height:auto;font-size:30px;background-color:transparent;">\n\n      <ion-icon class="ion-ios-iconfont-icon-rt"></ion-icon></button>\n\n  </div>\n\n  <div class="header-logo"></div>\n\n  <div class="form-con">\n\n    <div class="form-row">\n\n      <i class="iconfont icon-touxiang-copy"></i>\n\n      <input type="text" placeholder="请输入帐号/手机/邮箱" [(ngModel)]="param.account"/>\n\n    </div>\n\n    <div class="form-row">\n\n      <i class="iconfont icon-mima"></i>\n\n      <input type="password" placeholder="请输入密码"  [(ngModel)]="param.pwd"/>\n\n    </div>\n\n    <div class="link-row" (tap)="resetpwd()">忘记密码</div>\n\n\n\n    <button ion-button full color="danger" style="margin-bottom:7px;" (tap)="tologin()">登录</button>\n\n    <button ion-button full color="secondary" class="clear-btn-all" (tap)="toregister()">注册</button>\n\n\n\n    <div class="other-login">\n\n      <span class="login-item">\n\n        <div (tap)="qq_login()">\n\n          <span class="mm-qq"></span>\n\n          QQ登录\n\n        </div>\n\n      </span>\n\n      <span class="login-item">\n\n        <div (tap)="weixin_login()">\n\n          <span class="mm-weixin"></span>\n\n          微信登录\n\n        </div>\n\n      </span>\n\n      <span class="login-item">\n\n        <div (tap)="weibo_login()">\n\n          <span class="mm-weibo"></span>\n\n          微博登录\n\n        </div>\n\n      </span>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\login\login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QiandaoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__qiandaoremark_qiandaoremark__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__recharge_recharge__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var QiandaoPage = /** @class */ (function () {
    function QiandaoPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.service = service;
        this.allDayNum = 0; //本月所有天数
        this.nowDay = '01'; //今天
        this.nowDate = new Date();
        this.allDayArray = []; //所有签到记录
        this.coujiangArr = null; //抽奖记录
        this.nowChoujiangDay = null; //当前抽奖天
        this.choujiangNum = 0; //抽奖次数
        this.allDayNum = new Date(this.nowDate.getFullYear(), (this.nowDate.getMonth() + 1), 0).getDate();
        var nn = this.nowDate.getDate();
        this.nowDay = nn >= 10 ? nn : '0' + nn;
        var year = this.nowDate.getFullYear();
        var month = this.nowDate.getMonth() + 1;
        month = month >= 10 ? month : '0' + month;
        for (var i = 1; i <= this.allDayNum; i++) {
            var day = i >= 10 ? i : '0' + i;
            this.allDayArray.push({
                sign_time: year + '-' + month + '-' + day,
                day: day
            });
            if (day == this.nowDay) {
                this.qiandaoToday = {
                    sign_time: year + '-' + month + '-' + day,
                    day: day
                };
            }
        }
        this.service.loadingStart();
        this.get_qiandaoData();
    }
    //签到规则
    QiandaoPage.prototype.toremark = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__qiandaoremark_qiandaoremark__["a" /* QiandaoRemarkPage */]);
    };
    QiandaoPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    //获取签到记录
    QiandaoPage.prototype.get_qiandaoData = function () {
        var _this = this;
        this.service.post('/v3/api/memberSign/monthSign', {}).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                for (var i = 0; i < success.data.length; i++) {
                    var index = _this.forEachDay(success.data[i].sign_time);
                    _this.allDayArray[index]['id'] = success.data[i]['id'];
                    _this.allDayArray[index]['member_id'] = success.data[i]['member_id'];
                    _this.allDayArray[index]['sign_gift'] = success.data[i]['sign_gift'];
                    _this.allDayArray[index]['sign_time'] = success.data[i]['sign_time'];
                    if (_this.nowDay == success.data[i].sign_time.split('-')[2]) {
                        _this.qiandaoToday = _this.allDayArray[index];
                    }
                    //判断是否已经签到，但是没有抽奖
                    if (!success.data[i]['sign_gift']) {
                        _this.choujiangNum += 1;
                    }
                }
            }
            _this.service.loadingEnd();
        });
    };
    //找到对应天
    QiandaoPage.prototype.forEachDay = function (time) {
        var index = null;
        for (var i = 0; i < this.allDayArray.length; i++) {
            if (this.allDayArray[i].sign_time == time) {
                index = i;
            }
        }
        return index;
    };
    //今天签到
    QiandaoPage.prototype.qiandaotoday = function (day, isbuqian) {
        var _this = this;
        day = !day ? this.qiandaoToday : day;
        if (!day.id && day.day <= this.nowDay) {
            this.service.loadingStart();
            this.service.post('/v3/api/memberSign/signIn', {
                date: day.sign_time,
                action: 'sign',
                type: isbuqian
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.get_qiandaoData();
                    _this.choujiang(day);
                }
            });
        }
    };
    //补签
    QiandaoPage.prototype.buqian = function (day) {
        var _this = this;
        //判断是否有补签机会
        var b_num = 0;
        var b = localStorage.getItem('choujiang_num');
        if (b) {
            b_num = parseInt(b);
        }
        if (b_num > 0) {
            this.service.dialogs.confirm('你还剩余' + b_num + '次补签机会', '补签', ['确认补签', '取消']).then(function (index) {
                if (index == 1) {
                    b_num -= 1;
                    localStorage.setItem('choujiang_num', b_num.toString());
                    _this.qiandaotoday(day, 'buqian');
                }
            });
        }
        else {
            this.service.dialogs.confirm('充值任意金额可以获得一次补签机会，每日不限补签次数', '补签', ['前往充值', '取消']).then(function (index) {
                if (index == 1) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__recharge_recharge__["a" /* RechargePage */]);
                }
            });
        }
    };
    //直接抽奖
    QiandaoPage.prototype.choujiang = function (day) {
        this.nowChoujiangDay = day;
        this.showChoujiang();
    };
    QiandaoPage.prototype.showChoujiang = function () {
        var ayy = [];
        //创建50个 5分
        for (var i = 1; i <= 50; i++) {
            ayy.push(5);
        }
        //创建20个 10分
        for (var i = 1; i <= 20; i++) {
            ayy.push(10);
        }
        //创建10个 20分
        for (var i = 1; i <= 15; i++) {
            ayy.push(20);
        }
        //创建10个 50分
        for (var i = 1; i <= 10; i++) {
            ayy.push(10);
        }
        //创建4个 100分
        for (var i = 1; i <= 4; i++) {
            ayy.push(100);
        }
        //创建1个 200分
        ayy.push(200);
        //循环6次抽奖结果
        this.coujiangArr = [];
        for (var i = 1; i <= 6; i++) {
            var mm = parseInt((parseFloat(Math.random().toString()) * 100).toString());
            this.coujiangArr.push({
                select: false,
                first: false,
                n: ayy[mm]
            });
        }
        //显示
        jQuery('#choujiang').show();
        jQuery('.qd-content').addClass('qd-hidden');
    };
    //关闭
    QiandaoPage.prototype.choujiangClose = function () {
        jQuery('.qd-content').removeClass('qd-hidden');
        jQuery('#choujiang').hide();
    };
    //翻牌
    QiandaoPage.prototype.fanpai = function (citem) {
        var _this = this;
        citem.select = true;
        if (!this.nowChoujiangDay.sign_gift) {
            this.nowChoujiangDay.sign_gift = citem.n + '长江币';
            citem.first = true;
            this.service.post('/v3/api/memberSign/signGift', {
                date: this.nowChoujiangDay.sign_time,
                sign_gift: this.nowChoujiangDay.sign_gift
            }).then(function (success) {
                _this.get_qiandaoData();
                _this.service.post('/v3/payAmount/addCut', {
                    amount: citem.n,
                    action: 'add'
                }).then(function (addSuccess) {
                    if (success.code == 600) {
                        _this.service.loadingEnd();
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                    }
                    else if (success.code != 0) {
                        _this.service.loadingEnd();
                        _this.service.dialogs.alert(success.message, '提示', '确定');
                    }
                    else {
                        //重新获取用户信息
                        _this.service.getUserInfo();
                        _this.service.dialogs.alert('恭喜你获得' + _this.nowChoujiangDay.sign_gift, '提示', '确定').then(function (scc) {
                            _this.coujiangArr.forEach(function (element) {
                                element.select = true;
                            });
                        });
                    }
                });
            });
        }
    };
    QiandaoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-qiandao',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\qiandao\qiandao.html"*/'<ion-header color="transparent">\n\n  <ion-navbar color="transparent">\n\n    <ion-title>\n\n      签到\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="ml-nav"></div>\n\n  <div class="ml-table">\n\n    <div class="table-rol" *ngFor="let day of allDayArray">\n\n      <span class="m1" [ngClass]="{\'un-qiandao\': day.day > nowDay,\'this-today\': day.day == nowDay}" (tap)="qiandaotoday(day)">{{day.day}}</span>\n\n      <span class="m2" [hidden]="!day.id"></span>\n\n      <span class="m4" [hidden]="(day.id && day.sign_gift) || !day.id" (tap)="choujiang(day)"></span>\n\n      <span class="m3" [hidden]="day.day >= nowDay || day.id" (tap)="buqian(day)"></span>\n\n    </div>\n\n  </div>\n\n  <div style="padding:0 20px 40px 20px;" [hidden]="qiandaoToday.id" (tap)="qiandaotoday()">\n\n    <button ion-button color="danger" block>立即签到</button>\n\n  </div>\n\n  <div style="padding:0 20px 40px 20px;" [hidden]="!qiandaoToday.id">\n\n    <button ion-button color="danger" disabled block>今日已签到</button>\n\n  </div>\n\n  <div class="qd-cmcc">\n\n    <label>连续签到可抽奖和领取奖励</label>\n\n    <a (tap)="toremark()">查看说明</a>\n\n  </div>\n\n</ion-content>\n\n<div id="choujiang" style="display:none;">\n\n  <div class="qd-content">\n\n    <div class="cj-header">\n\n      签到成功，翻牌得奖励\n\n      <i class="cj-close" (tap)="choujiangClose()">\n\n        <ion-icon name="close"></ion-icon>\n\n      </i>\n\n    </div>\n\n    <div class="cj-m-content">\n\n      <div class="cj-fp-s">\n\n        <div class="card-container" *ngFor="let item of coujiangArr" (tap)="fanpai(item)">\n\n          <div class="card" [ngClass]="{\'active\': item.select}">\n\n            <a class="back">\n\n              <div class="csa">\n\n                <div class="csa-m" [ngClass]="{\'first-bg\': item.first}">\n\n                  <h1>{{item.n}}</h1>\n\n                  <p>长江币</p>\n\n                </div>\n\n              </div>\n\n            </a>\n\n            <a class="font">\n\n              <div class="csa">\n\n                <div class="csa-m csa-m-d"></div>\n\n              </div>\n\n            </a>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</div>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\qiandao\qiandao.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], QiandaoPage);
    return QiandaoPage;
}());

//# sourceMappingURL=qiandao.js.map

/***/ }),

/***/ 143:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClassifyListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ClassifyListPage = /** @class */ (function () {
    function ClassifyListPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.service = service;
        this.param = {
            pageNum: 0,
            pageSize: 10,
            pages: 1,
            total: 0,
            book_cat_id: 0,
            book_cat_sonid: null,
            bookChannel: null,
            book_type: 1,
            type: 'all',
            order: null
        };
        this.load_more = true;
        this.book_list_data = [];
        console.log(params);
        this.pageName = params.get('name');
        this.param.book_cat_id = params.get('id');
        this.cat_id = params.get('id');
        this.param.bookChannel = params.get('bookChannel');
        if (this.param.bookChannel == '2') {
            this.param.book_type = 2;
        }
    }
    ClassifyListPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //图书详情
    ClassifyListPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    ClassifyListPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
        }
        else {
            jQuery('.page-notwork').hide();
            jQuery('.has-wifi').show();
            this.service.loadingStart();
            this.service.post('/v3/api/bookCat/repoList', {
                pid: this.param.book_cat_id,
                channel: this.param.bookChannel
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.classifyArray = success.data;
                    _this.getBookList();
                    _this.service.loadingEnd();
                }
            });
            this.scroll_1 = jQuery('#scroll_1').on('scroll', function () {
                var div = document.getElementById('scroll_1');
                if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                    if (_this.param.pages > _this.param.pageNum && _this.load_more) {
                        _this.load_more = false;
                        _this.getBookList();
                    }
                }
            });
        }
    };
    //数据加载
    ClassifyListPage.prototype.getBookList = function (key, value) {
        var _this = this;
        if (key) {
            this.param[key] = value;
            this.param.pages = 1;
            this.param.pageNum = 0;
            this.book_list_data = [];
        }
        if (this.param.pageNum >= this.param.pages) {
            return false;
        }
        if (this.param.book_type == 2) {
            this.param.book_cat_id = this.param.book_cat_sonid ? this.param.book_cat_sonid : this.cat_id;
        }
        this.param.pageNum += 1;
        this.service.post('/v3/api/search/bookList', this.param).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                success.data.rows.forEach(function (element) {
                    _this.book_list_data.push(element);
                });
                _this.param.pages = success.data.pages;
                _this.param.total = success.data.total;
                _this.load_more = true;
            }
        });
    };
    ClassifyListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-classifylist',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\classifylist\classifylist.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      {{pageName}}\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="page-notwork" (tap)="ionViewDidLoad()"></div>\n\n  <div class="pd-col-content-all has-wifi" id="scroll_1">\n\n\n\n    <div class="search-header">\n\n      <div class="hst">\n\n        <div class="cm1">\n\n          <a (tap)="getBookList(\'order\',null)" [ngClass]="{\'active\':param.order == null}">全部</a>\n\n        </div>\n\n        <div class="cm2">\n\n          <a (tap)="getBookList(\'order\',\'hot\')" [ngClass]="{\'active\':param.order == \'hot\'}">热门图书</a>\n\n          <a (tap)="getBookList(\'order\',\'recommend\')" [ngClass]="{\'active\':param.order == \'recommend\'}">推荐图书</a>\n\n          <a (tap)="getBookList(\'order\',\'new\')" [ngClass]="{\'active\':param.order == \'new\'}">最新上架</a>\n\n        </div>\n\n      </div>\n\n      <div class="hst">\n\n        <div class="cm1">\n\n          <a (tap)="getBookList(\'book_cat_sonid\',null)" [ngClass]="{\'active\':param.book_cat_sonid == null}">全部</a>\n\n        </div>\n\n        <div class="cm2">\n\n          <a *ngFor="let cat of classifyArray" (tap)="getBookList(\'book_cat_sonid\',cat.book_cat_id)" [ngClass]="{\'active\':param.book_cat_sonid == cat.book_cat_id}">{{cat.book_cat_name}}</a>\n\n        </div>\n\n      </div>\n\n      <div class="hst">\n\n        <div class="cm1">\n\n          <a (tap)="getBookList(\'type\',\'all\')" [ngClass]="{\'active\':param.type == \'all\'}">全部</a>\n\n        </div>\n\n        <div class="cm2">\n\n          <a (tap)="getBookList(\'type\',\'free\')" [ngClass]="{\'active\':param.type == \'free\'}">免费</a>\n\n          <a (tap)="getBookList(\'type\',\'discount\')" [ngClass]="{\'active\':param.type == \'discount\'}" [hidden]="param.book_type == 1">特价</a>\n\n          <a (tap)="getBookList(\'type\',\'vip\')" [ngClass]="{\'active\':param.type == \'vip\'}" [hidden]="param.book_type == 2">VIP</a>\n\n          <a (tap)="getBookList(\'type\',\'continue\')" [ngClass]="{\'active\':param.type == \'continue\'}" [hidden]="param.book_type == 2">连载中</a>\n\n          <a (tap)="getBookList(\'type\',\'end\')" [ngClass]="{\'active\':param.type == \'end\'}" [hidden]="param.book_type == 2">已完结</a>\n\n        </div>\n\n      </div>\n\n    </div>\n\n\n\n    <div class="search-content">\n\n      <div class="book-line" *ngFor="let book of book_list_data" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n        <div class="m-cover">\n\n          <i class="mianfei" *ngIf="book.discount_price == 0"></i>\n\n          <i class="tejia" *ngIf="book.discount_price && book.discount_price > 0"></i>\n\n          <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n\n          <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n\n        </div>\n\n        <div class="m-detail">\n\n          <h1>{{book.book_name}}</h1>\n\n          <div class="m-remark">{{book.book_remark}}</div>\n\n          <div class="m-other">\n\n            <label class="m-left">{{book.book_author}}</label>\n\n            <label class="m-right">{{book.book_cat_name}}</label>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n\n\n    <div class="message-load-bottom" [hidden]="load_more">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="param.pages >= param.pageNum">共为你找到{{param.total}}本图书!</div>\n\n\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\classifylist\classifylist.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], ClassifyListPage);
    return ClassifyListPage;
}());

//# sourceMappingURL=classifylist.js.map

/***/ }),

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendReviewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SendReviewPage = /** @class */ (function () {
    function SendReviewPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.book_id = params.get('book_id');
        this.book_type = params.get('book_type');
    }
    SendReviewPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    SendReviewPage.prototype.submitView = function () {
        var _this = this;
        if (this.review_content) {
            this.service.post('/v3/bookReview/addReview', {
                book_id: this.book_id,
                review_content: this.review_content,
                book_type: this.book_type,
                pis: null
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.service.updateBookInfoReviews = true;
                    _this.service.dialogs.alert('评论成功!', '提示', '确定').then(function () {
                        _this.navCtrl.pop();
                    });
                }
            });
        }
        else {
            this.service.dialogs.alert('你还没有填写评论内容!', '提示', '确定');
        }
    };
    SendReviewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-sendreview',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\sendreview\sendreview.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      发布评论\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (tap)="submitView()" style="color:#333;margin-right:16px;">发布</button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <textarea placeholder="写下你的想法吧~" [(ngModel)]="review_content" maxlength="38"></textarea>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\sendreview\sendreview.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], SendReviewPage);
    return SendReviewPage;
}());

//# sourceMappingURL=sendreview.js.map

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XianmianPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classify_classify__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var XianmianPage = /** @class */ (function () {
    function XianmianPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nan_order_data = [];
        this.cb_order_data = [];
        this.nv_param = {
            channel_type: 2,
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.nan_param = {
            channel_type: 1,
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.cb_param = {
            channel_type: 3,
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
        this.load_more_nan = true;
        this.load_more_cb = true;
        this.df_type = 1;
        this.df_type = parseInt(params.get('type'));
    }
    XianmianPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //切换频道
    XianmianPage.prototype.activeTo = function (n) {
        this.active_index = n;
        this.mySwiper.slideTo(n - 1, 500, null);
    };
    //分类页
    XianmianPage.prototype.toClassify = function (e) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__classify_classify__["a" /* ClassifyPage */]);
    };
    //获取人气周数据
    XianmianPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/api/bookDiscount/getList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (_this.nv_order_data.length == 0) {
                        jQuery('.page-notdata-1').show();
                    }
                    else {
                        jQuery('.page-notdata-1').hide();
                    }
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_1').on('scroll', function () {
                            var div = document.getElementById('scroll_1');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //获取销售周榜
    XianmianPage.prototype.get_nan = function () {
        var _this = this;
        if (this.nan_param.pageNum < this.nan_param.pages) {
            this.nan_param.pageNum += 1;
            this.service.post('/v3/api/bookDiscount/getList', this.nan_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nan_order_data.push(element);
                    });
                    _this.nan_param.pages = success.data.pages;
                    _this.load_more_nan = true;
                    if (_this.nan_order_data.length == 0) {
                        jQuery('.page-notdata-2').show();
                    }
                    else {
                        jQuery('.page-notdata-2').hide();
                    }
                    if (!_this.scroll_2) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_2 = jQuery('#scroll_2').on('scroll', function () {
                            var div = document.getElementById('scroll_2');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nan && _this.nan_param.pages > _this.nan_param.pageNum) {
                                    _this.load_more_nan = false;
                                    setTimeout(function () {
                                        _this.get_nan();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //获取收藏周榜
    XianmianPage.prototype.get_cb = function () {
        var _this = this;
        if (this.cb_param.pageNum < this.cb_param.pages) {
            this.cb_param.pageNum += 1;
            this.service.post('/v3/api/bookDiscount/getList', this.cb_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.cb_order_data.push(element);
                    });
                    if (_this.cb_order_data.length == 0) {
                        jQuery('.page-notdata-3').show();
                    }
                    else {
                        jQuery('.page-notdata-3').hide();
                    }
                    _this.cb_param.pages = success.data.pages;
                    _this.load_more_cb = true;
                    if (!_this.scroll_3) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_3 = jQuery('#scroll_3').on('scroll', function () {
                            var div = document.getElementById('scroll_3');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_cb && _this.cb_param.pages > _this.cb_param.pageNum) {
                                    _this.load_more_cb = false;
                                    setTimeout(function () {
                                        _this.get_cb();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    XianmianPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    XianmianPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
        }
        else {
            jQuery('.page-notwork').hide();
            jQuery('.has-wifi').show();
            this.service.loadingStart();
            this.mySwiper = new Swiper('#mySwiper_order_1', {
                onTransitionEnd: function (swiper) {
                    var currentIndex = swiper.activeIndex;
                    _this.active_index = currentIndex + 1;
                }
            });
            //跳转到默认模块
            this.activeTo(this.df_type);
            //先加载一次
            this.get_nv();
            this.get_nan();
            this.get_cb();
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], XianmianPage.prototype, "slides", void 0);
    XianmianPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-xianmian',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\xianmian\xianmian.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>限时免费</ion-title>\n\n  </ion-navbar>\n\n\n\n  <ion-navbar color="light" style="padding:0;" id="childNavbar">\n\n    <div class="my-set-navbar">\n\n      <div class="plan-nav-1">\n\n        <div class="nav-li-par">\n\n          <div class="nav-li-pll" [ngClass]="\'active_\'+ active_index">\n\n            <ul class="header-nav-bar-lab">\n\n              <li (tap)="activeTo(1)">女频</li>\n\n              <li (tap)="activeTo(2)">男频</li>\n\n              <li (tap)="activeTo(3)">出版</li>\n\n            </ul>\n\n            <label class="dmdd">\n\n              <s></s>\n\n            </label>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="page-notwork" (tap)="ionViewDidLoad()"></div>\n\n  <div class="swiper-container has-wifi" id="mySwiper_order_1" style="opacity:0">\n\n    <div class="swiper-wrapper">\n\n      <div class="swiper-slide">\n\n        <div class="pd-col-content-all" id="scroll_1">\n\n          <div class="book-line" *ngFor="let book of nv_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="m-cover">\n\n              <s></s>\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2"  onload="imgLoad(this)" class="opacity_img">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1"  onload="imgLoad(this)" class="opacity_img">\n\n            </div>\n\n            <div class="m-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="m-remark">{{book.book_remark}}</div>\n\n              <div class="m-other">\n\n                <label class="m-left">{{book.book_author}}</label>\n\n                <label class="m-right">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n          <div class="page-notdata page-notdata-1"></div>\n\n          <div class="message-load-bottom" [hidden]="load_more_nv">\n\n            <ion-spinner name="dots"></ion-spinner>\n\n            <div>请稍候，努力加载中</div>\n\n          </div>\n\n          <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum || nv_order_data.length == 0">已经到底了，到别的频道逛逛吧!</div>\n\n        </div>\n\n      </div>\n\n      <div class="swiper-slide">\n\n        <div class="pd-col-content-all" id="scroll_2">\n\n          <div class="book-line" *ngFor="let book of nan_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="m-cover">\n\n              <s></s>\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2"  onload="imgLoad(this)" class="opacity_img">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n\n            </div>\n\n            <div class="m-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="m-remark">{{book.book_remark}}</div>\n\n              <div class="m-other">\n\n                <label class="m-left">{{book.book_author}}</label>\n\n                <label class="m-right">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n          <div class="page-notdata page-notdata-2"></div>\n\n          <div class="message-load-bottom" [hidden]="load_more_nan">\n\n            <ion-spinner name="dots"></ion-spinner>\n\n            <div>请稍候，努力加载中</div>\n\n          </div>\n\n          <div class="message-bottom" [hidden]="!load_more_nan || nan_param.pages > nan_param.pageNum || nan_order_data.length == 0">已经到底了，到别的频道逛逛吧!</div>\n\n        </div>\n\n      </div>\n\n      <div class="swiper-slide">\n\n        <div class="pd-col-content-all" id="scroll_3">\n\n\n\n          <div class="book-line" *ngFor="let book of cb_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="m-cover">\n\n              <s></s>\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2"  onload="imgLoad(this)" class="opacity_img">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1"  onload="imgLoad(this)" class="opacity_img">\n\n            </div>\n\n            <div class="m-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="m-remark">{{book.book_remark}}</div>\n\n              <div class="m-other">\n\n                <label class="m-left">{{book.book_author}}</label>\n\n                <label class="m-right">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n          <div class="page-notdata page-notdata-3"></div>\n\n          <div class="message-load-bottom" [hidden]="load_more_cb">\n\n            <ion-spinner name="dots"></ion-spinner>\n\n            <div>请稍候，努力加载中</div>\n\n          </div>\n\n          <div class="message-bottom" [hidden]="!load_more_cb || cb_param.pages > cb_param.pageNum || cb_order_data.length == 0">已经到底了，到别的频道逛逛吧!</div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\xianmian\xianmian.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], XianmianPage);
    return XianmianPage;
}());

//# sourceMappingURL=xianmian.js.map

/***/ }),

/***/ 172:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 172;

/***/ }),

/***/ 217:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 217;

/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookInfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mulu_mulu__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bookreviews_bookreviews__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sendreview_sendreview__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__recharge_recharge__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var BookInfoPage = /** @class */ (function () {
    function BookInfoPage(navCtrl, service, params, tab) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.params = params;
        this.tab = tab;
        this.review_list = {
            pages: 0,
            rows: []
        };
        this.shouchang = false;
        this.book_id = this.params.get('book_id');
        this.book_type = this.params.get('book_type');
    }
    BookInfoPage.prototype.fxaddData = function () {
        var _this = this;
        this.service.post('/v3/bookShare/addBookIndexRecord', {
            book_id: this.book_id,
            book_type: this.book_type
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                _this.service.dialogs.alert('分享成功!', '提示', '确定');
            }
        });
    };
    //分享到qq
    BookInfoPage.prototype.fxqq = function () {
        var _this = this;
        var args = {};
        args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        QQSDK.checkClientInstalled(function () {
            args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
            args.url = _this.book_type == 1 ? 'http://m.cjzww.com/book/index.php?bkid=' + _this.book_id : 'http://cjzww.cjszyun.cn/mobile/bookInfo/' + _this.book_id;
            args.title = "我的快乐，与你共享《" + _this.book.book_name.trim() + "》";
            args.description = _this.book.book_remark.trim();
            args.image = _this.book_type == 1 ? _this.book.book_cover : _this.service.ctxPath + _this.book.book_cover_small;
            QQSDK.shareNews(function () {
                _this.fxaddData();
            }, function (failReason) {
                console.log(failReason);
            }, args);
        }, function (err) {
            _this.service.dialogs.alert('你的手机还没有安装QQ呢!', '提示', '确定');
        }, args);
    };
    //分享到微博
    BookInfoPage.prototype.fxweibo = function () {
        var _this = this;
        WeiboSDK.checkClientInstalled(function () {
            var args = {};
            args.url = _this.book_type == 1 ? 'http://m.cjzww.com/book/index.php?bkid=' + _this.book_id : 'http://cjzww.cjszyun.cn/mobile/bookInfo/' + _this.book_id;
            args.title = "我的快乐，与你共享《" + _this.book.book_name.trim() + "》";
            args.description = _this.book.book_remark.trim();
            args.image = _this.book_type == 1 ? _this.book.book_cover : _this.service.ctxPath + _this.book.book_cover_small;
            WeiboSDK.shareToWeibo(function (scene) {
                _this.fxaddData();
            }, function (failReason) {
                // console.log(failReason);
            }, args);
        }, function (err) {
            _this.service.dialogs.alert('你的手机还没有安装微博呢!', '提示', '确定');
        });
    };
    //分享到微信
    BookInfoPage.prototype.fxtoweixin = function () {
        var _this = this;
        if (Wechat) {
            Wechat.isInstalled(function (s) {
                Wechat.share({
                    message: {
                        title: "我的快乐，与你共享《" + _this.book.book_name.trim() + "》",
                        description: _this.book.book_remark.trim(),
                        thumb: _this.book_type == 1 ? _this.book.book_cover : _this.service.ctxPath + _this.book.book_cover_small,
                        mediaTagName: "TEST-TAG-001",
                        messageExt: _this.book.book_remark.trim(),
                        messageAction: "<action>dotalist</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: _this.book_type == 1 ? 'http://m.cjzww.com/book/index.php?bkid=' + _this.book_id : 'http://cjzww.cjszyun.cn/mobile/bookInfo/' + _this.book_id
                        }
                    },
                    scene: Wechat.Scene.SESSION
                }, function () {
                    _this.fxaddData();
                }, function (reason) {
                    //this.service.dialogs.alert('错误:' + reason, '提示', '确定');
                });
            }, function (e) {
                _this.service.dialogs.alert('你的手机还没有安装微信呢!', '提示', '确定');
            });
        }
    };
    //分享到朋友圈
    BookInfoPage.prototype.fxtopengyouquan = function () {
        var _this = this;
        if (Wechat) {
            Wechat.isInstalled(function (s) {
                Wechat.share({
                    message: {
                        title: "我的快乐，与你共享《" + _this.book.book_name.trim() + "》",
                        description: _this.book.book_remark.trim(),
                        thumb: _this.book_type == 1 ? _this.book.book_cover : _this.service.ctxPath + _this.book.book_cover_small,
                        mediaTagName: "TEST-TAG-001",
                        messageExt: _this.book.book_remark.trim(),
                        messageAction: "<action>dotalist</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: _this.book_type == 1 ? 'http://m.cjzww.com/book/index.php?bkid=' + _this.book_id : 'http://cjzww.cjszyun.cn/mobile/bookInfo/' + _this.book_id
                        }
                    },
                    scene: Wechat.Scene.TIMELINE
                }, function () {
                    _this.fxaddData();
                }, function (reason) {
                    //this.service.dialogs.alert('错误:' + reason, '提示', '确定');
                });
            }, function (e) {
                _this.service.dialogs.alert('你的手机还没有安装微信呢!', '提示', '确定');
            });
        }
    };
    //去评论
    BookInfoPage.prototype.toSendRie = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__sendreview_sendreview__["a" /* SendReviewPage */], {
            book_id: this.book_id,
            book_type: this.book_type
        });
    };
    //所有评论
    BookInfoPage.prototype.toBookReviewsPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__bookreviews_bookreviews__["a" /* BookReviewsPage */], {
            book_id: this.book_id,
            book_type: this.book_type
        });
    };
    //分享
    BookInfoPage.prototype.toFenxiang = function (event) {
        jQuery('.footer-fx').fadeIn();
        setTimeout(function () {
            jQuery('.footer-fx').bind('click', function () {
                jQuery('.footer-fx').fadeOut();
                jQuery('.footer-fx').unbind('click');
            });
        }, 500);
    };
    //收藏
    BookInfoPage.prototype.toShouchang = function () {
        var _this = this;
        jQuery('.ol-1').hide();
        jQuery('.ol-2').show();
        this.service.loadingStart('正在更新书架');
        this.service.post('/v3/api/bookShelf/addBook', {
            book_id: this.book_id,
            book_type: this.book_type
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                setTimeout(function () {
                    _this.service.loadingEnd();
                    _this.service.unRefreshBookshelf = true;
                    _this.service.dialogs.confirm('图书已放进你的书架了, 现在就去阅读吧!', '提示', ['进入书架', '我再看看']).then(function (index) {
                        if (index == 1) {
                            _this.tab.select(0);
                            _this.navCtrl.popToRoot();
                        }
                    });
                }, 500);
            }
        });
    };
    //目录
    BookInfoPage.prototype.tomulu = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__mulu_mulu__["a" /* MuluPage */], {
            book_id: this.book_id,
            book_type: this.book_type
        });
    };
    //评论
    BookInfoPage.prototype.getReviws = function () {
        var _this = this;
        this.service.post('/v3/bookReview/list', {
            book_id: this.book_id,
            book_type: this.book_type,
            pageNum: 1,
            pageSize: 5
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                _this.review_list = success.data;
            }
        });
    };
    BookInfoPage.prototype.updatewifi = function () {
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
        }
        else {
            jQuery('.page-notwork').hide();
            jQuery('.has-wifi').show();
            this.Infinity_page(this.book_id, this.book_type);
        }
    };
    BookInfoPage.prototype.ionViewWillLeave = function () {
        clearTimeout(navigator.book_tiger);
    };
    BookInfoPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.service.statusBar.styleDefault();
        //声明阅读器回调方法
        jQuery.readePageBack = function (name) {
            _this.service.statusBar.styleDefault();
            if (name == 'login') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (name == 'recharge') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__recharge_recharge__["a" /* RechargePage */]);
            }
            else if (name == 'bookshelf') {
                _this.navCtrl.popToRoot();
                _this.tab.select(0);
            }
        };
        clearTimeout(navigator.book_tiger);
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
        }
        else {
            this.service.loadingStart();
            this.service.post('/v3/book/getBookDetailInfo', {
                book_id: this.book_id,
                book_type: this.book_type
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.book = success.data;
                    if (_this.book.discount_price && _this.book.discount_price > 0) {
                        _this.book.discount_price = parseInt((_this.book.discount_price * 100).toFixed(0));
                    }
                    if (_this.book.price && _this.book.price > 0) {
                        _this.book.price = parseInt((_this.book.price * 100).toFixed(0));
                    }
                    //简介计算
                    if (_this.book.book_remark) {
                        var nn = Math.round(_this.book.book_remark.length / (document.body.clientWidth - 32) * 10 + 1);
                        if (nn > 3) {
                            _this.book.showMoreAction = true;
                        }
                    }
                    if (success.data.end_time)
                        _this.leftTimer(success.data.end_time);
                    if (_this.book.shelf_id) {
                        jQuery('.ol-1').hide();
                        jQuery('.ol-2').show();
                    }
                    if (_this.book_type == 2) {
                        _this.service.post('/v2/api/mobile/book/listSuggest', {
                            org_id: 189,
                            bookCatId: _this.book.book_cat_id,
                            bookId: _this.book_id,
                            num: 12
                        }).then(function (data) {
                            if (data.code != 0) {
                                _this.service.dialogs.alert(data.message, '提示', '确定');
                            }
                            else {
                                _this.books = data.data;
                            }
                        });
                    }
                    else {
                        _this.service.post('/v3/recommend/list', {
                            book_id: _this.book_id,
                            book_type: _this.book_type,
                            limit: 12
                        }).then(function (data) {
                            if (data.code == 600) {
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                            }
                            else if (data.code != 0) {
                                _this.service.dialogs.alert(data.message, '提示', '确定');
                            }
                            else {
                                _this.books = data.data;
                            }
                        });
                    }
                }
            });
            this.service.post('/v3/bookChapter/chapterCount', {
                book_id: this.book_id,
                book_type: this.book_type
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.mulu_count = success.data;
                    _this.service.loadingEnd();
                }
            });
            this.getReviws();
        }
        //事件绑定
        jQuery('.fx-content').click(function () {
            return false;
        });
    };
    //点赞
    BookInfoPage.prototype.dianzhan = function (review) {
        var _this = this;
        this.service.post('/v3/bookReviewPraise/addReviewPraise', {
            review_id: review.review_id
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                _this.getReviws();
            }
        });
    };
    BookInfoPage.prototype.formatMsgTime = function (timespan) {
        var dateTime = new Date(Date.parse(timespan.replace(/-/g, '/')));
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        //var second = dateTime.getSeconds();
        var now = new Date();
        var milliseconds = 0;
        var timeSpanStr;
        milliseconds = now.getTime() - dateTime.getTime();
        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        }
        else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        }
        else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        }
        else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        }
        else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        }
        else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    };
    ;
    //重新更新 图书信息
    BookInfoPage.prototype.Infinity_page = function (book_id, book_type) {
        var _this = this;
        this.content.scrollToTop();
        this.book_id = book_id;
        this.book_type = book_type ? book_type : 2;
        this.service.loadingStart();
        this.service.post('/v3/book/getBookDetailInfo', {
            book_id: this.book_id,
            book_type: this.book_type
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                _this.book = success.data;
                if (_this.book.discount_price && _this.book.discount_price > 0) {
                    _this.book.discount_price = parseInt((_this.book.discount_price * 100).toFixed(0));
                }
                if (_this.book.price && _this.book.price > 0) {
                    _this.book.price = parseInt((_this.book.price * 100).toFixed(0));
                }
                //简介计算
                if (_this.book.book_remark) {
                    var nn = Math.round(_this.book.book_remark.length / (document.body.clientWidth - 32) * 10 + 1);
                    if (nn > 3) {
                        _this.book.showMoreAction = true;
                    }
                }
                if (success.data.end_time)
                    _this.leftTimer(success.data.end_time);
                if (_this.book.shelf_id) {
                    jQuery('.ol-1').hide();
                    jQuery('.ol-2').show();
                }
                else {
                    jQuery('.ol-1').show();
                    jQuery('.ol-2').hide();
                }
                if (_this.book_type == 2) {
                    _this.service.post('/v2/api/mobile/book/listSuggest', {
                        org_id: 189,
                        bookCatId: _this.book.book_cat_id,
                        bookId: _this.book_id,
                        num: 12
                    }).then(function (data) {
                        if (data.code == 600) {
                            _this.service.loadingEnd();
                            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                        }
                        else if (data.code != 0) {
                            _this.service.loadingEnd();
                            _this.service.dialogs.alert(data.message, '提示', '确定');
                        }
                        else {
                            _this.books = data.data;
                        }
                    });
                }
                else {
                    _this.service.post('/v3/recommend/list', {
                        book_id: _this.book_id,
                        book_type: _this.book_type,
                        limit: 12
                    }).then(function (data) {
                        if (data.code == 600) {
                            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                        }
                        else if (data.code != 0) {
                            _this.service.dialogs.alert(data.message, '提示', '确定');
                        }
                        else {
                            _this.books = data.data;
                        }
                    });
                }
            }
        });
        this.service.post('/v3/bookChapter/chapterCount', {
            book_id: this.book_id,
            book_type: this.book_type
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                _this.mulu_count = success.data;
                _this.service.loadingEnd();
            }
        });
        this.getReviws();
    };
    BookInfoPage.prototype.ngDoCheck = function () {
        if (this.service.updateBookInfoReviews) {
            this.service.updateBookInfoReviews = false;
            this.getReviws();
        }
    };
    BookInfoPage.prototype.leftTimer = function (time) {
        var _this = this;
        if (time) {
            var leftTime = new Date(Date.parse(time.replace(/-/g, '/'))).getTime() - (new Date()).getTime();
            var days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数 
            var hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时 
            var minutes = parseInt((leftTime / 1000 / 60 % 60).toString(), 10); //计算剩余的分钟 
            var seconds = parseInt((leftTime / 1000 % 60).toString(), 10); //计算剩余的秒数 
            days = this.checkTime(days);
            hours = this.checkTime(hours);
            minutes = this.checkTime(minutes);
            seconds = this.checkTime(seconds);
            if (days.toString() != '00') {
                this.time_text = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
            }
            else {
                this.time_text = hours + "小时" + minutes + "分" + seconds + "秒";
            }
            clearTimeout(navigator.book_tiger);
            if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
                navigator.book_tiger = setTimeout(function () {
                    _this.leftTimer(time);
                }, 1000);
            }
        }
    };
    BookInfoPage.prototype.checkTime = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
    //阅读
    BookInfoPage.prototype.selectBook = function () {
        var options = {
            ctxPath: this.service.ctxPath.toString(),
            chid: null,
            pagenum: null,
            eventkey: null,
            bookid: this.book.book_id.toString(),
            bookname: this.book.book_name.toString(),
            booktype: this.book.book_type.toString(),
            userid: this.service.LoginUserInfo.member_id.toString(),
            token: this.service.LoginUserInfo.token.toString()
        };
        navigator.BookRead.reader(options);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */])
    ], BookInfoPage.prototype, "content", void 0);
    BookInfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-bookinfo',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\bookinfo\bookinfo.html"*/'<ion-header color="light" style="border-bottom: none">\n\n  <ion-navbar color="light">\n\n    <ion-title>&nbsp;</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="clear_bg_btn" (tap)="toFenxiang($event)">\n\n        <ion-icon id="shlefEndBtn" class="ion-ios-redo" style="padding: 0 8px; font-size:1.6em"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <div class="page-notwork" (tap)="updatewifi()"></div>\n\n  <div class="has-wifi">\n\n    <div class="book-info-head" *ngIf="book">\n\n      <div class="book-mss">\n\n        <div class="m-cover" [ngClass]="{\'book-0\': book.discount_price == 0, \'book-1\': book.discount_price > 0}">\n\n          <i></i>\n\n          <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n          <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n        </div>\n\n        <div class="book-detail">\n\n          <div class="book-name">{{book.book_name}}\n\n            <em *ngIf="book.is_finish == 1" class="em-end">(已完结)</em>\n\n            <em *ngIf="book.is_finish == 2" class="em-ing">(连载中)</em>\n\n          </div>\n\n          <div class="book-classify book-cm">分类：{{book.book_cat_name}}</div>\n\n          <div class="book-author book-cm">作者：{{book.book_author}}</div>\n\n          <div class="book-publisher book-cm" *ngIf="book.book_type == 2">出版社：{{book.book_publisher}}</div>\n\n          <div class="book-publisher book-cm" *ngIf="book.book_type == 1">字数：{{book.word_size}}字</div>\n\n          <div *ngIf="book.book_type == 2">\n\n            <div class="book-price book-cm" *ngIf="book.discount_price == null">价格：{{book.price}}长江币</div>\n\n            <div class="book-price book-cm" *ngIf="book.discount_price != null">\n\n              价格：\n\n              <s>{{book.price}}长江币</s>\n\n              <em *ngIf="book.discount_price > 0">{{book.discount_price}}长江币</em>\n\n              <em *ngIf="book.discount_price == 0">免费</em>\n\n            </div>\n\n          </div>\n\n          <div *ngIf="book.book_type == 1">\n\n            <div class="book-price book-cm" *ngIf="book.discount_price == null">价格：3长江币/千字</div>\n\n            <div class="book-price book-cm" *ngIf="book.discount_price != null">\n\n              价格：\n\n              <s>3长江币/千字</s>\n\n              <em>免费</em>\n\n            </div>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="bok-center" *ngIf="book && book.end_time">\n\n        <div class="book-end-time">剩余时间：{{time_text}}</div>\n\n    </div>\n\n    <div class="book-center" *ngIf="book">\n\n      <div class="book-remark">\n\n        <div class="reamrk-tt" [ngClass]="{\'active\': activeRemark}">{{book.book_remark}}</div>\n\n        <!-- <div class="reamrk-tt active">{{book.book_remark}}</div> -->\n\n        <div class="remark-hidden" (tap)="activeRemark = !activeRemark" [hidden]="!book.showMoreAction">\n\n          <i class="iconfont icon-down" [hidden]="activeRemark"></i>\n\n          <i class="iconfont icon-top" [hidden]="!activeRemark"></i>\n\n        </div>\n\n      </div>\n\n      <div class="book-mulu" (tap)="tomulu()">\n\n        查看目录: 共 {{mulu_count}} 章\n\n        <i class="iconfont icon-right" style="font-size:14px;"></i>\n\n      </div>\n\n    </div>\n\n    <div class="book-center" *ngIf="review_list">\n\n      <div class="pl-header">书友交流</div>\n\n      <dl class="pl-item" *ngFor="let re of review_list.rows">\n\n        <dt>\n\n          <div class="u-cover">\n\n            <img *ngIf="re.icon" src="{{ service.ctxPath + re.icon}}" />\n\n          </div>\n\n        </dt>\n\n        <dd>\n\n          <div>\n\n            <label class="u-name">{{re.nick_name}}</label>\n\n            <label class="u-time">{{formatMsgTime(re.create_time)}}</label>\n\n            <span class="u-dianzan" (tap)="dianzhan(re)">\n\n              <i class="iconfont icon-dz" [ngClass]="{\'active\': re.praise_id}"></i>{{re.praise_count}}\n\n            </span>\n\n          </div>\n\n          <div class="pl-txt">{{re.review_content}}</div>\n\n        </dd>\n\n      </dl>\n\n      <div class="pl-look-all" *ngIf="review_list && review_list.pages > 1" (tap)="toBookReviewsPage()">查看全部评论</div>\n\n      <div class="un-pl-data" *ngIf="review_list && review_list.pages == 0"></div>\n\n    </div>\n\n    <div class="book-list" *ngIf="book && books">\n\n      <div class="list-title">相关推荐</div>\n\n      <div class="m-book" *ngFor="let bk of books" (tap)="Infinity_page(bk.book_id, bk.book_type)">\n\n        <div class="m-cover">\n\n          <img src="{{ service.ctxPath + bk.book_cover_small }}" *ngIf="book_type == 2" onload="imgLoad(this)" class="opacity_img" />\n\n          <img src="{{ bk.book_cover_small }}" *ngIf="book_type == 1" onload="imgLoad(this)" class="opacity_img" />\n\n        </div>\n\n        <p>{{ bk.book_name}}</p>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n<div class="footer-fx">\n\n  <div class="fx-content">\n\n    <div class="fx-title">分享到</div>\n\n    <div class="fx-items">\n\n      <div class="fx-item" (click)="fxtoweixin()">\n\n        <span class="io-weixin"></span>\n\n        <label>微信</label>\n\n      </div>\n\n      <div class="fx-item" (click)="fxtopengyouquan()">\n\n        <span class="io-pyq"></span>\n\n        <label>朋友圈</label>\n\n      </div>\n\n      <div class="fx-item" (click)="fxqq()">\n\n        <span class="io-qq"></span>\n\n        <label>QQ</label>\n\n      </div>\n\n      <div class="fx-item" (click)="fxweibo()">\n\n        <span class="io-weibo"></span>\n\n        <label>微博</label>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n\n<ion-footer [hidden]="service.getNetEork()  == \'none\'" class="footer">\n\n  <div class="ol-1">\n\n    <div class="c-btn" (tap)="toSendRie()">\n\n      <div>\n\n        <i class="iconfont icon-comments"></i>\n\n      </div>\n\n      <div>\n\n        <label>评论</label>\n\n      </div>\n\n    </div>\n\n    <button ion-button color="danger" (tap)="selectBook()">开始阅读</button>\n\n    <div class="c-btn" (tap)="toShouchang()">\n\n      <div>\n\n        <i class="iconfont icon-jiarushujia"></i>\n\n      </div>\n\n      <div>\n\n        <label>加入书架</label>\n\n      </div>\n\n    </div>\n\n  </div>\n\n  <div class="ol-2" style="display: none;">\n\n    <div class="c-btn" (tap)="toSendRie()">\n\n      <div>\n\n        <i class="iconfont icon-comments"></i>\n\n      </div>\n\n      <div>\n\n        <label>评论</label>\n\n      </div>\n\n    </div>\n\n    <button ion-button color="danger" (tap)="selectBook()">开始阅读</button>\n\n  </div>\n\n</ion-footer>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\bookinfo\bookinfo.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Tabs */]])
    ], BookInfoPage);
    return BookInfoPage;
}());

//# sourceMappingURL=bookinfo.js.map

/***/ }),

/***/ 266:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__city_city__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__find_find__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__center_center__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__city_city__["a" /* CityPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__find_find__["a" /* FindPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_4__center_center__["a" /* CenterPage */];
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('mainTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["m" /* Tabs */])
    ], TabsPage.prototype, "tabs", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\tabs\tabs.html"*/'<ion-tabs #mainTabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="书架" tabIcon="home-bar"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="书城" tabIcon="city-bar"></ion-tab>\n\n  <ion-tab [root]="tab3Root" tabTitle="发现" tabIcon="find-bar"></ion-tab>\n\n  <ion-tab [root]="tab4Root" tabTitle="我的" tabIcon="center-bar"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 267:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__qiandao_qiandao__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__search_search__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__recharge_recharge__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, barcodeScanner, service, ref, tab) {
        this.navCtrl = navCtrl;
        this.barcodeScanner = barcodeScanner;
        this.service = service;
        this.ref = ref;
        this.tab = tab;
        this.unExecHttpService = true; //是否允许再次刷新书架
        this.updateShelf = false; //是否处于编辑书架状态
        this.my_refresh = false; //自己刷新
        this.hiddenTop = false; // 是否隐藏头部
        this.myScroll_Y = 0; //滚动条初始值
        this.updateCount = -1; //更新数量
        this.unbarcodeScanner = true; //限制扫码
        var date = new Date();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? '0' + day : day;
        this.toDayTime = date.getFullYear() + '-' + month + '-' + day;
    }
    //去书城
    HomePage.prototype.tocity = function () {
        this.tab.select(1);
    };
    //前往签到
    HomePage.prototype.toqiandao = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__qiandao_qiandao__["a" /* QiandaoPage */]);
    };
    // //前往搜索
    HomePage.prototype.toSearch = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__search_search__["a" /* SearchPage */]);
    };
    //扫码加书
    HomePage.prototype.saomaAddBook = function () {
        var _this = this;
        if (!this.unbarcodeScanner)
            return false;
        this.unbarcodeScanner = false;
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.service.dialogs.alert('您正在使用扫码加书功能，请将摄像头对准图书二维码', '温馨提示', '确定').then(function () {
            _this.barcodeScanner.scan().then(function (success) {
                _this.unbarcodeScanner = true;
                if (success.text) {
                    var search = success.text.split('?')[1];
                    var searchs = search.split('&');
                    var param = {
                        org_id: null,
                        book_id: null,
                        device_id: null,
                        book_type: null
                    };
                    for (var key in searchs) {
                        if (searchs[key].indexOf('o=') != -1) {
                            param['org_id'] = searchs[key].replace('o=', '');
                        }
                        if (searchs[key].indexOf('b=') != -1) {
                            param['book_id'] = searchs[key].replace('b=', '');
                        }
                        if (searchs[key].indexOf('d=') != -1) {
                            param['device_id'] = searchs[key].replace('d=', '');
                        }
                        if (searchs[key].indexOf('t=') != -1) {
                            param['book_type'] = searchs[key].replace('t=', '');
                        }
                    }
                    if (param.org_id && param.book_id) {
                        //添加到书架
                        _this.service.post('/v2/api/bookShelf/addBook', param).then(function (success) {
                            if (success.code == 600) {
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code == 0) {
                                //重新获取书架内容
                                _this.getShlefBook();
                            }
                            else {
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                        });
                    }
                    else {
                        _this.service.dialogs.alert('你扫描的二维码有误，请确认后再试!', '提示', '确定');
                    }
                }
            }, function (error) {
                _this.service.dialogs.alert(error, '提示', '确定');
                _this.unbarcodeScanner = true;
            });
        });
    };
    //删除图书
    HomePage.prototype.deleteBook = function () {
        var _this = this;
        var ids = [];
        for (var index in this.shlefBook) {
            if (this.shlefBook[index].select) {
                ids.push(this.shlefBook[index].bk_id);
            }
        }
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        if (ids.length == 0) {
            this.service.dialogs.alert('你还未选择需要删除的图书！', '删除提示', '确定');
        }
        else {
            this.service.dialogs.confirm('你确定要删除这些图书吗?', '删除提示', ['确定', '取消']).then(function (index) {
                if (index == 1) {
                    _this.service.loadingStart();
                    if (cordova) {
                        _this.service.post('/v2/api/bookShelf/delBook', { book_id: ids.toString() }).then(function (success) {
                            if (success.code == 0) {
                                var array = [];
                                for (var iii = 0; iii < _this.shlefBook.length; iii++) {
                                    var book = _this.shlefBook[iii];
                                    if (book.select) {
                                        _this.service.ngFile.removeFile(_this.service.savePath + 'files/cover/', book.coverName);
                                        _this.service.ngFile.removeRecursively(_this.service.savePath + 'files/book/', book.epubName);
                                    }
                                    else {
                                        array.push(book);
                                    }
                                }
                                _this.shlefBook = array;
                                //重新存储
                                localStorage.setItem('shlefBook', JSON.stringify(_this.shlefBook));
                                //全局更新
                                _this.ref.detectChanges();
                                _this.service.loadingEnd();
                                if (array.length == 0) {
                                    _this.clearBookSelect();
                                    jQuery('.add-find-book').show();
                                }
                                else {
                                    jQuery('.add-find-book').hide();
                                }
                            }
                            else {
                                _this.service.loadingEnd();
                                _this.service.dialogs.alert(success.message);
                            }
                        });
                    }
                }
            });
        }
    };
    //选中图书
    HomePage.prototype.selectBook = function (book) {
        if (this.updateShelf) {
            book.select = !book.select;
            this.ref.detectChanges();
        }
        else {
            var options = {
                ctxPath: this.service.ctxPath.toString(),
                chid: null,
                pagenum: null,
                eventkey: null,
                bookid: book.bk_id.toString(),
                bookname: book.bk_name.toString(),
                booktype: book.book_type.toString(),
                userid: this.service.LoginUserInfo.member_id.toString(),
                token: this.service.LoginUserInfo.token.toString()
            };
            navigator.BookRead.reader(options);
        }
    };
    //全选
    HomePage.prototype.bookSelectAll = function () {
        for (var index in this.shlefBook) {
            this.shlefBook[index].select = true;
        }
        this.ref.detectChanges();
    };
    //取消
    HomePage.prototype.clearBookSelect = function () {
        var _this = this;
        var bar = document.querySelector(".tabbar");
        bar.style.display = "";
        this.updateShelf = false;
        this.header_blank.css('opacity', 0);
        this.home_header.css('background', "rgba(255,255,255,0)");
        this.service.statusBar.styleBlackTranslucent();
        setTimeout(function () {
            _this.myScroll.refresh();
        }, 500);
    };
    //长按
    HomePage.prototype.holdBook = function ($event) {
        var _this = this;
        if (!this.updateShelf) {
            var event_1 = $event || window.event;
            if (event_1 && event_1.stopPropagation)
                event_1.stopPropagation();
            if (event_1 && event_1.preventDefault)
                event_1.preventDefault();
            for (var index in this.shlefBook) {
                this.shlefBook[index].select = false;
            }
            this.ref.detectChanges();
            this.updateShelf = true;
            this.myScroll.scrollTo(0, 0, 0);
            var bar = document.querySelector(".tabbar");
            bar.style.display = "none";
            this.header_blank.css('opacity', 1);
            this.home_header.css('background', "rgba(255,255,255,1)");
            this.service.statusBar.styleDefault();
            setTimeout(function () {
                _this.myScroll.refresh();
            }, 600);
        }
    };
    //图书详情
    HomePage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    //Dom加载完成
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.pageHome_bg = document.querySelector('page-home');
        this.topHeight = jQuery('.book-top').height() + 6;
        this.header_blank = jQuery('.plan-nav-2');
        this.home_header = jQuery('#home_title');
        this.myScroll = new IScroll('#wrapper', {
            scrollbars: false,
            mouseWheel: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            scrollY: true,
            probeType: 3,
            bindToWrapper: true,
            click: true,
            deceleration: 0.0012,
            taps: true
        });
        //滚动中监控
        this.myScroll.on('scroll', function () {
            //是否在书架编辑过程中
            if (_this.updateShelf) {
                return false;
            }
            if (_this.myScroll.y < 0) {
                var n = (Number)(Math.abs((_this.myScroll.y > 0 ? 0 : _this.myScroll.y) / _this.topHeight).toFixed(2));
                _this.header_blank.css('opacity', n);
                _this.home_header.css('background', "rgba(255,255,255," + n + ")");
                if (cordova) {
                    if (n > 0.5) {
                        _this.service.statusBar.styleDefault();
                    }
                    else {
                        _this.service.statusBar.styleBlackTranslucent();
                    }
                }
                if (n > 0.5) {
                    _this.home_header.css('box-shadow', '0 0 1px #ccc');
                }
                else {
                    _this.home_header.css('box-shadow', 'none');
                }
            }
            else {
                _this.header_blank.css('opacity', 0);
                _this.home_header.css('box-shadow', 'none');
                _this.home_header.css('background', "rgba(255,255,255,0)");
                if (cordova)
                    _this.service.statusBar.styleBlackTranslucent();
            }
            //放大背景
            if (_this.myScroll.y > 0) {
                _this.pageHome_bg.style.backgroundSize = (100 + _this.myScroll.y / 2.5) + '%';
            }
            else {
                _this.pageHome_bg.style.backgroundSize = '100%';
            }
        });
        this.myScroll.on('scrollStart', function () {
            if (_this.updateShelf) {
                return false;
            }
            _this.myScroll_Y = _this.myScroll.y;
        });
        this.myScroll.on('scrollEnd', function () {
            if (_this.updateShelf || _this.my_refresh) {
                return false;
            }
            if (_this.myScroll_Y > _this.myScroll.y) {
                if (_this.myScroll.y + _this.topHeight > 0) {
                    _this.my_refresh = true;
                    setTimeout(function () {
                        _this.my_refresh = false;
                    }, 500);
                    _this.myScroll.scrollTo(0, -_this.topHeight, 200);
                    _this.hiddenTop = true;
                }
            }
            else if (_this.myScroll.y != 0 && _this.myScroll.y != _this.topHeight) {
                if (_this.myScroll.y + _this.topHeight > 0) {
                    _this.my_refresh = true;
                    setTimeout(function () {
                        _this.my_refresh = false;
                    }, 500);
                    _this.myScroll.scrollTo(0, 0, 200);
                }
            }
        });
        //等待刷新
        setTimeout(function () {
            jQuery('.book_shlef_list').css({
                minHeight: jQuery('#scroller').parent().height() + 5
            });
            _this.myScroll.refresh();
        }, 1000);
    };
    //修改热门推荐
    HomePage.prototype.getHotBook = function () {
        var _this = this;
        //推荐
        var data = JSON.parse(localStorage.getItem('hotBook'));
        //判断是否需要更新
        if (this.service.getNetEork() == 'none') {
            this.hotBook = data.rows;
            return false;
        }
        this.service.post('/v3/api/recommendBooks/getList', { recommend_code: '10001', pageNum: 1, pageSize: 4 }).then(function (success) {
            if (success.code == 600) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
            }
            else if (success.code == 0) {
                _this.hotBook = success.data.rows;
                //保留缓存
                var hdata = {
                    time: _this.toDayTime,
                    rows: _this.hotBook
                };
                localStorage.setItem('hotBook', JSON.stringify(hdata));
                //手动推送
                _this.ref.detectChanges();
            }
            else {
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
        }, function (error) {
            console.log(error);
            if (data && data.rows)
                _this.hotBook = data.rows;
        });
    };
    //获取书架内容
    HomePage.prototype.getShlefBook = function () {
        var _this = this;
        //关闭重复更新
        if (!this.unExecHttpService) {
            return false;
        }
        this.unExecHttpService = false;
        //默认回到顶部
        if (this.myScroll) {
            this.myScroll.scrollTo(0, 0, 200);
        }
        if (this.service.getNetEork() == 'none') {
            this.unExecHttpService = true;
            return false;
        }
        //重置运算基数
        this.updateCount = -1;
        this.service.post('/v3/api/bookShelf/getList').then(function (success) {
            if (success.code == 0) {
                if (!_this.shlefBook)
                    _this.shlefBook = [];
                if (success.data.length == 0) {
                    _this.shlefBook = [];
                    localStorage.setItem('shlefBook', '[]');
                    jQuery('.add-find-book').show();
                }
                else {
                    jQuery('.add-find-book').hide();
                }
                //循环处理每一条
                for (var i = 0; i < success.data.length; i++) {
                    _this.updateBookData(success.data[i]);
                }
                _this.updateCount = 0;
                //手动调用变化
                _this.ref.detectChanges();
                //更新书架内容状态
                _this.downBookData();
            }
            else {
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            _this.unExecHttpService = true;
        });
    };
    //下载图书本地资源
    HomePage.prototype.downBookData = function () {
        for (var i = 0; i < this.shlefBook.length; i++) {
            var book = this.shlefBook[i];
            if (!book.native_cover || book.native_cover == '') {
                if (this.service.platformName == 'weixin' || this.service.platformName == 'ios') {
                    book.native_cover = book.bk_cover.indexOf('http://') == -1 ? this.service.ctxPath + book.bk_cover : book.bk_cover;
                    book.progrees = 100;
                    book.unBook = true;
                    this.updateCount += 1;
                }
                else {
                    this.downBookCover(book);
                }
            }
            else {
                this.updateCount += 1;
            }
        }
    };
    //下载图书的封面
    HomePage.prototype.downBookCover = function (book) {
        var _this = this;
        var cover = book.bk_cover.split('/');
        book.coverName = cover[cover.length - 1];
        this.service.ngFile.checkFile(this.service.savePath + 'files/cover/', book.coverName).then(function (success) {
            book.native_cover = _this.service.savePath + '/files/cover/' + book.coverName;
            book.progrees = 100;
            book.unBook = true;
            _this.updateCount += 1;
            //this.downBookEpub(book);
        }, function (error) {
            var url = book.book_type == 1 ? book.bk_cover : _this.service.ctxPath + book.bk_cover;
            var targetPath = _this.service.savePath + 'files/cover/' + book.coverName;
            _this.service.fileTransfer.download(url, targetPath).then(function (success) {
                book.native_cover = _this.service.savePath + '/files/cover/' + book.coverName;
                book.progrees = 100;
                book.unBook = true;
                _this.updateCount += 1;
                //this.downBookEpub(book);
            }, function (error) {
                _this.updateCount += 1;
                console.log('book cover down error');
            });
        });
    };
    //更新图书
    HomePage.prototype.updateBookData = function (book) {
        var nb = true;
        for (var i = 0; i < this.shlefBook.length; i++) {
            if (this.shlefBook[i].bk_id == book.bk_id && this.shlefBook[i].book_type == book.book_type) {
                return nb = false;
            }
        }
        //结束之后再执行  
        if (nb) {
            book.progrees = 0;
            book.unBook = false;
            this.shlefBook.unshift(book);
        }
    };
    //监控
    HomePage.prototype.ngDoCheck = function () {
        var _this = this;
        //判断是否需要重置 书架
        if (this.service.unRefreshBookshelf) {
            this.service.unRefreshBookshelf = false;
            if (this.service.LoginUserInfo) {
                //是否获取书架推荐
                if (!this.hotBook)
                    this.getHotBook();
                if (!this.shlefBook) {
                    var data = JSON.parse(localStorage.getItem('shlefBook'));
                    //先取缓存，再执行刷新
                    if (data) {
                        this.shlefBook = data;
                    }
                    this.getShlefBook();
                }
                else {
                    this.getShlefBook();
                }
                this.isSingin();
            }
            else {
                //需要手动登录
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
            }
        }
        //判断是否需要重新存储图书
        if (this.shlefBook && this.updateCount >= this.shlefBook.length) {
            this.updateCount = -1;
            localStorage.setItem('shlefBook', JSON.stringify(this.shlefBook));
            console.log('存储');
            if (this.myScroll) {
                setTimeout(function () {
                    _this.myScroll.refresh();
                }, 500);
            }
            //////////////////////////////////////////////////////////////有网络才执行
            this.down_app();
        }
    };
    HomePage.prototype.down_app = function () {
        var _this = this;
        this.service.post('/v3/appVersion/getAppVersion', {
            device_type: 'android',
            app_type: 2
        }).then(function (success) {
            console.log(success);
        });
        if (this.service.getNetEork() && this.service.getNetEork() != 'none') {
            this.service.post('/v3/appVersion/getAppVersion', {
                device_type: this.service.platformName,
                app_type: 2
            }).then(function (success) {
                if (success.code == 0) {
                    if (parseInt(success.data.version_code) > _this.service.version_code) {
                        if (_this.service.platformName == 'ios') {
                            _this.service.dialogs.confirm('你有一个新的版本需要更新!<' + success.data.version_name + '>', '提示', ['确定', '稍候']).then(function (index) {
                                if (index == 1) {
                                    console.log(success.data.package_url);
                                    cordova.InAppBrowser.open(success.data.package_url, '_blank', 'location=no');
                                }
                            });
                        }
                        else {
                            var load_1 = _this.service.loadingCtrl.create({
                                spinner: 'hide',
                                cssClass: 'app-down-loading',
                                content: "<div class=\"jd-con\">\n                  <h1>\u53D1\u73B0\u65B0\u7248\u672Cv" + success.data.version_name + "</h1>\n                  <div class=\"jd-remark\">" + success.data.remark + "</div>\n                  <div class=\"jd\">\n                    <i></i>\n                    <span>0%</span>\n                  </div>\n                 </div>"
                            });
                            load_1.present();
                            var url = success.data.publish_url;
                            var targetPath_1 = _this.service.savePath + '/files/android.apk';
                            _this.service.fileTransfer.download(url, targetPath_1, true).then(function (success) {
                                load_1.dismiss();
                                cordova.plugins.fileOpener2.open(targetPath_1, 'application/vnd.android.package-archive').then(function (sss) {
                                    console.log('open app apk');
                                }, function (eee) {
                                    _this.service.dialogs.alert(eee, '打开失败', '确定');
                                });
                            }, function (error) {
                                _this.service.dialogs.alert(error, '下载失败', '确定');
                            });
                            _this.service.fileTransfer.onProgress(function (e) {
                                var num = Math.floor(e.loaded / e.total * 100);
                                if (num < 100) {
                                    jQuery('.jd-con .jd i').width(num + '%');
                                    jQuery('.jd-con .jd span').html(num + '%');
                                }
                            });
                        }
                    }
                }
            });
        }
    };
    HomePage.prototype.isSingin = function () {
        var _this = this;
        //验证今天是否已经签到
        this.service.post('/v3/api/memberSign/signIn', {
            date: this.toDayTime,
            action: 'is_sign'
        }).then(function (res) {
            _this.show_sing_in = res.code;
        });
    };
    //将要进入页面
    HomePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        //声明阅读器回调方法
        jQuery.readePageBack = function (name) {
            if (name == 'login') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
            }
            else if (name == 'recharge') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__recharge_recharge__["a" /* RechargePage */]);
            }
            else if (cordova) {
                if (_this.myScroll && _this.myScroll.y < -_this.topHeight) {
                    _this.service.statusBar.styleDefault();
                }
                else {
                    _this.service.statusBar.styleBlackTranslucent();
                }
            }
        };
        if (this.myScroll) {
            setTimeout(function () {
                _this.myScroll.refresh();
            }, 500);
        }
        if (cordova) {
            if (this.myScroll && this.myScroll.y < -this.topHeight) {
                this.service.statusBar.styleDefault();
            }
            else {
                this.service.statusBar.styleBlackTranslucent();
            }
        }
        if (this.service.LoginUserInfo)
            this.isSingin();
    };
    //将要离开页面
    HomePage.prototype.ionViewWillLeave = function () {
        if (cordova)
            this.service.statusBar.styleDefault();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */])
    ], HomePage.prototype, "content", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\home\home.html"*/'<ion-header color="transparent" id="home_title">\n\n    <ion-navbar color="transparent">\n\n        <div class="my-set-navbar">\n\n            <div class="plan-nav-1">\n\n                <button ion-button icon-only [hidden]="updateShelf" style="float:left" (tap)="saomaAddBook($event)">\n\n                    <ion-icon id="shlefStartBtn" class="iconfont icon-saoma1" style="padding:0 8px; font-size:1.6em"></ion-icon>\n\n                </button>\n\n                <button ion-button icon-only [hidden]="updateShelf" style="float:right" (tap)="toSearch($event)">\n\n                    <ion-icon id="shlefEndBtn" class="iconfont icon-search" style="padding: 0 8px; font-size:1.6em"></ion-icon>\n\n                </button>\n\n                <h1>我的书架</h1>\n\n            </div>\n\n            <div class="plan-nav-2" style="opacity:0;">\n\n                <button ion-button icon-only [hidden]="updateShelf" style="float:left" (tap)="saomaAddBook($event)">\n\n                    <ion-icon id="shlefStartBtn" class="iconfont icon-saoma1" style="padding:0 8px; font-size:1.6em"></ion-icon>\n\n                </button>\n\n                <button ion-button icon-only [hidden]="updateShelf" style="float:right" (tap)="toSearch($event)">\n\n                    <ion-icon id="shlefEndBtn" class="iconfont icon-search" style="padding: 0 8px; font-size:1.6em"></ion-icon>\n\n                </button>\n\n                <h1>我的书架</h1>\n\n\n\n                <button ion-button icon-only [hidden]="!updateShelf" style="float:left" (tap)="bookSelectAll($event)">\n\n                    <span style="padding: 0 16px">全选</span>\n\n                </button>\n\n                <button ion-button icon-only [hidden]="!updateShelf" style="float:right" (tap)="clearBookSelect($event)">\n\n                    <span style="padding: 0 16px">取消</span>\n\n                </button>\n\n            </div>\n\n        </div>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content [ngClass]="{\'hasBackground\': updateShelf}">\n\n    <div class="page-content-all">\n\n        <div id="wrapper" class="my-wrapper">\n\n            <div id="scroller" class="my-scroller">\n\n                <!--推荐-->\n\n                <div class="book-top" [hidden]="updateShelf">\n\n                    <div class="book-item-list">\n\n                        <div class="book_cover" *ngFor="let book of hotBook;let i=index" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n                            <div class="m_cover">\n\n                                <s class="today-hot-{{i}}"></s>\n\n                                <img src="{{book.book_cover}}" *ngIf="book.book_type == 1" onload="imgLoad(this)"/>\n\n                                <img src="{{service.ctxPath + book.book_cover}}" *ngIf="book.book_type == 2" onload="imgLoad(this)"/>\n\n                            </div>\n\n                        </div>\n\n                    </div>\n\n                </div>\n\n                <!--我的图书-->\n\n                <div class="book_shlef_list">\n\n                    <div class="book-item-list" [hidden]="!shlefBook || shlefBook.length == 0">\n\n                        <div class="book_cover" *ngFor="let book of shlefBook;" (press)="holdBook($event)">\n\n                            <div class="m_cover" (tap)="selectBook(book)">\n\n                                <img *ngIf="book.native_cover" onload="imgLoad(this)" src="{{book.native_cover}}" />\n\n                                <!-- <img *ngIf="service.platformName == \'ios\' && book.book_type == 1" onload="imgLoad(this)" src="{{book.bk_cover}}"> -->\n\n                                <!-- <img *ngIf="service.platformName == \'ios\' && book.book_type == 2" onload="imgLoad(this)" src="{{service.ctxPath + book.bk_cover}}"> -->\n\n                                <i class="select-icon" [ngClass]="{\'active\':book.select}" [hidden]="!updateShelf"></i>\n\n                                <div *ngIf="book.progrees < 100 || book.unBook != true" class="book-load-progrees">\n\n                                    <ion-spinner name="ios-small"></ion-spinner>\n\n                                    <!-- <p style="margin:0;padding:0;font-size:10px;">下载中</p> -->\n\n                                    <!-- <p style="margin:0;padding:0;font-size:10px;" [hidden]="book.unBook !=\'un-error\' ">下载失败</p> -->\n\n                                </div>\n\n                            </div>\n\n                        </div>\n\n                        <div class="book_cover add_book_action" [hidden]="updateShelf">\n\n                            <div class="m_cover" (tap)="saomaAddBook()">\n\n                                <i class="iconfont icon-jia"></i>\n\n                            </div>\n\n                        </div>\n\n                    </div>\n\n                    <div class="add-find-book" style="display:none;">\n\n                        <div>重拾阅读习惯， 让生活更优雅</div>\n\n                        <div><button ion-button color="danger" [outline]="true" [round]="true" (tap)="tocity()">去找书</button></div>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n</ion-content>\n\n<div class="update-footer" id="update-footer" [hidden]="!updateShelf">\n\n    <button ion-button class="button button-full" color="danger" (tap)="deleteBook()">删除</button>\n\n</div>\n\n<div id="today-qiandao" [hidden]="updateShelf" *ngIf="show_sing_in == 0" (tap)="toqiandao()">签</div>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Tabs */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QiandaoRemarkPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QiandaoRemarkPage = /** @class */ (function () {
    function QiandaoRemarkPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
    }
    QiandaoRemarkPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    QiandaoRemarkPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-qiandaoremark',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\qiandaoremark\qiandaoremark.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      签到说明\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <p>1、抽奖：每日签到可获得一次抽奖机会，获得一定长江币。</p>\n\n  <p>1、补签：用户每次充值（不定金额）均可获得一次补签机会，次数不限，当日充值仅限当日补签。</p>\n\n  <p>1、送书：用户签满一月可获得由长江中文网提供的精品出版书一本。</p>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\qiandaoremark\qiandaoremark.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], QiandaoRemarkPage);
    return QiandaoRemarkPage;
}());

//# sourceMappingURL=qiandaoremark.js.map

/***/ }),

/***/ 269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.phoneCode = 0;
        this.reg_param = {
            account: null,
            code: null,
            pwd: null,
            type: null
        };
    }
    RegisterPage.prototype.backHome = function () {
        this.navCtrl.pop();
    };
    RegisterPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    //获取验证码
    RegisterPage.prototype.getCode = function () {
        var _this = this;
        if (this.phoneCode == 0) {
            if (!this.reg_param.account) {
                this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
                return false;
            }
            if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changePhone';
            }
            else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changeEmail';
            }
            else {
                this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
                return false;
            }
            this.phoneCode = 60;
            this.upCodeNum();
            this.service.post('/v2/api/mobile/validCode/sendValidCode', {
                account: this.reg_param.account,
                type: this.reg_param.type
            }).then(function (success) {
                console.log(success);
            }, function (error) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }
    };
    //更新数字
    RegisterPage.prototype.upCodeNum = function () {
        var _this = this;
        if (this.phoneCode > 0) {
            this.phoneCode -= 1;
            setTimeout(function () {
                _this.upCodeNum();
            }, 1000);
        }
        else {
            this.phoneCode = 0;
        }
    };
    //注册用户
    RegisterPage.prototype.subUserForm = function () {
        if (!this.reg_param.account) {
            this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
            return false;
        }
        if (!this.reg_param.code) {
            this.service.dialogs.alert('请输入验证码', '提示', '确定');
            return false;
        }
        if (!this.reg_param.pwd) {
            this.service.dialogs.alert('请输入密码', '提示', '确定');
            return false;
        }
        if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changePhone';
            this.viladate_code();
        }
        else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changeEmail';
            this.viladate_code();
        }
        else {
            this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
        }
    };
    RegisterPage.prototype.viladate_code = function () {
        var _this = this;
        this.service.post('/v2/api/mobile/validCode/matchValidCode', this.reg_param).then(function (success) {
            if (success.code == 0) {
                _this.service.post('/v2/api/mobile/registe', _this.reg_param).then(function (success) {
                    if (success.code == 0) {
                        _this.service.dialogs.alert('恭喜你注册成功!', '提示', '确定').then(function () {
                            _this.backHome();
                        });
                    }
                    else {
                        _this.service.dialogs.alert(success.message, '注册失败', '确定');
                    }
                }, function (error) {
                    _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
                });
            }
            else {
                _this.service.dialogs.alert('验证码不正确，请重新获取', '提示', '确定');
            }
        }, function (error) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\register\register.html"*/'<ion-content>\n\n    <div class="login-back">\n\n      <button ion-button (tap)="backHome()"\n\n      style="margin:0;padding:0;height:auto;font-size:30px;background-color:transparent;">\n\n        <ion-icon class="ion-ios-iconfont-icon-rt"></ion-icon></button>\n\n    </div>\n\n    <div class="header-logo"></div>\n\n    <div class="form-con">\n\n      <div class="form-row">\n\n        <i class="iconfont icon-touxiang-copy"></i>\n\n        <input type="text" placeholder="请输入手机/邮箱" [(ngModel)]="reg_param.account"/>\n\n      </div>\n\n      <div class="form-row">\n\n          <i class="iconfont icon-yanzhengma"></i>\n\n          <input type="tel" placeholder="请输入验证码" [(ngModel)]="reg_param.code"/>\n\n          <label class="get-code-m" (tap)="getCode()" [hidden]="phoneCode > 0">获取验证码</label>\n\n          <label class="get-code-m" [hidden]="phoneCode == 0">重新获取{{phoneCode}}秒后</label>\n\n        </div>\n\n      <div class="form-row">\n\n        <i class="iconfont icon-mima"></i>\n\n        <input type="password" placeholder="请输入密码" [(ngModel)]="reg_param.pwd"/>\n\n      </div>\n\n      <div class="link-row"></div>\n\n      <button ion-button full color="danger" (tap)="subUserForm()">注册</button>\n\n    </div>\n\n  </ion-content>\n\n  '/*ion-inline-end:"D:\Java_home\ionic317\src\pages\register\register.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResetpwdPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ResetpwdPage = /** @class */ (function () {
    function ResetpwdPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.phoneCode = 0;
        this.reg_param = {
            account: null,
            code: null,
            newPwd: null,
            type: null
        };
    }
    ResetpwdPage.prototype.backHome = function () {
        this.navCtrl.pop();
    };
    ResetpwdPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    //获取验证码
    ResetpwdPage.prototype.getCode = function () {
        var _this = this;
        if (this.phoneCode == 0) {
            if (!this.reg_param.account) {
                this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
                return false;
            }
            if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changePhone';
            }
            else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changeEmail';
            }
            else {
                this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
                return false;
            }
            this.phoneCode = 60;
            this.upCodeNum();
            this.service.post('/v2/api/mobile/validCode/sendValidCode', {
                account: this.reg_param.account,
                type: this.reg_param.type
            }).then(function (success) {
                console.log(success);
            }, function (error) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }
    };
    //更新数字
    ResetpwdPage.prototype.upCodeNum = function () {
        var _this = this;
        if (this.phoneCode > 0) {
            this.phoneCode -= 1;
            setTimeout(function () {
                _this.upCodeNum();
            }, 1000);
        }
        else {
            this.phoneCode = 0;
        }
    };
    //注册用户
    ResetpwdPage.prototype.subUserForm = function () {
        if (!this.reg_param.account) {
            this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
            return false;
        }
        if (!this.reg_param.code) {
            this.service.dialogs.alert('请输入验证码', '提示', '确定');
            return false;
        }
        if (!this.reg_param.newPwd) {
            this.service.dialogs.alert('请输入密码', '提示', '确定');
            return false;
        }
        if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changePhone';
            this.viladate_code();
        }
        else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changeEmail';
            this.viladate_code();
        }
        else {
            this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
        }
    };
    ResetpwdPage.prototype.viladate_code = function () {
        var _this = this;
        this.service.post('/v2/api/mobile/validCode/matchValidCode', this.reg_param).then(function (success) {
            if (success.code == 0) {
                _this.service.post('/v2/api/mobile/forgetPwd', _this.reg_param).then(function (success) {
                    if (success.code == 0) {
                        _this.service.dialogs.alert('密码已重新修改，请牢记并妥善保管!', '提示', '确定').then(function () {
                            _this.backHome();
                        });
                    }
                    else {
                        _this.service.dialogs.alert(success.message, '修改失败', '确定');
                    }
                });
            }
            else {
                _this.service.dialogs.alert('验证码不正确，请重新获取', '提示', '确定');
            }
        }, function (error) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    ResetpwdPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-resetpwd',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\resetpwd\resetpwd.html"*/'<ion-content>\n\n    <div class="login-back">\n\n      <button ion-button (tap)="backHome()"\n\n      style="margin:0;padding:0;height:auto;font-size:30px;background-color:transparent;">\n\n        <ion-icon class="ion-ios-iconfont-icon-rt"></ion-icon></button>\n\n    </div>\n\n    <div class="header-logo"></div>\n\n    <div class="form-con">\n\n      <div class="form-row">\n\n        <i class="iconfont icon-touxiang-copy"></i>\n\n        <input type="text" placeholder="请输入手机/邮箱" [(ngModel)]="reg_param.account"/>\n\n      </div>\n\n      <div class="form-row">\n\n          <i class="iconfont icon-yanzhengma"></i>\n\n          <input type="tel" placeholder="请输入验证码" [(ngModel)]="reg_param.code"/>\n\n          <label class="get-code-m" (tap)="getCode()" [hidden]="phoneCode > 0">获取验证码</label>\n\n          <label class="get-code-m" [hidden]="phoneCode == 0">重新获取{{phoneCode}}秒后</label>\n\n        </div>\n\n      <div class="form-row">\n\n        <i class="iconfont icon-mima"></i>\n\n        <input type="password" placeholder="请设置新密码" [(ngModel)]="reg_param.newPwd"/>\n\n      </div>\n\n      <div class="link-row"></div>\n\n      <button ion-button full color="danger" (tap)="subUserForm()">修改密码</button>\n\n    </div>\n\n  </ion-content>\n\n  '/*ion-inline-end:"D:\Java_home\ionic317\src\pages\resetpwd\resetpwd.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], ResetpwdPage);
    return ResetpwdPage;
}());

//# sourceMappingURL=resetpwd.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MuluPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__recharge_recharge__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MuluPage = /** @class */ (function () {
    function MuluPage(navCtrl, params, service, tab) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.tab = tab;
        this.book_id = params.get('book_id');
        this.book_type = params.get('book_type');
    }
    MuluPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //阅读
    MuluPage.prototype.selectBook = function (ch) {
        var options = {
            ctxPath: this.service.ctxPath.toString(),
            chid: (ch.id ? ch.id : ch.ch_id).toString(),
            pagenum: null,
            eventkey: null,
            bookid: this.book.book_id.toString(),
            bookname: this.book.book_name.toString(),
            booktype: this.book.book_type.toString(),
            userid: this.service.LoginUserInfo.member_id.toString(),
            token: this.service.LoginUserInfo.token.toString()
        };
        navigator.BookRead.reader(options);
    };
    MuluPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        //声明阅读器回调方法
        jQuery.readePageBack = function (name) {
            _this.service.statusBar.styleDefault();
            if (name == 'login') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }
            else if (name == 'recharge') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__recharge_recharge__["a" /* RechargePage */]);
            }
            else if (name == 'bookshelf') {
                _this.navCtrl.popToRoot();
                _this.tab.select(0);
            }
        };
        if (this.book_type && this.book_id) {
            this.service.loadingStart();
            if (this.book_type == 2) {
                this.service.post('/v3/api/book/chapterTree', {
                    book_id: this.book_id
                }).then(function (success) {
                    if (success.code == 600) {
                        _this.service.loadingEnd();
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                    }
                    else if (success.code != 0) {
                        _this.service.loadingEnd();
                        _this.service.dialogs.alert(success.message, '提示', '确定');
                    }
                    else {
                        _this.book_mulu = success.data.chapters;
                        _this.book = success.data.info;
                        _this.book.book_type = 2;
                        _this.service.loadingEnd();
                    }
                });
            }
            else {
                this.service.post('/v3/bookChapter/list', {
                    book_id: this.book_id
                }).then(function (success) {
                    if (success.code == 600) {
                        _this.service.loadingEnd();
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                    }
                    else if (success.code != 0) {
                        _this.service.loadingEnd();
                        _this.service.dialogs.alert(success.message, '提示', '确定');
                    }
                    else {
                        _this.book_mulu = success.data.chapters.chapters;
                        _this.book = success.data.info;
                        _this.book.book_type = 1;
                        _this.service.loadingEnd();
                    }
                });
            }
        }
    };
    MuluPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mulu',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\mulu\mulu.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      目录\n\n    </ion-title>\n\n    <!-- <ion-buttons end>\n\n      <button ion-button>倒序</button>\n\n    </ion-buttons> -->\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ul *ngIf="book_type == 2">\n\n    <li *ngFor="let mulu1 of book_mulu">\n\n      <a (tap)="selectBook(mulu1)">\n\n        <span>{{mulu1.name}}</span>\n\n        <label *ngIf="mulu1.is_free">免费</label>\n\n        <!-- <label *ngIf="!mulu1.is_free">VIP</label> -->\n\n      </a>\n\n      <dl>\n\n        <dd *ngFor="let mulu2 of mulu1.child">\n\n          <a (tap)="selectBook(mulu2)">\n\n            <span>{{mulu2.name}}</span>\n\n            <label *ngIf="mulu2.is_free">免费</label>\n\n            <!-- <label *ngIf="!mulu2.is_free">VIP</label> -->\n\n          </a>\n\n        </dd>\n\n      </dl>\n\n    </li>\n\n  </ul>\n\n  <ul *ngIf="book_type == 1">\n\n      <li *ngFor="let mulu of book_mulu">\n\n        <a (tap)="selectBook(mulu)">\n\n          <span>{{mulu.ch_name}}</span>\n\n          <label *ngIf="mulu.ch_vip == 0">免费</label>\n\n        </a>\n\n      </li>\n\n    </ul>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\mulu\mulu.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Tabs */]])
    ], MuluPage);
    return MuluPage;
}());

//# sourceMappingURL=mulu.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookReviewsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sendreview_sendreview__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BookReviewsPage = /** @class */ (function () {
    function BookReviewsPage(navCtrl, service, params) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.param = {
            pageNum: 0,
            pages: 1,
            total: 0,
            pageSize: 20,
            book_id: null,
            book_type: null
        };
        this.reviews = [];
        this.df_checkbox = true;
        this.df_footer = true;
        this.param.book_id = params.get('book_id');
        this.param.book_type = params.get('book_type');
    }
    BookReviewsPage.prototype.getReviews = function (infiniteScroll) {
        var _this = this;
        console.log(this.param.pageNum);
        if (this.param.pageNum == 0) {
            this.service.loadingEnd();
        }
        if (this.param.pageNum < this.param.pages) {
            this.param.pageNum += 1;
        }
        this.service.post('/v3/bookReview/list', this.param).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                success.data.rows.forEach(function (element) {
                    _this.reviews.push(element);
                });
                _this.param.pages = success.data.pages;
                _this.param.total = success.data.total;
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
                _this.service.loadingEnd();
            }
        });
    };
    //去评论
    BookReviewsPage.prototype.toSendRie = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__sendreview_sendreview__["a" /* SendReviewPage */], {
            book_id: this.param.book_id,
            book_type: this.param.book_type
        });
    };
    //点赞
    BookReviewsPage.prototype.dianzhan = function (review) {
        var _this = this;
        this.service.post('/v3/bookReviewPraise/addReviewPraise', {
            review_id: review.review_id
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                if (review.praise_id) {
                    review.praise_id = null;
                    review.praise_count -= 1;
                }
                else {
                    review.praise_id = 1;
                    review.praise_count += 1;
                }
            }
        });
    };
    BookReviewsPage.prototype.doInfinite = function (infiniteScroll) {
        this.getReviews(infiniteScroll);
    };
    BookReviewsPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
        this.service.loadingStart();
        this.getReviews();
    };
    BookReviewsPage.prototype.ngDoCheck = function () {
        if (this.service.updateBookInfoReviews) {
            this.service.updateBookInfoReviews = false;
            this.param.pageNum = 0;
            this.param.pages = 1;
            this.param.total = 0;
            this.reviews = [];
            this.service.loadingStart();
            this.getReviews();
        }
    };
    BookReviewsPage.prototype.formatMsgTime = function (timespan) {
        var dateTime = new Date(Date.parse(timespan.replace(/-/g, '/')));
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        //var second = dateTime.getSeconds();
        var now = new Date();
        var milliseconds = 0;
        var timeSpanStr;
        milliseconds = now.getTime() - dateTime.getTime();
        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        }
        else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        }
        else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        }
        else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        }
        else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        }
        else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    };
    ;
    BookReviewsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-bookreviews',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\bookreviews\bookreviews.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      所有评论\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button (tap)="toSendRie()">写评论</button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div style="display:inline-block;width:100%;">\n\n    <dl class="pl-item" *ngFor="let re of reviews">\n\n      <dt>\n\n        <div class="u-cover">\n\n          <img *ngIf="re.icon" src="{{ service.ctxPath + re.icon}}" />\n\n        </div>\n\n      </dt>\n\n      <dd>\n\n        <div>\n\n          <label class="u-name">{{re.nick_name}}</label>\n\n          <label class="u-time">{{formatMsgTime(re.create_time)}}</label>\n\n          <span class="u-dianzan" (tap)="dianzhan(re)">\n\n            <i class="iconfont icon-dz" [ngClass]="{\'active\': re.praise_id}"></i>{{re.praise_count}}\n\n          </span>\n\n        </div>\n\n        <div class="pl-txt">{{re.review_content}}</div>\n\n      </dd>\n\n    </dl>\n\n  </div>\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [hidden]="param.pages == param.pageNum || reviews.length == 0">\n\n    <ion-infinite-scroll-content loadingText="请稍等, 正在加载!"></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\bookreviews\bookreviews.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], BookReviewsPage);
    return BookReviewsPage;
}());

//# sourceMappingURL=bookreviews.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CityPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_search__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classify_classify__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ycorder_ycorder__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__cborder_cborder__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__classifylist_classifylist__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__xianmian_xianmian__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__cbnewbook_cbnewbook__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__cbhotbook_cbhotbook__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__cbtjbook_cbtjbook__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__tjbook_tjbook__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__yctypebook_yctypebook__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_barcode_scanner__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var CityPage = /** @class */ (function () {
    function CityPage(navCtrl, barcodeScanner, service) {
        this.navCtrl = navCtrl;
        this.barcodeScanner = barcodeScanner;
        this.service = service;
        this.active_index = 1;
        this.wifi = true;
    }
    CityPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.mySwiper = new Swiper('#mySwiper', {
            onTransitionEnd: function (swiper) {
                var currentIndex = swiper.activeIndex;
                _this.active_index = currentIndex + 1;
                _this.tabGetdata();
            }
        });
    };
    CityPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
        this.init();
    };
    //切换频道
    CityPage.prototype.activeTo = function (n) {
        this.active_index = n;
        this.tabGetdata();
        this.mySwiper.slideTo(n - 1, 500, null);
    };
    //初始化
    CityPage.prototype.init = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.service.getNetEork() == 'none') {
                jQuery('.page-notwork').show();
                jQuery('.has-wifi').hide();
            }
            else {
                jQuery('.page-notwork').hide();
                jQuery('.has-wifi').show();
            }
        }, 600);
        this.tabGetdata();
    };
    CityPage.prototype.tabGetdata = function () {
        //20001,20002,20003,20004,20005,20006,20007,20008
        //30001,30002,30003,30004
        //40001,40002,40003,40004
        //50001,50002,50003,50004,50005,50006
        if (this.active_index == 2 && !this.g_10002) {
            this.get_m_all('30001,30002,30003,30004');
            this.get_g_10002();
            this.get_ClassList(0);
        }
        else if (this.active_index == 3 && !this.g_10003) {
            this.get_m_all('40001,40002,40003,40004');
            this.get_g_10003();
            this.get_ClassList(1);
        }
        else if (this.active_index == 4 && !this.g_10004) {
            this.get_m_all('50001,50002,50003,50004,50005,50006');
            this.get_g_10004();
        }
        else if (!this.g_10001) {
            this.get_m_all('20001,20002,20003,20004,20005,20006,20007,20008');
            this.get_g_10001();
        }
    };
    // 热推、星际、红书、最新
    CityPage.prototype.toYcTypeBookPage = function (type, name, bookChannel) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__yctypebook_yctypebook__["a" /* YcTypeBookPage */], {
            type: type,
            name: name,
            bookChannel: bookChannel
        });
    };
    //分类页
    CityPage.prototype.toClassify = function (e) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__classify_classify__["a" /* ClassifyPage */]);
    };
    //排行
    CityPage.prototype.toOrder = function (e) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__ycorder_ycorder__["a" /* YcOrderPage */], {
            bookChannel: e
        });
    };
    //出版排行
    CityPage.prototype.toOrder_cb = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__cborder_cborder__["a" /* CbOrderPage */]);
    };
    //出版新书
    CityPage.prototype.toCbNewBookPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__cbnewbook_cbnewbook__["a" /* CbNewBookPage */]);
    };
    //出版热门
    CityPage.prototype.toCbHotBookPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__cbhotbook_cbhotbook__["a" /* CbHotBookPage */]);
    };
    //分类列表
    CityPage.prototype.toClassifyList = function (id, name, bookChannel) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__classifylist_classifylist__["a" /* ClassifyListPage */], {
            id: id,
            name: name,
            bookChannel: bookChannel
        });
    };
    //限免
    CityPage.prototype.toXianmian = function (type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__xianmian_xianmian__["a" /* XianmianPage */], {
            type: type
        });
    };
    //出版特价
    CityPage.prototype.toBook_tj = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__cbtjbook_cbtjbook__["a" /* CbTjBookPage */]);
    };
    //推荐模块
    CityPage.prototype.toTjBookPage = function (obj_id, obj_name) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__tjbook_tjbook__["a" /* TjBookPage */], {
            obj_id: obj_id,
            obj_name: obj_name
        });
    };
    //获取分类
    CityPage.prototype.get_ClassList = function (type) {
        var _this = this;
        this.service.post('/v3/api/bookCat/repoList', {
            pid: null,
            channel: type
        }).then(function (success) {
            if (type == 0) {
                _this.c_nv = success.data;
            }
            if (type == 1) {
                _this.c_nan = success.data;
            }
        });
    };
    //广告-精选
    CityPage.prototype.get_g_10001 = function () {
        var _this = this;
        this.service.post('/v3/adv/getAdv', {
            adv_code: '10001'
        }).then(function (success) {
            _this.g_10001 = success.data;
        });
    };
    //女频-精选
    CityPage.prototype.get_g_10002 = function () {
        var _this = this;
        this.service.post('/v3/adv/getAdv', {
            adv_code: '10002'
        }).then(function (success) {
            _this.g_10002 = success.data;
        });
    };
    //男频-精选
    CityPage.prototype.get_g_10003 = function () {
        var _this = this;
        this.service.post('/v3/adv/getAdv', {
            adv_code: '10003'
        }).then(function (success) {
            _this.g_10003 = success.data;
        });
    };
    //出版-精选
    CityPage.prototype.get_g_10004 = function () {
        var _this = this;
        this.service.post('/v3/adv/getAdv', {
            adv_code: '10004'
        }).then(function (success) {
            _this.g_10004 = success.data;
        });
    };
    CityPage.prototype.get_m_all = function (codes) {
        var _this = this;
        //20001,20002,20003,20004,20005,20006,20007,20008
        //30001,30002,30003,30004
        //40001,40002,40003,40004
        //50001,50002,50003,50004,50005,50006
        this.service.post('/v3/api/recommendBooks/getListByCodes', {
            recommend_codes: codes
        }).then(function (success) {
            success.data.forEach(function (element) {
                if (element.code == '20001') {
                    _this.m_20001 = element.data;
                }
                else if (element.code == '20002') {
                    _this.m_20002 = element.data;
                }
                else if (element.code == '20003') {
                    _this.m_20003 = element.data;
                }
                else if (element.code == '20004') {
                    _this.m_20004 = element.data;
                }
                else if (element.code == '20005') {
                    _this.m_20005 = element.data;
                }
                else if (element.code == '20006') {
                    _this.m_20006 = element.data;
                }
                else if (element.code == '20007') {
                    _this.m_20007 = element.data;
                }
                else if (element.code == '20008') {
                    _this.m_20008 = element.data;
                }
                else if (element.code == '30001') {
                    _this.m_30001 = element.data;
                }
                else if (element.code == '30002') {
                    _this.m_30002 = element.data;
                }
                else if (element.code == '30003') {
                    _this.m_30003 = element.data;
                }
                else if (element.code == '30004') {
                    _this.m_30004 = element.data;
                }
                else if (element.code == '40001') {
                    _this.m_40001 = element.data;
                }
                else if (element.code == '40002') {
                    _this.m_40002 = element.data;
                }
                else if (element.code == '40003') {
                    _this.m_40003 = element.data;
                }
                else if (element.code == '40004') {
                    _this.m_40004 = element.data;
                }
                else if (element.code == '50001') {
                    _this.m_50001 = element.data;
                }
                else if (element.code == '50002') {
                    _this.m_50002 = element.data;
                }
                else if (element.code == '50003') {
                    _this.m_50003 = element.data;
                }
                else if (element.code == '50004') {
                    _this.m_50004 = element.data;
                }
                else if (element.code == '50005') {
                    _this.m_50005 = element.data;
                }
                else if (element.code == '50006') {
                    _this.m_50006 = element.data;
                }
            });
            setTimeout(function () {
                jQuery('#mySwiper').animate({
                    opacity: 1
                }, 'slow', function () {
                    _this.service.loadingEnd();
                });
            }, 500);
        });
    };
    //图书详情
    CityPage.prototype.toBookInfo = function (book_id, book_type) {
        if (book_id && book_type) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_14__bookinfo_bookinfo__["a" /* BookInfoPage */], {
                book_id: book_id,
                book_type: book_type
            });
        }
    };
    //前往搜索
    CityPage.prototype.toSearch = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */]);
    };
    //扫码加书
    CityPage.prototype.saomaAddBook = function () {
        var _this = this;
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.service.dialogs.alert('您正在使用扫码加书功能，请将摄像头对准图书二维码', '温馨提示', '确定').then(function () {
            _this.barcodeScanner.scan().then(function (success) {
                if (success.text) {
                    var search = success.text.split('?')[1];
                    var searchs = search.split('&');
                    var param = {
                        org_id: null,
                        book_id: null,
                        device_id: null,
                        book_type: null
                    };
                    for (var key in searchs) {
                        if (searchs[key].indexOf('o=') != -1) {
                            param['org_id'] = searchs[key].replace('o=', '');
                        }
                        if (searchs[key].indexOf('b=') != -1) {
                            param['book_id'] = searchs[key].replace('b=', '');
                        }
                        if (searchs[key].indexOf('d=') != -1) {
                            param['device_id'] = searchs[key].replace('d=', '');
                        }
                        if (searchs[key].indexOf('t=') != -1) {
                            param['book_type'] = searchs[key].replace('t=', '');
                        }
                    }
                    if (param.org_id && param.book_id) {
                        //添加到书架
                        _this.service.post('/v2/api/bookShelf/addBook', param).then(function (success) {
                            if (success.code == 600) {
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code == 0) {
                                //重新获取书架内容
                                _this.service.unRefreshBookshelf = true;
                                _this.navCtrl.parent.select(0);
                            }
                            else {
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                        });
                    }
                    else {
                        _this.service.dialogs.alert('你扫描的二维码有误，请确认后再试!');
                    }
                }
            }, function (error) {
                _this.service.dialogs.alert(error, '提示', '确定');
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], CityPage.prototype, "slides", void 0);
    CityPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-city',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\city\city.html"*/'<ion-header color="light">\n  <ion-navbar color="light">\n    <div class="my-set-navbar">\n      <div class="plan-nav-1">\n        <button ion-button icon-only style="float:left" (tap)="saomaAddBook($event)">\n          <ion-icon id="shlefStartBtn" class="iconfont icon-saoma1" style="padding:0 8px; font-size:1.6em"></ion-icon>\n        </button>\n        <button ion-button icon-only style="float:right" (tap)="toSearch($event)">\n          <ion-icon id="shlefEndBtn" class="iconfont icon-search" style="padding: 0 8px; font-size:1.6em"></ion-icon>\n        </button>\n        <div class="nav-li-par">\n          <div class="nav-li-pll" [ngClass]="\'active_\'+ active_index">\n            <ul class="header-nav-bar-lab">\n              <li (tap)="activeTo(1)">精选</li>\n              <li (tap)="activeTo(2)">女频</li>\n              <li (tap)="activeTo(3)">男频</li>\n              <li (tap)="activeTo(4)">出版</li>\n            </ul>\n            <label class="dmdd">\n              <s></s>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div class="swiper-container" id="mySwiper">\n    <div class="swiper-wrapper">\n      <div class="swiper-slide">\n        <div class="pd-col-content-all">\n          <div class="page-notwork" (tap)="init()"></div>\n          <div class="has-wifi">\n            <!--广告位-->\n            <div class="pd-col-content p-gg">\n              <ion-slides loop pager autoplay="6000" *ngIf="g_10001 && g_10001.length > 1">\n                <ion-slide *ngFor="let item of g_10001" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n              <ion-slides *ngIf="g_10001 && g_10001.length == 1">\n                <ion-slide *ngFor="let item of g_10001" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n            </div>\n            <!--快捷导航-->\n            <div class="pd-col-content cm-nav-bar">\n              <div class="cm-nv-item" (tap)="toClassify($event)">\n                <img src="assets/img/mm-1.png">\n                <p>分类</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toOrder(2)">\n                <img src="assets/img/mm-2.png">\n                <p>排行</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'6\',\'都市现实\',\'1\')">\n                <img src="assets/img/mm-3.png">\n                <p>都市</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'2\',\'玄幻奇幻\',\'1\')">\n                <img src="assets/img/mm-4.png">\n                <p>玄幻</p>\n              </div>\n              <div class="cm-nv-item">\n                <img src="assets/img/mm-5.png" (tap)="toXianmian(\'1\')">\n                <p>限免</p>\n              </div>\n            </div>\n            <!--小编推荐-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">小编推荐\n                <a (tap)="toTjBookPage(\'20001\',\'小编推荐\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20001" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--模块引导-->\n            <div class="pd-col-content model-yd">\n              <div class="yd-item" (tap)="activeTo(3)">\n                <h1>男生小说</h1>\n                <ul>\n                  <li>都市</li>\n                  <li>玄幻</li>\n                  <li>仙侠</li>\n                  <li>历史</li>\n                </ul>\n                <img src="assets/img/nav-1.png" />\n              </div>\n              <div class="yd-item" (tap)="activeTo(2)">\n                <h1>女生小说</h1>\n                <ul>\n                  <li>总裁</li>\n                  <li>豪门</li>\n                  <li>穿越</li>\n                  <li>重生</li>\n                </ul>\n                <img src="assets/img/nav-2.png" />\n              </div>\n              <div class="yd-item" (tap)="activeTo(4)">\n                <h1>出版文学</h1>\n                <ul>\n                  <li>历史</li>\n                  <li>财经</li>\n                  <li>经典</li>\n                  <li>励志</li>\n                </ul>\n                <img src="assets/img/nav-3.png" />\n              </div>\n            </div>\n            <!--总裁爱上我-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">总裁爱上我\n                <a (tap)="toTjBookPage(\'20002\',\'总裁爱上我\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20002" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--王妃不好惹-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">王妃不好惹\n                <a (tap)="toTjBookPage(\'20003\',\'王妃不好惹\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20003" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--异界当女王-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">异界当女王\n                <a (tap)="toTjBookPage(\'20004\',\'异界当女王\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20004" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--兵王闯花都-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">兵王闯花都\n                <a (tap)="toTjBookPage(\'20005\',\'兵王闯花都\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20005" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--废材逆袭流-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">废材逆袭流\n                <a (tap)="toTjBookPage(\'20006\',\'废材逆袭流\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20006" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--人鬼情未了-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">人鬼情未了\n                <a (tap)="toTjBookPage(\'20007\',\'人鬼情未了\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20007" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--精彩出版推荐-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">精选出版\n                <a (tap)="toTjBookPage(\'20008\',\'精选出版\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_20008" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <div class="message-bottom">已经到底了，到别的频道逛逛吧!</div>\n          </div>\n        </div>\n      </div>\n      <div class="swiper-slide">\n        <div class="pd-col-content-all">\n          <div class="page-notwork" (tap)="init()"></div>\n          <div class="has-wifi">\n            <!--广告位-->\n            <div class="pd-col-content p-gg">\n              <ion-slides loop pager autoplay="6000" *ngIf="g_10002 && g_10002.length > 1">\n                <ion-slide *ngFor="let item of g_10002" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n              <ion-slides *ngIf="g_10002 && g_10002.length == 1">\n                <ion-slide *ngFor="let item of g_10002" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n            </div>\n            <!--快捷导航-->\n            <div class="pd-col-content cm-nav-bar">\n              <div class="cm-nv-item">\n                <img src="assets/img/mm-2.png" (tap)="toOrder(0)">\n                <p>排行</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'9\',\'古代言情\',\'0\')">\n                <img src="assets/img/mm-6.png">\n                <p>古言</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'2\',\'现代言情\',\'0\')">\n                <img src="assets/img/mm-7.png">\n                <p>现言</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'4\',\'穿越重生\',\'0\')">\n                <img src="assets/img/mm-8.png">\n                <p>穿越</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toXianmian(\'1\')">\n                <img src="assets/img/mm-5.png">\n                <p>限免</p>\n              </div>\n            </div>\n            <!--本期热推-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">本期热推\n                <a (tap)="toTjBookPage(\'30001\',\'本期热推\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_30001" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--中间分类-->\n            <div class="pd-col-content class-model">\n              <div class="class-model-l">\n                <div class="class-li" *ngFor="let cat of c_nv;let i=index" [hidden]="i > 7" (tap)="toClassifyList(cat.book_cat_id,cat.book_cat_name,0)">{{cat.book_cat_name}}</div>\n              </div>\n              <div class="class-cm-bg">\n                <img src="assets/img/class-bg.png">\n                <div class="class-cm-bg-fix">\n                  <div class="cc-fix-item fix-1" (tap)="toYcTypeBookPage(\'hot\',\'热推\',\'0\')">热推</div>\n                  <div class="cc-fix-item fix-2" (tap)="toYcTypeBookPage(\'star\',\'星级\',\'0\')">星级</div>\n                  <div class="cc-fix-item fix-3" (tap)="toYcTypeBookPage(\'redbook\',\'红书\',\'0\')">红书</div>\n                  <div class="cc-fix-item" (tap)="toYcTypeBookPage(\'new\',\'最新\',\'0\')">最新</div>\n                </div>\n              </div>\n            </div>\n            <!--美人志-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">美人志\n                <a (tap)="toTjBookPage(\'30002\',\'美人志\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_30002" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--点金作品-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">点金作品\n                <a (tap)="toTjBookPage(\'30003\',\'点金作品\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_30003" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--编辑力荐-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">编辑力荐\n                <a (tap)="toTjBookPage(\'30004\',\'编辑力荐\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_30004" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <div class="message-bottom">已经到底了，到别的频道逛逛吧!</div>\n          </div>\n        </div>\n      </div>\n      <div class="swiper-slide">\n        <div class="pd-col-content-all">\n          <div class="page-notwork" (tap)="init()"></div>\n          <div class="has-wifi">\n            <!--广告位-->\n            <div class="pd-col-content p-gg">\n              <ion-slides loop pager autoplay="6000" *ngIf="g_10003 && g_10003.length > 1">\n                <ion-slide *ngFor="let item of g_10003" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n              <ion-slides *ngIf="g_10003 && g_10003.length == 1">\n                <ion-slide *ngFor="let item of g_10003" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n            </div>\n            <!--快捷导航-->\n            <div class="pd-col-content cm-nav-bar">\n              <div class="cm-nv-item" (tap)="toOrder(1)">\n                <img src="assets/img/mm-2.png">\n                <p>排行</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'6\',\'都市现实\',\'1\')">\n                <img src="assets/img/mm-3.png">\n                <p>都市</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'2\',\'玄幻奇幻\',\'1\')">\n                <img src="assets/img/mm-4.png">\n                <p>玄幻</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toClassifyList(\'1\',\'仙侠武侠\',\'1\')">\n                <img src="assets/img/mm-9.png">\n                <p>仙侠</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toXianmian(\'2\')">\n                <img src="assets/img/mm-5.png">\n                <p>限免</p>\n              </div>\n            </div>\n            <!--本期热推-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">本期热推\n                <a (tap)="toTjBookPage(\'40001\',\'本期热推\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_40001" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--中间分类-->\n            <div class="pd-col-content class-model">\n              <div class="class-model-l">\n                <div class="class-li" *ngFor="let cat of c_nan;let i=index" [hidden]="i > 7" (tap)="toClassifyList(cat.book_cat_id,cat.book_cat_name,1)">{{cat.book_cat_name}}</div>\n              </div>\n              <div class="class-cm-bg">\n                <img src="assets/img/class-bg.png">\n                <div class="class-cm-bg-fix">\n                  <div class="cc-fix-item fix-1" (tap)="toYcTypeBookPage(\'hot\',\'热推\',\'1\')">热推</div>\n                  <div class="cc-fix-item fix-2" (tap)="toYcTypeBookPage(\'star\',\'星级\',\'1\')">星级</div>\n                  <div class="cc-fix-item fix-3" (tap)="toYcTypeBookPage(\'redbook\',\'红书\',\'1\')">红书</div>\n                  <div class="cc-fix-item" (tap)="toYcTypeBookPage(\'new\',\'最新\',\'1\')">最新</div>\n                </div>\n              </div>\n            </div>\n            <!--烽火台-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">烽火台\n                <a (tap)="toTjBookPage(\'40002\',\'烽火台\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_40002" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--点金作品-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">点金作品\n                <a (tap)="toTjBookPage(\'40003\',\'点金作品\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_40003" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--编辑力荐-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">编辑力荐\n                <a (tap)="toTjBookPage(\'40004\',\'编辑力荐\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_40004" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <div class="message-bottom">已经到底了，到别的频道逛逛吧!</div>\n          </div>\n        </div>\n      </div>\n      <div class="swiper-slide">\n        <div class="pd-col-content-all">\n          <div class="page-notwork" (tap)="init()"></div>\n          <div class="has-wifi">\n            <!--广告位-->\n            <div class="pd-col-content p-gg">\n              <ion-slides loop="true" pager autoplay="6000" *ngIf="g_10004 && g_10004.length > 1">\n                <ion-slide *ngFor="let item of g_10004" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n              <ion-slides *ngIf="g_10004 && g_10004.length == 1">\n                <ion-slide *ngFor="let item of g_10004" (tap)="toBookInfo(item.adv_url.split(\'|\')[0], item.adv_url.split(\'|\')[1])">\n                  <img src="{{service.ctxPath + item.adv_img}}" onload="imgLoad(this)" class="opacity_img">\n                </ion-slide>\n              </ion-slides>\n            </div>\n            <!--快捷导航-->\n            <div class="pd-col-content cm-nav-bar">\n              <div class="cm-nv-item" (tap)="toOrder_cb()">\n                <img src="assets/img/mm-2.png">\n                <p>排行</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toBook_tj()">\n                <img src="assets/img/mm-3.png">\n                <p>特价</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toCbNewBookPage()">\n                <img src="assets/img/mm-4.png">\n                <p>新书</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toCbHotBookPage()">\n                <img src="assets/img/mm-9.png">\n                <p>热门</p>\n              </div>\n              <div class="cm-nv-item" (tap)="toXianmian(\'3\')">\n                <img src="assets/img/mm-5.png">\n                <p>限免</p>\n              </div>\n            </div>\n            <!--本期热推-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">本期热推\n                <a (tap)="toTjBookPage(\'50001\',\'本期热推\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50001" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--好好说话-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">好好说话\n                <a (tap)="toTjBookPage(\'50002\',\'好好说话\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50002" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--精品小说-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">精品小说\n                <a (tap)="toTjBookPage(\'50003\',\'精品小说\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50003" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--励志人生-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">励志人生\n                <a (tap)="toTjBookPage(\'50004\',\'励志人生\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50004" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--人在职场-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">人在职场\n                <a (tap)="toTjBookPage(\'50005\',\'人在职场\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50005" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <!--人文社科-->\n            <div class="pd-col-content df-model">\n              <div class="df-model-header">人文社科\n                <a (tap)="toTjBookPage(\'50006\',\'人文社科\')">查看更多&gt;</a>\n              </div>\n              <div class="model-book" *ngFor="let book of m_50006" (tap)="toBookInfo(book.book_id,book.book_type)">\n                <div class="m_cover">\n                  <img src="{{book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n                  <img src="{{service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n                </div>\n                <p>{{book.book_name}}</p>\n              </div>\n            </div>\n            <div class="message-bottom">已经到底了，到别的频道逛逛吧!</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\city\city.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_16__ionic_native_barcode_scanner__["a" /* BarcodeScanner */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CityPage);
    return CityPage;
}());

//# sourceMappingURL=city.js.map

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return YcOrderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classify_classify__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var YcOrderPage = /** @class */ (function () {
    function YcOrderPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nan_order_data = [];
        this.cb_order_data = [];
        this.nv_param = {
            pageNum: 0,
            pageSize: 10,
            pages: 1,
            type: 'popularity',
            bookChannel: 2
        };
        this.nan_param = {
            pageNum: 0,
            pageSize: 10,
            pages: 1,
            type: 'sale',
            bookChannel: 2
        };
        this.cb_param = {
            pageNum: 0,
            pageSize: 10,
            pages: 1,
            type: 'collection',
            bookChannel: 2
        };
        this.load_more_nv = true;
        this.load_more_nan = true;
        this.load_more_cb = true;
        this.nv_param.bookChannel = params.get('bookChannel');
        this.nan_param.bookChannel = params.get('bookChannel');
        this.cb_param.bookChannel = params.get('bookChannel');
    }
    YcOrderPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //切换频道
    YcOrderPage.prototype.activeTo = function (n, t) {
        this.active_index = n;
        this.mySwiper.slideTo(n - 1, 500, null);
    };
    //分类页
    YcOrderPage.prototype.toClassify = function (e) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__classify_classify__["a" /* ClassifyPage */]);
    };
    //图书详情
    YcOrderPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    //获取人气周数据
    YcOrderPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/CJZWWBookList/channelRankList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_1').on('scroll', function () {
                            var div = document.getElementById('scroll_1');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //获取销售周榜
    YcOrderPage.prototype.get_nan = function () {
        var _this = this;
        if (this.nan_param.pageNum < this.nan_param.pages) {
            this.nan_param.pageNum += 1;
            this.service.post('/v3/CJZWWBookList/channelRankList', this.nan_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nan_order_data.push(element);
                    });
                    _this.nan_param.pages = success.data.pages;
                    _this.load_more_nan = true;
                    if (!_this.scroll_2) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_2 = jQuery('#scroll_2').on('scroll', function () {
                            var div = document.getElementById('scroll_2');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nan && _this.nan_param.pages > _this.nan_param.pageNum) {
                                    _this.load_more_nan = false;
                                    setTimeout(function () {
                                        _this.get_nan();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //获取收藏周榜
    YcOrderPage.prototype.get_cb = function () {
        var _this = this;
        if (this.cb_param.pageNum < this.cb_param.pages) {
            this.cb_param.pageNum += 1;
            this.service.post('/v3/CJZWWBookList/channelRankList', this.cb_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.cb_order_data.push(element);
                    });
                    _this.cb_param.pages = success.data.pages;
                    _this.load_more_cb = true;
                    if (!_this.scroll_3) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#mySwiper_order_1').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_3 = jQuery('#scroll_3').on('scroll', function () {
                            var div = document.getElementById('scroll_3');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_cb && _this.cb_param.pages > _this.cb_param.pageNum) {
                                    _this.load_more_cb = false;
                                    setTimeout(function () {
                                        _this.get_cb();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    YcOrderPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.service.loadingStart();
        this.mySwiper = new Swiper('#mySwiper_order_1', {
            onTransitionEnd: function (swiper) {
                var currentIndex = swiper.activeIndex;
                _this.active_index = currentIndex + 1;
            }
        });
        //先加载一次
        this.get_nv();
        this.get_nan();
        this.get_cb();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], YcOrderPage.prototype, "slides", void 0);
    YcOrderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-ycorder',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\ycorder\ycorder.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>排行榜</ion-title>\n\n  </ion-navbar>\n\n\n\n  <ion-navbar color="light" style="padding:0;" id="childNavbar">\n\n    <div class="my-set-navbar">\n\n      <div class="plan-nav-1">\n\n        <div class="nav-li-par">\n\n          <div class="nav-li-pll" [ngClass]="\'active_\'+ active_index">\n\n            <ul class="header-nav-bar-lab">\n\n              <li (tap)="activeTo(1,\'popularity\')">人气周榜</li>\n\n              <li (tap)="activeTo(2,\'sale\')">销售周榜</li>\n\n              <li (tap)="activeTo(3,\'collection\')">收藏周榜</li>\n\n            </ul>\n\n            <label class="dmdd">\n\n              <s></s>\n\n            </label>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="swiper-container" id="mySwiper_order_1" style="opacity:0">\n\n    <div class="swiper-wrapper">\n\n      <div class="swiper-slide">\n\n        <div class="pd-col-content-all" id="scroll_1">\n\n          <div class="book-line" *ngFor="let book of nv_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="m-cover">\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n            </div>\n\n            <div class="m-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="m-remark">{{book.book_remark}}</div>\n\n              <div class="m-other">\n\n                <label class="m-left">{{book.book_author}}</label>\n\n                <label class="m-right">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n          <div class="message-load-bottom" [hidden]="load_more_nv">\n\n            <ion-spinner name="dots"></ion-spinner>\n\n            <div>请稍候，努力加载中</div>\n\n          </div>\n\n          <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n        </div>\n\n      </div>\n\n      <div class="swiper-slide">\n\n        <div class="pd-col-content-all" id="scroll_2">\n\n          <div class="book-line" *ngFor="let book of nan_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="m-cover">\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n            </div>\n\n            <div class="m-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="m-remark">{{book.book_remark}}</div>\n\n              <div class="m-other">\n\n                <label class="m-left">{{book.book_author}}</label>\n\n                <label class="m-right">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n          <div class="message-load-bottom" [hidden]="load_more_nan">\n\n            <ion-spinner name="dots"></ion-spinner>\n\n            <div>请稍候，努力加载中</div>\n\n          </div>\n\n          <div class="message-bottom" [hidden]="!load_more_nan || nan_param.pages > nan_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n        </div>\n\n      </div>\n\n      <div class="swiper-slide">\n\n          <div class="pd-col-content-all" id="scroll_3">\n\n              <div class="book-line" *ngFor="let book of cb_order_data" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n                <div class="m-cover">\n\n                  <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n                  <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n                </div>\n\n                <div class="m-detail">\n\n                  <h1>{{book.book_name}}</h1>\n\n                  <div class="m-remark">{{book.book_remark}}</div>\n\n                  <div class="m-other">\n\n                    <label class="m-left">{{book.book_author}}</label>\n\n                    <label class="m-right">{{book.book_cat_name}}</label>\n\n                  </div>\n\n                </div>\n\n              </div>\n\n              <div class="message-load-bottom" [hidden]="load_more_cb">\n\n                <ion-spinner name="dots"></ion-spinner>\n\n                <div>请稍候，努力加载中</div>\n\n              </div>\n\n              <div class="message-bottom" [hidden]="!load_more_cb || cb_param.pages > cb_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n            </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\ycorder\ycorder.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], YcOrderPage);
    return YcOrderPage;
}());

//# sourceMappingURL=ycorder.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CbOrderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CbOrderPage = /** @class */ (function () {
    function CbOrderPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
    }
    CbOrderPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取人气周数据
    CbOrderPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/bookList/rankList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    CbOrderPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    CbOrderPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], CbOrderPage.prototype, "slides", void 0);
    CbOrderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cborder',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\cborder\cborder.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>排行</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n      <div class="m-cover">\n\n        <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n        <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\cborder\cborder.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CbOrderPage);
    return CbOrderPage;
}());

//# sourceMappingURL=cborder.js.map

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CbNewBookPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CbNewBookPage = /** @class */ (function () {
    function CbNewBookPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            order: 'new',
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
    }
    CbNewBookPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取人气周数据
    CbNewBookPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/api/search/bookList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    CbNewBookPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    CbNewBookPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], CbNewBookPage.prototype, "slides", void 0);
    CbNewBookPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cbnewbook',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\cbnewbook\cbnewbook.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>新书</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n      <div class="m-cover">\n\n        <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n        <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\cbnewbook\cbnewbook.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CbNewBookPage);
    return CbNewBookPage;
}());

//# sourceMappingURL=cbnewbook.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CbHotBookPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CbHotBookPage = /** @class */ (function () {
    function CbHotBookPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            order: 'hot',
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
    }
    CbHotBookPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取人气周数据
    CbHotBookPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/api/search/bookList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    CbHotBookPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    CbHotBookPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], CbHotBookPage.prototype, "slides", void 0);
    CbHotBookPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cbhotbook',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\cbhotbook\cbhotbook.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>热门</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data"  (tap)="toBookInfo(book.book_id,book.book_type)">\n\n      <div class="m-cover">\n\n        <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n        <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\cbhotbook\cbhotbook.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CbHotBookPage);
    return CbHotBookPage;
}());

//# sourceMappingURL=cbhotbook.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CbTjBookPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CbTjBookPage = /** @class */ (function () {
    function CbTjBookPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            order: 'hot',
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
    }
    CbTjBookPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取人气周数据
    CbTjBookPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/api/bookDiscount/discountList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    CbTjBookPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    CbTjBookPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], CbTjBookPage.prototype, "slides", void 0);
    CbTjBookPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cbtjbook',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\cbtjbook\cbtjbook.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>特价</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n      <div class="m-cover">\n\n        <s></s>\n\n        <img src="{{ service.ctxPath + book.book_cover_small}}" onload="imgLoad(this)" class="opacity_img"/>\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\cbtjbook\cbtjbook.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CbTjBookPage);
    return CbTjBookPage;
}());

//# sourceMappingURL=cbtjbook.js.map

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TjBookPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TjBookPage = /** @class */ (function () {
    function TjBookPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            recommend_code: null,
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
        this.obj_id = this.params.get('obj_id');
        this.obj_name = this.params.get('obj_name');
        this.nv_param.recommend_code = this.params.get('obj_id');
    }
    TjBookPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取推荐模块数据
    TjBookPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/api/recommendBooks/getList', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    //图书详情
    TjBookPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    TjBookPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], TjBookPage.prototype, "slides", void 0);
    TjBookPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tjbook',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\tjbook\tjbook.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>{{obj_name}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n      <div class="m-cover">\n\n        <img src="{{ service.ctxPath + book.book_cover}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n\n        <img src="{{ book.book_cover}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\tjbook\tjbook.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], TjBookPage);
    return TjBookPage;
}());

//# sourceMappingURL=tjbook.js.map

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return YcTypeBookPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var YcTypeBookPage = /** @class */ (function () {
    function YcTypeBookPage(navCtrl, params, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.active_index = 1;
        this.nv_order_data = [];
        this.nv_param = {
            name: '热门',
            type: 'hot',
            bookChannel: 0,
            pageNum: 0,
            pageSize: 10,
            pages: 1
        };
        this.load_more_nv = true;
        this.nv_param.name = params.get('name');
        this.nv_param.type = params.get('type');
        this.nv_param.bookChannel = params.get('bookChannel');
    }
    YcTypeBookPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //图书详情
    YcTypeBookPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    //获取人气周数据
    YcTypeBookPage.prototype.get_nv = function () {
        var _this = this;
        if (this.nv_param.pageNum < this.nv_param.pages) {
            this.nv_param.pageNum += 1;
            this.service.post('/v3/bookList/randRank', this.nv_param).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    success.data.rows.forEach(function (element) {
                        _this.nv_order_data.push(element);
                    });
                    _this.nv_param.pages = success.data.pages;
                    _this.load_more_nv = true;
                    if (!_this.scroll_1) {
                        //关闭加载层
                        setTimeout(function () {
                            jQuery('#scroll_nv').animate({
                                opacity: 1
                            }, 'slow', function () {
                                _this.service.loadingEnd();
                            });
                        }, 500);
                        _this.scroll_1 = jQuery('#scroll_nv').on('scroll', function () {
                            var div = document.getElementById('scroll_nv');
                            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                                if (_this.load_more_nv && _this.nv_param.pages > _this.nv_param.pageNum) {
                                    _this.load_more_nv = false;
                                    setTimeout(function () {
                                        _this.get_nv();
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    YcTypeBookPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        //先加载一次
        this.get_nv();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], YcTypeBookPage.prototype, "slides", void 0);
    YcTypeBookPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-yctypebook',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\yctypebook\yctypebook.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>{{nv_param.name}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="pd-col-content-all" id="scroll_nv" style="opacity: 0">\n\n    <div class="book-line" *ngFor="let book of nv_order_data" (tap)="toBookInfo(book.book_id,1)">\n\n      <div class="m-cover">\n\n        <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2">\n\n        <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1">\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{book.book_name}}</h1>\n\n        <div class="m-remark">{{book.book_remark}}</div>\n\n        <div class="m-other">\n\n          <label class="m-left">{{book.book_author}}</label>\n\n          <label class="m-right">{{book.book_cat_name}}</label>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class="message-load-bottom" [hidden]="load_more_nv">\n\n      <ion-spinner name="dots"></ion-spinner>\n\n      <div>请稍候，努力加载中</div>\n\n    </div>\n\n    <div class="message-bottom" [hidden]="!load_more_nv || nv_param.pages > nv_param.pageNum">已经到底了，到别的频道逛逛吧!</div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\yctypebook\yctypebook.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], YcTypeBookPage);
    return YcTypeBookPage;
}());

//# sourceMappingURL=yctypebook.js.map

/***/ }),

/***/ 281:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FindPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_search__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__xianmian_xianmian__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__recharge_recharge__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__caogen_caogen__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var FindPage = /** @class */ (function () {
    function FindPage(navCtrl, barcodeScanner, service) {
        this.navCtrl = navCtrl;
        this.barcodeScanner = barcodeScanner;
        this.service = service;
    }
    FindPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //前往搜索
    FindPage.prototype.toSearch = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */]);
    };
    FindPage.prototype.tocaogen = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__caogen_caogen__["a" /* CaogenPage */]);
    };
    FindPage.prototype.toxianmian = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__xianmian_xianmian__["a" /* XianmianPage */]);
    };
    FindPage.prototype.tochongzhi = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__recharge_recharge__["a" /* RechargePage */]);
    };
    //扫码加书
    FindPage.prototype.saomaAddBook = function () {
        var _this = this;
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.service.dialogs.alert('您正在使用扫码加书功能，请将摄像头对准图书二维码', '温馨提示', '确定').then(function () {
            _this.barcodeScanner.scan().then(function (success) {
                if (success.text) {
                    var search = success.text.split('?')[1];
                    var searchs = search.split('&');
                    var param = {
                        org_id: null,
                        book_id: null,
                        device_id: null,
                        book_type: null
                    };
                    for (var key in searchs) {
                        if (searchs[key].indexOf('o=') != -1) {
                            param['org_id'] = searchs[key].replace('o=', '');
                        }
                        if (searchs[key].indexOf('b=') != -1) {
                            param['book_id'] = searchs[key].replace('b=', '');
                        }
                        if (searchs[key].indexOf('d=') != -1) {
                            param['device_id'] = searchs[key].replace('d=', '');
                        }
                        if (searchs[key].indexOf('t=') != -1) {
                            param['book_type'] = searchs[key].replace('t=', '');
                        }
                    }
                    if (param.org_id && param.book_id) {
                        //添加到书架
                        _this.service.post('/v2/api/bookShelf/addBook', param).then(function (success) {
                            if (success.code == 600) {
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code == 0) {
                                //重新获取书架内容
                                _this.service.unRefreshBookshelf = true;
                                _this.navCtrl.parent.select(0);
                            }
                            else {
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                        });
                    }
                    else {
                        _this.service.dialogs.alert('你扫描的二维码有误，请确认后再试!');
                    }
                }
            }, function (error) {
                _this.service.dialogs.alert(error, '提示', '确定');
            });
        });
    };
    FindPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-find',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\find\find.html"*/'<ion-header color="light">\n  <ion-navbar color="light">\n    <div class="my-set-navbar">\n      <div class="plan-nav-1">\n        <button ion-button icon-only style="float:left" (tap)="saomaAddBook($event)">\n               <ion-icon id="shlefStartBtn" class="iconfont icon-saoma1" style="padding:0 8px; font-size:1.6em"></ion-icon>\n          </button>\n        <button ion-button icon-only style="float:right" (tap)="toSearch($event)">\n              <ion-icon id="shlefEndBtn" class="iconfont icon-search" style="padding: 0 8px; font-size:1.6em"></ion-icon>\n          </button>\n        <h1>发现</h1>\n      </div>\n    </div>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div style="float:left;width:100%;height:100%;position:relative;">\n    <div style="display:inline-block;width:100%;">\n      <a class="cmitem"><img src="assets/img/hd-1.jpg" (tap)="tocaogen()"></a>\n      <a class="cmitem"><img src="assets/img/hd-2.jpg" (tap)="tochongzhi()"></a>\n      <a class="cmitem"><img src="assets/img/hd-3.jpg" (tap)="toxianmian()"></a>\n    </div>\n  </div>\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\find\find.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__["a" /* BarcodeScanner */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], FindPage);
    return FindPage;
}());

//# sourceMappingURL=find.js.map

/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CaogenPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__caogeninfo_caogeninfo__ = __webpack_require__(283);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CaogenPage = /** @class */ (function () {
    function CaogenPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.param = {
            pageNum: 0,
            pageSize: 24,
            type: 'all',
            isHubei: 1,
            book_type: 1
        };
        this.books = [];
    }
    CaogenPage.prototype.toinfo = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__caogeninfo_caogeninfo__["a" /* CaogenInfoPage */]);
    };
    CaogenPage.prototype.dendai = function () {
        this.service.dialogs.alert('大赛还未开始，敬请期待~', '提示', '确认');
    };
    CaogenPage.prototype.getPageData = function (infiniteScroll) {
        var _this = this;
        if (!infiniteScroll) {
            this.service.loadingEnd();
        }
        this.param.pageNum += 1;
        this.service.post('/v3/api/search/bookList', this.param).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                success.data.rows.forEach(function (element) {
                    _this.books.push(element);
                });
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
            }
        });
    };
    CaogenPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //图书详情
    CaogenPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    CaogenPage.prototype.ionViewDidLoad = function () {
        this.service.loadingStart();
        this.getPageData();
    };
    CaogenPage.prototype.doInfinite = function (infiniteScroll) {
        this.getPageData(infiniteScroll);
    };
    CaogenPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-caogen',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\caogen\caogen.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>草根大赛</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div style="display:inline-block">\n\n    <div class="nav-img">\n\n      <img src="assets/img/nav-4.png">\n\n      <div class="fix-btn"><button ion-button color="danger" (tap)="toinfo()">报名参赛</button></div>\n\n    </div>\n\n    <div class="tab-title">\n\n      <label class="active">2017赛季</label>\n\n      <label (tap)="dendai()">2018赛季</label>\n\n      <label (tap)="dendai()">2019赛季</label>\n\n    </div>\n\n    <div class="book-list">\n\n      <div class="list-title">草根计划作品专区</div>\n\n      <div class="m-book" *ngFor="let book of books"  (tap)="toBookInfo(book.book_id,1)">\n\n        <div class="m-cover"><img src="{{book.book_cover_small}}" onload="imgLoad(this)" class="opacity_img"/></div>\n\n        <p>{{book.book_name}}</p>\n\n        <p class="cm">{{book.book_author}}</p>\n\n      </div>\n\n    </div>\n\n  </div>\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [hidden]="param.pages == param.pageNum || books.length == 0">\n\n    <ion-infinite-scroll-content loadingText="请稍等, 正在加载!"></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\caogen\caogen.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CaogenPage);
    return CaogenPage;
}());

//# sourceMappingURL=caogen.js.map

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CaogenInfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CaogenInfoPage = /** @class */ (function () {
    function CaogenInfoPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
    }
    CaogenInfoPage.prototype.backPage = function () {
        this.navCtrl.pop();
    };
    CaogenInfoPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    CaogenInfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-caogeninfo',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\caogeninfo\caogeninfo.html"*/'\n\n\n\n<ion-content>\n\n <img src="assets/img/caogenjihua.jpg">\n\n</ion-content>\n\n<div class="fix-btn">\n\n  <button ion-button (tap)="backPage()"><i class="iconfont icon-rt"></i></button>\n\n</div>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\caogeninfo\caogeninfo.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], CaogenInfoPage);
    return CaogenInfoPage;
}());

//# sourceMappingURL=caogeninfo.js.map

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CenterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__recharge_recharge__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__qiandao_qiandao__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__seting_seting__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__readjilu_readjilu__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reviews_reviews__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CenterPage = /** @class */ (function () {
    function CenterPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
    }
    CenterPage.prototype.to_recharge = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__recharge_recharge__["a" /* RechargePage */]);
    };
    //前往设置
    CenterPage.prototype.to_seting = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__seting_seting__["a" /* SetingPage */]);
    };
    //前往签到
    CenterPage.prototype.toqiandao = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__qiandao_qiandao__["a" /* QiandaoPage */]);
    };
    //阅读记录
    CenterPage.prototype.toReadJilu = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__readjilu_readjilu__["a" /* ReadJiluPage */]);
    };
    //评论列表
    CenterPage.prototype.toReviews = function () {
        if (this.service.getNetEork() == 'none') {
            this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            return false;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__reviews_reviews__["a" /* ReviewsPage */]);
    };
    //千分位换算
    CenterPage.prototype.toThousands = function (num) {
        var result = '', counter = 0;
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) {
                result = ',' + result;
            }
        }
        return result;
    };
    CenterPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
        if (this.service.getNetEork() != 'none') {
            console.log('重新获取用户信息');
            console.log(navigator.userAgent);
            this.service.getUserInfo();
            console.log(this.service.LoginUserInfo);
        }
    };
    CenterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-center',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\center\center.html"*/'<ion-header color="transparent" >\n\n  <ion-navbar color="transparent" >\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (tap)="to_seting()" style="color:#333;margin-right:16px;">设置</button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <div class="header-user-t">\n\n        <div class="ll-t-1">\n\n          <div class="u-m-t" (tap)="to_seting()" >\n\n            <span style="float:left;width:100%;height:100%;overflow:hidden;border-radius:80px;">\n\n                <img *ngIf="service.LoginUserInfo && service.LoginUserInfo.icon" [hidden]="this.service.getNetEork()  == \'none\'" src="{{service.ctxPath + service.LoginUserInfo.icon}}" />\n\n            </span>\n\n            <i class="sex-nan" [hidden]="!service.LoginUserInfo || service.LoginUserInfo.sex == 2"><em class="iconfont icon-nan"></em></i>\n\n            <i class="sex-nv" [hidden]="!service.LoginUserInfo || service.LoginUserInfo.sex != 2"><em class="iconfont icon-4"></em></i>\n\n          </div>  \n\n        </div>\n\n        <div class="ll-t-2">{{service.LoginUserInfo.nick_name}}</div>\n\n        <div class="ll-t-3" [hidden]="!service.LoginUserInfo.sign">{{service.LoginUserInfo.sign}}</div>\n\n        <div class="ll-t-3" [hidden]="service.LoginUserInfo.sign">你的签名空空如也~</div>\n\n    </div>\n\n    <div class="user-set-n" *ngIf="service.LoginUserInfo">\n\n        <ion-list>\n\n            <button ion-item>\n\n                <span class="mm-icon mm-icon-1"></span>\n\n                <label>我的账户</label>\n\n                <span item-end><label class="cun" style="line-height:24px;float:left;">{{toThousands(service.LoginUserInfo.balance)}}长江币</label>\n\n                  <button ion-button item-end icon-left color="danger" class="cmm-cz-btn" (tap)="to_recharge()">\n\n                      充值\n\n                  </button>\n\n                </span>\n\n            </button> \n\n            <button ion-item (tap)="toqiandao()">\n\n                <span class="mm-icon mm-icon-2"></span>\n\n                <label>签到记录</label>\n\n            </button> \n\n            <button ion-item (tap)="toReadJilu()">\n\n                <span class="mm-icon mm-icon-3"></span>\n\n                <label>阅读记录</label>\n\n            </button> \n\n            <button ion-item (tap)="toReviews()">\n\n                <span class="mm-icon mm-icon-4"></span>\n\n                <label>我的评论</label>\n\n                <label item-end  class="cun" *ngIf="service.LoginUserInfo.review_num">{{service.LoginUserInfo.review_num}}条</label>\n\n            </button> \n\n        </ion-list>\n\n    </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\center\center.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_7__app_app_service__["a" /* AppService */]])
    ], CenterPage);
    return CenterPage;
}());

//# sourceMappingURL=center.js.map

/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__nickname_nickname__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__qianming_qianming__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__phone_phone__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__email_email__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_image_picker__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_app_service__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var SetingPage = /** @class */ (function () {
    function SetingPage(navCtrl, actionsheetCtrl, camera, service, imagePicker) {
        this.navCtrl = navCtrl;
        this.actionsheetCtrl = actionsheetCtrl;
        this.camera = camera;
        this.service = service;
        this.imagePicker = imagePicker;
        this.cnum = 0;
        if (service.LoginUserInfo.phone) {
            this.phone = service.LoginUserInfo.phone.substr(0, 3) + '****' + service.LoginUserInfo.phone.substr(7, 4);
        }
        if (service.LoginUserInfo.email) {
            this.email = service.LoginUserInfo.email.substr(0, 2) + '***@' + service.LoginUserInfo.email.split('@')[1];
        }
    }
    SetingPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    SetingPage.prototype.setPhone = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__phone_phone__["a" /* PhonePage */]);
    };
    SetingPage.prototype.setEmail = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__email_email__["a" /* EmailPage */]);
    };
    //签名
    SetingPage.prototype.setQianming = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__qianming_qianming__["a" /* QianmingPage */]);
    };
    //昵称
    SetingPage.prototype.setNickName = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__nickname_nickname__["a" /* NickNamePage */]);
    };
    SetingPage.prototype.toLogin = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
    };
    SetingPage.prototype.set_sex = function () {
        var _this = this;
        var actionSheet = this.actionsheetCtrl.create({
            title: '',
            cssClass: 'action-my-sheets',
            buttons: [
                {
                    text: '男',
                    role: 'destructive',
                    icon: 'pp-center',
                    handler: function () {
                        _this.service.post('/v3/member/updateMemberInfo', {
                            sex: 1
                        }).then(function (success) {
                            if (success.code == 600) {
                                _this.service.loadingEnd();
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code != 0) {
                                _this.service.loadingEnd();
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                            else {
                                _this.service.getUserInfo();
                            }
                        });
                    }
                },
                {
                    text: '女',
                    icon: 'pp-center',
                    handler: function () {
                        _this.service.post('/v3/member/updateMemberInfo', {
                            sex: 2
                        }).then(function (success) {
                            if (success.code == 600) {
                                _this.service.loadingEnd();
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code != 0) {
                                _this.service.loadingEnd();
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                            else {
                                _this.service.getUserInfo();
                            }
                        });
                    }
                }
            ]
        });
        actionSheet.present();
    };
    SetingPage.prototype.set_user_head = function () {
        var _this = this;
        var actionSheet = this.actionsheetCtrl.create({
            title: '',
            cssClass: 'action-my-sheets',
            buttons: [
                {
                    text: '拍照',
                    role: 'destructive',
                    icon: 'pp-center',
                    handler: function () {
                        _this.paizhao();
                    }
                },
                {
                    text: '从相册选择',
                    icon: 'pp-center',
                    handler: function () {
                        _this.xiangche();
                    }
                }
            ]
        });
        actionSheet.present();
    };
    SetingPage.prototype.paizhao = function () {
        var _this = this;
        var options = {
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG
        };
        this.camera.getPicture(options).then(function (imageURI) {
            _this.uploadFile(imageURI);
        }, function (err) {
            //this.service.dialogs.alert(err, '提示', '确定');
        });
    };
    SetingPage.prototype.xiangche = function () {
        var _this = this;
        var options = {
            maximumImagesCount: 1
        };
        this.imagePicker.getPictures(options).then(function (results) {
            var imageURI = null;
            for (var i = 0; i < results.length; i++) {
                imageURI = results[i];
            }
            _this.uploadFile(imageURI);
        }, function (err) {
            _this.service.dialogs.alert(err, '提示', '确定');
        });
    };
    SetingPage.prototype.uploadFile = function (imageURI) {
        var _this = this;
        if (imageURI) {
            this.service.loadingStart();
            var url = this.service.ctxPath + "/file/upload";
            this.service.fileTransfer.upload(imageURI, encodeURI(url)).then(function (result) {
                _this.service.loadingEnd();
                var res = eval("(" + result.response + ")");
                _this.service.post('/v2/api/mobile/memberInfo/updateIcon', {
                    icon: res.data[0].url
                }).then(function (sue) {
                    _this.service.getUserInfo();
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(err, '提示', '确定');
            });
        }
    };
    SetingPage.prototype.changankaiqi = function () {
        this.cnum += 1;
        console.log(this.cnum);
    };
    SetingPage.prototype.shuangjitianjia = function () {
        if (this.cnum >= 3) {
            var d_num = localStorage.getItem('choujiang_num');
            if (!d_num || d_num == '' || isNaN(d_num)) {
                d_num = 1;
            }
            else {
                d_num = parseInt(d_num) + 1;
            }
            localStorage.setItem('choujiang_num', d_num);
        }
    };
    SetingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-seting',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\seting\seting.html"*/'<ion-header color="light">\n\n    <ion-navbar color="light">\n\n        <ion-title>\n\n            设置\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-list>\n\n        <button ion-item style="border-top:10px #f5f8fa solid;" (tap)="set_user_head()">\n\n            <label>头像</label>\n\n            <span item-end>\n\n                <span class="u-c-cover">\n\n                    <img *ngIf="service.LoginUserInfo" [hidden]="!service.LoginUserInfo.icon" src="{{service.ctxPath + service.LoginUserInfo.icon}}"\n\n                    />\n\n                </span>\n\n            </span>\n\n        </button>\n\n        <button ion-item class="cun">\n\n            <label>帐号ID</label>\n\n            <label item-end>{{service.LoginUserInfo.member_id}}</label>\n\n        </button>\n\n        <button ion-item (tap)="setNickName()">\n\n            <label>昵称</label>\n\n            <label item-end *ngIf="!service.LoginUserInfo.nick_name">未设置</label>\n\n            <label item-end *ngIf="service.LoginUserInfo.nick_name">{{service.LoginUserInfo.nick_name}}</label>\n\n        </button>\n\n        <button ion-item (tap)="set_sex()">\n\n            <label>性别</label>\n\n            <label item-end *ngIf="!service.LoginUserInfo.sex">保密</label>\n\n            <label item-end *ngIf="service.LoginUserInfo.sex == 1">男</label>\n\n            <label item-end *ngIf="service.LoginUserInfo.sex == 2">女</label>\n\n        </button>\n\n        <button ion-item class="un-bor-btm" (tap)="setQianming()">\n\n            <label>个性签名</label>\n\n            <label item-end>{{service.LoginUserInfo.sign}}</label>\n\n        </button>\n\n        <button ion-item style="border-top:10px #f5f8fa solid;" (tap)="setPhone()">\n\n            <label>手机</label>\n\n            <label item-end *ngIf="!service.LoginUserInfo.phone">未绑定</label>\n\n            <label item-end *ngIf="service.LoginUserInfo.phone">{{phone}}</label>\n\n        </button>\n\n        <button ion-item class="un-bor-btm" (tap)="setEmail()">\n\n            <label>邮箱</label>\n\n            <label item-end *ngIf="!service.LoginUserInfo.email">未绑定</label>\n\n            <label item-end *ngIf="service.LoginUserInfo.email">{{email}}</label>\n\n        </button>\n\n        <button ion-item class="cun" style="border-top:10px #f5f8fa solid;border-bottom: none;" (tap)="toLogin()">\n\n            <label class="check-label">注销</label>\n\n        </button>\n\n    </ion-list>\n\n    <div class="version-code" (press)="changankaiqi()" (click)="shuangjitianjia()">v{{service.version}}</div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\seting\seting.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_9__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_image_picker__["a" /* ImagePicker */]])
    ], SetingPage);
    return SetingPage;
}());

//# sourceMappingURL=seting.js.map

/***/ }),

/***/ 287:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NickNamePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NickNamePage = /** @class */ (function () {
    function NickNamePage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.nickName = service.LoginUserInfo.nick_name;
    }
    NickNamePage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    NickNamePage.prototype.submit = function () {
        var _this = this;
        if (this.nickName) {
            this.service.post('/v3/member/updateMemberInfo', {
                nickName: this.nickName
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.service.getUserInfo();
                    _this.navCtrl.pop();
                }
            });
        }
        else {
            this.service.dialogs.alert('请填写用户昵称', '提示', '确定');
        }
    };
    NickNamePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-nickname',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\nickname\nickname.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      修改昵称\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-item>\n\n    <ion-label fixed>我的昵称</ion-label>\n\n    <ion-input type="text" [(ngModel)]="nickName" placeholder="请填写昵称" maxlength="12"></ion-input>\n\n  </ion-item>\n\n  <div padding>\n\n      <button ion-button class="button button-block" color="danger" (tap)="submit()">保存</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\nickname\nickname.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], NickNamePage);
    return NickNamePage;
}());

//# sourceMappingURL=nickname.js.map

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QianmingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var QianmingPage = /** @class */ (function () {
    function QianmingPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.sign = service.LoginUserInfo.sign;
        this.nickName = service.LoginUserInfo.nick_name;
        console.log(service.LoginUserInfo);
    }
    QianmingPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    QianmingPage.prototype.submit = function () {
        var _this = this;
        if (this.sign) {
            this.service.post('/v3/member/updateMemberInfo', {
                nickName: this.nickName,
                sign: this.sign
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.service.getUserInfo();
                    _this.navCtrl.pop();
                }
            });
        }
        else {
            this.service.dialogs.alert('请填写签名', '提示', '确定');
        }
    };
    QianmingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-qianming',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\qianming\qianming.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      修改签名\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <textarea style="height:120px;width:100%;border:1px #ddd solid;padding:5px;resize:none;" type="text" [(ngModel)]="sign" placeholder="请填写你的个性签名..." maxlength="16"></textarea>\n\n  <div >\n\n      <button ion-button class="button button-block" color="danger" (tap)="submit()">保存</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\qianming\qianming.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], QianmingPage);
    return QianmingPage;
}());

//# sourceMappingURL=qianming.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhonePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PhonePage = /** @class */ (function () {
    function PhonePage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.num = 0;
        this.phone = service.LoginUserInfo.phone;
        this.account = service.LoginUserInfo.phone;
        if (service.LoginUserInfo.phone) {
            this.phone = service.LoginUserInfo.phone.substr(0, 3) + '****' + service.LoginUserInfo.phone.substr(7, 4);
        }
    }
    PhonePage.prototype.getCode = function () {
        var _this = this;
        if (this.num == 0 && this.phone && /^1[34578]\d{9}$/.test(this.phone)) {
            this.num = 60;
            this.service.post('/v2/api/mobile/validCode/sendValidCode', {
                account: this.phone,
                type: 'changePhone'
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.update_num();
                }
            });
        }
        else {
            this.service.dialogs.alert('请输入正确的手机号码!', '提示', '确定');
        }
    };
    PhonePage.prototype.submit = function () {
        var _this = this;
        if (!this.phone || !/^1[34578]\d{9}$/.test(this.phone)) {
            this.service.dialogs.alert('请输入正确的手机号码!', '提示', '确定');
        }
        else if (!this.code) {
            this.service.dialogs.alert('请输入手机验证码!', '提示', '确定');
        }
        else {
            this.service.post('/v2/api/mobile/memberInfo/updatePhone', {
                token: this.service.token,
                type: 'changePhone',
                phone: this.phone,
                code: this.code
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.service.dialogs.alert('手机已绑定成功!', '提示', '确定');
                    _this.navCtrl.pop();
                }
            });
        }
    };
    PhonePage.prototype.update_num = function () {
        var _this = this;
        this.num -= 1;
        if (this.num > 0) {
            setTimeout(function () {
                _this.update_num();
            }, 1000);
        }
        else {
            this.num = 0;
        }
    };
    PhonePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-phone',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\phone\phone.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      手机绑定\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div [hidden]="account">\n\n      <ion-item>\n\n          <ion-label fixed>我的手机</ion-label>\n\n          <ion-input type="text" [(ngModel)]="phone" placeholder="请填写你的手机号码"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label fixed>验证码</ion-label>\n\n          <ion-input type="text" [(ngModel)]="code" placeholder="请填写验证码"></ion-input>\n\n          <button ion-button item-end color="light" (tap)="getCode()" [hidden]="num">获取验证码</button>\n\n          <button ion-button item-end color="light" [hidden]="num == 0" disabled>{{num}}s后重新获取</button>\n\n        </ion-item>\n\n        <div padding>\n\n          <button ion-button class="button button-block" color="danger" (tap)="submit()">保存</button>\n\n        </div>\n\n  </div>\n\n  <div *ngIf="account" style="text-align:center">\n\n    <p>我的手机</p>\n\n    <h1>{{phone}}</h1>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\phone\phone.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], PhonePage);
    return PhonePage;
}());

//# sourceMappingURL=phone.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EmailPage = /** @class */ (function () {
    function EmailPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.num = 0;
        this.email = service.LoginUserInfo.email;
        this.account = service.LoginUserInfo.email;
        if (service.LoginUserInfo.email) {
            this.email = service.LoginUserInfo.email.substr(0, 2) + '***@' + service.LoginUserInfo.email.split('@')[1];
        }
    }
    EmailPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    EmailPage.prototype.getCode = function () {
        var _this = this;
        if (this.num == 0 && this.email && /^1[34578]\d{9}$/.test(this.email)) {
            this.num = 60;
            this.service.post('/v2/api/mobile/validCode/sendValidCode', {
                account: this.email,
                type: 'changeemail'
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.update_num();
                }
            });
        }
        else {
            this.service.dialogs.alert('请输入正确的邮箱号码!', '提示', '确定');
        }
    };
    EmailPage.prototype.submit = function () {
        var _this = this;
        if (!this.email || !/^1[34578]\d{9}$/.test(this.email)) {
            this.service.dialogs.alert('请输入正确的邮箱号码!', '提示', '确定');
        }
        else if (!this.code) {
            this.service.dialogs.alert('请输入邮箱验证码!', '提示', '确定');
        }
        else {
            this.service.post('/v2/api/mobile/memberInfo/updateEmail', {
                token: this.service.token,
                type: 'changeemail',
                email: this.email,
                code: this.code
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.service.dialogs.alert('邮箱已绑定成功!', '提示', '确定');
                    _this.navCtrl.pop();
                }
            });
        }
    };
    EmailPage.prototype.update_num = function () {
        var _this = this;
        this.num -= 1;
        if (this.num > 0) {
            setTimeout(function () {
                _this.update_num();
            }, 1000);
        }
        else {
            this.num = 0;
        }
    };
    EmailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-email',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\email\email.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      邮箱绑定\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div [hidden]="account">\n\n      <ion-item>\n\n          <ion-label fixed>我的邮箱</ion-label>\n\n          <ion-input type="text" [(ngModel)]="email" placeholder="请填写你的邮箱号码"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label fixed>验证码</ion-label>\n\n          <ion-input type="text" [(ngModel)]="code" placeholder="请填写验证码"></ion-input>\n\n          <button ion-button item-end color="light" (tap)="getCode()" [hidden]="num">获取验证码</button>\n\n          <button ion-button item-end color="light" [hidden]="num == 0" disabled>{{num}}s后重新获取</button>\n\n        </ion-item>\n\n        <div padding>\n\n          <button ion-button class="button button-block" color="danger" (tap)="submit()">保存</button>\n\n        </div>\n\n  </div>\n\n  <div *ngIf="account" style="text-align:center">\n\n    <p>我的邮箱</p>\n\n    <h1>{{email}}</h1>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\email\email.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], EmailPage);
    return EmailPage;
}());

//# sourceMappingURL=email.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReadJiluPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__recharge_recharge__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ReadJiluPage = /** @class */ (function () {
    function ReadJiluPage(navCtrl, service, tab) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.tab = tab;
        this.param = {
            pageNum: 0,
            pages: 1,
            pageSize: 10
        };
        this.jilu = [];
    }
    //阅读
    ReadJiluPage.prototype.selectBook = function (book) {
        var options = {
            ctxPath: this.service.ctxPath.toString(),
            chid: book.chapter_id.toString(),
            pagenum: null,
            eventkey: null,
            bookid: book.book_id.toString(),
            bookname: book.book_name.toString(),
            booktype: book.book_type.toString(),
            userid: this.service.LoginUserInfo.member_id.toString(),
            token: this.service.LoginUserInfo.token.toString()
        };
        navigator.BookRead.reader(options);
    };
    ReadJiluPage.prototype.getjilu = function (infiniteScroll) {
        var _this = this;
        if (this.param.pageNum == 0) {
            this.service.loadingEnd();
        }
        if (this.param.pageNum < this.param.pages) {
            this.param.pageNum += 1;
        }
        this.service.post('/v3/memberRead/updateReadRecord', this.param).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                success.data.rows.forEach(function (element) {
                    var jd = element.schedule;
                    if (jd && jd.toString().indexOf('|') != -1) {
                        element.baifen = parseFloat(jd.toString().split('|')[1]).toFixed(2);
                    }
                    _this.jilu.push(element);
                });
                if (_this.jilu.length == 0) {
                    jQuery('.not-reviews-data').show();
                }
                else {
                    jQuery('.not-reviews-data').hide();
                }
                _this.param.pages = success.data.pages;
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
                _this.service.loadingEnd();
            }
        });
    };
    ReadJiluPage.prototype.clearAll = function () {
        var _this = this;
        this.service.dialogs.confirm('你确定要清除所有阅读记录吗?', '提示', ['确定', '取消']).then(function (index) {
            if (index == 1) {
                _this.service.post('/v2/api/book/deleteReadRecord').then(function (success) {
                    _this.jilu = [];
                });
            }
        });
    };
    ReadJiluPage.prototype.doInfinite = function (infiniteScroll) {
        this.getjilu(infiniteScroll);
    };
    ReadJiluPage.prototype.formatMsgTime = function (timespan) {
        var dateTime = new Date(Date.parse(timespan.replace(/-/g, '/')));
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        //var second = dateTime.getSeconds();
        var now = new Date();
        var milliseconds = 0;
        var timeSpanStr;
        milliseconds = now.getTime() - dateTime.getTime();
        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        }
        else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        }
        else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        }
        else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        }
        else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        }
        else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    };
    ;
    ReadJiluPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.service.statusBar.styleDefault();
        //声明阅读器回调方法
        jQuery.readePageBack = function (name) {
            _this.service.statusBar.styleDefault();
            if (name == 'login') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }
            else if (name == 'recharge') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__recharge_recharge__["a" /* RechargePage */]);
            }
            else if (name == 'bookshelf') {
                _this.navCtrl.popToRoot();
                _this.tab.select(0);
            }
        };
        this.service.loadingStart();
        this.getjilu();
    };
    ReadJiluPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-readjilu',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\readjilu\readjilu.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      阅读记录\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button (tap)="clearAll()" *ngIf="jilu && jilu.length > 0">清除</button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="not-reviews-data"></div>\n\n  <div style="display:inline-block;width:100%">\n\n\n\n    <div class="book-item" *ngFor="let item of jilu" (tap)="selectBook(item)">\n\n      <div class="m-cover">\n\n        <img src="{{item.book_cover_small}}" *ngIf="item.book_type == 1" />\n\n        <img src="{{service.ctxPath + item.book_cover_small}}" *ngIf="item.book_type == 2" />\n\n      </div>\n\n      <div class="m-detail">\n\n        <h1>{{item.book_name}}</h1>\n\n        <div class="c-center">\n\n          <div class="c-zj">{{item.name}}</div>\n\n          <div class="c-other">\n\n            <label class="c-bai" *ngIf="item.baifen">{{item.baifen}}%</label>\n\n            <label class="c-time">{{formatMsgTime(item.end_time)}}</label>\n\n          </div>\n\n          <!-- <button ion-button color="danger" [outline]="true" [round]="true" (tap)="selectBook(item)">继续阅读</button> -->\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [hidden]="param.pages == param.pageNum || jilu.length == 0">\n\n    <ion-infinite-scroll-content loadingText="请稍等, 正在加载!"></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\readjilu\readjilu.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Tabs */]])
    ], ReadJiluPage);
    return ReadJiluPage;
}());

//# sourceMappingURL=readjilu.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReviewsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ReviewsPage = /** @class */ (function () {
    function ReviewsPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.param = {
            pageNum: 0,
            pages: 1,
            pageSize: 20
        };
        this.reviews = [];
        this.total = 0;
        this.df_checkbox = true;
        this.df_footer = true;
    }
    ReviewsPage.prototype.getReviews = function (infiniteScroll) {
        var _this = this;
        if (this.param.pageNum == 0) {
            this.service.loadingEnd();
        }
        if (this.param.pageNum < this.param.pages) {
            this.param.pageNum += 1;
        }
        this.service.post('/v3/member/memberReviewList', this.param).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                success.data.rows.forEach(function (element) {
                    _this.reviews.push(element);
                });
                _this.param.pages = success.data.pages;
                if (_this.reviews.length == 0) {
                    jQuery('.not-reviews-data').show();
                }
                else {
                    jQuery('.not-reviews-data').hide();
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
                _this.service.loadingEnd();
            }
        });
    };
    ReviewsPage.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.reviews && this.reviews.length > 0) {
            this.total = 0;
            this.reviews.forEach(function (element) {
                if (element.select)
                    _this.total += 1;
            });
        }
    };
    ReviewsPage.prototype.changeAll = function () {
        this.df_checkbox = !this.df_checkbox;
        this.df_footer = this.df_checkbox;
    };
    ReviewsPage.prototype.clearAll = function () {
        var _this = this;
        var ids = [];
        this.reviews.forEach(function (element) {
            if (element.select)
                ids.push(element.review_id);
        });
        if (ids.length > 0) {
            this.service.post('/v3/bookReview/deleteReviews', {
                review_ids: ids.toString()
            }).then(function (success) {
                if (success.code == 600) {
                    _this.service.loadingEnd();
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else if (success.code != 0) {
                    _this.service.loadingEnd();
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
                else {
                    _this.reviews = [];
                    _this.total = 0;
                    _this.param.pageNum = 0;
                    _this.getReviews();
                }
            });
        }
        else {
            this.service.dialogs.alert('请选择你要删除的评论~', '提示', '确定');
        }
    };
    ReviewsPage.prototype.doInfinite = function (infiniteScroll) {
        this.getReviews(infiniteScroll);
    };
    ReviewsPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
        this.service.loadingStart();
        this.getReviews();
    };
    ReviewsPage.prototype.formatMsgTime = function (timespan) {
        var dateTime = new Date(Date.parse(timespan.replace(/-/g, '/')));
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        //var second = dateTime.getSeconds();
        var now = new Date();
        var milliseconds = 0;
        var timeSpanStr;
        milliseconds = now.getTime() - dateTime.getTime();
        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        }
        else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        }
        else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        }
        else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        }
        else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        }
        else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    };
    ;
    ReviewsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-reviews',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\reviews\reviews.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      所有评论\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button (tap)="changeAll()" [hidden]="!df_checkbox">编辑</button>\n\n      <button ion-button (tap)="changeAll()" [hidden]="df_checkbox">取消</button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="not-reviews-data"></div>\n\n  <ion-list >\n\n\n\n    <ion-item *ngFor="let review of reviews">\n\n      <ion-label>\n\n        <div class="review-item">\n\n          <p class="re-title">\n\n            <label class="book-name">《{{review.book_name}}》</label>\n\n            <label class="book-time">{{formatMsgTime(review.create_time)}}</label>\n\n\n\n            <span class="u-dianzan">\n\n              <i class="iconfont icon-dz"></i>{{review.praise_count}}\n\n            </span>\n\n          </p>\n\n          <p>{{review.review_content}}</p>\n\n        </div>\n\n      </ion-label>\n\n      <ion-checkbox [(ngModel)]="review.select" color="danger" [hidden]="df_checkbox"></ion-checkbox>\n\n    </ion-item>\n\n\n\n  </ion-list>\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [hidden]="param.pages == param.pageNum || reviews.length == 0">\n\n      <ion-infinite-scroll-content loadingText="请稍等, 正在加载!"></ion-infinite-scroll-content>\n\n    </ion-infinite-scroll>\n\n</ion-content>\n\n<ion-footer class="footer" [hidden]="df_footer">\n\n  <button ion-button color="danger" full style="margin:0" (tap)="clearAll()">删除{{total}}条评论</button>    \n\n</ion-footer>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\reviews\reviews.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], ReviewsPage);
    return ReviewsPage;
}());

//# sourceMappingURL=reviews.js.map

/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(389);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export interceptorFactory */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_city_city__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_find_find__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_center_center__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_qiandao_qiandao__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_search_search__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_register_register__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_resetpwd_resetpwd__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_qiandaoremark_qiandaoremark__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_classify_classify__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_recharge_recharge__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_ycorder_ycorder__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_cborder_cborder__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_classifylist_classifylist__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_xianmian_xianmian__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_cbnewbook_cbnewbook__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_cbhotbook_cbhotbook__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_cbtjbook_cbtjbook__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_tjbook_tjbook__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_caogen_caogen__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_caogeninfo_caogeninfo__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_yctypebook_yctypebook__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_mulu_mulu__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_seting_seting__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_nickname_nickname__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_qianming_qianming__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_phone_phone__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_email_email__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_readjilu_readjilu__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_reviews_reviews__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_sendreview_sendreview__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_bookreviews_bookreviews__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ionic_native_splash_screen__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_device__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_status_bar__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ionic_native_dialogs__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ionic_native_file__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_file_transfer__ = __webpack_require__(265);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_barcode_scanner__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ionic_native_image_picker__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__ionic_native_camera__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__angular_http__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__http_service__ = __webpack_require__(433);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




//页面



































//插件









//公共服务



function interceptorFactory(xhrBackend, requestOptions) {
    var service = new __WEBPACK_IMPORTED_MODULE_50__http_service__["a" /* HttpService */](xhrBackend, requestOptions);
    return service;
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_center_center__["a" /* CenterPage */], __WEBPACK_IMPORTED_MODULE_6__pages_city_city__["a" /* CityPage */], __WEBPACK_IMPORTED_MODULE_7__pages_find_find__["a" /* FindPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_qiandao_qiandao__["a" /* QiandaoPage */], __WEBPACK_IMPORTED_MODULE_10__pages_search_search__["a" /* SearchPage */], __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* LoginPage */], __WEBPACK_IMPORTED_MODULE_12__pages_register_register__["a" /* RegisterPage */], __WEBPACK_IMPORTED_MODULE_13__pages_resetpwd_resetpwd__["a" /* ResetpwdPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_recharge_recharge__["a" /* RechargePage */], __WEBPACK_IMPORTED_MODULE_25__pages_bookinfo_bookinfo__["a" /* BookInfoPage */], __WEBPACK_IMPORTED_MODULE_29__pages_mulu_mulu__["a" /* MuluPage */], __WEBPACK_IMPORTED_MODULE_38__pages_bookreviews_bookreviews__["a" /* BookReviewsPage */], __WEBPACK_IMPORTED_MODULE_37__pages_sendreview_sendreview__["a" /* SendReviewPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_readjilu_readjilu__["a" /* ReadJiluPage */], __WEBPACK_IMPORTED_MODULE_36__pages_reviews_reviews__["a" /* ReviewsPage */], __WEBPACK_IMPORTED_MODULE_30__pages_seting_seting__["a" /* SetingPage */], __WEBPACK_IMPORTED_MODULE_15__pages_classify_classify__["a" /* ClassifyPage */], __WEBPACK_IMPORTED_MODULE_19__pages_classifylist_classifylist__["a" /* ClassifyListPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_nickname_nickname__["a" /* NickNamePage */], __WEBPACK_IMPORTED_MODULE_32__pages_qianming_qianming__["a" /* QianmingPage */], __WEBPACK_IMPORTED_MODULE_33__pages_phone_phone__["a" /* PhonePage */], __WEBPACK_IMPORTED_MODULE_34__pages_email_email__["a" /* EmailPage */], __WEBPACK_IMPORTED_MODULE_14__pages_qiandaoremark_qiandaoremark__["a" /* QiandaoRemarkPage */], __WEBPACK_IMPORTED_MODULE_20__pages_xianmian_xianmian__["a" /* XianmianPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_caogen_caogen__["a" /* CaogenPage */], __WEBPACK_IMPORTED_MODULE_27__pages_caogeninfo_caogeninfo__["a" /* CaogenInfoPage */], __WEBPACK_IMPORTED_MODULE_17__pages_ycorder_ycorder__["a" /* YcOrderPage */], __WEBPACK_IMPORTED_MODULE_28__pages_yctypebook_yctypebook__["a" /* YcTypeBookPage */], __WEBPACK_IMPORTED_MODULE_18__pages_cborder_cborder__["a" /* CbOrderPage */], __WEBPACK_IMPORTED_MODULE_23__pages_cbtjbook_cbtjbook__["a" /* CbTjBookPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_cbnewbook_cbnewbook__["a" /* CbNewBookPage */], __WEBPACK_IMPORTED_MODULE_22__pages_cbhotbook_cbhotbook__["a" /* CbHotBookPage */], __WEBPACK_IMPORTED_MODULE_24__pages_tjbook_tjbook__["a" /* TjBookPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_48__angular_http__["d" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {
                    pageTransition: 'md-transition',
                    backButtonText: '',
                    backButtonIcon: 'iconfont-icon-rt',
                    tabsHideOnSubPages: 'true' //隐藏全部子页面tabs
                }, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_center_center__["a" /* CenterPage */], __WEBPACK_IMPORTED_MODULE_6__pages_city_city__["a" /* CityPage */], __WEBPACK_IMPORTED_MODULE_7__pages_find_find__["a" /* FindPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_qiandao_qiandao__["a" /* QiandaoPage */], __WEBPACK_IMPORTED_MODULE_10__pages_search_search__["a" /* SearchPage */], __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* LoginPage */], __WEBPACK_IMPORTED_MODULE_12__pages_register_register__["a" /* RegisterPage */], __WEBPACK_IMPORTED_MODULE_13__pages_resetpwd_resetpwd__["a" /* ResetpwdPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_recharge_recharge__["a" /* RechargePage */], __WEBPACK_IMPORTED_MODULE_25__pages_bookinfo_bookinfo__["a" /* BookInfoPage */], __WEBPACK_IMPORTED_MODULE_29__pages_mulu_mulu__["a" /* MuluPage */], __WEBPACK_IMPORTED_MODULE_38__pages_bookreviews_bookreviews__["a" /* BookReviewsPage */], __WEBPACK_IMPORTED_MODULE_37__pages_sendreview_sendreview__["a" /* SendReviewPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_readjilu_readjilu__["a" /* ReadJiluPage */], __WEBPACK_IMPORTED_MODULE_36__pages_reviews_reviews__["a" /* ReviewsPage */], __WEBPACK_IMPORTED_MODULE_30__pages_seting_seting__["a" /* SetingPage */], __WEBPACK_IMPORTED_MODULE_15__pages_classify_classify__["a" /* ClassifyPage */], __WEBPACK_IMPORTED_MODULE_19__pages_classifylist_classifylist__["a" /* ClassifyListPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_nickname_nickname__["a" /* NickNamePage */], __WEBPACK_IMPORTED_MODULE_32__pages_qianming_qianming__["a" /* QianmingPage */], __WEBPACK_IMPORTED_MODULE_33__pages_phone_phone__["a" /* PhonePage */], __WEBPACK_IMPORTED_MODULE_34__pages_email_email__["a" /* EmailPage */], __WEBPACK_IMPORTED_MODULE_14__pages_qiandaoremark_qiandaoremark__["a" /* QiandaoRemarkPage */], __WEBPACK_IMPORTED_MODULE_20__pages_xianmian_xianmian__["a" /* XianmianPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_caogen_caogen__["a" /* CaogenPage */], __WEBPACK_IMPORTED_MODULE_27__pages_caogeninfo_caogeninfo__["a" /* CaogenInfoPage */], __WEBPACK_IMPORTED_MODULE_17__pages_ycorder_ycorder__["a" /* YcOrderPage */], __WEBPACK_IMPORTED_MODULE_28__pages_yctypebook_yctypebook__["a" /* YcTypeBookPage */], __WEBPACK_IMPORTED_MODULE_18__pages_cborder_cborder__["a" /* CbOrderPage */], __WEBPACK_IMPORTED_MODULE_23__pages_cbtjbook_cbtjbook__["a" /* CbTjBookPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_cbnewbook_cbnewbook__["a" /* CbNewBookPage */], __WEBPACK_IMPORTED_MODULE_22__pages_cbhotbook_cbhotbook__["a" /* CbHotBookPage */], __WEBPACK_IMPORTED_MODULE_24__pages_tjbook_tjbook__["a" /* TjBookPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_50__http_service__["a" /* HttpService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_48__angular_http__["c" /* Http */],
                    useFactory: interceptorFactory,
                    deps: [__WEBPACK_IMPORTED_MODULE_48__angular_http__["f" /* XHRBackend */], __WEBPACK_IMPORTED_MODULE_48__angular_http__["e" /* RequestOptions */]]
                },
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_39__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_49__app_service__["a" /* AppService */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_device__["a" /* Device */], __WEBPACK_IMPORTED_MODULE_42__ionic_native_dialogs__["a" /* Dialogs */], __WEBPACK_IMPORTED_MODULE_43__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_44__ionic_native_file_transfer__["a" /* FileTransfer */],
                __WEBPACK_IMPORTED_MODULE_46__ionic_native_image_picker__["a" /* ImagePicker */], __WEBPACK_IMPORTED_MODULE_45__ionic_native_barcode_scanner__["a" /* BarcodeScanner */], __WEBPACK_IMPORTED_MODULE_47__ionic_native_camera__["a" /* Camera */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RechargePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RechargePage = /** @class */ (function () {
    function RechargePage(navCtrl, params, platform, service, actionsheetCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.params = params;
        this.platform = platform;
        this.service = service;
        this.actionsheetCtrl = actionsheetCtrl;
        this.payNum = 0;
        this.backButtonClick = function (e) {
            if (jQuery.readerParam) {
                var options = {
                    ctxPath: _this.service.ctxPath.toString(),
                    chid: jQuery.readerParam.chid + '',
                    pagenum: jQuery.readerParam.pagenum + '',
                    eventkey: jQuery.readerParam.eventkey + '',
                    bookid: jQuery.readerParam.bookid + '',
                    bookname: jQuery.readerParam.bookname + '',
                    booktype: jQuery.readerParam.booktype + '',
                    userid: _this.service.LoginUserInfo.member_id.toString(),
                    token: _this.service.LoginUserInfo.token.toString()
                };
                navigator.BookRead.reader(options);
            }
            else {
                _this.navCtrl.pop();
            }
        };
    }
    //返回事件重置
    RechargePage.prototype.ionViewDidLoad = function () {
        this.navBar.backButtonClick = this.backButtonClick;
    };
    RechargePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.service.statusBar.styleDefault();
        //再次验证token 是否有效
        this.service.post('/v2/api/mobile/memberInfo').then(function (success) {
            if (success.code == 600) {
                _this.service.dialogs.alert('登录信息失效, 需要你重新登录', '系统验证', '确定').then(function (res) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                });
            }
        });
    };
    RechargePage.prototype.setPageNun = function (n) {
        var _this = this;
        this.payNum = n;
        //android
        if (!this.platform.is('ios')) {
            var actionSheet = this.actionsheetCtrl.create({
                title: '请选择支付方式',
                cssClass: 'action-sheets-basic-page',
                buttons: [
                    {
                        text: '支付宝支付',
                        role: 'destructive',
                        icon: 'alipay',
                        handler: function () {
                            _this.alipayTo();
                        }
                    },
                    {
                        text: '微信支付',
                        icon: 'weixinpay',
                        handler: function () {
                            _this.weixinpayTo();
                        }
                    }
                ]
            });
            actionSheet.present();
        }
        else {
            //ios 内购
            this.iospay();
        }
    };
    RechargePage.prototype.iospay = function () {
        var _this = this;
        var payid = 'cjzww6.0';
        var parNum = 600;
        if (this.payNum == 30) {
            payid = 'cjzww30.0';
            parNum = 3300;
        }
        if (this.payNum == 50) {
            payid = 'cjzww50.0';
            parNum = 6250;
        }
        if (this.payNum == 98) {
            payid = 'cjzww98.0';
            parNum = 14800;
        }
        if (this.payNum == 198) {
            payid = 'cjzww198.0';
            parNum = 34800;
        }
        if (this.payNum == 298) {
            payid = 'cjzww298.0';
            parNum = 59800;
        }
        this.service.loadingStart();
        inAppPurchase.getProducts([payid])
            .then(function (products) {
            inAppPurchase.buy(payid)
                .then(function (data) {
                //添加充值记录
                _this.service.post('/v3/app/payRecord', {
                    pay_type: 'ios',
                    amount: _this.payNum
                });
                var d_num = localStorage.getItem('choujiang_num');
                if (!d_num || d_num == '' || isNaN(d_num)) {
                    d_num = 0;
                }
                else {
                    d_num = parseInt(d_num) + 1;
                }
                localStorage.setItem('choujiang_num', d_num.toString());
                //添加长江币
                _this.service.post('/v3/payAmount/addCut', {
                    amount: parNum,
                    action: 'add'
                }).then(function (addSuccess) {
                    _this.service.loadingEnd();
                    _this.service.getUserInfo();
                    _this.service.dialogs.alert('恭喜你成功充值' + parNum + '个长江币', '提示', '确定');
                });
            })
                .catch(function (err) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(err.errorMessage, '错误', '确定');
            });
        })
            .catch(function (err) {
            _this.service.loadingEnd();
            _this.service.dialogs.alert(err.errorMessage, '错误', '确定');
        });
    };
    RechargePage.prototype.weixinpayTo = function () {
        var _this = this;
        this.service.post('/v3/app/payOrder', {
            pay_type: 'weixin',
            amount: this.payNum
        }).then(function (success) {
            var data = success.data;
            var weixin = navigator.weixin;
            weixin.sendPayReq({
                "appid": "wx1726323de580e8ba",
                "urlString": "http://91tkp.com:3001/wxSign",
                "method": "post",
                "data": {
                    "return_code": data.return_code,
                    "return_msg": data.return_msg,
                    "appid": data.appid,
                    "mch_id": data.mch_id,
                    "nonce_str": data.nonce_str,
                    "sign": data.sign,
                    "result_code": data.result_code,
                    "prepay_id": data.prepay_id,
                    "trade_type": data.trade_type,
                    "timestamp": data.timestamp,
                    "siteSign": data.siteSign
                }
            }, function (retcode) {
                if (retcode == 0) {
                    //添加充值记录
                    _this.service.post('/v3/app/payRecord', {
                        pay_type: 'weixin',
                        amount: _this.payNum
                    });
                    var d_num = localStorage.getItem('choujiang_num');
                    if (!d_num || d_num == '' || isNaN(d_num)) {
                        d_num = 0;
                    }
                    else {
                        d_num = parseInt(d_num) + 1;
                    }
                    localStorage.setItem('choujiang_num', d_num.toString());
                    _this.service.dialogs.alert("充值成功!", '充值提示', '确定');
                }
            }, function (message) {
                _this.service.dialogs.alert("充值失败:" + message, '充值提示', '确定');
            });
        });
    };
    RechargePage.prototype.alipayTo = function () {
        var _this = this;
        this.service.post('/v3/app/payOrder', {
            pay_type: 'alipay',
            amount: this.payNum
        }).then(function (success) {
            var data = success.data;
            var rsa = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBALTdMPtfphiRr0DdrjAXwSEseQm9E52WG/33kwzx2LVFKXSVBb3KhO7wEeBiKvkYvvHPaCJ2uicmn0SfOX412Fu3/3WDOP2Yj3UW66LMSDhrJ6vV3dafHy7cfj0lqNb6rEgND47NjYyjxLHzsMDNBxa8tMQzFE+vukizy3iXcl9nAgMBAAECgYApwePcNbIofAJFbKkZy3I4kYcEe5X6zTx7P1zBIVlSSLyQgROJRSe57s2By8h2KIN1WtiFFHpYLa+Z7VUd0Zq49t1h5/yBjiTuHlDW7xZFInIdaNhTIeuShXCV1sgn8Ea5/gM3fLu3MTfBXd3YeoNVukkYp5om8yg0uzFuVCNp8QJBAOKIbhy9mWuR4hEO1Ha8JLbNoYHbpgXvr/psIVfY43S6Z/bfAckVyEWfzkGqsfosBHINIwZa/Sz3IQXW3dwDpZkCQQDMY/tqXcp9hC08DfOBmb5jIwFt8yHkRtHAbyQWh6UDHdfRV9P+PP31+ass/JgqUA/G8a9F9AnbE4434CyqP0z/AkEAjrp/BkS/gXMtCKpbW2Q3jaYJ+JO4C011h0bRy1OwHD/GeVkQ+u1qfdOuVNmDwagyNNnqE3sIwWgDunYi2xjBIQJBAJuZMflT1aegTF9/r3Vmec43BAuUIKUMVPpOogaU1UZ+HaK9XiIahKwRmgLxeVYdBSXLMEfs9OPXC1n2S4qADjkCQQDT27nfEXDiAKZXYzBUVqw4WiScuyEHZH9QA7mMYNBJUGGuRou4FIV7RWejnWSd5VTP0udOdBGGviYWdUyFKgjQ";
            var pubRsa = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB";
            data.rsa_private = rsa;
            data.rsa_public = pubRsa;
            navigator.alipay.pay({
                "partner": data.partner,
                "rsa_private": rsa,
                "rsa_public": pubRsa,
                "seller": data.seller_id,
                "subject": data.subject,
                "body": data.body,
                "price": data.total_fee,
                "tradeNo": data.out_trade_no,
                "timeout": data.it_b_pay,
                "notifyUrl": 'http://www.cjzww.com/interface/MobInterface/alipay/notify_url.php' //data.notify_url
            }, function (success) {
                var choujiang_num = 0;
                var d_num = localStorage.getItem('choujiang_num');
                if (!d_num || d_num == '' || isNaN(d_num)) {
                    d_num = 0;
                }
                else {
                    d_num = parseInt(d_num);
                }
                if (success == 9000) {
                    choujiang_num = 1;
                    _this.service.dialogs.alert("充值成功!", '充值提示', '确定');
                }
                else if (success == 8000) {
                    choujiang_num = 1;
                    _this.service.dialogs.alert("订单已发送，正在处理中!", '充值提示', '确定');
                }
                else if (success == 4000) {
                    _this.service.dialogs.alert("订单支付失败,请稍后再试!", '充值提示', '确定');
                }
                else if (success == 6001) {
                    console.log("用户中途取消:" + success);
                }
                else if (success == 6002) {
                    _this.service.dialogs.alert("网络连接出错,请稍后再试!", '充值提示', '确定');
                }
                else {
                    choujiang_num = 1;
                    _this.service.dialogs.alert("充值成功!", '充值提示', '确定');
                }
                if (choujiang_num > 0) {
                    //添加充值记录
                    _this.service.post('/v3/app/payRecord', {
                        pay_type: 'alipay',
                        amount: _this.payNum
                    });
                    choujiang_num = d_num + 1;
                    localStorage.setItem('choujiang_num', choujiang_num.toString());
                }
            }, function (error) {
                _this.service.dialogs.alert('支付失败~[' + error + ']', '失败', '确定');
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Navbar */])
    ], RechargePage.prototype, "navBar", void 0);
    RechargePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-recharge',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\recharge\recharge.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      充值中心\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="cz-conn">\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 6}" (tap)="setPageNun(6)">\n\n      <h3>6元</h3>\n\n      <p>600长江币</p>\n\n      <em class="cc-1"></em>\n\n    </div>\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 30}" (tap)="setPageNun(30)">\n\n      <h3>30元</h3>\n\n      <p>3000长江币</p>\n\n      <em class="cc-2"></em>\n\n    </div>\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 50}" (tap)="setPageNun(50)">\n\n      <h3>50元</h3>\n\n      <p>5000长江币</p>\n\n      <em class="cc-3"></em>\n\n    </div>\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 98}" (tap)="setPageNun(98)">\n\n      <h3>98元</h3>\n\n      <p>9800长江币</p>\n\n      <em class="cc-4"></em>\n\n    </div>\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 198}" (tap)="setPageNun(198)">\n\n      <h3>198元</h3>\n\n      <p>19800长江币</p>\n\n      <em class="cc-5"></em>\n\n    </div>\n\n    <div class="cm-item" [ngClass]="{\'active\': payNum == 298}" (tap)="setPageNun(298)">\n\n      <h3>298元</h3>\n\n      <p>29800长江币</p>\n\n      <em class="cc-6"></em>\n\n    </div>\n\n\n\n    <div class="ts-msg">\n\n      <span>温馨提示</span>\n\n      <p>1. 1元人民币=100长江币</p>\n\n      <p>2. 用户每充值一次，可获得一定数额的长江币和一次免费补签的机会。</p>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\recharge\recharge.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], RechargePage);
    return RechargePage;
}());

//# sourceMappingURL=recharge.js.map

/***/ }),

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(266);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(ionicApp, platform, splashScreen, service, toastCtrl) {
        var _this = this;
        this.ionicApp = ionicApp;
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.service = service;
        this.toastCtrl = toastCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        this.backButtonPressed = false; //用于判断返回键是否触发
        platform.ready().then(function () {
            _this.service.init(function () {
                //判断是否有网络
                if (_this.service.getNetEork() != 'none' || _this.service.platformName == 'weixin') {
                    var param = {
                        account: new Date().getTime(),
                        pwd: '123456'
                    };
                    if (_this.service.LoginUserInfo) {
                        param.account = _this.service.LoginUserInfo.account;
                        param.pwd = _this.service.LoginUserInfo.pwd;
                        //重新登录
                        _this.login(param);
                    }
                    else {
                        _this.registe(param);
                    }
                }
                else {
                    _this.service.unRefreshBookshelf = true;
                    //隐藏启动页
                    _this.splashScreen.hide();
                }
            });
            _this.registerBackButtonAction(); //注册返回按键事件
        });
    }
    MyApp.prototype.registerBackButtonAction = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function () {
            //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
            // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
            var activePortal = _this.ionicApp._modalPortal.getActive();
            if (activePortal) {
                activePortal.dismiss().catch(function () { });
                activePortal.onDidDismiss(function () { });
                return;
            }
            var activeVC = _this.nav.getActive();
            var tabs = activeVC.instance.tabs;
            var activeNav = tabs.getSelected();
            return activeNav.canGoBack() ? activeNav.pop() : _this.showExit();
        }, 1);
    };
    //双击退出提示框
    MyApp.prototype.showExit = function () {
        var _this = this;
        if (this.backButtonPressed) {
            this.platform.exitApp();
        }
        else {
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'top'
            }).present();
            this.backButtonPressed = true;
            setTimeout(function () { return _this.backButtonPressed = false; }, 2000); //2秒内没有再次点击返回则将触发标志标记为false
        }
    };
    //注册
    MyApp.prototype.registe = function (param) {
        var _this = this;
        this.service.post("/v2/api/mobile/registe", param).then(function (success) {
            console.log(success);
            _this.login(param);
        }, function (error) {
            _this.service.unRefreshBookshelf = true;
            //隐藏启动页
            _this.splashScreen.hide();
        });
    };
    //登录
    MyApp.prototype.login = function (param) {
        var _this = this;
        this.service.post('/v2/api/mobile/login', param).then(function (success) {
            console.log(success);
            if (success.code == 0) {
                _this.service.LoginUserInfo = success.data;
                _this.service.LoginUserInfo.pwd = param.pwd;
                _this.service.token = success.data.token;
                //存储用户信息
                localStorage.setItem('LoginUserInfo', JSON.stringify(_this.service.LoginUserInfo));
                _this.service.unRefreshBookshelf = true;
                //隐藏启动页
                _this.splashScreen.hide();
            }
            else {
                localStorage.removeItem('LoginUserInfo');
                _this.service.LoginUserInfo = null;
                _this.service.unRefreshBookshelf = true;
                //隐藏启动页
                _this.splashScreen.hide();
            }
        }, function (error) {
            _this.service.unRefreshBookshelf = true;
            //隐藏启动页
            _this.splashScreen.hide();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('myNav'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"D:\Java_home\ionic317\src\app\app.html"*/'<ion-nav #myNav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"D:\Java_home\ionic317\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* IonicApp */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_3__app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 433:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HttpService = /** @class */ (function (_super) {
    __extends(HttpService, _super);
    function HttpService(backend, defaultOptions) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.status = {
            "status.400": "错误的请求。由于语法错误，该请求无法完成。",
            "status.401": "未经授权。服务器拒绝响应。",
            "status.403": "已禁止。服务器拒绝响应。",
            "status.404": "未找到。无法找到请求的位置。",
            "status.405": "方法不被允许。使用该位置不支持的请求方法进行了请求。",
            "status.406": "不可接受。服务器只生成客户端不接受的响应。",
            "status.407": "需要代理身份验证。客户端必须先使用代理对自身进行身份验证。",
            "status.408": "请求超时。等待请求的服务器超时。",
            "status.409": "冲突。由于请求中的冲突，无法完成该请求。",
            "status.410": "过期。请求页不再可用。",
            "status.411": "长度必需。未定义“内容长度”。",
            "status.412": "前提条件不满足。请求中给定的前提条件由服务器评估为 false。",
            "status.413": "请求实体太大。服务器不会接受请求，因为请求实体太大。",
            "status.414": "请求 URI 太长。服务器不会接受该请求，因为 URL 太长。",
            "status.415": "不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。",
            "status.416": "HTTP 状态代码 {0}",
            "status.500": "内部服务器错误。",
            "status.501": "未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。",
            "status.503": "服务不可用。服务器当前不可用(过载或故障)。"
        };
        return _this;
    }
    HttpService.prototype.request = function (url, options) {
        //根据不同的生产环境配置http前缀
        typeof url == 'string' ? url : url.url;
        return this.intercept(_super.prototype.request.call(this, url, options));
    };
    HttpService.prototype.get = function (url, options) {
        return this.intercept(_super.prototype.get.call(this, url, options)).map(function (res) { return res.json(); });
    };
    HttpService.prototype.post = function (url, body, options) {
        return this.intercept(_super.prototype.post.call(this, url, body, this.getRequestOptionArgs(options))).map(function (res) { return res.json(); });
    };
    HttpService.prototype.put = function (url, body, options) {
        return this.intercept(_super.prototype.put.call(this, url, body, this.getRequestOptionArgs(options)));
    };
    HttpService.prototype.delete = function (url, options) {
        return this.intercept(_super.prototype.put.call(this, url, this.getRequestOptionArgs(options)));
    };
    HttpService.prototype.getRequestOptionArgs = function (options) {
        if (options == null) {
            options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]();
        }
        if (options.headers == null) {
            options.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        }
        options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return options;
    };
    HttpService.prototype.intercept = function (observable) {
        return observable.catch(function (err, source) {
            jQuery('ion-loading').remove();
            // if (err.status < 200 || err.status >= 300) {
            //   return Observable.empty();
            // } else {
            //   return Observable.throw(err);
            // }
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
        //return observable;
    };
    HttpService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* ConnectionBackend */], __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]])
    ], HttpService);
    return HttpService;
}(__WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]));

//# sourceMappingURL=http.service.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClassifyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classifylist_classifylist__ = __webpack_require__(143);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ClassifyPage = /** @class */ (function () {
    function ClassifyPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.mcType = 'nv';
    }
    ClassifyPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //获取分类
    ClassifyPage.prototype.get_ClassList = function (type) {
        var _this = this;
        this.service.post('/v3/api/bookCat/repoList', {
            pid: null,
            channel: type
        }).then(function (success) {
            if (success.code == 600) {
                _this.service.loadingEnd();
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }
            else if (success.code != 0) {
                _this.service.loadingEnd();
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
            else {
                if (type == 0) {
                    _this.c_nv = success.data;
                }
                if (type == 1) {
                    _this.c_nan = success.data;
                }
                if (type == 2) {
                    _this.c_cb = success.data;
                }
            }
        });
    };
    ClassifyPage.prototype.toClassifyList = function (id, name, bookChannel) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__classifylist_classifylist__["a" /* ClassifyListPage */], {
            id: id,
            name: name,
            bookChannel: bookChannel
        });
    };
    ClassifyPage.prototype.ionViewDidLoad = function () {
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
        }
        else {
            jQuery('.page-notwork').hide();
            jQuery('.has-wifi').show();
            this.get_ClassList(0);
            this.get_ClassList(1);
            this.get_ClassList(2);
        }
    };
    ClassifyPage.prototype.set_class = function (tt) {
        this.mcType = tt;
    };
    ClassifyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-classify',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\classify\classify.html"*/'<ion-header color="light">\n\n  <ion-navbar color="light">\n\n    <ion-title>\n\n      分类\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="classify-left">\n\n    <span class="active" [ngClass]="{\'active\':mcType == \'nv\'}" (tap)="set_class(\'nv\')">女频</span>\n\n    <span class="active" [ngClass]="{\'active\':mcType == \'nan\'}" (tap)="set_class(\'nan\')">男频</span>\n\n    <span class="active" [ngClass]="{\'active\':mcType == \'cp\'}" (tap)="set_class(\'cp\')">出版</span>\n\n  </div>\n\n  <div class="classify-right">\n\n    <div class="page-notwork" (tap)="ionViewDidLoad()"></div>\n\n    <div class="has-wifi">\n\n      <div class="nv-con nnn-con" [hidden]="mcType!=\'nv\'">\n\n        <div class="cc-item" *ngFor="let cat of c_nv">\n\n          <div class="cc-cpver" (tap)="toClassifyList(cat.book_cat_id,cat.book_cat_name,0)">\n\n            <img src="assets/img/cd-nv-{{cat.book_cat_id}}.png" />\n\n            <p>{{cat.book_cat_name}}</p>\n\n          </div>\n\n        </div>\n\n      </div>\n\n      <div class="nan-con nnn-con" [hidden]="mcType!=\'nan\'">\n\n        <div class="cc-item" *ngFor="let cat of c_nan">\n\n          <div class="cc-cpver" (tap)="toClassifyList(cat.book_cat_id,cat.book_cat_name,1)">\n\n            <img src="assets/img/cd-nan-{{cat.book_cat_id}}.png" />\n\n            <p>{{cat.book_cat_name}}</p>\n\n          </div>\n\n        </div>\n\n      </div>\n\n      <div class="cp-con nnn-con" [hidden]="mcType!=\'cp\'">\n\n        <div class="cc-item" *ngFor="let cat of c_cb">\n\n          <div class="cc-cpver" (tap)="toClassifyList(cat.book_cat_id,cat.book_cat_name,2)">\n\n            <img src="assets/img/{{cat.book_cat_id}}.png" />\n\n            <p>{{cat.book_cat_name}}</p>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\classify\classify.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__app_app_service__["a" /* AppService */]])
    ], ClassifyPage);
    return ClassifyPage;
}());

//# sourceMappingURL=classify.js.map

/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_dialogs__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__ = __webpack_require__(265);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var AppService = /** @class */ (function () {
    function AppService(loadingCtrl, http, device, ngFile, dialogs, transfer, statusBar) {
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.device = device;
        this.ngFile = ngFile;
        this.dialogs = dialogs;
        this.transfer = transfer;
        this.statusBar = statusBar;
        this.savePath = ''; //保存地址
        this.unRefreshBookshelf = false; //是否刷新书架
        this.updateBookInfoReviews = false;
        this.network = 'wifi';
        this.ctxPath = 'http://cjzww.cjszyun.net';
    }
    //服务初始化
    AppService.prototype.init = function (callback) {
        var _this = this;
        this.version = '2.2.7';
        this.version_code = 227;
        this.version_remark = '长江阅读APP发布!';
        this.platformName = this.device.platform ? this.device.platform.toLocaleLowerCase() : 'weixin';
        this.LoginUserInfo = JSON.parse(localStorage.getItem('LoginUserInfo'));
        this.token = this.LoginUserInfo ? this.LoginUserInfo.token : null;
        if (callback) {
            callback();
        }
        if (this.platformName != 'weixin') {
            //初始化文件对象
            this.fileTransfer = this.transfer.create();
            if (this.platformName == 'ios') {
                //文件存储路径
                this.savePath = this.ngFile.dataDirectory;
            }
            else {
                //文件存储路径
                this.savePath = this.ngFile.externalApplicationStorageDirectory;
            }
            //删除原来的目录
            //判断是否已经存在默认必须的3个文件路径  book  cover  user
            this.ngFile.checkDir(this.savePath + 'files/', 'book').then(function (success) {
                console.log('存在book目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'book', false);
            });
            this.ngFile.checkDir(this.savePath + 'files/', 'cover').then(function (success) {
                console.log('存在cover目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'cover', false);
            });
            this.ngFile.checkDir(this.savePath + 'files/', 'user').then(function (success) {
                console.log('存在user目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'user', false);
            });
        }
    };
    AppService.prototype.loadingStart = function (txt) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    };
    AppService.prototype.loadingEnd = function () {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    };
    AppService.prototype.getNetEork = function () {
        return this.network;
    };
    AppService.prototype.post = function (url, body) {
        var _this = this;
        body = body ? body : {};
        body.token_type = this.platformName;
        body.member_token = this.token;
        body.client_type = 'DZ';
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        console.log(url);
        body = jQuery.param(body);
        console.log(body);
        //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        //let options = new RequestOptions({headers: headers});
        this.network = 'wifi';
        var pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(function (error) {
            _this.network = 'none';
        });
        return pos;
    };
    AppService.prototype.getUserInfo = function () {
        var _this = this;
        this.post('/v2/api/mobile/memberInfo').then(function (success) {
            var data = success.data;
            data.pwd = _this.LoginUserInfo.pwd;
            data.token = _this.LoginUserInfo.token;
            _this.LoginUserInfo = data;
            //存储用户信息
            localStorage.setItem('LoginUserInfo', JSON.stringify(_this.LoginUserInfo));
        });
    };
    AppService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__["a" /* Device */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_dialogs__["a" /* Dialogs */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */]])
    ], AppService);
    return AppService;
}());

//# sourceMappingURL=app.service.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_service__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classify_classify__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__bookinfo_bookinfo__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SearchPage = /** @class */ (function () {
    function SearchPage(navCtrl, barcodeScanner, service) {
        this.navCtrl = navCtrl;
        this.barcodeScanner = barcodeScanner;
        this.service = service;
        this.unbarcodeScanner = true; //限制扫码
        this.hotKeys = [];
        this.searchKeys = [];
        this.showSearchForm = true;
        this.pet = 'yuanchuang';
        this.segmentsArray = ['yuanchuang', 'chuban'];
        this.ajaxBool_yuanchuang = true;
        this.ajaxBool_chuban = true;
        this.param_yuanchuan = {
            book_type: 1,
            searchText: null,
            pageNum: 0,
            pageSize: 20,
            pages: 1,
            total: 0
        };
        this.yuanchuan_book = [];
        this.param_chuban = {
            book_type: 2,
            searchText: null,
            pageNum: 0,
            pageSize: 20,
            pages: 1,
            total: 0
        };
        this.chuban_book = [];
    }
    SearchPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleDefault();
    };
    //图书详情
    SearchPage.prototype.toBookInfo = function (book_id, book_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__bookinfo_bookinfo__["a" /* BookInfoPage */], {
            book_id: book_id,
            book_type: book_type
        });
    };
    //图书分类
    SearchPage.prototype.openModal = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__classify_classify__["a" /* ClassifyPage */]);
    };
    SearchPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.myScroll = jQuery('#scroller1').on('scroll', function () {
            var div = document.getElementById('scroller1');
            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                if (_this.ajaxBool_yuanchuang && _this.param_yuanchuan.pages > _this.param_yuanchuan.pageNum) {
                    _this.get_yuanchuan();
                }
            }
        });
        this.myScroll_1 = jQuery('#scroller2').on('scroll', function () {
            var div = document.getElementById('scroller2');
            if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
                if (_this.ajaxBool_chuban && _this.param_chuban.pages > _this.param_chuban.pageNum) {
                    _this.get_chuban();
                }
            }
        });
    };
    SearchPage.prototype.segmentChanged = function () {
        var i = this.segmentsArray.indexOf(this.pet);
        this.slides.slideTo(i, 500);
    };
    SearchPage.prototype.slideChanged = function () {
        var currentIndex = this.slides.getActiveIndex();
        if (currentIndex < 2) {
            this.pet = this.segmentsArray[currentIndex];
        }
    };
    SearchPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.service.platformName == 'ios') {
            jQuery('page-search ion-navbar').eq(0).css('opacity', 1);
            var keyCon = jQuery('#fixKeysCon').css('top', jQuery('page-search ion-navbar').eq(1).offset().top);
            keyCon.fadeIn('fast', function () {
                jQuery('page-search ion-navbar').eq(1).css('opacity', 1);
            });
        }
        else {
            jQuery('#fixKeysCon').css('top', jQuery('page-search ion-navbar').eq(1).offset().top);
        }
        setTimeout(function () {
            jQuery('#mySearchInput').focus();
        }, 300);
        if (!this.service.platformName)
            return false;
        //获取最新的热门关键词
        this.service.post('/v3/api/searchKey/getSearchkeyList', {
            display: 10,
            org_id: this.service.LoginUserInfo.org_id
        }).then(function (success) {
            _this.hotKeys = success.data;
        });
        var data = JSON.parse(localStorage.getItem('searchKeys'));
        if (data) {
            this.searchKeys = data;
        }
        else {
            this.searchKeys = [];
        }
    };
    SearchPage.prototype.ionViewWillLeave = function () {
        if (this.service.platformName == 'ios') {
            jQuery('#fixKeysCon').hide();
            jQuery('page-search ion-navbar').css('opacity', 0);
        }
    };
    SearchPage.prototype.search = function () {
        //原创搜索
        this.get_yuanchuan(this.mySearchText);
        this.get_chuban(this.mySearchText);
        jQuery('#fixKeysCon').hide();
        jQuery('#mySearchInput').blur();
        var arr = [{
                name: this.mySearchText
            }];
        //替换目前的搜索内容
        for (var i in this.searchKeys) {
            if (this.searchKeys[i].name != this.mySearchText && arr.length < 10) {
                arr.push(this.searchKeys[i]);
            }
        }
        this.searchKeys = arr;
        localStorage.setItem('searchKeys', JSON.stringify(arr));
    };
    SearchPage.prototype.delSearchKeys = function () {
        this.searchKeys = [];
        localStorage.setItem('searchKeys', '[]');
    };
    //扫码加书
    SearchPage.prototype.saomaAddBook = function () {
        var _this = this;
        if (!this.unbarcodeScanner)
            return false;
        this.unbarcodeScanner = false;
        this.service.dialogs.alert('您正在使用扫码加书功能，请将摄像头对准图书二维码', '温馨提示', '确定').then(function () {
            _this.barcodeScanner.scan().then(function (success) {
                if (success.text) {
                    var search = success.text.split('?')[1];
                    var searchs = search.split('&');
                    var param = {
                        org_id: null,
                        book_id: null,
                        device_id: null,
                        book_type: null
                    };
                    for (var key in searchs) {
                        if (searchs[key].indexOf('o=') != -1) {
                            param['org_id'] = searchs[key].replace('o=', '');
                        }
                        if (searchs[key].indexOf('b=') != -1) {
                            param['book_id'] = searchs[key].replace('b=', '');
                        }
                        if (searchs[key].indexOf('d=') != -1) {
                            param['device_id'] = searchs[key].replace('d=', '');
                        }
                        if (searchs[key].indexOf('t=') != -1) {
                            param['book_type'] = searchs[key].replace('t=', '');
                        }
                    }
                    if (param.org_id && param.book_id) {
                        //添加到书架
                        _this.service.post('/v2/api/bookShelf/addBook', param).then(function (success) {
                            if (success.code == 600) {
                                _this.service.loadingEnd();
                                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
                            }
                            else if (success.code != 0) {
                                _this.service.loadingEnd();
                                _this.service.dialogs.alert(success.message, '提示', '确定');
                            }
                            else {
                                //重新获取书架内容
                                _this.service.unRefreshBookshelf = true;
                                _this.navCtrl.pop();
                            }
                            _this.unbarcodeScanner = true;
                        });
                    }
                    else {
                        _this.service.dialogs.alert('你扫描的二维码有误，请确认后再试!');
                        _this.unbarcodeScanner = true;
                    }
                }
            }, function (error) {
                _this.service.dialogs.alert(error, '提示', '确定');
                _this.unbarcodeScanner = true;
            });
        });
    };
    //搜索
    SearchPage.prototype.toSearchPage = function (key) {
        if (this.service.getNetEork() == 'none') {
            jQuery('.page-notwork').show();
            jQuery('.has-wifi').hide();
            this.nowifi_key = key;
        }
        else {
            jQuery('.page-notwork').hide();
            jQuery('.has-wifi').show();
            //原创搜索
            this.get_yuanchuan(key);
            this.get_chuban(key);
            this.mySearchText = key;
        }
        jQuery('#fixKeysCon').hide();
    };
    SearchPage.prototype.searchFocus = function () {
        jQuery('#fixKeysCon').show();
    };
    //获取原创
    SearchPage.prototype.get_yuanchuan = function (txt) {
        var _this = this;
        if (!this.ajaxBool_yuanchuang)
            return false;
        if (txt) {
            this.param_yuanchuan.searchText = txt;
            this.param_yuanchuan.pageNum = 0;
            this.param_yuanchuan.pages = 1;
            this.yuanchuan_book = [];
            jQuery('#unmore1,#unmore11').hide();
        }
        this.param_yuanchuan.pageNum += 1;
        if (this.param_yuanchuan.pageNum > this.param_yuanchuan.pages) {
            if (!this.yuanchuan_book || this.yuanchuan_book.length == 0) {
                jQuery('#unmore11').show();
            }
            else {
                jQuery('#unmore1').show();
            }
            jQuery('#loading1').hide();
            return false;
        }
        else {
            this.ajaxBool_yuanchuang = false;
            jQuery('#loading1').show();
        }
        this.service.post('/v3/api/search/bookList', this.param_yuanchuan).then(function (success) {
            _this.param_yuanchuan.pages = success.data.pages;
            _this.param_yuanchuan.total = success.data.total;
            for (var i in success.data.rows) {
                _this.yuanchuan_book.push(success.data.rows[i]);
            }
            jQuery('#loading1').hide();
            if (!_this.yuanchuan_book || _this.yuanchuan_book.length == 0) {
                jQuery('#unmore11').show();
            }
            else if (_this.param_yuanchuan.pages == _this.param_yuanchuan.pageNum) {
                jQuery('#unmore1').show();
            }
            _this.ajaxBool_yuanchuang = true;
        });
    };
    //获取出版
    SearchPage.prototype.get_chuban = function (txt) {
        var _this = this;
        if (!this.ajaxBool_chuban)
            return false;
        if (txt) {
            this.param_chuban.searchText = txt;
            this.param_chuban.pageNum = 0;
            this.param_chuban.pages = 1;
            this.chuban_book = [];
            jQuery('#unmore2,#unmore22').hide();
        }
        this.param_chuban.pageNum += 1;
        if (this.param_chuban.pageNum > this.param_chuban.pages) {
            if (!this.chuban_book || this.chuban_book.length == 0) {
                jQuery('#unmore22').show();
            }
            else {
                jQuery('#unmore2').show();
            }
            jQuery('#loading2').hide();
            return false;
        }
        else {
            this.ajaxBool_chuban = false;
            jQuery('#loading2').show();
        }
        this.service.post('/v3/api/search/bookList', this.param_chuban).then(function (success) {
            _this.param_chuban.pages = success.data.pages;
            _this.param_chuban.total = success.data.total;
            for (var i in success.data.rows) {
                _this.chuban_book.push(success.data.rows[i]);
            }
            jQuery('#loading2').hide();
            if (!_this.chuban_book || _this.chuban_book.length == 0) {
                jQuery('#unmore22').show();
            }
            else if (_this.param_chuban.pages == _this.param_chuban.pageNum) {
                jQuery('#unmore2').show();
            }
            _this.ajaxBool_chuban = true;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Slides */])
    ], SearchPage.prototype, "slides", void 0);
    SearchPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-search',template:/*ion-inline-start:"D:\Java_home\ionic317\src\pages\search\search.html"*/'<ion-header>\n\n  <ion-navbar color="light" [ngStyle]="{\'opacity\': service.platformName == \'ios\' ? 0 : 1}" style="border-bottom:1px #eee solid;">\n\n    <div class="searchbar searchbar-ios ng-pristine ng-valid searchbar-left-aligned searchbar-active ng-touched">\n\n      <form class="my-search-form" (submit)="search()">\n\n        <i class="iconfont icon-search"></i>\n\n        <input id="mySearchInput" type="search" [(ngModel)]="mySearchText" name="search" (focus)="searchFocus($event)" />\n\n        <span class="search-saoma" (tap)="saomaAddBook($event)">\n\n          <i class="iconfont icon-saoma1"></i>\n\n        </span>\n\n      </form>\n\n    </div>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (tap)="openModal()">\n\n        <span style="padding: 0 6px;font-size:14px;">分类</span>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n\n\n\n\n  <ion-navbar color="light" style="padding:0;" id="childNavbar" [ngStyle]="{\'opacity\': service.platformName == \'ios\' ? 0 : 1}">\n\n    <div style="width:300px;margin:0 auto;">\n\n      <ion-segment [(ngModel)]="pet" (ionChange)="segmentChanged($event)">\n\n        <ion-segment-button value="yuanchuang">原创</ion-segment-button>\n\n        <ion-segment-button value="chuban">出版</ion-segment-button>\n\n      </ion-segment>\n\n    </div>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-slides (ionSlideDidChange)="slideChanged()" style="background:#fff;border-top:15px #f5f8fa solid;">\n\n    <ion-slide>\n\n      <div class="page-notwork" (tap)="toSearchPage(nowifi_key)"></div>\n\n      <div class="mocc-content has-wifi" id="scroller1">\n\n        <div class="mocc-c-con">\n\n          <div class="book-list-item" *ngFor="let book of yuanchuan_book" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="book-cover">\n\n              <i class="mianfei" *ngIf="book.discount_price == 0"></i>\n\n              <i class="tejia" *ngIf="book.discount_price && book.discount_price > 0"></i>\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n\n            </div>\n\n            <div class="book-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="book-remark">{{book.book_remark}}</div>\n\n              <div class="book-other">\n\n                <label class="book-author">{{book.book_author}}</label>\n\n                <label class="book-cat">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n        </div>\n\n        <div class="loading-text" id="loading1">\n\n          <ion-spinner name="dots"></ion-spinner>\n\n          <div>请稍候，努力加载中</div>\n\n        </div>\n\n        <div class="un-more-data" id="unmore1">共为你找到{{param_yuanchuan.total}}本图书!</div>\n\n        <div class="un-not-data" id="unmore11"></div>\n\n      </div>\n\n    </ion-slide>\n\n    <ion-slide>\n\n      <div class="page-notwork" (tap)="toSearchPage(nowifi_key)"></div>\n\n      <div class="mocc-content has-wifi" id="scroller2">\n\n        <div class="mocc-c-con">\n\n          <div class="book-list-item" *ngFor="let book of chuban_book" (tap)="toBookInfo(book.book_id,book.book_type)">\n\n            <div class="book-cover">\n\n              <i class="mianfei" *ngIf="book.discount_price == 0"></i>\n\n              <i class="tejia" *ngIf="book.discount_price && book.discount_price > 0"></i>\n\n              <img src="{{ service.ctxPath + book.book_cover_small}}" *ngIf="book.book_type == 2" onload="imgLoad(this)" class="opacity_img">\n\n              <img src="{{ book.book_cover_small}}" *ngIf="book.book_type == 1" onload="imgLoad(this)" class="opacity_img">\n\n            </div>\n\n            <div class="book-detail">\n\n              <h1>{{book.book_name}}</h1>\n\n              <div class="book-remark">{{book.book_remark}}</div>\n\n              <div class="book-other">\n\n                <label class="book-author">{{book.book_author}}</label>\n\n                <label class="book-cat">{{book.book_cat_name}}</label>\n\n              </div>\n\n            </div>\n\n          </div>\n\n        </div>\n\n        <div class="loading-text" id="loading2">\n\n          <ion-spinner name="dots"></ion-spinner>\n\n          <div>请稍候，努力加载中</div>\n\n        </div>\n\n        <div class="un-more-data" id="unmore2">共为你找到{{param_chuban.total}}本图书!</div>\n\n        <div class="un-not-data" id="unmore22"></div>\n\n      </div>\n\n    </ion-slide>\n\n  </ion-slides>\n\n</ion-content>\n\n\n\n<div id="fixKeysCon" [ngStyle]="{\'display\': service.platformName == \'ios\' ? \'none\' : \'block\'}">\n\n  <div class="my-search-keys" [hidden]="searchKeys.length == 0">\n\n    <h1>历史搜索\n\n      <span (tap)="delSearchKeys()">\n\n        <i class="iconfont icon-shanchu01"></i>\n\n      </span>\n\n    </h1>\n\n    <a *ngFor="let key of searchKeys;" (tap)="toSearchPage(key.name)">{{key.name}}</a>\n\n  </div>\n\n  <div class="hot-keys" [hidden]="hotKeys.length == 0">\n\n    <h1>热门搜索</h1>\n\n    <a *ngFor="let key of hotKeys;let i=index" (tap)="toSearchPage(key.name)">\n\n      <i>{{(i+1)}}</i>{{key.name}}</a>\n\n  </div>\n\n</div>'/*ion-inline-end:"D:\Java_home\ionic317\src\pages\search\search.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__["a" /* BarcodeScanner */], __WEBPACK_IMPORTED_MODULE_3__app_app_service__["a" /* AppService */]])
    ], SearchPage);
    return SearchPage;
}());

//# sourceMappingURL=search.js.map

/***/ })

},[384]);
//# sourceMappingURL=main.js.map