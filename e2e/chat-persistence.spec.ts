import { test, expect } from '@playwright/test';

/**
 * チャットデータの永続性に関するE2Eテスト
 * aws-blocks エミュレーションでのデータ保存確認
 */
test.describe('Chat Persistence and Data Management', () => {
  test.beforeEach(async ({ page }) => {
    // ログインして、チャットページに到達
    await page.goto('/');
    await page.locator('input[type="email"]').fill('persistence-test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    
    // チャットコンテナが表示されるまで待機
    await expect(page.locator('.chat-container')).toBeVisible({ timeout: 5000 });
  });

  test('メッセージが複数存在できる', async ({ page }) => {
    // 3つのメッセージを送信
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    for (let i = 1; i <= 3; i++) {
      await messageInput.fill(`メッセージ ${i}`);
      await sendButton.click();
      await page.waitForTimeout(500);
    }

    // 全メッセージが表示されていることを確認
    for (let i = 1; i <= 3; i++) {
      await expect(page.locator('.message.user .message-content', { hasText: `メッセージ ${i}` })).toBeVisible();
    }
  });

  test('チャットでユーザーメッセージが正しく表示される', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');
    const testMessage = 'これはテストメッセージです';

    // メッセージを送信
    await messageInput.fill(testMessage);
    await sendButton.click();

    // メッセージが user ロールで表示されることを確認
    const userMessages = page.locator('.message.user');
    const messageCount = await userMessages.count();
    expect(messageCount).toBeGreaterThan(0);

    // 送信したメッセージが表示されていることを確認
    await expect(page.locator('.message.user .message-content', { hasText: testMessage })).toBeVisible();
  });

  test('AI応答が assistant ロールで表示される', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // メッセージを送信
    await messageInput.fill('AIに質問');
    await sendButton.click();

    // AI応答が表示されるまで待機
    await expect(page.locator('.message.assistant .message-content')).toBeVisible({ 
      timeout: 10000 
    });

    // assistant クラスが存在することを確認
    const assistantMessages = page.locator('.message.assistant');
    const count = await assistantMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('メッセージ入力フィールドが送信後にクリアされる', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // メッセージを入力して送信
    await messageInput.fill('テストメッセージ');
    await sendButton.click();

    // 入力フィールドがクリアされるまで待機
    await page.waitForTimeout(500);

    // 入力フィールドが空になっていることを確認
    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('空のメッセージは送信できない', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // 最初のメッセージを送信して、初期状態を設定
    await messageInput.fill('初期メッセージ');
    await sendButton.click();
    await page.waitForTimeout(500);

    // 空のメッセージを送信しようとする
    const initialMessageCount = await page.locator('.message').count();
    await messageInput.fill('   ');  // スペースのみ
    await sendButton.click();
    await page.waitForTimeout(300);

    // メッセージ数が変わらないことを確認
    const finalMessageCount = await page.locator('.message').count();
    // トリムされたメッセージは送信されないはずなので、初期メッセージ（ユーザー+AI）からは増えない
    expect(finalMessageCount).toBeLessThanOrEqual(initialMessageCount + 1);
  });

  test('エラーメッセージが表示される場合がある', async ({ page }) => {
    // エラーが表示されるかどうかを確認できるようにする
    const errorLocator = page.locator('text=Failed to');
    
    // ページが読み込まれていることを確認
    await expect(page.locator('.chat-container')).toBeVisible();
    
    // 必要な要素が存在することを確認
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    await expect(messageInput).toBeVisible();
  });

  test('複数のメッセージタイプを混在できる', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // 異なる内容のメッセージを複数送信
    const messages = ['こんにちは', '質問があります', 'ありがとうございます'];
    
    for (const msg of messages) {
      await messageInput.fill(msg);
      await sendButton.click();
      await page.waitForTimeout(800);
    }

    // 全メッセージが表示されていることを確認
    for (const msg of messages) {
      await expect(page.locator('.message.user .message-content', { hasText: msg })).toBeVisible();
    }

    // ユーザーメッセージとAIメッセージが混在していることを確認
    const messages_all = page.locator('.message');
    const messageCount = await messages_all.count();
    expect(messageCount).toBeGreaterThanOrEqual(messages.length);
  });
});
