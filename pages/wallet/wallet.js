// pages/wallet/wallet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 点击事件统一处理
     */
    itemClick(e) {
        var itemName = e.currentTarget.dataset.name
        console.log(itemName)
        if (itemName == 'db') {
            wx.navigateTo({
                url: '/pages/walletItemDetail/walletItemDetail?formType=1',
            })
        } else if (itemName == 'rmb') {
            wx.navigateTo({
                url: '/pages/walletItemDetail/walletItemDetail?formType=2',
            })
        } 
    }
})