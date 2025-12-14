/**
 * Agents Index - すべてのエージェントのエクスポート
 */

export * from './base-agent';
export * from './funnel-builder-agent';
export * from './page-builder-agent';
export * from './email-marketing-agent';

// 簡易版エージェント（実装はスタブ）
export * from './payment-agent';
export * from './line-integration-agent';
export * from './ai-content-agent';
export * from './analytics-agent';

/**
 * エージェント統合管理クラス
 */
import { FunnelBuilderAgent, createFunnelBuilderAgent } from './funnel-builder-agent';
import { PageBuilderAgent, createPageBuilderAgent } from './page-builder-agent';
import { EmailMarketingAgent, createEmailMarketingAgent } from './email-marketing-agent';

export interface AgentManager {
  funnel: FunnelBuilderAgent;
  page: PageBuilderAgent;
  email: EmailMarketingAgent;
}

export const createAgentManager = (projectRoot: string): AgentManager => {
  return {
    funnel: createFunnelBuilderAgent(projectRoot),
    page: createPageBuilderAgent(projectRoot),
    email: createEmailMarketingAgent(projectRoot),
  };
};
