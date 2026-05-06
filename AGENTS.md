# AGENTS.md

## 專案概述
流浪動物資訊網 — Vue 3 + Vite 多頁式前端，結合沉浸式故事、自評引導與農業部官方動物認領養資料串接。

這個專案目前沒有後端應用伺服器、資料庫或登入系統。所有核心互動都發生在瀏覽器端，主要資料來源是官方領養 API 與前端本地的敘事資料。

## 常用指令
| 指令 | 用途 | 何時使用 |
| --- | --- | --- |
| `npm install` | 安裝專案依賴 | 第一次開專案、更新 `package-lock.json` 後 |
| `npm run dev` | 啟動 Vite 開發伺服器 | 開發、除錯、檢查即時更新 |
| `npm run build` | 產出正式靜態檔 | 部署前、驗證 MPA 輸出是否正常 |
| `npm run preview` | 預覽 build 產物 | 想確認 `dist/` 的最終行為時 |
| `npm run typecheck` | 執行 `vue-tsc --noEmit` | 改動型別、composable、service、頁面前後都應跑 |

## 關鍵規則
- 這是 `Vite MPA`，不是 `vue-router` SPA。頁面入口固定是 `index.html`、`adopt.html`、`story.html`、`test.html`，跨頁導覽要維持 HTML 檔案間的直接連結。
- 官方動物認領養資料是唯一正式資料來源；`fetchAdoptionAnimals()` 的 fallback 只用來避免畫面壞掉，不應被當成產品內容或測試資料來源。
- 目前沒有認證、授權、JWT、API middleware、資料庫 schema。若未來加入後端，相關規則必須另寫在後端文件，不要把不存在的機制寫進前端實作。
- 共享視覺與版面規則集中在 `src/styles/main.css`，頁面級差異用 `.home-page`、`.adopt-page`、`.story-page`、`.test-page` 控制，不要在單一元件內散落重複 CSS。
- 新功能開發先建立 `docs/plans/YYYY-MM-DD-<feature-name>.md`，完成後移到 `docs/plans/archive/`，並同步更新 `docs/FEATURES.md` 與 `docs/CHANGELOG.md`。
- 所有跨檔案共用的資料型別都放在 `src/types/`；跨頁重用的資料處理放 `src/services/` 或 `src/composables/`，不要把資料正規化邏輯塞進頁面元件。

## 詳細文件
- `./docs/README.md` — 項目介紹、快速開始、技術棧、常用指令索引
- `./docs/ARCHITECTURE.md` — 架構、目錄結構、資料流、整合邊界
- `./docs/DEVELOPMENT.md` — 開發規範、命名規則、模組系統、計畫歸檔流程
- `./docs/FEATURES.md` — 功能清單、行為描述、狀態與錯誤情境
- `./docs/TESTING.md` — 測試規範、驗證順序、常見陷阱
- `./docs/CHANGELOG.md` — 更新日誌與主要變更摘要

