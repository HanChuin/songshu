var WxParse = require('../../libs/wxParse/wxParse.js');
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
let partnerId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoperInfo: {},
    markers: [],
  },
  getshopperDetail: function() {
    let params = {
      id: partnerId
    }
    // console.log('22',params)
    wx.showLoading({
      title: '正在加载',
    })
    let that = this;
    //console.log("3", that)

    http.post(api.getshopperDetailAPI, params).then(res => {
      let info = res.data;
      this.setData({
        shoperInfo: info
      })
      this.setData({
        markers: [{
          latitude: info.lat,
          longitude: info.lng,
        }]
      })
      WxParse.wxParse('shopperDetail', 'html', info.detail, that)

      wx.hideLoading()
    }).catch(msg => {
      wx.hideLoading()
    })

  },

  localtion: function() {
    const latitude = parseFloat(this.data.shoperInfo.lat)
    const longitude = parseFloat(this.data.shoperInfo.lng)
    console.log("11",latitude)
    wx.openLocation({
      latitude,
      name:'aaa',
      address:"ddd",
      longitude,
      scale: 18
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("11",options)
    partnerId = options.id
    this.getshopperDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})