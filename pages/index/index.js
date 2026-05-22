// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    activities: app.globalData.activities.slice(0, 2),  // 只取前两个活动
    articles: app.globalData.articles.slice(0, 1),  // 只取第一篇文章
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    // 获取活动列表并检查收藏状态
    const activities = app.globalData.activities.slice(0, 2).map(activity => ({
      ...activity,
      isCollected: this.checkIfCollected(activity.id, 'activity')
    }));

    // 获取文章列表并检查收藏状态
    const articles = app.globalData.articles.slice(0, 1).map(article => ({
      ...article,
      isCollected: this.checkIfCollected(article.id, 'article')
    }));

    this.setData({ 
      activities,
      articles
    });
  },
  onShow() {
    // 页面显示时刷新收藏状态
    const activities = this.data.activities.map(activity => ({
      ...activity,
      isCollected: this.checkIfCollected(activity.id, 'activity')
    }));

    const articles = this.data.articles.map(article => ({
      ...article,
      isCollected: this.checkIfCollected(article.id, 'article')
    }));

    this.setData({ 
      activities,
      articles
    });
  },
  checkIfCollected(id, type) {
    const key = type === 'article' ? 'articleCollections' : 'collections';
    const collections = wx.getStorageSync(key) || [];
    return collections.some(item => item.id === id);
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
  // 点击更多活动
  onTapMoreActivities() {
    wx.navigateTo({
      url: '/pages/activity/activity',
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  // 点击更多科普文章
  onTapMoreArticles() {
    wx.navigateTo({
      url: '/pages/article/article',
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  onTapActivity(e) {
    const { id } = e.currentTarget.dataset;
    
    if (id === 1) {
      // 跳转到第一个活动的公众号文章
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent('https://mp.weixin.qq.com/s/aOQqkXFV5M8uz5oceJKq5A')}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } else if (id === 2) {
      // 跳转到第二个活动的公众号文章
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent('https://mp.weixin.qq.com/s/q7RO4oESfzZ7FwtCl5K-wA')}`,
        fail: (err) => {
          console.error('页面跳转失败：', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },
  // 添加点击更多课程的处理函数
  onTapMoreCourses() {
    wx.navigateTo({
      url: '/pages/course/course',
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  // 点击科普文章
  onTapArticle(e) {
    const article = this.data.articles[0];  // 获取第一篇文章
    if (article && article.webUrl) {
      // 跳转到公众号文章
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
    }
  },
  toggleArticleCollect(e) {
    const { id } = e.currentTarget.dataset;
    const collections = wx.getStorageSync('articleCollections') || [];
    const article = this.data.articles.find(item => item.id === id);
    
    if (!article) return;

    const isCollected = this.checkIfCollected(id, 'article');
    
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
  // 跳转到文章详情
  goToArticleDetail() {
    wx.navigateTo({
      url: '/pages/article-detail/article-detail'
    });
  },
})
