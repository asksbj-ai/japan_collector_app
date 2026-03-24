// pages/restock/restock.js
Page({
  data: {
    restockList: []
  },

  onLoad: function(options) {
    // 页面加载
    this.loadRestockList();
  },

  onShow: function() {
    // 页面显示时刷新
    this.loadRestockList();
  },

  loadRestockList: function() {
    // TODO: 从云数据库获取需要补货的物品
    const mockData = [
      { id: '1', name: '大米', currentStock: 2, minStock: 5 },
      { id: '2', name: '食用油', currentStock: 1, minStock: 2 }
    ];
    this.setData({ restockList: mockData });
  },

  onMarkRestocked: function(e) {
    const id = e.currentTarget.dataset.id;
    // TODO: 标记已补货
    console.log('标记补货:', id);
    this.loadRestockList();
  }
});
