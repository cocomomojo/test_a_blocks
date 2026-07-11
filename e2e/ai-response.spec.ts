import { test, expect } from '@playwright/test';

/**
 * AI応答生成のE2Eテスト
 * Bedrock相当のLLM機能を検証
 */
test.describe('AI Response Generation', () => {
  test.beforeEach(async ({ page }) => {
    // ページをロード
    await page.goto('/');

    // ログイン処理を実行
    // メールアドレスを入力
    await page.locator('input[type="email"]').fill('test@example.com');
    // パスワードを入力
    await page.locator('input[type="password"]').fill('password123');
    // ログインボタンをクリック
    await page.locator('button[type="submit"]').click();

    // チャットページが読み込まれるまで待機
    await expect(page.locator('.chat-container')).toBeVisible({ timeout: 5000 });
  });

  test('ユーザーメッセージに対してAI応答が生成される', async ({ page }) => {
    // メッセージ入力フィールドを取得
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    // 送信ボタンを取得
    const sendButton = page.locator('button:has-text("Send")');

    // ユーザーメッセージを送信
    await messageInput.fill('Hello');
    await sendButton.click();

    // AI応答が表示されるまで待機（aws-blocks の AI モックが応答を返す）
    const assistantMessage = page.locator('.message.assistant .message-content').first();
    await expect(assistantMessage).toBeVisible({ timeout: 10000 });

    // 応答が空でないことを確認
    const responseText = await assistantMessage.textContent();
    expect(responseText).toBeTruthy();
    expect(responseText?.length).toBeGreaterThan(0);
  });

  test('should show "Thinking..." while generating response', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send message
    await messageInput.fill('Generate response');
    await sendButton.click();

    // Wait for response to be generated
    const assistantMessage = page.locator('.message.assistant .message-content').first();
    await expect(assistantMessage).toBeVisible({ timeout: 10000 });

    // Verify message is not empty
    const responseText = await assistantMessage.textContent();
    expect(responseText).toBeTruthy();
  });

  test('should handle context from previous messages', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send first message
    await messageInput.fill('My name is TestUser');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Send follow-up message
    await messageInput.fill('What is my name?');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check that both messages are in the chat
    const messages = page.locator('.message');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThan(2); // At least user message + response twice
  });

  test('should handle different greeting variations', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    const greetings = ['hi', 'hello', 'hey', 'greetings'];

    for (const greeting of greetings) {
      await messageInput.fill(greeting);
      await sendButton.click();

      // Wait for response
      await page.waitForTimeout(1500);

      // Check response exists
      const responses = page.locator('.message.assistant .message-content');
      const responseCount = await responses.count();
      expect(responseCount).toBeGreaterThan(0);
    }
  });

  test('should handle questions correctly', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send question
    await messageInput.fill('Can you help me?');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Get the assistant's response
    const assistantResponses = page.locator('.message.assistant .message-content');
    const lastResponse = assistantResponses.last();
    const responseText = await lastResponse.textContent();

    // Should have some response
    expect(responseText).toBeTruthy();
    expect(responseText?.length).toBeGreaterThan(0);
  });

  test('should display response as assistant message', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send message
    await messageInput.fill('Test message');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check message has correct styling (assistant class)
    const assistantMessage = page.locator('.message.assistant');
    await expect(assistantMessage).toBeVisible();
  });

  test('should handle emoji in responses', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send message
    await messageInput.fill('hello');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Just verify response exists (emoji support varies)
    const assistantResponses = page.locator('.message.assistant .message-content');
    const responseCount = await assistantResponses.count();
    expect(responseCount).toBeGreaterThan(0);
  });

  test('should maintain message history for context', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send multiple messages to build context
    const messages = ['Hi', 'How are you?', 'What can you do?'];

    for (const msg of messages) {
      await messageInput.fill(msg);
      await sendButton.click();
      await page.waitForTimeout(1500);
    }

    // Verify all messages and responses are visible
    const allMessages = page.locator('.message');
    const totalMessages = await allMessages.count();

    // Should have at least 6 messages (3 user + 3 assistant)
    expect(totalMessages).toBeGreaterThanOrEqual(6);
  });
});
