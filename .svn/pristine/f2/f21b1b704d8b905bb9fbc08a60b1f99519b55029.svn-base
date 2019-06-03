// common/nyz_area_picker/nyz_area_picker.js
var areaTool = require('../../utils/area.js');
var index = [0, 0, 0]
var provinces = areaTool.getProvinces();
var citys = areaTool.getCitys(provinces[0].key);
var areas = areaTool.getCitys(citys[0].key);

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { //控制area_select显示隐藏
      type: Boolean,
      value: false
    },
    maskShow: { //是否显示蒙层
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: provinces,
    citys: areaTool.getCitys(provinces[0].key),
    areas: areaTool.getCitys(citys[0].key),
    value: [0, 0, 0],
    province: {
      val: '北京市'
    },
    city: {
      val: '北京市'
    },
    area: {
      val: '东城区'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNYZAreaChange: function(e) {
      var that = this;
      var value = e.detail.value;
      /**
       * 滚动的是省
       * 省改变 市、区都不变
       */
      if (index[0] != value[0]) {
        index = [value[0], 0, 0];
        var selectAreas = [];
        var selectCitys = areaTool.getCitys(provinces[index[0]].key);
        if (selectCitys.length == 0) {
          selectCitys.push({
            val: ''
          })
          selectAreas.push({
            val: ''
          })
        } else {
          selectAreas = areaTool.getCitys(selectCitys[0].key);
          if (selectAreas.length == 0) {
            selectAreas.push({
              val: ''
            })
          } else {
            selectAreas = areaTool.getCitys(selectCitys[0].key);
          }
        }
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], 0, 0],
          province: provinces[index[0]],
          city: selectCitys[0],
          area: selectAreas[0]
        })
      } else if (index[1] != value[1]) {
        /**
         * 市改变了 省不变 区变
         */
        index = [value[0], value[1], 0]
        let selectCitys = areaTool.getCitys(provinces[index[0]].key);
        var selectAreas = areaTool.getCitys(selectCitys[index[1]].key);
        if (selectAreas.length == 0) {
          selectAreas.push({
            val: ''
          });
        } else {
          selectAreas = areaTool.getCitys(selectCitys[index[1]].key);
        }
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], 0],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[0]
        })
      } else if (index[2] != value[2]) {
        /**
         * 区改变了
         */
        index = [value[0], value[1], value[2]]
        let selectCitys = areaTool.getCitys(provinces[index[0]].key);
        let selectAreas = areaTool.getCitys(selectCitys[index[1]].key);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], index[2]],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[index[2]]
        })
      }
    },
    /**
     * 确定按钮的点击事件
     */
    handleNYZAreaSelect: function(e) {
      var myEventDetail = e; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent('sureSelectArea', myEventDetail, myEventOption)
    },
    /**
     * 取消按钮的点击事件
     */
    handleNYZAreaCancle: function(e) {
      var that = this;
      that.setData({
        show: false
      })
    }
  }
})