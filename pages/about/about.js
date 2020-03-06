
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
var WxParse = require('../../libs/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetial();
  },

  // 获取详情
  getDetial() {
    let params = {
      key: 'about'
    }
    let that = this;
    http.post(api.getConfigUrl , params).then(res => {
      if (res.success) {
        let data = res.data;
        WxParse.wxParse('about', 'html', data.value , that , 5);
      }
    }).catch(msg => {
      console.error(msg);
    })
  }
 })