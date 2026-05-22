Page({
  data: {
    addresses: []
  },

  onShow() {
    // 每次显示页面时加载地址数据
    this.loadAddresses();
  },

  loadAddresses() {
    wx.getStorage({
      key: 'addresses',
      success: (res) => {
        this.setData({
          addresses: res.data || []
        });
      }
    });
  },

  // 跳转到地址编辑页
  goToEdit(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${id}`
    });
  },

  // 新建地址
  goToCreate() {
    wx.navigateTo({
      url: '/pages/address-edit/address-edit'
    });
  },

  // 设为默认地址
  setDefault(e) {
    const { id } = e.currentTarget.dataset;
    const addresses = this.data.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    
    // 更新storage和页面数据
    wx.setStorage({
      key: 'addresses',
      data: addresses,
      success: () => {
        this.setData({ addresses });
      }
    });
  },

  // 删除地址
  deleteAddress(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          const addresses = this.data.addresses.filter(addr => addr.id !== id);
          // 更新storage和页面数据
          wx.setStorage({
            key: 'addresses',
            data: addresses,
            success: () => {
              this.setData({ addresses });
            }
          });
        }
      }
    });
  }
}); 