// pages/articleDetail/articleDetail.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage:false,
    showNo: false,
    isIpx: app.globalData.isIphoneX,
    contentId: '',
    inviter: '', //邀请人
    myUid: '',
    selectCandyIndex: 0,
    data: {},
    candyCount: 0, //余额
    candyList: [] //购买的糖果列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contentId: options.contentId,
      inviter: options.inviter || '',
      myUid: app.globalData.userInfo.uid || ''
    })
    var that = this
    this.getArticleDetail()
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
  getArticleDetail() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/content/detail',
      method: 'GET',
      data: {
        contentId: that.data.contentId,
        forwardUid: that.data.inviter
      },
      success: function(res) {
        that.setData({
          showPage: true,
          data: res.data
        })
        var text = res.data.content.content.replace(/data-src/g, "src")
        WxParse.wxParse('article', 'html', text, that, 15);
        wx.hideLoading();
      },
      fail: function(res){
        if (res.data.code == 50003){
          wx.hideToast()
          that.setData({
            showNo: true
          })
        }
      }
    });
  },
  closeDialog() {
    this.setData({
      showDialog: false
    })
  },
  pay() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/candy/payCandyList',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          candyCount: res.data.candyCount,
          candyList: res.data.candyPayList
        })
      }
    });
    this.setData({
      showDialog: true
    })
  },
  /**
   * 选择赞赏金额
   */
  selectCandy(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      selectCandyIndex: index
    })
  },
  /**
   * 去购买糖果页
   */
  goBuyCandy() {
    this.setData({
      showDialog: false
    })
    wx.navigateTo({
      url: '/pages/payCandyCard/payCandyCard',
    })
  },
  /**
   * 赠送糖果
   */
  sendCandy(e) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    var candyCount = that.data.candyList[that.data.selectCandyIndex].candyCount || 0
    api.http({
      url: '/blockchain/v1/invest/rewardCandy',
      method: 'POST',
      data: {
        contentId: that.data.contentId,
        candyCount: candyCount
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '赞赏成功'
        })
        var ishaveMe = false //判断当前列表是当前用户是否赞赏过。如果赞赏过就不往列表里手动添加了
        var investUserProfiles = that.data.data.investUserProfiles || []
        for (var i = 0; i < investUserProfiles.length; i++) {
          if (investUserProfiles[i].uid == app.globalData.userInfo.uid) {
            ishaveMe = true
          }
        }
        if (!ishaveMe) {
          that.setData({
            'data.investTotalCount': that.data.data.investTotalCount + 1,
            'data.investUserProfiles': investUserProfiles ? investUserProfiles.concat([{
              photo: app.globalData.userInfo.photo,
              uid: app.globalData.userInfo.uid
            }]) : [{
              photo: app.globalData.userInfo.photo,
              uid: app.globalData.userInfo.uid
            }],
            showDialog: false
          })
        } else {
          that.setData({
            showDialog: false
          })
        }
      },
      fail: function(res){
        var that = this
        if (res.data.code == 30101){
          wx.hideToast()
          wx.showModal({
            title: '提示',
            content: '糖果不足，去购买糖果卡？',
            confirmText: '去购买',
            confirmColor: '#0794FC',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/payCandyCard/payCandyCard',
                })
              } else if (res.cancel) {
              }
            }
          })
        }
      }
    });
  },
  /**
   * 回首页
   */
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goProfile(e) {
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/myProfile/myProfile?uid=' + uid,
    })
  },
  /**
   * 点赞
   */
  like(e) {
    var opt = e.currentTarget.dataset.opt
    var that = this
    api.http({
      url: '/blockchain/v1/content/like',
      method: 'GET',
      data: {
        contentId: that.data.contentId,
        opt: opt
      },
      success: function(res) {
        if (opt == 1) {
          wx.showToast({
            icon: 'none',
            title: '点赞成功，还剩' + res.data.remainedCount + '次点赞',
          })
          that.setData({
            'data.attitudeStatus': 1,
            'data.attitudeLikeCount': that.data.data.attitudeLikeCount + 1,
            'data.attitudeOptCount': res.data.remainedCount,
          })
        } else {
          that.setData({
            'data.attitudeStatus': 0,
            'data.attitudeLikeCount': that.data.data.attitudeLikeCount - 1,
            'data.attitudeOptCount': res.data.remainedCount,
          })
        }
      }
    });
  },
  /**
   * 关注
   */
  relation(e) {
    var uid = e.currentTarget.dataset.uid
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/add',
      method: 'POST',
      data: {
        mainUserId: uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '已关注',
        })
        that.setData({
          'data.attentionStatus': 1
        })
      }
    });
  },
  /**
   * 取消关注
   */
  deleteRelation(e) {
    var uid = e.currentTarget.dataset.uid
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/delete',
      method: 'POST',
      data: {
        mainUserId: uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '已取消关注',
        })
        that.setData({
          'data.attentionStatus': 0
        })
      }
    });
  },
  /**
   * 分享完加次数
   */
  share() {
    var that = this
    api.http({
      url: '/blockchain/v1/content/share',
      method: 'POST',
      data: {
        contentId: that.data.contentId
      },
      success: function(res) {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
        that.setData({
          'data.attitudeOptCount': res.data.remainedCount,
        })
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    this.share()
    var covers = this.data.data.content.coverPid.split(',')
    return {
      title: this.data.data.content.title,
      path: 'pages/articleDetail/articleDetail?contentId=' + this.data.contentId + '&inviter=' + app.globalData.userInfo.uid,
      imageUrl: covers[0] || '/image/share_card.png'
    }
  }

})