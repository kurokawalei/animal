# Paw & Home — Vue 3 + Vite 版本

流浪動物領養平台 — Vue 3 + Vite

## 🎯 專案概述

**Paw & Home** 是一個完整的流浪動物領養平台，採用**溫暖水彩插畫風格**設計。

### 核心功能

- 🏠 **首頁** — Hero 插畫背景、數字統計動畫、領養 vs 購買對比
- 🐾 **領養動物** — 串接 MOA 台灣政府開放資料 API、22 縣市篩選、分頁瀏覽、詳細資訊 modal、領養申請表單
- 📖 **互動故事** — 劇情遊戲對話「小白的旅程」、多重結局
- 💡 **照顧知識** — 狗狗/貓咪/兔子分類、可展開知識卡片、快速參考表

## 🛠️ 技術棧

- **框架**: Vue 3 (Composition API)
- **構建工具**: Vite 8.0.11
- **樣式**: Tailwind CSS 4.2.4 (via @tailwindcss/vite) + PostCSS + 自訂 CSS
- **路由**: Vue Router
- **API 整合**:
  - MOA 台灣政府開放資料 API (領養動物資訊)
  - 開發環境代理設定 (`/api/moa` → `https://data.moa.gov.tw`)
- **字體**: Nunito + Caveat + Noto Sans TC

## 📦 安裝與執行

```bash
# 安裝依賴
pnpm install

# 開發伺服器 (http://localhost:5173)
pnpm run dev

# 生產編譯
pnpm run build

# 預覽編譯結果
pnpm run preview
```

## 📁 專案結構

```
src/
├── components/          # 可重用元件
│   ├── Navbar.vue
│   ├── Footer.vue
│   ├── AnimalCard.vue   # 動物卡片 (含詳細資訊 modal、領養表單)
│   └── KnowledgeCard.vue
├── pages/              # 頁面元件
│   ├── Home.vue
│   ├── Adopt.vue       # 領養頁面 (MOA 數據、篩選、分頁)
│   ├── Story.vue
│   ├── Care.vue
│   └── NotFound.vue
├── services/
│   └── adoptApi.js     # API 服務 (MOA 數據抓取、欄位映射)
├── router.js           # Vue Router 設定
├── App.vue             # 主應用程式
├── main.js             # 入口檔案
└── style.css           # 全站樣式 + 設計 token
```

## 🎨 設計風格

- **色彩**: 暖杏色 (#E8845A) + 奶油白 (#FDF8F0) + 草地綠 (#7BAE7F) + 天空藍 (#87CEEB)
- **字體**: Nunito (標題) + Noto Sans TC (中文) + Caveat (手寫)
- **動畫**: 輕柔 fade-in、卡片浮起、逐字打字機效果
- **佈局**: 斜切分區、不對稱有機佈局、手繪邊框感

## 🐾 領養功能詳述

### 動物卡片 (AnimalCard.vue)

每個動物卡片顯示以下資訊：

- 名稱、品種、所在地、物種、品種欄位、毛色、性別
- 描述 (最多 2 行顯示，超過部分省略)
- 刊登日期、開放日期、連絡電話

**互動功能：**

- ❤️ 愛心收藏按鈕 (點擊可切換最愛狀態)
- 「了解更多」按鈕 → 開啟詳細資訊 modal
- 「申請領養」按鈕 → 開啟領養申請表單

**詳細資訊 Modal：**

- 完整的動物資訊網格顯示
- 完整的描述文本 (保留原始格式與換行)
- 「申請領養」CTA 按鈕

### 篩選與分頁 (Adopt.vue)

**篩選選項：**

- 🐶 動物類型 (全部、狗、貓)
- 📍 城市 (全部、22 個台灣縣市)
- 📏 體型 (全部、小型、中型、大型)

**分頁功能：**

- 每頁顯示 9 項
- 滑動窗口頁碼顯示 (當前頁碼及後續最多 10 個頁碼)
- 上一步/下一步 導航按鈕

**搜尋行為調整：**

- 已移除畫面上的顯示「🔍 搜尋」按鈕，搜尋改以輸入框為主；使用者可在輸入框按下 `Enter` 來執行搜尋。清除按鈕（✕）仍保留以便快速清空關鍵字。

### MOA 數據整合 (adoptApi.js)

**API 端點：**

```
https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1
```

**欄位映射：**

- `animal_id` → id
- `animal_name` → name
- `animal_kind` → species (標準化為 'dog'/'cat')
- `animal_Variety` / `animal_variety` → variety (品種欄位)
- `animal_color` → color (毛色)
- `animal_sex` → sex (性別，標準化為 公/母)
- `animal_remark` → description (描述)
- `shelter_update` / `publish_date` → postedAt (刊登日期)
- `animal_opendate` → opendate (開放日期)
- `shelter_tel` / `contact_tel` → contactPhone (連絡電話)
- `shelter_address` → region (所在地)
- `album_file` → image (照片)

**特殊處理：**

- 城市名稱標準化：處理臺/台差異、全名/簡稱轉換
- 物種辨識：根據 `animal_kind` 和 `animal_Variety` 判斷
- 性別標準化：F/女/female → 母，M/公/male → 公

## 🚀 部署

專案已編譯至 `dist/` 目錄，可直接部署至任何靜態伺服器。

```bash
# 編譯
pnpm run build

# 部署 dist 目錄
```

## 📝 遷移筆記

本版本從 React + TypeScript 遷移至 Vue 3 + JavaScript，保留所有功能和設計風格：

- ✅ 所有頁面和元件已遷移
- ✅ 設計風格完全保留
- ✅ MOA 台灣政府開放資料 API 整合
- ✅ 22 縣市篩選功能實作
- ✅ 9 項分頁瀏覽功能
- ✅ 詳細資訊 modal 及領養表單
- ✅ 響應式設計支援

## 🔧 Tailwind CSS + PostCSS 配置

本專案使用 `@tailwindcss/vite` 插件，因此樣式入口應使用：

```css
@import "tailwindcss";
```

**不要使用 `@tailwind` 指令** (與 PostCSS 插件不相容)

開發環境：`style.css` 中引入 Tailwind，自動熱更新。

## 📧 聯絡方式

- 📧 hello@pawadopt.com
- 📱 0800-000-000
- 🕐 週一至週五 10:00-18:00

---

**給毛孩一個家。領養代替購買。** 🐾
