// pages/shop/shop.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
// var tabBarTemplate = require('../../template/tabBar/tabBar.js');
let pageIndex = 1
let pageSize = 10
let hasMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: "",
    list: null,
    maskShow: true,
    maskData: null,
    canConvert: false,
    sysUserInfo: { point: 0 }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageIndex = 1
    this.getList()
    this.getPoints()
  },

  onShow: function () {
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      let self = this
      this.getSysUserInfo()
    }
  },

  // 获取页面数据
  getSysUserInfo: function () {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res)
        self.setData({ sysUserInfo: res.data })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取商品列表
  getList: function () {
    var that = this;
    http.post(api.activityGoodsListAPI, {
      page: pageIndex,
      size: pageSize,
      goodsCategory: ''
    }).then(res => {
      console.log(res)
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
        console.log(oldLst)
        that.setData({
          list: oldLst
        })
      }

      if (list.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
    })
  },

  // 获取我的积分
  getPoints: function () {
    var that = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        console.log(res.data)
        that.setData({
          point: res.data.point
        })
      })
    } else {
      wx.showToast({
        title: '请先登录!',
        duration: 2000,
        mask: true,
        icon: 'none'
      })
    }
  },

  // 展示弹窗
  showMask: function (event) {
    let goodsItem = event.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + goodsItem.id,
    })
  },

  // 点击兑换
  convert: function (e) {
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      let maskData = this.data.maskData
      wx.navigateTo({
        // url: '/pages/order/order?goodsName=' + maskData.goodsName + '&point=' +maskData.point + '&amount='+maskData.amount/100 + '&id='+maskData.id,
        url: '/pages/order/order?id=' + maskData.id
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }


    // let maskData = this.data.maskData
    // wx.navigateTo({
    //   // url: '/pages/order/order?goodsName=' + maskData.goodsName + '&point=' +maskData.point + '&amount='+maskData.amount/100 + '&id='+maskData.id,
    //   url: '/pages/order/order?id='+maskData.id
    // })
    // let id = this.data.maskData.id;
    // let that = this;
    // http.post(api.pointsConvertAPI, {
    //   goodsId: id,
    // }).then(res => {
    //   that.setData({
    //     maskShow: true
    //   })
    //   that.getPoints()
    //   that.getList()
    //   wx.showToast({
    //     title: '兑换成功',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // })
  },

  changeGoods: function (id) {

  },

  // 关闭弹窗
  closeMask: function () {
    this.setData({
      maskShow: true
    })
  },
  
  // 跳转到兑换历史
  naviToConvertHistory: function () {
    wx.navigateTo({
      url: '/pages/points/convert'
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
    console.log('onReachBottom')
    console.log(hasMore)
    if (hasMore) {
      pageIndex++
      this.getList()
    }
  },

  previewer: function (event) {
    console.log(event.currentTarget.dataset.img)
    wx.previewImage({ urls: [event.currentTarget.dataset.img] });
  }
})