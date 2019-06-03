// pages/my/newmyprofile.js
var util = require('../../utils/util.js');
var Dec = require('../../common/public.js'); //引用封装好的加密解密js
var wxRequet = require('../../utils/wxRequest.js'); //引用封装好的request
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getauthtext: '获取验证码',
    show: false,
    user:{
      telephone:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync('weixin');
    if (user != null) {
      this.setData({
        user: user,
        options: options
      })}
    
    this.text()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.zhixin = {
      type: 2,
      val: this,
      dosome: this.text
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  text: function () {
    var _this=this;
    var options = this.data.options;
    var weixin = wx.getStorageSync("weixin");
    if (weixin == null || weixin.telephone == null || weixin.telephone.trim() == "") {
      options.show = "1";
    }else{
      options.show = "2";
    }
    var val = {
      show: options.show,
      urls: options.urls,
      skip: options.skip
    }
    this.setData({
      val: val
    });
    if (val.show == "2") {
      this.setData({
        yzshow: true,
      })
    } else {
      this.setData({
        yzshow: false
      })
    }
  },
  inputchange: function (e) {
    // let inputName = e.currentTarget.dataset.inputname;
    // if ((inputName == "weight" || inputName == 'height') && e.detail.value.length > 3) {
    //   e.detail.value = e.detail.value.substring(e.detail.value.length - 3, e.detail.value.length);
    // }
    this.data.user.telephone = e.detail.value
    this.setData({
      user: this.data.user
    })
   
  },
  yym2: function (e) {
    // let inputName = e.currentTarget.dataset.inputname;
    // if ((inputName == "weight" || inputName == 'height') && e.detail.value.length > 3) {
    //   e.detail.value = e.detail.value.substring(e.detail.value.length - 3, e.detail.value.length);
    // }
  
    this.data.yzm = e.detail.value
  },
  getauthtextfun: function (time) {
    var this_ = this;
    if (time == 0) {
      this.setData({
        getauthdisabled: false
      })
      this.setData({
        getauthtext: '获取验证码',
        color: true
      })
    } else {
      this.setData({
        getauthtext: '获取验证码' + time + 's',
        color: false
      })
      setTimeout(function () {
        this_.getauthtextfun(--time)
      }, 1000)
    }
  },
    yancode: function () {
    var this_ = this;
      var phone = Dec.Encrypt(this_.data.user.telephone);
    var myreg = /((^[0-9]{3,4}-[0-9]{7,8}-[0-9]{0,6}$)|(^[0-9]{3,4}-[0-9]{7,8}$)|(^[0-9]+$))?/;
      if (!myreg.test(this_.data.user.telephone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return false;
    } else {
      wxRequet.requests('AppHomePage/verificationCode/getPhoneCode?', JSON.stringify({
        parameters: phone
      }), null, null, null, function (res) {
        if (res.code == "OK") {
          this_.setData({
            getauthdisabled: true
          })
          setTimeout(function () {
            this_.getauthtextfun(60)
          }, 1000)
        } else {
          wx.showToast({
            title: "发送失败",
            icon: 'none'
          })
        }
      });
    }

  },
  next:function(){
    var this_=this;
    if (this.data.user.telephone == null || this.data.user.telephone.trim() == "") {
      wx.showToast({
        title: "请输入手机号",
        icon: 'none'
      })
      return
    }
    wxRequet.requests("Personal/ImprovePhoneNumber", JSON.stringify({ phoneCode: this_.data.yzm, telephone: this_.data.user.telephone, id: this_.data.user.id}), function (val) {
      var weixin = wx.getStorageSync("weixin");
      weixin.telephone = this_.data.user.telephone;
      wx.setStorageSync("weixin", weixin);
      wxRequet.pageturns(this_.data.val.urls, this_.data.val.skip)
      wx.showToast({
        title: "操作成功",
        icon: 'success'
      })
    })
  }
})