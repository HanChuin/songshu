const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
let qiniuUrl = 'https://url.songshuqubang.com/micsoft'

let token = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, //微信用户信息
    sysUserInfo: {}, //系统用户信息
    loginState: false, //登录状态
    userState: '', //用户状态
    routers: [{
      icon: qiniuUrl+'/img/mybought.png',
        color: 'white',
        name: '我的订单'
      }, {
        icon: qiniuUrl +'/img/joinavtivities.png',
        color: 'white',
        name: '参与项目'
      }, {
        icon: qiniuUrl +'/img/select.png',
        color: 'white',
        name: '积分查询'
      },
      {
        icon: qiniuUrl +'/img/info.png',
        color: 'white',
        name: '资料中心'
      }, {
        icon: qiniuUrl +'/img/pwd.png',
        color: 'white',
        name: '修改密码'
      }, {
        icon: qiniuUrl +'/img/faq.png',
        color: 'white',
        name: '常见问题'
      }, {
        icon: qiniuUrl +'/img/aboutus.png',
        color: 'white',
        name: '关于我们'
      }, {
        icon: qiniuUrl +'/img/ser.png',
        color: 'white',
        name: '客服服务'
      }, {
        icon: qiniuUrl +'/img/quit.png',
        color: 'white',
        name: '退出登录'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar();
  },

  onShow: function() {
    // app.editTabbar();
    token = wx.getStorageSync('token')
    if (token.length > 0) {
      let self = this
      //获取用户数据
      this.getSysUserInfo()
      this.setData({
        loginState: true
      })
      app.editTabbar();
    }

    // 检测是否登录，未登录跳转登录页面
    // if (!this.data.loginState) {
    //   this.toLogin()
    // }
  },

  // 跳转到编辑个人信息
  naviToProfile: function() {},

  // 跳转到积分兑换
  navigateToPoints: function() {
    wx.navigateTo({ //积分兑换历史
      url: '/pages/points/convert'
    })
  },

  navigateToOrder: function() {
    if (token.length > 0) {
      wx.navigateTo({ //订单列表
        url: '/pages/orderList/orderList',
      })
    } else {
      this.toLogin();
    }
  },

  navigateToPointsRecord: function() {
    if (token.length > 0) {
      wx.navigateTo({ //积分查询
        url: '/pages/pointrecord/pointrecord',
      });
    } else {
      this.toLogin()
    }
  },

  toLogin: function() { //登录
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  toRegist: function() { //注册
    wx.navigateTo({
      url: '/pages/login/login?title=regist',
    })
  },

  toPointRecord: function() { //积分查询
    wx.navigateTo({
      url: '/pages/pointrecord/pointrecord',
    })
  },
  tomyBM: function() { //参与项目
    if (token == '' || token == undefined || token == null) {
      wx.navigateTo({ //判断用户状态
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/personal/apply/apply',
      })
    }
  },
  toPoint: function() { //积分兑换
    if (token == '' || token == undefined || token == null) {
      wx.navigateTo({ //判断用户状态
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/shop',
      })
    }
  },
  toChangeMI: function() { //修改密码
    wx.navigateTo({
      url: '/pages/personal/modifyMi/modifyMi',
    })
  },
  // 获取用户信息&&调用wx.login
  getUserInfoCallback: function(e) {
    var self = this;
    wx.setStorageSync('userInfo', e.detail.userInfo)
    http.wxLogin().then(res => {
      self.setData({
        loginState: true
      })
      self.getSysUserInfo()
    })
  },
  // 获取页面数据
  getSysUserInfo: function() {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        let userIntegral = res.data.integral
        http.get(api.getUserlevelListAPI, {}).then(res => {
          let list = res.data
          list.map(item=>{
            if (userIntegral <= item.end && userIntegral >= item.start){
              this.setData({
                userLevel:item.name
              })
            }
          })
        }).catch(msg => {
          console.log(msg)
        })
        app.globalData.openid = res.data.openid;
        app.globalData.userInfo = res.data;
        self.setData({
          sysUserInfo: app.globalData.userInfo
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },
  //退出登录
  loginOut: function() {
    wx.showModal({
      title: '确认退出吗?',
      content: '',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'token',
            success: function(res) {
              app.editTabbar();
              wx.showToast({
                title: '退出成功',
                duration: 2000
              })
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/personal/worker/worker',
                })
              }, 1000)
            },
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },


  onclick: function(event) {
    console.log(event)
    let index = event.currentTarget.dataset.index;
    switch (index) {
      case 0:
        this.navigateToOrder();
        break;

      case 1:
        this.tomyBM();
        break;

      case 2:
        this.navigateToPointsRecord();
        break;

      case 3:
        this.toEditStudent();
        break;

      case 4:
        this.toChangeMI();
        break;

      case 5:
        wx.navigateTo({
          url: '/pages/faq/faq',
        });
        break;

      case 6:
        this.toAbout();
        break;

      case 8:
        this.loginOut();
        break;
    }
  },

  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },


  //资料中心
  toEditStudent: function() {
    token = wx.getStorageSync('token')
    if (token == '' || token == undefined || token == null) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/studentinfo/manager/manager',
      })
    }
  },

  toAbout: function() { //关于我们
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('http://mp.weixin.qq.com/s?__biz=Mzg3MTE0MDY1NA==&mid=100000351&idx=1&sn=395f901b2779273ca82aaf2e41846f01&chksm=4e825e1e79f5d708d013179eda016ab3437fe3dd73b03f7c60d283a2360ddc9972cd1c1bafca#rd')
    });
  },


  toVipInfo: function() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    })
  },

  fixHeader(){
    wx.navigateTo({
      url: '/pages/changeHead/changeHead',
    })
  },

  loginAction(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
});