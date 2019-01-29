const app = getApp()
const $ = app.utils.api;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    redpackId: '',
    next: 0,
    list: [],
    message: {},
	txId: '',
	isPopup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      redpackId: options.redpackId || 61
    })
		
		var token = wx.getStorageSync('token');
		if(token){
			this.receiveRedpack();
			this.redEnvelopeShare();
		}
    //登录之后的操作  callback 
    // app.userInfoReadyCallback = res => {
    //   if (res.awardTokenAmount) {
    //     this.setData({
    //       pointDialog: {
    //         fromType: 1,
    //         points: res.awardTokenAmount, //积分
    //         show: true //是否显示
    //       }
    //     })
    //   }
    //   this.receiveRedpack();
    // }
   
	},
	onShow(){
		var token = wx.getStorageSync('token');
		if(token){
			this.receiveRedpack();
			this.redEnvelopeShare();
		}
	},
	redEnvelopeShare(){
		var link = "https://bigfish.51kupai.com/dayu/GetRedPacket?redpackId=" + this.data.redpackId + '&inviter=' + app.globalData.userInfo.uid
    $.http({
			method:'GET',
			url:'/blockchain/v1/share/redEnvelopeShare',
			data:{
				type:2,
				pathUrlChat:link,
        pathUrlApplet: '/pages/getRedPacket/getRedPacket?redpackId=' + this.data.redpackId + '&inviter=' + app.globalData.userInfo.uid,
				redpackId:this.data.redpackId
			},
			success:res=>{
				this.setData({
					minCoderUrl:res.data.coderUrl
				})
			}
		});
	},
  receiveRedpack() {
    $.http({
			method: 'POST',
			url: '/blockchain/v1/redpack/receiveRedpack',
			data: {
				redpackId: this.data.redpackId
			},
			success: res => {
				var txId = res.data.txId.slice(0, 6) + '...' + res.data.txId.slice(res.data.txId.length - 6, res.data.txId.length);
				this.setData({
					message: res.data,
					txId: txId
				});
				this.setPopup(res.data)
			},
			complete: res => {
				wx.hideLoading();
				this.getRedpackList(1);
			}
    });
  },
  setPopup(data){
		if(data.redpackAlertRule == 1){
			if((data.receiveStatus == 0) || (data.receiveStatus == 1&&data.assetType ==2) || (data.receiveStatus == 2&&data.assetType ==1)){
				this.setData({
					isPopup:true
				})
			}
		}else if(data.redpackAlertRule == 2){
			if((data.sendStatus == 0) || (data.sendStatus == 1&&data.assetType ==2) || (data.sendStatus == 2&&data.assetType ==1)){
				this.setData({
					isPopup:true
				})
			}
		}
  },
  close(){
	this.setData({
		isPopup:false
	})
  },
  shadeBtn(){
	this.setData({
		kefuDialog: {
			show: true,
			type: 2
		}
	})
  },
  getRedpackList(type) {
    if (this.data.next == -1) return;
    $.http({
		method: 'GET',
		url: '/blockchain/v1/redpack/getRedpackList',
		data: {
			redpackId: this.data.redpackId,
			next: 0,
			limit: 20
		},
		success: res => {
			var list = type == 1 ? res.data.data : this.data.list.concat(res.data.data);
			this.setData({
			list: list,
			next: res.data.next
			});
		},
		complete: res => {

		}
    });
  },
  goTo(e) {
    var id = e.currentTarget.id;
    if (id == 1) {
		this.setData({
			kefuDialog: {
			show: true,
			type: 3
			}
		})
    } else if (id == 2) {
		this.setData({
			kefuDialog: {
			show: true,
			type: 2
			}
		})
    } else {
		wx.navigateTo({
			url: '/pages/shareRedPack/shareRedPack?redpackId=' + this.data.redpackId
		})
    }
  },
	copy() {
		wx.setClipboardData({
			data: this.data.message.txId,
			success(res) {
				console.log(res)
			}
		})
	},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getRedpackList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '[红包]我给你发了一个新年红包',
      path: '/pages/getRedPacket/getRedPacket?redpackId=' + this.data.redpackId + '&inviter=' + app.globalData.userInfo.uid,
      imageUrl: app.globalData.config.imgDomain + this.data.minCoderUrl
    }
  }
})