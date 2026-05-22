Page({
  data: {
    countdown: 10
  },

  onLoad() {
    this.startCountdown();
  },

  startCountdown() {
    const timer = setInterval(() => {
      if (this.data.countdown > 1) {
        this.setData({
          countdown: this.data.countdown - 1
        });
      } else {
        clearInterval(timer);
        wx.switchTab({
          url: '/pages/cart/cart'
        });
      }
    }, 1000);
  },

  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  }
}); 