// pages/publishSelectLabel/publishSelectLabel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },
  selectTag(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      ["list[" + index + "].checked"]: true,
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