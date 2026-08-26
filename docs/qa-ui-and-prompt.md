# UI 與咒語回歸檢查

## 目的

這份文件是每次上線前的共同檢查契約，確認「畫面能選」「生成會採用」「一鍵設定不會
引用失效值」三件事同時成立。它補足單純 HTML 語法檢查看不到的互動與資料連動問題。

## 2026-08-22 v4.48 全站核心與生成輸出回歸

- `CORE_REALISTIC_ANATOMY`、身份鎖定、臉部幾何與光線一致核心均保留；標準人物頁的負面段落只保留未由骨架涵蓋的身份漂移、獨立打光、文字與水印限制。
- `store-ad.html` 的人物主視覺仍使用完整 `CORE_PERSON_HERO_NEGATIVE_PROMPT`；非人物海報不會無條件加入人像限制。
- Luxury Lifestyle 標準 Prompt 為 7,042 字元，`Final identity priority`、`oversized head`、`extra limbs`、`warped anatomy` 各 1 次；沒有重複附加全域負面核心。
- 固定 Prompt 預覽已修正戰鬥學院腰線欄位錯接，並新增 runtime value guard；所有 36 份 worktree 預覽均無 `undefined`、`NaN`、`null` 或 `[object Object]`。
- 靜態、UI flow、DOM 順序、preset 引用、固定預覽、20 頁 × 100 組隨機稽核與 `git diff --check` 全部通過，0 issue。

## 2026-08-22 v4.47 Luxury Lifestyle 獨立頁回歸

- `luxury-lifestyle.html` 已加入首頁、共用身份核心、標準 camera／ratio／body／Layer／pose 契約與所有回歸腳本。
- Luxury Lifestyle 的 10 組一鍵模板完整回填生活場景、服裝、改造 Layer、身形、姿勢、生活互動、光影、配色、鏡頭、比例與強度。
- `magazine.html` 不再含有 Luxury Lifestyle 公寓模板或其執行資料；新頁只沿用共用核心組裝方式，不引用雜誌主題資料。
- `check-static.mjs`、`check-ui-flows.mjs`、`validate-preset-refs.mjs`、`build-prompt-preview.mjs`、`audit-100x.mjs` 與 `git diff --check` 通過；20 頁 × 100 組，共 2,000 組隨機模擬，0 issue。

## 2026-08-04 v4.44 全站主題語彙與 DOM 順序回歸

- 9 個主題頁的強度 select 與一鍵模板均通過主題詞契約；不再使用跨主題的 `material effects`、`material splash`、
  `floating particles` 等泛用強度句。
- 13 頁 section 已按實際 DOM 順序排列；`scripts/reorder-dom-sections.mjs --check` 通過，未改動公仔頁的特殊結構。
- 第 6 項選項分級顯示保持原樣；19 頁 radio、checkbox、option 與 `data-choice` 數量和基準版本一致。
- `check-ui-flows.mjs` 同時檢查 DOM 順序、主題強度契約、Layer／模板連動與鎖臉核心引用。

## 2026-08-04 v4.43 編輯視覺設計 Stage 2 回歸

- 手動版型由 31 個模板型選項整理為 14 個結構家族；31 組一鍵模板仍逐組回填並通過引用驗證。
- 新增「無主圖形」，移除重複的照片黑白色彩控制與多組等效印刷質感；照片色調統一由影像處理控制。
- 編輯頁改用專屬來源照片鎖定：只允許文字、圖形、版面與非破壞性整體色調覆蓋，禁止補畫景別、人物、服裝、姿勢、背景與事實資料。
- `check-ui-flows.mjs` 新增編輯頁 00～15 的實際視覺順序契約；`audit-100x.mjs` 仍覆蓋全站 19 頁、1,900 組模擬。

## 2026-08-04 v4.42 婚紗 Prompt 預算回歸

- 婚紗頁只壓縮重複的精品完成度、材質與負面限制段；身份、臉部幾何、真人骨架、姿勢、光線與構圖核心不可因字數優化而縮減。
- `build-prompt-preview.mjs` 的三份婚紗基準輸出必須低於 9,000 字元；標準、黑金、珍珠灰目前為 8,870、8,899、8,780。
- `audit-100x.mjs` 以 `High-end bridal editorial` 驗證婚紗專屬精品核心仍進入每份隨機組合。

## 2026-08-04 v4.41 色彩系統回歸

- 五個已有獨立色彩系統的頁面均提供至少 5 組主題搭配色與 `aiThemeScenePalette`。
- AI 配色選項會輸出主題／服裝／材質／光線／背景相依的配色判斷要求；自訂配色仍優先覆蓋選項。
- 鎖臉核心、臉部幾何與真人骨架核心未新增平行分支，也不受色彩選項改寫。

## 檢查範圍

目前共 20 個正式工具頁：

`travel.html`、`magazine.html`、`luxury-lifestyle.html`、`doll.html`、`fantasy-fashion.html`、`chinese-classical.html`、
`japanese-kimono.html`、`korean-hanbok.html`、`xianxia.html`、
`anime-character.html`、`flower-fairy.html`、`isekai-fantasy.html`、`store-ad.html`、
`floral-sweet.html`、`gala-socialite.html`、`kpop-idol.html`、`battle-academy.html`、
 `bridal-editorial.html`、
`ancient-goddess.html`、`editorial-identity.html`。

## 上線前命令

在專案根目錄執行：

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
node scripts\reorder-dom-sections.mjs --check
node scripts\validate-preset-refs.mjs
node scripts\audit-100x.mjs
node scripts\build-prompt-preview.mjs
git diff --check
```

## UI 契約

`check-ui-flows.mjs` 會逐頁確認：

- 生成按鈕、複製按鈕與輸出區存在，且生成邏輯確實寫入輸出區。
- 每個 radio 群組都有初始選擇；多選欄位則確認每個 checkbox 的 name 都能被讀取。
- `selected()`、`getAllRadioValues()`、`setRadioValue()`、`setSelectedCardValue()` 等
  helper 引用的控制項確實存在。
- `data-choice`、`getElementById()` 與資料欄位沒有指向不存在的 DOM id。
- 具名一鍵按鈕的 `data-template`、旅拍／雜誌 preset key 都存在於實際資料物件。
- 中式古典頁固定有 26 組一鍵模板，並分成「朝代古典」「新式改良」「唯美古風寫真」「青春古風寫真」「精品主視覺」五組；唯美古風與青春古風模板不得把人物姓名或仙俠／西式幻想語彙寫入正向 Prompt。
- 旅拍、雜誌、幻想廣告、三個亞洲傳統服飾頁、花仙子與戰鬥學院的 section DOM 順序符合各自
  的決策順序契約；CSS 只負責樣式，不再作為唯一的畫面排序來源。
- 中式古典、和服、韓服三頁的自訂欄位必須位於對應控制區：服裝 03、材質／紋樣 04A、姿勢 07、
  配色 09B、背景 10；08 僅允許畫面強度與其他要求，背景資料必須包含 `pureWhiteBackground`。
- 任何同時具備 `chestDetail`、`waistSideDetail`、`shoulderDetail` 的頁面，都必須提供同一組
  Layer 值、`GARMENT_DETAIL_LAYER_ZONES`、主題專屬 `GARMENT_DETAIL_RANDOM_POOLS`，並透過
  `assets/garment-core.js` 的共用 helper 保留手動部位、只補未選區域；每個主題專屬 key 必須同時
  出現在 UI、英文資料、隨機池與至少一組代表模板或資料契約中。
- 編輯視覺設計必須有六個模板分類，數量固定為時尚編輯 6、美業廣告 4、動漫電玩 4、電影海報 7、
  寫真書 5、旅遊設計 5，總數 31；不得出現運動競技、犯罪、恐怖或心理驚悚模板。
- 首頁與主題頁的可見文案必須符合主題契約：材質區標題、服裝示例、坐姿情境與首頁工具數量
  不得沿用其他主題的泛用文字或過時資料。

### 幻想廣告共用控制契約

幻想廣告頁是正式人像工具的共同工程範本。下列 16 個人像頁必須共享同一組控制值，主題只能在
後面追加自己的選項，不得改寫共同值：

`travel.html`、`magazine.html`、`fantasy-fashion.html`、`chinese-classical.html`、
`japanese-kimono.html`、`korean-hanbok.html`、`xianxia.html`、`anime-character.html`、
`flower-fairy.html`、`isekai-fantasy.html`、`floral-sweet.html`、`gala-socialite.html`、
`bridal-editorial.html`、`kpop-idol.html`、`battle-academy.html`、`ancient-goddess.html`。

- `拍攝角度與鏡頭感` 共用自然平視、低角度仰拍、高角度俯拍、柔焦光感、近距離美妝感、
  側臉輪廓感、斜側角度、高角度近景、遠距主視覺 9 組 canonical values。
- `圖片比例` 共用 9:16、4:5、1:1、2:3、3:4、16:9、4:3、21:9 8 組比例；UI、模板、
  隨機資料與生成函式都直接使用這些可讀的文字值，不再維護第二套比例 ID。
- 17 個有人物姿勢控制的頁面都必須提供 `pose=auto`，可見文案需表達「AI 判斷配合主題的最佳姿勢」，
  並由 `HB_CORE_PROMPT.controls.autoPose` 或該頁的等價資料映射實際進入生成咒語；具名姿勢與自訂姿勢
  選取後不得再疊加 auto 指令。
- `身形輪廓` 與 `改造強度 Layer` 在具備服裝三區改造的人像頁共用 5 組身形與
  `layer0`／`layer3`／`layer6`／`layer9`／`random`；Layer 只控制隨機套用的改造部位數。
- `構圖取景` 的共同人像頁沿用幻想頁的主圖／偏側留空／材質包圍／斜線動態／對稱儀式／
  前景框景等版型；中國、和服、韓服、婚紗、旅拍與雜誌可保留文化、婚紗、旅拍或封面專屬構圖，
  但不應因此改動上述鏡頭、比例、身形與 Layer 契約。
- `生成咒語` 必須把目前選取值實際組入輸出；一鍵模板、隨機套用與手動選取都使用同一組資料映射。

明確例外：`doll.html` 是公仔比例工具，`store-ad.html` 是商品廣告工具，
`editorial-identity.html` 是平面編輯設計工具；三頁不屬於真人人像共用控制契約，保留各自領域欄位。
其中 `doll.html` 仍有自己的公仔姿勢控制與 auto 選項；`store-ad.html` 與 `editorial-identity.html`
沒有獨立人物姿勢控制，後者更必須保留來源照片的原始姿勢。

## 咒語與一鍵契約

- 婚紗藝術寫真頁固定有 12 組一鍵模板；每組必須完整回填婚紗、材質、頭紗、配件、妝髮、姿勢、光影、背景、鏡頭與比例。覆面頭紗只能手動選擇，不進一般隨機池。
- 婚紗頁的頭紗身份保護只在選擇頭紗時追加，無頭紗時不得輸出 veil 保護段落；構圖留白不得生成文字。

- 手動改選項後，既有輸出會標記 stale；重新生成前不可複製舊咒語。
- 旅拍、雜誌、幻想廣告的具名一鍵與隨機套用會同步寫入選項、立即生成並顯示結果。
- preset 的每個欄位值必須存在於當頁選項池；沒有對應值時驗證直接失敗，不允許靜默退回。
- 服裝改造、身形、編輯視覺處理等新增欄位必須同時存在於 UI、選取讀取、生成組裝與
  preset／隨機測試。
- Layer 只影響隨機套用，不得成為 Prompt 片段；使用者手動選取的胸口、腰側、肩部不得被
  隨機套用覆蓋。中式古典、和服、韓服模板的 Layer 顯示必須與實際啟用部位數一致。
- 服裝改造三區的完全相同英文片段只保留一次；`none` 不輸出片段，主題專屬隨機池不得跨頁抽取。
- 生成輸出不得出現 `undefined`、`NaN`、`[object Object]`，身份鎖定與頁面必要核心
  guard 必須保留。
- `CORE_REALISTIC_ANATOMY` 的連續頭頸肩脊椎與非合成臉部約束，必須透過 `humanCore` 或
  `illustrationHumanCore` 進入正式頁生成輸出，不建立平行核心。

## 目前頁面順序基準

- 婚紗藝術寫真：成品語氣 → 構圖 → 婚紗輪廓 → 工藝材質 → 服裝改造 → 頭紗配件 → 身形 → 姿勢 → 妝髮膚質 → 光影配色 → 背景 → 自訂 → 鏡頭 → 比例 → 生成。
- 婚紗頁採單人新娘範圍；不得由模板或隨機套用加入新郎、伴郎、伴娘或第二位人物。

- 共同世界觀頁：版型／構圖 → 服裝輪廓 → 主題材質 → 服裝改造 → 身形 → 姿勢 →
  自訂 → 光影 → 背景 → 鏡頭 → 比例 → 生成。
- 中式古典美學：成品語氣 → 構圖 → 四組十九套服裝主題（漢風／盛唐／宋韻／唯美古風） → 04A 材質／紋樣 → 04B 飾品 →
  服裝改造 → 身形 → 姿勢 → 自訂 → 09A 光影 → 09B 色彩 → 10 背景 →
  鏡頭 → 比例 → 生成；材質最多 2 個、飾品單選。
- 日本和服美學：成品語氣 → 構圖 → 日本和服主題 → 材質／紋樣 → 和風飾品 → 服裝改造 →
  身形 → 姿勢 → 自訂 → 光影 → 色彩 → 背景 → 鏡頭 → 比例 → 生成。
- 韓國韓服美學：成品語氣 → 構圖 → 韓國韓服主題 → 材質／紋樣 → 韓服飾品 → 服裝改造 →
  身形 → 姿勢 → 自訂 → 光影 → 色彩 → 背景 → 鏡頭 → 比例 → 生成。
- 寫真旅拍：主風格與地點／旅拍情境提前，再進入構圖、服裝、姿勢與攝影控制。
- 雜誌棚拍：封面成品類型與主題／服裝方向提前，妝容、膚質、配飾與光線集中在封面
  細節區。
- 戰鬥學院：學校身份、制服類型、裝甲模組先於一般服裝改造核心。
- 編輯視覺設計：一鍵模板 → 版型 → 人物版位 → 字體 → 文案語氣 → 文字自填 → 語言 →
  主圖形／輔助標記 → 色彩 → 影像處理 → 印刷質感 → 留白 → 比例 → 其他要求 → 生成；
  模板套用必須完整回填上述控制軸，且只做來源照片上的非破壞性平面設計。

## 2026-08-03 回歸結果

- UI flow contract：19 頁，0 issue。
- preset 引用驗證：0 issue。
- 隨機生成稽核：19 頁 × 100 組，共 1900 組，0 issue。
- 服裝改造主題契約：15 頁，UI／資料／隨機池／代表模板與共用 helper 全部通過。
- 編輯視覺設計模板稽核：6 分類、31 組模板全部通過按鈕／資料池／生成輸出對照。
- 固定提示詞預覽：完成；結構與生成輸出可重建。
- `check-static.mjs` 與 `git diff --check`：完成。
- 瀏覽器煙霧檢查：六分類切換、31 組數量、模板套用、文字保留、桌機與手機版面、生成輸出與
  console error 均通過。
- 介面文案回歸：首頁 19 張工具卡、19 個正式工具頁的主題文案與手機版長提示均通過，無水平
溢出、無 console error/warning。

這是靜態與 Node `vm` 回歸檢查；若要確認瀏覽器實際像素、剪貼簿權限或 GitHub Pages
 快取，仍需在發布後開啟線上入口做一次人工點擊確認。

## 2026-08-04 v4.40 回歸結果

- 四個目標頁的共用精品成像模組均已載入，實際生成組合包含 `High-budget editorial campaign production`，
  並保留頁面原有身份／骨架／文化主題核心。
- 中式古典頁新增的 3 組畫面語氣、5 組姿勢、精品光影／配色選項與 7 組新增模板均通過 UI、資料池、
  一鍵套用與 Prompt 預覽引用檢查；模板總數為 25 組。
- `check-static.mjs`、`check-ui-flows.mjs`、`validate-preset-refs.mjs`、`build-prompt-preview.mjs`、
  `audit-100x.mjs 100`、`git diff --check` 全部通過。
- 全站 19 頁 × 100 組，共 1900 組隨機模擬，0 issue；未發現 `undefined`、`NaN`、`null`、身份核心遺失、
  相鄰重複行或四頁精品核心漏接。

## 2026-08-04 v4.37 回歸結果

- 共用核心已加入 `CORE_FINAL_IDENTITY_PRIORITY`；正式人像輸出在自訂內容後均可找到最終身份保護，公仔頁的
  明確公仔化例外不套用這條攝影身份尾端規則。
- 婚紗隨機 Layer 不再強制改成 random；隨機材質至少保留一項，透明面紗仍排除於一般隨機池。
- 幻想、仙俠、雜誌、中式古典、日本和服、韓國韓服與婚紗的身形／身份重複片段已精簡，指定的
  `Japanese Curvy Slim-Waist Adult Female Silhouette` 保留。
- `check-static.mjs`、`check-ui-flows.mjs`、`validate-preset-refs.mjs`、`build-prompt-preview.mjs`、
  `audit-100x.mjs`、`git diff --check` 全部通過；19 頁共 1900 組隨機模擬，0 issue。

## 2026-08-04 v4.36 回歸結果

- 幻想廣告控制契約已納入 `check-ui-flows.mjs`：16 個人像頁共同檢查鏡頭、比例；15 個具服裝
  三區改造頁另外檢查身形與 Layer。
- 婚紗頁已移除 `85mm 婚紗人像`，模板與固定 Prompt 預覽不再引用 `bridal85mm`。
- 婚紗 05 服裝改造核心改為胸口／腰側／肩部三欄響應式網格，桌機三欄、平板兩欄、手機單欄，
  每個部位的選項與自填欄位保持在自己的區塊內。
- 舊 preset 的鏡頭／身形 ID 由驗證器以 canonical alias 驗證並由頁面 setter 正規化，避免歷史模板
  靜默失效；新 UI 不再建立舊值。
- `check-static.mjs`、`check-ui-flows.mjs`、`validate-preset-refs.mjs`、`build-prompt-preview.mjs`、
  `audit-100x.mjs` 全部通過；19 頁共 1900 組隨機模擬，0 issue。
