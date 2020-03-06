// pages/video/playvideo.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl:'',// 视频网络地址
    id:'',
    videos:[],
    video:[],
    more:[]
  },

/**************************** 获取数据 ****************************/

  /* 获取当前数据 */
  getVideo() {
    let id = this.data.id
    http.post(api.getVideoDetailAPI, { id }).then(res => {
      this.setData({
        videoUrl: res.data.videourl,
        video:res.data
      })
    }).catch(msg => console.log(msg))
  },

  /* 获取video */
  getVideoList() {
    http.post(api.getVideoListAPI, { page: 1, size: 5 }).then(res => {
      this.setData({
        videos: res.data
      })
      const more = []
      this.data.videos.map(item=>{
        if(item.id != this.data.id){
          more.push(item)
        }
      })
      this.setData({
        more
      })
    })
  },

  gotoVideo(e){
    let vid = e.currentTarget.dataset.id
    this.setData({
      vid
    })
    console.log(this.data.vid)
    wx.redirectTo({
      url: '../video/playvideo?id=' + vid,
    })
  },

/**************************** 生命周期 ****************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      id
    });
    this.getVideo() //获取视频列表数据
    this.getVideoList() //获取视频列表数据
  },
})