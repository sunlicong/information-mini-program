// pages/investment/investment.js

var app = getApp()
var next = 0

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabIndex: 0, //默认可使用状态栏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function() {

    },
})