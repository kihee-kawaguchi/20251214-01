# MiyabiFunnel

**日本市場向けセールスファネル・マーケティングオートメーションプラットフォーム**

ClickFunnelsやUTAGEを超える、使いやすく強力な日本語ネイティブのセールスファネルプラットフォームを構築します。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎯 プロジェクト概要

### ビジョン
「シンプルさと強力さの両立」- 初心者でも簡単に使え、上級者には深いカスタマイズを提供

### ターゲットユーザー
- 個人起業家・コーチ・コンサルタント
- 中小企業のマーケティング担当者
- オンラインコース・コンテンツ販売者
- ECサイト運営者

### 競合との差別化
| 機能 | ClickFunnels | UTAGE | **MiyabiFunnel** |
|------|-------------|-------|-----------------|
| 価格 | $99-297/月 | 21,670円/月 | **段階的価格** |
| 日本語対応 | 限定的 | 完全 | **完全** |
| LINE連携 | ❌ | ✅ | **✅** |
| 決済（日本） | 弱い | ✅ | **PAY.JP/GMO完全対応** |
| AI機能 | 限定的 | 基本 | **ネイティブ統合** |
| オープン性 | ❌ | ❌ | **API-first** |

## 📚 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [docs/RESEARCH_ANALYSIS.md](docs/RESEARCH_ANALYSIS.md) | 市場調査・競合分析 |
| [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | システムアーキテクチャ設計 |
| [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | 実装計画（10フェーズ） |

## 🏗️ 技術スタック

```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Language: TypeScript
  UI: Tailwind CSS + shadcn/ui
  State: Zustand + React Query
  D&D: dnd-kit (ページビルダー)

Backend:
  Runtime: Node.js 20 LTS
  Framework: Hono (軽量・高速)
  ORM: Drizzle ORM
  Auth: Lucia Auth

Database:
  Primary: PostgreSQL 16
  Cache: Redis
  Search: Meilisearch
  Storage: S3互換 (Cloudflare R2)

Hosting:
  Frontend: Vercel
  API: Cloudflare Workers
  CDN: Cloudflare
```

## 🤖 AI エージェントシステム

MiyabiFunnelには7つの専門エージェントが組み込まれています：

### 1. Funnel Builder Agent
**役割**: セールスファネル作成・管理

```bash
# Claude Codeコマンド経由
/funnel create --template sales_basic
```

**機能**:
- ファネル作成（リードマグネット、セールス、ウェビナー等）
- ステップ管理
- フロー設計
- テンプレート適用

### 2. Page Builder Agent
**役割**: ランディングページビルダー

```bash
/page create --type landing --template simple
```

**機能**:
- ドラッグ&ドロップエディタ
- 20種類以上のコンポーネント
- レスポンシブデザイン
- A/Bテスト設定

### 3. Email Marketing Agent
**役割**: メールマーケティング・オートメーション

```bash
/email create-sequence --trigger form_submit
```

**機能**:
- HTMLメールビルダー
- ステップメール
- セグメント配信
- 開封/クリック分析

### 4. Payment Agent
**役割**: 決済連携・管理

```bash
/payment setup --provider stripe
```

**機能**:
- Stripe/PAY.JP/GMO連携
- サブスクリプション
- ワンクリックアップセル
- Webhook処理

### 5. LINE Integration Agent
**役割**: LINE公式アカウント連携

```bash
/line setup --channel-token xxx
```

**機能**:
- メッセージ配信
- ステップLINE
- リッチメニュー
- Flexメッセージ

### 6. AI Content Agent
**役割**: AIコンテンツ生成

```bash
/ai-content generate --type headline --framework PAS
```

**機能**:
- コピーライティング（AIDA, PAS, BAB等）
- メール文面生成
- チャットボット
- パーソナライゼーション

### 7. Analytics Agent
**役割**: 分析・レポート

```bash
/analytics report --funnel-id xxx --date-range 30d
```

**機能**:
- ファネル分析
- コンバージョン追跡
- A/Bテスト分析
- ROI計算

## 🚀 Getting Started

### Prerequisites

```bash
# 必須
Node.js 20 LTS
pnpm 8+
Docker & Docker Compose

# 推奨
VS Code + 拡張機能
```

### Installation

```bash
# 1. リポジトリクローン
git clone https://github.com/kihee-kawaguchi/20251214-01.git
cd 20251214-01

# 2. 依存インストール
pnpm install

# 3. 環境変数設定
cp .env.example .env
# .envを編集して必要な情報を設定

# 4. Docker起動（DB, Redis）
docker-compose up -d

# 5. DBマイグレーション
pnpm db:migrate

# 6. 開発サーバー起動
pnpm dev
```

### 環境変数

```.env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/miyabifunnel

# Redis
REDIS_URL=redis://localhost:6379

# Auth
AUTH_SECRET=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (SES)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-northeast-1

# LINE
LINE_CHANNEL_ACCESS_TOKEN=xxx
LINE_CHANNEL_SECRET=xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# GitHub
GITHUB_TOKEN=ghp_xxx
```

## 📂 プロジェクト構造

```
20251214#01/
├── .claude/                    # Claude Code設定
│   ├── settings.json          # エージェント設定
│   └── commands/              # カスタムコマンド
│       ├── funnel.md          # ファネルビルダー
│       ├── page.md            # ページビルダー
│       ├── email.md           # メールマーケティング
│       ├── payment.md         # 決済連携
│       ├── line.md            # LINE連携
│       ├── ai-content.md      # AIコンテンツ
│       └── analytics.md       # 分析
│
├── docs/                       # ドキュメント
│   ├── RESEARCH_ANALYSIS.md   # 調査・分析
│   ├── SYSTEM_ARCHITECTURE.md # アーキテクチャ
│   └── IMPLEMENTATION_PLAN.md # 実装計画
│
├── src/                        # ソースコード
│   ├── agents/                # エージェント実装
│   │   ├── base-agent.ts      # 基底クラス
│   │   ├── funnel-builder-agent.ts
│   │   ├── page-builder-agent.ts
│   │   ├── email-marketing-agent.ts
│   │   ├── payment-agent.ts
│   │   ├── line-integration-agent.ts
│   │   ├── ai-content-agent.ts
│   │   ├── analytics-agent.ts
│   │   └── index.ts           # エクスポート
│   └── index.ts               # エントリポイント
│
├── .github/
│   └── workflows/             # GitHub Actions (14 workflows)
│
└── tests/                      # テスト
```

## 🛠️ 開発

### コマンド

```bash
# 開発
pnpm dev                # 開発サーバー起動
pnpm build              # ビルド
pnpm typecheck          # 型チェック
pnpm lint               # リント
pnpm test               # テスト実行
pnpm test:watch         # テスト（watch mode）

# データベース
pnpm db:generate        # マイグレーション生成
pnpm db:migrate         # マイグレーション実行
pnpm db:studio          # DB管理画面

# エージェント（Claude Code経由）
/funnel <command>       # ファネル操作
/page <command>         # ページ操作
/email <command>        # メール操作
```

### Miyabiコマンド

```bash
# プロジェクト状態確認
npx miyabi status

# リアルタイム監視
npx miyabi status --watch

# Issue作成
gh issue create --title "機能名" --body "説明"

# エージェント実行
npx miyabi agent

# TODO検出
npx miyabi todos
```

## 🎨 主要機能一覧

### ✅ コア機能（MVP）
- [x] ドラッグ&ドロップページビルダー
- [x] ファネルフロー管理
- [x] メールテンプレート作成
- [x] ステップメール
- [ ] Stripe決済連携
- [ ] PAY.JP決済連携
- [ ] チェックアウトフロー

### 🚧 拡張機能（Phase 2）
- [ ] LINE連携
- [ ] 会員サイト機能
- [ ] A/Bテスト
- [ ] ウェビナー機能
- [ ] リッチメニュー

### 🔮 差別化機能（Phase 3）
- [ ] AIコピーライティング
- [ ] AIチャットボット
- [ ] アフィリエイト機能
- [ ] 高度な分析
- [ ] カスタムダッシュボード

## 📊 実装フェーズ

### Phase 1: Foundation（基盤構築） - 完了
- [x] プロジェクトセットアップ
- [x] データベース設計
- [x] 認証システム
- [x] エージェントシステム

### Phase 2: Page Builder（現在）
- [ ] ビルダーUI基盤
- [ ] 基本コンポーネント
- [ ] テンプレートシステム

### Phase 3-10: [実装計画を参照](docs/IMPLEMENTATION_PLAN.md)

## 🤝 コントリビューション

現在はプライベート開発中ですが、将来的にオープンソース化を検討しています。

## 📝 ライセンス

MIT

## 🔗 リンク

- **リポジトリ**: https://github.com/kihee-kawaguchi/20251214-01
- **Issue一覧**: https://github.com/kihee-kawaguchi/20251214-01/issues
- **Miyabi Framework**: https://github.com/ShunsukeHayashi/Miyabi

---

✨ **Powered by**:
- [Miyabi Framework](https://github.com/ShunsukeHayashi/Miyabi) - AI駆動開発フレームワーク
- [Claude Code](https://claude.com/claude-code) - AI支援開発ツール
- Claude Opus 4.5 - AI開発アシスタント

🤖 Generated with AI-powered development
