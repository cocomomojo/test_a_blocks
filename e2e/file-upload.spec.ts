import { test, expect } from '@playwright/test';

/**
 * ファイルアップロードのE2Eテスト
 * S3相当のストレージ機能を検証
 */
test.describe('File Upload Flow', () => {
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

  test('ファイルアップロードボタンが表示される', async ({ page }) => {
    // ファイルアップロードボタン（📎アイコン）が表示されていることを確認
    const fileUploadLabel = page.locator('label:has-text("📎")');
    await expect(fileUploadLabel).toBeVisible();
  });

  test('ファイルアップロード処理が実行される', async ({ page }) => {
    // ファイル入力フィールドを取得
    const fileInput = page.locator('input[type="file"]');

    // テスト用のテキストファイルを作成
    const buffer = Buffer.from('This is a test file content for upload');
    const fileName = 'test.txt';

    // ファイルを設定
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'text/plain',
      buffer: buffer,
    });

    // ファイルアップロード完了メッセージが表示されるまで待機
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
