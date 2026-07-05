# test_a_blocks

AWS Blocks を使用したチャットボット E2E テストシステム

## 概要

**GitHub Actions 上でAWSサービスをエミュレートし、完全なE2Eテストを実行するシステム**

このプロジェクトは、AWS Blocks（ローカルエミュレーション機能）を活用して、本番のAWSアカウント不要でGitHub Actions上でE2Eテストを実行します。

### 特徴

- ✅ **AWS アカウント不要**: ローカルエミュレーション機能により、GitHub Actions 上でも AWS を模倣
- ✅ **同一コードでデプロイ可能**: ローカルテスト後、同じコードで本番 AWS にデプロイ可能
- ✅ **複数 AWS サービス対応**: DynamoDB、S3、Cognito、Bedrock、Lambda、SES
- ✅ **自動 CI/CD**: GitHub Actions で自動実行、テスト結果をアーティファクトとして保存

---

## プロジェクト構成

```
test_a_blocks/
├── backend/                    # Express + AWS Blocks SDK
│   ├── src/
│   │   ├── blocks/            # AWS Blocks リソース定義
│   │   │   └── index.ts       # DynamoDB, S3, Cognito, Bedrock, SES
│   │   ├── routes/            # API エンドポイント
│   │   │   ├── auth.ts        # 認証 (Cognito emulate)
│   │   │   ├── chats.ts       # チャット管理 (DynamoDB emulate)
│   │   │   ├── messages.ts    # メッセージ CRUD
│   │   │   ├── files.ts       # ファイル管理 (S3 emulate)
│   │   │   ├── ai.ts          # AI 応答生成 (Bedrock emulate)
│   │   │   └── email.ts       # メール送信 (SES emulate)
│   │   └── index.ts           # Express サーバーメイン
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts      # Backend API クライアント
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx  # 認証ページ
│   │   │   └── ChatPage.tsx   # チャット画面
│   │   ├── components/
│   │   │   └── FileUpload.tsx # ファイルアップロード
│   │   ├── styles/
│   │   │   ├── auth.css       # 認証ページスタイル
│   │   │   └── chat.css       # チャット画面スタイル
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
├── e2e/                        # Playwright E2E テスト
│   ├── auth.spec.ts           # 認証フローテスト
│   ├── chat.spec.ts           # チャット機能テスト
│   ├── file-upload.spec.ts    # ファイルアップロードテスト
│   └── ai-response.spec.ts    # AI応答生成テスト
├── .github/
│   └── workflows/
│       └── e2e.yml            # GitHub Actions ワークフロー
├── playwright.config.ts       # Playwright 設定
├── tsconfig.json              # ルート TypeScript 設定
├── package.json               # ルート package.json
└── README.md                  # このファイル
```

---

## 技術スタック

| レイヤー | 技術 | 用途 |
|---------|------|------|
| **Frontend** | React 18.2 + Vite | UI フレームワーク |
| **Backend** | Express.js + AWS Blocks SDK | API サーバー + AWS リソース定義 |
| **E2E Test** | Playwright | ブラウザ自動テスト |
| **認証** | AWS Blocks / Cognito | ユーザー認証 |
| **DB** | AWS Blocks / DynamoDB | チャット履歴、ユーザー情報 |
| **ストレージ** | AWS Blocks / S3 | ファイル保存 |
| **AI** | AWS Blocks / Bedrock | AI 応答生成（ローカルは簡易実装） |
| **通知** | AWS Blocks / SES | メール送信 |
| **CI/CD** | GitHub Actions | 自動テスト実行 |

---

## エミュレートされる AWS サービス

### 1. **DynamoDB** (分散テーブル)
- **用途**: チャット履歴、ユーザー情報、セッション管理
- **ローカル実装**: ファイルシステム (`.bb-data/`) に JSON で保存
- **本番**: DynamoDB に自動切り替わり

### 2. **S3** (オブジェクトストレージ)
- **用途**: チャット内のファイルアップロード
- **ローカル実装**: ファイルシステムに保存
- **本番**: S3 に自動切り替わり

### 3. **Cognito** (ユーザー認証)
- **用途**: ログイン・登録
- **ローカル実装**: インメモリ認証トークン管理
- **本番**: Cognito に自動切り替わり

### 4. **Bedrock** (生成AI)
- **用途**: チャットボットの AI 応答生成
- **ローカル実装**: 固定テキストレスポンス（簡易実装）
- **本番**: Bedrock LLM に自動切り替わり

### 5. **SES** (メール送信)
- **用途**: ユーザー通知メール
- **ローカル実装**: コンソールログに出力
- **本番**: SES に自動切り替わり

### 6. **Lambda** (サーバーレスコンピュート)
- **用途**: 非同期処理トリガー
- **ローカル実装**: Node.js 内部で実行
- **本番**: Lambda に自動切り替わり

---

## セットアップ

### 前提条件
- Node.js 18.x 以上
- npm 9.x 以上

### インストール

```bash
# ルート依存インストール
npm install

# Backend 依存インストール
cd backend && npm install

# Frontend 依存インストール
cd frontend && npm install

# Playwright ブラウザインストール
cd .. && npx playwright install
```

---

## 実行方法

### ローカルでの開発実行

#### 1. **Backend 起動** (ターミナル 1)
```bash
npm run start:backend:local
# または
cd backend && npm run dev
```

出力例:
```
╔════════════════════════════════════════╗
║  AWS Blocks Chatbot Backend            ║
║  Express Server Listening              ║
╚════════════════════════════════════════╝

Environment: development
Port: 3001
Base URL: http://localhost:3001

Endpoints:
  - /api/auth      (Authentication)
  - /api/chats     (Chat Management)
  - /api/messages  (Message Handling)
  - /api/files     (File Upload/Storage)
  - /api/ai        (AI Response Generation)
  - /api/email     (Email Notifications)
```

#### 2. **Frontend 起動** (ターミナル 2)
```bash
cd frontend && npm run dev
# アクセス: http://localhost:3000
```

#### 3. **E2E テスト実行** (Chrome のみ)
```bash
# 全テスト実行 (Chrome)
npm run test:e2e

# UI モードで実行（テストの様子を動画で確認）
npm run test:e2e:ui

# デバッグモード
npm run test:e2e:debug
```

### ワンコマンドで全体起動

```bash
# Backend + Frontend を同時起動
npm run dev:all

# 別ターミナルで E2E テスト実行
npm run test:e2e
```

---

## GitHub Actions ワークフロー

### 自動実行条件
- `main` ブランチへの Push
- `develop` ブランチへの Push
- Pull Request (main, develop 対象)

### ワークフロー内容

`.github/workflows/e2e.yml` で以下を実行：

1. **Node.js セットアップ** (18.x, 20.x で複数実行)
2. **依存インストール**
3. **Playwright ブラウザインストール** (Chrome のみ)
4. **E2E テスト実行** (Chrome のみ)
5. **テスト結果をアーティファクトとして保存**

### テスト結果確認

GitHub Actions > Workflows > E2E Tests で実行履歴を確認：
- 📊 **Playwright Report**: HTML レポート、ビデオ、スクリーンショット
- 📝 **Test Results**: JSON フォーマットのテスト結果

---

## API エンドポイント

### 認証 API

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/auth/register` | ユーザー登録 |
| POST | `/api/auth/login` | ユーザーログイン |
| POST | `/api/auth/logout` | ログアウト |
| GET | `/api/auth/verify` | トークン検証 |

### チャット管理 API

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/chats` | 新規チャット作成 |
| GET | `/api/chats` | チャット一覧取得 |
| GET | `/api/chats/:chatId` | チャット詳細取得 |
| PUT | `/api/chats/:chatId` | チャット更新 |
| DELETE | `/api/chats/:chatId` | チャット削除 |

### メッセージ API

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/messages` | メッセージ送信 |
| GET | `/api/messages` | メッセージ一覧取得 |
| PUT | `/api/messages/:messageId` | メッセージ編集 |
| DELETE | `/api/messages/:messageId` | メッセージ削除 |

### ファイル API (S3 Emulation)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/files/upload` | ファイルアップロード |
| GET | `/api/files/download/:fileId` | ファイルダウンロード |
| DELETE | `/api/files/:fileId` | ファイル削除 |
| GET | `/api/files/chat/:chatId` | チャット内ファイル一覧 |

### AI API (Bedrock Emulation)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/ai/generate` | AI レスポンス生成 |
| POST | `/api/ai/stream` | AI レスポンス ストリーミング |
| GET | `/api/ai/models` | 利用可能モデル一覧 |

### メール API (SES Emulation)

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/email/send` | メール送信 |
| GET | `/api/email/status/:emailId` | メール送信ステータス確認 |
| POST | `/api/email/notify-user` | ユーザー通知メール送信 |

---

## E2E テストシナリオ

### 1. **auth.spec.ts** - 認証フローテスト
- ✅ ログインページ表示
- ✅ エラーハンドリング（必須項目チェック）
- ✅ ユーザー登録フロー
- ✅ ログインフロー
- ✅ トークン保存 (localStorage)
- ✅ ログアウトフロー

### 2. **chat.spec.ts** - チャット機能テスト
- ✅ チャット画面表示
- ✅ メッセージ送受信
- ✅ 複数メッセージハンドリング
- ✅ タイムスタンプ表示
- ✅ ローディング状態
- ✅ AI 応答受信

### 3. **file-upload.spec.ts** - ファイルアップロードテスト
- ✅ ファイルアップロードボタン表示
- ✅ ファイルアップロード実行
- ✅ 複数ファイル対応
- ✅ 異なるファイル形式対応 (PNG, PDF, JSON)
- ✅ アップロード後の表示確認

### 4. **ai-response.spec.ts** - AI 応答生成テスト
- ✅ AI レスポンス生成
- ✅ ローディング状態表示
- ✅ コンテキスト保持（会話履歴）
- ✅ グリーティング応答
- ✅ メッセージ履歴管理
- ✅ レスポンス表示

---

## トラブルシューティング

### Issue: Backend 起動時に `port 3001 is already in use`

```bash
# ポート確認
lsof -i :3001

# プロセス終了
kill -9 <PID>

# または別ポートで起動
PORT=3002 npm run start:backend:local
```

### Issue: Playwright テスト失敗

```bash
# ブラウザ再インストール
npx playwright install --with-deps

# UI モードでデバッグ
npm run test:e2e:ui
```

### Issue: AWS Blocks モジュールが見つからない

AWS Blocks はまだパブリックプレビュー段階です。以下を確認：
- AWS 公式ドキュメント: https://aws.amazon.com/jp/
- Zenn: https://zenn.dev/aws_japan/articles/aws-blocks-ai-agent-intro

実装時に AWS Blocks が利用可能になったら、`package.json` の `optionalDependencies` を `dependencies` に移動してください。

---

## ライセンス

MIT

---

## 参考資料

- [AWS Blocks - Zenn (日本語)](https://zenn.dev/aws_japan/articles/aws-blocks-ai-agent-intro)
- [Playwright Documentation](https://playwright.dev/)
- [Express.js](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite](https://vitejs.dev/)
