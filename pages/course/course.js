Page({
  data: {
    courses: [
      {
        id: 1,
        title: '课程标题课程标题',
        image: '/assets/images/article-1.png',
        date: '2024-01-23',
        duration: '90分钟',
        price: '100元/位',
        minPeople: '25人起，不足25人按25人计'
      },
      {
        id: 2,
        title: '课程标题课程标题',
        image: '/assets/images/article-2.png',
        date: '2024-01-23',
        duration: '120分钟',
        price: '150元/位',
        minPeople: '20人起，不足20人按20人计'
      },
      {
        id: 3,
        title: '课程标题课程标题',
        image: '/assets/images/article-3.png',
        date: '2024-01-23',
        duration: '60分钟',
        price: '80元/位',
        minPeople: '30人起，不足30人按30人计'
      }
    ]
  },
  onLoad() {
    // 可以在这里请求课程列表数据
  },

  onTapCourse(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
}) 