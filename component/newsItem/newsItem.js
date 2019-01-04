// component/newsItem/newsItem.js
const app = getApp()
const api = app.utils.api;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pop: {
      type: Object,
      value: {
        item: {}
      },
      observer(newVal) {
        this.setData({
          item: newVal,
          pics: newVal.coverPid ? newVal.coverPid.split(',') : []
        })
      }
    },
    isOpenPaySwitch: Number,
    formType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: {},
    pics: ['http://demo2.ess.ejucloud.cn/6399f7ea-c7cf-08ee-3360-16c9d2ce832b@imageView2/2/w/200']
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/articleDetail/articleDetail?contentId=' + id,
      })
    }
  }
})