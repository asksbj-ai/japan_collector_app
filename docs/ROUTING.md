# 页面路由清单与导航结构

## 页面目录结构

```
miniprogram/
├── pages/
│   ├── index/              # 首页
│   │   ├── index.js
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── items/              # 物品列表
│   │   ├── items.js
│   │   ├── items.wxml
│   │   └── items.wxss
│   ├── item-detail/        # 物品详情
│   │   ├── item-detail.js
│   │   ├── item-detail.wxml
│   │   └── item-detail.wxss
│   ├── add-item/           # 新增/编辑物品
│   │   ├── add-item.js
│   │   ├── add-item.wxml
│   │   └── add-item.wxss
│   ├── search/             # 搜索
│   │   ├── search.js
│   │   ├── search.wxml
│   │   └── search.wxss
│   ├── restock/            # 补货清单
│   │   ├── restock.js
│   │   ├── restock.wxml
│   │   └── restock.wxss
│   ├── categories/         # 分类管理
│   │   ├── categories.js
│   │   ├── categories.wxml
│   │   └── categories.wxss
│   └── settings/           # 设置
│       ├── settings.js
│       ├── settings.wxml
│       └── settings.wxss
└── app.json
```

## 页面路由配置

| 页面 | 路由路径 | 说明 |
|------|---------|------|
| 首页 | `/pages/index/index` | 仪表盘，显示概览和快捷操作 |
| 物品列表 | `/pages/items/items` | 所有物品列表，支持分类筛选 |
| 物品详情 | `/pages/item-detail/item-detail` | 单个物品详细信息 |
| 新增/编辑物品 | `/pages/add-item/add-item` | 添加新物品或编辑现有物品 |
| 搜索 | `/pages/search/search` | 全局搜索页面 |
| 补货清单 | `/pages/restock/restock` | 库存不足需要补货的物品 |
| 分类管理 | `/pages/categories/categories` | 物品分类管理 |
| 设置 | `/pages/settings/settings` | 应用设置 |

## TabBar 导航

应用底部 tabbar 包含 4 个主要入口：

1. **首页** - `/pages/index/index`
2. **物品** - `/pages/items/items`
3. **补货** - `/pages/restock/restock`
4. **设置** - `/pages/settings/settings`

## 页面跳转规范

### 1. TabBar 页面跳转
使用 `wx.switchTab` 跳转 TabBar 页面：
```javascript
wx.switchTab({
  url: '/pages/items/items'
});
```

### 2. 普通页面跳转
使用 `wx.navigateTo` 跳转普通页面：
```javascript
wx.navigateTo({
  url: '/pages/item-detail/item-detail?id=123'
});
```

### 3. 页面传参
- 路径后拼接查询参数：`url '/pages/item-detail/item-detail?id=1&name=大米'`
- 在目标页面通过 `onLoad(options)` 接收

### 4. 返回上一页
使用 `wx.navigateBack` 返回：
```javascript
wx.navigateBack({
  delta: 1
});
```

### 5. 关闭当前页面并跳转
使用 `wx.redirectTo` 或 `wx.reLaunch`：
```javascript
// 关闭当前页面跳转
wx.redirectTo({
  url: '/pages/add-item/add-item'
});

// 重启应用
wx.reLaunch({
  url: '/pages/index/index'
});
```

## 页面跳转场景示例

| 场景 | 跳转方式 | 示例 |
|------|---------|------|
| 首页 → 物品列表 | switchTab | `wx.switchTab({ url: '/pages/items/items' })` |
| 首页 → 搜索 | navigateTo | `wx.navigateTo({ url: '/pages/search/search' })` |
| 物品列表 → 物品详情 | navigateTo | `wx.navigateTo({ url: '/pages/item-detail/item-detail?id=' + id })` |
| 物品列表 → 新增物品 | navigateTo | `wx.navigateTo({ url: '/pages/add-item/add-item' })` |
| 物品详情 → 编辑物品 | navigateTo | `wx.navigateTo({ url: '/pages/add-item/add-item?id=' + id })` |
| 任意页 → TabBar页面 | switchTab | `wx.switchTab({ url: '/pages/index/index' })` |
| 新增/编辑完成返回 | navigateBack | `wx.navigateBack({ delta: 1 })` |
