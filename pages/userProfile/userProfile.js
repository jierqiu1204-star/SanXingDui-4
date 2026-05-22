Page({
  data: {
    avatarUrl: '',
    nickname: ''
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl
    });
  },

  onInputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  handleSave() {
    if (!this.data.avatarUrl || !this.data.nickname) {
      wx.showToast({
        title: '请设置头像和昵称',
        icon: 'none'
      });
      return;
    }

    const userInfo = {
      ...wx.getStorageSync('userInfo'),
      avatarUrl: this.data.avatarUrl,
      nickName: this.data.nickname
    };

    wx.setStorageSync('userInfo', userInfo);
    
    // 直接跳转到个人中心页面
    wx.reLaunch({
      url: '/pages/profile/profile'
    });
  }
}) 