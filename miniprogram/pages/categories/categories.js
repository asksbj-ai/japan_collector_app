// pages/categories/categories.js
Page({
  data: {
    categories: []
  },

  onLoad: function(options) {
    this.loadCategories();
  },

  onShow: function() {
    this.loadCategories();
  },

  loadCategories: function() {
    // TODO: 从云数据库获取分类
    const mockData = [
      { id: '1', name: '主食', icon: '🍚' },
      { id: '2', name: '调味品', icon: '🧂' },
      { id: '3', name: '零食', icon: '🍪' }
    ];
    this.setData({ categories: mockData });
  },

  onAddCategory: function() {
    // TODO: 添加分类
    wx.showToast({ title: '添加分类', icon: 'none' });
  }
});
