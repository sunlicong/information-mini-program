// pages/mine/mine.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick: '',
    photo: '',
    dynamicsCount: 0, //动态数
    followedCount: 0, //关注数
    fansCount: 0, //粉丝数
    totalToken: 0, //我的钱包总token数
    totalCommition: 0, //
    incomeTrxToken: 0,
    isOpenPaySwitch: 0,
    mask: {}//引导蒙层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.setData({
      isOpenPaySwitch: app.globalData.isOpenPaySwitch,
      nick: app.globalData.userInfo.nick,
      photo: app.globalData.userInfo.photo
    })
    this.queryProfileCounts()
    // if (!wx.getStorageSync('MineGuid')) {//首次引导蒙层的标识
    //   wx.setStorageSync('MineGuid', true)
    //   this.setData({
    //     mask: {
    //       fromType: 3,
    //       show: true //是否显示
    //     }
    //   })
    // }
  },
  queryProfileCounts() {
    var that = this
    api.http({
      url: '/blockchain/v1/user/queryProfileCounts',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          dynamicsCount: res.data.dynamicsCount,
          followedCount: res.data.followedCount,
          fansCount: res.data.fansCount,
          totalToken: res.data.totalToken,
          totalCommition: res.data.totalCommition,
          incomeTrxToken: res.data.incomeTrxToken,
          invitation: res.data.invitation
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  itemClick(e) {
    var itemName = e.currentTarget.dataset.name
    if (itemName == 'edit') {
      wx.navigateTo({
        url: '/pages/mineEdit/mineEdit',
      })
    } else if (itemName == 'wallet') {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    } else if (itemName == 'rmb') {
      wx.navigateTo({
        url: '/pages/walletItemDetail/walletItemDetail?formType=2&num=' + this.data.totalCommition,
      })
    } else if (itemName == 'publish') {
      wx.navigateTo({
        url: '/pages/publish/publish',
      })
    } else if (itemName == 'manager') {
      wx.navigateTo({
        url: '/pages/myWorks/myWorks',
      })
    } else if (itemName == 'invite') {
      wx.navigateTo({
        url: '/pages/inviteFriend/inviteFriend',
      })
    } else if (itemName == 'invite2') {
      wx.navigateTo({
        url: '/pages/inviteList/inviteList',
      })
    } else if (itemName == 'invite3') {
      wx.navigateTo({
        url: '/pages/inviteList/inviteList',
      })
    } else if (itemName == 'dynamics') {
      var uid = app.globalData.userInfo.uid
      wx.navigateTo({
        url: '/pages/myProfile/myProfile?uid=' + uid,
      })
    } else if (itemName == 'follow') {
      var uid = app.globalData.userInfo.uid
      wx.navigateTo({
        url: '/pages/myFans/myFans?type=2'
      })
    } else if (itemName == 'fans') {
      var uid = app.globalData.userInfo.uid
      wx.navigateTo({
        url: '/pages/myFans/myFans?type=1'
      })
    } else if (itemName == 'sendpack'){
      this.setData({
        kefuDialog: {
          show: true,
          type: 2
        }
      })
    } else if (itemName == 'sendingPack') {
      var link = app.globalData.config.h5Domain + 'PacketInSend'
      wx.navigateTo({
        url: '/pages/webViewPage/webViewPage?srcUrl=' + link,
      })
    } else if (itemName == 'redpackRecords') {
      var link = app.globalData.config.h5Domain + 'RedPacketRecords'
      wx.navigateTo({
        url: '/pages/webViewPage/webViewPage?srcUrl=' + link,
      })
    }
  }
})