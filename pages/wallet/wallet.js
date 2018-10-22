// pages/wallet/wallet.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: 0,
        token: 0,
        rmb: 0,
        candy: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBalance()
    },

    getBalance(){
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        api.http({
            url: '/blockchain/v1/wallet/queryWalletOverview',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    total: res.data.total,
                    token: res.data.token,
                    rmb: res.data.rmb,
                    candy: res.data.candy,
                })
            },
            fail: function (res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 点击事件统一处理
     */
    itemClick(e) {
        var itemName = e.currentTarget.dataset.name
        console.log(itemName)
        if (itemName == 'db') {
            wx.navigateTo({
                url: '/pages/walletItemDetail/walletItemDetail?formType=1&num=' + this.data.token,
            })
        } else if (itemName == 'rmb') {
            wx.navigateTo({
                url: '/pages/walletItemDetail/walletItemDetail?formType=2&num=' + this.data.rmb,
            })
        } else if (itemName == 'candy') {
            wx.navigateTo({
                url: '/pages/payCandyCard/payCandyCard',
            })
        }
    }
})