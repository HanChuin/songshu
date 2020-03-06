Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avater: String,
    activityName: String,
    userHeader: String,
    userName: String,
    activityDateStr: String,
    activityAddress: String,
    qrCodeImg: String,
    productSrc: String,
    logoSrc: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpost: false, //显示海报
    screen_width: wx.getSystemInfoSync().windowWidth,
    screen_height: wx.getSystemInfoSync().windowHeight,

    canvasWidth: 20,
    canvasHeight: 50,

    signHight: 0
  },



  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 画海报
     */
    getAvaterInfo: function () {

      this.setData({
        showpost: true
      });


      // 活动名
      let actName = this.data.activityName
      let  allHeight =  0
      console.log('actName', actName.length); 
      if (actName.length > 30 ) {
        actName = actName.substring(0,30) + '...'
        allHeight = 15 
      } else if (actName.length > 14) {
        allHeight = 15 
      } else {
        allHeight = 0
      }
      console.log('actName', allHeight); 
      // console.log('screen_width', this.data.screen_width);
      // console.log('screen_height', this.data.screen_height);

      let ratio = this.data.screen_width / 375;

      let ctx = wx.createCanvasContext('myCanvas', this);
      // 计算画布高度
      let height = this.data.screen_height * 0.8 - (15 - allHeight) * ratio;
      let width = this.data.screen_height * 0.8 * 1717 / 3480 ;

      console.log('width', width)
      console.log('height', height)
      this.setData({
        canvasWidth: width,
        canvasHeight: height
      });

      // 填充白色
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, width, height);
    
      // 底部黄条
      ctx.drawImage('../../img/img_poster_ss.jpeg', 0, width * 2.05 - width * 209 / 1717 - 10 - (20 - allHeight) * ratio , width, width * 209 / 1717);


      // 2. 身份信息 & 活动信息 & 二维码
      // 2.1 身份信息

      // ctx.save()
      // ctx.drawImage(this.data.logoSrc , 20 , 500 , 40 , 40 );
      this.drawRound(ctx, width, width / 8 , allHeight , ratio );
      // // 2.2 名字

      // this.drawUserName(ctx, width, height, allHeight, ratio );
      this.drawTip(ctx, width, width*2.07, allHeight, ratio );
      // 2.3 活动时间
      this.drawActivityTime(ctx, width, width * 2.05 , allHeight , ratio);
      // 2.4 活动地点
      this.drawActivityAddress(ctx, width, width * 2.05 , allHeight , ratio)
      // 2.5 小程序码 
      this.drawQrcode(ctx, width, width * 2.05 , allHeight ,ratio)
      // 2.6 长按文字


      let imgWidth = width - 30 * ratio
      let imgHeight = (width - 30 * ratio) * 800 / 575;
      ctx.setShadow(0, 0, 0, '#fff')

      // 开始
      let contentHh = 20 * ratio;

      // 2.2 名字
      this.drawUserName(ctx, width, width * 2.07, allHeight, ratio);

      // 单行文字
      if (allHeight == 0) {
        // 1. 图片文字框 1606 * 2408
        this.roundReact(ctx, 10, 12, width - 20, imgHeight + (35 + allHeight) * ratio, 5, imgWidth + 10, imgHeight + (35 + allHeight) * ratio)
        // 1.1 图片
        ctx.drawImage(this.data.productSrc, 20 * ratio, 24 * ratio, width - 42 * ratio, (width - 42 * ratio) * 800 / 575);
        // 1.2 文字
        const CONTENT_ROW_LENGTH = width * ratio / 8; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = this.textByteLength((actName).substr(0, 60), CONTENT_ROW_LENGTH);
        ctx.setTextAlign('left');
        ctx.font = 'normal bold 20px sans-serif'
        ctx.setFillStyle('#000');
        ctx.setFontSize(13 * ratio);

        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], 20, imgHeight + 32 * ratio + contentHh * m - 0.5);
          // ctx.fillText(contentArray[m], 20 - 0.5, imgHeight + 32 * ratio + contentHh * m);
        
        }
        
      } else {
        // 1. 图片文字框 1606 * 2408
        this.roundReact(ctx, 10, 12, width - 20, imgHeight + (35 + allHeight) * ratio, 5, imgWidth + 10, imgHeight + (35 + allHeight) * ratio)
        // 1.1 图片
      ctx.drawImage(this.data.productSrc, 20 * ratio, 24 * ratio, width - 42 * ratio, (width - 42 * ratio) * 800 / 575);
        // 1.2 文字
        const CONTENT_ROW_LENGTH = width * ratio / 8; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = this.textByteLength((actName).substr(0, 60), CONTENT_ROW_LENGTH);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.font = 'normal bold 20px sans-serif'
        ctx.setFontSize(13 * ratio);

        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], 20, imgHeight + 32 * ratio + contentHh * m - 0.5);
          // ctx.fillText(contentArray[m], 20 - 0.5, imgHeight + 32 * ratio + contentHh * poste_contentm);
        }
      }
      ctx.draw()
    },

    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      })
    },

    /**
     *  * @param {CanvasContext} ctx canvas上下文
     * @param {number} x 圆角矩形选区的左上角 x坐标
     * @param {number} y 圆角矩形选区的左上角 y坐标
     * @param {number} w 圆角矩形选区的宽度
     * @param {number} h 圆角矩形选区的高度
     * @param {number} r 圆角的半径
     */
    roundReact: function (ctx, x, y, w, h, r, imgWidth, imgHeight) {
      // 开始绘制
      ctx.beginPath()
      // 
      ctx.setFillStyle('#fff')

      ctx.setShadow(0, 0, 5, 'rgba(12,12,12,0.3)')
      ctx.fillRect(x, y, imgWidth, imgHeight)
      ctx.setShadow(0, 0, 0, '#fff')

      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)

      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx.fill()
      ctx.closePath()
      // 剪切
      ctx.clip();

    },

    // text为传入的文本  num为单行显示的字节长度
    textByteLength(text, num) {
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

    /**
     * 圆形头像
     */
    drawRound(contex, width, avatarurl_width , allHeight , ration) {
      contex.save();
      var avatarurl_x = width / 20;   //绘制的头像在画布上的位置
      var avatarurl_y = width * 2.07 * 0.81  - avatarurl_width - (20 - allHeight) * ration;   //绘制的头像在画布上的位置
      contex.save();

      contex.beginPath(); //开始绘制
      //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      contex.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_width / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);

      contex.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因

      contex.drawImage(this.data.logoSrc, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_width); // 推进去图片，必须是https图片

      contex.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
    },

    /**
     * 用户名称
     */
    drawUserName(ctx, width, height, allHeight, ratio ) {
      ctx.setTextAlign('left');
      ctx.setFillStyle('#000');
      ctx.font = 'normal bold 20px sans-serif'
      ctx.setFontSize(width / 24);
      ctx.fillText((this.data.userName).substr(0, 40), width / 5, height * 0.77 - 0.5 - (20 - allHeight ) * ratio);
    },


    drawTip(ctx, width, height, allHeight, ratio ) {
    // 正文 单行显示字符长度
      ctx.setTextAlign('left');
      ctx.setFillStyle('#000');
      ctx.setFontSize(width / 30);
      ctx.fillText(('邀请您前来参加此次公益活动').substr(0, 40), width / 5, height * 0.798 - (20 - allHeight)*ratio );
    },

    /**
     * 
     */
    drawActivityTime(ctx, width, height, allHeight, ratio) {

      // 时间 
      ctx.drawImage('../../img/icon_time.png' , width / 20 , height * 0.842 - (20 -allHeight) * ratio , width / 23 , width / 23)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#000');
      ctx.setFontSize(width / 28);
      ctx.fillText((this.data.activityDateStr).substr(0, 40), width / 9, height * 0.86 - (20 - allHeight) * ratio );
    },

    drawActivityAddress(ctx, width, height, allHeight , ratio) {
      let addressStr = ''
      if (this.data.activityAddress.length > 16) {
        addressStr = this.data.activityAddress.substr(0,16) + '...'
      } else {
        addressStr = this.data.activityAddress
      }

      // 地址
      ctx.drawImage('../../img/icon_location.png', width / 20, height * 0.872 - (20 - allHeight) * ratio , width / 25, width / 25 * 173 / 137)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#000');
      ctx.setFontSize(width / 28);
      ctx.fillText(addressStr, width / 9, height * 0.894 - (20 - allHeight) * ratio);

      console.log('address' , this.data.activityAddress.length);
    },

    // 画二维码
    drawQrcode(ctx, width, height , allHeight , ratio ){
      ctx.drawImage(this.data.qrCodeImg, width * 0.735, height * 0.75 - (20 - allHeight) * ratio  , width / 4.5 , width / 4.5)

      // 长按参与活动按钮图
      ctx.drawImage('../../img/icon_canyu_btn.png', width * 0.735, height * 0.87 - (20 - allHeight) * ratio , width / 4.5 , width / 4.5 * 70 / 304 );
    },


    //点击保存到相册
    saveShareImg: function () {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      let height = this.data.screen_height * 0.8;
      let width = height * 1717 / 3498;

      wx.canvasToTempFilePath({
        x:0,
        y:0,
        // width,
        // height, 
        canvasId: 'myCanvas',
        success: function (res) {
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

    drawBtnImg(ctx , width , height) {
    },

    // 小程序码
    drawQrTip(ctx, x, y, w, h, r) {
      ctx.save();
      if (w < 2 * r) {
        r = w / 2;
      }
      if (h < 2 * r) {
        r = h / 2;
      }
      ctx.beginPath();
      ctx.setFillStyle("#ccc");
      ctx.setStrokeStyle('#111');
      ctx.setFillStyle("#ccc");
      ctx.setLineWidth(1);
      ctx.setFillStyle("#ccc");

  
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.stroke();
      ctx.closePath();
       
    }

  }
})