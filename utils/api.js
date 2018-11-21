/**
 * 数据交互简单分装，可以统一处理一些逻辑
 * options{
 *      notShowMsg//fail里不统一提示toast
 * }
 * 
 */
var util = require('./util.js');
var http = (options) => {
  var token = wx.getStorageSync('token');
  var type = options.method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
  wx.request({
    url: getApp().globalData.config.apiDomain + options.url,
    method: options.method,
    header: {
      'x-app-id': 10001,
      'content-type': type,
      'Authorization': token
    },
    data: options.data,
    success: function(res) {
      console.log(options.url, options.data, res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          res.data['param'] = options.data || null;
          res.data['url'] = options.url;
          options.success(res.data);
        } else if (util.checkCodeIsReLogin(res.data.code)) { //需要重新登录的CODE码
          wx.hideLoading();
          getApp().toLogin(function() {
            http(options)
          })
        } else {
          if (!options.notShowMsg && res.data.code != 30104 && res.data.code != 30101) {
            wx.showToast({
              title: res.data.msg ? res.data.msg : "服务器异常，请稍后再试",
              icon: 'none',
              duration: 1500
            })
          }
          options.fail ? options.fail(res) : false;
        }
      } else {
        options.fail ? options.fail(res) : false;
      }
    },
    fail: function(res) {
      if (!options.notShowMsg) {
        wx.showToast({
          title: "服务器异常，请稍后再试",
          icon: 'none',
          duration: 1500
        })
      }
      options.fail ? options.fail(res) : false;
    },
    complete: function(res) {
      options.complete ? options.complete(res) : false;
    }
  })
}
module.exports = {
  http
}