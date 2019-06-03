// pages/upload/one.js
var wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upmod: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var weixin = wx.getStorageSync("weixin");
    var common = wx.getStorageSync("common");
    var upmod = {};
    var this_ = this;
    upmod.weight = weixin.weight;
    upmod.height = weixin.height;
    upmod.age = weixin.age;
    upmod.ingurl = upmod.ingurl == null ? [] : upmod.ingurl;
    upmod.addedCase = upmod.addedCase == null ? [] : upmod.addedCase;
    upmod.accordingTtongue = upmod.accordingTtongue == null ? [] : upmod.accordingTtongue;
    upmod.surfaceAccording = upmod.surfaceAccording == null ? [] : upmod.surfaceAccording;
    upmod.otherdetails = upmod.otherdetails == null ? [] : upmod.otherdetails;
    upmod.accordingTtongueurl = upmod.accordingTtongueurl == null ? [] : upmod.accordingTtongueurl;
    upmod.surfaceAccordingurl = upmod.surfaceAccordingurl == null ? [] : upmod.surfaceAccordingurl;
    upmod.otherdetailsurl = upmod.otherdetailsurl == null ? [] : upmod.otherdetailsurl;
    upmod.deletePhoto = upmod.deletePhoto == null ? [] : upmod.deletePhoto;
    upmod.orderid = options.orderid;
    upmod.doctorid = options.doctorid;
    upmod.reorderinquiryquestion = upmod.reorderinquiryquestion == null ? [] : upmod.reorderinquiryquestion;

    wxRequest.requests("Inquiry/orderDetails", JSON.stringify({
      orderID: options.orderid,
      getCase: 1,
      getPrescriptionOrder: 2
    }), null, null, null, function(res) {
      if (res.result != -1) {
        upmod.reorderinquiryquestion = res.reorderinquiryquestion;
        upmod.addedCase = res.initialCases;
        upmod.accordingTtongue = res.accordingTtongue;
        upmod.surfaceAccording = res.surfaceAccording;
        upmod.otherdetails = res.otherdetails;
        for (var i = 0; i < upmod.addedCase.length; i++) {
          upmod.ingurl.push(common.fastDfsUrl + upmod.addedCase[i]);
        }
        for (var i = 0; i < upmod.accordingTtongue.length; i++) {
          upmod.accordingTtongueurl.push(common.fastDfsUrl + upmod.accordingTtongue[i]);
        }
        for (var i = 0; i < upmod.surfaceAccording.length; i++) {
          upmod.surfaceAccordingurl.push(common.fastDfsUrl + upmod.surfaceAccording[i]);
        }
        for (var i = 0; i < upmod.otherdetails.length; i++) {
          upmod.otherdetailsurl.push(common.fastDfsUrl + upmod.otherdetails[i]);
        }
        if (res.ordermaintellinfo != null) {
          upmod.symptom = res.ordermaintellinfo.symptom;
          upmod.age = res.ordermaintellinfo.age;
          upmod.height = res.ordermaintellinfo.height;
          upmod.weight = res.ordermaintellinfo.weight;
          upmod.allergichistory = res.ordermaintellinfo.allergichistory;
          upmod.pastcase = res.ordermaintellinfo.pastcase;
        }
      }
      this_.setData({
        upmod: upmod,
        weixin: weixin
      })
      this_.queryList()
    })



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
    var weixin = wx.getStorageSync("weixin");
    this.data.upmod.weight = weixin.weight;
    this.data.upmod.height = weixin.height;
    this.data.upmod.age = weixin.age;
    this.setData({
      upmod: this.data.upmod,
      weixin: weixin
    })
   
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

  queryList: function() {
    var weixin = wx.getStorageSync("weixin");
    var this_ = this;
    wxRequest.requests("patientinitcase/getListByKey", JSON.stringify({
      parientid: weixin.id,
      norderid: this_.data.upmod.orderid
    }), function(res) {
      if (res.length > 0) {
        this_.setData({
          isshows: false
        })
      } else {
        this_.setData({
          isshows: true
        })
      }
    })
  },

  next: function() {
    wx.setStorageSync("upmod", this.data.upmod);
    wx.navigateTo({
      url: './two',
    })
  },

  nexts: function() {
    if (this.data.upmod.addedCase.length == 0) {
      wx.showToast({
        title: "请上传病历图片",
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.setStorageSync("upmod", this.data.upmod);
      wx.navigateTo({
        url: './two',
      })
    }

  },
  myfiles: function() {
    wx.navigateTo({
      url: '../my/myprofile?show=2&urls=1&skip=navigateBack'
    })
  },
  upimage: function() {
    var common = wx.getStorageSync("common");
    var this_ = this;
    wxRequest.uploadLocal(function(data) {
      this_.data.upmod.ingurl.push(common.getLocal + data.fileUrl)
      this_.data.upmod.addedCase.push(data.fileUrl)
      this_.setData(this_.data);
    })
  },

  delimage: function(e) {
    var filename = e.target.dataset.filename;
    var ingurl = [];
    var addedCase = [];
    var deletePhoto = [];

    for (var i = 0; i < this.data.upmod.addedCase.length; i++) {
      if (this.data.upmod.addedCase[i] != filename) {
        addedCase.push(this.data.upmod.addedCase[i]);
        ingurl.push(this.data.upmod.ingurl[i]);
      } else {
        deletePhoto.push(this.data.upmod.addedCase[i]);
      }
    }
    this.data.upmod.addedCase = addedCase;
    this.data.upmod.deletePhoto = deletePhoto;
    this.data.upmod.ingurl = ingurl;
    this.setData(this.data);
  },
  seephoto: function(e) {
    var this_ = this;
    wx.previewImage({
      current: e.target.dataset.fileurl, // 当前显示图片的http链接
      urls: this_.data.upmod.ingurl // 需要预览的图片http链接列表
    })
  },


})