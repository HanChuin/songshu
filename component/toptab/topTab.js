// component/toptab/topTab.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // tabArr: {
    //   type: Array,
    //   value: []
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabArr: [
      { id: 1, title: '亲子', url: '/page/index/index' },
      { id: 2, title: '捐助', url: '/page/index/index' },
      { id: 3, title: '读书', url: '/page/index/index' },
      { id: 4, title: '体育', url: '/page/index/index' },
      { id: 5, title: '科技', url: '/page/index/index' },
      { id: 6, title: '其他', url: '/page/index/index' }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
