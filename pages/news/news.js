// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.url)
    this.setData({
      webUrl: decodeURIComponent(options.url)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/news/news?url=' + encodeURIComponent(this.data.webUrl),
      success: function (res) {},
      fail: function (res) {},
    }
  }
})