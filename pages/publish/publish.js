// pages/publish/publish.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    url: '',
    tags: [],
    previewBtn: false,
    content: '',//文章内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow() {
    this.bindinput()
  },
  /**
   * 监听
   */
  bindinput(e) {
    var title = this.data.title
    var url = this.data.url
    if (e && e.currentTarget.id == 'title') {
      title = e.detail.value
      this.setData({
        title: title
      })
    } else if (e && e.currentTarget.id == 'url') {
      url = e.detail.value
      this.setData({
        url: url
      })
    }
    console.log(title.length , url.length , this.data.tags.length)
    if (title.length && url.length > 4 && this.data.tags.length) {
      this.setData({
        previewBtn: true
      })
    } else {
      this.setData({
        previewBtn: false
      })
    }
  },
  /**
   * 预览
   */
  preview(e) {
    var that = this
    var title = e.detail.value.title;
    var url = e.detail.value.url;
    this.setData({
      title: title,
      url: url
    })
    if (title.length < 1) {
      wx.showToast({
        title: '请输入文章标题',
        icon: 'none'
      })
      return
    }
    if (url.length < 4) {
      wx.showToast({
        title: '请输入文章链接',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
    });
    api.http({
      url: '/blockchain/v1/content/preview',
      method: 'POST',
      data: {
        url: that.data.url,
        title: that.data.title,
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          content: res.data.content
        })
        wx.navigateTo({
          url: '/pages/publishPriview/publishPriview',
        })
      },
    });
  },
  /**
   * 选择标签
   */
  selectLabel(e) {
    wx.navigateTo({
      url: '/pages/publishSelectLabel/publishSelectLabel',
    })
  }
})