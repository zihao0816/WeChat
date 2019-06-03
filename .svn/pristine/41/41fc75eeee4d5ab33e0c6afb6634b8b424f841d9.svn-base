// pages/my/mycoupons.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
const app = getApp()
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
    if (options.yhj != null && options.yhj != "") {
      this.setData({
        yhj: options.yhj
      })
    }
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
    this.query(this)
    app.globalData.zhixin = {
      type: 2,
      val: this
    }
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

  query: function(_this) {
    var uniond = wx.getStorageSync("weixin");
    wxRequest.requests('PlacingOrder/getMypreferentialPrice', JSON.stringify({
      parameters: uniond.id
    }), function(res) {
      var unusable = [];
      var workability = [];
      if (res.parameters != null) {
        for (var i = 0; i < res.parameters.length; i++) {
          switch (res.parameters[i].state) {
            case '1':
              res.parameters[i].statetext = util.commonData.couponsstate.unclaimed
              break
            case '2':
              res.parameters[i].statetext = util.commonData.couponsstate.received
              break
            case '3':
              res.parameters[i].statetext = util.commonData.couponsstate.used
              break
            case '4':
              res.parameters[i].statetext = util.commonData.couponsstate.invalid
              break
            default:
              break
          }
          if (res.parameters[i].state == 2 && res.parameters[i].afterinvalidity != 1) {
            workability.push(res.parameters[i]);
          } else {
            if (res.parameters[i].afterinvalidity == 1) {
              res.parameters[i].statetext = util.commonData.couponsstate.expired
            }
            unusable.push(res.parameters[i])
          }
        }
      }
      _this.setData({
        couponsInfo: workability,
        num: workability.length==0?0:workability.length,
        unusable: unusable
      })
    })
  },

  selectList: function() {
    var this_ = this;
    wx.setStorageSync("unusable", this_.data.unusable)
    wx.navigateTo({
      url: './couponsList',
    })
  },
  selectCoupon: function(e) {
    if (this.data.yhj == 1) {
      var beforeinvalidity = e.currentTarget.dataset.beforeinvalidity;
      var time = new Date();
      var str = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
      var overtime = e.currentTarget.dataset.overtime;

      if (beforeinvalidity == 1) {
        wx.showToast({
          title: "还未到此优惠价使用时间",
          icon: 'none',
          duration: 2000
        })
      }
      if (Date.parse(str) > Date.parse(overtime)) {
        wx.showToast({
          title: '您的优惠券已失效',
          icon: 'none'
        })
      } else {
        wx.setStorageSync("coupon", {
          price: e.currentTarget.dataset.price,
          id: e.currentTarget.dataset.id
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  }
})