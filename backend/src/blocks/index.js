"use strict";
// AWS Blocks リソース定義
// ローカル実行時はメモリ/ファイルシステム上でエミュレート
// 本番環境では自動的に DynamoDB/S3/Cognito/Bedrock に切り替わる
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiModel = exports.auth = exports.fileStorage = exports.sessionTable = exports.userTable = exports.chatTable = void 0;
var bb_distributed_table_1 = require("../aws-blocks/bb-distributed-table");
var bb_storage_1 = require("../aws-blocks/bb-storage");
var bb_auth_1 = require("../aws-blocks/bb-auth");
var bb_ai_1 = require("../aws-blocks/bb-ai");
/**
 * チャット履歴とメッセージを管理するテーブル
 */
exports.chatTable = new bb_distributed_table_1.DistributedTable({
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
exports.userTable = new bb_distributed_table_1.DistributedTable({
    name: 'Users',
    partitionKey: {
        name: 'userId',
        type: 'string',
    },
});
/**
 * ユーザーセッションテーブル
 */
exports.sessionTable = new bb_distributed_table_1.DistributedTable({
    name: 'Sessions',
    partitionKey: {
        name: 'sessionId',
        type: 'string',
    },
});
/**
 * ファイルアップロード用ストレージ（S3 相当）
 */
exports.fileStorage = new bb_storage_1.Storage({
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
exports.auth = new bb_auth_1.Auth({
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
exports.aiModel = new bb_ai_1.AI({
    name: 'ChatBotAI',
    modelType: 'text-generation',
    temperature: 0.7,
    maxTokens: 512,
});
