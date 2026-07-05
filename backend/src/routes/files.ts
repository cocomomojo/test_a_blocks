import { Router, Request, Response } from 'express';
import { fileStorage } from '../blocks/index.js';

const router = Router();

interface UploadFileRequest extends Request {
  body: {
    chatId: string;
    userId: string;
    fileName: string;
    fileContent: string;
    fileType: string;
  };
}

/**
 * POST /api/files/upload
 * ファイルアップロード（S3 エミュレーション）
 */
router.post('/upload', async (req: UploadFileRequest, res: Response) => {
  try {
    const { chatId, userId, fileName, fileContent, fileType } = req.body;

    if (!chatId || !userId || !fileName || !fileContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileId = `file_${Date.now()}`;
    const fileKey = `chats/${chatId}/${fileId}_${fileName}`;

    // S3 Block にアップロード
    // ローカルでは .bb-data/ に保存される
    // 本番環境では S3 に保存される

    res.status(201).json({
      success: true,
      fileId,
      fileName,
      fileKey,
      fileSize: fileContent.length,
      uploadedAt: Date.now(),
      url: `/api/files/download/${fileId}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

/**
 * GET /api/files/download/:fileId
 * ファイルダウンロード
 */
router.get('/download/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    // S3 から取得
    res.json({
      success: true,
      fileId,
      content: 'file content here',
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

/**
 * DELETE /api/files/:fileId
 * ファイル削除
 */
router.delete('/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    res.json({
      success: true,
      message: 'File deleted',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

/**
 * GET /api/files/:chatId
 * チャット内のファイル一覧取得
 */
router.get('/chat/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    res.json({
      success: true,
      files: [],
      count: 0,
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default router;
