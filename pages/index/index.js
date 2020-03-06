//index.js
//获取应用实例
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
let pageIndex = 1
let pageSize = 10
let hasMore = false
let signActivityId = 0;
let animationLeft = wx.createAnimation({
  duration: 2000,
  timingFunction: 'linear',
  delay: 0
});
let linkUrl = '' // click跳转地址

Page({
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim', // 压缩图片后缀
    sysUserInfo: '',
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    currentIndex: 0,
    swiperH: '', //swiper高度
    nowIdx: 0, //当前swiper索引
    bannerUrls: [], // 轮播图列表
    songshuTop: [], // 松鼠头条
    topCurrent: 0,
    shopList: [ // 趣益便利店
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopsignword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopSignImg.png',
        type: 'sign'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopshopword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopshopimg.png',
        type: 'shop'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shoppubword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shoppubimg.png',
        type: 'pub'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopvoteword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopvoteimg.png',
        type: 'vote'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopworkword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopvipimg.png',
        type: 'vip'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopobjword1.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopobjimg.png',
        type: 'obj'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shoprankword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shoprankimg.png',
        type: 'rank'
      },
      {
        name: 'https://url.songshuqubang.com/micsoft/img/shopservword.png',
        icon: 'https://url.songshuqubang.com/micsoft/img/shopservimg.png',
        type: 'serv'
      },
    ],
    signActivity: undefined,

    showClock: false,
    wowList: [], // wow积分
    partner: [], // 公益联盟
    otherActivities: [], // 主题活动
    otherTheme: '', //主题活动
    activities: [], // 趣活动
    videos: [], // 趣视频
    showAd: app.globalData.adShow, // 广告
    topUrl: '',

    currentIndex: 1,
    imgAnimation1: undefined,
    imgAnimation2: undefined,
    imgAnimation3: undefined,
    imgAnimation4: undefined,
    imgAnimation5: undefined,

    selectCyType: 2, //选择tab类型
    projectNum: [0, 0, 0, 0, 0, 0], // 不同类别数量
  },

  /************************* API获取数据 *************************/

  /* 是否登录 */
  getLogin() {
    let that = this
    wx.login({
      success(res) {
        console.log('getLogin', res)
        if (res.code) {
          that.getUnionId(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /* 获取unionId */
  getUnionId(code) {
    http.post(api.updateUnionUrl, {
      code
    }).then(res => {
      console.log(res)
    }).catch(msg => {
      console.log(msg)
    })
  },

  /**
   * 首页加载数据
   */
  loadHomeDate: function() {
    http.post(api.homeInitData, {}).then(res => {
      console.log(res)
      if (res.success) {
        let data = res.data
        let banner = data.banners
        let goods = data.goods
        let lastestUrl = data.lastestUrl.value
        let shops = data.shops
        let themeActivitys = data.themeActivitys
        let topmessages = data.topmessages
        /* 文艺大赛数据处理 */
        let wyds = data.wyds
        let wxdsTemps = []
        let xz = wyds.xzRes;
        xz.map(item => {
          wxdsTemps.push(item.count)
        })
        let by = wyds.byRes
        by.map(item => {
          wxdsTemps.push(item.count)
        });

        // 活动
        let activities = []
        let otherActivities = []
        let otherTheme = ''
        themeActivitys.map(item => {
          if (item.topicValue == '0101') {
            activities = item.menus
          } else {
            otherTheme = item.topicText
            otherActivities = item.menus
          }
        })

        this.setData({
          bannerUrls: banner,
          songshuTop: topmessages,
          projectNum: wxdsTemps,
          wowList: goods,
          partner: shops,
          activities,
          otherActivities,
          otherTheme
        })
        linkUrl = lastestUrl
        console.log('linkurl', linkUrl)
      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  // 获取我的积分
  getPoints() {
    var that = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        that.setData({
          sysUserInfo: res.data
        })
      }).catch(msg => {
        console.log(msg)
      })
    } else {
      this.setData({
        sysUserInfo: '',
      })
    }
  },



  /*************************** 页面跳转 ***************************/

  // 轮播图详情 跳转
  toNewsDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.bannerUrls[index]
    if (item.type == 1) {
      wx.navigateTo({
        url: '/pages/news/news?url=' + encodeURIComponent(item.url)
      });
    } else {
      wx.navigateTo({
        url: item.router
      });
    }
  },

  // 松鼠头条 了解一下 跳转
  topKnow() {
    let topUrl = this.data.topUrl
    wx.navigateTo({
      url: topUrl
    });
  },

  // 趣益便利店
  shopClickTo(e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'sign':
        app.globalData.shopRank = 'sign'
        wx.switchTab({
          url: '/pages/shop/shop',
        })
        break;
      case 'shop':
        app.globalData.shopRank = 'shop'
        wx.switchTab({
          url: '/pages/shop/shop',
        })
        break;
      case 'pub':
        wx.switchTab({
          url: '/pages/project/list/projectList', // '/pages/list/list'
        })
        break;
      case 'vip':
        app.globalData.shopRank = 'point'
        wx.switchTab({
          url: '/pages/shop/shop',
        })
        break;
      case 'vote':
        wx.navigateTo({
          url: '/pages/vote/vote',
        })
        break;
      case 'obj':
        wx.navigateTo({
          url: '/pages/personal/apply/apply',
        })
        break;
      case 'rank':
        wx.navigateTo({
          url: '/pages/shop1/shop1',
        })
        break;
    }
  },

  linkUrl1() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent(linkUrl)
    });
  },

  // 趣视频详情
  videoDetail(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.videos[index]
    let vid = item.id
    wx.navigateTo({
      url: '../video/playvideo?id=' + vid,
    })
  },

  clockRule() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    });
  },

  // 跳转商品详情
  goosDetail(e) {
    let goodsItem = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + goodsItem.id,
    })
  },

  // 跳转公益联盟详情页面
  goToPartnerDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shopper/shopper?id=' + id
    })
  },

  // 跳转活动详情
  toActivityDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity/detailnew/detailnew?id=' + id,
    })
  },
  
  // 公益积分怎么玩
  toPointCenter() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    });
  },

  // 跳转城市选择页
  changeCity() {
    wx.navigateTo({
      url: './city/city',
    })
  },

  /**
   * 广告跳转
   */
  catAdAction: function() {
    let adUrl = this.data.adUrl;
    let adRouter = this.data.adRouter;
    console.log('adUrl', adUrl)
    console.log('adRouter', adRouter)
    if (adUrl && adUrl.length > 0) {
      wx.navigateTo({
        url: '/pages/news/news?url=' + encodeURIComponent(adUrl)
      });
      return
    }
    if (adRouter && adRouter.length > 0) {
      wx.navigateTo({
        url: adRouter,
      })
    }
  },

  /*************************** 其他调用 ***************************/

  // 设置城市文字 去除“市”
  setCityText(city) {
    let text = city
    if (text.charAt(text.length - 1) === '市') {
      text = text.substring(0, text.length - 1)
    }
    return text
  },

  //获取swiper高度
  getHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var sH = winWid * imgh / imgw + "px"
    this.setData({
      swiperH: sH //设置高度
    })
  },
  //swiper滑动事件
  swiperChange: function(e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },

  // 🐿️头条change
  topChange(e) {
    let current = e.detail.current
    this.setData({
      topCurrent: current
    })
    this.setTopUrl(1)
  },
  setTopUrl(tag) {
    let current = 0
    if (tag != 0) {
      current = this.data.topCurrent
    }
    let item = this.data.songshuTop[current]
    if (item.url !== '') {
      this.setData({
        topUrl: '/pages/news/news?url=' + encodeURIComponent(item.url)
      })
    } else if (item.router !== '') {
      this.setData({
        topUrl: item.router
      });
    }
  },

  // 关闭广告
  closeAd() {
    this.setData({
      showAd: false
    })
  },

  // 关闭所有
  closeAll() {
    this.setData({
      showAd: false,
      showClock: false
    })
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

  // 获取地理位置 判断是否授权
  getLocation() {
    console.log('location')
    const _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.goAddress();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.goAddress();
        }
      }
    })
  },
  // 获取地理位置
  goAddress() {
    const _this = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        app.globalData.location = {
          longitude: res.longitude,
          latitude: res.latitude,
        }
        _this.getLocal(res.latitude, res.longitude)
      },
      fail: function() {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  getLocal(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log(res);
        // 实际位置
        let city = vm.setCityText(res.result.ad_info.city)
        let cityCode = res.result.ad_info.city_code

        // 上次位置
        let incity = vm.setCityText(wx.getStorageSync('city'))
        let incityCode = wx.getStorageSync('cityCode')

        // 第一次使用先存储位置
        if (!incityCode) {
          console.log(incityCode)
          wx.setStorageSync('cityCode', cityCode)
          wx.setStorageSync('city', city)
          vm.setData({
            city: vm.setCityText(city),
            cityCode
          })
        } else {
          // 获取过地理位置
          if (city !== incity) {
            // 地理位置变化
            // 监测到地理位置发生改变，是否切换到当前城市
            wx.showModal({
              title: '是否切换到当前城市',
              content: '监测到地理位置发生改变，是否切换到当前城市：' + city,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  vm.setData({
                    city,
                    cityCode
                  })
                  wx.setStorageSync('city', city)
                  // 如果当前城市可用直接切换
                  vm.setLocation(city)
                  // 否则手动切换城市

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          } else {
            // 地理位置不变
            vm.setData({
              city: city,
            })
            wx.setStorageSync('city', city)
          }
        }

      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });

  },

  // 设置定位
  setLocation(city) {
    let _this = this
    http.post(api.getCityApi, {
      name: city
    }).then(res => {
      // 直接切换
      console.log(res)
      wx.setStorageSync('city', res.data.name)
      _this.setData({
        city: res.data.name
      })

    }).catch(res => {
      // 手动切换
      wx.navigateTo({
        url: './city/city',
      })
    })
  },

  getLocalFn() {
    qqmapsdk = new QQMapWX({
      key: 'DDUBZ-OOD3X-GLY4X-ZY2TK-NZJUZ-3JFA2' //这里自己的key秘钥进行填充
    });
    let city = wx.getStorageSync('city')
    this.setData({
      city
    })
    this.getLocation() // 获取地理位置
  },

  /*************************** 生命周期 ***************************/

  onLoad: function(option) {
    app.editTabbar() // 关闭tabbar
    let token = wx.getStorageSync('token')
    if (token.length > 0) this.getLogin()
    this.loadHomeDate() // 首页数据
    this.startAnimationOne() // 动画开启
    this.getLocalFn() // 获取定位
  },

  onShow: function() {
    this.getPoints() // 获取积分
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadHomeDate();
    wx.stopPullDownRefresh();
  },

  // 分享
  onShareAppMessage: function(obj) {
    return {
      imageUrl: 'https://url.songshuqubang.com/image/ssqb/img_share_bg.jpeg',
      title: '让公益更有趣!',
      path: 'pages/index/index',
      success: function(res) {},
      fail: function(res) {},
    }
  },

  // 客服
  handleContact(e) {},

  /**
   * 一个动画全过程
   * 😯 干的漂亮 🎉🎉🎉👏👏👏 (--来自一只职业舔狗😉)
   */
  startAnimationOne: function() {
    let self = this
    let next = 0
    // 定时器
    setInterval(function() {
      switch (next % 13) {
        case 0:
          self.startAnimaTypeIndex(1, 1)
          break;
        case 1:
          self.startAnimaTypeIndex(2, 1)
          self.startAnimaTypeIndex(6, 2)
          break;
        case 2:
          self.startAnimaTypeIndex(3, 1)
          self.startAnimaTypeIndex(1, 2)
          break;
        case 3:
          self.startAnimaTypeIndex(4, 1)
          self.startAnimaTypeIndex(2, 2)
          self.startAnimaTypeIndex(6, 3)
          break;
        case 4:
          self.startAnimaTypeIndex(5, 1)
          self.startAnimaTypeIndex(3, 2)
          self.startAnimaTypeIndex(1, 3)
          break;
        case 5:
          self.startAnimaTypeIndex(4, 2)
          self.startAnimaTypeIndex(2, 3)
          self.startAnimaTypeIndex(6, 4)
          break;
        case 6:
          self.startAnimaTypeIndex(5, 2)
          self.startAnimaTypeIndex(3, 3)
          self.startAnimaTypeIndex(1, 4)
          break;
        case 7:
          self.startAnimaTypeIndex(4, 3)
          self.startAnimaTypeIndex(2, 4)
          self.startAnimaTypeIndex(6, 5)
          break;
        case 8:
          self.startAnimaTypeIndex(5, 3)
          self.startAnimaTypeIndex(3, 4)
          self.startAnimaTypeIndex(1, 5)
          break;
        case 9:
          self.startAnimaTypeIndex(4, 4)
          self.startAnimaTypeIndex(2, 5)
          break;
        case 10:
          self.startAnimaTypeIndex(5, 4)
          self.startAnimaTypeIndex(3, 5)
          break;
        case 11:
          self.startAnimaTypeIndex(4, 5)
          break;
        case 12:
          self.startAnimaTypeIndex(6, 1)
          self.startAnimaTypeIndex(5, 5)
          break;
      }
      next++;
    }.bind(self), 1000);
  },

  startAnimaTypeIndex: function(type, index) {
    if (type == 1) {
      // 上移动1位
      animationLeft.scale(1, 1).opacity(1).translate(-5, -5).step();
    } else if (type == 2) {
      // 上移动2位
      animationLeft.scale(1, 1).opacity(1).translate(-10, -10).step();
    } else if (type == 3) {
      // 放大
      animationLeft.scale(1.1, 1.1).opacity(1).translate(-20, -20).step();
    } else if (type == 4) {
      // 缩小隐藏
      animationLeft.scale(0.1, 0.1).opacity(0).translate(-20, -20).step();
    } else if (type == 5) {
      // 恢复1
      animationLeft.scale(0.1, 0.1).opacity(0).translate(0, 0).step();
    } else if (type == 6) {
      animationLeft.scale(1, 1).opacity(1).translate(0, 0).step({
        timingFunction: 'step-start'
      });
    }

    if (index == 1) {
      this.setData({
        imgAnimation1: animationLeft.export(),
      })
    } else if (index == 2) {
      this.setData({
        imgAnimation2: animationLeft.export(),
      })
    } else if (index == 3) {
      this.setData({
        imgAnimation3: animationLeft.export()
      })
    } else if (index == 4) {
      this.setData({
        imgAnimation4: animationLeft.export()
      })
    } else if (index == 5) {
      this.setData({
        imgAnimation5: animationLeft.export()
      })
    }
  },

  changeCxTypeAction: function() {
    if (this.data.selectCyType == 1) {
      this.setData({
        selectCyType: 2
      })
    } else {
      this.setData({
        selectCyType: 1
      })
    }
  },

  catCydsAction: function(e) {
    console.log(e.currentTarget.dataset.type)
    let type = e.currentTarget.dataset.type
    let index = 0
    if (type == 1) {
      if (this.data.selectCyType == 1) {
        index = 3
      } else {
        index = 0
      }
    } else if (type == 2) {
      if (this.data.selectCyType == 1) {
        index = 4
      } else {
        index = 1
      }
    } else if (type == 3) {
      if (this.data.selectCyType == 1) {
        index = 5
      } else {
        index = 2
      }
    }

    wx.navigateTo({
      url: '/pages/match/vote/vote?type=' + index,
    });
  },

  catCyds2Action: function() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://mp.weixin.qq.com/s/cNpwdmWdkOqPpRx_qK1PsQ')
    });
  },

  catReportAction: function() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://mp.weixin.qq.com/s/sQeimcb4ss3F0IxyvgBchg')
    })
  },

  /* *********************************************************** */

  /**
   * 广告数据
   */
  // getAdDate() {
  //   let that = this
  //   http.post(api.getfirstdataAPI, {}).then(res => {
  //     console.log('getAdDate', res)
  //     let imgUrl = '' //图片地址
  //     let adRouter = '' // 广告内部路由
  //     let adUrl = '' // 广告外部地址
  //     if (res.data.list.length > 0) {
  //       let data = res.data.list[0]
  //       imgUrl = data.imgUrl;
  //       adRouter = data.router;
  //       adUrl = data.url;
  //     }

  //     wx.setStorage({
  //       key: 'adImgUrl',
  //       data: imgUrl,
  //     })
  //     wx.setStorage({ // 图地址
  //       key: 'adUrl',
  //       data: adUrl,
  //     })
  //     wx.setStorage({ // 路由地址 / router
  //       key: 'adRouter',
  //       data: adRouter
  //     })
  //   }).catch(msg => {
  //     console.log(msg)
  //   });
  // },

  // loadAdAction: function() {
  //   let that = this
  //   // 1.取本地的广告缓存 (图地址 / 路由地址 / router )
  //   wx.getStorage({
  //     key: 'adImgUrl', // 图地址
  //     success: function(res) {
  //       console.log(res.data)
  //       that.setData({
  //         adImgUrl: res.data
  //       })
  //     },
  //   })
  //   wx.getStorage({
  //     key: 'adRouter', // 路由地址 / router
  //     success: function(res) {
  //       console.log(res.data)
  //       that.setData({
  //         adRouter: res.data
  //       })
  //     },
  //   })

  //   wx.getStorage({
  //     key: 'adUrl',
  //     success: function(res) {
  //       that.setData({
  //         adUrl: res.data
  //       })
  //     },
  //   })
  //   // 3.获取新的广告数据
  //   this.getAdDate()
  // },

  // joinCydsAction: function() {
  //   let token = wx.getStorageSync('token')
  //   if (token.length > 0) {
  //     wx.navigateTo({
  //       url: '../game/game',
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/login/login',
  //     })
  //   }
  // },

  // 获取统计数量
  // getProjectNum: function() {
  //   http.post(api.projectNumApi, {}).then(res => {
  //     console.log(res)
  //     let temps = []
  //     if (res.success) {
  //       let xz = res.data.xz;
  //       xz.map(item => {
  //         temps.push(item.count)
  //       })
  //       let by = res.data.by
  //       by.map(item => {
  //         temps.push(item.count)
  //       })
  //       console.log('getProjectNum', temps)
  //       this.setData({
  //         projectNum: temps
  //       })
  //     }
  //   }).catch(msg => {
  //     console.error(msg)
  //   });
  // },

  // getConfig: function() {
  //   http.post(api.getConfigValueApi, {
  //     key: 'lastnewsurl'
  //   }).then(res => {
  //     if (res.success) {
  //       linkUrl = res.data.value
  //     }
  //   }).catch(msg => {
  //     console.log(msg)
  //   })
  // },

})