// pages/articleDetail/articleDetail.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contentId: '',
        data: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            contentId: options.contentId
        })
        var that = this
        // test1 = test1.replace(/data-src/g, "src")
        // WxParse.wxParse('article', 'html', test1, that, 5);
        this.getArticleDetail()
    },

    getArticleDetail() {
        var that = this
        api.http({
            url: '/blockchain/v1/content/detail',
            method: 'GET',
            data: {
                contentId: that.data.contentId
            },
            success: function(res) {
                wx.hideLoading();
                var text = res.data.content.content.replace(/data-src/g, "src")
                WxParse.wxParse('article', 'html', text, that, 15);
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }

})