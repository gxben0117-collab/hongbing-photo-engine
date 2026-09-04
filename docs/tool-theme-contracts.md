# 工具頁主題與欄位契約

版本：v4.63

這份表是 `docs/theme-classification-rules.md` 的執行摘要；每頁的詳細 allowed／forbidden 內容以 `assets/theme-registry.js` 為準。現行正式工具頁共 23 頁。

| 工具頁 | family | 主要作品 | 主責控制軸 | 不負責的內容 |
|---|---|---|---|---|
| `travel.html` | travelPortrait | 地點旅拍人物故事 | 地點、旅拍情境、戶外光線、旅行動態 | 棚拍封面、住宅品牌、奇幻世界 |
| `magazine.html` | magazineEditorial | 雜誌封面與棚拍人像 | 封面語氣、主題服裝、妝容、棚拍光線 | 平面 Stage 2、仙俠 |
| `luxury-lifestyle.html` | luxuryLifestyle | 高級住宅生活方式 | 住宅、家具、生活互動、室內材質 | 一般戶外旅拍、奇幻世界 |
| `modern-portrait.html` | modernPortrait | 現代人像與生活寫真 | 人物狀態、姿勢、現代場景、自然光 | 住宅品牌主導、文化服飾專題、奇幻世界 |
| `doll.html` | dollTransformation | 收藏公仔與展示物 | 公仔形式、材質、包裝、底座 | 真人寫真頭身規則 |
| `fantasy-fashion.html` | fantasyAdvertising | 奇幻品牌廣告 | 材質藝術、世界觀、非現實服裝 | 文化服飾頁的正向詞 |
| `chinese-classical.html` | chineseClassical | 漢風、盛唐、宋韻與唯美古風 | 漢服、傳統材質、中式場景 | 仙俠、科技幻想 |
| `japanese-kimono.html` | japaneseKimono | 日本和服人物寫真 | 和服、帶結、日本紋樣、和風場景 | 漢服、韓服、仙俠 |
| `korean-hanbok.html` | koreanHanbok | 韓國韓服人物寫真 | 韓服、襖裙、韓屋、宮廷場景 | 和服、漢服、仙俠 |
| `xianxia.html` | xianxia | 中式仙俠世界觀 | 仙門、法器、靈獸、仙境 | 古典中式頁的正向核心 |
| `anime-character.html` | animeCharacter | 動漫媒材人物轉換 | 賽璐璐、漫畫、插畫角色 | 真人攝影膚質契約 |
| `flower-fairy.html` | flowerFairy | 花卉精靈寫真 | 花卉服裝、翅膀、花園 | 仙俠法器、機甲 |
| `isekai-fantasy.html` | isekaiFantasy | 日式異世界真人角色 | JRPG 陣營、魔法使、異世界場景 | 文化服飾頁正向詞 |
| `store-ad.html` | storeAdvertisement | 店家活動主視覺 | 活動資訊、商品／服務、後製文案 | 固定人物身份主體 |
| `floral-sweet.html` | floralSweet | 花漾甜美生活寫真 | 甜美服裝、花束、柔和場景 | 全站粉彩預設 |
| `gala-socialite.html` | galaSocialite | 晚宴名媛人物寫真 | 晚宴禮服、珠寶、紅毯、宴會廳 | 一般生活頁預設 |
| `festival-editorial.html` | festivalEditorial | 節慶文化與季節人物寫真 | 節日主題、道具、場景、節慶光影 | 把節慶敘事強制帶入其他工具 |
| `bridal-editorial.html` | bridalEditorial | 單人西式婚紗藝術寫真 | 西式婚紗、頭紗、珠繡、新娘光影 | 中式婚服、多人物婚禮、舊 85mm 選項 |
| `chinese-bridal.html` | chineseBridal | 中式婚嫁藝術寫真 | 龍鳳褂、秀禾服、鳳冠霞帔、織金刺繡、喜堂古宅 | 西式婚紗主體、教堂長頭紗、仙俠與科技幻想 |
| `kpop-idol.html` | kpopIdol | 韓系偶像人物寫真 | 舞台、機場、街頭、偶像姿態 | 一般現代人像預設 |
| `battle-academy.html` | battleAcademy | 戰鬥制服學園角色 | 學校身份、制服、裝甲、校園戰鬥 | 一般服裝改造頁 |
| `ancient-goddess.html` | ancientGoddess | 古文明女神史詩寫真 | 神殿、敦煌、古文明服裝 | 其他文化頁的泛用語彙 |
| `editorial-identity.html` | editorialDesignStage2 | 完成照片的平面設計 | 版型、字體、文案、圖形、印刷 | 重畫人物或改變身份 |

## 共用欄位命名

標準真人人像頁共用下列內部欄位名稱：

- `camera`
- `ratio`
- `bodyShape`
- `garmentLayer`
- `pose`

比例值統一使用文字值：`9:16`、`4:5`、`1:1`、`2:3`、`3:4`、`16:9`、`4:3`、`21:9`。`A4` 等特殊值只能留在明確需要印刷輸出的頁面。

具服裝改造核心的真人頁，Layer 只控制隨機套用補足的部位數；手動選取的胸口、腰側與肩部不能被覆蓋。Layer 0／3／6／9／隨機 Layer 的語義與 `assets/garment-core.js` 一致。

所有具人物姿勢控制的正式頁都必須有 `AI判斷｜主題最佳姿勢`，但 AI 只能依該頁的主題資料選擇姿勢，不得把其他頁的動作語彙帶入。

## 新增頁面檢查清單

- 先在 registry 指定一個 family 與 primary intent。
- 確認 UI 標題、場景、服裝、姿勢、光影與模板都屬於同一主題。
- 共用核心只接入身份、幾何、骨架、鏡頭、光線一致性與輸出保護。
- 專題外觀、髮型、唇色、身材與單一色彩規則留在 scoped data，沒有需要就不輸出。
- 首頁、導航、local link、DOM 順序與所有驗證腳本同步更新。
