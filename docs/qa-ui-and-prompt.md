# UI 與咒語回歸檢查

## 目的

這份文件是每次上線前的共同檢查契約，確認「畫面能選」「生成會採用」「一鍵設定不會
引用失效值」三件事同時成立。它補足單純 HTML 語法檢查看不到的互動與資料連動問題。

## 檢查範圍

目前共 18 個正式工具頁：

`travel.html`、`magazine.html`、`doll.html`、`fantasy-fashion.html`、`chinese-classical.html`、
`japanese-kimono.html`、`korean-hanbok.html`、`xianxia.html`、
`anime-character.html`、`flower-fairy.html`、`isekai-fantasy.html`、`store-ad.html`、
`floral-sweet.html`、`gala-socialite.html`、`kpop-idol.html`、`battle-academy.html`、
`ancient-goddess.html`、`editorial-identity.html`。

## 上線前命令

在專案根目錄執行：

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
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
- 旅拍、雜誌、幻想廣告、三個亞洲傳統服飾頁、花仙子與戰鬥學院的 CSS `order` 符合各自
  的決策順序契約，避免只改了 class 後畫面又回到舊順序。
- 中式古典、和服、韓服三頁的自訂欄位必須位於對應控制區：服裝 03、材質／紋樣 04A、姿勢 07、
  配色 09B、背景 10；08 僅允許畫面強度與其他要求，背景資料必須包含 `pureWhiteBackground`。
- 任何同時具備 `garmentChestVariation`、`garmentWaistVariation`、`garmentShoulderVariation`
  的頁面，都必須提供 `garmentLayer` 的 layer0／layer3／layer6／layer9／random 五個值、
  Layer 對照常數，以及保留已選部位後再補足未選部位的隨機邏輯。
- 編輯視覺設計必須有六個模板分類，數量固定為時尚編輯 6、美業廣告 4、動漫電玩 4、電影海報 7、
  寫真書 5、旅遊設計 5，總數 31；不得出現運動競技、犯罪、恐怖或心理驚悚模板。

## 咒語與一鍵契約

- 手動改選項後，既有輸出會標記 stale；重新生成前不可複製舊咒語。
- 旅拍、雜誌、幻想廣告的具名一鍵與隨機套用會同步寫入選項、立即生成並顯示結果。
- preset 的每個欄位值必須存在於當頁選項池；沒有對應值時驗證直接失敗，不允許靜默退回。
- 服裝改造、身形、編輯視覺處理等新增欄位必須同時存在於 UI、選取讀取、生成組裝與
  preset／隨機測試。
- Layer 只影響隨機套用，不得成為 Prompt 片段；使用者手動選取的胸口、腰側、肩部不得被
  隨機套用覆蓋。中式古典、和服、韓服模板的 Layer 顯示必須與實際啟用部位數一致。
- 生成輸出不得出現 `undefined`、`NaN`、`[object Object]`，身份鎖定與頁面必要核心
  guard 必須保留。
- `CORE_REALISTIC_ANATOMY` 的連續頭頸肩脊椎與非合成臉部約束，必須透過 `humanCore` 或
  `illustrationHumanCore` 進入正式頁生成輸出，不建立平行核心。

## 目前頁面順序基準

- 共同世界觀頁：版型／構圖 → 服裝輪廓 → 主題材質 → 服裝改造 → 身形 → 姿勢 →
  自訂 → 光影 → 背景 → 鏡頭 → 比例 → 生成。
- 中式古典美學：成品語氣 → 構圖 → 四組十五套服裝主題（漢風／盛唐／宋韻／新式古風） → 04A 材質／紋樣 → 04B 飾品 →
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

- UI flow contract：18 頁，0 issue。
- preset 引用驗證：0 issue。
- 隨機生成稽核：18 頁 × 100 組，共 1800 組，0 issue。
- 編輯視覺設計模板稽核：6 分類、31 組模板全部通過按鈕／資料池／生成輸出對照。
- 固定提示詞預覽：完成；結構與生成輸出可重建。
- `check-static.mjs` 與 `git diff --check`：完成。
- 瀏覽器煙霧檢查：六分類切換、31 組數量、模板套用、文字保留、桌機與手機版面、生成輸出與
  console error 均通過。

這是靜態與 Node `vm` 回歸檢查；若要確認瀏覽器實際像素、剪貼簿權限或 GitHub Pages
快取，仍需在發布後開啟線上入口做一次人工點擊確認。
