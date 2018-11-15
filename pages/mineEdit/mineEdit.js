// pages/mineEdit/mineEdit.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick: '',
    desc: '',
    photo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nick: app.globalData.userInfo.nick,
      desc: app.globalData.userInfo.desc,
      photo: app.globalData.userInfo.photo
    })
  },
  getNickInput(e) {
    var value = e.detail.value
    this.setData({
      nick: value
    })
  },
  getDescInput(e) {
    var value = e.detail.value
    this.setData({
      desc: value
    })
  },
  save(){
    var that = this
    api.http({
      url: '/blockchain/v1/user/updateProfile',
      method: 'POST',
      data: {
        avatar: that.data.photo,
        nickName: that.data.nick,
        description: that.data.desc
      },
      success: function (res) {
        wx.showToast({
          title: '更新成功',
        })
        app.globalData.userInfo.nick = that.data.nick
        app.globalData.userInfo.desc = that.data.desc
        wx.navigateBack()
      }
    });
  }
})