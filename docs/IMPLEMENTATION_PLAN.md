# 実装計画書

## 1. プロジェクト概要

### 1.1 プロジェクト名
**MiyabiFunnel** - 日本市場向けセールスファネル・マーケティングオートメーション

### 1.2 目標
ClickFunnelsやUTAGEを超える、より使いやすく強力な日本語ネイティブのセールスファネルプラットフォームを構築する

---

## 2. 実装フェーズ

### Phase 1: Foundation（基盤構築）

#### 1.1 プロジェクトセットアップ
```
タスク:
- [x] リポジトリ作成
- [ ] モノレポ構成（pnpm workspaces）
- [ ] TypeScript設定
- [ ] ESLint/Prettier設定
- [ ] Husky + lint-staged設定
- [ ] CI/CD パイプライン構築
```

**構成:**
```
miyabi-funnel/
├── apps/
│   ├── web/              # メインアプリ (Next.js)
│   ├── admin/            # 管理画面 (Next.js)
│   └── api/              # APIサーバー (Hono)
├── packages/
│   ├── database/         # Drizzle ORM定義
│   ├── ui/               # 共通UIコンポーネント
│   ├── config/           # 共通設定
│   └── utils/            # ユーティリティ
├── docker/
├── docs/
└── scripts/
```

#### 1.2 データベース設計・実装
```
タスク:
- [ ] PostgreSQL環境構築
- [ ] Drizzle ORMスキーマ定義
- [ ] マイグレーション設定
- [ ] シード作成
```

**主要テーブル（初期）:**
```sql
-- Phase 1で必要なテーブル
users
organizations
organization_members
funnels
pages
page_versions
contacts
```

#### 1.3 認証システム
```
タスク:
- [ ] Lucia Auth導入
- [ ] メール/パスワード認証
- [ ] Google OAuth
- [ ] メール認証（検証リンク）
- [ ] パスワードリセット
```

---

### Phase 2: Page Builder（ページビルダー）

#### 2.1 ビルダーUI基盤
```
タスク:
- [ ] dnd-kit導入
- [ ] キャンバス実装
- [ ] サイドバー（コンポーネントパネル）
- [ ] プロパティパネル
- [ ] ツールバー
- [ ] レイヤーパネル
```

**コンポーネント構造:**
```typescript
// ページビルダーの基本構造
interface PageComponent {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  children?: PageComponent[];
  styles: CSSProperties;
}

type ComponentType =
  | 'section'
  | 'container'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'form'
  | 'video'
  | 'countdown'
  | 'testimonial'
  | 'pricing'
  | 'faq';
```

#### 2.2 基本コンポーネント
```
タスク:
- [ ] Section（セクション）
- [ ] Container（コンテナ）
- [ ] Heading（見出し）
- [ ] Text（テキスト）
- [ ] Image（画像）
- [ ] Button（ボタン）
- [ ] Form（フォーム）
- [ ] Video（動画埋め込み）
```

#### 2.3 高度なコンポーネント
```
タスク:
- [ ] Countdown（カウントダウン）
- [ ] Testimonial（お客様の声）
- [ ] Pricing Table（価格表）
- [ ] FAQ（よくある質問）
- [ ] Progress Bar（進捗バー）
- [ ] Popup（ポップアップ）
```

#### 2.4 テンプレートシステム
```
タスク:
- [ ] テンプレート保存機能
- [ ] テンプレートギャラリー
- [ ] カテゴリ分類
- [ ] プレビュー機能
```

---

### Phase 3: Funnel Management（ファネル管理）

#### 3.1 ファネル作成
```
タスク:
- [ ] ファネル作成ウィザード
- [ ] ファネルタイプ選択（リード獲得/販売/ウェビナー等）
- [ ] ステップ管理
- [ ] ステップ間接続（フロー設定）
```

**ファネルタイプ:**
```typescript
type FunnelType =
  | 'lead_magnet'      // リードマグネット
  | 'sales'            // セールスファネル
  | 'webinar'          // ウェビナーファネル
  | 'product_launch'   // プロダクトローンチ
  | 'membership'       // 会員サイト
  | 'custom';          // カスタム
```

#### 3.2 ファネルフロー
```
タスク:
- [ ] ビジュアルフローエディタ
- [ ] 条件分岐設定
- [ ] A/Bテスト設定
- [ ] リダイレクト設定
```

#### 3.3 ページ公開
```
タスク:
- [ ] カスタムドメイン設定
- [ ] SSL自動発行
- [ ] ページレンダリングエンジン
- [ ] SEO設定
- [ ] OGP設定
```

---

### Phase 4: Contact & CRM（顧客管理）

#### 4.1 コンタクト管理
```
タスク:
- [ ] コンタクト一覧
- [ ] コンタクト詳細（タイムライン）
- [ ] インポート/エクスポート（CSV）
- [ ] 重複チェック・マージ
```

#### 4.2 セグメント・タグ
```
タスク:
- [ ] タグ管理
- [ ] セグメント条件ビルダー
- [ ] 動的セグメント
- [ ] セグメント分析
```

#### 4.3 フォーム連携
```
タスク:
- [ ] フォーム→コンタクト自動登録
- [ ] カスタムフィールド
- [ ] フォーム送信後アクション
- [ ] Webhook送信
```

---

### Phase 5: Email Marketing（メールマーケティング）

#### 5.1 メールテンプレート
```
タスク:
- [ ] メールビルダー（Unlayer統合）
- [ ] テンプレートライブラリ
- [ ] 変数置換（パーソナライゼーション）
- [ ] プレビュー・テスト送信
```

#### 5.2 メール配信
```
タスク:
- [ ] 一斉配信
- [ ] スケジュール配信
- [ ] セグメント配信
- [ ] A/Bテスト
```

**配信インフラ:**
```
選択肢:
- Amazon SES（推奨・低コスト）
- SendGrid
- Mailgun
- Postmark
```

#### 5.3 ステップメール（オートメーション）
```
タスク:
- [ ] シーケンス作成
- [ ] トリガー設定
- [ ] 遅延設定
- [ ] 条件分岐
- [ ] ゴール設定
```

**オートメーショントリガー:**
```typescript
type AutomationTrigger =
  | 'form_submit'        // フォーム送信
  | 'page_view'          // ページ閲覧
  | 'tag_added'          // タグ追加
  | 'purchase'           // 購入
  | 'subscription_start' // サブスク開始
  | 'custom_event';      // カスタムイベント
```

---

### Phase 6: Payment（決済）

#### 6.1 Stripe連携
```
タスク:
- [ ] Stripe Connect設定
- [ ] 商品・価格管理
- [ ] チェックアウトページ
- [ ] 決済完了処理
- [ ] Webhook処理
```

#### 6.2 日本決済対応
```
タスク:
- [ ] PAY.JP連携
- [ ] GMO-PG連携（オプション）
- [ ] コンビニ決済（オプション）
```

#### 6.3 サブスクリプション
```
タスク:
- [ ] プラン管理
- [ ] 定期課金処理
- [ ] 課金失敗リトライ
- [ ] キャンセル処理
- [ ] ダウングレード/アップグレード
```

#### 6.4 アップセル・オーダーバンプ
```
タスク:
- [ ] オーダーバンプ設定
- [ ] ワンクリックアップセル
- [ ] ダウンセル
- [ ] サンキューページ分岐
```

---

### Phase 7: LINE Integration（LINE連携）

#### 7.1 LINE公式アカウント連携
```
タスク:
- [ ] LINE Messaging API設定
- [ ] アカウント連携フロー
- [ ] コンタクト紐付け
```

#### 7.2 LINE配信
```
タスク:
- [ ] 一斉配信
- [ ] セグメント配信
- [ ] ステップLINE
- [ ] リッチメッセージ
- [ ] カルーセル
```

#### 7.3 リッチメニュー
```
タスク:
- [ ] リッチメニュービルダー
- [ ] 条件別表示
- [ ] A/Bテスト
```

---

### Phase 8: Membership（会員サイト）

#### 8.1 会員サイト基盤
```
タスク:
- [ ] サイト作成
- [ ] アクセス制御
- [ ] ログイン/ログアウト
```

#### 8.2 コンテンツ管理
```
タスク:
- [ ] レッスン作成
- [ ] モジュール構成
- [ ] 動画アップロード
- [ ] 進捗トラッキング
```

#### 8.3 ドリップコンテンツ
```
タスク:
- [ ] 公開スケジュール設定
- [ ] 条件付き公開
- [ ] 通知設定
```

---

### Phase 9: Analytics（分析）

#### 9.1 トラッキング
```
タスク:
- [ ] ページビュー
- [ ] ファネルコンバージョン
- [ ] フォーム送信
- [ ] 購入
- [ ] メール開封/クリック
```

#### 9.2 ダッシュボード
```
タスク:
- [ ] 概要ダッシュボード
- [ ] ファネル分析
- [ ] ページ分析
- [ ] 収益レポート
```

#### 9.3 A/Bテスト結果
```
タスク:
- [ ] 統計的有意性計算
- [ ] 勝者自動選定
- [ ] レポート生成
```

---

### Phase 10: AI Features（AI機能）

#### 10.1 コピーライティングAI
```
タスク:
- [ ] OpenAI API連携
- [ ] ヘッドライン生成
- [ ] 本文生成
- [ ] メール文面生成
```

#### 10.2 AIチャットボット
```
タスク:
- [ ] チャットウィジェット
- [ ] FAQ自動応答
- [ ] リード収集
```

---

## 3. 技術詳細

### 3.1 ページビルダー実装詳細

```typescript
// packages/ui/src/builder/types.ts
export interface BuilderState {
  pages: Page[];
  selectedPageId: string | null;
  selectedComponentId: string | null;
  zoom: number;
  history: HistoryEntry[];
  historyIndex: number;
}

// ドラッグ&ドロップ実装
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

// コンポーネントレンダラー
export const ComponentRenderer: React.FC<{ component: PageComponent }> = ({
  component
}) => {
  const Component = componentRegistry[component.type];
  return (
    <Component {...component.props} style={component.styles}>
      {component.children?.map(child => (
        <ComponentRenderer key={child.id} component={child} />
      ))}
    </Component>
  );
};
```

### 3.2 メール配信キュー

```typescript
// apps/api/src/modules/email/queue.ts
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('emails', {
  connection: redisConnection
});

// メール追加
export const enqueueEmail = async (email: EmailJob) => {
  await emailQueue.add('send', email, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
};

// ワーカー処理
const worker = new Worker('emails', async (job) => {
  const { to, subject, html } = job.data;
  await ses.sendEmail({ to, subject, html });
}, { connection: redisConnection });
```

### 3.3 決済Webhook処理

```typescript
// apps/api/src/webhooks/stripe.ts
import { Hono } from 'hono';
import Stripe from 'stripe';

export const stripeWebhook = new Hono();

stripeWebhook.post('/', async (c) => {
  const sig = c.req.header('stripe-signature');
  const body = await c.req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
  }

  return c.json({ received: true });
});
```

---

## 4. 開発環境セットアップ

### 4.1 必要な環境

```bash
# 必須
- Node.js 20 LTS
- pnpm 8+
- Docker & Docker Compose
- Git

# 推奨
- VS Code
  - ESLint拡張
  - Prettier拡張
  - Tailwind CSS IntelliSense
```

### 4.2 ローカル起動手順

```bash
# 1. リポジトリクローン
git clone https://github.com/kihee-kawaguchi/20251214-01.git
cd 20251214-01

# 2. 依存インストール
pnpm install

# 3. 環境変数設定
cp .env.example .env

# 4. Docker起動（DB, Redis）
docker-compose up -d

# 5. DBマイグレーション
pnpm db:migrate

# 6. 開発サーバー起動
pnpm dev
```

### 4.3 環境変数

```bash
# .env
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
```

---

## 5. テスト戦略

### 5.1 テストピラミッド

```
        /\
       /  \
      / E2E \        10% - Playwright
     /______\
    /        \
   /  Integration \   20% - API/DB統合
  /______________\
 /                \
/      Unit        \  70% - ビジネスロジック
/___________________\
```

### 5.2 テストツール

```yaml
Unit Test: Vitest
Integration Test: Vitest + Supertest
E2E Test: Playwright
Coverage: Istanbul
```

---

## 6. デプロイ戦略

### 6.1 本番環境構成

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare                        │
│  - CDN                                              │
│  - DDoS Protection                                  │
│  - SSL                                              │
└───────────────────────┬─────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Vercel  │    │ Vercel  │    │Cloudflare│
   │  (Web)  │    │ (Admin) │    │ Workers │
   │         │    │         │    │  (API)  │
   └─────────┘    └─────────┘    └────┬────┘
                                      │
                        ┌─────────────┼─────────────┐
                        │             │             │
                   ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
                   │  Neon   │   │ Upstash │   │   R2    │
                   │  (DB)   │   │ (Redis) │   │ (Files) │
                   └─────────┘   └─────────┘   └─────────┘
```

### 6.2 デプロイフロー

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: vercel/action@v28
```

---

## 7. 次のアクション

### 即座に開始できるタスク

1. **モノレポ構築**
   - pnpm workspacesのセットアップ
   - TypeScript/ESLint/Prettier設定

2. **データベース設計**
   - Drizzle ORMスキーマ作成
   - 初期マイグレーション

3. **認証システム**
   - Lucia Auth導入
   - 基本的なログイン/登録フロー

4. **基本UI**
   - shadcn/ui導入
   - 共通レイアウト作成

---

## 8. リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 技術的複雑性 | 高 | MVP範囲を絞る、段階的リリース |
| 決済連携の複雑さ | 高 | Stripe中心に開始、段階的に拡張 |
| パフォーマンス | 中 | 早期からキャッシュ戦略を設計 |
| セキュリティ | 高 | セキュリティレビューを各フェーズで実施 |

---

## 9. 成功指標（KPI）

### MVP段階
- 機能完成度: 100%（MVP scope）
- テストカバレッジ: 70%以上
- ページ読み込み時間: 2秒以内
- Core Web Vitals: Good

### リリース後
- アクティブユーザー数
- ファネル作成数
- コンバージョン率
- 収益
