import { Router, Request, Response } from 'express';
import { chatTable } from '../blocks/index.js';

const router = Router();

interface SendMessageRequest extends Request {
  body: {
    chatId: string;
    userId: string;
    content: string;
    role: 'user' | 'assistant';
  };
}

interface GetMessagesRequest extends Request {
  query: {
    chatId: string;
    limit?: string;
    offset?: string;
  };
}

/**
 * POST /api/messages
 * メッセージ送信
 */
router.post('/', async (req: SendMessageRequest, res: Response) => {
  try {
    const { chatId, userId, content, role } = req.body;

    if (!chatId || !userId || !content || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messageId = `msg_${Date.now()}`;
    const timestamp = Date.now();

    await chatTable.put({
      chatId,
      timestamp,
      messageId,
      userId,
      content,
      role,
      createdAt: timestamp,
    });

    res.status(201).json({
      success: true,
      messageId,
      timestamp,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * GET /api/messages
 * チャットのメッセージ一覧取得
 */
router.get('/', async (req: GetMessagesRequest, res: Response) => {
  try {
    const { chatId, limit = '50', offset = '0' } = req.query;

    if (!chatId || typeof chatId !== 'string') {
      return res.status(400).json({ error: 'chatId is required' });
    }

    // ローカルでは簡略的な実装
    res.json({
      success: true,
      messages: [],
      total: 0,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

/**
 * GET /api/messages/:messageId
 * メッセージ詳細取得
 */
router.get('/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId is required' });
    }

    res.json({
      success: true,
      message: {
        messageId,
        content: 'Sample message',
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to get message' });
  }
});

/**
 * PUT /api/messages/:messageId
 * メッセージ編集
 */
router.put('/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId is required' });
    }

    res.json({
      success: true,
      messageId,
      content,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

/**
 * DELETE /api/messages/:messageId
 * メッセージ削除
 */
router.delete('/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId is required' });
    }

    res.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
