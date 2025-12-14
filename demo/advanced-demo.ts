/**
 * Advanced Demo - 高度な機能のデモンストレーション
 */

import {
  createFunnelBuilderAgent,
  createPageBuilderAgent,
  createEmailMarketingAgent,
} from '../src/agents';

async function runAdvancedDemo() {
  console.log('🚀 高度な機能デモンストレーション');
  console.log('='.repeat(60));
  console.log();

  const projectRoot = process.cwd();
  const funnelAgent = createFunnelBuilderAgent(projectRoot);
  const pageAgent = createPageBuilderAgent(projectRoot);
  const emailAgent = createEmailMarketingAgent(projectRoot);

  // 1. プロダクトローンチファネル作成
  console.log('1️⃣  プロダクトローンチファネル作成');
  console.log('-'.repeat(60));

  const plcFunnel = await funnelAgent.execute({
    action: 'create',
    templateId: 'product_launch',
    data: {
      name: 'オンラインコース ローンチキャンペーン',
      description: 'PLC形式による段階的なコース販売',
    },
  });

  console.log(`✅ ${plcFunnel.data?.name}`);
  console.log(`   ステップ構成:`);
  plcFunnel.data?.steps.forEach((step: any) => {
    console.log(`   → ${step.name}`);
  });
  console.log();

  // 2. ファネル複製
  console.log('2️⃣  ファネル複製（A/Bテスト用）');
  console.log('-'.repeat(60));

  const duplicated = await funnelAgent.execute({
    action: 'duplicate',
    funnelId: plcFunnel.data?.id,
  });

  console.log(`✅ 複製成功: ${duplicated.data?.name}`);
  console.log(`   元のファネル: ${plcFunnel.data?.id}`);
  console.log(`   新しいファネル: ${duplicated.data?.id}`);
  console.log();

  // 3. ページにコンポーネント追加
  console.log('3️⃣  VSLセールスページ構築');
  console.log('-'.repeat(60));

  const vslPage = await pageAgent.execute({
    action: 'create',
    funnelId: plcFunnel.data?.id || 'demo',
    templateId: 'sales_vsl',
    data: {
      name: 'VSLセールスページ',
      slug: 'vsl-sales',
    },
  });

  console.log(`✅ ページ作成: ${vslPage.data?.name}`);
  console.log(`   初期コンポーネント: ${vslPage.data?.components.length}個`);

  // カウントダウンタイマー追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: vslPage.data?.id,
    component: {
      type: 'countdown',
      props: {
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        message: '特別価格終了まで',
      },
      styles: {
        className: 'text-center my-8 text-2xl font-bold text-red-600',
      },
    },
  });

  // お客様の声セクション追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: vslPage.data?.id,
    component: {
      type: 'testimonial',
      props: {
        testimonials: [
          {
            name: '山田太郎',
            role: '会社員',
            image: 'https://via.placeholder.com/80',
            text: 'このコースのおかげで月収が3倍になりました！',
            rating: 5,
          },
          {
            name: '佐藤花子',
            role: '個人事業主',
            image: 'https://via.placeholder.com/80',
            text: '初心者の私でも理解できる丁寧な説明でした。',
            rating: 5,
          },
        ],
      },
      styles: {
        className: 'bg-gray-50 py-12',
      },
    },
  });

  // 更新されたページ取得
  const updatedPage = await pageAgent.execute({
    action: 'get',
    pageId: vslPage.data?.id,
  });

  console.log(`   コンポーネント追加後: ${updatedPage.data?.components.length}個`);
  updatedPage.data?.components.forEach((comp: any, i: number) => {
    console.log(`   ${i + 1}. ${comp.type}`);
  });
  console.log();

  // 4. 複雑なメールキャンペーン
  console.log('4️⃣  カート放棄リマインダーシーケンス');
  console.log('-'.repeat(60));

  const cartSequence = await emailAgent.execute({
    action: 'create_sequence',
    data: {
      name: 'カート放棄リマインダー',
      description: '購入途中で離脱したユーザーへのフォローアップ',
      trigger: {
        type: 'custom_event',
        value: 'cart_abandoned',
      },
      active: true,
    },
  });

  const cartSteps = [
    {
      order: 0,
      delay: { hours: 1 },
      subject: 'カートに商品が残っています',
    },
    {
      order: 1,
      delay: { days: 1 },
      subject: '【特別割引】あなただけに10%OFF',
    },
    {
      order: 2,
      delay: { days: 3 },
      subject: '最後のチャンス - 明日で終了です',
    },
  ];

  for (const step of cartSteps) {
    await emailAgent.execute({
      action: 'add_sequence_step',
      id: cartSequence.data?.id,
      data: step,
    });
  }

  console.log(`✅ シーケンス作成: ${cartSequence.data?.name}`);
  console.log(`   トリガー: カート放棄イベント`);
  console.log(`   ステップ数: ${cartSteps.length}`);
  cartSteps.forEach((step, i) => {
    const timing = step.delay.hours
      ? `${step.delay.hours}時間後`
      : `${step.delay.days}日後`;
    console.log(`   ${i + 1}. [${timing}] ${step.subject}`);
  });
  console.log();

  // 5. ファネル統計（模擬）
  console.log('5️⃣  ファネル一覧とサマリー');
  console.log('-'.repeat(60));

  const allFunnels = await funnelAgent.execute({ action: 'list' });
  const allPages = await pageAgent.execute({ action: 'list' });
  const allSequences = await emailAgent.execute({ action: 'list_sequences' });

  console.log('📊 プロジェクトサマリー:');
  console.log(`   ファネル数: ${allFunnels.data?.length || 0}`);
  console.log(`   ページ数: ${allPages.data?.length || 0}`);
  console.log(`   メールシーケンス数: ${allSequences.data?.length || 0}`);
  console.log();

  console.log('📈 ファネル詳細:');
  allFunnels.data?.forEach((funnel: any, i: number) => {
    console.log(`   ${i + 1}. ${funnel.name}`);
    console.log(`      タイプ: ${funnel.type}`);
    console.log(`      ステップ: ${funnel.steps.length}個`);
    console.log(`      作成日時: ${new Date(funnel.createdAt).toLocaleString('ja-JP')}`);
  });
  console.log();

  // 6. エージェント能力のまとめ
  console.log('='.repeat(60));
  console.log('✨ エージェント能力まとめ');
  console.log('='.repeat(60));
  console.log();

  console.log('✅ Funnel Builder Agent:');
  console.log('   • 5種類のテンプレート対応');
  console.log('   • ファネル複製機能');
  console.log('   • 動的なステップ管理');
  console.log();

  console.log('✅ Page Builder Agent:');
  console.log('   • 20種類以上のコンポーネント');
  console.log('   • 動的コンポーネント追加/削除');
  console.log('   • テンプレートシステム');
  console.log();

  console.log('✅ Email Marketing Agent:');
  console.log('   • ステップメール自動化');
  console.log('   • 複数トリガー対応');
  console.log('   • 条件分岐ロジック');
  console.log();

  console.log('🎯 これらのエージェントは実際のマーケティングファネル構築に');
  console.log('   そのまま使用できる完全な実装です。');
  console.log();
}

runAdvancedDemo().catch(console.error);
