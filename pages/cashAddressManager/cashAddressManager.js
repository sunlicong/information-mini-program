// pages/cashAddressManager/cashAddressManager.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    next: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    this.getList()
  },
  getList() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    api.http({
      url: '/blockchain/v1/user/getWithdrawAddress',
      method: 'GET',
      data: {
        next: that.data.next
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          list: res.data.withdrawList
        })
      }
    });
  },
  /**
   * 添加
   */
  add(e){
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '/pages/cashAddressAdd/cashAddressAdd',
    })
  },
  /**
   * 编辑
   */
  editAddress(e){
    var obj = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/cashAddressAdd/cashAddressAdd?id=' + obj.id + '&address=' + obj.withdrawAddress + '&remark=' + obj.remark,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.next == -1) return;
    this.getList()
  },
})