/**
 * 全局应用入口初始化模块
 * 统一管理云开发、环境配置、全局状态的初始化顺序
 * 
 * 初始化顺序：
 * 1. 环境配置加载
 * 2. 云开发初始化
 * 3. 全局状态初始化
 * 4. 缓存初始化
 * 5. 用户信息加载
 */

const { setCurrentEnv, getEnvId, getEnvName, getEnvConfig, ENV } = require('./env.js');

/**
 * 应用初始化管理器
 */
class AppInitializer {
  constructor() {
    this._initialized = false;
    this._initPromise = null;
    this._initOrder = [];
    this._initResults = {};
  }

  /**
   * 执行完整的应用初始化流程
   * @returns {Promise<void>}
   */
  async init() {
    if (this._initialized) {
      console.log('[Init] 应用已初始化，跳过');
      return;
    }

    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = this._doInit();
    await this._initPromise;
    this._initialized = true;
  }

  /**
   * 执行实际的初始化流程
   * @returns {Promise<void>}
   */
  async _doInit() {
    console.log('[Init] ========== 应用初始化开始 ==========');
    const startTime = Date.now();

    try {
      // 步骤1: 环境配置加载
      await this._initEnvConfig();
      
      // 步骤2: 云开发初始化
      await this._initCloud();
      
      // 步骤3: 全局状态初始化
      await this._initGlobalState();
      
      // 步骤4: 缓存初始化
      await this._initCache();
      
      // 步骤5: 用户信息加载
      await this._initUserInfo();

      const duration = Date.now() - startTime;
      console.log(`[Init] ========== 应用初始化完成 (${duration}ms) ==========`);
      
    } catch (error) {
      console.error('[Init] 应用初始化失败:', error);
      this._handleInitError(error);
    }
  }

  /**
   * 步骤1: 环境配置加载
   */
  async _initEnvConfig() {
    const step = 'envConfig';
    this._initOrder.push(step);
    
    try {
      // 从缓存或默认配置加载环境
      const savedEnv = wx.getStorageSync('app_env');
      if (savedEnv && [ENV.DEV, ENV.TEST, ENV.PROD].includes(savedEnv)) {
        setCurrentEnv(savedEnv);
      } else {
        // 默认使用开发环境
        setCurrentEnv(ENV.DEV);
      }
      
      const envConfig = getEnvConfig();
      this._initResults[step] = { success: true, env: envConfig.name };
      console.log(`[Init] ✓ 环境配置加载完成: ${envConfig.name}`);
      
    } catch (error) {
      this._initResults[step] = { success: false, error: error.message };
      console.error('[Init] ✗ 环境配置加载失败:', error);
      throw error;
    }
  }

  /**
   * 步骤2: 云开发初始化
   */
  async _initCloud() {
    const step = 'cloud';
    this._initOrder.push(step);
    
    try {
      const envId = getEnvId();
      const envName = getEnvName();
      const config = getEnvConfig();

      // 检查环境ID是否有效
      if (!envId || envId.startsWith('your-')) {
        throw new Error(`环境ID未正确配置: ${envId || 'undefined'}`);
      }

      // 初始化云开发
      wx.cloud.init({
        env: envId,
        traceUser: config.traceUser
      });

      this._initResults[step] = { success: true, envId, envName };
      console.log(`[Init] ✓ 云开发初始化完成: ${envName} (${envId})`);
      
    } catch (error) {
      this._initResults[step] = { success: false, error: error.message };
      console.error('[Init] ✗ 云开发初始化失败:', error);
      // 云开发初始化失败不阻断应用启动，但会限制云功能
      console.warn('[Init] ⚠ 云开发初始化失败，应用将继续运行但部分功能可能受限');
    }
  }

  /**
   * 步骤3: 全局状态初始化
   */
  async _initGlobalState() {
    const step = 'globalState';
    this._initOrder.push(step);
    
    try {
      // 初始化全局状态
      const globalState = {
        // 用户信息
        userInfo: null,
        isLoggedIn: false,
        
        // 应用状态
        appReady: false,
        initResults: this._initResults,
        
        // 设置
        settings: {
          theme: wx.getStorageSync('theme') || 'light',
          language: wx.getStorageSync('language') || 'zh-CN',
          notifications: wx.getStorageSync('notifications') !== false
        },
        
        // 缓存策略
        cache: {
          userInfo: { enabled: true, ttl: 3600000 }, // 1小时
          config: { enabled: true, ttl: 86400000 },  // 24小时
        }
      };

      this._initResults[step] = { success: true };
      console.log('[Init] ✓ 全局状态初始化完成');
      
      // 返回全局状态供应用使用
      return globalState;
      
    } catch (error) {
      this._initResults[step] = { success: false, error: error.message };
      console.error('[Init] ✗ 全局状态初始化失败:', error);
      throw error;
    }
  }

  /**
   * 步骤4: 缓存初始化
   */
  async _initCache() {
    const step = 'cache';
    this._initOrder.push(step);
    
    try {
      // 清理过期缓存
      const now = Date.now();
      const cacheKeys = ['userInfo', 'appConfig', 'lastSync'];
      
      for (const key of cacheKeys) {
        const cached = wx.getStorageSync(`cache_${key}`);
        if (cached) {
          const { data, expire } = cached;
          if (expire && now > expire) {
            wx.removeStorageSync(`cache_${key}`);
            console.log(`[Init] ✓ 清理过期缓存: ${key}`);
          }
        }
      }

      this._initResults[step] = { success: true };
      console.log('[Init] ✓ 缓存初始化完成');
      
    } catch (error) {
      this._initResults[step] = { success: false, error: error.message };
      console.error('[Init] ✗ 缓存初始化失败:', error);
      // 缓存初始化失败不阻断应用
    }
  }

  /**
   * 步骤5: 用户信息加载
   */
  async _initUserInfo() {
    const step = 'userInfo';
    this._initOrder.push(step);
    
    try {
      // 尝试从缓存加载用户信息
      const cachedUserInfo = this._getCachedData('userInfo');
      if (cachedUserInfo) {
        this._initResults[step] = { success: true, fromCache: true };
        console.log('[Init] ✓ 用户信息从缓存加载');
        return cachedUserInfo;
      }

      // TODO: 如果需要自动登录，可以在这里调用登录接口
      // const userInfo = await this._login();
      
      this._initResults[step] = { success: true, fromCache: false };
      console.log('[Init] ✓ 用户信息加载完成（未登录）');
      return null;
      
    } catch (error) {
      this._initResults[step] = { success: false, error: error.message };
      console.error('[Init] ✗ 用户信息加载失败:', error);
      // 用户信息加载失败不阻断应用
      return null;
    }
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键名
   * @returns {any|null}
   */
  _getCachedData(key) {
    try {
      const cached = wx.getStorageSync(`cache_${key}`);
      if (!cached) return null;
      
      const { data, expire } = cached;
      if (expire && Date.now() > expire) {
        wx.removeStorageSync(`cache_${key}`);
        return null;
      }
      return data;
    } catch (error) {
      console.warn(`[Init] 读取缓存失败 ${key}:`, error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   * @param {string} key - 缓存键名
   * @param {any} data - 数据
   * @param {number} ttl - 过期时间(毫秒)
   */
  _setCachedData(key, data, ttl = 3600000) {
    try {
      const cached = {
        data,
        expire: Date.now() + ttl
      };
      wx.setStorageSync(`cache_${key}`, cached);
    } catch (error) {
      console.warn(`[Init] 设置缓存失败 ${key}:`, error);
    }
  }

  /**
   * 处理初始化错误
   * @param {Error} error - 错误对象
   */
  _handleInitError(error) {
    // 可以在这里添加错误上报逻辑
    console.error('[Init] 初始化错误详情:', {
      message: error.message,
      stack: error.stack,
      initResults: this._initResults
    });
  }

  /**
   * 获取初始化结果
   * @returns {Object}
   */
  getInitResults() {
    return {
      order: this._initOrder,
      results: this._initResults,
      initialized: this._initialized
    };
  }

  /**
   * 切换环境并重新初始化云开发
   * @param {string} env - 环境名称
   * @returns {Promise<boolean>}
   */
  async switchEnv(env) {
    try {
      const success = setCurrentEnv(env);
      if (success) {
        // 保存环境选择
        wx.setStorageSync('app_env', env);
        // 重新初始化云开发
        await this._initCloud();
        console.log(`[Init] 环境切换成功: ${getEnvName()}`);
      }
      return success;
    } catch (error) {
      console.error('[Init] 环境切换失败:', error);
      return false;
    }
  }
}

// 导出单例
module.exports = new AppInitializer();
