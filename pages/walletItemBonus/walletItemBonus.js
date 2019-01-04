// pages/walletItemBonus/walletItemBonus.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0, //点钻 或 人民币
    list: [],
    next: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryPedingDrawBillList()
  },

  /**
   * trx
   */
  queryPedingDrawBillList() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/wallet/queryPedingDrawBillList',
      method: 'GET',
      data: {
        next: that.data.next
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          balance: res.data.totalAmount,
          list: that.data.list.concat(res.data.data)
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 获取提取手续费
   */
  getDrawTRXFee(e) {
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/user/getDrawTRXFee',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        if (that.data.balance < res.data.fee) {
          wx.showModal({
            title: '提取分红',
            content: '待提取分红不足转账手续费,请稍后提取',
            confirmText: '知道了',
            confirmColor: '#0794FC',
            success(res) {

            }
          })
        } else {
          wx.showModal({
            title: '提取分红',
            content: '提取分红后，系统将待提取分红转入用户地址，将自动扣除手续费' + res.data.fee + "TRX",
            confirmText: '确定提取',
            confirmColor: '#0794FC',
            success(res) {
              if (res.confirm) {
                that.drawTRX();
              }
            }
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 提取
   */
  drawTRX() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/user/drawTRX',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title: '提取成功',
        })
        that.list = [];
        that.next = 0;
        that.queryPedingDrawBillList()
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
    this.queryPedingDrawBillList()
  },
})