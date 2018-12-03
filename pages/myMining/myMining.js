// pages/myMining/myMining.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineList: [],
    next: 0,
    unReceiveMoney: 0, //待领取的人民币
    totalCommition: 0, //	分红数
    bonusDb: 0,//参与分红币
    randomXY: [],
    mask: {}//引导蒙层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryUnReceiveAssets()
    this.unReceiveDbList()
  },
  onShow(){
    if (!wx.getStorageSync('miningGuid')) {//首次引导蒙层的标识
      wx.setStorageSync('miningGuid', true)
      this.setData({
        mask: {
          fromType: 4,
          show: true //是否显示
        }
      })
    }
  },
  /**
   * 邀请
   */
  invite() {
    wx.navigateTo({
      url: '/pages/inviteFriend/inviteFriend',
    })
  },
  /**
   * 攻略
   */
  raiders() {
    wx.navigateTo({
      url: '/pages/raiders/raiders',
    })
  },
  /**
   * 获取用户的未领取db列表
   */
  unReceiveDbList() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/unReceiveDbList',
      method: 'GET',
      data: {
        next: 0
      },
      success: function(res) {
        wx.hideLoading();
        that.createdBalls()
        that.setData({
          next: res.data.next,
          mineList: res.data.data,
        })
      }
    });
  },
  /**
   * 随机生成位置
   */
  createdBalls() {
    var randomArr = this.data.randomXY
    const showHeight = 300 //限制钻石生成区域高度
    const showWidth = 600
    for (var i = 0; i < 50;i++){
      const row = Math.floor(Math.random() * showHeight)
      const col = Math.floor(Math.random() * showWidth)
      if (randomArr.length === 0) {
        randomArr.push({
          left: col,
          top: row
        })
      } else {
        const noOverlap = randomArr.every(v => Math.hypot(v.left - col, v.top - row) > 100) //这里的主要目的就是来保证每次随机生成的点确定的图片位置不会有重叠
        if (noOverlap) {
          randomArr.push({
            left: col,
            top: row
          })
        }
      }
    }
    this.setData({
      randomXY: randomArr
    })
    console.log('xxxxxyyyyyy--', randomArr)
  },
  /**
   * 获取用户的未领取的资产
   */
  queryUnReceiveAssets() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/queryUnReceiveAssets',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          unReceiveMoney: res.data.unReceiveMoney,
          totalCommition: res.data.totalCommition,
          bonusDb: res.data.bonusDb
        })
      }
    });
  },
  /**
   * 领取待领取的币
   */
  getCoin(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/user/receiveDb',
      method: 'POST',
      data: {
        id: id
      },
      success: function(res) {
        wx.hideLoading();
        var list = that.data.mineList
        var isHaveDb = false
        for (var i = 0; i < list.length; i++) {
          if (id == list[i].id) {
            list[i].isHidden = 1
          }
          if (!list[i].isHidden) {
            isHaveDb = true
          }
        }
        that.setData({
          mineList: list
        })
        if (that.data.next != -1 && !isHaveDb) {
          that.unReceiveDbList()
        }
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 领取分红
   */
  getRmb(e) {
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    var that = this
    if (that.data.unReceiveMoney == 0) {
      wx.showToast({
        icon: 'none',
        title: '没有可领取的分红',
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    api.http({
      url: '/blockchain/v1/wallet/receiveRMB',
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title: '领取成功',
        })
        that.setData({
          totalCommition: that.data.totalCommition + that.data.unReceiveMoney,
          unReceiveMoney: 0,
        })
      },
      fail: function(res) {
        wx.hideLoading();
      },
    });
  },
  /**
   * 钱包
   */
  goWallet() {
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  itemClick() {
    wx.navigateTo({
      url: '/pages/walletItemDetail/walletItemDetail?formType=2&num=' + this.data.totalCommition,
    })
  },
  showTip() {
    this.setData({
      pointDialog: {
        fromType: 3,
        show: true //是否显示
      }
    })
  }
})