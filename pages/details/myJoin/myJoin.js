// pages/details/myJoin/myJoin.js
const http = require("../../../utils/http.js");
const api = require("../../../utils/api.js");
var WxParse = require('../../../libs/wxParse/wxParse.js');
let activityId = 0;
let lat = 0
let lng = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role: "",
    active: "1", //tab选中
    detail: {},
    typeArr: [
    ],
    typeSel: -1,
    animationData: '',
    selectShow: false,
    goodsList: [],
    orgDetail: {},
    commentList: [],
    memberLst: [], //活动成员
    isDisabled: true,
    maskIsShow: true, // 签到弹窗
    signBtnClick: true,
    signState: false, //签到状态
    currentSwiper: 0,
    showinfo: false, //基本信息的展示
    end: '',
    sel: '类别',
    standardId: '',
    studentId: ''
  },

  // 监听轮播
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  //获取类别
  getCategrory: function() {
    http.post(api.categroryDetailAPI, {
      id: this.data.standardId
    }).then(res => {
      console.log(res)
      this.setData({
        sel: res.data[0]
      })
    }).catch(msg => {
      console.log(msg)
    })
  },

  //退出活动
  exitActivity: function() {
    let data = {
      activityId: this.data.detail.id,
      standardId: this.data.standardId,
      studentId: this.data.studentId
    }
    console.log('22', data)
    wx.showModal({
      title: '确认退出吗?',
      content: '',
      success(res) {
        if (res.confirm) {
          http.post(api.takeOutActivityAPI, data).then(res => {
            console.log(res)
            if (res.success) {
              wx.showToast({
                title: res.data,
                duration: 2000
              })
              setTimeout(() =>
                wx.navigateBack({
                  delta: 1
                }), 1000
              )
            } else {
              wx.showToast({
                title: '退出失败!',
                duration: 2000
              })
            }
          }).catch(msg => {
            console.log(msg)
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },

  showInfo: function() {
    this.setData({
      showinfo: !this.data.showinfo
    })
  },

  onBindOrgDetail(event) {
    // 益组织详情
    wx.navigateTo({
      url: `/pages/organization/detail/detail?activityId=${activityId}&createUid=${
        this.data.detail.createUid
        }`
    });
  },

  onBindTakeOutActivity() {
    http.post(api.takeOutActivityAPI, {
      activityId: activityId
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
  },

  onBindRecord() {
    wx.navigateTo({
      url: `/pages/record/record?activityId=${activityId}`
    });
  },

  onBindTab(event) {
    this.setData({
      active: event.currentTarget.dataset.active
    });
  },

  // 点击底bar的签到
  onBindSign: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        lat = res.latitude
        lng = res.longitude

        that.setData({
          maskIsShow: false
        })

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

  // 关闭签到弹窗
  closeMask: function() {
    this.setData({
      maskIsShow: true
    })
  },

  // 选择签到地址
  chooseLocation: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        // console.log(res.name)
        var addr = 'maskData.getAddress'
        that.setData({
          [addr]: res.name
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  // 拨打联系电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function() {
        console.log("成功拨打电话")
      }
    })
  },

  // 点击确定签到
  signConfirmBtn: function() {
    let spanTime = 30 * 60 * 1000
    //根据活动时间来确定是否可以签到
    let activtyStartTime = new Date(this.data.detail.startTime)
    let space = Math.abs(new Date().getTime() - activtyStartTime.getTime())
    if (space > spanTime) {
      wx.showToast({
        title: '请在活动开始前后30分钟内签到',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this
    http.post(api.signAPI, {
      activityId: activityId,
      lat: lat,
      lng: lng
    }).then(res => {
      wx.showToast({
        title: '签到完成',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        signBtnClick: false
      })
    }).catch(info => {})
  },

  // 获取活动详情
  getActivityDetail: function() {
    let that = this;
    let params = {
      id: activityId
    };
    http
      .post(api.activityDetailAPI, params)
      .then(res => {
        console.log(res.data[0]);
        let result = res.data[0];
        result.tagLst = result.tags.split(";");
        result.imgLst = result.img.split(";");
        //判断活动状态
        let state = ''
        let btshow = ''
        switch (result.activeState) {
          case 0:
            state = '未开始';
            btshow = '活动未开始';
            break;
          case 1:
            state = '报名中';
            btshow = '立即报名';
            break;
          case 2:
            state = '进行中';
            btshow = '立即报名';
            break;
          case 3:
            state = '已结束';
            btshow = '活动已结束';
            break;
          default:
            state = '状态异常';
            btshow = ''
        }
        this.setData({
          btshow: btshow
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
          detail: result
        });
        WxParse.wxParse('activityDetail', 'html', result.details, that);
      })
      .catch(msg => {
        console.log(msg);
      });
  },

  getActivityCommentList() {
    http
      .post(api.activityCommentListAPI, {
        activityId: activityId
      })
      .then(res => {
        this.setData({
          commentList: res.data
        });
      });
  },

  // 获取活动成员
  getMember: function() {
    let params = {
      activityId: activityId
    };
    let that = this;
    http
      .post(api.activityUserListAPI, params)
      .then(res => {
        that.setData({
          memberLst: res.data
        });
      })
      .catch(msg => {});
  },

  // 活动奖品列表
  getGoodLsit() {
    var that = this
    http
      .post(api.activityGoodsListAPI, {
        activityId: activityId,
        state: 2
      })
      .then(res => {
        that.setData({
          goodsList: res.data
        });
      });
  },

  //组织详情
  getCreateDetail: function() {
    let params = {
      createUid: this.data.detail.createUid
    };
    http
      .post(api.activityOrgDetailAPI, params)
      .then(res => {
        this.setData({
          orgDetail: res.data
        });
      })
      .catch(msg => {});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('11', options)
    activityId = options.id;
    let standardId = options.standardId
    let studentId = options.studentId
    this.setData({
      activityId: options.id,
      role: wx.getStorageSync("role"),
      end: options.end,
      sel: this.data.categrory,
      standardId: standardId,
      studentId: studentId
    });
    this.getActivityDetail();
    this.getCategrory();
    wx.showShareMenu({
      success(res) {
        console.log(res)
      }
    })
  },

  onShareAppMessage: function(obj) {
    return {
      title: '松鼠趣帮',
      path: '/pages/index/index'
    }
  },

  getSignState() {
    http.post(api.signStateAPI, {
      activityId: activityId
    }).then(res => {
      if (res.data.datetime != null && res.data.datetime.length > 0) {
        this.setData({
          signState: true
        })
      } else {
        this.setData({
          signState: false
        })
      }
    }).catch(msg => {})
  },

  // 获取是否参加
  getJoinStatus() {
    var that = this;
    http.post(api.activityUserIsJoinAPI, {
      activityId: activityId
    }).then(res => {
      that.setData({
        isDisabled: !res.data.isJoin
      });
    });
  },

  //签到
  signIn: function() {
    let data = {
      activityId: activityId,
      standardId: this.data.standardId,
      studentId:this.data.studentId
    
    }
    http.post(api.signAPI, data).then(res => {
      console.log(res)
      if (res.success) {
        wx.showToast({
          title: res.data,
        })
        setTimeout(function() {
          wx.reLaunch({
            url: '/pages/personal/apply/apply'
          })
        }, 1200)
      }
    }).catch(msg => {
      console.error(msg)
    })
  },

  //拨打电话
  phoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '',
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  /* *************************************************************** */

  // toMember: function () {
  //   wx.navigateTo({
  //     url: "/pages/activity/member/member?activityid=" + activityId + "&activityState=" + this.data.detail.activityState
  //   });
  // },

});