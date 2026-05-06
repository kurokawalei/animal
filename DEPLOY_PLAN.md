# 部署整理：README 與環境設定

## Summary
把目前已完成的 `Vue 3 + Vite` 多頁式專案，整理成可交付、可部署、可接手的正式版本。  
這次重點不是再改 UI，而是補齊部署說明、環境變數範例、執行方式與上線檢查，讓任何人 clone 後都能直接跑起來。

## Key Changes
- 新增 [`README.md`](/mnt/d/animal/README.md)
  - 專案簡介與功能總覽
  - 本地開發流程：`npm install`、`npm run dev`
  - 建置與預覽：`npm run build`、`npm run preview`
  - 頁面入口說明：首頁、領養探索、故事、自評
  - 官方領養 API 串接說明與 fallback 行為
  - 部署建議：靜態站可直接丟到常見平台
- 新增 [`.env.example`](/mnt/d/animal/.env.example)
  - `VITE_ADOPTION_API_URL` 作為領養 API 覆寫入口
  - 說明開發時可走本地 proxy，正式環境可改成同源代理或直連官方來源
- 補上部署注意事項
  - `Vite` 多頁輸出對應的入口頁面
  - 靜態資源位於 `public/`
  - 領養 API 無法連線時仍有 fallback 資料，不會讓頁面空白
- 規格上把「部署」定義成靜態前端可交付版本，不額外加入後端服務或登入流程

## Test Plan
- 驗證 `README.md` 的步驟可讓新環境成功啟動專案
- 驗證 `.env.example` 的變數名稱與 `src/services/adoptionApi.ts` 一致
- 驗證 clone 後只需 `npm install` + `npm run build` 即可產出可部署靜態檔
- 驗證多頁入口仍可正常輸出：`index.html`、`adopt.html`、`story.html`、`test.html`
- 驗證 API 未設定或失敗時，前端仍能以 fallback 資料完成展示

## Assumptions
- 部署目標先以「靜態網站託管」為主，不先鎖定特定平台。
- 先不加入 Docker、CI/CD 或自動部署設定，避免把焦點從可交付文件拉走。
- `.env.example` 只提供必要的 API 覆寫欄位，不預設一堆未使用變數。
- 現有 build 已可成功，這次主要補齊交接與上線文件。
