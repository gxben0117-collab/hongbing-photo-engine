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

### 現況摘要（2026-07-31）

- 十三個工具頁（travel / magazine / doll / fantasy-fashion / xianxia /
  anime-character / flower-fairy / isekai-fantasy / store-ad /
  floral-sweet / gala-socialite / kpop-idol / battle-academy）
  皆已上線，正式站 <https://gxben0117-collab.github.io/hongbing-photo-engine/>。
- **全站導覽改為「首頁單向連結」**（2026-07-31）：owner 要求首頁保留所有
  工具頁連結不變，但其餘 13 個工具頁互相之間、以及回首頁的連結全部拿掉。
  做法：13 個工具頁的 `<nav>` 內 `<a class="nav-logo" href="index.html">`
  改成不可點擊的 `<span class="nav-logo">`，`.nav-links` 整個 `<div>`
  （含 14 個 `<a class="nav-link">`）整段移除；`index.html` 的 nav 完全
  不動，仍是 14 個連結的完整導覽。四支驗證腳本重跑全過（`check-static`
  的「本地連結檢查」本來就是找 `href` 出現的檔案是否存在，工具頁拿掉連結
  後檢查範圍縮小，不會誤判）。
- **`battle-academy.html` 全面重構為「模組化制服設計引擎」**（2026-07-31）：
  owner 貼了一份完整規格書，核心原則「服裝戰鬥化 ≠ 服裝裝甲化」——舊版
  04 服裝是「一張卡片＝一整套固定服裝」，容易把「真人×日系制服×異能學園」
  做成「真人×制服元素×RPG戰士」。新版拆成 9 個獨立維度，比照方案C（完整
  模組化引擎）執行，詳見下方「battle-academy 模組化重構」條目。這是全站
  唯一一個「多維度拆件組合」的頁面架構，其餘 12 頁仍是扁平單選卡片模式，
  刻意的架構差異、不是不一致。**重構完成後 owner 實測回報兩點**（同日
  跟進修正）：(1) 拿掉「隨機套用｜固定學校」「隨機套用｜固定服裝」兩顆
  按鈕，00 區只保留單一「隨機套用」（全部重新隨機）；(2) 生成的咒語字數
  過長需要精簡——`generate()` 把 armor styling／cape styling 合併成一行
  `combat styling`、拿掉重複解釋句、`emblemFocus` 不再重複帶出學校金屬色
  /校徽（`schoolInfo.prompt` 已包含這些資訊）、`uniformType` 併入
  appearance form 同一行；`upperBodyData`/`waistData`/`lowerData`/
  `accessoryData`/`fantasyDetailData`/`armorModeData`/`capeModeData`/
  `uniformTypeData`/`emblemFocusData` 全部砍掉重複的裝飾性子句只留核心
  描述；`core-prompt.js` 新增的「Uniform Design Priority」段落從 3 句長
  說明濃縮成 1 句。結果：預覽輸出從 10,388 字元降到 9,152 字元（-12%），
  更接近同型頁面（kpop-idol 8,375／fantasy 8,636）的長度基準。
  **owner 再貼一份更深入的技術分析**（同日第二輪跟進）：認為身份鎖臉不該
  砍，該精簡的是中間 7 個高度重疊的共用技術核心（真人骨架/鏡頭重建/真實
  膚質/姿勢自然/光線一致/色溫統一/人物融合/高級補光）合成 3 組；並指出
  比「字數過長」更重要的問題是「隨機模組互相衝突」（例如跪姿+雙手撐地
  抽到胸像近景框，或低角度仰拍抽到需要俯視的姿勢）、以及燈光池混入其他
  主題（沙漠宮帳異域女王、鬥魚水下、馬戲團等）的殘留選項。我先用
  Explore agent 查核四項技術主張全數屬實，並發現關鍵細節：`anatomyGuard`/
  `poseNaturalityGuard`/`lightingConsistencyGuard` 是 `core-prompt.js`
  裡「幾乎全部 13 頁共用同一份」的常數（`humanCore`/
  `CORE_POSE_NATURALITY`/`CORE_LIGHTING_UNIFICATION`），合併精簡這三個
  會同時影響全站輸出；而 `compositionGuard`/`colorTemperatureGuard`/
  `subjectIntegrationGuard`/`faceFillGuard` 則是逐頁複製貼上的純本地
  常數，改一頁不影響其他頁。用 `AskUserQuestion` 請 owner 決定範圍，
  owner 選「先只改 battle-academy.html」。實作：battle-academy.html 的
  這 7 個 guard（不再讀取 `sharedBattleAcademyCore.anatomyGuard`/
  `.poseGuard`/`.lightingGuard`，改成頁面本地定義，**不動
  `core-prompt.js` 任何共用常數，其餘 12 頁完全不受影響**）合併成 3 組
  【真人骨架與姿勢】【鏡頭與人物比例】【真實質感與統一光影】；新增
  `POSE_GROUPS`/`POSE_GROUP_FRAMING` 相容性表（站姿/坐姿與地面/手勢與
  細節/電影感動態戰鬥瞬間/隊長專屬 5 組姿勢，各自對應合理的景別範圍），
  **只套用在「隨機套用」按鈕**，手動選擇仍完全自由不做硬性阻擋（跟
  `OUTFIT_COMBOS` 的既有設計哲學一致）；`lightingData` 砍掉 26 個跟
  日系校園戰鬥完全無關的殘留選項（沙漠宮帳異域女王、鬥魚水下、馬戲團、
  糖果甜點、奶茶、香氛保養、智慧手錶等其他主題頁遺留的通用大池子，
  `palaceNightWarm`/`foxfireGold`/`moonGlassSparkle` 因為被既有模板引用
  而保留），從 57 個降到 31 個；結尾負面約束行砍掉跟 `CORE_NEGATIVE_PROMPT`
  重複的部分（`no random text`/`no watermark`/`no extra fingers`/
  `no deformed body` 都已經在共用負面約束裡講過），只留真正沒講過的
  `no logo artifacts, no distorted face`。結果：預覽輸出再降到 6,645
  字元（總計比重構前的 10,388 字元下降 36%）。用一支一次性 Node 腳本
  模擬 500 次隨機套用的姿勢/景別配對，確認相容性表 0 個不匹配、0 個空
  候選池。四支驗證腳本同步更新（`audit-100x.mjs`/`build-prompt-preview.mjs`
  的 exportExpression 拿掉已刪除的 4 個 guard 變數名）全部重跑通過。
  **owner 再貼一張黑紗紅花刺繡旗袍戰鬥風參考圖，要求分析後套進 5 種校服
  語彙**（同日第三輪跟進）：分析結論——護甲只在單肩局部（呼應 Armor
  Mode: light）、黑紗透膚＋紅花刺繡＋金線滾邊是材質語言、髮簪/大腿飾/
  符咒是裝飾道具而非武裝、真正的戰鬥張力來自後方守護武者與特效而不是
  角色本身的服裝。owner 確認全部收錄，並加碼「別包得緊緊的，能V就V，
  腰能露就露，大長腿」的剪裁方向。做法：**把剪裁尺度直接寫進新服裝本身
  的描述文字，不另開一個獨立維度**（避免模組化架構膨脹，其餘 9 套素面
  制服選項不受影響）；比照夏日海島下架的教訓，尺度抓在「時尚雜誌級
  削肩/深V/高衩」，不做泳裝級裸露，降低生圖安全機制誤判風險。新增
  5 個上身選項（黑紗刺繡水手/和風上衣、敞領學生服/外套/白襯衫疊搭黑紗
  打底）、1 個下身「高衩長裙」、1 個腰線「鏤空腰線」、1 個配件「符咒
  道具」；`OUTFIT_COMBOS` 新增 5 組相容組合；00 一鍵模板新增 5 組（各自
  對應風格契合的學校：朱雀學院水手符咒跪姿、神樂女學園和風符咒儀式、
  櫻華學園敞領學生服疊搭、青嵐學園敞領外套、白鷺女學院敞領白襯衫），
  模板總數 16→21，`OUTFIT_COMBOS` 13→18。四支驗證腳本重跑全過
  （`validate-preset-refs` 確認 21 個模板／18 組組合 0 issue）。
  **owner 隨即提醒**：「因為是制服學園，衣服和背景盡量不要跳脫制服和
  學園的範圍」——修正兩處跑題內容：(1) `highSlitLongSkirt` 的英文描述
  跟中文卡片說明拿掉「旗袍靈感／旗袍靈感側邊高衩」字樣，改成「學院長裙
  改良高衩剪裁」，確保生圖模型讀到的是制服裙的改良款而非直接聯想到
  旗袍這種完全不同的服裝；(2) 新增的 5 個模板裡有 2 個背景選到「抽象
  靈力背景」分類（`sealCircleAbstractBackdrop`／`sakuraPetalStudioBackdrop`
  都是棚拍/虛空背景，不是實際校園場景），改成 `schoolGateSiege`（校門
  對峙戰場）／`academyCourtyardSunset`（學院中庭夕陽）這兩個真正的校園
  場景。四支驗證腳本重跑全過。
  **owner 實測「敞領疊搭」3 個模板後回報**：出圖結果是「上衣鈕扣全開、
  完全的胸罩外露」，跟 owner 要的「性感微露、不是完全露內衣」方向不符，
  owner 給了明確替代方案：「鈕扣上面少扣2~3個、微露胸部深V」或「身穿
  上衣沒胸罩但不外露」。把 `gakuranOpenSheerLayered`／
  `blazerOpenSheerLayered`／`shirtOpenSheerLayered` 三個上身選項的英文
  描述從「worn open over a sheer black lace red-floral-embroidered
  underlayer」（外套敞開＋內搭透紗打底，生圖模型讀成「整件敞開、內衣
  外露」）改成「only the top two or three buttons undone, a subtle
  deep-V opening at the collarbone, smooth bare skin with no visible
  undergarment, jacket otherwise fully closed and worn normally」（只解
  上方2-3顆釦子、鎖骨處微露深V、沒有內衣痕跡、其餘部分維持正常穿著），
  中文卡片說明同步從「敞開穿+內搭打底」改成「上方鈕扣微解2-3顆+微露
  鎖骨深V+不露內衣」。這是本輪第二次因為 owner 實測出圖才發現的落差
  （上一次是模板背景跑題），提醒之後新增服裝描述要更保守估計生圖模型
  對「open/layered/underlayer」這類詞的解讀傾向，容易被誇大成完全敞開。
  **owner 再提出兩條「制服戰鬤學園限定」規則**（2026-08-01）：(1) 裙裝
  不可以自動內搭短褲/安全褲/熱褲/褲裙；(2) 披風預設關閉且隨機也不能
  抽到。做法：Cape Mode 整個維度**直接從頁面移除**（不是保留關閉選項，
  是拿掉整個系統——21 個模板裡原本 3 個 `capeMode: 'on'` 的模板改名/
  改文案拿掉披風敘述，`capeModeData` 換成固定常數
  `CAPE_TEXT_OFF`，`core-prompt.js` 的 `battleAcademyCore`（只影響這頁）
  同步拿掉「披風可被明確選取」的措辭）；`generate()` 負面約束新增固定
  一行禁止裙裝內搭短褲/安全褲/熱褲/褲裙。共用姿勢庫的 `cape_wind`
  （披風揚起站姿）刻意不動，因為文字本身是「cape or dress」的模糊
  詮釋，不是 Cape Mode 系統的一部分，牽動共用姿勢庫超出這次範圍。四支
  驗證腳本同步更新並重跑全過。
  **新增「服裝改造核心」（Garment Detail Core）**（2026-08-01）：owner
  貼了一份自己跟另一個 AI 花約 10 小時發展的構想——把「制服局部結構化
  改造」拆成 Layer（改造強度）× 部位（改哪裡）× 設計（怎麼改）× 隨機，
  要求先分析可行性。分析結論：技術可行（跟 `POSE_GROUPS`/
  `POSE_GROUP_FRAMING` 同一種「先抽一個再從相容子集抽另一個」模式），
  但原始構想的 5 部位×9 選 1（59,049 種組合）風險太高——容易變成
  「隨機=無規則」的鏤空拼盤，也容易讓制服 archetype 認不出原本版型，
  建議先縮小到 2-3 個部位。owner 採納，選定 3 部位（胸口／腰側／肩部），
  Layer 定案 0/3/6/9 四級，確認要做成「獨立、類似鎖臉核心」的模組
  （owner 原話：「鎖臉核心 服裝改造核心」）。實作：新增 `chestDetailData`
  /`waistSideDetailData`/`shoulderDetailData`（各 9 選 1，含 none）與
  `GARMENT_DETAIL_LAYER_ZONES` 對照表；`generate()` 在 appearance form
  後新增 `garment surface detail` 行，並附「這是表面結構細節、不是重新
  設計整件制服」防呆句；`applyBattleRandomSelection()` 新增部位隨機
  邏輯——Layer 決定要命中幾個部位、已手動設定過的部位（非 none）不會
  被隨機覆蓋、`random` Layer 會先解析成實際的 0/3/6/9 再套用；
  `applyThemeTemplate()` 套用模板時把這 4 個新欄位重置回 layer0/全
  none（21 個既有模板都沒規劃這幾個欄位）。用一次性 Node 腳本模擬 4 種
  情境（全 none+L9／已手動1個+L9／已手動2個+L3超標／random）各 200 次
  確認邏輯正確。四支驗證腳本同步更新重跑全過。這是 v1（3 部位、無跨
  部位相容性表），下一步可考慮擴大部位數或搬去 xianxia.html（換一份
  仙俠語彙、演算法不用重寫）。
  **04 學校身份加開 3 所＋自填、11 服裝改造核心加自填**（2026-08-01）：
  補齊四神主題（既有朱雀=南方，新增 `seiryuAcademy` 青龍=東方翡翠綠、
  `byakkoAcademy` 白虎=西方銀白鋼灰、`genbuAcademy` 玄武=北方墨黑古銅），
  學校總數 6→9；新增 `customSchool` 自填欄位，`generate()` 拆成
  `schoolPromptText`/`schoolColorNote` 兩個變數處理覆蓋邏輯，`color
  palette:` 那行順手改成沒內容就不輸出（原本永遠輸出）。服裝改造核心
  三個部位（胸口/腰側/肩部）各自新增 `customChestDetail`/
  `customWaistSideDetail`/`customShoulderDetail` 自填，套用跟其他自填
  欄位一致的「custom X only: ...」覆蓋格式。一鍵模板/隨機套用的自填
  清空清單、監聽註冊清單同步補上這 4 個新欄位 id。四支驗證腳本重跑
  全過。
  **一鍵主題模板同步新增 3 組**（2026-08-01）：owner 要求同步更新一鍵
  模板，補上剛新增的 3 所學校（青龍/白虎/玄武），每校一組，其中 2 組
  順便示範服裝改造核心的部位細節（`byakkoTigerDojoFocus` 腰側縱向切割、
  `genbuAncientGuardianThrone` 肩部蕾絲肩片）。`applyThemeTemplate()`
  改成 `preset.chestDetail || 'none'` 這種寫法，模板有指定部位就套用、
  沒指定的維持原本重置回無修改，兩種模板並存不衝突；`garmentLayer`
  維持固定重置 layer0（Layer 只是隨機套用用的強度旋鈕）。順手發現
  `validate-preset-refs.mjs` 的 battle-academy 區塊沒把三個部位欄位
  加進 `fieldLive`，導致新模板的部位值完全沒被驗證過（欄位不存在於
  `fieldLive` 會被靜默略過），補上後 24 個模板真正驗證通過。模板
  總數 21→24。
  **`anime-hero.html`（動漫電影變身夥伴咒語產生器）已於 2026-07-24 整頁下架**：
  owner 對這系列不滿意，且該頁架構已疊到 10 層 monkey-patch 式的
  `generate = function(){ 上一版generate(); ... }`，難以維護；docs 底下留有一份
  「開發規格 v2（整理版）」規劃改用 fantasy-fashion.html 的乾淨版型從零重建，
  但目前決議是整頁刪除、暫不重建。下架範圍：`anime-hero.html` 本檔、首頁
  nav-link/tool-card/CSS、`check-static.mjs`/`audit-100x.mjs`/
  `validate-preset-refs.mjs` 裡的專屬區塊、README/CLAUDE.md 的頁面清單。
  `docs/history/` 底下 2026-07-23 前後幾篇 anime-hero 開發記錄維持原樣不改
  （歷史事實記錄）。
- **fantasy 頁 04/05/06 已重新分類**（2026-07-25）：04 服裝輪廓（61項）從
  完全無分類的平鋪清單改成 10 個 `✦` 分類；05 主題材質輕量優化（戰鬥高訂
  特調分類移到機甲未來／賽博霓虹都市旁邊，語意分群更合理）；06 人物姿勢
  把原本混雜的「手勢與動作」拆成「手勢與細節」＋新的「電影感動態／戰鬥
  瞬間」（新增 7 個：hero_landing_pose/sword_draw_pose/mid_air_slash/
  running_charge/spell_casting/floating_ascension/energy_burst）。**全程
  只搬 DOM 位置、新增內容，沒有刪除或改名任何 `value`**，用程式化抽取重組
  避免大量卡片手動搬移出錯，`validate-preset-refs.mjs` 確認 58 個
  `themeTemplates` 全數 0 issue，證明 00 一鍵主題模板系統完全不受影響。
- **travel / magazine 平鋪清單也已比照重新分類**（2026-07-25）：travel 四個
  欄位（themePreset 81項→9組、costume 20項→5組、lighting 24項→4組、
  pose 20項→4組）全部從平鋪改分類；magazine 盤點後發現 `style`/`pose`
  已經有分組不用動，只重整 `bg`（52項→7組）與 `lighting`（35項→7組）。
  同樣全程只搬 DOM 位置、不動 `value`，重整用的通用 splice 工具收在
  scratchpad 的 `apply-block.mjs`（給容器起始 marker + 新內容 +
  `--dry-run`，depth-counting 找正確結束位置，避免 CSS class 重用導致抓錯
  區塊）。
- **全站 header 版面節奏已統一**（2026-07-25）：fantasy-fashion／store-ad
  原本用 `.wrap` 頂部 88px＋`header{padding:28px 0 30px}`＋h1 響應式
  `clamp(28px,6vw,42px)`，跟 travel/magazine/doll 三頁固定的 70px／
  `48px 0 36px`／32px 不一致，已統一成後者。**強調色刻意保留不動**：
  fantasy 紫色（`--violet`）、store-ad 薄荷綠（`--mint`）是 owner 確認過的
  頁面區隔設計，不併入其他三頁的金色；兩頁各自 mobile `@media` 底下的
  `.wrap`/`header` 覆寫值也保留原樣，因為兩頁行動版 nav 行為本來就不同
  （fantasy 用 `position:sticky`、store-ad 維持 `fixed` 但允許換行兩排）。
- **三頁再補 11 個要素**（2026-07-25，讀取新一批風格範例圖）：fantasy 新增
  3 背景／2 姿勢／1 服裝／1 材質（含 `phoenixDragonThroneHall`＋
  `dual_spirit_guardian_throne` 雙靈守護寶座組合、`rock_stream_leg_extend`
  補上溪流苔石背景原本缺的坐姿）；travel 新增服裝
  `floral_halter_kimono_dress`＋日本地點 chip「古町運河櫻花小徑」＋姿勢
  `kimono_collar_adjust_glance`；magazine 新增背景
  `golden_field_backlight`（原本 52 個背景沒有開闊草原場景）。**重要澄清**：
  travel 的 `themePreset` 地點 chip 沒有另外的英文對照表，點擊只是把中文
  文字填進自由文字主題框，純新增 chip 完全不用碰 JS 資料結構。全部純附加，
  `validate-preset-refs`/`build-prompt-preview`/`audit-100x` 全過，另外對
  這 11 個新元素逐一 jsdom 測試確認可正常生成。
- **三頁指定欄位加「自填」格**（2026-07-25）：fantasy-fashion 的 09 背景／
  06 姿勢新增 `customBackground`/`customPose`，沿用既有
  `data-custom-choice` + `refreshCards()` 機制（填了就取代整欄位預設值，
  卡片自動取消選取）；magazine／travel 過去沒有這套機制，從零建立
  `customBg`/`customPose`（magazine 04/05）、`customPose`/`customAdorn`
  （travel 08/10）。**注意語意差異**：除了 travel 的 `customAdorn`（10
  裝扮細節）是「附加」語意（因為該欄位底下同時有髮型+配件兩個獨立選項，
  取代整組沒意義，改成額外補一行）之外，其餘全部是「取代」語意（填了就
  完全不混用預設選項的文字）。**新增自填欄位務必同步做兩件事**：(1) 在
  `applyThemeTemplate`/`applyXxxPreset`/`applyXxxRandomSelection` 這類
  一鍵套用函式裡把新欄位 id 加進清空清單，否則使用者填字後再點模板/隨機，
  殘留文字會默默蓋掉新選的預設值；(2) 若該頁面有 `refreshCards()` 這類
  卡片選取視覺同步機制（目前只有 fantasy 有），要確認 `data-choice`／
  `data-custom-choice` 的欄位名稱對得起來。
- **咒語內容無用字詞清理**（2026-07-25，全專案檢查）：修正 4 個確認過的
  重複/無關字詞問題——(1) fantasy-fashion.html 頁面自己多宣告一份跟
  `identityGuard` 內建文字逐字相同的 `styleScopeGuard`，造成「Style Scope
  Rule」整段重複兩次，已移除頁面自己那份；(2) store-ad.html 的
  `STORE_AD_CORE.negativePrompt`（人臉/肢體負面約束）沒有跟著
  `identityLock`/`faceGeometryLock`/`lighting` 一起用 `isPersonHero`
  把關，四種主視覺只有一種有人臉卻無條件塞入，已補上判斷；(3)
  fantasy-fashion.html／store-ad.html 都各自在 `CORE.output`（含"Sharp
  focus."）後面又加一行含"sharp focus"的補充句，造成相鄰重複，已去重；
  (4) `assets/core-prompt.js` 的 `CORE_CLEAN_FRAME`（travel/magazine 共用）
  移除「No Tourist.」——這行完全被同段落的「No Crowd.」/「No Extra
  Person.」涵蓋，屬於純重複，套到 magazine 棚拍情境更完全無意義。
  **改動前先用 `AskUserQuestion` 取得 owner 明確同意才動手**，因為這些都
  屬於核心提示詞相關內容；`build-prompt-preview.mjs`/`audit-100x.mjs`
  兩支腳本各自維護一份 fantasy 生成邏輯鏡像，硬編碼引用了
  `styleScopeGuard`，改動後同步修正這兩支腳本，否則會直接報錯。
- **姿勢自然性防護已補齊 fantasy/magazine**（2026-07-25）：owner 要的
  「臉與頭不去配合 Pose，Pose 必須配合已鎖定的臉與頭」原則本來就寫在
  `CORE_REALISTIC_ANATOMY`（三頁共用）裡，但 `core-prompt.js` 另外定義的
  第二層加強防護 `CORE_POSE_NATURALITY`（【姿勢自然性系統】）過去**只接在
  `travelCore.pose`，`magazineCore`/`fantasyCore` 完全沒有**——而這兩頁
  才是姿勢風險最高的（fantasy 的武打/動態姿勢、magazine 的 8 個
  ⚠️ 高風險複雜姿勢）。已在 `magazineCore`/`fantasyCore` 加上
  `pose`/`poseGuard: CORE_POSE_NATURALITY`，並在兩頁 `generate()` 裡插入
  骨架系統之後（跟 travel.html 位置一致）。**owner 明確表示不要整個重排
  優先順序**（身份/臉部幾何/頭部姿態/頸肩/骨架/重心合併呈現在
  `CORE_REALISTIC_ANATOMY` 一個區塊裡，不拆成獨立命名層），只補這一個
  缺口。`build-prompt-preview.mjs`/`audit-100x.mjs` 的 fantasy/magazine
  鏡像邏輯要同步加這個區塊，否則鏡像跟真實頁面對不起來；新增變數會讓
  `build-prompt-preview.mjs` 的 base-vs-worktree 比較在舊 commit 上直接
  `ReferenceError`（因為舊版沒有這個變數），這種情況改用 jsdom 直接執行
  真實頁面驗證即可，不必依賴這支腳本。
- **`CORE_REALISTIC_ANATOMY` 改寫成 Head Pose Mode A/B 邏輯**
  （2026-07-25）：舊句子「never rotate the head or face away from its
  natural front-facing angle just to match a body-direction instruction」
  字面上暗示頭必須維持正臉，跟已存在的 `look_back`/`sword_draw_pose`
  （鎖定畫面外目標的凝視）/`dual_spirit_guardian_throne`（抬下巴的威嚴
  凝視）等姿勢有字面矛盾。新句子明確允許「頭可以自由轉動/傾斜/凝視任何
  姿勢需要的方向，身份與臉部幾何不因頭部方向改變；頸肩軀幹脊椎永遠要
  自然跟隨支撐已建立的頭部方向，絕不能反過來」——邏輯是 **Mode A（保留
  原照片頭部角度）／Mode B（角色表演，頭自由轉動，身體跟著重新配合）**，
  核心因果關係「頭先決定、身體才跟著建立」沒變，只是拿掉「頭必須維持
  正臉」這個過度限制。這是 travel/magazine/fantasy 三頁共用的區塊，
  doll.html 沒有接這塊不受影響。**這次只改這一句，其餘規劃中的補強
  （身份不鎖照片澄清句、豐富 `CORE_POSE_NATURALITY` 具體重心/關節內容、
  Anime/Xianxia 新頁待辦）owner 都表示先不動**，見開發日誌
  2026-07-25（八）完整討論脈絡。
- **`CORE_IDENTITY_LOCK` 補上「鎖身份不鎖照片」澄清句**（2026-07-25）：
  另一個 AI 第三輪建議把 ANATOMY 改成顯式的「Mode A — Reference Head
  Pose／Mode B — Character Performance」雙分支結構——**已評估並否決**，
  理由是系統實際上只有一種運作模式（沒有任何 UI 讓使用者選「保留原照片
  頭部角度」），字面寫兩個並列分支等於給模型一個它無法判斷該走哪條的
  選擇題，比現有精簡句子更模糊、又長 3 倍卻沒新增行為，Mode A/B 適合當
  討論用概念標籤，不適合結構化寫進生成邏輯。**另一個建議（補「鎖身份不
  鎖照片」句）採納**，但拿掉它版本裡的 camera angle 部分（跟既有
  `CORE_CAMERA_RECONSTRUCTION` 重複），改折進 `CORE_IDENTITY_LOCK` 當
  補充句，不另開新區塊：「The reference photo locks identity only, not
  the original composition — body, pose, clothing, hairstyle and
  environment may be freely reconstructed for the new scene unless
  explicitly requested otherwise.」——travel/magazine/fantasy/doll 四頁
  以及 store-ad 人物主視覺情境都會拿到，因為全部組合自
  `CORE_IDENTITY_LOCK`。
- **新增 `xianxia.html`（中式仙俠咒語產生器）**（2026-07-25）：owner 討論五大
  人物美圖系統時規劃的其中一個新頁面，選「方案A：獨立完整新頁，比照
  fantasy-fashion.html 全套規格」執行。作法是直接複製 `fantasy-fashion.html`
  當模板（保留身份/骨架/姿勢自然性/構圖/鏡頭/光影/輸出規格等共用管線
  完全不動），只替換仙俠專屬內容：04 服裝（30項/6組：仙門正裝、古典勁裝、
  法袍道服、婚嫁儀式、戰鬥仙裝、妖靈靈獸化）、05 材質與仙俠元素
  （30項/5組：法器仙劍、靈獸神獸、劍氣仙氣特效、雲霧仙境元素、五行元素
  法術）、06 姿勢（26項/4組：站姿仙儀、坐姿修煉、手勢細節、御劍飛行與
  戰鬥）、09 背景（30項/6組：仙山秘境、宗門樓閣、雲海天象、江湖市井、
  神殿遺跡、竹林四季）、00 一鍵模板（16組）；02 構圖／03 身形／07 鏡頭／
  08 光影沿用 fantasy 原始內容（這些是通用攝影概念，不是奇幻專屬）。
  `core-prompt.js` 新增 `xianxiaCore`（結構完全比照 `fantasyCore`：
  identityGuard/anatomyGuard/poseGuard/lightingGuard/negativePrompt/output），
  註冊到 `window.HB_CORE_PROMPT.page.xianxia`，**從第一天就正確接上鎖臉
  三件套**，不重演這次 session 才修的「fantasy/magazine 漏接
  `CORE_POSE_NATURALITY`」那個坑。全站 nav（含 index.html 首頁卡片，強調色
  選用未使用過的翡翠綠 `#7ED9A8`，跟 fantasy 紫色／store-ad 薄荷綠區隔）、
  四支驗證腳本（`check-static`/`validate-preset-refs`/`audit-100x`/
  `build-prompt-preview`）都同步加入 xianxia 支援。**這是「四大提案方案」
  的第一個**。
- **新增 `anime-character.html`（動漫人物美圖咒語產生器）**（2026-07-26）：
  「四大提案方案」的第二個，同樣選「方案A：獨立完整新頁」，複製
  `fantasy-fashion.html` 當模板。注意：這是全新的「單人動漫化」概念，跟
  已刪除的 `anime-hero.html`（真人+變身夥伴/式神/機甲的雙角色關係敘事）
  是不同東西。內容：04 服裝（30項/6組：校園日常、魔法系、劍士戰鬥系、
  機甲駕駛員、巫女和風、妖靈幻想種族，全走 archetype，不用任何 IP
  角色名）、05 材質（30項/5組：賽璐璐上色線條、發光特效、元素能力
  視覺化、髮色髮型特效、裝飾配件）、06 姿勢（26項/4組：日常站姿、戰鬥
  蓄勢、魔法詠唱、情感表現）、09 背景（30項/6組：校園、異世界奇幻、
  戰場都市、和風、星空宇宙、抽象特效）、00 一鍵模板（16組）、01 style
  （9項：少女浪漫/少年熱血/成人劇情/萌系可愛/輕小說奇幻/復古賽璐璐/
  遊戲CG/海報主視覺/動漫美妝特寫）；02 構圖／03 身形／07 鏡頭／08 光影
  沿用 fantasy 原始內容不動（通用攝影概念）。
  `core-prompt.js` 新增 `CORE_ANIME_IDENTITY_PRESERVATION` 專屬鎖定文字
  （針對「動漫化保留身份、不淪為模板動漫臉」這個技術風險設計：明確禁止
  「generic anime girl face」「template moe/bishoujo face」「oversized
  template doe-eyes」，要求動漫風格只影響線條/上色/媒材而非重新設計
  身份），與 `CORE_IDENTITY_LOCK`/`CORE_FACE_GEOMETRY_LOCK` 一起組成
  `animeCore.identityGuard`；`animeCore.anatomyGuard` 直接寫死
  `illustrationHumanCore`（不像 fantasy/xianxia 需要
  photorealistic/illustration 條件判斷，因為動漫頁本來就永遠是插畫
  風格），註冊到 `window.HB_CORE_PROMPT.page.anime`，從第一天就接上鎖臉
  三件套與 `CORE_POSE_NATURALITY`。全站 nav（含 index.html 首頁卡片，
  強調色選用未使用過的粉紅 `#FF7FB0`）、四支驗證腳本都同步加入 anime
  支援。jsdom 63 項實測（含每個模板都驗證輸出含
  「動漫化身份保留系統」標記字串）全過，`audit-100x` 700 次模擬（7頁
  ×100）0 issue。
- **新增 `flower-fairy.html`（花仙子）與 `isekai-fantasy.html`（日式異世界）**
  （2026-07-29）：owner 貼了一份 ChatGPT 產出的擴充規格書，先分析哪些
  假設跟本專案實際架構對不上（規格書提到的「localStorage 狀態保存」
  「圖片生成 API」不存在——這是純文字咒語產生器；「某項鎖定其餘隨機」
  這個機制**現有系統完全沒有**，`applyFantasyRandomSelection` 系列函式
  是全欄位無條件重抽，沒有 lock/pin 單一欄位的邏輯），owner 確認兩點：
  (1) 用「一鍵模板」機制取代鎖定/隨機聯動即可，不用另開發鎖定功能；
  (2) 鏤空服裝當成服裝選項本身（例如「水晶鏤空禮服」），不做鏤空強度
  滑桿。兩頁都採「方案A：獨立完整新頁，比照 fantasy-fashion.html 全套
  規格」，複製 fantasy-fashion.html 當底。
  - **flower-fairy.html**：11 種花卉（玫瑰/百合/蓮花/紫薇/櫻花/牡丹/
    紫藤/蘭花/山茶花/繡球花/薰衣草）。04 服裝（30項/6組：花瓣禮服基礎、
    花冠飾品套裝、透紗羽翼花裙、藤蔓纏繞服、水晶花瓣鏤空禮服〔鏤空服裝
    放在這裡〕、花卉主題訂製禮服）、05 材質（30項/6組，依花卉家族分組）、
    09 背景（30項/6組，依花卉場景分組）、00 一鍵模板（16組，每種花卉至少
    一組）皆全新替換；**06 姿勢刻意不整組替換**，沿用 fantasy 原本 74 個
    姿勢池，只新增 5 個花仙子專屬姿勢（持花瓣風暴旋轉、仙境跪拜、蝴蝶
    停手、花冠輕整、花瓣接取）——這是跟仙俠/動漫兩頁不同的做法，因為
    ChatGPT 規格書明確要求「沿用現有姿勢系統，只加真正需要的新增」。
    另外新增全站沒有過的「05b 翅膀與蝴蝶」全新維度（7種翅膀＋4種蝴蝶
    密度），選了任一項會在生成的咒語裡自動加一句「wings and butterflies
    stay clear of the face at all times」防止翅膀蝴蝶蓋住臉。
    `core-prompt.js` 新增 `flowerFairyCore`（結構比照 `xianxiaCore`：
    identityGuard 含 Style Scope Rule、anatomyGuard 用寫實 `humanCore`），
    註冊到 `window.HB_CORE_PROMPT.page.flowerFairy`。
  - **isekai-fantasy.html**：16 個角色陣營（光明中立8＋獸族3＋暗黑陣營5：
    勇者/女劍士/魔法使/聖女/精靈/異世界貴族/公主/女王/獸娘/狐娘/貓娘/
    暗黑魔法使/魔女/魅魔/魔族貴族/魔王），00 一鍵模板剛好 16 組、每個
    陣營一組。04 服裝（30項/6組，按陣營分組）、05 材質（30項/6組：聖光
    治癒/元素魔法/暗黑魔法/皇室珠寶/森林自然/獸族靈力）、09 背景（30項/
    6組：王城宮廷/異世界城鎮/森林精靈秘境/魔法學院遺跡/魔界暗黑領域/
    戰場冒險場景）皆全新替換；**06 姿勢同樣用「延伸不整組替換」做法**，
    沿用 fantasy 姿勢池（本來就有 sword_draw_pose/spell_casting/
    throne_cross_leg/beast_mount_look 等可直接用的姿勢），只新增 6 個
    isekai 專屬姿勢（持杖引導魔力、王座統禦、獸耳蜷坐、收劍佇立、魔法陣
    召喚跪姿、斗篷迎風前行）。**這頁刻意走寫實骨架而非插畫**（跟
    anime-character.html 的關鍵差異）：`core-prompt.js` 新增 `isekaiCore`，
    identityGuard 的 Style Scope Rule 額外加一句「This is a photorealistic
    photography campaign, not an anime/illustration conversion」明確排除
    插畫化，`anatomyGuard` 用寫實 `humanCore`；服裝/姿勢命名刻意跟
    anime-character.html 的動漫插畫語彙錯開，避免兩頁選項字面重複。
  - 兩頁都拿掉了 fantasy-fashion.html 原本的 illustration-material 條件
    判斷（`isIllustrationMaterial`/`resolvedAnatomyGuard`），因為兩頁的
    材質庫都不含插畫媒材，直接固定用寫實 `anatomyGuard`（比照
    anime-character.html 拿掉判斷邏輯的做法，只是兩頁固定的方向相反：
    anime 固定插畫、這兩頁固定寫實）。
  - 全站 nav（9 頁互相連結）、index.html 首頁卡片（花仙子玫瑰粉
    `#E8759A`、日式異世界靛藍 `#7C9EFF`，兩色都未使用過）、四支驗證腳本
    都同步加入支援。jsdom 實測 flower-fairy 49 項（含翅膀/蝴蝶不蓋臉的
    guard 邏輯測試）、isekai-fantasy 45 項全過；`audit-100x` 900 次模擬
    （9頁×100）0 issue；`build-prompt-preview` 核心區塊長度 delta 全部
    為 0，確認沒有動到任何既有頁面的共用核心。
- **`summer-island.html` 已下架刪除**（2026-07-29）：owner 實測時持續遇到
  圖像生成端「可能違反裸露/性/色情內容防範機制」的拒絕判定，即使已經
  做過材質用詞調整、日系商業旅拍 DNA 固定層、Prompt Compatibility
  System 組合風險檢查層等多輪修正仍然常態性被擋，owner 決定放棄這個
  主題，要求整頁刪除（含全站 nav 連結、index.html 卡片、
  `core-prompt.js` 的 `summerIslandCore`、四支驗證腳本裡的對應區塊）。
  完整的建置與修正過程記錄在開發日誌 2026-07-29（十六）～（十九）條目，
  留供之後若重啟同類主題時參考「哪些做法試過但仍不夠」。目前工具頁
  回到 9 個。
- **新增 4 個「新潮/美人/漂亮」時尚頁**（2026-07-30）：owner 先做開放式腦力激盪
  （9→9→20→50 個主題方案，橫跨奇幻世界觀與當代時尚兩條軸線），最後選定
  「花漾甜美系」「氣質名媛宴會」「戰鬥制服學園」「韓系氣質偶像風」四個
  真人時尚寫真方向（非奇幻插畫）執行。四頁都採「方案A：複製
  flower-fairy.html 當底」（比 fantasy-fashion.html 精簡、模板數量剛好16個，
  更適合當新頁起點），02 構圖／03 身形／07 鏡頭／08 光影／`BODY_SHAPES`／
  五個 identityGuard 系列 guard 區塊全部沿用不動（全站共用的通用攝影概念與
  防護層），拿掉 flower-fairy 專屬的「05b 翅膀與蝴蝶」維度。
  - **floral-sweet.html（花漾甜美系）**：24 服裝/5組（花朵洋裝基礎、針織
    甜美上衣、蕾絲層次洋裝、緞帶蝴蝶結套裝、甜美派對禮服）、24 材質/5組
    （花束花飾、柔光泡泡、緞帶蝴蝶結細節、甜點生活道具、光影氛圍）、
    24 背景/5組（花店溫室、公園花園、甜美生活場景、街景旅拍、夢幻抽象）、
    16 一鍵模板、9 種 style。06 姿勢走「精簡再利用」：保留站姿全部16個、
    坐姿刪 2 個(寶座交腿/溪石伸腿，不符甜美調性)、手勢刪 6 個(東方戲劇/
    蒙面等不符)、整組拿掉「電影感動態/戰鬥瞬間」16 個(不需要武打張力)，
    新增 7 個「甜美專屬」姿勢(裙擺旋轉/抱花輕嗅/眨眼比心/野餐籃邊坐/
    窗邊倚靠，另外重用 flower-fairy 的花冠輕整/花瓣接取)。
  - **gala-socialite.html（氣質名媛宴會）**：24 服裝/5組（晚宴禮服基礎、
    珠寶名媛套裝、俐落剪裁套裝、蕾絲薄紗晚裝、高定訂製禮服）、24 材質/5組
    （珠寶配飾、香檳金光影、緞面絲絨質感、花藝宴會道具、光影氛圍）、
    24 背景/5組（宴會廳、名流社交場景、燭光晚宴、城市夜景、抽象奢華）、
    16 一鍵模板。06 姿勢**保留「寶座交腿坐姿」**(貼合名媛氣場)、刪溪石
    伸腿/東方戲劇類手勢，新增 5 個「名媛專屬」姿勢(香檳致意回眸/手拿包
    倚腰/面具半遮/階梯優雅下行/輕觸項鍊)。
  - **kpop-idol.html（韓系氣質偶像風）**：24 服裝/5組（舞台表演服、極簡
    高訂套裝、街頭潮流穿搭、機場時尚、夢幻概念寫真服）、24 材質/5組
    （舞台光影特效、造型配件、都會夜色光影、音樂概念特效、柔焦色調氛圍）、
    24 背景/5組（舞台表演、指揮任務、城市夜景〔沿用 battle-academy 命名
    習慣但內容各自獨立〕、機場旅行、極簡棚拍、生活時尚），16 一鍵模板。
    06 姿勢刪寶座/溪石/東方戲劇類手勢，新增 5 個「偶像專屬」姿勢(麥克風
    自信手勢/比心舞台手勢/耳返調整/舞蹈定格瞬間/後台隨性回眸)。
  - **battle-academy.html（戰鬥制服學園）**：定位刻意跟 anime-character.html
    （動漫插畫風）與 isekai-fantasy.html（異世界幻想）錯開——服裝走「戰術
    改良制服+現代機能剪裁」，真人時尚寫實質感，identityGuard 明確加一句
    「not an anime/illustration conversion」排除插畫化（比照 isekai 的
    做法）。24 服裝/5組（戰術改良制服、機能剪裁外套、訓練服運動剪裁、制服
    配件套裝、指揮官/隊長進化服）、24 材質/5組（戰術裝備配件、能量光效、
    訓練場景特效、學院徽章紋樣、光影氛圍）、24 背景/5組（學院訓練場景、
    指揮任務場景、城市與廢墟場景、校園日常場景、抽象科技背景）、16 一鍵
    模板。06 姿勢是四頁中唯一**完整保留「電影感動態/戰鬥瞬間」16 個姿勢**
    （宿主題本來就需要武打張力），只刪東方戲劇類手勢與溪石伸腿，新增 5 個
    「指揮官專屬」姿勢(敬禮預備/戰術掃視/小隊手勢指揮/裝備檢查/任務簡報
    凝視)，是四頁中姿勢池最大的一頁（71個，含 auto）。
  - `core-prompt.js` 新增 `floralSweetCore`/`galaSocialiteCore`/
    `kpopIdolCore`/`battleAcademyCore`，結構比照 `flowerFairyCore`
    （identityGuard 含 Style Scope Rule、anatomyGuard 用寫實 `humanCore`，
    battleAcademy 額外加插畫排除句），註冊到 `window.HB_CORE_PROMPT.page`。
  - 全站 nav 改為 14 個連結互相連結（index.html 起 14 個檔案統一重寫
    `.nav-links` 區塊）；index.html 新增 4 張 tool-card＋CSS 強調色
    （花漾甜美系珊瑚粉 `#FFB4A8`、名媛宴會香檳金 `#E0B978`、韓系偶像亮青
    `#6FE7FF`、戰鬥學園戰術灰藍 `#8FA1B3`，皆未使用過）；四支驗證腳本
    （`check-static`/`validate-preset-refs`/`audit-100x`/
    `build-prompt-preview`）同步加入四頁支援。`validate-preset-refs`
    確認四頁 `themeTemplates` 各 16 組、0 issue；`audit-100x` 累計 1300 次
    模擬（13頁×100）0 issue；`build-prompt-preview` 四頁新增預覽輸出正常
    產出（無 base 版本可比對，因為是全新頁面，`loadRevision` 的
    try/catch skip-gracefully 機制正常運作）。
- **`battle-academy.html` 風格修正**（2026-07-30）：owner 回報「戰鬥制服學園
  風格你搞錯了」——初版走「近未來軍事戰術學院」方向（戰術背心、全息指揮
  中心、機庫、數據平板），owner 要的其實是「日本漫畫 真人學生服改良戰鬥服
  和服改良戰鬥服 水手服改良戰鬥服 校園戰鬥那種」。全面改寫 04/05/09/01：
  04 服裝改成 5 組日系制服 archetype（學生服／水手服／和服改良戰鬥服、
  異能魔法系學園戰鬥服、隊長畢業進化服），例如
  `gakuranBattleArmor`(詰襟學生服戰鬥改裝)／`sailorBattleArmor`(水手服
  護甲改裝)／`kimonoBattleArmor`(和服護甲改裝)；05 材質把過於軍事科幻的
  項目（`dataTabletPropAccent`數據平板／`holographicMapGlow`全息地圖／
  `scannerGridOverlay`掃描網格／`coldBlueTacticalLight`冷藍戰術光影等）
  換成靈氣異能與校園戰鬥風味（`spiritPowerAuraGlow`靈氣力量光暈／
  `glowingSealCircle`發光咒印法陣／`bladeEnergyTrailStreak`劍氣軌跡光紋／
  `tornFabricBattleDamage`破損布料戰鬥痕跡）；09 背景把「指揮中心／機庫／
  控制塔／作戰室」整組換成校園決戰場景（`schoolRooftopBattle`學校屋頂
  決戰／`schoolGateSiege`校門對峙戰場／`gymnasiumBattleArena`體育館決鬥
  擂台／`schoolCourtyardSakuraBattle`校園中庭櫻花決戰／
  `kendoDojoInterior`劍道場內部）；01 style 保留原本 9 個 value key 不動
  （避免動到 themeTemplates 的 style 參照），只改寫中英文描述文字移除
  「戰術機能品牌／軍事」語彙、改用「日系戰鬥漫畫真人化」語彙。06 姿勢
  沿用不變（前一版保留的「電影感動態/戰鬥瞬間」16 個姿勢正好完全符合
  校園戰鬥主題，不需要調整），只把「指揮官專屬」群組改名「隊長專屬」、
  `mission_briefing_gaze` 的 prompt 文字把「hologram map」改成
  「glowing seal circle」貼合異能校園設定。00 一鍵模板 16 組全部依新
  服裝/材質/背景重新設計（如「學生服屋頂決鬥」「水手服體育館擂台」
  「和服櫻花斬擊」「劍道場專注武者」）。`core-prompt.js` 的
  `battleAcademyCore` Style Scope Rule 文字同步更新為
  「Japanese school-battle manga inspired uniform design (gakuran,
  sailor fuku, kimono reimagined as lightweight battle armor)」；
  index.html 卡片文案與 `audit-100x.mjs`/`build-prompt-preview.mjs`
  裡殘留的舊 key 預設值（`tacticalBlazerVest`／`briefingRoomTactical`／
  `'exosuit joints'` 等）一併同步更新。四支驗證腳本重跑全過（不需要改
  腳本結構，因為都是動態讀 DOM／themeTemplates，key 改名會自動被抓到）。
- **`battle-academy.html` 全面重構為「模組化制服設計引擎」**（2026-07-31）：
  owner 貼了一份完整規格書，先要求「分析看看，給我3套方案」，提供 A（內容
  重寫、架構不變）／B（新增學校身份為獨立維度、服裝維持整套造型）／C（完整
  模組化拆件引擎，精確照規格書實作）三套方案，owner 選 C 執行。核心原則
  「服裝戰鬥化 ≠ 服裝裝甲化」：舊版 04 服裝是「一張卡片＝一整套固定服裝」，
  容易把「真人×日系制服×異能學園」做成「真人×制服元素×RPG戰士」；新版拆成
  9 個獨立可組合維度：**04 學校身份**（6 校：櫻華學園深藍紫+金/白鷺女學院
  象牙白+靛藍+銀/朱雀學院黑+深緋紅+金/青嵐學園白+青藍+銀/月影學院黑+深紫+銀/
  神樂女學園白+朱紅+金，各校只帶主色/輔色/金屬色/校徽/氣質文字，不含服裝
  版型）、**05 上身**（9 項：水手領上衣/詰襟學生外套/學院西裝外套/短版學院
  外套/剪裁制服外套/正式學院襯衫/和風交領上衣/現代和風學院上衣/儀式感學院
  上衣）、**06 腰線輪廓**（9 項純剪裁效果：自然腰線/高腰剪裁/合身腰線/寬版
  學院腰封/窄腰帶/雙腰帶/和風帶結腰線/綁繩腰線/儀式腰帶，明確不是身形調整，
  身形仍由 03 控制）、**07 下身**（10 項：百褶短裙/A字短裙/及膝百褶裙/中長
  百褶裙/長版百褶裙/現代袴裙/袴褲/寬褲裙/不對稱裙擺/層次和風裙）、**08 制服
  類型**（7 項季節/場合修飾詞：標準/夏季/冬季/儀式/學生會/社團活動/特殊部門）、
  **09 配件與幻想戰鬥細節**（配件 7 項沿用舊材質庫的道具類：校徽徽章/護腕
  綁帶/刀鞘/書包便當包/能量刃/新增髮飾緞帶/手鍊吊飾；幻想細節 15 項＝舊
  「靈氣異能光效」5＋「戰鬥特效」6（含破損布料）＋「戰鬥情境光效」4，新增
  「校徽強調位置」select 共 10 個位置選項）、**10 裝甲與披風強度**
  （Armor Mode: off/light/full，**預設 off**；Cape Mode: off/on，**預設
  off**——這是防止「戰鬥/幻想關鍵字自動變成 RPG 盔甲角色」的核心技術機制，
  off 狀態會在咒語裡插入明確的「no heavy armor plating」「no cape, no
  cloak」負面約束句，不是只是「沒選」而已）。**相容性規則**：不對手動選擇
  做硬性阻擋（創作工具，尊重使用者自由組合），但新增 `OUTFIT_COMBOS`
  （13 組已驗證過視覺協調的「上身+腰線+下身」組合，例如「和風交領上衣＋
  帶結腰線＋現代袴裙」「學院西裝外套＋高腰剪裁＋及膝百褶裙」），00 一鍵
  模板與隨機套用都優先從這個表抽選，落實 owner 說的「隨機 ≠ 無規則」。
  **三種隨機模式**對應規格書的 Mode A/B/C：`battleRandomFixSchool`（固定
  學校，服裝與其餘元素重新隨機）／`battleRandomFixOutfit`（固定上身/腰線/
  下身，學校與其餘元素重新隨機）／`battleRandomFull`（全部重新隨機），
  三顆按鈕取代舊版單一「隨機套用」。00 一鍵模板 16 組全部重新設計，每校
  至少出現 2 次，涵蓋不同 armorMode/capeMode/uniformType 組合（例如「神樂
  儀式鈴舞獻禮」用 capeMode:on 搭配儀式腰帶、「櫻華廢墟能量夜襲」是唯一
  armorMode:full 的模板，刻意示範「重甲化只在明確需要騎士/機甲級設定時
  才開」）。**`generate()` 組裝順序**：學校身份文字→appearance form
  （上身+腰線+下身合併一行）→制服類型→armor styling→cape styling→
  校徽強調位置（帶入該校金屬色與紋樣）→配件→幻想戰鬥細節，色彩補充欄位
  留空時預設抓所選學校的 colorNote，不再依賴材質自帶調色盤。**不動的
  部分**：01 style／02 構圖／03 身形／06(→11) 姿勢／07(→12) 鏡頭／
  08(→13) 光影／09(→14) 背景／11(→16) 比例與全部共用 guard 區塊
  （identityGuard/anatomyGuard/poseNaturalityGuard/compositionGuard/
  lightingConsistencyGuard/colorTemperatureGuard/subjectIntegrationGuard/
  faceFillGuard）完全沿用舊版文字，只是 section 編號因為新增 5 個區塊
  往後平移（04-10 全部變成 04-17）。`core-prompt.js` 的 `battleAcademyCore`
  Style Scope Rule 新增「Uniform Design Priority System」段落，明文寫
  「Uniform battle-ification is not uniform armor-ification」與「Fantasy
  details enhance the clothing; fantasy details must not replace the
  clothing」，並把舊句「kimono reimagined as lightweight battle armor」
  改成「kimono-inspired academy wear」（避免文字本身就預設要護甲化）。
  **建置手法**：檔案改動幅度極大（新增 9 個維度、16 個模板全部重寫），
  用 12 個 scratchpad 片段檔分別撃寫再用 `cat` 串接組合成完整檔案，
  避免單次超大量輸出；過程中一度在 `themeTemplates` 裡用了
  `COMPOSITION_CENTERED`/`INTENSITY_BALANCED` 這類本地常數縮寫，導致
  `validate-preset-refs.mjs` 用獨立 vm context 解析物件時報
  `ReferenceError`（物件字面量被抽出來單獨執行，抓不到外部常數）——修法
  是寫一支一次性替換腳本把所有常數用法換回字面字串、拿掉常數宣告，這是
  「新增資料物件時如果用了外部常數引用，四支驗證腳本的 vm 解析會失敗」
  這個教訓，之後如果又想用常數簡化重複字串，要記得直接內嵌字面值而不是
  宣告成獨立 const。**驗證**：jsdom 在本機環境有 ESM 模組解析衝突
  （`lru-cache`／`@asamuzakjp/css-color` 的 exports 欄位跟目前 Node 版本
  兜不起來，屬環境問題非程式碼問題，已放棄安裝並清理），改用專案既有的
  純 `node:vm` 驗證慣例：`check-static.mjs`（JS 語法/重複 id）、
  `validate-preset-refs.mjs`（16 個 `themeTemplates`＋13 個 `OUTFIT_COMBOS`
  全數欄位對到即時選項池，0 issue）、`audit-100x.mjs`（100 次隨機模擬對
  新的 9 個維度＋school/armorMode/capeMode/emblemFocus 全部欄位抽樣，0
  issue）、`build-prompt-preview.mjs`（`generateBattleAcademy()` 鏡像函式
  同步改寫，人工檢視輸出樣本確認「school identity/appearance form/armor
  styling/cape styling/emblem focus/accessory/fantasy detail」組裝順序
  與文字正確）全部重跑通過。
- **`freeform.html`（自由生圖）已於 2026-07-31 整頁下架刪除**：owner 實測後
  決定不需要這頁，直接下架。完整建置記錄（鎖臉核心固定＋單一自由輸入格
  架構）保留在開發日誌 2026-07-30 條目供之後參考。下架範圍：`freeform.html`
  本檔、其餘 13 頁 nav-link、index.html tool-card/CSS、`core-prompt.js` 的
  `freeformCore`、`check-static.mjs`/`audit-100x.mjs`/
  `build-prompt-preview.mjs` 裡的專屬區塊（`validate-preset-refs.mjs`
  本來就沒有這頁的區塊，因為它沒有 `themeTemplates`）。工具頁回到 13 個。
- **共用核心**：`assets/core-prompt.js` 集中管理身份鎖定等保護區塊；核心文字經過
  兩輪瘦身（5,162 → 4,099 字元），語意零遺漏。
- **全部 13 個工具頁的生成互動已完全統一**（2026-07-27；花仙子/日式異世界/
  花漾甜美系/氣質名媛宴會/韓系氣質偶像風/戰鬥制服學園複製既有
  頁面建立時直接繼承這套機制，不需額外處理）：
  手動按「生成」才
  顯示輸出、stale 保護（改選項後輸出區標記過期＋複製鈕鎖住，需重新生成
  才解除）。`doll.html` 補上 stale 徽章＋額外攔截 `.chip`/`.auto-card` 點擊
  （因為它的選項是純 click 切換 class，沒有底層 `<input>` 事件）；
  `store-ad.html` 原本是「即時預覽」架構（任何欄位改動就直接重繪輸出，
  永遠不會過期），已改成跟其餘 6 頁一樣的 click-to-generate + stale 模式
  （拆開原本並排的 actions 按鈕、copy 鈕移進 output-wrap、拿掉載入時的
  自動 generate()）。stale 徽章顏色沿用各頁自己的主色（金色系頁面用
  `--gold`，store-ad 用自己的薄荷色 `--mint`），不是強制統一成同一色。
- **隨機套用已改為元素級獨立隨機**（每欄位各自抽選再動態組合），不是預寫模板三選一。
- **驗證工具**：四個腳本，改咒語相關邏輯後都應該跑：
  - `scripts/check-static.mjs`（結構：重複 id、本地連結、inline script 語法）
  - `scripts/build-prompt-preview.mjs`（固定選項組合 0-diff 迴歸）
  - `scripts/audit-100x.mjs`（五頁各 100 組隨機模擬內容稽核）
  - `scripts/validate-preset-refs.mjs`（2026-07-22（十一）新增：檢查
    `QUICK_TRAVEL_PRESETS`/`TRAVEL_STYLE_PRESET_DEFAULTS`、
    `QUICK_MAGAZINE_PRESETS`/`STYLE_PRESET_DEFAULTS`/`THEME_PRESET_DEFAULTS`、
    fantasy 的 `themeTemplates` 這些「一鍵套用/預設連動」物件裡，每筆用到的
    每個欄位值是不是真的存在於該頁當下的選項池——**這是專門為了抓
    composition/intensity 那種靜默失效問題而寫的**，跟 node:vm 解析＋正規
    表示式讀值，不需要 jsdom，維持專案零 npm 依賴。
  **重要限制**：`audit-100x.mjs` 是重新實作一份組裝邏輯直接讀 DOM 文字來模擬，
  不是真的執行頁面上的 `generate()`，測不出「新增選項卡但忘記同步補頁面自己
  維護的文字對照表」這類問題（2026-07-22（五）就是這樣被漏掉，導致 fantasy
  生成按鈕直接壞掉）；`validate-preset-refs.mjs` 也測不出這個，因為它只查
  「一鍵套用」物件的欄位值有沒有對到選項池，不會去查 `garmentData`/
  `materialData` 這類文字對照表本身有沒有缺項。**凡是新增/修改選項卡，都要
  另外用 jsdom 載入真實 HTML、對每個新選項值 dispatch change + 點真正的
  `generateBtn`，檢查輸出沒有 undefined/過短/JS 錯誤**，不能只靠這四個腳本
  過關就當作驗證完成。
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
- 2026-07-22：Codex 讀取 owner 指定桌面風格範例資料夾（3 張 JPG、無咒語文字檔），
  分類為雜誌棚拍 2 張、幻想廣告 1 張；依 owner 拍板新增 magazine「紅花薄紗深 V 禮服」
  與「未來系 Cos 風寫真」chip/一鍵套用/預設關聯，新增 fantasy「花卉紗藝女神」模板。
  同步修正 magazine「隨機套用｜棚拍封面感覺」只填主題文字但未穩定選中 02 chip 的問題，
  讓隨機與一鍵套用都會保留可見的 02 選中狀態。驗證：`check-static.mjs` 全過、
  `validate-preset-refs.mjs` 全過、`audit-100x.mjs` 500 次模擬 0 issue、
  `build-prompt-preview.mjs` 正常產出 `output/ab-test-2026-07-22`。

</details>
