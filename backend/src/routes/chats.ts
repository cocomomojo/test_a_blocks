import { Router, Request, Response } from 'express';
import { chatTable, userTable } from '../blocks/index.js';

const router = Router();

interface CreateChatRequest extends Request {
  body: {
    userId: string;
    title: string;
    participants?: string[];
  };
}

interface GetChatsRequest extends Request {
  query: {
    userId: string;
  };
}

interface UpdateChatRequest extends Request {
  body: {
    title?: string;
    participants?: string[];
  };
  params: {
    chatId: string;
  };
}

/**
 * POST /api/chats
 * 新規チャット作成
 */
router.post('/', async (req: CreateChatRequest, res: Response) => {
  try {
    const { userId, title, participants = [] } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chatId = `chat_${Date.now()}`;
    const now = Date.now();

    await chatTable.put({
      chatId,
      userId,
      title,
      participants: [userId, ...participants],
      createdAt: now,
      timestamp: now,
      messageCount: 0,
    });

    res.status(201).json({
      success: true,
      chatId,
      title,
      createdAt: now,
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

/**
 * GET /api/chats
 * ユーザーのチャット一覧取得
 */
router.get('/', async (req: GetChatsRequest, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    // ローカルでは簡略的な実装
    // 本番環境ではクエリ機能を使用
    res.json({
      success: true,
      chats: [],
      count: 0,
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

/**
 * GET /api/chats/:chatId
 * チャット詳細取得
 */
router.get('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    res.json({
      success: true,
      chat: {
        chatId,
        title: 'Sample Chat',
        createdAt: Date.now(),
      },
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to get chat' });
  }
});

/**
 * PUT /api/chats/:chatId
 * チャット更新（タイトル変更など）
 */
router.put('/:chatId', async (req: UpdateChatRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { title, participants } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    // ローカルでは簡略的な実装
    res.json({
      success: true,
      chatId,
      title,
      participants,
    });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

/**
 * DELETE /api/chats/:chatId
 * チャット削除
 */
router.delete('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    res.json({
      success: true,
      message: 'Chat deleted',
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router;
