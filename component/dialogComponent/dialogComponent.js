const http = require("../../utils/http.js");
const api = require("../../utils/api.js");
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    dialogHidden: {
      type: Boolean,
      value: true
    },

    // 这里定义了innerText属性，属性值可以在组件使用时指定
    titleText: {
      type: String,
      value: ""
    },
    //确定
    determineBtn: {
      type: String,
      value: "default value"
    },
    //取消
    cancleBtn: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 这里是一些组件内部数据
    onCancleClick: false
  },
  methods: {
  
    // 这里是一个自定义方法,取消
    cancleBtn: function() {
      // Properties pro = new Properties();
      this.setData({
        dialogHidden: true
      });
    },

    // 确定
    determineBtn: function() {
     // detail对象，提供给事件监听函数
      this.triggerEvent("determineevent", {});
    }
  }
});