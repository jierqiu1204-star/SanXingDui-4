Page({
  data: {
    content: ''
  },

  handleInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  submitFeedback() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'none'
      });
      return;
    }

    // 这里可以添加提交留言的逻辑
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
}); 