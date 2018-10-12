// pages/login/login.js
const app = getApp()
const $ = app.utils.api
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: null
    },
    onLoad: function () {
        if (this.data.canIUse) {
            this.getUserInfo()
        }
    },
    onShow: function (options) {

    },
    getUserInfo: function () {
        var that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    userInfo: res
                })
                app.wxLogin(function (res) {
                    wx.navigateBack({
                        delta: 1
                    })
                })
            },
            fail: function () {

            },
        })
    }
})