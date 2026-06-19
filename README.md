# Red Bing Photo Travel Engine

這是一個純靜態的 AI 咒語產生器專案。入口頁負責導覽，三個工具頁負責輸出最終英文咒語。

目前沒有前端打包流程，也沒有需要安裝的套件。專案可直接由 GitHub Pages 從根目錄部署。

## 專案結構

- `index.html` - 入口頁與工具導覽
- `travel.html` - 寫真旅拍風格咒語產生器
- `magazine.html` - 雜誌棚拍風格咒語產生器
- `doll.html` - 公仔萌工作室
- `docs/` - 流程、核心邏輯、工程維護文件
- `scripts/` - 本地檢查與維護腳本
- `assets/` - 未來共用靜態資源
- `output/` - 生成結果與匯出內容
- `temp/` - 暫存與實驗檔

## 設計原則

- 介面顯示層維持繁體中文
- 邏輯層 key 使用英文
- 最終輸出咒語使用英文
- 核心咒語規範未經 owner 同意不得修改
- 需要追查時，才回到中文對照文件

## 文件索引

- [文件總覽](docs/README.md)
- [使用方式](docs/usage.md)
- [核心咒語邏輯](docs/core-logic.md)
- [核心咒語保護契約](docs/core-prompt-contract.md)
- [工程維護規劃](docs/engineering.md)
- [寫真旅拍流程](docs/travel-workflow.md)
- [雜誌棚拍流程](docs/magazine-workflow.md)
- [公仔工作流程](docs/doll-workflow.md)
- [專案架構](docs/architecture.md)

## 執行方式

直接打開 `index.html`，或使用 GitHub Pages 網址。

## 靜態檢查

不需要安裝套件。若本機有 Node.js，可以在上架前執行：

```powershell
node scripts\check-static.mjs
```

檢查內容包含入口檔、必要目錄、重複 id、本地連結與 inline JavaScript 語法。

## 維護原則

- 根目錄保留可直接部署的入口檔
- 新素材放 `assets/`
- 匯出內容放 `output/`
- 臨時檔放 `temp/`
- 文件集中放 `docs/`
- 檢查腳本集中放 `scripts/`
- 修改 prompt 文字、輸出段落或預設聯動前，先確認 `docs/core-prompt-contract.md`
