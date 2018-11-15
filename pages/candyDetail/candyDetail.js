// pages/candyDetail/candyDetail.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0, //DB 或 人民币
    list: [],
    next: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryCandyBillList()
  },
  /**
   * Candy
   */
  queryCandyBillList() {
    var that = this
    api.http({
      url: '/blockchain/v1/wallet/queryCandyBillList',
      method: 'GET',
      data: {
        next: that.data.next,
        limit: 20
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          list: that.data.list.concat(res.data.data)
        })
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.next == -1) return;
    this.queryCandyBillList()
  },
})