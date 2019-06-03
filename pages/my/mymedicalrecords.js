// pages/my/mymedicalrecords.js
var util = require('../../utils/util.js');
var wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.query(this)
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
    var _this = this;
    var uniond = wx.getStorageSync("weixin");
    var img = wx.getStorageSync("common");
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    this.setData({
      page: ++this.data.page
    })
    wxRequest.requests('PlacingOrder/casesPatients', JSON.stringify({
      parameters: uniond.id,
      pageLength: 5,
      pagination: _this.data.page
    }), function (res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        res.pageVal[i].doctorheadphoto = img.fastDfsUrl + res.pageVal[i].doctorheadphoto
            res.pageVal[i].serviceidtext = util.commonData.serviceid.secondText
        _this.data.medicalrecordInfo.push(res.pageVal[i])
      }
      if(res.pageVal.length>0){
        _this.setData({
          medicalrecordInfo: _this.data.medicalrecordInfo
        })
      }
      wx.hideLoading();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  query: function(_this) {
    var uniond = wx.getStorageSync("weixin");
    var img = wx.getStorageSync("common");
    wxRequest.requests('PlacingOrder/casesPatients', JSON.stringify({
      parameters: uniond.id,
      pageLength: 5,
      pagination: _this.data.page
    }), function(res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        res.pageVal[i].doctorheadphoto = img.fastDfsUrl + res.pageVal[i].doctorheadphoto
            res.pageVal[i].serviceidtext = util.commonData.serviceid.secondText
      }
      _this.setData({
        medicalrecordInfo: res.pageVal
      })
    })
  },

  askdetails: function (e) {
    var session = wx.getStorageSync("weixin")
    wxRequest.requests('ordermaintellinfo/getListByKey', JSON.stringify({ orderid: e.currentTarget.dataset.oid }), function (res) {
      if (res.length > 0) {
        wx.navigateTo({
          url: '../my/preliminarydatadetails?orderID=' + e.currentTarget.dataset.oid + '&sessionID=' + session.sessionId + '&isDoctor=2',
        })
      } else {
        wx.showToast({
          title: '该病历暂无问诊资料',
          icon: 'none'
        })
      }
    })

  },

  medical: function (e) {
    var session = wx.getStorageSync("weixin")
    wxRequest.requests('ordermaintellinfo/getListByKey', JSON.stringify({ orderid: e.currentTarget.dataset.oid }), function (res) {
      if (res.length > 0) {
        wx.navigateTo({
          url: '../my/medicalrecorddetails?sessionId=' + session.sessionId + '&orderId=' + e.currentTarget.dataset.oid,
        })
      } else {
        wx.showToast({
          title: '暂无病历详情信息',
          icon: 'none'
        })
      }
    })
  }
})