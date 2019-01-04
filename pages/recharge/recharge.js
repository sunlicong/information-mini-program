// pages/recharge/recharge.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCode: "",
    rechargeAddress: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData()
  },
  requestData(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    api.http({
      url: '/blockchain/v1/user/getRechargeAddress',
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          qrCode: res.data.qrCode,
          rechargeAddress: res.data.rechargeAddress
        })
      },
      fail: function (res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 复制
   */
  copy(e){
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    wx.setClipboardData({
      data: this.data.rechargeAddress,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 预览图片
   */
  previewImage(e){
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
})