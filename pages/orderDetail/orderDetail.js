// pages/orderDetail/orderDetail.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
var QRCode = require('../../utils/weapp-qrcode.js');
var qrcode = null;
let id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    orderName: '',
    amount: '',
    point: '',
    time: '',
    payType: '',
    code: '',
    state:false
  },
  /**
     * 创建二维码
     */
  createQRCode: function () {
    console.log('createQRCode')
    qrcode = new QRCode('canvas', {
      text:  this.data.code,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },
  saveInAlumbAction: function () {
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success: function () {
                wx.showToast({
                  title: '保存成功',
                })
              },
            })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    console.log('id',id)
    http.post(api.getOrderDetailAPI,{orderId:id}).then(res=>{
      console.log(res.data)
      const detail = res.data[0]
      let stateShow = (x) => {
        switch(x){
          case 1: return '已下单';
          case 2: return '已付款';
          case 6: return '已取消';
          case 7: return '已完成';
          default: return '状态异常';
        }
      } 
      this.setData({
        orderNo: detail.orderNo,
        orderName: detail.orderName,
        amount: detail.amount/100,
        point: detail.point,
        time: util.formatTime(new Date(detail.createTime)),
        payType: detail.payType,
        state: stateShow(detail.state),
        code: detail.code || '',
      })
      if (detail.code != null && detail.code.length > 0){
        this.createQRCode(detail.code)
      }
     
    }).catch(msg=>{
      console.error(msg)
    })
  },

})