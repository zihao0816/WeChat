// pages/doctor/purchasingservicedetails.js
var wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   * state 判断页面是复诊还是咨询 1为复诊2为咨询
   * types 判断页面是购买图文还是电话 1为图文2为电话
   */
  data: {
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.state == 1) {
      if (options.types != 1) {
        options.text = '在线复诊'
        options.serviceid = 2
        wx.setNavigationBarTitle({
          title: '购买在线复诊'
        })
      }
    }
    this.setData({
      newservice: options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var coupon = wx.getStorageSync("coupon");
    if (coupon != null && coupon != "") {
      wx.removeStorageSync("coupon");
      this.data.newservice.saleprice = coupon.price;
      this.data.newservice.actualprice = this.data.newservice.price * 1 - coupon.price * 1;
      this.data.newservice.actualprice = this.data.newservice.actualprice < 0 ? 0 : this.data.newservice.actualprice;
      this.data.newservice.couponid = coupon.id;
      this.setData(this.data)
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

  contactService: function() {
    wx.getStorage({
      key: 'common',
      success: function(res) {
        wx.makePhoneCall({
          phoneNumber: res.data.serviceTel,
          success: function() {
            console.log('成功')
          },
          fail: function() {
            console.log('失败')
          }
        })
      }
    })
  },
  paid: function() {
    if (this.data.disabled) {
      return
    }
    var _this = this;
    this.data.disabled = true;
   
    this.setData({
      disabled: true
    })
    setTimeout(function(){
      _this.setData({
        disabled: false
      })
    },5000)
    var uniond = wx.getStorageSync("weixin")
    var data = {
      doctorid: this.data.newservice.doctorid,
      patientid: uniond.id,
      serviceid: this.data.newservice.serviceid,
      paytype: 1,
      kfc: this.data.newservice.couponid
    }
    var this_ = this;
    wx.navigateTo({
      url: '../index/index',
    })
    wxRequest.requests('PlacingOrder/DialecticalOpen', JSON.stringify(data), function(res) {
      res.parameters = res.orderinfo
      var orderId = res.parameters.id
     
      var val = res.weiPayReturnEntiey;
        _this.setData({
          disabled: false
        })
        console.log(val)
        if (val.return_code == "SUCCESS") {
          var dosuccess = function() {
            wx.setStorageSync("toimid", this_.data.newservice.doctorid)
            wx.switchTab({
              url: '../index/index',
            })
            wx.showToast({
              title: "操作成功",
              icon: 'success'
            });
          }
          if (val.totalfee == 0) {
            dosuccess()
          } else {
            wx.requestPayment({
              'appId': val.weiAppLetEntity.appId,
              'timeStamp': val.weiAppLetEntity.timeStamp,
              'nonceStr': val.weiAppLetEntity.nonceStr,
              'package': val.weiAppLetEntity.package,
              'signType': val.weiAppLetEntity.signType,
              'paySign': val.weiAppLetEntity.paySign,
              'success': function(res) {
                setTimeout(function() {
                  dosuccess()
                }, 500)
              },
              'fail': function(res) {
                if (res.errMsg != null && res.errMsg == "requestPayment:fail cancel") {
                  wx.redirectTo({
                    url: "../order/physicianorderdetails?oid=" + orderId
                  })
                } else if (res.err_desc != null && res.err_desc != "") {
                  wx.showToast({
                    title: res.err_desc,
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
            })
          }
        }
        if (val.return_code == "FAIL") {
          wx.showToast({
            title: val.return_msg,
            icon: 'none',
            duration: 2000
          })
        }
      
    }, function(res) {
      var message = res.message;

      if (res.action == 1) {
        wx.navigateTo({
          url: '../my/newmyprofile?urls=1&skip=navigateBack'
        })
      }
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    })
  },
  mycoupons: function(e) {
    wx.navigateTo({
      url: '../my/mycoupons?yhj=1',
    })
  }
})