// pages/myWorks/myWorks.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabIndex: 0, //默认可使用状态栏
        works:[],
        worksData:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMyWorks()
        this.queryWorkDataByUser()
    },

    getMyWorks() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        api.http({
            url: '/blockchain/v1/user/queryProfileContentsList',
            method: 'GET',
            data: {
                uid: app.globalData.userInfo.uid
            },
            success: function(res) {
                wx.hideLoading();
                console.log(res.data)
                that.setData({
                    works: res.data
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 我的作品”中的数据
     */
    queryWorkDataByUser(){
        var that = this
        api.http({
            url: '/blockchain/v1/user/queryWorkDataByUser',
            method: 'GET',
            data: {
                uid: app.globalData.userInfo.uid
            },
            success: function (res) {
                console.log(res.data)
                that.setData({
                    worksData: res.data
                })
            }
        });
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
                break;
            case '1':
                if (this.data.tabIndex == 1) return;
                this.setData({
                    tabIndex: 1,
                })
                break;
        }
    },

    publish() {
        wx.navigateTo({
            url: '/pages/publish/publish',
        })
    }

})