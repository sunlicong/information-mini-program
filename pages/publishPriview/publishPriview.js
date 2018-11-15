// pages/publishPriview/publishPriview.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        url: '',
        tags:[],
        coverPid: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        // test1 = test1.replace(/data-src/g, "src")

        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]  //上一个页面
        this.setData({
            title: prevPage.data.title,
            url: prevPage.data.url,
            tags: prevPage.data.tags
        })
        this.priview()
    },

    priview(){
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        
        api.http({
            url: '/blockchain/v1/content/preview',
            method: 'POST',
            data:{
                url: that.data.url,
                title: that.data.title,
            },
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    coverPid: res.data.coverPid
                })
                var text = res.data.content.replace(/data-src/g, "src")
                WxParse.wxParse('article', 'html', text, that, 15);
            },
            fail: function (res) {
                wx.hideLoading();
            },
        });
    },

    publish(){
        var that = this
        wx.showLoading({
            title: '加载中...',
        });
        var tag = ''
        for(var i=0;i<this.data.tags.length;i++){
          if (i == this.data.tags.length - 1){
            tag = tag + this.data.tags[i].name
          }else{
            tag = tag + this.data.tags[i].name + ','
          }
        }
        api.http({
            url: '/blockchain/v1/content/release',
            method: 'POST',
            data: {
                url: that.data.url,
                title: that.data.title,
                tags: tag
            },
            success: function (res) {
                wx.hideLoading();
                wx.navigateTo({
                  url: '/pages/publishSuccess/publishSuccess?contentId' + res.data.contentId + '&coverPid=' + that.data.coverPid,
                })
            },
            fail: function (res) {
                wx.hideLoading();
            },
        });
    }

})