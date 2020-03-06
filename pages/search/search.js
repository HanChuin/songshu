const appkeys = require('../../utils/appkey.js')
const api = require('../../utils/api.js')
const http = require('../../utils/http.js')
var amapFile = require('../../libs/amap-wx.js')
var markersData = {
  latitude: '',//纬度
  longitude: ''//经度
}
let pageIndex = 1
let pageSize = 10
let hasMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    historyKeys: [],
    seachKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(appkeys.searchHistory)
    const kes = wx.getStorageSync(appkeys.searchHistory)
    if (kes.length == 0) {
      wx.setStorageSync(appkeys.searchHistory, '敬老院;学校;室外活动')
    } else {
      let keys = kes.split(';')
      this.setData({ historyKeys: keys })
    }

    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        markersData.latitude = res.latitude,
          markersData.longitude = res.longitude
        that.getActivityData();
      }
    })



  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  historyClick: function (event) {
    console.log(event.currentTarget.dataset.key)
    this.setData({ seachKey: event.currentTarget.dataset.key })
    this.getActivityData()
  },

  cleanClick: function () {
    let self = this
    wx.showModal({
      title: '警告',
      content: '确定清空搜索历史吗',
      showCancel: true,
      cancelText: '取消',
      confirmText: '清空',
      confirmColor: '#f00',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync(appkeys.searchHistory, '')
          self.setData({ historyKeys: [] })
        }
      }
    })
  },

  searchClick: function () {
    var kes = wx.getStorageSync(appkeys.searchHistory)
    if (kes.indexOf(this.data.seachKey) == -1) {
      let temp = this.data.historyKeys
      temp.push(this.data.seachKey)
      this.setData({ historyKeys: temp })
      wx.setStorageSync(appkeys.searchHistory, temp.join(';'))
    }
    this.getActivityData()
  },

  searchInp: function (event) {
    const res = event.detail.value
    this.setData({ seachKey: res });
  },


  cleanSearchKeyClick: function () {
    this.setData({ seachKey: '', activities:[] })
  },


  //设置活动数据
  setActivityData: function (lst) {
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
        if (item.distance > 1000) {
          dis = (item.distance / 1000).toFixed(2) + 'km'
        } else {
          dis = (item.distance).toFixed(2) + 'm'
        }
      }
      item.distanceStr = dis
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
        old = old.concat(temps)
      }
      this.setData({
        activities: old
      })
    }
    console.log(this.data.activities)
  },


  getActivityData: function () {
    if (this.data.seachKey == '') {
      return;
    }

    const data = {
      page: pageIndex,
      size: pageSize,
      orderBy: 1,
      keyword: this.data.seachKey
    }
    data.lat = markersData.latitude
    data.lng = markersData.longitude
    let self = this
    http.post(api.activityListAPI, data).then(res => {
      console.log('list')
      console.log(res.data.length)
      wx.stopPullDownRefresh()
      if (res.data.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
      self.setActivityData(res.data)
    })
  },


  onReachBottom: function () {
    if (hasMore) {
      console.log('more')
      pageIndex++
      this.getActivityData()
    }
  },


})