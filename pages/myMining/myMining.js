// pages/myMining/myMining.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineList: [],
    next: 0,
    unReceiveMoney: 0, //待领取的人民币
    totalCommition: 0 //	分红数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryUnReceiveAssets()
    this.unReceiveDbList()
  },
  /**
   * 邀请
   */
  invite() {
    wx.navigateTo({
      url: '/pages/inviteFriend/inviteFriend',
    })
  },
  /**
   * 攻略
   */
  raiders() {
    wx.navigateTo({
      url: '/pages/raiders/raiders',
    })
  },
  /**
   * 获取用户的未领取db列表
   */
  unReceiveDbList() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/unReceiveDbList',
      method: 'GET',
      data:{
        next: that.data.next
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          mineList: res.data.data,
        })
      }
    });
  },
  /**
   * 获取用户的未领取的资产
   */
  queryUnReceiveAssets() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/queryUnReceiveAssets',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          unReceiveMoney: res.data.unReceiveMoney,
          totalCommition: res.data.totalCommition
        })
      }
    });
  },
  /**
   * 领取待领取的币
   */
  getCoin(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/receiveDb',
      method: 'POST',
      data: {
        id: id
      },
      success: function(res) {
        wx.hideLoading();
        var list = that.data.mineList
        var isHaveDb = false
        for (var i = 0; i < list.length; i++) {
          if (id == list[i].id) {
            list[i].isHidden = 1
          }
          if (!list[i].isHidden){
            isHaveDb = true
          }
        }
        that.setData({
          mineList: list
        })
        if (that.data.next != -1 && !isHaveDb){
          that.unReceiveDbList()
        }
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 领取分红
   */
  getRmb(e) {
    var that = this
    if (that.data.unReceiveMoney == 0) {
      wx.showToast({
        icon: 'none',
        title: '没有可领取的分红',
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/wallet/receiveRMB',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title: '领取成功',
        })
        that.setData({
          totalCommition: that.data.totalCommition + that.data.unReceiveMoney,
          unReceiveMoney: 0,
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 钱包
   */
  goWallet() {
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  itemClick() {
    wx.navigateTo({
      url: '/pages/walletItemDetail/walletItemDetail?formType=2&num=' + this.data.totalCommition,
    })
  },
  showTip() {
    wx.showModal({
      title: '提示',
      content: '1、每日24点按当前所有用户持有非冻结DB比例结算当日分红\r\n2、次日中午8点左右发放前一日分红\r\n3、平台按照收入的80% 进行分红\r\n4前一日分红的40%分配给前一日获得DB并持有的用户，60%分配给以往获得DB并持有的用户\r\n5、超过48小时未领取的分红，将不可领取\r\n6、冻结部分，无法参与分红\r\n7、当前日获得的DB，无法参与前一日分红',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#29A3FD',
    })
  }
})