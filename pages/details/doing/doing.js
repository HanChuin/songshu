// pages/details/doing.js
/* 进行中的活动详情 */
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
    typeSel: -1,
    active: "1", //tab选中
    detail: {},
    goodsList: [],
    orgDetail: {},
    commentList: [],
    memberLst: [], //活动成员
    isDisabled: true,
    maskIsShow: true, // 签到弹窗
    signBtnClick: true,
    signState: false, //签到状态
    currentSwiper: 0,
    showinfo: true, //基本信息的展示
    end: '',
    animationData: '',
    selectShow: false,
    disabled: true, //选择确认按钮
    categrory: [],
    sel: '类别',//已选择的类别
    traderNo: '',
    showVideo: false,
    codeImg:'',

    fromShare:false,

    productSrc:'',//下载图片
    codeSrc:''//下载二维码
  },


/******************************** 获取数据 ********************************/

  // 获取活动详情
  getActivityDetail: function () {
    let that = this;
    let params = {
      id: activityId
    };
    http
      .post(api.activityDetailAPI, params)
      .then(res => {
        console.log('2', res.data[0]);
        let result = res.data[0];//接口数据
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
        let btshow = ''
        switch (result.activeState) {
          case 0: state = '未开始'; btshow = '活动未开始'; break;
          case 1: state = '报名中'; btshow = '立即报名'; break;
          case 2: state = '进行中'; btshow = '立即报名'; break;
          case 3: state = '已结束'; btshow = '活动已结束'; break;
          default: state = '状态异常'; btshow = ''
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
        this.downloadImg()
        WxParse.wxParse('activityDetail', 'html', result.details, that);
      })
      .catch(msg => console.log(msg));
  },

  // 获取活动成员
  getMember: function () {
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
      .catch(msg => console.log(msg))
  },

  // 获取活动奖品列表
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
        })
      })
      .catch(msg => console.log(msg))
  },

  // 获取组织详情
  getCreateDetail: function () {
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
      .catch(msg => console.log(msg));
  },
  
  // 获取活动类别列表（全）
  getCategory() {
    http.post(api.activityCategoryListAPI, { id: activityId }).then(res => {
      this.setData({
        categrory: res.data
      })
    }).catch(msg => {
      console.log(msg)
    })
  },

  // 获取签到状态
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
    }).catch(msg => console.log(msg))
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

/********************************* 海报组件 *********************************/

  /* 下载图片 */
  downloadImg() {
    let that = this
    let imgUrl = this.data.detail.cover
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({ productSrc })
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
            that.setData({ productSrc: '' })
          }
        }
      })
    }
  },

  /* 获取二维码并下载 */
  getQrcodeAPI() {
    let that = this
    let id = this.data.activityId
    let scene = "id=" + id
    http.post(api.getQrcodeAPI, {
      scene,
      page: 'pages/details/doing/doing',
      width: "320"
    })
      .then(res => {
        let codeImg = res.data
        that.setData({ codeImg })
        /* 下载 */
        wx.downloadFile({
          url: codeImg,
          success: function (res) {
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.setData({ codeSrc })
            } else {
              that.setData({ codeSrc: '' })
            }
          }
        })
      })
  },

  /* 获取分享海报 */
  getSharePoster: function () {
    this.setData({ showVideo: false })
    this.selectComponent('#getPoster').getAvaterInfo()
  },

  /* 海报是否显示 */
  myEventListener: function (e) {
    this.setData({ showVideo: true })
  },

/******************************* 富文本组件 *******************************/

  handleClick: function () {
    this.setData({
      selectShow:true
    })
    var that = this;
    //获取类别
    http.post(api.activityCategoryListAPI, { id: activityId }).then(res => {
      this.setData({
        categrory: res.data
      })
    }).catch(msg => console.log(msg))
    //创建动画
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    })
    animation.translateY(250).step()
    that.setData({
      animationData: animation.export(),
      selectShow: !that.data.selectShow
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hiddenSelect: function () {
    let that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    setTimeout(function () {
      animation.translateY(250).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
    setTimeout(function () {
      that.setData({
        selectShow: false
      })
    }, 500)
  },
  handleSelect: function (e) {
    //选择类别
    let disabled = this.data.disabled;
    let index = e.currentTarget.dataset.index;
    let result = this.data.detail;
    let selIndex = this.data.typeSel
    if (index == selIndex) {
      selIndex = -1
      disabled = true
      result.amount = ''
    } else {
      selIndex = index
      disabled = false
      result.amount = parseInt(this.data.categrory[selIndex].amount)
    }
    this.setData({
      typeSel: selIndex,
      disabled: disabled,
      detail: result,
      sel: this.data.categrory[selIndex]
    })
    console.log(this.data.detail)
    console.log(this.data.sel || {})
  },
  confirmSel: function () {
    this.setData({
      selectShow: false
    })
  },
  showInfo: function () {
    this.setData({
      showinfo: !this.data.showinfo
    })
  },

/********************************* 页面跳转 *********************************/

  /* 回首页 */
  goToHome(){
    console.log(1)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 参加活动
  joinActivity: function () {
    let standardID = this.data.categrory[0].id
    let token = wx.getStorageSync('token')
    if (token.length == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/notice/notice?activityId=' + activityId + '&standardId=' + standardID
    })
  },

/********************************* 事件监听 *********************************/

  // 轮播
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  // 点击底bar的签到
  onBindSign: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        lat = res.latitude
        lng = res.longitude
        that.setData({
          maskIsShow: false
        })
      },
      fail: function (msg) {
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
  closeMask: function () {
    this.setData({
      maskIsShow: true
    })
  },

  // 选择签到地址
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var addr = 'maskData.getAddress'
        that.setData({
          [addr]: res.name
        })
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  // 拨打联系电话
  phoneCall: function () {
    wx.showActionSheet({
      itemList: contactStrs,
      success(res) {
        if (contacts[res.tapIndex].type == 'call') {
          wx.makePhoneCall({
            phoneNumber: contacts[res.tapIndex].value //仅为示例，并非真实的电话号码
          })
        } else if (contacts[res.tapIndex].type == 'copy') {
          wx.setClipboardData({
            data: contacts[res.tapIndex].value,
          });
          wx.showToast({
            title: '复制成功',
            icon: 'none'
          });
        }
      },
    })
  },

  // 点击确定签到
  signConfirmBtn: function () {
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
    }).catch(info => console.log(info))
  },

/********************************* 生命周期 *********************************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityId = options.id;
    if (options.scene) {
      this.setData({
        fromShare: true
      })
      console.log(this.data.fromShare)
      let scene = decodeURIComponent(options.scene)
      let i = scene.indexOf('=')
      let y = scene.substring(0, i)
      let x = scene.substr(i + 1)
      activityId = x
    } else {
      activityId = options.id;
    }
    this.setData({
      activityId: options.id,
      role: wx.getStorageSync("role"),
      end: options.end
    });
    this.getActivityDetail();
    wx.showShareMenu({
      success(res) {
        console.log(res)
      }
    });
    this.getCategory();
    this.getQrcodeAPI()
  },

  // 分享
  onShareAppMessage: function (obj) {
    return {
      imageUrl: this.data.detail.imgLst[0],
      title: this.data.detail.name,
      path: '/pages/details/doing/doing?id=' + activityId,
      success: function (res) {
      },
      fail: function (res) {
      },
    }
  },

/* ******************************************************* */
  // 退出活动
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

});