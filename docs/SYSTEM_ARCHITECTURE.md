# システムアーキテクチャ設計書

## 1. システム概要

### 1.1 プロジェクト名
**MiyabiFunnel** - 日本市場向け次世代セールスファネル・マーケティングオートメーションプラットフォーム

### 1.2 コンセプト
「シンプルさと強力さの両立」- 初心者でも簡単に使え、上級者には深いカスタマイズを提供

### 1.3 ターゲットユーザー
- 個人起業家・コーチ・コンサルタント
- 中小企業のマーケティング担当者
- オンラインコース・コンテンツ販売者
- ECサイト運営者

---

## 2. 技術スタック

### 2.1 フロントエンド

```
┌─────────────────────────────────────────────────┐
│                 フロントエンド                    │
├─────────────────────────────────────────────────┤
│  Framework    : Next.js 14 (App Router)         │
│  Language     : TypeScript                      │
│  UI Library   : React 18                        │
│  Styling      : Tailwind CSS + shadcn/ui        │
│  State        : Zustand + React Query           │
│  Forms        : React Hook Form + Zod           │
│  D&D          : dnd-kit (ページビルダー)          │
│  Charts       : Recharts (分析ダッシュボード)     │
│  Email Editor : React Email + Unlayer           │
└─────────────────────────────────────────────────┘
```

### 2.2 バックエンド

```
┌─────────────────────────────────────────────────┐
│                  バックエンド                     │
├─────────────────────────────────────────────────┤
│  Runtime      : Node.js 20 LTS                  │
│  Framework    : Hono (軽量・高速)                │
│  Language     : TypeScript                      │
│  ORM          : Drizzle ORM                     │
│  Validation   : Zod                             │
│  Auth         : Lucia Auth + OAuth              │
│  Queue        : BullMQ (メール配信等)            │
│  Realtime     : Socket.io                       │
└─────────────────────────────────────────────────┘
```

### 2.3 データベース・インフラ

```
┌─────────────────────────────────────────────────┐
│              データベース・インフラ               │
├─────────────────────────────────────────────────┤
│  Primary DB   : PostgreSQL 16                   │
│  Cache        : Redis (セッション/キャッシュ)    │
│  File Storage : S3互換 (Cloudflare R2)          │
│  Search       : Meilisearch (全文検索)          │
│  Hosting      : Vercel / Cloudflare Workers     │
│  CDN          : Cloudflare                      │
│  Monitoring   : Sentry + OpenTelemetry          │
└─────────────────────────────────────────────────┘
```

---

## 3. システムアーキテクチャ図

```
                                    ┌──────────────┐
                                    │   CDN        │
                                    │ (Cloudflare) │
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
            │  Public Pages │    │   Admin App   │    │  API Gateway  │
            │  (Next.js)    │    │  (Next.js)    │    │   (Hono)      │
            │  - LP表示      │    │  - ダッシュボード │    │  - REST API   │
            │  - ファネル    │    │  - ビルダー    │    │  - Webhooks   │
            └───────┬───────┘    └───────┬───────┘    └───────┬───────┘
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   Backend Services  │
                              │      (Hono)         │
                              └──────────┬──────────┘
                                         │
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         │               │               │               │               │
         ▼               ▼               ▼               ▼               ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │  Auth     │  │  Funnel   │  │  Email    │  │  Payment  │  │  LINE     │
   │  Service  │  │  Service  │  │  Service  │  │  Service  │  │  Service  │
   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
         │               │               │               │               │
         └───────────────┴───────────────┼───────────────┴───────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
            │  PostgreSQL   │    │    Redis      │    │  File Storage │
            │  (Primary DB) │    │  (Cache/Queue)│    │  (R2/S3)      │
            └───────────────┘    └───────────────┘    └───────────────┘
```

---

## 4. モジュール設計

### 4.1 コアモジュール

```
src/
├── modules/
│   ├── auth/                    # 認証・認可
│   │   ├── services/
│   │   ├── controllers/
│   │   └── schemas/
│   │
│   ├── funnel/                  # ファネル管理
│   │   ├── builder/             # ページビルダー
│   │   ├── templates/           # テンプレート
│   │   └── analytics/           # 分析
│   │
│   ├── page/                    # ページ管理
│   │   ├── renderer/            # ページレンダリング
│   │   ├── components/          # 再利用コンポーネント
│   │   └── ab-test/             # A/Bテスト
│   │
│   ├── email/                   # メール配信
│   │   ├── templates/           # メールテンプレート
│   │   ├── automation/          # ステップメール
│   │   └── delivery/            # 配信管理
│   │
│   ├── payment/                 # 決済
│   │   ├── providers/           # 決済プロバイダー
│   │   │   ├── stripe/
│   │   │   ├── payjp/
│   │   │   └── gmo/
│   │   ├── subscription/        # サブスク
│   │   └── upsell/              # アップセル
│   │
│   ├── line/                    # LINE連携
│   │   ├── messaging/           # メッセージ配信
│   │   ├── richmenu/            # リッチメニュー
│   │   └── webhook/             # Webhook処理
│   │
│   ├── crm/                     # 顧客管理
│   │   ├── contacts/            # 連絡先
│   │   ├── segments/            # セグメント
│   │   └── tags/                # タグ
│   │
│   ├── membership/              # 会員サイト
│   │   ├── content/             # コンテンツ管理
│   │   ├── drip/                # ドリップ配信
│   │   └── access/              # アクセス制御
│   │
│   ├── webinar/                 # ウェビナー
│   │   ├── live/                # ライブ配信
│   │   ├── evergreen/           # 自動ウェビナー
│   │   └── registration/        # 登録管理
│   │
│   ├── ai/                      # AI機能
│   │   ├── copywriting/         # 文章生成
│   │   ├── chatbot/             # チャットボット
│   │   └── recommendations/     # レコメンド
│   │
│   └── analytics/               # 分析
│       ├── tracking/            # トラッキング
│       ├── reports/             # レポート
│       └── dashboard/           # ダッシュボード
│
├── shared/                      # 共通モジュール
│   ├── database/                # DB接続
│   ├── cache/                   # キャッシュ
│   ├── queue/                   # キュー
│   ├── storage/                 # ファイルストレージ
│   └── utils/                   # ユーティリティ
│
└── config/                      # 設定
    ├── database.ts
    ├── auth.ts
    └── providers.ts
```

---

## 5. データベース設計

### 5.1 主要エンティティ

```sql
-- ユーザー・組織
users
organizations
organization_members

-- ファネル・ページ
funnels
funnel_steps
pages
page_versions (A/Bテスト用)
page_components

-- コンタクト
contacts
contact_tags
contact_segments
contact_activities

-- メール
email_templates
email_campaigns
email_sequences
email_sequence_steps
email_sends
email_events (開封/クリック)

-- 決済
products
prices
orders
order_items
subscriptions
subscription_items

-- LINE
line_accounts
line_messages
line_richmenu
line_events

-- 会員サイト
membership_sites
membership_content
membership_access
member_progress

-- 分析
page_views
funnel_conversions
events
```

### 5.2 ER図（主要部分）

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───┬───│Organization │───────│   Funnel    │
└─────────────┘   │   └─────────────┘       └──────┬──────┘
                  │                                 │
                  │   ┌─────────────┐               │
                  └───│   Contact   │               │
                      └──────┬──────┘               │
                             │                      │
                      ┌──────┴──────┐               │
                      │             │               │
               ┌──────┴─────┐ ┌─────┴──────┐ ┌─────┴──────┐
               │   Order    │ │EmailSend   │ │FunnelStep  │
               └──────┬─────┘ └────────────┘ └──────┬─────┘
                      │                             │
               ┌──────┴─────┐               ┌──────┴──────┐
               │OrderItem   │               │    Page     │
               └────────────┘               └─────────────┘
```

---

## 6. API設計

### 6.1 RESTful API エンドポイント

```yaml
# 認証
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

# ファネル
GET    /api/v1/funnels
POST   /api/v1/funnels
GET    /api/v1/funnels/:id
PUT    /api/v1/funnels/:id
DELETE /api/v1/funnels/:id
POST   /api/v1/funnels/:id/duplicate
GET    /api/v1/funnels/:id/analytics

# ページ
GET    /api/v1/funnels/:funnelId/pages
POST   /api/v1/funnels/:funnelId/pages
GET    /api/v1/pages/:id
PUT    /api/v1/pages/:id
DELETE /api/v1/pages/:id
POST   /api/v1/pages/:id/publish
GET    /api/v1/pages/:id/versions

# コンタクト
GET    /api/v1/contacts
POST   /api/v1/contacts
GET    /api/v1/contacts/:id
PUT    /api/v1/contacts/:id
DELETE /api/v1/contacts/:id
POST   /api/v1/contacts/import
GET    /api/v1/contacts/export

# メール
GET    /api/v1/email/templates
POST   /api/v1/email/templates
GET    /api/v1/email/campaigns
POST   /api/v1/email/campaigns
POST   /api/v1/email/campaigns/:id/send
GET    /api/v1/email/sequences
POST   /api/v1/email/sequences

# 決済
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/orders
POST   /api/v1/checkout/sessions

# LINE
GET    /api/v1/line/accounts
POST   /api/v1/line/messages
GET    /api/v1/line/richmenu
POST   /api/v1/line/webhook

# 分析
GET    /api/v1/analytics/overview
GET    /api/v1/analytics/funnels/:id
GET    /api/v1/analytics/pages/:id
GET    /api/v1/analytics/conversions
```

### 6.2 Webhook エンドポイント

```yaml
# 外部サービスからのWebhook受信
POST   /webhooks/stripe
POST   /webhooks/payjp
POST   /webhooks/line
POST   /webhooks/mailgun

# カスタムWebhook（外部システム連携）
POST   /webhooks/custom/:id
```

---

## 7. セキュリティ設計

### 7.1 認証・認可

```
┌─────────────────────────────────────────────────────────────┐
│                    認証フロー                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. メール/パスワード認証 (Primary)                          │
│  2. OAuth認証 (Google, GitHub)                              │
│  3. Magic Link認証                                          │
│  4. 2FA (TOTP)                                             │
│                                                             │
│  認可:                                                      │
│  - RBAC (Role-Based Access Control)                        │
│  - 組織レベル権限                                            │
│  - リソースレベル権限                                         │
│                                                             │
│  Roles: owner, admin, editor, viewer                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 データ保護

- 通信: TLS 1.3
- パスワード: Argon2id ハッシュ
- API認証: JWT (短期) + Refresh Token (長期)
- 機密データ: AES-256暗号化
- PII: データマスキング

### 7.3 GDPR/個人情報保護

- データエクスポート機能
- データ削除機能（忘れられる権利）
- 同意管理
- 監査ログ

---

## 8. スケーラビリティ

### 8.1 水平スケーリング戦略

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │  App #1   │    │  App #2   │    │  App #3   │
    └───────────┘    └───────────┘    └───────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────┴─────┐ ┌─────┴─────┐
              │  Primary  │ │  Replica  │
              │    DB     │ │    DB     │
              └───────────┘ └───────────┘
```

### 8.2 キャッシュ戦略

| レイヤー | 対象 | TTL |
|----------|------|-----|
| CDN | 静的ファイル、公開LP | 1h - 24h |
| Redis | セッション、APIレスポンス | 5m - 1h |
| DB Query | 頻繁なクエリ結果 | 1m - 5m |

### 8.3 非同期処理

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   API       │────▶│  Queue      │────▶│   Worker    │
│  Request    │     │  (BullMQ)   │     │  Process    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────┴─────┐ ┌─────┴─────┐
              │   Email   │ │  Webhook  │
              │   Queue   │ │   Queue   │
              └───────────┘ └───────────┘
```

---

## 9. 監視・運用

### 9.1 監視項目

| カテゴリ | メトリクス |
|----------|-----------|
| インフラ | CPU, Memory, Disk, Network |
| アプリ | Response Time, Error Rate, Throughput |
| ビジネス | MAU, Conversion Rate, Revenue |

### 9.2 アラート設定

| レベル | 条件 | 通知先 |
|--------|------|--------|
| Critical | Error Rate > 5% | Slack + PagerDuty |
| Warning | Response Time > 2s | Slack |
| Info | Deployment完了 | Slack |

### 9.3 ログ管理

```
Application Logs
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Fluent Bit │────▶│ Elasticsearch│────▶│   Kibana    │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 10. 開発・デプロイフロー

### 10.1 ブランチ戦略

```
main (本番)
  │
  └── develop (開発)
        │
        ├── feature/xxx (機能開発)
        ├── bugfix/xxx (バグ修正)
        └── hotfix/xxx (緊急修正)
```

### 10.2 CI/CD パイプライン

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Push   │──▶│  Lint   │──▶│  Test   │──▶│  Build  │──▶│ Deploy  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
                  │              │              │             │
                  ▼              ▼              ▼             ▼
              ESLint        Jest/Vitest    Docker       Vercel/
              Prettier      Playwright     Image        Cloudflare
```

---

## 11. 今後の拡張計画

### Phase 1: MVP (3ヶ月)
- [ ] ページビルダー基本機能
- [ ] シンプルなファネル作成
- [ ] メール配信基本機能
- [ ] Stripe決済連携

### Phase 2: 成長期 (6ヶ月)
- [ ] LINE連携
- [ ] 会員サイト機能
- [ ] A/Bテスト
- [ ] 日本決済対応

### Phase 3: 成熟期 (12ヶ月)
- [ ] AI機能
- [ ] アフィリエイト
- [ ] ウェビナー機能
- [ ] API公開

---

## 12. 技術的負債の管理

### 許容する負債
- MVP段階でのテストカバレッジ70%
- 初期段階でのモノリス構成

### 許容しない負債
- セキュリティに関わる省略
- 型安全性の放棄
- ドキュメント未整備
