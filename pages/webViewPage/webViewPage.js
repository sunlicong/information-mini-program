// pages/webViewPage/webViewPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _srcUrl = options.srcUrl + '?token=' + app.globalData.token
    this.setData({
      srcUrl: _srcUrl
    })
  },
})