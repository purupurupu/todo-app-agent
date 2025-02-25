import { test, expect } from '@playwright/test';

test.describe('TODOアプリのテスト', () => {
  test('ホームページが正しく表示されること', async ({ page }) => {
    await page.goto('/');
    
    // タイトルが表示されていることを確認
    await expect(page.getByRole('heading', { name: 'TODOアプリ' })).toBeVisible();
    
    // フォームが表示されていることを確認
    await expect(page.getByPlaceholder('TODOのタイトルを入力')).toBeVisible();
    await expect(page.getByRole('button', { name: '追加', exact: true })).toBeVisible();
  });

  test('タスクを追加できること', async ({ page }) => {
    await page.goto('/');
    
    // タスクを追加
    await page.getByPlaceholder('TODOのタイトルを入力').fill('テストタスク');
    await page.getByRole('button', { name: '追加', exact: true }).click();
    
    // 追加されたタスクが表示されていることを確認
    await expect(page.getByText('テストタスク')).toBeVisible();
  });

  test('タスクを完了にできること', async ({ page }) => {
    await page.goto('/');
    
    // タスクを追加
    await page.getByPlaceholder('TODOのタイトルを入力').fill('完了するタスク');
    await page.getByRole('button', { name: '追加', exact: true }).click();
    
    // タスクを完了にする
    await page.getByRole('button', { name: 'タスク完了にする' }).first().click();
    
    // タスクが完了状態になっていることを確認（クラスの変化やスタイルの変化を確認）
    await expect(page.locator('text=完了するタスク').first()).toHaveClass(/line-through/);
  });

  test('タスクを削除できること', async ({ page }) => {
    await page.goto('/');
    
    // タスクを追加
    await page.getByPlaceholder('TODOのタイトルを入力').fill('削除するタスク');
    await page.getByRole('button', { name: '追加', exact: true }).click();
    
    // 追加されたタスクが表示されていることを確認
    await expect(page.getByText('削除するタスク')).toBeVisible();
    
    // タスクを削除
    await page.getByRole('button', { name: '削除' }).first().click();
    
    // タスクが削除されていることを確認
    await expect(page.getByText('削除するタスク')).not.toBeVisible();
  });
}); 