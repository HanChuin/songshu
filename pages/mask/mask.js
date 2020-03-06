// pages/mask/mask.js
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
    bannerUrls: [{
      levelstr: '松果I'
    }, {
      levelstr: '松果II'
    }, {
      levelstr: '松果III'
    }, {
      levelstr: '松果IV'
    }],
    sysUserInfo: {}, // 用户信息
    pointS: 0, //等级积分
    per: 0,
    signDay: 0, //签到天数
    pointList: [{
        img: '../../img/markOne.png',
        title: '关注公众号',
        point: '50',
        finish: false,
        actionA: '关注',
        actionB: '已关注'
      },
      {
        img: '../../img/markTwo.png',
        title: '完善资料',
        point: '100',
        finish: false,
        actionA: '前往',
        actionB: '已完成'
      },
      {
        img: '../../img/markThree.png',
        title: '填写问卷',
        point: '20',
        finish: false,
        actionA: '填写',
        actionB: '已完成'
      },
      {
        img: '../../img/markFour.png',
        title: '邀请好友',
        point: '50',
        finish: false,
        actionA: '邀请',
        actionB: '已完成'
      }
    ],
    shareCode: '',
    list: null,
    first: {},
    myNum: '',
    systemInfo: {},
    toView: null,
    cutName: '',
    cutTopName: '',
    curLevel: 0, //当前等级
  },

  // 签到天数
  getSignCount() {
    http.post(api.signCountAPI, {}).then(res => {
      console.log(res.data)
      this.setData({
        signDay: res.data
      })
    }).catch(msg => {
      console.log(msg)
    })
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

  // 获取我的积分
  getPoints: function() {
    var that = this
    let token = wx.getStorageSync('token')
    let levelId = 0
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        that.setData({
          sysUserInfo: res.data,
          cutName: res.data.userName.substring(0, 4),
          cutTopName: res.data.userName.substring(0, 9)
        })
        console.log(res.data.integral)
        let integral = res.data.integral
        http.get(api.getUserlevelListAPI, {}).then(res => {
          console.log(res.data)
          let list = res.data
          list.map(item => {
            if (integral >= item.start && integral <= item.end) {
              levelId = item.id
            }
          })
          let p = list[levelId - 1].end - list[levelId - 1].start
          // console.log(p)
          that.setData({
            per: integral / p * 100
          })
          this.setData({
            nowLevel: list[levelId - 1].name,
            nextLevel: list[levelId].name,
            endIntegral: list[levelId - 1].end,
          })

        }).catch(msg => {
          console.log(msg)
        })
        if (that.data.sysUserInfo.vip == 1) {
          that.setData({
            pointS: 500
          })
        }
        if (that.data.sysUserInfo.vip == 2) {
          that.setData({
            pointS: 2000
          })
        }
        if (that.data.sysUserInfo.vip == 3) {
          that.setData({
            pointS: 5000
          })
        }
        if (that.data.sysUserInfo.vip == 4) {
          that.setData({
            pointS: 10000
          })
        }

      }).catch(msg => {
        console.log(msg)
      })
    } else {}
  },

  // 获取页面数据
  getSysUserInfo: function() {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log('getSysUserInfo', res)
        if (res.success) {
          let data = res.data
          let levellogo = ''
          if (data.vip == 1) {
            levellogo = 'https://url.songshuqubang.com/image/level/1_meitu_1.png'
          } else if (data.vip == 2) {
            levellogo = 'https://url.songshuqubang.com/image/level/2_meitu_2.png'
          } else if (data.vip == 3) {
            levellogo = 'https://url.songshuqubang.com/image/level/3_meitu_3.png'
          } else if (data.vip == 4) {
            levellogo = 'https://url.songshuqubang.com/image/level/4_meitu_4.png'
          }

          self.setData({
            sysUserInfo: data,
            levellogo
          })

        }

      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取分享码
  getShareCode() {
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          http.post(api.shareCodeAPI, {
            code: res.code
          }).then(res => {
            // console.log(res.data.data)
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

  // 任务完善资料
  getTaskCheck() {
    // 登录 返回 code 
    let self = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          http.post(api.taskCheckAPI, {
            type: 'userinfo',
            code: res.code
          }).then(res => {
            // console.log('getTaskCheck', res)
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

  // 获取商品列表
  getList() {
    var that = this;
    http.post(api.activityGoodsListAPI, {
      page: pageIndex,
      size: pageSize,
      goodsCategory: ''
    }).then(res => {
      console.log(res.data)
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
    }).catch(msg => {
      console.log(msg)
    })
  },

  /* 获取积分排名 */
  getPointList() {
    let that = this
    http.post(api.getPointListAPI, {}).then(res => {
      wx.stopPullDownRefresh()
      // console.log('getPointList', res)
      const list = res.data.list
      const myPoint = that.data.sysUserInfo
      let myId = that.data.sysUserInfo.id
      console.log(myId)
      let myNo = '99+'
      list.map((item, index) => {
        if (item.id == myId) {
          myNo = index + 1
        }
      })
      console.log(myNo)
      that.setData({
        first: res.data.list[0],
        myNum: myNo
      })
    }).catch(msg => {
      console.log(msg)
    })
  },

  getRecommendPower: function () {
    http.post(api.getRecommendPowerApi, {}).then(res => {
      if (res.success) {
        let lst = res.data
        let temps = []
        let temp = {
          powers: []
        }
        lst.map((item, index) => {
          console.log('item', item)
          console.log('index', index)
          temp = {
            powers: []
          }
          item.map(i => {
            temp.powers.push(i)
          })
          switch (index) {
            case 0:
              temp.levelstr = '松果I'
              break;
            case 1:
              temp.levelstr = '松果II'
              break;
            case 2:
              temp.levelstr = '松果III'
              break;
            case 3:
              temp.levelstr = '松果IV'
              break;
          }

          temps.push(temp)
        })
        console.log('getRecommendPower', temps);
        this.setData({
          bannerUrls: temps
        })
      }
    });
  },

  getSystemInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        that.setData({
          systemInfo: res
        })
        // that.update()
      },
    })
  },

  // tab切换
  changeTab(e) {
    wx.navigateTo({
      url: '/pages/paihang/sort',
    })
  },

  click(e) {
    console.log('e', e)
    var that = this
    var hash = e.currentTarget.dataset.hash
    that.setData({
      toView: hash
    })
  },

  // 跳转所有列表页
  skipAll(e) {
    wx.navigateTo({
      url: '/pages/allList/allList',
    })
  },

  // 跳转商品详情
  goodsDetail(event) {
    let goodsItem = event.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + goodsItem.id,
    })
  },

  // 跳转公益积分规则
  toPointCenter() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    });
  },

  // 跳转立即前往
  pointGo(e) {
    let that = this
    let tag = e.currentTarget.dataset.tag
    console.log(tag)
    if (tag == 0) {
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })

    } else if (tag == 1) {
      wx.navigateTo({
        url: '../studentinfo/manager/manager',
      })
    } else if (tag == 2) {
      console.log(tag)
      wx.navigateTo({
        url: '../vote/vote?to=' + 'vote',
      })
    } else if (tag == 3) {
      // console.log(1)

      // console.log(tag)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar();
    pageIndex = 1
    this.getPoints()
    this.getSignCount()
    this.getShareCode()
    this.getTaskCheck()
    this.getList()
    this.getPointList()
    this.getSystemInfo()
    this.getRecommendPower();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let token = wx.getStorageSync('token')
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
    this.getList()
    this.getPoints()
    this.getPointList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasMore) {
      pageIndex++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    console.log(options)
    var that = this;
    let shareCode = this.data.shareCode
    var shareObj = {
      title: "邀请好友",
      path: '/pages/login/login?from=' + 'share&shareCode=' + shareCode,
      imageUrl: '',
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function() {
        if (res.errMsg == 'shareAppMessage:fail cancel') {} else if (res.errMsg == 'shareAppMessage:fail') {}
      },
    };
    // 来自页面内的按钮的转发
    if (options.from == 'view') {
      var eData = options.target.dataset;
      shareObj.path = '/pages/login/login?from=' + 'share&shareCode=' + shareCode;
    }
    return shareObj;
  },

  /**
   * 上一个按钮
   */
  prolevelaction: function() {
    let index = this.data.curLevel
    index = (index + 3) % 4;
    this.setData({
      curLevel: index
    })
  },

  /**
   * 下一个按钮
   */
  nextlevelaction: function() {
    let index = this.data.curLevel
    index = (index + 1) % 4;
    this.setData({
      curLevel: index
    })
  },

  /**
   * 更多权益
   */
  morepoweraction: function(e) {
    console.log(e.currentTarget.dataset.index)
    let level = e.currentTarget.dataset.index + 1
    wx.navigateTo({
      url: 'pages/power/list/powerlist?type' + level,
    });
  }

})