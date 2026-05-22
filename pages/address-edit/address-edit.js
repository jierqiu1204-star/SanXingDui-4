Page({
  data: {
    isEdit: false,
    address: {
      name: '',
      phone: '',
      region: ['', '', ''],
      detail: ''
    }
  },

  onLoad(options) {
    // 如果是编辑模式，从本地存储获取地址信息
    if (options.id) {
      wx.getStorage({
        key: 'addresses',
        success: (res) => {
          const addresses = res.data || [];
          const address = addresses.find(addr => addr.id === parseInt(options.id));
          if (address) {
            this.setData({
              isEdit: true,
              address: {
                ...address,
                region: address.address.split(' ').slice(0, 3),
                detail: address.address.split(' ').slice(3).join(' ')
              }
            });
          }
        }
      });
    }
  },

  // 处理输入
  handleInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`address.${field}`]: e.detail.value
    });
  },

  // 处理地区选择
  handleRegionChange(e) {
    this.setData({
      'address.region': e.detail.value
    });
  },

  // 保存地址
  saveAddress() {
    const { name, phone, region, detail } = this.data.address;
    if (!name || !phone || !region[0] || !detail) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 构建完整地址对象
    const newAddress = {
      id: this.data.isEdit ? this.data.address.id : Date.now(),
      name,
      phone,
      address: [...region, detail].join(' '),
      isDefault: this.data.isEdit ? this.data.address.isDefault : false
    };

    // 获取现有地址并更新
    wx.getStorage({
      key: 'addresses',
      success: (res) => {
        let addresses = res.data || [];
        if (this.data.isEdit) {
          // 编辑模式：更新现有地址
          addresses = addresses.map(addr => 
            addr.id === newAddress.id ? newAddress : addr
          );
        } else {
          // 新建模式：添加新地址
          addresses.push(newAddress);
        }

        wx.setStorage({
          key: 'addresses',
          data: addresses,
          success: () => {
            wx.navigateBack();
          }
        });
      },
      fail: () => {
        // 如果还没有地址，创建新的地址数组
        wx.setStorage({
          key: 'addresses',
          data: [newAddress],
          success: () => {
            wx.navigateBack();
          }
        });
      }
    });
  }
}); 