// pages/publishSuccess/publishSuccess.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    contentId: 0,
    coverPid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面
    this.setData({
      contentId: prevPage.data.contentId,
      coverPid: prevPage.data.coverPid,
      title: prevPage.data.title
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var covers = this.data.coverPid.split(',')
    return {
      title: this.data.title,
      path: '/pages/articleDetail/articleDetail?contentId=' + this.data.contentId + '&inviter=' + app.globalData.userInfo.uid,
      imageUrl: covers[0] || '/image/share_card.png'
    }
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goMine() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  }

})