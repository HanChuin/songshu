/**
 * projectId: 写作 1 弹奏 2 唱跳 3 表演4
 * group: 小学1 初中2 高中3
 */
const http = require("../../../utils/http.js");
const api = require("../../../utils/api.js");
var voteMatchs = []
var page = 1;
const size = 5;
var hasMore = false
var searchKey = ''

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
    currentIndex: 0,
    projectList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
    console.log(options)
    if (options.type) {
      this.setData({ currentIndex: parseInt(options.type) })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(this.data.currentIndex)
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page  = 1;
    this.getData(this.data.currentIndex);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasMore) {
      page = page + 1;
      this.getData(this.data.currentIndex);
    }
  },
 
  chooseItemAction: function (e) {
    console.log(e)
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    page = 1
    this.getData(e.currentTarget.dataset.index);
  },

  /**
   * 获取数据
   */
  getData: function (index) {
    console.log(index)
    let projectId = 0;
    let group = 0
    switch (index) {
      case 0:
        group = 1;
        projectId = 2
        break;
      case 1:
        group = 2;
        projectId = 2
        break;
      case 2:
        group = 3;
        projectId = 2
        break;
      case 3:
        group = 1;
        projectId = 1
        break;
      case 4:
        group = 2;
        projectId = 1
        break;
      case 5:
        group = 3;
        projectId = 1
        break;
    }
    let params = {
      project_id: projectId,
      group,
      page,
      size,
      key: searchKey
    }

    let url = ''
    let token = wx.getStorageSync('token')
    if (token && token != '') {
      url = api.projectUserListApi
    } else {
      url = api.projectListApi
    }

    http.post(url, params).then(res => {
      console.log(res)
      if (res.success) {
        voteMatchs = []
        res.data.vote.map(item => {
          voteMatchs.push(item.matchUserId)
        })
        console.log(voteMatchs)
        this.setProjectList(res.data.lst)
      }
    }).catch(msg => {
      console.error(msg)
    })
  },

  setProjectList: function (lst) {
    let items = []
    if (page == 1) {
      items = []
    } else {
      items = this.data.projectList
    }
    if (lst.length < 5) {
      hasMore = false
    } else {
      hasMore = true
    }
    lst.map(item => {
      if (voteMatchs.indexOf(item.id) > -1) {
        item.voteState = 1
      } else {
        item.voteState = 0
      }
      if (item.url) {
        if (item.url.indexOf(';') > -1) {
          item.furl = item.url.split(';')[0]
        } else {
          item.furl = item.url
        }
      }
      items.push(item)
    });
    console.log(items)
    this.setData({
      projectList: items
    })
  },

  handleDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/match/votedetail/voteDetail?id=' + e.currentTarget.dataset.id + '&type=lst',
    })
  },

  changeSearchKey:function(e) {
    console.log(e.detail.value)
    searchKey = e.detail.value;
  },

  searchAction:function() {
    page = 1
    this.getData(this.data.currentIndex)
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: "张家港首届文艺大赛",
      path: '/pages/match/vote/vote',
      success: function (res) { },
      fail: function (res) { },
    }
  },
})