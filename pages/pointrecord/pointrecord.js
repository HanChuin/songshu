// pages/pointrecord/pointrecord.js
const http = require("../../utils/http.js");
const api = require("../../utils/api.js");
const utils = require("../../utils/util.js");

let pageIndex = 1
let pageSize = 6
let hasMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData: function () {
    let temps = this.data.data
    let data = {
      page: pageIndex,
      size: pageSize
    }
    http.post(api.pointListAPI,data).then(res=>{
      console.log(res.data)
      wx.stopPullDownRefresh()
      if (res.data.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
      if(pageIndex==1){
        temps = res.data
      } else {
        temps = temps.concat(res.data)
      }
      temps.map(item => {
        item.createTimeStr = utils.formatTime(new Date(item.createTime))
      })
      this.setData({
        data: temps,
      })
      console.log('temps',temps)
    }).catch(msg=>{
      console.error(msg)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageIndex = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(hasMore)
    if(hasMore){
      pageIndex++;
      this.getData()
    }
      // wx.showToast({
      //   title: '没有更多了',
      //   duration: 1200
      // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})