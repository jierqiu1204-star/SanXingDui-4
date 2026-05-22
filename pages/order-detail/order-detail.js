Page({
  data: {
    currentAction: '', // 当前选中的操作
    order: null,
    showAfterSalePopup: false,
    showAfterSaleTypePopup: false,  // 添加售后类型弹窗状态
    showAfterSaleFormPopup: false,  // 添加申请表单弹窗状态
    goodsStatus: '未收到货',
    refundReason: '未按照约定时间发货',
    description: '',
    images: [],  // 存储上传的图片
    afterSaleReasons: [
      { id: 1, text: '货物与描述不符', checked: false },
      { id: 2, text: '质量问题', checked: false },
      { id: 3, text: '空包裹', checked: false },
      { id: 4, text: '商家发错货', checked: false },
      { id: 5, text: '其他原因', checked: false }
    ],
    afterSaleTypes: [  // 添加售后类型数据
      { id: 1, text: '仅退款', checked: false },
      { id: 2, text: '退货退款', checked: false }
    ]
  },

  onLoad(options) {
    const orderId = parseInt(options.id);
    // 从storage中获取订单数据
    wx.getStorage({
      key: 'orders',
      success: (res) => {
        const order = res.data.find(item => item.id === orderId);
        if (order) {
          this.setData({
            order: {
              // 直接使用products数组
              products: order.products,
              buyer: order.buyer,
              orderInfo: {
                orderNumber: order.orderInfo.orderNumber,
                paymentMethod: order.orderInfo.paymentMethod,
                orderTime: order.orderInfo.orderTime,
                status: order.orderInfo.status,
                // 根据状态设置物流信息
                shippingMethod: order.orderInfo.status === '待发货' ? '待发货' : order.orderInfo.shippingMethod,
                trackingNumber: order.orderInfo.status === '待发货' ? '待发货' : order.orderInfo.trackingNumber,
                deliveryTime: order.orderInfo.status === '待发货' ? '待发货' : order.orderInfo.deliveryTime
              },
              totalPaid: order.totalPaid
            }
          });
        }
      }
    });
  },

  // 复制订单号
  copyOrderNumber() {
    wx.setClipboardData({
      data: this.data.order.orderInfo.orderNumber,
      success: () => {
        wx.showToast({
          title: '订单号已复制',
          icon: 'success'
        });
      }
    });
  },

  // 复制快递单号
  copyTrackingNumber() {
    wx.setClipboardData({
      data: this.data.order.orderInfo.trackingNumber,
      success: () => {
        wx.showToast({
          title: '快递单号已复制',
          icon: 'success'
        });
      }
    });
  },

  // 处理底部导航操作
  handleAction(e) {
    const action = e.currentTarget.dataset.action;
    this.setData({ currentAction: action });

    switch(action) {
      case 'confirm':
        this.handleConfirmReceipt();
        break;
      case 'physical':
        this.handleCheckLogistics();
        break;
      case 'apply':
        this.handleAfterSale();
        break;
      case 'contact':
        this.handleContactSeller();
        break;
    }
  },

  // 确认收货
  handleConfirmReceipt() {
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          // 处理确认收货逻辑
          wx.showToast({
            title: '确认收货成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看物流
  handleCheckLogistics() {
    wx.navigateTo({
      url: '/pages/logistics/logistics',
      success: (res) => {
        res.eventChannel.emit('acceptLogisticsData', {
          status: this.data.order.orderInfo.status,
          orderTime: this.data.order.orderInfo.orderTime,
          trackingNumber: this.data.order.orderInfo.trackingNumber,
          carrier: this.data.order.orderInfo.shippingMethod
        });
      }
    });
  },

  // 处理申请售后
  handleAfterSale() {
    console.log('点击了申请售后');
    this.setData({
      showAfterSalePopup: true
    });
  },

  // 联系商家
  handleContactSeller() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  },

  // 关闭售后弹窗
  closeAfterSalePopup() {
    this.setData({
      showAfterSalePopup: false,
      // 重置选择状态
      afterSaleReasons: this.data.afterSaleReasons.map(reason => ({
        ...reason,
        checked: false
      }))
    });
  },

  // 切换原因选择状态
  toggleReason(e) {
    const id = e.currentTarget.dataset.id;
    const reasons = this.data.afterSaleReasons.map(reason => ({
      ...reason,
      checked: reason.id === id ? !reason.checked : reason.checked
    }));
    
    this.setData({
      afterSaleReasons: reasons
    });
  },

  // 提交售后原因，显示类型选择
  submitAfterSale() {
    const selectedReasons = this.data.afterSaleReasons
      .filter(reason => reason.checked)
      .map(reason => reason.text);

    if (selectedReasons.length === 0) {
      wx.showToast({
        title: '请选择售后原因',
        icon: 'none'
      });
      return;
    }

    // 显示售后类型选择
    this.setData({
      showAfterSalePopup: false,
      showAfterSaleTypePopup: true
    });
  },

  // 关闭售后类型弹窗
  closeAfterSaleTypePopup() {
    this.setData({
      showAfterSaleTypePopup: false,
      // 重置选择状态
      afterSaleTypes: this.data.afterSaleTypes.map(type => ({
        ...type,
        checked: false
      }))
    });
  },

  // 切换售后类型选择
  toggleType(e) {
    const id = e.currentTarget.dataset.id;
    const types = this.data.afterSaleTypes.map(type => ({
      ...type,
      checked: type.id === id ? !type.checked : false  // 单选模式
    }));
    
    this.setData({
      afterSaleTypes: types
    });
  },

  // 提交售后类型后，显示申请表单
  submitAfterSaleType() {
    const selectedType = this.data.afterSaleTypes.find(type => type.checked);
    
    if (!selectedType) {
      wx.showToast({
        title: '请选择售后类型',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showAfterSaleTypePopup: false,
      showAfterSaleFormPopup: true
    });
  },

  // 关闭申请表单
  closeAfterSaleFormPopup() {
    this.setData({
      showAfterSaleFormPopup: false,
      description: '',
      images: []
    });
  },

  // 处理描述输入
  handleDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  // 提交申请
  submitApplication() {
    if (!this.data.description.trim()) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      });
      return;
    }

    // 这里添加提交申请的逻辑
    console.log('提交售后申请', {
      goodsStatus: this.data.goodsStatus,
      refundReason: this.data.refundReason,
      description: this.data.description,
      images: this.data.images
    });

    this.closeAfterSaleFormPopup();
    wx.showToast({
      title: '申请提交成功',
      icon: 'success'
    });
  },

  // 添加跳转到地址列表的函数
  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  }

}) 