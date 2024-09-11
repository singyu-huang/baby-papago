# Baby Papago
Baby Papago 是一個專為父母設計的手機APP，幫助使用者查找並導航至附近的哺乳室及相關設施。應用程式包含由使用者維護的公共資料庫，讓哺乳室位置的資訊更完整且實時。

## 專案結構
此專案包含前端 (React Native + Expo) 和後端 (Node.js + Express) 兩部分。

## 專案目錄結構
```bash
/backend - Node.js + Express 後端服務
/frontend - React Native + Expo 前端應用程式
```

## 環境設置
### 需求
Docker
Docker Compose
### 前端
```frontend``` 目錄包含一個 React Native + Expo 應用程式。
#### 安裝相依性
```bash
cd frontend
npm install
```
#### 建立 `.env` 文件
請在專案根目錄下建立 `.env` 文件，並且將以下內容填入對應的 API 金鑰：
```在專案根目錄中建立 `.env` 文件，用來管理 Google Maps 的 API 金鑰。這樣可以確保敏感資訊不會直接存儲在程式碼中，並且便於不同的開發或生產環境中使用不同的 API 金鑰。```

```bash
GOOGLE_MAPS_API_KEY_ANDROID=your-android-api-key
GOOGLE_MAPS_API_KEY_IOS=your-ios-api-key
```
#### 啟動前端
```bash
npm start
```
### 後端
```backend``` 目錄包含一個 Node.js + Express API。
#### 啟動
後端服務透過 Docker 來運行。你可以使用 ```docker-compose``` 來啟動後端服務。
```bash
docker-compose up
```
這將啟動 Node.js + Express 服務，並且在開發環境下運行，後端將會在 ```http://localhost:3000``` 上運作。
#### 關閉
若要停止運行的服務，可以使用下列命令：
```bash
docker-compose down
```

## 聯絡作者
如有任何問題或建議，請通過以下方式聯絡我：
E-mail: hanigogoph@gmail.com