let animationLeft = wx.createAnimation({
  duration: 1000,
  timingFunction: 'linear',
  delay: 0
});

let animationLeft2 = wx.createAnimation({
  duration: 1000,
  timingFunction: 'step-start',
  delay: 0
});


Page({

  /**
   * 页面的初始数据
   */
  data: {

    currentIndex: 1,
    imgAnimation1: undefined,
    imgAnimation2: undefined,
    imgAnimation3: undefined,
    imgAnimation4: undefined,
    imgAnimation5: undefined,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 一个动画全过程
   */
  startAnimationOne: function() {
    let self = this
    let next = 0
    // 定时器
    setInterval(function() {
      console.log('格子:', next % 13)
      switch (next % 13) {
        case 0:
          self.startAnimaTypeIndex(1, 1)
          break;
        case 1:
          self.startAnimaTypeIndex(2, 1)
          self.startAnimaTypeIndex(6, 2)
          break;
        case 2:
          self.startAnimaTypeIndex(3, 1)
          self.startAnimaTypeIndex(1, 2)
          break;
        case 3:
          self.startAnimaTypeIndex(4, 1)
          self.startAnimaTypeIndex(2, 2)
          self.startAnimaTypeIndex(6, 3)
          break;
        case 4:
          self.startAnimaTypeIndex(5, 1)
          self.startAnimaTypeIndex(3, 2)
          self.startAnimaTypeIndex(1, 3)
          break;
        case 5:
          self.startAnimaTypeIndex(4, 2)
          self.startAnimaTypeIndex(2, 3)
          self.startAnimaTypeIndex(6, 4)
          break;
        case 6:
          self.startAnimaTypeIndex(5, 2)
          self.startAnimaTypeIndex(3, 3)
          self.startAnimaTypeIndex(1, 4)
          break;
        case 7:
          self.startAnimaTypeIndex(4, 3)
          self.startAnimaTypeIndex(2, 4)
          self.startAnimaTypeIndex(6, 5)
          break;
        case 8:
          self.startAnimaTypeIndex(5, 3)
          self.startAnimaTypeIndex(3, 4)
          self.startAnimaTypeIndex(1, 5)
          break;
        case 9:
          self.startAnimaTypeIndex(4, 4)
          self.startAnimaTypeIndex(2, 5)
          break;
        case 10:
          self.startAnimaTypeIndex(5, 4)
          self.startAnimaTypeIndex(3, 5)
          break;
        case 11:
          self.startAnimaTypeIndex(4, 5)
          break;
        case 12:
          self.startAnimaTypeIndex(6, 1)
          self.startAnimaTypeIndex(5, 5)
          break;
      }
      next++;
    }.bind(self), 1000);
  },


  startAnimaTypeIndex: function(type, index) {
    console.log(type, index, new Date().getSeconds());
    if (type == 1) {
      // 上移动1位
      animationLeft.scale(1, 1).opacity(1).translate(-5, -5).step();
    } else if (type == 2) {
      // 上移动2位
      animationLeft.scale(1, 1).opacity(1).translate(-10, -10).step();
    } else if (type == 3) {
      // 放大
      animationLeft.scale(1.1, 1.1).opacity(1).translate(-20, -20).step();
    } else if (type == 4) {
      // 缩小隐藏
      animationLeft.scale(0.1, 0.1).opacity(0).translate(-20, -20).step();
    } else if (type == 5) {
      // 恢复1
      animationLeft.scale(0.1, 0.1).opacity(0).translate(0, 0).step();
    } else if (type == 6) {
      animationLeft.scale(1, 1).opacity(1).translate(0, 0).step({
        timingFunction: 'step-start'
      });
    }


    if (index == 1) {
      this.setData({
        imgAnimation1: animationLeft.export(),
      })
    } else if (index == 2) {
      this.setData({
        imgAnimation2: animationLeft.export(),
      })
    } else if (index == 3) {
      this.setData({
        imgAnimation3: animationLeft.export()
      })
    } else if (index == 4) {
      this.setData({
        imgAnimation4: animationLeft.export()
      })
    } else if (index == 5) {
      this.setData({
        imgAnimation5: animationLeft.export()
      })
    }
  },



})