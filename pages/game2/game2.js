const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
const qiniuUploader = require("../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'
let uploadToken = ''
let id = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topopacity: 1, //顶部透明度
    videos: [],
    name: '添加您的作品名称',
    desc: '添加您的作品描述',
    info: {},
    projectUrl: 'https://url.songshuqubang.com/image/wyds/cover/z1_meitu_1.png',
    projectId: 0,
    type: 0, // 个人1 / 团队2
    teamUsers:['','','','']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getQiniuToken();
    id = options.id;
    this.getMatch();
  },

  // 获取七牛token
  getQiniuToken: function () {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      uploadToken = res.data
    }).catch(msg => {
      console.error(msg)
    })
  },

  // 获取文艺大赛详情
  getMatch: function() {
    http.post(api.detailMatchApi, {
      id
    }).then(res => {
      console.log(res)
      if (res.success) {
        let projectId = res.data.projectId
        let type = res.data.type;
        if (type == 2) {
          this.getTeamUser()
        }
        let purl = ''
        if (projectId == 1) {
          purl = 'https://url.songshuqubang.com/image/wyds/cover/z2_meitu_2.png'
        } else if (projectId == 2) {
          purl = 'https://url.songshuqubang.com/image/wyds/cover/z3_meitu_3.png'
        } else if (projectId == 3) {
          purl = 'https://url.songshuqubang.com/image/wyds/cover/z4_meitu_4.png'
        } else if (projectId == 4) {
          purl = 'https://url.songshuqubang.com/image/wyds/cover/z5_meitu_5.png'
        }
        this.setData({
          info: res.data,
          projectUrl: purl,
          projectId,
          type
        })
      }

    }).catch(msg => {
      console.error(msg)
    });
  },

  // 获取组员
  getTeamUser:function() {
    http.post(api.teamUserApi,{id}).then(res => {
      console.log(res.data)
      let users = res.data
      let temps = []
      for(let i = 0 ; i < 4 ; i++) {
        if (i < users.length) {
          temps[i] = users[i].user.headImg
        } else {
          temps[i] = ''
        }
      }
      this.setData({
        teamUsers: temps
      })
    }).catch(msg => {

    });
  },

  chooseImage: function() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      success: function(res) {
        console.log(res)
        let tempFiles = res.tempFilePaths;
        let imgItem = {
          filePath: tempFiles[0],
          upload: false,
          type:'img'
        }
        let temps = self.data.videos;
        temps.push(imgItem)
        self.setData({
          videos: temps
        });
      },
    })
  },

  chooseVideo: function() {
    let self = this
    wx.chooseVideo({
      camera: 'back',
      compresse: true,
      maxDuration: 59,
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        let videoItem = {
          filePath: res.tempFilePath,
          upload: false,
          type: 'video'
        }
        let temps = self.data.videos;
        temps.push(videoItem)
        self.setData({
          videos: temps
        });
      },
      fail: function(e) {
        console.log(e)
      }
    })
  },

  delItemAction: function(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let temps = this.data.videos;
    temps.splice(index, 1);
    this.setData({
      videos: temps
    })
  },

  uploadFile: function(index) {
    wx.showLoading({
      title: '开始上传',
    });
    let item = this.data.videos[index]
    // 上传文件
    let filePath = item.filePath;
    let type = item.type;
    let netPre =''
    let fileName = parseInt(new Date().getTime()) + '';
    if (type == 'img') {
      netPre = 'image/wyds/' + fileName + '.jpg'
    } else {
      netPre = 'video/wyds/' + fileName + '.mp4'
    }
    let that = this;
    
    qiniuUploader.upload(filePath, res => {
      let temps = that.data.videos;
      temps[index].upload = true
      temps[index].url = qiniuImgUrl + res.imageURL
      this.setData({
        videos: temps
      })
      wx.hideLoading();
      //
      that.uploadAllFiles();
    }, (error) => {
      console.log('error: ' + error);
      wx.hideLoading();
    }, {
      region: 'ECN',
      domain: '', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
      key: netPre, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
      // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
      uptoken: uploadToken, // 由其他程序生成七牛 uptoken
    });
  },

  editNameAction: function(e) {
    wx.navigateTo({
      url: '../editPage/editPage?type=name',
    })
  },

  editDesAction: function() {
    wx.navigateTo({
      url: '../editPage/editPage?type=desc',
    })
  },

  uploadAllFiles: function() {
    if (this.data.videos.length > 0) {
      // 开始上传
      let self = this
      let allF = true

      for (let index = 0; index < this.data.videos.length; index++){
        if (!this.data.videos[index].upload) {
          self.uploadFile(index)
          allF = false
          break;
        }
      }

      if (allF) {
        this.updateMatch();
      }
    }
  },

  updateMatch: function() {
    let urlitem = []
    if (this.data.videos.length == 0) {
      wx.showToast({
        title: '作品不能为空',
      })
      return
    }
    this.data.videos.map(item => {
      urlitem.push(item.url);
    });

    if (this.data.name == '添加您的作品名称') {
      wx.showToast({
        title: '请添加您的作品名称',
      })
      return
    }

    if (this.data.desc == '添加您的作品描述') {
      wx.showToast({
        title: '请添加您的作品描述',
      })
      return
    }

    let params = {
      id: id,
      url: urlitem.join(';'),
      worksName: this.data.name,
      worksDescription: this.data.desc
    }
    http.post(api.updateMatchApi, params).then(res => {
      console.log(res)
      wx.showToast({
        title: '作品上传成功',
      });
      wx.navigateBack({
      });
    }).catch(msg => {
      console.error(msg)
    });
  },

  onShareAppMessage: function (obj) {
    return {
      title: '一起来组队',
      path: '/pages/gameTeam/gameTeam?id=' + id,
      success: function (res) { },
      fail: function (res) { },
    }
  },

})