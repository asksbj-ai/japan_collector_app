# 云开发环境配置

支持多环境（开发、测试、生产）切换，避免环境 ID 硬编码。

## 目录结构

```
miniprogram/
├── app.js                 # 小程序入口，应用初始化
├── app.json               # 小程序配置
├── config/
│   ├── env.js             # 环境配置模块
│   └── init.js            # 应用初始化模块
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

## 应用初始化流程

本项目实现了统一的全局应用入口初始化流程，确保各模块按正确顺序初始化。

### 初始化顺序

```
1. 环境配置加载
   ↓
2. 云开发初始化
   ↓
3. 全局状态初始化
   ↓
4. 缓存初始化
   ↓
5. 用户信息加载
```

### 初始化模块说明

| 步骤 | 模块 | 功能 |
|------|------|------|
| 1 | 环境配置加载 | 从存储或默认配置加载环境设置 |
| 2 | 云开发初始化 | 初始化云开发 SDK，设置环境 ID |
| 3 | 全局状态初始化 | 初始化全局数据、用户状态、设置项 |
| 4 | 缓存初始化 | 清理过期缓存，检查缓存有效性 |
| 5 | 用户信息加载 | 从缓存加载用户信息（如有） |

### 使用全局状态

在页面中访问全局状态：

```javascript
const app = getApp();

// 获取用户信息
const userInfo = app.globalData.userInfo;

// 检查应用是否就绪
if (app.isAppReady()) {
  console.log('应用已就绪');
}

// 获取当前环境
const envName = app.globalData.envName;

// 获取设置
const settings = app.getSettings();
```

### 更新全局状态

```javascript
const app = getApp();

// 更新用户信息
app.setUserInfo({ openId: 'xxx', nickName: '张三' });

// 更新设置
app.updateSettings({
  theme: 'dark',
  notifications: false
});
```

### 初始化结果查询

```javascript
const app = getApp();

// 获取初始化详情
const initResults = app.getInitResults();
// {
//   order: ['envConfig', 'cloud', 'globalState', 'cache', 'userInfo'],
//   results: { ... },
//   initialized: true
// }
```

### 错误处理

初始化过程中的错误会被捕获并记录：

- **环境配置/云开发失败**: 会阻断初始化，提示错误
- **全局状态/缓存失败**: 不阻断应用启动，但相关功能可能受限
- **用户信息失败**: 不阻断应用启动，用户视为未登录状态

查看初始化日志：

```
[Init] ========== 应用初始化开始 ==========
[Init] ✓ 环境配置加载完成: 开发环境
[Init] ✓ 云开发初始化完成: 开发环境 (your-dev-env-id)
[Init] ✓ 全局状态初始化完成
[Init] ✓ 缓存初始化完成
[Init] ✓ 用户信息加载完成（未登录）
[Init] ========== 应用初始化完成 (123ms) ==========
```

## API 参考

### env.js 模块

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getEnvId()` | 获取当前环境 ID | `string` |
| `getEnvName()` | 获取当前环境名称 | `string` |
| `getEnvConfig()` | 获取当前环境完整配置 | `Object` |
| `setCurrentEnv(env)` | 设置当前环境 | `boolean` |
| `getAllEnvConfigs()` | 获取所有环境配置 | `Object` |
| `getEnvEnum()` | 获取环境枚举 | `Object` |

### app.js 全局方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `app.switchEnv(env)` | 切换云开发环境 | `Promise<boolean>` |
| `app.getEnvConfig()` | 获取当前环境配置 | `Object` |
| `app.getInitResults()` | 获取初始化结果 | `Object` |
| `app.isAppReady()` | 检查应用是否就绪 | `boolean` |
| `app.setUserInfo(userInfo)` | 设置用户信息 | `void` |
| `app.updateSettings(settings)` | 更新设置 | `void` |
| `app.getSettings()` | 获取设置 | `Object` |

### globalData 属性

| 属性 | 说明 | 类型 |
|------|------|------|
| `userInfo` | 用户信息 | `Object \| null` |
| `isLoggedIn` | 是否已登录 | `boolean` |
| `appReady` | 应用是否就绪 | `boolean` |
| `isInitialized` | 是否已完成初始化 | `boolean` |
| `envId` | 当前环境 ID | `string` |
| `envName` | 当前环境名称 | `string` |
| `settings` | 应用设置 | `Object` |

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
   [Init] ========== 应用初始化开始 ==========
   [Init] ✓ 云开发初始化完成，当前环境: 开发环境 (your-dev-env-id)
   [Init] ========== 应用初始化完成 ==========
   ```
3. 进入示例页面，点击"测试数据库连接"验证数据库请求

## 常见问题

### Q: 如何获取云开发环境 ID？
A: 登录 [微信公众平台](https://mp.weixin.qq.com/)，进入云开发控制台，在"环境"页面可以看到环境 ID。

### Q: 如何在云函数中使用配置的环境？
A: 在云函数中使用 `wx.cloud.DYNAMIC_CURRENT_ENV` 可以自动使用触发云函数的环境，无需手动指定。

### Q: 生产环境需要关闭 traceUser 吗？
A: 是的，生产环境建议将 `traceUser` 设为 `false`，可以减少不必要的用户信息上报。

### Q: 如何在页面中使用全局状态？
A: 使用 `const app = getApp()` 获取应用实例，然后通过 `app.globalData.xxx` 访问全局数据。

### Q: 初始化失败怎么办？
A: 检查控制台日志中的 `[Init]` 相关输出，确认哪个步骤失败。常见问题包括：环境 ID 未配置、网络问题等。
