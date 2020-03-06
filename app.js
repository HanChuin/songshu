const updateManager = wx.getUpdateManager()

App({
  onLaunch: function() {
    wx.hideTabBar();
  
    this.isIphoneX();

    let adImg = wx.getStorageSync('adImgUrl')
    if (adImg != '' && adImg.length > 0) {
      this.globalData.adShow = true;
    }

    updateManager.onCheckForUpdate(function (res) {
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    let self  = this
    // 获取用户信息
    wx.getSetting({
      success(res) {
        console.log('userInfo' , res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('userInfo', res)
              console.log(res.userInfo)
              self.globalData.userName = res.userInfo.nickName
              self.globalData.userLogo = res.userInfo.avatarUrl
            }
          })
        }
      }
    });

  },



  isIphoneX() {
    let info = wx.getSystemInfoSync();
    console.log('device' , info)
    this.globalData.deviceInfo = info;
    if (/iPhone X/i.test(info.model)) {
      this.globalData.isIphoneX = true
    } else {
      this.globalData.isIphoneX = false
    }
  },

  onShow: function(options) {

  },
  editTabbar: function () {
    wx.hideTabBar();
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    userInfo: null,
    userName: '',
    userLogo: '',
    openId: '',
    mapKey: '14d732cd5017766649fc33c1c7075fe6',
    adShow:false,
    isIphoneX:false,
    deviceInfo:undefined, //设备信息
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#ACACAC",
      "selectedColor": "#ff8100",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "iconPath": "/img/tab1.png",
          "selectedIconPath": "/img/tab1Act.png"
        },
        {
          "pagePath": "/pages/project/list/projectList",
          "text": "公益项目",
          "iconPath": "/img/tab2.png",
          "selectedIconPath": "/img/tab2Act.png"
        },
        {
          "pagePath": "/pages/tabPoints/tabpoints",
          "text": " ",
          "iconPath": "/img/tabMidAct2.png",
          "selectedIconPath": "/img/tabMidAct2.png"
        },
        {
          "pagePath": "/pages/shop/shop",
          "text": "公益积分",
          "iconPath": "/img/tab3.png",
          "selectedIconPath": "/img/tab3Act.png"
        },
        {
          "pagePath": "/pages/timeLine/timeLine",
          "text": "会员中心",
          "iconPath": "/img/tab4.png",
          "selectedIconPath": "/img/tab4Act.png"
        }
      ]
    }
  }
})