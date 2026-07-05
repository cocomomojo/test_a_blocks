// AWS Blocks リソース定義
// ローカル実行時はメモリ/ファイルシステム上でエミュレート
// 本番環境では自動的に DynamoDB/S3/Cognito/Bedrock に切り替わる

import { DistributedTable } from '../aws-blocks/bb-distributed-table';
import { Storage } from '../aws-blocks/bb-storage';
import { Auth } from '../aws-blocks/bb-auth';
import { AI } from '../aws-blocks/bb-ai';

/**
 * チャット履歴とメッセージを管理するテーブル
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
 */
export const aiModel = new AI({
  name: 'ChatBotAI',
  modelType: 'text-generation',
  temperature: 0.7,
  maxTokens: 512,
});
