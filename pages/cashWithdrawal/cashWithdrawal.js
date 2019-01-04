// pages/cashWithdrawal/cashWithdrawal.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    price: "",
    userWithDrawAddress: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWithdrawInfo()
  },
  /**
   * 获取提现信息
   */
  getWithdrawInfo(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/wxpay/getWithdrawInfo',
      method: 'GET',
      data: {
        coinName: 'trx'
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          balance: res.data.balance,
          userWithDrawAddress: res.data.userWithDrawAddress
        })
      },
      fail: function (res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 提现
   */
  withdraw(e){
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    if (!this.data.userWithDrawAddress || !this.data.userWithDrawAddress.withdrawAddress){
      wx.showToast({
        title: '请选择提现地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.price<100){
      wx.showToast({
        title: '最小提现金额为100TRX',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/wxpay/withdraw',
      method: 'POST',
      data: {
        toAddress: that.data.userWithDrawAddress.withdrawAddress,
        tokenAmount: e.detail.value.price
      },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)
      }
    });
  },
  bindinput(e){
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 管理提现地址
   */
  addManager(){
    wx.navigateTo({
      url: '/pages/cashAddressManager/cashAddressManager',
    })
  }
})