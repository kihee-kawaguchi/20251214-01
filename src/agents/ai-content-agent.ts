/**
 * AI Content Agent - AIコンテンツ生成エージェント（スタブ実装）
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

export type CopyFramework = 'AIDA' | 'PAS' | 'BAB' | 'PASTOR' | 'FAB' | 'QUEST';
export type ContentType = 'headline' | 'subheadline' | 'body' | 'cta' | 'email' | 'ad';

export interface AIContentInput {
  action: 'generate_copy' | 'generate_email' | 'improve_text';
  type?: ContentType;
  framework?: CopyFramework;
  context?: {
    product?: string;
    audience?: string;
    painPoints?: string[];
  };
  text?: string;
}

export class AIContentAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'AIContentAgent',
        description: 'AIコンテンツ生成エージェント',
        version: '1.0.0',
      },
      context
    );
  }

  async execute(input: AIContentInput): Promise<AgentResult> {
    this.log('info', `[STUB] Executing AI content action: ${input.action}`);

    return {
      success: true,
      data: { message: 'AI content agent stub - 実装予定（OpenAI API連携）' },
      logs: [`AI content action: ${input.action} (stub)`],
    };
  }
}

export const createAIContentAgent = (projectRoot: string): AIContentAgent => {
  return new AIContentAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
