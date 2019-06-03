// pages/im/seemedicine.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
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
    this.query(this, options.doctorId)
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

  query: function(_this, doctorId) {
    var uniond = wx.getStorageSync("weixin");
    wxRequest.requests('PlacingOrder/takeMedicineList', JSON.stringify({
      parameters: uniond.id,
      doctorid: doctorId
    }), function(res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].paystate == '1') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.unpaid
        } else if (res.pageVal[i].paystate == '2') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.paid
        } else if (res.pageVal[i].paystate == '3') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
        }
      }
      _this.setData({
        noPay: res.pageVal
      })
    })
  },

  selectdetails: function(e) {
    wx.navigateTo({
      url: '../makemedicine/makemedicinedetails?mid=' + e.currentTarget.dataset.mid,
    })
  }
})