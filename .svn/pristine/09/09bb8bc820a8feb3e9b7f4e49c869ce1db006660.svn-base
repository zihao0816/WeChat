// pages/user/user.js
var util = require('../../utils/util.js');
var Dec = require('../../common/public.js'); //引用封装好的加密解密js
var wxRequet = require('../../utils/wxRequest.js'); //引用封装好的request
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [{
      name: '男',
      key: 1
    }, {
      name: '女',
      key: 2
    }],
    date: '',
    upmode: {
      region: []
    },
    inputtext: '',
    getauthtext: '获取验证码',
    getauthdisabled: false,
    province: '',
    city: '',
    area: '',
    show: false,
    province: '请选择',
    color: true
  },
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province.val,
      city: e.detail.currentTarget.dataset.city.val,
      area: e.detail.currentTarget.dataset.area.val
    })
  },
  chooseAddress: function() {
    var that = this;
    that.setData({
      show: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    this.text()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  text: function() {
    var options = this.data.options;
    var weixin = wx.getStorageSync("weixin");
    if (weixin != null && weixin != "" && options.show == "2") {
      if (weixin == null || weixin.telephone == null || weixin.telephone.trim() == "") {
        options.show = "1";
      }
      this.initVal();
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
      this.initVal();
      this.setData({
        yzshow: true,
      })
    } else {
      this.setData({
        yzshow: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.globalData.zhixin = {
      type: 2,
      val: this,
      dosome: this.text
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
  // 获取radiovalue
  radioChange: function(e) {
    var sexlist = this.data.sexList;
    for (var i = 0;i<sexlist.length;i++) {
      sexlist[i].checkeds = sexlist[i].key == e.detail.value;
    }
    this.setData({
      sexList: sexlist,
      sex: e.detail.value
    })
  },
  //获取年龄
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  inputchange: function(e) {
    let inputName = e.currentTarget.dataset.inputname;
    // if ((inputName == "weight" || inputName == 'height') && e.detail.value.length > 3) {
    //   e.detail.value = e.detail.value.substring(e.detail.value.length - 3, e.detail.value.length);
    // }
    let fullInputName = `upmode.${inputName}`;
    this.setData({
      [fullInputName]: e.detail.value,
      focus: true
    })
  },
  yancode: function() {
    var this_ = this;
    var phone = Dec.Encrypt(this.data.upmode.phonenum);
    var myreg = /((^[0-9]{3,4}-[0-9]{7,8}-[0-9]{0,6}$)|(^[0-9]{3,4}-[0-9]{7,8}$)|(^[0-9]+$))?/;
    if (!myreg.test(this.data.upmode.phonenum)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return false;
    } else {
      wxRequet.requests('AppHomePage/verificationCode/getPhoneCode?', JSON.stringify({
        parameters: phone
      }), null, null, null, function(res) {
        if (res.code == "OK") {
          this_.setData({
            getauthdisabled: true
          })
          setTimeout(function() {
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
  getauthtextfun: function(time) {
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
      setTimeout(function() {
        this_.getauthtextfun(--time)
      }, 1000)
    }
  },
  next: function() {
    var this_ = this;
    var data = {};
    var url = 'Personal/upMyInformation';
    var a = wx.getStorageSync("weixin");
    data.id = a.id;
    data.patientname = this.data.upmode.truename;
    data.sex = this.data.sex;
    data.birthday = this.data.date;
    data.province = this.data.province;
    data.city = this.data.city;
    data.conty = this.data.area;
    data.weight = this.data.upmode.weight;
    data.height = this.data.upmode.height;
    data.phonenum = this.data.upmode.phonenum;
    var name = /^[\u4E00-\u9FA5A-Za-z]+$/;
    data.patientname = data.patientname.replace(/\s+/g, '');
    if (data.patientname == null || data.patientname.trim() == "" || !name.test(data.patientname)) {
      wx.showToast({
        title: "请输入真实姓名",
        icon: 'none'
      })
      return
    }
    if (data.sex == null || data.sex== "") {
      wx.showToast({
        title: "请选择性别",
        icon: 'none'
      })
      return
    }
    if (data.birthday == null || data.birthday.trim() == "") {
      wx.showToast({
        title: "选择年龄",
        icon: 'none'
      })
      return
    }
    if (data.province == null || data.province.trim() == "") {
      wx.showToast({
        title: "请选择省份",
        icon: 'none'
      })
      return
    }
    if (data.height == null || data.height.trim() == "" || data.height == 0) {
      wx.showToast({
        title: "请输入正确的身高",
        icon: 'none'
      })
      return
    }
    if (data.weight == null || data.weight.trim() == "" || data.weight == 0) {
      wx.showToast({
        title: "请输入正确的体重",
        icon: 'none'
      })
      return
    }
    if (this.data.val.show == "1") {
      url = 'Personal/improvePersonalInformation'
      data.telephone = this.data.upmode.phonenum;
      data.phoneCode = this.data.upmode.yancode;
    }
    if (this.data.val.show == '1') {
      if (data.phonenum == null || data.phonenum.trim() == "") {
        wx.showToast({
          title: "请输入手机号",
          icon: 'none'
        })
        return
      }
      if (data.phoneCode == null || data.phoneCode.trim() == "") {
        wx.showToast({
          title: "请输入验证码",
          icon: 'none'
        })
        return
      }
    }
    wxRequet.requests(url, JSON.stringify(data), function(val) {

      var weixin = wx.getStorageSync("weixin");
      wxRequet.requests("Personal/getMyDetial", JSON.stringify({
        parameters: weixin.id
      }), function(res) {
        weixin.sex = res.sex;
        weixin.patientname = res.patientname;
        weixin.birthday = res.birthday;
        weixin.province = res.province;
        weixin.city = res.city;
        weixin.conty = res.conty;
        weixin.weight = res.weight;
        weixin.height = res.height;
        weixin.age = res.age;
        weixin.telephone = res.telephone;
        wx.setStorageSync("weixin", weixin)
        wxRequet.pageturns(this_.data.val.urls, this_.data.val.skip)
        wx.showToast({
          title: "操作成功",
          icon: 'success'
        })
      })

    })
  },
  nexts: function() {
    wx.navigateTo({
      url: './index',
    })
  },
  initVal: function() {
    var this_ = this;
    wxRequet.requests('Personal/getMyDetial', JSON.stringify({
      parameters: wx.getStorageSync("weixin").id
    }), function(val) {
      this_.data.upmode.truename = val.patientname;
      this_.data.date = val.birthday == null ? "" : val.birthday;
      this_.data.province = val.province == null ? "" : val.province;
      this_.data.city = val.city == null ? "" : val.city;
      this_.data.area = val.conty == null ? "" : val.conty;
      this_.data.upmode.height = val.height;
      this_.data.upmode.weight = val.weight;
      this_.data.sex = val.sex;
      if (val.sex == "1") {
        var s = this_.data.sexList[0];
        s.checkeds = true;
        this_.data.sexList[0] = s;
      }
      if (val.sex == "2") {
        this_.data.sexList[1].checkeds == true;
        var s = this_.data.sexList[1];
        s.checkeds = true;
        this_.data.sexList[1] = s;
      }
      this_.setData(this_.data)
    })
  }
})