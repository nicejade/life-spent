## LifeSpent

[![License](https://img.shields.io/github/license/nicejade/life-spent?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-10b981?style=flat-square)](https://spent.lovejade.cn/)
[![Stars](https://img.shields.io/github/stars/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/stargazers)
[![Issues](https://img.shields.io/github/issues/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/issues)
[![Last Commit](https://img.shields.io/github/last-commit/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/commits/main)

> 关于时间的一次安静对视。没有评判，只有数字。

**LifeSpent** 是一个极简的网页应用，用「你的年龄」「平均寿命」「全球人口中位数年龄」这些冷静的数字，告诉你：此刻你的人生已经过去了多少。它想打破那种「我还年轻、来日方长」的幻觉，只是温和地提醒——剩下的时间，并不无限。

### ✨ 关键信息

- **默认数据**：平均预期寿命为男性 75.37 岁、女性 80.88 岁；全球人口中位数年龄为 31.1（可在代码中修改）。
- **整体语气**：平静、克制、偏沉静——不煽情、不励志。
- **隐私**：无需账号，无需登录，无跟踪，仅做计算。

### 🕊️ 设计理念

LifeSpent 不是鸡汤工具，也不是用来制造恐惧的「死亡倒计时」。它更像是一面镜子，让你安静地看见时间本身。

- **客观数据**：依据真实精算数据（平均寿命：男性 75.37 岁，女性 80.88 岁；默认全球人口中位年龄：31.1）。
- **仪式感设计**：深色、现代的界面，突出信息清晰与情绪沉淀。
- **零阻力体验**：不需要注册，不会记录任何个人信息，只呈现数字结果。

### 🛠️ 技术栈

在保证性能、类型安全和现代开发体验的前提下构建：

- **前端框架**：[Svelte 4](https://svelte.dev/)
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **构建工具**：[Vite](https://vitejs.dev/)

### 🚀 快速开始

#### 环境准备

- Node.js（推荐使用最新 LTS 版本）
- npm 或 pnpm

#### 项目启动

```bash
# 克隆仓库
git clone https://github.com/nicejade/life-spent.git
cd life-spent

# 安装依赖
npm install

# 启动开发环境
npm run dev

# 构建生产版本
npm run build
```

### 🔗 在线体验

[https://spent.lovejade.cn/](https://spent.lovejade.cn/)

### 🌐 访问方式

- **本地开发**：执行 `npm run dev`，在浏览器中打开 `http://localhost:5173`。
- **生产构建**：执行 `npm run build`，将生成的 `dist/` 目录部署到任意静态托管服务。
- **部署建议**：支持任意静态托管（如 Vercel、Netlify、GitHub Pages 等）。

### 📂 项目结构

```bash
src/
├── helper/            # 核心计算逻辑、常量与工具函数
├── types/             # TypeScript 类型定义
├── components/        # Svelte UI 组件
├── assets/icons/      # SVG 图标（check、github、moon、selector、sun）
├── styles/            # 极少量全局样式
├── App.svelte         # 应用入口组件
└── main.ts            # 启动入口
```

### 🎨 设计原则

- **克制**：文字与排版尽量简洁，给情绪留出呼吸空间。
- **玻璃质感**：半透明卡片，营造层次分明、稍带仪式感的现代视觉。
- **可访问性**：使用语义化 HTML，默认带有完整 ARIA 支持。
- **响应式**：移动端优先设计，让你在任何场景下都能安静地看一眼时间。

### 🤝 参与贡献

欢迎在尊重产品气质的前提下，进行小而精的改进。

- **重要改动前**：请先通过 Issue 讨论方向。
- **开发流程**：Fork 仓库，从 `main` 分支切出新分支，再提交专注、清晰的 PR。
- **代码组织**：业务与计算逻辑尽量放在 `lib/`，界面只放在 `src/` 组件中。
- **若修改逻辑**：请尽量为核心逻辑预留或补充测试结构（即便测试当前较精简）。
- **风格约定**：优先使用 Tailwind 原子类，避免大段自定义 CSS。

### 📜 许可证

本项目基于 MIT 协议开源，详情见 `LICENSE`。

---

用一点克制的设计，提醒自己：每一秒都在悄悄流逝。

© 2026 至今，[nicejade](https://www.lovejade.cn/)。
