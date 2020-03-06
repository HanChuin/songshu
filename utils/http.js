// const baseUrl = "http://192.168.31.197:7002"
// const baseUrl = "http://192.168.31.18:7001"
const baseUrl = "https://ssqbapi.tianyihui1688.com"/*正式机器*/
// const baseUrl = "https://wxapi.songshuqubang.com"; //松鼠域名接口
// const baseUrl = "http://127.0.0.1:7001"; //本地
const app = getApp()
const api = require('./api.js')

function wxLogin(name, headurl, openId, unionId ) {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        console.log('wxlogin')
        console.log(res)
        http({
          url: api.getOpenIdAPI,
          data: { code: res.code },
          method: 'post'
        }).then(res => {
          console.log('getopenid',res)
          app.globalData.openId = res.data.openid
          http({
            url: api.wxLoginAPI,
            data: { openId: res.data.openid, name, headurl, openId, unionId },
            method: 'post'
          }).then(res => {
            console.log('login',res)
            let token = res.data.token
            if (token == '') {
              wx.showToast({
                title: '微信授权成功,请绑定手机号码',
                duration: 1200,
                icon: 'none'
              })
              reject();
            } else {
              wx.setStorageSync('token', res.data.token)
              resolve(res)
            }
          })
        })
      },
      fail: function (err) {
        console.log(err)
        // wx.hideLoading()
      }
    })
  })
}

function login(url, data) {
  return new Promise((resolve, reject) => {
      let userInfo = wx.getStorageSync('userInfo')
      let userData = {
        wxname: userInfo.nickName,
        photo: userInfo.avatarUrl
      }
      http({
        url: url,
        data: Object.assign(data, userData),
        method: 'post'
      }).then(res => {
        console.log(res)      
        if (res.success) {
          wx.setStorage({
            key: 'token',
            data: res.data.token,
            success: () => {
              resolve(res)
            }
          })
        } else {
          reject(res)
        }
      }).catch(error => {
        console.log(res)
        reject(error)
      })
  })
}

const http = ({ url = '', data = {}, method='' } = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      header: getHeader(),
      data: data,
      method: method,
      complete: function(res) {
        // console.log(res)
      },
      success: function (res) {
        // console.log(res)
        if (res.data.success) {
          resolve(res.data)
        } else if (res.statusCode == 401) {
          // wx.showModal({
          //   title: '警告',
          //   content: '没有授权部分功能将无法正常使用',
          //   showCancel: true,
          //   cancelText: '取消',
          //   cancelColor: '#f00',
          //   confirmText: '去授权',
          //   success: function (res) {
          //     if (res.confirm) {
          //       wx.openSetting();
          //     }
          //   }
          // })
        } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true,
              duration: 2000
            })
            reject(res)
        }
      },

      fail: function ({ errMsg }) {
        wx.showToast({
          title: '网络异常',
          icon: 'error',
          mask: true,
          duration: 2000
        })
      }
    })
  })
}

const getUrl = url => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url
    // console.log(url)
  }
  return url
}

const getHeader = () => {
  let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  try {
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      headers.Authorization = "Bearer " + token      
      return headers
    }
    return headers
  } catch(e) {
    return {}
  }
}

module.exports = {
  get(url, data = {}) {
    return http({
      method:'get',
      url,
      data
    })
  },
  post(url, data = {}, method = 'post') {
    return http({
      url,
      data,
      method
    })
  },
  login: login,
  wxLogin: wxLogin
}