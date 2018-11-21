// pages/publishPriview/publishPriview.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIphoneX,
    title: '',
    url: '',
    tags: [],
    coverPid: "",
    content: '',//文章内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面
    this.setData({
      title: prevPage.data.title,
      url: prevPage.data.url,
      tags: prevPage.data.tags,
      photo: app.globalData.userInfo.photo,
      nick: app.globalData.userInfo.nick,
      createTime: prevPage.data.createTime
    })
    var text = prevPage.data.content.replace(/data-src/g, "src")
    WxParse.wxParse('article', 'html', text, this, 30);
  },

  publish() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    var tag = ''
    for (var i = 0; i < this.data.tags.length; i++) {
      if (i == this.data.tags.length - 1) {
        tag = tag + this.data.tags[i].name
      } else {
        tag = tag + this.data.tags[i].name + ','
      }
    }
    api.http({
      url: '/blockchain/v1/content/release',
      method: 'POST',
      data: {
        url: that.data.url,
        title: that.data.title,
        tags: tag
      },
      success: function(res) {
        wx.hideLoading();
        var pages = getCurrentPages()
        var prev2Page = pages[pages.length - 2] //上一个页面
        prev2Page.setData({
          title: '',
          url: '',
          tags: []
        })
        var prev3Page = pages[pages.length - 3] //上一个页面
        if (prev3Page.route == 'pages/myWorks/myWorks'){
          prev3Page.setData({
            next: 0
          })
          prev3Page.getMyWorks()
        }
        that.setData({
          contentId: res.data.contentId,
          coverPid: res.data.coverPid,
          title: res.data.title
        })
        wx.redirectTo({
          url: '/pages/publishSuccess/publishSuccess',
        })
      },
    });
  }

})