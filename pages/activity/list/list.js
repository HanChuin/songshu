const api = require('../../../utils/api.js')
const http = require('../../../utils/http.js')

/**
 * -1: 审核未通过
 * 1：待审核 
 * 2：招募中（可进行奖品填充）
 * 3：进行中（根据时间判断是否待开始）
 * 4：已结束（历史活动）
 */
let PageIndex = 1
let PageSize = 10
let hasMore = false
Page({
  data: {
    activityType: 3, //活动类型
    activities: [], //活动列表
    role: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setActivityNavigationBarTitle(options.activityType);
    this.setData({ activityType: options.activityType });
    this.setData({ role: wx.getStorageSync("role") });
    this.getActivityData();
  },

  // 设置页面标题
  setActivityNavigationBarTitle(activityType) {
    let title = "活动列表"
    switch (activityType) {
      case "-1":
        title = "审核未通过的活动"
        break;
      case "1":
        title = "待审核的活动"
        break;
      case "2":
        title = "招募中的活动"
        break;
      case "3":
        title = "进行中的活动"
        break;
      case "4":
        title = "历史活动"
        break;
      default:
        title = "活动列表"
        break;
    }
    wx.setNavigationBarTitle({ title: title });
  },

  // 获取活动数据
  getActivityData: function () {
    if (this.data.activityType == "4") {
      this.getActivitiesHistoryData()
    } else {
      this.getActivitiesData()
    }
  },

  // 获取历史活动数据
  getActivitiesHistoryData() {
    // 根据角色判断 如果是益组织 历史活动查看的是发布的历史活动
    // 义工查看的是参加对历史活动
    //根据角色判断
    let dbRole = wx.getStorageSync('role');
    let url = ''
    if (dbRole == 2) {
      url = api.workerActivityList
    } else if (dbRole == 3) {
      url = api.orgSelfActivityListAPI
    } else if (dbRole == 4) {
      url = api.partnerActivityList
    }
    let params = {
      page: PageIndex,
      size: PageSize,
      state: '4',
      activityState: '4'
    };
    let that = this;
    http
      .post(url, params)
      .then(res => {
        console.log("历史活动");
        console.log(res.data.length);
        wx.stopPullDownRefresh();
        if (res.data.length < PageSize) {
          hasMore = false;
        } else {
          hasMore = true;
        }
        that.setActivityData(res.data);
      })
      .catch(msg => {
        console.log(msg);
      });
  },

  // 获取除历史互动之外的活动
  getActivitiesData() {
    let params = {
      state: this.data.activityType,
      activityState: this.data.activityType,
      page: PageIndex,
      size: PageSize
    };
    let that = this;
    let url = ''
    //根据角色判断
    let dbRole = wx.getStorageSync('role');
    if (dbRole == 2) {
      url = api.userActivityListAPI
    } else if (dbRole == 3) {
      url = api.orgSelfActivityListAPI
    } else if (dbRole == 4) {
      url = api.activityLstWithStateAPI
    }
    http
      .post(url, params)
      .then(res => {
        wx.stopPullDownRefresh();
        if (res.data.length < PageSize) {
          hasMore = false;
        } else {
          hasMore = true;
        }
        that.setActivityData(res.data);
      })
      .catch(msg => {
        console.log(msg);
      });
  },

  // 修改活动数据
  setActivityData: function (lst) {
    let temps = [];
    lst.map(item => {
      let tags = item.tags;
      //修改时间格式
      if (item.startTime && item.endTime) {
        let start = new Date(item.startTime);
        let end = new Date(item.endTime);
        item.start = start.getMonth() + 1 + "/" + start.getDate();
        item.end = end.getMonth() + 1 + "/" + end.getDate();
      } else {
        item.start = "";
        item.end = "";
      }
      //修改距离数据
      let dis = "";
      if (item.distance) {
        if (item.distance > 1000) {
          dis = (item.distance / 1000).toFixed(2) + "km";
        } else {
          dis = item.distance.toFixed(2) + "m";
        }
      }
      item.distanceStr = dis;
      //修改截止时间
      let applyTime = new Date(item.applyEndTime);
      let nowTime = new Date();
      let days = 0;
      if (nowTime.getTime() > applyTime.getTime()) {
        console.log("截止");
        days = 0;
      } else {
        days = parseInt(
          (applyTime.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (days == 0) {
          days = 1;
        }
      }
      item.endDays = days; //报名截止
      item.tagLst = tags.split(";");

      //applyDays 几天后开始报名
      let applyEndDate = new Date(item.applyEndTime);
      let applyDays = 0;
      if (nowTime.getTime() < applyEndDate.getTime()) {
        applyDays = parseInt(
          (applyEndDate.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (applyDays == 0) {
          applyDays = 1;
        }
      }
      item.applyDays = applyDays;
      temps.push(item);
    });

    let old = this.data.activities;
    if (PageIndex == 1) {
      this.setData({
        activities: temps
      });
    } else {
      if (temps.length > 0) {
        old = old.concat(temps);
      }
      this.setData({
        activities: old
      });
    }
    console.log(this.data.activities);
  },

  // 跳转活动详情
  toActivityDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    let navigateUrl = ""
    switch (this.data.activityType) {
      case "-1":
        navigateUrl = "/pages/details/recruit/recruit?id=" + id;
        break;
      case "1":
        navigateUrl = "/pages/details/recruit/recruit?id=" + id;
        break;
      case "2":
        // navigateUrl = "/pages/award/award?activityId=" + id;
        navigateUrl = "/pages/details/recruit/recruit?id=" + id; break;
      case "3":
        navigateUrl = "/pages/details/doing/doing?id=" + id;
        break;
      case "4":
        // navigateUrl = "/pages/details/recruit/recruit?id=" + id;
        navigateUrl = "/pages/details/doing/doing?id=" + id;
        break;
      default:
        navigateUrl = "/pages/details/recruit/recruit?id=" + id;
        break;
    }

    // 只有招募中的活动&&合作方
    if (wx.getStorageSync('role') == 4 && this.data.activityType == "2") {
      navigateUrl = "/pages/award/award?activityId=" + id;
    }
    wx.navigateTo({ url: navigateUrl });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    PageIndex = 1
    this.getActivityData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasMore) {
      PageIndex++
      this.getActivityData()
    }
  },
  
});