// pages/makemedicine/index.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
const app = getApp()
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
    this.setData({
      page: 1
    })
    this.query(this);
    app.globalData.zhixin = {
      type: 2,
      val: this
    };
    this.querys(1)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  query: function(_this) {
    var uniond = wx.getStorageSync("weixin");
    wxRequest.requests('PlacingOrder/takeMedicineList', JSON.stringify({
      parameters: uniond.id,
      pageLength: 4,
      pagination: _this.data.page
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
      if(res.pageVal.length<1){
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
      _this.setData({
        noPay: res.pageVal
      })
    })
  },

   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    var uniond = wx.getStorageSync("weixin");
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    this.setData({
      page: ++this.data.page
    })
    wxRequest.requests('PlacingOrder/takeMedicineList', JSON.stringify({
      parameters: uniond.id,
      pageLength: 4,
      pagination: _this.data.page
    }), function (res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].paystate == '1') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.unpaid
        } else if (res.pageVal[i].paystate == '2') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.paid
        } else if (res.pageVal[i].paystate == '3') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
        }
        _this.data.noPay.push(res.pageVal[i])
      }
      _this.setData({
        noPay: _this.data.noPay
      })
      wx.hideLoading();
    })
  },

  selectdetails: function(e) {
    wx.navigateTo({
      url: './makemedicinedetails?mid=' + e.currentTarget.dataset.mid,
    })
  },

  querys: function(index){
    var _this = this
    var uniond = wx.getStorageSync('weixin');
    wxRequest.requests('PlacingOrder/takeMedicineList', JSON.stringify({
      parameters: uniond.id,
      pageLength: 4,
      pagination: index
    }),function(res){
      var result = wx.getStorageSync('makemedicine') ? wx.getStorageSync('makemedicine'):[]
      for(var i=0;i<res.pageVal.length;i++){
        result.push(res.pageVal[i].id)
      }
      wx.setStorageSync('makemedicine', result)
      if(index<res.pageCount){
        index++
        _this.querys(index)
      }
    })
  }
})