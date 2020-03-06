const app = getApp();
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
var WxParse = require('../../libs/wxParse/wxParse.js');
const messageUtils = require('../../utils/message.js')
var token = ''
Page({

  /**pages/activity/detailnew/detailnew
   * 页面的初始数据
   */
  data: {
    parent: '请选择',
    parentId: 0,
    prnData: [],
    student: '请选择',
    studentId: 0,
    stuData: [],
    standardId: 0,
    activityId: 0,
    notice: {},
    agreeRule: false,
    choose: false,
    choicePrn: {},
    choiceStu: {},
    joinPerson: [],
    choiceJoinPerson: []
  },

  /* 获取活动须知 notice */
  getNotice: function() {
    let that = this;
    http.post(api.getActivityNotice, {
      activityId: this.data.activityId
    }).then(res => {
      WxParse.wxParse('noticeInfo', 'html', res.data.value, that)
      this.setData({
        notice: res.data.value
      })
      console.log(this.data.notice)
    }).catch(msg => {

    })
  },

  /* 获取未成年人数据 stuData */
  getStudentList: function() {
    http.post(api.getUserStudentUrl, {}).then(res => {
      console.log(res.data)
      let temp = res.data;
      this.setData({
        stuData: res.data
      })

      this.getJoinAll()

    }).catch(msg => {
      console.log(msg)
    })
  },

  /* 获取成年人信息 prnData */
  getParentList: function() {
    http.post(api.getUserParentUrl, {}).then(res => {
      console.log(res.data)
      this.setData({
        prnData: res.data
      })
      this.getStudentList();

    }).catch(msg => {
      console.log(msg)
    })
  },

  getJoinAll() {
    const a = this.data.prnData
    const b = this.data.stuData
    const joinPerson = a.concat(b)
    this.setData({
      joinPerson
    })
  },

  // 添加参与人 跳转页面
  addPerson() {
    const list = this.data.joinPerson
    if (list.length == 0) {
      wx.showToast({
        title: '请添加参与人！',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../studentinfo/manager/manager',
        })
      }, 900)

    } else {
      this.setData({
        choose: true
      })
    }
  },

  // 取消选择
  cancelChoose() {
    this.setData({
      choose: ''
    })
  },

  // 选择参与人
  choosePerson(e) {
    console.log(e.currentTarget.dataset.type)
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    if (type == 'prn') {
      this.setData({
        parentId: id,
        choose: false
      })
    } else if (type == 'stu') {
      this.setData({
        studentId: id,
        choose: false
      })
    }
    this.getJoinPerson()
  },

  // 获得参与人列表
  getJoinPerson() {
    let studentId = this.data.studentId
    let parentId = this.data.parentId
    const list = this.data.joinPerson
    const thisList = this.data.choiceJoinPerson = []

    list.map(res => {
      if (res.id == studentId) {
        let ind = -1
        thisList.map((item, index) => {
          if (item.id == studentId) {
            ind = index
          }
        })
        console.log(ind)
        if (ind == -1) {
          thisList.push(res)
        }
      }
      if (res.id == parentId) {
        let ind = -1
        thisList.map((item, index) => {
          if (item.id == parentId) {
            ind = index
          }
        })
        console.log(ind)
        if (ind == -1) {
          thisList.push(res)
        }
      }
    })
    console.log(list)
    console.log(this.data.choiceJoinPerson)
    this.setData({
      choiceJoinPerson: thisList
    })
  },

  // 取消参加
  del(e) {
    console.log(e.currentTarget.dataset)
    let that = this
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    wx.showModal({
      title: '提示',
      content: '是否取消参加？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (type == 'stu') {
            that.setData({
              studentId: ''
            })
          }
          if (type == 'prn') {
            that.setData({
              parentId: ''
            })
          }
          that.getJoinPerson()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 选择成人 / 学生
  choosePrn(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    console.log(this.data.prnData)
    const list = this.data.prnData
    console.log(list)
    list.map(item => {
      if (item.id == id) {
        this.setData({
          choicePrn: item,
          parentId: id,
          choose: ''
        })
      }
    })
    // console.log(this.data.choicePrn)
  },
  chooseStu(e) {
    let id = e.currentTarget.dataset.id
    // console.log(id)
    const list = this.data.stuData
    list.map(item => {
      if (item.id == id) {
        this.setData({
          choiceStu: item,
          studentId: id,
          choose: ''
        })

      }

      console.log(clist)

    })
  },

  /* 添加参与人 */
  add(e) {
    console.log(e.currentTarget.dataset.type)
    let userType = e.currentTarget.dataset.type
    if (userType == 'stu') {
      wx.navigateTo({
        url: '/pages/studentinfo/studentedit/studentinfo?type=add',
      });
    } else {
      wx.navigateTo({
        url: '/pages/studentinfo/parentedit/parentinfo?type=add',
      });
    }
  },

  /* 修改参与人 */
  editUser(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    if (type == 'stu') {
      wx.navigateTo({
        url: '/pages/studentinfo/studentedit/studentinfo?type=edit&id=' + id,
      });
    } else {
      wx.navigateTo({
        url: '/pages/studentinfo/parentedit/parentinfo?type=edit&id=' + id,
      });
    }
  },

  // 订阅消息
  subMessage: function() {
    let self = this
    let success = function(res) {
      console.log('success', res)
    }
    let fail = function(msg) {
      console.log('fail', msg)
    }
    let complete = function() {
      console.log('complete')
      self.takeInActivity();
    }
    messageUtils.setActivityMessage(success, fail, complete);
  },

  takeInActivity: function() {
    if (!this.data.agreeRule) {
      wx.showToast({
        title: '请先同意须知内容',
        icon: 'none'
      });
      return;
    }

    if (this.data.parentId == 0 &&
      this.data.studentId == 0) {
      wx.showToast({
        title: '您还未选择参与人',
        icon: 'none'
      });
      return;
    }

    let params = {
      activityId: parseInt(this.data.activityId),
      standardId: this.data.standardId,
      parentId: this.data.parentId,
      studentId: this.data.studentId
    };
    http
      .post(api.activityJoinAPI, params)
      .then(res => {
        console.log(res)
        if (res.success) {
          let rs = res.data;
          console.log(rs)
          // if (rs.length < 1) {
          wx.showToast({
            title: '报名成功!'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
          // } else {
          // this.createWxOrderAction(rs.id)
          // this.setData({
          //   tradeNo: rs.tradeNo
          // })
          // }
        }
      })
      .catch(msg => console.log(msg));
  },

  createWxOrderAction: function(id) {
    let params = {
      tradeId: id
    }
    http.post(api.createActivityWxUrl, params).then(res => {
      let payment = res.data;
      this.payAction(payment)
    }).catch(msg => {
      console.error(msg)
    })
  },

  payAction: function(payment) {
    let that = this;
    payment.complete = function() {
      wx.redirectTo({
        url: '/pages/order/order-result/order-result?tradeNo=' + that.data.tradeNo,
      })
    }
    wx.requestPayment(payment);
  },

  // 是否同意条约
  aggreeRules: function () {
    this.setData({
      agreeRule: !this.data.agreeRule
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getParentList();
    this.data.activityId = options.activityId;
    this.data.standardId = options.standardId;
    this.getNotice();
  },

  onShow() {
    let t = wx.getStorageInfoSync('token')
    if (t == '' || t == undefined || t == null) {
      token = ''
    } else {
      token = t;
    }
    this.setData({
      choose: false
    })
    this.getParentList();
  },

})