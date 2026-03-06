## LifeSpent

[![License](https://img.shields.io/github/license/nicejade/life-spent?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-10b981?style=flat-square)](https://spent.lovejade.cn/)
[![Stars](https://img.shields.io/github/stars/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/stargazers)
[![Issues](https://img.shields.io/github/issues/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/issues)
[![Last Commit](https://img.shields.io/github/last-commit/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/commits/main)

> 時間と静かに向き合うための、小さな鏡。評価も説教もなく、あるのは数字だけです。

**LifeSpent** は、自分の「年齢」「平均寿命」「人口の年齢中央値」に基づいて、人生のどれくらいがすでに過ぎ去ったのかを可視化する、ミニマルな Web アプリケーションです。「まだ若い」「時間はたっぷりある」という幻想からそっと距離を取り、残された時間を意識的に扱うきっかけをつくることを目指しています。

### ✨ 特徴

- **デフォルト値**：平均余命は男性 75.37 歳、女性 80.88 歳。世界人口の年齢中央値は 31.1（コード内で変更可能）。
- **トーン**：静かで、抑制が効いていて、落ち着いた雰囲気。モチベーション喚起でも、脅しでもありません。
- **プライバシー**：アカウント登録なし・トラッキングなし。計算だけを行います。

### 🕊️ コンセプト

LifeSpent は、自己啓発ツールでも、恐怖を煽る「死のカウントダウン」でもありません。  
それは、ただ時間そのものを映し出す、静かな鏡です。

- **客観的な数字**：実際のアクチュアリー・データに基づく平均寿命（男性 75.37 歳、女性 80.88 歳）と、世界人口の年齢中央値（デフォルト 31.1）。
- **儀式性のあるデザイン**：ダークでモダンなインターフェース。数字がすっと視界に入り、余計な装飾は控えめに。
- **ストレスのない体験**：アカウント作成もログインも不要。結果はブラウザ上だけで完結します。

### 🛠️ 技術スタック

パフォーマンス、型安全性、モダンな開発体験を重視して構築しています。

- **フロントエンド**：[Svelte 4](https://svelte.dev/)
- **言語**：[TypeScript](https://www.typescriptlang.org/)
- **スタイリング**：[Tailwind CSS](https://tailwindcss.com/)
- **ビルドツール**：[Vite](https://vitejs.dev/)

### 🚀 はじめかた

#### 必要環境

- Node.js（最新版 LTS 推奨）
- npm または pnpm

#### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/nicejade/life-spent.git
cd life-spent

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build
```

### 🔗 デモ

[https://spent.lovejade.cn/](https://spent.lovejade.cn/)

### 🌐 アクセス方法

- **ローカル開発**：`npm run dev` 実行後、ブラウザで `http://localhost:5173` を開きます。
- **本番ビルド**：`npm run build` 実行後、生成された `dist/` ディレクトリを任意の静的ホスティングにデプロイします。
- **ホスティング先の例**：Vercel、Netlify、GitHub Pages などの静的ホスティングサービス。

### 📂 プロジェクト構成

```bash
src/
├── helper/            # コアロジック・定数・ユーティリティ
├── types/             # TypeScript の型定義
├── components/        # Svelte UI コンポーネント
├── assets/icons/      # SVG アイコン（check, github, moon, selector, sun）
├── styles/            # 最小限のグローバルスタイル
├── App.svelte         # アプリケーションエントリ
└── main.ts            # ブートストラップ
```

### 🎨 デザインポリシー

- **抑制されたコピー**：テキストは必要最小限に。感情を押しつけず、ただ事実だけをそっと置く。
- **ガラスのような質感**：半透明のカードと控えめなエフェクトで、静かな儀式感を演出。
- **アクセシビリティ**：セマンティックな HTML と ARIA によるアクセシビリティを重視。
- **レスポンシブ**：モバイルファーストで設計し、どこにいても短時間で確認できる体験を目指します。

### 🤝 コントリビュート

このプロジェクトの落ち着いた世界観とミニマルさを尊重しつつ、丁寧な改善を歓迎します。

- **大きな変更の前に**：まず Issue を立て、方向性をすり合わせてください。
- **開発フロー**：リポジトリを Fork し、`main` からブランチを切って、焦点の定まった PR を送ってください。
- **ロジック配置**：計算ロジックやビジネスロジックは `lib/` に、UI は `src/` のコンポーネントにまとめる方針です。
- **ロジック変更時**：可能であればテストの追加、もしくは後からテストを書きやすい構造を意識してください。
- **スタイルガイド**：Tailwind のユーティリティクラスを基本とし、大量のカスタム CSS は避けます。

### 📜 ライセンス

MIT ライセンスに基づき公開されています。詳細は `LICENSE` を参照してください。

---

一つひとつの秒針の進みを、少しだけ意識できるように。  
そんな願いをこめて作られた、静かな小さなツールです。

© 2026–現在 [nicejade](https://www.lovejade.cn/)。
