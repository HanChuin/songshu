// pages/personal/profile/profile.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
const qiniuUploader = require("../../../utils/qiniuUpload.js");
const qiniuImgUrl = 'http://ssbbimg.tianyihui1688.com/'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isedit: true,
    uploadToken: '',
    headUrl: '',//头像地址
    name: '',//姓名
    idcard: '',//身份证
    instruction: '',//个人说明
    sex:'男',
    school:'学校'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        let getData = res.data
      }).catch(msg => {

      })
    };
    this.getQiniuToken();
  },


   

  getQiniuToken: function () {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      this.setData({
        uploadToken: res.data
      })
    }).catch(msg => {

    })
  },

  changeHeadAction: function (event) {
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
            'headUrl': '' + qiniuImgUrl + res.imageURL,
          });
        }, (error) => {
          console.log('error: ' + error);
        }, {
            region: 'ECN',
            domain: '', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            key: 'image/head/' + fileName + '.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
            uptoken: that.data.uploadToken, // 由其他程序生成七牛 uptoken
          });
      }
    });
  },


  // 保存并提交审核
  submit: function () {

  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  idCardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  instructInp: function (e) {
    this.setData({
      instruction: e.detail.value
    })
  },

  saveInfoAction: function () {

  }

})