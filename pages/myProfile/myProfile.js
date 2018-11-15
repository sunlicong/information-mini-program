// pages/myProfile/myProfile.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '1036502829868527616',
    isMe: false,
    tabIndex: 0,
    user: {},
    newList: [],
    hotList: [],
    next: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      uid: options.uid,
      isMe: options.uid == app.globalData.userInfo.uid ? true : false
    })
    this.queryNewList()
  },
  onShow(){
    this.queryProfile()
  },
  /**
   * tab 点击事件
   */
  tabClick: function(event) {
    this.setData({
      next: 0,
      newList: [],
      hotList: []
    })
    switch (event.target.id) {
      case '0':
        if (this.data.tabIndex == 0) return;
        this.setData({
          tabIndex: 0,
          next: 0
        })
        this.queryNewList()
        break;
      case '1':
        if (this.data.tabIndex == 1) return;
        this.setData({
          tabIndex: 1,
          next: 0
        })
        this.queryHotList()
        break;
    }
  },
  /**
   * 用户信息
   */
  queryProfile() {
    var that = this
    api.http({
      url: '/blockchain/v1/user/queryUserProfile',
      method: 'GET',
      data: {
        uid: that.data.uid
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          user: res.data
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 最新
   */
  queryNewList() {
    var that = this
    api.http({
      url: '/blockchain/v1/user/queryProfileUserFeeds',
      method: 'GET',
      data: {
        next: that.data.next,
        uid: that.data.uid
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          newList: that.data.newList.concat(res.data.data)
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 最热
   */
  queryHotList() {
    var that = this
    api.http({
      url: '/blockchain/v1/user/queryProfileContentsList',
      method: 'GET',
      data: {
        next: that.data.next,
        uid: that.data.uid
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          next: res.data.next,
          hotList: that.data.hotList.concat(res.data.data)
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 跳转修改资料
   */
  editInfo() {
    wx.navigateTo({
      url: '/pages/mineEdit/mineEdit',
    })
  },
  /**
   * 跳转详情
   */
  goDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/articleDetail/articleDetail?contentId=' + id,
    })
  },
  /**
   * 关注
   */
  relation(e) {
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/add',
      method: 'POST',
      data: {
        mainUserId: that.data.uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '已关注',
        })
        that.setData({
          'user.user_relation': 1
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 取消关注
   */
  romoveRelation(e) {
    var that = this
    api.http({
      url: '/blockchain/v1/user/relation/delete',
      method: 'POST',
      data: {
        mainUserId: that.data.uid
      },
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '已取消关注',
        })
        that.setData({
          'user.user_relation': 0
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
    if (this.data.tabIndex == 0) {
      this.queryNewList();
    } else {
      this.queryHotList()
    }
  },
})