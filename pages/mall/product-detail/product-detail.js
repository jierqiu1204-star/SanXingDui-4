const app = getApp()

Page({
  data: {
    product: {
      id: 1,
      name: '商品名称商品名称',
      price: 50,
      image: '/assets/images/product-1.png',
      description: '一本生动有趣的绘本，用简单易懂的图画向孩子们介绍三星堆文化。',
      detail_image: '/assets/images/product-detail-1.png'
    },
    showCartPopup: false,
    showBuyPopup: false,
    quantity: 1
  },
  onLoad(options) {
    const { id } = options;
    // 这里可以根据id请求商品详细信息
  },
  buyNow() {
    // 准备订单数据
    const orderItem = {
      id: this.data.product.id,
      type: 'product',
      name: this.data.product.name,
      price: this.data.product.price,
      image: this.data.product.image,
      quantity: this.data.quantity
    };

    // 关闭弹窗
    this.hideBuyPopup();
    
    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm',
      success: (res) => {
        // 传递商品数据到订单确认页面
        res.eventChannel.emit('acceptOrderData', {
          items: [orderItem],
          totalPrice: parseFloat(orderItem.price) * orderItem.quantity
        });
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