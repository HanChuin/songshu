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
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    searchKey: '',
    mode: [],
    searchKeyQ: '',
    modeQ: [],
    tab:0
  },

/******************** 获取数据 ********************/

  /* API获取数据 */
  getDataList() {
    http.post(api.getListAPI, {
      page: pageIndex,
      size: pageSize
    }).then(res => {
      this.setData({
        mode: res.data
      })
      const mode = this.data.mode
      mode.map(item => {
        let ft = item.finishTime
        let dt = new Date(ft)
        let time = dt.getFullYear() + '-' + (dt.getMonth()+1) +'-' + (dt.getDay() + 1)
        item.ft = time
      })
      this.setData({
        mode
      })
      this.stopPullRefresh()
    })
  },

  /* API获取问卷数据 */
  getQuesList() {
    let that = this
    http.post(api.getActivityListAPI, { page: pageIndex, size: pageSize }).then(res => {
      that.stopPullRefresh()
      const list = res.data.data
      console.log(list)
      list.map(item=>{
        let listitem = item
        item.isFinish = false
      })
      that.setData({
        modeQ: list
      })

      this.isFinish()
    })
  },

  /* 判断是否提交过该问卷 */
  isFinish(){
    const list = this.data.modeQ
    this.data.modeQ.map((item,index)=>{
      http.post(api.questionCheckAPI, { questionId: item.id }).then(res => {
        let ind = 'modeQ[' + index + '].isFinish'
        this.setData({
          [ind]: res.data
        })
      })
    })

  },

  

/**************** 页面跳转&其他功能 ****************/

  /* tab切换 */
  changeTab(e){
    let type = e.currentTarget.dataset.type
    console.log(type)
    if (type == 'vote') this.setData({ tab: 0 })
    if (type == 'ques') this.setData({ tab: 1 })
  },

  /* 搜索功能 */
  searchActivity() {
    this.getDataList()
  },

  /* 停止下拉刷新 */
  stopPullRefresh() {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
      }
    })
  },

  /* 页面跳转 */
  goToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../votenroll/votenroll?id=' + id,
    })
  },

  startAns(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let token = this.data.token
    if (token) {
      wx.navigateTo({
        url: '/pages/question/questionnaire/questionnaire?id=' + id,
      })
    } else {
      wx.showToast({
        title: '您还未登录!',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../login/login',
        })
      }, 1000)
    }
  },

/******************** 生命周期 ********************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.to)
    if (options.to == 'vote'){
      this.setData({tab:1})
    }
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQuesList()
    let token = wx.getStorageSync('token')
    this.setData({
      token
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getDataList()
  },

})