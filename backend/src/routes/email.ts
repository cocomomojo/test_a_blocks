import { Router, Request, Response } from 'express';

const router = Router();

interface SendEmailRequest extends Request {
  body: {
    to: string;
    subject: string;
    body: string;
    chatId?: string;
  };
}

/**
 * POST /api/email/send
 * メール送信（SES エミュレーション）
 */
router.post('/send', async (req: SendEmailRequest, res: Response) => {
  try {
    const { to, subject, body, chatId } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailId = `email_${Date.now()}`;

    // ローカルエミュレーションでは、メール送信ログをコンソールに出力
    // 本番環境では SES に統合
    console.log(`
[EMAIL NOTIFICATION]
ID: ${emailId}
To: ${to}
Subject: ${subject}
Body: ${body}
Chat ID: ${chatId || 'N/A'}
Sent at: ${new Date().toISOString()}
    `);

    res.json({
      success: true,
      emailId,
      to,
      subject,
      status: 'sent',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

/**
 * GET /api/email/status/:emailId
 * メール送信ステータス確認
 */
router.get('/status/:emailId', async (req: Request, res: Response) => {
  try {
    const { emailId } = req.params;

    if (!emailId) {
      return res.status(400).json({ error: 'emailId is required' });
    }

    res.json({
      success: true,
      emailId,
      status: 'delivered',
      deliveredAt: Date.now(),
    });
  } catch (error) {
    console.error('Get email status error:', error);
    res.status(500).json({ error: 'Failed to get email status' });
  }
});

/**
 * POST /api/email/notify-user
 * ユーザー通知メール送信
 * （新規メッセージ、新規返信など）
 */
router.post('/notify-user', async (req: SendEmailRequest, res: Response) => {
  try {
    const { to, chatId } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailId = `email_${Date.now()}`;
    const notificationSubject = `New message in chat${chatId ? ` ${chatId}` : ''}`;
    const notificationBody = `You have received a new message. Check your chat for details.`;

    console.log(`
[EMAIL NOTIFICATION - USER UPDATE]
ID: ${emailId}
To: ${to}
Subject: ${notificationSubject}
Body: ${notificationBody}
Sent at: ${new Date().toISOString()}
    `);

    res.json({
      success: true,
      emailId,
      to,
      type: 'user-notification',
      status: 'sent',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
