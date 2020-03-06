let name = ''
let desc = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type  = options.type;
    this.setData({
      type
    })
    if (type == 'name') {
      wx.setNavigationBarTitle({
        title: '作品名称',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '作品描述',
      })
    }
  },

  saveAction:function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if(this.data.type == 'name') {
      prevPage.setData({
        name
      })
    } else {
      prevPage.setData({
        desc
      })
    }
    wx.navigateBack({});
  },

  chageName: function(e){
    console.log(e)
    name = e.detail.value
  },

  changeDesc:function(e){
    desc = e.detail.value
  }
 
})