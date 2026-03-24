// pages/search/search.js
Page({
  data: {
    searchQuery: '',
    searchResults: []
  },

  onLoad: function(options) {
    // 页面加载
  },

  onSearch: function(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
    // TODO: 实现搜索逻辑
  },

  onClear: function() {
    this.setData({
      searchQuery: '',
      searchResults: []
    });
  }
});
