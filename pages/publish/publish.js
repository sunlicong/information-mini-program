// pages/publish/publish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '社保转税务征缴，你在欢喜还是愁？',
        url: 'https://mp.weixin.qq.com/s/9S_zLCV3NjaMmPf4O2lyxA',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    preview(e) {
        var title = e.detail.value.title;
        var url = e.detail.value.url;
        this.setData({
            title: title,
            url: url
        })
        if (title.length < 0) {
            wx.showToast({
                title: '请输入文章标题',
                icon: 'none'
            })
            return
        }
        if (url.length < 0) {
            wx.showToast({
                title: '请输入文章链接',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/publishPriview/publishPriview',
        })
    }
})