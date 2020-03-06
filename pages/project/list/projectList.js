const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
let token = ''
let noticeList = [] // 已关注项目id数组

let pageIndex = 1
let pageSize = 10
let hasMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    list: [], // all项目列表
    favs: [], // 关注列表
    nowIdx: 0, //当前swiper索引
    activities: [], //所有的活动
    keyWords: [], //关键词
  },

  /* ************************ 获取数据 ***************************** */

  // 获取公益项目
  getActivitiesImgs: function() {
    var that = this;
    let data = {
      page: 1,
      size: 100,
    }
    let keys = []
    http.post(api.projectItemListAPi, data).then(res => {
      res.data.map((item, index) => {
        if (item.desc1.indexOf('、') > -1) {
          item.desc1.split('、').map(one => {
            keys = keys.concat({
              key: one,
              id: index
            })
          })
        } else {
          keys = keys.concat({
            key: item.desc1,
            id: index
          })
        }
      });
      console.log('desc1', keys)
      that.setData({
        list: res.data,
        keyWords: keys
      })
    }).catch(msg => {
      console.log(msg)
    })
  },

  getActivityList: function() {
    http.post(api.allActivityApi, {
      page: pageIndex,
      size: pageSize
    }).then(res => {
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
          if (item.activity.activeState == 0) {
            one.btnStr = "预览"
          } else if (item.activity.activeState == 1 || item.activity.activeState == 2) {
            one.btnStr = "报名"
          } else if (item.activity.activeState == 3) {
            one.btnStr = "回顾"
          }
          temp.push(one)
        });

        this.setData({
          activities: temp
        })
      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  /* ************************ 跳转 ***************************** */

  //公益项目详情
  toActivityDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    wx.navigateTo({
      url: '/pages/project/detail/detail?id=' + item.id
    });
  },

  toProjectDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.favs[index];
    console.log(item)
    wx.navigateTo({
      url: '/pages/project/detail/detail?id=' + item.projectId
    });
  },

  toastAction: function(e) {
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

  /* ************************ 事件 ***************************** */

  //swiper滑动获取index
  swiperChange: function(e) {
    console.log('swiperChange', e.detail.current)
    this.setData({
      nowIdx: e.detail.current
    })
  },

  /**
   * 设置项目关注状态
   */
  changeProjectNoticeState: function() {
    console.log('changeProjectNoticeState', noticeList);
    let temps = [] //所有列表
    let oneT = undefined;
    console.log('list', temps)
    this.data.list.map(res => {
      oneT = res;
      if (noticeList.indexOf(res.id) > -1) {
        oneT.favState = 1
      } else {
        oneT.favState = 0
      }
      temps.push(oneT)
    })
    console.log(temps)
    this.setData({
      list: temps
    })
  },
  //关注切换状态
  changeNotStatus: function(e) {
    // 判断是否登录
    if (token == '' || token == undefined || token == null) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      let that = this
      let index = e.currentTarget.dataset.index;
      let id = that.data.list[index].id;
      http.post(api.projectFavAPi, {
        id
      }).then(res => {
        console.log('projectFavAPi', res)
        // that.getNoticeList()
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar() // 关闭tabbar
    this.getActivitiesImgs()
    this.getActivityList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    token = wx.getStorageSync('token')
    if (token == '' || token == undefined || token == null) {

    } else {
      // this.getNoticeList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onPullDownRefresh: function() {
    this.getActivitiesImgs()
    this.getActivityList();
  },

  onReachBottom: function() {
    if (hasMore) {
      pageIndex++
      this.getActivityList()
    }
  },

  /* ******************************************************* */


  //关注列表
  // getNoticeList: function () {
  //   var that = this;
  //   let data = {
  //     page: 1,
  //     size: 10,
  //   }
  //   http.post(api.projectFavListAPi, data).then(res => {
  //     console.log('projectFavListAPi', res)
  //     that.setData({
  //       favs: res.data,
  //     })
  //     noticeList = []
  //     res.data.map(item => {
  //       noticeList.push(item.projectId);
  //     });
  //     this.changeProjectNoticeState();
  //   }).catch(msg => {
  //     console.log(msg)
  //   })
  // },

})