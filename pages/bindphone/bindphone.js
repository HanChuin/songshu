// pages/login/login.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const md5 = require('../../utils/md5.js')

let sendClockL = undefined;
let sendClockR = undefined;
let globalData = app.globalData;
var phoneInfo;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    time: 60,
    canSendR: true,
    sendTimeL: 60, // 发送验证码倒计时（login)
    sendTimeR: 60, // 发送验证码倒计时（register)
    agreeRule: false, //是否同意服务条款

    /* 绑定数据 */
    registerData: {
      phone: '',
      yzm: '',
      password: ''
    },
    phoneType: '', //从登录或注册获取手机号
    phoneNum: '', //手机号临时存储

    wxUserInfo: []
  },

  /*************************** 生命周期函数 ***************************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  /***************************** 其他调用 *****************************/

  /* 发送验证码60s 倒计时 */
  renderTimeR: function () {
    let self = this;
    let seconds = self.data.sendTimeR;
    self.setData({
      sendTimeR: seconds - 1
    })
    if (this.data.sendTimeR == 0) {
      self.setData({
        canSendR: true
      })
      clearInterval(sendClockR)
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

  // 获取openId
  getOpenId: function (code) {
    let self = this;
    http.post(api.getOpenIdAPI, {
      code
    }).then(res => {
      console.log('res.data.session_key', res.data.session_key)
      this.getPhoneNum(res.data.session_key)
    }).catch(msg => {
      console.error(msg)
    })
  },

  /* 获取设置手机号 */
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
        that.setData({
          ['registerData.phone']: number
        })
      console.log(this.data.registerData.phone)
    }).catch(msg => {
      console.error(msg)
    })
  },

  /******************************* 注册 *******************************/

  /* 注册状态 input事件 保存手机号到data */
  phoneInp(e) {
    this.setData({
      ['registerData.phone']: e.detail.value
    })
  },

  /* 注册状态 验证码input事件 保存验证码到data */
  yzmInp: function (e) {
    this.setData({
      ['registerData.yzm']: e.detail.value
    })
  },

  /* 注册状态 密码input事件 保存密码到data */
  passwordInpR: function (e) {
    this.setData({
      ['registerData.password']: e.detail.value
    })
  },

  /* 注册状态发送验证码 */
  sendCode: function () {
    this.setData({
      sendTimeR: 60
    })
    let self = this;
    let data = {
      phone: this.data.registerData.phone,
      type: 'register'
    }
    if (this.data.registerData.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (this.data.registerData.phone.length == 11) {
      http.post(api.loginAPI, {}).then(res => console.log(res))
      http.post(api.getCodeAPI, data).then(res => {
        console.log(res)
        if (res.success) {
          wx.showToast({
            title: '短信发送成功!',
          });
          self.setData({
            canSendR: false
          })
          sendClockR = setInterval(function () {
            self.renderTimeR()
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
  },

  /* 是否同意 服务条款 */
  aggreeRules: function () {
    this.setData({
      agreeRule: !this.data.agreeRule
    })
    console.log(this.data.agreeRule)
  },

  /* 服务条款 跳转页面registinfo */
  tocatAction: function () {
    wx.navigateTo({
      url: '/pages/registinfo/registinfo',
    });
  },

  /* 注册按钮 点击注册 */
  toRegister: function () {
    let userInfo = app.globalData.userInfo;
    console.log(this.data.shareCode)
    let data = {
      phone: this.data.registerData.phone,
      code: this.data.registerData.yzm,
      openId: globalData.openId,
      wxname: userInfo == undefined ? '' : userInfo.nickName,
      photo: userInfo == undefined ? '' : userInfo.avatarUrl,
      password: md5.hexMD5(this.data.registerData.password),
      inviteCode: this.data.shareCode
    }
    console.log('params', data)
    if (this.data.registerData.phone == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    }

    if (this.data.registerData.phone.length != 11) {
      wx.showToast({
        title: '请填写正确的手机号!',
        icon: 'none'
      })
      return
    }

    if (this.data.registerData.yzm == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return
    }

    if (this.data.registerData.password == '') {
      wx.showToast({
        title: '请填写密码',
        icon: 'none'
      })
      return
    }

    if (this.data.agreeRule === true) {
      http.post(api.registerAPI, data).then(res => {
        console.log(res)
        if (res.success) {
          wx.showToast({
            title: '绑定成功!'
          })
          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })
          console.log('token', res.data.token);
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
            console.log('跳转成功')
          }, 1500)
        } else {
          wx.showToast({
            title: '绑定失败',
            icon: 'none'
          })
        }
      }).catch(msg => {
        console.error(msg)
      })
    } else {
      wx.showToast({
        title: '请先同意服务条款',
        icon: 'none'
      })
    }
  },

})