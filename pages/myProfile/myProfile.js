// pages/myProfile/myProfile.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid: '1036502829868527616',
        isMe: false,
        tabIndex: 0,
        user: {},
        newList: [],
        hotList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            uid: options.uid,
            isMe: options.uid == app.globalData.userInfo.uid ? true : false
        })
        this.queryProfile()
        this.queryNewList()
    },
    /**
     * tab 点击事件
     */
    tabClick: function(event) {
        this.setData({
            next: 0,
        })
        switch (event.target.id) {
            case '0':
                if (this.data.tabIndex == 0) return;
                this.setData({
                    tabIndex: 0,
                })
                this.queryNewList()
                break;
            case '1':
                if (this.data.tabIndex == 1) return;
                this.setData({
                    tabIndex: 1,
                })
                this.queryHotList()
                break;
        }
    },
    /**
     * 用户信息
     */
    queryProfile() {
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryUserProfile',
            method: 'GET',
            data: {
                uid: that.data.uid
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    user: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 最新
     */
    queryNewList() {
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryProfileUserFeeds',
            method: 'GET',
            data: {
                uid: that.data.uid
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    newList: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 最热
     */
    queryHotList() {
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryProfileContentsList',
            method: 'GET',
            data: {
                uid: that.data.uid
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    hotList: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 关注
     */
    relation(e) {
        var that = this
        api.http({
            url: '/blockchain/v1/user/relation/add',
            method: 'POST',
            data: {
                mainUserId: that.data.uid
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    'user.user_relation': 1
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 取消关注
     */
    romoveRelation(e) {
        var that = this
        api.http({
            url: '/blockchain/v1/user/relation/delete',
            method: 'DELETE',
            data: {
                mainUserId: that.data.uid
            },
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    'user.user_relation': 0
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
})