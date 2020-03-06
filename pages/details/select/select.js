// pages/details/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: [
    ],
    typeSel: -1,
    activityId:0,
    id:0,
  },

  joinActivity: function () {
    let token = wx.getStorageSync('token')
    if (token.length == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    let params = {
      activityId: parseInt(activityId),
      standardId: this.data.id
    };
    console.log('1',params)
    wx.navigateTo({
      url: '/pages/notice/notice?activityId=' + activityId + '&standardId=' + this.data.id
    })
  },
  
})