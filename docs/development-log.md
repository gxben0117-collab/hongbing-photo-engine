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

## 2026-07-22（十九）　主角—第二存在關係鎖定系統 v4.10

- 新增「06 關係敘事系統」，置於角色／力量與姿勢之間。包含 8 種關係模式、4 級關係
  強度與 6 種關係視覺證據，預設為「守護靈顯現＋強關聯＋共享核心」。
- 生成咒語新增高優先級 Relationship Causality System：要求第二存在必須由主角生成、
  回應、變身、同步或被召喚，並透過共享核心、能量鏈、裝甲／符紙流動、法陣、鏡像或影子
  顯示明確因果；明確排除泛用並排雙人海報與獨立擺拍的第二角色。
- 對「變身前後同體」與「裝甲召喚」提供專用語意，避免模型將完成型角色當成另一位隊友。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（二十）　一鍵關係故事模板 v4.11

- 一鍵世界觀由單純風格預設升級為完整關係故事模板。既有聖衣、機甲、替身與式神模板都
  補入關係模式、強度和視覺證據。
- 新增鳳凰變身覺醒、時間守護召喚、黑闇影子化身、晶核雙重必殺四組模板，分別強制同體
  變身、能量牽引、影子化身與靈魂契約等不同因果敘事。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（二十一）　01～09 第二輪選項擴充 v4.12

- 依 owner 指示，當前頁面 01～09 每一區各再增加 10 個要素。關係敘事、守護靈、姿勢與
  背景皆採跨子群組平均擴充，總計新增至少 90 個可組合選項。
- 所有新選項共用資料驅動 UI 與 prompt 映射；關係敘事的新增條目同樣受高優先級因果鎖定，
  不會退化成單純的無關雙人海報。
- 驗證：`node scripts\\check-static.mjs` 全過；`git diff --check` 全過。

## 2026-07-22（二十二）　雜誌服裝與幻想背景擴充 v4.13

- 動漫合鏡頁新增 10 組雜誌棚拍語言的主角服裝：黑金高訂、紅花薄紗、象牙蕾絲、韓系
  舞台戰甲、銀色金屬編輯裝、復古摩登、婚紗聖騎甲、東方刺繡、孔雀羽高訂與雕塑白戰衣。
- 新增 10 組幻想廣告語言的背景：銀河海洋、巨型花雕塑庭園、雲海宮殿、玻璃火焰劇院、
  霓虹酸雨街、摺紙世界、鏡像月蝕大廳、蕾絲聖堂、水晶瀑布洞窟與水墨浮山。
- 全專案驗證：`check-static.mjs`、`build-prompt-preview.mjs`、`audit-100x.mjs`（500 組）、
  `validate-preset-refs.mjs`、`git diff --check` 全部通過。

## 2026-07-23（一）　動漫合鏡第二存在導演系統 v4.22

- 依 owner 確認的改善方向，將第二角色決策重新組成「類型 → 關係／誕生方式 → 外型模板 → 顯現階段 → 畫面職責 → 鏡頭位置與尺度」；既有替身、式神與關係證據選項完整保留。
- 新增第二存在導演系統：顯現階段、畫面職責、鏡頭位置、無人臉面部規則，以及機甲專屬型態。所有導演設定會直接寫入咒語。
- 將原「合鏡主模式」改名為第二存在類型、角色原型改名為第二存在外型模板、關係區改名為第二存在關係與誕生方式，降低重複決策。
- 變身與聖衣模式在導演咒語中明確壓制獨立第二身體；機甲模式則顯示專屬型態選項。
- 改前／改後說明已記錄於 `docs/history/anime-second-entity-director-v4.22.md`。

## 2026-07-23（一）　動漫合鏡服裝三分類 v4.21

- 02 服裝介面依 owner 定義拆為三組：正常服裝／套裝／制服、戰鬥服、高訂風格戰鬥服；既有服裝全部保留並重新放入明確分類。
- 修正新增時裝與既有「雕塑白色戰衣」使用相同值的重複問題，將純時裝版改為 `architecturalWhite`，保留兩者不同的咒語與用途。
- 選項對應稽查同步改用新值，避免分類調整後出現無映射服裝。
- 改前／改後說明已記錄於 `docs/history/anime-outfit-categories-v4.21.md`。

## 2026-07-23（一）　動漫合鏡高訂儀式戰禮服語言 v4.20

- 依 owner 提供的成圖，新增「赤黑金符印高訂戰禮服」：刺繡薄紗、流蘇符印、金屬飾件與局部裝甲感，定位為時裝優先而非全身盔甲。
- 將同一套高訂儀式戰禮服的設計語言作為非校園服裝的可選擇性加成：保留原服裝與力量配色，不強迫全部變黑紅金或厚重戰甲。
- `schoolHero` 與未來可能加入的水手服值列為排除，維持乾淨、可辨識的原本學生制服設計。
- 改前／改後說明已記錄於 `docs/history/anime-couture-battle-language-v4.20.md`。

## 2026-07-23（一）　動漫合鏡雜誌時裝擴充 v4.19

- 02「主題／服裝方向」保留全部既有戰鬥服、聖衣、機能裝與儀式裝，新增 10 組雜誌棚拍／高訂時裝：雕塑白色、黑天鵝絨、液態絲綢、權力西裝、粗花呢、針織長裙、水晶雞尾酒、婚紗、流蘇舞台與現代東方訂製服。
- 時裝咒語明確要求不自動武裝化；奇幻感改由已選擇的力量系統、守護者、機甲與背景承擔。服裝與選項稽查同步擴大至新增時裝。
- 改前／改後說明已記錄於 `docs/history/anime-editorial-outfits-v4.19.md`。

## 2026-07-23（一）　動漫合鏡畫風擴充與選項對應稽查 v4.18

- 新增 7 種畫筆／繪畫風貌：水墨國風、透明水彩、厚塗概念美術、不透明水粉、浮世繪版畫、炭筆速寫、粉彩蠟筆；全部附帶專屬媒材硬鎖定與排他規則。
- 新增 `scripts/verify-anime-options.mjs`，稽查每個動漫頁可點選的 radio 選項是否具有咒語映射、關係系統映射、媒材硬鎖定與一鍵世界觀映射；同時檢查產生、複製與自訂欄位的串接。
- 改前／改後說明已記錄於 `docs/history/anime-style-and-option-audit-v4.18.md`。

## 2026-07-23（一）　動漫合鏡呈現媒材硬鎖定 v4.17

- owner 指出「最後呈現媒材」代表畫筆／畫風與整體視覺風貌，不是服裝表面材質；稽查後確認共用輸出規格的商業攝影語言會稀釋漫畫、動畫、油畫與插畫效果。
- 新增媒材硬鎖定：寫實、漫畫封面、時尚插畫、油畫、黑白攝影、美式漫畫、韓系網漫畫、日系動畫各自具備專屬輸出媒材語言與排他約束。
- 生成時以選擇的媒材規格取代共用的攝影輸出規格，讓畫筆、線條、賽璐璐、網點、畫布、黑白銀鹽等風貌成為最終渲染優先級。
- 改前／改後說明已記錄於 `docs/history/anime-render-medium-lock-v4.17.md`。

## 2026-07-23（一）　動漫合鏡系統介面與因果稽查 v4.16

- 稽查變身、替身、機甲、式神的 UI 與咒語串接，修正「變身完成」仍可能出現獨立隊友、式神模式未必帶入式神細節，以及隨機模式可混搭不相容設定的問題。
- 主模式改為明確敘事語言：變身前後同體、守護替身顯現、聖衣組裝召喚、駕駛者／機甲連線、式神契約儀式；各模式生成時加入不可覆寫的系統執行規則。
- 詳細選項改為情境顯示：選替身才顯示替身形態／能力；選式神才顯示式神形態／契約；兩者同時需要時才一起保留。模式切換會帶入相應的關係、強度與視覺證據。
- 隨機電影主視覺改從已調校的一鍵世界觀中抽選，避免角色、關係、道具與背景互相矛盾。
- 改前／改後說明已記錄於 `docs/history/anime-system-audit-v4.16.md`。

## 2026-07-23（一）　動漫合鏡第二存在身份隔離 v4.15

- 以同一張上傳人物照實測高相似度模式，確認主角身份可辨識，但守護靈仍可能複製主角臉。
- 高相似度模式新增「第二存在身份隔離」：守護者、替身、式神、裝甲靈或機甲不得複製、鏡像、回聲、克隆或重用主角臉部身份；第二存在必須是非人、面具化、無臉、抽象、靈體、機械或獸型。
- 保留主角—第二存在的召喚／變身因果，不套用雜誌頁的單人規則；改以「唯一暴露人臉」保障合鏡功能。
- 改前／改後說明已記錄於 `docs/history/anime-second-existence-isolation-v4.15.md`。

## 2026-07-23（一）　動漫合鏡高相似度鎖臉模式 v4.14

- owner 明確要求改造 `anime-hero.html` 的核心 prompt 優先序，並提供完整鎖臉與衝突處理
  規格；本次屬核心咒語高風險變更，改前／改後說明已記錄於
  `docs/history/anime-high-similarity-lock-v4.14.md`。
- 新增預設開啟的「高相似度鎖臉模式」。身份與臉部幾何維持最先，新增絕對身份優先、
  衝突元素自動降級、臉部五官淨空、唯一暴露人臉與守護者不可成為身份來源等規則。
- 模式開啟時，鏡頭自動限制為平視、自然 3/4 或輕微英雄仰角；隨機套用同樣排除側臉、
  高／低極端角度與遠距主視覺。關係敘事則移至身份核心之後，保留召喚／變身因果。
- 驗證：`node scripts\\check-static.mjs`、`git diff --check` 通過。

## 2026-07-23（二）　動漫合鏡擴充內容＋補齊驗證涵蓋（現行版：companion+interaction 架構）

- owner 要求優化 `anime-hero.html`（重建後的「配角＋互動」架構，見 commit
  `6446d74`），加更多帥氣的電影風格素材，並修掉所有 build/runtime error 直到
  「production build」（本專案沒有 npm build，等同四個驗證腳本全過）成功。
- 純附加、未改任何既有 key 的 value 或輸出邏輯：
  - 配角 +3：虛空死神使者、鏡界分身、雷霆巨像（皆為無臉/抽象造型，符合
    `SECOND_EXISTENCE_IDENTITY_ISOLATION` 規則）。
  - 互動姿勢 +3：騰空躍起同步、背對背蓄勢、鏡界對視。
  - 服裝 +6：戰鬥服 2（虛空裂隙戰袍/烈日聖甲）、一般服裝 2（電影首映禮服/
    復古軍裝風）、改良版 2（星河改良禮服/符文皮革戰裙）。
  - 海報語氣 +2：史詩奇幻大片感、新黑色驚悚感。鏡頭 +2：傾斜動態運鏡、
    追焦動態鏡頭。光影 +1：極光幻彩光效。背景 +2：古代競技場廢墟、浮空群島
    天空。輸出媒材 +1：好萊塢史詩全景（IMAX 感）。
  - 一鍵主題模板 +4：虛空死神覺醒、鏡界分身對峙、雷霆巨像壓陣、極光騰躍雙生
    （組合新舊元素，示範新素材可如何搭配）。
- **發現並修掉 build error**：`scripts/verify-anime-options.mjs` 是重建前
  （五型態/`SECOND_DIRECTOR_DATA`/`pick()` 架構）留下的驗證腳本，對照現行
  DOM 結構已完全對不上，執行會直接 TypeError 崩潰。確認其覆蓋範圍已被
  `validate-preset-refs.mjs`（欄位值存在性）與 `audit-100x.mjs`（內容稽核）
  取代後刪除，不再維護一份對不上現行程式碼的殭屍腳本。
- **補上原本缺失的驗證涵蓋**：`anime-hero.html` 先前完全不在
  `audit-100x.mjs`/`validate-preset-refs.mjs`/禁用角色名靜態掃描 的範圍內。
  - `validate-preset-refs.mjs` 新增 anime-hero 區塊：因為這頁的選項卡是
    JS data object 動態渲染（不是靜態 `name=/value=` markup），改成直接讀
    `companionData`/`interactionData`/`outfitBattle`+`outfitNormal`+
    `outfitHybrid`/`bodyData`/`styleData`/`cameraData`/`lightingData`/
    `backgroundData`/`fxData`/`ratioData` 的 key 當作「當下存在的選項」，
    驗證 `presets` 物件（20 筆）每個欄位值都對得上，跟 travel/magazine/
    fantasy 用 `liveRadioValues()` 掃 markup 的作法不同。
  - `audit-100x.mjs` 新增 anime-hero 模擬區塊：直接從 HTML 抽出
    `companionData`…`presets` 這段原始碼丟進 `vm`（context 補一個最小
    `document.getElementById` stub，讓段落裡順帶跑到的 `buildCards()` 呼叫
    不會因為缺 DOM 而丟錯），完整複刻 `generate()` 的組裝邏輯（含
    `customOutfit`/`customBackground` 覆寫分支），跑 100 組隨機模擬。
  - 禁用角色名靜態掃描清單補上 `anime-hero.html`。
  - 依 CLAUDE.md 規則，新增選項卡不能只靠上述模擬腳本驗證（它們是重新實作
    組裝邏輯，測不出「新增選項卡但忘了頁面自己會不會噴錯」），另外在
    scratchpad 暫時 `npm install jsdom`（未動專案本身依賴）寫一次性
    smoke test：真的載入 `anime-hero.html`、對全部 17 個新選項值逐一
    dispatch change、點真正的 `generateBtn`，以及點擊全部 4 個新一鍵模板
    按鈕與跑 20 次「隨機亂數組合」，檢查 0 JS error、輸出無 undefined/
    NaN/[object Object]/過短。
- 驗證結果：`check-static.mjs` 全過；`build-prompt-preview.mjs` 正常輸出；
  `validate-preset-refs.mjs` 7 組物件（含新增的 anime-hero `presets` 20 筆）
  0 issue；`audit-100x.mjs` 六頁共 600 次模擬 0 issue；jsdom smoke test
  44 項檢查（17 新選項 + 4 新模板 + 20 次隨機）0 JS error、0 failure。

## 2026-07-23（三）　動漫合鏡新增「構圖法則」獨立軸，回應 owner「想要更多帥氣好看的構圖」

- owner 上架實測後回饋想要更多好看的構圖；盤點發現原本畫面排列只靠「02 互動姿勢」
  （主角配角的關係擺位）跟「06 拍攝角度」（鏡頭視角）兩軸疊加，缺一個真正描述
  「畫面元素怎麼組成一張海報」的獨立構圖法則軸，導致同一個互動姿勢＋角度組合看久
  了會覺得排版都差不多。
- 新增獨立單選區塊「03 構圖法則」（`compositionData`，8 個選項）：縱深層次構圖、
  黃金三角構圖、對角張力構圖、對稱式對峙構圖、前景框景構圖、三分法偏軸構圖、
  放射爆發構圖、留白構圖（預留標題區）。跟互動姿勢／拍攝角度各自獨立，三者互乘
  可組出更多樣的畫面排版，不是彼此覆蓋。
- 因為新插入一個章節，02 之後的所有章節編號（服裝～輸出）整批 +1（03→04… 13→14），
  純顯示用的 `.section-label`/`.group-label` 文字重排，不影響任何欄位邏輯。
- `generate()`／`applyPreset()`／`applyTrueRandomCombo()` 都接上 `composition` 欄位；
  既有 20 個一鍵模板逐一指派對應的構圖法則（依主題挑選，例如背對背蓄勢配對稱式
  對峙構圖、召喚類配放射爆發構圖、環繞守護配前景框景構圖），讓舊模板套用後畫面
  排版也更講究，而不是全部落回預設值。**這是刻意的輸出變更**（每次生成從此都會
  多一段【構圖法則】），不是靜默 regression——owner 明確要的就是更多構圖變化。
- 驗證：`check-static.mjs`／`build-prompt-preview.mjs`／`validate-preset-refs.mjs`
  （anime-hero fieldLive 補上 `composition: keysOf('compositionData')`）／
  `audit-100x.mjs`（六頁共 600 次模擬，anime-hero 段落補上 composition pool／
  prompt 組裝）全過 0 issue；scratchpad jsdom smoke test 58 項檢查（8 種構圖法則
  逐一 dispatch change、全部 20 個一鍵模板、30 次隨機按鈕且確認 30 次內 8 種構圖
  全部出現過)，0 JS error、0 failure。

## 2026-07-23（四）　修正「背對背」等互動姿勢意外側臉（核心咒語變更，owner 已確認）

- owner 在 anime-hero.html 用「背對背蓄勢」實測，原圖正面、咒語也沒要求側臉，
  出圖卻側臉了；owner 貼 ChatGPT 診斷討論後確認根因，並指出「之前核心是寫以臉
  為主，姿勢配合臉部去產生」——原始設計意圖跟共用核心文字實際寫法方向不一致。
- 根因：`assets/core-prompt.js` 的 `CORE_REALISTIC_ANATOMY`（跨六頁共用骨架
  文字）裡「Pose must match head direction and facial gaze.」方向模糊，遇到
  anime-hero「背對背、各自面向相反方向」這類姿勢描述時，AI 把姿勢方向詞誤解成
  也要拖著臉一起轉。
- **改動 1（共用核心，影響全部 6 頁）**：把該句改寫成明確「頭優先，身體配合頭」
  的因果方向，不改變原本防止頭身角度不一致的防呆語意。完整改前/改後見
  `docs/history/face-orientation-fix-2026-07-23.md`。
- **改動 2（anime-hero 專屬）**：新增 `FACE_ORIENTATION_GUARD` 常數（插在
  【互動構圖】之後），明講「opposite direction/back to back/face one another」
  這類語言只描述肩膀軀幹，臉部仍需朝向鏡頭；並修正背對背蓄勢／鏡界對視／對戰
  蓄勢三個高風險互動姿勢文字，把身體轉向跟臉部朝向明確拆開。
- 這是核心咒語文字變更（`docs/core-prompt-contract.md` 管制範圍），事前已提供
  改前/改後對照並取得 owner 明確同意（「對」）才動手。
- 驗證：四個腳本全過（`audit-100x.mjs` 六頁 600 次模擬 0 issue）；scratchpad
  jsdom smoke test 對 5 種互動逐一驗證輸出含新 guard 且不含舊模糊句，0 JS
  error。`build-prompt-preview.mjs` 這次預期會有 diff（共用核心文字本來就是
  刻意變更，不是意外 regression）。

## 2026-07-24（五）　fantasy 服裝輪廓擴充、anime-hero 疊影構圖升級、全專案 jsdom 檢查

- owner 指定把 anime-hero.html「04-C 改良版（一般服裝＋戰鬥元素）」
  （`outfitHybrid`）裡的服裝移植到 fantasy-fashion.html「03 服裝輪廓」
  （`garmentData`）。17 款裡有 2 款（賽博街頭夾克／露腰機甲護甲短裙）fantasy
  已有近似版本先跳過，其餘 15 款純附加（赤黑金符印高訂戰禮服、黑金高訂戰衣、
  神話儀式禮裝、星座聖衣披風、水晶戰鬥禮服、月光戰鬥禮服、祭典戰甲、東方刺繡
  戰袍、銀羽鳳凰改良戰裙、哥德蕾絲甲裙、霓虹武士改良服、星輝改良制服、王族
  機甲禮服、星河改良禮服、符文皮革戰裙），未動任何舊選項 value/文字。
- owner 貼一段 ChatGPT 討論出的「雙角色疊影構圖」規格（前景真人三七分側身＋
  背景配角明顯放大、垂直軸線微偏移、30–50% 疊影比例、配角邊緣半透明／雙重曝光
  式消融、統一成單一疊影剪影而非左右並列），確認要**升級**既有的
  `interactionData.backGuard`（背後巨大守護）而非新增選項——這是既有互動選項
  的輸出文字變更，選到這顆的人之後生成內容會不同於之前版本。
- 承接上一輪的「no handheld transformation device」修改，anime-hero 這一批
  已有兩處輸出文字變更（`prop` 空欄邏輯、`backGuard` 疊影構圖），故本次額外做
  一次全專案檢查而非只驗證單一改動。
- 驗證：`check-static.mjs`／`validate-preset-refs.mjs`／`build-prompt-preview.mjs`
  （anime-hero 不在此腳本覆蓋範圍內，五組舊組合 0 diff）／`audit-100x.mjs`
  （六頁共 600 次模擬 0 issue，anime-hero 走 VM 載入真實 `interactionData`／
  `garmentData` 等 object，非重寫模擬，故 backGuard 文字改動有被真正驗證到）
  全過。另外在 scratchpad 用真正的 npm 安裝 jsdom（僅供這次驗證，不進專案
  `package.json`／不留在 repo）對六頁做真實 DOM smoke test：baseline 生成、
  anime-hero 額外 dispatch `backGuard` 並確認輸出含新疊影構圖描述關鍵字、
  六頁各自 8 輪隨機切換全部 radio 群組後重新生成，共檢查 baseline＋backGuard＋
  48 輪隨機生成，0 JS error、0 undefined/NaN/[object Object]/null 洩漏、
  無輸出過短。
- owner 接著反映 fantasy-fashion.html「03 服裝輪廓」選了新加入的「赤黑金符印
  高訂戰禮服」後，不知道「05 主題材質與奇幻元素」要配哪一個——因為這批新戰服
  本身已經自帶完整材質敘述（刺繡薄紗、符印流蘇、金屬配飾），但 05 既有 15 組
  材質多半是甜點/科技產品/寶石等跟戰鬥風格對不上，才會選不出來。owner 選定
  「新增戰鬥系材質分組」而非只加提示文字或整組重新分類。
  - 在 `materialData` 新增 8 個材質（`runicMetalEtching`/`gildedArmorCape`/
    `tatteredBrocadeBanner`/`talismanTasselBind`/`shatteredObsidianShard`/
    `energyVeinArmorGlow`/`silverFeatherArmorSheen`/`stardustBattleEmbroidery`），
    專門呼應這批戰鬥／改良戰服的色系與質感（符文金屬、鎏金披風、破損織錦、
    符印流蘇、黑曜甲片、能量脈紋、銀羽戰甲、星塵刺繡），列為 05 的第一個分組
    「✦ 戰鬥高訂特調」，並在 05 的 hint 文字加一句提示：選到戰鬥／改良戰服系列
    時建議直接從這組挑，不用再疊加甜點/科技類不相關材質。純附加，未動舊材質
    value/文字。
  - 同時把 owner 要求的章節順序調整一併做掉：**03 服裝輪廓／04 身形輪廓 對調
    成 03 身形輪廓／04 服裝輪廓**（05 材質章節編號不變），純 DOM 順序與
    `.section-label` 文字調整，兩個區塊內部的 radio 群組/欄位邏輯完全不動。
  - 驗證：`check-static.mjs`／`validate-preset-refs.mjs`／`build-prompt-preview.mjs`
    （0 diff）／`audit-100x.mjs`（600 次模擬 0 issue）全過；scratchpad jsdom
    額外針對 fantasy-fashion.html 驗證：真實 DOM 上確認 03 身形輪廓的
    `.section-label` 在 DOM 順序與文字上都排在 04 服裝輪廓之前，並把 15 個新
    戰鬥服裝逐一對應 8 個新材質做交叉抽測（15 組 garment×material 組合）重新
    生成，0 JS error、0 undefined/NaN/[object Object]/null、輸出長度正常。
  六頁各自 8 輪隨機切換全部 radio 群組後重新生成，共檢查 baseline＋backGuard＋
  48 輪隨機生成，0 JS error、0 undefined/NaN/[object Object]/null 洩漏、
  無輸出過短。

## 2026-07-24（六）　fantasy 新增天象/自然/森林系材質與場景（讀圖擴充）＋anime-hero.html 整頁下架

- owner 提供 5 張新參考圖，讀圖分類後判斷全部適合幻想頁（水墨書法曳地禮服＋
  蝴蝶群飛草原、金色新月鞦韆懸空＋水質裙＋金魚、水晶鋼琴金草原夕陽、蜻蜓
  鱗翅紗裙森林溪流苔石、閃亮薄紗近景美妝——最後一張因為極光薄紗＋珠寶閃光
  既有組合已經能達到效果，未重複新增）。新增選項卡與對照表同一批做完：
  - `garment` +1：寬簷花帽曳地禮服 `wideBrimFloralTrailGown`
  - `material` +2：水墨書法蝶舞裙 `inkCalligraphyButterflyGown`、蜻蜓鱗翅紗裙
    `dragonflyScaleWingGown`
  - `background` +4：銀芒草原山景 `silverReedMountainField`、水晶鋼琴金草原
    `crystalPianoGoldenField`、新月鞦韆雲海 `crescentMoonSwingSky`、森林溪流
    苔石 `forestStreamMossyRock`
  - `pose` +2：坐彈鋼琴側望 `piano_glance_sit`、盪鞦韆懸空回眸
    `swing_dangle_glance`
  - 驗證：`check-static.mjs`／`validate-preset-refs.mjs`（0 issue）／
    `build-prompt-preview.mjs`（0 diff）／`audit-100x.mjs`（0 issue）全過；
    scratchpad jsdom 對全部 9 個新選項值逐一點真正 `generateBtn`，輸出正常。

- **`anime-hero.html`（動漫變身合鏡咒語產生器）整頁下架**：owner 表示對這個
  系列不滿意，不需要了。過程中先發生一次誤判——把 owner 說的「動漫電影變身
  夥伴咒語產生器」誤認成 `doll.html`（公仔系列，完全不同的另一頁），對 owner
  講錯兩次，後來自己重新用 Read 工具核對 `index.html` 才發現真正對應的是
  `anime-hero.html`（首頁文案「動漫變身合鏡咒語產生器」「與原創變身英雄、機甲、
  聖衣或守護替身合鏡，建立電影宣傳美術海報」），並用 `AskUserQuestion` 明確
  跟 owner 確認過刪除目標才動手，避免刪錯頁。
  - 過程中意外發現 `docs/動漫電影 變身夥伴/開發規格-v2-整理版.md`——這是
    owner（或先前對話）已經寫好的重建規格，說明現行 `anime-hero.html` 疊了
    10 層 monkey-patch 式 `generate = function(){ 上一版generate(); ... }`，
    規劃「開新檔案重建」而非原地修補；owner 這次的決議是整頁刪除、不重建。
    2026-07-24（七）文件整理時，這份規格與其參考圖整批搬到專案根目錄的
    `待清除/動漫電影 變身夥伴（anime-hero.html已下架-僅供參考）/`，並加進
    `.gitignore`（不是正式站內容，本來就未曾提交進版本控制，純粹是本機
    待審閱/待刪除的暫存區）。
  - **下架範圍**（全部完成）：
    - `git rm anime-hero.html`
    - `index.html`：移除 nav-link（`<a href="anime-hero.html">動漫合鏡</a>`）、
      整個 `tool-card anime` 區塊、對應的 `.tool-card.anime` 三處 CSS
    - `scripts/check-static.mjs`：頁面清單移除 `'anime-hero.html'`
    - `scripts/audit-100x.mjs`：移除整個 ANIME-HERO 模擬區塊（約 80 行，含
      `companionData`/`interactionData`/`compositionData`/`outfitBattle` 等
      VM 讀取邏輯）、頁面清單陣列移除 `anime-hero.html`、報告文字
      「100x6」改回「100x5」
    - `scripts/validate-preset-refs.mjs`：移除 anime-hero.html 專屬區塊
      （它的選項卡是 JS 動態渲染非靜態 radio markup，用 `keysOf()` 直接讀
      data object key 的那段特殊邏輯）
    - `README.md`／`CLAUDE.md`：頁面清單移除 anime-hero.html、六頁改回五頁、
      驗證工具說明移除 anime-hero 相關敘述
  - `docs/history/face-orientation-fix-2026-07-23.md`、
    `docs/history/anime-high-similarity-lock-v4.14.md` 等歷史交接文件維持
    原樣不改（歷史事實記錄，不回頭改寫）；`travel.html`／`magazine.html`／
    `fantasy-fashion.html`／`doll.html`／`store-ad.html` 的導覽列本來就沒有
    連到 anime-hero.html（never 被接上共用導覽），不用改。
  - **驗證**：`check-static.mjs` 全過；`validate-preset-refs.mjs` 0 issue
    （travel 12+8、magazine 23+34+65、fantasy 58 筆，皆不含 anime-hero）；
    `build-prompt-preview.mjs` 5 組固定組合 0 diff；`audit-100x.mjs` 改回
    500 次模擬（5 頁）0 issue，確認拿掉 anime-hero 後其餘五頁完全不受影響。

## 2026-07-24（七）　全專案檢查＋文件整理＋導覽連結逐頁核對

- owner 要求「全專案檢查、文件整理、把預備清除檔案移到一個檔案夾、每頁檢查
  最上方導覽連結、上架」。逐項執行：
  - **導覽連結**：逐一讀取 index.html/travel.html/magazine.html/doll.html/
    fantasy-fashion.html/store-ad.html 的 `.nav-links` 區塊，確認 6 頁的
    連結清單完全一致（首頁/寫真旅拍/雜誌棚拍/公仔系列/幻想廣告/店家廣告）、
    each 頁面正確標記自己的 `nav-link active`、6 個目標檔案都存在。全部正常，
    沒有殘留 anime-hero.html 連結。
  - **全專案驗證**：`check-static.mjs`／`build-prompt-preview.mjs`（5 組固定
    組合 0 diff）／`audit-100x.mjs`（500 次模擬 0 issue）／
    `validate-preset-refs.mjs`（0 issue）全過。
  - **文件整理**：
    - `docs/README.md` 的開發紀錄歸檔索引本來漏列 9 篇 anime-hero 相關的
      `docs/history/*.md`（v4.14～v4.22、face-orientation-fix），補上並
      加註「該頁已於 2026-07-24 整頁下架，以下純供追溯」，跟既有的
      「不用當成現況參考」提示語氣一致。
    - `README.md`「專案定位」段落修正兩處過時敘述：「六個工具頁」改「五個
      工具頁」、「`check-static.mjs` 是目前唯一正式檢查腳本」改成正確反映
      現在四個驗證腳本並存的狀態。
    - 確認 `docs/architecture.md`／`docs/engineering.md`／
      `docs/function-category-map.md`／`docs/usage.md`／
      `docs/full-program-spec.md` 的頁數/頁面清單本來就沒有把 anime-hero
      算進去，不用改。
  - **待清除檔案歸檔**：專案根目錄新增 `待清除/` 資料夾（已加進
    `.gitignore`，不會進版本控制），把 `docs/動漫電影 變身夥伴/`
    （anime-hero.html 的 v2 重建規格＋參考圖，本來就是未提交的本機檔案）
    整批搬進去並改名標註「anime-hero.html已下架-僅供參考」，方便 owner
    之後決定要不要真的刪掉。目前專案掃過一輪沒有發現其他待清理的正式頁面
    或文件，只有這一批。

## 2026-07-25（一）　fantasy 新增 7 個電影感動態姿勢＋04/05/06 重新分類整理

- owner 貼一段 ChatGPT 建議的「Cinematic Action Pose Library」，問現有姿勢池
  要不要收錄。逐一比對現有 63 個姿勢後回報：5 個跟既有姿勢重疊度太高
  （Throne Command≈`throne_cross_leg`、Arms Wide Power Pose≈`arms_wide`、
  Back Turn Hero≈`back_turn`、Fashion Wind Walk≈`runway_stride`、Dominating
  Step≈`step_up`），King Of The Battlefield 只是把 `center_still` 換個戰場
  敘述、Editorial Lean／Over Shoulder Look 跟這次「戰鬥服」動機關聯度低，
  建議先跳過；但確認現有姿勢池**完全沒有「動態衝擊/戰鬥瞬間」這類姿勢**，
  這塊是真空缺，建議收錄 7 個：Hero Landing、Sword Draw、Mid Air Slash、
  Running Charge、Spell Casting、Floating Ascension、Energy Burst。owner
  同意，並要求「順便整理 04 服裝輪廓／05 主題材質／06 人物姿勢的分類排序，
  但別忘記 00 一鍵主題模板的設定」。
- **新增 7 個姿勢**：`hero_landing_pose`／`sword_draw_pose`／`mid_air_slash`／
  `running_charge`／`spell_casting`／`floating_ascension`／`energy_burst`，
  HTML 卡片與 `poseData` 對照表同一批做完（過程中一度因為檔案是 CRLF 換行、
  腳本用 LF 字串比對導致 `poseData` 那段靜默插入失敗，只有 HTML 卡片插入
  成功——事後用 grep 比對「HTML應有7筆＋data應有7筆＝14行」才抓到少了一半，
  改用不依賴換行字元比對的方式補上）。
- **04 服裝輪廓重新分類**：原本 61 件服裝完全沒有分類標題、純平鋪清單，
  改成 10 個 `✦` 分類（高訂禮服基礎／東方古風／婚嫁儀式／特效材質裙款／
  神話奇幻生靈／洛可可與馬戲奇想／暗黑哥德／賽博未來／角色原型／戰鬥高訂
  「機甲／聖衣／符文」）。**只搬動 DOM 位置與新增分類標題文字，所有
  `value` 屬性、`garmentData` 對照表完全沒動**。
- **05 主題材質輕量優化**：既有 15 組分類本來就有標題，不用整個重做，只
  做兩件事：(1) 修正一個既有的格式小問題——`stardustBattleEmbroidery` 那筆
  跟下一個分類標題黏在同一行沒換行（純格式，不影響功能，但重組時一併順便
  修掉）；(2) 把「戰鬥高訂特調」分類從最前面移到「機甲未來」與「賽博霓虹
  都市」中間，跟其他暗黑／戰鬥／科技系分類放在一起，語意分群更合理。
- **06 人物姿勢重新分類**：原本「手勢與動作」這組被當成雜物袋，混了真正的
  手勢細節（托腮、撩髮）跟動態動作（持盾站姿、飛行懸空、擲物戰鬥姿）。
  拆成「手勢與細節」（23項，純手勢/近景張力）跟新的「電影感動態／戰鬥
  瞬間」（15項＝既有8個動作類姿勢＋新增7個），跟站姿(16)、坐姿與地面(17)
  並列成四組。
- **不忘 00 一鍵主題模板**：全程只搬 DOM 位置、只新增內容，沒有刪除或改名
  任何 `value`；用程式化方式（node 腳本抽取每張卡片的完整 HTML 存進
  value→html 對照表、按新分類清單重組、比對「應放進去的清單」跟「原始擷取
  清單」數量與內容完全一致才寫檔）而非手動搬移文字，避免 61+141+71 張卡片
  手動搬移時抄錯或漏掉的風險。
- **驗證**：`check-static.mjs` 全過；`validate-preset-refs.mjs` 確認 58 個
  `themeTemplates` 全部 0 issue（證明重新分類完全沒影響任何模板能不能正確
  找到它引用的選項）；`build-prompt-preview.mjs` 5 組固定組合仍 0 diff
  （純視覺重組，既有輸出文字完全沒變）；`audit-100x.mjs` 500 次模擬 0
  issue；另外寫 jsdom 測試對全部 43 個目前真的有按鈕的模板逐一點擊、對 7
  個新姿勢逐一點真正 `generateBtn`、以及預設狀態生成，全部正常無
  undefined/NaN/JS error。

## 2026-07-25（二）　同一套邏輯套用到 travel.html／magazine.html 的分類整理

- owner 指示「一樣的邏輯 幫我整理雜誌 旅拍介面」——沿用前一則 fantasy
  04/05/06 重整用的「抽取→比對完整性→dry-run→寫檔」腳本化流程，套到
  travel.html 與 magazine.html 上。
- **travel.html 四個欄位全部從平鋪清單改成分類**：
  - `themePreset`（81 個地點小卡）→ 9 組：台灣(9)／日本(10)／韓國(2)／
    東南亞與大洋洲(8)／歐洲(22)／美洲(6)／中東與非洲(4)／東方古風與文化
    景點(12)／都會生活場景(8)。
  - `costume`（20 項服裝）→ 5 組：東方古風／校園青春／日常休閒／度假海灘／
    正式與晚宴；「主題自動」維持釘在最前面、不分組。
  - `lighting`（24 項光線）→ 4 組：自然日光(8)／室內窗光(4)／都會夜景(6)／
    精品戲劇光(6)；預設值「場景自然光」釘在最前面。
  - `pose`（20 項姿勢）→ 4 組：站姿與行走(8)／坐臥休憩(3)／回眸手勢(5)／
    生活情境(3)；「交給導演」釘在最前面。
  - 過程中發現 travel.html 的卡片 HTML 格式跟 fantasy 不同（多行、
    `data-value` 寫在 `<label>` 上、有獨立的 `selected` class 變體），第一版
    抽取用 fantasy 格式的 regex 只抓到 0 或漏掉預設卡，改寫成對應 travel
    多行格式的 regex 才抓全。
  - 順手把單次用途的 splice 腳本抽成通用工具 `apply-block.mjs`（給容器起始
    marker + 新內容檔案 + 可選 `--dry-run`，用 depth-counting 的 div
    配對找到正確結束位置，不是單純字串搜尋）。
- **magazine.html 先盤點三個候選欄位，發現只有 2 個真的需要動**：`style`
  （34 個雜誌調性）其實已經有 3 組 `style-group-label`（雜誌品牌語氣11／
  版面任務商業企劃15／藝術特殊視覺8），`pose`（86項）也已經分 4 組
  （站姿20／坐姿與地面24／手勢與動作31／複雜姿勢11），兩者都不需要重整；
  真正還是平鋪的只有 `bg`（52項）跟 `lighting`（35項）。
  - `bg` → 7 組：純色棚拍基底(8)／材質牆面與冷調空間(9)／抽象裝置與夜景
    霓虹(5)／窗光居家與生活材質(8)／宮廷宴會與奢華空間(10)／花園庭院與
    自然光景(7)／文化展場與都會場景(5)；預設值「單色攝影棚」釘在最前面。
  - `lighting` → 7 組：基礎棚拍光(8)／窗光與居家柔光(5)／金屬冷調與都會
    夜色(5)／珠寶精品閃耀(5)／宮廷宴會暖光(5)／花園自然逆光(4)／蕾絲珠簾
    情境光(2)；預設值「窗光柔亮」釘在最前面。
- **不忘一鍵主題模板**：全程只搬 DOM 位置、新增分類標題，`value` 屬性與
  `QUICK_TRAVEL_PRESETS`／`TRAVEL_STYLE_PRESET_DEFAULTS`／
  `QUICK_MAGAZINE_PRESETS`／`STYLE_PRESET_DEFAULTS`／`THEME_PRESET_DEFAULTS`
  完全沒動，跟 fantasy 那次一樣先用腳本比對「該分類清單」跟「原始擷取清單」
  數量與內容完全一致才寫檔。
- **驗證**：`check-static.mjs` 全過；重整前後用 grep 逐一比對欄位總數不變
  （travel: costume 20／lighting 24／pose 20／themePreset 81；magazine:
  bg 52／lighting 35／style 34／pose 86）；`validate-preset-refs.mjs` 確認
  travel 的 12＋8 個、magazine 的 23＋34＋65 個模板/預設項目全部 0 issue；
  `build-prompt-preview.mjs` 5 組固定組合仍 0 diff；`audit-100x.mjs` 500
  次模擬 0 issue；另外寫 jsdom 測試逐一點擊 travel 12 個 `data-travel-preset`
  快速模板、magazine 23 個 `data-magazine-preset` 快速模板，以及兩頁重整
  欄位中抽樣的數十個新分組選項，全部正常無 undefined/NaN/JS error。

## 2026-07-25（三）　全站 header 版面節奏統一

- owner 提出「全部頁面風格要一致化」，逐一比對六頁 CSS 找出實際落差：
  顏色上 travel/magazine/doll 三頁已統一用金色 `--gold:#C9A84C` 當強調色，
  但 fantasy-fashion 用紫色（`--violet:#B889FF`）、store-ad 用薄荷綠
  （`--mint:#70D6C8`）；版面節奏上 travel/magazine/doll 的 `.wrap` 頂部留白
  70px、`header{padding:48px 0 36px}`、h1 固定 32px，fantasy/store-ad 卻是
  `.wrap` 88px、`header{padding:28px 0 30px}`、h1 用 `clamp(28px,6vw,42px)`
  隨螢幕縮放。用 `AskUserQuestion` 跟 owner 確認兩件事：(1) 紫色／薄荷綠是
  刻意做頁面區隔用的設計，不要統一成金色；(2) header 版面節奏統一成 travel
  那套固定尺寸。
- **只改 fantasy-fashion.html／store-ad.html 兩頁**：`.wrap` 頂部 padding
  88px→70px、`header{padding:28px 0 30px}`→`{padding:48px 0 36px}`、
  `margin-bottom:28px`→`36px`、h1 `font-size:clamp(28px,6vw,42px)`→固定
  `32px`（並補上 travel 同款的 `font-weight:900`／
  `letter-spacing:0.02em`）。**強調色（violet/mint）、h1 跳色、`.wrap`
  最大寬度、mobile `@media` 覆寫全部沒動**——兩頁的 mobile nav 架構本來就跟
  桌機不同（fantasy 手機版 nav 改成 `position:sticky`、store-ad 維持
  `fixed` 但允許換行變兩排），各自的 mobile-only `.wrap`/`header` 覆寫值是
  用來配合各自的 nav 行為，不屬於這次要統一的「桌機版面節奏」範圍，改動前
  有先確認過不會互相衝突。
- **驗證**：純 CSS 改動、沒動任何 JS 或 `value` 屬性，`check-static.mjs`
  全過；`git diff` 確認兩頁改動範圍完全對應上述清單，無其他意外變更。

## 2026-07-25（四）　讀取新一批風格範例圖，分類補強三頁缺少要素

- owner 再次提供 `C:\Users\User\Desktop\ai生圖\風格範例` 資料夾（10 張圖，
  無咒語文字檔、也無 EXIF 內嵌 prompt），要求逐張分類歸屬旅拍／雜誌／幻想，
  並補強缺少的姿勢、衣服、構圖、光線、背景、裝扮要素。
- 逐張比對後發現：其中 4 張（水墨書法蝶舞寬簷帽禮服、水晶鋼琴金草原彈奏、
  蜻蜓鱗翅紗裙溪石、新月鞦韆水裙錦鯉）跟本輪之前已加入的
  `wideBrimFloralTrailGown`／`inkCalligraphyButterflyGown`／
  `crystalPianoGoldenField`／`dragonflyScaleWingGown`／
  `forestStreamMossyRock`／`crescentMoonSwingSky` 等元素高度重疊，判斷是
  owner 資料夾內容重複讀取，**沒有重複新增**，只從中挑出兩個真正沒被涵蓋的
  細節：錦鯉懸浮於新月鞦韆天空、以及側坐溪石一腿伸入水中的姿勢。
- **fantasy-fashion.html 新增 7 個要素**（09 背景 3／06 姿勢 2／04 服裝 1／
  05 材質 1，全部純附加不動既有 `value`）：
  - 背景：`crescentMoonGoldfishSky`（新月鞦韆錦鯉雲海）、
    `blossomGardenRainbowFlare`（花園逆光虹彩）、
    `phoenixDragonThroneHall`（鳳凰玄龍寶座殿，取材自持杖端坐寶座、左火鳳凰
    右冰龍護法的參考圖）。
  - 姿勢：`rock_stream_leg_extend`（溪石側坐伸腿，補上 04/05/06 重整時發現
    的空缺——溪流苔石背景原本沒有對應的坐姿選項）、
    `dual_spirit_guardian_throne`（雙靈守護寶座姿，跟新背景
    `phoenixDragonThroneHall` 搭配）。
  - 服裝：`crystalLeafCrownArmor`（水晶葉冠精靈鎧甲，金葉水晶冠＋玻璃金脈
    胸甲，放進「神話奇幻生靈」分類）。
  - 材質：`sageCrystalVeilGown`（鼠尾草水晶紗巾，取材自近景美妝參考圖的
    鼠尾草綠閃鑽頭紗＋削肩深V，放進「寶石琉璃光絲」分類，緊接既有
    `pearlVeil`）。近景構圖已有 `closeUp`/`bustPortrait` 框景涵蓋，不需要
    新增構圖選項。
- **travel.html 新增 3 個要素**：新服裝 `floral_halter_kimono_dress`（改良
  和服削肩綁帶洋裝，深V＋高衩＋腰間流蘇綁帶，跟既有樸素款 `kimono_yukata`
  區隔，放在日本古風分組）；日本分組新增地點 chip「古町運河櫻花小徑」
  （運河老街木屋＋櫻花＋燈籠，先前 10 個日本地點都沒有這種畫面）；新姿勢
  `kimono_collar_adjust_glance`（整理衣領垂眸，靜立調整領口、視線垂下，
  跟既有走動類姿勢區隔）。過程中確認 `themePreset` chip 只是把中文文字填進
  自由文字主題框（`themeInputEl.value=chip.dataset.value`），沒有另外的
  英文對照表，純新增 chip 不需要動任何 JS 資料結構。
- **magazine.html 新增 1 個要素**：背景 `golden_field_backlight`（黃金草原
  逆光，風吹草原＋金色時刻強逆光），放進「花園庭院與自然光景」分類——比對
  發現 magazine 原本 52 個背景全部是棚拍／室內／花園／都會，沒有開闊草原
  場景；姿勢「回眸走姿」已涵蓋參考圖的回眸走動動作、`style` 已有
  `magazine_masthead`／`cover_big`，不需要重複新增。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`（travel
  12+8、magazine 23+34+65、fantasy 58 個模板全部 0 issue）／
  `build-prompt-preview.mjs`（5 組固定組合 0 diff）／`audit-100x.mjs`
  （500 次模擬 0 issue）全過；另外針對這 11 個新元素逐一寫 jsdom 測試，
  對每個新 value 觸發對應事件並執行 `generateBtn`，確認輸出文字包含新增
  內容、無 undefined/NaN/JS error。

## 2026-07-25（五）　三頁指定欄位新增「自填」格

- owner 指定六個欄位要各加一格自由文字輸入：magazine 04 拍攝場景與背景／
  05 人物姿勢，fantasy-fashion 09 背景場景與留白／06 人物姿勢，travel 08
  姿勢／10 裝扮細節。
- **fantasy-fashion.html 沿用既有的 `customGarment`/`customMaterial` 自填
  機制**（`data-custom-choice` + `refreshCards()` 通用視覺切換系統，填了字
  卡片會自動取消選取，欄位本身會亮起）：新增 `customBackground`（09）、
  `customPose`（06），兩者都是「填了就完全取代該欄位的預設選項」語意，跟
  服裝/材質自填的行為一致。同步把這兩個 id 加進 `applyThemeTemplate`／
  `applyFantasyRandomSelection` 的清空清單，避免使用者填了自填字後再點
  一鍵模板或隨機套用時，殘留的自填文字沒被清掉、默默蓋掉新選的預設值。
- **magazine.html／travel.html 過去完全沒有這套自填機制**，從零建立：
  - magazine 新增 `customBg`（04）、`customPose`（05），沿用既有
    `.text-input` 樣式，填了就取代 `BACKGROUNDS[bgKey]`／`POSES[poseKey]`；
    同步在 `applyVisualPresetDefaults()`／`applyMagazineRandomSelection()`
    加入新的 `clearCustomChoiceFields()` 呼叫。
  - travel 新增 `customPose`（08，取代語意，同 fantasy/magazine）、
    `customAdorn`（10 裝扮細節，**用「附加」而非「取代」語意**——因為這格
    底下同時有髮型跟配件兩個獨立欄位，取代整組沒有意義，改成額外補一行
    styling detail，跟原本選的髮型/配件文字一起輸出）；同步新增
    `clearCustomChoiceFields()`，在 `applyTravelPreset()`／
    `applyTravelRandomSelection()` 呼叫。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`／
  `build-prompt-preview.mjs`（5 組固定組合仍 0 diff，代表沒改到任何既有
  輸出邏輯）／`audit-100x.mjs`（500 次模擬 0 issue）全過；另外寫 jsdom
  測試逐一填入這 6 個新欄位、觸發 `generateBtn`，確認輸出文字包含填入的
  自訂內容、無 JS error；並額外測試「填自填字→點一鍵模板/預設」情境，
  確認三頁的自填欄位都會被正確清空，不會殘留污染下一次生成。

## 2026-07-25（六）　全專案檢查：咒語內容無用字詞清理

- owner 要求「全專案檢查 介面檢查 產生咒語內容檢查無用字詞」。先跑
  `check-static.mjs`/`validate-preset-refs.mjs`/`build-prompt-preview.mjs`/
  `audit-100x.mjs` 確認結構正常、逐頁核對頂部導覽連結（皆正常）；接著針對
  「咒語內容」實際生成 fantasy/travel/magazine/doll/store-ad 五頁的樣本咒語
  逐段閱讀，找到 4 個具體問題，跟 owner 確認後全部修正：
  1. **fantasy-fashion.html：「Style Scope Rule」整段重複兩次**——一次透過
     `identityGuard`（來自 `core-prompt.js` 的 `fantasyCore.identityGuard`，
     內部已 join 進這段文字）帶入，另一次是頁面自己又宣告了一份逐字相同的
     `styleScopeGuard` 常數，在 `styleData` 後面又插入一次。移除頁面自己
     宣告的 `styleScopeGuard`（連同它在 `generate()` sections 陣列裡的
     使用），只保留 `identityGuard` 內建的那一份。
  2. **store-ad.html：無人物主視覺時仍塞入人臉/肢體負面約束**——四種
     `heroSource`（純設計版面〔預設〕/上傳商品照/上傳人物照/上傳店面照）
     只有「上傳人物照」畫面裡有人臉，但 `STORE_AD_CORE.negativePrompt`
     （"No face swap... No oversized head, extra limbs..."）沒有比照
     `identityLock`/`faceGeometryLock`/`lighting` 三個區塊用 `isPersonHero`
     把關，無條件輸出。改成 `isPersonHero && STORE_AD_CORE.negativePrompt`。
  3. **fantasy-fashion.html + store-ad.html：「sharp focus」相鄰重複**——
     兩頁都在共用的 `CORE.output`（【輸出規格】，內含"Sharp focus."）後面
     自己又加一行含 "sharp focus" 的補充句。各自從補充句移除重複的
     "sharp focus,"，保留其餘不重複的內容（hyper realistic / high
     quality 等）。
  4. **`assets/core-prompt.js` 的 `CORE_CLEAN_FRAME`（travel/magazine 共用，
     doll 定義了但未實際使用）：「No Tourist.」這行拿掉**——這行本來就是
     「No Crowd.」/「No Extra Person.」的旅拍特化版本，語意完全被那兩行
     涵蓋，屬於純重複；套到 magazine.html 的棚拍情境更是完全無意義（棚內
     不會有路人問題）。改動屬於安全刪減，不影響任何既有指令覆蓋範圍。
  - 因為 `build-prompt-preview.mjs`／`audit-100x.mjs` 兩支腳本各自維護一份
    fantasy 生成邏輯的鏡像（用來做 0-diff 迴歸），移除 `styleScopeGuard`／
    去重複 `sharp focus` 後，這兩支腳本原本硬編碼引用 `styleScopeGuard` 的
    地方會直接報錯（`ReferenceError`），連帶同步修正。
- **驗證**：`check-static.mjs` 全過；`build-prompt-preview.mjs` 5 組固定
  組合這次「不是」0-diff（預期中，因為這次是刻意改輸出內容）——實際比對
  travel/magazine 4 組輸出只少了一行「No Tourist.」，fantasy 直接讀新版
  輸出確認「Style Scope Rule」只剩 1 次、「sharp focus」只剩 1 次，沒有
  其他意外變動；`validate-preset-refs.mjs`／`audit-100x.mjs`
  （500 次模擬 0 issue）全過；另外寫 jsdom 測試針對 store-ad.html 兩種
  情境（預設純設計版面 vs. 切換成上傳人物照）分別確認 negativePrompt
  正確地「無人物時不輸出、有人物時仍輸出」。

## 2026-07-25（七）　鎖臉核心原則複查：補上 fantasy/magazine 缺的姿勢自然性防護

- owner 再次要求全專案複查，並特別指定要檢查「身體姿勢必須配合已鎖定的
  臉部角度、頭部方向與視線，再重建正常人體姿勢」這條核心原則有沒有落實。
  先跑四支驗證腳本全過，再針對鎖臉這件事另外寫一支 55 項的 jsdom 稽核
  （非鏡像模擬，是真的執行各頁 `generateBtn`）：travel/magazine/fantasy/
  doll 預設生成、fantasy 四個自填欄位同時填寫、travel/magazine 自填欄位、
  fantasy 抽樣 9 個模板、travel 全部 12 個快速模板、magazine 全部 23 個
  快速模板、store-ad 四種 heroSource 狀態，全部確認鎖臉區塊在該有的地方
  都有、不該有的地方（store-ad 無人物時）正確地沒有。另外逐句比對生成
  文字跟 `CORE_IDENTITY_LOCK`／`CORE_FACE_GEOMETRY_LOCK` 原文完全一致，
  確認上次的精簡沒有誤傷鎖臉文字本身。
- **盤點後回報 owner 兩個發現**：(1) owner 想要的原則「臉與頭不去配合
  Pose，Pose 必須配合已鎖定的臉與頭」其實已經寫在 `CORE_REALISTIC_ANATOMY`
  （【真人骨架系統】，三頁共用）裡——"Head and facial gaze direction take
  priority; body, shoulders and torso must rotate to naturally support the
  existing head direction — never rotate the head or face away from its
  natural front-facing angle just to match a body-direction instruction."；
  (2) 但 `core-prompt.js` 另外定義了第二層加強防護
  `CORE_POSE_NATURALITY`（【姿勢自然性系統】），**卻只接在
  `travelCore.pose`，`magazineCore`／`fantasyCore` 完全沒有這個 key，
  兩頁的 `generate()` 也從未引用**——這兩頁反而是姿勢風險最高的（fantasy
  這次 session 才新增 8 個武打/動態姿勢；magazine 有 8 個標記
  ⚠️ 高風險的複雜姿勢），卻只靠骨架系統裡那一句話單層防護。owner 確認
  「只把 CORE_POSE_NATURALITY 接進 fantasy/magazine，不要整個重排優先
  順序」（完整順序重排風險遠大於效益，且現有骨架系統合併呈現本來就已經
  涵蓋頭部姿態/頸肩連接/人體骨架/重心，只是命名合併沒有拆開）。
- **修正**：`assets/core-prompt.js` 的 `magazineCore` 加上
  `pose: CORE_POSE_NATURALITY`，`fantasyCore` 加上
  `poseGuard: CORE_POSE_NATURALITY`；`magazine.html` 的 `generate()`
  sections 陣列在 `skeletonBlock` 後面插入 `CORE.pose`（跟 travel.html
  的位置一致）；`fantasy-fashion.html` 新增頁面本地常數
  `poseNaturalityGuard`（沿用既有 `sharedFantasyCore.xxx || fallback`
  寫法），插入 `resolvedAnatomyGuard` 後面。
  `build-prompt-preview.mjs`／`audit-100x.mjs` 兩支腳本的 fantasy／
  magazine 鏡像邏輯同步補上這個新區塊，否則鏡像跟真實頁面邏輯會對不起來。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`／
  `audit-100x.mjs`（500 次模擬 0 issue）全過；`build-prompt-preview.mjs`
  這次因為是新增變數，base（舊 commit）沒有這個變數會直接
  `ReferenceError`，改用 jsdom 直接執行真實頁面驗證（比鏡像更可靠）：
  確認 fantasy/magazine 兩頁的【姿勢自然性系統】都剛好出現 1 次、位置在
  【真人骨架系統】之後、身份鎖定區塊完整、無 JS error；另外重跑先前那支
  55 項鎖臉稽核腳本，全部依然通過，證明這次新增沒有破壞任何既有模板/
  快速套用/自填欄位的鎖臉行為。

## 2026-07-25（八）　骨架系統改寫成 Head Pose Mode A/B 邏輯

- owner 拿了一份自己（找另一個 AI）整理的「真人身份人物美圖系統」規格書
  來討論，內容是打算擴充到五大主題引擎（幻想／雜誌／旅拍／動漫／仙俠），
  並提出一套「Head Pose 兩種模式」框架：Mode A（保留原照片頭部角度）／
  Mode B（角色表演，頭可以自由轉動看鏡頭外、回眸、戰鬥凝視等，但身體要
  跟著頭部重新配合），核心原則是「臉的身份不能換，頭可以重新演，頭一旦
  重新演，身體就跟著重新建立」。
- 分析後回報 owner：這份規格書方向正確，而且驗證了現有共用核心架構
  （`core-prompt.js` 的 `CORE_IDENTITY_LOCK`/`CORE_FACE_GEOMETRY_LOCK`/
  `CORE_REALISTIC_ANATOMY`/`CORE_POSE_NATURALITY` 各頁組裝）本來就是它說
  的「五大引擎共用一套 FACE/IDENTITY CORE」做法；但整份文件太長太多重複
  （身份鎖定概念在 17 個章節裡至少重複 6-7 次），適合當內部設計文件，不
  適合整段當成實際咒語塞進生成邏輯，會重新引入上兩輪才清掉的無用重複
  字詞問題。真正有價值、值得實際採納的是 Mode A/B 這個框架本身——因為
  現有 `CORE_REALISTIC_ANATOMY` 裡原本那句「never rotate the head or face
  away from its natural front-facing angle just to match a
  body-direction instruction」字面上暗示頭必須維持正臉，但跟這個 session
  已經加入的 `look_back`（回眸）、`sword_draw_pose`（"gaze locked on an
  off-frame target"）、`dual_spirit_guardian_throne`（"chin lifted with
  commanding gaze"）等姿勢字面上有矛盾——這些姿勢本來就需要頭轉/視線改變。
- owner 把這份分析轉給另一個 AI 看，那個 AI 也同意大方向，但額外建議
  (a) 把 `CORE_POSE_NATURALITY` 定位成「第二層驗證器」專門查重心/關節/
  肩胯，並要加一句說明兩個區塊分工的文字；(b) 提醒 Anime/Xianxia 兩個
  未來新頁記得同時掛上兩層防護。回報 owner 自己對這份二次分析的看法：
  (a) 兩個區塊現在的文字其實是同一件事換句話說，不是真的分工，如果要做
  到它說的分工，`CORE_POSE_NATURALITY` 需要真的補上重心/關節/支撐腳這類
  具體內容，而不只是加一句「宣稱」分工的說明句；(b) 那句「說明句」本質上
  是給維護者看的架構文件，不是給圖像模型的指令，如果真的 join 進實際輸出
  會變成第三次重複同一個概念，不該進生成邏輯，應該寫成 code comment 或
  開發日誌；(c) 圖示裡「頭部狀態」不是獨立程式區塊，是包在 ANATOMY 裡；
  「主題姿勢」實際上排在服裝/材質/風格之後才出現，不是緊接在
  POSE_NATURALITY 後面；(d) Anime/Xianxia 提醒這點是對的、值得先寫進
  `CLAUDE.md` 當待辦，不要等到真的做那兩頁才想起來。
- owner 確認這輪只做一件事：**把 `CORE_REALISTIC_ANATOMY` 那句話改寫成
  Mode A/B 邏輯**，其餘（身份不鎖照片澄清句、豐富 POSE_NATURALITY 具體
  內容、Anime/Xianxia 待辦）都先不動。
- **修正**：`assets/core-prompt.js` 的 `CORE_REALISTIC_ANATOMY` 那句話從
  「頭必須維持正臉，身體跟著頭轉」改寫成「頭可以自由轉動/傾斜/凝視任何
  姿勢需要的方向，身份與臉部幾何不因頭部方向而改變；頸部/肩膀/軀幹/脊椎
  永遠要自然跟隨並支撐已建立的頭部方向——絕不能反過來讓身體或姿勢方向
  逼頭/臉扭轉成不自然的角度」。這是三頁（travel/magazine/fantasy）共用
  的區塊，改一次三頁同時生效。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`／
  `audit-100x.mjs`（500 次模擬 0 issue）全過；額外寫 jsdom 測試確認新句子
  逐字出現在 travel/magazine/fantasy 三頁的實際生成輸出裡（doll.html 本來
  就沒有接 `CORE_REALISTIC_ANATOMY`，不受影響，屬預期）；重跑姿勢自然性
  驗證腳本與 55 項鎖臉稽核腳本，全部依然通過，確認這次改寫沒有破壞鎖臉
  或姿勢自然性防護。

## 2026-07-25（九）　補上「鎖身份不鎖照片」澄清句，否決重做 ANATOMY 的提案

- owner 把上一輪分析轉給另一個 AI 做第三輪討論。那個 AI 同意 Mode A/B
  改寫的方向，但提出兩個新建議：(1) 把 `CORE_REALISTIC_ANATOMY` 改寫成
  更完整的顯式雙分支結構（明確寫出「Mode A — Reference Head Pose」／
  「Mode B — Character Performance」兩段，各自完整說明）取代已經上線的
  精簡版；(2) 加一句「Lock the person's identity, not the original
  photograph」，並在裡面提到 camera angle 也可以重建。
- **對第 (1) 項明確不同意並說明理由**：系統實際上只有一種運作模式——
  三頁的每次生成都是「使用者選好姿勢→身體重新建立配合」，**沒有任何 UI
  選項讓使用者選「保留原照片頭部角度」（對應到它說的 Mode A）**。如果把
  Mode A / Mode B 兩個並列分支字面寫進實際咒語，等於給圖像模型一個它
  無法判斷該走哪條的選擇題（系統從來不會傳遞「這次是 A 還是 B」的訊號），
  反而比現有的單一句子更模糊，且長度多了近 3 倍卻沒有新增任何實際行為。
  上一輪（八）已經上線並驗證過的精簡版本已經完整涵蓋系統唯一會用到的
  行為（頭自由轉、身份不變、身體必須跟隨、絕不反過來），Mode A/B 這個
  說法適合當討論用的概念標籤（commit message、開發日誌都這樣用），不
  適合字面結構化寫進生成邏輯——**這次沒有重做 ANATOMY**。
- **對第 (2) 項同意，但做了調整**：它提議的版本裡「camera angle...may be
  reconstructed」跟現有 `CORE_CAMERA_RECONSTRUCTION`（【鏡頭重建系統】：
  "Ignore original selfie perspective. Ignore original lens
  distortion..."）已經講過同一件事，會變成新的重複，予以移除；另外
  建議折進既有 `CORE_IDENTITY_LOCK` 當補充句，不另開新的 `CORE_XXX`
  區塊（省 token、集中維護）。owner 回覆「你建議」，採用調整後版本執行。
- **修正**：`CORE_IDENTITY_LOCK` 第一段後面插入一句——「The reference
  photo locks identity only, not the original composition — body, pose,
  clothing, hairstyle and environment may be freely reconstructed for
  the new scene unless explicitly requested otherwise.」。`identityCore`
  （travel/magazine/fantasy 共用）、`dollCore.identityLock`、
  `storeAdCore`（人物主視覺時經 `coreBlocks.identityLock`）都會拿到
  這句，因為全部都是組合自 `CORE_IDENTITY_LOCK`。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`／
  `audit-100x.mjs`（500 次模擬 0 issue）全過；jsdom 測試確認新句子逐字
  出現在 travel/magazine/fantasy/doll 四頁的實際生成輸出、以及 store-ad
  切換成「上傳人物照」時的輸出，且都恰好出現 1 次；直接讀取 travel.html
  的完整生成結果，肉眼確認新句子插入位置乾淨、跟鏡頭重建系統的內容沒有
  重疊；重跑 55 項鎖臉稽核腳本，全部依然通過。

## 2026-07-25（十）　新增 xianxia.html（中式仙俠咒語產生器）

- owner 針對前面討論的「五大人物美圖系統」文件，先要求對仙俠／動漫兩個
  新頁面各提 3 組方案（獨立完整新頁 / 併入既有頁面擴充分類 / 獨立新頁但
  先做輕量 MVP），並在分析後推薦「先做輕量 MVP」；owner 選了另一個方向：
  兩頁都採「方案 A｜獨立完整新頁，比照 fantasy-fashion.html 全套規格」，
  並說「先做看看」。
- **建置手法**：直接 `cp fantasy-fashion.html xianxia.html`，保留所有已
  驗證過的共用管線（身份鎖定／臉部幾何／真人骨架／姿勢自然性／構圖控制／
  光線一致性／色溫統一／人物融合／補光／鏡頭重建／輸出規格／通用負面
  約束／custom-choice 自填引擎／00 一鍵模板系統／隨機套用引擎）完全不動，
  只替換仙俠專屬的內容區塊：
  - **00 一鍵仙俠模板**：16 組策展好的組合（掌門飛升、九尾狐仙、劍修對決、
    天雷渡劫、火鳳涅槃、月下靜修、桃花仙緣婚典、煉丹道姑、江湖遊俠、
    仙鶴相伴、青龍守護、竹林劍舞、蓮花法印、白虎霜行、楓葉書卷、符紙夜巡）
  - **01 成品用途**：把 9 個風格選項改成仙俠語境（仙門正統/電影海報/國風
    雜誌/仙俠史詩/黑金奇緣/乾淨古風/水墨展覽/江湖俠氣/美妝形象），拿掉
    跟仙俠不搭的「香氛廣告」換成「江湖俠氣」
  - **04 服裝輪廓**：30 項/6 組（仙門正裝基礎、古典勁裝與遊俠、法袍道服、
    婚嫁儀式、戰鬥仙裝與聖器化、妖靈與靈獸化裝束）
  - **05 主題材質與仙俠元素**：30 項/5 組（法器仙劍、靈獸神獸、劍氣仙氣
    特效、雲霧仙境元素、五行元素法術）
  - **06 人物姿勢**：26 項/4 組（站姿仙儀、坐姿修煉、手勢與細節、御劍飛行
    與戰鬥）
  - **09 背景場景**：30 項/6 組（仙山秘境、宗門山門與樓閣、雲海仙境與
    天象、江湖市井與人間煙火、神殿祭壇與秘境遺跡、竹林溪谷與四季）
  - **02 構圖／03 身形／07 鏡頭／08 光影／11 比例**：完全沿用 fantasy 原始
    內容不改，因為這些是通用攝影概念，不是奇幻或仙俠專屬。
- **核心接線**：`assets/core-prompt.js` 新增 `xianxiaCore`（結構跟
  `fantasyCore` 完全一樣：identityGuard 內含 Style Scope Rule、anatomyGuard、
  illustrationSkeleton、poseGuard、lightingGuard、negativePrompt、output），
  註冊到 `window.HB_CORE_PROMPT.page.xianxia`。**這次從第一天就正確接上
  `CORE_POSE_NATURALITY`**，不重演上一輪才發現的「fantasy/magazine 漏接
  姿勢自然性防護」那個缺口。頁面內部把 `sharedFantasyCore` 改名
  `sharedXianxiaCore`、`FANTASY_ILLUSTRATION_MATERIAL_KEYS` 改名
  `XIANXIA_ILLUSTRATION_MATERIAL_KEYS`（設空集合，因為仙俠材質庫沒有
  水彩/紙雕這類插畫媒材，不需要特殊觸發規則）。
- **全站接線**：travel/magazine/doll/fantasy-fashion/store-ad 五頁的 nav
  都加上「中式仙俠」連結；`index.html` 首頁在幻想廣告卡片後面新增仙俠卡片，
  強調色選用還沒用過的翡翠綠 `#7ED9A8`（跟 fantasy 紫色、store-ad 薄荷綠
  區隔）。
- **驗證腳本同步**：`check-static.mjs`／`validate-preset-refs.mjs`
  （新增 xianxia.html 的 themeTemplates 檢查，16 組全部 0 issue）／
  `audit-100x.mjs`（新增 XIANXIA 模擬區塊，總模擬數 500→600，全部 0
  issue）／`build-prompt-preview.mjs`（新增 `generateXianxia()`，並讓
  `loadRevision()` 對 xianxia.html 的讀取包 try/catch——這次因為是全新頁面，
  base revision（上個 commit）還沒有這個檔案，捕捉例外優雅跳過，不影響
  其他 5 組既有 combo 的 0-diff 比對；等這次 commit 進 git 之後，未來的
  修改就會有正常的 0-diff 迴歸保護）。
- **驗證**：所有腳本跑過確認 0 issue；另外寫 24 項 jsdom 實測——預設生成、
  隨機套用按鈕、全部 16 個一鍵模板、4 個自填欄位同時填寫——全部確認身份
  鎖定系統、姿勢自然性系統、鎖身份不鎖照片澄清句都正確出現，無 JS
  error、無 undefined/NaN 洩漏。

## 2026-07-26（十一）　新增 anime-character.html（動漫人物美圖咒語產生器）

- 「四大提案方案」的第二個，同樣選「方案 A｜獨立完整新頁，比照
  fantasy-fashion.html 全套規格」，`cp fantasy-fashion.html
  anime-character.html` 建置，保留所有共用管線不動，只替換動漫專屬內容。
  **注意**：這是全新的「單人動漫化」概念（把真人轉成賽璐璐上色的動漫
  角色，沒有第二個角色），跟已刪除的 `anime-hero.html`（真人＋變身夥伴/
  式神/機甲的雙角色關係敘事）是不同東西，不要混淆。
- **內容替換**：
  - **00 一鍵動漫模板**：16 組（魔法少女變身、巫女祈福、機甲駕駛員出擊、
    劍士對決、精靈遊俠、夏日祭浴衣、聖騎士對峙、賽博都市追逐、月光魔女、
    精靈花園幻想、校園天台告白、屠龍勝利、冰霜女王召喚、巫女神官儀式、
    星際裂隙守護者、森林精靈覺醒）
  - **01 成品用途風格**：9 項（少女浪漫、少年熱血、成人劇情、萌系可愛、
    輕小說奇幻、復古賽璐璐、遊戲原畫CG、動畫海報主視覺、動漫美妝特寫）
  - **04 服裝**：30 項/6 組（校園日常、魔法系、劍士/戰鬥系、機甲駕駛員、
    巫女/和風、妖靈與幻想種族）——全走 archetype 描述，不使用任何 IP
    角色名
  - **05 材質與特效**：30 項/5 組（賽璐璐上色與線條、發光特效、元素能力
    視覺化、髮色與髮型特效、裝飾配件）
  - **06 姿勢**：26 項/4 組（日常站姿、戰鬥蓄勢、魔法詠唱、情感表現）
  - **09 背景**：30 項/6 組（校園場景、異世界奇幻、戰場與都市、和風場景、
    星空與宇宙、抽象特效背景）
  - **02 構圖／03 身形／07 鏡頭／08 光影／11 比例**：完全沿用 fantasy 原始
    內容不改（通用攝影概念，非動漫專屬）。
- **核心接線（本頁最大技術風險）**：`assets/core-prompt.js` 新增專屬
  `CORE_ANIME_IDENTITY_PRESERVATION` 鎖定文字，直接回應 owner 原本文件
  裡強調的「動漫化的是視覺表現方式，不是重新設計這個人的身份」——
  明確禁止「generic anime girl face」「template moe/bishoujo face」
  「oversized template doe-eyes replacing the reference eye shape」
  「exaggerated tiny pointed chin unless the reference face already has
  that structure」，並要求動漫風格化後仍要能認出是同一個人。這段文字
  跟 `CORE_IDENTITY_LOCK`／`CORE_FACE_GEOMETRY_LOCK` 一起組成
  `animeCore.identityGuard`。`animeCore.anatomyGuard` 直接寫死
  `illustrationHumanCore`（不像 fantasy/xianxia 需要
  photorealistic/illustration 條件判斷——因為動漫頁本來就永遠是插畫
  風格，沒有「真人材質」分支），註冊到 `window.HB_CORE_PROMPT.page.anime`，
  從第一天就正確接上 `CORE_POSE_NATURALITY`。頁面內部把
  `sharedFantasyCore` 改名 `sharedAnimeCore`、移除不需要的
  `FANTASY_ILLUSTRATION_MATERIAL_KEYS`/`isIllustrationMaterial`/
  `resolvedAnatomyGuard` 判斷邏輯（因為 anatomyGuard 已恆為插畫骨架，
  判斷邏輯是死碼），`generate()` 直接用 `anatomyGuard`。
- **全站接線**：travel/magazine/doll/fantasy-fashion/xianxia/store-ad 六頁
  的 nav 都加上「動漫人物」連結；`index.html` 首頁在仙俠卡片後面新增動漫
  卡片，強調色選用還沒用過的粉紅 `#FF7FB0`（跟 fantasy 紫色、xianxia
  翡翠綠、store-ad 薄荷綠區隔）。
- **驗證腳本同步**：`check-static.mjs`／`validate-preset-refs.mjs`
  （新增 anime-character.html 的 themeTemplates 檢查，16 組全部 0
  issue——過程中發現 composition/intensity 欄位必須是頁面既有的
  select/radio 選項字面值而非自由文字，修正後才通過）／`audit-100x.mjs`
  （新增 ANIME 模擬區塊，總模擬數 600→700，全部 0 issue）／
  `build-prompt-preview.mjs`（新增 `generateAnime()`，`loadRevision()`
  對 anime-character.html 的讀取包 try/catch，base revision 還沒有這個
  檔案時優雅跳過，不影響其他既有 combo 的 0-diff 比對）。
- **驗證**：63 項 jsdom 實測——預設生成、隨機套用按鈕、全部 16 個一鍵
  模板、精選按鈕、4 個自填欄位同時填寫——全部確認身份鎖定系統
  （身份鎖定系統/臉部幾何鎖定系統）、姿勢自然性系統、**動漫化身份保留
  系統**標記字串在每一種輸出組合中都正確出現，無 JS error、無
  undefined/NaN 洩漏。

## 2026-07-27（十二）　統一全站 8 頁頂部導航排版

- owner 要求：現在有七個工具頁（加首頁共 8 頁），針對首頁與每一頁的
  頂部導航連結做一次統合整理排版，讓外觀與行為一致。先做全頁 nav CSS/
  HTML 稽核，發現 8 個檔案在不同時期各自複製演化，已經產生明顯分歧：
  - `z-index`：index/travel/magazine/doll 是 100，fantasy-fashion/xianxia/
    anime-character/store-ad 卻是 10（較容易被其他絕對定位元素蓋住）。
  - `.nav-link` 桌面版 padding：多數頁是 `6px 14px` 且有 `transition`，
    fantasy 系三頁與 store-ad 卻是 `6px 12px` 且沒有 `transition`。
  - **手機版導航策略完全分裂成兩派**：magazine/fantasy-fashion/xianxia/
    anime-character 用「sticky + 垂直排列 + 連結列橫向捲動」；store-ad
    用完全不同的「fixed 原地長高 + 內容 padding-top 硬推開」；index/
    travel/doll **完全沒有手機版 nav media query**——在窄螢幕下 8 個
    連結會被固定 54px 高的 nav 盒子裁切/重疊，是最需要優先修的問題。
  - `.nav-link.active` 顏色：7 頁是金色 `var(--gold)`，只有 store-ad 是
    薄荷/青色 `#A4EFE4`，跟其餘頁不一致。
  - `.nav-logo` 顏色：travel.html 用 `--terracotta-deep`（#E8D5A3，較淺的
    金色）、doll.html 用 `--pink-deep`（同樣是 #E8D5A3），跟其餘 6 頁的
    `--gold`（#C9A84C，較深的金色）呈現出兩種不同深淺的金色字，肉眼可見
    不一致。
- **統一方案**：以 magazine.html／fantasy-fashion 系三頁已經驗證過的
  sticky+橫向捲動手機版 pattern 當標準，套用到全部 8 頁：
  - `z-index` 全部改 100；`.nav-link` 桌面版 padding 統一 `6px 14px` 並
    補上 `transition:all .15s`（fantasy 系三頁＋store-ad 原本沒有）。
  - 新增／取代 `@media (max-width:760px)` 手機版 nav 規則到全部 8 頁：
    nav 變 `position:sticky` 且 `flex-direction:column`，`.nav-links`
    變 `flex-wrap:nowrap` 搭配 `overflow-x:auto` 橫向捲動，`.nav-link`
    縮小成 `font-size:11px;padding:5px 9px`。同步在同一個 media query
    內把每頁自己原本的內容區 `.wrap`／`.hero` 頂部留白從桌面版的大留白
    （70px～140px，用來閃避 fixed nav）縮小成手機版合理值（20px 或
    32px），因為 sticky nav 改吃版面高度後不再需要那麼大的補償留白。
    **注意順序**：CSS 疊層規則是「後面蓋前面」，所以這段 media query
    必須寫在該頁原本的 `.wrap`／`.hero` 基礎規則「之後」，否則後面那條
    沒有 media 條件限制的基礎規則會把 media query 的覆寫蓋掉——index.html
    和 travel.html 一開始都不小心寫反了順序，檢查後有修正。
  - store-ad.html 的 `.nav-link.active` 從薄荷色改回金色 `var(--gold)`，
    手機版 nav 邏輯從「fixed 長高＋內容 padding-top:104px 硬推開」改成
    跟其他頁一樣的「sticky＋橫向捲動」。
  - travel.html／doll.html 的 `.nav-logo` 從各自的 `--terracotta-deep`／
    `--pink-deep`（都是 #E8D5A3 淺金）改成 `var(--gold)`（#C9A84C），跟
    其餘 6 頁的 logo 顏色一致；doll.html 的 `.nav-link.active` 同步從
    三個獨立的 pink 系變數改成跟其他頁一致的單一 `var(--gold)` 寫法（doll
    原本的 `--pink`/`--pink-deep`/`--pink-soft` 其實已經是金色的別名，
    只是變數命名不同、且 active 文字與邊框用了兩種不同深淺的金色，統一
    後改成跟其他頁完全相同的單一色調）。
  - 刻意不動的部分：各頁 body 內文自己的品牌強調色系統（例如 store-ad
    的薄荷綠 `--mint`、travel/doll 的淺金強調色用在其他非 nav 元件上、
    fantasy/xianxia/anime/store-ad 各自的 `--soft`/`--paper` 等變數命名）
    ——這次只統一「nav 本身」的排版與行為，不重做每頁各自的整體色彩
    系統，避免範圍失控。
- **驗證**：`node scripts/check-static.mjs` 全部 8 頁通過（無重複 id、
  連結檢查、inline script 語法皆過）；另外寫一次性 node 腳本逐頁抓
  `<style>` 內容做大括號配對計數，確認 8 個檔案全部 open===close，
  沒有因為多處字串插入而破壞 CSS 結構。因為本次環境沒有瀏覽器截圖
  工具，未能實際用瀏覽器肉眼複查窄螢幕下的視覺效果，僅完成程式化的
  結構與數值一致性驗證，之後若有瀏覽器工具應補做一次目視複查。

## 2026-07-27（十三）　統一 7 個工具頁的「生成咒語」互動行為（補上 doll/store-ad 的變更通知）

- owner 指出 `fantasy-fashion.html`（以及 travel/magazine/xianxia/
  anime-character，共 5 頁共用同一套）的「生成」互動比較好：生成後只要
  改動任何選項，輸出框會立刻變暗、跳出「選項已變更，請重新按『生成』」
  徽章、複製鈕同時被鎖住（`pointer-events:none`），直到重新按生成才解除
  （`markStale()`/`clearStale()` 配合 `.output-wrap.stale` 這個 CSS class）。
  比對後發現 `doll.html`／`store-ad.html` 完全沒有這套機制，要求把 7 個
  工具頁的生成互動行為統一。
- **doll.html**：desktop 上 `generate-btn`／`copy-btn` 邏輯本來就是「按
  生成才顯示」，只是缺變更通知。補上跟 fantasy 系一模一樣的
  `.output-stale-badge` CSS／HTML（插在 `output-wrap` 裡、textarea 前）／
  `markStale()`／`clearStale()`。這頁的选項介面比較特別——髮型/表情/姿勢/
  底座是用 `<label class="chip">`／`<label class="auto-card">` 純 click
  切換 class，沒有底層 `<input>` 觸發原生 `change`/`input` 事件，所以除了
  沿用 fantasy 那套「document 層級攔截 input/change」的作法之外，額外加了
  第三個 `click` 監聽器專門攔 `.chip`／`.auto-card`／`#autoAllBtn` 的點擊
  來標記 stale，涵蓋所有互動元件。
- **store-ad.html（改動較大）**：這頁原本的架構跟其他 6 頁完全不同——是
  「即時預覽」模式：任何欄位一有 `input`/`change` 就直接呼叫 `generate()`
  重新渲染輸出框，頁面載入時也會立刻 `generate()` 一次，所以輸出框從來
  不會「過期」，一直跟表單同步。但這跟其他 6 頁「按生成才出現、改動後
  才提示過期」的互動模式不一致，所以照 owner 的「完全一致」要求，把它
  也改成 click-to-generate + stale 徽章模式：
  - HTML 重構：原本 `.actions`（generateBtn + copyBtn 並排的 grid）拆開，
    `generateBtn` 獨立在外層一直可按；`copyBtn` 移進新的
    `output-wrap hidden`（跟 `.output-stale-badge`、`.output` 包在一起），
    生成前整個輸出區塊是隱藏的，跟其他 6 頁行為一致。
  - CSS：新增 `.output-stale-badge`（用這頁自己的薄荷色 `--mint`／
    `#A4EFE4` 當強調色，跟其他頁用各自的金色 `--gold` 是同一個設計原則
    ——用該頁自己的主色，而不是強制統一成金色）；`generateBtn`／
    `.copy-btn` 補 `width:100%` 讓兩顆按鈕改成上下堆疊（原本是並排），
    跟其他頁的垂直版面一致；順手移除變成死碼的 `.actions` grid 規則
    （含手機版 media query 裡的那條）。
  - JS：所有欄位監聽器從「直接呼叫 `generate()`」改成「呼叫
    `markStale()`」，只有 `#generateBtn` 的 click 才真的呼叫 `generate()`
    （`generate()` 內部最後加 `outputWrap.classList.remove('hidden')` +
    `clearStale()`）；`copyBtn` click 加上 `if(...stale) return;` 的
    guard；移除頁面載入時自動呼叫的 `generate();`（因為現在輸出框應該
    保持隱藏直到第一次按生成，跟其他 6 頁一致）。
- **驗證**：`check-static.mjs`／`audit-100x.mjs`（700 次模擬，0 issue，
  確認拿掉即時預覽後 store-ad 的模擬邏輯仍正確）都過；CSS 大括號配對
  逐頁計數確認 doll.html／store-ad.html 開合平衡。另外寫 17 項 jsdom
  實測，涵蓋兩頁各自的「生成前輸出區隱藏」「按生成後顯示且不過期」
  「改選項（含 doll 的 chip 點擊、store-ad 的文字輸入與 radio）後變
  stale」「stale 時複製鈕被鎖住點了無效」「重新生成後 stale 解除且內容
  更新」——全部通過。

## 2026-07-27（十四）　身形輪廓「豐滿纖腰」改寫身體描述為日本體型

- owner 指出 fantasy-fashion／magazine／xianxia／anime-character 四頁
  共用的「身形輪廓｜豐滿纖腰」選項，生成咒語裡的體型描述要從通用的
  「明顯胸腰臀曲線」改寫成「日本豐滿瘦腰女性」這個具體體型參照。
- **修正**：四個頁面的 `BODY_SHAPES.curvy_waist`（四份原本逐字相同）第一
  行從 `Curvy Narrow-Waist Adult Female Silhouette` 改成
  `Japanese Curvy Slim-Waist Adult Female Silhouette`，其餘描述句
  （Full Bust, Slim Waist, Elegant Waist-To-Hip Curve／身份與年齡印象
  保留／Natural Realistic Body Proportions 等安全防護句）完全不動。這個
  改法跟頁面裡已經存在的 `korean_idol`（"Korean Idol Stage
  Proportions"）是同一種「用文化/地域體型參照詞」的寫法，不是新發明的
  模式。
- **驗證**：`check-static.mjs`／`audit-100x.mjs`（700 次模擬 0 issue）
  皆過；另外寫 12 項 jsdom 實測，對四頁各自勾選 `curvy_waist` 選項並
  觸發真正的 `generateBtn` 點擊，確認四頁的生成結果都含新的
  `Japanese Curvy Slim-Waist Adult Female Silhouette` 字串、不再含舊的
  `Curvy Narrow-Waist Adult Female Silhouette` 字串，且身份鎖定系統
  區塊依然完整——全部通過。

## 2026-07-29（十五）　新增 flower-fairy.html（花仙子）與 isekai-fantasy.html（日式異世界）

- owner 提出想比照仙俠/動漫再擴充「花仙子」「日式異世界冒險 cos 角色」，
  並貼了一份自己問 ChatGPT 產出的擴充規格書（要求沿用鎖臉三件套、身形/
  姿勢/鏡頭/光線/比例等模組、不重做核心、複製既有頁面當底）。逐項分析
  這份規格書後回報 owner 三個跟本專案實際狀況對不上的地方：(1) 規格書
  提到的「localStorage 狀態保存」「圖片生成 API」不存在——這是純文字
  咒語產生器；(2)「某項鎖定，其餘隨機」這個機制目前系統完全沒有，
  `applyFantasyRandomSelection` 系列函式是全欄位無條件重抽，沒有 lock/
  pin 單一欄位的邏輯，若要做是全新工程；(3)「鏤空/服裝強度」沒有獨立
  參數化模組，只有零星帶鏤空描述的服裝選項。owner 確認：(1) 用「一鍵
  模板」機制取代鎖定聯動即可，不用開發鎖定功能；(2) 鏤空當服裝選項本身
  處理，不做強度滑桿。
- 兩頁都採「方案A：獨立完整新頁，比照 fantasy-fashion.html 全套規格」，
  `cp fantasy-fashion.html flower-fairy.html` / `cp fantasy-fashion.html
  isekai-fantasy.html` 建置。
- **flower-fairy.html**：
  - **00 一鍵花仙子模板**：16 組，涵蓋 11 種花卉（玫瑰、百合、蓮花、
    紫薇、櫻花、牡丹、紫藤、蘭花、山茶花、繡球花、薰衣草）加月光花園
    守護者、蝴蝶花園幻想、晨露水晶花仙子、金粉日出花仙子、落英隨風之舞
    等混合主題。
  - **04 服裝**：30 項/6 組（花瓣禮服基礎、花冠飾品套裝、透紗羽翼花裙、
    藤蔓纏繞服、水晶花瓣鏤空禮服、花卉主題訂製禮服）——鏤空服裝依照
    owner 決定放在「水晶花瓣鏤空禮服」這組裡，是服裝選項本身，不是額外
    強度參數。
  - **05 材質**：30 項/6 組，依花卉家族分組（玫瑰系、百合蓮花系、紫薇
    紫藤系、花粉光影系、山茶繡球系、蝴蝶粒子系）。過程中發現最初設計
    漏掉了櫻花與牡丹兩種花卉的專屬材質/背景（只顧到 9/11 種），回頭把
    「花粉光影系材質」組裡兩個較泛用的填充項目（風吹花瓣軌跡、螢火花園
    閃光）換成專屬的「櫻花花瓣飄落」「牡丹金紅盛放」，背景也同樣置換
    兩項補齊「櫻花大道」「牡丹御花園」，確保 11 種花卉都有實際對應內容
    而不是只掛名在一鍵模板裡。
  - **06 姿勢**：**刻意不整組替換**，沿用 fantasy-fashion.html 原本
    74 個姿勢池（其中 `hold_flower`、`wide_wing_spread`、
    `floating_ascension` 等本來就適合花仙子），只新增 5 個花仙子專屬
    姿勢（花瓣風暴旋轉、仙境跪拜祈禱、蝴蝶停手、花冠輕整、花瓣接取
    伸手）。這是跟仙俠/動漫兩頁「姿勢整組替換」不同的做法，直接對應
    ChatGPT 規格書「沿用現有姿勢系統，只加真正需要的新增」的要求。
  - **09 背景**：30 項/6 組，依花卉場景分組（玫瑰園、百合蓮花水景、
    紫薇紫藤迴廊、山茶繡球庭院、夢幻仙境場景、抽象花境特效背景）。
  - **新增全站沒有過的「05b 翅膀與蝴蝶」全新維度**：7 種翅膀（無/透明
    精靈翼/水晶翼/蝴蝶翼/花瓣翼/光翼/虹彩翼）＋4 種蝴蝶密度（無/少量/
    中量/大量）。這是規格書要求但既有架構完全沒有的新欄位，用
    `wingsData`/`butterfliesData` 兩個新 JS 物件實作，選了任一項會在
    生成的咒語裡自動加一句「wings and butterflies stay clear of the
    face at all times, never overlapping or obscuring facial identity」
    防止翅膀蝴蝶蓋住臉。
  - `core-prompt.js` 新增 `flowerFairyCore`（結構比照 `xianxiaCore`：
    identityGuard 含 Style Scope Rule、`anatomyGuard` 用寫實
    `humanCore`），拿掉了 fantasy 原本的 illustration-material 條件
    判斷（材質庫不含插畫媒材，直接固定寫實骨架），註冊到
    `window.HB_CORE_PROMPT.page.flowerFairy`。
- **isekai-fantasy.html**：
  - **角色三大陣營共 16 個**：光明中立 8（勇者/女劍士/魔法使/聖女/精靈/
    異世界貴族/公主/女王）、獸族 3（獸娘/狐娘/貓娘——只加獸耳尾巴不換
    五官）、暗黑陣營 5（暗黑魔法使/魔女/魅魔/魔族貴族/魔王），**00 一鍵
    模板剛好 16 組、每個陣營一組**。
  - **04 服裝**：30 項/6 組，按陣營分組（勇者劍士系、魔法使聖女系、
    異世界貴族與皇室、精靈與森林種族、獸族裝束、暗黑陣營裝束）——鏤空
    服裝（魔族貴族鏤空禮服、魅魔蕾絲禮服）同樣是服裝選項本身。
  - **05 材質**：30 項/6 組（聖光治癒系、元素魔法系、暗黑魔法系、皇室
    珠寶系、森林自然系、獸族靈力系）。
  - **06 姿勢**：跟花仙子一樣「延伸不整組替換」，沿用 fantasy 姿勢池
    （本來就有 `sword_draw_pose`／`spell_casting`／`throne_cross_leg`／
    `beast_mount_look` 等現成可用姿勢），只新增 6 個 isekai 專屬姿勢
    （持杖引導魔力、王座統禦、獸耳蜷坐、收劍佇立、魔法陣召喚跪姿、斗篷
    迎風前行）。
  - **09 背景**：30 項/6 組（王城與宮廷、異世界城鎮、森林與精靈秘境、
    魔法學院與遺跡、魔界與暗黑領域、戰場與冒險場景）。
  - **這頁刻意走寫實骨架而非插畫**——跟 anime-character.html 的關鍵
    差異：`core-prompt.js` 新增 `isekaiCore`，identityGuard 的 Style
    Scope Rule 額外加一句「This is a photorealistic photography
    campaign, not an anime/illustration conversion — render skin, face
    and body with realistic photographic detail, not cel-shaded or
    illustrated medium」明確排除插畫化，`anatomyGuard` 用寫實
    `humanCore`；服裝/姿勢命名刻意跟 anime-character.html 的動漫插畫
    語彙錯開（例如不叫 magicalGirlOutfit），避免兩頁選項字面重複，
    註冊到 `window.HB_CORE_PROMPT.page.isekai`。
  - 同樣拿掉了 illustration-material 條件判斷，直接固定寫實
    `anatomyGuard`（跟 flower-fairy 做法一致，材質庫都不含插畫媒材）。
- **全站接線**：travel/magazine/doll/fantasy-fashion/xianxia/
  anime-character/store-ad 七頁的 nav 都加上「花仙子」「日式異世界」
  連結；`index.html` 首頁在動漫卡片後面新增兩張卡片，強調色選用未使用過
  的玫瑰粉 `#E8759A`（花仙子）與靛藍 `#7C9EFF`（日式異世界）。
- **驗證腳本同步**：`check-static.mjs`／`validate-preset-refs.mjs`
  （新增兩頁的 themeTemplates 檢查，16+16 組全部 0 issue；flower-fairy
  的 fieldLive 額外加了 `wings`/`butterflies` 兩個欄位）／`audit-100x.mjs`
  （新增 FLOWER FAIRY／ISEKAI 兩個模擬區塊，總模擬數 700→900，全部 0
  issue）／`build-prompt-preview.mjs`（新增 `generateFlowerFairy()`／
  `generateIsekai()`，`loadRevision()` 對兩個新檔案的讀取都包
  try/catch，base revision 還沒有這兩個檔案時優雅跳過；核心區塊長度
  report 顯示 delta 全部為 0，確認沒有動到任何既有頁面的共用核心）。
- **驗證**：flower-fairy.html 49 項 jsdom 實測（含翅膀/蝴蝶不蓋臉的
  guard 邏輯專屬測試：選翅膀或蝴蝶會出現防蓋臉句子，兩者都不選則不會
  出現）、isekai-fantasy.html 45 項 jsdom 實測（含輸出確認寫實/非插畫
  澄清句正確出現）全部通過；`audit-100x` 900 次模擬（9頁×100）0 issue。

## 2026-07-29（十六）　新增 summer-island.html（夏日海島）

- owner 想再加「夏日沙灘」主題，先貼了一份 AI 產出的規格書，範圍定義為
  「夏日海島・沙灘 × 水上 × 淺水玩水」四大場景模組，明確排除深潛/水下
  世界，留給未來獨立主題。逐項分析後回報 owner：
  1. 「隨機組合系統」（沙灘/水上/淺水/玩水 ＋ 環境 ＋ 動作 ＋ 鏡頭 ＋
     光線 ＋ 造型）完全對應現有的元素級獨立隨機機制，不需要新工程。
  2. 「Realistic Ocean Physics／水面折射／水花／濕潤效果」——這是純
     文字咒語產生器不是接圖片生成引擎，這些描述都只是給 AI 繪圖模型看
     的文字提示，不是本專案要實作的物理系統。
  3. 「禁止自拍構圖／禁止伸手拿手機自拍」是全新類型的限制，目前任何
     頁面核心區塊都沒有這種構圖禁令，需要另外寫一句新的負面約束——
     **owner 確認不需要特別寫入**，這條直接略過，沒有加進最終的 prompt。
  4. 水深隨機（腳踝/小腿/膝蓋/大腿/腰部）、明確排除深潛水下世界——都是
     內容維度層次，不需要新的核心區塊，當一般姿勢池與範圍限制處理即可。
  另外指出這次不是從零開始——`travel.html` 本來就有沖繩海岸／墾丁海岸／
  冰島黑沙灘等地點 chip、沙灘夕陽暖金光等光影、beach_cover_bikini 等
  服裝、以及兩組完整一鍵模板（沖繩海邊白裙旅拍、海邊城堡夕陽旅拍），
  只是內容零散，不是規格書要的「四大模組系統化可隨機排列組合」。因為
  規格書要的份量（四大模組各自要有足夠背景/姿勢/道具/服裝選項）跟開
  一個新主題頁差不多大，遠超過在 travel.html 加幾個 chip 的規模，建議
  走跟仙俠/動漫/花仙子/日式異世界一樣的「獨立完整新頁」路線，owner
  同意後直接建置（不用先列細清單，直接動工）。
- 一樣「方案A：獨立完整新頁，比照 fantasy-fashion.html 全套規格」，
  `cp fantasy-fashion.html summer-island.html` 建置。
- **00 一鍵模板**：16 組，跨四大模組混合（赤腳夕陽漫步、SUP 晨光滑行、
  淺水漫步、玩水嬉戲瞬間、椰林吊床小憩、礁岸遠眺、漂浮平台夢幻時刻、
  腰部淺水金色時刻、碼頭夕陽垂腳、獨木舟探索滑行、浪花玩鬧、度假潟湖
  悠閒、晨曦沙灘獨行、海上鞦韆愜意、潮池礁岩探索、金色時刻淺水漫步）。
- **04 服裝**：30 項/6 組（基礎泳裝、度假罩衫與外搭、海島度假洋裝、
  水上活動機能服、沙灘配件與奢華款、沙灘裙裝與濕身質感）。
- **05 材質改稱為「水感與陽光氛圍」**：30 項/6 組（水花水珠系、陽光
  光斑系、海水色澤系、沙灘質感系、熱帶氛圍系、度假奢華系）——這裡的
  「浪花飛濺」「濕潤肌膚光澤」「水滴滑落軌跡」等都只是這層的英文 prompt
  文字內容，不是額外的物理引擎工程。
- **06 姿勢：這次選擇整組替換，不是延伸**——跟花仙子/日式異世界「延伸
  既有姿勢池、只加幾個新增」的做法不同，因為規格書明確要求四大場景
  模組（沙灘/水上/淺水/玩水）系統化分類，這跟 fantasy 原本的戲劇感高訂
  姿勢語彙差異太大，直接整組替換成 30 個新姿勢，剛好對應四模組分 4 組
  （沙灘 8、水上 7、淺水 7、玩水 8）。淺水組系統化涵蓋腳踝/膝蓋/腰部/
  大腿不同深度的自然行走與轉身（ankleDeepWade/kneeDeepWalk/
  waistDeepTurn/thighDeepStride），對應規格書「水深可隨機變化」的要求。
- **09 背景**：30 項/6 組（白沙海灘、礁石海岸、度假村碼頭、熱帶椰林、
  日落海岸、清澈淺水灘）。
- `core-prompt.js` 新增 `summerIslandCore`（結構比照 `xianxiaCore`：
  identityGuard 含 Style Scope Rule、`anatomyGuard` 用寫實 `humanCore`），
  拿掉了 fantasy 原本的 illustration-material 條件判斷（材質庫不含插畫
  媒材，直接固定寫實骨架，比照 flower-fairy/isekai 的簡化做法），註冊到
  `window.HB_CORE_PROMPT.page.summerIsland`。頁面內部把 `sharedFantasyCore`
  改名 `sharedSummerIslandCore`；過程中發現按鈕 ID 重命名有一處疏漏
  （`fantasyMoodPreset` 事件監聽器沒有跟著全域改名腳本一起改到，跟
  isekai-fantasy.html 當時發生的同一種疏漏），檢查後手動補上修正。
- **全站接線**：travel/magazine/doll/fantasy-fashion/xianxia/
  anime-character/flower-fairy/isekai-fantasy/store-ad 九頁的 nav 都
  加上「夏日海島」連結；`index.html` 首頁在日式異世界卡片後面新增卡片，
  強調色選用未使用過的珊瑚橘 `#FF9466`。
- **驗證腳本同步**：`check-static.mjs`／`validate-preset-refs.mjs`
  （新增 themeTemplates 檢查，16 組 0 issue）／`audit-100x.mjs`（新增
  SUMMER ISLAND 模擬區塊，總模擬數 900→1000，全部 0 issue）／
  `build-prompt-preview.mjs`（新增 `generateSummerIsland()`，
  `loadRevision()` 對新檔案的讀取包 try/catch；核心區塊長度 report
  顯示 delta 全部為 0，確認沒有動到任何既有頁面的共用核心）。
- **驗證**：52 項 jsdom 實測，涵蓋預設生成、隨機套用、全部 16 個一鍵
  模板、精選按鈕、4 個自填欄位、以及四大模組各抽一個代表姿勢
  （barefootSandWalk/supBoardStand/ankleDeepWade/kickingSplashPlay）
  直接勾選測試都能正常生成——全部通過；`audit-100x` 1000 次模擬
  （10頁×100）0 issue。

## 2026-07-29（十七）　修正 summer-island.html 容易觸發圖像生成安全過濾的用詞

- owner 實測 summer-island.html 生成的咒語拿去 ChatGPT 出圖，發現很容易
  被擋。逐一檢查 `materialData`／`garmentData` 找出兩層問題：
  1. `backlessBeachDress`（露背沙灘洋裝）材質描述裡有 `sultry`
     （性感/挑逗）這個明顯的觸發詞。
  2. 更根本的結構性問題：這頁的核心是「鎖定真人身份 + 泳裝」，這個
     組合本身在 ChatGPT/DALL-E 這類工具的安全政策裡，就比奇幻服裝、
     仙俠古裝這類「風格化角色」更敏感，是平台政策層級的差異，不是
     咒語能完全解決的；另外材質庫裡有 4 組材質（`wetSkinGlow`／
     `waterDripTrail`／`saltAirGlowSkin`／`coconutOilShimmer`）反覆把
     描述焦點放在「wet/glossy skin」上，同一份咒語疊加多次「肌膚」相關
     詞彙會提高被判定的機率。
- **修正**：`sultry island silhouette` 改成 `elegant island silhouette`；
  上述 4 組材質的英文 `prompt` 欄位拿掉 "the skin" 的直接聚焦，改成
  描述水光/日光效果本身（例如 `wetSkinGlow` 從 "wet-glossy skin sheen"
  改成 "sun-kissed glow...glossy highlight catching the light"）。
  只動這 5 處 `prompt`/`palette` 英文字串，UI 上的中文 label/desc 完全
  沒動（那些只是選單顯示文字，不會被送進實際生成的咒語）。
- **驗證**：`check-static.mjs`／`audit-100x.mjs`（1000 次模擬 0 issue）／
  52 項 jsdom 實測全部重跑確認沒有破壞既有生成邏輯，改動範圍精準
  對應 owner 確認要修的 5 處，沒有動到其他材質或服裝內容。

## 2026-07-29（十八）　summer-island.html 新增「日系商業旅拍 DNA」固定層 + 泳裝觸發追加層

- owner 找另一個 AI 討論，想在 summer-island.html 鎖臉核心之後固定加入
  「日本女性夏日海島沙灘拍攝」的調性；並提到選到泳裝題材時額外加日本
  泳裝寫真語言比較不容易被出圖工具擋下來。逐輪來回討論後，最終定案：
  1. **不寫 `Japanese woman`**——會被模型當成人物外貌條件，跟身份鎖定
     打架；改用「Japanese commercial ... photography aesthetic」這種
     **攝影語言**描述，不涉及人物長相。
  2. **拿掉 `gravure`**——這個詞在日本媒體語境裡跟特定寫真/偶像產業綁得
     較緊，改用時尚產業通用的 `resort editorial` / `swimwear editorial
     photography`，措辭更乾淨、更不會把整頁調性帶偏。
  3. **不重複姿勢/活動/場景內容**——第一版草稿裡列了一堆「走在沙灘上、
     在淺水玩耍」之類的活動描述，這些跟 06 姿勢區的 30 個姿勢是同一件
     事換句話說，違背這個專案一路在做的核心瘦身原則，最終版拿掉，只留
     「攝影美學」這個原本沒有的資訊維度。
  4. **固定層 + 條件式追加層，不是整頁寫死泳裝**——選到洋裝/罩衫等
     非泳裝服裝時，不會被硬套用泳裝寫真語言；只有選到泳裝類服裝時才
     追加「日本商業泳裝編輯攝影美學」這一句，避免模組互相污染（例如
     選了洋裝卻讓核心一直暗示泳裝，導致模型把洋裝往貼身/泳裝方向拉）。
  5. **老實告知效果上限**：這類語境描述能提高模型正確辨識「這是合法
     商業編輯攝影題材」的機率，但不是保證通過安全過濾器的技巧，平台
     政策層級的限制不會因為這段文字消失。
- **實作**：`core-prompt.js` 新增兩個常量：
  `CORE_JAPANESE_SUMMER_EDITORIAL_DIRECTION`（【日系商業旅拍美學方向】，
  固定層，每次生成都會出現）與
  `CORE_JAPANESE_SWIMWEAR_EDITORIAL_ADDENDUM`（一句話追加句，只在泳裝
  服裝被選中時才附加），登錄到 `summerIslandCore.photographyDirection`／
  `summerIslandCore.swimwearDirection`。
- `summer-island.html` 新增 `SWIMWEAR_GARMENT_KEYS` 判斷集合（13 項，
  比照 `FANTASY_ILLUSTRATION_MATERIAL_KEYS` 的 Set 判斷模式，這個做法
  在專案裡不是新發明）：明確泳裝 11 項（`classicBikiniSet`／
  `highWaistBikini`／`onePieceSwimsuit`／`cutoutOnePiece`／
  `triangleBikiniWrap`／`sportySwimTop`／`highCutAthleticSwimsuit`／
  `goldChainBikini`／`jeweledOnePiece`／`laceUpBikiniSet`／
  `shellDetailSwimwear`）＋灰色地帶但判定為泳裝的 2 項（`rashguardSet`
  防曬水母衣、`wetsuitTopShorty` 短版防寒衣，都是貼身水域運動服）；
  `paddleboardShorts`（覆蓋度較高的機能短褲）跟其餘 17 項洋裝/罩衫/
  裙裝類都**不算**泳裝，不會觸發追加層。
- `generate()` 內插入順序：`identityGuard →`「Same adult woman...」→
  `photographyDirection`（固定，永遠出現）→ `isSwimwearGarment ?
  swimwearDirection : ''`（條件式）→ `anatomyGuard → ...`，剛好對應
  owner 確認的「身份鎖定 → 臉部幾何 → 日系商業旅拍 DNA → 真人骨架 →
  身形 → 使用者選擇的其餘模組」順序。`isSwimwearGarment` 判斷同時排除
  「使用者自填服裝文字」的情況——就算自填文字裡寫了 `custom bikini`，
  因為走的是 `customGarment` 分支不是預設服裝 key，不會觸發追加層
  （避免自由文字被誤判）。`applyThemeTemplate()`／隨機套用都不需要額外
  改動，因為兩者最後都會呼叫 `generate()`，會自動用當下選中的服裝 key
  重新判斷。
- **驗證**：`check-static.mjs`／`audit-100x.mjs`（1000 次模擬 0 issue，
  `SUMMER ISLAND` 模擬區塊同步加上 `isSwimwearGarment` 判斷邏輯）／
  `build-prompt-preview.mjs`（`generateSummerIsland()` 預設服裝改成
  `classicBikiniSet` 讓預覽同時示範固定層與追加層都正確出現；核心區塊
  長度 report 顯示 delta 全部為 0，沒有動到任何既有頁面的共用核心）都
  過。另外寫 9 項新 jsdom 實測：固定層每次都出現、選泳裝時追加層正確
  出現、選非泳裝服裝時追加層不出現但固定層仍在、自填服裝文字寫
  「custom bikini」也不會觸發追加層——連同既有 52 項共 61 項全過。

## 2026-07-29（十九）　summer-island.html 新增「Prompt Compatibility System」組合風險檢查層

- owner 上傳實際程式碼給另一個 AI 分析，對方看完程式後修正了自己前一輪
  的誤判（誤以為 `Korean Idol Stage Proportions` 是固定插入——查證後
  確認**不是**，那只是 `BODY_SHAPES` 五選一裡使用者手動選或隨機抽到才會
  出現的一個選項，本身沒有問題）。真正的問題定位在
  `applyIslandRandomSelection()`：服裝/材質/背景/光線/構圖/框景/姿勢/
  風格/鏡頭/比例是「每個欄位各自從完整選項池獨立隨機抽取」，沒有任何
  「抽完之後檢查整體組合是否協調」的機制，所以可能抽出「泳裝 + 濕潤
  肌膚材質 + 低角度仰拍 + 身形強調身材 + 強烈爆發材質」這種**單項都正常、
  疊加後語意過度集中在身體呈現**的組合；而且這個問題不只發生在隨機
  套用，手動逐一勾選同樣的組合也會踩到同一個坑，所以 Safety Layer 必須
  放在 `generate()` 本身，不能只修 random 函式。
- **設計原則**（owner 跟另一個 AI 討論後定案）：
  1. **不建立單字黑名單**——泳裝、玩水、濕身效果、低角度都保留，判斷的
     是「多項風格條件同時出現」而不是某個字本身。
  2. **隨機模式跟手動模式待遇不同**：隨機抽到的衝突欄位（鏡頭/材質/
     材質強度）可以直接被安全預設值取代，因為那些從來不是使用者刻意
     選的；但**手動模式絕對不能偷偷改掉使用者自己勾選的選項**——如果
     使用者手動組出高風險組合，維持他選的每一項，只在咒語裡另外加一句
     中性化的「balanced commercial travel editorial composition」語言
     去平衡整體語意，並在畫面上明確告知「未變更您手動選擇的任何選項」。
  3. **服裝、身形、主題永遠不列入可替換清單**——這三項是使用者最核心的
     創作決定，Safety Layer 只動最容易替換、最不影響主題的三個旋鈕：
     鏡頭角度、材質效果、材質強度。
- **實作**：新增 `validatePromptCombination(sel)` 函式，讀取
  `isSwimwearGarment`／身形是否為 `curvy_waist`/`korean_idol`（新增
  `BODY_EMPHASIS_SHAPE_KEYS`）／鏡頭是否為 `lowAngleHero`／材質是否為
  濕潤肌膚系（新增 `WET_SKIN_MATERIAL_KEYS`，就是上次已經調整過用詞的
  那 5 組材質）／材質強度是否為「強烈爆發」，5 個風險因子加總，
  `SAFETY_RISK_THRESHOLD = 3`（達標才觸發，不是任何單一因子觸發）。
  回傳 `{ valid, rawRiskCount, conflicts, replacements }`：`rawRiskCount`
  是實際偵測到的風險因子數（給手動模式判斷要不要加中性語言用，絕對不
  拿去覆寫任何欄位）；`conflicts`/`replacements` 是「如果要修正，建議
  替換哪些欄位成什麼安全預設值」（鏡頭→`eyeLevelCover`、材質→
  `goldenSunFlare`、強度→「平衡高級」文字），只給隨機模式使用。
  - `applyIslandRandomSelection()`：抽完之後呼叫這個函式，把
    `replacements` 直接套用到對應的 radio/select 上，再呼叫
    `generate()`；並把「重抽了哪些欄位」組成通知文字傳給
    `generate({safetyNote: ...})`。
  - `generate()`：呼叫這個函式只讀 `rawRiskCount`，**完全不套用
    replacements**——如果超標就在 prompt 陣列裡加一行
    `SAFETY_MODERATING_PHRASE`（"balanced commercial travel editorial
    composition, natural candid moment, understated and tasteful
    framing"），使用者實際選的服裝/材質/鏡頭/身形文字全部原封不動送進
    最終咒語。
  - 新增 `#safetyAdjustNotice`（畫面上的提示區塊，不在複製出去的咒語
    文字裡），依情境顯示「已自動重抽哪些欄位」（隨機模式）或「已加入
    中性化語言，未變更您手動選擇的任何選項」（手動模式），沒有風險時
    自動隱藏。
- **修正一個實作過程中自己發現的邏輯 bug**：`validatePromptCombination`
  第一版把「模擬套用 replacement 後遞減的風險數」跟「回傳給呼叫端的
  風險數」用了同一個變數，導致手動模式永遠讀不到真正的原始風險數（因為
  函式內部已經先「假裝修正過」再回傳）。改成分開回傳 `rawRiskCount`
  （原始，給手動模式判斷用）跟 `remaining`（函式內部模擬用，不外流），
  修正後才讓「手動高風險組合會加中性語言」這個分支真的能被觸發。
- 未採用另一個 AI 額外提議的「Context Compatibility」（依姿勢分類自動
  限制對應服裝類別，例如 SUP 只配運動泳裝、獨木舟只配機能水域服）——
  評估後認為那是**畫面合理性/創意多樣性**的問題，跟這次真正要解決的
  「風險因子疊加」是兩件不同的事；商業攝影本來就常出現「不完全符合
  活動情境」的造型搭配（例如洋裝也可以站在 SUP 板上拍創意主視覺），
  硬性限制反而會犧牲既有的隨機多樣性，屬於範圍外的功能擴充，這次先
  不做，有需要再另外討論設計。
- **驗證**：`check-static.mjs`／`validate-preset-refs.mjs`／
  `audit-100x.mjs`（1000 次模擬 0 issue）／`build-prompt-preview.mjs`
  都過，CSS 大括號配對確認平衡。另外寫一支全新的 926 項 jsdom 測試檔
  （`test-summer-island-safety.mjs`）：`validatePromptCombination` 單元
  測試（0/2/3/5 個風險因子的邊界行為、custom 欄位排除邏輯）、手動模式
  高風險組合驗證「使用者選的鏡頭角度完全沒被改掉、只加了中性語言、
  身份鎖定完整」、手動模式低風險組合驗證「不會平白加語言」、隨機模式
  跑 300 次確認每次最終狀態都通過相容性檢查且不會產生空咒語、自填服裝
  文字寫 bikini 不會誤觸發泳裝相關邏輯——全部通過；加上既有的 61 項
  jsdom 測試，這頁目前累計驗證項目達 987 項。

## 2026-07-29（二十）　summer-island.html 下架刪除

- owner 實測 summer-island.html 產出的咒語，即使經過（十六）用詞調整、
  （十七）日系商業旅拍 DNA 固定層、（十八）泳裝觸發追加層、（十九）
  Prompt Compatibility System 組合風險檢查層這四輪修正，圖像生成端仍然
  持續回報「提示詞可能違反裸露、性或色情內容的防範機制」。owner 決定
  放棄這個主題，明確要求：「把 夏日海島咒語產生器 刪除，包含在其他頁面
  的連結 都刪除」。
- **刪除範圍**：
  - `summer-island.html` 本體檔案。
  - 其餘 9 頁（index/travel/magazine/doll/fantasy-fashion/xianxia/
    anime-character/flower-fairy/isekai-fantasy/store-ad）nav 裡的
    「夏日海島」連結。
  - `index.html` 首頁的夏日海島 tool-card（HTML 區塊）與對應 CSS
    （`.tool-card.island` 系列規則：`::before`／`.tool-tag`／
    `.tool-cta`，強調色珊瑚橘 `#FF9466`）。
  - `assets/core-prompt.js` 的 `CORE_JAPANESE_SUMMER_EDITORIAL_DIRECTION`
    ／`CORE_JAPANESE_SWIMWEAR_EDITORIAL_ADDENDUM`／`summerIslandCore`
    三個宣告，以及 `window.HB_CORE_PROMPT.page` 註冊表裡的
    `summerIsland` 項目。
  - 四支驗證腳本（`check-static.mjs`／`validate-preset-refs.mjs`／
    `audit-100x.mjs`／`build-prompt-preview.mjs`）裡所有 summer-island
    相關的區塊、函式（`generateSummerIsland()`）與 try/catch 讀取邏輯。
- **驗證**：`grep -rln "summer-island\|summerIsland\|SummerIsland"
  scripts/ assets/ *.html` 確認全站 0 殘留引用；四支驗證腳本重跑，
  `audit-100x.mjs` 模擬數從 1000 降回 900（9頁×100）0 issue，
  `check-static.mjs`／`validate-preset-refs.mjs`／
  `build-prompt-preview.mjs` 皆過；全站 nav 逐頁確認回到每頁 10 個連結
  （首頁 + 9 個工具頁）。`assets/core-prompt.js` 用 `node -e` 直接載入
  確認 `window.HB_CORE_PROMPT.page` 的 key 列表回到
  `['travel','magazine','fantasy','xianxia','anime','flowerFairy',
  'isekai','doll','storeAd']`，不再有 `summerIsland`。
- **文件同步**：`CLAUDE.md` 拿掉三則 summer-island 建置/修正的詳細條目
  （原本累加了「新增頁面」「日系 DNA」「Compatibility System」三則），
  改成一則精簡的「已下架刪除」記錄，並把完整技術細節保留在本開發日誌
  2026-07-29（十六）～（十九）條目裡，供之後若重啟同類主題參考「哪些
  做法試過但仍不足以通過圖像生成端的內容防範機制」；`README.md` 的
  工具頁清單、資料夾結構、頁數說明同步改回 9 個工具頁。

## 2026-07-30　新增 4 個時尚寫真主題頁：花漾甜美系／氣質名媛宴會／韓系氣質偶像風／戰鬥制服學園

- **開放式腦力激盪過程**：owner 先請提 9 個以奇幻廣告為基礎的新主題方案，
  接著陸續加碼「時尚風格呢」（9 個當代時尚流派方案）、「再天馬行空 20
  個」（跨神話/元素/藝術風格）、「50 個 IP 主題或世界感」（原創世界觀，
  避開真實既有 IP 名稱）。中途 owner 提供夏日海島當初的例子釐清「場景化
  模組」跟「人物+服裝為主」兩種建頁思路的差異，最後明確收斂方向：「我要
  的是 新潮 美人 漂亮 那種感覺」，回頭指向先前「時尚風格」那組方案。owner
  從中選定 **花漾甜美系、氣質名媛宴會、戰鬥制服學園、韓系氣質偶像風**
  四個，其中「戰鬥制服學園」是 owner 自己額外提的新主題（不在前面任何一批
  清單裡），Claude 提醒這個主題跟既有 `anime-character.html`（動漫插畫風）
  與 `isekai-fantasy.html`（異世界幻想）氣質相近，建議走「戰術改良制服＋
  現代機能剪裁」的真人時尚路線做區隔，owner 認可後直接執行全部四頁。
- **建頁方法論選擇**：四頁都以 `flower-fairy.html`（1864 行）而非
  `fantasy-fashion.html`（3316 行，已累積 58 個模板）當複製底本——結構
  完全相同（00 模板／01 style／02 構圖／03 身形／04 服裝／05 材質／05b
  翅膀蝴蝶／06 姿勢／07 鏡頭／08 光影／09 背景／10 自訂／11 比例／12
  輸出），但模板數剛好 16 組、內容量更適合當新頁起點，複製後省去大量
  刪減既有 58 個模板的工作。四頁共通處理：拿掉 05b「翅膀與蝴蝶」維度（連
  同 `wingsData`/`butterfliesData` 兩個 JS 物件、`applyThemeTemplate`／
  `applyXxxRandomSelection` 裡的 `wings`/`butterflies` 欄位、`generate()`
  裡組裝 wingsText/butterfliesText 的三行）；02 構圖／03 身形／07 鏡頭／
  08 光影／`framingData`／`cameraData`／`ratioData`／`BODY_SHAPES`／五個
  identityGuard 系列共用防護區塊（`identityGuard`/`anatomyGuard`/
  `poseNaturalityGuard`/`compositionGuard`/`lightingConsistencyGuard`/
  `colorTemperatureGuard`/`subjectIntegrationGuard`/`faceFillGuard`）
  全部原樣沿用不改一字——這些都是全站共用的通用攝影概念與鎖臉防護層，不是
  花仙子專屬內容。00 一鍵模板區塊順手做了一個小簡化：flower-fairy.html
  原本第一顆模板按鈕是寫死的 `id="roseFairyRomancePreset"`（獨立
  `addEventListener`），其餘 15 顆用通用的 `data-template` 屬性
  （`querySelectorAll('[data-template]')` 統一綁定）——這正是先前
  開發日誌記錄過的「複製頁面時容易漏改的按鈕 ID」風險來源之一，四個新頁
  索性把全部 16 顆模板按鈕都改成 `data-template`，不再保留這個特例，
  從源頭消除該風險。
- **06 姿勢：依主題各自決定「精簡沿用」還是「整組保留」**，不是統一做法：
  - **floral-sweet.html（花漾甜美系）**：站姿 16 個全留；坐姿刪
    `throne_cross_leg`（寶座交腿，太貴氣不符甜美調性）與
    `rock_stream_leg_extend`（溪石伸腿，太自然系）2 個；手勢刪
    `water_sleeve`/`fan_cover`/`hold_mask_profile`/`calligraphy_brush`/
    `umbrella_gaze`/`lift_veil` 6 個東方戲劇/神秘感手勢；整組拿掉「電影
    感動態／戰鬥瞬間」16 個（甜美主題不需要武打張力姿勢）；新增「甜美
    專屬」姿勢群組 7 個：`skirt_twirl_smile`（裙擺旋轉笑意）、
    `floral_bouquet_hug`（抱花輕嗅）、`wink_finger_heart`（眨眼比心）、
    `picnic_basket_sit`（野餐籃邊坐）、`window_light_lean`（窗邊倚靠）
    ——另外重用 flower-fairy 原本「花仙子專屬」群組裡的
    `flower_crown_adjust`（花冠輕整姿）與 `petal_catch_reach`（花瓣接取
    伸手姿）這兩個本來就不含仙子元素、純粹是花卉互動動作的姿勢，一併
    留在新群組裡。姿勢池總數 57（含 auto）。
  - **gala-socialite.html（氣質名媛宴會）**：站姿 16 個全留；坐姿**刻意
    保留 `throne_cross_leg`**（寶座交腿坐姿正好貼合名媛女王氣場），只刪
    `rock_stream_leg_extend`；手勢刪同一批 6 個東方戲劇/神秘感手勢（`lift_veil`
    掀頭紗改為保留，因為「珠寶美妝感」的描述跟晚宴珠寶主題契合）；整組
    拿掉戰鬥瞬間 16 個；新增「名媛專屬」5 個：
    `champagne_toast_glance`（香檳致意回眸）、`clutch_hip_hold`（手拿包
    倚腰姿）、`masquerade_mask_reveal`（面具半遮姿）、
    `staircase_descent_pose`（階梯優雅下行姿）、
    `diamond_necklace_touch`（輕觸項鍊姿）。姿勢池總數 57。
  - **kpop-idol.html（韓系氣質偶像風）**：站姿 16 個全留；坐姿刪
    `throne_cross_leg`＋`rock_stream_leg_extend`；手勢刪同批 6 個東方
    戲劇/神秘感手勢；整組拿掉戰鬥瞬間 16 個；新增「偶像專屬」5 個：
    `mic_drop_confidence`（麥克風自信手勢）、`finger_heart_stage`（比心
    舞台手勢）、`ear_monitor_adjust`（耳返調整動作）、
    `dance_break_freeze`（舞蹈定格瞬間）、`backstage_candid_glance`
    （後台隨性回眸）。姿勢池總數 55（比其餘三頁少 2 個，因為手勢群組
    刪除範圍略有不同：多刪了 `hold_mask_profile`）。
  - **battle-academy.html（戰鬥制服學園）**：四頁中唯一**完整保留「電影
    感動態／戰鬥瞬間」16 個姿勢**（`arms_wide`/`bow_hero`/
    `shield_guard_stand`/`hero_landing_pose`/`sword_draw_pose`/
    `mid_air_slash`/`energy_burst`/`dual_spirit_guardian_throne` 等）
    ——這頁主題本來就需要武打張力姿勢，是唯一跟這個姿勢群組天然契合的
    新頁；坐姿只刪 `rock_stream_leg_extend`（`throne_cross_leg` 也保留，
    符合指揮官威嚴站姿的需要）；手勢刪同批東方戲劇/神秘感手勢；新增
    「指揮官專屬」5 個：`salute_ready_stance`（敬禮預備站姿）、
    `tactical_scan_gesture`（戰術掃視手勢）、`squad_signal_hand`（小隊
    手勢指揮）、`gear_check_moment`（裝備檢查瞬間）、
    `mission_briefing_gaze`（任務簡報凝視）。姿勢池總數 71（四頁中
    最大，含 auto），因為多保留了 16 個戰鬥瞬間姿勢。
- **04/05/09 內容規劃**（每頁皆 24 服裝/5組＋24 材質/5組＋24 背景/5組＋
  16 一鍵模板＋9 style，統一比 fantasy-fashion/xianxia 等頁常見的
  30 項/6組略精簡，符合「新開一頁不需要一開始就疊到滿」的判斷）：
  - floral-sweet：服裝＝花朵洋裝基礎／針織甜美上衣／蕾絲層次洋裝／緞帶
    蝴蝶結套裝／甜美派對禮服；材質＝花束花飾／柔光泡泡／緞帶蝴蝶結細節／
    甜點生活道具／光影氛圍；背景＝花店溫室／公園花園／甜美生活場景／
    街景旅拍／夢幻抽象。
  - gala-socialite：服裝＝晚宴禮服基礎／珠寶名媛套裝／俐落剪裁套裝／
    蕾絲薄紗晚裝／高定訂製禮服；材質＝珠寶配飾／香檳金光影／緞面絲絨
    質感／花藝宴會道具／光影氛圍；背景＝宴會廳／名流社交場景／燭光晚宴／
    城市夜景／抽象奢華。
  - kpop-idol：服裝＝舞台表演服／極簡高訂套裝／街頭潮流穿搭／機場時尚／
    夢幻概念寫真服；材質＝舞台光影特效／造型配件／都會夜色光影／音樂
    概念特效／柔焦色調氛圍；背景＝舞台表演／指揮任務／城市夜景／機場
    旅行／極簡棚拍／生活時尚（6組，比其餘三頁多一組，因為機場與抽象
    棚拍兩類都值得獨立成組）。
  - battle-academy：服裝＝戰術改良制服／機能剪裁外套／訓練服運動剪裁／
    制服配件套裝／指揮官隊長進化服；材質＝戰術裝備配件／能量光效／訓練
    場景特效／學院徽章紋樣／光影氛圍；背景＝學院訓練場景／指揮任務場景／
    城市與廢墟場景／校園日常場景／抽象科技背景。
- **`core-prompt.js`**：新增 `floralSweetCore`／`galaSocialiteCore`／
  `kpopIdolCore`／`battleAcademyCore`，結構比照 `flowerFairyCore`
  （`identityGuard` 含 Style Scope Rule、`anatomyGuard` 用寫實
  `humanCore`、`poseGuard`/`lightingGuard`/`negativePrompt`/`output`
  接共用區塊），`battleAcademyCore` 的 Style Scope Rule 額外加一句
  「This is a photorealistic photography campaign, not an
  anime/illustration conversion」（比照 `isekaiCore` 的做法，因為
  「戰鬥」「制服」字面容易讓人聯想動漫/遊戲插畫風，需要明確排除），
  四個 Core 都註冊進 `window.HB_CORE_PROMPT.page`（`floralSweet`／
  `galaSocialite`／`kpopIdol`／`battleAcademy`），用 `node -e` 直接
  載入確認 13 個 key 全部正確存在。
- **全站整合**：
  - Nav：寫一支 Node 腳本統一重寫全部 14 個檔案（index.html＋13 工具頁）
    的 `<div class="nav-links">` 區塊，用同一份 14 項清單陣列（含中文
    label 與 href）逐檔案輸出、依檔名自動標記 `active`，避免手動逐頁
    加 4 個連結時遺漏或順序不一致；跑完後逐檔 `grep -c` 確認全部 14 個
    檔案都剛好有 14 個 `nav-link`。
  - `index.html`：新增 4 張 tool-card（花漾甜美系珊瑚粉 `#FFB4A8`、
    氣質名媛宴會香檳金 `#E0B978`、韓系氣質偶像風亮青 `#6FE7FF`、戰鬥
    制服學園戰術灰藍 `#8FA1B3`，四色皆未使用過，跟既有 8 色區隔），
    CSS 三段式規則（`::before` 卡片頂色條／`.tool-tag` 標籤色／
    `.tool-cta` 行動呼籲色）比照既有卡片結構逐一補齊。
  - 四支驗證腳本：`check-static.mjs` 的 `htmlFiles` 陣列＋4；
    `validate-preset-refs.mjs` 依既有 isekai 區塊格式各加一段（含
    `bodyShape`／`intensity` 欄位檢查）；`audit-100x.mjs` 依 isekai 區塊
    格式各加一段模擬邏輯（不含 wings/butterflies 分支）；
    `build-prompt-preview.mjs` 各加一個 `generateXxx()` 函式＋
    `loadRevision()` 內的 try/catch skip-gracefully 區塊（沿用「新頁面
    在舊 revision 不存在時優雅跳過」的既有模式）。
- **驗證結果**：四頁各自先用暫存目錄的一次性 Node 腳本（沿用
  `validate-preset-refs.mjs` 的 `liveRadioValues`/`extractObjectLiteral`
  手法）單獨驗證 `themeTemplates` 16 組欄位值全部存在於當頁選項池、
  無重複 id、inline script 語法合法，四頁皆 0 issue 後才進入全站整合。
  整合後重跑四支正式腳本：`check-static.mjs` 全過；
  `validate-preset-refs.mjs` 13 頁 `themeTemplates` 全過、新增 4 頁各
  16 組 0 issue；`audit-100x.mjs` 累計 1300 次模擬（13頁×100）0 issue；
  `build-prompt-preview.mjs` 四頁新增的 `worktree-*-default.txt` 正常
  產出（無對應 `base-*` 版本可比對，因為是全新頁面，符合預期）。
  `core-prompt.js` 用 `node -e` 直接載入驗證語法與 13 個 page key。
- **文件同步**：`CLAUDE.md` 現況摘要日期更新為 2026-07-30、工具頁計數
  9→13、新增一則完整記錄本次四頁建置的細節（含每頁姿勢池取捨差異、
  04/05/09 分組內容、強調色選色）；`README.md` 頁數說明、正式頁面清單、
  資料夾結構三處同步改為 13 個工具頁。

## 2026-07-30（二）　battle-academy.html 風格修正：軍事戰術學院 → 日系校園戰鬥漫畫

- owner 回報初版方向錯了：「戰鬥制服學園 風格你搞錯了，我要的的 類似日本
  漫畫 真人學生服改良戰鬥服 和服改良戰鬥服 水手服改良戰鬥服 校園戰鬥
  那種」。初版（同日稍早的條目）走「近未來軍事戰術學院」路線——戰術背心
  西裝外套、科技面料風衣、全息指揮中心、飛行載具機庫、數據平板道具——
  跟 owner 真正要的「日本漫畫真人化＋制服改良戰鬥服＋校園戰鬥」是完全
  不同的兩個方向，雖然都叫「戰鬥制服學園」。
- **04 服裝**：24 項全部重寫，5 組全部改成日系制服 archetype：學生服改良
  戰鬥服（詰襟`gakuranBattleArmor`／西裝外套式`blazerBattleUniform`／
  披風`gakuranCapeBattle`／護甲裙`blazerArmoredSkirtSet`／破損痕跡
  `tornGakuranBattleWorn`）、水手服改良戰鬥服（護甲`sailorBattleArmor`／
  緞帶`sailorRibbonBattleSuit`／護甲裙`sailorPleatedArmoredSkirt`／
  披肩`sailorCapeGuardian`／臂甲`sailorGauntletBattleSet`）、和服改良
  戰鬥服（護甲`kimonoBattleArmor`／袴裝`hakamaBattleWarrior`／劍道
  `kendoBattleUniform`／振袖`furisodeArmoredBattle`／腰帶劍鞘
  `kimonoObiBladeHolster`）、異能魔法系學園戰鬥服（`magicalBattleUniform`／
  `espSchoolBattleSuit`／`ribbonArmorSchoolSet`／`capeSchoolGuardianUniform`／
  `sentaiRangerSchoolSuit`）、隊長畢業進化服（`studentCouncilBattleUniform`／
  `eliteSquadSchoolArmor`／`graduationBattleKimono`／
  `legendarySchoolBattleRelic`）。
- **05 材質**：24 項裡把明顯軍事科幻的 8 項換掉——
  `dataTabletPropAccent`（數據平板）→`bentoBagPropAccent`（書包便當包，
  刻意做「日常物件＋戰鬥制服」反差感）；`energyShieldGlow`／
  `holographicMapGlow`／`circuitLinePulseGlow`／`plasmaTrailStreak`／
  `scannerGridOverlay` 五個科技光效群組換成
  `spiritPowerAuraGlow`（靈氣力量光暈）／`glowingSealCircle`（發光咒印
  法陣）／`schoolCrestGlowLine`（校徽紋路發光線條）／
  `bladeEnergyTrailStreak`（劍氣軌跡光紋）／`spiritSensorOverlay`
  （靈力偵測網格投影，保留「偵測」概念但改成靈力而非科技掃描）；
  `circuitEmbroideryDetail`（電路刺繡）→`tornFabricBattleDamage`
  （破損布料戰鬥痕跡，很典型的戰鬥漫畫「制服殘破」敘事細節）；
  `coldBlueTacticalLight`／`warningRedAlertGlow`／`hangarFloodLight`
  三個光影氛圍換成`duskRooftopBattleGlow`（黃昏屋頂決戰光暈）／
  `alertCrimsonGlow`（警戒緋紅警示光，概念相同但脫離軍事警報語彙）／
  `gymnasiumFloodLight`（體育館強光照明）。其餘（塵土衝擊爆發／火花衝擊
  閃光／氣流亂流動態／學院徽章／金屬滾邊等通用戰鬥/學院元素）維持不動。
- **09 背景**：24 項裡「指揮與任務場景」整組 5 項（全息指揮中心／戰術
  簡報室／飛行載具機庫／控制塔夜景／多螢幕作戰室）全部換成「校園決戰
  場景」新分組：`schoolRooftopBattle`（學校屋頂決戰）／
  `schoolGateSiege`（校門對峙戰場）／`gymnasiumBattleArena`（體育館決鬥
  擂台）／`schoolCourtyardSakuraBattle`（校園中庭櫻花決戰）／
  `schoolLibraryBattleAftermath`（圖書館戰鬥後現場）。學院訓練場景組把
  「室內射擊訓練場」換成`kendoDojoInterior`（劍道場內部，更符合日系武道
  設定）、「戰術裝備置物間」改名`studentLockerHallway`（學生置物櫃走廊）。
  抽象科技背景組改名「抽象靈力背景」，`holographicGridVoid`→
  `spiritEnergyVoidBackdrop`、`dataStreamAbstractBackdrop`→
  `sealCircleAbstractBackdrop`、`neonTacticalStudioBackdrop`→
  `sakuraPetalStudioBackdrop`（櫻花瓣棚拍背景）。校園日常場景組（圖書館／
  中庭夕陽／宿舍走廊／屋頂日景）與城市廢墟組（廢墟／廢棄建築／夜間屋頂／
  秘密基地／封鎖線，僅改名淡化軍事語彙）維持結構不動。
- **01 style**：刻意**不改 9 個 value key**（`tacticalCampaign`／
  `academyEditorial`／`cinematicMission`／`cleanFunctional`／
  `darkTacticalMood`／`gameKeyVisual`／`trainingDocumentary`／
  `beautyCampaign`／`squadPosterCampaign`），因為 16 個 themeTemplates
  都用 key 參照 style，改 key 名要連帶改全部模板容易出錯；只改中文
  label/desc 與 `styleData` 裡的英文 prompt 文字本身，把「戰術機能品牌」
  「軍事」語彙換成「日系戰鬥漫畫真人化」「制服」語彙。
- **06 姿勢刻意完全不動**：這是本次修正裡唯一「維持原判斷」的部分——
  上一版 battle-academy.html 是四頁新頁裡唯一完整保留 fantasy 原始「電影
  感動態／戰鬥瞬間」16 個姿勢（`sword_draw_pose`／`mid_air_slash`／
  `hero_landing_pose`／`energy_burst`／`dual_spirit_guardian_throne` 等）
  的頁面，這批姿勢本來就是為武打張力設計，剛好完全符合「校園戰鬥漫畫」
  需求，不需要因為這次風格修正而更動。只做兩處小調整跟主題方向對齊：
  「指揮官專屬」姿勢群組改名「隊長專屬」（更貼近學生會長/社團隊長的
  校園語境而非軍事指揮官）；`mission_briefing_gaze` 的 pose prompt 文字
  把「standing before a hologram map」改成「standing before a glowing
  seal circle」，呼應新的咒印法陣異能設定，其餘 4 個新增姿勢
  （敬禮預備／戰術掃視／小隊手勢指揮／裝備檢查）文字維持不變，本來就是
  通用備戰動作，跟軍事或校園語境都不衝突。
- **00 一鍵模板**：16 組全部依新服裝/材質/背景重新設計並改名，例如
  「戰術簡報專注」→「學生服屋頂決鬥」（`gakuranRooftopDuel`）、
  「機庫出發準備」→「和服櫻花斬擊」（`kimonoSakuraSlash`）、「圖書館
  戰術閒暇」→「劍道場專注武者」（`hakamaKendoDojoFocus`）、「全息數據
  疊層視覺」→「傳說聖裝能量爆發」（`legendaryRelicEnergyBurst`）。
- **`core-prompt.js`**：`battleAcademyCore` 的 Style Scope Rule 第一句
  從「Commercial style, tactical academy uniform...」改成「Commercial
  style, Japanese school-battle manga inspired uniform design (gakuran,
  sailor fuku, kimono reimagined as lightweight battle armor)...」，
  「photorealistic photography campaign」補一個「live-action」強調
  「真人化」而非單純「非插畫」。
- **周邊同步**：`index.html` 卡片文案（tool-tag／h1／p／tool-features）
  改寫成強調「日系漫畫風真人改良戰鬥服」；`scripts/audit-100x.mjs` 的
  customSamples 陣列把殘留的 `'exosuit joints'`（機甲關節，明顯軍事科幻
  用詞）換成 `'sakura petal battle damage'`；
  `scripts/build-prompt-preview.mjs` 的 `generateBattleAcademy()` 預設
  選項組合（garment/material/background/pose）同步改成新的 key，避免
  用已刪除的舊 key 導致該函式直接 `undefined.prompt` 炸掉。
- **驗證**：先用暫存目錄一次性腳本單獨驗證 `themeTemplates` 16 組欄位值
  全部存在於新選項池（0 issue），再重跑四支正式腳本全過：
  `check-static.mjs` 全過；`validate-preset-refs.mjs` 13 頁全過（含
  battle-academy 16 組 0 issue）；`audit-100x.mjs` 累計 1300 次模擬
  （13頁×100）0 issue；`build-prompt-preview.mjs` 正常產出
  `worktree-battleacademy-default.txt`，人工檢視內容確認組裝結果正確
  （`appearance form: stand-collar gakuran school uniform reinforced
  with lightweight armor plating...`／`background design: school
  rooftop background, wind-swept campus-battle atmosphere`），不再有
  任何軍事科幻用詞殘留。`core-prompt.js` 用 `node -e` 確認語法與 13 個
  page key 正常。這次修正沒有更動任何 HTML 結構、JS 函式邏輯或驗證腳本
  的結構，純粹是內容值（服裝/材質/背景/style文字/一鍵模板）的全面替換，
  技術風險低，主要工作量在於重新設計貼合「日系校園戰鬥漫畫」主題的
  24+24+24+16 項內容。

## 2026-07-30（三）　新增 freeform.html（自由生圖）：鎖臉核心固定＋單一自由輸入格

- owner 先確認現況：「目前 鎖臉核心 算穩定了，剩下都是 衣服 背景 光線
  圖片大小 姿勢的組合 對嗎」，Claude 確認並補充材質/鏡頭/構圖也屬於同一層
  可替換組合。接著 owner 提出新頁面需求：「幫我在寫一個 自由生圖 骨子裡
  是遵守 鎖臉核心固定 然後 介面上 給我一大格 讓我自由輸入 風格語氣/服裝
  ／材質／姿勢/背景>>>給提示詞就好，鏡頭/比例 給我選項 讓我點選」。
- **實作前用 `AskUserQuestion` 確認兩個規格缺口**：owner 的描述漏了「光線」
  歸類（前一句才確認光線是可替換組合之一，這句卻沒放進自由輸入框或選項
  清單），以及沒說明身形輪廓（03）與構圖取景（02，其他頁面這兩項也是
  點選卡片）該怎麼處理。owner 回答：光線併入自由輸入框（採納 Claude 的
  推薦選項）；身形輪廓與構圖取景**也**併入自由輸入框（比 Claude 建議的
  「維持卡片」更徹底，owner 選了更簡化的路線）。最終確定架構：**只留
  07 鏡頭角度、11 比例兩個點選區塊，其餘全部（風格語氣/服裝/材質/姿勢/
  背景/光線/身形輪廓/構圖取景）併入同一個自由輸入大格**。
- **建置方式**：複製 `flower-fairy.html` 當底（沿用 nav/CSS/stale 生成
  機制骨架），但主體內容用 Node 腳本做整段行號 splice 取代（不是逐一
  Edit 微調），因為要刪除的區塊（00 一鍵模板／01 style／02 構圖／03
  身形／04 服裝／05 材質／05b 翅膀蝴蝶／06 姿勢／08 光影／09 背景／10
  自訂要求，共約 585 行 HTML＋900 行 JS）遠大於要保留的內容，整段替換
  比連續多次 Edit 更不容易出錯。
  - **HTML**：只留 4 個 section——01 創作方向（自由輸入，一個
    `<textarea id="customDirection" rows="10">`＋一顆「填入範例文字」
    按鈕，點擊只是把一段範例段落塞進 textarea 讓使用者參考修改，不是
    預寫組合套用）、02 拍攝角度與鏡頭感（`cameraData`，9 選項，原封不動
    照抄其他頁）、03 圖片比例（`ratioData`，8 選項，原封不動照抄）、04
    生成咒語（輸出/複製/stale 機制照抄）。CSS `order` 規則也同步從 13 條
    精簡成 4 條（`.section-direction/camera/ratio/output`）。
  - **JS**：只留 8 個鎖臉核心 guard 常數
    （`identityGuard`/`anatomyGuard`/`poseNaturalityGuard`/
    `compositionGuard`/`lightingConsistencyGuard`/`colorTemperatureGuard`/
    `subjectIntegrationGuard`/`faceFillGuard`，逐字照抄其他頁的 fallback
    文字，只有 `anatomyGuard` 裡一句「unless a selected body refinement
    explicitly requests subtle adjustment」改成「unless the user's
    creative direction explicitly requests a body adjustment」呼應
    身形輪廓已經不是卡片選項）、`cameraData`/`ratioData`（原封不動）、
    `EXAMPLE_DIRECTION` 範例文字常數。`materialData`/`garmentData`/
    `styleData`/`backgroundData`/`lightingData`/`wingsData`/
    `butterfliesData`/`BODY_SHAPES`/`poseData`/`framingData`/
    `themeTemplates` 等資料物件與對應函式（`applyThemeTemplate`/
    `applyFlowerRandomSelection`/`getRandomItem`/`getAllRadioValues`/
    `getAllSelectValues`/`customKeywordList`）全部刪除。`generate()`
    改成：8 個 guard 區塊照順序接上→插入使用者的 `customDirection`
    原文（前面加標籤句「user's creative direction (style and mood,
    garment, material, pose, background, lighting, body silhouette and
    composition, all specified by the user): 」，後面加一句明確重申範圍
    限制「...must not change the facial structure, identity, age
    impression or recognizable features established by the identity
    lock system」）→鏡頭→比例→輸出品質→負面約束，比其他頁的
    `generate()` 短很多（不需要處理材質/服裝/背景三種 custom 欄位或
    color palette 邏輯，因為使用者的自由輸入本身就是唯一輸入源）。
  - `core-prompt.js` 新增 `freeformCore`，Style Scope Rule 改寫成
    「The user's freeform creative direction (...) must not change the
    person's facial structure, identity, age impression or recognizable
    features, regardless of how the user's free text is phrased」——
    特別加上「regardless of how the user's free text is phrased」這句，
    是因為這頁的輸入完全開放（其他頁的服裝/材質是固定選項不會出現矛盾
    或誤導性指令，這頁使用者可以打任何字，包含可能無意間寫出暗示改變
    臉部的描述），需要更明確地重申「不管使用者怎麼寫都不能覆寫身份」。
- **四支驗證腳本，只有三支適用**：`check-static.mjs` 正常加入
  `freeform.html`；`validate-preset-refs.mjs` **刻意沒加區塊**——這頁沒有
  `themeTemplates` 這類一鍵套用物件可檢查，跟 `doll.html`／
  `store-ad.html`（同樣沒有 `themeTemplates` 結構）的既有慣例一致，不是
  遺漏；`audit-100x.mjs` 仿造 `store-ad.html` 的 `textSamples` 手法寫一組
  `directionSamples`（空字串、純空白、正常範例、600 字超長文字、含
  emoji/引號/HTML標籤的特殊字元組合），跟隨機抽的鏡頭/比例組合一起跑
  100 次模擬；`build-prompt-preview.mjs` 加 `generateFreeform()` 鏡像
  函式＋`loadRevision()` 裡的 try/catch skip-gracefully 區塊，用固定的
  範例創作方向文字做 0-diff 回歸基準。
- **周邊整合**：全站 nav 用既有的 Node 批次腳本（`update-nav.mjs`，前一次
  四頁上線時寫的）重跑一次，陣列加一筆 `['freeform.html', '自由生圖']`
  即可自動處理全部 15 個檔案的 `.nav-links` 區塊，不需要手動逐頁補連結；
  `index.html` 新增卡片，強調色選米白灰 `#D8D4CC`（象徵「留白／自由畫布」
  的視覺語言，跟既有 12 個強調色都不同）。
- **驗證結果**：`check-static.mjs` 全過；`audit-100x.mjs` 累計 1400 次
  模擬（14頁×100）0 issue；`build-prompt-preview.mjs` 正常產出
  `worktree-freeform-default.txt`，人工檢視內容確認 8 個 guard 區塊＋
  使用者創作方向文字＋鏡頭／比例／輸出品質／負面約束的組裝順序正確；
  `core-prompt.js` 用 `node -e` 確認語法與 14 個 page key
  （多了 `freeform`）正常；全站 15 個檔案的 `nav-link` 數量逐一 `grep -c`
  確認皆為 15。這頁是目前唯一「結構性比其他頁簡單」的工具頁——沒有
  00/01/02/03/04/05/06/08/09/10 十個區塊，只有 4 個，這是刻意的設計
  結果（owner 明確要求把大部分維度收斂成一個自由輸入格），不是遺漏。

## 2026-07-31　freeform.html（自由生圖）下架刪除

- owner 實測後決定不需要「自由生圖」這個工具，直接下架，指令：「自由生圖
  咒語產生器 下架 連結都刪除」。比照前一次 `summer-island.html` 下架的
  既定流程執行：(1) `rm freeform.html` 本體；(2) 用正規表示式從其餘 13 個
  頁面（`index.html`/`travel.html`/`magazine.html`/`doll.html`/
  `fantasy-fashion.html`/`xianxia.html`/`anime-character.html`/
  `flower-fairy.html`/`isekai-fantasy.html`/`store-ad.html`/
  `floral-sweet.html`/`gala-socialite.html`/`kpop-idol.html`/
  `battle-academy.html`）移除 `<a class="nav-link" href="freeform.html">
  自由生圖</a>` 連結；(3) `index.html` 移除 `.tool-card.freeform` HTML 區塊
  與 3 組對應 CSS 規則（`::before`/`.tool-tag`/`.tool-cta`）；(4)
  `assets/core-prompt.js` 移除 `freeformCore` 物件與 `page` 註冊表裡的
  `freeform: freeformCore` 一行；(5) `scripts/check-static.mjs` 的
  `htmlFiles` 陣列移除 `'freeform.html'`；`scripts/audit-100x.mjs` 移除整段
  `FREEFORM` 模擬區塊（總模擬數從 1400 回到 1300）；
  `scripts/build-prompt-preview.mjs` 移除 `generateFreeform()` 鏡像函式與
  `loadRevision()` 裡對應的 try/catch skip-gracefully 區塊（
  `validate-preset-refs.mjs` 原本就沒有 freeform 區塊，這頁沒有
  `themeTemplates`，跟 `doll.html`/`store-ad.html` 的既有慣例一致，不用改）。
- **驗證結果**：四支腳本全部重跑確認乾淨：`check-static.mjs` 13 個頁面全
  PASS；`validate-preset-refs.mjs` 9 頁 `themeTemplates` 檢查 0 issue；
  `audit-100x.mjs` 累計 1300 次模擬（13頁×100）0 issue；
  `build-prompt-preview.mjs` 正常產出（無 `freeform-default.txt`，無錯誤）；
  `core-prompt.js` 用 `node -e` 確認 `window.HB_CORE_PROMPT.page` 剩 13 個
  key（無 `freeform`）。文件同步更新：`CLAUDE.md`/`README.md` 頁數
  14→13、`freeform.html` 建置細節條目改寫成簡短下架記錄（本檔完整建置
  歷史保留在 2026-07-30（三）條目供之後追溯）。工具頁回到 13 個。

## 2026-07-31（二）　全站導覽改為首頁單向連結

- owner 指示：「保留首頁有其他工具頁的連結，其他工具頁將跟首頁和其他工具頁
  連結都拿掉」。13 個工具頁的 `<nav>` 內 `<a class="nav-logo"
  href="index.html">` 改成不可點擊的 `<span class="nav-logo">`，
  `.nav-links`（含 `首頁` 連結與其餘 13 個工具頁連結，共 14 個 `<a>`）
  整個 `<div>` 移除；`index.html` 自己的 nav 完全不動，仍保留 14 個連結的
  完整導覽（首頁本身＋13 個工具頁）。用 Node 腳本以正規表示式批次處理：
  第一段先把 `nav-logo` 的 `<a href="index.html">` 換成 `<span>`（保留
  文字），第二段用 `<div class="nav-links">[\s\S]*?<\/div>` 非貪婪比對
  整段移除；第一輪跑完發現 `doll.html`/`store-ad.html` 因為原始檔案的
  空白/換行寫法跟其他 11 頁不同，被同一條規則意外提早匹配掉整個
  `nav-links` 區塊（等於提早完成），其餘 11 頁則沒被移除，用更嚴謹的
  `[ \t]*<div class="nav-links">[\s\S]*?<\/div>\r?\n` 規則重跑第二輪
  補齊。四支驗證腳本（`check-static`/`validate-preset-refs`/
  `audit-100x`/`build-prompt-preview`）全部重跑通過，`check-static.mjs`
  的本地連結檢查邏輯是「找 HTML 裡出現的 `.html` href 是否存在」，工具頁
  連結變少後檢查範圍自然縮小，不影響通過與否。

## 2026-07-31（三）　battle-academy.html 全面重構：扁平單選卡片 → 模組化制服設計引擎

- owner 貼了一份完整的「戰鬥制服學園」規格書，先要求「你分析看看，給我
  3套方案」。三套提案：**A 內容重寫、架構不變**（服裝卡片本身寫成已融合
  學校+剪裁+腰線+裙型的完整搭配，工程量最低但做不到獨立換色換校徽）；
  **B 新增學校身份為獨立維度、服裝維持整套造型**（服裝卡片改寫成已合規
  的「造型輪廓」組合，學校與服裝分開選但服裝本身仍是整套不可拆）；
  **C 完整模組化拆件引擎**（精確照規格書實作，9 個維度全部獨立可選，
  搭配相容性組合表）。owner 選 C 執行。
- **核心原則**：「服裝戰鬥化 ≠ 服裝裝甲化」——舊版 04 服裝是「一張卡片＝
  一整套固定服裝」，容易把「真人×日系制服×異能學園」做成「真人×制服
  元素×RPG戰士」。新版拆成 9 個獨立維度：
  - **04 學校身份**（6 校，只帶主色/輔色/金屬色/校徽/氣質文字，不含服裝
    版型）：櫻華學園（深藍紫＋金屬金／五瓣櫻花校徽／優雅古典）、白鷺
    女學院（象牙白＋靛藍／金屬銀／白鷺羽翼校徽／尊貴清冷）、朱雀學院
    （黑＋深緋紅／金屬金／朱雀神鳥校徽／強勢張揚）、青嵐學園（白＋青藍
    ／墨藍點綴／金屬銀／風羽校徽／清新現代）、月影學院（黑＋深紫／金屬
    銀／弦月校徽／神秘幽玄）、神樂女學園（白＋朱紅／金屬金／神樂鈴與
    注連繩校徽／和風儀式傳統）。
  - **05 上身**（9 項）：水手領上衣／詰襟學生外套／學院西裝外套／短版
    學院外套／剪裁制服外套／正式學院襯衫／和風交領上衣／現代和風學院
    上衣／儀式感學院上衣。
  - **06 腰線輪廓**（9 項，純剪裁效果，明確不是身形調整）：自然腰線／
    高腰剪裁／合身腰線／寬版學院腰封／窄腰帶／雙腰帶／和風帶結腰線／
    綁繩腰線／儀式腰帶。身形仍完全由既有 03 身形輪廓控制，兩者互不影響。
  - **07 下身**（10 項）：百褶短裙／A字短裙／及膝百褶裙／中長百褶裙／
    長版百褶裙／現代袴裙／袴褲／寬褲裙／不對稱裙擺／層次和風裙。
  - **08 制服類型**（7 項，季節/場合修飾詞，不改變上身/腰線/下身版型）：
    標準日常／夏季／冬季／儀式／學生會／社團活動／特殊部門。
  - **09 配件與幻想戰鬥細節**：配件 7 項沿用舊材質庫的道具類（校徽徽章／
    護腕綁帶／刀鞘／書包便當包／能量刃，新增髮飾緞帶／手鍊吊飾）；幻想
    細節 15 項＝舊「靈氣異能光效」5＋「戰鬥特效」6（含破損布料戰鬥痕跡）
    ＋「戰鬥情境光效」4；新增「校徽強調位置」下拉選單（10 個位置，胸口
    徽章/領口別針/腰帶扣環/袖口刺繡/領帶刺繡/裙擺紋樣/髮飾/武器鞘身
    紋飾/書包吊飾/交給AI自然安排），選定後會帶入該校金屬色與紋樣文字。
  - **10 裝甲與披風強度**：Armor Mode（off/light/full，**預設 off**）、
    Cape Mode（off/on，**預設 off**）——這是防止「戰鬥/幻想關鍵字自動
    變成 RPG 盔甲角色」的核心技術機制，off 狀態不只是「沒選」，而是會在
    咒語裡明確插入「no heavy armor plating, no RPG-style warrior armor,
    no exosuit segments added」「no cape, no cloak, no flowing mantle
    added」這類負面約束句，直接對應 owner 要求的「避免一般制服再次因為
    battle/fantasy 關鍵字自動變成 RPG Armor 或披風角色」。
- **相容性規則**：不對手動選擇做硬性阻擋（這是創作工具，尊重使用者自由
  組合），但新增 `OUTFIT_COMBOS`（13 組已驗證過視覺協調的「上身+腰線+
  下身」組合，例如「和風交領上衣＋帶結腰線＋現代袴裙」「學院西裝外套＋
  高腰剪裁＋及膝百褶裙」），00 一鍵模板與隨機套用都優先從這個表抽選，
  落實 owner 說的「隨機 ≠ 無規則」原則。
- **三種隨機模式**對應規格書的 Mode A/B/C：`battleRandomFixSchool`
  （固定學校，服裝上身/腰線/下身與其餘元素重新隨機）／
  `battleRandomFixOutfit`（固定上身/腰線/下身，學校與其餘元素重新隨機）／
  `battleRandomFull`（學校、服裝與其餘元素全部重新隨機），三顆按鈕取代
  舊版單一「隨機套用」按鈕。
- **00 一鍵模板**16 組全部重新設計，每校至少出現 2 次，涵蓋不同
  armorMode/capeMode/uniformType 組合，例如「神樂儀式鈴舞獻禮」用
  capeMode:on 搭配儀式腰帶與披風、「櫻華廢墟能量夜襲」是唯一
  armorMode:full 的模板（刻意示範「重甲化只在明確需要騎士/機甲級設定時
  才開」，其餘 15 組全部是 off/light）。其中「櫻華校徽劍氣綻放」模板
  （短版學院外套＋高腰剪裁＋百褶短裙＋劍鞘配件＋劍氣軌跡光紋）刻意對齊
  owner 認可的參考圖方向（黑紫制服＋刀＋櫻花＋幻想效果的視覺基準）。
- **`generate()` 組裝順序**：學校身份文字 → appearance form（上身+腰線+
  下身合併成一行）→ 制服類型 → armor styling → cape styling → 校徽強調
  位置（帶入該校金屬色與紋樣） → 配件 → 幻想戰鬥細節，色彩補充欄位留空
  時預設抓所選學校的 `colorNote`，不再依賴材質自帶調色盤（這是刻意的
  設計決定：色彩身份現在由學校系統統一負責，材質/幻想細節只負責效果本身
  不再各自帶色票，避免兩套顏色系統互相打架）。
- **不動的部分**：01 成品用途／02 構圖取景／03 身形輪廓／姿勢／鏡頭／
  光影／背景／比例，以及全部共用 guard 區塊（identityGuard/anatomyGuard/
  poseNaturalityGuard/compositionGuard/lightingConsistencyGuard/
  colorTemperatureGuard/subjectIntegrationGuard/faceFillGuard）完全沿用
  舊版文字，只是 section 編號因為新增 5 個區塊往後平移（原本 04-12 變成
  新版 04-17）。
- **`core-prompt.js` 更新**：`battleAcademyCore` 的 Style Scope Rule
  新增「Uniform Design Priority System」段落，明文寫「Uniform
  battle-ification is not uniform armor-ification」與「Fantasy details
  enhance the clothing; fantasy details must not replace the clothing」，
  並把舊句「kimono reimagined as lightweight battle armor」改成
  「kimono-inspired academy wear」（避免文字本身就預設要護甲化）；其餘
  identityGuard/anatomyGuard/poseGuard/lightingGuard/negativePrompt/
  output 完全不動，不觸碰共用核心系統（owner 明確要求不能破壞身份鎖定/
  姿勢/鏡頭/場景/材質/輸出等既有正常運作的系統）。
- **建置手法**：檔案改動幅度極大（新增 9 個維度、16 個模板全部重寫，
  單檔近 1900 行），為避免單次工具呼叫輸出過大，拆成 12 個 scratchpad
  片段檔（head/CSS、00-03 區塊、04-08 新維度、09-10 配件與裝甲、11-12
  姿勢鏡頭、13-14 光影背景、15-17 自訂/比例/輸出、JS 新資料物件、
  styleData/backgroundData/lightingData、guards/BODY_SHAPES/poseData等、
  OUTFIT_COMBOS/themeTemplates、generate()與事件監聽）分別撃寫，最後用
  `cat` 依序串接組合成完整檔案。
- **踩坑記錄**：過程中一度在 `themeTemplates` 物件字面量裡用
  `COMPOSITION_CENTERED`/`INTENSITY_BALANCED` 這類本地常數縮寫來減少
  重複字串，導致 `validate-preset-refs.mjs` 用 `vm.runInNewContext`
  單獨解析該物件字面量時丟出 `ReferenceError`（物件字面量被抽出來獨立
  執行的沙盒context 抓不到外部常數宣告）。修法是寫一支一次性替換腳本
  （正規表示式比對 `: NAME,`/`: NAME\n` 這種用法位置，換回對應的字面
  字串），並移除常數宣告區塊。**教訓**：這四支驗證腳本的機制是「把
  `const X = {...}` 物件字面量原始碼片段抽出來，丟進獨立的 vm context
  執行」，物件字面量裡不能引用任何在該片段之外宣告的變數/常數，否則
  vm 解析會直接報錯；之後如果想用常數簡化重複字串，物件字面量內只能
  直接內嵌字面值，不能宣告成外部 const 再引用。
- **驗證**：原本想用 jsdom 實際載入頁面點擊按鈕測試，但本機環境 jsdom
  的依賴鏈（`lru-cache`／`@asamuzakjp/css-color` 的 `package.json`
  `exports` 欄位）跟目前 Node 版本的 ESM 模組解析兜不起來，屬環境問題
  非程式碼問題，安裝測試後已解除安裝清理乾淨。改用專案既有的純
  `node:vm` 驗證慣例：`check-static.mjs`（JS 語法/重複 id 全過）、
  `validate-preset-refs.mjs`（16 個 `themeTemplates` 條目＋新增的 13 個
  `OUTFIT_COMBOS` 條目，全數欄位對到即時選項池，0 issue）、
  `audit-100x.mjs`（`generate()` 鏡像邏輯同步改寫，涵蓋新的 school/
  upperBody/waist/lower/uniformType/accessory/fantasyDetail/armorMode/
  capeMode/emblemFocus 全部欄位，100 次隨機模擬 0 issue，累計 1300 次
  模擬 13 頁 0 issue）、`build-prompt-preview.mjs`（`generateBattleAcademy()`
  鏡像函式同步改寫，人工檢視輸出樣本確認「school identity/appearance
  form/armor styling/cape styling/emblem focus/accessory/fantasy
  detail」的組裝順序與文字正確，armor off 狀態確實輸出「no heavy armor
  plating」等負面約束句）全部重跑通過。

## 2026-07-31（四）　battle-academy.html 實測後修正：拿掉2顆隨機按鈕、精簡咒語字數

- owner 實測模組化重構版後回報兩點：(1) 「隨機套用｜固定學校」「隨機
  套用｜固定服裝」這 2 個功能不要，拿掉；(2) 產生的咒語文字數量過長，
  需要優化精簡。
- **拿掉 2 顆按鈕**：00 區只留單一「隨機套用」按鈕（對應原本的「全部
  隨機」邏輯），`applyBattleRandomSelection()` 拿掉 `mode` 參數，固定
  「學校＋上身/腰線/下身（走 OUTFIT_COMBOS）＋其餘所有欄位」全部重新
  隨機；事件監聽只留 `battleRandomFull` 一個。
- **精簡咒語字數**：預覽輸出從 10,388 字元降到 9,152 字元（-12%），
  更接近同型頁面基準（kpop-idol 8,375／fantasy 8,636）。做法：
  - `generate()` 組裝邏輯：armor styling／cape styling 合併成一行
    `combat styling: {armor}; {cape},`；拿掉「use the selected fantasy
    detail system to form ornaments...」這句純解釋、不帶新資訊的說明句；
    `emblemFocusText` 不再重複帶出 `schoolInfo.metal`/`schoolInfo.emblem`
    （這兩個資訊在 `school identity:` 那一行已經講過一次，屬於重複）；
    `uniformType` 併入 `appearance form` 同一行（原本自己獨立一行）。
  - 資料物件全面砍掉重複/裝飾性子句只留核心描述：`upperBodyData`（9項）/
    `waistData`（9項）/`lowerData`（10項）從「主描述 + academy silhouette
    這類重複收尾語」砍成只留主描述；`accessoryData`（7項）/
    `fantasyDetailData`（15項）砍掉「refined XX detail」「XX atmosphere」
    這類每項都有、資訊量低的裝飾性尾句；`armorModeData`/`capeModeData`/
    `uniformTypeData`/`emblemFocusData` 全部重寫成更短的版本（例如
    armorMode off 從「no heavy armor plating, no RPG-style warrior
    armor, no exosuit segments added; the uniform silhouette stays
    clearly the primary garment with zero added armor pieces」（172字元）
    縮成「no armor, uniform stays the primary garment」（46字元））。
  - `core-prompt.js` 的 `battleAcademyCore` 新增段落「Uniform Design
    Priority」從 3 句、約 620 字元的完整說明濃縮成 1 句、約 250 字元，
    保留「battle-ification≠armor-ification／優先順序／armor+cape預設關閉
    需明確選才出現／幻想細節強化不取代」四個核心點，拿掉重複的舉例句。
  - `waistData.highWaistTailoring` 保留「a leg-lengthening cut only, not
    a body-shape change」這句提醒（雖然簡化過但語意保留），因為這是
    owner 明確要求的「腰線輪廓是剪裁效果、不是身形調整」語意防呆，不能
    因為精簡就砍掉。
- **同步更新**：`scripts/audit-100x.mjs`/`scripts/build-prompt-preview.mjs`
  的 battleAcademy 鏡像邏輯同步套用相同的行合併與欄位精簡，確保鏡像跟
  真實頁面一致。四支驗證腳本全部重跑通過（`check-static` 全過、
  `validate-preset-refs` 16 個 `themeTemplates`＋13 個 `OUTFIT_COMBOS`
  0 issue、`audit-100x` 1300 次模擬 0 issue、`build-prompt-preview` 正常
  產出，人工檢視輸出樣本確認組裝順序與文字正確、字數確實下降）。

## 2026-07-31（五）　battle-academy.html：共用guard合併精簡＋姿勢/景別相容性規則＋燈光池清理

- owner 針對「隨機套用」三次結果並排比較後，提出更深入的技術分析：
  (1) 不該先砍身份鎖臉，該精簡的是中間 7 個高度重疊的共用技術核心；
  (2) 更關鍵的問題是「隨機模組互相衝突」——例如「雙手撐地跪姿」抽到
  「胸像近景」框，姿勢重點根本拍不到；(3) 燈光池混入了其他主題的殘留
  選項（沙漠宮帳異域女王、鬥魚水下、馬戲團等），跟日系校園戰鬥完全
  無關；(4) 結尾負面約束跟前面的共用負面約束大量重複，只留一份即可。
  提案結構：Identity Core / Human Rendering Core / School Battle Uniform
  Core / Random Design Result / Output+Negative 五大塊。
- **先查核再動手**：用 Explore agent 逐一查核四項主張，全部確認屬實，
  並發現一個關鍵架構細節——`anatomyGuard`/`poseNaturalityGuard`/
  `lightingConsistencyGuard` 目前讀的是 `sharedBattleAcademyCore.xxx`，
  實際內容來自 `core-prompt.js` 的 `humanCore`/`CORE_POSE_NATURALITY`/
  `CORE_LIGHTING_UNIFICATION`，而這三個常數是**幾乎全部 13 頁共用同一份**
  （每頁自己的 core 物件都寫 `anatomyGuard: humanCore` 這種寫法）；如果
  照 owner 原始建議直接合併這三個，會同時改動全站 13 頁的輸出。相對地
  `compositionGuard`/`colorTemperatureGuard`/`subjectIntegrationGuard`/
  `faceFillGuard` 是逐頁複製貼上的純本地 `const`，沒有經過
  `core-prompt.js`，改一頁不影響其他頁。專案自己的
  `docs/core-prompt-contract.md` 也明文要求：改 prompt 文字、改段落
  順序都要先取得 owner 同意，且要能講清楚「輸出是否完全相同」。用
  `AskUserQuestion` 請 owner 決定範圍（只改 battle-academy.html／全站
  13 頁一起做／先給改動方案對照再決定），owner 選「先只改
  battle-academy.html」。
- **7 個 guard 合併成 3 個**（範圍限定在 battle-academy.html 自己的
  `<script>` 內，`anatomyGuard`/`poseNaturalityGuard`/
  `lightingConsistencyGuard` 三個變數改成不再讀取
  `sharedBattleAcademyCore.xxx`、直接定義本地精簡版文字，**完全不動
  `core-prompt.js` 裡的 `humanCore`/`CORE_POSE_NATURALITY`/
  `CORE_LIGHTING_UNIFICATION` 這些跨頁共用常數本身**，所以其餘 12 頁
  的輸出逐字不變）：
  - 【真人骨架與姿勢】＝原本的「真人骨架系統」核心內容＋「姿勢自然性
    系統」合併，保留「頭部可自由轉動配合姿勢、但頸肩脊椎永遠跟隨頭部」
    這條核心因果邏輯。
  - 【鏡頭與人物比例】＝原本的「鏡頭重建系統」＋`compositionGuard`
    （原本叫 Commercial Composition Control）的技術規則部分合併，注意
    這裡合併的是「guard 規則文字」，使用者實際選的
    構圖值（如「人物置中主圖」）在 `generate()` 裡仍是獨立一行，不受影響。
  - 【真實質感與統一光影】＝原本的「真實膚質系統」＋「光線一致性系統」
    ＋「色溫統一系統」＋「人物融合系統」＋「高級補光系統」五個系統合併，
    這是最大瘦身點（原本 5 段各自獨立描述「臉不能單獨打光/單獨變白/
    單獨處理」，現在濃縮成 1 段講完同一件事）。
  - `generate()` 陣列同步移除 `poseNaturalityGuard`/`colorTemperatureGuard`/
    `subjectIntegrationGuard`/`faceFillGuard` 這 4 個已刪除的變數引用。
- **姿勢群組→景別相容性表**（新增 `POSE_GROUPS`/`POSE_GROUP_FRAMING`，
  只用在「隨機套用」按鈕，手動選擇維持完全自由不做硬性阻擋，跟
  `OUTFIT_COMBOS` 的既有設計哲學一致）：把 06 姿勢的 5 個既有分組（站姿
  16／坐姿與地面姿勢 16／手勢與細節 17／電影感動態戰鬥瞬間 16／隊長專屬
  5，共 70 個非 auto 姿勢）各自對應到合理的景別範圍——站姿→半身/七分身/
  全身/海報全景；坐姿與地面→七分身/全身/海報全景（排除近景類，因為要
  看到跪/躺/坐地的下半身姿態）；手勢與細節→胸像/近景/半身/七分身（排除
  全身類，因為這組的重點是手部/臉部特寫細節）；電影感動態戰鬥瞬間→
  七分身/全身/海報全景（排除近景類，因為要看到完整的動態張力）；隊長
  專屬→半身/七分身/全身。`applyBattleRandomSelection()` 改成先抽姿勢、
  再從對應的景別子集裡抽景別，而不是像以前一樣姿勢跟景別各自完全獨立
  抽籤。用一支一次性 Node 腳本（`vm` 解析 `POSE_GROUPS`/
  `POSE_GROUP_FRAMING` 物件字面量＋模擬 500 次隨機套用配對）驗證：70 個
  姿勢全數有對應分組、相容性表引用的景別 key 全部合法、0 個空候選池、
  500 次模擬配對 0 個不匹配。
- **燈光池清理**：`lightingData`（原本 57 個選項，是很久以前建頁時從
  其他主題頁複製貼上的共用大池子，`xianxia.html`/`isekai-fantasy.html`/
  `fantasy-fashion.html` 都有幾乎一模一樣的內容）砍掉 26 個跟日系校園
  戰鬥完全無關的殘留選項：沙漠宮帳異域女王
  (`desertGoldTentLight`)、鬥魚水下 (`bettaUnderwaterSpotlight`)、
  馬戲團 (`circusLanternGold`)、海底 (`underwaterSunbeam`)、糖果
  (`candyGlossLight`)、甜點美妝 (`dessertBeautyLight`)、櫻桃氣泡
  (`cherryPopLight`)、抹茶和菓子 (`matchaSoftLight`)、奶茶
  (`milkTeaAmberLight`)、玫瑰金穿戴科技 (`roseGoldTechLight`)、生物
  螢光保養 (`bioGlowSoftLight`)、香氛perfume (`moonSilverReflect`／
  `auroraPerfumeLight`)、水晶產品攝影 (`maglevCrystalRefraction`)、
  天空宮殿聖劍 (`goldenSkyTempleLight`)、太陽神殿
  (`solarTempleGold`)、大教堂羽翼 (`pearlCathedralBacklight`／
  `holyCathedralLight`／`cloudRiftHolyLight`)、宮廷燭光
  (`amethystCandleGlow`)、白色機甲 (`coldWhiteMechaLight`)、全息AI產品
  (`hologramScanLight`)、未來科技黑鏡 (`dataFlowBlueViolet`)、藍色
  音響科技 (`blueAudioLight`)、手機螢幕科技 (`silverScreenLight`)、
  機械翼 (`blueEnergyWingLight`)。**`palaceNightWarm`／`foxfireGold`／
  `moonGlassSparkle` 雖然名稱聽起來也偏其他主題，但因為被既有的
  「神樂儀式鈴舞獻禮」「神樂神社守護站姿」「白鷺披風法師詠唱」三個
  一鍵模板引用，予以保留**（避免刪除後模板套用失效），同時 UI 卡片與
  JS 資料物件同步移除（用一支一次性 Node 腳本，正則比對 key 名稱同時
  處理 HTML `<label class="card">` 區塊與 JS `key: '...'` 資料列）。
  `lightingData` 從 57 個選項降到 31 個。
- **結尾負面約束去重**：`generate()` 最後那行手動補的
  `'no random text, no watermark, no logo artifacts, no extra fingers,
  no deformed body, no distorted face'` 跟共用的 `CORE_NEGATIVE_PROMPT`
  （「No face swap/drift... No oversized head, extra limbs/arms/fingers,
  broken hands, warped anatomy, ... random text or watermark.」）大量
  重複，只留兩個真正沒講過的：`no logo artifacts, no distorted face`。
- **結果**：預覽輸出從上一輪的 9,152 字元再降到 6,645 字元（-27%），
  總計比重構剛完成時的 10,388 字元下降 36%。四支驗證腳本
  （`check-static`/`validate-preset-refs`/`audit-100x`/
  `build-prompt-preview`）的 exportExpression 同步拿掉已刪除的
  `poseNaturalityGuard`/`colorTemperatureGuard`/`subjectIntegrationGuard`/
  `faceFillGuard` 變數名，重跑全部通過（`validate-preset-refs` 16 個
  `themeTemplates`＋13 個 `OUTFIT_COMBOS` 0 issue，確認燈光池裁剪沒有
  誤刪任何模板引用的 key；`audit-100x` 1300 次模擬 0 issue）。

## 2026-07-31（六）　battle-academy.html：新增旗袍改良戰鬥風5套服裝＋高衩/鏤空剪裁方向

- owner 貼了一張黑紗紅花刺繡旗袍戰鬥風參考圖（削肩深V旗袍＋單肩護甲片＋
  符咒道具＋身後守護武者與鳳凰特效＋哥德教堂背景），要求先分析服裝本身
  再看能不能套進校服語彙。分析結論：(1) 護甲只在單肩局部出現，其餘全是
  布料——正好對應這次重構才做的 `Armor Mode: light`；(2) 黑紗透膚打底＋
  紅花纏枝刺繡＋金線滾邊是材質/圖紋語言，不是護甲；(3) 髮簪、大腿側
  飾品、符咒道具都是裝飾/道具而非武裝；(4) 圖中真正的「戰鬥感」來自
  後方的守護武者與法陣/鳳凰特效，不是女角色本人的服裝——呼應這次
  重構反覆強調的「衣服負責漂亮，武器與特效負責戰鬥」原則，只是語彙
  從校園偶像換成中式仙俠（符咒、法陣、鳳凰）。owner 確認這套分析後，
  要求套進 5 種校服語彙（水手服/和服/學生服/高校服/白襯衫服）並各給
  1 套方案，先給出設計說明（不寫代碼），owner 確認「1-5方案都收錄」，
  並加碼一個新的剪裁方向：「別包得緊緊的，能V就V，腰能露就露...和大長腿」。
- **剪裁尺度落地方式**：owner 問是否要另外加一個維度，考量到目前 9
  個維度的模組化架構已經算複雜，另開一個「裸露強度」維度會讓 UI 更
  臃腫，決定改成**把剪裁尺度直接寫進這 5 套新服裝本身的描述文字**
  （deep-V neckline / one bare shoulder / bare-skin waist cutout /
  high side slit baring the leg），不影響既有 9 套素面制服選項，也不
  新增 UI 區塊。尺度拿捏比照 `summer-island.html` 下架的教訓（owner
  當時因為生圖模型反覆判定「可能違反裸露/性/色情內容防範機制」而放棄
  該主題）——抓在「時尚雜誌級削肩/深V/高衩」，不做泳裝或更裸露的
  描述，降低重蹈覆轍的風險。
- **新增內容**：
  - 05 上身新增 5 項（`sailorSheerEmbroideredTop` 黑紗刺繡水手上衣、
    `kimonoSheerEmbroideredTop` 黑紗刺繡和風上衣、`gakuranOpenSheerLayered`
    敞領學生服疊搭、`blazerOpenSheerLayered` 敞領外套疊搭、
    `shirtOpenSheerLayered` 敞領白襯衫疊搭——後三者是「制服外套/襯衫
    敞開穿、內搭黑紗刺繡削肩打底」的疊搭描述，因為詰襟/西裝外套/正式
    襯衫這幾種版型本身較硬挺，直接改削肩深V不合理，改成「外層制服敞開
    ＋內層黑紗打底」的層次感更符合這幾種制服的材質特性）。
  - 07 下身新增 1 項 `highSlitLongSkirt`（旗袍靈感側邊高衩長裙）。
  - 06 腰線新增 1 項 `cutoutWaistWrap`（貼身腰封＋腰側露膚鏤空）。
  - 09 配件新增 1 項 `talismanChargeAccent`（手持一疊硃砂符咒），呼應
    參考圖的符咒道具。
  - `OUTFIT_COMBOS` 新增 5 組相容組合，upperBody 分別搭配 `highSlitLongSkirt`
    與各自合適的腰線（水手→鏤空腰線、和風→帶結腰線、學生服→高腰剪裁、
    外套→窄腰帶、襯衫→綁繩腰線）。
  - 00 一鍵模板新增 5 組，各自對應色系/氣質契合的學校：
    `suzakuSailorTalismanKneel`（朱雀水手符咒跪姿，黑+深緋紅+金配色跟
    參考圖最接近）、`kaguraKimonoTalismanRite`（神樂和風符咒儀式，唯一
    開啟披風的新模板，呼應和風儀式感）、`sakuraGakuranLayeredBloom`
    （櫻華敞領學生服疊搭，配劍鞘+劍氣特效+櫻花決戰背景）、
    `seiranBlazerLayeredPoise`（青嵐敞領外套優雅，冷色調對比黑紗紅花
    更搶眼）、`shirasagiShirtLayeredElegance`（白鷺敞領白襯衫優雅，
    白色系跟校色同調）。模板總數 16→21，`OUTFIT_COMBOS` 13→18。
- **驗證**：四支驗證腳本重跑全過（`check-static` 全過；
  `validate-preset-refs` 21 個 `themeTemplates`＋18 組 `OUTFIT_COMBOS`
  0 issue；`audit-100x` 1300 次模擬 0 issue，新增的 upperBody/waist/
  lower/accessory 選項自動被動態讀取的隨機池吃進去，不需要改腳本結構）；
  另外寫一支一次性 Node 腳本用 `vm` 模擬 `suzakuSailorTalismanKneel`
  模板的完整組裝邏輯，人工檢視輸出確認「school identity/appearance
  form（含新的深V/鏤空/高衩描述）/combat styling(light)/symbol focus/
  accessory(符咒)/fantasy detail」組裝順序與文字正確、無 undefined 洩漏。

## 2026-07-31（七）　battle-academy.html：修正新增內容跑題問題（旗袍字樣／非校園背景）

- owner 看完上一版新增內容後提醒：「因為是制服學園，衣服和背景盡量不要
  跳脫制服和學園的範圍」。逐項檢查後修正兩處：
  - `highSlitLongSkirt`（高衩長裙）的英文 prompt 文字原本寫
    `'long skirt with a high side slit baring the leg, elegant
    qipao-inspired silhouette'`，中文卡片說明也寫「旗袍靈感側邊高衩
    長裙」——「qipao-inspired」這個詞會把生圖模型的聯想直接拉到旗袍
    這種完全不同的服裝品類，不是「制服的高衩改良」。改成
    `'long academy skirt with a high side slit baring the leg,
    elegant tailored silhouette'`，中文改成「學院長裙側邊改良高衩
    剪裁」，把落點釘回「這仍然是一件學院裙，只是側邊改衩」。
  - 上一版新增的 5 個一鍵模板裡，`suzakuSailorTalismanKneel`（朱雀水手
    符咒跪姿）背景選了 `sealCircleAbstractBackdrop`（抽象靈力背景／
    咒印法陣虛空棚拍），`kaguraKimonoTalismanRite`（神樂和風符咒儀式）
    背景選了 `sakuraPetalStudioBackdrop`（櫻花瓣棚拍背景）——這兩個都
    屬於「抽象靈力背景」分類，是棚拍/虛空背景，不是真正的校園場景，
    跟「制服學園」主題脫節。改成 `schoolGateSiege`（校門對峙戰場，呼應
    跪地施法的戲劇張力）／`academyCourtyardSunset`（學院中庭夕陽，呼應
    儀式感的溫暖光線），兩者都屬於既有的「校園決戰場景」／「校園日常
    場景」分類，確保背景仍然讀得出是校園。另外 3 個模板
    （`sakuraGakuranLayeredBloom`／`seiranBlazerLayeredPoise`／
    `shirasagiShirtLayeredElegance`）原本就用校園背景，不需要改。
  - 其餘上身/腰線/配件文字檢查後確認沒有類似問題：5 個新上身選項都以
    既有制服 archetype 開頭（sailor-collar／kimono-inspired／gakuran
    jacket／blazer／shirt），沒有出現脫離制服語彙的用詞；符咒配件與
    法陣/靈氣類幻想細節本來就是這頁「異能/魔法系學園」既有分類的一部分
    （`magicalSealCircleAwaken` 模板早就用過 `glowingSealCircle` 搭配
    `sealCircleAbstractBackdrop`），不是這次新增才出現的跑題內容，予以
    保留。
- 四支驗證腳本重跑全過（`check-static`/`validate-preset-refs`
  21個模板+18組組合0issue/`audit-100x` 1300次模擬0issue/
  `build-prompt-preview` 正常產出）。

## 2026-07-31（八）　battle-academy.html：修正「敞領疊搭」出圖尺度過大問題

- owner 實測「櫻華敞領疊搭綻放」「青嵐敞領外套優雅」「白鷺敞領襯衫
  優雅」這三個模板後回報：出圖結果是「上衣鈕扣全開，基本上是完全的
  胸罩外露」，跟要的「性感、微微露，不是完全露內衣」方向不符。owner
  給了明確的替代描述方向：「可以上衣鈕扣上面少扣2~3個，微露胸部深V」
  或「身穿上衣沒胸罩的方式」。
- **根因判斷**：三個上身選項（`gakuranOpenSheerLayered`／
  `blazerOpenSheerLayered`／`shirtOpenSheerLayered`）原本的英文描述是
  「jacket worn open over a sheer black lace red-floral-embroidered
  underlayer, deep-V neckline, one bare shoulder」——「worn open over
  ... underlayer」這個措辭對生圖模型來說很容易被放大解讀成「外套完全
  敞開＋底下是一件獨立的內搭（甚至被當成內衣）」，這比原本設計意圖
  （只是若隱若現的深V層次）誇張得多，這也是為什麼上一輪的「不要跳脫
  制服/校園範圍」修正只處理了文字語意跑題，但沒有預先抓到這個「敞開
  程度被誇大」的獨立問題——兩者是不同性質的落差，前者是「說錯詞彙
  導向錯誤品類」，後者是「詞彙本身的曝露程度被生圖模型過度放大」。
- **修正**：三個選項的英文描述改寫成「with only the top two or three
  buttons undone, a subtle deep-V opening at the collarbone, smooth
  bare skin with no visible undergarment, jacket/blazer/shirt
  otherwise fully closed and worn normally」——拿掉「worn open over an
  underlayer」這個容易被誇大的框架，改成「明確只解開上方2-3顆釦子、
  鎖骨處微露深V、沒有內衣痕跡、其餘部分維持正常穿著」的具體限定描述；
  中文卡片說明同步從「敞開穿＋內搭打底」改成「上方鈕扣微解2-3顆＋微露
  鎖骨深V＋不露內衣」，UI 卡片名稱也從「敞領學生服疊搭」等改成「微解領
  學生服」等，更精準對應新的曝露尺度。
- **教訓**：這是本輪第二次因為 owner 實際出圖測試才發現的落差（上一次
  是模板背景/服裝語彙跑題出校園範圍，這次是曝露尺度被生圖模型誇大），
  說明「文字描述在人類讀起來合理」不代表「生圖模型解讀出來的畫面合理」，
  之後新增涉及「open/layered/underlayer/敞開/疊搭」這類措辭的服裝描述，
  應該預設生圖模型會往更暴露的方向解讀，寫得更具體保守（例如明確講
  「只解開幾顆釦子」而不是籠統講「敞開穿」），比事後再修正更有效率。
- 四支驗證腳本重跑全過（`check-static`/`validate-preset-refs` 21個模板
  +18組組合0issue/`audit-100x` 1300次模擬0issue）。

## 2026-08-01（一）　battle-academy.html：披風完全移除＋裙裝禁止內搭褲型（限定本頁）

- owner 提出兩條「制服戰鬥學園限定」規則：(1) 裙裝不可以自動加短褲／
  安全褲／熱褲／褲裙這類內搭（「說是裙子了啊」——owner 選了裙子，生圖
  結果卻常見加一層褲子遮擋，等於默默改成別的服裝）；(2) 披風預設完全
  關閉，而且隨機也不能抽到（「不要披風」）。
- **披風移除**：這次選擇不是「維持關閉但保留選項」，而是把 Cape Mode
  整個維度從頁面拿掉，因為只要選項還在，manual 選擇跟未來擴充都有機會
  重新出現披風，跟 owner「不要披風」的明確語氣不符。具體改動：
  - HTML：`section-battlemode` 拿掉整個 Cape Mode 卡片群組，section
    標題從「裝甲與披風強度」改回「裝甲強度」，hint 文字加一句「這頁固定
    不使用披風／斗篷（不論手動或隨機都不會出現）」。
  - JS：`capeModeData`（含 off/on 兩個選項）改成單一常數
    `CAPE_TEXT_OFF = 'no cape, no cloak'`；`generate()` 的 `capeText`
    直接固定引用這個常數，不再讀取任何 DOM 選項；`applyThemeTemplate`／
    `applyBattleRandomSelection` 的欄位清單都拿掉 `capeMode`；21 個
    `themeTemplates` 物件裡的 `capeMode: 'xxx'` 欄位全部移除（含原本
    3 個設 `capeMode: 'on'` 的模板：神樂儀式鈴舞獻禮／白鷺披風法師詠唱／
    神樂和風符咒儀式，連帶把中文卡片名稱與說明裡的「披風」字樣拿掉，
    「白鷺披風法師詠唱」改名「白鷺法師詠唱」）。
  - `core-prompt.js` 的 `battleAcademyCore`（只有這頁在用，改動不影響
    其他 12 頁）Style Scope Rule 裡「armor and cape stay OFF by default
    and only appear when explicitly selected」改成「armor stays OFF by
    default and only appears when explicitly selected. No cape or cloak
    is ever added.」，因為披風已經沒有「explicitly selected」這個可能性
    了，原句會誤導。
  - 06 姿勢裡的 `cape_wind`（披風揚起站姿）**刻意不改**：這是全站共用
    姿勢庫的一部分，文字本身寫「cape or dress caught in wind」（披風
    「或」裙擺），沒有強制一定要出現披風，屬於可以自行用裙擺/衣物詮釋
    的模糊姿勢描述，跟 Cape Mode 這個獨立系統無關，動它會擴大改動範圍
    到共用姿勢庫，不在這次的範圍內。
- **裙裝禁止內搭褲型**：在 `generate()` 的負面約束區塊新增一行
  `'the lower body garment stays a genuine skirt with nothing worn
  underneath it — no shorts, no safety shorts, no biker shorts, no hot
  pants, no culotte layer added beneath the skirt,'`，固定加在每次生成
  的咒語裡（不特別判斷是否選到裙型下身，因為就算選到袴褲/寬褲裙這類
  本來就是褲裝的選項，這句話也不衝突，維持簡單邏輯不用另外分支判斷）。
- 四支驗證腳本全部同步更新（`validate-preset-refs.mjs` 拿掉
  `capeMode: liveRadioValues(...)`；`audit-100x.mjs`／
  `build-prompt-preview.mjs` 的 exportExpression 把 `capeModeData` 換成
  `CAPE_TEXT_OFF`，選取/模擬邏輯拿掉 `capeMode` 相關欄位，兩支腳本的
  組裝陣列也同步加上新的裙裝負面約束行）重跑全過（`check-static` 全過、
  `validate-preset-refs` 21 個模板 0 issue、`audit-100x` 1300 次模擬
  0 issue、`build-prompt-preview` 正常產出，人工檢視輸出樣本確認
  `combat styling` 那行固定顯示 `no cape, no cloak`、負面約束區塊確實
  多了裙裝限定那句）。

## 2026-08-01（二）　battle-academy.html：新增「服裝改造核心」（Garment Detail Core）

- owner 花了約 10 小時在另一個 AI 對話裡發展出一套構想，貼過來要求先
  「分析可行性」：把「制服局部結構化改造」拆成 Layer（改造強度）× 部位
  （改哪裡）× 設計（怎麼改）× 隨機，讓同一所學校、同一套核心制服能大量
  產生視覺不同的變體，而不必像這幾輪一樣每次都手動新增一個具名的新
  服裝組合。owner 原始構想是 5 個部位（胸口/肩部/上臂/腰側/裙身）各 9
  選 1（含無修改），Layer 從 1-9 九級或 3/6/9 三級或 0/3/6/9 四級都考慮
  過，最後定案 0/3/6/9 四級（Layer 0 = 原始版全無修改）。
- **可行性分析**（先分析、不直接實作）：技術上可行，跟當天稍早才做的
  `POSE_GROUPS`/`POSE_GROUP_FRAMING`「先抽一個、再從相容子集抽另一個」
  邏輯是同一種模式。但指出兩個風險：(1) 5 部位 × 9 選 1 = 59,049 種
  組合，Layer 9 時最多同時命中 5 個部位，各部位設計風格互相不保證搭配，
  容易變成「隨機=無規則」的鏤空大拼盤，跟這幾輪剛建立的 OUTFIT_COMBOS
  相容性把關精神衝突；(2) 5 部位同時大幅改造容易讓詰襟外套這類制服
  archetype 認不出原本版型，跟同一批修正裡才寫進 core-prompt.js 的
  「archetype 必須維持可辨識」原則正面衝突。建議：先縮小到 2-3 個部位、
  Layer 0/3/6/9 定案沒有意見、先不做部位間相容性表（範圍已經比 5 部位
  小很多，先上線觀察）、這個功能不要塞進今天已經很大量的既有改動、先做
  小範圍原型驗證可行再考慮擴大或搬去其他頁面。owner 採納，選定 3 個
  部位（胸口／腰側／肩部），確認可以開始實作，並提出把這套機制做成
  「服裝改造核心」（Garment Detail Core）——類似鎖臉核心的獨立模組概念
  （owner 原話：「鎖臉核心 服裝改造核心」，確認要用這個命名），之後驗證
  有效可以套用到仙俠頁。
- **實作內容**：
  - **UI**：新增「11 服裝改造強度」section（原本的 11-17 依序往後平移
    成 12-18，CSS order 同步調整）。內含 Layer 選單（`garmentLayer`：
    layer0/layer3/layer6/layer9/random 共 5 選 1，預設 layer0）與三組
    部位選單（`chestDetail`／`waistSideDetail`／`shoulderDetail`，各
    9 選 1，預設 none／無修改，選項內容沿用 owner 原始草案的中文命名：
    胸口 V形開叉/弧形鏤空/菱形鏤空/水滴鏤空/幾何鏤空/交叉帶/蕾絲拼接/
    不對稱切割；腰側 櫻花幾何鏤空/弧形鏤空/菱形鏤空/側腰開窗/交叉束帶/
    縱向切割/蕾絲拼接/不對稱切割；肩部 弧形鏤空/露肩切割/單肩結構/
    幾何鏤空/帶狀連接/蕾絲肩片/分離肩片/不對稱肩部）。
  - **資料結構**：`chestDetailData`／`waistSideDetailData`／
    `shoulderDetailData` 三個物件（英文 prompt 文字，`none` 對應空字串）
    ＋ `GARMENT_DETAIL_LAYER_ZONES = { layer0:0, layer3:1, layer6:2,
    layer9:3 }` 對照表（Layer→隨機套用時要命中幾個部位）。
  - **`generate()` 組裝**：在 appearance form 之後、combat styling 之前
    新增一行 `garment surface detail: {已選部位的設計文字}, — structural
    surface accents only, the garment silhouette and archetype from the
    appearance form above stay unchanged,`；三個部位裡選了「無修改」的
    直接不輸出該部位描述（用 `.filter(Boolean)` 拿掉），全部無修改時
    整行都不出現。防呆句明確重申「這是表面結構細節，不是重新設計整件
    制服」，呼應之前定的 archetype 可辨識原則。
  - **`applyBattleRandomSelection()` 隨機邏輯**（這是這次的核心）：讀取
    目前 `garmentLayer` 選值，若是 `random` 就先從 layer0/3/6/9 四個裡
    抽一個當作「有效 Layer」（並把選單同步顯示成抽到的那個，讓使用者
    看得到實際套用的強度）；接著檢查三個部位「目前已經是非 none」的
    有幾個（視為使用者手動設定過、隨機套用不能覆蓋），跟「目前是 none」
    的有幾個（可被隨機填入的候選池）；有效 Layer 對照出的目標命中數
    減掉已經手動設定的數量、再跟候選池大小取最小值，得到這次要隨機填入
    幾個部位；從候選池隨機挑出這些部位，各自從該部位 9 選 1（排除
    none）裡再隨機挑一個設計。這個邏輯完全對應 owner 說的「手動選了
    哪個部位，隨機套用不會覆蓋掉」——用一支一次性 Node 腳本模擬 4 種
    情境（全部 none+Layer9／已手動設 1 個+Layer9／已手動設 2 個+Layer3
    超過目標／Layer=random）各跑 200 次，0 issue，確認手動保留、目標
    命中數、random 解析都正確。
  - **`applyThemeTemplate()`**：套用一鍵模板時，服裝改造核心的 4 個
    欄位（Layer＋3 部位）強制重置回 layer0／全部 none，因為 21 個既有
    模板本來就沒有規劃這幾個新欄位，避免殘留上一次的鏤空設定跟新套用
    的模板混在一起變得不協調（這次刻意不修改任何既有模板去搭配新的
    改造欄位，維持既有模板穩定）。
  - `refreshCards()` 是通用邏輯（掃描所有 `[data-choice]` 群組），新的
    4 個選單群組都掛了 `data-choice` 屬性，不需要額外改這支函式。
- **驗證**：`validate-preset-refs.mjs` 不需要改（21 個既有模板都沒有用
  到新欄位，沒有新的參照需要驗證）；`audit-100x.mjs`／
  `build-prompt-preview.mjs` 的 exportExpression 與組裝邏輯同步加入
  三個新資料物件與 `garmentDetailText` 組裝，四支腳本重跑全過
  （`check-static` 全過、`validate-preset-refs` 21 模板/18 組合 0
  issue、`audit-100x` 1300 次模擬 0 issue、`build-prompt-preview` 正常
  產出，人工檢視輸出樣本確認 `garment surface detail` 那行組裝順序與
  文字正確）。
- **後續**：這是「服裝改造核心」的 v1（3 部位，無跨部位相容性表），
  owner 之後如果覺得 3 部位效果好，下一步是考慮要不要擴大部位數量、
  加跨部位風格家族配對，以及把 `GARMENT_DETAIL_LAYER_ZONES` 對照表和
  `applyBattleRandomSelection()` 裡的部位隨機邏輯複製到 `xianxia.html`，
  換一份仙俠專屬的部位/設計詞彙表（例如「雲紋鏤空／流蘇垂墜／飄帶結構」
  這類仙俠語彙，取代校服的「V形開叉／幾何鏤空」語彙），核心演算法不用
  重寫。

## 2026-08-01（三）　battle-academy.html：04 學校身份加開 3 所＋自填，11 服裝改造核心加自填

- owner 要求兩件事：(1) 04 學校身份再多加幾組學校，並加自填；(2) 11
  服裝改造強度的三個部位細項也加自填。
- **新增 3 所學校**：既有 6 所裡朱雀學院（黑+深緋紅+金，南方朱雀）已經
  存在，這次補上四神剩下三個方位，湊成完整的四神主題系統：
  `seiryuAcademy` 青龍學院（翡翠綠+墨藍+銀，東方青龍，靈動生機東方
  學院）、`byakkoAcademy` 白虎學院（銀白+鋼灰+銀，西方白虎，剛毅肅殺
  武道學院）、`genbuAcademy` 玄武學院（墨黑+深靛+古銅，北方玄武，沉穩
  古老北境學院）。學校總數 6→9。
- **04 學校身份自填**（`customSchool`）：`generate()` 新增
  `schoolPromptText`／`schoolColorNote` 兩個變數——填了自填欄位就用
  `custom school identity only: ...; do not include or blend any
  preset school identity option` 取代 `schoolInfo.prompt`，色彩補充
  的 fallback（`schoolInfo.colorNote`）同時歸零改用空字串，避免自填了
  新學校卻在色票那行意外冒出某個預設學校的配色；如果使用者填自填欄位
  但沒填 08 光影色彩區塊的「色彩補充」，`color palette:` 整行直接不
  輸出（原本永遠輸出、只是內容可能是預設學校色票，這次順手把這行也
  改成有內容才輸出，跟其他自填欄位的處理方式一致）。
- **11 服裝改造核心三個部位自填**（`customChestDetail`／
  `customWaistSideDetail`／`customShoulderDetail`）：跟其他部位一樣
  用「custom X surface detail only: ...」格式取代該部位的預設選項
  文字，三個欄位各自獨立，互不影響。
- **清單同步**：`applyThemeTemplate()`／`applyBattleRandomSelection()`
  的自填欄位清空清單、底部的 `input`/`change` 監聽註冊清單，都補上新增
  的 4 個自填欄位 id（`customSchool`／`customChestDetail`／
  `customWaistSideDetail`／`customShoulderDetail`），沿用既有慣例（一鍵
  模板與隨機套用都會清空自填欄位，不會殘留舊字串跟新套用的內容混在
  一起）；`refreshCards()` 是掃描 `[data-choice]`／`[data-custom-choice]`
  的通用邏輯，新欄位掛好對應屬性後不用改這支函式。
- **驗證**：`validate-preset-refs.mjs` 不需要改（既有 21 個模板/18 組
  `OUTFIT_COMBOS` 都沒有用到新學校或部位自填欄位，`fieldLive.school`
  是即時掃 DOM，新增的 3 所學校自動被涵蓋進驗證池）；`audit-100x.mjs`／
  `build-prompt-preview.mjs` 同步加入 `customSchool` 與三個部位自填的
  模擬/範例邏輯，四支腳本重跑全過（`check-static` 全過、
  `validate-preset-refs` 21 模板/18 組合 0 issue、`audit-100x` 1300 次
  模擬 0 issue、`build-prompt-preview` 正常產出，另外手動模擬自填覆蓋
  邏輯確認輸出格式正確）。

## 2026-08-01（四）　battle-academy.html：一鍵主題模板同步新增3組（新學校＋服裝改造核心示範）

- owner 要求「一鍵主題模板 請同步更新」——上一輪新增了 3 所學校（青龍/
  白虎/玄武）跟服裝改造核心的自填欄位，但既有 21 個模板都還只涵蓋原本
  6 所學校，也都沒有示範新的部位細節功能，所以新增 3 組模板，一校一組，
  順便讓其中 2 組示範服裝改造核心：
  - `seiryuDragonWindDojo`（青龍御風劍術）：青龍學院、學院外套＋合身
    腰線＋及膝百褶裙、劍鞘配件、氣流亂流動態、學校屋頂決戰。服裝改造
    核心維持 Layer 0（三部位皆無修改），當作新學校的乾淨基準示範。
  - `byakkoTigerDojoFocus`（白虎道場專注）：白虎學院、詰襟學生服＋高腰
    剪裁＋袴褲（社團活動制服類型，呼應白虎剛毅武道學院的定位）、腰側
    縱向切割（示範服裝改造核心）、火花衝擊閃光、劍道場內部。
  - `genbuAncientGuardianThrone`（玄武古老守護寶座）：玄武學院、現代
    和風上衣＋帶結腰線＋長版百褶裙（儀式制服類型）、肩部蕾絲肩片（示範
    服裝改造核心）、符咒配件、發光咒印法陣、雙靈守護寶座姿、現代學院
    圖書館（刻意選校園場景而非抽象背景，呼應「不要跳脫制服和學園範圍」
    那次的教訓）。
- **`applyThemeTemplate()` 邏輯調整**：原本套用模板一律把服裝改造核心
  的三個部位強制重置回 `none`（因為當時 21 個模板都沒規劃這幾個欄位）。
  這次改成 `setRadioValue('chestDetail', preset.chestDetail || 'none')`
  這種寫法——模板如果有指定部位細節就套用，沒指定的（絕大多數既有
  模板）維持原本「重置回無修改」的行為，兩種模板可以並存不衝突。
  `garmentLayer` 仍然固定重置回 `layer0`（Layer 只是給「隨機套用」用的
  強度旋鈕，一鍵模板不需要顯示 Layer 選了什麼，模板裡是否有部位細節
  已經直接反映在畫面上）。
- **驗證補強**：順手發現 `validate-preset-refs.mjs` 的 battle-academy
  區塊當初沒有把 `chestDetail`/`waistSideDetail`/`shoulderDetail` 加進
  `fieldLive`，導致這兩個新模板裡用到的部位欄位值雖然沒問題，但實際上
  完全沒被這支腳本驗證過（`checkObject` 只檢查 `fieldLive` 裡存在的
  欄位名稱，不存在的欄位會被靜默略過、不是驗證通過而是根本沒驗證）。
  補上這三個欄位後重跑，24 個模板全數 0 issue，這次才是真正驗證過。
  四支驗證腳本（`check-static`/`validate-preset-refs`/`audit-100x`/
  `build-prompt-preview`）全部重跑通過，另外手動模擬「白虎道場專注」
  模板的完整組裝邏輯，確認 `school identity`/`appearance form`/
  `garment surface detail`/`combat styling` 四行文字與順序正確。模板
  總數 21→24。

## 2026-08-01（五）　服裝改造核心移植到 xianxia／anime-character／isekai-fantasy／kpop-idol

- owner 問「中式仙俠／動漫人物／日式異世界／韓系氣質偶像風也可以用服裝
  改造核心嗎」。先確認可行性：這四頁跟 battle-academy.html 是同一批「四頁
  新潮/美人/漂亮時尚頁」＋「四大提案方案」共同祖先（都複製自
  fantasy-fashion.html 系），section 排序/編號、`applyThemeTemplate`/
  `applyXxxRandomSelection`/`generate()` 的骨架逐行相同，battle-academy
  已經驗證過的 Layer 隨機演算法（4 情境×200 次模擬 0 issue）可以直接
  複製，不需要重新設計或重新驗證演算法本身。用 `AskUserQuestion` 問排程
  （逐頁上線 vs 一次全上），owner 選「四頁一起上（同一輪全部做完）」。
- **對四頁分別執行同一套機械化流程**（跟 battle-academy 的實作完全一致，
  只換每頁自己的鏤空/剪裁語彙）：
  1. CSS：插入 `.section-garmentdetail{order:6;}`，原本 `.section-pose`
     （6）到 `.section-output`（12）依序順移一格變成 7～13。
  2. 逐行重編 7 個 `<div class="section-label">` 文字（06~12 → 07~13），
     用行號索引的一次性 Node 腳本處理（不能用簡單字串替換，因為新舊
     數字會互相碰撞）。
  3. 在 `section-material` 結束、`section-pose` 開始之間插入新的「06
     服裝改造核心」HTML 區塊：Layer 5 選項（0/3/6/9/隨機）＋ 3 個部位
     （胸口/腰側/肩部）各 9 選 1（含 none）＋各自一個自填欄位。四頁語彙：
     - xianxia：雲紋鏤空/如意鏤空/水滴鏤空/水袖交疊等仙俠剪裁詞彙。
     - anime-character：魔法陣鏤空/星形鏤空/緞帶蝴蝶結/發光符文滾邊等
       動漫插畫詞彙。
     - isekai-fantasy：V形開叉/寶石鑲嵌/精靈蕾絲拼接/符文發光滾邊/
       羽毛裝飾等異世界奇幻詞彙。
     - kpop-idol：V形開叉/水鑽網紗拼接/幾何鏤空/鏈條肩帶/單肩帶結構等
       時尚舞台詞彙。
  4. 在 `materialData` 結束、`garmentData` 開始之間插入
     `chestDetailData`/`waistSideDetailData`/`shoulderDetailData`/
     `GARMENT_DETAIL_LAYER_ZONES`——結構與 battle-academy 逐字相同，只換
     英文 prompt 文字內容。
  5. `applyThemeTemplate()`：套用模板時 `garmentLayer` 固定重置回
     `layer0`，三個部位用 `preset.chestDetail || 'none'` 寫法（模板有
     指定就套用、沒指定維持重置為 none），四頁既有的 16 個模板都還沒
     規劃這幾個新欄位，所以套用後全部維持 none，沒有破壞既有模板輸出。
  6. 隨機套用函式（`applyFantasyRandomSelection`／`applyAnimeRandomSelection`
     ／`applyIsekaiRandomSelection`／`applyIdolRandomSelection`，各頁
     沿用各自原本命名）：插入跟 battle-academy 完全相同的 Layer 驅動部位
     隨機邏輯——`random` Layer 會先解析成實際的 0/3/6/9，已手動設定過
     （非 none）的部位不會被隨機覆蓋，只有還在 none 的部位才進入這次
     隨機候選池，`zonesToFill = max(0, min(目標數-已手動數, 可填數))`。
  7. `generate()`：插入 `chestDetailText`/`waistSideDetailText`/
     `shoulderDetailText`（各自的自填欄位優先於預設值）與組合出的
     `garmentDetailText`，插在 `'appearance form: ' + garmentText + ','`
     行後面、`'theme material and art system: ...'` 行之前；三個部位都是
     none 且無自填時 `garmentDetailText` 是空字串，靠 `.filter(Boolean)`
     自動從輸出裡消失。
  8. 補上 3 個新自填欄位 id 到底部 `input`/`change` 事件監聽註冊清單。
- **驗證**：每頁做完後先用 Node 腳本抽出所有 `<script>` 內容跑
  `new Function(...)` 語法檢查，通過才繼續。四支驗證腳本
  （`check-static.mjs`/`audit-100x.mjs`/`validate-preset-refs.mjs`/
  `build-prompt-preview.mjs`）逐頁同步更新：`exportExpression` 加
  `chestDetailData, waistSideDetailData, shoulderDetailData`；`pools`/
  `sel`（`audit-100x.mjs`）與 `selection`（`build-prompt-preview.mjs`）
  加對應的部位欄位與自填樣本；文字組裝邏輯插入 `garmentDetailText,`。
  四頁全部做完後一次跑全部四支腳本（涵蓋全站 13 頁）：`check-static`
  全過、`audit-100x` 累計 1300 次模擬（13頁×100）0 issue、
  `validate-preset-refs` 0 issue（四頁本輪未新增模板，沒有新的模板
  部位參照需要驗證）、`build-prompt-preview` 四頁預覽輸出都正確含
  `garment surface detail: ...` 行（逐一 grep 確認：xianxia 雲紋+小
  披肩、anime-character 魔法陣+緞帶蝴蝶結、isekai-fantasy 寶石鑲嵌+
  小披肩、kpop-idol 水鑽網紗+鏈條肩帶）。
- **踩坑教訓（記錄供之後參考）**：用 `Bash` 工具執行
  `node -e "...含反引號 template literal 的 JS..."` 時，bash 會把雙引號
  字串內的反引號當成 command substitution 處理，即使外層是雙引號也一樣，
  導致反引號包住的內容被靜默替換成（通常是空字串的）指令執行結果。
  這在改 `build-prompt-preview.mjs` 的 `generateAnime()` 函式時發生過：
  3 行 `` `custom X surface detail only: ${...}` `` 的反引號段落內容整段
  消失，變成 `selection.customChestDetail ?  : data.chestDetailData[...]`
  這種殘缺程式碼，靠事後 `grep`/`sed -n` 比對才發現，改用 `Edit` 工具
  直接修復。**之後任何含反引號的 JS 片段一律用 `Edit` 工具直接編輯，
  不透過 `Bash`/`node -e`**；不含反引號的純轉換腳本（例如行號索引的
  section-label 重編號）仍可安全用 `Bash`/`node -e`。
- 本輪只是把「能力」接上四頁，四頁既有的 16 個一鍵模板都沒有新增、也
  沒有示範新的部位細節（跟 battle-academy 那次不同，battle-academy 是
  先做完核心才另外追加 3 組示範模板）；如果之後 owner 想看示範效果，
  下一步可以在四頁裡各挑 1-2 組模板追加部位細節，比照 battle-academy
  的 `byakkoTigerDojoFocus`/`genbuAncientGuardianThrone` 做法。

## 2026-08-01（六）　xianxia.html：04 服裝拿掉「法袍道服」道士分類，換成「仙靈妖精裝束」

- owner 貼出「法袍道服」分類的 5 個選項（八卦道袍/五行法袍/煉丹道姑服/
  符紋道長袍/藏經閣書卷袍）並明確表示：「道士類的就不要了，我其實想要的
  是美美的仙女俠女妖狐妖精之類的」。
- **盤點既有分類，確認缺口在哪**：xianxia.html 04 服裝共 7 組——仙門正裝
  基礎、古典勁裝與遊俠、法袍道服（要移除）、婚嫁儀式、戰鬥仙裝與聖器化、
  妖靈與靈獸化裝束（已含 foxSpiritRobe/nineTailRobe 等狐靈選項）、樂舞伎
  與飛天樂舞。owner 提到的「妖狐」「俠女」其實已經有分類涵蓋，真正缺的是
  「仙女／妖精」這種空靈輕盈的美型，所以新分類鎖定這個方向，避免跟既有
  分類語意重疊。
- **新增「✦ 仙靈妖精裝束」5 個選項**（取代原「✦ 法袍道服」）：
  - `flowerSpiritPetalDress`（花靈瓣裙）：花瓣層疊薄紗、輕盈精靈輪廓
  - `moonSpiritGauzeRobe`（月靈綃衣）：月光薄紗曳地、銀線滾邊、月靈仙子輪廓
  - `butterflySpriteGown`（蝶靈羽紗裙）：蝶翼薄紗袖、七彩滾邊、俏皮精靈輪廓
  - `rosyCloudFairyDress`（霞雲輕紗裙）：漸層雲霞紗裙、飄逸仙子輪廓
  - `charmSpriteTrailDress`（精怪綴飾裙）：綴飾垂鈴、俏皮精怪輪廓
  英文 prompt 沿用既有 `garmentData` 條目的寫法慣例（"...silhouette" 結尾、
  描述剪裁細節而非角色設定），跟同頁其他服裝條目風格一致。`fiveElementRobe`
  沒有被任何一鍵模板引用，直接移除不留殘值；其餘 4 個舊值（`baguaRobe`/
  `alchemistRobe`/`talismanPriestRobe`/`celestialScholarRobe`）各被一組
  模板引用，需要一併處理（見下）。
- **重新設計 4 組引用到舊服裝值的一鍵模板**（沒有留舊 key 指向新服裝這種
  半吊子做法，因為這 4 組模板的中文卡片名稱/描述本身就是道士向文案，例如
  「煉丹道姑」「符紙夜巡」，光換服裝值不換文案會變成「新服裝、舊道士標題」
  的錯位）：
  - `daoistAlchemist`（煉丹道姑）→ `flowerSpiritGarden`（花靈庭園）：
    服裝 `flowerSpiritPetalDress`、材質沿用桃花飄落 `peachBlossomDrift`、
    姿勢從讀書卷坐姿 `scrollReadSit` 換成持花 `lotusHold`、背景從藏經閣
    `libraryPavilionInterior` 換成庭園 `pavilionCourtyard`、style 從偏
    學術的 `artExhibit` 換成 `beautyCampaign`。
  - `lotusSpellCasting`（蓮花法印）→ `moonSpiritLotusPond`（月靈蓮池）：
    服裝 `moonSpiritGauzeRobe`、材質從法印 `lotusFlameSpell` 換成月華雲紗
    `moonlitCloudVeil`、姿勢從結印手勢 `handSealCast` 換成蓮花池畔坐姿
    `lotusPoolSit`，背景/光線（荷花水榭、霧氣）維持不變因為場景本身跟
    月靈仙子很搭。
  - `autumnScholarPoet`（楓葉書卷）→ `mapleSpriteAutumn`（楓蝶精靈）：
    服裝 `butterflySpriteGown`、姿勢從撫琴坐姿 `qinPlaySit` 換成辮髮撚轉
    `braidTwirl`，材質/背景（楓葉秋思、秋楓谷地）維持不變。
  - `talismanNightHunt`（符紙夜巡）→ `duskFairyLantern`（精怪夜市）：
    服裝 `charmSpriteTrailDress`、材質從符紙法陣 `talismanScroll` 換成
    靈蝶流光 `spiritButterflyGlow`、姿勢從擲符出手 `talismanThrow` 換成
    飛舞綢帶旋轉 `flyingRibbonSpin`、光線從 `hard` 換成暖金狐火光
    `foxfireGold`（借用 `courtDancerLanternNight` 模板已驗證過的夜市燈籠
    暖光效果）、style 從 `huxia` 換成 `editorial`，背景維持夜市燈籠
    `marketFestivalNight` 不變。
  - 全部 4 組模板改用的材質/背景/姿勢/光線/style 都是**既有選項**，沒有
    新增任何 `materialData`/`backgroundData`/`poseData`/`lightingData`
    條目，純粹是重新排列組合搭配新服裝的美感方向，模板總數維持 17 組
    不變。
- **驗證**：`grep` 確認舊 9 個 key（5 服裝值＋4 模板 key）在檔案裡完全
  無殘留引用；抽出 `<script>` 內容跑 `new Function(...)` 語法檢查通過；
  四支驗證腳本重跑全過——`check-static` 全過、`validate-preset-refs`
  確認 xianxia.html 17 組模板 0 issue（模板數量沒變，只是內容換了）、
  `audit-100x` 累計 1300 次模擬（13頁×100）0 issue、`build-prompt-preview`
  正常產出新的 xianxia 預覽輸出。

## 2026-08-01（七）　服裝改造核心擴至 3 頁 + 全站 7 頁主題適合度審查 + lightingData 大清理

- **服裝改造核心擴至 flower-fairy／floral-sweet／gala-socialite**：owner
  先確認這三頁跟已完成的 kpop-idol.html 是同一批「複製 flower-fairy.html
  當底」架構（`.section-material{order:5}`／`.section-pose{order:6}`、
  `materialData`→`garmentData` 插入點、`applyThemeTemplate`/
  `apply×××RandomSelection`/`generate()` 骨架完全相同），三頁依序執行跟
  isekai-fantasy／kpop-idol 完全一致的機械化流程（CSS order 插入、
  section-label 重編號、新增「06 服裝改造核心」HTML 區塊、插入
  `chestDetailData`/`waistSideDetailData`/`shoulderDetailData`/
  `GARMENT_DETAIL_LAYER_ZONES`、三處函式邏輯、底部監聽清單），各頁語彙：
  - flower-fairy：花瓣鏤空/月光紗/蝶翼薄紗/藤蔓滾邊/紗透拼接
  - floral-sweet：愛心鏤空/緞帶蝴蝶結/荷葉邊裝飾/珍珠釦飾滾邊/蕾絲拼接
  - gala-socialite：珠寶鑲嵌/薄紗拼接/珠繡滾邊/交叉細帶/鏈條肩帶
  三頁的 `applyThemeTemplate()`/`applyXxxRandomSelection()`/`generate()`
  改動與 flower-fairy 的 wings/butterflies 特殊邏輯（僅該頁有）互不衝突。
  `scripts/audit-100x.mjs`／`scripts/build-prompt-preview.mjs` 同步更新
  三頁的 exportExpression／pools／sel／selection／文字組裝邏輯，四支
  驗證腳本全過（`audit-100x` 1300 次模擬 0 issue、`build-prompt-preview`
  三頁預覽輸出正確含 `garment surface detail:` 行）。服裝改造核心目前
  共 8 頁擁有：battle-academy／xianxia／anime-character／isekai-fantasy／
  kpop-idol／flower-fairy／floral-sweet／gala-socialite；travel／
  magazine／doll／fantasy-fashion／store-ad 5 頁架構不同（非本系列頁面），
  未列入本輪範圍。
- **owner 回報具體問題引發全站審查**：「韓系氣質偶像風今天我出圖，背景
  有血月，感覺怪怪的」。同一則訊息也問「中式仙俠/動漫人物/花仙子/日式
  異世界/花漫甜美系/氣質名媛宴會/韓系氣質偶像風/戰鬥制服學園，可以都
  跟中式仙俠一樣在分析介面的要素配合主題做修正嗎」——呼應同一天稍早
  才完成的 xianxia「法袍道服」→「仙靈妖精裝束」修正（見上一條記錄）。
  派 7 個 general-purpose agent（xianxia 已處理過不重複審查）並行審查
  anime-character／flower-fairy／isekai-fantasy／floral-sweet／
  gala-socialite／kpop-idol／battle-academy 各頁的 `garmentData`/
  `materialData`/`backgroundData`/`lightingData`（或 battle-academy 對應
  的 `upperBodyData`/`waistData`/`lowerData`/`accessoryData`/
  `fantasyDetailData`），逐項判斷是否符合該頁主題。**回報結果高度一致**：
  garment／material／background 全部乾淨，問題完全集中在 `lightingData`
  ——這是一個跨頁共用、從未依主題篩選過的大型燈光選項池（各頁約 57～58
  個選項），混入其他主題頁遺留的選項：血月／哥德儀式陰影／狐火／宮殿
  寶座／鬥魚水下聚光／馬戲團燈串／沙漠宮帳／賽博龐克霓虹／科技產品
  （智慧手錶/全息掃描/音響）／甜點飲料廣告燈光（抹茶/奶茶/糖果/櫻桃）等，
  是 battle-academy 先前已經處理過一次的同一種歷史成因（複製貼上共用
  大池子、未依主題個別篩選）。isekai-fantasy 頁面因為本身橫跨光明/獸族/
  暗黑三大陣營，agent 特別排除了合理屬於暗黑奇幻的選項（血月戰場、哥德
  暗影等在該頁語境下是正常內容，不算殘留）。
- **逐頁清理執行**：先用 `grep` 確認每頁「移除清單」是否被任何
  `themeTemplates` 引用，發現 3 頁有衝突需要重新指向：
  - kpop-idol：`vintageRecordStoreVibe`／`cafeWindowCandidPortrait` 兩組
    模板引用 `warmWindowSoft`（其實是「中式窗欞紅紙反光、奢華婚紗廣告光」
    的仙俠婚禮殘留字句），改指向 `soft`。
  - anime-character：`swordDrawBattleStance`（戰場姿勢）引用 `bloodMoonGlow`
    改指向 `hard`；`dramaticWindSweptCapePose`（校園屋頂姿勢）引用
    `warmWindowSoft` 改指向 `halo`。
  - floral-sweet：`bakeryCafeInterior`／`europeanAlleyCafe` 兩組模板引用
    `warmWindowSoft`，改指向 `soft`（原描述本身就是奢華婚紗廣告光，跟
    甜點店/歐式小巷咖啡館場景不搭）。
  其餘頁面的移除清單皆無模板引用，可直接刪除不需要重新指向。用一支共用
  邏輯的一次性 Node 腳本（每頁各自傳入專屬移除清單，逐行過濾
  `^\s{2}KEY:\s*'` 格式的 JS 條目與 `name="lighting" value="KEY"` 格式的
  HTML 卡片，兩處同步刪除，確保 JS 資料與 UI 選項不會兜不起來）逐頁執行，
  清理結果：
  - kpop-idol：57→25（移除 32 個，含 owner 明確指出的血月問題）
  - gala-socialite：移除 32 個
  - floral-sweet：移除 29 個
  - isekai-fantasy：移除 22 個
  - flower-fairy：移除 20 個
  - anime-character：移除 15 個
  - battle-academy：移除 6 個（先前已清理過一輪 57→31，這次是抓漏網之魚：
    `warmWindowSoft`/`jewelrySparkle`/`amethystSparkle`/`redWaterReflection`/
    `blueFlameGlow`/`candleShadowGothic`，皆確認未被任何模板引用）
- **驗證**：每頁清理後先個別跑語法檢查（抽出 `<script>` 內容跑
  `new Function(...)`），全部 7 頁通過後一次跑全站四支驗證腳本：
  `check-static` 全過、`audit-100x` 累計 1300 次模擬（13頁×100）0 issue、
  `validate-preset-refs` 全部頁面 0 issue（確認重新指向的模板欄位值仍然
  合法），`build-prompt-preview` 全站預覽輸出正常產出，另外用 `grep` 對
  7 頁的預覽輸出逐一確認不再出現「blood moon」字樣。
- **教訓**：跨頁共用、直接複製貼上、從未依主題個別篩選過的大型選項池
  （`lightingData` 是目前發現的唯一一個，各頁材質/服裝/背景欄位都是
  頁面專屬設計、不會有這個問題）是最容易累積跨主題殘留內容的地方。新頁面
  上線或既有頁面內容審查時，這類欄位應該優先檢查是否真的依主題篩選過，
  不能假設「選項多總是好事」；本次也再次印證了先前 battle-academy
  lightingData 清理（57→31）記錄下的判斷方法論同樣適用於其他頁面，是
  可重複執行的標準流程，不需要每次重新設計判斷標準。

## 2026-08-01（八）　index.html：拿掉頂部小連結，工具卡片依主題重新分 4 類

- owner 指出首頁上方那排小圓角連結（`.nav-links`，14 個：首頁 + 13 個
  工具頁）跟下方的工具卡片區其實是同一組連結重複兩次，隨著工具頁從最初
  的 4 個成長到現在的 13 個，頂部那排連結在窄螢幕已經要橫向捲動才看得完，
  要求拿掉頂部小連結、統一成只有卡片區這一套，並針對卡片數量變多重新
  設計卡片區的分類。
- **分類方案確認**：用 `AskUserQuestion` 給 owner 三個選項（依主題分類／
  依上線時間新舊分類／owner 自訂），owner 選推薦的依主題分類方案：
  - **真人時尚寫真**（5）：寫真旅拍、雜誌棚拍、花漾甜美系、氣質名媛宴會、
    韓系氣質偶像風——共通點是真人寫實時尚場景，非奇幻世界觀。
  - **奇幻世界觀寫真**（5）：幻想廣告、中式仙俠、日式異世界、花仙子、
    戰鬥制服學園——共通點是奇幻或異世界觀設定（不論寫實或插畫）。
  - **動漫插畫風**（1）：動漫人物美圖——全站目前唯一的插畫風格頁，
    跟其他頁的「真人寫實」定位明顯不同，獨立一類。
  - **特殊工具**（2）：公仔系列、店家活動廣告——這兩個不是「人像寫真」
    類工具（公仔是收藏品轉換、店家廣告是活動主視覺），跟其餘 11 個
    「幫真人生成風格化寫真」的工具性質不同，獨立一類。
- **實作**：
  1. `<nav>` 拿掉整個 `.nav-links` `<div>`（14 個 `<a class="nav-link">`）
     與對應 CSS（`.nav-links`/`.nav-link`/`.nav-link.active`，以及行動版
     media query 裡讓連結橫向捲動的相關樣式）；`.nav-logo` 從
     `<a href="index.html">` 改成純文字 `<span>`——這樣首頁的 nav 就跟
     其餘 13 個工具頁「logo 不可點擊、無連結」的既有慣例一致了（之前只有
     首頁保留完整導覽，是唯一例外；這次拿掉頂部連結後就沒有例外了）。
  2. 工具卡片區從單一 `.tools` 平鋪 grid（`max-width:700px`，13 張卡片
     排成很長的單/雙欄直向清單）改成 `.tools-wrap`（`max-width:1080px`，
     寬螢幕可排 3 欄）包 4 個 `.tools-category` 區塊；每個區塊上方加一條
     `.tools-category-label`（金色、小型全大寫、字間距拉開，右側接一條
     延伸到區塊邊緣的分隔線，視覺上跟 hero 區的 `.hero-eyebrow` 呼應但
     用途不同），底下才是該分類專屬的 `.tools` grid。
  3. **13 張卡片的 HTML 內容、`href`、配色 class（`.tool-card.xianxia`
     等既有強調色系統）全部原封不動搬移到對應分類區塊，沒有新增/刪除/
     改名任何卡片或連結**——純粹是重新分組跟版面調整，不影響任何工具頁
     本身的內容或既有的強調色識別系統。
- **驗證**：`scripts/check-static.mjs` 確認 `index.html` 本地連結檢查
  通過、無重複 id、無 inline script 語法問題（首頁本來就是純靜態導覽頁，
  沒有 JS 生成邏輯，所以 `audit-100x`/`validate-preset-refs`/
  `build-prompt-preview` 三支跟咒語生成邏輯有關的腳本本來就不適用於這個
  檔案）。額外寫了兩支一次性檢查：確認 `.tool-card` 數量還是 13、13 個
  `href="*.html"` 全部還在；確認 `<div>` 開合標籤數量相等（54/54），排除
  搬移過程中漏掉或多加閉合標籤的可能。因為環境沒有瀏覽器截圖工具，這次
  是純結構驗證，沒有真的用瀏覽器看過渲染效果。

## 2026-08-01（九）　讀取風格範例圖庫，分析並補充 8 個工具頁的選項

- owner 要求讀取本機 `C:\Users\User\Desktop\ai生圖\風格範例\`（56 張圖
  ＋1 個文字檔，**不在本專案 repo 目錄內**，是 owner 桌面上的獨立參考
  素材夾），分析內容並分類補充到各工具出圖專案的選項裡。
- **分析階段**：56 張圖片橫跨多種風格（東方仙俠茶會、花仙子奇幻禮服、
  歐式旅拍、韓系街拍、高奢晚宴等），數量太大不適合自己逐張看完再判斷，
  派 5 個 `general-purpose` agent 並行處理（每個負責約 11 張），給每個
  agent 相同的 13 頁主題對照表 + 明確的內容安全準則（引用本專案過去
  兩次真實案例：`summer-island.html` 因泳裝級裸露風險整頁下架、
  battle-academy 把「上衣鈕扣全開完全露胸罩」改成「微解2-3顆釦不露
  內衣」的保守寫法），要求圖片內容若涉及濕透透視/深乳溝/泳裝級曝光就
  直接跳過不提供建議。**結果**：56 張中 17 張被跳過（其中一張是我自己
  先看過並明確指出的可口可樂濕身透視商業照，另外 16 張是 agent 自行
  判斷跳過的）；39 張產出建議，命中 8 個頁面，命中數：
  fantasy-fashion（9）> xianxia／flower-fairy（各7）> travel（6）>
  gala-socialite（4）> magazine（3）> floral-sweet（2）>
  anime-character（1）；kpop-idol／battle-academy／isekai-fantasy／
  doll／store-ad 這批素材完全沒有對應內容（這批參考圖偏東方奇幻/
  高定禮服/旅拍風，不是這幾頁的方向）。彙整成一份 Markdown 文件用
  `Artifact` 工具發布給 owner 逐項檢視（依命中數排序、每項附中英文
  描述與來源檔名），owner 回覆「全做吧」。
- **實作前的關鍵動作：逐頁比對現有選項池，過濾重複建議**——這是本輪
  最重要的執行紀律，因為 agent 產生建議時只拿到每頁主題的一行摘要，
  不知道該頁實際上已經有哪些選項，容易建議出「這個頁面可能還沒有」但
  實際上已經存在的近似內容：
  - **`fantasy-fashion.html` 嚴重飽和**：這頁材質庫已經有 100+ 條目、
    背景庫 75+ 條目（是全站規模最大的頁面），逐條比對後發現 9 個建議
    裡有 7 個明顯重疊——「水晶香水瓶場景」≈既有 `auroraGlassPerfume`
    (極光玻璃香氛) / `perfumeGlassStudio`；「機械義體材質」≈既有
    `whiteMechaExoskeleton`/`wastelandCyberMetal`/`blackMechanicalWings`
    三個變體；「宣紙水墨拼接」≈既有 `paperOiran`/`inkPeony`/
    `inkWaterBloom`/`inkCalligraphyButterflyGown` 四個變體；「星河
    背景/星塵禮服」≈既有 `deepSpaceStardust`/`galaxyOceanDrape`/
    `stardustLightSilk`；「維多利亞蕾絲羽帽」≈既有 `laceCouture`/
    `amethystRococoLace`；「碎鏡星塵背景」≈既有 `shatteredMirrorBurst`/
    `maglevProductStage`。用 `AskUserQuestion` 跟 owner 確認這頁的
    處理方式，owner 選「只加真正新的 2 個」——只留下確實找不到既有
    對應的「冰火二重漸層禮服」（材質，一半冰晶紗質一半烈焰刺繡的中線
    漸層效果，跟既有的純冰或純火材質都不同）與「水島莊園無邊際泳池
    日落」（背景，這頁完全沒有現代度假村類型的背景）。
  - **`travel.html` 中度重疊**：服裝方向欄位（`costume`）已有「旗袍」
    「蕾絲削肩露腰上衣」，跟建議的「改良旗袍鏤空禮服」「蕾絲削肩短版
    上衣+牛仔短褲」重疊度高，跳過；姿勢欄位已有「撩髮側望」「整理
    衣領垂眸」，跟建議的「迎風撩髮回眸」「回眸露背和服」重疊，跳過；
    地點欄位（`themePreset`）已有「希臘聖托里尼」「南法薰衣草田」等
    30+ 個具體地標 chip，「地中海山城」「黃昏花海」跟這些太接近也
    跳過。最終只留下：1 個新地點 chip（夜櫻石燈籠神社參道，跟既有
    「古町運河櫻花小徑」的白天運河場景不同）、3 個服裝方向（波希米亞
    單肩民族裙裝、麻花披肩針織外套、波希米亞蕾絲婚紗）、1 個姿勢
    （底片相機持拍，全站目前沒有任何「拿相機」的姿勢）。
  - **其餘 6 頁重疊度低**：xianxia／flower-fairy／gala-socialite／
    magazine／floral-sweet／anime-character 個別檢查後只各自濾掉 1-2
    個近似重複的建議（例如 xianxia 的「緙絲雲肩織錦漢服」跟既有
    `cloudShoulderCape`太像、flower-fairy 的「伸手邀請鏡頭」跟既有
    `reach_camera`姿勢太像、magazine 的「倚凳沉思坐姿」就是既有
    `chin_rest`姿勢本身），大部分建議都保留落地。
- **架構差異踩坑**：實作 travel.html／magazine.html 時發現這兩頁是
  本站最早期建立的架構，跟後來 11 頁統一的 `garmentData`/
  `materialData`/`backgroundData`/`poseData` 命名慣例不同——
  travel.html 的服裝方向是 `COSTUME_DIRECTIONS`、姿勢是 `POSE_STYLES`、
  光線是 `TRAVEL_LIGHTING_STYLES`，且地點欄位（`themePreset`）**完全
  不需要 JS 對照表**，點擊 chip 直接把中文字塞進自由文字主題框；
  magazine.html 的服裝方向欄位**是純自由文字輸入**，沒有固定選項系統
  可以加（所以「蕾絲高領婚紗禮服」「一字肩碎花高低裙」這類服裝建議
  在 magazine.html 完全沒有落地空間，只能加背景/光線/姿勢），光線資料
  也是巢狀在 `DETAIL_BLOCKS.lighting` 底下而不是頂層常數。這個發現
  避免了誤用其他頁的模式硬套過去、產生不存在的欄位。
- **各頁最終新增內容**：
  - `fantasy-fashion.html`：+1 材質（冰火二重漸層禮服）+1 背景（水島
    莊園無邊際泳池日落）
  - `xianxia.html`：+2 材質（青花瓷機械神龍座騎、珠簾步搖釵）+2 服裝
    （金屬蓮花甲胄紗裙、鎏金牡丹廣袖袍）+5 背景（宮廷茶會廳堂、剪紙
    花窗織錦、木格窗雕花回廊、御空俯瞰宗門天際、落櫻古寺庭院）
  - `flower-fairy.html`：+3 材質（剪紙浮雕禮服質感、皇冠靠枕道具、
    動物樂團伴奏）+1 服裝（蝴蝶珍珠蕾絲裙）+3 背景（森林燭光水鏡、
    鏡面梳妝閨房、圓窗遠山寶塔夢境）+1 姿勢（指揮手勢姿）
  - `travel.html`：+1 地點 chip（夜櫻石燈籠神社參道）+3 服裝方向
    （波希米亞單肩民族裙裝、麻花披肩針織外套、波希米亞蕾絲婚紗）+1
    姿勢（底片相機持拍）
  - `gala-socialite.html`：+3 服裝（鏤空腰身羽毛禮服、寶石腰封垂墜
    禮服、蕾絲改良旗袍晚裝）+2 背景（復古酒吧吧檯、古典庭院花窗門廊）
  - `magazine.html`：+1 光線（窗格光影棚拍）+1 背景（現代辦公室桌景）
    +1 姿勢（倚桌翹腳坐姿）
  - `floral-sweet.html`：+1 材質/道具（提籃配飾）+2 背景（九重葛花藤
    拱廊庭院、老街花燈夜景）
  - `anime-character.html`：+1 背景（水墨飛白背景）
- **驗證**：每頁改完先個別跑語法檢查，8 頁全過後一次跑全站四支驗證
  腳本：`check-static` 全過、`audit-100x` 累計 1300 次模擬（13頁×100）
  0 issue、`validate-preset-refs` 全部頁面 0 issue、`build-prompt-preview`
  正常產出。
- **教訓**：跨頁批次補充內容時，「先看完整個頁面現有選項池再決定加
  什麼」比「agent 建議什麼就加什麼」重要得多——尤其是像
  fantasy-fashion.html 這種已經發展很久、選項池早已飽和的頁面，不做
  比對直接照單全收，很容易把同一個概念用不同名字重複堆疊三四次，
  讓選單越來越長卻沒有真正增加多樣性。

## 2026-08-01（十）　「分析圖片」流程定型為固定 pipeline，執行第二輪 34 張新圖並建立未採用要素存檔

- owner 把 `風格範例` 資料夾整批換成 34 張新圖（原本 56 張的實體檔案
  已經不在磁碟上），要求重跑一次跟上一輪一樣的分析流程，同時提出兩個
  新的長期規則：
  1. 「之後我說分析圖片，就這樣處理」——把整套流程（agent 平行分析
     ＋內容安全過濾＋比對現有選項池去重＋落地）定型為標準作業程序，
     之後不用每次重新說明。**存成 memory**
     （`workflow_image_analysis_pipeline.md`，type: feedback），之後
     任何一輪的「分析圖片」請求會自動套用這套 pipeline。
  2. 「將沒加入線上的照片要素構成都全部放在一個要素不被採用的.md
     ...留著之後研究，因為會請你分析，表示這圖片我喜歡，分析完就算
     不採用也先別丟棄」——不只這一輪的排除項目要記錄，上一輪（56 張）
     被排除的內容也要一併補進去。建立 `docs/要素不被採用的.md`，先用
     上一輪 5 個 agent 當時產出的文字描述整理出第一輪的完整排除清單
     （17 張因裸露尺度排除、11 張因跟既有選項重複而未落地，逐張附上
     agent 原始描述與判定理由），再等這輪分析完補上第二輪的部分。
- **第二輪執行**：34 張圖分 3 個 agent 平行處理（每個約 11-12 張），
  這次額外要求**不論安全與否、不論有沒有對應頁面，每張圖都要寫出完整
  的服裝／材質道具／背景／姿勢／光線五項要素分解**——這是跟上一輪
  最大的差異，上一輪不安全的圖只有一行簡短跳過理由，這次為了同時滿足
  「新增到網站」跟「存檔研究」兩個目的，要求 agent 對每張圖都完整記錄。
- **結果**：34 張中 13 張因裸露尺度判定不安全（其中 6 張是同一套「希臘
  十字露背纏裹裙」造型在聖托里尼白牆迴廊/懸崖海鷗/海邊石階/暴雨閃電/
  神廟列柱等不同場景與光線下的變化版本，側乳與腰腹大面積外露、部分
  濕透近乎透視），21 張安全。21 張安全的裡面，逐一比對現有選項池
  （不是照單全收 agent 的建議）後，發現：
  - **isekai-fantasy.html** 的「九尾狐巫女陣營」建議跟既有「狐娘．月下
    靈狐」陣營角色設定重複，但陣營底下的「夜間神社鳥居參道」背景本身
    是新的（isekai-fantasy 原本沒有任何 torii 鳥居類背景，只有
    `sacredTreeShrine` 聖樹神龕），拆開處理，只採納背景部分。
  - **xianxia.html** 的「赤焰鳳冠仙裝」≈既有 `phoenixCoronet`（鳳冠
    霞帔）、「江南水鄉」背景≈既有 `riversideWillowPath`（河畔垂柳道：
    石橋流水垂柳），兩個都跳過；但「水墨暈染麻布仙裝」（服裝，xianxia
    本身完全沒有水墨材質，這是 fantasy-fashion.html 的專利語彙）、
    「石蒜彼岸花道具」（材質，xianxia 沒有這個花卉法器）、「落花浴池」
    （背景，跟既有 `lotusPondPavilion` 的「站在平台上看荷池」視角不同，
    這次是「人物本身站在水中沐浴」）、「大漠遺跡」（背景，xianxia
    完全沒有沙漠場景）都確認是真正新的，予以採納。
  - **gala-socialite.html** 的「緞帶簾幕背景」≈既有
    `goldSilkDrapedBackdrop`（金絲緞幕抽象背景）、「玫瑰花園月夜」≈
    既有 `moonlitGardenTerrace`（月光花園露台）、「遊艇甲板+絲巾」≈
    既有「私人遊艇甲板」背景與「遊艇夜晚出遊」一鍵模板，三個都跳過；
    「粉鑽公主抹胸禮服」（莫蘭迪粉水鑽抹胸澎裙，跟既有黑色系/紅毯系
    禮服色調區隔明顯）予以採納。
  - **travel.html／gala-socialite.html** 的「威尼斯貢多拉扇遮回眸」
    （出現 2 次，2 個不同批次的 agent 各自提了一次，內容幾乎一樣）≈
    travel.html 既有地點 chip「威尼斯運河」，且 gala-socialite 已有
    遊艇相關場景，跳過；「薰衣草田流蘇禮服」≈travel.html 既有地點
    chip「南法薰衣草田」，跳過；「宮廷噴泉花冠造型」跟 flower-fairy.html
    既有花冠配飾、gala-socialite.html 既有宴會/花園場景都有重疊，跳過。
    「波希米亞市集綁帶上衣」（travel.html 服裝方向，繫帶泡泡袖+金屬
    鏈飾腰帶，市集café場景跟既有的單肩民族裙裝/針織披肩/蕾絲婚紗都
    不同）予以採納。
  - **magazine.html** 的「薄紗新娘特寫」因為這頁服裝方向欄位是純自由
    文字輸入、沒有固定選項系統可以加，不採用；但「彩窗光斑棚拍」
    （背景，彩繪玻璃窗＋七彩光斑折射，magazine 現有 52 個背景裡沒有
    這個效果）確認是新的，予以採納。
  - **floral-sweet.html** 的「玫瑰胸花澎裙」（服裝）+「地中海庭院
    拱廊」（背景，同一張圖的兩個元素）都確認是新的；「碎花壁紙鏡前
    自拍」背景跟既有 `vintageBathtubCorner`（復古浴缸一角）雖然都是
    浴室場景，但一個是懷舊復古泡澡氛圍、一個是現代俏皮鏡前自拍構圖，
    情境差異夠大，判斷可以並存，予以採納。
  - **fantasy-fashion.html** 的「冰晶煙霧后冠戰袍」跟既有
    `darkIceCrystal`／`frozenSplashIce`／`glassFlameOpera` 等冰晶/
    煙霧材質重疊度高（agent 自己也在報告裡建議「採用前先查重」），
    跳過；「報紙拼貼材質」（層疊撕邊報紙印刷、隱約文字與半色調照片，
    跟這頁既有的和風紙雕/水墨紙藝完全是不同材質語彙）確認是新的，
    予以採納。
- **最終落地 12 項，橫跨 6 個頁面**：xianxia.html（+2背景+1服裝+1
  材質）、gala-socialite.html（+1服裝）、isekai-fantasy.html（+1
  背景）、floral-sweet.html（+1服裝+2背景）、travel.html（+1服裝
  方向）、fantasy-fashion.html（+1材質）、magazine.html（+1背景）。
- **`docs/要素不被採用的.md` 建檔**：分成「第一輪（56張）」與「第二輪
  （34張）」兩大節，每節再分「A. 因裸露尺度被排除」跟「B. 安全但與
  現有選項重複/欄位限制未落地」兩類，逐張列出構圖要素、判定理由、
  若安全會對應到哪一頁。**資料品質誠實揭露**：第一輪的原始 56 張
  實體檔案已經被這輪的新圖取代、無法重新開圖細看，第一輪記錄只能用
  當時 5 個 agent 產出的文字摘要整理（深度不如第二輪的完整五項分解）；
  第二輪裡「希臘十字露背纏裹裙系列」（6張同款不同場景）與「威尼斯
  貢多拉」（2張近似描述）在平行批次分析時，agent 的檔名編號對應有
  一格左右的誤差，已在文件裡誠實標註為「系列」處理、不做過度精確的
  一對一宣稱，內容本身的構圖要素描述是準確的，只是「哪段文字對應哪個
  確切檔名」在這幾張圖裡不完全確定。
- **驗證**：12 項新增逐頁做完後先個別跑語法檢查，全部通過後一次跑
  全站四支驗證腳本：`check-static` 全過、`audit-100x` 累計 1300 次
  模擬（13頁×100）0 issue、`validate-preset-refs` 全部頁面 0 issue、
  `build-prompt-preview` 正常產出。
- **教訓**：把重複出現的工作流程（這次是「分析圖片」）明確定型成
  memory 記錄下來，比每次都重新在對話裡說明一遍更有效率，也能確保
  未來不同輪次的執行品質一致（例如這次「每張圖都要完整五項分解」這個
  關鍵要求，就是直接寫進 memory 裡，下次不用重新想起來要加這個要求）；
  另外「不採用不等於丟棄」這個原則本身也值得記住——owner 明確表示
  「請你分析」這個動作本身就代表「我喜歡這張圖」，就算最終沒有變成
  網站上的選項，那些構圖巧思（服裝剪裁、材質搭配、場景氛圍、姿勢
  設計）仍然是有價值的參考資料，用一份持續累積的研究檔案保存下來，
  比讓分析結果隨對話結束而消失更符合這個素材蒐集流程的目的。

## 2026-08-01（十一）　第三輪「分析圖片」：memory pipeline 首次實戰驗證

- owner 用一模一樣的原始指令句子（跟上一輪定型 memory 時完全相同的
  文字）第三次要求分析圖片。這是對上一輪存進 memory 的
  `workflow_image_analysis_pipeline.md` 的**第一次實戰驗證**——這次
  完全沒有重新詢問流程或範圍，直接套用已經記住的 pipeline。
- **判斷只需分析新增部分**：資料夾這次沒有整批換掉，是在原本已經
  處理完的 34 張後面新增 13 張（`23.21.18.jpg`～`23.23.40.jpg`），
  比對檔名時間戳記確認前 34 張都是上一輪已經處理過的（已落地或已記錄
  進研究檔案），只需要分析新增的 13 張，不重複處理舊的。
- **執行**：2 個 agent 平行處理（7張+6張），沿用上一輪定型的要求——
  不論安全與否、不論有沒有對應頁面，每張圖都要完整記錄服裝／材質
  道具／背景／姿勢／光線五項要素。結果：13 張中 4 張因裸露尺度排除
  （其中 3 張集中在中式古風類型：透紗深開衩坐姿、紅紗纏身近乎裸體、
  古裝深V濕肌特寫，顯示這批供圖來源在「中式古風」尺度上偏高，值得
  記錄成經驗——下次如果同一個素材來源持續提供這類尺度的圖，可以考慮
  在分析階段就先提醒 owner），9 張安全。
- **9 張安全的逐一比對現有選項池**（此時各頁選項池已經是前兩輪加過
  之後的最新狀態）：
  - flower-fairy.html 的「立體玫瑰刺繡抹胸禮服」≈既有 5 個玫瑰材質
    變體＋`roseCrimsonGown` 玫瑰禮服，重疊度高，跳過；但同一張圖的
    「水晶花冠髮飾」（獨立的水晶鑲嵌花朵髮冠配件，跟既有的
    `floralCrownGown`／`hornFlowerChain` 這種整體造型呼應的花冠禮服
    不同，是單純的頭飾單品）確認是新的，予以採納。
  - floral-sweet.html 的「粉紅花海連身裙」≈既有 6 個以上碎花洋裝
    變體，跳過；「拼接碎花奔跑洋裝」（多色拼接、蕾絲下擺、動態奔跑
    裙擺，跟既有單一花色洋裝不同）與「歐式宮殿石階玫瑰花牆」背景
    （跟既有 `europeanAlleyCafe` 巷弄咖啡座不同，這是宮殿石階建築）
    確認是新的，予以採納。
  - xianxia.html 的「執劍女俠」≈既有 `swordCultivatorAttire`（青玄
    劍修常服）服裝＋`immortalSword`（仙劍靈氣）材質組合已經涵蓋這個
    「執劍」概念，跳過；「敦煌樂伎神女」（金冠光環、飄帶、琵琶樂器、
    敦煌壁畫神殿）≈既有 `courtDancerRobe`（宮廷樂舞飛天裝：「珠繡
    束胸、垂墜綢帶長袖、飛天舞姬輪廓」）已經是同一種飛天樂伎/舞姬
    視覺原型，角色設定重疊度高，跳過。
  - fantasy-fashion.html 的兩張哥德玫瑰婚紗馬甲圖（教堂穹頂、黑緞帶）
    因為這頁材質/背景資料庫已飽和，agent 自己在報告裡也標註「不強烈
    建議新增」，兩張都跳過。
  - kpop-idol.html 的「重機皮革挖空上衣」（挖空剪裁、長手套項圈、
    賽道背景）跟「霓虹街拍綁帶上衣」（綁帶短版上衣、破損牛仔短褲、
    夜間街景）都確認是新的——這頁雖然已有 `leatherTrenchCoat`（皮革
    風衣外套）跟 `cargoPantsCropTop`（工裝褲短版上衣），但都是不同
    的剪裁概念（風衣不是挖空背心、工裝褲不是牛仔短褲），予以採納。
- **最終落地 5 項，橫跨 3 個頁面**：flower-fairy.html（+1材質）、
  floral-sweet.html（+1服裝+1背景）、kpop-idol.html（+2服裝）。
- **`docs/要素不被採用的.md` 新增「第三輪」章節**：延續前兩輪的
  A（裸露排除）/ B（重複排除）分類架構，逐張記錄構圖要素、建議過的
  選項、不採用原因。
- **驗證**：5 項新增逐頁做完後先個別跑語法檢查，全部通過後跑全站
  四支驗證腳本：`check-static` 全過、`audit-100x` 累計 1300 次模擬
  （13頁×100）0 issue、`validate-preset-refs` 全部頁面 0 issue、
  `build-prompt-preview` 正常產出。
- **教訓**：memory pipeline 的實戰驗證證明了「把重複流程定型成 memory」
  這件事的價值——這一輪從讀取資料夾到分析到落地到記錄研究檔案，全程
  沒有再問 owner 任何一次確認範圍或流程的問題，執行品質（每張圖完整
  五項分解、去重邏輯、A/B 分類記錄方式）跟前一輪完全一致。唯一需要
  自己判斷的新狀況是「資料夾沒有整批換掉、只新增了部分檔案」——這點
  memory 裡雖然沒有明確寫「怎麼判斷新增檔案」，但靠比對檔名時間戳記
  就能可靠處理，之後如果這個模式重複出現，可以考慮把「用檔名時間戳記
  判斷哪些是新增檔案」也補寫進 memory。

## 2026-08-02（一）　新增第 14 個工具頁：ancient-goddess.html（神話古文明女神）

- **背景**：owner 根據 `docs/要素不被採用的.md` 三輪累積的「安全但重複」
  排除紀錄（希臘十字露背纏裹裙系列、白金水晶重甲、敦煌樂伎神女／琵琶、
  漢服執劍女俠等反覆出現卻找不到位置落地的元素），要求提出 3 個新工具
  方案；owner 選定「神話／古文明女神」主題，要求做出來並上線（另一個
  「大膽尺度姊妹」方案則要求完全不進 git、僅本機使用，另案處理）。
- **方案A：複製既有頁面當底**——選 `gala-socialite.html`（而非
  `flower-fairy.html`）當複製來源：架構乾淨、沒有花仙子頁專屬的翅膀/
  蝴蝶機制，且已經內建「服裝改造核心」（Garment Detail Core）UI。
- **雙系統內容設計**：把神話古文明女神拆成希臘羅馬神殿與敦煌壁畫飛天
  兩大系統，兩邊vocabulary都直接取材自要素研究檔案裡多輪反覆出現卻
  未落地的元素：
  - **服裝（24項，3組各8項）**：✦希臘羅馬神殿服飾（垂墜希臘長袍、金
    月桂胸甲禮服、褶皺愛奧尼亞長袍等）、✦敦煌壁畫飛天服飾（飛天綢帶
    長袍、反彈琵琶廣袖長裙、洞窟錦緞供養服等）、✦高定神話訂製（直接
    對應研究檔案裡的「星鑄水晶戰甲」「霧紗天界禮服」「玉飾漢服執劍
    長袍」等曾被排除的概念）。
  - **材質（24項，5組）**：黃金神聖光澤／大理石與寶石質感／敦煌壁畫
    色彩（石綠、朱砂、描金線描）／神話道具配飾（月桂花冠、琵琶、古劍、
    焚香、金杯獻禮）／光影氛圍特效。
  - **背景（24項，5組）**：希臘羅馬神殿（列柱廳、愛琴海崖岸遺跡、
    奧林帕斯雲峰）／敦煌石窟壁畫（石窟龕影、藻井蓮花穹頂、絲路綠洲）／
    神話幻境（星空聖域、雲海天門、極光神啟）／遺跡與自然／抽象神聖
    棚拍背景。
  - **姿勢**：沿用大部分共用姿勢池（站姿/坐姿/手勢細節三組完全不變），
    只把原本「名媛專屬姿勢」5個換成「神話女神專屬姿勢」5個：獻禮祈禱、
    反彈琵琶、執劍護持、飄帶迎風舞、神殿倚柱。
  - **成品用途風格（9項）**：史詩神話海報／博物館文物攝影／電影感
    神話敘事／極簡神性留白／聖金奢華廣告／古典油畫繪畫感／考古藝廊
    策展／神性美妝形象／神秘黃昏詩意。
  - **一鍵主題模板（16組）**：8組希臘羅馬（奧林帕斯女神降臨、大理石
    神殿祭壇、月桂勝利女神、愛琴海浪湧女神、智慧女神持盾、愛神玫瑰
    花園、星空神諭祭司、黃金戰甲女神）+ 8組敦煌（敦煌飛天奏樂、藻井
    金頂光環、絲路商隊神女、洞窟壁畫供養人、反彈琵琶飛天、河畔獻禮
    神女、燈籠壁畫黃昏、焚香祭禮神女）。
  - **保持不變**：02構圖取景、03身形輪廓（BODY_SHAPES）、06服裝改造
    核心（V形開叉/珠寶鑲嵌/薄紗拼接等既有詞彙跟神話女神美學相容，
    不需重寫）、08鏡頭、09光影（既有的逆光光暈/月光燭火/星光冷藍等
    命名本來就偏通用神聖感，直接沿用）、12比例。
- **`assets/core-prompt.js` 新增 `ancientGoddessCore`**：Style Scope
  Rule 明確寫「ancient-civilization and mythological goddess fashion
  (Greco-Roman temple attire, Dunhuang mural apsara costume)」，並
  註冊進 `window.HB_CORE_PROMPT.page.ancientGoddess`。
- **`index.html`**：新卡片放進「奇幻世界觀寫真」分類（跟 xianxia／
  isekai／flower-fairy／battle 同組），新配色 `#CC8B52`（古銅/赤陶色，
  跟現有 10 種強調色都不重複）。
- **四支驗證腳本全數新增 ancient-goddess.html 支援並全過**：
  `check-static.mjs`（html 清單加入）、`validate-preset-refs.mjs`
  （新增 fieldLive 區塊，themeTemplates 16 筆全過）、`audit-100x.mjs`
  （新增 ANCIENT GODDESS 區塊，100 次模擬併入全站 1400 次總計 0
  issue）、`build-prompt-preview.mjs`（新增 `generateAncientGoddess()`
  + `loadRevision` try/catch 區塊，輸出 `ancientgoddess-default.txt`
  人工核對咒語組裝正確、身份鎖定完整）。

## 2026-08-02（二）　xianxia.html：服裝改造核心三區塊詞彙擴充，作為「9-layer」提案試點

- **背景**：owner 讀完 `docs/要素不被採用的.md` 後，提出一套「9-layer」服裝要素分類
  構想（服裝款式/胸口領口/肩部/腰部/裙身/材質/配件/背景/姿勢+光線），想知道能不能
  把這套抽象拿去套用在 Magazine、Fantasy、戰鬥制服學園、古風(xianxia)、旅遊五個頁面
  上共用。研究後發現材質/背景/姿勢/光線四層本來就已經是各頁獨立的完整選項池，服裝
  款式（`garmentData`）也已經是完整預設輪廓字串；唯一密度不夠的是「服裝改造核心」
  （`chestDetailData`/`waistSideDetailData`/`shoulderDetailData`）每區塊只有 8~9 個選項。
  owner 接著直接給出三個區塊各自的完整新選項清單（每區塊 20~30 個之間），指定先在
  xianxia.html（既有「古風」試點頁、且已內建這套 Layer 機制）落地驗證。
- **範圍調整**：owner 給的胸口清單裡含「深V剪裁」「超深V剪裁」兩項——這兩個詞在
  `docs/要素不被採用的.md` 三輪記錄裡都是「因裸露尺度被排除」的典型判定用語，且全站
  任何一頁的 `chestDetailData` 從未出現過這種強調曝光加深的詞彙（只有溫和的單一 V
  形鏤空）。這兩項未採納，其餘 23 項（含清單裡本來就有、跟既有 `vCutout` 同尺度的
  「V形開叉」）與腰側 18 項、肩部 19 項清單原樣採用。
- **改動範圍**：只整批替換三個 `xxxDetailData` JS 物件內容（8~9→19~23 個選項）與
  對應 HTML 06 區塊的 radio 卡片 markup；`GARMENT_DETAIL_LAYER_ZONES`、
  `applyFantasyRandomSelection()` 隨機抽選邏輯、`generate()` 組裝邏輯、`themeTemplates`
  完全不用改（選項池大小變動這些機制都是動態讀取，本來就會自動適應）。另外修正
  `scripts/build-prompt-preview.mjs` 的 `generateXianxia()` 固定範例（`chestDetail`/
  `shoulderDetail` 原本用的 `cloudCutout`/`capeletDrape` 這兩個 key 已被整批替換掉，
  改成新清單裡的 `archCutout`/`capeShoulderLine`）。
- **驗證**：四支驗證腳本全數重跑通過（`check-static`/`validate-preset-refs`
  （xianxia.html 17 組 themeTemplates 0 issue）/`audit-100x`（全站 1400 次模擬 0
  issue）/`build-prompt-preview`，並人工核對 `xianxia-default.txt` 產出正確帶入新的
  chest/shoulder 細節文字）。
- **後續**：這次改動範圍刻意只限定 xianxia.html 一頁，不擴散到其餘四個目標頁面——
  等這頁的組合密度與使用體驗驗證過後，再決定「9-layer」提案是否要推廣，以及要怎麼
  處理 Magazine/Travel 這兩頁跟其餘頁面不同的舊架構（`COSTUME_DIRECTIONS`/
  `POSE_STYLES`/巢狀 `DETAIL_BLOCKS`）落差。

## 2026-08-02（三）　服裝改造核心：9 頁胸口新增「胸口 V 形開叉鏤空」

- owner 明確指定在「06 服裝改造核心」的胸口區增加「胸口 V 形開叉鏤空」，
  並指定出圖咒語必須為 `a deep V-neck cutout exposing cleavage at the chest`。
- 套用範圍：目前全站含 `服裝改造核心` / `chestDetailData` 的 9 個出圖頁面：
  `xianxia.html`、`anime-character.html`、`flower-fairy.html`、
  `isekai-fantasy.html`、`floral-sweet.html`、`gala-socialite.html`、
  `ancient-goddess.html`、`kpop-idol.html`、`battle-academy.html`。
- 實作方式：不覆蓋既有溫和版 `V形開叉` / `vCutout` / `vSlitCutout`，
  另新增獨立 key `deepVChestCutout`；每頁皆同時補 HTML radio 卡片與
  `chestDetailData.deepVChestCutout`，確保手動選擇、隨機 Layer 抽選、
  模板套用後的 generate 組裝都走既有機制。
- **驗證**：`check-static.mjs` 全站 15 頁全過；`validate-preset-refs.mjs`
  全部預設/模板引用 0 issue；`audit-100x.mjs` 全站 14 組 generator 共
  1400 次模擬 0 issue；`build-prompt-preview.mjs` 正常產出
  `output/ab-test-2026-08-02`；`git diff --check` 無空白錯誤。
