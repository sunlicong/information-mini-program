// component/pointsDialog/pointsDialog.js
const app = getApp()
const api = app.utils.api;
Component({
  /**
   * 组件的属性列表
   * fromType 1-首次 2-分享
   */
  properties: {
    data: {
      type: Object,
      value: {
        fromType: 0,
        points: 0, //点钻
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
    close(){
      this.setData({
        'data.show': false
      });
    },
    closeDialog() {
      this.close()
      this.triggerEvent('closeDialog', null)
    },
    preventTouchMove() {},
    shareGetPoints() {
      this.close()
      var that = this
      api.http({
        url: '/blockchain/v1/user/shareGetDb',
        method: 'GET',
        success: function(res) {
          if (res.data.shareDB) {
            that.setData({
              'data.fromType': 2,
              'data.points': res.data.shareDB, //积分
              'data.show': true //是否显示
            })
          }
        }
      });
    }
  }
})