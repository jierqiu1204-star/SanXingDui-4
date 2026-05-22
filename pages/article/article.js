const app = getApp()

Page({
  data: {
    articles: []
  },

  onLoad() {
    // 获取文章列表并检查收藏状态
    const articles = app.globalData.articles.map(article => ({
      ...article,
      isCollected: this.checkIfCollected(article.id)
    }));
    this.setData({ articles });
  },

  onShow() {
    // 页面显示时刷新收藏状态
    const articles = this.data.articles.map(article => ({
      ...article,
      isCollected: this.checkIfCollected(article.id)
    }));
    this.setData({ articles });
  },

  checkIfCollected(articleId) {
    const collections = wx.getStorageSync('articleCollections') || [];
    return collections.some(item => item.id === articleId);
  },

  toggleCollect(e) {
    const { id } = e.currentTarget.dataset;
    const collections = wx.getStorageSync('articleCollections') || [];
    const article = this.data.articles.find(item => item.id === id);
    
    if (!article) return;

    const isCollected = this.checkIfCollected(id);
    
    if (isCollected) {
      // 取消收藏
      const newCollections = collections.filter(item => item.id !== id);
      wx.setStorageSync('articleCollections', newCollections);
    } else {
      // 添加收藏
      collections.push({
        id: article.id,
        title: article.title,
        image: article.image,
        date: article.date,
        webUrl: article.webUrl
      });
      wx.setStorageSync('articleCollections', collections);
    }

    // 更新UI
    const articles = this.data.articles.map(item => {
      if (item.id === id) {
        return { ...item, isCollected: !isCollected };
      }
      return item;
    });
    this.setData({ articles });

    wx.showToast({
      title: isCollected ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  },

  onTapArticle(e) {
    const { id } = e.currentTarget.dataset;
    const article = this.data.articles.find(item => item.id === id);
    
    if (article && article.webUrl) {
      // 如果文章存在且有webUrl，则跳转到对应的公众号文章
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(article.webUrl)}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } else {
      // 如果文章不存在或没有webUrl，则跳转到详情页
      wx.navigateTo({
        url: `/pages/article-detail/article-detail?id=${id}`,
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