// component/guidingMask/guidingMask.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   * fromType 1-首次 2-详情 3-我的 4-我的挖矿
   */
  properties: {
    data: {
      type: Object,
      value: {
        fromType: 0,
        show: false //是否显示
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIpx: app.globalData.isIphoneX,
    detailIndex: 0,//详情的引导
    miningIndex: 0,//我的挖矿
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
      this.setData({
        'data.show': false
      });
    },
    preventTouchMove() { },
    detailClick(){
      if (this.data.detailIndex == 1){
        this.closeDialog()
      } else {
        this.setData({
          detailIndex: this.data.detailIndex + 1
        })
      }
    },
    miningClick(){
      if (this.data.miningIndex == 1) {
        this.closeDialog()
      } else {
        this.setData({
          miningIndex: this.data.miningIndex + 1
        })
      }
    }
  }
})