# 🚀 クイックスタートガイド

## 1. デモスクリプトを実行する（最も簡単）

### 前提条件
```bash
# プロジェクトディレクトリに移動
cd 20251214#01
```

### デモ実行

#### 基本デモ（初心者向け）
```bash
npx tsx demo/agent-demo.ts
```

**実行内容:**
- ✅ セールスファネル作成
- ✅ ランディングページ作成
- ✅ ステップメール設定

**所要時間:** 約5秒

---

#### 高度な機能デモ
```bash
npx tsx demo/advanced-demo.ts
```

**実行内容:**
- ✅ プロダクトローンチファネル作成
- ✅ ファネル複製（A/Bテスト）
- ✅ VSLページ構築
- ✅ カート放棄リマインダー

**所要時間:** 約10秒

---

#### 実践シナリオ（おすすめ）
```bash
npx tsx demo/real-world-scenario.ts
```

**実行内容:**
- ✅ ウェビナーファネル完全構築
- ✅ 3つのページ作成
- ✅ 5ステップメール自動化

**所要時間:** 約15秒

---

## 2. エージェントを直接使う

### TypeScriptから使用

```typescript
// my-script.ts
import { createFunnelBuilderAgent } from './src/agents';

async function main() {
  const agent = createFunnelBuilderAgent(process.cwd());

  // ファネル作成
  const result = await agent.execute({
    action: 'create',
    templateId: 'sales_basic',
    data: {
      name: 'マイファネル',
    },
  });

  console.log(result);
}

main();
```

実行:
```bash
npx tsx my-script.ts
```

---

### 利用可能なエージェント

#### 1. Funnel Builder Agent
```typescript
import { createFunnelBuilderAgent } from './src/agents';

const agent = createFunnelBuilderAgent(process.cwd());

// ファネル作成
await agent.execute({
  action: 'create',
  templateId: 'sales_basic', // または 'lead_magnet', 'webinar', 'product_launch', 'membership'
  data: { name: 'ファネル名' }
});

// ファネル一覧
await agent.execute({ action: 'list' });

// ファネル複製
await agent.execute({
  action: 'duplicate',
  funnelId: 'funnel_xxx'
});
```

#### 2. Page Builder Agent
```typescript
import { createPageBuilderAgent } from './src/agents';

const agent = createPageBuilderAgent(process.cwd());

// ページ作成
await agent.execute({
  action: 'create',
  funnelId: 'funnel_xxx',
  templateId: 'landing_simple', // または 'sales_vsl'
  data: {
    name: 'ページ名',
    slug: 'page-url',
  }
});

// コンポーネント追加
await agent.execute({
  action: 'add_component',
  pageId: 'page_xxx',
  component: {
    type: 'button',
    props: { text: 'クリック', link: '/next' },
  }
});
```

#### 3. Email Marketing Agent
```typescript
import { createEmailMarketingAgent } from './src/agents';

const agent = createEmailMarketingAgent(process.cwd());

// シーケンス作成
await agent.execute({
  action: 'create_sequence',
  data: {
    name: 'フォローアップ',
    trigger: { type: 'form_submit' },
  }
});

// ステップ追加
await agent.execute({
  action: 'add_sequence_step',
  id: 'sequence_xxx',
  data: {
    delay: { days: 1 },
    subject: 'メール件名',
  }
});
```

---

## 3. Claude Code経由で使う（将来実装）

### スラッシュコマンド

```bash
# ファネル作成
/funnel create --template sales_basic --name "マイファネル"

# ページ作成
/page create --type landing --template simple

# メールシーケンス作成
/email create-sequence --trigger form_submit
```

**注意:** 現在はTypeScriptから直接実行する方式です。Claude Codeコマンドは`.claude/commands/`に定義済みですが、実行インフラは開発中です。

---

## 4. 実際の使用例

### 例1: リードマグネット配布ファネル

```typescript
import {
  createFunnelBuilderAgent,
  createPageBuilderAgent,
  createEmailMarketingAgent,
} from './src/agents';

async function setupLeadMagnet() {
  const funnelAgent = createFunnelBuilderAgent(process.cwd());
  const pageAgent = createPageBuilderAgent(process.cwd());
  const emailAgent = createEmailMarketingAgent(process.cwd());

  // 1. ファネル作成
  const funnel = await funnelAgent.execute({
    action: 'create',
    templateId: 'lead_magnet',
    data: { name: '無料PDF配布ファネル' },
  });

  // 2. オプトインページ作成
  const page = await pageAgent.execute({
    action: 'create',
    funnelId: funnel.data.id,
    templateId: 'landing_simple',
    data: {
      name: 'PDF無料ダウンロード',
      slug: 'free-pdf',
    },
  });

  // 3. フォローアップメール設定
  const sequence = await emailAgent.execute({
    action: 'create_sequence',
    data: {
      name: 'PDF配布後フォローアップ',
      trigger: { type: 'form_submit', value: 'pdf-form' },
    },
  });

  // ステップ追加
  await emailAgent.execute({
    action: 'add_sequence_step',
    id: sequence.data.id,
    data: {
      delay: { minutes: 5 },
      subject: 'PDFをお送りしました',
    },
  });

  console.log('✅ リードマグネットファネル構築完了！');
}

setupLeadMagnet();
```

実行:
```bash
npx tsx setup-lead-magnet.ts
```

---

### 例2: セールスファネル

```typescript
async function setupSalesFunnel() {
  const funnelAgent = createFunnelBuilderAgent(process.cwd());
  const pageAgent = createPageBuilderAgent(process.cwd());

  // セールスファネル作成
  const funnel = await funnelAgent.execute({
    action: 'create',
    templateId: 'sales_basic',
    data: { name: '商品販売ファネル' },
  });

  // VSLページ作成
  const vslPage = await pageAgent.execute({
    action: 'create',
    funnelId: funnel.data.id,
    templateId: 'sales_vsl',
    data: {
      name: 'セールスビデオページ',
      slug: 'sales-video',
    },
  });

  // カウントダウン追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: vslPage.data.id,
    component: {
      type: 'countdown',
      props: {
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        message: '特別価格終了まで',
      },
    },
  });

  console.log('✅ セールスファネル構築完了！');
}
```

---

## 5. トラブルシューティング

### エラー: `Cannot find module`
```bash
# 依存関係を再インストール
npm install
```

### エラー: `tsx command not found`
```bash
# tsxをインストール
npm install -g tsx

# または npx 経由で実行
npx tsx demo/agent-demo.ts
```

### TypeScriptエラー
```bash
# 型チェック実行
npm run typecheck
```

---

## 6. 次のステップ

### すぐに試せること
1. **デモを実行**: `npx tsx demo/agent-demo.ts`
2. **カスタマイズ**: デモファイルをコピーして自分用に編集
3. **新しいスクリプト作成**: 上記の例を参考に独自のファネル構築

### 今後の実装予定
- [ ] Web UI（ブラウザから操作）
- [ ] データベース永続化
- [ ] 決済連携（Stripe/PAY.JP）
- [ ] LINE連携
- [ ] AI機能

---

## 📚 さらに学ぶ

- [README.md](README.md) - プロジェクト概要
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) - 実装計画
- [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) - アーキテクチャ
- [src/agents/](src/agents/) - エージェントソースコード

---

## 💡 ヒント

- デモスクリプトは何度でも実行可能（状態は保持されません）
- すべてのエージェントはインメモリで動作（再起動するとリセット）
- 本番環境ではデータベース（PostgreSQL）に永続化予定

---

質問がある場合は、Issueを作成してください：
https://github.com/kihee-kawaguchi/20251214-01/issues
