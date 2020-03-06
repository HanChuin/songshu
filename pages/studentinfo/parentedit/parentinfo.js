
const http = require('../../../utils/http.js');
const api = require('../../../utils/api.js')
const qiniuUploader = require("../../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    isedit: true,
    uploadToken: '',
    headUrl: '',//头像地址
    card1Url:'',
    card2Url:'',
    name: '',//姓名
    idcard: '',//身份证
    sex: '男',
    sexCode: 1,
    sexArray: [{
      id: 0,
      name: '女'
    },
    {
      id: 1,
      name: '男'
    }],
    optionStr: '保存修改' , //add 0 edit 1
    phone:'', //联系电话
    country: '中国', // 国籍
    email: '',//
    countryArray: ['中国', '美国', '韩国', '加拿大'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    if (options.id) {
      this.setData({ id: options.id })
      this.getParentDetail();
    }

    if (options.type == 'add') {  
      this.setData({ optionStr: '新增', isedit: true })
    } else {
      this.setData({ optionStr: '保存修改' })
    }
    this.getQiniuToken();
  },

  getParentDetail:function() {
    http.post(api.getUserParentDetailUrl , {id:this.data.id}).then(res => {
      let info = res.data;
      console.log(info.sex)
      let sex = ''
      if(info.sex == 0){
        sex = '女'
      } else if(info.sex == 1){
        sex = '男'
      }
      this.setData({
        sex,
          name: info.name,
          phone: info.phone,
          idcard: info.idNo,
          card1Url: info.frontImg,
          card2Url: info.backImg,
          headUrl: info.headImg,
          email: info.email,
          country: info.country
      })

    }).catch(msg => {
      console.error(msg)
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

  bindSexChange: function (e) {
    let index = e.detail.value;
    let va = this.data.sexArray[index].name;
    let co = this.data.sexArray[index].id
    this.setData({
      sex: va,
      sexCode: co,
      isedit: true,
    });
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
            headUrl: '' + qiniuImgUrl + res.imageURL,
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

  idCardInput: function (e) {
    this.setData({
      idcard: e.detail.value,
      isedit: true
    })
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
      isedit: true
    })
  },
  
  saveInfoAction:function() {
    let url = '';

    if (this.data.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      });
      return;
    }
 
    if (this.data.phone == '') {
      wx.showToast({
        title: '手机号码为空',
        icon: 'none'
      });
      return;
    }

    if (this.data.idcard == '') {
      wx.showToast({
        title: '身份证不能为空',
        icon: 'none'
      });
      return;
    } else if (this.data.idcard.length != 18) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'warn'
      });
      return;
    }

    if (this.data.email == '') {
      wx.showToast({
        title: '邮箱为空',
        icon: 'none'
      });
      return;
    }

  
    let params = {
      name: this.data.name,
      headImg: this.data.headUrl,
      idNo: this.data.idcard,
      details:'',
      frontImg: this.data.card1Url,
      backImg: this.data.card2Url,
      sex: this.data.sexCode ,
      phone: this.data.phone,
      email: this.data.email,
      country: this.data.country 
    }
    if (this.data.id == 0 ) {
      url = api.addUserParentUrl;
    } else {
      url = api.saveUserParentUrl;
      params.id = this.data.id
    }
    http.post(url, params).then(res => {
      if (this.data.id == 0) {
        wx.showToast({
          title: '新增成功',
        })
      } else {
        wx.showToast({
          title: '修改成功',
        })
      }
      wx.navigateBack({})
    }).catch(msg => {
      
    });
  },

  delInfoDialog: function () {
    let that = this
    wx.showModal({
      title: '提醒',
      content: '确定删除该记录吗？',
      confirmText: '删除',
      confirmColor: '#f00',
      success(res) {
        if (res.confirm) {
          console.log('true')
          that.delInfoAction();
        } else {
          console.log('err')
        }
      }
    })
  },

  delInfoAction: function () {
    http.post(api.delUserParentUrl, { id: this.data.id }).then(res => {
      wx.showToast({
        title: '删除成功',
      })
      wx.navigateBack({});
    }).catch(msg => {
      console.error(msg)
    })
  },

  changeCard1Action:function() {
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
            card1Url : '' + qiniuImgUrl + res.imageURL,
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

  changeCard2Action:function() {
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
            card2Url: '' + qiniuImgUrl + res.imageURL,
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


  phoneInput:function(e) {
    this.setData({
      phone: e.detail.value,
      isedit: true
    });
  },

  inputEmail:function(e){
    this.setData({
      email: e.detail.value,
      isedit: true
    });
  },


  bindCountryChange:function(e){
    this.setData({
      country: this.data.countryArray[e.detail.value],
      isedit: true
    })
  }

})