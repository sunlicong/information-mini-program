// pages/walletItemDetail/walletItemDetail.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formType: 1, // 1 DB 2 人民币
    num: 0, //DB 或 人民币
    list: [],
    next: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      formType: options.formType
    })
    if (options.formType == 1) {
      wx.setNavigationBarTitle({
        title: 'DB',
      })
      this.queryTokenBillList()
    } else {
      wx.setNavigationBarTitle({
        title: '人民币',
      })
      this.queryRMBBillList()
    }
  },
  /**
   * token
   */
  queryTokenBillList() {
    var that = this
    api.http({
      url: '/blockchain/v1/wallet/queryTokenBillList',
      method: 'GET',
      data: {
        next: that.data.next
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          num: res.data.totalAmount,
          list: that.data.list.concat(res.data.data)
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * rmb
   */
  queryRMBBillList() {
    var that = this
    api.http({
      url: '/blockchain/v1/wallet/queryRMBBillList',
      method: 'GET',
      data: {
        next: that.data.next
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          num: res.data.totalAmount,
          list: that.data.list.concat(res.data.data)
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.next == -1) return;
    if (this.data.formType == 1) {
      this.queryTokenBillList()
    } else if (this.data.formType == 2) {
      this.queryRMBBillList()
    }
  },
})