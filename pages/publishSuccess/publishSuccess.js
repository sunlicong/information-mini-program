// pages/publishSuccess/publishSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentId: 0,
    coverPid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contentId: options.contentId,
      coverPid: options.coverPid
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: '/pages/articleDetail/articleDetail?contentId=' + this.data.contentId,
      imageUrl: this.data.coverPid,
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