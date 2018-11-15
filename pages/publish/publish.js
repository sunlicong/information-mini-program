// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    url: '',
    tags:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow(){
    checkContent()
  },
  checkContent(){
    
  },
  preview(e) {
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
    wx.navigateTo({
      url: '/pages/publishPriview/publishPriview',
    })
  },
  /**
   * 选择标签
   */
  selectLabel(e){
    wx.navigateTo({
      url: '/pages/publishSelectLabel/publishSelectLabel',
    })
  }
})