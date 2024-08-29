# Lucia auth

Username and password authの最低限の機能を実装

https://lucia-auth.com/

## 技術選定

- Bun
- TypeScript
- Next.js
- Drizzle
- Lucia auth
- Cloudflare Pages
- Cloudflare D1

## 初期設定

### NodeModule をインストール

```bash
bun install
```

### データベースを作成

```bash
npx wrangler d1 create lucia-auth-base-app
```

### wrangler.toml に追記

```toml
[[d1_databases]]
binding = "DB"
database_name = "lucia-auth-base-db"
database_id = "<unique-ID-for-your-database>"
```

`<unique-ID-for-your-database>`はデータベースを作成したときに出力されるID

### テーブルのスキーマを作成

```bash
npx drizzle-kit generate
```

### ローカルデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply lucia-auth-base-db --local
```

### リモートデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply lucia-auth-base-db --remote
```
