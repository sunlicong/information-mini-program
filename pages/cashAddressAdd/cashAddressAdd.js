// pages/cashAddressAdd/cashAddressAdd.js
const app = getApp()
const api = app.utils.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    address: "",
    remark: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id || "",
      address: options.address || "",
      remark: options.remark || ""
    })
  },
  /**
   * 保存
   */
  save(e) {
    if (e.detail.formId) app.collectFormId(e.detail.formId)
    if (e.detail.value.address.length < 1) {
      wx.showToast({
        icon: 'none',
        title: "请输入提现地址",
      })
      return;
    }
    if (e.detail.value.remark.length < 1) {
      wx.showToast({
        icon: 'none',
        title: "请输入备注",
      })
      return;
    }
    if (!(/^\d{6}$/.test(e.detail.value.password))) {
      wx.showToast({
        icon: 'none',
        title: "请输入6位纯数字地址密码",
      })
      return;
    }
    var title = "添加提现地址"
    var message = "添加提现地址后，仅能提现到该地址，请核对提现地址和地址密码无误后，进行添加"
    var confirmButtonText = "确定添加"
    if (this.data.id) {
      title = "修改提现地址"
      message = "修改提现地址后，仅能提现到该地址，确认修改么？"
      confirmButtonText = "确定修改"
    }
    var that = this
    wx.showModal({
      title: title,
      content: message,
      confirmText: confirmButtonText,
      confirmColor: '#0794FC',
      success(res) {
        wx.showLoading({
          title: '加载中...',
        });
        var url = "/blockchain/v1/user/saveWithdrawAddress";
        if (that.data.id) {
          url = "/blockchain/v1/user/updateWithdrawAddress";
        }
        api.http({
          url: url,
          method: 'POST',
          data: {
            id: that.data.id,
            currency: "trx",
            withdrawAddress: e.detail.value.address,
            remark: e.detail.value.remark,
            addressPwd: e.detail.value.password
          },
          success: function(res) {
            wx.hideLoading();
            wx.showToast({
              icon: 'success',
              title: "保存成功",
            })
            wx.navigateBack()
          }
        });
      }
    })
  }
})