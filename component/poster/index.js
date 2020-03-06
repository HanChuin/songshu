const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avater: { // 图片
      type: String,
      value: ''
    },
    productname: { // 名称
      type: String,
      value: ''
    },
    productdetail: { // 地址
      type: String,
      value: ''
    },
    productstarttime: { // 开始时间
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    },
    productSrc: String, //下载图片地址
    codeSrc: String //下载二维码地址
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpost: false,
    imgHeight: 0,
    productCode: "" //二维码
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function() {
      var that = this;
      that.setData({
        showpost: true
      })
      let productSrc = that.data.productSrc
      if (productSrc != '') {
        wx.hideLoading();
        that.calculateImg(productSrc, function(data) {
          that.getQrCode(productSrc, data);
        })
      } else {
        that.getQrCode(productSrc);
      }
    },

    //下载二维码
    getQrCode: function(productSrc, imgInfo = "") {
      var that = this;
      let codeSrc = that.data.codeSrc
      that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
    },

    //canvas绘制分享海报
    sharePosteCanvas: function(avaterSrc, codeSrc, imgInfo) {
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        //头像
        if (avaterSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }
          ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }

        //活动名称
        if (that.data.productname) {
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productname).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(14);
          let contentHh = 15 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], 15, imgheght + 35 + contentHh * m);
          }
        }
        //活动简介
        if (that.data.productdetail) {
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productdetail).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#696969');
          ctx.setFontSize(12);
          let contentHh = 15 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], 15, imgheght + 82 + contentHh * m);
          }
        }

        if (that.data.productstarttime) {
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productstarttime).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#696969');
          ctx.setFontSize(12);
          let contentHh = 15 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], 15, imgheght + 114 + contentHh * m);
          }
        }

        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, left + 185, imgheght + 10, width / 4, width / 4)
          ctx.setFontSize(10);
          ctx.setFillStyle('#000');
          ctx.fillText("微信扫码或长按保存图片", left + 165, imgheght + 110);
        }
        ctx.draw();

      }).exec()
    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    saveShareImg2: function() {
      // console.log('canvasToTempFilePath - start')
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          // console.log('canvasToTempFilePath - success')
          // console.log(res.tempFilePath)
          let tempFile = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFile,
            success(res) {
              console.log('saveImageToPhotosAlbum - success')
              console.log(res)
            }
          })
        }
      }, this);
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      // console.log('canvasToTempFilePath - start')
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          // console.log('canvasToTempFilePath - success')
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          // console.log('saveImageToPhotosAlbum - start')
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              // console.log('saveImageToPhotosAlbum - success')
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function(res) {
                  that.closePoste();
                  if (res.confirm) {}
                },
                fail: function(res) {
                  console.log(res)
                }
              })
            },
            fail: function(res) {
              wx.showToast({
                title: '已取消',
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
        fail: function(err) {
          wx.hideLoading();
          console.log(err)
        }
      }, this);
    },

    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function(src, cb) {
      // console.log(cb)
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          // console.log(res)
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              // console.log('宽高比',ratio)
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