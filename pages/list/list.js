const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
var markersData = {
  latitude: '', //纬度
  longitude: '' //经度
}
let pageIndex = 1
let pageSize = 10
let hasMore = false
let allTags = [];
let lastTag = 'no';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    searchKey: '',
    activities: [], // 活动列表
    shaixuanTags: '',
    isHidden: true,
    sysUserInfo: {
      point: 0
    },
    bigClasses: [], // 大类
    smallClasses: [], // 小类
    chooseBigIndex: -1, // 记录选中的大类
    chooseSmallIndex: -1, //记录选中的小类
  },

/*********************** 获取数据 ***********************/

  //获取活动详情
  toNewsDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity/detailnew/detailnew?id=' + id,
    })
  },

  // 获取活动数据
  getActivityData: function () {
    const data = {
      page: pageIndex,
      size: pageSize,
      activityState: this.data.index
    }
    if (this.data.chooseSmallIndex > -1) {
      data.tagsCode = this.data.smallClasses[this.data.chooseSmallIndex].codeValue;
    } else {
      data.tagsCode = ''
    }
    data.key = this.data.searchKey;
    let self = this
    http.post(api.activityLstWithTagsAPI, data).then(res => {
      // console.log(res.data)
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
  setActivityData: function (lst) {
    console.log(lst)
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

  // 获取页面数据
  getSysUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        self.setData({
          sysUserInfo: res.data
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  /* 获取全部分类 */
  getTags: function () {
    http.post(api.getTagsAPI, {}).then(res => {
      allTags = res.data;
      let temps = [];
      res.data.map(item => {
        if (item.parentValue == '') {
          temps.push(item);
        }
      })
      this.setData({
        bigClasses: temps
      })
      console.log(this.data.bigClasses)
    }).catch(msg => {
      console.error(msg)
    })
  },

/*********************** 其他函数 ***********************/

  /* 改变分类状态3 */
  changeState: function (e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      activities:[]
    })
    this.getActivityData();
  },

  /* 搜索关键字 */
  searchKeyChange: function (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  /* 选择分类 */
  chooseItemAction: function (e) {
    let index = e.currentTarget.dataset.index;
    pageIndex = 1
    let bigCode = this.data.bigClasses[index].codeValue;
    // 获取小类
    let smalls = []
    allTags.map(item => {
      if (bigCode === item.parentValue) {
        smalls.push(item)
      }
    })
    // console.log(smalls)
    this.setData({
      chooseBigIndex: index,
      smallClasses: smalls,
      chooseSmallIndex: 0
    })
    this.getActivityData()
  },

  /* 搜索 */
  searchActivity: function (event) {
    this.getActivityData();
  },

/*********************** 生命周期 ***********************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.getActivityData(); // 获取活动数据
    this.getTags();

    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      let self = this
      this.getSysUserInfo()
    }
  },

  onShow() {
    // app.editTabbar();
    pageIndex = 1
    this.getActivityData(); // 获取活动数据
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1
    this.getActivityData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasMore) {
      pageIndex++;
      this.getActivityData()
    } else {}
  },

})