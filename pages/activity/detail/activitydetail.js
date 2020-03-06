/**
 * 新活动详情页面
 */
let activityId = 41

const http = require("../../../utils/http.js");
const api = require("../../../utils/api.js");
var WxParse = require('../../../libs/wxParse/wxParse.js');
let lat = 0
let lng = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    conver: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id) {
        activityId = options.id;
      }
    this.getActivityDetail();
  },

  // 获取活动详情
  getActivityDetail: function () {
    let that = this;
    let params = {
      id: activityId
    };
    http
      .post(api.activityDetailAPI, params)
      .then(res => {
        console.log('2', res.data[0]);
        let result = res.data[0];//接口数据
        if (result.img.indexOf(',') != -1) {
          result.imgLst = result.img.split(",");
        } else if (result.img.indexOf(';') != -1) {
          result.imgLst = result.img.split(";");
        } else {
          result.imgLst = []
          result.imgLst.push(result.img)
        }
        result.tagLst = result.tags.split(";");
        //判断活动状态
        let state = ''
        let btshow = ''
        switch (result.activeState) {
          case 0: state = '未开始'; btshow = '活动未开始'; break;
          case 1: state = '报名中'; btshow = '立即报名'; break;
          case 2: state = '进行中'; btshow = '立即报名'; break;
          case 3: state = '已结束'; btshow = '活动已结束'; break;
          default: state = '状态异常'; btshow = ''
        }
        this.setData({
          btshow: btshow
        })
        result.state = state;
        //修改截止时间-单位“天”
        let applyTime = new Date(result.applyTime);
        let nowTime = new Date();
        let days = 0;
        if (nowTime.getTime() > applyTime.getTime()) {
          days = 0;
        } else {
          days = parseInt(
            (applyTime.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (days == 0) {
            days = 1;
          }
        }
        //修改开始结束时间格式
        if (result.startTime && result.endTime) {
          let start = new Date(result.startTime);
          let end = new Date(result.endTime);
          result.start = start.getMonth() + 1 + "/" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes();
          result.end = end.getMonth() + 1 + "/" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes();
        } else {
          result.start = "";
          result.end = "";
        }
        result.endDays = days;
        that.setData({
          detail: result,
          conver: result.img
        });
        this.downloadImg()
        WxParse.wxParse('activityDetail', 'html', result.details, that);
      })
      .catch(msg => console.log(msg));
  },

})