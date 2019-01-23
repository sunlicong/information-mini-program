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
		isStatus:false,
		redpackData:{}

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
				type:1,
				pathUrlChat:link,
				pathUrlApplet:'/pages/getRedPacket/getRedPacket?redpackId='+this.data.redpackId,
				redpackId:this.data.redpackId

			},
			success:res=>{
				this.setData({
					coderUrl:res.data.coderUrl,
					isStatus:true,
					redpackData:res.data
				})
				wx.hideLoading();
			}
		});
		$.http({
			method:'GET',
			url:'/blockchain/v1/share/redEnvelopeShare',
			data:{
				type:2,
				pathUrlChat:link,
				pathUrlApplet:'/pages/getRedPacket/getRedPacket?redpackId='+this.data.redpackId,
				redpackId:this.data.redpackId
			},
			success:res=>{
				this.setData({
					minCoderUrl:res.data.coderUrl
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
            title:'[红包]我给你发了一个新年红包',
            path: '/pages/getRedPacket/getRedPacket?redpackId='+this.data.redpackId,
            imageUrl: app.globalData.config.imgDomain + this.data.minCoderUrl
        }
	}
})