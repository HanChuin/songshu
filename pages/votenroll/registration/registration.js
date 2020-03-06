// pages/votenroll/registration/registration.js
const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
const qiniuUploader = require("../../../utils/qiniuUpload.js");
const qiniuImgUrl = 'https://url.songshuqubang.com'
let globalData = app.globalData;


let imgsList = []
let imgListShow = []
let imgNum = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idValue: 0,
    nameValue: '', // 名称
    mobVal: '', // 联系电话
    desVal: '', //参赛介绍
    imgsVal: [], // 参赛图片(最多5张)
    taR: false,
    productInfo: {},
    imgsListLen: true,
    imgListShow: [], //imgs显示
    id: '',
    list: []
  },

  /* input失去焦点时使文字右对齐 */
  onBlur(e) {
    let detail = e.detail
    let name = e.currentTarget.dataset.name
    this.setData({
      taR: true
    })
    if (name == 'nameVal') {
      this.setData({
        nameValue: detail.value
      })
    }
    if (name == 'mobVal') {
      this.setData({
        mobVal: detail.value
      })
    }
  },

  /* 参赛介绍失去焦点时将value存放到data */
  textBlur(e) {
    let detail = e.detail
    this.setData({
      desVal: detail.value
    })
  },

  /* input获得焦点时使文字左对齐 */
  onFocus(e) {
    this.setData({
      taR: false
    })
  },

  /* 上传图片 */
  uploadPic() {
    let that = this;
    wx.chooseImage({
      count: 5 - imgNum,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let list = that.data.list
        let imglist = list.concat(res.tempFilePaths)
        that.setData({
          list: imglist
        })
        that.uploadFile()
      }
    });
  },

  uploadFile() {
    let filePath = this.data.list[imgNum]
    console.log(filePath)
    let fileName = parseInt(new Date().getTime() / 1000) + '';
    qiniuUploader.upload(filePath, res => {
      let imgUrl = qiniuImgUrl + res.imageURL
      console.log(imgUrl)
      imgListShow.push(imgUrl)
      imgsList.push(imgUrl)
      this.setData({
        imgsVal: imgsList,
        imgListShow: imgListShow
      })
      if (imgNum >= 4) {
        this.setData({
          imgsListLen: false
        })
      }
      imgNum++
      setTimeout(()=>{
        if (imgNum < this.data.list.length) {
          this.uploadFile()
        }
      },500)
      
    }, (error) => {
      console.log('error: ' + error);
    }, {
      region: 'ECN',
      domain: '',
      key: 'image/head/' + fileName + '.jpg',
      uptoken: this.data.uploadToken, // 由其他程序生成七牛 uptoken
    });
  },

  getQiniuToken: function() {
    http.post(api.getQiniuTokenUrl, {}).then(res => {
      this.setData({
        uploadToken: res.data
      })
    }).catch(msg => console.log(msg))
  },

  /* 删除图片 */
  delImg(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    const imgListShow = this.data.imgListShow
    const list = this.data.list
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          list.splice(index, 1);
          imgListShow.splice(index, 1);
          console.log(imgListShow)
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          imgListShow,
          list
        });
      }
    })

  },


  /* 提交报名 */
  submit() {
    let that = this
    let thatData = this.data;
    let userInfo = app.globalData.userInfo;
    let id = this.data.id
    let token = wx.getStorageSync('token')
    const data = {
      voteId: id,
      name: thatData.nameValue,
      phone: thatData.mobVal,
      images: thatData.imgsVal.join(','),
      introduce: thatData.desVal
    }
    console.log(data)
    if (!data.name) {
      wx.showToast({
        title: '请输入参赛名称',
        icon: 'none'
      })
      return
    }
    if (!data.phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return
    }
    if (!data.images) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (!data.introduce) {
      wx.showToast({
        title: '请输入参赛介绍',
        icon: 'none'
      })
      return
    }
    if (token.length > 0) {
      http.post(api.joinVoteAPI, data).then(res => {
        console.log(res.success)
        wx.navigateBack({

        });
      }).catch(msg => {
        console.error(msg)
      })
    } else {
      wx.navigateTo({
        url: '../../page/login/login'
      })
    }



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    let id = options.id
    this.setData({
      id
    })
    var self = this
    let token = wx.getStorageSync('token')

    this.getQiniuToken();

    this.setData({
      imgListShow: [],
      imgsVal: [],
      list: []
    })
    imgListShow = []
    imgsList = []
    imgNum = 0
  },

  changeName: function(e) {
    this.setData({
      nameValue: e.detail.value
    })
  },


  changePhone: function(e) {
    this.setData({
      mobVal: e.detail.value
    })
  },


  changeDesc: function(e) {
    this.setData({
      desVal: e.detail.value
    })
  },

})