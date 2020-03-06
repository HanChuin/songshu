const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

let type1Index = 0;
let type2Index = 0;
let type3Index = -1;

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
    type3Index: -1,
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
    classStr: '班级',
    school: '学校',
    btnStr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSchoolList();
    this.getActivityDetail();
  },

  onShow: function () {
    let token = wx.getStorageSync('token')
    if (token != '') {
      http.post(api.checkMatchApi, {}).then(res => {
        console.log(res.data.state)
        if (res.success) {
          this.setData({
            state: res.data.state,
            type3Index: res.data.projectId - 1,
            type1Index: res.data.type - 1,
            type2Index: res.data.group - 1,
            userPhone: res.data.tel,
            userName: res.data.name,
            school: res.data.school,
            classStr: res.data.class
          });
          id = res.data.id
        }
      }).catch(msg => {
        console.error(msg)
      });
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  },

  // 获取学校
  getSchoolList: function () {
    http.post(api.getSchooldListUrl, {}).then(res => {
      this.setData({
        schoolData: res.data
      })
    }).catch(msg => { })
  },

  // 获取活动时间
  getActivityDetail:function() {
    let params = {
      id: 62
    };
    http
      .post(api.activityDetailAPI, params).then(res => {
        //判断活动状态
        let btnStr = ''
        let result = res.data[0]; //接口数据
        switch (result.activeState) {
          case 0:
            // state = '未开始';
            btnStr = '活动未开始';
            break;
          case 1:
            // state = '报名中';
            btnStr = '立即报名';
            break;
          case 2:
            // state = '进行中';
            btnStr = '报名结束';
            break;
          case 3:
            // state = '已结束';
            btnStr = '活动已结束';
            break;
          default:
            state = '状态异常';
            btnStr = ''
        }
        this.setData({
          btnStr
        })
      }).catch(msg => {

      });

  },

  // 监听页面滚动
  onPageScroll: function(e) {
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

  _confirmType1Event: function(e) {
    console.log('_confirmType1Event', e.detail)
    type1Index = e.detail;
  },

  _confirmType2Event: function(e) {
    console.log('_confirmType2Event', e.detail)
    type2Index = e.detail;
  },

  _confirmType3Event: function(e) {
    console.log('_confirmType3Event', e);
    type3Index = e.detail.current
    this.setData({
      type3Index: e.detail.current
    })
  },

  nameFocus: function(e) {
    console.log(e)
    this.setData({
      nameFocus: true
    })
  },

  nameBlur: function(e) {
    this.setData({
      nameFocus: false
    })
  },

  schoolBlur: function() {
    this.setData({
      schoolFocus: false
    })
  },

  schoolFocus: function() {
    this.setData({
      schoolFocus: true
    });
  },

  classBlur: function() {
    this.setData({
      classFocus: false
    })
  },

  classFocus: function() {
    this.setData({
      classFocus: true
    })
  },

  phoneBlur: function() {
    this.setData({
      phoneFocus: false
    })
  },

  phoneFocus: function() {
    this.setData({
      phoneFocus: true
    })
  },

  bindSchoolChange: function(e) {
    let index = e.detail.value;
    this.setData({
      school: this.data.schoolData[index].name,
      schoolId: this.data.schoolData[index].id
    });
  },

  bindClassChange: function(e) {
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

  joinMatch: function() {
    if (this.data.state == 1) {
      wx.redirectTo({
        url: '../game2/game2?id=' + id,
      });
    } else {
      
      if (userName == '') {
        wx.showToast({
          title: '用户名不能为空'
        })
        return
      }

      if (this.data.school == '学校') {
        wx.showToast({
          title: '学校不能为空'
        })
        return
      }

      if (this.data.classStr == '班级') {
        wx.showToast({
          title: '班级不能为空'
        })
        return
      }

      if (type3Index == -1) {
        wx.showToast({
          title: '请选择参赛项目'
        })
        return
      }

      if (userPhone == '') {
        wx.showToast({
          title: '联系电话不能为空'
        })
        return
      }


      let params = {
        projectId: type3Index + 1, // 写作 1 弹奏 2 唱跳 3 表演4
        type: type1Index + 1, // 个人1 / 团队2
        group: type2Index + 1, // 小学 1 初中2 高中 3
        name: userName, // 用户名称
        school: this.data.school, // 学校
        class: this.data.classStr, // 班级
        tel: userPhone, // 电话
      }

      http.post(api.matchAddApi, params).then(res => {
        console.log(res)
        if (res.success) {
          id = res.data.id;
          wx.showToast({
            title: '报名登记成功',
          })
          wx.redirectTo({
            url: '../game2/game2?id=' + id,
          });
        }
      }).catch(msg => {
        console.error(msg)
      });
    }
  },

  changeName: function(e) {
    userName = e.detail.value;
  },

  changePhone: function(e) {
    userPhone = e.detail.value;
  },

  onShareAppMessage: function (obj) {
    return {
      title: '美好的时代-2019张家港首届青少年文艺大赛',
      path: '/pages/game/game',
      success: function (res) { },
      fail: function (res) { },
    }
  },

})