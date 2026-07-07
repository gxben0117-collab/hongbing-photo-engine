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
- Magazine 妝容 / 珠寶配飾已整理：妝容最多 2 個、珠寶配飾最多 2 個；黑金高訂 preset 改為精簡推薦，不再同時套滿多個妝容與華麗珠寶套組。
- 第二波 R1/R2 已完成：`temp/` 只保留 `.gitkeep` 與 `style-contact-sheets/`；東北行程暫存已集中到 `output/tohoku-20260711/`；五個工具頁已用 Chrome 開頁測試「生成 / 複製」皆正常，B2 條件化驗證通過。
- 後續若要再改咒語文字、段落順序、預設值與 UI 流程，仍需依 `docs/core-prompt-contract.md` 先提供改前/改後對照並取得 owner 確認。

## 第二波待辦 — 2026-07-06（Claude 核對後的收尾項，Codex 執行）

Claude Code 已逐項核對第一波成果（git、檔案系統、check-static 重跑全過），
以下是**確認沒做完**的部分。只做這三項，其他不要動。

### R1. temp/ 清理（owner 已同意，可直接刪，不用再問）

與本專案無關的業務/記帳暫存檔，**確認 `001專案完成區` 對應專案（員工借支、家庭水電瓦斯記帳）內已有同等資料後刪除**；若找不到對應資料，該檔先搬到對應專案再刪本地：

| 目標 | 動作 |
| --- | --- |
| `temp/performance-analysis/`（藍寶髮藝業績表 ×5） | 刪除整個資料夾 |
| `temp/藍寶髮藝員工借支表.xls`、`.xlsx` | 刪除 |
| `temp/寶貝家庭水電瓦斯支出紀錄.xlsx` | 刪除 |
| `temp/employee-advance.zip`、`temp/expense-workbook.zip` | 刪除 |
| `temp/employee-advance-unpacked/`、`temp/expense-workbook-unpacked/` | 刪除整個資料夾 |
| `temp/260711東北星空銀河纜車5日.pdf`、`temp/tohoku-*.html`、`temp/travel4u-*.html`、`temp/tour_content_*` | **搬到** `output/tohoku-20260711/`（東北行程資料已集中在那），不要刪 |
| `temp/style-contact-sheets/` | 保留（本專案風格對照素材） |
| `temp/.gitkeep` | 保留 |

### R2. 五個工具頁瀏覽器實測（驗收清單未勾的那項）

逐頁開啟 travel / magazine / doll / fantasy-fashion / store-ad：

1. 每頁按「生成」→ 有輸出、按「一鍵複製」→ 正常。
2. **重點驗證 B2 條件化**：
   - travel 選「水彩旅行插畫」媒材 → 輸出應含【插畫媒材比例重建系統】、**不含**【真實膚質系統】（Visible fine pores）。
   - travel 選「電影感寫實」媒材 → 輸出應維持原樣（含【真實膚質系統】）。
   - magazine 選任一插畫媒材（如 manga_cover）→ 應含【膚質質感｜插畫媒材版】；選寫實媒材 → 維持原樣。
3. 測試結果寫回本文件驗收清單（把那格勾起來，或記錄失敗項）。

### R3. 明確暫緩（不要做）

- B1 第二刀瘦身（往 30–40% 目標）與 `fantasy-fashion.html` 條件化：**等 owner 用 ChatGPT A/B 實測第一波身份保持度後再決定**。
- 其他任何咒語文字改動：依保護契約，一律先出對照、owner 確認。

完成後：更新本文件驗收清單與 `CLAUDE.md` 狀態欄，git 提交。

### R1/R2 執行結果 — 2026-07-06

- R1 完成：確認 `001專案完成區\員工借支` 已有來源檔；`001專案完成區\家庭水電瓦斯記帳` 已補上 `source/寶貝家庭水電瓦斯支出紀錄.xlsx` 後，清除本專案 temp 內業務/記帳暫存。
- R1 完成：`temp/260711東北星空銀河纜車5日.pdf`、`temp/tohoku-*.html`、`temp/travel4u-*.html`、`temp/tour_content_*` 已搬到 `output/tohoku-20260711/`。
- R2 完成：Chrome 實測 `travel.html`、`magazine.html`、`doll.html`、`fantasy-fashion.html`、`store-ad.html`，每頁「生成」皆有輸出，「一鍵複製 / 複製全部」皆正常。
- R2 B2 條件化通過：travel 水彩含【插畫媒材比例重建系統】且不含【真實膚質系統】/`Visible fine pores`；travel 電影感寫實維持【真實膚質系統】與 `Visible fine pores`；magazine 漫畫含【膚質質感｜插畫媒材版】；magazine 寫實維持【真實膚質系統】。

### 任務 C 執行結果 — 2026-07-07

- Owner 已同意正式套用 C0 / C1 / C2。
- C0 完成：新增 `scripts/build-prompt-preview.mjs`，可產出 base vs worktree 咒語對照包。
- C1 完成：核心 blocks 總量由 5,162 降至 4,099；保留段落標題與順序，只合併同義句。
- C2 完成：`fantasy-fashion.html` 紙雕 / 水彩 / 水墨類材質改走 `fantasyCore.illustrationSkeleton`，攝影 / 寫實材質維持原真實膚質核心。
- 驗證完成：`node scripts\check-static.mjs` 通過；`node scripts\build-prompt-preview.mjs --base HEAD --out output\ab-test-2026-07-07-c-final` 通過；Chrome 實測五頁生成 / 複製正常，travel / magazine / fantasy 條件化通過。
- C4 選配提案未套用：主題段落提前、travel 風格中英格式統一都仍保留為後續需另外確認的提案。

---

## 第三波待辦 — 任務 C：咒語優化方法（Codex 執行）

Owner 已指示進行咒語本體優化。**流程仍受保護契約管制**：Codex 先產出全部提案
與改前/改後對照，owner 確認後才套用到正式檔案。分四步，順序執行。

### C0. 先建預覽工具（讓對照自動化，之後每波都用）

新增 `scripts/build-prompt-preview.mjs`：重建「指定 git 版本 vs 工作目錄」的完整咒語，
供 owner 對照與 ChatGPT 實測。做法參考 `output/ab-test-2026-07-06/`（Claude 已驗證可行）：

1. 用 `git show <rev>:assets/core-prompt.js` 與 `git show <rev>:travel.html` 取舊版；工作目錄取新版。
2. `core-prompt.js` 用 `global.window={}` stub 後 eval；`travel.html` 取
   `const COMPOSITION` 到 `function setupRadioCards` 之間的資料常數段 eval（travel 目前約 L845–1313）。
3. 複製 `generateBtn` handler 的組裝邏輯（含插畫媒材條件），固定一組選項
   （構圖 C／jp_gravure／3:4／neutral／scene_natural／still／主題「京都清水寺楓葉季」），
   寫實與水彩媒材各出一份，輸出到 `output/ab-test-<日期>/`。
4. magazine 比照辦理（資料常數段結構相同）。

量測指令（每次改動前後都跑，數字寫進對照文件）：

```powershell
node -e "global.window={};const fs=require('fs');eval(fs.readFileSync('assets/core-prompt.js','utf8'));const b=window.HB_CORE_PROMPT.blocks;let t=0;for(const [k,v] of Object.entries(b)){console.log(k,v.length);t+=v.length}console.log('total',t)"
```

### C1. 核心第二刀瘦身（現況實測數字 → 目標）

第一波只砍了約 9%。第二刀原則：**每一條語意都保留，只合併同義句**；
逐區塊目標（字元數為 2026-07-06 實測現況）：

| 區塊 | 現況 | 主要冗餘 | 目標 |
| --- | --- | --- | --- |
| `lightingUnification` | 843（22 行） | 「同一光源」講了 5 遍（Same light source affects... / Same light direction... / Face lighting must match... / Subject and environment share... / Environmental lighting affects...）→ 併 1–2 句；No 系列 6 行 → 併 2 句 | ~450 |
| `identityLock` | 862（13 行） | 開頭「Same person face / Same facial identity / Identity Recognition Priority Maximum」同義 → 留「Same person face」+「Recognizable by family and friends at first sight」 | ~650 |
| `faceGeometryLock` | 413（13 行） | 10 行「Preserve Original X」→ 併成 1–2 句列舉（Preserve original forehead height, face width, eye shape, eye distance, nose shape...） | ~250 |
| `poseNaturality` | 330（12 行） | 前 3 行 Natural X 同義 → 併 1 句 | ~230 |
| `negativePrompt` | 346（19 行） | 與 identityLock / anatomy / lighting 完全重複的條目刪除（此區塊只有 fantasy / store-ad 用，刪前先確認該兩頁的輸出仍涵蓋所有負面約束） | ~200 |
| `cameraReconstruction`、`skinTexture`、`outputQuality`、`cleanFrame`、`realisticAnatomy`、`illustrationReconstruction` | — | 第一波已處理或本來就精簡，**不動** | — |

合計目標：blocks 總量 5,162 → 約 3,900–4,100（累計瘦身達 30% 上下）。

改寫示例（lightingUnification 的「同一光源」5 句 → 1 句，Codex 可再修飾）：

> One single global lighting environment: the same light source, direction, color temperature and exposure apply to face, body, outfit and background, and environmental / material reflections affect facial lighting.

硬性規則：
- 段落標題【】全部保留（幫 ChatGPT 分區理解，也是 UI 可讀性）。
- **段落順序不可動**（契約保護）。
- 刪除任何一「條」語意（不只是合併）都要在對照文件中單獨列出理由。

### C2. `fantasy-fashion.html` 插畫媒材條件化

比照 travel / magazine 已驗證的做法：

1. 盤點該頁媒材/風格選項，分出「非攝影類」key 清單（插畫、動畫、漫畫、油畫等）。
2. 非攝影類 → 用 `CORE.illustrationSkeleton`（fantasyCore 需在 `core-prompt.js` 補
   `illustrationSkeleton: illustrationHumanCore`）；攝影類維持原樣。
3. 若該頁有膚質區塊，比照 magazine 的【膚質質感｜插畫媒材版】處理。
4. 身份鎖定、臉部幾何**照常保留**（插畫也要像本人）。

### C3. 對照產出與套用流程（必守）

1. C1/C2 改動先做在工作目錄，跑 C0 預覽工具產出改前/改後完整咒語
   （travel 寫實、travel 水彩、magazine 寫實、magazine 插畫、fantasy 各一組）。
2. 寫 `docs/c-prompt-review-<日期>.md`：語意對照表（舊句 → 新句，逐條）、
   量測數字（各區塊前後字元數）、刪除條目清單與理由。
3. **停下來等 owner 確認**後才 git 提交。
4. 提交後：`node scripts\check-static.mjs` 全過 + 五頁瀏覽器抽測 +
   更新 `CLAUDE.md` 狀態欄與本文件。

### C4. 選配提案（只寫進 review 文件供 owner 決定，未同意不做）

- 把【主題】區塊提前到身份鎖定之後（讓 ChatGPT 更早知道場景）— 動段落順序，契約管制。
- travel `STYLES` 各風格文字中英格式統一 — 改風格字句，契約管制。

---

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
- [x] 根目錄五個工具頁在瀏覽器開啟、按「生成」、「一鍵複製」皆正常
- [x] B1/B2 每一項改動，owner 都看過改前/改後咒語對照並同意
- [x] 未經同意不得改動：咒語段落順序、UI 操作流程、預設值聯動（契約規定）
- [x] 收工前更新 `CLAUDE.md` 狀態欄與本文件（標記完成項）
