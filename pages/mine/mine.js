// pages/mine/mine.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nick: '',
        photo: '',
        dynamicsCount: 0, //动态数
        followedCount: 0, //关注数
        fansCount: 0, //粉丝数
        totalToken: 0, //我的钱包总token数
        totalInvestAmount: 0, //总投资数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        this.setData({
            nick: app.globalData.userInfo.nick,
            photo: app.globalData.userInfo.photo
        })
        this.queryProfileCounts()
    },
    queryProfileCounts() {
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryProfileCounts',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    dynamicsCount: res.data.dynamicsCount,
                    followedCount: res.data.followedCount,
                    fansCount: res.data.fansCount,
                    totalToken: res.data.totalToken,
                    totalInvestAmount: res.data.totalInvestAmount
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    itemClick(e) {
        var itemName = e.currentTarget.dataset.name
        if (itemName == 'wallet') {
            wx.navigateTo({
                url: '/pages/wallet/wallet',
            })
        } else if (itemName == 'publish') {
            wx.navigateTo({
                url: '/pages/publish/publish',
            })
        } else if (itemName == 'manager') {
            wx.navigateTo({
                url: '/pages/myWorks/myWorks',
            })
        } else if (itemName == 'invite') {
            wx.navigateTo({
                url: '/pages/inviteFriend/inviteFriend',
            })
        } else if (itemName == 'dynamics') {
            var uid = app.globalData.userInfo.uid
            wx.navigateTo({
                url: '/pages/myProfile/myProfile?uid=' + uid,
            })
        } else if (itemName == 'follow') {
            wx.navigateTo({
                url: '/pages/myProfile/myProfile',
            })
        } else if (itemName == 'fans') {
            wx.navigateTo({
                url: '/pages/myProfile/myProfile',
            })
        }
    }
})