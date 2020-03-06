// pages/changeHead/changeHead.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const qiniuUploader = require("../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    head:'',
    phone:'',

    headUrl:'',
    tab:0
  },

  // 获取页面数据
  getSysUserInfo() {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        self.setData({
          name: res.data.userName,
          head: res.data.headImg,
          phone: res.data.phone
        })
        console.log(self.data)
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 跳转绑定手机号
  bdphone(){
    wx.navigateTo({
      url: '/pages/bindphone/bindphone',
    })
  },

  // 修改头像
  fixHead(){
    let that = this;
    let fileName = parseInt(new Date().getTime() / 1000) + '';
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        qiniuUploader.upload(filePath, res => {
          that.setData({
            head: '' + qiniuImgUrl + res.imageURL,
          });
          http.post(api.editUserAPIs, { headImg: that.data.head }).then(res => {
            console.log(res)
          })

        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: '',
          key: 'image/head/' + fileName + '.jpg',
          uptoken: that.data.uploadToken,
        });

        

      }
    });
  },
  getQiniuToken: function () {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      this.setData({
        uploadToken: res.data
      })
    }).catch(msg => {
    })
  },

  // 修改昵称
  tofixName(){
    this.setData({
      tab:1
    })
  },

  // 修改昵称 完成
  fixName(e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },

  // 修改完成
  finish() {
    http.post(api.editUserAPIs, { userName: this.data.name }).then(res => {
      console.log(res)
    })
    this.setData({
      tab: 0
    })
  },

  // 退出登录
  logoutAction: function () {
    wx.showModal({
      title: '确认退出吗?',
      content: '',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'token',
            success: function (res) {
              app.editTabbar();
              wx.showToast({
                title: '退出成功',
                duration: 2000
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/timeLine/timeLine',
                })
              }, 1000)
            },
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSysUserInfo()
    this.getQiniuToken()
  },
  
})