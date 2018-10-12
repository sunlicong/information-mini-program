// pages/walletItemDetail/walletItemDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      formType: 1,// 1 DB 2 人民币
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          formType: options.formType
      })
      if (options.formType==1){
          wx.setNavigationBarTitle({
              title: 'DB',
          })
      } else {
          wx.setNavigationBarTitle({
              title: '人民币',
          })
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})