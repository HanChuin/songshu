/**
 * 新活动详情页面
 */
let activityId = 0
let recordId = 0
const app = getApp();
const http = require("../../../utils/http.js");
const api = require("../../../utils/api.js");
var WxParse = require('../../../libs/wxParse/wxParse.js');
let lat = 0
let lng = 0

// 用户位置
let userLat = 0
let userLng = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    detail: {},
    conver: '',
    btnStr: '立即报名',
    topopacity: 1, //顶部透明度
    bodytoplen: 200,
    categrory: [], // 选择的分类
    codeImg: '', //二维码图片
    showChoice: false,
    choiceTag: 0,
    userActivityInfo: undefined,
    signStr: '', //签到按钮
    userSrc: '',
    codeSrc: '',
    userName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      this.setData({
        fromShare: true
      })
      let scene = decodeURIComponent(options.scene)
      let i = scene.indexOf('=')
      let y = scene.substring(0, i)
      let x = scene.substr(i + 1)
      activityId = x
    } else {
      activityId = options.id || 0;
    }

    // 个人活动记录
    if (options.recordId) {
      recordId = options.recordId
    }

    this.getCategory();
    if (options.fromType == 'user') {
      this.getUserActivityInfo();
    } else {
      this.getActivityDetail(); 
    }

    this.getUserInfo();
  },

  /* *************************** 获取数据 **************************** */

  // 获取用户详情
  getUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token');
    if (token != '') {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        if (res.success) {
          let data = res.data
          self.setData({
            userLogo: data.headImg,
            userName: data.userName
          })
        }
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  /**
   * 获取活动参与情况
   */
  getUserActivityInfo: function () {
    let token = wx.getStorageSync('token');
    if (token != '' && recordId > 0) {
      //掉接口
      let params = {
        id: recordId
      }
      http.post(api.userActivityDetailAPI, params).then(res => {
        console.log('getUserActivityInfo', res)
        let info = res.data
        activityId = info.activityId
        this.getActivityDetail()
        if (info.signTime) {
          this.setData({
            userActivityInfo: res.data,
            signStr: '已签到'
          })
        } else {
          this.setData({
            userActivityInfo: res.data,
            signStr: '签到'
          })
        }
      }).catch(msg => {
        console.error(msg)
      });

    }
  },

  // 获取活动详情
  getActivityDetail: function () {
    let that = this;
    let params = {
      id: activityId
    };
    http
      .post(api.activityDetailAPI, params)
      .then(res => {
        let result = res.data[0]; //接口数据
        lat = parseFloat(result.lat);
        lng = parseFloat(result.lng);
        // console.log(lat, lng)
        if (result.img.indexOf(',') != -1) {
          result.imgLst = result.img.split(",");
        } else if (result.img.indexOf(';') != -1) {
          result.imgLst = result.img.split(";");
        } else {
          result.imgLst = []
          result.imgLst.push(result.img)
        }
        result.tagLst = result.tags.split(";");
        //判断活动状态
        let state = ''
        let btnStr = ''
        switch (result.activeState) {
          case 0:
            state = '未开始';
            btnStr = '活动未开始';
            break;
          case 1:
            if (result.type == 2) {
              state = '报名中';
              btnStr = '信息登记';
            } else {
              state = '报名中';
              btnStr = '立即报名';
            }
            break;
          case 2:
            state = '进行中';
            btnStr = '报名结束';
            break;
          case 3:
            state = '已结束';
            btnStr = '活动已结束';
            break;
          default:
            state = '状态异常';
            btnStr = ''
        }
        this.setData({
          btnStr
        })
        result.state = state;
        //修改截止时间-单位“天”
        let applyTime = new Date(result.applyTime);
        let nowTime = new Date();
        let days = 0;
        if (nowTime.getTime() > applyTime.getTime()) {
          days = 0;
        } else {
          days = parseInt(
            (applyTime.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (days == 0) {
            days = 1;
          }
        }
        //修改开始结束时间格式
        if (result.startTime && result.endTime) {
          let start = new Date(result.startTime);
          let end = new Date(result.endTime);
          result.start = start.getMonth() + 1 + "/" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes();
          result.end = end.getMonth() + 1 + "/" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes();
        } else {
          result.start = "";
          result.end = "";
        }
        result.endDays = days;
        that.setData({
          detail: result,
          conver: result.img
        });
        // this.downloadImg()
        WxParse.wxParse('newsactivityDetail', 'html', result.details, that);
      })
      .catch(msg => console.log(msg));
  },

  // 获取活动类别列表（全）
  getCategory() {
    http.post(api.activityCategoryListAPI, {
      id: activityId
    }).then(res => {
      this.setData({
        categrory: res.data
      })
      console.log(res.data)
    }).catch(msg => {
      console.log(msg)
    })
  },

  /* *************************** 页面跳转 **************************** */

  /* 回首页 */
  goToHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 跳转积分介绍页
  toPointCenter: function () {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://w.url.cn/s/ANmKAzV')
    });
  },

  /* *************************** 事件监听 **************************** */

  /* 地图 */
  intoMap: function () {
    let add = this.data.detail.address;
    wx.openLocation({ //所以这里会显示你当前的位置
      latitude: lat,
      longitude: lng,
      name: add,
      address: "",
      scale: 28
    })
  },

  /* 获取分享海报 */
  getSharePoster: function () {
    this.downloadImg();
  },

  /* 分享 */
  onShareAppMessage: function(obj) {
    return {
      imageUrl: this.data.detail.imgLst[0],
      title: this.data.detail.name,
      path: '/pages/activity/detailnew/detailnew?id=' + activityId,
      success: function(res) {},
      fail: function(res) {},
    }
  },

  /* 海报是否显示 */
  myEventListener: function(e) {
    this.setData({
      showVideo: true
    })
  },

  /* 页面滚动 */
  onPageScroll: function(e) {
    if (e.scrollTop < 90) {
      this.setData({
        topopacity: parseFloat((90 - e.scrollTop) / 90).toFixed(2)
      })
    } else {
      this.setData({
        topopacity: 0
      })
    }
  },

  // 参加活动
  joinActivity: function() {
    if (this.data.categrory.length > 1) {
      let items = [];
      this.data.categrory.map(item => {
        items.push(item.standardName)
      });

      var that = this
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          try {
            that.takeInAction(res.tapIndex)
          } catch (mg) {
            console.error(msg)
          }
        },
        fail: function(e) {
          console.log(e)
        }
      })
    } else {
      this.takeInAction(0);
    }
  },
  // 根据 index 跳转页面
  takeInAction: function(index) {
    this.setData({
      standardID: this.data.categrory[index].id
    })

    let token = wx.getStorageSync('token')
    if (token.length == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    let standardID = this.data.standardID
    // 文艺大赛
    // if (activityId == 62) {
    //   wx.navigateTo({
    //     url: '/pages/game/game',
    //   })
    // } 
    // 牙博士活动
    // else if(activityId == 66) {
    //   wx.navigateTo({
    //     url: '/pages/votenroll/votenroll?id=5',
    //   })
    // }

    if (this.data.detail.type == 2) {
      let id = this.data.detail.relationId
      wx.navigateTo({
        url: '/pages/formactivity/formactivity?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/notice/notice?activityId=' + activityId + '&standardId=' + standardID
      })
    }
  },

  // 活动签到
  signActivityAction: function() {
    if (userLat == 0 || userLng == 0) {
      wx.showToast({
        title: '请在指定活动范围内签到',
      });
    }
    var that = this
    http.post(api.signAPI, {
      id: recordId,
      lat: userLat,
      lng: userLng
    }).then(res => {
      wx.showToast({
        title: '签到完成',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        signStr: '已签到'
      })
    }).catch(info => console.log(info))
  },

  // 获取地理位置
  getLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        userLat = res.latitude
        userLng = res.longitude
        that.signActivityAction()
      },
      fail: function(msg) {
        console.log(msg)
        wx.showToast({
          title: '位置获取失败,请稍后再试',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  // 退出活动
  onBindTakeOutActivity() {
    wx.showModal({
      title: '提醒',
      content: '确定要退出活动吗?',
      success(res) {
        if (res.confirm) {
          http.post(api.takeOutActivityAPI, {
            id: recordId
          }).then(res => {
            if (res.success) {
              wx.showToast({
                title: "退出成功"
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1000);
            }
          });
        } else if (res.cancel) {

        }
      }
    });
  },

  /* 下载图片 ---- 分享海报 */
  downloadImg() {
    wx.showLoading({
      title: '正在准备海报...',
    });
    this.downloadActivityQR();
  },

  downloadActivityQR: function () {
    let that = this
    let imgUrl = this.data.detail.qrimg
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({
              codeSrc: productSrc
            })
            that.downloadActivityCover()
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },

  downloadActivityCover: function () {
    let that = this
    let imgUrl = this.data.detail.cover2
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({
              productSrc
            })
            that.downloadUserImg()
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },

  downloadUserImg: function () {
    let that = this
    // 下载头像
    wx.downloadFile({
      url: that.data.userLogo,
      success: function (res) {
        if (res.statusCode === 200) {
          var userSrc = res.tempFilePath;
          that.setData({
            userSrc
          })
        }
      },
      fail: function (e) {
        that.setData({
          userSrc: '/img/tabMidAct.png'
        })
      },
      complete: function () {
        wx.hideLoading();
        that.setData({
          showVideo: false
        })
        that.selectComponent('#getPoster').getAvaterInfo()
      }
    })
  },

  /* ********************************************************* */

  // choiceTo() {
  //   let standardID = this.data.standardID
  //   console.log(this.data.standardID)
  //   wx.navigateTo({
  //     url: '/pages/notice/notice?activityId=' + activityId + '&standardId=' + standardID
  //   })
  // },

  // choiceStandard(e) {
  //   console.log(e.currentTarget.dataset.id)
  //   this.setData({
  //     standardID: e.currentTarget.dataset.id,
  //     choiceTag: e.currentTarget.dataset.tag,
  //     showChoice: true
  //   })
  // },

  // bindPickerChange: function (e) {
  //   console.log(e)
  // },

})