/**
 * Email Marketing Agent - メールマーケティングエージェント
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

// メールタイプ
export type EmailType =
  | 'welcome'
  | 'nurture'
  | 'sales'
  | 'reminder'
  | 'confirmation'
  | 'receipt'
  | 'broadcast';

// メールテンプレート
export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailType;
  subject: string;
  preheader?: string;
  htmlBody: string;
  textBody?: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ステップメールシーケンス
export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: 'form_submit' | 'tag_added' | 'purchase' | 'subscription_start' | 'custom_event';
    value?: string;
  };
  steps: EmailSequenceStep[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSequenceStep {
  id: string;
  order: number;
  delay: {
    days?: number;
    hours?: number;
    minutes?: number;
  };
  templateId: string;
  subject: string;
  conditions?: {
    type: 'opened' | 'clicked' | 'not_opened' | 'has_tag' | 'no_tag';
    value?: string;
  }[];
}

// キャンペーン
export interface EmailCampaign {
  id: string;
  name: string;
  type: 'one_time' | 'recurring';
  templateId: string;
  subject: string;
  segmentId?: string;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 入力パラメータ
export interface EmailMarketingInput {
  action:
    | 'create_template'
    | 'update_template'
    | 'delete_template'
    | 'get_template'
    | 'list_templates'
    | 'create_sequence'
    | 'update_sequence'
    | 'delete_sequence'
    | 'get_sequence'
    | 'list_sequences'
    | 'add_sequence_step'
    | 'remove_sequence_step'
    | 'create_campaign'
    | 'send_campaign'
    | 'get_campaign_stats';
  id?: string;
  data?: any;
}

// デフォルトテンプレート
const DEFAULT_TEMPLATES: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'ウェルカムメール',
    type: 'welcome',
    subject: '{{firstName}}さん、ご登録ありがとうございます！',
    preheader: '今すぐ{{leadMagnetName}}をダウンロード',
    htmlBody: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>{{firstName}}さん、ようこそ！</h1>
        <p>この度はご登録いただき、誠にありがとうございます。</p>
        <p>お約束した<strong>{{leadMagnetName}}</strong>は、下記のボタンからダウンロードできます。</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{downloadUrl}}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            今すぐダウンロード
          </a>
        </div>
        <p>何かご不明な点がございましたら、このメールに返信してください。</p>
        <p>よろしくお願いいたします。</p>
      </body>
      </html>
    `,
    variables: ['firstName', 'leadMagnetName', 'downloadUrl'],
  },
  {
    name: 'セールスメール',
    type: 'sales',
    subject: '【期間限定】{{productName}}が特別価格で',
    preheader: '{{discount}}%OFF - 残り{{hoursLeft}}時間',
    htmlBody: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>{{firstName}}さんへ特別なお知らせ</h1>
        <p>{{productName}}を<strong style="color: #EF4444;">{{discount}}%OFF</strong>でご提供します。</p>
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">通常価格: <s>{{regularPrice}}円</s></p>
          <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #EF4444;">特別価格: {{salePrice}}円</p>
        </div>
        <div style="background-color: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">⏰ 残り{{hoursLeft}}時間で終了</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{checkoutUrl}}" style="background-color: #EF4444; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px;">
            今すぐ申し込む
          </a>
        </div>
      </body>
      </html>
    `,
    variables: ['firstName', 'productName', 'discount', 'regularPrice', 'salePrice', 'hoursLeft', 'checkoutUrl'],
  },
];

export class EmailMarketingAgent extends BaseAgent {
  private templates: Map<string, EmailTemplate> = new Map();
  private sequences: Map<string, EmailSequence> = new Map();
  private campaigns: Map<string, EmailCampaign> = new Map();

  constructor(context: AgentContext) {
    super(
      {
        name: 'EmailMarketingAgent',
        description: 'メールマーケティングエージェント',
        version: '1.0.0',
      },
      context
    );

    // デフォルトテンプレートを初期化
    DEFAULT_TEMPLATES.forEach(template => {
      const id = `template_${Date.now()}_${this.templates.size}`;
      this.templates.set(id, {
        ...template,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  async execute(input: EmailMarketingInput): Promise<AgentResult> {
    this.log('info', `Executing action: ${input.action}`);

    try {
      switch (input.action) {
        case 'create_template':
          return this.createTemplate(input);
        case 'update_template':
          return this.updateTemplate(input);
        case 'delete_template':
          return this.deleteTemplate(input);
        case 'get_template':
          return this.getTemplate(input);
        case 'list_templates':
          return this.listTemplates();
        case 'create_sequence':
          return this.createSequence(input);
        case 'update_sequence':
          return this.updateSequence(input);
        case 'delete_sequence':
          return this.deleteSequence(input);
        case 'get_sequence':
          return this.getSequence(input);
        case 'list_sequences':
          return this.listSequences();
        case 'add_sequence_step':
          return this.addSequenceStep(input);
        case 'remove_sequence_step':
          return this.removeSequenceStep(input);
        case 'create_campaign':
          return this.createCampaign(input);
        case 'send_campaign':
          return this.sendCampaign(input);
        case 'get_campaign_stats':
          return this.getCampaignStats(input);
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

  private async createTemplate(input: EmailMarketingInput): Promise<AgentResult<EmailTemplate>> {
    const { data } = input;

    const template: EmailTemplate = {
      id: `template_${Date.now()}`,
      name: data?.name || 'New Template',
      type: data?.type || 'nurture',
      subject: data?.subject || '',
      preheader: data?.preheader,
      htmlBody: data?.htmlBody || '',
      textBody: data?.textBody,
      variables: data?.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.templates.set(template.id, template);

    this.log('info', `Created template: ${template.name}`);

    return {
      success: true,
      data: template,
      logs: [`Created template: ${template.name}`],
    };
  }

  private async updateTemplate(input: EmailMarketingInput): Promise<AgentResult<EmailTemplate>> {
    const { id, data } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error(`Template not found: ${id}`);
    }

    const updated: EmailTemplate = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date(),
    };

    this.templates.set(id, updated);

    this.log('info', `Updated template: ${updated.name}`);

    return {
      success: true,
      data: updated,
      logs: [`Updated template: ${updated.name}`],
    };
  }

  private async deleteTemplate(input: EmailMarketingInput): Promise<AgentResult<null>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const deleted = this.templates.delete(id);

    if (!deleted) {
      throw new Error(`Template not found: ${id}`);
    }

    this.log('info', `Deleted template: ${id}`);

    return {
      success: true,
      data: null,
      logs: [`Deleted template: ${id}`],
    };
  }

  private async getTemplate(input: EmailMarketingInput): Promise<AgentResult<EmailTemplate | null>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const template = this.templates.get(id);

    return {
      success: true,
      data: template || null,
      logs: [template ? `Found template: ${template.name}` : `Template not found: ${id}`],
    };
  }

  private async listTemplates(): Promise<AgentResult<EmailTemplate[]>> {
    const templates = Array.from(this.templates.values());

    return {
      success: true,
      data: templates,
      logs: [`Listed ${templates.length} templates`],
    };
  }

  private async createSequence(input: EmailMarketingInput): Promise<AgentResult<EmailSequence>> {
    const { data } = input;

    const sequence: EmailSequence = {
      id: `sequence_${Date.now()}`,
      name: data?.name || 'New Sequence',
      description: data?.description,
      trigger: data?.trigger || { type: 'form_submit' },
      steps: data?.steps || [],
      active: data?.active ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sequences.set(sequence.id, sequence);

    this.log('info', `Created sequence: ${sequence.name}`);

    return {
      success: true,
      data: sequence,
      logs: [`Created sequence: ${sequence.name}`],
    };
  }

  private async updateSequence(input: EmailMarketingInput): Promise<AgentResult<EmailSequence>> {
    const { id, data } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const existing = this.sequences.get(id);
    if (!existing) {
      throw new Error(`Sequence not found: ${id}`);
    }

    const updated: EmailSequence = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date(),
    };

    this.sequences.set(id, updated);

    this.log('info', `Updated sequence: ${updated.name}`);

    return {
      success: true,
      data: updated,
      logs: [`Updated sequence: ${updated.name}`],
    };
  }

  private async deleteSequence(input: EmailMarketingInput): Promise<AgentResult<null>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const deleted = this.sequences.delete(id);

    if (!deleted) {
      throw new Error(`Sequence not found: ${id}`);
    }

    this.log('info', `Deleted sequence: ${id}`);

    return {
      success: true,
      data: null,
      logs: [`Deleted sequence: ${id}`],
    };
  }

  private async getSequence(input: EmailMarketingInput): Promise<AgentResult<EmailSequence | null>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const sequence = this.sequences.get(id);

    return {
      success: true,
      data: sequence || null,
      logs: [sequence ? `Found sequence: ${sequence.name}` : `Sequence not found: ${id}`],
    };
  }

  private async listSequences(): Promise<AgentResult<EmailSequence[]>> {
    const sequences = Array.from(this.sequences.values());

    return {
      success: true,
      data: sequences,
      logs: [`Listed ${sequences.length} sequences`],
    };
  }

  private async addSequenceStep(input: EmailMarketingInput): Promise<AgentResult<EmailSequence>> {
    const { id, data } = input;

    if (!id || !data) {
      throw new Error('id and data are required');
    }

    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new Error(`Sequence not found: ${id}`);
    }

    const step: EmailSequenceStep = {
      id: `step_${Date.now()}`,
      order: data.order ?? sequence.steps.length,
      delay: data.delay || { days: 1 },
      templateId: data.templateId,
      subject: data.subject,
      conditions: data.conditions,
    };

    sequence.steps.push(step);
    sequence.steps.sort((a, b) => a.order - b.order);
    sequence.updatedAt = new Date();

    this.log('info', `Added step to sequence: ${sequence.name}`);

    return {
      success: true,
      data: sequence,
      logs: [`Added step to sequence: ${sequence.name}`],
    };
  }

  private async removeSequenceStep(input: EmailMarketingInput): Promise<AgentResult<EmailSequence>> {
    const { id, data } = input;

    if (!id || !data?.stepId) {
      throw new Error('id and stepId are required');
    }

    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new Error(`Sequence not found: ${id}`);
    }

    const index = sequence.steps.findIndex(s => s.id === data.stepId);
    if (index === -1) {
      throw new Error(`Step not found: ${data.stepId}`);
    }

    sequence.steps.splice(index, 1);
    sequence.updatedAt = new Date();

    this.log('info', `Removed step from sequence: ${sequence.name}`);

    return {
      success: true,
      data: sequence,
      logs: [`Removed step from sequence: ${sequence.name}`],
    };
  }

  private async createCampaign(input: EmailMarketingInput): Promise<AgentResult<EmailCampaign>> {
    const { data } = input;

    const campaign: EmailCampaign = {
      id: `campaign_${Date.now()}`,
      name: data?.name || 'New Campaign',
      type: data?.type || 'one_time',
      templateId: data?.templateId,
      subject: data?.subject || '',
      segmentId: data?.segmentId,
      scheduledAt: data?.scheduledAt,
      status: 'draft',
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);

    this.log('info', `Created campaign: ${campaign.name}`);

    return {
      success: true,
      data: campaign,
      logs: [`Created campaign: ${campaign.name}`],
    };
  }

  private async sendCampaign(input: EmailMarketingInput): Promise<AgentResult<EmailCampaign>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error(`Campaign not found: ${id}`);
    }

    campaign.status = 'sending';
    // ここで実際の送信処理を実行
    // ...

    campaign.status = 'sent';
    campaign.updatedAt = new Date();

    this.log('info', `Sent campaign: ${campaign.name}`);

    return {
      success: true,
      data: campaign,
      logs: [`Sent campaign: ${campaign.name}`],
    };
  }

  private async getCampaignStats(input: EmailMarketingInput): Promise<AgentResult<EmailCampaign['stats']>> {
    const { id } = input;

    if (!id) {
      throw new Error('id is required');
    }

    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error(`Campaign not found: ${id}`);
    }

    return {
      success: true,
      data: campaign.stats,
      logs: [`Retrieved stats for campaign: ${campaign.name}`],
    };
  }
}

export const createEmailMarketingAgent = (projectRoot: string): EmailMarketingAgent => {
  return new EmailMarketingAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
