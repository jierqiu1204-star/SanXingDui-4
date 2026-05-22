const app = getApp()

Page({
  data: {
    products: app.globalData.products
  },

  onTapProduct(e) {
    const { id } = e.currentTarget.dataset;
    // 从全局数据中获取完整的商品信息
    const product = app.globalData.products.find(item => item.id === id);

    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${id}`,
      events: {
        // 为指定事件添加一个监听器
        acceptProductData: function(data) {
          console.log('acceptProductData', data);
        }
      },
      success: function(res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptProductData', { product: product });
      },
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
}) 