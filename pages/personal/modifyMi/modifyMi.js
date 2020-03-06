// pages/personal/modifyMi/modifyMi.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
const md5util = require('../../../utils/md5.js')

let sendClock = undefined;
let globalData = app.globalData;
var phoneInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    yzm: '',
    password: '',
    canSend: true,
    sendTime: 60,
    phoneType: '', //从登录或注册获取手机号
    phoneNum: '', //手机号临时存储
  },

  mobileInp: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  yzmInp: function (e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  passwordInp: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData)
  },

  
  //发送短信
  sendCode: function () {
    this.setData({
      sendTime: 60
    })
    let self = this;
    let data = {
      phone: this.data.phone,
      type: 'psw',
    }
    if (this.data.phone != '') {
      if (this.data.phone.length == 11) {
        http.post(api.getCodeAPI, data).then(res => {
          if (res.success) {
            wx.showToast({
              title: '短信发送成功!',
            });
            self.setData({
              canSend: false
            })
            sendClock = setInterval(function () {
              self.renderTime()
            }, 1000)
          }
        }).catch(msg => {
          console.log(msg)
        })
      } else {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
  },

  renderTime: function () {
    let self = this;
    let seconds = self.data.sendTime;
    self.setData({
      sendTime: seconds - 1
    })
    if (this.data.sendTime == 0) {
      self.setData({
        canSend: true
      })
      clearInterval(sendClock)
    }
  },

  //提交密码事件
  toRegister: function () {
    let userInfo = app.globalData.userInfo;
    let data = {
      phone: this.data.phone,
      code: this.data.yzm,
      password: md5util.hexMD5(this.data.password)
    }
    console.log('params', data)
    if (this.data.phone != '') {
      if (this.data.phone.length == 11) {
        if (this.data.yzm != '') {
          if (this.data.password != '') {
            http.post(api.changePSWAPI, data).then(res => {
                console.log(res)
                if (res.success) {
                  wx.showToast({
                    title: '修改成功!'
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/personal/worker/worker',
                    })
                    console.log('跳转成功')
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '提交失败',
                    icon: 'none'
                  })
                }
              }).catch(msg => {
                wx.showToast({
                  title: '验证码错误',
                  icon: 'none'
                })
                console.log(msg)
              })
          } else {
            wx.showToast({
              title: '请填写密码',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请填写验证码',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '请填写正确的手机号!',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
    }
  },

  /* 获取手机号 */
  getPhoneNumber(e) {

    let self = this
    let type = e.currentTarget.dataset.type
    this.setData({
      phoneType: type
    })

    phoneInfo = e.detail;

    console.log(phoneInfo)

    wx.login({
      success(res) {
        self.getOpenId(res.code)
      }
    })
  },
  getOpenId: function (code) {
    let self = this;
    http.post(api.getOpenIdAPI, {
      code
    }).then(res => {
      console.log(res.data.session_key)
      this.getPhoneNum(res.data.session_key)
    }).catch(msg => {
      console.log(msg)
    })
  },

  getPhoneNum: function (session_key) {
    console.log(this.data.phoneType)
    let that = this
    http.post(api.decyDataAPI, {
      sessionKey: session_key,
      encryptedData: phoneInfo.encryptedData,
      iv: phoneInfo.iv
    }).then(res => {
      console.log(res.data.phoneNumber)

      let number = res.data.phoneNumber
      let type = that.data.phoneType

      this.setData({
        phone: number
      })


      console.log(this.data.phone)
    }).catch(msg => {
      console.log(msg)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  aggreeRules: function () {
    this.setData({
      agreeRule: !this.data.agreeRule
    })
    console.log(this.data.agreeRule)
  }
})