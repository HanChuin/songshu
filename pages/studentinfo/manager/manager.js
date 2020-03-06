const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let token = wx.getStorageSync('token')
    
    if (token == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/login/login',
          icon:'none'
        });
      },600)
      
    }
  },

  onShow:function(){
    this.getTaskCheck()
    this.getParents();
  },

  getTaskCheck(){
    http.post(api.taskCheckAPI, { type:'userinfo'}).then(res=>{
      console.log(res)
    })
  },

  getStudents: function (parents) {
    http.post(api.getUserStudentUrl, {}).then(res => {
      let temps = parents;
      res.data.map(item => {
        item.isStudent = true;
        temps.push(item)
      })
      this.setData({
        users: temps
      });
      console.log(this.data.users)
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }).catch(msg => {
      console.error(msg)
    })
  },

  getParents: function(students) {
    http.post(api.getUserParentUrl, {}).then(res => {
      let temps = [];
      res.data.map(item => {
        item.isStudent = false;
        temps.push(item)
      })
      this.getStudents(temps);
    }).catch(msg => {
      console.error(msg)
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getParents();
  },

  /**
   * 新增学生/家长
   */
  addUser: function() {
    wx.showActionSheet({
      itemList: ['未成年人', '成年人'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/studentinfo/studentedit/studentinfo?type=add',
          });
        } else {
          wx.navigateTo({
            url: '/pages/studentinfo/parentedit/parentinfo?type=add',
          });
        }
      },
      fail(res) {
      }
    })
  },

  editUser:function(e) {
    let index = e.currentTarget.dataset.index;
    let user = this.data.users[index]
    console.log(user)
    if (user.isStudent) {
    wx.navigateTo({
      url: '/pages/studentinfo/studentedit/studentinfo?type=edit&id=' + user.id,
    });
    } else {
      wx.navigateTo({
        url: '/pages/studentinfo/parentedit/parentinfo?type=edit&id=' + user.id,
      });
    }
  }
})