Page({
  data: {
    isPrivacyChecked: false
  },

  // 处理隐私协议勾选
  handlePrivacyCheck() {
    this.setData({
      isPrivacyChecked: !this.data.isPrivacyChecked
    });
  },

  // 处理微信一键登录
  handleWxLogin() {
    if (!this.data.isPrivacyChecked) {
      wx.showToast({
        title: '请先同意隐私协议',
        icon: 'none'
      });
      return;
    }

    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      lang: 'zh_CN',
      success: (res) => {
        // 建议增加头像昵称填写按钮
        wx.showModal({
          title: '提示',
          content: '是否前往设置个人信息？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.navigateTo({
                url: '/pages/userProfile/userProfile' // 需要新建这个页面
              });
            } else {
              this.processLogin(res.userInfo);
            }
          }
        });
      },
      fail: (err) => {
        console.error('登录失败：', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  processLogin(userInfo) {
    userInfo = {
      ...userInfo,
      userId: '441623'
    };
    wx.setStorageSync('userInfo', userInfo);
    
    wx.navigateBack({
      delta: 1,
      complete: () => {
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
          eventChannel.emit('loginSuccess', userInfo);
        }
      }
    });
  },

  // 查看隐私协议
  handlePrivacyTap() {
    // 跳转到隐私协议页面
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  }
}) 