// pages/my/addregion.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
var Dec = require('../../common/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    upmod: {

    },
    city: '',
    area: '',
    province: '请选择收货地址',
    show: false
  },
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province.val+'-',
      city: e.detail.currentTarget.dataset.city.val+'-',
      area: e.detail.currentTarget.dataset.area.val
    })
  },
  chooseAddress: function() {
    var that = this;
    that.setData({
      show: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var upmod = wx.getStorageSync("upmod");
    wx.removeStorageSync("upmod")
    if (upmod != null && upmod != "") {
      this.setData({
        upmod: upmod
      })
    }
    this.setData({
      province: this.data.upmod.province,
      city: this.data.upmod.city,
      area: this.data.upmod.county
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
  inputchange: function(e) {
    var this_ = this;
    var inputname = e.target.dataset.inputname;
    if (inputname == "receiver") {
      this_.data.upmod.receiver = e.detail.value;
    }
    if (inputname == "telephone") {
      this_.data.upmod.telephone = e.detail.value;
    }
    if (inputname == "address") {
      this_.data.upmod.address = e.detail.value;
      
    }
    this.setData(this_.data);
  },
  // changeRegin(e) {
  //   this.data.upmod.province = e.detail.value[0];
  //   this.data.upmod.city = e.detail.value[1];
  //   this.data.upmod.county = e.detail.value[2];
  //   this.setData(this.data);
  // },
  nexts: function() {
    var this_ = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (this_.data.upmod.receiver == null || this_.data.upmod.receiver.trim() == "") {
      wx.showToast({
        title: "请输入收货人",
        icon: 'none'
      })
      return
    }
    if (this_.data.upmod.telephone == null || this_.data.upmod.telephone.trim() == "") {
      wx.showToast({
        title: "请输入联系方式",
        icon: 'none'
      })
      return
    }
    if (!myreg.test(this_.data.upmod.telephone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return
    }
    if (this_.data.province == null || this_.data.province.trim() == "" || this_.data.province == '请选择收货地址') {
      wx.showToast({
        title: "请选择省市区",
        icon: 'none'
      })
      return
    }
    if (this_.data.upmod.address == null || this_.data.upmod.address.trim() == "") {
      wx.showToast({
        title: "请输入详细地址",
        icon: 'none'
      })
      return
    }
    if (this_.data.upmod.id == null){
      this_.data.upmod.isdefault = 2;
    }
   
    this_.data.upmod.patientid = wx.getStorageSync("weixin").id;
    this_.data.upmod.province = this_.data.province;
    this_.data.upmod.city = this_.data.city;
    this_.data.upmod.county = this_.data.area;
    wxRequest.requests(this_.data.upmod.id == null ? 'patientaddressinfo/insertSelective' : 'patientaddressinfo/updateByPrimaryKeySelective', JSON.stringify(this_.data.upmod), function(res) {
      wx.showToast({
        title: "操作成功",
        icon: 'success'
      })
      wx.navigateBack({
        delta: 1,
      })
    })
  }
})