// component/showKefuDialog/showKefuDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {
        show: false //是否显示
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

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
  }
})
