// pages/upload/four.js
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
    upmod.deletePhoto = upmod.deletePhoto == null ? [] : upmod.deletePhoto;
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

  nexts: function() {
    var _this = this;
    var weixin = wx.getStorageSync('weixin');
    if (_this.data.upmod.surfaceAccording.length < 1 || _this.data.upmod.accordingTtongue.length < 1) {
      wx.showToast({
        title: "请完善舌照面照",
        icon: 'none'
      })
      return
    }
    wxRequest.requests('Inquiry/tongueFace',JSON.stringify({
      orderid: _this.data.oid,
      doctorid: _this.data.did,
      parientid: weixin.id,
      accordingTtongue: _this.data.upmod.accordingTtongue,
      surfaceAccording: _this.data.upmod.surfaceAccording,
      otherdetails: _this.data.upmod.otherdetails,
      deletePhoto: _this.data.upmod.deletePhoto
    }),function(res){
      if(res.result == 0){
        wx.setStorageSync('information', _this.data.upmod);
        var newSendQueue = [];
        var sendQue = wx.getStorageSync("sendQue");
        sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;
        var newSendQueues = util.datas(weixin.id, _this.data.did, 'text', '我已上传舌照面照', '1', "99999999-9999999", 'facePicFinish', _this.data.oid);
        datasave.insert(newSendQueues)
        sendQue.push(newSendQueues)
        wx.setStorageSync("sendQue", sendQue);
        app.sendseven(_this.data.did);
        wx.navigateBack({
          delta: 1
        })
      }
    })
    // wxRequest.requests("Inquiry/uploadInitialCase", JSON.stringify(this_.data.upmod), function(res) {
    //   var uniond = wx.getStorageSync('weixin');
    //   wx.setStorageSync("toimid", this_.data.upmod.doctorid)
    //   if (res.parameters == 1) {
        // var newSendQueue = [];
        // var sendQue = wx.getStorageSync("sendQue");
        // sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;
        // var newSendQueues = util.datas(uniond.id, this_.data.upmod.doctorid, 'text', '我已上传问诊资料', '1', "99999999-9999999", 'patient_profile', this_.data.upmod.orderid);
        // datasave.insert(newSendQueues)
        // sendQue.push(newSendQueues)
        // wx.setStorageSync("sendQue", sendQue);
        // app.sendseven(this_.data.upmod.doctorid);
    //   }
      // wx.switchTab({
      //   url: '../index/index',
      // })
    // })
  },
  upimage: function(e) {
    var filetype = e.target.dataset.filetype;
    var common = wx.getStorageSync("common");
    var this_ = this;
    wxRequest.uploadLocal(function(data) {
      if (filetype == "surfaceAccording") {
        this_.data.upmod.surfaceAccordingurl.push(common.getLocal + data.fileUrl)
        this_.data.upmod.surfaceAccording.push(data.fileUrl)
      }
      if (filetype == "otherdetails") {
        this_.data.upmod.otherdetailsurl.push(common.getLocal + data.fileUrl)
        this_.data.upmod.otherdetails.push(data.fileUrl)
      }
      if (filetype == "accordingTtongue") {
        this_.data.upmod.accordingTtongueurl.push(common.getLocal + data.fileUrl)
        this_.data.upmod.accordingTtongue.push(data.fileUrl)
      }

      this_.setData(this_.data);
    })
  },

  delimage: function(e) {
    var filetype = e.target.dataset.filetype;
    var filename = e.target.dataset.filename;
    var url = [];
    var photo = [];
    var deletePhoto = this.data.upmod.deletePhoto;

    if (filetype == "surfaceAccording") {
      for (var i = 0; i < this.data.upmod.surfaceAccording.length; i++) {
        if (this.data.upmod.surfaceAccording[i] != filename) {
          photo.push(this.data.upmod.surfaceAccording[i]);
          url.push(this.data.upmod.surfaceAccordingurl[i]);
        } else {
          deletePhoto.push(this.data.upmod.surfaceAccording[i]);
        }
      }
      this.data.upmod.surfaceAccording = photo;
      this.data.upmod.deletePhoto = deletePhoto;
      this.data.upmod.surfaceAccordingurl = url;
    }
    if (filetype == "otherdetails") {
      for (var i = 0; i < this.data.upmod.otherdetails.length; i++) {
        if (this.data.upmod.otherdetails[i] != filename) {
          photo.push(this.data.upmod.otherdetails[i]);
          url.push(this.data.upmod.otherdetailsurl[i]);
        } else {
          deletePhoto.push(this.data.upmod.otherdetails[i]);
        }
      }
      this.data.upmod.otherdetails = photo;
      this.data.upmod.deletePhoto = deletePhoto;
      this.data.upmod.otherdetailsurl = url;
    }
    if (filetype == "accordingTtongue") {
      for (var i = 0; i < this.data.upmod.accordingTtongue.length; i++) {
        if (this.data.upmod.accordingTtongue[i] != filename) {
          photo.push(this.data.upmod.accordingTtongue[i]);
          url.push(this.data.upmod.accordingTtongueurl[i]);
        } else {
          deletePhoto.push(this.data.upmod.accordingTtongue[i]);
        }
      }
      this.data.upmod.accordingTtongue = photo;
      this.data.upmod.deletePhoto = deletePhoto;
      this.data.upmod.accordingTtongueurl = url;
    }
    this.setData(this.data);
  },

  seephoto: function(e) {
    var filetype = e.target.dataset.filetype;
    var url = [];
    var this_ = this;
    if (filetype == "accordingTtongue") {
      url = this_.data.upmod.accordingTtongueurl;
    }
    if (filetype == "otherdetails") {
      url = this_.data.upmod.otherdetailsurl;
    }
    if (filetype == "surfaceAccording") {
      url = this_.data.upmod.surfaceAccordingurl;
    }
    wx.previewImage({
      current: e.target.dataset.fileurl, // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  },
})