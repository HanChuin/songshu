const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')

let projectId = 0
let token = ''
let pageIndex = 1
let pageSize = 10
let hasMore = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    favState: 0,
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      projectId = options.id
    } else {
      wx.showToast({
        title: '缺少参数🆔',
      });
      return;
    }
    this.getDetail();
    this.getProjectActivity();
  },

  onShow: function () {
    token = wx.getStorageSync('token');
    console.log('token', token)
    if (token !== '') {
      this.getFavState()
    }
  },

  /**
   * 获取公益项目详情
   */
  getDetail: function () {
    http.post(api.projectItemListDetailAPi, { id: projectId }).then(res => {
      console.log('getDetail', res)
      if (res.success) {
        let info = res.data;
        this.setData({
          info
        });
        wx.setNavigationBarTitle({
          title: info.name
        });
      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  /**
   * 获取关注状态
   */
  getFavState: function () {

    http.post(api.projectFavStateApi, { id: projectId }).then(res => {
      console.log('projectFavStateApi', res)
      if (res.success) {
        this.setData({
          favState: res.data
        })
      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  favAction: function () {
    token = wx.getStorageSync('token');
    if (token !== '') {
      //关注操作
      http.post(api.projectFavAPi , {id: projectId}).then(res => {
        if (res.success) {
          this.getFavState()
        }
      }).catch(msg => {

      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  toastAction: function (e) {

    let index = parseInt(e.currentTarget.dataset.index)
    let activityInfo = this.data.activities[index];
    console.log('toastAction', activityInfo);
    if (activityInfo.type == 1) {
      // 线上报名活动
      wx.navigateTo({
        url: '/pages/activity/detailnew/detailnew?id=' + activityInfo.relationId,
      })
    } else if (activityInfo.type == 2) {
      // 线上提交表单
      wx.navigateTo({
        url: '/pages/formactivity/formactivity?id=' + activityInfo.relationId,
      })
    }
  },


  getProjectActivity: function () {
    wx.showLoading({
      title: '正在加载',
    });
    http.post(api.projectActivityListApi, { id: projectId, page: pageIndex, size: pageSize }).then(res => {
      console.log(res)
      if (res.success) {
        let temp = []
        if (pageIndex == 1) {
          temp = []
        } else {
          temp = this.data.activities;
        }
        wx.stopPullDownRefresh();
        if (res.data.length < pageSize) {
          hasMore = false
        } else {
          hasMore = true
        }

        let one = undefined
        res.data.map(item => {
          one = item;
          one.coverUrl = item.cover;
          one.title = item.name;
          one.subTitle = item.desc;
          if (item.state == 0) {
            one.btnStr = "预览"
          } else if (item.state == 1 || item.state == 2) {
            one.btnStr = "报名"
          } else if (item.state == 3) {
            one.btnStr = "回顾"
          }
          temp.push(one)
        });

        this.setData({
          activities: temp
        })

      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(msg => {
      console.log(msg)
      wx.hideLoading()
      wx.stopPullDownRefresh()
    });
  },


  onPullDownRefresh:function() {
    pageIndex = 1
    this.getProjectActivity();
  }
})