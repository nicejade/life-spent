## LifeSpent

[![License](https://img.shields.io/github/license/nicejade/life-spent?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-10b981?style=flat-square)](https://spent.lovejade.cn/)
[![Stars](https://img.shields.io/github/stars/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/stargazers)
[![Issues](https://img.shields.io/github/issues/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/issues)
[![Last Commit](https://img.shields.io/github/last-commit/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/commits/main)

> 一次安靜地直視時間。沒有評價，只有數字。

**LifeSpent** 是一個極簡的網頁應用，透過「你的年齡」、「平均壽命」、「人口年齡中位數」這些客觀數據，平靜地告訴你：目前人生已經走過了多少比例。它想打破那種「我還年輕、還有大把時間」的幻覺，只是提醒你——剩下的時間，其實並不無限。

### ✨ 關鍵說明

- **預設數據**：平均預期壽命為男性 75.37 歲、女性 80.88 歲；全球人口年齡中位數為 31.1（可於程式碼中調整）。
- **整體語氣**：冷靜、內斂、略帶儀式感——不勵志、不說教。
- **隱私**：無需帳號、無登入流程、無追蹤，只做運算。

### 🕊️ 產品理念

LifeSpent 不是雞湯工具，也不是用來製造壓力的「生命倒數器」。它更像是一面鏡子，讓你安靜地看見時間，並自己決定接下來要如何生活。

- **客觀事實**：基於真實精算資料（平均壽命：男性 75.37 歲，女性 80.88 歲；預設全球人口年齡中位數：31.1）。
- **儀式感介面**：深色、現代風格介面，視覺盡量克制，只強調關鍵資訊。
- **零摩擦體驗**：不收集個資、不要求註冊，結果只存在你的螢幕上。

### 🛠️ 技術棧

在兼顧效能、型別安全與現代前端體驗的前提下打造：

- **前端框架**：[Svelte 4](https://svelte.dev/)
- **語言**：[TypeScript](https://www.typescriptlang.org/)
- **樣式**：[Tailwind CSS](https://tailwindcss.com/)
- **建置工具**：[Vite](https://vitejs.dev/)

### 🚀 快速開始

#### 環境需求

- Node.js（建議使用最新 LTS 版本）
- npm 或 pnpm

#### 專案啟動

```bash
# 取得原始碼
git clone https://github.com/nicejade/life-spent.git
cd life-spent

# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

### 🔗 線上體驗

[https://spent.lovejade.cn/](https://spent.lovejade.cn/)

### 🌐 存取方式

- **本機開發**：執行 `npm run dev`，於瀏覽器開啟 `http://localhost:5173`。
- **正式建置**：執行 `npm run build`，將輸出的 `dist/` 目錄部署至任一靜態主機。
- **部署選項**：可使用任一靜態託管服務（如 Vercel、Netlify、GitHub Pages 等）。

### 📂 專案結構

```bash
src/
├── helper/            # 核心計算邏輯、常數與工具函式
├── types/             # TypeScript 型別定義
├── components/        # Svelte UI 元件
├── assets/icons/      # SVG 圖示（check、github、moon、selector、sun）
├── styles/            # 精簡的全域樣式
├── App.svelte         # 應用主入口元件
└── main.ts            # 啟動入口
```

### 🎨 設計原則

- **克制文字**：描述精簡而清楚，把空間留給使用者自己的思考。
- **玻璃質感**：半透明卡片與柔和陰影，營造安靜、有層次的畫面。
- **無障礙考量**：以語義化 HTML 為基礎，預設提供 ARIA 支援。
- **響應式設計**：行動裝置優先，無論走到哪裡，都能隨時靜靜看一眼時間。

### 🤝 參與貢獻

歡迎在尊重產品氛圍與設計初衷的前提下，提出精準、適度的改進。

- **較大變更**：請先透過 Issue 討論方向與設計取向。
- **開發流程**：Fork 專案，從 `main` 建立新分支，再送出聚焦的 PR。
- **程式結構**：盡量將計算與商業邏輯放在 `lib/`，介面層放在 `src/` 元件中。
- **如有邏輯調整**：請優先考慮補上或預留測試結構（即使目前測試較精簡）。
- **風格一致性**：以 Tailwind 原子類為主，避免過度客製 CSS。

### 📜 授權條款

本專案以 MIT 授權條款釋出，詳情請參考 `LICENSE`。

---

希望以一個安靜、節制的介面，提醒自己：每一秒都正在悄悄流逝。

© 2026 至今，[nicejade](https://www.lovejade.cn/)。
