// pages/order/order.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: [],
    goodsId: '',
    goodsName: '',
    cover: '',
    point: '',
    amount: '',
    num: 1,
    name: '',
    address: '请选择收货地址',
    tel: '',
    totalPrice: 0,
    tradeNo: '',
    type: false,
    both:true,
    action:true
  },

  click:function(){
    this.setData({
      action: false
    })
  },
  onclick: function () {
    this.setData({
      action: true
    })
  },

  // 选择地址
  selectAddress: function() {
    let self = this;
    wx.getSetting({
      success: function(res) {
        console.log(res.authSetting["scope.address"])
        if (res.authSetting["scope.address"]) {
          self.getAddress()
        } else {
          wx.authorize({
            scope: 'scope.address',
            success() {
              self.getAddress()
            }
          })
        }
      }
    })
  },
  // 获取地址
  getAddress: function() {
    let self = this;
    wx.chooseAddress({
      success: function(res) {
        self.setData({
          name: res.userName,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          tel: res.telNumber,
        })
        wx.setStorage({
          key: 'defaultAddress',
          data: JSON.stringify({
            name: res.userName,
            address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            tel: res.telNumber
          }),
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  // 支付
  toOrderDetail: function () {
    let params = {
      addresss: this.data.address,
      userName: this.data.name,
      goodsId: this.data.goodsId
    }
    console.log(params)
    http.post(api.createOrderUrl, params).then(res => {
      //console.log(res)
      if (res.success) {
        let rs = res.data;
        if (rs.length < 1) {
          wx.showToast({
            title: '兑换成功!'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../../orderList/orderList',
            })
          }, 1200)
        } else {
          this.createWxOrderAction(rs.id)
          this.setData({
            tradeNo: rs.tradeNo
          })
        }
      }
    }).catch(msg => {
      console.error(msg)
    })
  },
  // 创建订单
  createWxOrderAction: function (id) {
    let params = {
      tradeId: id
    }
    http.post(api.createWxOrderUrl, params).then(res => {
      console.log(res.data)
      let payment = res.data;
      this.payAction(payment)
    }).catch(msg => {
      console.error(msg)
    })
  },
  // 跳转订单页
  payAction: function (payment) {
    let that = this;
    payment.complete = function () {
      wx.redirectTo({
        url: '/pages/order/order-result/order-result?tradeNo=' + that.data.tradeNo,
      })
    }
    wx.requestPayment(payment);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("qq", options)
    let goodsId = options.id
    let exchangeType = options.type

    if (exchangeType == 1 || exchangeType ==3) {
      this.setData({
        type: true
      })
    }
    if (exchangeType == 3){
      this.setData({
        both:false
      })
    }

    http.post(api.getShopDetailAPI, {
      goodsId: goodsId
    }).then(res => {
      console.log(res.data)
      let rs = res.data
      this.setData({
        goodsName: rs.goodsName,
        point: rs.point,
        amount: rs.amount / 100,
        totalPrice: (rs.amount / 100) * this.data.num,
        goodsId: goodsId,
        cover: rs.seqimg
      })
    }).catch(msg => {
      console.error(msg)
    })
   
  },

})