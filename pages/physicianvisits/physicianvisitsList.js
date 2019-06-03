// pages/physicianvisits/physicianvisitsList.js
var wxRequest = require('../../utils/wxRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    contents: "搜索症状、医生、医院、科室",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var _this = this;
    this.setData({
      qyopen: false,
      qyshow: false,
      nzopen: false,
      pxopen: false,
      nzshow: false,
      pxshow: false,
      isfull: false,
      shownavindex: '',
      Stick: false,
      doctoralldata: [],
      page: 1,
      isshow: false,
      hospitaid: "",
      department: "",
      openservice: "",
      hospit: "医院",
      derpartments: "科室",
      inquiry: "不限省市",
      top: null,
      types: [{
        name: '全部',
        id: ''
      }, {
        name: '北京',
        id: '110000'
      }],
    })
    this.selectdoctor(this);
    this.selectalldoctor(this);
    app.globalData.zhixin = {
      type: 2,
      val: this
    };
    var queryc = wx.createSelectorQuery()
    queryc.select('.nav').boundingClientRect()
    queryc.exec(function(result) {
      _this.setData({
        titleHeights: result[0].height + "px"
      })
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 搜索框
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  hospitalList: function(e) {
    var _this = this;
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: false,
        shownavindex: 0,
        isshow: false
      })
    } else {
      wxRequest.requests("hospitainfo/getListByKey", JSON.stringify({}), function(res) {
        res.push({
          hospitaname: "全部",
          id: ""
        });
        _this.setData({
          content: res,
          qyopen: true,
          pxopen: false,
          nzopen: false,
          nzshow: true,
          pxshow: true,
          qyshow: false,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
          isshow: true,
          // hospit: res[0].hospitaname,

        })
      })

    }
  },

  departmentList: function(e) {
    var _this = this;
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        isshow: false
      })
    } else {
      wxRequest.requests("datadictionarydetail/getListByKey", JSON.stringify({
        sortcode: "keshi"
      }), function(res) {
        res.push({
          itemname: "全部",
          itemcode: ""
        });
        _this.setData({
          content: res,
          nzopen: true,
          pxopen: false,
          qyopen: false,
          nzshow: false,
          pxshow: true,
          qyshow: true,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
          isshow: true,
          // derpartments: res[0].itemname,
        })
      })

    }
  },
  typeList: function(e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        isshow: false
      })
    } else {
      this.setData({
        content: this.data.types,
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        isshow: true,
        // inquiry: this.data.types[0].name,
      })
    }
  },
  hidebg: function(e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
      isshow: false
    })
  },
  onPageScroll: function(scroll, that) {
    var _this = this;
    if (this.data.top == null) {
      // var querys = wx.createSelectorQuery()
      // querys.select('.my-doctor').boundingClientRect()
      // querys.exec(function(result) {
      //   var querya = wx.createSelectorQuery()
      //   querya.select('.a-title').boundingClientRect()
      //   querya.exec(function(res){

      //   })
      // })
      var Stick = scroll.scrollTop > 30;
      if (Stick != _this.data.Stick) {
        _this.setData({
          Stick: Stick
        })
      }
    }
  },

  selectdoctor: function(_this) {
    var unionid = wx.getStorageSync("weixin").id;
    wxRequest.requests('Inquiry/MySecondDoctor', JSON.stringify({
      parameters: unionid
    }), function(res) {
      var imgurl = wx.getStorageSync("common");
      var newImgUrl = imgurl.fastDfsUrl;
      var Thefirstfive = res.parameters;
      for (var i = 0; i < Thefirstfive.length; i++) {
        if (Thefirstfive[i].skillname != null && Thefirstfive[i].skillname != '') {
          Thefirstfive[i].skillname = Thefirstfive[i].skillname.replace(/,/, '，');
        }
        Thefirstfive[i].headphoto = newImgUrl + Thefirstfive[i].headphoto;
        Thefirstfive[i].itagainisopen = parseInt(Thefirstfive[i].itagainisopen);
        Thefirstfive[i].thagainisopen = parseInt(Thefirstfive[i].thagainisopen);
      }
      _this.setData({
        doctordata: Thefirstfive
      })
      // if (_this.data.doctordata != null && _this.data.doctordata != '') {
      //   var query = wx.createSelectorQuery()
      //   query.select('.my-doctor').boundingClientRect()
      //   query.exec(function(result) {
      //     _this.setData({
      //       titleHeight: result[0].height
      //     })
      //   })
      // }
    })
  },

  selectalldoctor: function(_this) {
    var uniond = wx.getStorageSync("weixin");
    wxRequest.requests('Inquiry/GetDoctorsTwo', JSON.stringify({
      pageLength: 5,
      pagination: 1,
      addtype: 3,
      patientid: uniond.id,
      openservice: _this.data.openservice,
      department: _this.data.department,
      hospitaid: _this.data.hospitaid
    }), function(res) {
      var imgurl = wx.getStorageSync("common");
      var newImgUrl = imgurl.fastDfsUrl;
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].skillname != null && res.pageVal[i].skillname != '') {
          res.pageVal[i].skillname = res.pageVal[i].skillname.replace(/,/, '，');
        }
        res.pageVal[i].headphoto = newImgUrl + res.pageVal[i].headphoto;
        res.pageVal[i].itaskisopen = parseInt(res.pageVal[i].itaskisopen);
        res.pageVal[i].thaskisopen = parseInt(res.pageVal[i].thaskisopen);
      }
      _this.setData({
        doctoralldata: res.pageVal
      })
      console.log(_this.data.doctoralldata)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    var uniond = wx.getStorageSync("weixin");
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    this.setData({
      page: ++this.data.page
    })
    wxRequest.requests('Inquiry/GetDoctorsTwo', JSON.stringify({
      pageLength: 5,
      pagination: _this.data.page,
      addtype: 3,
      patientid: uniond.id,
      openservice: _this.data.openservice,
      department: _this.data.department,
      hospitaid: _this.data.hospitaid
    }), function(res) {
      var imgurl = wx.getStorageSync("common");
      var newImgUrl = imgurl.fastDfsUrl;
      for (var i = 0; i < res.pageVal.length; i++) {
        if (res.pageVal[i].skillname != null && res.pageVal[i].skillname != '') {
          res.pageVal[i].skillname = res.pageVal[i].skillname.replace(/,/, '，');
        }
        res.pageVal[i].headphoto = newImgUrl + res.pageVal[i].headphoto;
        _this.data.doctoralldata.push(res.pageVal[i])
      }
      _this.setData({
        doctoralldata: _this.data.doctoralldata
      })
      wx.hideLoading();
    })
  },

  alldoctor: function(e) {
    var datas = {
      id: e.currentTarget.dataset.did,
      state: e.currentTarget.dataset.state
    }
    wx.navigateTo({
      url: '../doctor/doctordetails?datas=' + JSON.stringify(datas),
    })
  },
  querybykey: function(res) {
    var value = res.target.dataset.value;
    let valtype = res.target.dataset.valtype;
    var types = res.target.dataset.types;
    this.setData({
      [valtype]: res.target.dataset.val,
      page: 1,
      [types]: res.target.dataset.value

    });
    this.selectalldoctor(this);
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: false,
      isfull: false,
      shownavindex: 0,
      isshow: false
    })
  }
})