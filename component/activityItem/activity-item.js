
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: Number,
    coverUrl: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    subTitle: {
      type: String,
      value: ''
    },
    btnStr: {
      type: String,
      value: ''
    },
    btnEnable: Number,
  },

  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      this.triggerEvent('clientEvent', {})
    }
  }
})
