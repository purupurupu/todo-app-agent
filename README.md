# 爽快感のあるTODOアプリ

Next.jsとTailwind CSSを使用した、市場最高級に爽快感のあるTODOアプリです。

## 機能

- タスクの追加、編集、削除
- タスクの完了状態の切り替え
- 優先度の設定（低、中、高）
- タスクの詳細説明の追加
- ステータスと優先度によるフィルタリング
- タスク完了時の紙吹雪エフェクト
- ローカルストレージを使用したデータの永続化
- レスポンシブデザイン

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- [UUID](https://github.com/uuidjs/uuid) - 一意のIDの生成

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd todo-app-next

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## テスト

このプロジェクトでは、以下のテストツールを使用することができます：

### Jestとreact-testing-library

コンポーネントの単体テストとインテグレーションテストに最適です。

```bash
# インストール
bun add -d jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest

# テストの実行
bun test
```

### Playwright

エンドツーエンドテストに最適です。

```bash
# インストール
bun add -d @playwright/test

# テストの実行
bun playwright test
```

## ビルドと本番環境へのデプロイ

```bash
# 本番用ビルドの作成
bun run build

# 本番サーバーの起動
bun run start
```

## ライセンス

[MIT](LICENSE)
