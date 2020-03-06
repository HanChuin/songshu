// component/diyform/diyform-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formValue: {
      type: JSON
    },
    submitAction: { //提交地址
      type: String
    },
    submitBtn: {
      type: String // 提交按钮文字
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit:function(e){
    console.log(e.detail.value)
      var myEventDetail = {
        value: e.detail.value
      } // detail对象，提供给事件监听函数
      this.triggerEvent('submitSuccess', myEventDetail) //myevent自定义名称事件，父组件中使用

  }
  }
})
