// pages/im/index.js
var wxRequest = require('../../utils/wxRequest.js');
var datasave = require('../../common/datasave.js');
var util = require('../../utils/util.js');
const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['医生详情', '线上问诊', '我的病历'],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    state: false,
    top: 0,
    fyjz: true,
    queryTalkindex: 0,
    fylock: true,
    playvoicelock: true,
    voicestarty: null,
    cancelsendingvocie: false,
    ownsrcdefault: 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/right-3@3x.png',
    othersrcdefault: 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/left-3@3x.png',
    ownsrc: {},
    ques: true,
    autotext: '本次服务已结束\n若有其它问题请联系客服:4006660101'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    var toImMode = wx.getStorageSync("toImMode");
    console.log(toImMode)
    if (toImMode.isOrder == '1') {
      this.setData({
        disshow: false
      })
    }
    if (toImMode.isOrder == '2') {
      this.setData({
        disshow: true,
        typeList: [{
          text: '在线复诊',
          introduce: '自由图文交流，开方调药',
          buttom: '点此复诊',
          status: '1'
        }],
      })
    }
    wx.removeStorageSync("toImMode");
    this.setData({
      toImMode: toImMode
    });

    //获取元素宽度
    var query = wx.createSelectorQuery();
    query.select('.weui-navbar__slider').boundingClientRect(function(rect) {
      _this.setData({
        width: rect.width
      })
      wx.getSystemInfo({
        success: function(res) {
          var left = (res.windowWidth / 3 - 45) / 2;
          var widhtsmall = (_this.data.width - 45) / 2
          var widths = left - widhtsmall;
          _this.setData({
            sliderLeft: widths,
          });
        }
      });
    }).exec();

    var query1 = wx.createSelectorQuery();
    query1.select('#view1').boundingClientRect(function(rect) {
      _this.setData({
        sliderOffset: rect.left
      })
      _this.queryTalk(_this, _this.data.queryTalkindex)
    }).exec();
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
    wx.getSystemInfo({
      success: function(res) {
        if (res.model.indexOf('iPhone X') > -1) {
          _this.setData({
            isiphone: true
          })
        } else {
          _this.setData({
            isiphone: false
          })
        }
      }
    })
    var query2 = wx.createSelectorQuery();
    query2.select('.weui-navbars').boundingClientRect(function(rect) {
      var query3 = wx.createSelectorQuery();
      query3.select('#im-bottom').boundingClientRect(function(rects) {
        var newheight = rects.top - rect.height
        _this.setData({
          height: newheight,
          topheight: rect.height
        })
        console.log(_this.data.height)
      }).exec();
    }).exec();

    wx.setNavigationBarTitle({
      title: '与' + this.data.toImMode.doctorName + '医生沟...',
    })
    var uniond = wx.getStorageSync('weixin')


    app.globalData.websocketdosome = {
      onMessage: {
        "2_success": function(res) {
          _this.queryall();
        },
        3: function(res) {
          _this.queryall();
          _this.weidu(res);
        },
        8: function(res) {
          _this.queryall();
        },
      }
    };
    this.query(this, this.data.toImMode)
    this.queryCase(this)
    this.queryInformation()
  },
  weidu: function(newdata) {
    if (app.globalData["2_successlock"] == false) {
      setTimeout(function() {
        _this2.weidu(newdata, dosome)
      }, 10)
      return
    }
    app.globalData["2_successlock"] = false
    var weixin = wx.getStorageSync("weixin"),
      common = wx.getStorageSync('common');
    var oldMessage = wx.getStorageSync('imkey');
    for (var i = 0; i < oldMessage.length; i++) {
      if (oldMessage[i].messageId == newdata.messageId) {
        oldMessage[i].isRead = 1
        wx.setStorageSync('imkey', oldMessage)
        app.globalData["2_successlock"] = true
        break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var _this = this;
    if (!_this.data.playvoicelock) {
      _this.data.innerAudioContext.stop();
      _this.data.innerAudioContext.destroy();
      _this.setData({
        innerAudioContext: null,
        playvoicelock: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var _this = this;
    app.globalData.websocketdosome = null;
    if (!_this.data.playvoicelock) {
      _this.data.innerAudioContext.stop();
      _this.data.innerAudioContext.destroy();
      _this.setData({
        innerAudioContext: null,
        playvoicelock: true
      })
    }
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
  onReachBottomnext: function() {
    if (this.data.queryall != null && !this.data.queryall) {
      this.data.queryall = true;
      this.queryall(null, false)
    }

  },
  write: function() {
    wx.navigateTo({
      url: '../upload/one?orderid=' + this.data.toImMode.orderid + '&doctorid=' + this.data.toImMode.doctorId,
    })
  },

  tabClick: function(e) {
    if (e.currentTarget.dataset.id == '1') {
      this.setData({
        isshow: false,
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.dataset.id
      });
    } else {
      this.setData({
        isshow: true,
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.dataset.id
      });
    }

  },

  toggle: function() {
    var _this = this
    var list_state = this.data.state
    wx.getSystemInfo({
      success: function(res) {
        if (list_state) {
          if (res.model.indexOf('iPhone X') > -1) {
            _this.setData({
              state: false,
              isiphone: true
            });
          } else {
            _this.setData({
              state: false,
              isiphone: false
            });
          }
        } else {
          _this.setData({
            state: true,
            isiphone: false
          });
        }
        setTimeout(function() {
          var query2 = wx.createSelectorQuery();
          query2.select('.weui-navbars').boundingClientRect(function(rect) {
            var query2 = wx.createSelectorQuery();
            query2.select('#im-bottom').boundingClientRect(function(rects) {
              var newheight = rects.top - rect.height
              _this.setData({
                height: newheight
              })
            }).exec();
          }).exec();
        }, 300)
      },
    })
  },

  sendMsg: function(e) {
    var msg = e.detail.value
  },

  //医生详情
  query: function(_this, option) {
    wxRequest.requests('AppHomePage/Index', JSON.stringify({
      parameters: option.doctorId
    }), function(res) {
      var img = wx.getStorageSync("common")
      console.log(img)
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
          info: {
            ishidden: true
          },
          infos: res
        }
      })

    })
  },
  queryCase: function(_this) {
    var uniond = wx.getStorageSync("weixin");
    var img = wx.getStorageSync("common");
    wxRequest.requests('PlacingOrder/casesPatients', JSON.stringify({
      parameters: uniond.id
    }), function(res) {
      for (var i = 0; i < res.pageVal.length; i++) {
        res.pageVal[i].doctorheadphoto = img.fastDfsUrl + res.pageVal[i].doctorheadphoto
        switch (res.pageVal[i].serviceid) {
          case '1':
            res.pageVal[i].serviceidtext = util.commonData.serviceid.secondText
            break
          case '2':
            res.pageVal[i].serviceidtext = util.commonData.serviceid.secondTel
            break
          case '3':
            res.pageVal[i].serviceidtext = util.commonData.serviceid.firstText
            break
          case '4':
            res.pageVal[i].serviceidtext = util.commonData.serviceid.firstTel
            break
          default:
            break
        }
      }
      _this.setData({
        medicalrecordInfo: res.pageVal
      })
    })
  },

  //历史聊天记录
  queryTalk: function(_this, index) {
    _this.setData({
      fyjz: false
    })
    var uniond = wx.getStorageSync("weixin"),
      common = wx.getStorageSync("common");
    wx.request({
      url: 'https://service.51bjhzy.com/api/im/getMessagesTwoWay/' + _this.data.toImMode.doctorId + '/' + uniond.id + '/0/1000',
      method: 'get',
      header: {
        "sessionID": uniond == null || uniond.sessionId == null ? "" : uniond.sessionId
      },
      success: function(res) {
        var toChiefComplain = _this.data.toImMode.isChiefComplaint == 1;
        if (res.data.content != null && res.data.content.length > 0) {
          for (var i = 0; i < res.data.content.length; i++) {
            if (toChiefComplain && res.data.content[i].orderid == _this.data.toImMode.orderid && res.data.content[i].businessType == 'patient_profile') {
              toChiefComplain = false
            }
            res.data.content[i].messageStatus = res.data.content[i].messageStatus == 1 ? '2_success' : res.data.content[i].messageStatus
          }
        }
        //发送四步消息
        if (toChiefComplain) {
          var newSendQueue = []
          var sendQue = wx.getStorageSync("sendQue");
          sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;
          var newSendQueues = util.datas(uniond.id, _this.data.toImMode.doctorId, 'text', '我已上传问诊资料', '1', "99999999-9999999", 'patient_profile', _this.data.toImMode.orderid);
          datasave.insert(newSendQueues)
          sendQue.push(newSendQueues)
          _this.queryall()
          wx.setStorageSync("sendQue", sendQue);
          app.sendseven(_this.data.toImMode.doctorId);
        }
        datasave.insertmany(res.data.content, function() {
          _this.queryall(false)
        })
      }
    })
  },

  queryall: function(yc, yt) {
    var ques = "";
    var uniond = wx.getStorageSync("weixin");
    var common = wx.getStorageSync("common");
    var historys = wx.getStorageSync('imkey');
    var historys2 = wx.getStorageSync('imkey');
    var _this = this;
    var newList = [];
    _this.setData({
      fyjz: false
    })
    var ind = 0;
    for (var i = 0; i < historys.length; i++) {
      if ((historys[i].senderId == _this.data.toImMode.doctorId || historys[i].senderId == uniond.id) && (historys[i].receiverId == uniond.id || historys[i].receiverId == _this.data.toImMode.doctorId)) {
        if (_this.data.toImMode.doctorId == historys[i].senderId) {
          var nowindex = historys[i].messageSequence.split("-")[1] * 1;
          for (var k = ind + 1; k < nowindex; k++) {
            ques += ",-" + k;
          }
          ind = nowindex;
        }
        historys[i].doctorface = _this.data.toImMode.doctorFace
        historys[i].patientface = uniond.headphoto
        var newyear = new Date().getFullYear(),
          newmouth = new Date().getMonth() + 1,
          newday = new Date().getDate(),
          newtime = newyear + '-' + newmouth + '-' + newday + ' 00:00:00',
          newtimes = new Date(newtime).getTime();
        if (historys[i].snedTime > newtimes) {
          historys[i].newdate = util.timestampToTime(historys[i].snedTime, 5)
        } else {
          historys[i].newdate = util.timestampToTime(historys[i].snedTime, 1)
        }
        if (historys[i].message.type == 'voice' || historys[i].message.type == 'picture') {
          if (historys[i].message.body != '') {
            historys[i].message.body = common.fastDfsUrl + historys[i].message.body
          }
        }
        if (historys[i].businessType == 'EndOrder') {
          historys[i].message.body = wxRequest.replaceAll(historys[i].message.body, '\\n', '\n')
        
        } 
        if (historys[i].businessType == 'callPhoneRecords') {
          var a = parseInt(historys[i].message.duration) * 1000
          historys[i].message.duration = util.timestampToTime(a, 7)
        }
        
        console.log(_this.data.disshow)
        historys2[i].read = 1;
        newList.push(historys[i])
      }
    }
    wx.setStorageSync('imkey', historys2);

    var nnlist = [];
    var queryall = true;
    if (newList.length >= 10 && (yt == null || yt)) {
      for (var i = newList.length >= 10 && (yt == null || yt) ? newList.length - 10 : 0; i < newList.length; i++) {
        nnlist.push(newList[i])
      }
      queryall = false;
    } else {
      nnlist = newList;
      queryall = true;
    }

    setTimeout(function() {
      if (queryall) {
        _this.setData({
          newsList: nnlist,
          fyjz: true,
          queryall: queryall,
          top: 1000 * nnlist.length
        })

      } else {
        _this.setData({
          newsList: nnlist,
          fyjz: true,
          queryall: queryall,
          top: 1000 * nnlist.length
        })
      }
    }, yc != null && !yc ? 500 : 1)
    if (ques.length > 0 && _this.data.ques) {
      _this.data.ques = false
      ques = ques.substring(1);
      wxRequest.requests("im/selectOccupied?receiverId=" + uniond.id + "&senderId=" + _this.data.toImMode.doctorId + "&messageSequenceList=" + ques, null, null, null, null, function(res) {
        datasave.insertmany(res)
        _this.queryall(true);
      })
    }
    console.log(nnlist)
    if (newList[newList.length - 1].businessType == 'EndOrder' || newList[newList.length - 1].businessType == 'doctorEndOrder') {
      if(_this.data.toImMode.isOrder == '1'){
        _this.setData({
          disshow: false
        })
      }else{
        _this.setData({
          disshow: true,
          typeList: [{
            text: '在线复诊',
            introduce: '自由图文交流，开方调药',
            buttom: '点此复诊',
            status: '1'
          }]
        })
      }
    } else {
      if (_this.data.toImMode.isOrder == '1') {
        _this.setData({
          disshow: false
        })
      } else {
        _this.setData({
          disshow: true,
          typeList: [{
            text: '在线复诊',
            introduce: '自由图文交流，开方调药',
            buttom: '点此复诊',
            status: '1'
          }]
        })
      }
    }
    // console.log(newList)
  },

  //图片放大
  largeImg: function(e) {
    var url = []
    for (var i = 0; i < this.data.newsList.length; i++) {
      if (this.data.newsList[i].message.type == 'picture') {
        url.push(this.data.newsList[i].message.body)
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl,
      urls: url
    })
  },

  //播放语音
  playvoice: function(e) {
    var _this = this
    if (!_this.data.playvoicelock) {
      clearInterval(_this.data.times);
      if (e.currentTarget.dataset.status == '1') {
        _this.setData({
          ownsrc: {}
        })
      } else if (e.currentTarget.dataset.status == '2') {
        _this.setData({
          ownsrc: {}
        })
      }
      _this.data.innerAudioContext.stop();
      _this.data.innerAudioContext.destroy();
      if (_this.data.innerAudioContext.src == e.currentTarget.dataset.voice) {
        _this.setData({
          innerAudioContext: null,
          playvoicelock: true
        })
        return
      } else {
        _this.setData({
          innerAudioContext: null
        })
      }
    }
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = e.currentTarget.dataset.voice
    _this.setData({
      innerAudioContext: innerAudioContext,
      playvoicelock: false
    })
    innerAudioContext.play();
    var index = 0;
    var indexs = 0;
    _this.data.times = setInterval(function() {
      index++;
      indexs++;
      if (index > 3) {
        index = 1
      }
      var ownsrc = {};
      if (e.currentTarget.dataset.status == '1') {
        ownsrc[e.currentTarget.dataset.index] = 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/left-' + index + '@3x.png'
        _this.setData({
          ownsrc: ownsrc
        })
      } else {
        ownsrc[e.currentTarget.dataset.index] = 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/right-' + index + '@3x.png'
        _this.setData({
          ownsrc: ownsrc
        })
      }

      if (indexs > e.currentTarget.dataset.num - 1) {
        clearInterval(_this.data.times)
        if (e.currentTarget.dataset.status == '1') {
          _this.setData({
            ownsrc: {}
          })
        } else if (e.currentTarget.dataset.status == '2') {
          _this.setData({
            ownsrc: {}
          })
        }
      }
    }, 1000)
    innerAudioContext.onEnded(res => {
      _this.data.innerAudioContext.stop();
      _this.data.innerAudioContext.destroy();
      _this.setData({
        innerAudioContext: null,
        playvoicelock: true
      })
    })

  },

  //测试im接口
  saveMsg: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  send: function(res) {
    var _this = this;
    var value = _this.data.value;
    _this.setData({
      value: ""
    })
    var uniond = wx.getStorageSync("weixin");
    //发送队列
    var newSendQueue = []
    if (value && value.trim() != '') {
      var sendQue = wx.getStorageSync("sendQue");
      sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;
      var newSendQueues =
        util.data(true, uniond.id, _this.data.toImMode.doctorId, "text", value, _this.data.toImMode.orderid, "99999999-9999999", '1');
      datasave.insert(newSendQueues)
      _this.queryall()
      sendQue.push(newSendQueues)
      wx.setStorageSync("sendQue", sendQue);
      app.sendseven(_this.data.toImMode.doctorId);
    } else {
      wx.showToast({
        title: '不能发送空白信息',
        icon: 'none'
      })
    }
  },

  seeImg: function() {
    var _this = this
    wx.chooseImage({
      success: function(res) {
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        _this.uploadFile(res.tempFilePaths, length, i)
      },
    })
  },
  uploadFile: function(filepath, length, i) {
    var _this = this,
      weixin = wx.getStorageSync("weixin"),
      uniond = wx.getStorageSync("weixin"),
      filepaths = '';
    try {
      filepaths = filepath[i].tempFilePath
    } catch (e) {
      filepaths = filepath[i]
    }
    filepaths = filepaths == undefined ? filepath[i] : filepaths
    if (filepaths == null || filepaths == undefined || filepaths == "") {
      return
    }
    wx.uploadFile({
      url: 'https://service.51bjhzy.com/api/FastDfs/upload',
      filePath: filepaths,
      name: 'file',
      header: {
        "sessionID": weixin == null || weixin.sessionId == null ? "" : weixin.sessionId
      },
      success: function(res) {
        var newdata = JSON.parse(res.data)

        var sendQue = wx.getStorageSync("sendQue");
        sendQue = sendQue == null || sendQue.length == 0 ? [] : sendQue;

        if (typeof filepath[i] != 'string') {
          var newSendQueues = util.data(true, uniond.id, _this.data.toImMode.doctorId, "voice", newdata[0].fileUrl, _this.data.toImMode.orderid, "99999999-9999999", '1', filepath[i].duration)
          datasave.insert(newSendQueues)
          sendQue.push(newSendQueues)
        } else {
          var newSendQueues = util.data(true, uniond.id, _this.data.toImMode.doctorId, "picture", newdata[0].fileUrl, _this.data.toImMode.orderid, "99999999-9999999", '1')
          datasave.insert(newSendQueues)
          sendQue.push(newSendQueues)

        }
        _this.queryall()
        wx.setStorageSync("sendQue", sendQue);
        app.sendseven(_this.data.toImMode.doctorId);
      },
      complete: function() {
        i++
        if (i < length) {
          _this.uploadFile(filepath, length, i)
        }
      }
    })
  },
  sendImMsg: function(newdata) {
    var _this = this;
    var weixin = wx.getStorageSync("weixin"),
      common = wx.getStorageSync('common');
    var oldMessage = wx.getStorageSync('imkey');
    for (var i = 0; i < oldMessage.length; i++) {
      if (oldMessage[i].messageId == newdata.messageId) {
        oldMessage[i].messageStatus = newdata.messageStatus;
        wx.setStorageSync('imkey', oldMessage)
        _this.queryall();
        break;
      }
    }
  },

  switchInputType: function() {
    var _this = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            fail() {
              wx.showToast({
                title: "未授权语音功能，通过微信删除小程序，重新进入可再次授权",
                icon: 'none',
                duration: 5000
              })
            },
            success() {
              _this.setData({
                keyboard: !(_this.data.keyboard),
              })
            }
          })
        } else {
          _this.setData({
            keyboard: !(_this.data.keyboard),
          })
        }
      }
    })
  },

  //发送语音
  touchdown: function() {
    this.setData({
      imgUrl: 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/yy1@3x.png',
      show: !this.data.show
    })
    var index = 1,
      _this = this;
    this.data.time = setInterval(function() {
      index++
      if (index > 5) {
        index = 1
      }
      _this.setData({
        imgUrl: 'https://service.51bjhzy.com/api/StaticFile/weChatImage/im/yy' + index + '@3x.png',
      })
    }, 1000)
    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {

    });
    //错误回调
    recorderManager.onError((res) => {

    })
  },
  touchup: function() {
    var uniond = wx.getStorageSync('weixin'),
      _this = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      if (_this.data.cancelsendingvocie == true) {
        _this.setData({
          cancelsendingvocie: false
        })
        return
      }
      _this.setData({
        cancelsendingvocie: false
      })
      if (res.duration >= 1000) {
        var voiceData = [],
          time = 0;
        time = parseInt(res.duration / 1000)
        voiceData.push({
          tempFilePath: res.tempFilePath,
          duration: time
        })
        _this.uploadFile(voiceData, 1, 0)
      }
    })
    _this.setData({
      voicestarty: null,
      show: !_this.data.show
    })
    clearInterval(_this.data.time)
  },
  handletouchmove: function(e) {
    var _this = this;
    if (this.data.voicestarty == null) {
      this.setData({
        voicestarty: e.changedTouches[0].clientY
      })
    }
    var cancelsendingvocie = this.data.voicestarty - e.changedTouches[0].clientY > 80;
    if (cancelsendingvocie != this.data.cancelsendingvocie) {
      this.setData({
        cancelsendingvocie: cancelsendingvocie
      })
    }
  },

  seemedicine: function(e) {
    wx.navigateTo({
      url: '../makemedicine/makemedicinedetails?mid=' + e.currentTarget.dataset.orderid,
    })
  },

  seemedicines: function() {
    wx.navigateTo({
      url: 'seemedicine?doctorId=' + this.data.toImMode.doctorId,
    })
  },
  uploadone: function(e) {
    wx.navigateTo({
      url: '../upload/one?orderid=' + e.currentTarget.dataset.orderid + '&doctorid=' + e.currentTarget.dataset.doctorid,
    })
  },

  uploadones: function(e) {
    var session = wx.getStorageSync('weixin');
    wx.navigateTo({
      url: '../my/preliminarydatadetails?orderID=' + e.currentTarget.dataset.orderid + '&sessionID=' + session.sessionId + '&isDoctor=2',
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

  askdetails: function(e) {
    var session = wx.getStorageSync("weixin")
    wxRequest.requests('ordermaintellinfo/getListByKey', JSON.stringify({
      orderid: e.currentTarget.dataset.oid
    }), function(res) {
      if (res.length > 0) {
        wx.navigateTo({
          url: '../my/preliminarydatadetails?orderID=' + e.currentTarget.dataset.oid + '&sessionID=' + session.sessionId + '&isDoctor=2',
        })
      } else {
        wx.showToast({
          title: '该病历暂无问诊资料',
          icon: 'none'
        })
      }
    })
  },

  medical: function(e) {
    var session = wx.getStorageSync("weixin")
    wxRequest.requests('ordermaintellinfo/getListByKey', JSON.stringify({
      orderid: e.currentTarget.dataset.oid
    }), function(res) {
      if (res.length > 0) {
        wx.navigateTo({
          url: '../my/medicalrecorddetails?sessionId=' + session.sessionId + '&orderId=' + e.currentTarget.dataset.oid,
        })
      } else {
        wx.showToast({
          title: '暂无病历详情信息',
          icon: 'none'
        })
      }
    })
  },

  writeperson: function(e) {
    console.log(e)
    var types = e.currentTarget.dataset.writetype;
    var url = '';
    if (types == 'inputSickInfo' || types == 'patient_profile') {
      url = '../upload/two?orderid=' + this.data.toImMode.orderid + '&doctorid=' + e.currentTarget.dataset.did + '&types=' + e.currentTarget.dataset.types;
    } else if (types == 'inputProfile' || types == 'profileFinish') {
      url = '../upload/three?orderid=' + this.data.toImMode.orderid + '&doctorid=' + e.currentTarget.dataset.did + '&types=' + e.currentTarget.dataset.types;
    } else if (types == 'uploadFacePic' || types == 'facePicFinish') {
      url = '../upload/four?orderid=' + this.data.toImMode.orderid + '&doctorid=' + e.currentTarget.dataset.did + '&types=' + e.currentTarget.dataset.types;
    }
    if (url != '') {
      wx.navigateTo({
        url: url
      })
    }
  },

  queryInformation: function(){
    var _this = this;
    var common = wx.getStorageSync('common');
    wxRequest.requests("Inquiry/orderDetails", JSON.stringify({
      orderID: _this.data.toImMode.orderid,
      isInterrogationsingle: 1,
      getPrescriptionOrder: 2,
      getPatient: 1,
      isaction: 1,
      isAccordingexchanges: 1
    }), null, null, null, function (res) {
      res.accordingTtongueurl = res.accordingTtongueurl == null ? [] : res.accordingTtongueurl;
      res.surfaceAccordingurl = res.surfaceAccordingurl == null ? [] : res.surfaceAccordingurl;
      res.otherdetailsurl = res.otherdetailsurl == null ? [] : res.otherdetailsurl;
      for (var i = 0; i < res.accordingTtongue.length; i++) {
        res.accordingTtongueurl.push(common.fastDfsUrl + res.accordingTtongue[i]);
      }
      for (var i = 0; i < res.surfaceAccording.length; i++) {
        res.surfaceAccordingurl.push(common.fastDfsUrl + res.surfaceAccording[i]);
      }
      for (var i = 0; i < res.otherdetails.length; i++) {
        res.otherdetailsurl.push(common.fastDfsUrl + res.otherdetails[i]);
      }
      wx.setStorageSync('information', res)
    })
  }
})