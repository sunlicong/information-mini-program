// pages/miningRevenue/miningRevinue.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userIncomeTokenTotal: 0,
        userPointsTotal: 0,
        averagePointsToken: 0,
        profitList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getProfit()
        this.getProfitList()
    },

    /**
     * 挖矿收益统计
     */
    getProfit(){
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryUserMineProfit',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    userIncomeTokenTotal: res.data.userIncomeTokenTotal,
                    userPointsTotal: res.data.userPointsTotal,
                    averagePointsToken: res.data.averagePointsToken
                })
            },
            fail: function (res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 挖矿收益列表
     */
    getProfitList() {
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryUserMineProfitList',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    profitList: res.data
                })
            },
            fail: function (res) {
                wx.hideLoading();
            },
        });
    }
})