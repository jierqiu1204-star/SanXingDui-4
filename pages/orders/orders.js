Page({
  data: {
    currentTab: '全部',
    tabs: ['全部', '待发货', '待收货', '已收货', '售后'],
    orders: [],
    filteredOrders: []  // 添加过滤后的订单列表
  },

  onShow() {
    // 每次显示页面时加载订单数据
    this.loadOrders();
  },

  loadOrders() {
    wx.getStorage({
      key: 'orders',
      success: (res) => {
        const orders = res.data || [];
        this.setData({ 
          orders: orders 
        }, () => {
          // 加载完数据后立即进行过滤
          this.filterOrders(this.data.currentTab);
        });
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.filterOrders(tab);
  },

  filterOrders(tab) {
    let filteredOrders = [];
    switch(tab) {
      case '全部':
        filteredOrders = this.data.orders;
        break;
      case '待发货':
        filteredOrders = this.data.orders.filter(order => 
          order.orderInfo.status === '待发货'
        );
        break;
      case '待收货':
        filteredOrders = this.data.orders.filter(order => 
          order.orderInfo.status === '待收货'
        );
        break;
      case '已收货':
        filteredOrders = this.data.orders.filter(order => 
          order.orderInfo.status === '已收货'
        );
        break;
      case '售后':
        filteredOrders = this.data.orders.filter(order => 
          order.orderInfo.status === '售后'
        );
        break;
    }
    this.setData({ filteredOrders });
  },

  handleSearch(e) {
    const searchValue = e.detail.value;
    // 实现搜索功能
    console.log('搜索：', searchValue);
  },

  onTapOrder(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    });
  },

  deleteOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，执行删除操作
          const updatedOrders = this.data.orders.filter(order => order.id !== orderId);
          
          // 更新storage和页面数据
          wx.setStorage({
            key: 'orders',
            data: updatedOrders,
            success: () => {
              this.setData({ orders: updatedOrders });
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  }
}) 