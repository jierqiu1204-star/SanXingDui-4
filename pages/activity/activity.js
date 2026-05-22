const app = getApp()

Page({
  data: {
    activities: []
  },

  onLoad() {
    // 获取活动列表并检查收藏状态
    const activities = app.globalData.activities.map(activity => ({
      ...activity,
      isCollected: this.checkIfCollected(activity.id)
    }));
    this.setData({ activities });
  },

  onShow() {
    // 页面显示时刷新收藏状态
    const activities = this.data.activities.map(activity => ({
      ...activity,
      isCollected: this.checkIfCollected(activity.id)
    }));
    this.setData({ activities });
  },

  checkIfCollected(activityId) {
    const collections = wx.getStorageSync('collections') || [];
    return collections.some(item => item.id === activityId);
  },

  toggleCollect(e) {
    const { id } = e.currentTarget.dataset;
    const collections = wx.getStorageSync('collections') || [];
    const activity = this.data.activities.find(item => item.id === id);
    
    if (!activity) return;

    const isCollected = this.checkIfCollected(id);
    
    if (isCollected) {
      // 取消收藏
      const newCollections = collections.filter(item => item.id !== id);
      wx.setStorageSync('collections', newCollections);
    } else {
      // 添加收藏
      collections.push({
        id: activity.id,
        title: activity.title,
        image: activity.image,
        date: activity.date,
        webUrl: activity.webUrl
      });
      wx.setStorageSync('collections', collections);
    }

    // 更新UI
    const activities = this.data.activities.map(item => {
      if (item.id === id) {
        return { ...item, isCollected: !isCollected };
      }
      return item;
    });
    this.setData({ activities });

    wx.showToast({
      title: isCollected ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  },

  onTapActivity(e) {
    const { id } = e.currentTarget.dataset;
    const activity = this.data.activities.find(item => item.id === id);
    
    if (activity && activity.webUrl) {
      // 如果活动存在且有webUrl，则跳转到对应的公众号文章
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(activity.webUrl)}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } else {
      // 如果活动不存在或没有webUrl，则跳转到详情页
      wx.navigateTo({
        url: `/pages/activity-detail/activity-detail?id=${id}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  }
})