# Photo Prompt Engine

這是一個純靜態的 AI 咒語產生器專案。根目錄可直接由 GitHub Pages 部署，不需要前端打包流程，也沒有必要安裝 npm 或 Python 套件。

## 版本

v4.54 起持續迭代中；完整逐日開發記錄見 [docs/development-log.md](docs/development-log.md)。

v4.54 依 `風格範例_142張逐張咒語分析.xlsx` 建立匿名分類登記與單一 owner 驗證；現代寫真、旅拍、雜誌與 Luxury Lifestyle 分別擴充至 20、18、28、11 組完整一鍵模板，並補正節慶頁的主題登記。素材只進入相符工具頁的頁面資料，不改共用鎖臉、臉部幾何、真人骨架或光線一致性核心。

v4.53 延續獨立 `modern-portrait.html` 現代寫真攝影工具，新增風格範例分流的居家、窗光、床面與玫瑰木模組，完整一鍵模板擴充至 15 組；並將白襯衫白磚棚拍、香檳銀夜景與飯店長廊分流至雜誌、名媛與旅拍頁。聖誕素材、來源人物外貌／身份與固定數字比例不進共用核心；共用鎖臉、臉部幾何與真人骨架核心維持不變。

v4.51 新增旅拍「雪景溫泉花卉和風旅拍」主題、雪景花卉包覆和風長袍服裝方向與完整一鍵模板；共用鎖臉、臉部幾何與真人骨架核心維持不變。

v4.50 將「深溝豐滿上圍身材」加入標準人像頁共用身材控制；保留成人、自然重力與真實比例限制，未改寫共用鎖臉、臉部幾何或真人骨架核心。

v4.49 新增中式古典的「敞襟外袍・內襦層疊」服裝方向、低方領貼身內襦局部改造與青春古風一鍵模板；仙俠新增「醉仙・月下狂飲」動態姿勢與一鍵模板。新增內容只接入主題資料，未改寫共用鎖臉、臉部幾何或真人骨架核心。

v4.48 完成全站 Prompt 核心去重：標準人物頁不再重複輸出已由真人骨架涵蓋的解剖負面限制，店家廣告的人像主視覺保留完整負面保護；Luxury Lifestyle 不再重複附加雜誌頁的身份優先核心。另補強固定 Prompt 預覽的 runtime value 驗證。20 個工具頁的靜態、UI、DOM、模板引用與 2,000 組隨機生成回歸全部通過。

v4.47 新增獨立 `luxury-lifestyle.html` Luxury Lifestyle 攝影工具；沙發、咖啡桌、床上、窗前、門口、庭院、陽台、吧檯、餐桌與衣帽間各自成為可組合的生活場景，並提供 10 組完整一鍵模板。原先誤放在雜誌頁的 Luxury Lifestyle 公寓模板已移除；共用身份、臉部幾何、真人骨架與負面核心維持不變。

v4.46 新增「琉璃天使單翼」幻想廣告模板；來源圖片與咒語只補入相符主題頁的主題、材質、構圖、姿勢、光影與背景，共用身份、臉部幾何、真人骨架與負面核心維持不變。

v4.3 基礎重點：

- 統一身份鎖定核心
- 統一臉部幾何鎖定
- 統一真人骨架規則
- 統一光線一致化規則
- 補強 travel / magazine / fantasy 的身份保持

v4.3 之後陸續完成（詳見開發日誌）：

- travel / magazine / fantasy 大量擴充選項（姿勢、服裝、材質、背景、光線）
- 18 個具人物姿勢控制的工具頁提供「AI 判斷｜主題最佳姿勢」，由共用核心依主題、服裝、構圖、鏡頭、光影與場景選擇單一合適姿勢
- travel / magazine / fantasy 的「生成 → 顯示 → 複製」操作模式統一
  （stale 保護、套用即顯示、按鈕配色一致）
- 三頁「隨機套用」改為元素級獨立隨機（每個欄位各自抽選再動態組合）
- 建立 `build-prompt-preview.mjs`（0-diff 迴歸檢查）與 `audit-100x.mjs`
  （500 次隨機模擬內容稽核）兩個自動化驗證腳本

## 專案定位

- `index.html` 是入口與工具導覽頁。
- 二十二個正式工具頁（見下方「正式頁面」）各自包含 UI、選項資料與咒語組裝邏輯。
- `assets/core-prompt.js` 集中管理 v4.3 共用身份鎖定、臉部幾何、真人骨架、鏡頭重建、光線一致、膚質、負面詞與輸出品質規則。
- `assets/editorial-finish.js` 集中管理中式古典、和服與韓系偶像三個精品主題頁的高預算編輯成像、材質可信度、光影層次與主題化負面限制；婚紗頁使用等效的短版專屬精品核心，避免重複堆疊而稀釋身份鎖定。
- `assets/core-prompt.js` 另提供共用 `autoColor` 控制提示；中式古典、和服、韓服、婚紗與編輯視覺設計的色彩系統均提供主題搭配色組與 AI 配色選項。
- `scripts/` 底下有驗證腳本與 DOM 順序維護腳本，見下方「上架前檢查」。
- `docs/` 保存規格、流程、核心 prompt 契約與工程說明。
- `assets/` 預留給正式共用靜態資源。
- `output/` 與 `temp/` 是本地產物與暫存區，不應提交生成內容。
- `experiments/` 保存不屬於正式網站流程的實驗腳本。

## 正式頁面

- `travel.html` - 寫真旅拍風格咒語產生器
- `magazine.html` - 雜誌棚拍風格咒語產生器
- `luxury-lifestyle.html` - Luxury Lifestyle 攝影咒語產生器
- `modern-portrait.html` - 現代寫真攝影咒語產生器
- `doll.html` - 公仔萌工作室
- `fantasy-fashion.html` - 幻想廣告咒語產生器
- `chinese-classical.html` - 中式古典美學咒語產生器
- `japanese-kimono.html` - 日本和服美學咒語產生器
- `korean-hanbok.html` - 韓國韓服美學咒語產生器
- `xianxia.html` - 中式仙俠咒語產生器
- `anime-character.html` - 動漫人物美圖咒語產生器
- `flower-fairy.html` - 花仙子咒語產生器
- `isekai-fantasy.html` - 日式異世界咒語產生器
- `store-ad.html` - 店家活動廣告產生器
- `floral-sweet.html` - 花漾甜美系咒語產生器
- `gala-socialite.html` - 氣質名媛宴會咒語產生器
- `festival-editorial.html` - 節慶美學寫真咒語產生器
- `bridal-editorial.html` - 婚紗藝術寫真咒語產生器
- `kpop-idol.html` - 韓系氣質偶像風咒語產生器
- `battle-academy.html` - 戰鬥制服學園咒語產生器
- `ancient-goddess.html` - 神話古文明女神咒語產生器
- `editorial-identity.html` - 編輯視覺設計咒語產生器

## 建議資料夾分工

```text
.
├─ index.html                  # GitHub Pages 首頁
├─ travel.html                 # 工具頁: 寫真旅拍
├─ magazine.html               # 工具頁: 雜誌棚拍
├─ luxury-lifestyle.html       # 工具頁: Luxury Lifestyle 攝影
├─ modern-portrait.html        # 工具頁: 現代寫真攝影
├─ doll.html                   # 工具頁: 公仔
├─ fantasy-fashion.html        # 工具頁: 幻想廣告
├─ chinese-classical.html      # 工具頁: 中式古典美學
├─ japanese-kimono.html        # 工具頁: 日本和服美學
├─ korean-hanbok.html           # 工具頁: 韓國韓服美學
├─ xianxia.html                # 工具頁: 中式仙俠
├─ anime-character.html        # 工具頁: 動漫人物美圖
├─ flower-fairy.html           # 工具頁: 花仙子
├─ isekai-fantasy.html         # 工具頁: 日式異世界
├─ store-ad.html               # 工具頁: 店家廣告
├─ floral-sweet.html           # 工具頁: 花漾甜美系
├─ gala-socialite.html         # 工具頁: 氣質名媛宴會
├─ bridal-editorial.html      # 工具頁: 婚紗藝術寫真
├─ kpop-idol.html              # 工具頁: 韓系氣質偶像風
├─ battle-academy.html         # 工具頁: 戰鬥制服學園
├─ ancient-goddess.html        # 工具頁: 神話古文明女神
├─ editorial-identity.html     # 工具頁: 編輯視覺設計
├─ assets/                     # 正式靜態資源與 core-prompt.js
├─ docs/                       # 規格與維護文件
├─ experiments/                # 實驗稿與非正式工具
├─ output/                     # 本地匯出結果, 僅保留 .gitkeep
├─ scripts/                    # 正式檢查與維護腳本
└─ temp/                       # 本地暫存與實驗輸出, 僅保留 .gitkeep
```

## 文件索引

完整索引見 [docs/README.md](docs/README.md)；最重要的兩份是：

- [開發日誌](docs/development-log.md) — 現況與完整歷史記錄
- [核心咒語保護契約](docs/core-prompt-contract.md) — 改咒語前必看
- [全站分類歸屬總規範](docs/theme-classification-rules.md) — 主題歸屬、共用核心邊界與新素材分流規則
- [工具頁主題與欄位契約](docs/tool-theme-contracts.md) — 22 頁分類、欄位命名、比例值、Layer
- [工具頁分類與欄位契約](docs/tool-page-contracts.md) — 歷史版欄位契約與演進記錄
  與自訂要求鎖臉提示的正式契約

其餘：[使用方式](docs/usage.md)｜[核心咒語邏輯](docs/core-logic.md)｜
[底層保護核心](docs/shared-protection-core.md)｜[工程維護規劃](docs/engineering.md)｜
[寫真旅拍流程](docs/travel-workflow.md)｜[雜誌棚拍流程](docs/magazine-workflow.md)｜
[Luxury Lifestyle 攝影流程](docs/luxury-lifestyle-workflow.md)｜
[中式古典美學流程](docs/chinese-classical-workflow.md)｜
[日本和服美學流程](docs/japanese-kimono-workflow.md)｜[韓國韓服美學流程](docs/korean-hanbok-workflow.md)｜
[婚紗藝術寫真流程](docs/bridal-editorial-workflow.md)｜
[幻想廣告分類表](docs/fantasy-ad-workflow.md)｜[公仔工作流程](docs/doll-workflow.md)｜
[專案架構](docs/architecture.md)｜[完整程式規格邏輯文件](docs/full-program-spec.md)｜
[歷史交接文件歸檔](docs/history/)

## 執行方式

直接打開 `index.html`，或使用正式 GitHub Pages 網址：
<https://gxben0117-collab.github.io/hongbing-photo-engine/>

本專案沒有 `package.json`、`requirements.txt` 或 `pyproject.toml`。如果未來引入打包工具或 Python 自動化腳本，需同步補上正式依賴檔與檢查命令。

## 上架前檢查

需要本機有 Node.js：

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
git diff --check
```

`check-static.mjs` 目前檢查：

- 必要 HTML 與資料夾是否存在
- HTML 是否有重複 `id`
- 本地連結是否存在
- inline JavaScript 語法是否可解析

若改動涉及咒語組裝邏輯或新增/調整選項，再加跑：

```powershell
node scripts\build-prompt-preview.mjs   # 固定選項組合，改前/改後 0 diff 迴歸檢查
node scripts\audit-100x.mjs             # 目前腳本涵蓋 21 個標準 Prompt 頁，各隨機 100 組，共 2100 組內容稽核
node scripts\validate-preset-refs.mjs   # 各頁一鍵套用/預設連動物件引用的選項值是否都存在
```

## 維護原則

- 根目錄只放可直接部署的正式入口與工具頁。
- 正式素材放 `assets/`。
- 共用 prompt 核心放 `assets/core-prompt.js`，頁面特色 prompt 仍保留在各工具頁。
- 產出結果放 `output/`，不要提交生成檔。
- 臨時檔、測試輸出、影片剪輯暫存放 `temp/`，不要提交。
- 正式維護腳本放 `scripts/`。
- 實驗影片腳本放 `experiments/video/`。
- 文件集中放 `docs/`。
- 修改身份鎖定、臉部幾何、頭身協調、姿態自然性、光線一致性前，先確認 `docs/core-prompt-contract.md` 與 `docs/shared-protection-core.md`。

## 目前整理狀態

- `output/` 已用 `.gitignore` 排除生成內容，只保留 `.gitkeep`。
- `temp/` 已用 `.gitignore` 排除暫存內容，只保留 `.gitkeep`。
- `scripts/check-static.mjs` 是正式檢查腳本。
- `scripts/guizhou_*` 與 `scripts/make_guizhou_*` 已移至 `experiments/video/`。
