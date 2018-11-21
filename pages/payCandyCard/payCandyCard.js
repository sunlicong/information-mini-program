// pages/payCandyCard/payCandyCard.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIphoneX,
    candyCount: 0, //余额
    candyList: [], //列表
    selectCandy: 0, //选择套餐的索引
    selectContent: {}, //选择套餐的对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList()
  },

  getList() {
    var that = this
    api.http({
      url: '/blockchain/v1/candy/getCandyList',
      method: 'GET',
      success: function(res) {
        that.setData({
          candyCount: res.data.candyCount,
          candyList: res.data.candyList
        })
        if (!that.data.selectContent.id){
          that.setData({
            selectContent: res.data.candyList[0]
          })
        }
      }
    });
    this.setData({
      showDialog: true
    })
  },
  /**
   * 选择卡
   */
  selectCandy(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      selectCandy: index,
      selectContent: this.data.candyList[index]
    })
  },
  /**
   * 购卡
   */
  buyCard(){
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/wxpay/doPayMock',
      method: 'GET',
      data:{
        candyId: that.data.selectContent.id
      },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '购买成功'
        })
        that.getList()
      },
      fail: function (res) {
        if (res.data.code == 30104){
          wx.hideToast()
          wx.showModal({
            title: '提示',
            content: '很抱歉，小程序暂不支持购卡',
            confirmText: '知道了',
            confirmColor: '#0794FC',
            showCancel: false,
            success(res) {

            }
          })
        }
      }
    });
  },
  goDetail(){
    wx.navigateTo({
      url: '/pages/candyDetail/candyDetail',
    })
  }
})