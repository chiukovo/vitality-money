# vitality-money

- 系統環境: node v12.13.0

## env 設定說明

``` bash
$ cp .env.example .env
```

必要變數說明

| 名稱 | 說明 |
| ------ | ------ |
| NUXT_ENV_API_URL | api連結 |
| NUXT_ENV_API_WEBSOCKET | websocket連結 (數據) |
| NUXT_ENV_API_ORDER_WEBSOCKET | websocket連結 (下訂單) |


## 安裝步驟

``` bash
$ npm install (or yarn)

# run開發者模式
$ npm run dev (or yarn dev)

# 部屬步驟 (需架到server才需要用)
# pm2 可掛載
$ npm run build
$ npm run start
```
