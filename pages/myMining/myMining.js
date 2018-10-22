// pages/myMining/myMining.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mineList: [],
        unReceiveMoney: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.queryUnReceiveAssets()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    /**
     * 邀请
     */
    invite(){
        wx.navigateTo({
            url: '/pages/inviteFriend/inviteFriend',
        })
    },
    /**
     * 获取用户的未领取的资产
     */
    queryUnReceiveAssets() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
        api.http({
            url: '/blockchain/v1/user/queryUnReceiveAssets',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                that.setData({
                    mineList: res.data.unReceiveDbList,
                    unReceiveMoney: res.data.unReceiveMoney
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 领取待领取的币
     */
    getCoin(e) {
        var that = this
        var id = e.currentTarget.dataset.id
        wx.showLoading({
            title: '加载中...',
        })
        api.http({
            url: '/blockchain/v1/user/receiveDb',
            method: 'POST',
            data: {
                id: id
            },
            success: function(res) {
                wx.hideLoading();
                var list = that.data.mineList
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        list[i].isShow = 1
                    }
                }
                that.setData({
                    mineList: list
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 领取分红
     */
    getRmb(e) {
        var that = this
        if (that.data.unReceiveMoney==0){
            wx.showToast({
                icon: 'none',
                title: '没有可领取的分红',
            })
            return;
        }
        wx.showLoading({
            title: '加载中...',
        })
        api.http({
            url: '/blockchain/v1/wallet/receiveRMB',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                wx.showToast({
                    icon: 'success',
                    title: '领取成功',
                })
                that.setData({
                    unReceiveMoney: 0
                })
            },
            fail: function(res) {
                wx.hideLoading();
            },
        });
    },
    /**
     * 钱包
     */
    goWallet() {
        wx.navigateTo({
            url: '/pages/wallet/wallet',
        })
    },
    itemClick() {
        wx.navigateTo({
            url: '/pages/walletItemDetail/walletItemDetail?formType=2&num=' + this.data.rmb,
        })
    },
    showTip() {
        wx.showModal({
            title: '提示',
            content: '1、每日24点按当前所有用户持有非冻结DB比例结算当日分红\r\n2、次日中午8点左右发放前一日分红\r\n3、平台按照收入的80% 进行分红\r\n4、超过48小时未领取的分红，将不可领取\r\n5、冻结部分，无法参与分红\r\n6、当前日获得的DB，无法参与前一日分红',
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#29A3FD',
        })
    }
})