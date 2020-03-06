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
    loginFlag: false, //登录方式,true为密码登录,false为短信登录
    canSendL: true,
    canSendR: true,
    sendTimeL: 60, // 发送验证码倒计时（login)
    sendTimeR: 60, // 发送验证码倒计时（register)
    loginORregister: true, //tab切换login或register
    agreeRule: false, //是否同意服务条款
    isBind: false,
    /* 登录数据 */
    loginData: {
      mobile: '',
      password: '',
      msg: '',
      phone: ''
    },

    /* 注册数据 */
    registerData: {
      phone: '',
      yzm: '',
      password: ''
    },
    phoneType:'', //从登录或注册获取手机号
    phoneNum:'', //手机号临时存储

    wxUserInfo:[]
  },

/*************************** 生命周期函数 ***************************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    if (options.from){
      this.setData({
        fromW: options.from,
      })
    }
    this.setData({
      shareCode: options.shareCode || ''
    })

    wx.setStorageSync('role', 2)
    let title = options.title
    if (title == 'regist') {
      this.setData({
        loginORregister: false
      })
    }
    if (title == 'bdphone'){
      this.setData({
        loginORregister: false,
        isBind:true
      })
    }
  },


/***************************** 其他调用 *****************************/

  /* 发送验证码60s 倒计时 */
  renderTimeL: function() {
    let self = this;
    let seconds = self.data.sendTimeL;
    self.setData({
      sendTimeL: seconds - 1
    })
    if (this.data.sendTimeL == 0) {
      self.setData({
        canSendL: true
      })
      clearInterval(sendClockL)
    }
  },
  renderTimeR: function() {
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

  getOpenId: function(code) {
    let self = this;
    http.post(api.getOpenIdAPI, {
      code
    }).then(res => {
      console.log('res.data.session_key',res.data.session_key)
      this.getPhoneNum(res.data.session_key)
    }).catch(msg => {
      console.error(msg)
    })
  },

  getPhoneNum: function(session_key) {
    console.log(this.data.phoneType)
    let that = this
    http.post(api.decyDataAPI, {
      sessionKey: session_key,
      encryptedData: phoneInfo.encryptedData,
      iv: phoneInfo.iv
    }).then(res => {
      // console.log(res.data.phoneNumber)
      let number = res.data.phoneNumber
      let type = that.data.phoneType
      if (type == 'login'){
        that.setData({
          ['loginData.mobile']: number
        })
      }
      if(type == 'reg'){
        that.setData({
          ['registerData.phone']: number
        })
      }
      // console.log(this.data.registerData.phone)
    }).catch(msg => {
      console.error(msg)
    })
  },

/************************** 登录和注册切换 **************************/

  /* 登录和注册切换 */
  tabLogin() {
    this.setData({
      loginORregister: true
    })
  },
  tabRegister() {
    this.setData({
      loginORregister: false
    })
  },

/******************************* 登录 *******************************/
  /* 登录状态 input事件 保存手机号到data */
  mobileInp: function(e) {
    this.setData({
      ['loginData.mobile']: e.detail.value
    })
  },

  /* 切换登录方式 密码登录/验证码登录 */
  changeLoginWay: function() {
    this.setData({
      loginFlag: !this.data.loginFlag,
      ['loginData.password']: '',
      ['loginData.msg']: ''
    })
  },

  /* 登录状态 密码input事件 保存密码到data */
  passwordInp: function(e) {
    this.setData({
      ['loginData.password']: e.detail.value,
    })
  },

  /* 登录状态忘记密码 */
  forgetPwdAction: function() {
    wx.navigateTo({
      url: '/pages/personal/forget/forget',
    })
  },

  /* 登录状态发送验证码 */
  sendMes: function() {
    this.setData({
      sendTimeL: 60
    })
    let self = this;
    let data = {
      phone: self.data.loginData.mobile,
      type: 'login'
    }
    // console.log(data.phone)
    if (data.phone) {
      http.post(api.getCodeAPI, data).then(res => {
        console.log('res', res)
        if (res.success) {
          wx.showToast({
            title: '短信发送成功!',
          });
          self.setData({
            canSendL: false
          })
          sendClockL = setInterval(function() {
            self.renderTimeL()
          }, 1000)
        }
      }).catch(msg => {
        console.error(msg)
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    }

  },

  /* 登录状态 验证码input事件 保存验证码到data */
  msgInp: function(e) {
    this.setData({
      ['loginData.msg']: e.detail.value
    })
  },

  /* 登录按钮点击登录 */
  toLogin: function() {
    let that=this
    let data = {
      phone: this.data.loginData.mobile,
      password: md5.hexMD5(this.data.loginData.password),
      code: this.data.loginData.msg
    }
    if (this.data.loginData.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (this.data.loginData.mobile.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none'
      })
      return
    }
    if (this.data.loginFlag) {
      //登录方式为密码登录
      if (this.data.loginData.password == '') {
        wx.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return
      }
      http.post(api.loginAPI, data).then(res => {
        if (res.data.token.length < 1 || res.data.token == undefined) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        wx.setStorageSync('token', res.data.token)
        setTimeout(function () {
          if (that.data.fromW) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else {
            wx.navigateBack({
            });
          }

        }, 800)
      }).catch(msg => {
        console.log(msg)
      })
    } else {
      //验证码登录
      if (this.data.loginData.msg == '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      http.post(api.loginAPI, data).then(res => {
        if (res.data.token.length < 1 || res.data.token == undefined) {
          wx.showToast({
            title: res.data.loginData.msg,
            icon: 'none'
          })
          return
        }
        setTimeout(function () {
          wx.setStorageSync('token', res.data.token)
          if (that.data.fromW) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else {
            wx.navigateBack({
            });
          }
        }, 800)
      }).catch(msg => {
        wx.showToast({
          title: msg.data.msg.msg,
          icon: 'none'
        })
      })
    }
  },

  /* 微信一键登录 获取用户信息 调用wx.login */
  getUserInfoCallback: function(e) {
    var self = this;
    this.setData({
      'wxUserInfo.name': e.detail.userInfo.nickName,
      'wxUserInfo.head': e.detail.userInfo.avatarUrl,
    })
    wx.showLoading({
      title: '正在登录',
    });

    wx.login({
      success(res) {
        let code = res.code
        http.post(api.getOpenIdAPI, {code}).then(res => {
          app.globalData.userInfo = e.detail.userInfo
          let name = self.data.wxUserInfo.name
          let head = self.data.wxUserInfo.head
          http.wxLogin(name, head, res.data.openid, res.data.unionid).then(res => {
            // console.log(res)
            app.globalData.token = res.token
            if (res.success) {
              wx.hideLoading();
              if (self.data.fromW) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else {
                wx.navigateBack({
                });
              }
            }
          }).catch(msg => {
            this.setData({ loginORregister: false })
          })
        })
      }
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
  yzmInp: function(e) {
    this.setData({
      ['registerData.yzm']: e.detail.value
    })
  },

  /* 注册状态 密码input事件 保存密码到data */
  passwordInpR: function(e) {
    this.setData({
      ['registerData.password']: e.detail.value
    })
  },

  /* 注册状态发送验证码 */
  sendCode: function() {
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
    if (this.data.registerData.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    } 
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
  },

  /* 是否同意 服务条款 */
  aggreeRules: function() {
    this.setData({
      agreeRule: !this.data.agreeRule
    })
    // console.log(this.data.agreeRule)
  },

  /* 服务条款 跳转页面registinfo */
  tocatAction: function() {
    wx.navigateTo({
      url: '/pages/registinfo/registinfo',
    });
  },

  /* 注册按钮 点击注册 */
  toRegister: function() {
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
          if (this.data.isBind) {
            wx.showToast({
              title: '绑定成功!'
            })
          } else {
            wx.showToast({
              title: '注册成功!'
            })
          }
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
            title: '注册/绑定失败',
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