const app = getApp()
const $ = app.utils.api;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		redpackId:'',
		next: 0,
		list:[],
		message:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		wx.showLoading({
			title: '加载中...',
		})
		this.setData({
			redpackId:options.redpackId || 53
		})
		this.receiveRedpack();
	},
	receiveRedpack(){
		$.http({
			method:'POST',
			url:'/blockchain/v1/redpack/receiveRedpack',
			data:{
				redpackId:this.data.redpackId
			},
			success:res=>{
				this.setData({
					message:res.data
				})
			},
			complete:res=>{
				wx.hideLoading();
				this.getRedpackList(1);
			}
		});
	},
	getRedpackList(type){
		if (this.data.next == -1) return;
		$.http({
			method:'GET',
			url:'/blockchain/v1/redpack/getRedpackList',
			data:{
				redpackId:this.data.redpackId,
				next:0,
				limit:20
			},
			success:res=>{
				var list = type == 1 ? res.data.data : this.data.list.concat(res.data.data);
                this.setData({
                    list: list,
                    next: res.data.next
                });
			},
			complete:res=>{

			}
		});
	},
	goTo(e){
		var id = e.currentTarget.id;
		if(id == 1){
			this.setData({
				kefuDialog:{
					show:true,
					type:3
				}
			})
		}else if(id == 2){
			this.setData({
				kefuDialog:{
					show:true,
					type:2
				}
			})
		}else{
			wx.navigateTo({
				url: '/pages/shareRedPack/shareRedPack'
			})
		}
	},
	copy(){
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
    }
})