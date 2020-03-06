// pages/index/city/city.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    cityData: null,
    cityList: [],
    cityList2: []
  },

  // 切换城市
  setCityText(city) {
    let text = city
    if (text.charAt(text.length - 1) === '市') {
      text = text.substring(0, text.length - 1)
    }
    return text
  },

  // 获取城市列表数据
  getCityList() {
    http.post(api.getCityListApi, {
      page: 1,
      size: 10
    }).then(res => {
      console.log(res)
      let cityList = res.data.list
      let cityList2 = res.data.list2
      cityList.map(data=>{
        data.name = this.setCityText(data.name)
      })
      cityList2.map(data => {
        data.name = this.setCityText(data.name)
      })
      this.setData({
        cityList,
        cityList2,
      })
    })
  },

  // 获取城市查询数据
  getCity() {
    let city = wx.getStorageSync('city')
    this.setData({
      city
    })
    http.post(api.getCityApi, {
      name: city
    }).then(res => {
      console.log(res)
      let cityData = res.data
      cityData.name = this.setCityText(cityData.name)
      this.setData({
        cityData
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        cityData: null
      })
    })
  },

  // 修改城市
  changeCity: function(e) {
    let cityId = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    console.log(cityId)
    console.log(name)
    wx.setStorageSync('city', name)
    wx.setStorageSync('cityId', cityId)
    http.post(api.getCityApi, {
      name
    }).then(res => {
      console.log(res)
      this.setData({
        cityData: res.data, 
        city: name
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCity()
    this.getCityList()
  },

})