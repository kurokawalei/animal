# ARCHITECTURE

## 總覽
這個專案目前是 `Vue 3 + Vite MPA`，不是傳統單頁應用。每個功能頁都是獨立 HTML 入口，載入對應的 `main.ts` 後掛載 Vue 根元件。

設計重點有三個：

1. 頁面導覽是「故事 -> 領養 -> 自評」的行動漏斗。
2. 領養資料透過官方 API 串接，並在前端做正規化與 fallback。
3. 劇情互動與視覺系統是前端本地資料，不依賴後端。

## 啟動流程
### 開發模式
1. `npm run dev` 啟動 Vite。
2. 使用者開啟 `index.html`、`adopt.html`、`story.html` 或 `test.html` 其中一個入口。
3. HTML 檔案載入對應的 `src/pages/*/main.ts`。
4. `main.ts` 建立 Vue app，並匯入 `src/styles/main.css`。
5. 對應頁面元件渲染後，透過 shared components、composable、data module 組成互動。

### 領養資料載入
1. `AdoptPage.vue` 或 `HomePage.vue` 透過 `useAdoptionAnimals()` 啟動資料載入。
2. `useAdoptionAnimals()` 在 `onMounted()` 呼叫 `fetchAdoptionAnimals()`。
3. `fetchAdoptionAnimals()` 依序嘗試：
   - `VITE_ADOPTION_API_URL`
   - 開發期 proxy `/api/adoption`
   - 官方資料 URL
4. 取得 payload 後先做 payload 形狀抽取，再正規化成 `AnimalRecord[]`。
5. 如果三條來源都失敗，回退到前端 fallback 資料。

### 故事流程
1. `StoryPage.vue` 以 `storyNodes` 作為章節狀態機。
2. 使用者點按按鈕推進 `currentId`。
3. 選擇題會調整 `trust`，再依 `nextId` 前往下一節。
4. 結局依信任值產生不同文案，再導向領養探索或自評。

## 目錄結構
### 根目錄
| 路徑 | 用途 |
| --- | --- |
| `AGENTS.md` | 專案操作規則、常用指令、文件入口 |
| `index.html` | 首頁入口 HTML |
| `adopt.html` | 領養探索入口 HTML |
| `story.html` | 故事頁入口 HTML |
| `test.html` | 自評頁入口 HTML |
| `package.json` | npm scripts、依賴與專案資訊 |
| `vite.config.ts` | Vite MPA 設定、別名、dev proxy |
| `tsconfig.json` | 前端 TypeScript 設定 |
| `tsconfig.node.json` | `vite.config.ts` 的 TypeScript 設定 |
| `.env.example` | 環境變數範例 |
| `DEPLOY_PLAN.md` | 舊版部署文件計畫；完成後可歸檔到 `docs/plans/archive/` |
| `docs/` | 正式文件與計畫歸檔 |
| `src/` | Vue 原始碼 |
| `public/images/` | Vite 靜態資源，供頁面以 `/images/...` 引用 |
| `css/`、`js/`、`images/`、`webfonts/` | 舊版靜態站資產；保留作為歷史資源與相容內容 |

### `src/`
| 路徑 | 用途 |
| --- | --- |
| `src/env.d.ts` | Vite 與 Vue 環境型別宣告 |
| `src/styles/main.css` | 全站主樣式，包含基底與頁面專屬視覺系統 |
| `src/types/adoption.ts` | 領養資料的前端資料契約 |
| `src/services/adoptionApi.ts` | 官方資料抓取、payload 抽取、資料正規化、fallback |
| `src/composables/useAdoptionAnimals.ts` | 領養探索頁的狀態管理、篩選、query sync、資料載入 |
| `src/data/story.ts` | 舊版故事介紹內容，目前作為靜態敘事資料 |
| `src/data/storyArc.ts` | 互動故事章節資料與選擇分支 |
| `src/data/quiz.ts` | 領養自評題組與正確答案 |
| `src/pages/home/` | 首頁入口與頁面元件 |
| `src/pages/adopt/` | 領養探索頁入口與頁面元件 |
| `src/pages/story/` | 互動故事頁入口與頁面元件 |
| `src/pages/test/` | 領養自評頁入口與頁面元件 |
| `src/shared/components/` | 跨頁共用元件 |

### `src/pages/*`
| 路徑 | 用途 |
| --- | --- |
| `src/pages/home/main.ts` | 掛載首頁 Vue app |
| `src/pages/home/HomePage.vue` | 首頁視覺與導流 |
| `src/pages/adopt/main.ts` | 掛載領養頁 Vue app |
| `src/pages/adopt/AdoptPage.vue` | 領養探索與篩選 |
| `src/pages/story/main.ts` | 掛載故事頁 Vue app |
| `src/pages/story/StoryPage.vue` | 互動故事流程 |
| `src/pages/test/main.ts` | 掛載自評頁 Vue app |
| `src/pages/test/TestPage.vue` | 領養自評與結果顯示 |

### `src/shared/components/`
| 元件 | 用途 |
| --- | --- |
| `SiteHeader.vue` | 全站導覽列與品牌標題 |
| `SiteFooter.vue` | 全站頁尾與官方認養入口 |
| `SectionHeading.vue` | 統一的段落標題元件 |
| `AdoptionFilters.vue` | 領養頁篩選器 |
| `AnimalCard.vue` | 動物卡片，首頁與領養頁共用 |
| `AnimalDetailDrawer.vue` | 動物詳情抽屜，支援撥號與官方連結 |

## 資料流
### 領養探索
`AdoptPage.vue`
→ `useAdoptionAnimals()`
→ `fetchAdoptionAnimals()`
→ `VITE_ADOPTION_API_URL` / `/api/adoption` / 官方 URL
→ `AnimalRecord[]`
→ `filters` / `filteredAnimals`
→ `AnimalCard.vue`、`AnimalDetailDrawer.vue`

### 首頁
`HomePage.vue`
→ `useAdoptionAnimals()`
→ `animals`
→ `animalCount`
→ `featuredAnimals`
→ `AnimalCard.vue`

### 故事頁
`StoryPage.vue`
→ `storyNodes`
→ `currentId`
→ `trust`
→ `journal`
→ 結局與導流按鈕

### 自評頁
`TestPage.vue`
→ `quizQuestions`
→ `answers`
→ `score`
→ `result`

## API 路由總覽
目前專案只有一條開發期代理路由，沒有自建後端 API。

| 前綴 | 檔案 | 認證 | 說明 |
| --- | --- | --- | --- |
| `/api/adoption` | `vite.config.ts` | 無 | Vite dev server 代理到農業部官方領養資料，避免開發時直接碰跨域問題 |

### 官方資料來源
- 官方資料 URL：`https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1`
- 前端實作先嘗試環境變數，再嘗試 dev proxy，最後才直接抓官方來源。

## 統一回應格式
這個專案沒有後端統一回應封裝；真正被前端消費的「統一格式」是 `AnimalRecord[]`。

### 正規化後的資料形狀
```json
[
  {
    "id": "string",
    "title": "米克斯待認養",
    "kind": "狗",
    "variety": "米克斯",
    "sex": "公",
    "bodyType": "中型",
    "age": "成犬",
    "sterilization": "是",
    "bacterin": "否",
    "status": "待認養",
    "remark": "string",
    "caption": "string",
    "openDate": "2026-05-05",
    "closeDate": "未提供",
    "updateDate": "2026-05-05",
    "shelterName": "臺北市動物之家",
    "shelterTel": "02-87913254",
    "shelterAddress": "臺北市內湖區安美街191號",
    "place": "臺北市",
    "county": "臺北市",
    "imageUrl": "/images/ap.jpg",
    "officialUrl": "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1"
  }
]
```

### 解析規則
- `extractAnimals()` 支援陣列，也支援 `data` / `result` / `records` / `animals` / `items` 等常見包裝。
- `normalizeAnimal()` 會把原始欄位轉成前端固定欄位。
- 缺少圖片時會回退到 `/images/ap.jpg`。
- 缺少電話、地址、日期時會轉成 `未提供`，避免 UI 直接炸掉。

## 認證與授權
目前沒有認證與授權機制。

| 項目 | 狀態 | 備註 |
| --- | --- | --- |
| middleware | 無 | 前端沒有 request middleware |
| JWT | 無 | 沒有 token、secret、refresh flow |
| 路由保護 | 無 | 四個頁面皆為公開頁 |
| 使用者登入 | 無 | 專案不收集登入狀態 |

### 有效期
- JWT：不適用
- session：不適用
- cookie auth：不適用

## 資料庫 schema
目前專案沒有資料庫、ORM、migration、repository 或 persistence layer，因此沒有可列出的實際 schema。

### 目前的資料保存方式
- 頁面狀態：Vue `ref` / `reactive`
- 領養篩選：`URLSearchParams` + `window.history.replaceState`
- 故事進度：`currentId`、`trust`、`journal`
- 自評結果：本頁 local state

### 為什麼不寫假 schema
因為這會誤導後續開發者。此專案沒有任何資料持久化邏輯，若未來新增後端或資料庫，應該在新增的後端文件中重新定義 schema、migration 與約束。

## 第三方整合
### 1. 農業部官方動物認領養資料
這是本專案最重要的外部整合。流程如下：

1. 使用者進入首頁或領養頁。
2. `useAdoptionAnimals()` 呼叫 `fetchAdoptionAnimals()`。
3. `fetchAdoptionAnimals()` 依序讀取環境變數、dev proxy、官方 URL。
4. `fetchJson()` 以 `fetch(..., { cache: 'no-store', mode: 'cors' })` 取得 payload。
5. 將 payload 正規化成 `AnimalRecord[]`。
6. 若全部來源失敗，回退到示範資料。

### 2. 電話連結
`buildTelHref()` 會把收容所電話包成 `tel:` 連結，並去掉空白字元。這讓手機使用者可以直接撥打。

### 3. 官方認養入口
`AnimalDetailDrawer.vue` 中的官方入口會直接導向農業部官方頁面，這是認養流程的最終導流點。

### 金流
目前沒有金流、付款、訂閱、捐款或第三方支付整合。

## 實作邊界
- `services/` 負責資料 I/O 與正規化，不碰 UI。
- `composables/` 負責頁面狀態與查詢同步，不碰底層 fetch 細節。
- `components/` 只做畫面與事件，不做資料來源決策。
- `pages/` 負責組裝整頁流程。
- `data/` 只放靜態敘事與問答內容。

