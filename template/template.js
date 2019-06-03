
//初始化数据
function tabbarinit() {
 return [
      { "current":0,
        "pagePath": "/pages/index/index",
        "iconPath": "/imgs/shouye.png",
        "selectedIconPath": "/imgs/shouye_on.png",
        "text": "首页"
      },
      {
        "current": 0,
        "pagePath": "/pages/physicianvisits/physicianvisitsList",
        "iconPath": "/imgs/wenzhen.png",
        "selectedIconPath": "/imgs/wenzhen_on.png",
        "text": "问诊"

      },
      {
        "current": 0,
        "pagePath": "/pages/family/family",
        "iconPath": "/imgs/tongxunlu.png",
        "selectedIconPath": "/imgs/tongxunlu_on.png",
        "text": "取药"
      },
      {
        "current": 0,
        "pagePath": "/pages/my/index",
        "iconPath": "/imgs/wode.png",
        "selectedIconPath": "/imgs/wode_on.png",
        "text": "我的"
      }
    ]
}
/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象]
 */
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}