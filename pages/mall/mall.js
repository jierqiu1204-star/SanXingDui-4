// pages/mall/mall.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 只取前两个商品作为文创商品展示
    products: app.globalData.products.slice(0, 2),
    courses: [
      {
        id: 1,
        title: '3D建模与文化创新课程',
        image: '/images/article/logo.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 点击文创商品
  onTapProduct(e) {
    const { id } = e.currentTarget.dataset;
    // 从全局数据中获取完整的商品信息
    const product = app.globalData.products.find(item => item.id === id);

    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${id}`,
      events: {
        acceptProductData: function(data) {
          console.log('acceptProductData', data);
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptProductData', { product: product });
      },
      fail: (err) => {
        console.error('页面跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 点击更多文创商品
  onTapMoreProducts() {
    wx.navigateTo({
      url: '/pages/product/product',
      fail: (err) => {
        console.error('页面跳转失败：', err);
      }
    });
  },

  // 点击文教课程
  onTapCourse(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败：', err);
      }
    });
  },

  // 点击更多文教课程
  onTapMoreCourses() {
    wx.navigateTo({
      url: '/pages/course/course',
      fail: (err) => {
        console.error('页面跳转失败：', err);
      }
    });
  }
})