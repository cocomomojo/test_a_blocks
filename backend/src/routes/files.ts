import { Router, Request, Response } from 'express';
import { fileStorage } from '../blocks/index.js';

const router = Router();
const uploadedFiles = new Map<string, { fileKey: string; fileName: string; chatId: string; fileType: string }>();

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

    // Storage Block を使って保存（S3 相当）
    await fileStorage.put(fileKey, fileContent);
    uploadedFiles.set(fileId, { fileKey, fileName, chatId, fileType });

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

    const meta = uploadedFiles.get(fileId);

    if (!meta) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = await fileStorage.get(meta.fileKey);

    if (!content) {
      return res.status(404).json({ error: 'File content not found' });
    }

    res.json({
      success: true,
      fileId,
      fileName: meta.fileName,
      fileType: meta.fileType,
      content: content.toString('utf-8'),
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

    const meta = uploadedFiles.get(fileId);
    if (meta) {
      await fileStorage.delete(meta.fileKey);
      uploadedFiles.delete(fileId);
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

    const files = Array.from(uploadedFiles.entries())
      .filter(([, meta]) => meta.chatId === chatId)
      .map(([fileId, meta]) => ({
        fileId,
        fileName: meta.fileName,
        fileType: meta.fileType,
        url: `/api/files/download/${fileId}`,
      }));

    res.json({
      success: true,
      files,
      count: files.length,
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default router;
