/**
 * Payment Agent - 決済連携エージェント（スタブ実装）
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

export type PaymentProvider = 'stripe' | 'payjp' | 'gmo' | 'square';
export type ProductType = 'one_time' | 'subscription' | 'payment_plan' | 'bundle';

export interface ProductConfig {
  id: string;
  name: string;
  description?: string;
  type: ProductType;
  price: number;
  currency: 'JPY' | 'USD';
  interval?: 'month' | 'year';
  trialDays?: number;
}

export interface PaymentInput {
  action: 'create_product' | 'create_checkout' | 'handle_webhook';
  data?: any;
}

export class PaymentAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'PaymentAgent',
        description: '決済連携エージェント',
        version: '1.0.0',
      },
      context
    );
  }

  async execute(input: PaymentInput): Promise<AgentResult> {
    this.log('info', `[STUB] Executing payment action: ${input.action}`);

    return {
      success: true,
      data: { message: 'Payment agent stub - 実装予定' },
      logs: [`Payment action: ${input.action} (stub)`],
    };
  }
}

export const createPaymentAgent = (projectRoot: string): PaymentAgent => {
  return new PaymentAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
