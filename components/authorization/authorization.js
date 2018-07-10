import wechatLogin from '../../service/login.js'

var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function (e) {
      console.log(wx.getStorageSync("token"))
      wx.setStorageSync("token", "");
      const token = wx.getStorageSync("token");
      if (token) {
        this.triggerEvent('authEvent')
      } else {
        this.wxLogin()
      }
      
    },
    wxLogin: function() {
      var _this = this
      wx.login({
        success: result => {
          // 发送resultres.code 到后台换取 openId, sessionKey, unionId
          console.log("code: " + result.code);
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              console.log("userInfo: " + app.globalData.userInfo);
              const data = {
                code: result.code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                nickname: res.userInfo.nickName,
              }
              wechatLogin(data).then((res) => {
                console.log('*************************')
                wx.setStorageSync("token", res.data.result.token);
                _this.triggerEvent('authEvent')
              }).catch((err => {
                  wx.showModal({
                    title: '提示',
                    content: res.errMsg,
                  })
              }))
            }
          })
        }
      })
    }
  }
})
