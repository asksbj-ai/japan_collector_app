/**
 * 小程序入口文件
 * 云开发环境配置初始化
 */

const { setCurrentEnv, getEnvId, getEnvName, getEnvConfig, ENV } = require('./config/env.js');

App({
  onLaunch() {
    // 初始化云开发
    this.initCloud();
  },

  /**
   * 初始化云开发
   * 从配置模块读取 envId，支持多环境切换
   */
  initCloud() {
    const envId = getEnvId();
    const envName = getEnvName();
    const config = getEnvConfig();

    // 检查是否配置了有效的环境ID
    if (!envId || envId.startsWith('your-')) {
      console.warn('[Cloud] 警告: 环境ID未正确配置，请检查 config/env.js');
      console.warn('[Cloud] 当前环境:', envName);
      return;
    }

    // 初始化云开发
    wx.cloud.init({
      env: envId,
      traceUser: config.traceUser
    });

    console.log(`[Cloud] 云开发初始化完成，当前环境: ${envName} (${envId})`);
  },

  /**
   * 切换云开发环境
   * @param {string} env - 'dev' | 'test' | 'prod'
   * @returns {boolean} 切换是否成功
   */
  switchEnv(env) {
    const success = setCurrentEnv(env);
    if (success) {
      // 重新初始化云开发
      this.initCloud();
    }
    return success;
  },

  // 全局数据
  globalData: {
    userInfo: null
  }
});
