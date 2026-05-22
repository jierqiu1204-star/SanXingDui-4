Page({
  data: {
    status: '',
    trackingNumber: '',
    carrier: '',
    logisticsInfo: []
  },

  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptLogisticsData', (data) => {
      if (data.status === '待发货') {
        // 待发货状态
        this.setData({
          status: '待发货',
          logisticsInfo: [{
            time: data.orderTime,
            status: '已下单',
            detail: '商品已经下单，等待商家发货'
          }]
        });
      } else {
        // 已发货状态
        this.setData({
          status: data.status,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          logisticsInfo: [{
            time: data.orderTime,
            status: '已下单',
            detail: '商品已经下单'
          }]
        });
      }
    });
  }
}); 