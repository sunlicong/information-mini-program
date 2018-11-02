// pages/myFans/myFans.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 2, //1-我的粉丝 2我的关注
        fansList: [], //粉丝列表
        attentions: []//关注列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            type: options.type || 1
        })
        if (options.type == 1) {
            wx.setNavigationBarTitle({
                title: '我的粉丝',
            })
            this.getFansList()
        } else {
            wx.setNavigationBarTitle({
                title: '我的关注',
            })
            this.getAttentions()
        }
    },
    /**
     * 粉丝列表
     */
    getFansList() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        api.http({
            url: '/blockchain/v1/user/relation/fans',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    fansList: res.data
                })
            }
        });
    },
    /**
     * 关注列表
     */
    getAttentions() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        api.http({
            url: '/blockchain/v1/user/relation/attentions',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    attentions: res.data
                })
            }
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
})