var WxParse = require('../../libs/wxParse/wxParse.js');
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
let goodsId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSet: '?imageMogr2/auto-orient/thumbnail/!50p/blur/1x0/quality/75|imageslim',
    sysUserInfo: {
      point: 0
    },
    goodsDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("11",options)
    goodsId = options.id;
    if (goodsId > 0) {
      this.getGoodsDetail()
    }
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      this.getSysUserInfo()
    } else {
      wx.showToast({
        title: '请先登录，再兑换积分',
      })
    }
  },

  // 获取页面数据
  getSysUserInfo: function() {
    let self = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        // console.log('1',res.data)
        self.setData({
          sysUserInfo: res.data
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取商品详情
  getGoodsDetail: function() {
    let params = {
      goodsId: goodsId
    }
    wx.showLoading({
      title: '正在加载',
    })
    let that = this;
    // console.log("3", that)
    http.post(api.activityDetailAddAPI, params).then(res => {
      WxParse.wxParse('goodsDetailInfo', 'html', res.data.goodsDetails, that)
      console.log("e", res.data)
      this.setData({
        goodsDetail: res.data
      })
      wx.hideLoading()
    }).catch(msg => {
      wx.hideLoading()
    })

  },

  // 点击兑换
  convert: function(e) {
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      wx.navigateTo({
        url: '/pages/order/order?id=' + goodsId + '&type=' + this.data.goodsDetail.exchangeType
      });
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },

  click: function() {
    wx.navigateTo({
      url: '/pages/shopper/shopper?id=' + this.data.goodsDetail.partnerId
    })
  },
})