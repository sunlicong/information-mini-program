//app.js
var api = require('./utils/api.js');
var util = require('./utils/util.js');
App({
    onLaunch(options) {
        // 调试模式
        let debug = this.globalData.debug;
        if (debug) {
            // 测试接口地址
            this.globalData.config.apiDomain = 'http://192.168.33.250:8181';
            this.globalData.config.imgDomain = 'http://demo2.ess.ejucloud.cn/'
            // 打开调试模式
            wx.setEnableDebug({
                enableDebug: true
            });
        }
        console.log(options.query.inviter)
        this.globalData.inviter = options.query.inviter || ''
        this.globalData.token = wx.getStorageSync('token');
        this.globalData.userInfo = wx.getStorageSync('userInfo');
        this.checkIsLogin();
    },
    onShow(options) {
        console.log('onShow===', options)
        let that = this;
        wx.getSystemInfo({
            success: res => {
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.globalData.isIphoneX = true
                }

            }
        })
    },
    //检查是否登录，token是否有效
    checkIsLogin(){
        var that = this;
        var token = wx.getStorageSync('token')
        // 检查用户是否具有登陆态
        if (token) {
            that.checkToken().then((res) => {})
        }else{
            that.toLogin()
        }
    },
    // 判断token是否有效
    checkToken() {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.globalData.config.apiDomain + '/blockchain/v1/user/queryMineProfile',
                method: 'GET',
                header: {
                    'x-app-id': 10001,
                    'content-type': 'application/json',
                    'Authorization': wx.getStorageSync('token')
                },
                success: function (res) {
                    if (res.data.code == 0){
                        resolve(res.data)
                        if (res.data.data.ticketNum > 0) {
                            wx.showTabBarRedDot({
                                index: 2
                            })
                        } else {
                            wx.hideTabBarRedDot({
                                index: 2
                            })
                        }
                    } else if (util.checkCodeIsReLogin(res.data.code)) {//需要重新登录的CODE码
                        that.toLogin()
                    }
                }
            });
        });
    },
    toLogin(callback){
        var that = this;
        //开发，体验模式需要用户手动触发获取用户信息 所以跳转到授权页
        wx.getUserInfo({
            success: function (res) {
                that.wxLogin(callback)
            },
            fail: function (res) {
                wx.navigateTo({
                    url: "/pages/login/login",
                })
            }
        })
    },
    // 微信登录流程
    wxLogin(callback) {
        var that = this;
        wx.showLoading({
            title: '登录中...'
        });
        wx.login({
            success: function (res) {
                let randCode = res.code;
                that.wxAuth(callback, randCode);
            }
        });
    },
    wxAuth(callback, randCode) {
        console.log('inviter', this.globalData.inviter)
        var that = this;
        wx.getUserInfo({
            success: function (res) {
                let reqData = {
                    code: randCode,
                    data: res.encryptedData,
                    iv: res.iv,
                    inviter: that.globalData.inviter
                };
                console.log("reqData", reqData)
                //请求后端通过微信授权登录接口
                api.http({
                    url: '/blockchain/v1/account/token',
                    method: 'POST',
                    data: reqData,
                    success: function (res) {
                        wx.hideLoading();
                        that.globalData.token = res.data.token;
                        that.globalData.userInfo = res.data.user;
                        that.globalData.registerTokenAmount = res.data.awardTokenAmount;
                        wx.setStorageSync('token', res.data.token);
                        wx.setStorageSync('userInfo', res.data.user);
                        console.log('callback', callback)
                        if (callback) {
                            callback(res.data)
                        }
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: res.data.code+'',
                            icon: 'none',
                            duration: 1500
                        })
                    },
                });
            },
            fail: function (res) {
                console.log('getUserInfo-fail',res)
            },
        })
    },
    globalData: {
        // 调试模式
        debug: true,
        token: "",
        // 用户数据
        userInfo: null,
        //邀请人
        inviter: '',
        //注册奖励电钻
        registerTokenAmount: 0,
        //iphoneX
        isIphoneX: false,
        // 全局配置
        config: {
            // 接口域名
            apiDomain: 'http://192.168.32.223:8181',
            // 图片存储域名
            imgDomain: 'https://esscraftsman.51kupai.com/'
        },
    },
    /**
     * 添加全局数据请求、全局公共方法
     */
    utils: {
        api: api
    }
})