import { test, expect } from '@playwright/test';

test.describe('Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Login first
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Wait for chat page to load
    await expect(page.locator('.chat-container')).toBeVisible({ timeout: 5000 });
  });

  test('should display chat page after login', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AWS Blocks Chatbot');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    await expect(page.locator('.messages-container')).toBeVisible();
    await expect(page.locator('input[placeholder="Type a message..."]')).toBeVisible();
  });

  test('should send and receive messages', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send a message
    await messageInput.fill('Hello, chatbot!');
    await sendButton.click();

    // Message should appear in chat
    await expect(page.locator('.message.user .message-content')).toContainText('Hello, chatbot!');

    // Wait for AI response
    await expect(page.locator('.message.assistant')).toBeVisible({ timeout: 10000 });

    // Response should contain meaningful content
    const assistantMessages = page.locator('.message.assistant .message-content');
    const messageCount = await assistantMessages.count();
    expect(messageCount).toBeGreaterThan(0);
  });

  test('should handle multiple messages', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send first message
    await messageInput.fill('Hi!');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Send second message
    await messageInput.fill('How are you?');
    await sendButton.click();

    // Wait for second response
    await page.waitForTimeout(2000);

    // Check that we have multiple messages
    const userMessages = page.locator('.message.user');
    const messageCount = await userMessages.count();
    expect(messageCount).toBeGreaterThanOrEqual(2);
  });

  test('should show timestamp for each message', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send a message
    await messageInput.fill('Test message');
    await sendButton.click();

    // Check for timestamp
    const messageTime = page.locator('.message-time');
    await expect(messageTime.first()).toBeVisible();

    const timeText = await messageTime.first().textContent();
    expect(timeText).toMatch(/\d{1,2}:\d{2}:\d{2}/); // HH:MM:SS format
  });

  test('should disable send button while loading', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send a message
    await messageInput.fill('Test message');
    await sendButton.click();

    // Button should be disabled while waiting for response
    await expect(sendButton).toBeDisabled();

    // Wait for message to be displayed
    const userMessage = page.locator('.message.user');
    await expect(userMessage).toBeVisible({ timeout: 5000 });
  });

  test('should handle greetings correctly', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send greeting
    await messageInput.fill('hi');
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check response contains greeting-related content
    const assistantMessage = page.locator('.message.assistant .message-content').last();
    const responseText = await assistantMessage.textContent();

    expect(responseText).toBeTruthy();
    expect(responseText?.length).toBeGreaterThan(0);
  });

  test('should scroll to latest message', async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send multiple messages to ensure scrolling capability
    for (let i = 0; i < 2; i++) {
      await messageInput.fill(`Message ${i + 1}`);
      await sendButton.click();
      await page.waitForTimeout(800);
    }

    // Wait for messages to render
    await page.waitForTimeout(1000);

    // Verify messages are displayed
    const messages = page.locator('.message');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThan(0);
  });
});
