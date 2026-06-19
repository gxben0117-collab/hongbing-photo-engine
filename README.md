# Red Bing Photo Travel Engine

這是一個純靜態的 AI 咒語產生器專案，現階段沒有 Node / Python 依賴，也沒有 build pipeline。
入口頁負責導覽，三個工具頁負責輸出最終英文咒語。

## 專案結構

- `index.html` - 入口頁與工具導覽
- `travel.html` - 寫真旅拍風格咒語產生器
- `magazine.html` - 雜誌棚拍風格咒語產生器
- `doll.html` - 公仔萌工作室
- `docs/` - 流程、核心邏輯、使用說明
- `assets/` - 未來共用靜態資源
- `output/` - 生成結果與匯出內容
- `temp/` - 暫存與實驗檔

## 設計原則

- 介面顯示層維持繁體中文
- 邏輯層 key 使用英文
- 最終輸出咒語使用英文
- 需要追查時，才回到中文對照文件

## 文件索引

- [文件總覽](docs/README.md)
- [使用方式](docs/usage.md)
- [核心咒語邏輯](docs/core-logic.md)
- [寫真旅拍流程](docs/travel-workflow.md)
- [雜誌棚拍流程](docs/magazine-workflow.md)
- [公仔工作流程](docs/doll-workflow.md)
- [專案架構](docs/architecture.md)

## 執行方式

直接打開 `index.html`，或使用 GitHub Pages 網址。
這個專案不需要安裝套件，也沒有額外啟動命令。

## 維護原則

- 根目錄保留可直接部署的入口檔
- 新素材放 `assets/`
- 匯出內容放 `output/`
- 臨時檔放 `temp/`
- 文件集中放 `docs/`
