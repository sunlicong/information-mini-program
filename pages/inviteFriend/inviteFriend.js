// pages/inviteFriend/inviteFriend.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: {}, //传递给分享组件
    invitingWard: 0,//邀请人
    invitedWard: 0,//被邀请人
    registerWard: 0//直接注册
  },
  share() {
    this.setData({
      share: {
        show: true,
        type: 1,
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '送你大鱼股份，天天有分红，快来领取！',
      path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
      imageUrl: '/image/share_index_card.png'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryData()
  },
  queryData() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    api.http({
      url: '/blockchain/v1/settings/queryRegisterSettings',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          invitingWard: res.data.invitingWard,
          invitedWard: res.data.invitedWard,
          registerWard: res.data.registerWard,
        })
      }
    });
  }
})