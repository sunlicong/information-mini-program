// component/pointsDialog/pointsDialog.js
const app = getApp()
const api = app.utils.api;
Component({
    /**
     * 组件的属性列表
     * fromType 1-首次 2-分享
     */
    properties: {
        data: {
            type: Object,
            value: {
                fromType: 0,
                points: 0, //点钻
                show: false //是否显示
            },
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        closeDialog() {
            this.setData({
                'data.show': false
            });
        },
        preventTouchMove() {},
        shareGetPoints(){
            this.closeDialog()
            var that = this
            api.http({
                url: '/blockchain/v1/user/shareGetDb',
                method: 'GET',
                success: function (res) {
                    if (res.data.shareDB){
                        that.setData({
                            fromType: 2,
                            points: res.data.shareDB, //积分
                            show: true //是否显示
                        })
                    }
                }
            });
        }
    }
})