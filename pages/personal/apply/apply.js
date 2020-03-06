// pages/personal/apply/apply.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
let pageIndex = 1
let pageSize = 10
let hasMore = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    indexTap: 1,
    searchKey: '',
    activities: [], // 活动列表
    orderBy: 0,
    chooseStartDate: '开始时间', // 选择开始时间
    chooseEndDate: '结束时间', // 选择结束时间
    chooseDayLst: [{
      title: '1-3天',
      checked: false,
      min: 1,
      max: 3
    }, {
      title: '4-7天',
      checked: false,
      min: 4,
      max: 7
    }, {
      title: '7天以上',
      checked: false,
      min: 7,
      max: 999
    }],
    chooseCategoryLst: [], // 选择分类
    sel: '类别'
  },

  searchKeyChange: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  changeIndex: function(e) {
    this.setData({
      indexTap: e.currentTarget.dataset.indextap
    })
    this.getActivityData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.getActivityData();
  },

  // 跳转活动详情
  toActivityDetail: function(event) {
    let id = event.currentTarget.dataset.id;
    let record = event.currentTarget.dataset.record;
    wx.navigateTo({
      url: '/pages/activity/detailnew/detailnew?id=' + id + '&recordId=' + record + '&fromType=user',
    });
  },

  // 获取活动数据
  getActivityData: function() {
    const data = {
      page: pageIndex,
      size: pageSize,
      activityState: this.data.indexTap
    }
    this.data.chooseDayLst.map(item => {
      if (item.checked) {
        data.daysStart = item.min
        data.daysEnd = item.max
      }
    })

    let tags = [];
    this.data.chooseCategoryLst.map(item => {
      if (item.checked) {
        tags.push(item.codeText)
      }
    })
    data.tags = tags.join(';')

    let self = this
    http.post(api.userActivityListAPI, data).then(res => {
      wx.stopPullDownRefresh()
      if (res.data.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
      self.setActivityData(res.data)
    })
  },

  // 设置活动数据
  setActivityData: function(lst) {
    let temps = [];
    lst.map(item => {
      let tags = item.tags
      //修改时间格式
      if (item.startTime && item.endTime) {
        let start = new Date(item.startTime)
        let end = new Date(item.endTime)
        item.start = (start.getMonth() + 1) + '/' + start.getDate()
        item.end = (end.getMonth() + 1) + '/' + end.getDate()
      } else {
        item.start = ''
        item.end = ''
      }
      //修改距离数据
      let dis = '';
      if (item.distance) {
        dis = (item.distance).toFixed(2) + 'km'
      }
      item.distanceStr = dis
      console.log(item)
      //修改截止时间
      let applyTime = new Date(item.applyEndTime)
      let nowTime = new Date()
      let days = 0
      if (nowTime.getTime() > applyTime.getTime()) {
        days = 0
      } else {
        days = parseInt((applyTime.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24))
        if (days == 0) {
          days = 1
        }
      }
      item.endDays = days
      item.tagLst = tags.split(';')
      temps.push(item)
    });

    let old = this.data.activities
    if (pageIndex == 1) {
      this.setData({
        activities: temps
      })
    } else {
      if (temps.length > 0) {
        temps.map(item => {
          old.push(item)
        })
      }
      this.setData({
        activities: old
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(event) {
    this.getActivityData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1;
    this.getActivityData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(hasMore)
    if (hasMore) {
      pageIndex++;
      this.getActivityData()
    }
  },

})