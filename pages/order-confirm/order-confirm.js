Page({
  data: {
    address: null,
    products: [],
    orderInfo: {
      productTotal: 0,
      shipping: 3,
      total: 0
    },
    showPaymentPopup: false,
    showNotePopup: false,
    paymentMethods: [
      { id: 1, name: '微信支付' },
      { id: 2, name: '支付宝' },
      { id: 3, name: '银行卡' }
    ],
    selectedPayment: '微信支付',
    note: ''
  },

  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();
    
    // 处理从购物车页面传来的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.processProducts(data.products);
    });
    
    // 处理从商品详情页面传来的数据
    eventChannel.on('acceptOrderData', (data) => {
      this.processProducts(data.items);
    });
  },

  onShow() {
    // 每次显示页面时加载默认地址
    this.loadDefaultAddress();
  },

  // 加载默认地址
  loadDefaultAddress() {
    wx.getStorage({
      key: 'addresses',
      success: (res) => {
        const addresses = res.data || [];
        // 获取默认地址，如果没有默认地址则使用第一个地址
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        if (defaultAddress) {
          this.setData({
            address: defaultAddress
          });
        }
      }
    });
  },

  // 统一处理商品数据的方法
  processProducts(products) {
    let productTotal = 0;
    
    // 计算商品总价
    products.forEach(item => {
      const priceStr = item.price.toString().replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr);
      if (!isNaN(price)) {
        productTotal += price * (item.quantity || 1);
      }
    });

    // 更新页面数据
    this.setData({
      products: products,
      orderInfo: {
        productTotal: productTotal.toFixed(2),
        shipping: 3,
        total: (productTotal + 3).toFixed(2)
      }
    });
  },

  // 跳转到地址选择
  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  // 显示支付方式弹窗
  showPaymentSelector() {
    this.setData({
      showPaymentPopup: true
    });
  },

  // 关闭支付方式弹窗
  closePaymentPopup() {
    this.setData({
      showPaymentPopup: false
    });
  },

  // 选择支付方式
  selectPayment(e) {
    const { method } = e.currentTarget.dataset;
    this.setData({
      selectedPayment: method,
      showPaymentPopup: false  // 选择后直接关闭支付方式弹窗
    });
  },

  // 显示备注弹窗
  addNote() {  // 添加这个方法
    this.setData({
      showNotePopup: true
    });
  },

  // 关闭备注弹窗
  closeNotePopup() {
    this.setData({
      showNotePopup: false
    });
  },

  // 处理备注输入
  handleNoteInput(e) {
    this.setData({
      note: e.detail.value
    });
  },

  // 确认备注
  confirmNote() {
    this.setData({
      showNotePopup: false
    });
  },

  // 确认订单
  confirmOrder() {
    if (!this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在创建订单'
    });

    // 获取当前时间
    const now = new Date();

    // 创建新订单对象
    const newOrder = {
      id: Date.now(),
      products: this.data.products.map(product => ({
        id: product.id,
        name: product.name,
        spec: product.spec || '默认规格',
        price: product.price,
        quantity: product.quantity,
        image: product.image
      })),
      totalPaid: this.data.orderInfo.total,
      // 使用选中的地址信息
      buyer: {
        name: this.data.address.name,
        phone: this.data.address.phone,
        address: this.data.address.address
      },
      orderInfo: {
        orderNumber: 'ORDER' + Date.now(),
        paymentMethod: this.data.selectedPayment,
        orderTime: now.toLocaleString('zh-CN'),
        status: '待发货',
        shippingMethod: '待发货',
        trackingNumber: '待发货',
        deliveryTime: '待发货'
      }
    };

    // 获取现有订单并添加新订单
    wx.getStorage({
      key: 'orders',
      success: (res) => {
        const orders = res.data || [];
        orders.unshift(newOrder);
        wx.setStorage({
          key: 'orders',
          data: orders
        });
      },
      fail: () => {
        wx.setStorage({
          key: 'orders',
          data: [newOrder]
        });
      },
      complete: () => {
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/payment-success/payment-success'
          });
        }, 1500);
      }
    });
  }
}); 