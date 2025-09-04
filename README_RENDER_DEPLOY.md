# Posifeed Frontend - Render.com Deployment Guide

## Render.com へのデプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubにて新しいリポジトリを作成
2. ローカルでGitを初期化し、プッシュ

```bash
cd /path/to/posifeed-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/posifeed-frontend.git
git push -u origin main
```

### 2. Render.com での設定

1. [Render.com](https://render.com) にログイン
2. "New +" → "Static Site" を選択
3. GitHubリポジトリを接続
4. 以下の設定を入力：

**基本設定:**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

**環境変数:**
- `NODE_VERSION`: `18`
- `VITE_API_URL`: `https://your-api-app-name.onrender.com`

**リダイレクト設定 (SPA対応):**
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

### 3. 環境変数の設定

APIのURLを正しく設定する必要があります：

```
VITE_API_URL=https://posifeed-api.onrender.com
```

### 4. デプロイ後の設定

1. APIサーバーのCORS設定にフロントエンドのドメインを追加
2. フロントエンドアプリケーションでAPI接続を確認

### 5. 自動デプロイ

GitHubリポジトリにプッシュすると自動的に再デプロイされます。

## 設定ファイル

- `render.yaml`: Render.com用の設定ファイル（オプション）
- `vite.config.ts`: Vite設定
- `package.json`: Node.js依存関係とスクリプト
- `.gitignore`: Git除外ファイル設定

## API統合

### 環境別URL設定

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
```

### CORS設定

APIサーバー側でフロントエンドドメインを許可：

```ruby
# config/initializers/cors.rb
origins Rails.env.production? ? [
  'https://*.vercel.app', 
  'https://*.railway.app', 
  'https://*.onrender.com'  # これを追加
] : ['http://localhost:3000', 'http://localhost:5173']
```

## トラブルシューティング

### よくある問題

1. **API接続エラー**
   - `VITE_API_URL` 環境変数を確認
   - APIサーバーのCORS設定を確認

2. **SPAルーティングの問題**
   - リダイレクト設定（`/* → /index.html`）を確認

3. **ビルドエラー**
   - Node.js バージョンを18に設定
   - `package-lock.json` が含まれているか確認

### ログの確認方法

Render.com ダッシュボードの "Logs" タブでビルドログを確認できます。