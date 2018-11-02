// pages/payCandyCard/payCandyCard.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        candyCount: 0,//余额
        candyList: [],//列表
        selectCandy: 0,//选择套餐的索引
        selectContent: {},//选择套餐的对象
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getList()
    },

    getList() {
        var that = this
        api.http({
            url: '/blockchain/v1/candy/getCandyList',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    candyCount: res.data.candyCount,
                    candyList: res.data.candyList,
                    selectContent: res.data.candyList[0]
                })
            }
        });
        this.setData({
            showDialog: true
        })
    },
    /**
     * 选择卡
     */
    selectCandy(e) {
        var index = e.currentTarget.dataset.index
        this.setData({
            selectCandy: index,
            selectContent: this.data.candyList[index]
        })
    },
})