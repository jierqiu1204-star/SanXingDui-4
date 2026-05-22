// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    const activities = Array.from({ length: 15 }, (_, i) => ({
      ...this.globalData.activities[i],
      image: `/images/activity/activity${i + 1}.png`
    }));

    this.globalData.activities = activities;
  },
  globalData: {
    userInfo: null,
    activities: [
      {
        id: 1,
        title: '三星堆进校园活动 | 志愿者招募',
        image: '/images/activity/activity1.png',
        date: '2025-02-19',
        webUrl: 'https://mp.weixin.qq.com/s/aOQqkXFV5M8uz5oceJKq5A'
      },
      {
        id: 2,
        title: '活动总结｜华二国际部三星堆科普活动圆满结束！',
        image: '/images/activity/activity2_2.png',
        date: '2024-11-24',
        webUrl: 'https://mp.weixin.qq.com/s/q7RO4oESfzZ7FwtCl5K-wA'
      },
      {
        id: 3,
        title: '【创业集市活动预告！】三星堆古韵，新梦绘今朝',
        image: '/images/activity/activity3.png',
        date: '2024-11-16',
        webUrl:'https://mp.weixin.qq.com/s/tEiJCCM8o5RWakfYDVPoig'
      },
      {
        id: 4,
        title: '活动预告|三星堆科普宣传线下授课系列活动',
        image: '/images/activity/activity4.png',
        date: '2024-10-13',
        webUrl:'https://mp.weixin.qq.com/s/GgSAGOw5aIHqC3VginYlaQ'
      },
      {
        id: 5,
        title: '三星堆进校园活动| 志愿者招募',
        image: '/images/activity/activity5.png',
        date: '2024-09-15',
        webUrl:'https://mp.weixin.qq.com/s/P0GXBsU3fAagteHGd_MYNA'
      },
      {
        id: 6,
        title: '第五期科普活动｜青铜神树传奇',
        image: '/images/activity/activity6.png',
        date: '2024-06-04',
        webUrl:'https://mp.weixin.qq.com/s/X4Br6lmE-uSweZVH2W2d-g'
      },
      {
        id: 7,
        title: '第五期科普活动预告｜三星堆文物探索',
        image: '/images/activity/activity7.png',
        date: '2024-06-01',
        webUrl:'https://mp.weixin.qq.com/s/occmUTRVNGHIGnv8fNj2SQ'
      },
      {
        id: 8,
        title: '第四期科普活动总结 | 探险！三星堆的新发现',
        image: '/images/activity/activity8.png',
        date: '2024-05-28',
        webUrl:'https://mp.weixin.qq.com/s/CwR1jk-dPPTyQhBAHMCx1Q'
      },
      {
        id: 9,
        title: '第四期科普活动预告｜探险！三星堆的新发现',
        image: '/images/activity/activity9.png',
        date: '2024-05-25',
        webUrl:'https://mp.weixin.qq.com/s/uj7Lhm8sz305fDK2jN0srg'
      },
      {
        id: 10,
        title: '第三期科普活动总结｜探秘三星堆：五件瑰宝的故事之旅',
        image: '/images/activity/activity10.png',
        date: '2024-05-21',
        webUrl:'https://mp.weixin.qq.com/s/FR9WQ9aeU3Xex0MS7c68jg'
      },
      {
        id: 11,
        title: '第三期科普活动预告｜三星堆文物之旅',
        image: '/images/activity/activity11.png',
        date: '2024-05-15',
        webUrl:'https://mp.weixin.qq.com/s/zHMkC7v8GJJhoRFtf6oOTA'
      },
      {
        id: 12,
        title: '第二期科普活动总结|三星堆的挖掘史与前世今生',
        image: '/images/activity/activity12.png',
        date: '2024-05-12',
        webUrl:'https://mp.weixin.qq.com/s/6ON3xM3_GsqZCPEjxnaIYg'
      },
      {
        id: 13,
        title: '预告｜第二期三星堆科普课程来啦',
        image: '/images/activity/activity13.png',
        date: '2024-05-09',
        webUrl:'https://mp.weixin.qq.com/s/AJkVmEg8H3KE3TNF8_jpyw'
      },
      {
        id: 14,
        title: '第一期科普活动总结|《金鸟》绘本引航探奇',
        image: '/images/activity/activity14.png',
        date: '2024-04-20',
        webUrl:'https://mp.weixin.qq.com/s/RSQM1cmRJeY3U7JCrs0Npw'
      },
      {
        id: 15,
        title: '第一期科普活动预告｜绘本故事《金鸟》',
        image: '/images/activity/activity15.png',
        date: '2024-04-17',
        webUrl:'https://mp.weixin.qq.com/s/1KnmX2HcBl8OuUVORyHAOw'
      }
    ],
    articles: [
      {
        id: 1,
        title: '金沙旋舞：太阳神鸟与古蜀文明的千年秘语，这个在成都随处可见的地标你知道多少？',
        image: '/images/article/article1.png',
        date: '2024-02-15',
        webUrl: 'https://mp.weixin.qq.com/s/GdRNN3vaTEBjoX98R6K1Tg'
      },
      {
        id: 2,
        title: '影视剧中的三星堆元素：《封神》系列与神秘的古蜀文明',
        image: '/images/article/article2.png',
        date: '2024-02-13',
        webUrl: 'https://mp.weixin.qq.com/s/Lh35nVn1Z8CHJAtn4jT9fw'
      },
      {
        id: 3,
        title: '《盗墓笔记》与神秘的三星堆--影视剧中的三星堆元素',
        image: '/images/article/article3.png',
        date: '2024-02-12',
        webUrl: 'https://mp.weixin.qq.com/s/Y_IfeUJzYPorW7Dhb2Dvow'
      },
      {
        id: 4,
        title: '三星堆与《山海经》:神话与现实的奇妙交汇',
        image: '/images/article/article4.png',
        date: '2024-02-09',
        webUrl: 'https://mp.weixin.qq.com/s/XKJ4MXWybpXvpIqHygoWdg'
      }
    ],
    products: [
      {
        id: 1,
        title: '小花狮钥匙扣',
        price: '8¥',
        image: '/images/goods/yaoshikou.jpg'
      },
      {
        id: 2,
        title: '梦幻三星涂色本',
        price: '18¥',
        image: '/images/goods/tuseben1.png'
      },
      {
        id: 3,
        title: '三星堆四季系列拼图',
        price: '15¥',
        image: '/images/goods/season-spring.jpg'
      },
      // ... 其他商品数据 ...
    ]
  }
})
