const app = getApp()
const $ = app.utils.api;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		height:'',
		redpackId:'',
		coderUrl:'',//大图
		minCoderUrl:'',//分享小图
		isStatus:false

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		wx.showLoading({
			title: '加载中...',
		})
		var height = wx.getSystemInfoSync().windowHeight;
		this.setData({
			height: height,
			redpackId:options.redpackId || 1
		})
		this.getRedEnvelopeShare();
	},
	getRedEnvelopeShare(){
		var link = "https://bigfish.51kupai.com/dayu/GetRedPacket?redpackId="+this.data.redpackId
		$.http({
			method:'GET',
			url:'/blockchain/v1/share/redEnvelopeShare',
			data:{
				type:2,
				pathUrlChat:link,
				pathUrlApplet:'/pages/getRedPacket/getRedPacket?redpackId='+this.data.redpackId
			},
			success:res=>{
				this.setData({
					coderUrl:res.data.coderUrl,
					isStatus:true
				})
				wx.hideLoading();
			}
		});
		$.http({
			method:'GET',
			url:'/blockchain/v1/share/redEnvelopeShare',
			data:{
				type:1,
				pathUrlChat:link,
				pathUrlApplet:'/pages/getRedPacket/getRedPacket?redpackId='+this.data.redpackId
			},
			success:res=>{
				this.setData({
					minCoderUrl:res.data.minCoderUrl
				})
			}
		});
	},
	/**
     * 保存图片
     */
    saveImg() {
		wx.showLoading({
		  title: '保存中...',
		});
		wx.downloadFile({
			url: app.globalData.config.imgDomain + this.data.coderUrl,
			success: res => {
				wx.hideLoading();
				var filePath = res.tempFilePath
				if (res.statusCode === 200) {
					this.saveImage(filePath);
				}
			}
		})
	  },
	  /**
	   * 保存到相册
	   */
	  saveImage(filePath) {
		wx.saveImageToPhotosAlbum({
			filePath: filePath,
			success: res => {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
					duration: 3000
				});
			}
		})
	  },
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
		return {
            title:app.globalData.userInfo.nick+'发了一个红包，祝你新年快乐！',
            path: '/pages/getRedPacket/getRedPacket',
            imageUrl: app.globalData.config.imgDomain + this.data.minCoderUrl
        }
	}
})