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

## 咒語與一鍵契約

- 手動改選項後，既有輸出會標記 stale；重新生成前不可複製舊咒語。
- 旅拍、雜誌、幻想廣告的具名一鍵與隨機套用會同步寫入選項、立即生成並顯示結果。
- preset 的每個欄位值必須存在於當頁選項池；沒有對應值時驗證直接失敗，不允許靜默退回。
- 服裝變化、身形、編輯視覺處理等新增欄位必須同時存在於 UI、選取讀取、生成組裝與
  preset／隨機測試。
- 生成輸出不得出現 `undefined`、`NaN`、`[object Object]`，身份鎖定與頁面必要核心
  guard 必須保留。

## 目前頁面順序基準

- 共同世界觀頁：版型／構圖 → 服裝輪廓 → 主題材質 → 服裝變化 → 身形 → 姿勢 →
  自訂 → 光影 → 背景 → 鏡頭 → 比例 → 生成。
- 中式古典美學：成品語氣 → 構圖 → 四組十五套服裝主題（漢風／盛唐／宋韻／新式古風） → 04A 材質／紋樣 → 04B 飾品 →
  服裝變化 → 身形 → 姿勢 → 自訂 → 09A 光影 → 09B 色彩 → 10A 背景 → 10B 留白 →
  鏡頭 → 比例 → 生成；材質最多 2 個、飾品單選。
- 日本和服美學：成品語氣 → 構圖 → 日本和服主題 → 材質／紋樣 → 和風飾品 → 服裝變化 →
  身形 → 姿勢 → 自訂 → 光影 → 色彩 → 背景 → 留白 → 鏡頭 → 比例 → 生成。
- 韓國韓服美學：成品語氣 → 構圖 → 韓國韓服主題 → 材質／紋樣 → 韓服飾品 → 服裝變化 →
  身形 → 姿勢 → 自訂 → 光影 → 色彩 → 背景 → 留白 → 鏡頭 → 比例 → 生成。
- 寫真旅拍：主風格與地點／旅拍情境提前，再進入構圖、服裝、姿勢與攝影控制。
- 雜誌棚拍：封面成品類型與主題／服裝方向提前，妝容、膚質、配飾與光線集中在封面
  細節區。
- 戰鬥學院：學校身份、制服類型、裝甲模組先於一般服裝變化核心。
- 編輯視覺設計：版型、字體、圖形、色彩、影像處理、印刷質感，再接人物版位、留白、
  語言、文字自填與比例。

## 2026-08-03 回歸結果

- UI flow contract：18 頁，0 issue。
- preset 引用驗證：0 issue。
- 隨機生成稽核：18 頁 × 100 組，共 1800 組，0 issue。
- 固定提示詞預覽：完成；結構與生成輸出可重建。
- `check-static.mjs` 與 `git diff --check`：完成。

這是靜態與 Node `vm` 回歸檢查；若要確認瀏覽器實際像素、剪貼簿權限或 GitHub Pages
快取，仍需在發布後開啟線上入口做一次人工點擊確認。
