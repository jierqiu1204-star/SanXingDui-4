Page({
  data: {
    article: null
  },
  onLoad(options) {
    const { id } = options;
    // 这里应该根据id请求详细数据
    // 暂时模拟数据
    this.setData({
      article: {
        id,
        title: '文章标题文章标题',
        image: '/assets/images/article-1.png',
        date: '2024-01-23',
        content: '正文内容正文内容'
      }
    });
  }
}) 