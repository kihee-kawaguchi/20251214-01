/**
 * Real World Scenario - 実際のビジネスシナリオ
 *
 * シナリオ: オンラインコース販売のための完全なマーケティングファネル構築
 */

import {
  createFunnelBuilderAgent,
  createPageBuilderAgent,
  createEmailMarketingAgent,
} from '../src/agents';

async function buildCourseMarketingFunnel() {
  console.log('🎓 実践シナリオ: オンラインコース販売ファネル構築');
  console.log('='.repeat(70));
  console.log();
  console.log('目標: 無料ウェビナー → 個別相談 → コース販売');
  console.log();

  const projectRoot = process.cwd();
  const funnelAgent = createFunnelBuilderAgent(projectRoot);
  const pageAgent = createPageBuilderAgent(projectRoot);
  const emailAgent = createEmailMarketingAgent(projectRoot);

  // ステップ1: ウェビナーファネル構築
  console.log('【STEP 1】ウェビナーファネル構築');
  console.log('-'.repeat(70));

  const webinarFunnel = await funnelAgent.execute({
    action: 'create',
    templateId: 'webinar',
    data: {
      name: '副業で月10万円稼ぐウェビナー',
      description: '無料ウェビナー → 個別相談 → コース販売',
    },
  });

  console.log(`✅ ファネル作成完了`);
  console.log(`   名前: ${webinarFunnel.data?.name}`);
  console.log(`   ID: ${webinarFunnel.data?.id}`);
  console.log();

  // ステップ2: 登録ページ作成
  console.log('【STEP 2】ウェビナー登録ページ作成');
  console.log('-'.repeat(70));

  const registrationPage = await pageAgent.execute({
    action: 'create',
    funnelId: webinarFunnel.data?.id || 'demo',
    data: {
      name: 'ウェビナー登録ページ',
      slug: 'webinar-registration',
      type: 'landing',
      seo: {
        title: '【無料】副業で月10万円稼ぐ方法 - オンラインウェビナー',
        description: '初心者でも始められる副業の秘訣を完全公開。今すぐ無料登録！',
      },
    },
  });

  // ヒーローセクション追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: registrationPage.data?.id,
    component: {
      type: 'hero',
      props: {
        headline: '【完全無料】副業で月10万円稼ぐ\n実践ウェビナー',
        subheadline: '在宅で、スキマ時間で、初心者からでも始められる方法を公開',
        ctaText: '今すぐ無料で参加する',
        ctaLink: '#registration-form',
        image: 'https://via.placeholder.com/1200x600/4F46E5/ffffff?text=Webinar',
      },
      styles: {
        className: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20',
      },
    },
  });

  // ベネフィット追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: registrationPage.data?.id,
    component: {
      type: 'benefits',
      props: {
        title: 'このウェビナーで学べること',
        benefits: [
          {
            icon: '💰',
            title: '月10万円の仕組み作り',
            description: '継続的に稼ぐための具体的な手順',
          },
          {
            icon: '⏰',
            title: 'スキマ時間活用術',
            description: '1日2時間で最大の成果を出す方法',
          },
          {
            icon: '📊',
            title: '実績者の事例紹介',
            description: '初心者から月50万達成した事例を公開',
          },
        ],
      },
      styles: {
        className: 'py-16 bg-white',
      },
    },
  });

  // 登録フォーム追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: registrationPage.data?.id,
    component: {
      type: 'form',
      props: {
        title: '無料ウェビナーに参加する',
        fields: [
          { name: 'name', label: 'お名前', type: 'text', required: true },
          { name: 'email', label: 'メールアドレス', type: 'email', required: true },
        ],
        submitText: '今すぐ無料で参加',
        privacyText: '個人情報の取り扱いについて同意します',
      },
      styles: {
        className: 'max-w-md mx-auto py-12 bg-gray-50',
      },
    },
  });

  console.log(`✅ 登録ページ構築完了`);
  console.log(`   URL: /${registrationPage.data?.slug}`);
  console.log(`   コンポーネント数: 3個（ヒーロー、ベネフィット、フォーム）`);
  console.log();

  // ステップ3: サンキューページ作成
  console.log('【STEP 3】登録完了（サンキュー）ページ作成');
  console.log('-'.repeat(70));

  const thankyouPage = await pageAgent.execute({
    action: 'create',
    funnelId: webinarFunnel.data?.id || 'demo',
    data: {
      name: '登録ありがとうございます',
      slug: 'thank-you',
      type: 'thankyou',
    },
  });

  await pageAgent.execute({
    action: 'add_component',
    pageId: thankyouPage.data?.id,
    component: {
      type: 'headline',
      props: {
        text: '登録完了！ウェビナー詳細をメールでお送りしました',
        level: 1,
      },
      styles: {
        className: 'text-4xl font-bold text-center my-12 text-green-600',
      },
    },
  });

  console.log(`✅ サンキューページ作成完了`);
  console.log();

  // ステップ4: フォローアップメールシーケンス
  console.log('【STEP 4】ウェビナー前後のフォローアップメール設定');
  console.log('-'.repeat(70));

  const emailSequence = await emailAgent.execute({
    action: 'create_sequence',
    data: {
      name: 'ウェビナー登録後フォローアップ',
      description: '登録 → リマインド → ウェビナー → オファー',
      trigger: {
        type: 'form_submit',
        value: 'webinar-registration-form',
      },
      active: true,
    },
  });

  const emailSteps = [
    {
      order: 0,
      delay: { minutes: 5 },
      subject: '【登録完了】ウェビナー詳細のご案内',
    },
    {
      order: 1,
      delay: { days: 1 },
      subject: '【明日開催】ウェビナーの準備はOKですか？',
    },
    {
      order: 2,
      delay: { hours: 2 },
      subject: '【2時間後】まもなくウェビナー開始です',
    },
    {
      order: 3,
      delay: { hours: 6 },
      subject: 'ウェビナーご参加ありがとうございました',
    },
    {
      order: 4,
      delay: { days: 1 },
      subject: '【限定特典】個別相談会のご案内',
    },
  ];

  for (const step of emailSteps) {
    await emailAgent.execute({
      action: 'add_sequence_step',
      id: emailSequence.data?.id,
      data: step,
    });
  }

  console.log(`✅ メールシーケンス設定完了`);
  console.log(`   シーケンス名: ${emailSequence.data?.name}`);
  console.log(`   ステップ数: ${emailSteps.length}`);
  emailSteps.forEach((step, i) => {
    let timing = '';
    if (step.delay.minutes) timing = `${step.delay.minutes}分後`;
    else if (step.delay.hours) timing = `${step.delay.hours}時間後`;
    else if (step.delay.days) timing = `${step.delay.days}日後`;
    console.log(`   ${i + 1}. [${timing}] ${step.subject}`);
  });
  console.log();

  // ステップ5: セールスページ作成
  console.log('【STEP 5】コース販売ページ作成');
  console.log('-'.repeat(70));

  const salesPage = await pageAgent.execute({
    action: 'create',
    funnelId: webinarFunnel.data?.id || 'demo',
    data: {
      name: 'オンラインコース販売ページ',
      slug: 'course-offer',
      type: 'sales',
      seo: {
        title: '副業マスタープログラム - 月10万円を確実に稼ぐ',
        description: '実績者続出のオンラインコースで、あなたも副業で成功しませんか？',
      },
    },
  });

  // セールスコピー追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: salesPage.data?.id,
    component: {
      type: 'headline',
      props: {
        text: 'ウェビナー参加者限定\n特別価格でのご案内',
        level: 1,
      },
      styles: {
        className: 'text-5xl font-bold text-center my-12',
      },
    },
  });

  // 価格表追加
  await pageAgent.execute({
    action: 'add_component',
    pageId: salesPage.data?.id,
    component: {
      type: 'pricing',
      props: {
        plans: [
          {
            name: 'ベーシックプラン',
            price: '¥49,800',
            originalPrice: '¥98,000',
            features: [
              '全60本の動画講座',
              'テンプレート10種類',
              'メールサポート（3ヶ月）',
              'コミュニティアクセス',
            ],
            cta: '今すぐ申し込む',
            recommended: true,
          },
          {
            name: 'プレミアムプラン',
            price: '¥98,000',
            originalPrice: '¥198,000',
            features: [
              'ベーシックプラン全て',
              '個別コンサル（月2回 x 6ヶ月）',
              '優先サポート',
              '追加テンプレート20種類',
              '成果保証制度',
            ],
            cta: '今すぐ申し込む',
            popular: true,
          },
        ],
      },
      styles: {
        className: 'py-16',
      },
    },
  });

  console.log(`✅ セールスページ作成完了`);
  console.log(`   URL: /${salesPage.data?.slug}`);
  console.log(`   価格プラン: 2つ（ベーシック、プレミアム）`);
  console.log();

  // 最終サマリー
  console.log('='.repeat(70));
  console.log('🎉 マーケティングファネル構築完了！');
  console.log('='.repeat(70));
  console.log();

  console.log('📊 構築されたアセット:');
  console.log();
  console.log('1. ファネル構造:');
  console.log(`   ${webinarFunnel.data?.name}`);
  webinarFunnel.data?.steps.forEach((step: any) => {
    console.log(`   ├─ ${step.name}`);
  });
  console.log();

  console.log('2. ページ:');
  console.log(`   ├─ ウェビナー登録ページ (/${registrationPage.data?.slug})`);
  console.log(`   ├─ サンキューページ (/${thankyouPage.data?.slug})`);
  console.log(`   └─ セールスページ (/${salesPage.data?.slug})`);
  console.log();

  console.log('3. メール自動化:');
  console.log(`   └─ ${emailSequence.data?.name} (${emailSteps.length}ステップ)`);
  console.log();

  console.log('🚀 次のアクション:');
  console.log('   1. 決済システム連携 (Stripe/PAY.JP)');
  console.log('   2. ウェビナープラットフォーム統合');
  console.log('   3. 分析ダッシュボード設定');
  console.log('   4. A/Bテスト開始');
  console.log();

  console.log('💡 このファネルは、登録から購入まで完全自動化されており、');
  console.log('   24時間365日、見込み客を顧客に変換し続けます。');
  console.log();
}

buildCourseMarketingFunnel().catch(console.error);
