var Promise = require('../plugin/es6-promise.js')
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

function getRequests(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      "sessionID": "haozhongyi"
    }
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "sessionID": "haozhongyi"
    },
  })
}
/**
  * url  请求路径
 * data 以json字符串的格式传入
 * success result!=-1使用
 * error result ==-1使用
 * getpost 可以为空 get post
 * thenfunction 请求为200时，不执行success，error函数
 */
function requests(url, data, success, error, getpost, thenfunction) {
  var Requestval = wxPromisify(wx.request)
  var method = getpost == null ? data == null ? "get" : "post" : getpost;
  var weixin = wx.getStorageSync("weixin");
  return Requestval({
    url: "https://service.51bjhzy.com/api/" + url,
    method: method,
    data: data,
    header: {
      "sessionID": weixin == null || weixin.sessionId == null ? "" : weixin.sessionId
    },
  }).then(function (res) {
    if (res.statusCode != 200) {
      wx.showToast({
        title: "请求失败，请稍后再试",
        icon: 'none',
        duration: 2000
      })
    } else {
      if (typeof (thenfunction) == 'function') {
        return thenfunction(res.data);
      } else {
        if (res.data.result == -1) {
          if (typeof (error) == 'function') {
            return error(res.data);
          } else {
            if (res.data.action!=-1){
              var message = res.data.message;
              wx.showToast({
                title: message,
                icon: 'none',
                duration: 2000
              })
            }
          }
        } else {
          if (typeof (success) == 'function') {
            return success(res.data);
          } else {
            return res.data;
          }
        }
      }
    }
  })
}
function chooseImage(url,success, error, thenfunction) {
  wx.chooseImage({
    count: 9,
    success: function (res) {
      var tempFilePaths = res.tempFilePaths
      var index = 0
      var length = tempFilePaths.length
      uploadImg(url, success, error,thenfunction,tempFilePaths,index,length)
    }
  })
}
function uploadImg(url, success, error, thenfunction, tempFilePaths, index, length){
  var weixin = wx.getStorageSync("weixin");
  wx.uploadFile({
    url: 'https://service.51bjhzy.com/api/FastDfs/' + url, //仅为示例，非真实的接口地址
    filePath: tempFilePaths[index],
    name: 'file',
    header: {
      "sessionID": weixin == null || weixin.sessionId == null ? "" : weixin.sessionId
    },
    success: function (res) {
      res.data = JSON.parse(res.data)
      if (typeof (thenfunction) == 'function') {
        return thenfunction(res.data);
      } else {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].result == -1) {
            if (typeof (error) == 'function') {
              error(res.data[i]);
            } else {
              var message = res.data[i].message;
              wx.showToast({
                title: message,
                icon: 'none'
              })
            }
          } else {
            if (typeof (success) == 'function') {
              success(res.data[i]);
            } else {
              res.data[i];
            }
          }
        }
      }
    },
    fail: function (res) {
      wx.showToast({
        title: "上传失败，请稍后再试",
        icon: 'none',
        duration: 2000
      })
    },
    complete: function(){
      index++
      if(index<length){
        uploadImg(url, success, error, thenfunction, tempFilePaths, index, length)
      }
    }
  })
}
function uploadLocal(success, error, thenfunction) {
  return chooseImage("uploadLocal", success, error, thenfunction);
}
function upload(success, error, thenfunction) {
  return chooseImage("upload", success, error, thenfunction);
}
function replaceAll(val, old, news) {
  while (val.indexOf(old) > -1) {
    val = val.replace(old, news);
  }
  return val;
}
function pageturns(url, runtype) {
  url =replaceAll(url, "%3F", "?");
  url =replaceAll(url, "%3D", "=");
  url =replaceAll(url, "%26", "&");
  if (runtype == "reLaunch") {
    wx.reLaunch({
      url: url,
    })
  }
  if (runtype == "navigateTo") {
    wx.navigateTo({
      url: url,
    })
  }
  if (runtype == "redirectTo") {
    wx.redirectTo({
      url: url,
    })
  }
  if (runtype == "navigateBack") {
    wx.navigateBack({
      delta: url,
    })
  }
}
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) return;
  }
}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest,
  getRequests: getRequests,
  requests: requests,
  uploadLocal: uploadLocal,
  upload: upload,
  pageturns: pageturns,
  sleep: sleep,
  replaceAll: replaceAll
}
