// pages/shop1/shop1.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
let qiniuUrl = 'https://url.songshuqubang.com/micsoft'
let pageIndex = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysUserInfo: {},
    per: 0,
    tab: 2,
    pointS:0,
    top3Point: [],
    top7Point: [],
    myPoint:{},
  },

/************************** 获取数据 **************************/

  // 获取页面数据
  getSysUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        self.setData({
          sysUserInfo: res.data
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取我的积分
  getPoints: function () {
    var that = this
    let token = wx.getStorageSync('token')
    let levelId = 0
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        that.setData({
          sysUserInfo: res.data
        })
        console.log(res.data.integral)
        let integral = res.data.integral
        http.get(api.getUserlevelListAPI,{}).then(res=>{
          console.log(res.data)
          let list = res.data
          list.map(item=>{
            if (integral >= item.start && integral<=item.end){
              levelId = item.id
            }
          })
          let p = list[levelId - 1].end - list[levelId - 1].start
          console.log(p)
          that.setData({ per: integral / p * 100 })
          this.setData({
            nowLevel: list[levelId-1].name ,
            nextLevel: list[levelId].name,
            endIntegral: list[levelId - 1].end
          })

        }).catch(msg=>{
          console.log(msg)
        })
        if (that.data.sysUserInfo.vip == 1) {
          that.setData({ pointS: 500})
        }
        if (that.data.sysUserInfo.vip == 2) {
          that.setData({ pointS: 2000})
        }
        if (that.data.sysUserInfo.vip == 3) {
          that.setData({ pointS: 5000})
        }
        if (that.data.sysUserInfo.vip == 4) {
          that.setData({ pointS: 10000})
        }

      }).catch(msg => {
        console.log(msg)
      })
    } else {

    }
  },

  // 获取用户数据
  getUserSignDetail: function () {
    http.post(api.signUserDetailAPI, {
      activityId: 1
    }).then(res => {
      let days = ''
      if (res.data.signTimes) {
        days = res.data.signTimes
      }
      this.setData({ signDays: days })
    }).catch(msg => {
      console.log(msg)
    });
  },

  /* 获取积分排名 */
  getPointList(){
    let that = this
    http.post(api.getPointListAPI,{}).then(res=>{
      wx.stopPullDownRefresh()
      console.log('getPointList', res)
      const list = res.data.list
      const top3=[]
      const top7=[]
      const myPoint = that.data.sysUserInfo
      let myId = that.data.sysUserInfo.id
      let myNo = '未上榜'
      list.map((item,index)=>{
        if (item.id == myId){
          myNo = index+1
        }
        if(index<3){
          top3.push(item)
        } else if(index>=3&&index<100){
          top7.push(item)
        }
      })
      top3.map((item,index)=>{
        item.no = index+1
      })
      top7.map((item, index) => {
        item.no = index + 4
      })
      top3[0] = top3.splice(1, 1, top3[0])[0];
      that.setData({
        top3Point: top3,
        top7Point: top7,
        myNo
      })
    }).catch(msg => {
      console.log(msg)
    })
  },

/************************** 监听跳转 **************************/

  getShareCode(code){
    http.post(api.shareCodeAPI, { code }).then(res=>{
      console.log( res.data.data )
      app.globalData.shareCode = res.data.data
    })
  },

  /* 切换tab */
  changeTab(e) {
    let tag = e.currentTarget.dataset.tag
    if (tag == 'shop') {
      app.globalData.shopRank = 'shop'
      wx.switchTab({
        url: '/pages/shop/shop',
      })
    } else if (tag == 'point') {
      app.globalData.shopRank = 'point'
      wx.switchTab({
        url: '/pages/shop/shop',
      })
    } else if (tag == 'allGoods') {
      app.globalData.shopRank = 'allGoods'
      wx.switchTab({
        url: '/pages/shop/shop',
      })
    } else if (tag == 'vote') {
      this.setData({
        tab: 2
      })
    }
  },

  testLogin(){
    let token = wx.getStorageSync('token')
    if (token == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        });
      }, 600)
    }
  },

/************************** 生命周期 **************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.testLogin()
    pageIndex = 1
    this.getPoints()
    this.getUserSignDetail()
    this.getPointList()
  },

  onShow: function () {
    let token = wx.getStorageSync('token')
    app.globalData.shopRank = ''
    if (token.length > 0) {
      let self = this
      this.getSysUserInfo()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1
    this.getPointList()
    this.getPoints()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  
})