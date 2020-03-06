
const app = getApp()
const http = require('../../../utils/http.js')
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
    name: '',//姓名
    idcard: '',//身份证
    details: '',//个人说明
    sex: '男',
    sexCode: 1,
    birthday:'',//生日
    school: '学校',
    schoolId: 0,
    country:'中国', // 国籍
    email:'',//
    phone: '',
    contactperson:'',
    contactphone:'',
    sexArray: [{
      id: 0,
      name: '女'
    },
    {
      id: 1,
      name: '男'
    }],
    schoolData:[],
    countryArray:['中国','美国','韩国','加拿大'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id) {
      this.setData({ id: options.id })
      this.getStudentInfo();
    }
    this.getQiniuToken();
    this.getSchoolList();
  },

  getSchoolList: function () {
    http.post(api.getSchooldListUrl, {}).then(res => {
      console.log(res.data)
      this.setData({
        schoolData: res.data
      })
    }).catch(msg => {
    })
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

  bindSchoolChange:function(e) {
    let index = e.detail.value;
    this.setData({
      school: this.data.schoolData[index].name,
      schoolId: this.data.schoolData[index].id
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


  getStudentInfo: function () {
    http.post(api.getUserStudentDetailUrl, {id: this.data.id}).then(res => {
      console.log(res);
      if (res.success) {
        let info = res.data;
        if (info != "") {
          this.setData({
            headUrl: info.headImg,//头像地址
            name: info.name,//姓名
            birthday: info.birthday || '',//生日
            idcard: info.idNo,//身份证
            details: info.details,//个人说明
            sexCode: info.sex,
            sex: info.sex == 1 ? "男" : "女",
            school: info.school.name,
            schoolId: info.schoolId,
            id: info.id,
            email: info.email,
            contactperson: info.contactperson,
            phone: info.phone,
            contactphone: info.contactphone
          });
        } 
       
      }
    }).catch(msg => {
      console.error(msg)
    })
  },

  idCardInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      idcard: e.detail.value
    })
  },

  nameInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },

  instructInp: function (e) {
    console.log(e.detail.value);
    this.setData({
      details: e.detail.value
    })
  },


  delInfoDialog:function() {
    let that = this
    wx.showModal({
      title: '提醒',
      content: '确定删除该记录吗？',
      confirmText:'删除',
      confirmColor:'#f00',
      success(res) {
        if (res.confirm){
          console.log('true')
          that.delInfoAction();
        } else {
          console.log('err')
        }
      }
    })
  },

  delInfoAction: function() {
    http.post(api.delUserStudentUrl , {id:this.data.id}).then(res => {
      wx.showToast({
        title: '删除成功',
      })
      wx.navigateBack({});
    }).catch(msg => {
      console.error(msg)
    })
  },


  bindBirthChange:function(e) {
    console.log(e.detail.value)
    this.setData({ birthday: e.detail.value});
  },

  /**
   * 修改国籍
   */
  bindCountryChange:function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      country: this.data.countryArray[e.detail.value]
    })
  },





  saveInfoAction: function () {
    if (this.data.name == '') {
      wx.showToast({
        title: '学生姓名不能为空',
        icon: 'none'
      });
      return;
    }
    if (this.data.school == '学校') {
      wx.showToast({
        title: '您还未选择学校',
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

    if (this.data.phone == '') {
      wx.showToast({
        title: '手机号码为空',
        icon: 'none'
      });
      return;
    }

    if (this.data.contactperson == '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none'
      });
      return;
    }

    if (this.data.contactphone == '') {
      wx.showToast({
        title: '联系电话为空',
        icon: 'none'
      });
      return;
    }

    let params = {
      name: this.data.name,
      idNo: this.data.idcard,
      headImg: this.data.headUrl,
      schoolId: this.data.schoolId,
      details: this.data.details,
      sex: this.data.sexCode,
      group: 0,
      birthday: this.data.birthday,
      country: this.data.country,
      email: this.data.email,
      phone: this.data.phone,
      contactperson: this.data.contactperson,
      contactphone: this.data.contactphone,
    }

    if (this.data.id > 0) {
      // update
      params.id = this.data.id;
      http.post(api.updateStudentInfoUrl, params).then(res => {
        console.log(res)
        wx.showToast({
          title: '修改成功',
        });
        wx.navigateBack({});
      }).catch(msg => {
        console.log(msg)
      });
    } else {
      // xinzeng
      http.post(api.addStudentInfoUrl, params).then(res => {
        console.log(res)
        wx.showToast({
          title: '添加成功',
        });
        wx.navigateBack({});
      }).catch(msg => {
        console.log(msg)
      });
    }
  },


  inputContactPerson:function(e) {
    this.setData({
      contactperson: e.detail.value,
      isedit: true,
    })
  },


  inputContactPhone:function(e){
    this.setData({
      contactphone: e.detail.value,
      isedit: true,
    })
  },

  inputPhone:function(e) {
    this.setData({
      phone: e.detail.value,
      isedit: true,
    })
  },

  inputEmail:function(e){
    this.setData({
      email: e.detail.value,
      isedit: true,
    })
  }
})