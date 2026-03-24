# 云开发环境配置

支持多环境（开发、测试、生产）切换，避免环境 ID 硬编码。

## 目录结构

```
miniprogram/
├── app.js                 # 小程序入口，云开发初始化
├── app.json               # 小程序配置
├── config/
│   └── env.js             # 环境配置模块
└── pages/
    └── index/             # 示例页面
```

## 快速开始

### 1. 配置环境 ID

编辑 `miniprogram/config/env.js`，将各环境的 `envId` 替换为实际值：

```javascript
const ENV_CONFIGS = {
  [ENV.DEV]: {
    name: '开发环境',
    envId: 'your-dev-env-id',    // 替换为实际开发环境ID
    traceUser: true
  },
  [ENV.TEST]: {
    name: '测试环境',
    envId: 'your-test-env-id',  // 替换为实际测试环境ID
    traceUser: true
  },
  [ENV.PROD]: {
    name: '生产环境',
    envId: 'your-prod-env-id',  // 替换为实际生产环境ID
    traceUser: false
  }
};
```

### 2. 设置默认环境

在 `config/env.js` 中修改 `currentEnv` 变量：

```javascript
// 当前环境（默认为开发环境）
let currentEnv = ENV.DEV;  // 可选: ENV.DEV | ENV.TEST | ENV.PROD
```

### 3. 在代码中使用

#### 获取当前环境 ID

```javascript
const { getEnvId, getEnvName, getEnvConfig } = require('./config/env.js');

// 获取环境ID
const envId = getEnvId();  // 'your-dev-env-id'

// 获取环境名称
const envName = getEnvName();  // '开发环境'

// 获取完整配置
const config = getEnvConfig();
// { name: '开发环境', envId: 'your-dev-env-id', traceUser: true }
```

#### 动态切换环境

```javascript
const app = getApp();

// 切换到测试环境
app.switchEnv('test');

// 切换到生产环境
app.switchEnv('prod');
```

#### 在云函数中使用

```javascript
// 云函数中获取环境ID
const cloud = require('wx-server-sdk');
cloud.init();
const envId = cloud.DYNAMIC_CURRENT_ENV;  // 自动使用触发函数的环境

// 或指定环境
const db = cloud.database({
  env: 'your-env-id'
});
```

## API 参考

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getEnvId()` | 获取当前环境 ID | `string` |
| `getEnvName()` | 获取当前环境名称 | `string` |
| `getEnvConfig()` | 获取当前环境完整配置 | `Object` |
| `setCurrentEnv(env)` | 设置当前环境 | `boolean` |
| `getAllEnvConfigs()` | 获取所有环境配置 | `Object` |
| `getEnvEnum()` | 获取环境枚举 | `Object` |

## 环境说明

| 环境 | 标识 | 用途 |
|------|------|------|
| 开发环境 | `dev` | 本地开发调试 |
| 测试环境 | `test` | 测试验收 |
| 生产环境 | `prod` | 正式上线 |

## 验证环境配置

1. 在微信开发者工具中打开项目
2. 打开控制台，查看日志输出：
   ```
   [Cloud] 云开发初始化完成，当前环境: 开发环境 (your-dev-env-id)
   ```
3. 进入示例页面，点击"测试数据库连接"验证数据库请求

## 常见问题

### Q: 如何获取云开发环境 ID？
A: 登录 [微信公众平台](https://mp.weixin.qq.com/)，进入云开发控制台，在"环境"页面可以看到环境 ID。

### Q: 如何在云函数中使用配置的环境？
A: 在云函数中使用 `wx.cloud.DYNAMIC_CURRENT_ENV` 可以自动使用触发云函数的环境，无需手动指定。

### Q: 生产环境需要关闭 traceUser 吗？
A: 是的，生产环境建议将 `traceUser` 设为 `false`，可以减少不必要的用户信息上报。
