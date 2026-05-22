const app = getApp()

Page({
  data: {
    product: null,
    showCartPopup: false,
    showBuyPopup: false,
    quantity: 1
  },
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptProductData', (data) => {
      const { product } = data;
      // 从 app.globalData 中获取完整的商品数据
      const globalProduct = app.globalData.products.find(item => item.id === product.id);
      
      // 设置商品数据，使用 globalProduct 的基础信息
      this.setData({
        product: {
          id: globalProduct.id,
          name: globalProduct.title,  // 使用全局数据中的标题
          image: globalProduct.image, // 使用全局数据中的图片
          price: globalProduct.price, // 使用全局数据中的价格
          description: globalProduct.id === 1 ? 
            `文化联名，创意无限！\n这款钥匙扣融合了三星堆经典形象与华东师范大学吉祥物，在保留三星堆文化特色的同时，增添了现代校园文化的元素。精美的造型、独特的设计，使其成为一款极具收藏价值的文创产品。` : 
            globalProduct.id === 2 ? 
            `创意涂色，点亮古文明的神秘色彩！\n这本涂色本以三星堆文物为原型，精心绘制了多个经典形象，包括青铜面具、神树、金杖等，搭配简要的文化介绍，让孩子们在自由创作的同时，了解三星堆的艺术风格和历史背景。\n内页材质：环保高质量纸张，适合彩铅、水彩等多种绘画工具` :
            globalProduct.id === 3 ?
            `季节系列拼图：\n拼出四季流转，感受古蜀文明之美！\n这款拼图以春夏秋冬为主题，将三星堆文化元素融入四季景色之中，展现古蜀文明的神秘与生机。每一块拼图都是一个小小的文化窗口，让孩子们在拼图过程中，不仅锻炼专注力，还能学习历史文化知识。\n\n拼图块数：100片 / 300片 / 500片（可选）` :
            `一本生动有趣的绘本，用简单易懂的图画向孩子们介绍三星堆文化。`,
          detailTitle: `产品详情`,
          detailImages: globalProduct.id === 2 ? [
            '/images/goods/tuseben2.png',
            '/images/goods/tuseben4.png'
          ] : []
        }
      });
    });
  },
  showCartPopup() {
    this.setData({
      showCartPopup: true
    });
  },
  hideCartPopup() {
    this.setData({
      showCartPopup: false
    });
  },
  showBuyPopup() {
    this.setData({
      showBuyPopup: true
    });
  },
  hideBuyPopup() {
    this.setData({
      showBuyPopup: false
    });
  },
  increaseQuantity() {
    this.setData({
      quantity: this.data.quantity + 1
    });
  },
  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },
  addToCart() {
    const product = {
      id: this.data.product.id,
      type: 'product',
      name: this.data.product.name,
      price: this.data.product.price,
      image: this.data.product.image,
      quantity: this.data.quantity,  // 使用用户选择的数量
      selected: true
    };

    wx.getStorage({
      key: 'cartItems',
      success: (res) => {
        let cartItems = res.data || [];
        // 检查商品是否已在购物车中
        const existingItem = cartItems.find(item => item.id === product.id && item.type === 'product');
        
        if (existingItem) {
          existingItem.quantity += this.data.quantity;  // 增加用户选择的数量
        } else {
          cartItems.push(product);
        }
        
        wx.setStorage({
          key: 'cartItems',
          data: cartItems,
          success: () => {
            // 关闭弹窗
            this.hideCartPopup();
            // 显示成功提示
            wx.showToast({
              title: '已加入购物车',
              icon: 'success'
            });
          }
        });
      },
      fail: () => {
        // 如果还没有购物车数据，创建新的购物车数据
        wx.setStorage({
          key: 'cartItems',
          data: [product],
          success: () => {
            // 关闭弹窗
            this.hideCartPopup();
            // 显示成功提示
            wx.showToast({
              title: '已加入购物车',
              icon: 'success'
            });
          }
        });
      }
    });
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