// pages/PartnerDetail/PartnerDetail.js
//获取应用实例
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
var WxParse = require('../../libs/wxParse/wxParse.js');
let page = 1
let size = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    imgList:[]
  },

  // 获取公益联盟
  getPartnerList() {
    let id = this.data.id
    http.post(api.partnerAPI, { page, size }).then(res => {
      const thisList = res.data.list
      thisList.map(res=>{
        if(res.id == id){
          this.setData({
            list:res
          })
        }
      })
      let detail = this.data.list.detail
      let index = 1
      for(let i = 0; i<index;i++){
        if (detail.indexOf('< img')!=-1){
          detail = detail.replace("< img", "<img")
          index++
        }
      }
      WxParse.wxParse('detail', 'html', detail, this, 5);


      let imgs = this.data.list.imgs
      if (imgs) {
        let ind = imgs.indexOf('；')
        if (ind!=-1){
          imgs = imgs.replace("；", ";")
          const imgList = imgs.split(';')
          console.log(imgList)
          this.setData({ imgList })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({id})
    this.getPartnerList()
  },

})