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
    mask:{}//引导蒙层
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    })
    this.getTips()
    this.getFeeds()
  },
  onShow() {
    if (!app.globalData.token) return
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
    } else if(!wx.getStorageSync('homeGuid')){//首次引导蒙层的标识
      wx.setStorageSync('homeGuid', true)
      this.setData({
        mask: {
          fromType: 1,
          show: true //是否显示
        }
      })
    }
  },
  /**
   * 关闭积分弹框后再判断一下是否显示引导
   */
  closeDialog(){
    if (!wx.getStorageSync('homeGuid')) {//首次引导蒙层的标识
      wx.setStorageSync('homeGuid', true)
      this.setData({
        mask: {
          fromType: 1,
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
  onBannerClick(e){
    var link = e.currentTarget.dataset.link
    if (link.indexOf('http') > -1) {
      wx.navigateTo({
        url: '/pages/webViewPage/webViewPage?srcUrl=' + link,
      })
    } else {
      wx.navigateTo({
        url: link,
      })
    }
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

  getFeeds(lastContentId) {
    var that = this
    api.http({
      url: '/blockchain/v1/home/feedsV1',
      method: 'GET',
      data: {
        next: that.data.next,
        limit: 20,
        lastContentId: lastContentId || 0
      },
      success: function(res) {
        wx.hideLoading();
        if (lastContentId) { //下拉刷新
          wx.showToast({
            icon: 'none',
            title: res.data.data.length ? '成功为你推荐' + res.data.data.length + '条新内容' : '暂无更多新内容哦',
          })
          if (res.data.next == -1) {
            that.setData({
              feeds: res.data.data.concat(that.data.feeds)
            })
          } else {
            that.setData({
              next: res.data.next,
              feeds: res.data.data
            })
          }
          wx.stopPullDownRefresh()
        } else {
          that.setData({
            next: res.data.next,
            feeds: that.data.next ? that.data.feeds.concat(res.data.data) : res.data.data
          })
        }
      }
    });
  },

  /**
   * 跳转到累计收益
   */
  goMyMining(e) {
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '/pages/myMining/myMining',
    })
  },

  onShareAppMessage() {
    return {
      title: '送你大鱼股份，天天有分红，快来领取！s',
      path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
      imageUrl: '/image/share_index_card.png'
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      next: 0,
    })
    this.getTips()
    this.getFeeds(this.data.feeds[0].contentId)
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