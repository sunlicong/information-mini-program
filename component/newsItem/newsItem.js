// component/newsItem/newsItem.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pop: {
            type: Object,
            value: {
                item: {}
            },
            observer(newVal) {
                console.log(newVal)
                this.setData({
                    item: newVal,
                    pics: newVal.coverPid.split(',')
                })
            }
        },
        formType:{
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        item: {},
        pics: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goDetail(e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/articleDetail/articleDetail?contentId=' + id,
            })
        }
    }
})