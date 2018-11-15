//index.js
//获取应用实例
const app = getApp()
const api = app.utils.api;
Page({
  data: {
    tips: [],
    feeds: [],
    next: 0,
    yesterdayTokenTotal: 0,
    incomeTokenTotal: 0,
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    })
    this.getTips()
    this.getFeeds()
  },
  onShow() {
    var token = app.globalData.registerTokenAmount
    if (token) {
      app.globalData.registerTokenAmount = 0
      this.setData({
        pointDialog: {
          fromType: 1,
          points: token, //积分
          show: true //是否显示
        }
      })
    }
  },
  getTips() {
    var that = this
    api.http({
      url: '/blockchain/v1/home/tips',
      method: 'GET',
      success: function(res) {
        that.setData({
          tips: res.data
        })
      }
    });
  },

  getHomeStatis() {
    var that = this
    api.http({
      url: '/blockchain/v1/home/statis',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          yesterdayTokenTotal: res.data.yesterdayTokenTotal,
          incomeTokenTotal: res.data.incomeTokenTotal,
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },

  getFeeds(isPull) {
    var that = this
    api.http({
      url: '/blockchain/v1/home/feedsV1',
      method: 'GET',
      data: {
        next: that.data.next,
        limit: 20
      },
      success: function(res) {
        wx.hideLoading();
        if (isPull){
          wx.showToast({
            icon: 'none',
            title: '成功为你推荐' + res.data.data.length +'条新内容',
          })
          wx.stopPullDownRefresh()
        }
        that.setData({
          next: res.data.next,
          feeds: that.data.next ? that.data.feeds.concat(res.data.data) : res.data.data
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },

  /**
   * 跳转到累计收益
   */
  goMyMining() {
    wx.navigateTo({
      url: '/pages/myMining/myMining',
    })
  },

  onShareAppMessage() {
    return {
      title: '送你头条『股』份，天天有分红，快来领取！',
      path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
      imageUrl: '/image/share_index_card.png'
    }
  },
  onPullDownRefresh(){
    this.setData({
      next: 0,
    })
    this.getFeeds(1)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.next == -1) return;
    wx.showLoading({
      title: '加载中...',
    })
    this.getFeeds()
  },
})