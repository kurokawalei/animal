# FEATURES

## 功能總覽
| 功能區塊 | 狀態 | 核心檔案 | 說明 |
| --- | --- | --- | --- |
| 首頁沉浸式入口 | 已完成 | `src/pages/home/HomePage.vue` | 用故事、導覽、精選卡片建立行動入口 |
| 領養探索 | 已完成 | `src/pages/adopt/AdoptPage.vue`、`src/composables/useAdoptionAnimals.ts` | 官方資料搜尋、篩選、詳情、撥號 |
| 互動故事 | 已完成 | `src/pages/story/StoryPage.vue`、`src/data/storyArc.ts` | 章節式對話與輕量分歧 |
| 領養自評 | 已完成 | `src/pages/test/TestPage.vue`、`src/data/quiz.ts` | 四題檢核與分數結果 |
| 資料適配與 fallback | 已完成 | `src/services/adoptionApi.ts` | 官方 API 抓取、正規化、示範資料回退 |
| 全站導覽與詳情元件 | 已完成 | `src/shared/components/*` | 共用 header/footer、卡片、drawer、篩選器 |

## 1. 首頁沉浸式入口
### 行為描述
首頁不是傳統產品型 landing page，而是一個「先把使用者帶進世界觀，再導去行動」的入口。畫面上先以主視覺、標語與行動按鈕建立情緒，再用三個路線區塊說明網站的三種使用方式，最後以精選浪浪卡片與 bridge CTA 收束到領養與自評。

首頁會從 `useAdoptionAnimals()` 讀取官方領養資料，但只使用其中前三筆做 `featuredAnimals`，讓首頁維持敘事感，不像一般搜尋結果頁。

### 輸入與預設值
- 無 query 參數。
- 無 request body。
- `featuredAnimals`：預設取 `animals.slice(0, 3)`。
- `selectedAnimal`：預設 `null`，點選卡片後開啟詳情抽屜。

### 業務邏輯
- `animalCount` 直接顯示當前官方資料筆數。
- 卡片與詳情抽屜共用 `AnimalCard.vue` / `AnimalDetailDrawer.vue`。
- 點擊首頁卡片會開啟抽屜，不跳頁。
- 首頁主導流按鈕固定指向 `story.html`、`adopt.html`、`test.html`。

### 錯誤與狀態
- 若官方資料還在載入，首頁仍可顯示版面骨架與主視覺。
- 若 API 失敗，`useAdoptionAnimals()` 會回退到示範資料，因此首頁不會空白。
- 若沒有任何資料，`animalCount` 會顯示 0，精選區會沒有卡片。

### 完成狀態
已完成。頁面結構、導流、精選卡片與詳情抽屜都已接好。

## 2. 領養探索
### 行為描述
這是整站最重要的功能頁。使用者可依縣市、動物種類、性別、體型與關鍵字搜尋官方認養資料，並在卡片中直接查看基本資訊，再透過詳情抽屜取得完整資料、電話與官方入口。

此頁不是單純顯示資料，而是把「找得到、看得懂、能聯絡」做成同一條流程。

### 輸入與預設值
#### Query 參數
| 參數 | 預設值 | 用途 |
| --- | --- | --- |
| `county` | 空字串 | 縣市篩選 |
| `kind` | 空字串 | 動物種類篩選 |
| `sex` | 空字串 | 性別篩選 |
| `bodyType` | 空字串 | 體型篩選 |
| `keyword` | 空字串 | 關鍵字搜尋 |

#### UI 互動
- `filters`：由 `useAdoptionAnimals()` 管理的 reactive 狀態。
- `selectedAnimal`：預設 `null`，點卡片後開啟。
- `loading`：初始為 `true`。
- `warning`：初始為空字串。

#### Request body
- 不適用。這個功能只做 GET/讀取，不送 POST body。

### 業務邏輯
- `onMounted()` 時呼叫 `hydrateFilters(window.location.search)`，讓 query 可以回填成當前篩選條件。
- `filteredAnimals` 的篩選順序是：
  1. 縣市精準比對
  2. 動物種類精準比對
  3. 性別精準比對
  4. 體型精準比對
  5. 關鍵字全文搜尋
- 關鍵字搜尋會檢查 `title`、`variety`、`kind`、`shelterName`、`shelterAddress`、`place`、`remark`、`caption`。
- `summary` 會顯示「顯示 X / Y 筆資料」。
- 當篩選結果把目前已開啟的詳情卡片排除掉時，`watch(filters, { deep: true })` 會自動關閉抽屜。
- `window.history.replaceState()` 會同步更新網址，但不刷新頁面。

### 錯誤與狀態
- 載入中：顯示 `正在載入官方資料...`
- API 失敗但可回退：`warning` 可顯示「資料暫時無法載入，已顯示示範內容。」
- 無結果：顯示 empty state 與「回到全部資料」按鈕
- 圖片失敗：`AnimalCard.vue` 與 `AnimalDetailDrawer.vue` 會改用 `/images/ap.jpg`
- 電話缺失：`telHref` 會是空字串，不顯示撥號按鈕

### 非標準機制
- 沒有使用 `vue-router`。
- 沒有使用 server-side pagination。
- 沒有使用後端篩選；全部篩選都在前端完成。
- 沒有購物車或狀態提交；所有操作都是閱讀與導流。

### 完成狀態
已完成。官方資料載入、篩選、搜尋、詳情抽屜、電話連結與 query sync 都已實作。

## 3. 互動故事
### 行為描述
故事頁不是長篇文章，而是章節式對話流程。使用者透過按鈕推進事件，遇到分歧時做出選擇，`trust` 值會改變，最後結局文案也會跟著不同。

這個頁面最重要的不是娛樂，而是把「理解流浪動物」與「準備領養」之間的心理距離縮短。

### 輸入與預設值
- 無 query 參數。
- 無 request body。
- `currentId` 初始為 `storyNodes[0].id`。
- `trust` 初始為 `1`。
- `journal` 初始為空陣列。
- `completed` 初始為 `false`。

### 業務邏輯
- `storyNodes` 是章節與分支的唯一來源。
- `progress` 由 `storyOrder` 計算，顯示當前進度。
- `advance()` 依 `nextId` 推進下一節。
- `choose(choice)`：
  - 先加上 `trustDelta`
  - 將選擇與註解寫入 journal
  - 跳到 `choice.nextId`
- `restart()` 會把流程重置到開頭，並清空 journal 與 trust。
- 結局文案依 trust 分三階：
  - `>= 3`：可以進入領養探索
  - `>= 2`：仍建議再確認準備度
  - `< 2`：建議先看故事與知識

### 錯誤與狀態
- 若 `nextId` 找不到對應節點，流程會停住，不會崩潰。
- 若重啟故事，`nextTick()` 會確保 journal 在畫面重置後再補第一筆紀錄。
- 這個故事沒有存檔與續玩；重新整理頁面會回到初始狀態。

### 非標準機制
- 這不是 `router`，而是本地狀態機。
- `trust` 不是遊戲分數，而是敘事導向指標。
- journal 是對話紀錄，不是聊天訊息串流。

### 完成狀態
已完成。章節、選擇、信任值、紀錄、結局與導流按鈕都已可運作。

## 4. 領養自評
### 行為描述
自評頁用四個問題幫使用者確認自己現在是否適合進入領養探索。它不是測驗成績，而是讓使用者在進入領養前先把時間、金錢、照護與共識整理好。

### 輸入與預設值
- `answers`：`Record<string, number | undefined>`，初始為空物件。
- `score`：初始為 `0`。
- `submitted`：初始為 `false`。
- 無 query 參數。
- 無 request body。

### 題目內容
| 題號 | 主題 | 正確選項 |
| --- | --- | --- |
| Q1 | 是否願意長期照顧 | `2` |
| Q2 | 面對生病、掉毛、吵鬧、破壞家具的應對 | `2` |
| Q3 | 是否願意先看收容所資訊再領養 | `2` |
| Q4 | 條件還沒準備好時的選擇 | `0` |

### 業務邏輯
- `submitQuiz()` 會先把 `submitted` 設成 `true`。
- `score` 是四題中答對題數的總和。
- 結果只在 `submitted === true` 時顯示。
- 分數區間：
  - `>= 3`：準備度高，可以直接進入領養探索
  - `>= 2`：還差一步，建議先補資訊
  - `< 2`：建議先看故事與知識

### 錯誤與狀態
- 沒有選答案直接送出時，未選題目會被算錯。
- 這個頁面沒有伺服器驗證，因此結果只代表前端自我檢核。

### 完成狀態
已完成。題目、選項、分數計算與結果導流都已可用。

## 5. 官方資料適配與 fallback
### 行為描述
這個模組負責把農業部官方認養資料轉成前端穩定可用的 `AnimalRecord[]`。

### 輸入與預設值
- `VITE_ADOPTION_API_URL`：選用，若有設定會優先嘗試。
- `PROXY_URL`：固定為 `/api/adoption`，僅供 dev proxy。
- `OFFICIAL_URL`：官方公開資料 URL。

### 業務邏輯
- `fetchAdoptionAnimals()` 會依序嘗試三個來源。
- `fetchJson()` 使用 `cache: 'no-store'` 與 `mode: 'cors'`。
- `extractAnimals()` 支援多種常見 payload 包裝。
- `normalizeAnimal()` 會：
  - 把縣市名稱歸一到臺字
  - 把種類歸成狗 / 貓 / 其他
  - 把性別歸一成公 / 母 / 未知
  - 把體型歸一成小型 / 中型 / 大型 / 未提供
  - 把旗標欄位轉成是 / 否 / 未提供
  - 把圖片轉成有效 URL 或 fallback 圖
  - 以 `county-index` 當作備援 id

### 錯誤與狀態
- HTTP 錯誤：會嘗試下一個來源
- CORS 問題：會嘗試下一個來源
- payload 結構不符：會嘗試下一個來源
- 全部失敗：回退到兩筆示範資料

### 非標準機制
- 這裡沒有正式 error code 系統，錯誤是由 UI loading / warning / empty state 表現。
- `buildTelHref()` 只做字串格式化，不做電話驗證。

### 完成狀態
已完成。資料抓取、正規化、fallback、電話連結與官方連結都已對齊頁面需求。

