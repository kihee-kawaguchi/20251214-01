/**
 * Agent Demo - エージェント実行デモ
 */

import {
  createFunnelBuilderAgent,
  createPageBuilderAgent,
  createEmailMarketingAgent,
  FunnelBuilderAgent,
} from '../src/agents';

// デモ実行
async function runDemo() {
  console.log('='.repeat(60));
  console.log('🤖 MiyabiFunnel エージェントシステム デモ');
  console.log('='.repeat(60));
  console.log();

  const projectRoot = process.cwd();

  // 1. Funnel Builder Agent デモ
  console.log('📊 1. Funnel Builder Agent');
  console.log('-'.repeat(60));

  const funnelAgent = createFunnelBuilderAgent(projectRoot);

  // テンプレート一覧表示
  console.log('利用可能なテンプレート:');
  const templates = FunnelBuilderAgent.getTemplates();
  templates.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name} (${t.type})`);
    console.log(`     ${t.description}`);
  });
  console.log();

  // セールスファネル作成
  console.log('セールスファネルを作成...');
  const createResult = await funnelAgent.execute({
    action: 'create',
    templateId: 'sales_basic',
    data: {
      name: '新商品セールスファネル',
      description: 'デモ用のセールスファネル',
    },
  });

  if (createResult.success && createResult.data) {
    console.log(`✅ ファネル作成成功: ${createResult.data.name}`);
    console.log(`   ID: ${createResult.data.id}`);
    console.log(`   ステップ数: ${createResult.data.steps.length}`);
    createResult.data.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.name} (${step.type})`);
    });
  }
  console.log();

  // 2. Page Builder Agent デモ
  console.log('📄 2. Page Builder Agent');
  console.log('-'.repeat(60));

  const pageAgent = createPageBuilderAgent(projectRoot);

  console.log('ランディングページを作成...');
  const pageResult = await pageAgent.execute({
    action: 'create',
    funnelId: createResult.data?.id || 'demo-funnel',
    templateId: 'landing_simple',
    data: {
      name: 'リードマグネット LP',
      slug: 'lead-magnet',
      seo: {
        title: '無料プレゼント - 今すぐダウンロード',
        description: '期間限定！無料でお受け取りいただけます',
      },
    },
  });

  if (pageResult.success && pageResult.data) {
    console.log(`✅ ページ作成成功: ${pageResult.data.name}`);
    console.log(`   URL: /${pageResult.data.slug}`);
    console.log(`   コンポーネント数: ${pageResult.data.components.length}`);
    pageResult.data.components.forEach((comp, i) => {
      console.log(`   ${i + 1}. ${comp.type}`);
    });
  }
  console.log();

  // 3. Email Marketing Agent デモ
  console.log('📧 3. Email Marketing Agent');
  console.log('-'.repeat(60));

  const emailAgent = createEmailMarketingAgent(projectRoot);

  // テンプレート一覧
  const templatesResult = await emailAgent.execute({
    action: 'list_templates',
  });

  console.log('利用可能なメールテンプレート:');
  if (templatesResult.success && templatesResult.data) {
    templatesResult.data.forEach((t: any, i: number) => {
      console.log(`  ${i + 1}. ${t.name} (${t.type})`);
      console.log(`     件名: ${t.subject}`);
    });
  }
  console.log();

  // ステップメールシーケンス作成
  console.log('ステップメールシーケンスを作成...');
  const sequenceResult = await emailAgent.execute({
    action: 'create_sequence',
    data: {
      name: 'リードマグネット後フォローアップ',
      description: 'リードマグネット取得後の自動配信シーケンス',
      trigger: {
        type: 'form_submit',
        value: 'lead-magnet-form',
      },
      active: true,
    },
  });

  if (sequenceResult.success && sequenceResult.data) {
    console.log(`✅ シーケンス作成成功: ${sequenceResult.data.name}`);
    console.log(`   ID: ${sequenceResult.data.id}`);
    console.log(`   トリガー: ${sequenceResult.data.trigger.type}`);
  }
  console.log();

  // ステップ追加
  console.log('ステップを追加...');
  const steps = [
    {
      order: 0,
      delay: { days: 0 },
      templateId: templatesResult.data?.[0]?.id || 'template_1',
      subject: '【ダウンロード】無料プレゼントをお届けします',
    },
    {
      order: 1,
      delay: { days: 1 },
      subject: 'ご覧いただけましたか？',
    },
    {
      order: 2,
      delay: { days: 3 },
      subject: '多くの方が見落とす3つのポイント',
    },
    {
      order: 3,
      delay: { days: 7 },
      subject: '【限定ご案内】特別オファー',
    },
  ];

  for (const step of steps) {
    await emailAgent.execute({
      action: 'add_sequence_step',
      id: sequenceResult.data?.id,
      data: step,
    });
  }

  const updatedSequence = await emailAgent.execute({
    action: 'get_sequence',
    id: sequenceResult.data?.id,
  });

  if (updatedSequence.success && updatedSequence.data) {
    console.log(`✅ ${updatedSequence.data.steps.length}ステップ追加成功`);
    updatedSequence.data.steps.forEach((step: any, i: number) => {
      const delay = step.delay.days ? `${step.delay.days}日後` : '即時';
      console.log(`   ${i + 1}. [${delay}] ${step.subject}`);
    });
  }
  console.log();

  // 4. ファネル一覧表示
  console.log('📋 4. 作成されたファネル一覧');
  console.log('-'.repeat(60));

  const listResult = await funnelAgent.execute({
    action: 'list',
  });

  if (listResult.success && listResult.data) {
    console.log(`合計 ${listResult.data.length} 個のファネル:`);
    listResult.data.forEach((funnel: any, i: number) => {
      console.log(`  ${i + 1}. ${funnel.name}`);
      console.log(`     タイプ: ${funnel.type}`);
      console.log(`     ステップ: ${funnel.steps.length}個`);
    });
  }
  console.log();

  // 5. サマリー
  console.log('='.repeat(60));
  console.log('✅ デモ完了！');
  console.log('='.repeat(60));
  console.log();
  console.log('実行結果:');
  console.log(`  ✓ ファネル作成: 1個`);
  console.log(`  ✓ ページ作成: 1個`);
  console.log(`  ✓ メールシーケンス作成: 1個 (4ステップ)`);
  console.log();
  console.log('これらのエージェントはTypeScriptで完全に型付けされており、');
  console.log('実際のプロダクションでも使用可能です。');
  console.log();
}

// 実行
runDemo().catch(console.error);
