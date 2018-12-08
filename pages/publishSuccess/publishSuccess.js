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
    this.setData({
      contentId: options.contentId,
      coverPid: options.coverPid,
      title: options.title
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var covers = this.data.coverPid?this.data.coverPid.split(','):[]
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