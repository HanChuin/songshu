// pages/allList/allList.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

let pageIndex = 1
let pageSize = 10
let hasMore = false
let qiniuUrl = 'https://url.songshuqubang.com/micsoft'
Page({

  /**
   * 页面的初始数据
   */

  data: {
    list: null
  },

  // 跳转商品详情
  goodsDetail(event) {
    let goodsItem = event.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + goodsItem.id,
    })
  },

  // 获取商品列表
  getList() {
    var that = this;
    http.post(api.activityGoodsListAPI, {
      page: pageIndex,
      size: pageSize,
      goodsCategory: ''
    }).then(res => {
      console.log(res.data)
      wx.stopPullDownRefresh()
      let list = res.data
      let oldLst = that.data.list;
      if (pageIndex == 1) {
        that.setData({
          list: res.data
        })
      } else {
        if (list.length > 0) {
          list.map(item => {
            oldLst.push(item)
          })
        }
        that.setData({
          list: oldLst
        })
      }
      if (list.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
    }).catch(msg => {
      console.log(msg)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasMore) {
      pageIndex++
      this.getList();
    }
  },

})