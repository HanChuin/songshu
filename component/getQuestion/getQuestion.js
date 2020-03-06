// component/getQuestion/getQuestion.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    QType:Number,
    ItemAns: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    ready: function () {
      console.log(this.properties.ItemAns)
    },

    // 组件所在页面的生命周期函数
    show: function () { 
      // console.log(this.properties.ItemAns)
    },
    hide: function () { },
    resize: function () { },


  /**
   * 组件的方法列表
   */
  methods: {

  },

})
