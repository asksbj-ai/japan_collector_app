/**
 * 小程序入口文件
 * 全局应用入口与初始化流程
 */

const initManager = require('./config/init.js');
const { getEnvId, getEnvName, getEnvConfig, ENV } = require('./config/env.js');

App({
  // 全局数据
  globalData: {
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    
    // 应用状态
    appReady: false,
    isInitialized: false,
    
    // 环境信息
    envId: '',
    envName: '',
    
    // 设置
    settings: {
      theme: 'light',
      language: 'zh-CN',
      notifications: true
    }
  },

  onLaunch() {
    // 执行应用初始化
    this.initApp();
  },

  /**
   * 应用初始化入口
   */
  async initApp() {
    try {
      // 执行初始化流程
      await initManager.init();
      
      // 更新全局状态
      this.globalData.isInitialized = true;
      this.globalData.envId = getEnvId();
      this.globalData.envName = getEnvName();
      this.globalData.appReady = true;
      
      console.log('[App] 应用初始化完成');
      
    } catch (error) {
      console.error('[App] 应用初始化失败:', error);
      // 即使初始化失败，也标记为已尝试初始化
      this.globalData.isInitialized = true;
    }
  },

  /**
   * 切换云开发环境
   * @param {string} env - 'dev' | 'test' | 'prod'
   * @returns {Promise<boolean>} 切换是否成功
   */
  async switchEnv(env) {
    try {
      const success = await initManager.switchEnv(env);
      if (success) {
        this.globalData.envId = getEnvId();
        this.globalData.envName = getEnvName();
        console.log(`[App] 环境切换成功: ${this.globalData.envName}`);
      }
      return success;
    } catch (error) {
      console.error('[App] 环境切换失败:', error);
      return false;
    }
  },

  /**
   * 获取当前环境配置
   * @returns {Object}
   */
  getEnvConfig() {
    return getEnvConfig();
  },

  /**
   * 获取初始化结果
   * @returns {Object}
   */
  getInitResults() {
    return initManager.getInitResults();
  },

  /**
   * 检查应用是否已就绪
   * @returns {boolean}
   */
  isAppReady() {
    return this.globalData.appReady && this.globalData.isInitialized;
  },

  /**
   * 更新用户信息
   * @param {Object} userInfo - 用户信息
   */
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = !!userInfo;
  },

  /**
   * 更新设置
   * @param {Object} settings - 设置对象
   */
  updateSettings(settings) {
    this.globalData.settings = {
      ...this.globalData.settings,
      ...settings
    };
    
    // 持久化设置
    if (settings.theme) {
      wx.setStorageSync('theme', settings.theme);
    }
    if (settings.language) {
      wx.setStorageSync('language', settings.language);
    }
    if (typeof settings.notifications === 'boolean') {
      wx.setStorageSync('notifications', settings.notifications);
    }
  },

  /**
   * 获取设置
   * @returns {Object}
   */
  getSettings() {
    return this.globalData.settings;
  }
});
