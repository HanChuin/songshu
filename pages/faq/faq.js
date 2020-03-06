// pages/faq/faq.js
const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')

let pageIndex = 1
let pageSize = 10
let hasMore = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemData: [],
    userName: '',
    idShowAns:false,
    thisQues:{}
  },


  // 获取页面数据
  getSysUserInfo: function() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token.length > 0) {
      http.post(api.userInfoAPI, {}).then(res => {
        let userName = res.data.userName
        that.setData({
          userName
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

  // 获取常见问题数据
  getData: function () {
    let temps = this.data.data
    let data = {
      page: pageIndex,
      size: pageSize
    }
    http.post(api.getQuestionUrl, data).then(res => {
      const problem = [{
        id: '1',
        name: '小程序',
        icon: 'https://url.songshuqubang.com/micsoft/img/faqXCX.png',
        ans: []
      },
      {
        id: '2',
        name: '加入活动',
        icon: 'https://url.songshuqubang.com/micsoft/img/faqJRHD.png',
        ans: []
      },
      {
        id: '3',
        name: 'WOW积分',
        icon: 'https://url.songshuqubang.com/micsoft/img/faqJF.png',
        ans: []
      },
      ]
      const quesList = res.data
      quesList.map(item => {
        item.question = item.question.slice(2)
      })
      console.log(quesList)
      problem.map(res => {
        const ans = res.ans
        const result = res
        let pid = result.id
        quesList.map(item => {
          if (pid == item.type) {
            ans.push(item)
          }
        })
      })

      this.setData({
        problem
      })

      wx.stopPullDownRefresh()
      if (res.data.length < pageSize) {
        hasMore = false
      } else {
        hasMore = true
      }
      if (pageIndex == 1) {
        temps = res.data
      } else {
        temps = temps.concat(res.data)
      }
      temps.map(item => {
        item.isHidden = true
      })
      this.setData({
        problemData: temps,
      })
    }).catch(msg => {
      console.error(msg)
    })
  },

  showAns(e){
    console.log(e.currentTarget.dataset)
    let tag = e.currentTarget.dataset.tag
    let id = e.currentTarget.dataset.id
    this.setData({
      idShowAns:true
    })
    const list = this.data.problem
    const newList = new Object
    list.map(item=>{
      if(item.id == tag){
        const ques = item.ans
        ques.map(res=>{
          if(res.id == id){
            newList.id = res.id
            newList.ques = res.question
            newList.ans = res.answer
          }
        })
      }
    })
    this.setData({
      thisQues: newList
    })
  },

  close(){
    this.setData({
      idShowAns: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSysUserInfo()
    this.getData()
  },

})