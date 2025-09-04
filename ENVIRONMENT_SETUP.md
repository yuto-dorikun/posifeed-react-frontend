# フロントエンド環境変数設定手順

## 🔧 VITE_API_URL の設定方法

### **Step 1: API サービスのURLを確認**

1. Render.comダッシュボードにログイン
2. **posifeed-api** サービス（Rails API）を選択  
3. サービスのURLをコピー
   - 例: `https://posifeed-api-abc123.onrender.com`

### **Step 2: フロントエンドに環境変数を設定**

#### **方法A: Render.comダッシュボードで設定（推奨）**

1. Render.comで **posifeed-frontend** サービスを選択
2. **"Environment"** タブをクリック
3. **"Add Environment Variable"** をクリック
4. 以下を入力：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://posifeed-api-abc123.onrender.com` (実際のAPI URL)
5. **"Save Changes"** をクリック
6. 自動でリデプロイが開始される（数分待機）

#### **方法B: render.yamlを更新してGitプッシュ**

1. `render.yaml` の `VITE_API_URL` の値を更新
```yaml
envVars:
  - key: NODE_VERSION
    value: 18
  - key: VITE_API_URL
    value: https://posifeed-api-abc123.onrender.com  # 実際のURLに変更
```

2. GitHubにプッシュ
```bash
git add .
git commit -m "Update VITE_API_URL with actual API endpoint"
git push origin main
```

### **Step 3: 動作確認**

1. フロントエンドのデプロイ完了を待つ
2. フロントエンドURLにアクセス
3. ブラウザの開発者ツール（F12）でネットワークタブを確認
4. API呼び出しが正しいURLに向かっているかチェック

## 🚨 トラブルシューティング

### **API接続エラーの場合**

1. **CORS設定確認**: API側で正しいフロントエンドドメインが許可されているか
2. **URL確認**: `https://` が含まれているか、末尾の `/` が不要か確認
3. **API動作確認**: APIのヘルスチェック `https://api-url/api/v1/health` が動作するか

### **環境変数が反映されない場合**

1. **リデプロイ**: 環境変数変更後に必ずリデプロイが実行されているか確認
2. **ビルドログ確認**: Render.comのログで環境変数が正しく設定されているか確認
3. **キャッシュクリア**: ブラウザのハードリフレッシュ（Ctrl+Shift+R）

## 📝 現在の設定

**現在のrender.yamlでの設定:**
```yaml
envVars:
  - key: VITE_API_URL
    value: https://posifeed-api.onrender.com
```

**実際のAPIサービス名が異なる場合は上記の値を更新してください。**