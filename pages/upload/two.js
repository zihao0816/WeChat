// pages/upload/two.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
var datasave = require('../../common/datasave.js');
const app = getApp();
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
    var upmod = wx.getStorageSync("information");
    console.log(upmod)
    wx.removeStorageSync("information");
    upmod.ordermaintellinfo = upmod.ordermaintellinfo == null ? {} : upmod.ordermaintellinfo;
    upmod.ordermaintellinfo.height = upmod.ordermaintellinfo.height == null ? '' : upmod.ordermaintellinfo.height;
    upmod.ordermaintellinfo.weight = upmod.ordermaintellinfo.weight == null ? '' : upmod.ordermaintellinfo.weight;
    this.setData({
      upmod: upmod,
      oid: options.orderid,
      did: options.doctorid,
      types: options.types
    });
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
    var weixin = wx.getStorageSync('weixin');
  console.log(weixin)
    var common=wx.getStorageSync('common');
    weixin.portrait = weixin.portrait != null && weixin.portrait != '' ? common.fastDfsUrl + weixin.portrait : ''
    if (weixin.patientname != '') {
      this.setData({
        isshow: false,
        weixin: weixin
      })
    } else {
      this.setData({
        isshow: true,
        weixin: weixin
      })
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
  symptomChange: function(e) {
    this.data.upmod.ordermaintellinfo.symptom = e.detail.value;
    this.setData(this.data);
  },

  allergichistoryChange: function(e) {
    this.data.upmod.ordermaintellinfo.allergichistory = e.detail.value;
    this.setData(this.data);
  },
  pastcaseChange: function(e) {
    this.data.upmod.ordermaintellinfo.pastcase = e.detail.value;
    this.setData(this.data);
  },
  heightChange: function(e){
    this.data.upmod.ordermaintellinfo.height = e.detail.value;
    this.setData(this.data);
  },
  weightChange: function (e) {
    this.data.upmod.ordermaintellinfo.weight = e.detail.value;
    this.setData(this.data);
  },
  nexts: function() {
    var _this = this;
    var weixin = wx.getStorageSync('weixin');
    if (this.data.upmod.ordermaintellinfo.symptom == null || this.data.upmod.ordermaintellinfo.symptom.trim() == "") {
      wx.showToast({
        title: "请填写病症自述",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.upmod.ordermaintellinfo.height == null || this.data.upmod.ordermaintellinfo.height.trim() == ''){
      wx.showToast({
        title: "请填写身高",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.upmod.ordermaintellinfo.weight == null || this.data.upmod.ordermaintellinfo.weight.trim() == '') {
      wx.showToast({
        title: "请填写体重",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wxRequest.requests('Inquiry/complainedModified', JSON.stringify({
      orderid: _this.data.oid,
      parientid: weixin.id,
      symptom: _this.data.upmod.ordermaintellinfo.symptom ? _this.data.upmod.ordermaintellinfo.symptom : '',
      pastcase: _this.data.upmod.ordermaintellinfo.pastcase ? _this.data.upmod.ordermaintellinfo.pastcase : '',
      allergichistory: _this.data.upmod.ordermaintellinfo.allergichistory ? _this.data.upmod.ordermaintellinfo.allergichistory : '',
      height: _this.data.upmod.ordermaintellinfo.height,
      weight: _this.data.upmod.ordermaintellinfo.weight
    }), function(res){
      if(res.result == 0){
        var newSendQueue = [];
        var sendQue = wx.getStorageSync("sendQue");
        sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;
        var newSendQueues = util.datas(weixin.id, _this.data.did, 'text', '我已上传问诊资料', '1', "99999999-9999999", 'patient_profile', _this.data.oid);
        datasave.insert(newSendQueues)
        sendQue.push(newSendQueues)
        wx.setStorageSync("sendQue", sendQue);
        app.sendseven(_this.data.did);
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  addpatients: function(){
    if(this.data.types != 1){
      wx.navigateTo({
        url: '../my/newmyprofiletwo',
      })
    }
  }
})