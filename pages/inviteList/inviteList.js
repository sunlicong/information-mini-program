// pages/inviteList/inviteList.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        count: 0,
        award: 0,
        cursor: 0,
        list: []
    }, 

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getProfileCount()
    },
    getProfileCount(){
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
        api.http({
            url: '/blockchain/v1/invitation/record/profile',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    award: res.data.award,
                    count: res.data.count
                })
                that.getInviteList()
            }
        });
    },
    /**
     * 列表
     */
    getInviteList(){
        var that = this
        api.http({
            url: '/blockchain/v1/invitation/record/list',
            method: 'GET',
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    cursor: res.data.cursor,
                    list: res.data.data
                })
            }
        });
    },
    goProfile(e){
        var uid = e.currentTarget.dataset.uid
        wx.navigateTo({
            url: '/pages/myProfile/myProfile?uid=' + uid,
        })
    }
})