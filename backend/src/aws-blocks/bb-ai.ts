/**
 * Mock implementation of AWS Blocks AI
 * In production, this would use Bedrock or other AI services
 */

interface AIConfig {
  name?: string;
  modelId?: string;
  modelType?: string;
  region?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export class AI {
  private modelId: string;
  private region: string;
  private config: AIConfig;

  constructor(config?: AIConfig) {
    this.config = config || {};
    this.modelId = config?.modelId || 'anthropic.claude-3-sonnet-20240229-v1:0';
    this.region = config?.region || 'us-east-1';
  }

  async invoke(prompt: string): Promise<string> {
    // Mock AI response
    return `Mock AI response to: "${prompt}"`;
  }

  async invokeStreaming(prompt: string): Promise<AsyncIterableIterator<string>> {
    const self = this;
    return (async function* () {
      yield `Mock response streaming for: "${prompt}"`;
    })();
  }
}
