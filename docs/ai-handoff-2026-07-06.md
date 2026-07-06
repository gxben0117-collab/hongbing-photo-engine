# AI 交接文件 — 2026-07-06（Claude Code → Codex）

## 背景

Owner 要求優化「紅兵寫真旅拍引擎」，Claude Code 已完成分析（本文件即結論與待辦），
因 token 限制由 Codex 接手執行。**動工前必讀：**

1. `C:\AIProjects\000AI-Vault\INDEX.md`（工作區規範）
2. `docs/core-prompt-contract.md`（核心咒語保護契約 — 改 prompt 文字屬高風險，須 owner 確認改前/改後對照才能套用）

## Codex 執行狀態 — 2026-07-06

- 任務 A 已完成：版本資料夾已移入 `versions/`；歷史殘留的員工借支、家庭水電瓦斯記帳相關檔案已在 owner 確認後清除。
- 誤放在本專案主線的 `tohoku-20260711.html` 與路線圖已移至 `output/tohoku-20260711/` 暫存，不再出現在首頁或靜態檢查清單。
- `node scripts\check-static.mjs` 已通過。
- 任務 B 第一波已在 owner 確認 `docs/b-prompt-review-2026-07-06.md` 後套用：B1 保守核心瘦身，B2 travel / magazine 插畫媒材條件化。`fantasy-fashion.html` 暫不動。
- 後續若要再改咒語文字、段落順序、預設值與 UI 流程，仍需依 `docs/core-prompt-contract.md` 先提供改前/改後對照並取得 owner 確認。

## Owner 已拍板的決策（不要重新提議）

| 決策 | 內容 |
| --- | --- |
| 目標模型 | 咒語**只給 ChatGPT 出圖用**。不需要做 Midjourney / SD 的多模型輸出切換版本。 |
| 「No X」負面句 | 對 ChatGPT 有效，**維持現狀**，不列入優化。 |
| `Realistic adult female anatomy` 寫死女性 | **本產品即為女性設計，不要改**（core-prompt.js:54）。 |
| 咒語優化兩項（見任務 B） | 要做，但**先給 owner 改前/改後咒語對照，owner 確認後才套用**。 |

## 現況數據（Claude 已實測）

- 一份 travel 咒語輸出約 6,500–7,000 字元；共用核心佔 4,848 字元（約 70%）。
- 咒語組裝邏輯：`travel.html` 約 L1489–1535（`generateBtn` click handler，`sections` 陣列 join `'\n\n⸻\n\n'`）。
- 共用核心：`assets/core-prompt.js`（`window.HB_CORE_PROMPT`，v4.3）。
- 該 repo git 有未提交修改：`index.html`、`scripts/check-static.mjs`、`.gitignore`，另有大量 untracked。

---

## 任務 A：工程收尾（低風險，可直接做）

### A1. 版本資料夾整併

Vault 規則：舊版收專案內 `versions/`，主版本只有根目錄一份。目前有三份完整副本：

- `backup_original/`
- `紅兵寫真旅拍引擎_v4.3/`
- `_vercel_deploy_stage_20260704/`

步驟：
1. **先 diff 根目錄 vs `紅兵寫真旅拍引擎_v4.3/`**（五個工具頁 + core-prompt.js），確認根目錄是最新版、無遺漏變更，有 drift 先回報 owner 再動。
2. 建 `versions/`，三個資料夾移入（或確認 `backup_original/` 本來就被 .gitignore 排除則維持不進 git）。
3. 根目錄只留正式入口與五個工具頁。

### A2. 清理歷史殘留（動手前先向 owner 確認一次）

`CLAUDE.md` 記載「員工借支」「家庭水電瓦斯記帳」已拆分到 `001專案完成區`，本專案內為歷史殘留：

- `employee-advance.html`、`household-ledger.html`
- `assets/employee-advance-data.js`、`assets/household-ledger-data.js`
- `scripts/export_employee_advance_data.py`、`scripts/export_household_ledger_data.py`、`scripts/read_biff8_xls.py`、`scripts/__pycache__/`
- `temp/performance-analysis/藍寶髮藝*.xls`（三個業績表，與本專案無關）

步驟：先確認 `001專案完成區` 對應專案內確實已有同等檔案，才刪除本地殘留；刪除屬破壞性操作，**列出清單請 owner 點頭後再執行**。

### A3. git 收尾

1. 檢視三個已修改檔案的 diff，內容合理則提交（訊息用英文祈使句，遵循該 repo 既有風格）。
2. untracked 檔案分類：該進 git 的加入、暫存/產物補進 `.gitignore`。
3. `assets/tohoku-20260711-route-map.png` 是產出素材，確認是否該收 `output/` 或忽略。

### A4. 驗證與收工

1. 跑 `node scripts\check-static.mjs`，全過。
2. 更新專案 `CLAUDE.md`「目前狀態與下一步」。
3. 回寫 Vault `10-專案總覽/專案索引.md`（若專案狀態有變）。

---

## 任務 B：咒語優化（高風險 — 保護契約管制，須 owner 確認對照後才套用）

### B1. 核心重複精簡（目標：核心瘦身 30–40%）

問題：核心佔咒語 70%，重複嚴重，稀釋 ChatGPT 對主題/風格/服裝（每次真正變化的內容）的注意力。

已知重複點（`assets/core-prompt.js`）：
- `CORE_IDENTITY_LOCK` 內「Identity Preservation Priority Above ...」連續 7 行 → 可合併為 1–2 行（例：`Identity preservation has priority above costume, pose, body styling, editorial style, materials, environment and advertising style.`）。
- `CORE_IDENTITY_LOCK` 的 No 系列與 `CORE_NEGATIVE_PROMPT` 幾乎原文重複（No face swap / No identity drift / No AI beauty face / No influencer face / No celebrity face / No template face）→ 保留一處。
- `CORE_REALISTIC_ANATOMY` 的 No 系列（extra limbs / extra fingers / broken hands）與 `CORE_NEGATIVE_PROMPT` 重複 → 保留一處。

流程（必守）：
1. 產出精簡版核心，生成「改前 vs 改後」完整咒語對照（同一組選項）給 owner。
2. Owner 用 ChatGPT 實測 A/B（各出 5–10 張，比「家人朋友一眼認得出」的身份保持度）。
3. Owner 點頭後才改 `core-prompt.js`；改動需同步檢查五個工具頁（travel / magazine / doll / fantasy-fashion / store-ad）皆引用同一核心。

### B2. 插畫類媒材與寫實核心的衝突條件化（四項裡最優先）

問題：`travel.html` 選插畫類媒材時，核心仍無條件塞入 `CORE_SKIN_TEXTURE`（Visible fine pores / Realistic skin texture）等寫實指令，與「水彩插畫」等媒材直接矛盾，插畫感出不來。

插畫類 `MEDIA_STYLES` key（travel.html）：`watercolor_travel`、`postcard_illustration`、`animated_travel`、`oil_travel_portrait`。
寫實類（維持現狀）：`cinematic_realistic`、`retro_film`、`travel_magazine`。

做法：
1. 在 `generateBtn` handler 的 `sections` 組裝處，依 mediaKey 判斷：插畫類時**跳過** `CORE_SKIN_TEXTURE`（在 `humanCore` 內，需拆開或提供無膚質版核心），並評估是否同時弱化 `CORE_CAMERA_RECONSTRUCTION` 的「Commercial photography camera logic」等攝影字句。
2. 身份鎖定、臉部幾何、骨架比例約束**照常保留**（插畫也要像本人）。
3. 檢查 `magazine.html`、`fantasy-fashion.html` 是否有同樣的媒材選項與同樣的衝突，一併處理。
4. 同 B1 流程：先給 owner 改前/改後對照，確認後才套用。

---

## 驗收清單

- [x] `node scripts\check-static.mjs` 全過
- [ ] 根目錄五個工具頁在瀏覽器開啟、按「生成」、「一鍵複製」皆正常
- [x] B1/B2 每一項改動，owner 都看過改前/改後咒語對照並同意
- [ ] 未經同意不得改動：咒語段落順序、UI 操作流程、預設值聯動（契約規定）
- [x] 收工前更新 `CLAUDE.md` 狀態欄與本文件（標記完成項）
