# 第四波方案 — 風格範例補強 + store-ad 優化 + 分類邏輯修正（2026-07-15）

Claude Code 已讀完 `C:\Users\User\Desktop\ai生圖\風格範例` 全部 30 張圖、
盤點三個工具頁現有選項（travel 16 風格/13 光線/0 姿勢；magazine 93 preset/80 姿勢/28 光線；
fantasy 78 材質/42 背景/44 光線），本文件是可照做的執行方案，交 Codex。

## 0. 硬性規則

1. **加選項不改舊輸出**：所有新增選項 default 不選中（或 default=auto 且 auto 行為與現狀完全相同）。
   驗證：`node scripts/build-prompt-preview.mjs` 對既有選項組合改前/改後 **0 diff**。
2. 新增的 prompt 英文全文先寫進 `docs/d-prompt-review-2026-07-15.md` 給 owner 過目，同意後才上線（契約）。
3. **版權紅線**：範例圖含《真三國無雙》角色（月英/練師/孫尚香）與動漫角色。只取
   氛圍、場景、姿勢、服裝方向；**任何遊戲名、角色名、可辨識角色設計不得出現**在 prompt、UI、註解。
4. 新 prompt 文風跟隨各頁現有寫法（英文短句 + 中文標籤）；身份鎖定/幾何/骨架核心一律不動。

## 1. 範例圖分類結果（30 張 → 8 群）

| 群 | 圖 | 歸類 | 現況 | 缺口 |
| --- | --- | --- | --- | --- |
| A 巨大花卉紗藝術（xuancreation 系列 8 張：15.32.18/21/24/26/29/33/36/38） | 藍白花瓣、粉金旗袍櫻、金桂、白金牡丹、黑金月葉、紫蘭、粉蕾絲、彼岸花藍天 | 幻想 | flowerSea / floatingPetalGlass / seasonalFlowerSpirits 已有近似 | 特定花種材質缺：彼岸花/桂花/蘭花/粉金櫻（→F3） |
| B 狐仙獸耳（23.58.40、10.38.13） | 狐耳+透紗漢服櫻花、黑金狐妖 | 幻想 | foxfireTails、magazine 九尾妖狐已有 | 大致涵蓋，不加 |
| C 惡魔暗黑（01.36.13） | 惡魔角+蝠翼+黑紗鏡廳 | 幻想 | hornFlowerChain 只有角花 | 魅魔/蝠翼/暗黑鏡廳缺（→F2） |
| D 暗黑仙俠夜景（18.28.03/07/14/17） | 水中魔法、蛇紋身、月夜紗舞、藍焰蓮花，夜火古廟 | 幻想 | 無對應 | 整組缺：紋身、法術特效、夜火古廟、月夜古樓、水面（→F1） |
| E 古風閨房私房（18.26.56/18.27.09/18.27.12） | 床榻紗帳、緞面、暖窗光 | 雜誌（私房棚拍） | 姿勢 side_lie/prone_chin 已有 | 背景缺中式閨房/緞面床；光線缺燭暖床邊（→M1） |
| F 旅拍實景（08.23.18 夕陽海邊城堡、18.17.36 庭院茶席旗袍、744662065 櫻花校園制服、743805644 Y2K 夜街蹲姿） | — | 旅拍 | 風格/構圖夠用 | **旅拍頁結構性缺姿勢/服裝/裝扮模組**；光線缺黃金時刻（→T 全組） |
| G 雜誌棚拍（19.37.23 藍羽窗光、743824628 晚宴水晶廳、746074009 日雜海邊封面、746171373 紅髮古風特寫） | — | 雜誌 | 藍羽/水晶晚宴/紅髮櫻桃美妝 preset 已有（前波已吸收） | 戶外海邊逆光封面背景缺（→M2） |
| H 其他（19.54.06 紙藝花海芭蕾→幻想 paperSculpture 已有；745320487 女神王座→幻想 solarMarbleThrone 已有；743163739 動漫街拍→magazine japanese_anime 已有） | — | — | 已涵蓋 | 不加 |

## 2. 任務 T：travel.html 補強（本波最大重點）

旅拍頁六要素現況：構圖✔ 光線✔ 背景(主題自由填)✔｜**姿勢✘ 服裝✘ 裝扮✘**。
三個新模組都放在「動作氛圍」附近，UI 用現有 radio card 樣式，**default 都是 auto，
auto = 不輸出該段落**（與現狀完全一致）。

### T1 姿勢模組（新 radio 區 + 組裝插一段，位置放 motionBlock 之後）

auto（預設，交給動作導演模組）＋ 12 個：
回眸站姿、倚牆而立、欄杆遠眺、階梯輕坐、街拍蹲姿、行走回望、
撩髮側望、提裙擺、望向遠方背影、執傘漫步、茶席斟茶、捧花輕嗅。
每個 6-10 行內英文短句，需含「Identity And Facial Features Remain Clearly Recognizable」收尾句（跟 motion 模組同規格）。

### T2 服裝方向模組

auto（預設，維持主題自動設計）＋ 9 個：
飄逸洋裝、旗袍、和服浴衣、學院制服風、Y2K 街頭、牛仔休閒、度假風罩衫、晚禮服、冬季大衣。
選了非 auto 時，costumeBlock 的「根據主題自動設計」句後追加一行
「服裝主軸：<選項英文描述>，仍需符合主題世界觀」。

### T3 裝扮模組（髮型＋隨身配件，兩個下拉）

髮型：auto／黑長直／自然大波浪／及肩短髮／編髮盤髮／高馬尾（描述限髮型，不得涉及臉部特徵）。
配件：無／細框眼鏡／頸掛耳機／髮飾花／貝雷帽／小背包（單選即可，避免堆疊）。

### T4 光線補 5 種（加進 TRAVEL_LIGHTING_STYLES）

golden_hour 黃金時刻夕陽逆光／blue_hour 藍調暮色／neon_night 霓虹夜街／
morning_mist 清晨柔霧／lantern_night 燈籠暖夜。

### T5 主題快選 preset 補 4 組（沿用 applyTravelPreset 機制）

海邊夕陽白色城堡（→golden_hour + resort_hotel）、櫻花校園日系（→japanese_clear）、
中式庭院茶席（→中式古典 + 茶席斟茶姿勢）、雨夜霓虹街拍（→neon_night + 街拍蹲姿）。

## 3. 任務 M：magazine.html 補強

- **M1 私房閨房組**：bg 加 `chinese_bedroom`（中式雕花床榻＋紗帳＋暖窗光）、`satin_bed_morning`（緞面床單晨光）；
  lighting 加 `bedside_candle_warm`；preset 加「古風私房」「緞面晨光私房」（尺度承襲現有性感系寫法，優雅不露骨）。
- **M2 戶外封面組**：bg 加 `seaside_backlight`（海邊逆光藍天）、`cherry_avenue`（櫻花道景深）；
  preset 加「日雜海邊封面」（→japanese_photo_magazine style + seaside_backlight + 自然光）。
- **M3 亂世古風組（去版權原創）**：preset 加 3 組——
  「亂世紅顏」（紅金鳳紋高領旗袍＋中式喜房＋暖光）、
  「古風軍師」（青白古裝＋書房星盤窗光）、
  「絳紗夜宴」（紫紗古裝＋宮燈夜色）。
  描述全部原創，禁止角色名/遊戲名。

## 4. 任務 F：fantasy-fashion.html 補強

- **F1 暗黑仙俠組**：material 加 `arcaneFlameLotus`（藍焰蓮花法術光）、`serpentTattooSilk`（銀蛇臂紋＋黑紅紗，
  紋身限手臂/肩背、**不得上臉**）、`moonVeilDance`（月夜面紗紗舞紅綬帶）；
  background 加 `burningTempleNight`（夜火古廟）、`moonPavilionNight`（月夜古樓）、`mysticWaterHall`（水面倒影殿堂）；
  lighting 加 `blueFlameGlow`、`moonlightCandle`。
- **F2 魅魔暗黑組**：material 加 `crimsonBatWings`（絳紅琉璃蝠翼＋寶石角飾＋黑蕾絲）；
  background 加 `darkMirrorChamber`（暗黑鏡面廳＋燭火反射）。
- **F3 花卉紗高訂擴充（A 群 8 張的精髓）**：material 加 4 個花種——
  `spiderLilyGold`（彼岸花＋金箔絲＋藍天）、`osmanthusGoldGauze`（金桂花紗）、
  `orchidPurpleGauze`（紫蘭花紗）、`sakuraGoldCheongsam`（粉金櫻花旗袍＋金箔枝）。
- **F4 材質 UI 分組（純 UI，不改 prompt）**：78+ 個材質平鋪難選，加群組小標題：
  甜點食品／寶石琉璃／花卉紗藝／東方幻想／神聖天界／暗黑系／科技產品／機甲未來。
  比照 magazine「高風險系」小標作法，只動 HTML 排版。

## 5. 任務 S：store-ad.html 優化

- **S1 主視覺素材模式（新 radio 區）**：純設計版面（預設，現狀）／上傳商品照當主視覺／
  上傳人物照當主視覺／上傳店面照當主視覺。
  人物照模式：咒語掛 `CORE_IDENTITY_LOCK`＋`CORE_FACE_GEOMETRY_LOCK`＋`storeAdCore.lighting`
  （lighting 已定義但目前**沒用到**——這是現存小 bug，順手接上）；
  商品/店面照模式：加「use the uploaded photo as the hero visual, keep it accurate」句。
- **S2 節慶快選**：campaign=festival 時出現子選項：春節／情人節／母親節／父親節／中秋／萬聖／聖誕／周年慶，
  各帶對應視覺元素詞（例：春節=紅金燈籠梅枝）。
- **S3 風格加 4**：手繪插畫風／日系雜誌風／復古台味招牌／科技 3C 感。
- **S4 文字可讀性**：咒語加一句 fallback——文字區用高對比純色底或留白；
  「if any Traditional Chinese text cannot be rendered perfectly, leave that text area blank instead of printing wrong characters」。
  比例加 `16:9 橫式`（FB 封面/電子看板）。

## 6. 任務 L：分類邏輯修正（審查結論，小步修）

- **L1（travel）**CAMERA_ANGLES 混入景別項：`wide_scene`/`cover`/`distant_hero` 是構圖景別，
  與 COMPOSITION A-F 同軸，同時選會互相矛盾（例：F 大景遠構＋cover 封面特寫）。
  最小修法：這三個選項的 UI 說明加註「會覆蓋構圖選擇」，並在組裝時若選了這三者其一，
  跳過 COMPOSITION 段落（避免兩段互斥指令同時出現）。
- **L2（magazine）**style(34) 裡的藝術媒材類（`ink_flower`/`white_stone_sculpture`/`glass_refraction`/
  `white_paper_flower`/`geometric_light_portrait`）與 media(8) 是同一軸，
  同時選（如 ink_flower＋oil_portrait）會出矛盾媒材指令。
  最小修法：選了這 5 個 style 時，media 自動鎖回 `realistic_studio` 並在 UI 上 disable 其他 media（提示文字說明原因）。
- **L3（magazine）**themePreset 93 個平鋪：UI 加群組小標（現代時尚／中式古風／和風日系／
  性感系／藝術媒材／廣告用途／奇幻）。純 UI 分組，不改資料與輸出。
- **L4（跨頁定位）**travel 有哥德/仙氣、magazine 有妖狐/魔女、fantasy 有美妝香氛——重疊是刻意的不用改，
  但 index.html 三張卡片各補一句定位（旅拍=戶外實景敘事／雜誌=棚拍版面與人像張力／幻想=材質藝術與非現實世界觀）。
- **L5（選配，需 owner 另行同意才做）**travel styleBlock 加裁決句「主題與風格衝突時以主題場景為準」——
  這會改既有輸出文字，屬契約高風險，只寫進 review 文件供 owner 決定。

## 7. 執行順序與驗收

順序：L1-L3（小修）→ T（旅拍三模組+光線+preset）→ M → F → S。每完成一組：

1. `node scripts\check-static.mjs` 全過。
2. `node scripts/build-prompt-preview.mjs`：舊選項組合 0 diff；新選項各出一份 sample 存 `output/`。
3. 新增 prompt 全文寫入 `docs/d-prompt-review-2026-07-15.md`，**停下等 owner 確認後才 commit**。
4. Chrome 實測：travel 選「auto 姿勢/auto 服裝」輸出與改前一致；選新姿勢/新服裝有對應段落；
   store-ad 人物照模式咒語含身份鎖定；magazine 藝術媒材 style 時 media 被鎖 realistic_studio。
5. 收工更新 `CLAUDE.md` 與本文件（標記完成項）。
