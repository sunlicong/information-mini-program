// pages/publishSelectLabel/publishSelectLabel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIphoneX,
    list: [{
        name: "娱乐",
        checked: false
      },
      {
        name: "情感",
        checked: false
      },
      {
        name: "搞笑",
        checked: false
      },
      {
        name: "健康",
        checked: false
      },
      {
        name: "养生",
        checked: false
      },
      {
        name: "教育",
        checked: false
      },
      {
        name: "生活",
        checked: false
      },
      {
        name: "科技",
        checked: false
      },
      {
        name: "财经",
        checked: false
      },
      {
        name: "故事",
        checked: false
      },
      {
        name: "汽车",
        checked: false
      },
      {
        name: "星座",
        checked: false
      },
      {
        name: "美食",
        checked: false
      },
      {
        name: "时尚",
        checked: false
      },
      {
        name: "旅游",
        checked: false
      },
      {
        name: "育儿",
        checked: false
      },
      {
        name: "体育",
        checked: false
      },
      {
        name: "房产",
        checked: false
      },
      {
        name: "历史",
        checked: false
      },
      {
        name: "军事",
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面
    for (var i = 0; i < prevPage.data.tags.length; i++) {
      for (var j = 0; j < this.data.list.length; j++) {
        if (prevPage.data.tags[i].name == this.data.list[j].name) {
          this.setData({
            ["list[" + j + "].checked"]: !this.data.list[j].checked,
          })
        }
      }
    }

  },
  selectTag(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      ["list[" + index + "].checked"]: !this.data.list[index].checked,
    })
  },
  save() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面
    var tags = []
    var list = this.data.list
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked) {
        tags.push(list[i])
      }
    }
    prevPage.setData({
      tags: tags
    })
    wx.navigateBack()
  }
})