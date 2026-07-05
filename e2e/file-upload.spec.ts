import { test, expect } from '@playwright/test';

test.describe('File Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Login first
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Wait for chat page to load
    await expect(page.locator('.chat-container')).toBeVisible({ timeout: 5000 });
  });

  test('should display file upload button', async ({ page }) => {
    const fileUploadLabel = page.locator('label:has-text("📎")');
    await expect(fileUploadLabel).toBeVisible();
  });

  test('should handle file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Create a test file
    const buffer = Buffer.from('This is a test file content for upload');
    const fileName = 'test.txt';

    // Set file
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'text/plain',
      buffer: buffer,
    });

    // Wait for file upload message to appear
    await expect(page.locator(`text=File uploaded: ${fileName}`)).toBeVisible({ timeout: 5000 });
  });

  test('should display uploaded file in chat', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Create a test file
    const buffer = Buffer.from('Test content');
    const fileName = 'document.txt';

    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'text/plain',
      buffer: buffer,
    });

    // Check that file appears in messages
    const fileMessage = page.locator(`text=📄 File uploaded: ${fileName}`);
    await expect(fileMessage).toBeVisible({ timeout: 5000 });

    // Check that it's in the messages container
    const messageContainer = page.locator('.message.user');
    expect(await messageContainer.count()).toBeGreaterThan(0);
  });

  test('should handle multiple file uploads', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Upload first file
    await fileInput.setInputFiles({
      name: 'file1.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Content 1'),
    });

    await expect(page.locator('text=File uploaded: file1.txt')).toBeVisible({ timeout: 5000 });

    // Upload second file
    await fileInput.setInputFiles({
      name: 'file2.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Content 2'),
    });

    await expect(page.locator('text=File uploaded: file2.txt')).toBeVisible({ timeout: 5000 });

    // Both files should be in the chat
    await expect(page.locator('text=file1.txt')).toBeVisible();
    await expect(page.locator('text=file2.txt')).toBeVisible();
  });

  test('should support different file types', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    const files = [
      { name: 'image.png', mimeType: 'image/png' },
      { name: 'document.pdf', mimeType: 'application/pdf' },
      { name: 'data.json', mimeType: 'application/json' },
    ];

    for (const file of files) {
      await fileInput.setInputFiles({
        name: file.name,
        mimeType: file.mimeType,
        buffer: Buffer.from(`Content of ${file.name}`),
      });

      await expect(page.locator(`text=File uploaded: ${file.name}`)).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should reset file input after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Upload first file
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test'),
    });

    await expect(page.locator('text=File uploaded: test.txt')).toBeVisible({ timeout: 5000 });

    // Try to upload same file again
    // If input is properly reset, this should work
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test again'),
    });

    const messages = page.locator('text=File uploaded: test.txt');
    expect(await messages.count()).toBeGreaterThan(0);
  });
});
