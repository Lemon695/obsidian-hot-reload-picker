# Hot Reload Picker

通过命令面板重载已启用插件，加快 Obsidian 插件开发调试流程。

[English README](./README.md)

## 这个插件适合谁

Hot Reload Picker 是一个**刻意保持轻量**的开发者工具，适合：

- 想要**手动、可控**地重载插件的人
- 习惯使用**命令面板**进行键盘工作流的人
- 同时维护多个 Obsidian 插件，需要频繁切换重载目标的人

如果你更需要自动监听文件变化、状态栏入口、更多集成开发工具，那么更大而全的开发者工具箱类插件可能更适合你。  
如果你只想要一个专注、直接、低摩擦的插件重载器，这个插件就是为这种场景设计的。

## 功能特性

- 通过可搜索列表重载任意已启用插件
- 一键重载上次重载的插件
- 收藏常用插件，并在列表顶部优先显示
- 批量重载多个插件
- 为指定插件生成独立命令，例如 `热加载插件：Calendar`
- 可选择在列表中隐藏 Hot Reload Picker 自身
- 根据 Obsidian 当前语言自动切换中英文界面文案

## 命令

命令会根据 Obsidian 当前语言显示为中文或英文。

- `热加载插件` / `Reload plugin`
- `热加载上次插件` / `Reload last plugin`
- `收藏或取消收藏上次插件` / `Toggle favorite for last plugin`
- `批量热加载插件` / `Reload multiple plugins`
- 每个快捷命令目标对应的 `热加载插件：插件名` / `Reload plugin: <Plugin name>`

## 设置项

### 快捷热加载命令

你可以为最常重载的插件生成独立命令：

1. 打开 **设置 → 社区插件 → Hot Reload Picker**
2. 在 **快捷热加载命令** 区域点击 **搜索并添加**
3. 选择一个或多个已启用插件
4. 使用 **上移 / 下移** 调整生成命令的顺序

### 常规

- **在热加载列表中隐藏本插件**：开发其他插件时建议开启，避免误重载 Hot Reload Picker 自己

## 典型使用流程

1. 保存或重新构建你正在开发的插件
2. 打开命令面板
3. 执行 `热加载插件` 或已配置的快捷重载命令
4. 立即验证最新行为

当你同时迭代多个插件、但又希望保留手动控制的重载节奏时，这个流程会很顺手。

## 隐私与网络说明

- **不发起网络请求**
- **不采集遥测**
- **不显示广告**
- **不需要外部账号**
- **所有数据仅保存在当前 Vault 的插件数据目录中**

插件只会保存少量自身设置，例如：

- 上次重载的插件 ID
- 收藏插件 ID 列表
- 快捷热加载命令目标
- 是否在重载列表中隐藏自身

## 兼容性

- **仅支持桌面端**
- **要求 Obsidian 1.8.7 及以上**

Hot Reload Picker 依赖 Obsidian 桌面端的插件管理运行时，在原地执行 disable / enable。  
因此它只能作用于**当前已启用并已被加载**的插件。

## 安装方式

### 社区插件市场安装

发布后可直接：

1. 打开 **设置 → 社区插件**
2. 点击 **浏览**
3. 搜索 **Hot Reload Picker**
4. 点击 **安装**，然后 **启用**

### 手动安装

1. 从最新 GitHub Release 下载 `main.js`、`manifest.json`、`styles.css`
2. 在 `<vault>/.obsidian/plugins/hot-reload-picker/` 下创建目录
3. 将上述文件复制进去
4. 重新加载 Obsidian
5. 在 **设置 → 社区插件** 中启用 **Hot Reload Picker**

## 开发

```bash
npm install
npm run lint
npm run build
npm run dev
```

### 项目结构

```text
src/
├── main.ts
├── i18n.ts
├── PluginPickerModal.ts
├── BatchReloadModal.ts
├── HotReloadPickerSettingTab.ts
├── CommandPluginPickerModal.ts
├── settings.ts
└── obsidian-internal.ts
```

## 常见问题

### 为什么有些插件在列表里看不到？

Hot Reload Picker 只列出**已启用**的插件。插件必须已经被 Obsidian 加载，才能在原地重载。

### 为什么默认看不到这个插件自己？

默认会隐藏自身，以减少开发时误重载本插件的概率。  
你可以在 **设置 → 社区插件 → Hot Reload Picker → 常规** 中修改。

### 这是自动热重载吗？

不是。这个插件是**手动触发**的。它负责把“重载这一步”变快，但不会自动监听文件变化，也不会自动构建代码。

### 移动端能用吗？

不能。它依赖桌面端插件管理行为，因此作为桌面端专用插件发布。

## 许可证

0-BSD
