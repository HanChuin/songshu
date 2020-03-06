const http = require("../../../utils/http.js");
const api = require("../../../utils/api.js");
const qiniuUploader = require("../../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'
let uploadToken = ''
let hasMore = false;
var matchId = 0
let page = 1
let size = 30

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemArray: [{
      label: '表演',
      group: '小学组'
    }, {
      label: '表演',
      group: '初中组'
    }, {
      label: '表演',
      group: '高中组'
    }, {
      label: '写作',
      group: '小学组'
    }, {
      label: '写作',
      group: '初中组'
    }, {
      label: '写作',
      group: '高中组'
    }],
    matchUserInfo: {},
    voteState: 0,
    voteUsers: [],
    imgs: [],
    fromShare: false,
    codeImg: '',
    rowNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.id) {
      matchId = options.id
    }
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      let i = scene.indexOf('=')
      let y = scene.substring(0, i)
      let x = scene.substr(i + 1)
      matchId = x
      this.setData({
        fromShare: true
      })
    } else {
      if (options.type == 'lst') {
        this.setData({
          fromShare: false
        })
      } else {
        let lauchOptions = wx.getLaunchOptionsSync();
        console.log('getLaunchOptionsSync', lauchOptions);

        if (lauchOptions.scene == 1008 || lauchOptions.scene == 1007) {
          this.setData({
            fromShare: true
          })
        } else {
          this.setData({
            fromShare: false
          })
        }
      }
    }

    this.getProjectDetail();
    this.getQiniuToken();
    this.getQrcodeAPI();
    this.downloadImg();
    this.tipDialog();
  },
  onShow: function () {
    this.getProjectUserDetail()
  },

  // 公告
  tipDialog: function() {
    let content = '  网络投票阶段禁止刷票、水军等一系列不正当行为，一经发现，将取消相关作品的参赛资格。';
    wx.showModal({
      title: '公告',
      content: content,
      confirmText: '知道了',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  // 获取作品详情
  getProjectDetail: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    let params = {
      id: matchId,
      page,
      size
    }
    http.post(api.projectDetailAPi, params).then(res => {
      console.log(res)
      if (res.success) {
        let item = res.data.matchInfo;
        let rowNum = res.data.rowNo
        let zmimgs = []
        if (item.url) {
          if (item.url.indexOf(';') > -1) {
            let tems = item.url.split(';');
            item.furl = tems[0]

            tems.map((item, index) => {
              if (index > 0) {
                zmimgs.push(item)
              }
            })

          } else {
            item.furl = item.url
            zmimgs.push(item.url);
          }
        }
        if (res.data.voteUsers.length < size) {
          hasMore = false
        } else {
          hasMore = true
        }

        let oldusers = []
        if (page > 1) {
          oldusers = this.data.voteUsers
        }
        res.data.voteUsers.map(item => {
          oldusers.push(item)
        })

        if (res.data.matchInfo.projectId == 1) {
          rowNum = '写作组:第' + rowNum + '名'
        } else {
          rowNum = '表演组:第' + rowNum + '名'
        }

        this.setData({
          rowNo: rowNum,
          matchUserInfo: item,
          voteUsers: oldusers,
          imgs: zmimgs
        })
      }
      wx.hideLoading();
    }).catch(msg => {
      console.error(msg)
      wx.hideLoading();
    });
  },

  // 获取用户投票详情
  getProjectUserDetail: function() {
    let token = wx.getStorageSync('token')
    if (token && token != '') {
      http.post(api.projectUserDetailAPi, {
        id: matchId
      }).then(res => {
        console.log(res)
        if (res.success) {
          this.setData({
            points: res.data[0].points || 0,
          })
        }
      }).catch(msg => {
        console.error(msg)
      })
    }
  },

  // 获取七牛token
  getQiniuToken: function () {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      uploadToken = res.data
    }).catch(msg => {
      console.error(msg)
    })
  },

  uploadSmileAction: function() {
    let self = this
    // 登录判断
    let token = wx.getStorageSync('token')
    if (token && token != '') {

    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return
    }

    if (this.data.points > 0) {
      wx.showToast({
        title: '今日已投票!',
      });
      return;
    }

    wx.showActionSheet({
      itemList: ['上传自己的笑脸（3票）', '使用官方笑脸（1票）'],
      success: function(res) {
        if (res.tapIndex == 0) {
          self.chooseSmileAction();
        } else {
          self.voteAction('', 1);
        }
      },
      fail: function(e) {}
    })
  },

  chooseSmileAction: function() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths', tempFilePaths)
        self.uploadFile(tempFilePaths[0])
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.matchUserInfo.worksName,
      path: '/pages/match/votedetail/voteDetail?id=' + matchId + '&type=share',
      success: function(res) {},
      fail: function(res) {},
    }
  },

  // 上传图片
  uploadFile: function(filePath) {
    wx.showLoading({
      title: '开始上传',
    });
    let fileName = parseInt(new Date().getTime()) + '';
    let netPre = 'image/wyds/smile/' + fileName + '.jpg'
    let that = this;
    qiniuUploader.upload(filePath, res => {
      const imgUrl = qiniuImgUrl + res.imageURL
      that.voteAction(imgUrl, 2);
      wx.hideLoading();
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

  // 投票
  voteAction: function(smileUrl, type) {
    let params = {
      matchUserId: matchId,
      img: smileUrl,
      type,
      matchId
    }
    http.post(api.voteApi, params).then(res => {
      console.log('voteApi', res)
      wx.showToast({
        title: '投票完成！',
      });
      this.getProjectUserDetail()
      this.getProjectDetail()
    }).catch(msg => {
      console.error(msg)
    })
  },


  /**   
   * 预览图片  
   */
  previewImage: function(e) {
    var current = e.target.dataset.src;
    let allImgs = []
    allImgs.push(this.data.matchUserInfo.furl)
    // allImgs.concat(this.data.imgs)
    this.data.imgs.map(item => {
      allImgs.push(item)
    })

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: allImgs // 需要预览的图片http链接列表  
    })
  },

  // 页面跳转
  catCyds2Action: function() {
    wx.navigateTo({
      url: '/pages/news/news?url=' + encodeURIComponent('https://mp.weixin.qq.com/s?__biz=Mzg3MTE0MDY1NA==&mid=100002354&idx=1&sn=bb7f94951ab8d74a153b4d9373fdc4d8&chksm=4e82567379f5df65c6fa872c2fc7bc30f93221312db8f50b7b94cb631b46bd63593a581ff869#rd')
    });
  },

  // 跳转投票页
  chooseItemAction: function(e) {
    console.log(e)
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/pages/match/vote/vote?type=' + e.currentTarget.dataset.index,
    });
  },

  /* 获取二维码并下载 */
  getQrcodeAPI: function() {
    let that = this
    let scene = "id=" + matchId
    http.post(api.getQrcodeAPI, {
        scene,
        page: 'pages/match/votedetail/voteDetail',
        width: "320"
      })
      .then(res => {
        console.log('getQrcodeAPI', res)
        that.setData({
          codeImg: res.data
        })
        let codeImg = that.data.codeImg
        /* 下载 */
        wx.downloadFile({
          url: codeImg,
          success: function(res) {
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.setData({
                codeSrc
              })
            } else {
              that.setData({
                codeSrc: ''
              })
            }
          }
        })
      })
  },

  /* 海报是否显示 */
  myEventListener: function(e) {
    this.setData({
      showVideo: true
    })
  },

  /* 获取分享海报 */
  getSharePoster: function() {
    this.setData({
      showVideo: false
    })
    this.selectComponent('#getPoster').getAvaterInfo()
  },


  /* 下载图片 */
  downloadImg() {
    let that = this
    let imgUrl = "https://url.songshuqubang.com/image/wydc/conver/sharewyds_share.jpeg"
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function(res) {
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.setData({
              productSrc
            })
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              productSrc: ''
            })
          }
        }
      })
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom')
    if (hasMore) {
      page = page + 1;
      this.getProjectDetail();
    }
  },

})