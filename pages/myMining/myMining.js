// pages/myMining/myMining.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mineList: [{
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
     * 
     */
    getCoin(e) {
        var id = e.currentTarget.dataset.id
        var list = this.data.mineList
        for (var i = 0; i < list.length; i++) {
            if (id == list[i].id) {
                list[i].isShow = 1
            }
        }
        this.setData({
            mineList: list
        })
    },
    /**
     * 钱包
     */
    goWallet() {

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