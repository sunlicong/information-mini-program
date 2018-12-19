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
      this.globalData.config.imgDomain = 'http://51keli.ess.ejucloud.cn/'
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
    let that = this;
    wx.getSystemInfo({//  获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    });
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
  checkIsLogin() {
    var that = this;
    var token = wx.getStorageSync('token')
    // 检查用户是否具有登陆态
    if (token) {
      that.checkToken().then((res) => {})
    } else {
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
        success: function(res) {
          if (res.data.code == 0) {
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
          } else if (util.checkCodeIsReLogin(res.data.code)) { //需要重新登录的CODE码
            that.toLogin()
          }
        }
      });
    });
  },
  toLogin(callback) {
    var that = this;
    //开发，体验模式需要用户手动触发获取用户信息 所以跳转到授权页
    wx.getUserInfo({
      success: function(res) {
        that.wxLogin(callback)
      },
      fail: function(res) {
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
      success: function(res) {
        let randCode = res.code;
        that.wxAuth(callback, randCode);
      }
    });
  },
  wxAuth(callback, randCode) {
    console.log('inviter', this.globalData.inviter)
    var that = this;
    wx.getUserInfo({
      success: function(res) {
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
          success: function(res) {
            wx.hideLoading();
            that.globalData.token = res.data.token;
            that.globalData.userInfo = res.data.user;
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('userInfo', res.data.user);
            console.log('callback', callback)
            if (callback) {
              callback(res.data)
            }
            // 可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res.data)
            }
          },
          fail: function(res) {
            wx.showToast({
              title: res.data.code + res.data.msg,
              icon: 'none',
              duration: 1500
            })
          },
        });
      },
      fail: function(res) {
        console.log('getUserInfo-fail', res)
      },
    })
  },
  /**
   * 收集formId 用于推送模版消息
   */
  collectFormId(formId) {
    api.http({
      url: '/blockchain/v1/push/collect/formid',
      method: 'POST',
      notShowMsg: true,
      data: {
        formId: formId,
      },
      success: function (res) { }
    });
  },
  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },
  globalData: {
    // 调试模式
    debug: false,
    token: "",
    // 用户数据
    userInfo: null,
    //邀请人
    inviter: '',
    //iphoneX
    isIphoneX: false,
    // 全局配置
    config: {
      // 接口域名
      apiDomain: 'http://47.104.159.109:8181',
      // 图片存储域名
      imgDomain: 'http://51keli.ess.ejucloud.cn/'
    },
  },
  /**
   * 添加全局数据请求、全局公共方法
   */
  utils: {
    api: api
  }
})