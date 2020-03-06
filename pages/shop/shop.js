// pages/shop/shop.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

let pageIndex = 1
let pageSize = 10
let hasMore = false
let qiniuUrl = 'https://url.songshuqubang.com/micsoft'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    point: "", 
    follow: false,
    list: null,
    maskData: null,
    canConvert: false,
    sysUserInfo: {},
    per: 0,
    asb: 0,
    qiniuUrl:'https://url.songshuqubang.com/micsoft',
    tab:0,
    pointList:[
      {
        img: 'https://url.songshuqubang.com/micsoft/img/rpoint5.png',
        title: '每日签到打卡',
        point: '',
        finish:false
      },
      {
        img:'https://url.songshuqubang.com/micsoft/img/rpoint1.png',
        title:'关注松鼠趣邦公众号',
        point:'50',
        finish:false
      },
      {
        img: 'https://url.songshuqubang.com/micsoft/img/rpoint2.png',
        title: '完善资料中心',
        point: '100',
        finish:false
      },
      {
        img: 'https://url.songshuqubang.com/micsoft/img/rpoint3.png',
        title: '填写公益问卷',
        point: '20',
        finish:false
      },
      {
        img: 'https://url.songshuqubang.com/micsoft/img/rpoint4.png',
        title: '邀请好友注册',
        point: '50',
        finish:false
      }
    ],
    showSign: false,
    signDays: 0,
    signDay:0,
    pointS:0,
    top3Point: [],
    top7Point: [],
    myPoint:{},
    shareCode:'',
    task:'',
  },

/************************** 获取数据 **************************/

  // 签到天数
  getSignCount(){
    http.post(api.signCountAPI,{}).then(res=>{
      console.log(res.data)
      this.setData({
        signDay: res.data
      })
    }).catch(msg=>{
      console.log(msg)
    })
  },

  // 获取页面数据
  getSysUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      console.log(token)
      http.post(api.userInfoAPI, {}).then(res => {
        console.log( 'getSysUserInfo' , res)
        self.setData({
          sysUserInfo: res.data
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取商品列表
  getList() {
    var that = this;
    http.post(api.activityGoodsListAPI, {
      page: pageIndex,
      size: pageSize,
      goodsCategory: ''
    }).then(res => {
      // console.log(res.data)
      wx.stopPullDownRefresh()
      let list = res.data
      let oldLst = that.data.list;
      if (pageIndex == 1) {
        that.setData({
          list: res.data
        })
      } else {
        if (list.length > 0) {
          list.map(item => {
            oldLst.push(item)
          })
        }
        that.setData({
          list: oldLst
        })
      }
      if (list.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
      this.listToLR()
    }).catch(msg => {
      console.log(msg)
    })
  },

  // 商品分左右两组数据
  listToLR(){
    const leftLidt = []
    const rightLidt = []
    let list = this.data.list
    list.map((item,index)=>{
      item.ind = index+1
    })
    list.map(item => {
      let ind = item.ind
      if(ind%2==1){
        leftLidt.push(item)
      } else {
        rightLidt.push(item)
      }
    })
    this.setData({
      leftLidt, rightLidt
    })
    console.log(leftLidt)
    console.log(rightLidt)
  },

  // 获取我的积分
  getPoints: function () {
    var that = this
    let token = wx.getStorageSync('token')
    let levelId = 0
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        that.setData({
          sysUserInfo: res.data
        })
        console.log(res)
        let integral = res.data.integral
        http.get(api.getUserlevelListAPI,{}).then(res=>{
          console.log(res)
          let list = res.data
          list.map(item=>{
            if (integral >= item.start && integral<=item.end){
              levelId = item.id
            }
          })
          let p = list[levelId - 1].end - list[levelId - 1].start
          that.setData({ per: integral / p * 100 })
          this.setData({
            nowLevel: list[levelId-1].name ,
            nextLevel: list[levelId].name,
            endIntegral: list[levelId - 1].end
          })

        }).catch(msg=>{
          console.log(msg)
        })
        if (that.data.sysUserInfo.vip == 1) {
          that.setData({ pointS: 500})
        }
        if (that.data.sysUserInfo.vip == 2) {
          that.setData({ pointS: 2000})
        }
        if (that.data.sysUserInfo.vip == 3) {
          that.setData({ pointS: 5000})
        }
        if (that.data.sysUserInfo.vip == 4) {
          that.setData({ pointS: 10000})
        }
        
      }).catch(msg => {
        console.log(msg)
      })
    } else {
    }
  },

  // 获取用户数据
  getUserSignDetail: function () {
    http.post(api.signUserDetailAPI, {
      activityId: 1
    }).then(res => {
      let days = ''
      if (res.data.signTimes) {
        days = res.data.signTimes
      }
      this.setData({ signDays: days })
    }).catch(msg => {
      console.log(msg)
    });
  },

  // 获取分享码
  getShareCode() {
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          http.post(api.shareCodeAPI, { code: res.code }).then(res => {
            app.globalData.shareCode = res.data.data
            that.setData({
              shareCode: res.data.data
            })
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

/************************** 监听跳转 **************************/

  // 跳转公益积分规则
  toPointCenter() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    });
  },

  // 跳转兑换页面
  convert: function (e) {
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      let maskData = this.data.maskData
      wx.navigateTo({
        url: '/pages/order/order?id=' + maskData.id
      })
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        });
      }, 600)
    }
  },

  //跳转
  handleContact: function () {
    console.log('handleContact')
    // 主动校验
    // this.follow()
  },

  // 跳转商品详情
  goodsDetail(event) {
    let goodsItem = event.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + goodsItem.id,
    })
  },

  // 跳转立即前往
  pointGo(e) {
    let that = this
    let tag = e.currentTarget.dataset.tag
    if (tag == 0) {
      this.getSignCount()
      console.log(tag)
      this.setData({
        showSign: true
      })
    } else if (tag == 1) {
      console.log('关注公众号')
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else if (tag == 2) {
      wx.navigateTo({
        url: '../studentinfo/manager/manager',
      })
    } else if (tag == 3) {
      console.log(tag)
      wx.navigateTo({
        url: '../vote/vote?to=' + 'vote',
      })
    } else if (tag == 4) {
      console.log(1)
      console.log(tag)
    }
  },

  /* *************************** 事件 ******************************* */

  /* 切换tab */
  changeTab(e) {
    let tag = e.currentTarget.dataset.tag
    if (tag == 'shop') {
      this.setData({
        tab: 0
      })
    } else if (tag == 'point') {
      this.setData({
        tab: 1
      })
    } else if (tag == 'vote') {
      wx.navigateTo({
        url: '/pages/shop1/shop1',
      })
    } else if (tag == 'allGoods') {
      this.setData({
        tab: 3
      })
    }
  },

  // 关闭弹窗
  closePoint() {
    this.setData({ showSign: false })
  },

  // 签到
  signIn() { 
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.signDayAPI, {}).then(res => {
        this.getSignCount()
        console.log(res)
      }).catch(msg => {
        console.log(msg)
      })
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        });
      }, 600)
    }
    

  },

  // 获取当前时间YYYY-MM-DD
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  // 任务完善资料
  getTaskCheck() {
    // 登录 返回 code 
    let self = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          http.post(api.taskCheckAPI, { type: 'userinfo' , code: res.code }).then(res => {
            console.log('getTaskCheck', res)
            if (res.success) {
              let userState = res.data.user
              let wxState = res.data.wx
              self.setData({
                'pointList[2].finish': userState,
                'pointList[1].finish': wxState
              })
            }
          });
        }
      }
    });
  },

/************************** 生命周期 **************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    pageIndex = 1
    this.getShareCode()
    this.getList()
    this.getPoints()
    this.getUserSignDetail()
    this.getSignCount()
    this.getTaskCheck()
  },

  onShow: function () {
    let token = wx.getStorageSync('token')
    if (app.globalData.shopRank == 'rank') {
      wx.navigateTo({
        url: '/pages/shop1/shop1',
      })
    }
    if (app.globalData.shopRank == 'point') {
      this.setData({
        tab: 1
      })
    }
    if (app.globalData.shopRank == 'shop') {
      this.setData({
        tab: 0
      })
    }
    if (app.globalData.shopRank == 'sign') {
      this.setData({
        tab: 1,
        showSign:true
      })
    }
    if (app.globalData.shopRank == 'allGoods') {
      this.setData({
        tab: 3
      })
    }
    app.globalData.shopRank = ''
    if (token.length > 0) {
      let self = this
      this.getSysUserInfo()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1
    let tab = this.data.tab
    if(tab==0){
      this.getList()
    }
    if (tab == 1) {
      wx.stopPullDownRefresh()
    }
    this.getPoints()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if ((this.data.tab == 0 || this.data.tab == 3) && hasMore){
      console.log(111)
      pageIndex++
      this.getList()
    }
  },

  // 分享好友
  onShareAppMessage: function (options) {
    // console.log(this.data.shareCode)
    var that = this;
    let shareCode = this.data.shareCode
       
    var shareObj = {
      title: "邀请好友",
      path: '/pages/login/login?from=' + 'share&shareCode='+shareCode,
      imageUrl: '',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') { }
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
        } else if (res.errMsg == 'shareAppMessage:fail') {
        }
      },
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset;
      shareObj.path = '/pages/login/login?from=' + 'share&shareCode=' + shareCode;
    }
    return shareObj;
  },

  /* ******************************************************************* */

  // previewImage(e) {
  //   var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
  //   wx.previewImage({
  //     current: current,//需要预览的图片链接列表
  //     urls: [current]  //当前显示图片的链接
  //   })
  // },

  // closefollow() {
  //   this.setData({
  //     follow: false
  //   })
  // },

  // follow() {
  //   let token = wx.getStorageSync('token')
  //   console.log(token)
  //   if (!token) {
  //     wx.showToast({
  //       title: '请先登录!',
  //       duration: 2000,
  //       mask: true,
  //       icon: 'none'
  //     })
  //     setTimeout(() => {
  //       wx.navigateTo({
  //         url: '/pages/login/login',
  //       })
  //     }, 900);
  //   } else {
  //     wx.login({
  //       success(res) {
  //         if (res.code) {
  //           let code = res.code
  //           console.log(code)
  //           http.post(api.careStateAPI, { code }).then(res => {
  //             console.log(res)
  //           }).catch(msg => {
  //             console.log(msg)
  //           })
  //         } else {
  //           console.log('登录失败！' + res.errMsg)
  //         }
  //       }
  //     })
  //   }
  // },
})