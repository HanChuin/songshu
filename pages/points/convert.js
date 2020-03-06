// pages/points/convert.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
// var amapFile = require('../../libs/amap-wx.js');
// var markersData = [];
let pageIndex = 1
let pageSize = 10
let hasMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    maskIsShow: true,
    tips: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList: function() {
    var self = this
    http.post(api.pointsConvertListAPI, {
      page: pageIndex,
      size: pageSize
    }).then(res => {
      let list = res.data
      wx.stopPullDownRefresh()
      if (list.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }

      self.setPageData(res.data)
    })
  },
  setPageData: function (list) {
    list.map(item => {
      if (item.createAt) {
        let time = new Date(item.createAt)
        item.createAt = (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
      }
    });

    let oldLst = this.data.list
    if (pageIndex == 1){
      this.setData({ list: list })
    }else{
      if (list.length > 0) {
        oldLst = oldLst.concat(list)
      }
      this.setData({ list: oldLst })
    }

    
  },
  showMask: function(event) {
    // console.log(event.currentTarget.dataset.data)
    this.setData({
      maskIsShow: false,
      maskData : event.currentTarget.dataset.data
    })
  },
  closeMask: function() {
    this.setData({
      maskIsShow: true
    })
  },
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  // 选择地址
  chooseLocation: function() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // console.log(res.name)
        var addr = 'maskData.getAddress'
        that.setData({
          [addr]: res.name
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageIndex = 1
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasMore) {
      pageIndex++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})