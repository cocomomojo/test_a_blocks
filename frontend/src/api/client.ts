/**
 * Backend API クライアント
 * Express + AWS Blocks バックエンドへのHTCP通信を管理
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `//${window.location.hostname.replace('-3000.app.github.dev', '-3001.app.github.dev')}/api`
    : 'http://localhost:3001/api'
);

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /**
   * ローカルストレージからトークンを読み込む
   */
  private loadToken(): void {
    this.token = localStorage.getItem('authToken');
  }

  /**
   * トークンを保存
   */
  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * トークンをクリア
   */
  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * HTTP リクエスト共通処理
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * ユーザー登録
   */
  async register(email: string, password: string, name: string): Promise<any> {
    return this.request('/auth/register', 'POST', { email, password, name });
  }

  /**
   * ユーザーログイン
   */
  async login(email: string, password: string): Promise<any> {
    const response: any = await this.request('/auth/login', 'POST', { email, password });
    if (response?.token) {
      this.saveToken(response.token);
    }
    return response;
  }

  /**
   * ユーザーログアウト
   */
  async logout(): Promise<any> {
    const response = await this.request('/auth/logout', 'POST');
    this.clearToken();
    return response;
  }

  /**
   * トークン検証
   */
  async verifyToken(): Promise<any> {
    return this.request('/auth/verify', 'GET');
  }

  /**
   * チャット作成
   */
  async createChat(userId: string, title: string, participants?: string[]): Promise<any> {
    return this.request('/chats', 'POST', { userId, title, participants });
  }

  /**
   * チャット一覧取得
   */
  async getChats(userId: string): Promise<any> {
    return this.request(`/chats?userId=${userId}`, 'GET');
  }

  /**
   * チャット詳細取得
   */
  async getChat(chatId: string): Promise<any> {
    return this.request(`/chats/${chatId}`, 'GET');
  }

  /**
   * チャット更新
   */
  async updateChat(chatId: string, title: string, participants?: string[]): Promise<any> {
    return this.request(`/chats/${chatId}`, 'PUT', { title, participants });
  }

  /**
   * チャット削除
   */
  async deleteChat(chatId: string): Promise<any> {
    return this.request(`/chats/${chatId}`, 'DELETE');
  }

  /**
   * メッセージ送信
   */
  async sendMessage(
    chatId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant' = 'user'
  ): Promise<any> {
    return this.request('/messages', 'POST', { chatId, userId, content, role });
  }

  /**
   * メッセージ一覧取得
   */
  async getMessages(
    chatId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any> {
    return this.request(`/messages?chatId=${chatId}&limit=${limit}&offset=${offset}`, 'GET');
  }

  /**
   * メッセージ詳細取得
   */
  async getMessage(messageId: string): Promise<any> {
    return this.request(`/messages/${messageId}`, 'GET');
  }

  /**
   * メッセージ編集
   */
  async updateMessage(messageId: string, content: string): Promise<any> {
    return this.request(`/messages/${messageId}`, 'PUT', { content });
  }

  /**
   * メッセージ削除
   */
  async deleteMessage(messageId: string): Promise<any> {
    return this.request(`/messages/${messageId}`, 'DELETE');
  }

  /**
   * ファイルアップロード
   */
  async uploadFile(
    chatId: string,
    userId: string,
    fileName: string,
    fileContent: string,
    fileType: string
  ): Promise<any> {
    return this.request('/files/upload', 'POST', {
      chatId,
      userId,
      fileName,
      fileContent,
      fileType,
    });
  }

  /**
   * ファイルダウンロード
   */
  async downloadFile(fileId: string): Promise<any> {
    return this.request(`/files/download/${fileId}`, 'GET');
  }

  /**
   * ファイル削除
   */
  async deleteFile(fileId: string): Promise<any> {
    return this.request(`/files/${fileId}`, 'DELETE');
  }

  /**
   * チャット内のファイル一覧取得
   */
  async getFiles(chatId: string): Promise<any> {
    return this.request(`/files/chat/${chatId}`, 'GET');
  }

  /**
   * AI レスポンス生成
   */
  async generateAIResponse(
    chatId: string,
    userId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<any> {
    return this.request('/ai/generate', 'POST', { chatId, userId, messages });
  }

  /**
   * AI レスポンス ストリーミング生成
   */
  async streamAIResponse(
    chatId: string,
    userId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.baseUrl}/ai/stream`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ chatId, userId, messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.body!;
  }

  /**
   * 利用可能な AI モデル一覧取得
   */
  async getAIModels(): Promise<any> {
    return this.request('/ai/models', 'GET');
  }

  /**
   * メール送信
   */
  async sendEmail(to: string, subject: string, body: string, chatId?: string): Promise<any> {
    return this.request('/email/send', 'POST', { to, subject, body, chatId });
  }

  /**
   * メール送信ステータス確認
   */
  async getEmailStatus(emailId: string): Promise<any> {
    return this.request(`/email/status/${emailId}`, 'GET');
  }

  /**
   * ユーザー通知メール送信
   */
  async notifyUser(to: string, chatId?: string): Promise<any> {
    return this.request('/email/notify-user', 'POST', { to, chatId });
  }

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<any> {
    return this.request('/health', 'GET');
  }
}

export default new ApiClient();
