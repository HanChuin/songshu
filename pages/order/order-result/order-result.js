// pages/order/order-result/order-result.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: {},
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.tradeNo)
    http.post(api.checkOrderAPI, { trade_no: options.tradeNo}).then(res=>{
      console.log(res)
      if (res.data.result_code === 'SUCCESS') {
        this.setData({
          orderData: res.data,
          content: res.data.trade_state_desc
        })
      }
    }).catch(msg=>{
      console.error(msg)
    })
  },

})