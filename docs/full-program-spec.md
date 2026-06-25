# 詳細程式規格邏輯文件說明書

用途：如果本專案五個工具頁程式碼遺失，可將本文件交給 AI，依照此規格重新建立可運作的靜態網站。

本文件不是使用者教學，而是重建規格。重建時要優先遵守「底層保護核心」、「資料結構」、「UI 欄位」、「咒語組裝順序」。

---

## 1. 專案總覽

### 1.1 專案型態

本專案是純靜態 HTML 網站，直接由 GitHub Pages 從根目錄部署。

不得預設存在 React、Vue、Vite、Next.js、Tailwind、npm build 或 Python 後端。

### 1.2 必要檔案

```text
index.html
travel.html
magazine.html
doll.html
fantasy-fashion.html
store-ad.html
README.md
.gitignore
.gitattributes
scripts/check-static.mjs
docs/
assets/
output/.gitkeep
temp/.gitkeep
```

### 1.3 五個工具頁

1. `travel.html`：寫真旅拍風格咒語產生器
2. `magazine.html`：雜誌棚拍風格咒語產生器
3. `doll.html`：公仔萌工作室
4. `fantasy-fashion.html`：幻想廣告咒語產生器
5. `store-ad.html`：店家活動廣告產生器

`index.html` 是入口導覽頁，不算工具頁。

---

## 2. 全站共同規格

### 2.1 UI 技術

- 每頁皆為單一 HTML 檔。
- CSS 寫在 `<style>`。
- JavaScript 寫在頁尾 `<script>`。
- 不依賴外部套件。
- 使用繁體中文 UI。
- JS key 使用英文或穩定 snake/camel case。
- 最終咒語主要使用英文 prompt，必要時可保留中文段落標題。

### 2.2 頁面共同結構

每頁應有：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>頁面名稱｜寫真引擎</title>
  <meta name="description" content="...">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta name="twitter:title" content="...">
  <meta name="twitter:description" content="...">
</head>
<body>
  <nav>...</nav>
  <div class="wrap">...</div>
  <script>...</script>
</body>
</html>
```

### 2.3 導覽列

所有頁面都有固定導覽列：

- 首頁：`index.html`
- 寫真旅拍：`travel.html`
- 雜誌棚拍：`magazine.html`
- 公仔系列：`doll.html`
- 幻想廣告：`fantasy-fashion.html`
- 店家廣告：`store-ad.html`

目前品牌文字使用：`寫真引擎`。

禁止恢復舊品牌字：

- `藍寶寫真引擎`
- `藍寶 AI`
- `紅兵`

例外：幻想廣告的材質範例可保留 `藍寶石能量`，因為這是材質名詞，不是品牌字。

### 2.4 按鈕與輸出

每個工具頁必須有：

- `generateBtn`：生成按鈕
- `copyBtn`：複製按鈕
- 輸出區：
  - `travel.html`、`magazine.html`、`doll.html` 使用 `outputText` textarea
  - `fantasy-fashion.html`、`store-ad.html` 可使用 `output` pre/div

複製後按鈕文字應短暫變成 `已複製` 或等價文案，再恢復。

### 2.5 Card / Chip 互動

常見 UI 元件：

- `.card`：單選卡片，內含 radio input。
- `.chip`：較小的單選或複選項。
- `.selected`：目前選取狀態。

單選卡片點擊後：

1. 同群組其他卡片移除 `.selected`
2. 當前卡片加入 `.selected`
3. 對應 input checked = true

複選 chip 應支援上限與排他值，例如雜誌棚拍：

- 妝容最多 2 個，`原圖一致` 與其他妝容互斥。
- 珠寶最多 2 個，`無` 與其他珠寶互斥。

---

## 3. 底層保護核心

以下核心主要適用：

- `travel.html`
- `magazine.html`
- `fantasy-fashion.html`

公仔頁也要保留身份來源，但可允許 Q 版化；店家廣告頁不以人像身份保護為主。

### 3.1 優先順序

咒語組裝時，永遠先放保護核心，再放風格效果。

優先順序：

1. 身份鎖定
2. 臉部幾何鎖定
3. 頭身協調與人體自然性
4. 姿態自然性
5. 全局光線一致
6. 人物與場景融合
7. 外層風格、服裝、材質、場景、廣告效果

### 3.2 身份鎖定必要語意

```text
Use the uploaded person as the only subject.
Use the reference photo for identity only.
Same person face, same facial identity.
Identity Recognition Priority Maximum.
Recognizable By Family And Friends At First Sight.

No face swap.
No AI beauty template face.
No celebrity face.
No influencer face.
No identity drift.
```

### 3.3 臉部幾何鎖定必要語意

```text
Facial Geometry Lock System
Preserve Original Forehead Height
Preserve Original Face Width
Preserve Original Eye Shape
Preserve Original Eye Distance
Preserve Original Nose Shape
Preserve Original Nose Width
Preserve Original Nose Bridge
Preserve Original Lip Shape
Preserve Original Jawline Width
Preserve Original Chin Shape

No Facial Reconstruction
No Facial Redesign
No Facial Beautification
No Facial Stylization

Identity Preservation Priority Above Costume
Identity Preservation Priority Above Materials
Identity Preservation Priority Above Environment
Identity Preservation Priority Above Advertising Style
```

### 3.4 頭身協調必要語意

```text
Head Neck Shoulder Spine Alignment Must Be Anatomically Coherent.
Face And Head Must Belong Naturally To The Same Body Pose.
Pose Must Match Head Direction And Facial Gaze.
No Contradictory Head And Body Direction.
No pasted-on face.
No mismatched head and body angle.
No twisted neck.
```

### 3.5 全局光線一致必要語意

```text
Global Lighting Consistency
Subject And Environment Share The Same Light Source
Face Lighting Must Match Body Lighting
Single Global Lighting Environment
Same Light Direction Across Face Body Hair Clothing And Background
Physically Accurate Light Interaction
Environmental Lighting Affects Entire Subject
Face Body Hair Costume Background Rendered Under The Same Lighting Conditions
Lighting Consistency Priority Maximum

No Independent Beauty Light
No Face Relighting
No Separate Portrait Lighting
No Detached Portrait Lighting
No Floating Subject Effect
```

---

## 4. 首頁 `index.html`

### 4.1 功能

首頁只做導覽，不生成咒語。

### 4.2 必要內容

- 固定 nav
- hero 區
- 五個工具入口卡片
- footer

### 4.3 工具入口

至少包含：

- 寫真旅拍
- 雜誌棚拍
- 公仔系列
- 幻想廣告
- 店家廣告

---

## 5. 寫真旅拍 `travel.html`

### 5.1 目的

依上傳人物參考照與旅拍主題，生成真人旅拍、電影感、地點感、雜誌旅遊感的英文咒語。

重點：

- 同一人身份
- 頭身協調
- 旅拍現場感
- 人物與環境光線一致
- 地點與人物自然融合

### 5.2 UI 流程

建議欄位：

1. 構圖模組
2. 選擇旅拍風格
3. 旅拍地點 / 主題
4. 圖片比例
5. 鏡頭語感
6. 光影色彩
7. 動態節奏
8. 輸出風格 / 畫面媒材
9. 生成咒語

可保留一鍵隨機：

- `隨機套用｜旅拍動感感覺`

### 5.3 必要資料常數

```js
const CORE = { identity, skeleton, pose, lighting, photographer, cleanframe, output };
const COMPOSITION = {};
const STYLES = {};
const MEDIA_STYLES = {};
const RATIOS = {};
const CAMERA_ANGLES = {};
const TRAVEL_LIGHTING_STYLES = {};
const MOTION_LEVELS = {};
const TRAVEL_STYLE_PRESET_DEFAULTS = {};
```

### 5.4 生成順序

`sections` 應依序組裝：

1. `CORE.identity`
2. `CORE.skeleton`
3. `CORE.lighting`
4. `CORE.pose`
5. `CORE.photographer`
6. 選中的 `TRAVEL_LIGHTING_STYLES`
7. 選中的 `CAMERA_ANGLES`
8. 選中的 `MOTION_LEVELS`
9. 選中的 `COMPOSITION`
10. 主風格 `STYLES`
11. 輸出媒材 `MEDIA_STYLES`
12. 主題
13. 服裝邏輯
14. `CORE.cleanframe`
15. `CORE.output`
16. 圖片比例

段落之間用：

```text

⸻

```

### 5.5 重要規則

- `lighting` 必須早於風格與服裝。
- 全身與遠景構圖必須保留身份可辨識。
- 不要用 `Bright Face Illumination` 這類會變成美顏燈的語意。
- 使用 `Face Visible Without Breaking Scene Lighting`、`Natural Facial Exposure`、`Subject And Environment Share The Same Light Source`。

---

## 6. 雜誌棚拍 `magazine.html`

### 6.1 目的

生成高級雜誌封面、棚拍、人像大片、美妝、珠寶、時裝廣告咒語。

重點：

- 參考人物身份穩定
- 棚拍光線一致
- 封面構圖
- 美妝與珠寶細節
- 姿態與頭身自然

### 6.2 UI 流程

欄位：

0. 一鍵組合
1. 版面情境
2. 主題 / 服裝方向
3. 身形輪廓
4. 背景設定
5. 姿態模組
6. 人物入鏡比例
7. 鏡頭語感
8. 動態節奏
9. 封面細節
10. 圖片比例
11. 輸出風格 / 畫面媒材
12. 生成咒語

### 6.3 一鍵組合

必須是「填好預設，但不鎖死」。

目前建議保留：

- 黑金高訂美妝特寫
- 珠寶冷光封面
- 夢幻香氛柔霧
- 極簡白襯衫封面
- 未來銀色冷感
- 紅毯高訂全身

資料常數：

```js
const QUICK_MAGAZINE_PRESETS = {
  blackGoldBeauty: {},
  jewelryCoolCover: {},
  perfumeMistCover: {},
  minimalWhiteShirt: {},
  futureSilverCool: {},
  redCarpetCouture: {}
};
```

套用時：

1. 呼叫 `applyVisualPresetDefaults(preset)`
2. 將主題輸入框設為 `preset.label`
3. dispatch input event
4. 不禁用任何欄位

### 6.4 必要資料常數

```js
const CORE = {};
const STYLES = {};
const BACKGROUNDS = {};
const POSES = {};
const CAMERAS = {};
const MOTION_LEVELS = {};
const DETAIL_BLOCKS = { makeup, skinTexture, jewelry, expression, lighting };
const MEDIA_STYLES = {};
const RATIOS = {};
const BODY_SHAPES = {};
const FRAMING_RATIOS = {};
const BG_LIGHTING_MAP = {};
const STYLE_PRESET_DEFAULTS = {};
const THEME_PRESET_DEFAULTS = {};
const POSE_THEME_MAP = {};
```

### 6.5 生成順序

`sections` 應依序包含：

1. `CORE.identity`
2. `CORE.skeleton`
3. `MAGAZINE_LIGHTING_CONSISTENCY`
4. `MAGAZINE_SUBJECT_INTEGRATION`
5. `MAGAZINE_FACE_FILL`
6. 版面情境 style block
7. 主題 / 服裝方向
8. 身形輪廓
9. 背景
10. 姿態
11. 入鏡比例
12. 鏡頭
13. 動態
14. 妝容
15. 膚質
16. 珠寶
17. 表情
18. 光線類型
19. 封面構圖 / 封面光影
20. 輸出媒材
21. 圖片比例
22. clean frame / output quality

核心原則：身份、骨架、光線一致與人物融合必須在前面。

### 6.6 封面細節規則

- `makeup` 最多 2 個。
- `original` 妝容與其他妝容互斥。
- `jewelry` 最多 2 個。
- `none` 珠寶與其他珠寶互斥。
- lighting 是單選。
- skinTexture 是單選卡片。

---

## 7. 公仔萌工作室 `doll.html`

### 7.1 目的

將人物或主題轉成 Q 版、公仔、手辦、黏土、玩具攝影等風格咒語。

重點：

- 可愛化 / 公仔化
- 仍保留身份來源
- 允許比例 Q 版化
- 加入展示底座、髮型、表情、姿勢、媒材

### 7.2 UI 流程

主要欄位：

1. 風格強度
2. 主題靈感
3. 構圖
4. 輸出媒材
5. 圖片比例
6. 進階選項
7. 生成公仔咒語

進階選項：

- 髮型
- 表情
- 姿勢
- 展示底座

進階選項都應可選 `auto`。

### 7.3 必要資料常數

```js
const CORE_IDENTITY = ``;
const CORE_BODY = ``;
const STYLES = {};
const COMPOSITIONS = {};
const POSES = {};
const BASES = {};
const MEDIA_STYLES = {};
const RATIOS = {};
const DOLL_STYLE_PRESET_DEFAULTS = {};
```

### 7.4 生成順序

1. `CORE_IDENTITY`
2. `CORE_BODY`
3. 風格強度
4. 主題設定
5. 構圖
6. 輸出媒材
7. 髮型
8. 表情
9. 姿勢
10. 展示底座
11. 圖片比例
12. 品質與禁止事項

### 7.5 特殊規則

- 公仔頁允許 Q 版、可愛化、PVC、黏土、玩具材質。
- 但不能完全丟掉參考人物身份。
- `auto` 不一定要存在於資料表；它可以代表「AI 自動選配」。

---

## 8. 幻想廣告 `fantasy-fashion.html`

### 8.1 目的

生成幻想、高級商業廣告、精品主視覺、材質藝術、婚嫁、香氛、美妝、奇幻海報類咒語。

重點：

- 身份鎖定最優先
- 材質、服裝、背景、光影分層控制
- 支援一鍵主題模板
- 支援自填服裝與自填材質
- 自填選項選中時，只使用自填，不混用預設值

### 8.2 UI 流程

欄位：

0. 一鍵主題模板
1. 廣告版型 / 視覺調性
2. 構圖取景
3. 造型輪廓 / 服裝形式
4. 身形輪廓
5. 主題材質 / 藝術系統
6. 姿態動作
7. 鏡頭語法
8. 光影色彩
9. 背景場景 / 留白
10. 自由補充 / 約束
11. 圖片比例
12. 生成咒語

### 8.3 必要資料常數

```js
const materialData = {};
const garmentData = {};
const styleData = {};
const backgroundData = {};
const lightingData = {};
const BODY_SHAPES = {};
const poseData = {};
const framingData = {};
const cameraData = {};
const ratioData = {};
const themeTemplates = {};
```

### 8.4 一鍵主題模板

模板要填入多個分類，而不是只塞到自填文字。

模板資料應包含：

```js
{
  theme,
  garment,
  material,
  style,
  composition,
  framing,
  pose,
  camera,
  lighting,
  background,
  ratio,
  colorNote,
  extraNote
}
```

### 8.5 生成順序

最終 prompt 應先放：

1. `identityGuard`
2. `anatomyGuard`
3. `lightingConsistencyGuard`
4. `subjectIntegrationGuard`
5. `faceFillGuard`

再放：

6. 主題 / 廣告目的
7. 造型輪廓 / 服裝
8. 身形輪廓
9. 材質系統
10. 視覺風格
11. 構圖與入鏡比例
12. 姿態
13. 鏡頭
14. 光影
15. 背景
16. 色彩補充
17. 自由補充 / 約束
18. 圖片比例
19. 品質與禁止事項

### 8.6 自填規則

若使用者選擇：

- `garment=custom`
- `material=custom`

則最終咒語只能使用使用者自填值，不可再混入原本 checked 預設值。

這個規則是避免出現「奶茶牛奶 + 自填材質」這類錯誤。

---

## 9. 店家活動廣告 `store-ad.html`

### 9.1 目的

產生店家活動廣告方案，不是人像寫真工具。

輸出應偏向：

- 活動主視覺
- 商業海報
- 文案方向
- 商品賣點
- 促銷資訊
- 社群貼文 / 店面宣傳

### 9.2 UI 流程

欄位：

1. 活動類型
2. 店家資訊
3. 視覺風格
4. 補充設定
5. 輸出海報方案

### 9.3 必要資料常數

```js
const campaignData = {};
const visualData = {};
```

### 9.4 店家資訊輸入

建議 input：

- 店名
- 店家類型
- 活動內容
- 商品或服務重點

### 9.5 生成輸出

輸出可以包含：

1. 活動定位
2. 視覺方向
3. 主標題建議
4. 副標題建議
5. 商品/服務賣點
6. 海報 prompt
7. 社群文案
8. 注意事項

店家頁不需要加入人像身份鎖定核心，除非未來加入人物參考照功能。

---

## 10. 檢查腳本規格

必要腳本：`scripts/check-static.mjs`

功能：

1. 確認必要 HTML 存在。
2. 確認 `docs/`、`assets/` 存在。
3. 檢查 HTML 重複 `id`。
4. 檢查本地 `href` 連結是否存在。
5. 抽出 inline script，用 `node --check` 檢查 JS 語法。

執行：

```powershell
node scripts\check-static.mjs
git diff --check
```

---

## 11. `.gitignore` 規格

必須忽略：

```gitignore
.DS_Store
Thumbs.db
*.log
*.tmp
*.temp
*.bak
output/*
!output/.gitkeep
temp/*
!temp/.gitkeep
.vscode/
.idea/
.env
.env.*
node_modules/
dist/
build/
coverage/
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
.ruff_cache/
.venv/
scripts/guizhou_*.ass
scripts/make_guizhou_*.ps1
```

---

## 12. `.gitattributes` 規格

建議：

```gitattributes
* text=auto

.gitattributes text eol=lf
.gitignore text eol=lf
*.html text eol=lf
*.css text eol=lf
*.js text eol=lf
*.mjs text eol=lf
*.md text eol=lf
*.json text eol=lf
```

---

## 13. 重建驗收清單

AI 重建後必須通過：

- 六個 HTML 都存在。
- 五個工具頁都有 `generateBtn` 與 `copyBtn`。
- 每頁只有一個 active nav link。
- 每頁有 description / og / twitter meta。
- 所有 local href 都存在。
- 沒有重複 id。
- inline JS 語法通過。
- `travel.html`、`magazine.html`、`fantasy-fashion.html` 的咒語順序先保護身份，再放風格。
- `fantasy-fashion.html` 自填 garment/material 不混入預設。
- `magazine.html` 一鍵組合只填預設，不鎖欄位。
- `output/`、`temp/` 不提交生成內容。

---

## 14. 可接受的未來擴充方向

若專案變大，可進一步改成：

```text
assets/
  css/
  js/
  data/
pages/
  travel.html
  magazine.html
  doll.html
  fantasy-fashion.html
  store-ad.html
```

但目前 GitHub Pages 根目錄直部署最穩。若搬頁面位置，所有 nav href、check-static 腳本、README、Pages 部署路徑都要一起改。

---

## 15. 給重建 AI 的最短指令

若只想快速交代，可貼以下文字：

```text
請依照「詳細程式規格邏輯文件說明書.md」重建一個純靜態 GitHub Pages 專案。
必須包含 index.html 與五個工具頁：travel、magazine、doll、fantasy-fashion、store-ad。
不要使用框架，不要使用 build tool。
每頁用繁中 UI、inline CSS、inline JS。
travel / magazine / fantasy 必須把身份鎖定、臉部幾何、頭身協調、姿態自然性、全局光線一致放在 prompt 最前面。
完成後建立 scripts/check-static.mjs，並讓 node scripts/check-static.mjs 通過。
```
