// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    cartItems: [],  // 改为空数组，后续从storage加载
    showSpecPopup: false,
    currentItem: null,
    specOptions: [
      { id: 1, name: '规格一' },
      { id: 2, name: '规格二' },
      { id: 3, name: '规格三' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    // 每次显示页面时加载购物车数据
    this.loadCartData();
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

  // 处理搜索输入
  handleSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchValue: ''
    });
  },

  // 修改商品数量
  changeQuantity(e) {
    const { id, type } = e.currentTarget.dataset;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === id) {
        let newQuantity = type === 'add' ? item.quantity + 1 : item.quantity - 1;
        newQuantity = Math.max(1, newQuantity); // 确保数量不小于1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.setData({ cartItems });
    this.calculateTotal();
  },

  // 切换商品选中状态
  toggleSelect(e) {
    const { id } = e.currentTarget.dataset;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    // 更新storage和页面数据
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: () => {
        this.setData({ cartItems });
        this.calculateTotal();
      }
    });
  },

  // 显示规格选择弹窗
  selectSpec(e) {
    const { id } = e.currentTarget.dataset;
    const currentItem = this.data.cartItems.find(item => item.id === id);
    this.setData({
      showSpecPopup: true,
      currentItem
    });
  },

  // 关闭规格选择弹窗
  closeSpecPopup() {
    this.setData({
      showSpecPopup: false,
      currentItem: null
    });
  },

  // 选择规格
  handleSpecSelect(e) {
    const { spec } = e.currentTarget.dataset;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === this.data.currentItem.id) {
        return { ...item, spec: spec.name };
      }
      return item;
    });
    this.setData({
      cartItems,
      showSpecPopup: false,
      currentItem: null
    });
  },

  // 加载购物车数据
  loadCartData() {
    wx.getStorage({
      key: 'cartItems',
      success: (res) => {
        // 确保所有项目都有 selected 属性
        const cartItems = (res.data || []).map(item => ({
          ...item,
          selected: item.selected !== undefined ? item.selected : true
        }));
        
        this.setData({
          cartItems: cartItems
        });
        this.calculateTotal();
      },
      fail: () => {
        this.setData({
          cartItems: []
        });
      }
    });
  },

  // 计算总价
  calculateTotal() {
    let total = 0;
    this.data.cartItems.forEach(item => {
      if (!item.selected) return; // 如果未选中则跳过

      if (item.type === 'course') {
        // 课程价格处理（去掉"元/位"等后缀）
        const priceStr = item.price.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          total += price;
        }
      } else {
        // 普通商品价格处理（去掉"¥"符号）
        const priceStr = item.price.replace('¥', '');
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          total += price * (item.quantity || 1);
        }
      }
    });
    
    this.setData({
      total: total.toFixed(2) // 保留两位小数
    });
  },

  // 删除购物车项目
  removeFromCart(e) {
    const { index } = e.currentTarget.dataset;
    let cartItems = [...this.data.cartItems];
    cartItems.splice(index, 1);
    
    // 更新storage和页面数据
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: () => {
        this.setData({ cartItems });
        this.calculateTotal();
      }
    });
  },

  // 确认订单
  confirmOrder() {
    const selectedItems = this.data.cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm',
      success: function(res) {
        // 传递选中的商品数据到订单确认页
        res.eventChannel.emit('acceptDataFromOpenerPage', { products: selectedItems })
      }
    });
  }
})