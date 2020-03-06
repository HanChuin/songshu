const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "text": "首页",
            "iconPath": "https://url.songshuqubang.com/micsoft/img/tabbarIndex_.png",
            "selectedIconPath": "https://url.songshuqubang.com/micsoft/img/icon_tab_home_2.png"
          },
          {
            "pagePath": "/pages/project/list/projectList",
            "text": "公益项目",
            "iconPath": "https://url.songshuqubang.com/micsoft/img/tabbarList_.png",
            "selectedIconPath": "https://url.songshuqubang.com/micsoft/img/icon_tab_project_2.png"
          },
          {
            "pagePath": "/pages/tabPoints/tabpoints",
            "text": "",
            "iconPath": "https://url.songshuqubang.com/micsoft/img/tabCenter.png",
            "selectedIconPath": "https://url.songshuqubang.com/micsoft/img/tabCenter.png"
          },
          {
            "pagePath": "/pages/shop/shop",
            "text": "公益积分",
            "iconPath": "https://url.songshuqubang.com/micsoft/img/tabbarShop_.png",
            "selectedIconPath": "https://url.songshuqubang.com/micsoft/img/icon_tab_wow_2.png"
          },
          {
            "pagePath": "/pages/personal/worker/worker",
            "text": "会员中心",
            "iconPath": "https://url.songshuqubang.com/micsoft/img/tabbarVip_.png",
            "selectedIconPath": "https://url.songshuqubang.com/micsoft/img/icon_tab_user_2.png"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: false
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let info = wx.getSystemInfoSync();
      if (/iPhone X/i.test(info.model)) {
        this.setData({
          isIphoneX: true
        })
      } else {
        this.setData({
          isIphoneX: false
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    navito: function (e) {
    },
     
  },
})
