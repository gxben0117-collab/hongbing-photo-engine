# 專案架構

## 目前定位

這個 repo 是純靜態站台，不是 Node 或 Python 應用。
目前沒有 `package.json`、`requirements.txt`、`pyproject.toml` 之類的依賴描述檔，也沒有打包流程。

專案可以直接由 GitHub Pages 從根目錄部署。`scripts/` 只提供本地維護檢查，不參與頁面執行。

## 現況結構

- `index.html` - 導覽首頁
- `travel.html` - 寫真旅拍生成器
- `magazine.html` - 雜誌棚拍生成器
- `doll.html` - 公仔生成器
- `fantasy-fashion.html` - 幻想廣告生成器
- `store-ad.html` - 店家活動廣告生成器
- `assets/core-prompt.js` - 共用身份鎖定與保護核心（`window.HB_CORE_PROMPT`）
- `docs/` - 使用方式、核心邏輯、各頁流程、工程維護文件
  - `docs/development-log.md` - 依時間排序的完整開發記錄（唯一時間軸來源）
  - `docs/history/` - 已完成批次的一次性交接/對照文件歸檔（保留但不再更新）
- `scripts/` - 本地檢查與維護腳本
  - `check-static.mjs` - 結構檢查（重複 id、本地連結、inline script 語法）
  - `build-prompt-preview.mjs` - 重建改前/改後完整咒語，比對固定選項組合輸出
  - `audit-100x.mjs` - 重建五頁組裝邏輯，隨機模擬 100×5 組選項，檢查內容問題
- `assets/` - 共用圖片、圖示、未來靜態資產
- `experiments/` - 不屬於正式網站流程的實驗腳本
- `output/` - 使用者生成結果、匯出稿、截圖、`build-prompt-preview.mjs` 的對照輸出
- `temp/` - 實驗稿、臨時交換檔、短期草稿

## 搬移原則

- 根目錄只保留可直接部署的入口檔
- 說明文件集中到 `docs/`
- 檢查與維護腳本集中到 `scripts/`
- 圖片與共用素材放到 `assets/`
- 生成輸出放到 `output/`
- 暫存與測試內容放到 `temp/`

## 維護建議

- 保持 HTML 入口檔在根目錄，避免 GitHub Pages 路徑變動
- 新增的規則或流程先寫進 `docs/`，重大改動記一筆到 `docs/development-log.md`
- 上架前執行 `node scripts\check-static.mjs`；若動到咒語組裝邏輯或新增選項，
  再跑 `node scripts\build-prompt-preview.mjs` 確認 0 diff，以及
  `node scripts\audit-100x.mjs` 確認沒有內容問題
- 若未來加入 JS 模組化或套件管理，再補 `package.json`
- 核心咒語內容受 `docs/core-prompt-contract.md` 保護，未經同意不得修改
- 新增正式 HTML 工具頁時，需同步更新 `index.html`、`scripts/check-static.mjs`、`README.md` 與相關流程文件
