const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    days : Number,
    clocklogo: String, // logo
    productSrc: String, //下载图片地址
    codeSrc: String, //下载二维码地址
    clockTip: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpost: false,
    imgHeight: 0,
    productCode: "" //二维码
  },

  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取图片
    getAvaterInfo: function () {
      var that = this;
      that.setData({
        showpost: true
      })
      let productSrc = that.data.productSrc
      that.getQrCode(productSrc);
    },

    //获取二维码
    getQrCode: function (productSrc) {
      var that = this;
      let codeSrc = that.data.codeSrc
      that.sharePosteCanvas(productSrc, codeSrc);
    },

    //canvas绘制分享海报
    sharePosteCanvas: function (avaterSrc, codeSrc) {
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);

      query.select('#canvas-container').boundingClientRect(function (rect) {
        let days = that.data.days
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        console.log(rect)
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        // logo
        let clocklogo = that.data.clocklogo
        let logoW = 3968 / width * 7
        let logoH = 1256 / width * 7
        // let logoW = 3968
        // let logoH = 1256
        let logoT = width / 45
        let logoL = (width - logoW) / 2
        ctx.drawImage(clocklogo, logoL, logoT, logoW , logoH)

        ctx.setFontSize(20);
        ctx.setTextAlign('center');
        ctx.setFillStyle('#000');
        ctx.fillText("7天公益打卡捐书", width / 2, width / 4.5);

        //图片
        let imgW = 589 / width * 120
        let imgH = 520 / width * 120
        let imgL = (width - imgW) / 2
        let imgT =  width / 4
        ctx.drawImage(avaterSrc,imgL, imgT , imgW , imgH )

        ctx.setFontSize(10);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.fillText("感谢您的坚持与付出", width / 11, imgH+imgT+20);
        let scsTip = ''
        switch (that.data.days) {
          case 1:
              scsTip = '阅读，对孩子们来说，是另一种看见'
            break;
          case 2:
              scsTip =  '阅读，是为了孩子们更好的遇见'
            break;
          case 3:
              scsTip = '阅读，让孩子们的梦想永不止步'
            break;
          case 4:
              scsTip =  '阅读，使孩子们有无数个可能'
            break;
          case 5:
              scsTip =  '阅读，是孩子们与世界的相逢'
            break;
          case 6:
              scsTip =  '阅读，是孩子们到达远方的船票'
            break;
          case 7:
              scsTip =  '这里有一张通往松鼠趣邦线下捐书仪式的门票'
            break;
        }

        ctx.fillText(scsTip, width / 11, imgH + imgT + 35);

    

        let thankT = imgH + imgT + 35 + 30 + 30

        ctx.setFontSize(20);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#F08200');
        ctx.fillText("THANKS", width / 11, thankT);

        ctx.setFontSize(9);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.fillText("参与更多公益活动", width / 11, thankT + 20)
        ctx.fillText("请关注松鼠趣邦小程序", width / 11, thankT + 35)

        //  绘制二维码 
        ctx.drawImage(codeSrc, width - width / 3, thankT-20 , width / 4.4, width / 4.4)

        ctx.draw();

      }).exec()

    },


    //点击保存到相册
    saveShareImg: function () {
        var that = this;

        wx.showLoading({
          title: '正在保存',
          mask: true,
        })
        console.log('canvasToTempFilePath - start')
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {

            console.log('canvasToTempFilePath - success')
            wx.hideLoading();

            var tempFilePath = res.tempFilePath;
            console.log('saveImageToPhotosAlbum - start')

            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                console.log('saveImageToPhotosAlbum - success')
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function (res) {
                    that.closePoste();
                    if (res.confirm) { }
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '已取消',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function (err) {
            wx.hideLoading();
            console.log(err)
          }
        }, this);
    },
    
    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function (src, cb) {
      // console.log(cb)
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          console.log(res)
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              console.log('宽高比', ratio)
              var imgHeight = (res2.windowWidth * 0.85 / ratio) + 130;
              // console.log(imgHeight)
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight - 130);
            }
          })
        }
      })
    }
  }
})