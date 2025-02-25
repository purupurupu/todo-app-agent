import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// グローバルなモックを設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// テスト後にReactコンポーネントをクリーンアップ
afterEach(() => {
  cleanup();
});

// Testing Libraryのカスタムマッチャーを拡張
expect.extend(matchers); 