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
        this.getFeeds()
    },
    onShow(){
        var token = app.globalData.registerTokenAmount
        if (token){
            app.globalData.registerTokenAmount = 0
            this.setData({
                pointDialog: {
                    fromType: 1,
                    points: token, //积分
                    show: true //是否显示
                }
            })
        }
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
            url: '/blockchain/v1/home/feedsV1',
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
    goMyMining() {
        wx.navigateTo({
            url: '/pages/myMining/myMining',
        })
    },

    onShareAppMessage(){
        return {
            path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid
        }
    }
})