// pages/Test/Test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    showBall: false,
    animationX: 0,
    animationY: 0,
    ballX: 0,
    ballY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  handleClick(e) {
    // x, y表示手指点击横纵坐标, 即小球的起始坐标
    this.setData({
      ballX: e.detail.x,
      ballY: e.detail.y
    })
    this.createAnimation(this.data.ballX, this.data.ballY);
  },
  setDelayTime(sec) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, sec)
    });
  },
  // 创建动画
  createAnimation(ballX, ballY) {
    let that = this;
      bottomX = 300;
      bottomY = 300;
      that.setData({
        animationX: that.flyX(bottomX, ballX),
        animationY: that.flyY(bottomY, ballY)
      })

    this.setData({
      ballX: ballX,
      ballY: ballY,
      showBall: true
    })
    that.setDelayTime(100).then(() => {
      // 100ms延时,  确保小球已经显示
      that.setData({
        animationX: that.data.animationX.export(),
        animationY: that.data.animationY.export(),
      })
      // 400ms延时, 即小球的抛物线时长
      return that.setDelayTime(400);
    }).then(() => {
      that.setData({
        animationX: that.flyX(0, 0, 0).export(),
        animationY: that.flyY(0, 0, 0).export(),
        showBall: false
      })
    })
  },
  // 水平动画
  flyX(bottomX, ballX, duration) {
    let animation = wx.createAnimation({
      duration: duration || 400,
      timingFunction: 'linear',
    })
    animation.translateX(bottomX - ballX).step();
    return animation;
  },
  // 垂直动画
  flyY(bottomY, ballY, duration) {
    let animation = wx.createAnimation({
      duration: duration || 400,
      timingFunction: 'ease-in',
    })
    animation.translateY(bottomY - ballY).step();
    return animation;
  }
})