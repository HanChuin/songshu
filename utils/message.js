const app = getApp();
const util = require('./util.js')
// 模板消息ID
// 活动报名成功通知
let activityId = "_PLTZK7VvyvfD7DqPK4FVaLAeq-3fbQGyw8EUC9DeuU"
// 签到成功通知
let signId = "VbyV7yCITzH6bFEfOdBT-xgDFw_xxUZHhthroZ2qD_o"
// 问卷调查提醒
let questionId = "cdYhaVqTPhnrPVgV4uLFqAdFDehlVHK7d_DM2wOWznE"
//预约活动临近提醒
let quickStartId = "gZFTtoz97SG183D8n1g_fRoDA58hdTDiTH64zUkBedE"


/**
 * 报名活动
 * 订阅消息
 */
module.exports.setActivityMessage = function(success , fail , complete) {
  let tmplIds = [];
  if (app.globalData.deviceInfo) {
    let systemInfo = app.globalData.deviceInfo.system;
    if (systemInfo.toLowerCase().indexOf('ios') > -1) {
      console.log('setActivityMessage' , 'ios')
      // 比较版本
      if (util.checkVersion(app.globalData.deviceInfo.version, '7.0.6')) {
        // 多
        tmplIds.push(activityId);
        tmplIds.push(questionId);
        tmplIds.push(quickStartId);
      } else {
        // 少
        tmplIds.push(activityId);
      }
      
    } else if (systemInfo.toLowerCase().indexOf('android') > -1) {
      console.log('setActivityMessage', 'android')
      if (util.checkVersion(app.globalData.deviceInfo.version , '7.0.7')) {
        // 多
        tmplIds.push(activityId);
        tmplIds.push(questionId);
        tmplIds.push(quickStartId);
      } else {
        // 少
        tmplIds.push(activityId);
      }
    }
  } else {
    // 多
    tmplIds.push(activityId);
    tmplIds.push(questionId);
    tmplIds.push(quickStartId);
  }
 
  let params = {
    tmplIds,
    success: function (res) {
      success(res)
    },
    fail: function (msg) {
      console.log('fail', msg)
      fail(msg);
    },
    complete: function () {
      console.log('complete')
      complete()
    }
  }
  console.log('requestSubscribeMessage' , params)
  wx.requestSubscribeMessage(params);
}


/**
 * 签到活动
 * 订阅问卷
 */
module.exports.signActivityMessage = function (success, fail, complete) {
  let tmplIds = [];
  if (app.globalData.deviceInfo) {
    let systemInfo = app.globalData.deviceInfo.system;
    if (systemInfo.toLowerCase().indexOf('ios') > -1) {
      console.log('signActivityMessage', 'ios')
      // 比较版本
      if (util.checkVersion(app.globalData.deviceInfo.version, '7.0.6')) {
        // 多
        tmplIds.push(questionId);
        // tmplIds.push(signId);
        // tmplIds.push(quickStartId);
      } else {
        // 少
        tmplIds.push(questionId);
      }

    } else if (systemInfo.toLowerCase().indexOf('android') > -1) {
      console.log('signActivityMessage', 'android')
      if (util.checkVersion(app.globalData.deviceInfo.version, '7.0.7')) {
        // 多
        tmplIds.push(questionId);
      } else {
        // 少
        tmplIds.push(questionId);
      }
    }
  } else {
    // 多
    tmplIds.push(questionId);
  }

  let params = {
    tmplIds,
    success: function (res) {
      success(res)
    },
    fail: function (msg) {
      console.log('fail', msg)
      fail(msg);
    },
    complete: function () {
      console.log('complete')
      complete()
    }
  }
  wx.requestSubscribeMessage(params);
}