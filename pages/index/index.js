//index.js
//获取应用实例
var wxRequest = require('../../utils/wxRequest.js'); //引用封装好的request
var util = require('../../utils/util.js');
var datasave = require('../../common/datasave.js');
const app = getApp()

Page({
  data: {
    doubleclick: true,
    getuser: true,
    inputShowed: false,
    inputVal: ""
  },
  onLoad: function(options) {
    if (options.toimid != null && options.toimid!=""){
      this.data.toimid = options.toimid
    }
  },
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        getuser: true
      });
      app.onLaunch()
    }
  },
  onShow: function() {
    this.setData({
      getuser: app.globalData.getuser
    });
    var _this = this;
    var toimid = wx.getStorageSync("toimid");
    wx.removeStorageSync("toimid")
    if (toimid != null && toimid != "") {
      this.data.toimid = toimid
    }
    this.getDoctor(_this);
    this.getoffline(this);
    app.globalData.zhixin = {
      type: 1,
      val: this
    };
    app.globalData.indexzhixin = this;
  },

  onHide: function() {},

  getDoctor: function(_this) {
    var datas = wx.getStorageSync("weixin"),
      img = wx.getStorageSync("common");
    wxRequest.requests('Inquiry/GetDoctors', JSON.stringify({
      parameters: datas.id
    }), function(res) {
      for (var i = 0; i < res.doctorsItems.length; i++) {
        res.doctorsItems[i].doctorFace = img.fastDfsUrl + res.doctorsItems[i].doctorFace;
        if (res.doctorsItems[i].clinicType == '1') {
          res.doctorsItems[i].clinicType = util.commonData.serviceid.secondText
        }
        if (_this.data.toimid == res.doctorsItems[i].doctorId) {
          wx.setStorageSync("toImMode", res.doctorsItems[i]);
          _this.data.toimid=null;
          wx.navigateTo({
            url: '../im/index',
          })
        }
      }
      _this.data.doctorInfo = res.doctorsItems

      _this.getOffLineData()
    })
  },

  getOffLineData: function() {
    try {
      var _this = this
      var newList = [];
      var unionid = wx.getStorageSync("weixin")
      var imdatas = wx.getStorageSync("imkey")
      //分类每个医生对应的离线数据
      if (imdatas.length > 0) {
        for (var i = 0; i < imdatas.length; i++) {
          var doctorid = imdatas[i].senderId == unionid.id ? imdatas[i].receiverId : imdatas[i].senderId;
          if (!newList[doctorid]) {
            var arr = [];
            arr.push(imdatas[i]);
            newList[doctorid] = arr;
          } else {
            newList[doctorid].push(imdatas[i])
          }
        }
      }
      for (var j = 0; j < _this.data.doctorInfo.length; j++) {
        if (newList[_this.data.doctorInfo[j].doctorId] != null) {
          var index = newList[_this.data.doctorInfo[j].doctorId].length - 1
          if (newList[_this.data.doctorInfo[j].doctorId][index].message.type == 'voice') {
            _this.data.doctorInfo[j].message = '[语音]'
          } else if (newList[_this.data.doctorInfo[j].doctorId][index].message.type == 'picture') {
            _this.data.doctorInfo[j].message = '[图片]'
          } else if (newList[_this.data.doctorInfo[j].doctorId][index].businessType && (newList[_this.data.doctorInfo[j].doctorId][index].businessType == 'EndOrder' || newList[_this.data.doctorInfo[j].doctorId][index].businessType == 'doctorEndOrder')){
            _this.data.doctorInfo[j].message = '本次服务已结束'
          }else {
            _this.data.doctorInfo[j].message = newList[_this.data.doctorInfo[j].doctorId][index].message.body
          }
          var newyear = new Date().getFullYear();
          var newmouth = new Date().getMonth() + 1;
          var newday = new Date().getDate();
          var newdays = new Date().getDate() - 7;
          var newtime = newyear + '/' + newmouth + '/' + newday + ' 00:00:00';
          var newtimee = '';
          var newtimes = new Date(newtime).getTime();
          if (newdays == 0) {
            var oldmouth = newmouth - 1;
            var oldday = new Date(newyear, oldmouth, newdays).getDate();
            newtimee = newyear + '/' + oldmouth + '/' + oldday + ' 00:00:00';
          } else if (newdays < 0) {
            var oldmouth = newmouth - 1;
            var oldday = new Date(newyear, oldmouth, 0).getDate() + newdays;
            newtimee = newyear + '/' + oldmouth + '/' + oldday + ' 00:00:00';
          } else {
            newtimee = newyear + '/' + oldmouth + '/' + newdays + ' 00:00:00';
          }
          var newtimese = new Date(newtimee).getTime();
          _this.data.doctorInfo[j].snedTime = newList[_this.data.doctorInfo[j].doctorId][index].snedTime == null ? _this.data.doctorInfo[j].isOrder == 1 ? new Date().getTime() : 0 : newList[_this.data.doctorInfo[j].doctorId][index].snedTime * 1;
          if (newList[_this.data.doctorInfo[j].doctorId][index].snedTime != null) {
            if (newList[_this.data.doctorInfo[j].doctorId][index].snedTime > newtimes) {
              _this.data.doctorInfo[j].sendTime = util.timestampToTime(newList[_this.data.doctorInfo[j].doctorId][index].snedTime, 5)
            } else if (newList[_this.data.doctorInfo[j].doctorId][index].snedTime < newtimes && newList[_this.data.doctorInfo[j].doctorId][index].snedTime > newtimese) {
              _this.data.doctorInfo[j].sendTime = util.timestampToTime(newList[_this.data.doctorInfo[j].doctorId][index].snedTime, 8)
            } else {
              _this.data.doctorInfo[j].sendTime = util.timestampToTime(newList[_this.data.doctorInfo[j].doctorId][index].snedTime, 2)
            }
          }
          _this.data.doctorInfo[j].isshow = newList[_this.data.doctorInfo[j].doctorId][index].read == 2 && newList[_this.data.doctorInfo[j].doctorId][index].senderId == _this.data.doctorInfo[j].doctorId;
          
        }
      }
      for (var i = 0; i < _this.data.doctorInfo.length; i++) {
        for (var j = i + 1; j < _this.data.doctorInfo.length; j++) {
          if (_this.data.doctorInfo[i].snedTime < _this.data.doctorInfo[j].snedTime) {
            var stime = _this.data.doctorInfo[i];
            _this.data.doctorInfo[i] = _this.data.doctorInfo[j];
            _this.data.doctorInfo[j] = stime;
          }
        }
      }
      _this.setData({
        doctorInfo: _this.data.doctorInfo
      })
      for (var n = 0; n < _this.data.doctorInfo.length; n++) {
        if (_this.data.doctorInfo[n].isshow) {
          wx.showTabBarRedDot({
            index: 0,
          })
          return;
        } else {
          wx.hideTabBarRedDot({
            index: 0,
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  },
  
  getoffline: function(_this) {
    var uniond = wx.getStorageSync("weixin");
  },

  sorts: function(x, y) {
    return y.snedTime * 1 - x.snedTime * 1
  },

  talking: function(e) {
    var _this = this
    if (_this.data.doubleclick == true) {
      _this.setData({
        doubleclick: false
      })
      setTimeout(function() {
        _this.setData({
          doubleclick: true
        })
      }, 2000)
      for (var i = 0; i < this.data.doctorInfo.length; i++) {
        if (this.data.doctorInfo[i].doctorId == e.currentTarget.dataset.did) {
          wx.setStorageSync("toImMode", this.data.doctorInfo[i]);
          _this.data.toimid = null;
          wx.navigateTo({
            url: '../im/index',
          })
        }
      }
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
})