const app = getApp()
const $ = app.utils.api;
/**
 * 使用前请简单阅读下代码 不要传错参数;
 * 分享微信群的内容请在自己页面内设置；
 * author: rongtongqi
 */
Component({
	properties: {
		pop:{
			type: Object,
			value:{
				type:1,// 1 大师 2 作品
				items:'',//项目id
				show:false//是否显示
			},
			observer(newVal) {
				this.setData({
					type:newVal.type || '',
					items:newVal.items || '',
					show:newVal.show || false,
					isModal:newVal.show || false
				})	
			}
		}
	},
	data: {
		type:1,// 1 大师 2 作品
		show:false,//是否显示分享
		isModal:false,//是否显示遮罩层
		isImgBox:false,//是否显示分享图片
		shareUrl:'',
		items:'',
		pathUrl:'',//扫码到那个页面
	},
	methods: {
		/**
		 * 设置扫码链接
		 */
		setPathUrl(){
            if (this.data.type == 1) {
                this.setData({
                    pathUrl: '/pages/masterInfo/masterInfo?masterId=' + this.data.items
                });
            }else if(this.data.type == 2){
              this.setData({
                pathUrl: '/pages/productionDetail/productionDetail?worksId=' + this.data.items
              });
            }
		},
		/**
		 * 分享微信盆友圈 或者线下打印
		 */
		shareWechatCircle(){
			this.setPathUrl();
			this.setData({
				show:false
			});
			wx.showLoading({
				title: '正在生成图片...',
			});
			this.sendShare();
		},
		/*
		*分享商品或课程
		*/
		sendShare(){
			if(this.data.type == 1){
				var url = '/craftsmanship/share/master';
				var param = {
					masterId:this.data.items,
                    pathUrl: this.data.pathUrl,
				}
			} else if (this.data.type == 2 ){
				var url = '/craftsmanship/share/works';
				var param = {
					worksId: this.data.items,
					pathUrl: this.data.pathUrl,
				}
			}
			$.http({
				method:'GET',
				url:url,
				data:param,
				success:res=>{
					wx.hideLoading();
					if(res.status){
						this.setData({
							isImgBox:true,
							shareUrl:res.data
						});
					}
				}
			});
		},
		/**
		 * 保存图片
		 */
		saveImg(){
			wx.showLoading({
                title: '保存中...',
			});
			wx.downloadFile({
				url: app.globalData.config.imgDomain+this.data.shareUrl,
				success:res=>{
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
		saveImage(filePath){
			wx.saveImageToPhotosAlbum({
				filePath: filePath,
				success:res=>{
					wx.showToast({
						title: '保存成功',
						icon: 'none'
					});
					this.setData({
						isImgBox:false,
						isModal:false
					});
					wx.previewImage({
						current: filePath, 
						urls: [filePath]
					});
				}
			})
		},
		/**
		 * 关闭弹出层
		 */
		closeModal(){
			this.setData({
				show:false,
				isModal:false,
				isImgBox:false
			})
		},
		disMove(){
			return;
		}
	}
})