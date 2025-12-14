/**
 * 最もシンプルな使用例
 */

import { createFunnelBuilderAgent } from '../src/agents';

async function main() {
  console.log('🚀 ファネル作成デモ\n');

  // エージェント作成
  const agent = createFunnelBuilderAgent(process.cwd());

  // ファネル作成
  console.log('ステップ1: ファネル作成中...');
  const result = await agent.execute({
    action: 'create',
    templateId: 'sales_basic',
    data: {
      name: '私のファネル',
      description: 'これは私が作った最初のファネルです',
    },
  });

  if (result.success) {
    console.log('✅ 成功！');
    console.log(`ファネル名: ${result.data.name}`);
    console.log(`ファネルID: ${result.data.id}`);
    console.log(`ステップ数: ${result.data.steps.length}\n`);

    console.log('ステップ詳細:');
    result.data.steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step.name} (${step.type})`);
    });
  }
}

main();
