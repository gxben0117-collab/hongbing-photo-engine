# 工具頁分類與欄位契約

本文件定義 19 個正式工具頁的責任邊界、共用控制軸與內部欄位名稱。新增選項或一鍵模板前，先判斷頁面所屬家族，再沿用本契約；不要把某一頁的主題資料直接複製到其他家族。

## 版本與核心原則

- 目前契約版本：v4.38。
- 共用身份、臉部幾何、真人骨架、光線一致與負面限制仍由 `assets/core-prompt.js` 管理。
- 自訂要求只提供畫面方向；若輸入換臉、改臉、替換身份等語意，介面顯示提醒，生成仍以鎖臉核心為最高優先。
- 所有頁面均載入 `assets/core-prompt.js`；不建立逐頁平行鎖臉核心。

## 五個工具頁家族

### 1. 標準人像家族（15 頁）

頁面：

`magazine.html`、`fantasy-fashion.html`、`chinese-classical.html`、`japanese-kimono.html`、`korean-hanbok.html`、`xianxia.html`、`anime-character.html`、`flower-fairy.html`、`isekai-fantasy.html`、`floral-sweet.html`、`gala-socialite.html`、`bridal-editorial.html`、`kpop-idol.html`、`battle-academy.html`、`ancient-goddess.html`

共用控制：

- `camera`
- `ratio`
- `bodyShape`
- `garmentLayer`

主題頁可增加自己的服裝、材質、姿勢、背景與妝髮欄位，但不得移除共用控制。拍攝角度、圖片比例、身形與 Layer 的實作以幻想廣告頁為工程基準，主題專屬語彙仍由各頁保留。

例外：`battle-academy.html` 的制服輪廓使用 `waist`，服裝改造核心的腰側細節使用 `waistSideDetail`；這是兩個不同的控制軸，不是欄位不一致。

### 2. 寫真旅拍家族

頁面：`travel.html`

旅拍以地點、旅拍情境、行走動態、服裝與環境敘事為主。共用控制只有 `camera` 與 `ratio`，不強行加入標準人像的 `bodyShape` 或 `garmentLayer`。

### 3. 公仔轉換家族

頁面：`doll.html`

以公仔比例、材質與角色化轉換為主，沿用 `ratio`，其餘控制軸由公仔頁自己的轉換資料負責。不得把真人寫真頁的真人比例規則覆蓋到公仔模式。

### 4. 店家廣告家族

頁面：`store-ad.html`

以活動、品牌、文案與商品平面廣告為主。`ratio` 使用 `<select>`，可包含 `A4` 印刷比例；人物主體出現時才使用條件式身份核心。

### 5. 編輯視覺設計家族

頁面：`editorial-identity.html`

這是 Stage 2 原圖人物與平面設計的整合頁，核心是來源圖片鎖定、版型模板、文案與輔助圖形，不把它當作一般人像頁。`ratio` 使用設計版型需要的文字值。

## 正式內部欄位名稱

### 共用控制

| 功能 | 正式欄位名 | 備註 |
|---|---|---|
| 身形輪廓 | `bodyShape` | 例如 `original`、`slight_waist`、`curvy_waist` |
| 改造強度 | `garmentLayer` | `layer0`、`layer3`、`layer6`、`layer9`、`random` |
| 胸口細節 | `chestDetail` | 只改服裝表面／局部結構 |
| 腰側細節 | `waistSideDetail` | 只改服裝表面／局部結構 |
| 肩部細節 | `shoulderDetail` | 只改服裝表面／局部結構 |
| 拍攝角度 | `camera` | 以幻想廣告頁共用值為基準 |
| 圖片比例 | `ratio` | 優先使用人類可讀的文字比例值 |

舊名稱 `garmentChestVariation`、`garmentWaistVariation`、`garmentShoulderVariation`、`GARMENT_VARIATION_LAYER_ZONES`、`GARMENT_VARIATION_RANDOM_POOLS` 不再用於正式頁與正式腳本。

## 比例值契約

標準人像與旅拍／雜誌共用以下文字值：

`9:16`、`4:5`、`1:1`、`2:3`、`3:4`、`16:9`、`4:3`、`21:9`

比例值本身是資料鍵，生成時再透過 `window.HB_CANONICAL_RATIO_PROMPTS` 轉成描述文字。這樣模板、隨機抽選、UI radio 與 Prompt 不會再同時維護 `vertical916`、`vertical45` 這類第二套 ID。

家族專用補充值：

- `store-ad.html` 可使用 `A4`。
- `editorial-identity.html` 可使用 `3:2`、`2:1` 等平面設計版型比例。

## Layer 行為

`garmentLayer` 只控制「隨機套用」要補足幾個尚未手動選取的服裝部位：

- `layer0`：0 個部位
- `layer3`：約 1 個部位
- `layer6`：約 2 個部位
- `layer9`：3 個部位
- `random`：連同強度一起重新抽選

手動選取的 `chestDetail`、`waistSideDetail`、`shoulderDetail` 不會被隨機套用覆蓋。Layer 本身不應額外輸出成長篇 Prompt，只決定資料選擇。

## 自訂要求與鎖臉提示

`assets/core-prompt.js` 會在 DOM ready 後尋找 `custom*` 輸入欄位，以及 `extraNote`、`colorNote`、`customStyling`，並加入即時提示。這是提醒，不會擅自刪除使用者文字。

提示觸發的語意包括換臉、改臉、替換身份、改成另一個人等。正向生成仍會由共用身份與臉部幾何核心優先處理；自訂文字只能改變服裝、姿勢、光線、背景、構圖或其他畫面設計方向。

## 驗收命令

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
node scripts\validate-preset-refs.mjs
node scripts\build-prompt-preview.mjs
node scripts\audit-100x.mjs
git diff --check
```

瀏覽器回歸需覆蓋 19 頁的：初始值、生成、複製、一鍵模板、隨機套用、自訂警示，以及桌面與 390px 手機寬度下的水平溢位檢查。
