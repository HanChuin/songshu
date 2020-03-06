// 用户登录 post(openId,wxname,photo)
module.exports.loginAPI = '/api/s/auth/login'
//微信一键登录
module.exports.wxLoginAPI = '/api/s/auth/thirdlogin'
// 登录发送验证码
module.exports.getCodeAPI = '/api/s/auth/sendSms'

// 解密
module.exports.decyDataAPI = '/api/s/auth/decyData'

// 首页活动数据
module.exports.homeActivityAPI = '/api/s/home/activity'
// 商家列表
module.exports.partnerAPI = '/api/s/partner/list'
// 头条列表
module.exports.topmessageAPI = '/api/s/topmessage/list'
// 打卡
module.exports.signOneDayAPI = '/api/s/sign/oneday'
// 签到
module.exports.signDayAPI = '/api/s/sign/signDay'
// 签到次数
module.exports.signCountAPI = '/api/s/sign/signCount'
// 打卡详情
module.exports.signOneDayDetailAPI = '/api/s/sign/detail'
// 个人打卡记录
module.exports.signUserDetailAPI = '/api/s/sign/userDetail'
// 打卡列表
module.exports.signListAPI = '/api/s/sign/list'
// 任务完善资料
module.exports.taskCheckAPI = '/api/s/task/check'
// 绑定手机
module.exports.bindPhoneAPI = '/api/s/auth/bindPhone'
// 注册
module.exports.registerAPI = '/api/s/auth/register'
// 分享二维码
module.exports.shareCodeAPI = '/api/s/user/share/getcode'
// 修改密码
module.exports.changePSWAPI = '/api/s/auth/changePwd'
// 获取用户信息
module.exports.userInfoAPI = '/api/s/user/info'
// 编辑用户信息
module.exports.editUserAPI = '/api/m/user/edit'
// 修改个人信息
module.exports.editUserAPIs = '/api/s/user/edit'
// 积分查询列表
module.exports.pointListAPI = '/api/s/order/pointList'
// 获取商品详情
module.exports.getShopDetailAPI = '/api/s/goods/detail'
// 查询订单状态
module.exports.checkOrderAPI = '/api/s/order/checkState'
// 获取筛选tag
module.exports.getTagsAPI = '/api/s/activity/tags'
// 订单列表
module.exports.getOrderListAPI = '/api/s/user/order/getOrderList'
// 订单详情
module.exports.getOrderDetailAPI = '/api/s/user/order/getOrderDetail'
// 种类详情
module.exports.categroryDetailAPI = '/api/s/activity/getStandardDetail'
// 申请成为合作方
module.exports.applyPartnerAPI = '/api/m/user/applyPartner'
// 合作方详情
module.exports.partnerDetailAPI = '/api/m/user/partnerDetail'
// 申请成为益组织
module.exports.applyOrgAPI = '/api/m/user/applyOrg'
// 益组织详情
module.exports.orgDetailAPI = '/api/m/user/orgDetail'
// 申请为益工
module.exports.workerApplyAPI = '/api/m/user/applyWorker'
// 活动类别列表（全）
module.exports.activityCategoryListAPI = '/api/s/activity/getStandardList'
// 首页类别列表
module.exports.homeTopicListAPI = '/api/s/activity/topicList'
// 活动列表（距离排序）
module.exports.activityListAPI = '/api/s/activity/list'
// 活动详情
module.exports.activityDetailAPI = '/api/s/activity/detail'
// 组织详情
module.exports.activityOrgDetailAPI = '/api/m/activity/detail/orgDetail'
// 活动发布
module.exports.activityAddAPI = '/api/m/activity/addActivity'
// 活动审核通过
module.exports.activityApplySuccessAPI = '/api/m/activity/applySuccess'
// 活动审核拒绝
module.exports.activityApplyErrorAPI = '/api/m/activity/applyError'
// 申请参加活动
module.exports.activityJoinAPI = '/api/s/activity/user/takeInActivity'
// 活动参与成员
module.exports.activityUserListAPI = '/api/m/activity/activityUserList'
// 是否参与
module.exports.activityUserIsJoinAPI ='/api/m/activity/user/isJoin'

// ///////////////////////////////////////////////
// 选手报名
module.exports.joinVoteAPI = '/api/s/vote/joinVote'

// 投票列表
module.exports.getListAPI = '/api/s/vote/getList'
// 投票活动详情
module.exports.getDetailAPI = '/api/s/vote/getDetail'
// 投票参与详情
module.exports.attendDetailAPI = '/api/s/vote/attendDetail'
// 投票
module.exports.castVoteAPI = '/api/s/vote/castVote'
// 投票列表详情
module.exports.attendListAPI = '/api/s/vote/attendList'
// 我的报名
module.exports.selfAttendDetailAPI = '/api/s/vote/selfAttendDetail'
// 投票项排序
module.exports.getAttendOrderListAPI = "/api/s/vote/getAttendOrderList"
/**************************** 问卷调查 ****************************/
// 问卷列表
module.exports.getActivityListAPI = '/api/s/question/getActivityList'
// 问卷详情
module.exports.getActivityDetailAPI = '/api/s/question/getActivityDetail'
// 问题列表
module.exports.getProblemListAPI = '/api/s/question/getProblemList'
// 问题提交
module.exports.submitAPI = '/api/s/question/submit'
// 判断是否填写问卷
module.exports.questionCheckAPI = '/api/s/question/check'

/**************************** 视频 ****************************/
// 视频列表
module.exports.getVideoListAPI = '/api/s/video/getList'
// 视频详情
module.exports.getVideoDetailAPI = '/api/s/video/getDetail'


/**************************** 活动 ****************************/
// 活动发布奖品
module.exports.activityGoodsAddAPI = '/api/m/activity/goods/addGoods'
// 活动奖品列表（全部）
module.exports.activityGoodsListAPI = '/api/s/goods/list'

// 奖品详情
module.exports.activityDetailAddAPI = '/api/s/goods/detail'

// 活动奖品审核通过
module.exports.activityGoodsApplySuccessAPI = '/api/m/activity/goods/applySuccess'
// 活动奖品审核拒绝
module.exports.activityGoodsApplyErrorAPI = '/api/m/activity/goods/applyError'
// 积分商品列表
module.exports.pointsShopAPI = '/api/m/goodsPoint/list'
// 积分商品兑换
module.exports.pointsConvertAPI = '/api/m/orderPoint/duihuan'
// 积分兑换历史
module.exports.pointsConvertListAPI = '/api/m/orderPoint/list'
// 积分排名
module.exports.getPointListAPI = '/api/s/point/pointList'
// 积分等级
module.exports.getUserlevelListAPI = '/api/s/userlevel/level/list'

// 代码项
module.exports.codeListAPI = '/api/m/code/list'
// 获取openid
module.exports.getOpenIdAPI = '/api/s/getOpenId'
// 不同类别的活动列表
module.exports.activityLstWithStateAPI = '/api/s/activity/listWithState'
// 不同tags
module.exports.activityLstWithTagsAPI = '/api/s/activity/listWithTags'

module.exports.getQrcodeAPI = '/api/s/qrcode/get'


// 历史活动
module.exports.activityHistoryAPI = "/api/m/activity/list/history"
// 活动评论列表
module.exports.activityCommentListAPI = "/api/m/activity/commentList"

// 待审核益工列表
module.exports.workerApplyListAPI = '/api/m/worker/applyList'
// 审核通过益工列表
module.exports.workerReviewedListAPI = '/api/m/worker/list'
// 待审核益组织列表
module.exports.organrApplyListAPI = '/api/m/org/applyList'
// 审核通过益组织列表
module.exports.organReviewedListAPI = '/api/m/org/list'
// 益组织详情(审核)
module.exports.organReviewInfoAPI = '/api/m/org/info'
// 益组织审核通过
module.exports.organReviewSuccessAPI = '/api/m/org/applySuccess'
// 益组织审核不通过
module.exports.organReviewFailAPI = '/api/m/org/applyError'
// 待审核合作方列表
module.exports.partnerApplyListAPI = '/api/m/partner/applyList'
// 审核通过合作方列表
module.exports.partnerReviewedListAPI = '/api/m/partner/list'
// 合作方详情(审核)
module.exports.partnerReviewInfoAPI = '/api/m/partner/info'
// 合作方审核通过
module.exports.partnerReviewSuccessAPI = '/api/m/partner/applySuccess'
// 合作方审核不通过
module.exports.partnerReviewFailAPI = '/api/m/partner/applyError'

// 审核奖品填充列表
module.exports.activityGoodsReviewListAPI = '/api/m/activity/goods/listWithState'
// 奖品填充详情(审核)
// module.exports.partnerReviewInfoAPI = '/api/m/activity/goods/list'
// 奖品填充审核通过
module.exports.activityGoodsReviewSuccessAPI = '/api/m/activity/goods/applySuccess'
// 奖品填充审核不通过
module.exports.activityGoodsReviewFailAPI = '/api/m/activity/goods/applyError'

// 益工信息
module.exports.workerDetailAPI = '/api/m/workder/detail'
// 益工审核通过
module.exports.workerApplySuccessAPI = '/api/m/worker/applySuccess'
// 审核不通过
module.exports.workerApplyErrorAPI = '/api/m/worker/applyError'

// 轮播图
module.exports.bannerImgsAPI = '/api/s/news/list'
// 城市列表
module.exports.cityListAPI = '/api/m/area/list'
// 活动列表（map用）
module.exports.mapListAPI = '/api/m/activity/list/withmap'
// 退出活动
module.exports.takeOutActivityAPI = "/api/s/user/activity/takeOutActivity";
// 组织详情中所有活动
module.exports.orgActivityListAPI = "/api/m/org/activityList";

// 组织自己的活动列表
module.exports.orgSelfActivityListAPI = "/api/m/activity/org/listWithState";

// 活动列表 不同申请状态
module.exports.activtyWithApplyStateAPI = '/api/m/activity/listWithApplyState';
// 活动签到
module.exports.signAPI = '/api/s/user/activity/signActivity';
// 关注状态
module.exports.careStateAPI = '/api/m/org/careState';
// 关注操作
module.exports.careAPI = '/api/m/org/care';

// 个人活动记录
module.exports.userActivityListAPI = '/api/s/user/activity/listWithState';
// 个人活动详情
module.exports.userActivityDetailAPI = '/api/s/user/activity/detail';

module.exports.careListAPI = '/api/m/user/mycare';

// 评价义工
module.exports.commentWorker = '/api/m/activity/commentWorkerAdd';
// 活动评价义工列表
module.exports.activityCommentList = '/api/m/activity/comment/worker/List';
// 签到状态
module.exports.signStateAPI = '/api/m/activity/signState';

module.exports.uploadAPI = 'https://yql.on-bm.com/api/upload';

// module.exports.orgSelfActivityListAPI = '/api/m/org/listWithState'

module.exports.workerActivityList = '/api/m/worker/activity/listWithState'

module.exports.partnerActivityList = '/api/m/partner/activity/listWithState'

// 合作方查看自己的商品
module.exports.partnerGoodsList = '/api/m/partner/goods/lithWithState'

// 获取config
module.exports.getConfigUrl = '/api/b/config/getValue'
// 七牛云
module.exports.getQiniuTokenUrl = '/api/qiniu/getUploadToken'
// 获取学生信息
module.exports.getStudentInfoUrl = '/api/s/user/student/getStudentInfo'
// 新增学生信息
module.exports.addStudentInfoUrl = '/api/s/user/student/addStudentInfo'
// 修改学生信息
module.exports.updateStudentInfoUrl = '/api/s/user/student/editStudentInfo'
// 常见问题
module.exports.getQuestionUrl = '/api/s/user/question/getQuestionList'
// 学校列表
module.exports.getSchooldListUrl = '/api/s/school/getSchoolList'
// 创建订单
module.exports.createOrderUrl = '/api/s/order/creatOrder'
// 创建微信订单
module.exports.createWxOrderUrl = '/api/s/order/payGoods'
// 
module.exports.createActivityWxUrl = '/api/s/order/payActivity'

// 获取学生
module.exports.getUserStudentUrl = '/api/s/user/student/getStudentList'
// 获取家长
module.exports.getUserParentUrl = "/api/s/user/parent/getParentList"
// 学生删除
module.exports.delUserStudentUrl = '/api/s/user/student/studentDelete'
// 获取用户下指定学生信息
module.exports.getUserStudentDetailUrl = '/api/s/user/student/getStudentDetail';
// 新增家长
// 获取用户下指定家长信息
module.exports.getUserParentDetailUrl = "/api/s/user/parent/getParentDetail";

module.exports.addUserParentUrl = "/api/s/user/parent/parentAdd";
// 修改家长
module.exports.saveUserParentUrl = "/api/s/user/parent/parentUpdate"
// 删除家长
module.exports.delUserParentUrl = "/api/s/user/parent/parentDelete"
// 获取活动须知
module.exports.getActivityNotice ="/api/s/activity/notice"
// 获取 unionID 
module.exports.updateUnionUrl = "/api/s/updateUnionId"
//获取商家详情
module.exports.getshopperDetailAPI ="/api/s/partner/detail"
// 首页新闻数据
module.exports.getHomeDataUrl = "/api/s/news/getNewsList"
// 首页广告
module.exports.getfirstdataAPI = "/api/s/adds/list"

/**文艺大赛接口 */
// 报名
module.exports.matchAddApi = "/api/s/match/add"
// 大赛检测
module.exports.checkMatchApi = "/api/s/match/check"
// 详情
module.exports.detailMatchApi = "/api/s/match/detail"
// 上传作品
module.exports.updateMatchApi = "/api/s/match/update"
// 组队
module.exports.addTeamApi = '/api/s/match/teamAdd'
// 组员
module.exports.teamUserApi = '/api/s/match/teamUsers'
// 统计数量
module.exports.projectNumApi = '/api/s/match/projectNum'
// 分类作品
module.exports.projectListApi = '/api/s/match/projectItemList'
// 分类作品（token）
module.exports.projectUserListApi = '/api/s/match/projectUserItemList'
// 投票
module.exports.voteApi = '/api/s/match/vote'
// 作品详情
module.exports.projectDetailAPi = "/api/s/match/projectDetail"
// 用户投票详情
module.exports.projectUserDetailAPi = '/api/s/match/projectUserDetail'

/** 公益项目 */
// 公益项目列表
module.exports.projectItemListAPi = '/api/s/project/list'
// 公益项目详情
module.exports.projectItemListDetailAPi = '/api/s/project/detail'
// 关注公益项目列表
module.exports.projectFavListAPi = '/api/s/project/favlist'
// 关注状态
module.exports.projectFavStateApi = '/api/s/project/favState'
// 关注/取关公益项目
module.exports.projectFavAPi = '/api/s/project/fav'
// 项目活动
module.exports.projectActivityListApi = '/api/s/project/activitylist'
// 猜你喜欢的活动
module.exports.allActivityApi = '/api/s/project/allactivity'
/** 公益项目 */

/**
 * 表单活动
 */
module.exports.formActivityDetailApi = "/api/s/project/from/detail"
// 问题列表
module.exports.getProblemsApi = "/api/s/project/form/problems"
// 提交信息
module.exports.submitApi = "/api/s/project/form/submit"
// 用户报名信息
module.exports.userActivityApi = "/api/s/project/form/useractivity"

module.exports.getConfigValueApi = "/api/s/config/getValue"

/**
 * 获取推荐权益
 */
module.exports.getRecommendPowerApi = "/api/s/power/recommedPower"
module.exports.getPowerDetailApi = "/api/s/power/getDetail"
module.exports.getPowerApi = "/api/s/power/getPower"
module.exports.getLevelPowerApi = "/api/s/power/getListByPower"

// 时间轴数据
module.exports.getTimeLineApi = "/api/s/timeline/getList"

// 城市列表数据
module.exports.getCityListApi = '/api/s/city/cityList'//page size
// 城市查询数据
module.exports.getCityApi = '/api/s/city/cityCheck'

// 首页初始化数据接口
module.exports.homeInitData = '/api/s/home/initData'