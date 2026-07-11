/**
 * AWS Blocks リソース定義
 * 
 * 環境変数 `USE_AWS_BLOCKS_EMULATION` で動作モードを切り替え：
 * - true (デフォルト): ローカルエミュレーション（メモリ/ファイルシステム）を使用
 * - false: 本番環境ではDynamoDB/S3/Cognito/Bedrockに自動切り替え
 * 
 * E2E環境での使用例：
 * USE_AWS_BLOCKS_EMULATION=true npm run test:e2e
 */

import { DistributedTable } from '../aws-blocks/bb-distributed-table';
import { Storage } from '../aws-blocks/bb-storage';
import { Auth } from '../aws-blocks/bb-auth';
import { AI } from '../aws-blocks/bb-ai';

// 環境変数で aws-blocks エミュレーションの使用を制御
const USE_AWS_BLOCKS_EMULATION = process.env.USE_AWS_BLOCKS_EMULATION !== 'false';

if (USE_AWS_BLOCKS_EMULATION) {
  console.log('[AWS Blocks] Using LOCAL EMULATION mode');
} else {
  console.log('[AWS Blocks] Using PRODUCTION AWS SERVICES mode');
}

/**
 * チャット履歴とメッセージを管理するテーブル
 * - E2E環境: メモリ上のMapでエミュレート
 * - 本番環境: DynamoDB に接続
 */
export const chatTable = new DistributedTable({
  name: 'ChatMessages',
  partitionKey: {
    name: 'chatId',
    type: 'string',
  },
  sortKey: {
    name: 'timestamp',
    type: 'number',
  },
});

/**
 * ユーザー情報テーブル
 * - E2E環境: メモリ上のMapでエミュレート
 * - 本番環境: DynamoDB に接続
 */
export const userTable = new DistributedTable({
  name: 'Users',
  partitionKey: {
    name: 'userId',
    type: 'string',
  },
});

/**
 * ユーザーセッションテーブル
 * - E2E環境: メモリ上のMapでエミュレート
 * - 本番環境: DynamoDB に接続
 */
export const sessionTable = new DistributedTable({
  name: 'Sessions',
  partitionKey: {
    name: 'sessionId',
    type: 'string',
  },
});

/**
 * ファイルアップロード用ストレージ（S3 相当）
 * - E2E環境: メモリ上のMapでエミュレート
 * - 本番環境: Amazon S3 に接続
 */
export const fileStorage = new Storage({
  name: 'ChatFiles',
  corsConfiguration: {
    allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
    allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['*'],
  },
});

/**
 * 認証機能（Cognito 相当）
 * - E2E環境: モック実装で固定トークン生成
 * - 本番環境: Amazon Cognito に接続
 */
export const auth = new Auth({
  name: 'ChatBotAuth',
  passwordPolicy: {
    minimumLength: 8,
    requireNumbers: true,
    requireSpecialCharacters: false,
    requireUppercase: true,
    requireLowercase: true,
  },
});

/**
 * AI/Bedrock 相当（LLM レスポンス生成）
 * - E2E環境: モック応答を返す
 * - 本番環境: Amazon Bedrock に接続して実際のLLMモデルを使用
 */
export const aiModel = new AI({
  name: 'ChatBotAI',
  modelType: 'text-generation',
  temperature: 0.7,
  maxTokens: 512,
});

// エミュレーション状態をエクスポート（デバッグ用）
export const getBlocksMode = () => ({
  isEmulation: USE_AWS_BLOCKS_EMULATION,
  description: USE_AWS_BLOCKS_EMULATION ? 'ローカルエミュレーション' : '本番AWS環境',
});
