//app.js
var wxRequest = require('./utils/wxRequest.js');
var wxApi = require('./utils/wxApi.js');
var datasave = require('./common/datasave.js');
var util = require('./utils/util.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.removeStorageSync("weixin");
    var _this = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showToast({
              title: '新版本已经准备好，即将重启应用',
              icon: 'none',
              duration: 3000
            })
            setTimeout(function() {
              updateManager.applyUpdate()
            }, 3000)
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        } else {
          var wxLogin = wxApi.wxLogin()
          wxLogin().then(res => {
            _this.login({
              code: res.code
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  login: function(logindata) {
    var _this = this
    wxRequest.requests("Personal/Login", JSON.stringify(logindata), function(res) {
      wx.setStorageSync("weixin", res) //存储openID、session_key
      //4.获取系统信息
      wx.setStorageSync("system", wx.getSystemInfo())
      wxRequest.requests("Configuration/getConfiguration", null, function(res) {
        res.getcssLocal = "https://service.51bjhzy.com/api/StaticFile/weChatImage/";
        res.getLocal = "https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/";
        wx.setStorageSync("common", res);
        if (_this.globalData.zhixin != null && _this.globalData.zhixin.type != 1) {
          if (_this.globalData.zhixin.dosome !== null && typeof (_this.globalData.zhixin.dosome) =='function'){
            _this.globalData.zhixin.dosome()
          }else{
            _this.globalData.zhixin.val.onShow()
          }
          
        }
        //清空发送队列
        wx.removeStorageSync("sendQue")
        wx.removeStorageSync("todoctorindex")
        var oldimkey = wx.getStorageSync("imkey");
        var imkey = [];
        //清空缓存李还未发送出去的数据
        for (var i = 0; i < oldimkey.length; i++) {
          if ((oldimkey[i].messageStatus != 1 && oldimkey[i].messageSequence != null) || oldimkey[i].receiverId == res.id) {
            imkey.push(oldimkey[i])
          }
        }
        wx.setStorageSync("imkey", imkey)
        //初始化websocket方法
        _this.globalData.dowebsocket = _this.initwebsoct()
        //链接websocket
        _this.initgetwebsocket();
        //启动心跳发送
        _this.sendsocketping();
        //启动心跳监听
        _this.jiantingsocket();
        _this.queryMakeMedicine(1);
      });
    }, function(e) {
      if (e.action == '1' || e.action == '2') {
        var wxLogin = wxApi.wxLogin()
        wxLogin().then(res => {
          wx.getUserInfo({
            success: function(vals) {
              _this.globalData.getuser = true;
              _this.login({
                iv: vals.iv,
                encryptedData: vals.encryptedData,
                signature: vals.signature,
                code: res.code
              })
            },
            fail: function(res) {
              _this.globalData.getuser = false;
              _this.globalData.indexzhixin.onShow()
              wx.showToast({
                title: _this.globalData.showmessage,
                icon: 'none',
                duration: 5000
              })
            }
          })
        })
      } else {
        var message = e.message;
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 5000
        })
      }
      if (e.action == '2') {
        _this.globalData.showmessage = e.message
      }
    })
  },
  //请求某个医生的序列号
  sendseven(doctorid) {
    var weixin = wx.getStorageSync("weixin")
    this.globalData.websocket.send({
      data: JSON.stringify(util.data(false, doctorid, weixin.id)),
    })
  },
  //链接websocket
  initgetwebsocket() {
    console.log("----------------------获取websocket")
    var unionid = wx.getStorageSync("weixin")
    console.log(unionid)
    var _this = this;
    var websocket = wx.connectSocket({
      url: 'wss://www.51bjhzy.com?userid=' + unionid.id + '&sessionid=' + unionid.sessionId,
    })
    _this.globalData.websocket = websocket;
    //启动websocket事件监听
    _this.socket()
  },
  //websocket重连
  Websocketlink: function() {
    var unionid = wx.getStorageSync("weixin")
    var _this = this;
    //Websocketlink  最快4秒进行一次Websocket重连
    if (_this.globalData.Websocketlink == false) {
      return
    }
    //方法加锁
    _this.globalData.Websocketlink = false;
    //4秒后解锁
    setTimeout(function() {
      _this.globalData.Websocketlink = true;
    }, 4000)
    if (_this.globalData.websocket != null) {
      try {
        //关闭以前的websocket  启动新的websocket链接
        _this.globalData.websocket.close({
          success: function() {
            _this.initgetwebsocket()
          },
          fail: function() {
            _this.initgetwebsocket()
          }
        })
      } catch (e) {}
    }
  },
  //发送websocket心跳  每5秒向服务器发一次10  服务器会立刻想我们发一次10
  sendsocketping() {
    var _this = this;
    var unionid = wx.getStorageSync("weixin")
    _this.globalData.websocket.send({
      data: JSON.stringify({
        "senderId": unionid.id,
        "messageStatus": "10",
      }),
    })
    setInterval(function() {
      _this.globalData.websocket.send({
        data: JSON.stringify({
          "senderId": unionid.id,
          "messageStatus": "10",
        }),
      })
    }, 5000)
  },
  //监听接收的websocket心跳  检测接收到10的事件  如果超过8秒都没接收到一次10  就进行重连
  jiantingsocket() {
    var _this = this;
    setInterval(function() {
      if (_this.globalData.sockettime == null || new Date().getTime() - _this.globalData.sockettime > 8000) {
        _this.globalData.socketstate = 2;
        _this.Websocketlink();
      }
    }, 5000)
  },
  //拔取离线消息
  getOffLineData: function(index, arrary) {
    var _this = this
    var datas = wx.getStorageSync("weixin");
    var newindex = index
    wxRequest.requests('im/getOffLine/onlyDoctor/' + datas.id + '/' + index + '/20', null, function(res) {
      var dofunction = function() {
        if (_this.globalData.indexzhixin != null) {
          _this.globalData.indexzhixin.onShow()
        }
      }
      if (res.content != null && res.content.length > 0) {
        for (var i = 0; i < res.content.length; i++) {
          arrary.push(res.content[i]);
        }
      }
      if (res.last != null && !res.last) {
        newindex++
        _this.getOffLineData(newindex, arrary)
      } else {
        var delid = [];
        for (var i = 0; i < arrary.length; i++) {
          delid.push({
            "_id": arrary[i]._id
          })
          if (_this.globalData.dowebsocket.onMessage[arrary[i].messageStatus] != null && typeof(_this.globalData.dowebsocket.onMessage[arrary[i].messageStatus]) == 'function') {
            _this.globalData.dowebsocket.onMessage[arrary[i].messageStatus](arrary[i], i == arrary.length - 1 ? dofunction() : null)
          }
        }
        if (arrary.length == 0) {
          dofunction()
        }
        wxRequest.requests('im/delOffLineByArray', JSON.stringify(delid), function(res) {})
      }
    })
  },
  //websocket接收到2_success事件  防止数据脏读  将这个方法提出来 加锁执行
  //newdata:socket接收到的值，dosome业务特殊要求执行的方法
  success2: function(newdata, dosome) {
    var _this = this;
    //如果发现方法被锁住  10毫秒后再执行此方法
    if (_this.globalData["2_successlock"] == false) {
      setTimeout(function() {
        _this.success2(newdata, dosome)
      }, 10)
      return
    }
    //加锁
    _this.globalData["2_successlock"] = false
    var weixin = wx.getStorageSync("weixin"),
      common = wx.getStorageSync('common');
    var oldMessage = wx.getStorageSync('imkey');
    //获取到2_success后  将缓存的数据替换成接收到的数据
    for (var i = 0; i < oldMessage.length; i++) {
      if (oldMessage[i].messageId == newdata.messageId) {
        oldMessage[i].messageSequence = newdata.messageSequence;
        oldMessage[i].messageStatus = newdata.messageStatus;
        wx.setStorageSync('imkey', oldMessage.sort(datasave.down))
        if (dosome != null && typeof(dosome) == 'function') {
          dosome(newdata)
        }
        //解锁
        _this.globalData["2_successlock"] = true
        break;
      }
    }
  },
  //声明websocket代码
  initwebsoct: function() {
    var _this = this;
    var dowebsocket = {
      onOpen: function() {
        //拉离线消息
        _this.getOffLineData(0, []);
        //链接websocket成功后  查看发送队列里有没有值  有的话去请求序列号
        _this.globalData.socketstate = 1
        var uniond = wx.getStorageSync("weixin")
        var sendQue = wx.getStorageSync("sendQue");
        if (sendQue != null && sendQue.length > 0) {
          _this.sendseven(sendQue[0].receiverId);
        }
      },
      onMessage: {
        "2_success": function(newdata, dosome) {
          //停止发送1的定时任务
          if (_this.globalData.redistribute[newdata.messageId] != null) {
            clearInterval(_this.globalData.redistribute[newdata.messageId])
            _this.globalData.redistribute[newdata.messageId] = null;
          }
          //执行2_success
          _this.success2(newdata, dosome)
        },
        3: function(newdata, dosome) {
          //接收到3后 存入缓存  发送4
          if (newdata.businessType == 'doctor_prescription'){
            wx.showTabBarRedDot({
              index: 2,
            })
          }
          var uniond = wx.getStorageSync('weixin');
          datasave.insert(newdata);
          var msg = {
            "senderId": newdata.receiverId,
            "receiverId": newdata.senderId,
            "messageId": newdata.messageId,
            "messageStatus": '4',
            "messageType": 'system'
          }
          _this.globalData.websocket.send({
            data: JSON.stringify(msg),
          });
          //启动反复发送的定时任务 直到收到5
          if (_this.globalData.redistribute[msg.messageId] != null) {
            clearInterval(_this.globalData.redistribute[msg.messageId])
          }
          _this.globalData.redistribute[msg.messageId] = setInterval(function() {
              _this.globalData.websocket.send({
                data: JSON.stringify(msg),
              })
            },
            5000)
          _this.globalData.indexzhixin.onShow();
          if (dosome != null && typeof(dosome) == 'function') {
            dosome(newdata)
          }
        },
        5: function(newdata, dosome) {
          //停止发送4的定时任务
          if (_this.globalData.redistribute[newdata.messageId] != null) {
            clearInterval(_this.globalData.redistribute[newdata.messageId])
            _this.globalData.redistribute[newdata.messageId] = null;
          }
        },
        7: function(newdata, dosome) {
          //接收到7  获取序列后左边
          var uniond = wx.getStorageSync("weixin");
          var index = newdata.messageSequence;
          if (index != null && index != '') {
            var doctorid = newdata.senderId == uniond.id ? newdata.receiverId : newdata.senderId;
            //请求此医生的序列后右边序列号
            _this.getIndex(doctorid, function(id) {
              //获取发送队列
              var sendQue = wx.getStorageSync("sendQue");
              if (sendQue == null || sendQue.length == 0) {
                return
              };
              var oldsendQue = sendQue;
              var sendQueone = null;
              sendQue = [];
              //取出发送队列中这个序列号的医生最先发送的一条数据
              for (var i = 0; i < oldsendQue.length; i++) {
                if (sendQueone == null && oldsendQue[i].receiverId == doctorid) {
                  sendQueone = oldsendQue[i];
                } else {
                  sendQue.push(oldsendQue[i])
                }
              }
              if (sendQueone == null || sendQueone.length == 0) {
                return
              }
              wx.setStorageSync("sendQue", sendQue);
              //取出发送队列里的消息后  发现消息队列里还有数据  继续发送获取序列号
              if (sendQue.length > 0) {
                _this.sendseven(sendQue[0].receiverId);
              }
              //拼接序列号
              var sequence = index + '-' + id;
              sendQueone.messageSequence = sequence;
              //发生数据
              _this.globalData.websocket.send({
                data: JSON.stringify(sendQueone),
              })
              //启动定时任务  没过5秒发送一次这个消息 知道收到2_success
              if (_this.globalData.redistribute[sendQueone.messageId] != null) {
                clearInterval(_this.globalData.redistribute[sendQueone.messageId])
              }
              _this.globalData.redistribute[sendQueone.messageId] = setInterval(function() {
                  _this.globalData.websocket.send({
                    data: JSON.stringify(sendQueone),
                  })
                },
                5000)
              //将右边的序列号存入缓存
              var todoctorindex = wx.getStorageSync("todoctorindex");
              todoctorindex = todoctorindex == null || todoctorindex.length == 0 ? {} : todoctorindex
              todoctorindex[doctorid] = id;
              wx.setStorageSync("todoctorindex", todoctorindex)
              //执行特殊业务操作
              if (dosome != null && typeof(dosome) == 'function') {
                dosome(newdata)
              }
            })
          }
        },
        '7a': function(newdata, dosome) {
          //接到7a后 在缓存中找到此消息 然后再发一遍
          var imkey = wx.getStorageSync("imkey");
          for (var i = 0; i < imkey.length; i++) {
            if (newdata.receiverId == imkey[i].receiverId && newdata.senderId == imkey[i].senderId && imkey[i].messageSequence.indexOf(newdata.messageSequence) > -1) {
              _this.globalData.websocket.send({
                data: JSON.stringify(imkey[i]),
              })
              if (_this.globalData.redistribute[imkey[i].messageId] != null) {
                clearInterval(_this.globalData.redistribute[imkey[i].messageId])
              }
              _this.globalData.redistribute[imkey[i].messageId] = setInterval(function() {
                  _this.globalData.websocket.send({
                    data: JSON.stringify(imkey[i]),
                  })
                },
                5000)
              if (dosome != null && typeof(dosome) == 'function') {
                dosome(newdata)
              }
              break
            }
          }
        },
        8: function(newdata, dosome) {
          datasave.insert(newdata)
          _this.globalData.indexzhixin.onShow();
          if (dosome != null && typeof(dosome) == 'function') {
            dosome(newdata)
          }
        }
      },
      onClose: function() {
        _this.globalData.socketstate = 2
      }
    }
    return dowebsocket;
  },
  //启动websocket监听
  socket: function() {
    var _this = this;
    var uniond = wx.getStorageSync("weixin")
    var websocket = _this.globalData.websocket;
    websocket.onOpen(function() {
      console.log("----------------------获取websocket成功")
      //初始化监听心跳时间
      _this.globalData.sockettime = new Date().getTime();
      _this.globalData.dowebsocket.onOpen()
    })
    websocket.onMessage(function(res) {
      _this.globalData.sockettime = new Date().getTime();
      _this.globalData.socketstate = 1
      var dosome = _this.globalData.websocketdosome;
      var newdata = JSON.parse(res.data);
      if (newdata.messageStatus != 10) {
        console.log(newdata)
      }
      //走之前声明的监听方法
      if (_this.globalData.dowebsocket.onMessage[newdata.messageStatus] != null && typeof(_this.globalData.dowebsocket.onMessage[newdata.messageStatus]) == 'function') {
        _this.globalData.dowebsocket.onMessage[newdata.messageStatus](newdata, dosome != null && dosome.onMessage[newdata.messageStatus] != null && typeof(dosome.onMessage[newdata.messageStatus]) == 'function' ? dosome.onMessage[newdata.messageStatus] : null)
      }
    })
    websocket.onClose(function(res) {
      console.log("----------------------监听到websocket关闭")
      console.log(res)
      _this.globalData.dowebsocket.onClose()
    })
    websocket.onError(function(res) {
      console.log("----------------------链接websocket失败")
      console.log(res)
    })
  },

  //获取与此医生右边的值
  //医生id  dosome获取序列号后要做的事情
  getIndex: function(doctorid, dosome) {
    var _this = this;
    //获取锁 获取失败后10秒后再执行此方法
    if (_this.globalData.getIndexlock == false) {
      setTimeout(function() {
        _this.getIndex(doctorid, dosome)
      }, 10)
      return
    }
    //加锁
    _this.globalData.getIndexlock = false
    //如果缓存里有与此医生的序列号  直接使用缓存中的序列后 然后+1
    var todoctorindex = wx.getStorageSync("todoctorindex");
    todoctorindex = todoctorindex == null || todoctorindex.length == 0 ? {} : todoctorindex;
    if (todoctorindex[doctorid] != null) {
      //拿到序列号后执行方法
      dosome(todoctorindex[doctorid] + 1)
      //执行完方法后  释放锁
      _this.globalData.getIndexlock = true
      return
    }
    //如果缓存中没有与此医生的序列号,向后台请求序列后 然后+1执行，如果后台也没有  序列后就是1   
    var uniond = wx.getStorageSync("weixin"),
      common = wx.getStorageSync("common");
    wxRequest.requests('im/getMessages/' + uniond.id + '/' + doctorid + '/0/1', null,
      function(res) {
        if (res.content != null && res.content.length > 0) {
          for (var i = 0; i < res.content.length; i++) {
            if (res.content[i].senderId == uniond.id && res.content[i].receiverId == doctorid) {
              //拿到序列号后执行方法
              dosome(res.content[i].messageSequence.split('-')[1] * 1 + 1)
              //执行完方法后  释放锁
              _this.globalData.getIndexlock = true
              return
            }
          }
        }
        //拿到序列号后执行方法
        dosome(1)
        //执行完方法后  释放锁
        _this.globalData.getIndexlock = true
      },
      function(res) {
        _this.globalData.getIndexlock = true
      }
    )
  },
  queryMakeMedicine: function(index){
    var _this = this
    var uniond = wx.getStorageSync('weixin');
    wxRequest.requests('PlacingOrder/takeMedicineList', JSON.stringify({
      parameters: uniond.id,
      pageLength: 4,
      pagination: index
    }), function (res) {
      if (res.pageVal.length>0){
        wx.showTabBarRedDot({
          index: 2,
        })
      }else{
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
    });
  },
  globalData: {
    showmessage: "您可点击\"登录\"获取所有功能",
    userInfo: null,
    zhixin: null,
    indexzhixin: null,
    socketstate: 2,
    websocket: null,
    dowebsocket: null,
    todoctorindex: {},
    "2_successlock": true,
    sockettime: null,
    getIndexlock: true,
    Websocketlinklock: false,
    redistribute: {},
    getuser: true,
    result: []
  }
})