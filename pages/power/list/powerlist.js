
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
let leveltype = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    powers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      leveltype = options.type;
    }
    this.getLevelPowerAction();
  },

  /**
   * 获取等级权益
   */
  getLevelPowerAction:function() {
    let params = {page:1 , size:100 , level: leveltype}
    http.post(api.getLevelPowerApi , params).then(res => {
      console.log(res)
      if (res.success) {
        this.setData({ powers: res.data });
      }
    }).catch(msg => {
      console.log(msg)
    });
  },


  todetailaction:function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/power/detail/powerdetail?id=' + id,
    });
  }

})