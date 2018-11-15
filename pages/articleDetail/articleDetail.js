// pages/articleDetail/articleDetail.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentId: '',
    myUid: '',
    selectCandyId: 0,
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
      myUid: app.globalData.userInfo.uid
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
        contentId: that.data.contentId
      },
      success: function(res) {
        that.setData({
          data: res.data
        })
        var text = res.data.content.content.replace(/data-src/g, "src")
        WxParse.wxParse('article', 'html', text, that, 15);
        setTimeout(function(){
          wx.hideLoading();
        },1000)
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
      selectCandyId: index
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
  sendCandy(){
    // var uid = e.currentTarget.dataset.uid
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/invest/rewardCandy',
      method: 'POST',
      data: {
        contentId: that.data.contentId,
        candyCount: 10
      },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '赞赏成功'
        })
        that.setData({
          showDialog: false
        })
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
  goProfile(e){
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/myProfile/myProfile?uid=' + uid,
    })
  },
  /**
   * 点赞
   */
  like() {
    var that = this
    api.http({
      url: '/blockchain/v1/content/like',
      method: 'GET',
      data: {
        contentId: that.data.contentId
      },
      success: function(res) {
        wx.showToast({
          title: '点赞成功，还剩' + res.data.remainedCount + '次点赞',
        })
        that.setData({
          'data.attitudeLikeCount': that.data.data.attitudeLikeCount + 1
        })
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
  deleteRelation(e){
    var uid = e.currentTarget.dataset.uid
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/delete',
      method: 'POST',
      data: {
        mainUserId: uid
      },
      success: function (res) {
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
  share(){
    var that = this
    api.http({
      url: '/blockchain/v1/content/share',
      method: 'POST',
      data: {
        contentId: that.data.contentId
      },
      success: function (res) {
        wx.showToast({
          title: '分享成功，剩余点赞次数' + res.data.remainedCount,
        })
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    this.share()
    return {
      title: this.data.data.content.title,
      path: 'pages/articleDetail/articleDetail?contentId='+ this.data.contentId +'&inviter=' + app.globalData.userInfo.uid,
      imageUrl: this.data.data.content.coverPid
    }
  }

})