# Tiny Note - 笔记应用

一个基于 Next.js 和 React 构建的现代化笔记应用，支持富文本编辑、标签管理、分类组织等功能。

## ✨ 功能特性

### 用户功能

- 🔐 用户注册、登录、退出
- 👤 个人资料管理
- ⚙️ 用户设置

### 笔记功能

- 📝 创建、编辑、删除笔记
- 🏷️ 标签管理
- 📁 分类组织
- 🔍 笔记搜索
- 🌐 公开/私密设置
- 📱 响应式设计

### 编辑器功能

- ✨ 富文本编辑（基于 Slate.js）
- 📝 Markdown 支持
- 🎨 文本格式化（粗体、斜体、下划线、代码）
- 📊 标题、列表、引用
- ↔️ 文本对齐

## 🚀 技术栈

- **前端框架**: Next.js 15
- **UI 组件库**: Ant Design 5
- **富文本编辑器**: Slate.js
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **样式**: SCSS + CSS Modules
- **类型检查**: TypeScript

## 📦 安装和运行

### 环境要求

- Node.js 22.2.0 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 🏗️ 项目结构

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── login/          # 登录页面
│   ├── register/       # 注册页面
│   ├── note/           # 笔记相关页面
│   └── globals.css     # 全局样式
├── components/          # React 组件
│   ├── container/      # 主容器组件
│   ├── editor/         # 编辑器组件
│   └── sideBar/        # 侧边栏组件
├── store/              # 状态管理
│   └── index.ts        # Zustand stores
├── services/            # API 服务
│   └── api.ts          # API 调用
├── types/               # TypeScript 类型定义
│   └── index.ts        # 通用类型
└── styles/              # 样式文件
    └── variable.scss    # SCSS 变量
```

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# API配置
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 应用配置
NEXT_PUBLIC_APP_NAME=Tiny Note
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### API 服务

应用需要后端 API 服务支持，包括：

- 用户认证 (`/auth/*`)
- 笔记管理 (`/notes/*`)
- 标签管理 (`/tags/*`)
- 分类管理 (`/categories/*`)

## 📱 响应式设计

应用采用响应式设计，支持多种设备：

- 🖥️ 桌面端：完整功能，侧边栏可折叠
- 📱 移动端：垂直布局，触摸友好
- 📟 平板端：自适应布局

## 🎨 主题支持

- 🌞 浅色主题（默认）
- 🌙 深色主题（计划中）
- 🎨 自定义主题色

## 🚧 开发计划

### 已完成

- [x] 用户认证系统
- [x] 笔记 CRUD 操作
- [x] 富文本编辑器
- [x] 标签和分类管理
- [x] 响应式设计
- [x] 状态管理

### 进行中

- [ ] 笔记分享功能
- [ ] 离线支持
- [ ] 数据同步
- [ ] 图片上传

### 计划中

- [ ] 协作编辑
- [ ] 版本历史
- [ ] 导入/导出
- [ ] 插件系统

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 邮箱：your-email@example.com
- 🐛 Issues：GitHub Issues
- 💬 讨论：GitHub Discussions

---

**Tiny Note** - 让记录变得简单而美好 ✨
