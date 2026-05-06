# DEVELOPMENT

## 開發原則
這個專案目前的開發方式是「前端資料分層 + 多頁組裝 + 明確的共用元件邊界」。

開發時優先遵守下列原則：

- 先判斷資料是靜態內容、可重用狀態、外部 API，還是純畫面。
- 外部資料先在 `services/` 正規化，再交給 `composables/`。
- 重複的跨頁邏輯放 shared components 或 composables，不要複製到各頁。
- 頁面只負責組裝流程，不承擔 API 解析與欄位轉換。
- 保持嚴格型別，不要用 `any` 繞過資料結構問題。

## 模組系統說明
### `pages/`
`src/pages/*` 是每個 HTML 入口對應的應用根目錄。

- `main.ts`：建立 Vue app，掛載到 `#app`
- `*.vue`：頁面本體，組裝 shared components、composables、data

### `shared/components/`
這裡放可跨頁重用的 UI。

- `SiteHeader.vue`、`SiteFooter.vue`：全站一致導覽與收尾
- `SectionHeading.vue`：統一 section 標題語氣
- `AnimalCard.vue`：首頁與領養頁共用
- `AnimalDetailDrawer.vue`：領養資訊詳情與撥號操作
- `AdoptionFilters.vue`：領養頁篩選控制器

### `composables/`
這裡放頁面可重用的狀態邏輯。

- `useAdoptionAnimals()` 負責資料載入、篩選、摘要、query sync
- composable 盡量保持純粹的資料邏輯，不要混入太多 DOM 操作

### `services/`
這裡放資料 I/O 與正規化。

- `fetchAdoptionAnimals()`：外部資料抓取與 fallback
- `buildTelHref()`：電話連結格式化

### `data/`
只放靜態資料。

- `storyArc.ts`：互動故事節點與選項
- `quiz.ts`：自評題目
- `story.ts`：舊版敘事資料，作為靜態內容參考

### `types/`
跨模組共用型別。

- `AnimalRecord`
- `AdoptionFilters`

### `styles/`
`src/styles/main.css` 是全站唯一的主樣式入口。

- 通用按鈕、卡片、版面、動畫
- 頁面級樣式：`.home-page`、`.adopt-page`、`.story-page`、`.test-page`
- 舊版樣式與新版視覺並存時，以頁面 class 的樣式優先

## 命名規則對照表
| 類型 | 規則 | 範例 | 說明 |
| --- | --- | --- | --- |
| Vue 頁面元件 | `PascalCase.vue` | `HomePage.vue` | 與頁面用途直接對應 |
| Vue 共用元件 | `PascalCase.vue` | `AnimalCard.vue` | 名稱描述實際 UI 角色 |
| Composable | `useCamelCase.ts` | `useAdoptionAnimals.ts` | 以 `use` 開頭，表示可被 Vue setup 使用 |
| Service | `camelCase.ts` | `adoptionApi.ts` | 只做 I/O、轉換、協定處理 |
| Static data | `camelCase.ts` | `storyArc.ts` | 用語意名稱表示內容類型 |
| Type 定義 | `camelCase.ts` | `adoption.ts` | 集中描述資料結構 |
| Page entry | `main.ts` | `src/pages/adopt/main.ts` | 只負責 createApp 與樣式引入 |
| CSS class | `kebab-case` | `animal-drawer__facts` | 避免與 Vue 或 JS 命名混淆 |

## 新增 API / middleware / DB 的步驟
### 新增 API
1. 先在 `src/types/` 補資料契約。
2. 在 `src/services/` 建立單一責任的資料存取函式。
3. 如果前端要重用資料與狀態，新增或擴充 `src/composables/`。
4. 最後才在 `src/pages/*` 或 `src/shared/components/*` 消費這些資料。
5. 加入 `npm run typecheck` 與 `npm run build` 驗證。

### 新增 middleware
目前沒有 middleware；若未來加入後端，建議遵守以下順序：
1. 驗證與授權先於商業邏輯。
2. 速率限制、log、audit 要在 controller 前處理。
3. 不要把驗證邏輯塞進頁面或 composable。

### 新增資料庫
目前沒有資料庫；若未來新增：
1. 先畫 schema，再寫 migration。
2. 先補欄位約束與唯一性，再補索引。
3. 文件要同步新增資料表、關聯與資料流。
4. 前端文件要註明哪些資料已不再是前端 fallback，而是持久化來源。

## 環境變數表
| 變數 | 用途 | 必要性 | 預設值 |
| --- | --- | --- | --- |
| `VITE_ADOPTION_API_URL` | 覆寫官方領養 API 的完整 URL | 選用 | 未設定時由程式依序嘗試 dev proxy 與官方 URL |

### 使用說明
- 所有會被瀏覽器端直接讀取的環境變數都必須以 `VITE_` 開頭。
- 如果你要在正式環境改成同源代理，仍可保留這個變數作為回退或 staging 測試。
- `.env.example` 只放必要項目，不要無限擴張未使用設定。

## JSDoc 格式
本專案沒有強制所有函式都寫 JSDoc，但以下情況建議補上：

- 匯出函式
- 資料正規化函式
- 會被其他模組重用的 helper
- 規則比較多、讀起來不直觀的邏輯

### 標準格式
```ts
/**
 * 這一行先用一句話描述做什麼。
 *
 * 需要時再補第二行說明邊界或副作用。
 *
 * @param value - 參數用途。
 * @returns 回傳值說明。
 * @throws Error - 如果有明確拋例外，必須寫明條件。
 */
function example(value: string): string {
  return value.trim();
}
```

### 例子
```ts
/**
 * 將官方收容所電話轉成可直接撥打的 tel link。
 *
 * @param value - 收容所電話，可能包含空白或格式字元。
 * @returns 可直接放在 <a href> 的 tel URI；空字串代表沒有可用電話。
 */
export function buildTelHref(value: string): string {
  return value ? `tel:${value.replace(/\s+/g, '')}` : '';
}
```

## 計畫歸檔流程
1. 計畫檔案命名格式：`YYYY-MM-DD-<feature-name>.md`
2. 計畫文件結構：`User Story → Spec → Tasks`
3. 功能完成後：移至 `docs/plans/archive/`
4. 更新 `docs/FEATURES.md` 和 `docs/CHANGELOG.md`

### 歸檔標準
- 如果計畫已經轉成程式碼或正式文件，原始計畫就應歸檔。
- `archive/` 裡的文件只保留歷史脈絡，不再當作當前待辦。
- 若同一個功能後來又改版，請建立新的計畫，不要直接覆蓋舊檔。

## 常見實作提醒
- `useAdoptionAnimals()` 會在 mounted 後自動載入資料；若頁面需要預先設定 query，要在 mounted 之後呼叫 `hydrateFilters()`。
- `window` 與 `history` 只應在瀏覽器端使用，不能在模組頂層讀取。
- `AnimalCard.vue` 和 `AnimalDetailDrawer.vue` 都依賴 `/images/ap.jpg` 作為 fallback 圖片。
- `StoryPage.vue` 的流程是狀態機，不是 router；不要把 `storyArc.ts` 當一般靜態文章。

