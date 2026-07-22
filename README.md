# Photo Prompt Engine

這是一個純靜態的 AI 咒語產生器專案。根目錄可直接由 GitHub Pages 部署，不需要前端打包流程，也沒有必要安裝 npm 或 Python 套件。

## 版本

v4.9 起持續迭代中；完整逐日開發記錄見 [docs/development-log.md](docs/development-log.md)。

v4.3 基礎重點：

- 統一身份鎖定核心
- 統一臉部幾何鎖定
- 統一真人骨架規則
- 統一光線一致化規則
- 補強 travel / magazine / fantasy 的身份保持

v4.3 之後陸續完成（詳見開發日誌）：

- travel / magazine / fantasy 大量擴充選項（姿勢、服裝、材質、背景、光線）
- travel / magazine / fantasy 的「生成 → 顯示 → 複製」操作模式統一
  （stale 保護、套用即顯示、按鈕配色一致）
- 三頁「隨機套用」改為元素級獨立隨機（每個欄位各自抽選再動態組合）
- 建立 `build-prompt-preview.mjs`（0-diff 迴歸檢查）與 `audit-100x.mjs`
  （500 次隨機模擬內容稽核）兩個自動化驗證腳本

## 專案定位

- `index.html` 是入口與工具導覽頁。
- 六個工具頁各自包含 UI、選項資料與咒語組裝邏輯。
- `assets/core-prompt.js` 集中管理 v4.3 共用身份鎖定、臉部幾何、真人骨架、鏡頭重建、光線一致、膚質、負面詞與輸出品質規則。
- `scripts/check-static.mjs` 是目前唯一正式檢查腳本。
- `docs/` 保存規格、流程、核心 prompt 契約與工程說明。
- `assets/` 預留給正式共用靜態資源。
- `output/` 與 `temp/` 是本地產物與暫存區，不應提交生成內容。
- `experiments/` 保存不屬於正式網站流程的實驗腳本。

## 正式頁面

- `travel.html` - 寫真旅拍風格咒語產生器
- `magazine.html` - 雜誌棚拍風格咒語產生器
- `doll.html` - 公仔萌工作室
- `fantasy-fashion.html` - 幻想廣告咒語產生器
- `anime-hero.html` - 動漫變身／機甲／聖衣／替身合鏡咒語產生器
- `store-ad.html` - 店家活動廣告產生器

## 建議資料夾分工

```text
.
├─ index.html                  # GitHub Pages 首頁
├─ travel.html                 # 工具頁: 寫真旅拍
├─ magazine.html               # 工具頁: 雜誌棚拍
├─ doll.html                   # 工具頁: 公仔
├─ fantasy-fashion.html        # 工具頁: 幻想廣告
├─ store-ad.html               # 工具頁: 店家廣告
├─ assets/                     # 正式靜態資源與 core-prompt.js
├─ docs/                       # 規格與維護文件
├─ experiments/                # 實驗稿與非正式工具
├─ output/                     # 本地匯出結果, 僅保留 .gitkeep
├─ scripts/                    # 正式檢查與維護腳本
└─ temp/                       # 本地暫存與實驗輸出, 僅保留 .gitkeep
```

## 文件索引

完整索引見 [docs/README.md](docs/README.md)；最重要的兩份是：

- [開發日誌](docs/development-log.md) — 現況與完整歷史記錄
- [核心咒語保護契約](docs/core-prompt-contract.md) — 改咒語前必看

其餘：[使用方式](docs/usage.md)｜[核心咒語邏輯](docs/core-logic.md)｜
[底層保護核心](docs/shared-protection-core.md)｜[工程維護規劃](docs/engineering.md)｜
[寫真旅拍流程](docs/travel-workflow.md)｜[雜誌棚拍流程](docs/magazine-workflow.md)｜
[幻想廣告分類表](docs/fantasy-ad-workflow.md)｜[公仔工作流程](docs/doll-workflow.md)｜
[專案架構](docs/architecture.md)｜[完整程式規格邏輯文件](docs/full-program-spec.md)｜
[歷史交接文件歸檔](docs/history/)

## 執行方式

直接打開 `index.html`，或使用 GitHub Pages 網址。

本專案沒有 `package.json`、`requirements.txt` 或 `pyproject.toml`。如果未來引入打包工具或 Python 自動化腳本，需同步補上正式依賴檔與檢查命令。

## 上架前檢查

需要本機有 Node.js：

```powershell
node scripts\check-static.mjs
git diff --check
```

`check-static.mjs` 目前檢查：

- 必要 HTML 與資料夾是否存在
- HTML 是否有重複 `id`
- 本地連結是否存在
- inline JavaScript 語法是否可解析

若改動涉及咒語組裝邏輯或新增/調整選項，再加跑：

```powershell
node scripts\build-prompt-preview.mjs   # 固定選項組合，改前/改後 0 diff 迴歸檢查
node scripts\audit-100x.mjs             # 五頁各隨機 100 組選項，檢查內容問題
node scripts\validate-preset-refs.mjs   # 三頁一鍵套用/預設連動物件引用的選項值是否都存在
```

## 維護原則

- 根目錄只放可直接部署的正式入口與工具頁。
- 正式素材放 `assets/`。
- 共用 prompt 核心放 `assets/core-prompt.js`，頁面特色 prompt 仍保留在各工具頁。
- 產出結果放 `output/`，不要提交生成檔。
- 臨時檔、測試輸出、影片剪輯暫存放 `temp/`，不要提交。
- 正式維護腳本放 `scripts/`。
- 實驗影片腳本放 `experiments/video/`。
- 文件集中放 `docs/`。
- 修改身份鎖定、臉部幾何、頭身協調、姿態自然性、光線一致性前，先確認 `docs/core-prompt-contract.md` 與 `docs/shared-protection-core.md`。

## 目前整理狀態

- `output/` 已用 `.gitignore` 排除生成內容，只保留 `.gitkeep`。
- `temp/` 已用 `.gitignore` 排除暫存內容，只保留 `.gitkeep`。
- `scripts/check-static.mjs` 是正式檢查腳本。
- `scripts/guizhou_*` 與 `scripts/make_guizhou_*` 已移至 `experiments/video/`。
