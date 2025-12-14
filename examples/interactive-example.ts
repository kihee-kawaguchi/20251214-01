/**
 * インタラクティブな使用例
 */

import {
  createFunnelBuilderAgent,
  createPageBuilderAgent,
  createEmailMarketingAgent,
} from '../src/agents';

async function interactiveDemo() {
  console.log('🎮 インタラクティブデモ');
  console.log('='.repeat(50));
  console.log();

  const funnelAgent = createFunnelBuilderAgent(process.cwd());
  const pageAgent = createPageBuilderAgent(process.cwd());
  const emailAgent = createEmailMarketingAgent(process.cwd());

  // 1. ファネル作成
  console.log('【1】ファネルを作成します...');
  const funnel = await funnelAgent.execute({
    action: 'create',
    templateId: 'lead_magnet',
    data: { name: 'インタラクティブファネル' },
  });
  console.log(`   ✓ ${funnel.data.name} を作成しました`);
  console.log();

  // 2. ページ作成
  console.log('【2】ランディングページを作成します...');
  const page = await pageAgent.execute({
    action: 'create',
    funnelId: funnel.data.id,
    data: {
      name: 'マイLP',
      slug: 'my-landing-page',
    },
  });
  console.log(`   ✓ ページを作成しました: /${page.data.slug}`);
  console.log();

  // 3. コンポーネント追加
  console.log('【3】ページにボタンを追加します...');
  await pageAgent.execute({
    action: 'add_component',
    pageId: page.data.id,
    component: {
      type: 'button',
      props: {
        text: '今すぐ登録',
        link: '/register',
      },
    },
  });
  console.log('   ✓ ボタンを追加しました');
  console.log();

  // 4. メールシーケンス作成
  console.log('【4】メール自動化を設定します...');
  const sequence = await emailAgent.execute({
    action: 'create_sequence',
    data: {
      name: 'ウェルカムシーケンス',
      trigger: { type: 'form_submit' },
    },
  });
  console.log(`   ✓ ${sequence.data.name} を作成しました`);
  console.log();

  // 5. ステップ追加
  console.log('【5】メールステップを追加します...');
  await emailAgent.execute({
    action: 'add_sequence_step',
    id: sequence.data.id,
    data: {
      delay: { hours: 1 },
      subject: 'ありがとうございます！',
    },
  });
  console.log('   ✓ ステップ1を追加しました (1時間後)');

  await emailAgent.execute({
    action: 'add_sequence_step',
    id: sequence.data.id,
    data: {
      delay: { days: 1 },
      subject: 'あなたへの特別なギフト',
    },
  });
  console.log('   ✓ ステップ2を追加しました (1日後)');
  console.log();

  // 6. 最終結果
  console.log('='.repeat(50));
  console.log('🎉 完成しました！');
  console.log('='.repeat(50));
  console.log();
  console.log('作成されたもの:');
  console.log(`  📊 ファネル: ${funnel.data.name}`);
  console.log(`  📄 ページ: ${page.data.name} (/${page.data.slug})`);
  console.log(`  📧 メール: ${sequence.data.name} (2ステップ)`);
  console.log();
  console.log('このファネルは完全自動化され、24時間稼働します！');
}

interactiveDemo();
