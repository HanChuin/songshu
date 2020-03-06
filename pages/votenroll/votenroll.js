// pages/votenroll/votenroll.js

const app = getApp()
const http = require('../../utils/http.js')
const api = require('../../utils/api.js')
import {formaTime,countDown,clearTimeOut} from '../../utils/common.js'
var WxParse = require('../../libs/wxParse/wxParse.js');

var page = 1
var size = 10
let i = 1
let timeSet = undefined;
let orderMap = []
let timeSpace = 0; //

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false, //控制活动说明弹窗显示与隐藏
    tabIndex: false, //控制最新与排行样式切换
    newList: [], //最新投票列表 
    floatNewListRight: [], //流式布局右侧
    floatNewListLeft: [], //流式布局左侧
    voteList:[], // 排行前十用户
    top3List: [], //排行前三用户
    top7List:[], //排行4-10用户
    imgUrl:'',
    personTotal: 0, //报名人数
    ticketTotal: 0, //总票数
    viewTotal:0, //浏览次数
    voteInfo:{},//投票详情
    id:'',
    searchKey:'',
    finishTime:'',
 
    showVideo: false,
    codeImg: '',
    fromShare: false,
    productSrc: '',//下载图片
    codeSrc: '',//下载二维码
    day:'', hour:'', min:'', sec:''
  },

/******************************** 分享 ********************************/
  getSharePoster: function () {
    this.setData({ showVideo: false })
    this.selectComponent('#getPoster').getAvaterInfo()
  },
  myEventListener: function (e) {
    this.setData({ showVideo: true })
  },
/***************************** API获取数据 *****************************/

  /* 下载图片 */
  downloadImg() {
    let that = this
    let imgUrl = this.data.imgUrl
    console.log(imgUrl)
    if (imgUrl) {
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          console.log(res)
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            console.log(productSrc)
            that.setData({ productSrc })
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000
            })
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
            that.setData({ productSrc: '' })
          }
        }
      })
    }
  },

  getQrcodeAPI() {
    let that = this
    let id = this.data.id
    let scene = "id=" + id
    console.log(id)
    http.post(api.getQrcodeAPI, {
      scene,
      page: 'pages/votenroll/votenroll',
      width: 320
    })
      .then(res => {
        console.log(res)
        let codeImg = res.data
        that.setData({ codeImg })
        /* 下载 */
        wx.downloadFile({
          url: codeImg,
          success: function (res) {
            // wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              console.log(codeSrc)
              that.setData({ codeSrc })
            } else {
              that.setData({ codeSrc: '' })
            }
          }
        })
      })
  },


  /* 获取投票详情 */
  getList() {
    let that = this
    let id = this.data.id
    console.log(id)
    http.post(api.getDetailAPI, { id }).then(res => {

      let data = res.data
      let ft = res.data.finishTime
      that.setData({
        personTotal: data.personCount,
        viewTotal: data.catCount,
        imgUrl:data.cover,
        finishTime: ft,
        voteInfo: data
      })

      this.downloadImg()

      WxParse.wxParse('voteDetialInfo', 'html', data.detail, this);

      this.getNowAndEndTime() //获取当前和截止时间
      this.setTimeDown();
      this.startRecordTime();
      this.stopPullRefresh()
    })
  },

  /* 获取投票列表数据 */
  getAttendList() {
    let that = this
    let id = this.data.id
    let searchKey = this.data.searchKey
    http.post(api.attendListAPI, { page, size, id, searchKey}).then(res => {
      const list = res.data
      // console.log(list)
      list.map(item=>{
        if (item.images != null && item.images != ''){
          const imgUrlList = item.images.split(',')
          item.imgsList = imgUrlList
          item.img = imgUrlList[0]
        } else if (item.images == null || item.images =='') {
          item.imgsList = ['/img/withoutImg2.png']
          item.img = '/img/withoutImg2.png'
        }
        that.data.newList.push(item)
        console.log(item)
        
      })
      if (searchKey) {
        that.setData({
          newList: list
        })
      }
      this.ticketTotal() //执行计算总票数
      this.floatNewList()  //执行流式布局
    })
    
  
  },

  /* 获取投票最新数据 */
  getAttendOrder: function () {
    http.post(api.getAttendOrderListAPI, { id: this.data.id }).then(res => {
      let top3 = []
      let top7 = []
      console.log(res)
      res.data.map((item, index) => {
        console.log(item.images)
        if (item.images != null && item.images != ''){
          const imgUrlList = item.images.split(',')
          orderMap.push({ id: item.id, no: index + 1 });
          item.imgsList = imgUrlList
          item.img = imgUrlList[0]
        } else if (item.images == null || item.images == '')  {
          orderMap.push({ id: item.id, no: index + 1 });
          item.imgsList = ['/img/withoutImg2.png']
          item.img = '/img/withoutImg2.png'
        }
        
        if (index == 0) {
          item.index = 1;
          top3[1] = item
        } else if (index == 1) {
          item.index = 2;
          top3[0] = (item)
        } else if (index == 2) {
          item.index = 3;
          top3[2] = (item)
        } else if (index < 10) {
          top7.push(item)
        }
      })
      this.setData({ top3List: top3, top7List: top7 })
      console.log('ordermap', orderMap)
    }).catch(msg => {
      console.error(msg)
    })
  },

  /* 停止下拉刷新 */
  stopPullRefresh() {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        // console.log(res, new Date())
      }
    })
  },

  startRecordTime(){
    this.timeSet = setInterval(() => {
      this.setTimeDown()
      this.timeSpace = this.timeSpace - 60000;
      if (this.timeSpace == 0) {
        clearInterval(timeSet)
      }
    }, 60000);

  },


/***************************** 改变tab样式 *****************************/
  changeTabClass(e) {
    let item = e.currentTarget.dataset.item;
    if (item === 'new') {
      this.setData({
        tabIndex: false
      })
    }
    if (item === 'among') {
      this.setData({
        tabIndex: true
      })
    }
  },

/****************************** 活动说明 *******************************/

  /* 活动说明 */
  activity(){
    this.setData({
      showDialog:true
    })
  },
  cancelCover(){
    this.setData({
      showDialog: false
    })
  },

/******************************** 最新 ********************************/
  /* 最新tab投票 */
  goToVote(e){
    console.log(e);
    let id = e.currentTarget.dataset.id
    // 查询no 
    let no = 0;
    orderMap.map(item => {
      if (item.id == id) {
        no = item.no;
      }
    })

      // 跳转页面
      wx.navigateTo({
        url: 'detail/detail?id=' + id + '&no='+no,
      })
  },

  /* 流式布局 */
  floatNewList(){
    let list = this.data.newList
    let leftList = []
    let leftRight = []
    for(let i = 0;i < list.length; i++){
      if(i%2==0){
        leftList.push(list[i])
      } else {
        leftRight.push(list[i])
      }
    }
    this.setData({
      floatNewListRight: leftRight,
      floatNewListLeft: leftList
    })

  },


/*********************** 报名人数 总票数 浏览次数 ************************/
  /* 计算报名人数 */
  personTotal(){
    const list = this.data.newList
    let total = list.length
    this.setData({
      personTotal: total
    })
  },
  /* 计算总票数 */
  ticketTotal() {
    const list = this.data.newList
    let total = 0
    list.map(item=>{
      total += item.voteNum
    })
    this.setData({
      ticketTotal: total
    })
  },

/****************************** 页面跳转 *******************************/

  /* 选手报名跳转 */
  registration() {
    let id = this.data.id
    wx.navigateTo({
      url: 'registration/registration?id='+id,
    })
  },

  /* 回首页 */
  goToHome() {
    console.log(1)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

/******************************* 倒计时 ********************************/
  /* 获取当前和截止时间 */
  getNowAndEndTime(){
    let time = this.data.finishTime
    let endTime = (new Date(time)).getTime(); //得到毫秒数
    let nowTime = new Date().getTime()
    this.timeSpace = endTime - nowTime;    
  },

  /* 补零 */
  setDb(num){
    if (num < 10) {
      return '0' + num;
    } else {
      return '' + num;
    }
  },


  

  /* 根据时间 倒计时 */
  setTimeDown(){
  
    let time = this.timeSpace
    if (time<=0){
      this.setData({ day: 0, hour: 0, min: 0, sec: 0 })
      return
    }
    let num = time/1000

    let day = this.setDb(Math.floor(num / 60 / 60 / 24))
    let hour = this.setDb(Math.floor(num / 60 / 60) % 24)
    let min = this.setDb(Math.floor(num / 60) % 60)
    let sec = this.setDb(Math.floor(num % 60))

    this.setData({ day, hour, min, sec })
  },

/******************************** 搜索 *********************************/
  search(e){
    let value = e.detail.value
    this.setData({
      searchKey: value
    })
  },
  searchBtn(){
    page = 1
    this.setData({
      newList: []
    })
    this.getAttendList()
  },
/****************************** 生命周期 ********************************/
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    page = 1
    let id = ''

    if(options.scene){
      this.setData({
        fromShare: true
      })
      id = decodeURIComponent(options.scene)
      let i = id.indexOf('=')
      let y = id.substring(0, i)
      let x = id.substr(i + 1)
      id = x

    } else {
      id = options.id

    }
    console.log(options)
    this.setData({
      id
    })
    this.getQrcodeAPI()

    this.getList()
    this.getAttendList()
    this.getAttendOrder();
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timeSet)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let searchKey = this.data.searchKey
    if (searchKey) return
    page++
    this.getAttendList()

  },

  /**
   *  设置页面分享
   */

  onShareAppMessage: function (obj) {
    return {
      imageUrl: this.data.imgUrl ,
      title: this.data.voteInfo.title ,
      path: '/pages/votenroll/votenroll?id=' + this.data.id,

      success: function (res) {

      },
      fail: function (res) {

      },

    }
    console.log("path", path)
  },

})