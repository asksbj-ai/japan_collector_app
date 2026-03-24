/**
 * 云开发环境配置
 * 支持多环境切换：开发、测试、生产
 * 
 * 使用方式：
 * 1. 修改当前环境：setCurrentEnv('dev' | 'test' | 'prod')
 * 2. 获取当前环境配置：getEnvConfig()
 * 3. 获取当前环境ID：getEnvId()
 */

// 环境枚举
const ENV = {
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod'
};

// 各环境配置（请根据实际情况修改环境ID）
const ENV_CONFIGS = {
  [ENV.DEV]: {
    name: '开发环境',
    envId: 'your-dev-env-id',  // TODO: 替换为实际开发环境ID
    traceUser: true
  },
  [ENV.TEST]: {
    name: '测试环境',
    envId: 'your-test-env-id',  // TODO: 替换为实际测试环境ID
    traceUser: true
  },
  [ENV.PROD]: {
    name: '生产环境',
    envId: 'your-prod-env-id',  // TODO: 替换为实际生产环境ID
    traceUser: false
  }
};

// 当前环境（默认为开发环境）
let currentEnv = ENV.DEV;

/**
 * 设置当前环境
 * @param {string} env - 环境名称 'dev' | 'test' | 'prod'
 */
function setCurrentEnv(env) {
  if (!ENV_CONFIGS[env]) {
    console.error(`[CloudEnv] 无效的环境: ${env}`);
    return false;
  }
  currentEnv = env;
  console.log(`[CloudEnv] 已切换到环境: ${getEnvConfig().name}`);
  return true;
}

/**
 * 获取当前环境配置
 * @returns {Object} 当前环境配置对象
 */
function getEnvConfig() {
  return ENV_CONFIGS[currentEnv];
}

/**
 * 获取当前环境ID
 * @returns {string} 云开发环境ID
 */
function getEnvId() {
  return getEnvConfig().envId;
}

/**
 * 获取当前环境名称
 * @returns {string} 环境名称
 */
function getEnvName() {
  return getEnvConfig().name;
}

/**
 * 获取所有环境配置（用于调试）
 * @returns {Object} 所有环境配置
 */
function getAllEnvConfigs() {
  return ENV_CONFIGS;
}

/**
 * 获取当前环境枚举
 * @returns {Object} 环境枚举
 */
function getEnvEnum() {
  return ENV;
}

module.exports = {
  ENV,
  setCurrentEnv,
  getEnvConfig,
  getEnvId,
  getEnvName,
  getAllEnvConfigs,
  getEnvEnum
};
