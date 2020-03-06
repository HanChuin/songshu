// pages/home/home.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    bannerUrls: [], // 轮播图列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerImgs();
    // 强制登录
  },
 
  getBannerImgs: function () {
    var that = this
    http.post(api.bannerImgsAPI, {}).then(res => {
      console.log(res)
      that.setData({
        bannerUrls: res.data
      })
    })
  },
  
  toNewsDetail: function (e) {
    console.log(e.currentTarget.dataset.index)
    let item = this.data.bannerUrls[e.currentTarget.dataset.index]
    if (item.type == 1) {
      wx.navigateTo({
        url: '/pages/news/news?url=' + encodeURIComponent(item.url)
      });
    } else {
      wx.navigateTo({
        url: '/pages/details/doing/doing?id=' + item.activityId,
      })
    }
  }

})