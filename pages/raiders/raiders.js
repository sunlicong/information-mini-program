// pages/raiders/raiders.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yesterdayLikeTotalToken: 0,//昨日点赞挖矿数
        unfrozenTotalToken: 0,//团队释放数量
        yesterdayTotalToken: 0,//昨日挖矿总数
        tokenTotalCirculating: 0,//总流通数量
        yesterdayDividend: 0,//昨日收入分红
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.queryGuideStatisticData()
    },
    queryGuideStatisticData(){
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        api.http({
            url: '/blockchain/v1/home/queryGuideStatisticData',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    yesterdayLikeTotalToken: res.data.yesterdayLikeTotalToken,
                    unfrozenTotalToken: res.data.unfrozenTotalToken,
                    yesterdayTotalToken: res.data.yesterdayTotalToken,
                    tokenTotalCirculating: res.data.tokenTotalCirculating,
                    yesterdayDividend: res.data.yesterdayDividend,
                })
            }
        });
    }
})