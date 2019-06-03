// pages/doctor/doctordetails.js
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
    var state = options.state;
    var id = options.id;
    if (state != null && state != "" && id != null && id != ""){
      this.setData({
        state: {
          state: state,
          id: id
        }
      })
    }else{
      this.setData({
        state: JSON.parse(options.datas)
      })
     }
    
    if (this.data.state.state == 1) {
      wx.setNavigationBarTitle({
        title: '复诊医生',
      })
    } 
    // else if (this.data.state.state == 2) {
    //   wx.setNavigationBarTitle({
    //     title: '咨询医生',
    //   })
    // }

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
    this.query(this, this.data.state)
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

  query: function(_this, dataInfo) {
    wxRequest.requests('AppHomePage/Index', JSON.stringify({
      parameters: dataInfo.id
    }), function(res) {
      console.log(res)
      var img = wx.getStorageSync("common")
      res.doctorFace = img.fastDfsUrl + res.doctorFace
      res.skillname = res.skillname.split(',')
      for (var i = 0; i < img.inquiringprice.length; i++) {
        if (img.inquiringprice[i].itemcode == res.itaskprice) {
          res.itaskprice = img.inquiringprice[i].itemname
        }
        if (img.inquiringprice[i].itemcode == res.thaskprice) {
          res.thaskprice = img.inquiringprice[i].itemname
        }
        if (img.inquiringprice[i].itemcode == res.itagainprice) {
          res.itagainprice = img.inquiringprice[i].itemname
        }
        if (img.inquiringprice[i].itemcode == res.thagainprice) {
          res.thagainprice = img.inquiringprice[i].itemname
        }
      }
      _this.setData({
        dataInfo: {
          info: dataInfo,
          infos: res
        },
      })
    })
  },

  buygraphic: function(e) {
    var price = '';
    if (this.data.state.state == '1') {
      if (e.currentTarget.dataset.types == '1') {
        price = this.data.dataInfo.infos.itagainprice
      } else if (e.currentTarget.dataset.types == '2') {
        price = this.data.dataInfo.infos.thagainprice
      }
    } else if (this.data.state.state == '2') {
      if (e.currentTarget.dataset.types == '1') {
        price = this.data.dataInfo.infos.itaskprice
      } else if (e.currentTarget.dataset.types == '2') {
        price = this.data.dataInfo.infos.thaskprice
      }
    }
    if (this.data.dataInfo.infos.setprice != null && this.data.dataInfo.infos.setprice != '' && this.data.dataInfo.infos.setprice != 'false'){
      price = this.data.dataInfo.infos.setprice ;
    }
    wx.navigateTo({
      url: './purchasingservicedetails?state=' + this.data.state.state + '&types=' + e.currentTarget.dataset.types + '&price=' + price + '&doctorname=' + this.data.dataInfo.infos.doctorName + '&duties=' + this.data.dataInfo.infos.duties + '&hospitaname=' + this.data.dataInfo.infos.hospitaname + '&doctorFace=' + this.data.dataInfo.infos.doctorFace + '&doctorid=' + this.data.dataInfo.infos.doctorId,
    })
  }
})