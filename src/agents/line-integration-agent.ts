/**
 * LINE Integration Agent - LINE連携エージェント（スタブ実装）
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

export type LineMessageType = 'text' | 'image' | 'video' | 'flex' | 'template';

export interface LineMessage {
  type: LineMessageType;
  content: any;
}

export interface LineInput {
  action: 'send_message' | 'create_richmenu' | 'setup_sequence';
  data?: any;
}

export class LineIntegrationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'LineIntegrationAgent',
        description: 'LINE連携エージェント',
        version: '1.0.0',
      },
      context
    );
  }

  async execute(input: LineInput): Promise<AgentResult> {
    this.log('info', `[STUB] Executing LINE action: ${input.action}`);

    return {
      success: true,
      data: { message: 'LINE integration agent stub - 実装予定' },
      logs: [`LINE action: ${input.action} (stub)`],
    };
  }
}

export const createLineIntegrationAgent = (projectRoot: string): LineIntegrationAgent => {
  return new LineIntegrationAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
