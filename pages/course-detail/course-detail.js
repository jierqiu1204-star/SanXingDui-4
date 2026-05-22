Page({
  data: {
    course: null
  },
  onLoad(options) {
    const { id } = options;
    // 这里应该根据id从服务器获取课程详情
    // 以下是模拟数据
    const courseDetails = {
      1: {
        id: 1,
        title: '3D建模与文化创新课程',
        image: 'images/article/logo.jpg',
        duration: '7天研学营',
        price: '2199元/位',
        minPeople: '10-20人',
        format: '线下研学+实践操作',
        content: `课程简介：\n在这门课程中，学生将通过深度解读三星堆文化，结合3D建模与创新设计，打造属于自己的文化创意产品。课程涵盖文化元素提取、设计思维训练、3D建模实践、3D打印技术应用等多个环节，既能培养学生的创新能力，又能让他们感受到传统文化与现代科技的碰撞与融合。\n\n课程亮点：\n✔ 文化赋能：深入学习三星堆文化，理解文物背后的历史与艺术价值\n✔ 创意启发：通过头脑风暴与设计草图绘制，锻炼创造性思维\n✔ 技术实践：学习3D建模与打印技术，让创意从纸上变成现实\n✔ 成果展示：制作个人文创产品，获得导师点评与专业指导\n\n课程时长：7天\n适合人群：对文化创意、设计、3D建模感兴趣的青少年和大学生\n授课方式：线下研学+实践操作\n\n具体安排：`,
        activityImage: '/assets/images/activity-1.png'
      },
      2: {
        id: 2,
        title: '课程标题课程标题 (ID:2)',
        image: '/assets/images/article-2.png',
        duration: '120分钟',
        price: '150元/位',
        minPeople: '20人起，不足20人按20人计',
        format: '微课+实践',
        content: '活动内容活动内容',
        activityImage: '/assets/images/activity-2.png'
      },
      3: {
        id: 3,
        title: '课程标题课程标题 (ID:3)',
        image: '/assets/images/article-3.png',
        duration: '60分钟',
        price: '80元/位',
        minPeople: '30人起，不足30人按30人计',
        format: '微课+互动',
        content: '活动内容活动内容',
        activityImage: '/assets/images/activity-3.png'
      }
    };

    // 处理富文本内容
    const course = courseDetails[id] || courseDetails[1];
    course.contentNodes = course.content.split('\n').map(line => {
      // 处理带有✔的行
      if (line.includes('✔')) {
        return {
          name: 'div',
          attrs: {
            style: 'margin-bottom: 10px; color: rgba(255, 255, 255, 0.8);'
          },
          children: [{
            type: 'text',
            text: line
          }]
        };
      }
      // 处理标题行（以"："结尾的行）
      else if (line.endsWith('：')) {
        return {
          name: 'div',
          attrs: {
            style: 'font-size: 28rpx; color: #FFFFFF; margin: 20px 0 10px 0; font-weight: bold;'
          },
          children: [{
            type: 'text',
            text: line
          }]
        };
      }
      // 处理空行
      else if (line.trim() === '') {
        return {
          name: 'div',
          attrs: {
            style: 'height: 20px;'
          }
        };
      }
      // 处理普通文本行
      else {
        return {
          name: 'div',
          attrs: {
            style: 'margin-bottom: 10px; color: rgba(255, 255, 255, 0.8); line-height: 1.6;'
          },
          children: [{
            type: 'text',
            text: line
          }]
        };
      }
    });

    this.setData({
      course: course
    });
  },

  // 添加到购物车
  addToCart() {
    const course = this.data.course;
    wx.getStorage({
      key: 'cartItems',
      success: (res) => {
        let cartItems = res.data || [];
        const existingItem = cartItems.find(item => item.id === course.id && item.type === 'course');
        
        if (existingItem) {
          wx.showToast({
            title: '课程已在购物车',
            icon: 'none'
          });
        } else {
          cartItems.push({
            id: course.id,
            type: 'course',
            title: course.title,
            price: course.price,
            selected: true  // 添加选中属性
          });
          
          wx.setStorage({
            key: 'cartItems',
            data: cartItems,
            success: () => {
              wx.showToast({
                title: '已加入购物车',
                icon: 'success'
              });
            }
          });
        }
      },
      fail: () => {
        const cartItems = [{
          id: course.id,
          type: 'course',
          title: course.title,
          price: course.price,
          selected: true  // 添加选中属性
        }];
        
        wx.setStorage({
          key: 'cartItems',
          data: cartItems,
          success: () => {
            wx.showToast({
              title: '已加入购物车',
              icon: 'success'
            });
          }
        });
      }
    });
  },

  // 立即购买
  buyNow() {
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm',
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