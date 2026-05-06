# TESTING

## 目前狀態
這個專案目前沒有正式的單元測試框架或測試檔案，現階段的驗證主要依賴：

1. `npm run typecheck`
2. `npm run build`
3. 手動瀏覽四個頁面，確認互動與導流

如果未來要補自動化測試，建議先從純函式與資料層開始，而不是直接從整頁 E2E 開始。

## 測試檔案表
| 預計檔案 | 狀態 | 依賴 | 建議驗證重點 |
| --- | --- | --- | --- |
| `src/services/adoptionApi.test.ts` | 未建立 | `fetch` mock | 正規化、fallback、tel link、payload 抽取 |
| `src/composables/useAdoptionAnimals.test.ts` | 未建立 | `fetchAdoptionAnimals()` mock、Vue test utils | 篩選、query sync、reset、空結果 |
| `src/pages/story/StoryPage.test.ts` | 未建立 | `storyArc.ts` | trust 變化、choice flow、restart、結局文案 |
| `src/pages/test/TestPage.test.ts` | 未建立 | `quiz.ts` | 分數計算、submitted 狀態、結果區顯示 |
| `src/shared/components/AnimalCard.test.ts` | 未建立 | `AnimalRecord` fixture | 卡片內容、click emit、圖片 fallback |
| `src/shared/components/AnimalDetailDrawer.test.ts` | 未建立 | `AnimalRecord` fixture | 抽屜開關、電話與官方連結、內容欄位 |

## 建議執行順序與依賴
### 1. 型別與建置先行
```bash
npm run typecheck
npm run build
```

原因：
- `typecheck` 會先抓出 props、emit、computed、ref、泛型與環境變數的問題。
- `build` 會抓出 MPA 入口、靜態資產、Vite 設定與 rollup input 的錯誤。

### 2. 純函式與 service
這類測試最穩定，也最適合先補。

優先順序：
1. `buildTelHref()`
2. `fetchAdoptionAnimals()` 的 fallback / payload 解析
3. `normalizeAnimal()` 的欄位歸一

### 3. composable
`useAdoptionAnimals()` 依賴 service 與 `window.location`，因此測試時要先 mock fetch 與 history。

### 4. component
元件測試最後做，因為它們最依賴樣式與 DOM 結構。

## 輔助函式說明
### `fetchAdoptionAnimals()`
- 建議在測試中 mock `global.fetch`
- 主要測試：
  - 官方來源成功時回傳正規化後陣列
  - 第一個來源失敗後會嘗試下一個來源
  - 全部失敗時會使用 fallback 資料

### `buildTelHref()`
- 純函式，最容易測。
- 應確認空字串回傳空字串，含空白字元的電話會被去空白。

### `useAdoptionAnimals()`
- 建議用最小 fixture 驗證：
  - `counties/kinds/sexes/bodyTypes` 去重與排序
  - 複合篩選是否正確
  - `hydrateFilters()` 是否能讀 query
  - `resetFilters()` 是否清空條件
  - 篩選結果改變時是否會關閉已選取抽屜

### `StoryPage.vue` 內部流程
雖然 `pushJournal()`、`choose()`、`restart()` 沒有抽成獨立模組，但如果未來測試這頁，建議把故事流程拆成可測 helper，否則 UI 測試會太重。

## 撰寫新測試的步驟
### 1. 先補 fixture
建立最小資料，不要直接把正式 payload 塞進測試。

```ts
const animalFixture = {
  id: 'a-1',
  title: '米克斯待認養',
  kind: '狗',
  variety: '米克斯',
  sex: '公',
  bodyType: '中型',
  age: '成犬',
  sterilization: '是',
  bacterin: '否',
  status: '待認養',
  remark: '',
  caption: '',
  openDate: '2026-05-05',
  closeDate: '未提供',
  updateDate: '2026-05-05',
  shelterName: '臺北市動物之家',
  shelterTel: '02-87913254',
  shelterAddress: '臺北市內湖區安美街191號',
  place: '臺北市',
  county: '臺北市',
  imageUrl: '/images/ap.jpg',
  officialUrl: 'https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1'
};
```

### 2. 先測純邏輯，再測 UI
例如先測 `buildTelHref()`，再測 `AnimalCard.vue` 是否真的使用這個 href。

### 3. 測試 query sync 時要留意 history
`useAdoptionAnimals()` 會修改網址，測試前要先把 `window.location.search` 設定好，或在測試中 mock `window.history.replaceState`。

### 4. 測試前清理狀態
避免上一個測試留下的 `fetch` mock、`history` mock、watcher 或 DOM 節點影響下一個測試。

## 範例
### service 純函式
```ts
import { describe, it, expect } from 'vitest';
import { buildTelHref } from '@/services/adoptionApi';

describe('buildTelHref', () => {
  it('removes whitespace from phone numbers', () => {
    expect(buildTelHref('02 8791 3254')).toBe('tel:0287913254');
  });
});
```

### composable
```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdoptionAnimals } from '@/composables/useAdoptionAnimals';

describe('useAdoptionAnimals', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('loads and filters animals', async () => {
    // arrange -> act -> assert
  });
});
```

## 常見陷阱
- `window` 只能在瀏覽器環境使用，不能在模組頂層直接存取。
- 官方 API 的 payload 形狀不固定，不能假設一定是陣列。
- 圖片 fallback 需要測試 `@error`，不然實際上線後圖片斷掉會沒人發現。
- `teleport` 型元件測試時要注意內容被送到 `body`。
- `query sync` 會改網址，測試不清理 history 容易互相干擾。
- `public/images/ap.jpg` 與 `images/ap.jpg` 的路徑要分清楚；正式前端應使用 `public` 提供的可部署路徑。

