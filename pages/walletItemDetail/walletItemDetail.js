// pages/walletItemDetail/walletItemDetail.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formType: 1, // 1 点钻 2 人民币 3 trx
    num: 0, //点钻 或 人民币
    pedingDrawAmount: 0,//待提取分红
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
        title: '点钻',
      })
      this.queryTokenBillList()
    } else if(options.formType == 2) {
      wx.setNavigationBarTitle({
        title: '人民币',
      })
      this.queryRMBBillList()
    } else if (options.formType == 3) {
      wx.setNavigationBarTitle({
        title: 'TRX',
      })
      this.queryTRXBillList()
    }
  },
  /**
   * token
   */
  queryTokenBillList() {
    wx.showLoading({
      title: '加载中...',
    })
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
    wx.showLoading({
      title: '加载中...',
    })
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
   * trx
   */
  queryTRXBillList(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/wallet/queryTRXBillList',
      method: 'GET',
      data: {
        next: that.data.next
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          num: res.data.totalAmount,
          pedingDrawAmount: res.data.pedingDrawAmount,
          list: that.data.list.concat(res.data.data)
        })
      },
      fail: function (res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 跳转到待提取页面
   */
  goBonus(){
    wx.navigateTo({
      url: '/pages/walletItemBonus/walletItemBonus',
    })
  },
  /**
   * 充值
   */
  recharge(e){
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  /**
   * 提现
   */
  withdrawal(e){
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/wxpay/getWithdrawInfo',
      method: 'GET',
      data:{
        coinName: 'trx'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.userWithDrawAddress){
          wx.navigateTo({
            url: '/pages/cashWithdrawal/cashWithdrawal',
          })
        } else {
          wx.showModal({
            title: '添加提现地址',
            content: '提现需添加提现地址后可使用',
            confirmText: '去添加',
            confirmColor: '#0794FC',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/cashAddressAdd/cashAddressAdd',
                })
              } else if (res.cancel) { }
            }
          })
        }
      },
      fail: function (res) {
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
    } else if (this.data.formType == 3) {
      this.queryTRXBillList()
    }
  },
})