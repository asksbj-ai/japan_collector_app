// pages/settings/settings.js
Page({
  data: {
    userInfo: null
  },

  onLoad: function(options) {
    // 页面加载
  },

  onShow: function() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
  }
});
