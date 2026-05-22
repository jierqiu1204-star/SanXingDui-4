// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查是否已经登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        nickname: userInfo.nickName || ''
      });
    }

    // 添加登录成功的事件监听
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('loginSuccess', (userInfo) => {
        this.setData({
          userInfo: userInfo,
          nickname: userInfo.nickName || ''
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次页面显示时检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        nickname: userInfo.nickName || ''
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 处理头像点击登录
  handleLogin() {
    console.log('点击登录按钮');
    console.log('当前userInfo状态：', this.data.userInfo);
    
    // 移除userInfo判断，直接跳转
    wx.navigateTo({
      url: '/pages/login/login',
      success: (res) => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到收藏页面
  navigateToCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 跳转到订单页面
  navigateToOrders() {
    wx.navigateTo({
      url: '/pages/orders/orders'
    });
  },

  // 跳转到关于我们页面
  goToAboutUs() {
    wx.navigateTo({
      url: '/pages/about-us/about-us'
    });
  },

  // 跳转到留言页面
  goToQuestion() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  }
})