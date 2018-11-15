// pages/inviteFriend/inviteFriend.js
const app = getApp()
const api = app.utils.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      return {
        title: '送你头条『股』份，天天有分红，快来领取！',
        path: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
        imageUrl: '/image/share_index_card.png'
      }
    }
})