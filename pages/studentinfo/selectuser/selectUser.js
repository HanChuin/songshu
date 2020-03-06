/**
 * 选择学生或者家长
 * stu / parent
 */
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')


let userType = 'stu';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    emptyStr: '您还未添加未成年人和成年人信息'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userType = options.type;
  },

  onShow: function () {
    if (userType == 'stu') {
      this.getStudents()
      this.setData({
        emptyStr: '您还未添加未成年人信息'
      })
      wx.setNavigationBarTitle({
        title: '新增未成年人',
      })
    } else if (userType == 'parent') {
      this.getParents();
      this.setData( {
        emptyStr : '您还未添加成年人信息'
      }) ;
      wx.setNavigationBarTitle({
        title: '新增成年人',
      })
    }
  },

  getStudents: function () {
    wx.showLoading({
      title: '正在加载',
    })
    http.post(api.getUserStudentUrl, {}).then(res => {
      let temps = [];
      res.data.map(item => {
        item.isStudent = true;
        temps.push(item)
      })
      this.setData({ users: temps })
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }).catch(msg => {
      console.error(msg)
    })
  },

  getParents: function (students) {
    wx.showLoading({
      title: '正在加载',
    })
    http.post(api.getUserParentUrl, {}).then(res => {
      let temps = [];
      res.data.map(item => {
        item.isStudent = false;
        temps.push(item)
      })
      this.setData({ users: temps })
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }).catch(msg => {
      console.error(msg)
    })
  },

  /**
   * 新增学生/家长
   */
  addUser: function () {
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

  chooseitem: function (e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.users[index]

    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2];
    if (userType == 'stu') {

    prevPage.setData({
      student: item.name,
      studentId: item.id
    })
    } else {
      prevPage.setData({
        parent: item.name,
        parentId: item.id
      })
    }
    wx.navigateBack({});
  }
  
})