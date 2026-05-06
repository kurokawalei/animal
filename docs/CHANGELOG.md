# CHANGELOG

## 2026-05-05

### Changed
- 專案從舊式靜態站重構為 `Vue 3 + Vite` 的多頁式應用。
- 首頁改成沉浸式入口，不再是一般制式資訊卡 layout。
- 故事頁改成章節式對話流程，加入 trust 值、journal 與結局導流。
- 領養頁改成官方資料搜尋與詳情抽屜，支援 query sync 與撥號連結。
- 自評頁改成四題領養準備度檢核，結果會導向領養探索或故事頁。
- 全站共用樣式改寫成故事優先的視覺系統。

### Added
- `AGENTS.md` 作為專案工作規則與文件入口。
- `docs/README.md`、`docs/ARCHITECTURE.md`、`docs/DEVELOPMENT.md`、`docs/FEATURES.md`、`docs/TESTING.md`。
- `docs/plans/archive/` 作為完成計畫的歸檔位置。
- `.env.example`，提供 `VITE_ADOPTION_API_URL` 環境變數範例。
- 農業部官方動物認領養資料適配層與 fallback 資料。
- 領養頁的篩選器、卡片、詳情抽屜與電話撥號。

### Notes
- 目前專案沒有後端、資料庫或認證系統，因此文件只記錄前端資料流與外部 API 整合。
- `DEPLOY_PLAN.md` 屬於已完成的計畫文件，後續應以 `docs/plans/archive/` 中的歸檔版本為主。

