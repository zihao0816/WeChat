//消息实体
function mymessage(messageId, messageSequencee, message,
  senderId, receiverId, snedTime, messageStatus,
  businessType, businessId, messageType, messageBodyType, conversationId, fileLocalpath, isListen, isRead) {


  //消息id
  this.messageId = messageId,

    //消息序列号
    this.messageSequencee = messageSequencee,

    //消息体
    this.message = message,


    //发送人ID
    this.senderId = senderId,

    //接收人ID
    this.receiverId = receiverId,


    //发送时间
    this.snedTime = snedTime,


    //消息状态
    this.messageStatus = messageStatus,


    //业务类型
    this.businessType = businessType,



    //务业ID
    this.businessId = businessId,


    //消息类型（ordinary:普通,system:系统,business:业务）
    this.messageType = messageType,


    //消息body类型（text，picture，voice）
    this.messageBodyType = messageBodyType,


    //该聊天会话id
    this.conversationId = conversationId,



    //文件本地路径（图片，声音）
    this.fileLocalpath = fileLocalpath,


    //语音是否已听
    this.isListen = isListen,


    //消息是否已读 1已读  2未读
    this.isRead = isRead


}

Date.prototype.format = function(fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function down(x, y) {
  return x.messageSequence.split('-')[0] * 1 - y.messageSequence.split('-')[0] * 1;
}

//写入新消息
function insert(mymessage) {
  var _this = this;
  var insertmymessagelock = wx.getStorageSync("insertmymessagelock");
  if (insertmymessagelock != null && insertmymessagelock != "" && insertmymessagelock == false) {
    setTimeout(function() {
      insert(mymessage)
    }, 50)
    return
  }
  wx.setStorageSync("insertmymessagelock", false);
  try {
    // wx.removeStorageSync('imkey')
    // wx.removeStorageSync('sendQueue')
    var dataobj = wx.getStorageSync('imkey');
    dataobj = dataobj == null ? [] : dataobj;
    if (mymessage == null || mymessage.length == 0) {
      wx.setStorageSync('imkey', dataobj.sort(down))
      wx.setStorageSync("insertmymessagelock", true);
      return -1;
    }



    if (JSON.stringify(dataobj).indexOf(mymessage.messageId) > -1) {
      wx.setStorageSync("insertmymessagelock", true);
      return -1;
    }
    for (var i = 0; i < dataobj.length; i++) {
      if (dataobj[i].messageId == mymessage.messageId) {
        wx.setStorageSync("insertmymessagelock", true);
        return -1;
      }
    }

    if (mymessage.snedTime == null || mymessage.snedTime == "") {
      var time1 = new Date().getTime();
      mymessage.snedTime = time1;
    }
    if (mymessage.read == null || mymessage.read == "") {

      mymessage.read = 2;
    }

    dataobj.push(mymessage)

    if (dataobj.length > 5000) {
      dataobj.unshift();
    }

    wx.setStorageSync('imkey', dataobj.sort(down))
    wx.setStorageSync("insertmymessagelock", true);
    return 0;

  } catch (e) {
    console.log(e)
    wx.setStorageSync("insertmymessagelock", true);
    return -1;
  }

}

function insertmany(mymessages, dosome) {
  var _this = this;
  var insertmymessagelock = wx.getStorageSync("insertmymessagelock");
  if (insertmymessagelock != null && insertmymessagelock != "" && insertmymessagelock == false) {
    setTimeout(function() {
      insertmany(mymessages, dosome)
    }, 50)
    return
  }

  wx.setStorageSync("insertmymessagelock", false);
  var dataobj = wx.getStorageSync('imkey');
  dataobj = dataobj == null ? [] : dataobj;
  try {
    if (mymessages == null || mymessages.length == 0) {
      wx.setStorageSync('imkey', dataobj.sort(down))
      if (dosome != null && typeof(dosome) == 'function') {
        dosome()
      }
      wx.setStorageSync("insertmymessagelock", true);
      return -1;
    }

    for (var i = 0; i < mymessages.length; i++) {
      var mymessage = mymessages[i];
      if (mymessage == null || mymessage.length == 0) {

        continue
      }
      if (mymessage.messageId == null || mymessage.messageId == "") {

        continue
      }
      if (JSON.stringify(dataobj).indexOf(mymessage.messageId) > -1) {
        continue
      }

      if (mymessage.snedTime == null || mymessage.snedTime == "") {
        var time1 = new Date().getTime();
        mymessage.snedTime = time1;
      }
      if (mymessage.read == null || mymessage.read == "") {

        mymessage.read = 2;
      }
      dataobj.push(mymessage)
      dataobj.sort(down)
      if (dataobj.length > 5000) {
        dataobj.pop();
      }
    }
    wx.setStorageSync('imkey', dataobj.sort(down))
    if (dosome != null && typeof(dosome) == 'function') {
      dosome()
    }
    wx.setStorageSync("insertmymessagelock", true);
    return 0;

  } catch (e) {
    wx.setStorageSync("insertmymessagelock", true);
    return -1;
  }


}

//获取缓存消息总数量
function getsize() {
  try {

    var temp = wx.getStorageSync('imkey');
    var dataobj = new Array();

    dataobj = temp;

    return dataobj.length;

  } catch (e) {
    return 0;
  }
}

//根据消息ID查询一条消息
function selectOne(id) {
  try {

    if (id == null || id == "") return "";

    var temp = wx.getStorageSync('imkey');
    var dataobj = new Array();
    dataobj = temp;

    if (dataobj.length == 0) {
      return "";
    }


    for (var i = 0; i < dataobj.length; i++) {
      if (dataobj[i].messageId == id) {
        return dataobj[i];
        break;
      }
    }

    return "";

  } catch (e) {
    console.log(e)
    return "";
  }
}

//更新消息状态
function updatemessage(id, snedTime, messageStatus) {
  try {

    if (id == null || id == "") return -1;

    var temp = wx.getStorageSync('imkey');
    var dataobj = new Array();
    dataobj = temp;
    if (dataobj.length == 0) {
      return -1;
    }


    for (var i = 0; i < dataobj.length; i++) {
      if (dataobj[i].messageId == id) {
        dataobj[i].snedTime = snedTime;
        dataobj[i].messageStatus = messageStatus;
        break;
      }
    }

    wx.setStorageSync('imkey', dataobj);
    return 0;

  } catch (e) {
    console.log(e)
    return -1;
  }
}

//以conversationId为条件 分页查询
function selectmassage(id, page, pagesize) {
  try {

    if (id == null || id == "") return "";
    if (page == null || page == "") return "";

    var temp = wx.getStorageSync('imkey');
    var dataobj = new Array();

    dataobj = temp;


    if (dataobj.length == 0) {
      return "";
    }

    var objarray = new Array();

    for (var i = 0; i < dataobj.length; i++) {

      if (dataobj[i].conversationId == id) {
        objarray.push(dataobj[i]);
      }
    }

    objarray = objarray.sort(down);

    var objarray2 = new Array();
    for (var i = page * pagesize; i < page * pagesize + pagesize * 1; i++) {
      if (objarray[i] != "" && objarray[i] != null)
        objarray2.push(objarray[i]);
    }

    return objarray2;

  } catch (e) {
    console.log(e)
    return "";
  }
}

//消息对像
module.exports.mymessage = mymessage;

module.exports.insert = insert;

module.exports.getsize = getsize;

module.exports.selectOne = selectOne;

module.exports.selectmassage = selectmassage;

module.exports.updatemessage = updatemessage;
module.exports.insertmany = insertmany;
module.down = down;