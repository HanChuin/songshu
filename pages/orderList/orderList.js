// pages/orderList/orderList.js
const http = require("../../utils/http.js");
const api = require("../../utils/api.js");
const utils = require("../../utils/util.js");

let pageIndex = 1;
let pageSize = 10;
let hasMore = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    index: 1
  },

  // 获取订单数据
  getData: function() {
    let orderdata = this.data.orderData;
    let data= {
      page: pageIndex,
      size: pageSize,
      state: this.data.index
    }
    http.post(api.getOrderListAPI,data).then(res=>{
      if(res.data.length<pageSize){
        hasMore = false
      } else {
        hasMore = true
      }
      if(pageIndex==1){
        orderdata = res.data
      }else {
        orderdata = orderdata.concat(res.data)
      }
      orderdata.map(item=>{
        item.formatTime = utils.formatTime(new Date(item.createTime))
      })
      this.setData({
        orderData: orderdata
      })
      wx.stopPullDownRefresh();
    }).catch(msg=>{
      console.error(msg)
    })
  },

  // 跳转订单详情
  toOrderDetail: function(e) {
    let index = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id='+index,
    })
  },

  changeIndex: function(e){
    let selIndex = e.currentTarget.dataset.index;
    this.setData({
      index: selIndex
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageIndex=1;
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(hasMore){
      pageIndex++
      this.getData()
    }
  },
})