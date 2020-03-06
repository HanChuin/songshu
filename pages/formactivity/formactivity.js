/* 问卷基本形式 */
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
let id = 0;
const qiniuUploader = require("../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'
let uploadToken = ''
let allFile = [] // 所有待上传的文件
let token = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: undefined,
    topopacity: 1,
    problems: [],
    btnStr: '提交',
    hasJoin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      id = options.id;
    }
    this.getDetail();
    this.getProblems();
    this.getQiniuToken();
  },

  onShow: function () {
    token = wx.getStorageSync("token")
    if (token != '') {
      this.getUserFormActivity()
    }
  },

  // 获取问题列表
  getProblems: function() {
    http.post(api.getProblemsApi, {
      id
    }).then(res => {
      console.log(res)
      if (res.success) {
        const list = res.data
        list.map(item => {
          let items = item.items
          console.log(items)
          // 上传文件类型
          if (item.type == 5 || item.type == 6) {
            item.params = JSON.parse(items);
            item.chooseImgs = []
          } else {
            var ansItems
            const answer = []
            if (items && items.length > 0) {
              ansItems = items.split(';')
              let id = 0
              ansItems.map(item => {
                answer.push({
                  "answer": item,
                  "checked": false,
                  id
                })
                id++
              })
            } else {
              ansItems = ''
            }
            item.ans = ansItems
            item.answer = answer
          }

        })
        this.setData({
          count: list.length,
          problems: list
        });

      }
    }).catch(msg => {
      console.log(msg)
    })
  },

  // 获取活动详情
  getDetail: function() {
    http.post(api.formActivityDetailApi, {
      id
    }).then(res => {
      console.log('getDetail', res)
      if (res.success) {
        this.setData({
          info: res.data
        });
      }
    }).catch(msg => {
      console.log(msg)
    });
  },

  // 获取用户的活动信息
  getUserFormActivity: function () {
    http.post(api.userActivityApi, { id }).then(res => {
      if (res.success) {
        if (res.data > 0) {
          // 
          this.setData({
            btnStr: '已报名',
            hasJoin: true
          })
        }
      }
    }).catch(msg => {

    })
  },

  // 获取七牛token
  getQiniuToken: function () {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      uploadToken = res.data
    }).catch(msg => {
      console.error(msg)
    })
  },

  /* 监听文本变化 */
  textInput(e) {
    let fId = e.currentTarget.dataset.fid
    let value = e.detail.value
    const list = this.data.problems
    list.map(item => {
      if (item.id == fId) {
        item.answer = value
      }
    })
    console.log(this.data.problems)
  },

  /* 监听单选框变化 */
  radioChange(e) {},
  radioTap(e) {
    let fId = e.currentTarget.dataset.fid
    let id = e.currentTarget.dataset.id
    const list = this.data.problems
    list.map(item => {
      if (item.id == fId) {
        const answer = item.answer
        answer.map(item => {
          item.checked = false
          if (item.id == id) {
            item.checked = true
          }
        })
      }
    })

  },

  /* 监听复选框变化 */
  checkboxChange(e) {},
  checkboxTap(e) {
    let fId = e.currentTarget.dataset.fid
    let id = e.currentTarget.dataset.id
    const list = this.data.problems
    list.map(item => {
      if (item.id == fId) {
        const answer = item.answer
        answer.map(item => {
          if (item.id == id) {
            item.checked = !item.checked
          }
        })
      }
    })
  },

  // 选择图片
  chooseImage: function(e) {
    let fId = e.currentTarget.dataset.fid
    console.log('fid', fId)
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
          type: 'img',
          fId: fId,
        }
        let list = self.data.problems
        list.map(item => {
          if (item.id == fId) {
            let temps = item.chooseImgs
            temps.push(imgItem)
            item.chooseImgs = temps
          }
        });
        console.log(list)
        self.setData({
          problems: list
        })

      },
    })
  },

  // 选择视频
  chooseVideo: function(e) {
    let fId = e.currentTarget.dataset.fid
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
          type: 'video',
          fId: fId
        }

        let list = self.data.problems
        list.map(item => {
          if (item.id == fId) {
            let temps = item.chooseImgs
            temps.push(videoItem)
            item.chooseImgs = temps
          }
        });
        console.log(list)
        self.setData({
          problems: list
        })

      },
      fail: function(e) {
        console.log(e)
      }
    })
  },

  // 删除项
  delItemAction: function(e) {
    let fId = e.currentTarget.dataset.fid
    let index = e.currentTarget.dataset.index
    let list = this.data.problems
    list.map(item => {
      if (item.id == fId) {
        item.chooseImgs.splice(index, 1);
      }
    });
    this.setData({
      problems: list
    })
  },

  // 提交按钮
  submit: function() {
    // 判断登录状态
    if (token == '' || token == undefined) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/login/login',
      });
    } else {
      let ansAll = this.checkEmpty()
      if (ansAll) {
        // 上传文件
        let lst = this.data.problems
        allFile = [];
        lst.map(item => {
          if (item.type == 5 || item.type == 6) {
            item.chooseImgs.map(one => {
              allFile.push(one)
            })
          }
        })
        console.log(allFile)
        this.uploadAllFiles()
      }
    }
  },

  // 检查是否都填完
  checkEmpty: function() {
    let ansAll = true
    let list = this.data.problems
    let self = this
    list.map(item => {
      let type = item.type
      // 单选
      if (type == 3) {
        let iscom = self.checkAnswer(item.answer);
        if (!iscom) {
          ansAll = false;
          wx.showToast({
            title: item.label + '未填写',
            icon: 'none'
          })
          return
        }
      }
      // 复选
      if (type == 4) {
        let iscom = self.checkAnswer(item.answer);
        if (!iscom) {
          ansAll = false;
          wx.showToast({
            title: item.label + '未填写',
            icon: 'none'
          })
          return
        }
      }
      // 填空
      if (type == 1 || type == 2) {
        if (typeof(item.answer) == 'object' || item.answer.trim() === '') {
          ansAll = false;
          wx.showToast({
            title: item.label + '未填写',
            icon: 'none'
          })
          return
        }
      }

      //文件
      if (type == 5 || type == 6) {
        let chooseItems = item.chooseImgs
        if (chooseItems.length == 0) {
          ansAll = false;
          wx.showToast({
            title: item.label + '未选择',
            icon: 'none'
          })
          return
        }
      }

    });

    return ansAll;
  },

  // 上传所有的文件
  uploadAllFiles: function() {
    // 开始上传
    let self = this
    let allF = true
    for (let index = 0; index < allFile.length; index++) {
      if (!allFile[index].upload) {
        self.uploadFile(index)
        allF = false
        break;
      }
    }
    if (allF) {
      this.sumbitAnswer()
    }
  },

  /* 提交 */
  sumbitAnswer: function() {
    let retAns = []
    let list = this.data.problems;
    let self = this
    // 答案收集
    list.map((item, index) => {
      let type = item.type
      if (type === 3 || type === 4) {
        retAns.push({
          id: item.id,
          answer: self.getAnswer(item.answer)
        });
      }
      if (type === 1 || type == 2) {
        if (item.answer.length == 0) {
          item.answer = ''
        }
        retAns.push({
          id: item.id,
          answer: item.answer
        })
      }

      if (type == 5 || type == 6) {
        let furls = []
        allFile.map(one => {
          if (one.fId == item.id) {
            furls.push(one.url)
          }
        });
        retAns.push({
          id: item.id,
          answer: furls.join(';')
        })
      }
    });
    console.log(retAns)
    let params = {
      id,
      answer: JSON.stringify(retAns)
    };
    http.post(api.submitApi, params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '提交成功',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(msg => {
    })
  },

  /**
   * 获取答案
   */
  getAnswer: function(array) {
    let ans = [];
    array.map(item => {
      if (item.checked) {
        ans.push(item.answer)
      }
    })
    return ans.join(';')
  },

  uploadFile: function(index) {
    wx.showLoading({
      title: '开始上传',
    });
    let item = allFile[index]
    // 上传文件
    let filePath = item.filePath;
    let type = item.type;
    let netPre = ''
    let fileName = parseInt(new Date().getTime()) + '';
    if (type == 'img') {
      netPre = 'image/formactivity/' + fileName + '.jpg'
    } else {
      netPre = 'video/formactivity/' + fileName + '.mp4'
    }
    let that = this;

    qiniuUploader.upload(filePath, res => {

      allFile[index].upload = true
      allFile[index].url = qiniuImgUrl + res.imageURL

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

  /**
   * 检查单选 / 多选 是否完整
   */
  checkAnswer: function(array) {
    let isCom = false;
    array.map(item => {
      if (item.checked) {
        isCom = true
      }
    })
    return isCom;
  },

  /* ****************************************************** */

  /* 表单提交 */
  // formSubmit() { },

  /* 监听form重置 */
  // formReset() { },

})