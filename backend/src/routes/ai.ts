import { Router, Request, Response } from 'express';
import { aiModel } from '../blocks/index.js';

const router = Router();

interface GenerateResponseRequest extends Request {
  body: {
    chatId: string;
    userId: string;
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  };
}

/**
 * POST /api/ai/generate
 * AI レスポンス生成（Bedrock エミュレーション）
 */
router.post('/generate', async (req: GenerateResponseRequest, res: Response) => {
  try {
    const { chatId, userId, messages } = req.body;

    if (!chatId || !userId || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ローカルエミュレーションでは、簡易的な応答を返す
    // 本番環境では Bedrock に統合され、実際の AI モデルが使用される

    const lastUserMessage = messages
      .reverse()
      .find((m) => m.role === 'user')?.content || '';

    // 簡略的なレスポンス生成ロジック
    const response = generateMockResponse(lastUserMessage);

    res.json({
      success: true,
      response,
      model: 'bedrock-local-emulation',
      generatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Generate response error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

/**
 * ローカルエミュレーション用の簡略レスポンス生成
 */
function generateMockResponse(userInput: string): string {
  const responses: Record<string, string> = {
    hi: 'こんにちは！何かお手伝いできることはありますか？',
    hello: 'Hello! How can I assist you today?',
    help: 'I can help you with various tasks. What do you need?',
    thanks: 'You\'re welcome! Is there anything else I can help with?',
    bye: 'Goodbye! Have a great day!',
  };

  const lowerInput = userInput.toLowerCase().trim();

  for (const [key, value] of Object.entries(responses)) {
    if (lowerInput.includes(key)) {
      return value;
    }
  }

  // デフォルト応答
  return `I received your message: "${userInput}". This is a local emulation response. In production, this would be powered by Bedrock AI.`;
}

/**
 * POST /api/ai/stream
 * AI レスポンス ストリーミング生成
 */
router.post('/stream', async (req: GenerateResponseRequest, res: Response) => {
  try {
    const { chatId, userId, messages } = req.body;

    if (!chatId || !userId || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Server-Sent Events (SSE) でストリーミング応答を返す
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const lastUserMessage = messages.reverse().find((m) => m.role === 'user')?.content || '';
    const fullResponse = generateMockResponse(lastUserMessage);

    // テキストを文字単位でストリーミング
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullResponse.length) {
        res.write(`data: ${JSON.stringify({ chunk: fullResponse[index] })}\n\n`);
        index++;
      } else {
        res.write('data: [DONE]\n\n');
        clearInterval(interval);
        res.end();
      }
    }, 50);
  } catch (error) {
    console.error('Stream response error:', error);
    res.status(500).json({ error: 'Failed to stream response' });
  }
});

/**
 * GET /api/ai/models
 * 利用可能なモデル一覧
 */
router.get('/models', async (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      models: [
        {
          id: 'bedrock-local-emulation',
          name: 'Bedrock Local Emulation',
          type: 'text-generation',
          maxTokens: 512,
        },
      ],
    });
  } catch (error) {
    console.error('List models error:', error);
    res.status(500).json({ error: 'Failed to list models' });
  }
});

export default router;
