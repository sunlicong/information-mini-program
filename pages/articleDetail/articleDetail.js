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
        selectCandyId: 0,
        data: {},
        candyCount: 0,//余额
        candyList:[]//购买的糖果列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            contentId: options.contentId
        })
        var that = this
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
                that.setData({
                    data: res.data
                })
                var text = res.data.content.content.replace(/data-src/g, "src")
                WxParse.wxParse('article', 'html', text, that, 15);
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    closeDialog(){
        this.setData({
            showDialog: false
        })
    },
    pay(){
        var that = this
        api.http({
            url: '/blockchain/v1/candy/payCandyList',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    candyCount: res.data.candyCount,
                    candyList: res.data.candyPayList
                })
            }
        });
        this.setData({
            showDialog: true
        })
    },
    /**
     * 选择赞赏金额
     */
    selectCandy(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            selectCandyId: index
        })
    },
    /**
     * 去购买糖果页
     */
    goBuyCandy(){
        wx.navigateTo({
            url: '/pages/payCandyCard/payCandyCard',
        })
    },
    /**
     * 回首页
     */
    goHome(){
        wx.switchTab({
            url: '/pages/index/index',
        })
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