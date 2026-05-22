Page({
  data: {
    article: null
  },
  onLoad(options) {
    // 获取传递过来的文章id
    const { id } = options;
    // 这里应该根据id请求详细数据
    // 暂时模拟数据
    this.setData({
      article: {
        id,
        title: `科普文章标题${id}`,
        image: '/assets/images/article-1.png',
        date: '2024-01-23',
        content: `正文内容${id}`
      }
    });
  },

  onTapArticle() {
    const { id } = this.data.article;
    wx.navigateTo({
      url: `/pages/article/article-content/article-content?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败：', err);
      }
    });
  }
}) 