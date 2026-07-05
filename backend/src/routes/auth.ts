import { Router, Request, Response } from 'express';
import { auth, userTable, sessionTable } from '../blocks/index.js';

const router = Router();

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

/**
 * POST /api/auth/register
 * ユーザー登録（Cognito エミュレーション）
 */
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Auth Block を経由してユーザー登録（Cognito 相当）
    const { userId } = await auth.signUp(email, password);

    await userTable.put({
      userId,
      email,
      name,
      createdAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      userId,
      email,
      name,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * ユーザーログイン（認証情報を返す）
 */
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Auth Block を経由して認証（Cognito 相当）
    const { token } = await auth.signIn(email, password);
    const sessionId = `session_${Date.now()}`;

    await sessionTable.put({
      sessionId,
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      token,
      sessionId,
      email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * ログアウト
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await auth.signOut(token);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /api/auth/verify
 * トークン検証
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const verified = await auth.verifyToken(token);

    if (!verified) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      valid: true,
      userId: verified.userId,
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
