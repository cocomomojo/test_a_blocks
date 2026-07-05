import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AWS Blocks Chatbot');
    await expect(page.locator('label:has-text("Email:")')).toBeVisible();
    await expect(page.locator('label:has-text("Password:")')).toBeVisible();
  });

  test('should show error for missing email', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await passwordInput.fill('password123');
    await submitButton.click();

    // HTML5 validation should prevent submission
    await expect(page.locator('input[type="email"]')).toBeFocused();
  });

  test('should toggle between login and register', async ({ page }) => {
    const toggleButton = page.locator('button:has-text("Create new account")');
    await toggleButton.click();

    // Should show name field after toggling to register
    await expect(page.locator('label:has-text("Name:")')).toBeVisible();

    // Toggle back to login
    const toggleBackButton = page.locator('button:has-text("Already have an account")');
    await toggleBackButton.click();

    // Name field should disappear
    const nameLabels = page.locator('label:has-text("Name:")');
    await expect(nameLabels).toHaveCount(0);
  });

  test('should handle registration flow', async ({ page }) => {
    // Switch to register
    const toggleButton = page.locator('button:has-text("Create new account")');
    await toggleButton.click();

    // Fill in registration form
    await page.locator('input[type="text"]').fill('Test User');
    await page.locator('input[type="email"]').fill(`test_${Date.now()}@example.com`);
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
