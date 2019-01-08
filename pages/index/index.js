//index.js
//获取应用实例
const app = getApp()
const api = app.utils.api;
Page({
  data: {
    tips: [],
    feeds: [],
    next: 100,
    yesterdayTokenTotal: 0,
    incomeTokenTotal: 0,
    mask: {}, //引导蒙层
    isOpenPaySwitch: 0,
    feedUrl: ""
  },
  onLoad: function() {
    if (app.globalData.token) {
      this.closeDialog()
    } else {
      // 登录之后的操作  callback 
      app.userInfoReadyCallback = res => {
        if (res.awardTokenAmount) {
          this.setData({
            pointDialog: {
              fromType: 1,
              points: res.awardTokenAmount, //积分
              show: true //是否显示
            }
          })
        } else if (!wx.getStorageSync('homeGuid')) { //首次引导蒙层的标识
          wx.setStorageSync('homeGuid', true)
          this.setData({
            mask: {
              fromType: 1,
              show: true //是否显示
            }
          })
        }
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.getTips()
    this.feedsCheckV1()
  },
  /**
   * 根据开关请求接口不同feed接口
   */
  feedsCheckV1() {
    var that = this
    api.http({
      url: '/blockchain/v1/home/paySwitchV1',
      method: 'GET',
      success: function(res) {
        if (res.data) {
          that.setData({
            feedUrl: "/blockchain/v1/home/feedsV1"
          })
        } else {
          that.setData({
            feedUrl: "/blockchain/v1/home/feedsCheckV1"
          })
        }
        that.getFeeds()
      }
    });
  },
  onShow() {
    this.setData({
      isOpenPaySwitch: app.globalData.isOpenPaySwitch
    })
    app.checkPaySwitchCallback = res => {
      this.setData({
        isOpenPaySwitch: res
      })
    }
  },
  /**
   * 关闭积分弹框后再判断一下是否显示引导
   */
  closeDialog() {
    if (!wx.getStorageSync('homeGuid')) { //首次引导蒙层的标识
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
      data: {
        type: 2 //2 小程序 3 公众号
      },
      success: function(res) {
        that.setData({
          currentIndex: 0,
          tips: res.data
        })
      }
    });
  },
  onBannerClick(e) {
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
      url: that.data.feedUrl,
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
          // if (res.data.next == -1) {
          that.setData({
            feeds: res.data.data.concat(that.data.feeds)
          })
          // } else {
          //   that.setData({
          //     next: res.data.next,
          //     feeds: res.data.data
          //   })
          // }
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
      title: '送你大鱼股份，天天有分红，快来领取！',
      path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
      imageUrl: '/image/share_index_card.png'
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // this.setData({
    //   next: 0,
    // })
    this.getTips()
    var contentId = this.data.feeds.length ? this.data.feeds[0].contentId : 0
    this.getFeeds(contentId)
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