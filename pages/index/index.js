//index.js
//获取应用实例
const app = getApp()
const api = app.utils.api;
Page({
    data: {
        tips: [],
        feeds: [],
        yesterdayTokenTotal: 0,
        incomeTokenTotal: 0,
    },
    onLoad: function() {
        this.getTips()
        this.getHomeStatis()
        this.getFeeds()
    },

    getTips() {
        var that = this
        api.http({
            url: '/blockchain/v1/home/tips',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    tips: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },

    getHomeStatis() {
        var that = this
        api.http({
            url: '/blockchain/v1/home/statis',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    yesterdayTokenTotal: res.data.yesterdayTokenTotal,
                    incomeTokenTotal: res.data.incomeTokenTotal,
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },

    getFeeds() {
        var that = this
        api.http({
            url: '/blockchain/v1/home/feeds',
            method: 'GET',
            data: {
                offset: 0,
                limit: 20
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    feeds: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },

    /**
     * 跳转到累计收益
     */
    goMyMining(){
        wx.navigateTo({
          url: '/pages/myMining/myMining',
        })
    },
})