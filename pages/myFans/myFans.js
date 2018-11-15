// pages/myFans/myFans.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 2, //1-我的粉丝 2我的关注
    list: [], //粉丝列表
    next: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type || 1
    })
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '我的粉丝',
      })
      this.getFansList()
    } else {
      wx.setNavigationBarTitle({
        title: '我的关注',
      })
      this.getAttentions()
    }
  },
  goProfile(e){
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/myProfile/myProfile?uid=' + uid,
    })
  },
  /**
   * 粉丝列表
   */
  getFansList() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    api.http({
      url: '/blockchain/v1/user/relation/fans',
      method: 'GET',
      data: {
        next: that.data.next
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
   * 关注列表
   */
  getAttentions() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    api.http({
      url: '/blockchain/v1/user/relation/attentions',
      method: 'GET',
      data: {
        next: that.data.next
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
   * 关注
   */
  relation(e) {
    var uid = e.currentTarget.dataset.uid
    var index = e.currentTarget.dataset.index
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/add',
      method: 'POST',
      data: {
        mainUserId: uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '关注成功',
        })
        that.setData({
          ['list[' + index + '].mutual']: 1
        })
      }
    });
  },
  /**
   * 取消关注
   */
  deleteRelation(e) {
    var uid = e.currentTarget.dataset.uid
    var index = e.currentTarget.dataset.index
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/delete',
      method: 'POST',
      data: {
        mainUserId: uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '取消成功',
        })
        var list = that.data.list
        list.splice(index, 1)
        that.setData({
          list: list
        })
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.next == -1) return;
    if (this.data.type == 1) {
      this.getFansList()
    } else {
      this.getAttentions()
    }
  },
})