const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const app = getApp()
const util = require('../../utils/util.js')
let token = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos: [],
    userInfo: undefined,
    levellogo: '',
    styleType: 1,
    isIphoneX: false
  },

  /* **************************** 页面跳转 ******************************* */

  navigateToOrder: function (e) {
    wx.navigateTo({ //订单列表
      url: '/pages/orderList/orderList',
    })
  },

  navigateToActivity: function (event) {
    console.log('navigateToActivity', event)
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity/detailnew/detailnew?recordId=' + id + '&fromType=user'
    });
  },

  navigateToFamily: function () {
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

  navigateToAbout: function () {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://mp.weixin.qq.com/s/lu_BDuXEBstMC_UGOCW7Pw')
    });
  },

  navigationToFaq: function () {
    wx.navigateTo({
      url: '/pages/faq/faq',
    });
  },

  loginAction() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },


  navigationToEdit: function () {
    wx.navigateTo({
      url: '/pages/changeHead/changeHead',
    })
  },

  navigationToCard: function () {
    wx.showToast({
      title: '功能即将开通，敬请期待！',
      icon: 'none'
    });
  },

  /* **************************** 获取数据 ******************************* */

  // 获取页面数据
  getSysUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        let userIntegral = res.data.integral
        http.get(api.getUserlevelListAPI, {}).then(res => {
          let list = res.data
          list.map(item => {
            if (userIntegral <= item.end && userIntegral >= item.start) {
              this.setData({
                userLevel: item.name
              })
            }
          })
        }).catch(msg => {
          console.log(msg)
        })
        app.globalData.openid = res.data.openid;
        app.globalData.userInfo = res.data;

        let levellogo = ''
        if (res.data.vip == 1) {
          levellogo = 'https://url.songshuqubang.com/image/level/1_meitu_1.png'
        } else if (res.data.vip == 2) {
          levellogo = 'https://url.songshuqubang.com/image/level/2_meitu_2.png'
        } else if (res.data.vip == 3) {
          levellogo = 'https://url.songshuqubang.com/image/level/3_meitu_3.png'
        } else if (res.data.vip == 4) {
          levellogo = 'https://url.songshuqubang.com/image/level/4_meitu_4.png'
        }

        self.setData({
          sysUserInfo: app.globalData.userInfo,
          levellogo
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  getTimeLineAction: function () {
    http.post(api.getTimeLineApi, {}).then(res => {
      console.log(res)
      if (res.success) {
        //dateStr
        let lst = res.data
        let temps = []
        let imgStr = ''
        let imgarr = []
        let temp = undefined
        lst.map(item => {
          temp = item
          temp.dateStr = util.formatDate(new Date(item.time))
          imgStr = temp.img
          imgarr = []
          if (item.type == 1) {
            // 活动
            imgarr.push(item.activityuser.activity.cover)
            if (item.activityuser) {
              if (item.activityuser.activity) {
                let reviewimgs = item.activityuser.activity.reviewImgs
                if (reviewimgs.indexOf(';') > -1) {
                  let reimgArr = item.activityuser.activity.reviewImgs.split(';')
                  let reimgSjArr = []
                  reimgArr.map(item => {
                    reimgSjArr.push(item)
                  });
                  imgarr = imgarr.concat(reimgSjArr)
                }
              }
            }
          }
          temp.imgs = imgarr;
          temps.push(temp)
        });
        this.setData({
          infos: temps,
          imgs: imgarr
        })
      }
      wx.stopPullDownRefresh();
    }).catch(msg => {
      console.log(msg)
      wx.stopPullDownRefresh();
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getSystemInfoSync();
    app.editTabbar() // 关闭tabbar
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

  onShow: function () {
    token = wx.getStorageSync('token')
    console.log(token)
    if (token.length > 0) {
      let self = this
      //获取用户数据
      this.getSysUserInfo()
      this.setData({
        loginState: true
      })
      this.getTimeLineAction()
    }
  },

  onPageScroll: function (e) {
    let scrollTop = e.scrollTop
    var isSatisfy = scrollTop >= 116 ? 2 : 1;
    if (this.data.styleType == isSatisfy) {
      return
    }
    this.setData({
      styleType: isSatisfy
    })
  },

  catimgAction: function (e) {
    console.log(e.currentTarget.dataset.src)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.imgs // 需要预览的图片http链接列表
    })
  },

  onPullDownRefresh: function () {
    token = wx.getStorageSync('token')
    if (token.length > 0) {
      let self = this
      //获取用户数据
      this.getSysUserInfo()
      this.setData({
        loginState: true
      })
      this.getTimeLineAction()
      app.editTabbar();
    }
  }
})