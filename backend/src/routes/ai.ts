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

    const lastUserMessage = messages
      .reverse()
      .find((m) => m.role === 'user')?.content || '';

    // AI Block を経由して応答生成（Bedrock 相当）
    const response = await aiModel.invoke(lastUserMessage);

    res.json({
      success: true,
      response,
      model: 'bedrock-local-emulation-mock',
      generatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Generate response error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

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
    const chunks = await aiModel.invokeStreaming(lastUserMessage);

    for await (const chunk of chunks) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
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
