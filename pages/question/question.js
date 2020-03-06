const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
let pageIndex = 1
let pageSize = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyQ: '',
    modeQ: []
  },

  /* API获取问卷数据 */
  getQuesList() {
    http.post(api.getActivityListAPI, { page: pageIndex, size: pageSize }).then(res => {
      console.log(res.data)
      this.setData({
        modeQ: res.data
      })

      this.stopPullRefresh()
    })
  },

  /* 停止下拉刷新 */
  stopPullRefresh() {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuesList()
  },

  /* 搜索功能 */
  searchActivity() {

  },

  startAns(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let token = this.data.token
    if (token) {
      http.post(api.questionCheckAPI, { questionId:id}).then(res=>{
        console.log(res.data)
        if (!res.data){
          wx.navigateTo({
            url: 'questionnaire/questionnaire?id=' + id,
          })
        }else {
          wx.showToast({
            title: '您已填过此问卷',
            icon: 'none'
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: 'questionnaire_mid/questionnaire_mid?id=' + id,
            })
          },600)
          
        }
      })
      
    } else {
      wx.showToast({
        title: '您还未登录!',
        icon:'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../login/login',
        })
      }, 1000)
    }
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
    let token = wx.getStorageSync('token')
    this.setData({
      token
    })
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
    this.getQuesList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})