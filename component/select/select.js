// component/select/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items:{
      type: Array
    },
    currentIndex: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    items: [{
      key:'个人参赛',
      value: 1
    },{
      key: '团队参赛',
      value: 2
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectItem:function(e){
      console.log(e.currentTarget.dataset.index)
      this.setData({
        currentIndex: e.currentTarget.dataset.index 
      });
      this.triggerEvent("confirmEvent", e.currentTarget.dataset.index);
    },

    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent" , this.data.currentIndex);
    }
  }
})
