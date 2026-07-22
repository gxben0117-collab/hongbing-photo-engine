# 開發日誌

依時間排序的完整開發記錄。`CLAUDE.md` 只放最新現況摘要，詳細歷史都在這裡；
需要追溯「某個功能是哪一批加的、為什麼這樣改」時查這份文件。

每筆記錄盡量只留：**做了什麼 → 為什麼 → 驗證方式**，實作細節（哪一行、哪個函式）
留在對應的 commit diff 或 `docs/history/` 底下的原始交接文件。

## 2026-06-19 ～ 06-27　初版與 v4.3 統一

- 建立五個工具頁（travel / magazine / doll / fantasy-fashion / store-ad）與 `docs/` 文件骨架。
- **v4.3**：把身份鎖定、臉部幾何鎖定、真人骨架、光線一致化、膚質、負面詞、輸出品質
  抽成 `assets/core-prompt.js` 共用核心，五頁改為引用同一份，不再各自維護重複的
  身份保護文字。詳見 `docs/v4.3-change-log.md`（原始版本記錄，內容已併入本檔）。
- 幻想廣告頁重整分類層級（主題/造型/材質/風格/構圖/姿態/鏡頭/光影/背景/比例），
  修正姿態區選了沒反應的 UI bug；雜誌棚拍頁新增「改良式漢服」主題與對應姿態聯動。
  完整記錄見 `docs/history/ai-handoff-2026-06-21.md`。
- 建立 `docs/core-prompt-contract.md`（核心咒語保護契約）：改動身份鎖定/臉部幾何/
  骨架/光線一致性等核心規則前，須先出改前/改後對照並取得 owner 同意。這條規則
  之後每一波咒語改動都遵守。

## 2026-07-06 ～ 07-07　工程收尾 + 核心瘦身（任務 A/B/C）

- **任務 A**：版本資料夾整併進 `versions/`、清除歷史殘留工具檔（員工借支/家庭記帳，
  已拆到 001 完成區）、`temp/` 只留 `.gitkeep`。
- **任務 B**：核心保守瘦身第一輪；travel/magazine 插畫媒材條件化（選水彩/插畫類媒材時
  跳過寫實膚質區塊）；magazine 妝容/珠寶配飾上限各 2 個，避免預設值疊太滿。
- **任務 C**：owner 同意後核心第二刀瘦身，`core-prompt.js` blocks 總量
  5,162 → 4,099 字元（合併同義句、段落標題與順序不動）；fantasy-fashion 插畫媒材
  條件化補齊。建立 `scripts/build-prompt-preview.mjs`（用 `node:vm` 重建改前/改後
  完整咒語，供 A/B 測試與 0-diff 迴歸檢查），之後每一波改動都靠它驗證「舊選項組合
  輸出完全沒變」。
- 完整對照文件見 `docs/history/ai-handoff-2026-07-06.md`、
  `docs/history/b-prompt-review-2026-07-06.md`、`docs/history/c-prompt-review-2026-07-06.md`。
- 拍板決策：本產品鎖定女性設計，不做性別中性化；咒語只給 ChatGPT 用，不做多模型
  （Midjourney/SD）輸出切換。

## 2026-07-08 ～ 07-14　數學無關批次（略）

（此區間主要是其他專案的工作，本專案僅有零星小修，不特別記錄。）

## 2026-07-15　第四波：讀圖擴充三大工具頁 + 版權角色名規則確立

- 讀取桌面風格範例圖片（30 張），依主題分類（旅拍/雜誌/幻想），逐頁補齊缺口：
  - **travel**：新增姿勢/服裝方向/裝扮細節三個模組、5 種光線、2 組快選；
    修正鏡頭與構圖同軸互斥的邏輯錯誤（選封面感/廣角/遠距鏡頭時會跳過構圖段，
    避免同時輸出互相矛盾的景別指令）。
  - **magazine**：新增私房閨房、戶外封面、亂世古風（原創描述，非抄襲）主題快選。
  - **fantasy-fashion**：新增暗黑仙俠、魅魔、花卉紗材質群；材質/主題 UI 依類別分組
    （9 個群組），解決 90+ 個材質平鋪難選的問題。
  - **store-ad**：新增上傳素材模式（商品照/人物照/店面照，人物照模式掛身份鎖定，
    順手接上原本定義了但沒用到的 `storeAdCore.lighting`）、節慶快選、4 種風格、
    中文字渲染失敗時的留白 fallback。
- **確立版權角色名規則**：範例圖常含遊戲/動漫角色（cosplay 圖），一律只取視覺技法
  （材質、構圖、光線），角色名/作品名不得進入 UI 或 prompt 文字。之後每一波讀圖都
  遵守這條規則，並在稽核腳本裡加入靜態掃描。
- 當天稍晚依 owner 指定新增 fantasy「特效瞬間（高速凝結）」材質群 7 個
  （墨染水雲裙、水銀液態金屬裙、碎鏡爆散裙、色粉爆裂、煙霧紗裙、光繪絲帶裙、
  冰晶凍結瞬間），其中 3 個做成一鍵模板。
- 完整方案見 `docs/history/handoff-2026-07-15-batch4.md`、
  `docs/history/d-prompt-review-2026-07-15.md`。
- 驗證：`check-static.mjs`、`build-prompt-preview.mjs` 0 diff、新增選項完整性檢查。

## 2026-07-16　水晶幻想場景

- 讀取新一批範例圖（5 張，全部幻想主題：玻璃植物園、水晶城市、水晶森林、雲朵、
  彩虹雲海），fantasy 新增對應背景 4 個、材質 1 個（雲朵棉花裙）、服裝 1 個
  （現代西裝大衣）、光線 1 個（水晶日光）。
- 當天稍晚 owner 拍板：**髮色模組不需要，之後不要再提議**（曾短暫加入又依指示整組
  移除），特殊髮色需求由使用者自行在主題欄輸入。

## 2026-07-18　第三批讀圖 + 貓系女僕 + 韓系偶像比例

- 讀取第三批範例圖（33 張 + 一份高手技法筆記），分類：幻想 24／雜誌 5／旅拍 4。
  補強：fantasy 材質 +5（蕾絲高訂、摺紙時裝、錦鯉鱗片水流、押花紙藝拼貼、
  孔雀羽織錦）、背景 +2、構圖 +1（人體藝術裝置四層構圖）、姿勢 +1；
  travel 服裝 +1（花卉刺繡比基尼）+ 快選 +1；magazine 主題快選 +1（原創描述）。
- 範例含大量遊戲/動漫角色名（不知火舞、月野うさぎ、胡蝶しのぶ等），全部只取
  視覺技法，角色名零進入 prompt/UI（詳見上方版權規則）。
- 稍後 magazine/fantasy 新增共用的「韓系偶像比例」身形選項；fantasy 新增
  「貓系女僕 Layer 高訂」與對應一鍵示範。
- 完整記錄見 `docs/history/e-prompt-review-2026-07-18.md`。

## 2026-07-19 ～ 07-20　隨機入口補齊 + UI 一致性修正

- `magazine.html`、`fantasy-fashion.html` 各補上「隨機套用」按鈕（當時做法是從既有
  一鍵模板池裡抽一個，非元素級獨立隨機——這點 07-22 重做，見下方）。
- 修正 magazine 的一顆 UI bug：套用一鍵/隨機主題後，02 區塊的短標籤 chip 不會亮起
  （因為套用的是客製長描述文字，跟固定短名 chip 是兩套系統比對不到），容易讓人
  誤以為沒套用成功。修法：主題輸入框套用時加金框提示（`.theme-active`），使用者
  自己打字時自動移除提示。純 UI 顯示問題，未影響實際生成的咒語內容。
- **統一 travel / magazine / fantasy 三頁的「生成 → 顯示 → 複製」操作邏輯**
  （這三頁原本各自一套規則）：
  - **Stale 保護**：生成過一次後，只要再改任何選項，輸出區就標記過期
    （金框提示「選項已變更，請重新生成」、文字轉淡、複製鈕失效），
    避免複製到跟畫面選項對不上的舊咒語。fantasy 原本是「改一項就整頁即時重算」，
    改成跟另外兩頁一致的手動生成模式。
  - **套用即顯示**：所有「一鍵套用」與「隨機套用」按鈕統一為套用後立即生成、
    顯示、捲動過去（原本部分按鈕套用後會刻意隱藏舊結果或完全沒反應）。
  - **按鈕配色統一**：fantasy 生成/複製鈕改成跟 travel/magazine 一致的金色系；
    材質卡片等純裝飾性元件維持原本的紫綠主題不動（刻意保留頁面個性）。
  - 驗證：41 項整合測試逐一確認三頁的 stale 標記/清除/套用即顯示邏輯正確接上，
    `build-prompt-preview.mjs` 確認純行為調整未動到任何 prompt 文字。

## 2026-07-21　全專案稽核：UI + 咒語內容 + 500 次模擬

- 建立 `scripts/audit-100x.mjs`：用 `node:vm` 重建五個工具頁的實際咒語組裝邏輯，
  每頁隨機抽 100 組選項（共 500 次模擬），檢查 `undefined`/`NaN`/`[object Object]`
  洩漏、身份鎖定區塊是否存在、相鄰重複行、原始碼禁用角色名靜態掃描。
- 第一輪抓到一個真實 bug：`travel.html` 有一個主題快選 chip 叫「大阪祭典不知火舞」，
  誤把 SNK 版權角色名直接寫進會流入咒語輸出的文字，違反上方版權規則。修正為通用
  描述「大阪祭典和服舞姬」。
- 依 owner 重申「fantasy 的 UI 要跟 travel/magazine 完全一致」，逐項比對 CSS 後
  發現 07-19/20 那波只統一了生成/複製鈕，還有 4 處互動狀態色沒統一（材質卡片選中色、
  自訂欄位啟用框線、導覽列高亮色、輸入框 focus 邊框、隨機按鈕漸層底色），
  全部改成跟 travel/magazine 一致的金色系；`h1` 標題強調色等純裝飾性元素刻意保留
  （travel 本身沒有這個概念，不算三頁間的不一致）。
- 順手修 `store-ad.html` 複製鈕：原本剪貼簿 API 失敗沒有 fallback，會拋出未捕捉的
  錯誤且按鈕文字不會變成「已複製」，已補上跟其他四頁一致的備援機制。
- 全部驗證：`check-static.mjs` 五頁全過、`build-prompt-preview.mjs` 0 diff、
  `audit-100x.mjs` 500 次模擬 0 issue。

## 2026-07-22　隨機邏輯重做為元素級獨立隨機

- 讀取第四批範例圖（分層抽樣約 32 張，涵蓋 07-15～07-21 新增檔案，多為社群截圖與
  遊戲/動漫角色 cosplay 圖，一律只取視覺技法不取角色名）。
- 依 owner 明確指示重做「隨機套用」的底層邏輯：**元素級獨立隨機 → 動態組合**，
  取代原本「從預寫模板 / 預設清單中三選一」：
  - travel 原本架構就正確（構圖/風格/比例/鏡頭/光線/動態/媒材/主題文字皆獨立抽選），
    但姿勢/服裝/髮型/配件 4 個較新欄位被寫死成「自動/無」，改為一併獨立隨機。
  - magazine 與 fantasy 原本都是「整套預寫組合隨機抽一個」，重寫為服裝/材質/背景/
    光線/構圖/框景/姿勢/風格/鏡頭/比例/強度（fantasy）與風格/背景/姿態/框景/鏡頭/
    動態/媒材/比例/妝容/珠寶/表情/光線（magazine）各自從完整選項池獨立抽選再動態組合。
  - 新增的 `getAllRadioValues(name)` / `getAllSelectValues(id)` 直接讀取當下 DOM
    上的選項清單，之後任何時候再加新選項都會自動被隨機池吃進去，不用回頭改隨機函式。
  - 三頁既有的具名「一鍵套用｜XXX」模板/預設完全不動，只有「隨機套用」按鈕的
    底層邏輯改變。
- **驗證方式**：這些函式直接操作真實 DOM，靜態檢查測不出行為對不對，改用 jsdom
  在暫存目錄載入三頁「實際」HTML/JS（不是重寫的模擬邏輯），模擬點擊各頁隨機按鈕
  6 次，逐一比對每個欄位是否真的獨立變化，並檢查 `window.onerror`；結果三頁所有
  欄位皆有明顯變異、18 次點擊 0 個 JS 錯誤、生成內容 0 undefined/NaN。
- 順帶新增少量高價值缺口元素：fantasy 材質 +2（紅心皇后禮服、水母虹彩裙）、
  背景 +2（哥德馬車廣場、礁岩海岸潮池）；travel 服裝 +1（運動休閒服）、
  姿勢 +1（晨光伸展）。
- 全部驗證：`check-static.mjs` 全過、`build-prompt-preview.mjs` 五組舊選項組合
  仍 0 diff、`audit-100x.mjs` 500 次模擬 0 issue。
- 全專案文件整理：`docs/` 內一次性交接/對照文件歸檔到 `docs/history/`；
  新建本檔案（`development-log.md`）取代零散的 `v4.3-change-log.md` 作為唯一
  時間軸記錄；更新 `docs/architecture.md`、`docs/core-logic.md`、`docs/README.md`
  與根目錄 `README.md` 反映現況；`CLAUDE.md` 的「目前狀態」精簡為現況摘要，
  詳細歷史改指到本檔案。

## 2026-07-22（三）　UI 互動細節修正

- owner 回報 fantasy「00 一鍵主題模板」區的金色選取框「鎖死」在隨機套用按鈕上，
  點其他模板不會跟著移動。根因：隨機按鈕原本有寫死的
  `border-color:var(--gold)` 內聯樣式（07-21 統一配色時加的，用意是讓它像
  travel/magazine 的隨機按鈕一樣顯眼），但那是靜態樣式，不是「目前選取」狀態，
  ~40 個具名模板按鈕則完全沒有任何選取追蹤機制。修法：拿掉隨機按鈕的靜態金框，
  改成在 `.section-preset` 容器上掛一個事件委派的 click 監聽，點擊任何一顆
  卡片（隨機套用或具名模板）就把 `.template-selected` 這個 class 移到它身上、
  從其他卡片移除，CSS 用 `.section-preset button.card.template-selected` 給金框
  ＋ box-shadow。順手把隨機按鈕文字從兩行（標題＋說明）簡化成單一行「隨機套用」。
- owner 要求 travel/magazine 的「隨機套用」與「一鍵套用」按鈕不要再自動把頁面
  捲到輸出區，維持使用者當下瀏覽位置；但手動按「生成完整咒語」時仍要捲動
  （這是使用者主動要求看結果，跟套用範本後被動跳走不一樣）。做法：加一個
  模組層級的 `skipNextScroll` 旗標，`applyTravelPreset`/`applyTravelRandomSelection`/
  `applyMagazinePreset`（`options.generate` 為真時）/`applyMagazineRandomSelection`
  在觸發 `generateBtn.click()` 前把旗標設成 true，真正的生成處理常式讀到旗標為
  true 時跳過 `scrollIntoView`、並把旗標重置回 false，讓使用者直接點生成鈕的
  路徑不受影響。
- **驗證方式**：這三項都是操作真實 DOM 的行為，靜態檢查測不出來，沿用 jsdom
  載入三頁「實際」HTML/JS 模擬點擊：確認 fantasy 選取框在點擊間正確移動且同時
  只有一個被選取、確認 travel/magazine 的套用/隨機按鈕不觸發 `scrollIntoView`
  而手動生成鈕仍會觸發。12 項檢查全過。另外 `check-static.mjs` 全過、
  `build-prompt-preview.mjs` 固定選項組合仍 0 diff（純 UI 互動調整，未動任何
  prompt 文字）。

## 2026-07-22（四）　讀 169 張參考圖擴充三頁服裝/材質/背景/姿勢/光線選項

- owner 提供 `C:\Users\User\Desktop\ai生圖\風格範例`（169 張本機參考圖，多為
  AI 生成或 cosplay 風格人像），要求分類進旅拍/雜誌/幻想三頁並擴充服裝、材質、
  背景、姿勢等元素。因圖量大，拆 4 組子代理各看 40 幾張，逐張以 Read 工具開圖
  分類＋萃取視覺技法；嚴格套用版權角色名規則——只取材質/服裝款式/姿勢/背景/光線
  的純視覺描述，完全不寫角色名、作品名、遊戲名、真人姓名（4 批分析中都有標記
  含角色 cosplay 浮水印或真人宣傳海報的圖片，已個別排除或只取視覺技法）。
- 三頁架構不同，新增元素落點也不同：
  - **fantasy-fashion.html**：本來就有獨立的 `garment`/`material`/`background`/
    `pose`/`lighting` 選項池，直接在各池尾端追加新卡片（garment +8、material +8、
    background +8、pose +6、lighting +6）。
  - **travel.html**：沒有獨立的材質/背景欄位，材質敘述併入 `costume`（服裝）
    desc 文字，背景併入既有的「地點/主題」`themePreset` 快選 chip（本來就是純
    文字地點清單，選中會直接填進 `themeInput`，无需額外 mapping）。新增
    costume +8、themePreset 地點 chip +10、lighting +6、pose +6。
  - **magazine.html**：`bg`（背景）已是獨立選項池，直接追加 +8；服裝方向沒有
    獨立欄位，比照 travel 的做法，加進「主題/服裝方向」`themePreset` chip
    （新增一組「✦ 私房棚拍風」共 6 個），但**特別確認**這些新 chip 沒有寫進
    `THEME_PRESET_DEFAULTS` 這個會連動覆寫 bg/pose/framing/lighting 等欄位的
    預設連動表——只當純文字造型方向、不觸發任何 cascade，避免碰到
    `core-prompt-contract.md` 標記的「預設連動覆寫使用者選擇」高風險區。新增
    pose +6（分散進坐姿群/手勢群）、lighting +5。
  - 所有新增前都先 grep 過三頁既有的選項 `value` 清單，確認新 key 不會撞名。
- **驗證**：`check-static.mjs` 全過；`build-prompt-preview.mjs` 對 5 組固定選項
  組合（未使用任何新選項）跑出 0 diff，證明純新增不影響既有輸出；
  `audit-100x.mjs` 對五頁各跑 100 組隨機組合（隨機邏輯本來就是讀取全部即時
  DOM 選項池，新增的選項會自然被抽到）共 500 次模擬，0 個問題（無 undefined/
  NaN/[object Object] 洩漏、身份鎖定完整、無相鄰重複行、無禁用角色名）。

## 2026-07-22（五）　修復：新增選項未接上真正的文字對照表，導致生成失效/內容缺漏

- owner 回報 fantasy「生成完整咒語」按鈕沒反應。追查發現：上一條記錄新增的
  UI 選項卡只加了 `<label>` 卡片本身，**沒有同步補上三頁各自用來把選項值轉成
  英文咒語文字的獨立資料表**：
  - `fantasy-fashion.html`：`garmentData`、`materialData`、`backgroundData`、
    `lightingData`、`poseData` 五個表，其中 `materialData` 每筆是
    `{label, prompt, palette}` 物件——新選項不存在時 `material.prompt` 對
    `undefined` 取屬性直接丟 `TypeError`，整個 `generate()` 中斷、畫面完全
    沒有輸出，這正是 owner 看到的「按下去沒反應」。`garmentData`/
    `backgroundData`/`lightingData` 是純字串表，缺項時不會丟錯但會讓輸出
    出現字面上的「undefined」。
  - `travel.html`：`COSTUME_DIRECTIONS`、`POSE_STYLES`、
    `TRAVEL_LIGHTING_STYLES` 三個表。前兩者組裝時有 `||null` 安全防呆，
    缺項只會靜默跳過該段落（選了新服裝/新姿勢等於沒選，不會報錯但也不會
    生效）；`TRAVEL_LIGHTING_STYLES` 沒有防呆，但下游用
    `...(lightingBlock?[lightingBlock]:[])` 展開，缺項一樣被安全省略，不會
    洩漏 undefined 文字。
  - `magazine.html`：`BACKGROUNDS`、`POSES`、`DETAIL_BLOCKS.lighting` 三個表。
    `POSES` 有防呆（`poseText?...:null`）；`BACKGROUNDS`／
    `DETAIL_BLOCKS.lighting` 都是直接字串插值，缺項會讓輸出出現「undefined」。
  - 補法：把上一條記錄新增的每個選項卡都在對應表裡各補一筆英文咒語文字
    （fantasy 5 表、travel 3 表、magazine 3 表，共 75 筆），文字內容延續
    各表既有的語氣與格式（fantasy 用短句 prompt/palette、travel/magazine
    用中文模組標題＋條列英文指令的多行樣式）。
- **重要教訓**：`audit-100x.mjs` 這次完全沒抓到問題——因為它是「重新實作一份
  組裝邏輯直接讀 DOM 的 name/desc 文字」來跑 500 次模擬，不是真的執行頁面上
  `generate()` 這個函式，所以測不出頁面自己維護的獨立資料表缺項。**往後任何
  新增/修改選項卡的變更，除了 `audit-100x.mjs`，必須另外用 jsdom 載入真實
  HTML、對新選項逐一 dispatch change + 點擊真正的 `generateBtn`，確認
  `outputText` 沒有變成短字串、沒有 `undefined`/`NaN` 字樣、且視窗沒有噴
  `error` 事件——這次補資料表後就是用這套測試逐一驗證三頁共 78 個新選項值。**
- **驗證**：`check-static.mjs` 全過；`build-prompt-preview.mjs` 5 組固定組合
  （不觸及新選項）仍 0 diff；`audit-100x.mjs` 500 次模擬仍 0 問題（如上述，
  這個腳本測不到這類問題，僅供既有邏輯的迴歸確認）；新寫的 jsdom 逐選項點擊
  測試——fantasy 36 項、travel 20 項、magazine 19 項，共 75 項全部通過
  （輸出長度正常、無 undefined/NaN、無 JS 錯誤）。

## 2026-07-22（六）　三頁選項分類稽核：刪除誤放項目、整併重複、新增幻想兩大主題

- owner 要求檢查三頁每個選項是不是放對分類，並評估要不要補姿勢/服裝/材質等
  缺口。拆三個子代理（純文字比對，不開圖）分別稽核 travel/magazine/fantasy，
  逐一比對每個選項的中文標題與說明是否符合該頁定位，並列出重複/近似重複與
  缺口候選。owner 逐項回覆後，實際執行的部分：
  - **travel.html**：地點快選 chip 裡混入 6 個明顯奇幻/科幻設定（京都伏見稻荷
    九尾妖狐、秋葉原科技機器女郎、布拉格古城魔法女巫、英國古堡吸血鬼女王、
    東京霓虹賽博女忍者、歐洲聖堂天使戰姬）——這些內容本來就已經在 fantasy 頁
    的材質/服裝池裡有對應（九尾狐神光、天使羽翼高訂、機甲未來系等），屬於
    重複建設，直接從 travel.html 刪除，不搬遷。保留另外 2 個邊界案例（東京
    原宿cosplay貓女、巴黎哥德教堂暗黑修女）。順手把 themeInput 的 placeholder
    範例文字從被刪的九尾妖狐改成保留的貓女範例。
  - **magazine.html**：
    - `bow_hero`（拉弓動作）desc 拿掉「英雄姿態」字眼（改「持弓側身張力姿」），
      英文 POSES 文字裡的 `Strong Heroic Fashion Editorial Gesture` 也改成
      `Strong Sculptural Fashion Editorial Gesture`，降低戰鬥角色感。
    - `dessert_table`（甜點商品棚）desc 補一句「人物置身甜點桌旁」，強調這是
      人像背景不是純商品棚拍。
    - 刪除 3 個零引用的重複 themePreset chip：「現代極簡」（跟極簡主義/極簡
      高級重疊）、「西裝女王」（跟黑色西裝女王重疊，且無 THEME_PRESET_DEFAULTS
      連動）、「高級訂製」（跟高級訂製宣傳重疊）。刪除前都先 grep 過
      `THEME_PRESET_DEFAULTS`、`POSE_THEME_MAP`、`QUICK_MAGAZINE_PRESETS`
      確認零引用才動手，避免重演上一條記錄的漏改對照表問題。
    - 刪除 2 個零引用的重複 bg：`solid_color`（跟 studio 重疊）、
      `plain_gray_backdrop`（上一批新增的，跟既有 4 個純色棚背景重疊，直接砍
      掉最新加的比動既有的風險低），同步移除 `BACKGROUNDS` 文字條目與
      `BG_LIGHTING_MAP` 裡對應的一行。
    - `concrete`/`dark_gray_concrete`、`低坐回望`/`側坐回頭` 這兩組因為被多個
      `THEME_PRESET_DEFAULTS`/`QUICK_MAGAZINE_PRESETS` 引用，風險較高，維持
      不動。
    - `抱膝坐姿`(hug_knees,舊)／`抱膝側坐`(hug_knee_sit,上一批新增) 改寫後者的
      中英文措辭，明確標出「側身面向鏡頭、慵懶雜誌感」跟前者「情緒感強」的
      差異，不刪除。
  - **fantasy-fashion.html**：
    - `material` 池裡兩筆中文名稱都叫「玻璃火焰」(`glassFlame`/
      `glassFlameOpera`)，後者改名「玻璃火焰．劇院版」（同步改
      `materialData.glassFlameOpera.label`），只改顯示文字，`value`/key 不動
      （`glassFlameOpera` 有被一鍵模板 `data-template="glassFlameOpera"` 引用）。
    - `background` 的「礁岩海岸潮池」(`rockyCoastTidepool`) owner 確認不動。
    - 新增兩個目前完全沒覆蓋到的主題方向：**暗黑哥德巫術**（material 6 項、
      garment 2 項、background 3 項、lighting 2 項）與**賽博霓虹都市**
      （material 6 項、garment 2 項、background 3 項、lighting 2 項），
      共 26 個新選項卡，每一項都同步補齊 `materialData`/`garmentData`/
      `backgroundData`/`lightingData` 對照表（這次記取教訓，新增選項卡跟補
      對照表一起做，不是分開兩批）。另外各配一個「00 一鍵主題模板」新按鈕
      （`gothicWitchRitual` 暗黑哥德巫術儀式、`cyberNeonPulse` 賽博霓虹都市
      脈動），讓新主題可以一鍵套用，不用在大選項池裡逐一手選。
- **驗證**：`check-static.mjs` 全過；新寫 jsdom 測試 44 項全過——確認 6+3+2
  個刪除項目在真實 DOM 裡確實消失、3 個保留項目仍在、fantasy 新增的 26 個
  選項值＋2 個新模板逐一點真正 `generateBtn` 都輸出正常（無 undefined/NaN/
  JS error）、三頁預設狀態直接生成也正常；`build-prompt-preview.mjs` 5 組
  固定組合仍 0 diff（刪除/新增的都不在這幾組固定選項裡，純淨迴歸）；
  `audit-100x.mjs` 500 次模擬 0 問題。
- 本次刪除/改名前都先用 grep 逐一確認目標字串在 `THEME_PRESET_DEFAULTS`、
  `POSE_THEME_MAP`、`QUICK_TRAVEL_PRESETS`、`QUICK_MAGAZINE_PRESETS`、
  fantasy 的 `themeTemplates`/`data-template` 裡有沒有被引用，零引用才刪，
  有引用的一律只改顯示文字、不動 value/key——這是為了不重蹈上一條記錄「新增
  選項忘記同步補資料表」的覆轍，這次反過來也要求「刪除/改名前先查一鍵模板
  系統有沒有依賴」。

## 2026-07-22（七）　幻想頁材質新增：天象自然現象系

- owner 實際看過線上頁面後提出精準建議：「銀河穿在身上」這類概念該放
  **04 主題材質**，不是 03 服裝輪廓——因為服裝輪廓決定衣服形狀（高訂禮服、
  拖尾長裙），材質才決定效果/世界觀，網站自己的 hint 文字也是這樣寫的。owner
  列了 9 個候選（銀河星海、星雲薄紗、深空星塵、極光流紗、月蝕光環、太陽耀斑、
  流星雨、宇宙黑洞、星河水瀑），並建議再擴大成「自然現象×天象實體化」整組
  （加上海浪、雷電、雲霧、熔岩、暴風雪）。
- 檢查後發現 9 個候選裡有 3 個其實已經存在（`nebulaGasVeil` 星雲氣體薄紗、
  `auroraSilk` 極光薄紗、`mirrorEclipse` 鏡像月蝕，都在既有的「寶石琉璃光絲」
  子分類裡），所以沒有重複新增，只新增真正缺口的部分：新開一個「✦ 天象自然
  現象」子分類，共 11 項材質——銀河星海(`galaxyOceanDrape`)、深空星塵禮服
  (`deepSpaceStardust`)、太陽耀斑華服(`solarFlareGown`)、流星雨拖尾裙
  (`meteorShowerTrain`)、宇宙黑洞吸積裙(`blackHoleAccretionGown`)、星河水瀑
  禮服(`galaxyWaterfallCascade`)、巨浪捲身禮服(`oceanWaveCouture`)、雷暴閃電
  禮服(`lightningStormGown`)、雲霧繚繞紗裙(`mistCloudVeil`)、熔岩岩漿禮服
  (`lavaMagmaGown`)、暴風雪斗篷(`blizzardSnowstormCloak`)。新增選項卡與
  `materialData` 對照表一起完成（延續前兩條記錄的教訓，不分批做）。
- **驗證**：`check-static.mjs` 全過；新寫 jsdom 測試對 11 項新材質逐一點真正
  `generateBtn`，全部輸出正常（無 undefined/NaN/JS error）；
  `build-prompt-preview.mjs` 5 組固定組合仍 0 diff；`audit-100x.mjs` 500 次
  模擬 0 問題。

## 2026-07-22（八）　雜誌頁新增漢服款式與二次元角色風 themePreset

- owner 想在雜誌頁多幾組「新式漢服」跟「cos服裝」。先出 3 套架構方案讓 owner
  選：方案一（純加現有 chip，不動架構）、方案二（新開獨立服裝款式欄位，比照
  fantasy 頁 garment 邏輯，工程量大）、方案三（漢服走 chip，cos服裝獨立做一鍵
  速選按鈕列）。owner 選方案一。
- **中式古風**分類追加 6 個漢服款式 chip：齊胸襦裙、明制立領襖裙、唐風大袖衫、
  宋制褙子、魏晉廣袖、漢服劍俠束腰款——維持既有 3 個漢服相關 chip（改良式
  漢服/新式漢服/宋制溫婉）不動，純新增。
- 新開一個**「✦ 二次元角色風」**分類，共 8 個 cos服裝 chip：元氣偶像社團服、
  魔法少女變身服、校園風紀委員制服、銀髮劍士戰袍、機甲駕駛員緊身服、治癒系
  巫女裝、暗黑元素法師袍、機械義肢傭兵勁裝。這些都是**非IP角色原型**描述
  （比照 fantasy 頁「貓系女僕」「女武神」的做法），不含任何角色名/作品名/
  遊戲名，符合版權規則。跟先前的「私房棚拍風」分類一樣**不掛
  `THEME_PRESET_DEFAULTS` 連動**，純文字造型方向，不觸發任何 cascade。
- **驗證**：`check-static.mjs` 全過；新寫 jsdom 測試對全部 14 個新 chip 逐一
  點擊＋點真正 `generateBtn`，確認輸出正常、且咒語裡確實包含該 chip 的文字
  （驗證 chip 真的有生效，不是選了但沒作用）；`build-prompt-preview.mjs` 5
  組固定組合仍 0 diff；`audit-100x.mjs` 500 次模擬 0 問題。

## 2026-07-22（九）　fantasy 新增「妖狐夜櫻高台」一鍵模板＋修正 intensity 靜默失效問題

- owner 提供本機一張參考圖並要求分析（狐耳狐尾和風角色 cosplay 圖，左側橫幅
  直接印出角色名與作品名）。分析時依規則完全不提角色名/作品名，只回報視覺
  技法：紫金和風套裝、多層薄紗罩袍、金鍊墜流蘇腰封、夜櫻高台欄杆、滿月古樓
  燈籠、持扇側身站姿、冷暖對比光。單一元素其實都已存在於 fantasy 頁
  （`foxMythCouture` 妖狐神話高訂、`foxfireTails` 九尾狐神光、`moonPavilionNight`
  月夜古樓、`fan_cover` 持扇遮面、`moonlightCandle` 月光燭火混合光），但沒有
  一個模板把它們組成這個畫面，owner 同意新增。
- 新增一鍵模板 `foxMuseMoonlitPlatform`（妖狐夜櫻高台），組合上述既有選項；
  沒有新增任何選項卡或對照表，純粹是既有元素的新排列。
- **意外發現並修正一個既有的靜默失效問題**：`themeTemplates` 物件裡的
  `composition`／`intensity` 兩個欄位，`applyThemeTemplate()` 是用
  `document.querySelector('input[value="..."]')`／`select.value = "..."`
  去精準比對既有選項的字串。`composition` 只有 6 種固定文案、`intensity`
  （`<select>`）只有 3 種固定文案，如果模板作者填的是自己新寫的敘述句（沒有
  逐字對到那 6 或 3 種既有文案），瀏覽器對 `<select>.value` 指派不存在的
  option 值時會靜默變成空字串——模板套用後那個欄位其實沒生效，但因為
  `applyThemeTemplate` 沒有拋錯，肉眼也看不出來。實測發現上週新增的
  `gothicWitchRitual`／`cyberNeonPulse` 兩個模板的 `intensity` 都中了這個坑
  （兩個都是原創敘述句，沒對到 3 種既有選項），一路以來這兩個模板的材質強度
  說明其實都沒真正套用到咒語裡。已改成從 3 個既有 `intensity` 選項裡挑最貼近
  的固定文案，`composition` 也統一改用既有的 6 種固定文案之一，不再新寫敘述
  句。（這是舊有 40 個模板就存在的架構限制，這次只修了我自己新增的 3 個，
  沒有動其餘既有模板——那是更大範圍的清查，先記錄在待辦。）
- **驗證**：`check-static.mjs` 全過；新寫 jsdom 測試確認三個模板套用後
  `intensity`／`composition` 欄位確實被選中且文字有進到最終咒語裡（不再是
  靜默空值）；`build-prompt-preview.mjs` 5 組固定組合仍 0 diff；
  `audit-100x.mjs` 500 次模擬 0 問題。

## 2026-07-22（十）　清查並修復舊有 40 個 fantasy 模板的 composition 靜默失效

- 承接上一條待辦，寫稽核腳本把 `themeTemplates` 物件（57 個模板）跟 HTML 上
  實際的 7 種 `composition` 固定文案、3 種 `intensity` 固定文案逐一比對字串
  是否完全相符。結果：**40 個模板的 `composition` 對不上**（作者當初寫的是
  原創敘述句，不是逐字複製既有選項），套用這些模板時構圖欄位完全沒被設定，
  會停留在使用者當下原本的構圖；`intensity` 這次反而全部正常（上次那兩個
  已經修過）。
- owner 確認「都改，照你的方式」。做法：讀每個模板原本 `composition` 敘述句
  的語意關鍵字（diagonal / symmetrical / frame / surround / centered / 留白
  等），對應挑選 7 種固定文案裡最貼近原意的一個，寫成對照表後用腳本批次做
  精準字串替換（40 筆全部一次比對成功，沒有誤觸其他欄位）。
- **範例對應邏輯**：`darkIceQueen` 原文「centered commercial key visual, subject
  framed by dark ice crystals...」開頭就是「centered commercial key visual」
  → 直接對應「人物置中主圖」；`milkTeaSplashDress` 原文開頭「diagonal dynamic
  advertising layout」→ 對應「斜線動態構圖」；`bettaFishWaterGown` 原文「fish
  orbit around the gown」（材質圍繞人物）→ 對應「材質包圍人物」。
- 順手發現一個獨立的既有清潔度問題（**不影響功能，先記錄不動**）：
  `themeTemplates` 裡有 15 個模板定義（如 `redPaperWedding`、
  `auroraBubbleChampagne`、`gummyCandyAd` 等）**沒有任何按鈕接到它們**，是
  已定義但用不到的孤兒資料，可能是舊版按鈕被移除但物件沒同步清掉。不影響
  現有功能，之後有空再一併清理。
- **驗證**：稽核腳本複跑確認 57 個模板的 composition/intensity 全部 100%
  對應到既有固定文案；`check-static.mjs` 全過；新寫 jsdom 測試對全部 42 個
  實際有按鈕的模板逐一點擊，確認 composition 有被選中、intensity 不是空值、
  輸出正常無 undefined/錯誤；`build-prompt-preview.mjs` 5 組固定組合仍
  0 diff；`audit-100x.mjs` 500 次模擬 0 問題。

## 2026-07-22（十一）　旅拍頁補地點快選 + 全專案上架前檢查

- 補回稍早稽核報告裡列過、owner 當時沒選進優先項的旅拍地點缺口候選：九份
  老街、日月潭、阿里山日出、荷蘭鬱金香花田、泰姬瑪哈陵、吳哥窟、下龍灣、
  澳洲大堡礁、優勝美地國家公園、冰島極光，共 10 個，比照既有 chip 純文字
  地點的加法（不需要對照表，選中會直接填進 `themeInput`）。
- owner 要求「全專案檢查後上架」。除了固定的三個腳本，這次額外寫了一個
  **preset/模板引用有效性交叉驗證**腳本：把三頁所有的預設連動物件
  （travel 的 `QUICK_TRAVEL_PRESETS`＋`TRAVEL_STYLE_PRESET_DEFAULTS`、
  magazine 的 `QUICK_MAGAZINE_PRESETS`＋`STYLE_PRESET_DEFAULTS`＋
  `THEME_PRESET_DEFAULTS`、fantasy 的 `themeTemplates`）裡每一筆用到的每個
  欄位值，逐一比對是否存在於該頁當下 DOM 的即時選項池——這正是能抓出上一條
  記錄那種「composition 對不上」問題的通用檢查法，往後任何一頁的預設系統
  出現同類拼字/對不上問題都能一次篩出來。用 `dom.window.eval()` 讀取頁面
  內 `const` 物件（top-level const 不會掛在 `window` 上，用 eval 在頁面自己
  的 global scope 內執行才拿得到）。
- **結果**：三頁共 195 筆預設/模板條目（travel 12+8、magazine 21+34+63、
  fantasy 57）全數比對通過，0 個引用失效——確認這次新增/刪除/改名都沒有
  遺漏，也代表 fantasy 的 composition/intensity 問題這次是徹底清乾淨了。
- **驗證**：`check-static.mjs` 全過；新寫 jsdom 測試對 10 個新地點逐一點擊
  ＋點真正 `generateBtn`，確認輸出正常且地點文字有進到咒語裡；
  `build-prompt-preview.mjs` 5 組固定組合仍 0 diff；`audit-100x.mjs` 500 次
  模擬 0 問題。

## 2026-07-22（十二）　桌面三張風格範例歸類後補棚拍與幻想模板

- 讀取 owner 指定的桌面範例資料夾 `C:\Users\User\Desktop\ai生圖\風格範例`；
  當下只有 3 張 JPG、沒有咒語文字檔。分類結果：紅花薄紗私房歸雜誌棚拍、
  白藍金造型歸「未來系 Cos 風寫真」（只取原創 cosplay 視覺語彙，不取 IP/角色名）、
  花卉紗藝女神歸幻想廣告。
- `magazine.html` 新增 02 主題 chip 兩個：「紅花薄紗深 V 禮服」與
  「未來系 Cos 風寫真」，並補 `THEME_PRESET_DEFAULTS` 與一鍵套用按鈕。
  紅花薄紗版本用「deep V neckline + chest area covered by layered embroidered
  floral tulle + no nudity/no explicit exposure」把深 V 限定為合法合規的服裝剪裁；
  未來系版本使用 `original futuristic cosplay-inspired portrait` 並明確排除
  copyrighted character / anime franchise identity。
- 修正 `magazine.html` 的「隨機套用｜棚拍封面感覺」02 主題未穩定顯示選中的問題：
  隨機不再只填 `themeInput` 文字，而是直接選中實際 chip；一鍵套用也改為可以保留
  chip selected 狀態，同時讓 `themeText` 輸出更精準的長描述。
- `fantasy-fashion.html` 新增「花卉紗藝女神」模板，使用雲紗禮服、四季花靈材質、
  背對回首、側臉鏡頭、逆光丁達爾光束、材質牆面與 9:16 版面。
- **驗證**：`check-static.mjs` 全過；`validate-preset-refs.mjs` 全過
  （magazine quick presets 23、theme defaults 65、fantasy templates 58 全部引用有效）；
  `audit-100x.mjs` 500 次模擬 0 問題；`build-prompt-preview.mjs` 正常產出
  `output/ab-test-2026-07-22`。

## 尚未完成 / 待 owner 決定

- fantasy 頁有 15 個 `themeTemplates` 孤兒定義（沒有按鈕連到），要不要清掉
  或幫它們補按鈕，待 owner 決定（見 2026-07-22（十）記錄）。

- ChatGPT 出圖實測：第三波核心瘦身 A/B（`output/ab-test-2026-07-07-c-final/`）、
  第四波新選項抽測、特效模板抽測、水晶場景抽測、三頁 UI 統一後的手動點測。
- `doll.html` 仍是「手動生成、無 stale 保護、一鍵主題不會自動顯示」的舊模式
  （travel/magazine 統一前的樣子），若要套用同一套規則需 owner 另外確認。
- `store-ad.html` 本質是「即時重算、無隱藏態」的完全不同設計（表單填一半就即時
  看到海報企劃），目前判斷不適合套用 stale 機制，維持現狀。
- L5：travel 風格模組加「主題與風格衝突時以主題為準」的裁決句——會改既有輸出文字，
  屬核心咒語保護契約管制範圍，需 owner 先看過改前/改後對照才能動。

## 2026-07-22（十三）　動漫變身合鏡咒語產生器 v4.4 第一版

- 新增 `anime-hero.html`，以既有 fantasy 的身份鎖定、真人骨架、光線一致性與負面約束
  為核心；上傳者是唯一真人身份來源，第二存在明確限制為原創、遮面／非人臉的裝甲、
  機械、靈體或神獸，避免生成第二張人臉或身份漂移。
- 將「人物動漫＋變身／機甲／聖衣／替身」拆為獨立的合鏡主模式、角色原型、力量系統、
  互動姿勢、道具、背景世界、背景特效、電影鏡頭與色彩欄位；各組合由咒語動態組裝。
- 背景特效獨立成為 `background special-effects direction`：能量環、天候爆發、裝甲召喚、
  神獸光影；另以規則要求特效框住畫面、不遮住上傳者臉部，且與人物和背景共用光源。
- 依 owner 對雜誌棚拍頁的欄位要求，補齊主題／服裝、身形輪廓、真人姿勢、9 種鏡頭感、
  4 種動態節奏、12 種圖片比例與 8 種最終呈現媒材。媒材選擇會切換真人／插畫的人體
  重建規則，並套用到人物、機甲、背景和特效，而不是只在咒語末端加入一個風格名稱。
- 首頁加入「動漫變身合鏡」入口；`check-static.mjs` 納入新頁檢查。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（十四）　動漫合鏡 UI 拆解與替身型守護靈擴充 v4.5

- 咒語結果預設維持隱藏，只有按下「生成動漫合鏡咒語」才會展開；一鍵世界觀與隨機套用
  改為只改選項、不自動打開輸出區，操作方式與幻想廣告頁一致。
- 原本合併的「角色與力量系統」拆為「角色原型」與「力量系統」；原本合併的背景區拆為
  「背景世界」與「特效導演」，並增加角色、力量、場景與特效的選項密度。
- 新增原創「替身型守護靈」原型與專用細節：守護靈形態、專屬能力、同步顯現規則；僅在
  該原型被選中時寫入咒語。設計吸收超自然守護靈的同框概念，但不使用既有作品名稱、角色
  或視覺識別。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（十五）　式神契約系統 v4.6

- 動漫合鏡頁新增「式神契約」合鏡模式及「式神靈媒使者」角色原型，讓真人主角透過
  符紙、靈印、召喚法陣和非人型守護靈完成電影海報構圖。
- 補齊六種原創式神形態（符紙飛鳥、鎮守靈獅、白蛇靈使、烏鴉信使、無面面具靈、古樹木靈）
  與六種契約演出（封印、法陣、護符、祭儀、附身、靈門），且只在式神靈媒原型下寫進咒語。
- 新增「符咒式神契約」一鍵配置；概念採原創靈媒／式神世界觀，不使用既有作品角色、名稱、
  標誌或視覺識別。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（十六）　動漫合鏡 01～09 選項擴充 v4.7

- 依 owner 指示，01～09 每一區至少新增 5 個可選要素，並同步補齊所有選項對應的咒語
  描述：合鏡模式、服裝、身形、角色原型、力量、守護靈細節、姿勢／互動、背景世界、
  特效導演皆可自由組合。
- 新增選項透過同一份資料表渲染 UI 並寫入 prompt，避免 UI 與咒語資料脫節；守護靈與
  式神類選項仍遵守「非人臉、原創存在」約束。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（十七）　乾淨背景選項 v4.8

- 「08 背景世界」新增單色無縫背景與電影攝影棚。前者保留細微漸層與地面陰影，後者提供
  柔光棚燈、霧面布景與受控薄霧，讓人物和守護靈成為畫面唯一主體。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（十八）　雙角色動作姿態擴充 v4.9

- 「07 人物姿勢、合鏡互動與道具」新增 17 個電影海報級選項：劍尖指鏡頭、衝刺、低姿勢
  迎戰、空中躍起、披風甩動、結印、肩扛武器，以及交叉突擊、背後王座守護、雙重必殺、
  左右夾擊、天空壓陣、環形守護陣、能量武器交接、戰後並肩等。
- 每項都帶有肢體自然性、臉部淨空與雙角色輪廓分離描述，避免帥氣動作造成手部或姿勢崩壞。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。
