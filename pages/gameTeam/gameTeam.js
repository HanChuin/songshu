const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

let type1Index = 0;
let type2Index = 0;
let type3Index = 0;

let userName = ''
let userPhone = ''
let id = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topopacity: 1, //顶部透明度
    type1Array: [{
      key: '个人参赛',
      value: 1
    }, {
      key: '团队参赛',
      value: 2
    }],
    type2Array: [{
      key: '小学组'
    }, {
      key: '初中组'
    }, {
      key: '高中组'
    }],
    type3Array: [{
      url: 'https://url.songshuqubang.com/image/wyds/cover/z2_meitu_2.png',
      name: '写作组',
    }, {
      url: 'https://url.songshuqubang.com/image/wyds/cover/z3_meitu_3.png',
      name: '弹奏组'
    }, {
      url: 'https://url.songshuqubang.com/image/wyds/cover/z4_meitu_4.png',
      name: '唱跳组',
    }, {
      url: 'https://url.songshuqubang.com/image/wyds/cover/z5_meitu_5.png',
      name: '表演组'
    }],
    type3Index: 0,
    nameFocus: false,
    schoolFocus: false,
    classFocus: false,
    phoneFocus: false,
    type1Index: 1,
    type2Index: 0,
    userName: '',
    userPhone: '',
    classData: [
      ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    ],
    classIndex: 0,
    state: 0,
    classStr:'班级',
    school: '学校'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSchoolList();
    id = options.id
  },

  onPageScroll: function (e) {
    if (e.scrollTop < 90) {
      this.setData({
        topopacity: parseFloat((90 - e.scrollTop) / 90).toFixed(2)
      })
    } else {
      this.setData({
        topopacity: 0
      })
    }
  },

  _confirmType1Event: function (e) {
    console.log('_confirmType1Event', e.detail)
    type1Index = e.detail;
  },

  _confirmType2Event: function (e) {
    console.log('_confirmType2Event', e.detail)
    type2Index = e.detail;
  },

  _confirmType3Event: function (e) {
    console.log('_confirmType3Event', e);
    type3Index = e.detail.current
    this.setData({
      type3Index: e.detail.current
    })
  },

  nameFocus: function (e) {
    console.log(e)
    this.setData({
      nameFocus: true
    })
  },

  nameBlur: function (e) {
    this.setData({
      nameFocus: false
    })
  },

  schoolBlur: function () {
    this.setData({
      schoolFocus: false
    })
  },

  schoolFocus: function () {
    this.setData({
      schoolFocus: true
    });
    // 跳转选择

  },

  classBlur: function () {
    this.setData({
      classFocus: false
    })
  },

  classFocus: function () {
    this.setData({
      classFocus: true
    })
  },

  phoneBlur: function () {
    this.setData({
      phoneFocus: false
    })
  },

  phoneFocus: function () {
    this.setData({
      phoneFocus: true
    })
  },

  getSchoolList: function () {
    http.post(api.getSchooldListUrl, {}).then(res => {
      this.setData({
        schoolData: res.data
      })
    }).catch(msg => { })
  },

  bindSchoolChange: function (e) {
    let index = e.detail.value;
    this.setData({
      school: this.data.schoolData[index].name,
      schoolId: this.data.schoolData[index].id
    });
  },

  bindClassChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let selectClasses = e.detail.value
    let class1 = selectClasses[0]
    let class2 = selectClasses[1]
    let class1Str = this.data.classData[0][class1]
    let class2Str = this.data.classData[1][class2]
    this.setData({
      classIndex: e.detail.value,
      classStr: class1Str + '-' + class2Str + '班'
    })
  },

  joinMatch: function () { 
    let params = {
      id: id,
      name: userName, // 用户名称
      school: this.data.school, // 学校
      class: this.data.classStr, // 班级
      tel: userPhone, // 电话
    }
    http.post(api.addTeamApi , params).then(res => {
      console.log(res)
    }).catch(msg => {
      console.error(msg)
    });
  },

  changeName: function (e) {
    userName = e.detail.value;
  },

  changePhone: function (e) {
    userPhone = e.detail.value;
  }
})