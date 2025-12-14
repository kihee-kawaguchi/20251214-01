/**
 * Base Agent - エージェント基底クラス
 * すべてのエージェントはこのクラスを継承します
 */

export interface AgentConfig {
  name: string;
  description: string;
  version: string;
}

export interface AgentContext {
  projectRoot: string;
  config: Record<string, unknown>;
  logger: Logger;
}

export interface Logger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}

export interface AgentResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  logs: string[];
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected context: AgentContext;

  constructor(config: AgentConfig, context: AgentContext) {
    this.config = config;
    this.context = context;
  }

  abstract execute(input: unknown): Promise<AgentResult>;

  protected log(level: 'info' | 'warn' | 'error' | 'debug', message: string, meta?: Record<string, unknown>): void {
    this.context.logger[level](`[${this.config.name}] ${message}`, meta);
  }

  protected async validate(input: unknown): Promise<boolean> {
    return true;
  }

  public getConfig(): AgentConfig {
    return this.config;
  }
}

// シンプルなコンソールロガー
export const createConsoleLogger = (): Logger => ({
  info: (message, meta) => console.log(`[INFO] ${message}`, meta || ''),
  warn: (message, meta) => console.warn(`[WARN] ${message}`, meta || ''),
  error: (message, meta) => console.error(`[ERROR] ${message}`, meta || ''),
  debug: (message, meta) => console.debug(`[DEBUG] ${message}`, meta || ''),
});
