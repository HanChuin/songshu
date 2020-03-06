// pages/clock/clock.js
const http = require("../../utils/http.js");
const api = require("../../utils/api.js");
var WxParse = require('../../libs/wxParse/wxParse.js');
var activityId = 0 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    fromW:'',
    clockPoint:10,
    btnStr:'立即打卡',
    fromShare:false,
    productSrc: '',//下载图片
    codeSrc: '',//下载二维码
    // 公益打卡
    clock: [{
      id: 1,
      day: '1天',
      point: 5,
      clocked: false
    },
    {
      id: 2,
      day: '2天',
      point: 10,
      clocked: false
    },
    {
      id: 3,
      day: '3天',
      point: 15,
      clocked: false
    },
    {
      id: 4,
      day: '4天',
      point: 20,
      clocked: false
    },
    {
      id: 5,
      day: '5天',
      point: 25,
      clocked: false
    },
    {
      id: 6,
      day: '6天',
      point: 30,
      clocked: false
    },
    {
      id: 7,
      day: '7天',
      point: 35,
      clocked: false
    }
    ],
    clockday: 0,
    clockimg: 'https://url.songshuqubang.com/micsoft/img/clock.png',
    clockimgActive: 'https://url.songshuqubang.com/micsoft/img/clock_active.png',
    count: ''
  },

  /**************************** 获取数据 ****************************/
  
  // 获取打卡详情
  getClockDetail() {
    http.post(api.signOneDayDetailAPI, { activityId: 1}).then(res => {
      console.log( 'getClockDetail' , res.data)
      let detail = res.data
      this.setData({
        detail,
        count: '累计参与：' + detail.count + '人'
      })
      if (detail){
        WxParse.wxParse('signDetail', 'html', detail.detail, this, 0);
      }
      this.downloadImg()
    })
  },

  /**
  * 获取个人打卡记录
  */
  getUserSignDetail: function () {
    http.post(api.signUserDetailAPI, {
      activityId: 1
    }).then(res => {
      console.log('getUserSignDetail', res)
      let days = res.data.signTimes
      if (days == 7) {
        this.setData({
          btnStr:'打卡完成'
        })
      }
      this.setData({
        clockday: days
      })
      const list = this.data.clock
      let day = this.data.clockday
      for (let i = 0; i < day; i++) {
        list[i].clocked = true
      }
      this.setData({
        clock: list,
        clockPoint: 5 * (days -1 ) + 10
      })

    }).catch(msg => {
      console.error(msg)
    });
  },

  /* ********************* 页面跳转 ********************* */

  /* 回首页 */
  goToHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /* ********************* 事件监听 ********************* */

  //打卡
  clockIn() {
    let that = this
    let signDate = this.getNowFormatDate()
    let token = wx.getStorageSync("token")
    if (token == '') {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    http.post(api.signOneDayAPI, { signDate, activityId: 1 }).then(res => {
      wx.showToast({
        title: '打卡成功',
      })
    }).catch(msg => {
      console.log(msg.data.msg)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityId = options.id || 1;
    let fromW = options.from
    console.log(fromW)
    if (options.scene) {
      this.setData({
        fromShare: true
      })
      console.log(this.data.fromShare)
    }
    this.setData({ fromW })
    this.getClockDetail()
    let token = wx.getStorageSync("token")
    if (token !== ''){
      this.getUserSignDetail()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      imageUrl: this.data.detail.conver,
      title: this.data.detail.name,
      path: '/pages/clock/clock?id=' + this.activityId,
      success: function (res) {
      },
      fail: function (res) {
      },
    }
  },

  /* 海报 */
  /* 下载图片 */
  downloadImg() {
    let that = this
    let imgUrl = "https://url.songshuqubang.com/image/activity/543d.png"
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({ productSrc })
            that.getQrcodeAPI()
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none'
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
    let scene = "from=share"
    http.post(api.getQrcodeAPI, {
      scene,
      path: 'pages/clock/clock?id=' + this.activityId,
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
              if (that.data.fromW == 'index') {
                that.getSharePoster()
              }
            } else {
              that.setData({ codeSrc: '' })
              wx.showToast({
                title: '二维码下载失败',
                icon: 'none'
              })
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
})