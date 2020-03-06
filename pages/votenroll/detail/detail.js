// pages/votenroll/detail/detail.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')

let pageIndex = 1 // 定义getListAPI 的page参数
let pageSize = 10 // 定义getListAPI的size参数
let id = ''
let num = 0;
let voteId = ''
// let no = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteDetailList: [],
    thisList: {},
    id: 0,
    cover: false,
    num: 0,
    showVideo: false,

    fromShare: false,

    productSrc: '',//下载图片
    codeSrc: ''//下载二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that = this
    if (options.scene){
      this.setData({
        fromShare: true
      })
      let scene = decodeURIComponent(options.scene)
      let i = scene.indexOf('id')
      let j = scene.indexOf('no')

      let a = scene.substring(i,j-1)
      
      let ai = a.indexOf('=')
      let ay = a.substring(0, ai)
      let ax = a.substr(ai + 1)
      id = ax


      let b = scene.substr(j)

      let bi = b.indexOf('=')
      let by = b.substring(0, bi)
      let bx = b.substr(bi + 1)
      num = bx

    }else {
      id = options.id
      num = options.no;
    }

    this.setData({
      id,
      num
    })

    this.getVoteList()
    this.getQrcodeAPI()

  },

  /* 下载图片 */
  downloadImg() {
    let that = this
    let imgUrl = this.data.voteDetailList.img
    console.log(imgUrl)
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({ productSrc })
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
            that.setData({ productSrc: '' })
          }
        }
      })
    }
  },

  getQrcodeAPI() {
    let that = this
    console.log(id,num)
    http.post(api.getQrcodeAPI, {
      scene: 'id='+id+'/no='+num,
      page: 'pages/votenroll/detail/detail',
      width: 320
    })
      .then(res => {
        let codeImg = res.data
        that.setData({ codeImg })
        /* 下载 */
        wx.downloadFile({
          url: codeImg,
          success: function (res) {
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.setData({ codeSrc })
            } 
          }
        })
      })
  },


  getSharePoster: function () {
    this.setData({ showVideo: false })
    this.selectComponent('#getPoster').getAvaterInfo()
  },

  myEventListener: function (e) {
    this.setData({ showVideo: true })
  },

  getVoteList() {
    let id = this.data.id
    http.post(api.attendDetailAPI, {
      id
    }).then(res => {
      voteId = res.data.voteId
      const list = res.data
      if (list.images != null && list.images != ''){
        const imgUrlList = list.images.split(',')
        let img = imgUrlList[0]
        list.img = img
        list.imgsList = imgUrlList
      } else {
        list.images = '/img/withoutImg2.png'
        list.img = '/img/withoutImg2.png'
        list.imgsList = ['/img/withoutImg2.png']
      }
      
      this.setData({
        voteDetailList: list
      })
      this.downloadImg()
      this.stopPullRefresh()
    })
  },

  /* 停止下拉刷新 */
  stopPullRefresh() {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
      }
    })
  },
  
  //////////////////////////////////////////////////////////////

  /* 投票 */
  vote() {
    let token = wx.getStorageSync('token')
    if (token) {
      let id = this.data.id
      http.post(api.castVoteAPI, {
        id
      }).then(res => {
        this.getVoteList()
        setTimeout(() => {
          wx.showToast({
            title: res.success ? "投票成功" : "投票失败",
            duration: 2000
          })
        }, 100);
      
      }).catch(msg => {
        console.log(msg)
      })
    } else {
      wx.showToast({
        title: '您还未登录',
        duration: 2000
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)

    }
  },

  /* 回首页 */
  goToJoin() {
    wx.navigateTo({
      url: '/pages/votenroll/votenroll?id=' + voteId,
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getVoteList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let path = '/pages/votenroll/detail/detail?id=' + this.id + '&no=' + num;
    console.log('path', path)
    return {
      imageUrl: this.data.voteDetailList.img,
      title: this.data.voteDetailList.name,
      path: path,
      success: function (res) {},
      fail: function (res) {},
    }
  }
})