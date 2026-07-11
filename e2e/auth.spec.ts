import { test, expect } from '@playwright/test';

/**
 * 認証フローのE2Eテスト
 * Cognito相当の認証機能を検証
 */
test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // ログインページに遷移
    await page.goto('/');
  });

  test('ログインページが表示される', async ({ page }) => {
    // タイトルが表示されていることを確認
    await expect(page.locator('h1')).toContainText('AWS Blocks Chatbot');
    // メールアドレス入力フィールドが表示されていることを確認
    await expect(page.locator('label:has-text("Email:")')).toBeVisible();
    // パスワード入力フィールドが表示されていることを確認
    await expect(page.locator('label:has-text("Password:")')).toBeVisible();
  });

  test('メールアドレスが空の場合、エラーが表示される', async ({ page }) => {
    // パスワードのみ入力
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await passwordInput.fill('password123');
    await submitButton.click();

    // HTML5 バリデーションにより、メールアドレス入力フィールドがフォーカスされることを確認
    await expect(page.locator('input[type="email"]')).toBeFocused();
  });

  test('ログインと登録の切り替えができる', async ({ page }) => {
    // 「新規アカウント作成」ボタンをクリック
    const toggleButton = page.locator('button:has-text("Create new account")');
    await toggleButton.click();

    // 登録画面に切り替わると、名前入力フィールドが表示される
    await expect(page.locator('label:has-text("Name:")')).toBeVisible();

    // 「既にアカウントを持っている」ボタンをクリック
    const toggleBackButton = page.locator('button:has-text("Already have an account")');
    await toggleBackButton.click();

    // 名前入力フィールドが消える
    const nameLabels = page.locator('label:has-text("Name:")');
    await expect(nameLabels).toHaveCount(0);
  });

  test('登録フロー（サインアップ）の処理', async ({ page }) => {
    // 登録画面に切り替え
    const toggleButton = page.locator('button:has-text("Create new account")');
    await toggleButton.click();

    // 登録フォームに入力
    // ユーザー名を入力
    await page.locator('input[type="text"]').fill('Test User');
    // メールアドレスを入力
    await page.locator('input[type="email"]').fill(`test_${Date.now()}@example.com`);
    // パスワードを入力
    await page.locator('input[type="password"]').fill('Password123!');

    const submitButton = page.locator('button[type="submit"]:visible');
    await submitButton.click();

    // Should navigate back to login page (registration success)
    await page.waitForTimeout(2000);
    const loginButton = page.locator('button:has-text("Login")');
    await expect(loginButton).toBeVisible();
  });

  test('should handle login flow', async ({ page }) => {
    // Fill login form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should navigate to chat page after successful login
    await expect(page.locator('text=AWS Blocks Chatbot')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should store token in localStorage', async ({ page, context }) => {
    // Fill login form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for login to complete
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 5000 });

    // Check localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();
  });

  test('should logout user', async ({ page }) => {
    // First login
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for chat page
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 5000 });

    // Click logout
    await page.locator('button:has-text("Logout")').click();

    // Should return to login page
    await expect(page.locator('h1')).toContainText('AWS Blocks Chatbot');
    await expect(page.locator('button:has-text("Create new account")')).toBeVisible();

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeNull();
  });
});
