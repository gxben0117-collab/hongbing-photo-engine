# 專案架構

## 目前定位

這個 repo 是純靜態站台，不是 Node 或 Python 應用。
目前沒有 `package.json`、`requirements.txt`、`pyproject.toml` 之類的依賴描述檔，所以也沒有獨立 build / lint / test 流程可以執行。

## 現況結構

- `index.html` - 導覽首頁
- `travel.html` - 寫真旅拍生成器
- `magazine.html` - 雜誌棚拍生成器
- `doll.html` - 公仔生成器
- `docs/` - 使用方式、核心邏輯、各頁流程文件
- `assets/` - 共用圖片、圖示、未來靜態資產
- `output/` - 使用者生成結果、匯出稿、截圖
- `temp/` - 實驗稿、臨時交換檔、短期草稿

## 搬移原則

- 根目錄只保留可直接部署的入口檔
- 說明文件集中到 `docs/`
- 圖片與共用素材放到 `assets/`
- 生成輸出放到 `output/`
- 暫存與測試內容放到 `temp/`

## 維護建議

- 保持 HTML 入口檔在根目錄，避免 GitHub Pages 路徑變動
- 新增的規則或流程先寫進 `docs/`
- 若未來加入 JS 模組化或套件管理，再補 `package.json`
