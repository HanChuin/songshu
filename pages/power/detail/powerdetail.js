/**
 * 积分权益
 */
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
const WxParse = require('../../../libs/wxParse/wxParse.js');

let token = "";
let id = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    btnStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      id = options.id
    }
    this.getPowerDetail()
  },

  getPowerDetail: function() {
    let params = {
      id
    }
    http.post(api.getPowerDetailApi, params).then(res => {
      if (res.success) {
        
        WxParse.wxParse('powerDetailInfo', 'html', res.data.detail, this);
        let type = res.data.type;
        let btnStr = '' 
        if (type == 1) {
          // 领取
          btnStr = '立即领取'
        } else if (type == 2) {
          // 兑换积分获取卡券
          btnStr = '立即领取'
        } else if (type == 3) {
          // 出示身份权益
          btnStr = '出示等级信息'
        } 
        this.setData({
          info: res.data,
          btnStr
        });

      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  onShow: function() {
    token = wx.getStorageSync('token');
    if (token !== '') {
      
    }
  },

  convert:function() {
    if (token === '') {
      wx.showToast({
        title: '请先登录',
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }

    let params = {
      power_id: id
    }
    http.post(api.getPowerApi,params).then(res => {
      console.log(res)
    }).catch(msg => {
      console.log(msg)
    });
  }
  
})