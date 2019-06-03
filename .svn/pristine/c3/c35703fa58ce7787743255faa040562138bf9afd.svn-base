// pages/problemfeedback/index.js
var wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  getText: function(e){
    this.setData({
      value: e.detail.value
    })
  },

  send: function(){
    var uniond = wx.getStorageSync("weixin")
    var data = {
      content: this.data.value,
      usertype: 1,
      person: uniond.id
    }
    if(this.data.value == null || this.data.value == ''){
      wx.showToast({
        title: '请填写问题反馈信息',
        icon: 'none'
      })
      return
    }
    wxRequest.requests('feedbackinfo/insertSelective',JSON.stringify(data),function(res){
      wx.switchTab({
        url: '../my/index',
      })
      wx.showToast({
        title: '感谢您的反馈，我们会继续努力！',
        icon:'none'
      })
    })
  }
})