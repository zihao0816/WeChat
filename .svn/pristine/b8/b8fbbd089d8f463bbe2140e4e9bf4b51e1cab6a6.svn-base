// pages/my/index.js
var wxRequest = require('../../utils/wxRequest.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    modalHidden2: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    var userData = wx.getStorageSync("weixin");
    this.setData({
      user: {
        img: userData.headphoto,
        name: userData.patientname == '' ? userData.patientnickname : userData.patientname,
        tel: userData.telephone
      }
    })
    app.globalData.zhixin = {type:2,val:this}
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

  myfiles: function(e){
    if (e.currentTarget.dataset.tel == null || e.currentTarget.dataset.tel == ''){
      wx.navigateTo({
        url: './newmyprofile?urls=./index&skip=reLaunch',
      })
    }
  },

  contactService: function(){
    wx.getStorage({
      key : 'common',
      success:function(res){
        wx.makePhoneCall({
          phoneNumber: res.data.serviceTel,
          success: function () {
            console.log('成功')
          },
          fail: function () {
            console.log('失败')
          }
        })
      }
    })
  },
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
})