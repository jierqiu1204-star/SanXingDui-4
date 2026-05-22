Page({
  data: {
    activeTab: 'activity', // 'activity' 或 'article'
    activities: [],
    articles: []
  },

  onShow() {
    // 每次显示页面时获取最新的收藏数据
    const activities = wx.getStorageSync('collections') || [];
    const articles = wx.getStorageSync('articleCollections') || [];
    
    this.setData({
      activities,
      articles
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onTapActivity(e) {
    const { id } = e.currentTarget.dataset;
    const activity = this.data.activities.find(item => item.id === id);
    
    if (activity && activity.webUrl) {
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(activity.webUrl)}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
        }
      });
    } else {
      wx.navigateTo({
        url: `/pages/activity-detail/activity-detail?id=${id}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
        }
      });
    }
  },

  onTapArticle(e) {
    const { id } = e.currentTarget.dataset;
    const article = this.data.articles.find(item => item.id === id);
    
    if (article && article.webUrl) {
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(article.webUrl)}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
        }
      });
    }
  }
})