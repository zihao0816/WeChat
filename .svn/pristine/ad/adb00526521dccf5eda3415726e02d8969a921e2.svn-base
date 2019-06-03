// pages/order/prescriptionorderdetails.js
var wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.query(this, options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  contactService: function () {
    wx.getStorage({
      key: 'common',
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: res.data.serviceTel,
          success: function () {
            console.log('成功')
          },
          fail: function () {
            console.log('失败')
          }
        })
      }
    })
  },

  query: function(_this, oid) {
    var data = {
      prescriptionOrderId: oid.oid,
      getDoctor: 1,
      getPrescriptionOrder: 1
    }
    wxRequest.requests('Inquiry/orderDetails', JSON.stringify(data), function(res) {
      var img = wx.getStorageSync("common")
      res.doctor.doctorFace = img.fastDfsUrl + res.doctor.doctorFace
      _this.setData({
        orderInfo: res
      })
    })
  }
})