const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover1: "https://url.songshuqubang.com/activity/cover/20191113162926.jpg",
    cover2: "https://url.songshuqubang.com/activity/cover/20191120172610.jpg",
    codeImg: "https://qrimg.songshuqubang.com/20191205165335.jpg",
    userHead: "https://url.songshuqubang.com/image/head/1569480753.jpg",
    name: "我活动名称我活动名我活动名称我活动名",
    address: "江苏省苏州市张家港市人民中路151号金城大厦4楼",
    activeTime: "2019年3月6日 7:00 - 8:00",
    productSrc: "",
    codeSrc: "",
    userSrc: "",
    userName: '小明同学',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.downloadAllFile();
  },

  /**
   * 下载所有文件
   */
  downloadAllFile: function() {
    let self = this
    console.log(app.globalData.userInfo)
    wx.downloadFile({
      url: self.data.cover2,
      success: function(res) {
        console.log('下载完成1')
        if (res.statusCode === 200) {
          var productSrc = res.tempFilePath;
          console.log('productSrc', productSrc)
          self.setData({
            productSrc
          })
        }
      }
    });

    wx.downloadFile({
      url: self.data.codeImg,
      success: function(res) {
        console.log('下载完成2')
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          console.log('codeSrc', codeSrc)
          self.setData({
            codeSrc
          })
        }
      }
    });


    wx.downloadFile({
      url: self.data.userHead,
      success:function(res) {
        if (res.statusCode === 200) {
          var userSrc = res.tempFilePath;
          self.setData({
            userSrc
          })
        }
      }
    })

  },

  toast1: function() {
    console.log('toast1')
    // this.setData({
    //   showVideo: false
    // })
  
    this.selectComponent('#getPoster2').getAvaterInfo1()
  },

  toast2: function() {
    console.log('toast2')
    this.selectComponent('#getPoster2').getAvaterInfo()
  }

})