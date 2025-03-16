# 爽快感のあるTODOアプリ

Next.jsとTailwind CSSを使用した、市場最高級に爽快感のあるTODOアプリです。バックエンドにはPrismaとPostgreSQLを使用し、フロントエンドとバックエンドの両方でTypeScriptによる型安全な開発を実現しています。

## 機能

- タスクの追加、編集、削除
- タスクの完了状態の切り替え
- 優先度の設定（低、中、高）
- タスクの詳細説明の追加
- ステータスと優先度によるフィルタリング
- カンバンボード形式での表示（ドラッグ＆ドロップ対応）
- RESTful APIによるデータの永続化
- レスポンシブデザイン
- モダンでオシャレなUI/UX
- 最適化されたダークモード対応

## 技術スタック

### フロントエンド
- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- [DnD Kit](https://dndkit.com/) - ドラッグ＆ドロップ機能

### バックエンド
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - サーバーサイドAPI
- [Prisma](https://www.prisma.io/) - 次世代のORMツール
- [PostgreSQL](https://www.postgresql.org/) - 関係データベース
- [Zod](https://zod.dev/) - TypeScriptファーストのスキーマバリデーション

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd todo-app-next

# 依存関係のインストール
pnpm install

# PostgreSQLデータベースの起動（Docker Compose使用）
docker-compose up -d

# Prismaマイグレーションの実行
pnpm exec prisma migrate dev

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## API仕様

このアプリケーションは以下のRESTful APIエンドポイントを提供しています：

### TODOの取得
```
GET /api/todos
```

### TODOの作成
```
POST /api/todos
```

### TODOの更新
```
PUT /api/todos/:id
```

### TODOの削除
```
DELETE /api/todos/:id
```

### 複数TODOの一括更新（カンバンボード用）
```
POST /api/todos/batch-update
```

各APIエンドポイントはSwagger形式のコメントでドキュメント化されています。

## テスト

このプロジェクトでは、以下のテストツールを使用します：

### Vitestとreact-testing-library

コンポーネントの単体テストとインテグレーションテストに最適です。

```bash
# テストの実行
pnpm test
```

### Playwright

エンドツーエンドテストに最適です。

```bash
# Playwrightのセットアップ
pnpm exec playwright install

# テストの実行
pnpm test:e2e
```

## ビルドと本番環境へのデプロイ

```bash
# 本番用ビルドの作成
pnpm build

# 本番サーバーの起動
pnpm start
```

## プロジェクト構造

```
todo-app-next/
├── .next/               # Next.jsのビルド出力
├── prisma/              # Prismaスキーマとマイグレーション
├── public/              # 静的ファイル
├── src/                 # ソースコード
│   └── app/             # Next.js App Router
│       ├── api/         # APIルート
│       │   └── todos/   # TODOのAPIエンドポイント
│       ├── components/  # Reactコンポーネント
│       ├── hooks/       # カスタムReactフック
│       ├── types/       # TypeScript型定義
│       ├── kanban/      # カンバンボードページ
│       ├── list/        # リスト表示ページ
│       ├── globals.css  # グローバルCSS
│       ├── layout.tsx   # ルートレイアウト
│       └── page.tsx     # ホームページ
├── .env                 # 環境変数
├── compose.yml          # Docker Compose設定
├── package.json         # プロジェクト依存関係
└── README.md            # プロジェクト説明（このファイル）
```

## ライセンス

[MIT](LICENSE)
