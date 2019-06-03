// pages/user/order.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待支付", "全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    width: 0,
    page: 1,
    status: 1,
    orderstate: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.query(this, 1);
    var that = this;
    //获取元素宽度
    var query = wx.createSelectorQuery();
    query.select('.weui-navbar__slider').boundingClientRect(function(rect) {
      that.setData({
        width: rect.width
      })
      wx.getSystemInfo({
        success: function(res) {
          var left = (res.windowWidth / 2 - 45) / 2;
          var widhtsmall = (that.data.width - 45) / 2
          var widths = left - widhtsmall;
          that.setData({
            sliderLeft: widths,
            sliderOffset: (res.windowWidth - 75) * that.data.activeIndex
          });
        }
      });
    }).exec();
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
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    this.setData({
      page: ++this.data.page
    })
    wxRequest.requests('PlacingOrder/queryMyOrders', JSON.stringify({
      patientid: uniond.id,
      paystate: _this.data.status,
      orderstate: _this.data.orderstate,
      pageLength: 5,
      pagination: _this.data.page
    }), function (res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].paystate == '1') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.unpaid
        } else if (res.pageVal[i].paystate == '2') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.paid
        }
        if (res.pageVal[i].serviceid == '5') {
          res.pageVal[i].servicetext = util.commonData.serviceid.prescription
          if (res.pageVal[i].paystate == '3') {
            res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
          }
        } else if (res.pageVal[i].serviceid != '5') {
              res.pageVal[i].servicetext = util.commonData.serviceid.secondText
          if (res.pageVal[i].orderstate == '4') {
            res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
          }
        }
        _this.data.noPay.push(res.pageVal[i])
      }
      if(res.pageVal.length>0){
        _this.setData({
          noPay: _this.data.noPay
        })
      }
      console.log(_this.data.noPay)
      wx.hideLoading();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      status: null
    });
    var state = null;
    var orderstate = null;
    if (e.currentTarget.id == 0) {
      state = 1
      orderstate = 1
      this.setData({
        status: 1,
        orderstate: 1
      })
    }else{
      this.setData({
        status: null,
        orderstate: null
      })
    }
    this.setData({
      page: 1
    })
    this.query(this, state)
  },

  orderpage: function(e) {
    var url = '';
    if (e.currentTarget.dataset.service == 5) {
      url = '../makemedicine/makemedicinedetails?mid=' + e.currentTarget.dataset.oid
    } else {
      url = '../order/physicianorderdetails?oid=' + e.currentTarget.dataset.oid
    }
    wx.navigateTo({
      url: url
    })
  },

  query: function(_this, state) {
    var uniond = wx.getStorageSync("weixin");
    wxRequest.requests('PlacingOrder/queryMyOrders', JSON.stringify({
      patientid: uniond.id,
      paystate: state,
      orderstate: _this.data.orderstate,
      pageLength: 5,
      pagination: 1
    }), function(res) {
      console.log(res)
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].paystate == '1') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.unpaid
        } else if (res.pageVal[i].paystate == '2') {
          res.pageVal[i].paystatetext = util.commonData.orderstate.paid
        }
        if (res.pageVal[i].serviceid == '5') {
          res.pageVal[i].servicetext = util.commonData.serviceid.prescription
          if (res.pageVal[i].paystate == '3') {
            res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
          }
        } else if (res.pageVal[i].serviceid != '5') {
              res.pageVal[i].servicetext = util.commonData.serviceid.secondText
          if (res.pageVal[i].orderstate == '4') {
            res.pageVal[i].paystatetext = util.commonData.orderstate.canceled
          }
        }
      }
      _this.setData({
        noPay: res.pageVal
      })
    })
  },

  cancelorder: function(e){
    var weixin = wx.getStorageSync('weixin');
    var _this = this;
    wx.showModal({
      title: '取消订单',
      content: '是否要取消“'+e.currentTarget.dataset.doctor+'”医生的在线复诊订单？',
      confirmColor: '#000000',
      success: function(res){
        if(res.confirm){
          wxRequest.requests('orderinfo/cleanOrderForCode?orderId=' + e.currentTarget.dataset.oid,null,function(rest){
            console.log(rest)
            if(rest.result==0){
              wx.showToast({
                title: '订单取消成功',
                icon: 'none'
              })
            }else{
              wx.showToast({
                title: '订单取消失败',
                icon: 'none'
              })
            }
            _this.query(_this, 1);
          })
        }
      }
    })
  }
})