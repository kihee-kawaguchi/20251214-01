/**
 * Funnel Builder Agent - ファネル作成・管理エージェント
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

// ファネルタイプ
export type FunnelType =
  | 'lead_magnet'
  | 'sales'
  | 'webinar'
  | 'product_launch'
  | 'membership'
  | 'custom';

// ファネルステップ
export interface FunnelStep {
  id: string;
  name: string;
  type: 'landing' | 'sales' | 'checkout' | 'upsell' | 'downsell' | 'thankyou' | 'webinar' | 'member';
  slug: string;
  order: number;
  nextStep?: string;
  conditions?: StepCondition[];
}

export interface StepCondition {
  type: 'purchase' | 'form_submit' | 'tag' | 'custom';
  value: string;
  nextStep: string;
}

// ファネル設定
export interface FunnelConfig {
  id: string;
  name: string;
  type: FunnelType;
  description?: string;
  steps: FunnelStep[];
  settings: {
    domain?: string;
    favicon?: string;
    tracking?: {
      googleAnalytics?: string;
      facebookPixel?: string;
      customScripts?: string[];
    };
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// ファネルテンプレート
export interface FunnelTemplate {
  id: string;
  name: string;
  type: FunnelType;
  description: string;
  steps: Omit<FunnelStep, 'id'>[];
  thumbnail?: string;
}

// 入力パラメータ
export interface FunnelBuilderInput {
  action: 'create' | 'update' | 'delete' | 'duplicate' | 'list' | 'get' | 'add_step' | 'remove_step';
  funnelId?: string;
  data?: Partial<FunnelConfig>;
  templateId?: string;
  step?: Partial<FunnelStep>;
}

// デフォルトテンプレート
const FUNNEL_TEMPLATES: FunnelTemplate[] = [
  {
    id: 'lead_magnet_basic',
    name: 'リードマグネット（基本）',
    type: 'lead_magnet',
    description: '無料オファーでリードを獲得するシンプルなファネル',
    steps: [
      { name: 'オプトインページ', type: 'landing', slug: 'optin', order: 0, nextStep: 'thankyou' },
      { name: 'サンキューページ', type: 'thankyou', slug: 'thankyou', order: 1 },
    ],
  },
  {
    id: 'sales_basic',
    name: 'セールスファネル（基本）',
    type: 'sales',
    description: '商品販売のための基本的なセールスファネル',
    steps: [
      { name: 'セールスページ', type: 'sales', slug: 'sales', order: 0, nextStep: 'checkout' },
      { name: 'チェックアウト', type: 'checkout', slug: 'checkout', order: 1, nextStep: 'upsell' },
      { name: 'アップセル', type: 'upsell', slug: 'upsell', order: 2, nextStep: 'thankyou' },
      { name: 'サンキューページ', type: 'thankyou', slug: 'thankyou', order: 3 },
    ],
  },
  {
    id: 'webinar_evergreen',
    name: 'エバーグリーンウェビナー',
    type: 'webinar',
    description: '自動ウェビナーで24時間セールスを行うファネル',
    steps: [
      { name: '登録ページ', type: 'landing', slug: 'register', order: 0, nextStep: 'confirmation' },
      { name: '確認ページ', type: 'thankyou', slug: 'confirmation', order: 1 },
      { name: 'ウェビナー視聴', type: 'webinar', slug: 'watch', order: 2, nextStep: 'offer' },
      { name: 'オファーページ', type: 'sales', slug: 'offer', order: 3, nextStep: 'checkout' },
      { name: 'チェックアウト', type: 'checkout', slug: 'checkout', order: 4, nextStep: 'thankyou' },
      { name: 'サンキューページ', type: 'thankyou', slug: 'thankyou', order: 5 },
    ],
  },
  {
    id: 'product_launch',
    name: 'プロダクトローンチ',
    type: 'product_launch',
    description: 'PLC（プロダクトローンチフォーミュラ）形式のファネル',
    steps: [
      { name: '登録ページ', type: 'landing', slug: 'register', order: 0, nextStep: 'plc1' },
      { name: 'PLC動画1', type: 'sales', slug: 'plc1', order: 1, nextStep: 'plc2' },
      { name: 'PLC動画2', type: 'sales', slug: 'plc2', order: 2, nextStep: 'plc3' },
      { name: 'PLC動画3', type: 'sales', slug: 'plc3', order: 3, nextStep: 'plc4' },
      { name: 'PLC動画4（オープンカート）', type: 'sales', slug: 'plc4', order: 4, nextStep: 'checkout' },
      { name: 'チェックアウト', type: 'checkout', slug: 'checkout', order: 5, nextStep: 'thankyou' },
      { name: 'サンキューページ', type: 'thankyou', slug: 'thankyou', order: 6 },
    ],
  },
  {
    id: 'membership_basic',
    name: '会員サイト（基本）',
    type: 'membership',
    description: 'サブスクリプション型会員サイトファネル',
    steps: [
      { name: '販売ページ', type: 'sales', slug: 'sales', order: 0, nextStep: 'checkout' },
      { name: 'チェックアウト', type: 'checkout', slug: 'checkout', order: 1, nextStep: 'welcome' },
      { name: 'ウェルカムページ', type: 'thankyou', slug: 'welcome', order: 2, nextStep: 'member' },
      { name: '会員エリア', type: 'member', slug: 'member', order: 3 },
    ],
  },
];

export class FunnelBuilderAgent extends BaseAgent {
  private funnels: Map<string, FunnelConfig> = new Map();

  constructor(context: AgentContext) {
    super(
      {
        name: 'FunnelBuilderAgent',
        description: 'ファネル作成・管理エージェント',
        version: '1.0.0',
      },
      context
    );
  }

  async execute(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig | FunnelConfig[] | null>> {
    this.log('info', `Executing action: ${input.action}`);

    try {
      switch (input.action) {
        case 'create':
          return this.createFunnel(input);
        case 'update':
          return this.updateFunnel(input);
        case 'delete':
          return this.deleteFunnel(input);
        case 'duplicate':
          return this.duplicateFunnel(input);
        case 'list':
          return this.listFunnels();
        case 'get':
          return this.getFunnel(input);
        case 'add_step':
          return this.addStep(input);
        case 'remove_step':
          return this.removeStep(input);
        default:
          throw new Error(`Unknown action: ${input.action}`);
      }
    } catch (error) {
      this.log('error', `Error executing action: ${error}`);
      return {
        success: false,
        error: error as Error,
        logs: [`Error: ${error}`],
      };
    }
  }

  private async createFunnel(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig>> {
    const { data, templateId } = input;

    let steps: FunnelStep[] = [];

    // テンプレートからステップを取得
    if (templateId) {
      const template = FUNNEL_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        steps = template.steps.map((step, index) => ({
          ...step,
          id: `step_${Date.now()}_${index}`,
        }));
      }
    }

    const funnel: FunnelConfig = {
      id: `funnel_${Date.now()}`,
      name: data?.name || 'New Funnel',
      type: data?.type || 'custom',
      description: data?.description,
      steps: data?.steps || steps,
      settings: data?.settings || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.funnels.set(funnel.id, funnel);

    this.log('info', `Created funnel: ${funnel.name} (${funnel.id})`);

    return {
      success: true,
      data: funnel,
      logs: [`Created funnel: ${funnel.name}`],
    };
  }

  private async updateFunnel(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig>> {
    const { funnelId, data } = input;

    if (!funnelId) {
      throw new Error('funnelId is required for update');
    }

    const existing = this.funnels.get(funnelId);
    if (!existing) {
      throw new Error(`Funnel not found: ${funnelId}`);
    }

    const updated: FunnelConfig = {
      ...existing,
      ...data,
      id: funnelId,
      updatedAt: new Date(),
    };

    this.funnels.set(funnelId, updated);

    this.log('info', `Updated funnel: ${updated.name} (${funnelId})`);

    return {
      success: true,
      data: updated,
      logs: [`Updated funnel: ${updated.name}`],
    };
  }

  private async deleteFunnel(input: FunnelBuilderInput): Promise<AgentResult<null>> {
    const { funnelId } = input;

    if (!funnelId) {
      throw new Error('funnelId is required for delete');
    }

    const deleted = this.funnels.delete(funnelId);

    if (!deleted) {
      throw new Error(`Funnel not found: ${funnelId}`);
    }

    this.log('info', `Deleted funnel: ${funnelId}`);

    return {
      success: true,
      data: null,
      logs: [`Deleted funnel: ${funnelId}`],
    };
  }

  private async duplicateFunnel(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig>> {
    const { funnelId } = input;

    if (!funnelId) {
      throw new Error('funnelId is required for duplicate');
    }

    const existing = this.funnels.get(funnelId);
    if (!existing) {
      throw new Error(`Funnel not found: ${funnelId}`);
    }

    const duplicate: FunnelConfig = {
      ...existing,
      id: `funnel_${Date.now()}`,
      name: `${existing.name} (Copy)`,
      steps: existing.steps.map(step => ({
        ...step,
        id: `step_${Date.now()}_${step.order}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.funnels.set(duplicate.id, duplicate);

    this.log('info', `Duplicated funnel: ${existing.name} -> ${duplicate.name}`);

    return {
      success: true,
      data: duplicate,
      logs: [`Duplicated funnel: ${duplicate.name}`],
    };
  }

  private async listFunnels(): Promise<AgentResult<FunnelConfig[]>> {
    const funnels = Array.from(this.funnels.values());

    return {
      success: true,
      data: funnels,
      logs: [`Listed ${funnels.length} funnels`],
    };
  }

  private async getFunnel(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig | null>> {
    const { funnelId } = input;

    if (!funnelId) {
      throw new Error('funnelId is required');
    }

    const funnel = this.funnels.get(funnelId);

    return {
      success: true,
      data: funnel || null,
      logs: [funnel ? `Found funnel: ${funnel.name}` : `Funnel not found: ${funnelId}`],
    };
  }

  private async addStep(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig>> {
    const { funnelId, step } = input;

    if (!funnelId || !step) {
      throw new Error('funnelId and step are required');
    }

    const existing = this.funnels.get(funnelId);
    if (!existing) {
      throw new Error(`Funnel not found: ${funnelId}`);
    }

    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      name: step.name || 'New Step',
      type: step.type || 'landing',
      slug: step.slug || `step-${existing.steps.length + 1}`,
      order: step.order ?? existing.steps.length,
      nextStep: step.nextStep,
      conditions: step.conditions,
    };

    existing.steps.push(newStep);
    existing.steps.sort((a, b) => a.order - b.order);
    existing.updatedAt = new Date();

    this.log('info', `Added step "${newStep.name}" to funnel "${existing.name}"`);

    return {
      success: true,
      data: existing,
      logs: [`Added step: ${newStep.name}`],
    };
  }

  private async removeStep(input: FunnelBuilderInput): Promise<AgentResult<FunnelConfig>> {
    const { funnelId, step } = input;

    if (!funnelId || !step?.id) {
      throw new Error('funnelId and step.id are required');
    }

    const existing = this.funnels.get(funnelId);
    if (!existing) {
      throw new Error(`Funnel not found: ${funnelId}`);
    }

    const stepIndex = existing.steps.findIndex(s => s.id === step.id);
    if (stepIndex === -1) {
      throw new Error(`Step not found: ${step.id}`);
    }

    const removed = existing.steps.splice(stepIndex, 1)[0];
    existing.updatedAt = new Date();

    this.log('info', `Removed step "${removed.name}" from funnel "${existing.name}"`);

    return {
      success: true,
      data: existing,
      logs: [`Removed step: ${removed.name}`],
    };
  }

  // テンプレート取得
  static getTemplates(): FunnelTemplate[] {
    return FUNNEL_TEMPLATES;
  }
}

// ファクトリー関数
export const createFunnelBuilderAgent = (projectRoot: string): FunnelBuilderAgent => {
  return new FunnelBuilderAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
