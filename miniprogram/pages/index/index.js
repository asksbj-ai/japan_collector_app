// miniprogram/pages/index/index.js
const { getEnvId, getEnvName, getEnvEnum, setCurrentEnv } = require('../../config/env.js');

Page({
  data: {
    envName: '',
    envId: '',
    envList: []
  },

  onLoad() {
    this.loadEnvInfo();
  },

  onShow() {
    // 每次显示页面时刷新环境信息
    this.loadEnvInfo();
  },

  loadEnvInfo() {
    const envList = Object.keys(getEnvEnum()).map(key => ({
      key: getEnvEnum()[key],
      name: this.getEnvDisplayName(getEnvEnum()[key])
    }));
    
    this.setData({
      envName: getEnvName(),
      envId: getEnvId(),
      envList: envList
    });
  },

  getEnvDisplayName(env) {
    const names = {
      'dev': '开发环境',
      'test': '测试环境',
      'prod': '生产环境'
    };
    return names[env] || env;
  },

  // 切换环境
  switchEnv(e) {
    const env = e.currentTarget.dataset.env;
    
    wx.showModal({
      title: '切换环境',
      content: `确定要切换到${this.getEnvDisplayName(env)}吗？`,
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          const success = app.switchEnv(env);
          
          if (success) {
            this.loadEnvInfo();
            wx.showToast({
              title: '环境切换成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '切换失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 测试数据库连接
  testDatabase() {
    const db = wx.cloud.database();
    db.collection('test').where({
      _id: 'test'
    }).get({
      success: res => {
        console.log('数据库查询成功', res);
        wx.showToast({
          title: '数据库连接成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('数据库查询失败', err);
        wx.showToast({
          title: '连接失败: ' + err.errMsg,
          icon: 'none'
        });
      }
    });
  }
});
