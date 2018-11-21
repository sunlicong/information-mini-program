const app = getApp()
const $ = app.utils.api;
/**
 * 分享
 */
Component({
  properties: {
    pop: {
      type: Object,
      value: {
        type: 1, // 1 邀请 2 详情
        items: '', //项目id
        show: false //是否显示
      },
      observer(newVal) {
        this.setData({
          type: newVal.type || '',
          items: newVal.items || '',
          show: newVal.show || false,
          isModal: newVal.show || false
        })
      }
    }
  },
  data: {
    type: 1, // 1 邀请 2 详情
    show: false, //是否显示分享
    isModal: false, //是否显示遮罩层
    isImgBox: false, //是否显示分享图片
    shareUrl: '',
    items: '',
    pathUrl: '', //扫码到那个页面
  },
  methods: {
    /**
     * 设置扫码链接
     */
    setPathUrl() {
      if (this.data.type == 1) {
        this.setData({
          pathUrl: 'pages/index/index?inviter=' + app.globalData.userInfo.uid,
        });
      } 
    },
    /**
     * 分享微信盆友圈
     */
    shareWechatCircle() {
      this.setPathUrl();
      this.setData({
        show: false
      });
      wx.showLoading({
        title: '正在生成图片...',
      });
      this.sendShare();
    },
    /*
     *分享商品或课程
     */
    sendShare() {
      if (this.data.type == 1) {
        var url = '/blockchain/v1/share/invitation';
        var param = {
          pathUrl: this.data.pathUrl,
        }
      }
      $.http({
        method: 'GET',
        url: url,
        data: param,
        success: res => {
          wx.hideLoading();
          if (res.status) {
            this.setData({
              isImgBox: true,
              shareUrl: res.data.imageUrl
            });
          }
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
        url: app.globalData.config.imgDomain + this.data.shareUrl,
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
            icon: 'none'
          });
          this.setData({
            isImgBox: false,
            isModal: false
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
    closeModal() {
      this.setData({
        show: false,
        isModal: false,
        isImgBox: false
      })
    },
    disMove() {
      return;
    }
  }
})