# README

## 專案介紹
`animal-adoption-vue` 是一個以「流浪動物領養」為核心的前端網站。它不是單純的資訊站，而是把三個使用情境放在同一個體驗裡：

1. 先進入故事，讓使用者理解流浪、棄養與責任。
2. 再用官方領養資料快速搜尋、比較與聯絡收容所。
3. 如果還不確定是否準備好，先透過自評整理照護觀念。

目前專案已改成 `Vue 3 + Vite` 的多頁式架構，保留四個獨立入口：

- `index.html`：首頁
- `adopt.html`：領養探索
- `story.html`：互動故事
- `test.html`：領養自評

## 技術棧
| 類別 | 技術 | 說明 |
| --- | --- | --- |
| UI 框架 | Vue 3 | 使用 `<script setup>` 與 Composition API |
| 建置工具 | Vite 6 | 多頁式輸出、開發伺服器與靜態建置 |
| 語言 | TypeScript 5 | 全站嚴格型別檢查，頁面與服務層共享型別 |
| 型別檢查 | vue-tsc | 檢查 `.vue` 與 `.ts` 模組一致性 |
| 資料來源 | 農業部官方動物認領養資料 | 領養探索的主要資料源 |
| 樣式 | 純 CSS | 全站共用與頁面專屬樣式集中在 `src/styles/main.css` |

## 快速開始
```bash
npm install
cp .env.example .env
npm run dev
```

如果你暫時不需要覆寫官方 API，`.env` 可以先不建立，專案會優先嘗試 Vite dev proxy，再回退到官方來源與前端 fallback 資料。

## 常用指令
| 指令 | 用途 | 輸出 / 效果 |
| --- | --- | --- |
| `npm install` | 安裝依賴 | 建立 `node_modules/` |
| `npm run dev` | 啟動開發環境 | 預設開在 Vite dev server |
| `npm run build` | 產生正式版 | 輸出 `dist/`，包含四個頁面 |
| `npm run preview` | 預覽正式版 | 以 `dist/` 為基礎啟動本機預覽 |
| `npm run typecheck` | 型別檢查 | 不產出檔案，只檢查編譯正確性 |

## 文件索引
| 文件 | 內容 |
| --- | --- |
| `docs/ARCHITECTURE.md` | 專案架構、目錄用途、資料流、整合方式 |
| `docs/DEVELOPMENT.md` | 開發規範、命名規則、模組分工、JSDoc、計畫歸檔流程 |
| `docs/FEATURES.md` | 功能清單、實作行為、參數、錯誤與狀態 |
| `docs/TESTING.md` | 測試規範、驗證順序、常見陷阱 |
| `docs/CHANGELOG.md` | 更新日誌與主要版本變更 |

## 頁面導覽
| 頁面 | 主要責任 | 核心元件 / 資料 |
| --- | --- | --- |
| 首頁 | 建立沉浸感與導流 | `HomePage.vue`、`AnimalCard.vue`、`AnimalDetailDrawer.vue` |
| 領養探索 | 搜尋、篩選、比較、撥號 | `AdoptPage.vue`、`AdoptionFilters.vue`、`useAdoptionAnimals.ts` |
| 故事 | 輕量互動敘事 | `StoryPage.vue`、`storyArc.ts` |
| 自評 | 領養準備度檢核 | `TestPage.vue`、`quiz.ts` |

## 部署摘要
這是一個靜態前端專案，不需要資料庫或後端應用伺服器即可部署。正式環境至少要確認以下事項：

- `dist/` 由 `npm run build` 產出。
- `public/images/` 的靜態資源要一起部署。
- 若正式環境要覆寫官方資料來源，可以設定 `VITE_ADOPTION_API_URL`。
- `adopt.html` 的官方資料抓取有 fallback，但正式站仍應盡量讓官方 API 可連線。

