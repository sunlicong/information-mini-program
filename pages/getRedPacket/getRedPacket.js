const app = getApp()
const $ = app.utils.api;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		redpackId:'',
		next: 0,
		list:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			redpackId:options.redpackId
		})
	},
	receiveRedpack(){
		$.http({
			method:'GET',
			url:'/blockchain/v1/redpack/receiveRedpack',
			data:{
				redpackId:this.data.redpackId
			},
			success:res=>{
				
			},
			complete:res=>{
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

		}else if(id == 2){

		}else{
			wx.navigateTo({
				url: '/pages/shareRedPack/shareRedPack'
			})
		}
	},
	copy(){
		wx.setClipboardData({
			data: 'data',
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