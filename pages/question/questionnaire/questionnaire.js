// pages/questionnaire/questionnaire.js

const app = getApp()
const http = require('../../../utils/http.js')
const api = require('../../../utils/api.js')
let page = 1
let size = 10
let id = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: '',
    list: {},
    actList: {}
  },

  /*********************** API获取数据 ***********************/
  /* 获取问卷详情 */
  getActivityList() {
    let that = this
    http.post(api.getActivityDetailAPI, {
      id
    }).then(res => {
      this.setData({
        actList: res.data
      })
    })
  },

  /* 获取问题列表 */
  getQuestionList() {
    http.post(api.getProblemListAPI, {
      id,
      page,
      size
    }).then(res => {
      let count = res.data.count
      const list = res.data.rows
      list.map(item => {
        let items = item.items
        var ansItems
        const answer = []
        if (items) {
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
      })
      this.setData({
        count,
        list
      })
    })
  },

  /*********************** 页面跳转 ***********************/

  /************************* 调用函数 *************************/

  /* 监听单选框变化 */
  radioChange(e) {},
  radioTap(e) {
    let fId = e.currentTarget.dataset.fid
    let id = e.currentTarget.dataset.id
    const list = this.data.list
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
  checkboxChange(e) {
  },
  checkboxTap(e) {
    let fId = e.currentTarget.dataset.fid
    let id = e.currentTarget.dataset.id
    const list = this.data.list
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

  /* 监听文本变化 */
  textInput(e) {
    let fId = e.currentTarget.dataset.fid
    let value = e.detail.value
    const list = this.data.list
    list.map(item => {
      if (item.id == fId) {
        item.answer = value
      }
    })
  },

  /* 监听form提交 */
  formSubmit() {
    /* 判断是否提交过该问卷 */
    // http.post(api.questionCheckAPI, { questionId: id }).then(res => {
    //   console.log(res.data)
    //   if (res.data) {
    //     wx.showToast({
    //       title: '您已填过此问卷',
    //       icon: 'none'
    //     })
    //     return
    //   } 
    // })

    const list = this.data.list
    // console.log(list)
    let ansAll = true
    let self = this
    for(let i = 0; i < list.length; i++){
      let type = list[i].type
      let item = list[i]
      let index = i
      // 单选
      if (type == 1) {
        let iscom = self.checkAnswer(item.answer);
        if (!iscom) {
          ansAll = false;
          wx.showToast({
            title: '第' + (index + 1) + '问题未完成',
            icon: 'none'
          })
          return
        }
      } 
      // 复选
      if (type == 2) {
        let iscom = self.checkAnswer(item.answer);
        if (!iscom) {
          ansAll = false;
          wx.showToast({
            title: '第' + (index + 1) + '问题未完成',
            icon: 'none'
          })
          return
        }
      } 
      // 填空
      if (type == 3) {
        console.log('type == 3')
        console.log(typeof (item.answer))
        if (typeof (item.answer) == 'object' || item.answer.trim() === '') {
          ansAll = false;
          wx.showToast({
            title: '第' + (index + 1) + '问题未完成',
            icon: 'none'
          })
          return
        }
      }

    }

    let retAns = []
    // 答案收集
    list.map((item, index) => {
      let type = item.type
      
      if (type === 1 || type === 2) {
        retAns.push({ id: item.id, answer: self.getAnswer(item.answer)});
      }

      if (type === 3) {
        if(item.answer.length == 0){
          item.answer = ''
        }
        retAns.push({ id: item.id, answer: item.answer})
        console.log(item.answer)
      }

    });
    let params = { questionId: id, answer: JSON.stringify(retAns) };
    console.log(params)
    console.log(ansAll)
    if (ansAll){
      http.post(api.submitAPI, params).then(res => {
        console.log(res)
        wx.redirectTo({
          url: '/pages/question/feedbacks/feedbacks',
        })
      }).catch(msg => {
        console.log(msg)
      })
    }
  },

/**
 * 检查单选 / 多选 是否完整
 */
  checkAnswer:function(array) {
    let isCom = false;
    array.map(item => {
      if (item.checked){
        isCom = true
      }
    })
    return isCom;
  },

  /**
   * 获取答案
   */
  getAnswer:function(array) {
    let ans = [];
    array.map(item => {
      if (item.checked){
        ans.push(item.answer)
      }
    })
    return ans.join(';')
  },

  /* 监听form重置 */
  formReset() {
  },

  /************************* 生命周期 *************************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id
    this.getQuestionList()
    this.getActivityList()
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

  }

})