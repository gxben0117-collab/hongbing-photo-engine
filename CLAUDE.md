# CLAUDE.md — 紅兵寫真旅拍引擎（Photo Prompt Engine）

## 共通規範

先讀 `C:\AIProjects\000AI-Vault\INDEX.md`（工作區規範、命名版本規則、環境陷阱，本檔不重複）。

## 本專案特有

- 目標：AI 寫真旅拍咒語產生器；舊「紅兵風格寫真咒語產生器」的正式後繼。
- 技術棧：純靜態 HTML，GitHub Pages 直接部署，**不需要 npm 或 Python 套件**。
- 主入口：`index.html`；另有 doll / fantasy-fashion / magazine 等子頁。
- 目前版本：v4.3 穩定版（統一身份鎖定核心、臉部幾何鎖定）。
- 特殊禁區：`核心資料/` 不進 Git（私有提示詞資產）；`backup_original/`、`output/` 不進 Git。
- 001 完成區的「員工借支」「家庭水電瓦斯記帳」由本專案拆分，此處同名 HTML 為歷史殘留。

## 目前狀態與下一步

**完整逐日開發記錄在 [`docs/development-log.md`](docs/development-log.md)，本節只放
現況摘要與待辦；不要在這裡繼續累加逐日流水帳，改記到開發日誌裡。**

### 現況摘要（2026-07-22）

- 五個工具頁（travel / magazine / doll / fantasy-fashion / store-ad）皆已上線，
  正式站 <https://gxben0117-collab.github.io/hongbing-photo-engine/>。
- **共用核心**：`assets/core-prompt.js` 集中管理身份鎖定等保護區塊；核心文字經過
  兩輪瘦身（5,162 → 4,099 字元），語意零遺漏。
- **travel / magazine / fantasy 操作模式已統一**：手動生成、stale 保護
  （改選項後輸出區標記過期，需重新生成）、套用即顯示、按鈕配色一致。
  `doll.html` 尚未套用這套規則（見下方待辦）；`store-ad.html` 本質不同不適用。
- **隨機套用已改為元素級獨立隨機**（每欄位各自抽選再動態組合），不是預寫模板三選一。
- **驗證工具**：`scripts/check-static.mjs`（結構）、`scripts/build-prompt-preview.mjs`
  （0-diff 迴歸）、`scripts/audit-100x.mjs`（500 次隨機模擬內容稽核）三個腳本
  覆蓋不同驗證面向，改咒語相關邏輯後都應該跑。**重要限制**：`audit-100x.mjs`
  是重新實作一份組裝邏輯直接讀 DOM 文字來模擬，不是真的執行頁面上的
  `generate()`，測不出「新增選項卡但忘記同步補頁面自己維護的文字對照表」這類
  問題（2026-07-22（五）就是這樣被漏掉，導致 fantasy 生成按鈕直接壞掉）。
  **凡是新增/修改選項卡，都要另外用 jsdom 載入真實 HTML、對每個新選項值
  dispatch change + 點真正的 `generateBtn`，檢查輸出沒有 undefined/過短/JS
  錯誤**，不能只靠 audit-100x 過關就當作驗證完成。
- **版權規則**：讀取風格參考圖時常遇到遊戲/動漫角色 cosplay 圖，只取視覺技法，
  角色名/作品名一律不得進入 prompt 或 UI。
- **fantasy 的 00 一鍵主題模板區**有「當下選取」金框追蹤（點哪個模板/隨機套用，
  金框就跟到哪個），隨機按鈕文字已簡化為「隨機套用」。
- **travel/magazine 的隨機/一鍵模板按鈕不會自動捲動頁面**（維持使用者當下位置），
  只有手動按「生成完整咒語」才會捲到輸出區。
- **三頁服裝/材質/背景/姿勢/光線選項已依 169 張參考圖擴充**（2026-07-22）：
  fantasy 的 garment/material/background/pose/lighting 各池尾端追加；travel 的
  costume/themePreset 地點 chip/lighting/pose 追加；magazine 的 bg/themePreset
  服裝方向 chip（新的「私房棚拍風」不掛 `THEME_PRESET_DEFAULTS` 連動）/pose/
  lighting 追加。純附加、未改任何既有 value 或輸出邏輯，細節見開發日誌
  2026-07-22（四）。**這批新增當時漏了同步補三頁各自的文字對照表**
  （fantasy 的 garmentData/materialData/backgroundData/lightingData/poseData、
  travel 的 COSTUME_DIRECTIONS/POSE_STYLES/TRAVEL_LIGHTING_STYLES、magazine 的
  BACKGROUNDS/POSES/DETAIL_BLOCKS.lighting），導致 fantasy 選到新材質會直接
  丟錯讓生成失效，其餘缺項則是輸出出現 undefined 或選項悄悄不生效；已於
  2026-07-22（五）補齊全部 75 筆並用 jsdom 逐項驗證，細節見該條記錄。
- **三頁選項分類稽核**（2026-07-22（六））：travel 刪除 6 個誤放的奇幻地點
  chip（內容已在 fantasy 頁重複建設）；magazine 刪除/改寫 6 組重複選項；
  fantasy 新增「暗黑哥德巫術」「賽博霓虹都市」兩大主題共 26 個選項＋2 個
  一鍵模板，且這次新增選項卡與補資料表是同一批做完，不再分兩批。**刪除/
  改名前一律先 grep 過 `THEME_PRESET_DEFAULTS`/`POSE_THEME_MAP`/
  `QUICK_TRAVEL_PRESETS`/`QUICK_MAGAZINE_PRESETS`/fantasy 的
  `themeTemplates`，確認零引用才刪，有引用的只改顯示文字不動 value/key**——
  這是繼「新增要補資料表」之後的第二條教訓：改動既有選項前也要查一鍵模板
  系統的依賴，兩者都要查才算完整。
- **文件結構**：`docs/development-log.md` 是唯一時間軸記錄；`docs/history/` 存放
  已完成批次的一次性交接/對照文件（不再更新，只供追溯）；`docs/README.md` 是
  文件總索引。

### 已拍板不做（不要重新提議）

- 性別中性化：本產品即為女性設計。
- 多模型輸出切換：咒語只給 ChatGPT 用，不做 Midjourney/SD 版本。
- 髮色模組：曾短暫加入又依 owner 指示整組移除，特殊髮色需求由使用者自行在
  主題欄輸入。

### 待辦 / 待 owner 決定

- ChatGPT 出圖實測：核心瘦身 A/B、各波新選項與特效模板抽測、三頁 UI 統一後的
  手動點測（清單見開發日誌 2026-07-21/22 條目）。
- `doll.html` 是否要套用 travel/magazine/fantasy 那套「stale 保護 + 套用即顯示」
  規則，需 owner 確認。
- L5：travel 風格模組加「主題與風格衝突時以主題為準」的裁決句——會改既有輸出
  文字，屬 `docs/core-prompt-contract.md` 管制範圍，需先出改前/改後對照。

### 歷史記錄（已移入開發日誌，以下保留供 git blame 對照，不再新增）

<details>
<summary>展開查看 2026-07-06 ～ 07-22 逐日記錄原文（已整併進 docs/development-log.md）</summary>

- 2026-07-06：Codex 已完成 `docs/ai-handoff-2026-07-06.md` 的任務 A 工程收尾：
  版本資料夾移入 `versions/`、歷史殘留工具檔已清除、誤放的東北行程頁移至
  `output/tohoku-20260711/` 暫存且不進正式首頁。
- 2026-07-06：Codex 已在 owner 確認後套用任務 B 第一波：
  B1 保守核心瘦身，B2 travel / magazine 插畫媒材條件化；`fantasy-fashion.html` 暫不動。
- 2026-07-06：Codex 已整理 magazine 妝容 / 珠寶配飾：妝容維持最多 2 個、
  珠寶配飾維持最多 2 個；黑金高訂 preset 改為只給精簡推薦值，不再塞滿多個妝容與華麗套組。
- 2026-07-06：Codex 已完成第二波 R1/R2：`temp/` 只保留 `.gitkeep` 與
  `style-contact-sheets/`，五個工具頁 Chrome 實測「生成 / 複製」皆正常，B2 條件化通過。
- 2026-07-07：Owner 已同意正式套用任務 C；Codex 已完成 C0 預覽工具、
  C1 核心第二刀瘦身（5,162 → 4,099）、C2 fantasy-fashion 插畫媒材條件化。
- 2026-07-07：`node scripts\check-static.mjs` 通過；Chrome 實測五個工具頁
  生成 / 複製正常，travel / magazine / fantasy 條件化通過。
- 下一步：owner 可用 ChatGPT A/B 實測 travel 水彩、magazine 日系動畫、
  fantasy 紙雕 / 水彩 / 水墨類材質的身份保持度。後續若再改咒語文字，
  仍需依 `docs/core-prompt-contract.md` 先提供改前/改後對照。
- 已拍板不做：性別中性化（本產品即為女性設計）、多模型輸出切換（只給 ChatGPT 用）。
- 2026-07-15：Claude Code 讀完桌面 30 張風格範例並產出第四波方案
  **`docs/handoff-2026-07-15-batch4.md`**（交 Codex）：T 旅拍補姿勢/服裝/裝扮三模組＋
  黃金時刻等 5 光線；M 雜誌補私房閨房/戶外封面/亂世古風(去版權)；F 幻想補暗黑仙俠/
  魅魔/花卉紗 4 花種＋材質 UI 分組；S store-ad 加上傳素材模式(修 lighting 未接 bug)/
  節慶快選/4 風格/文字 fallback；L 分類邏輯修正(travel 鏡頭與構圖同軸互斥、
  magazine 藝術媒材 style 與 media 衝突鎖定)。規則：加選項不改舊輸出、
  新 prompt 先出 d-prompt-review 等 owner 確認、真三國無雙等角色名嚴禁入 prompt。
- 2026-07-15：Claude Code **已親自執行第四波**（T/M/F/S/L1 全部，L2 實查後判定
  既有 STYLE_PRESET_DEFAULTS 已自動帶相容 media 故不需改；L3/F4 純 UI 分組留給 Codex）。
  驗證全過：check-static、build-prompt-preview 舊組合 0 diff、77 項整合驗證。
  對照文件 `docs/d-prompt-review-2026-07-15.md`、新選項 sample 在
  `output/ab-test-2026-07-15/`。
- 2026-07-15：owner 確認後已全部收尾：第四波 commit `427bf20`；L3/F4 UI 分組
  （magazine 主題 9 群組＋補 5 個孤兒 preset chips、fantasy 材質 9 群組）commit `7f9dc19`；
  L4 index 三卡定位句一併入 batch4。已 push GitHub Pages，線上五頁 200 且新內容
  HTTP 驗證通過（https://gxben0117-collab.github.io/hongbing-photo-engine/）。
  Vault 專案索引已回寫。
- 2026-07-15（二）：Claude Code 依 owner 指定新增 fantasy「特效瞬間（高速凝結）」材質群 7 個
  （墨染水雲裙/水銀液態金屬裙/碎鏡爆散裙/色粉爆裂/煙霧紗裙/光繪絲帶裙/冰晶凍結瞬間），
  其中 3 個做成一鍵模板（inkWaterBloomGown/shatteredMirrorBurstGown/frozenSplashIceGown，
  皆配 splashDress 剪裁＋爆濺強度）。新模板全引用既有選項值；驗證全過、舊輸出 0 diff。
- 觀察待查（交下一波）：舊有 30+ 個一鍵模板的 composition 欄是自訂長文字，
  不在 composition radio 的 6 個值裡，`setRadioValue('composition',...)` 可能沒套上
  （新加的 3 個模板已改用合法 radio 值，不受影響）。建議 Codex 查證 setRadioValue 行為。
- 2026-07-16：Claude Code 讀取桌面新一批風格範例 5 張（全部幻想：玻璃植物園穹頂/
  透明水晶城市/水晶森林/雲朵棉花/彩虹雲海），補齊缺口：fantasy 背景+4
  （glassBotanicalDome/glassCrystalCity/crystalForestPath/rainbowCloudSky）、
  材質+1（cottonCloudGown 雲朵棉花裙）、服裝+1（modernSuit 現代西裝大衣）、
  光線+1（crystalDaylight 水晶日光）。驗證全過（check-static、舊組合 0 diff、
  17 項新增完整性檢查）。
- 2026-07-16（二）：**髮色模組已依 owner 指示整組移除**（fantasy＋travel 兩頁的
  UI/資料/組裝邏輯全拆，殘留檢查 0、舊輸出 0 diff）。owner 已拍板：
  **髮色選項目前不需要，之後不要再提議**；特殊髮色需求由使用者自行在主題欄輸入。
- 2026-07-18：Claude Code 讀取桌面第三批風格範例（33 張＋咒語.txt 高手技法檔），
  分類：幻想 24／雜誌 5／旅拍 4。補強：fantasy 材質+5（蕾絲高訂/摺紙時裝/
  錦鯉鱗片水流/押花紙藝拼貼/孔雀羽織錦）、背景+2（蕾絲紗幕廳/水晶寶座劇院）、
  構圖+1（人體藝術裝置四層構圖，來自咒語檔【主題元素】通用技法）、
  姿勢+1（斜躺延伸框景）；travel 服裝+1（花卉刺繡比基尼）＋快選+1（絲路藍磚古城）；
  magazine 主題快選+1（昆蟲女王圖鑑，原創描述）。
  範例含大量遊戲/動漫角色名（不知火舞/月野うさぎ/胡蝶しのぶ等），全部只取視覺技法，
  角色名零進入 prompt/UI。驗證全過（check-static、舊組合 0 diff、批次完整性檢查）。
- 2026-07-18：Codex 核對第三批分類成果後，新增 magazine / fantasy 共用的「韓系偶像比例」；
  fantasy 另新增「貓系女僕 Layer 高訂」與「貓系女僕蕾絲劇院」一鍵示範。電影、商業、
  暖金與故事感既有選項已足夠，未新增會覆寫使用者選擇的隨機背景。詳見
  `docs/e-prompt-review-2026-07-18.md`。
- 2026-07-19：Codex 依 owner 要求補齊隨機入口：`magazine.html` 新增
  「隨機套用｜棚拍封面感覺」、`fantasy-fashion.html` 新增「隨機套用｜幻想廣告動感感覺」。
  兩者都只抽既有一鍵模板 / 已整理過的模板資料，不新增 prompt 文字、不改核心輸出段落。
- 2026-07-20：Claude Code 修正 owner 回報的 UI 顯示 bug：`magazine.html`「隨機套用」
  與全部 19 顆「一鍵套用」按鈕套用主題時，02 主題/服裝方向區塊的短標籤 chip 不會亮起，
  容易讓人以為沒套到。根因：這些按鈕走的是 `QUICK_MAGAZINE_PRESETS`（客製長描述文字），
  跟 02 區塊固定的短名 chip 是兩套系統，套用時只會把長描述文字寫進主題自訂欄
  （這段文字本來就有正確進入生成的咒語，不影響輸出），但沒有任何 chip 的文字能精準比對
  到那段長描述，所以 chip 一直維持未選取。修法：主題輸入框在套用一鍵/隨機主題時加上
  `.theme-active` 金色外框提示（新增 CSS class），並清空舊的 chip 選取狀態避免殘留；
  使用者親自打字（`event.isTrusted`）時自動移除提示，改回原本的 chip 比對高亮邏輯。
  純 UI 提示調整，未動 `generate()` 組裝邏輯與任何 prompt 文字。
  `node scripts\check-static.mjs` 全過；`build-prompt-preview.mjs` 驗證 magazine
  兩種媒材組合皆 0 diff。
- 2026-07-20（二）：Claude Code 依 owner 要求統一 travel/magazine/fantasy 三頁的
  「生成→顯示→複製」操作模式（原本三頁各是一套規則，見前次分析）。改動：
  **(A) staleness 保護**——三頁都新增 `markStale()`/`clearStale()` 與 `document` 層級的
  `input`/`change` 委派監聽（捕獲階段）；只要已經生成過一次，之後任何選項變動都會讓輸出區
  加上 `.stale`：顯示金框提示「選項已變更，請重新按『生成完整咒語』」、文字轉淡、複製鈕
  失效（CSS `pointer-events:none` 擋滑鼠 + JS 內部再擋一次防鍵盤 Enter 誤觸）；按下生成鈕
  才清除。fantasy 原本是「生成過一次後每改一個選項就整頁即時重算」，已改成與另兩頁一致的
  手動生成＋stale 提示模式（拿掉 radio/change、text-input 監聽裡的 `generate()` 呼叫，
  只保留卡片視覺刷新 `refreshCards()`）；magazine 的妝容/珠寶多選 chip 因為原本
  `preventDefault()` 擋掉原生 change 事件，額外在 `sync()` 內手動呼叫 `markStale()`。
  **(B) 套用即顯示**——三頁「隨機套用」原本就會立即生成顯示，但個別「一鍵套用」按鈕不會
  （travel 甚至會主動把輸出區藏起來、magazine 完全不處理導致可能留著舊咒語、fantasy 默默
  背景更新但不顯示）；已統一成套用後立即生成、顯示、捲動過去：travel 的
  `applyTravelPreset` 結尾改呼叫 `generateBtn.click()`；magazine 的
  `[data-magazine-preset]` 改傳 `{generate:true}`；fantasy 的 `applyThemeTemplate`
  結尾改呼叫 `generate({reveal:true})`（連帶讓 `fantasyMoodPreset` 按鈕不用再手動預設
  `fantasyOutputVisible`）。**(C) 按鈕配色**——fantasy 的生成鈕（原本沒有 `.generate-btn`
  class，吃到全站按鈕預設的紫綠漸層）與複製鈕（原紫色系）已改成跟 travel/magazine 一樣的
  金色系（沿用 fantasy 既有的 `--gold` 變數）；材質卡片、模板卡片等裝飾性元件維持原本的
  紫綠主題不動。順手把 fantasy 複製鈕裡「生成後才會顯示複製鈕，理論上摸不到」的一段死碼
  防禦分支拿掉，讓三頁複製鈕程式碼結構一致。驗證：`check-static.mjs` 全過；
  `build-prompt-preview.mjs` 五組舊選項組合 0 diff（純行為/樣式調整，未動任何 prompt 文字）；
  另寫 41 項整合驗證腳本逐一確認三頁的 markStale/clearStale/stale 徽章/金色樣式/套用即顯示
  邏輯都正確接上。
- 2026-07-21：Claude Code 依 owner 要求做「全專案檢查」：UI 結構、咒語內容、100 次隨機模擬。
  新增 `scripts/audit-100x.mjs`（VM-based，重建五頁 generate 邏輯，每頁隨機抽 100 組選項，
  共 500 次模擬，檢查 undefined/NaN/[object Object]/null 洩漏、身份鎖定區塊是否存在、
  相鄰重複行、原始碼禁用角色名靜態掃描）。第一輪抓到 1 個真實問題並修正：
  `travel.html` 主題快選 chip「大阪祭典不知火舞」誤把 SNK 版權角色「不知火舞」直接寫進
  可被選用、會流入咒語輸出的主題文字，已改為通用描述「大阪祭典和服舞姬」（周圍其他
  「京都伏見稻荷九尾妖狐」「東京原宿cosplay貓女」等 chip 皆為通用原型描述，非角色名，
  不用改）。第二輪修後重跑 500 次模擬與 check-static 全過、fantasy 咒語輸出仍 0 diff。
  另外針對 owner 重申「fantasy 的 UI 操作/展現方式/邏輯要跟 travel/magazine 一樣」，
  逐項比對 CSS 後發現上一波只統一了生成/複製鈕，還有 4 處互動狀態色沒統一：
  材質卡片與姿勢卡片被選中時的邊框/底色（原紫色 `--violet`/`#21172F`，改為
  `var(--gold)`/新增的 `--selected-bg:#1E1A14`，數值取自 travel/magazine 既有的
  `--terracotta`(=`--gold` 同色)/`--selected` 變數）、自訂欄位啟用時的框線與陰影、
  導覽列目前頁面高亮色（原紫色，改成跟 travel/magazine 完全一致的
  `var(--gold)`/`rgba(201,168,76,.08)`）、輸入框 focus 邊框色、「隨機套用」按鈕的漸層底色
  （改用跟 travel/magazine 的 `travelMoodPreset`/`magazineMoodPreset` 完全相同的
  `#17120b→#22180f` 漸層＋金色框）。刻意保留不動：`h1 span` 標題強調色與
  `.pose-group-label` 分組標題色——這兩項 travel 本身沒有這個概念（travel 的 `<h1>` 沒有
  `<span>`、也沒有自訂 `:focus` 樣式），屬於各頁自己的標題風格，非共用操作元件，跟三頁本來
  就沒有統一過的部分一致，不算新的不一致。順手修 `store-ad.html` 複製鈕：原本
  `await navigator.clipboard.writeText(text)` 沒有 catch，剪貼簿權限被拒或非 HTTPS
  環境會直接丟出未捕捉的 rejection、按鈕文字也不會變成「已複製」；已補上跟其他四頁一致的
  fallback（`document.execCommand('copy')` 搭配 `Range`/`Selection`，因為 store-ad 的
  輸出是 `<div>` 不是 `<textarea>`，不能用 `.select()`）。全部驗證：`check-static.mjs`
  五頁全過、`build-prompt-preview.mjs` 0 diff、`audit-100x.mjs` 500 次模擬 0 issue。
- 下一步：owner 用 ChatGPT 出圖實測（a）第三波核心瘦身 A/B（`output/ab-test-2026-07-07-c-final/`）
  （b）第四波新選項抽測（中式庭院茶席、彼岸花金箔、藍焰蓮花、古風私房）
  （c）新特效模板抽測（墨染水雲/碎鏡爆散/冰晶凍結）
  （d）7-16 新增抽測（水晶森林+銀白髮、彩虹雲海+粉彩虹髮、玻璃城市+現代西裝）
  （e）三頁統一後的 UI 手動點測（改選項確認 stale 提示、個別一鍵套用確認立即顯示、
  fantasy 卡片選中/導覽列高亮確認變金色）。
  選配待議：L5 travel 主題裁決句（改舊輸出需同意）；doll.html 目前仍是「手動生成、無
  stale 保護、一鍵主題不會自動顯示」的舊模式（跟 travel/magazine 統一前一樣），
  若 owner 要 doll 也套用同一套規則需另外確認；store-ad.html 本質是「即時重算、
  無隱藏態」的完全不同設計（表單填一半就即時看到海報企劃），目前判斷不適合套用
  stale 機制，維持現狀。
- 2026-07-22：Claude Code 讀取桌面第四批風格範例（分層抽樣約 32 張，涵蓋 07-15~07-21
  新增檔案，多為社群截圖與遊戲/動漫角色 cosplay 圖，一律只取視覺技法不取角色名）後，
  依 owner 明確指示重做「隨機套用」的底層邏輯：**元素級獨立隨機 → 動態組合**，取代
  原本「從預寫模板中三選一」。三頁現況盤點：travel 原本就是正確架構（構圖/風格/比例/
  鏡頭/光線/動態/媒材/主題文字皆各自獨立抽選），但姿勢/服裝/髮型/配件 4 個較新欄位仍
  被寫死成「自動/無」，已改為一併獨立隨機；magazine 與 fantasy 原本都是「整套預寫組合
  隨機抽一個」（magazine 抽 `QUICK_MAGAZINE_PRESETS`、fantasy 抽 `themeTemplates`），
  已重寫為服裝/材質/背景/光線/構圖/框景/姿勢/風格/鏡頭/比例/強度（fantasy）與風格/背景/
  姿態/框景/鏡頭/動態/媒材/比例/妝容/珠寶/表情/光線（magazine）各自從完整選項池
  獨立抽選再動態組合；新增的 `getAllRadioValues(name)`/`getAllSelectValues(id)` 直接
  讀取當下 DOM 上的選項清單，之後任何時候再加新選項都會自動被隨機池吃進去，不用回頭改
  隨機函式。三頁既有的「一鍵套用｜XXX」具名模板/預設（travel 11 個、magazine 20 個、
  fantasy 40 個）維持不動，只有各頁那顆「隨機套用｜⋯」按鈕的底層邏輯改變。
  **驗證方式**：由於這些函式直接操作真實 DOM，靜態檢查不夠，改用 jsdom 在暫存目錄
  載入三頁「實際」HTML/JS（非重寫的模擬邏輯），模擬點擊各頁隨機按鈕 6 次，逐一比對
  每個欄位（材質/背景/光線/構圖/框景/姿勢/風格/鏡頭/比例……）在 6 次點擊間是否真的
  獨立變化，並檢查 `window.onerror`；結果三頁全數欄位皆有明顯變異（多數欄位 5-6/6
  distinct）、18 次點擊 0 個 JS 錯誤、生成內容 0 undefined/NaN。另外因應圖片調查發現的
  缺口，新增少量高價值元素：fantasy 材質 +2（紅心皇后禮服、水母虹彩裙）、背景 +2
  （哥德馬車廣場、礁岩海岸潮池）；travel 服裝 +1（運動休閒服）、姿勢 +1（晨光伸展）。
  全部驗證：`check-static.mjs` 全過、`build-prompt-preview.mjs` 五組舊選項組合仍
  0 diff（新增選項不影響既有輸出）、`audit-100x.mjs` 500 次模擬 0 issue（含新選項）。

</details>
