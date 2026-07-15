# 第四波咒語改動對照 — 2026-07-15（Claude Code 執行）

依 `docs/handoff-2026-07-15-batch4.md` 執行。**已驗證：舊選項組合輸出 0 diff**
（`output/ab-test-2026-07-15/` base vs worktree 五組全同、核心 blocks 零變動）。
本文件列出所有新增/變更，供 owner 確認後 commit。

## 驗證結果

- `node scripts\check-static.mjs`：全過（五頁語法/連結/重複 id）。
- `node scripts/build-prompt-preview.mjs`：travel 寫實/水彩、magazine 寫實/插畫、fantasy 預設
  五組舊組合 base vs worktree **完全相同**；核心 blocks 長度全部 delta 0。
- 整合驗證腳本（77 項）：新選項資料鍵、preset 引用、HTML↔資料一一對應，全過。
- 新選項輸出範例：`output/ab-test-2026-07-15/sample-travel-新姿勢服裝裝扮.txt`
  （黃金時刻＋茶席斟茶＋旗袍＋盤髮＋髮飾花，5,377 字元）。

## 一、travel.html（新增三模組，default=auto 時輸出與改前完全一致）

- **08 姿勢**（新 radio 區）：auto＋12 姿勢（回眸站姿/倚牆/欄杆遠眺/階梯輕坐/街拍蹲姿/
  行走回望/撩髮側望/輕提裙擺/背影遠望/執傘漫步/茶席斟茶/捧花輕嗅）。
  每個皆以「Identity And Facial Features Remain Clearly Recognizable」收尾；
  英文全文見 `travel.html` 的 `POSE_STYLES`。段落插在鏡頭之後、動態節奏之前。
- **09 服裝方向**：auto＋9 方向（飄逸洋裝/旗袍/和服浴衣/學院制服/Y2K街頭/牛仔休閒/
  度假風/晚禮服/冬季大衣），非 auto 時在服裝邏輯模組尾端追加
  「Costume Direction: ...＋服裝以上述方向為主軸,細節仍需符合主題世界觀」。
- **10 裝扮細節**：髮型（auto＋5）與配件（無＋5）各一組卡片；有選時輸出
  【裝扮細節模組】並以「Styling must not change facial identity or face shape」收尾。
- **光線 +5**：黃金時刻夕陽 golden_hour／藍調暮色 blue_hour／霓虹夜街 neon_night／
  清晨柔霧 morning_mist／燈籠暖夜 lantern_night。
- **快選 +2**：海邊城堡夕陽（golden_hour＋階梯坐＋飄逸洋裝）、中式庭院茶席（斟茶＋旗袍）。
- **L1 行為變更（唯一會改舊輸出的項目）**：鏡頭選「雜誌封面感／廣角環境感／遠距主視覺」時
  **不再輸出 01 構圖段落**（兩者同軸互斥，舊行為會同時輸出矛盾景別指令）。
  三張卡片 UI 已加註「(覆蓋01構圖)」。其他鏡頭選項行為不變。
- 亂數快選不會抽新模組（自動重設為 auto/無），行為與改前一致。

## 二、magazine.html

- **背景 +5**：中式閨房床榻 chinese_bedroom／緞面床單晨光 satin_bed_morning／
  海邊逆光 seaside_backlight／櫻花道 cherry_avenue／古風書房 scholar_study。
- **光線 +2**：床邊燭燈暖光 bedside_candle_warm／海邊自然逆光 seaside_sun_backlight。
- **主題快選 +6**：古風私房、緞面晨光私房（私房系，尺度承襲現有性感系：優雅不露骨）；
  日雜海邊封面；亂世紅顏、古風軍師、絳紗夜宴（古風原創，無任何遊戲/角色名）。
- BG→光線推薦映射（BG_LIGHTING_MAP）已補 5 筆。
- **L2 審查結論＝不需修改**：實查發現每個 style 的 `STYLE_PRESET_DEFAULTS` 本來就會
  自動帶入相容 media（如 ink_flower→fashion_illustration），衝突已有機制擋住，
  原方案的硬鎖定反而會干擾既有 preset，故不做。

## 三、fantasy-fashion.html

- **材質 +8**：藍焰蓮花法術 arcaneFlameLotus／蛇靈紋身黑紗 serpentTattooSilk
  （紋身限手臂肩背，prompt 明寫 never on face or neck）／月夜面紗紗舞 moonVeilDance
  （面紗在眼下，眼與上臉可見）／絳紅琉璃蝠翼 crimsonBatWings／
  彼岸花金箔 spiderLilyGold／金桂花紗 osmanthusGoldGauze／
  紫蘭花紗 orchidPurpleGauze／粉金櫻花旗袍 sakuraGoldCheongsam。
- **背景 +4**：夜火古廟 burningTempleNight／月夜古樓 moonPavilionNight／
  水面殿堂 mysticWaterHall／暗黑鏡廳 darkMirrorChamber。
- **光線 +2**：藍焰法術光 blueFlameGlow／月光燭火混合光 moonlightCandle。
- 新材質皆為寫實攝影系，不列入插畫骨架 key 清單。

## 四、store-ad.html

- **01b 主視覺素材**（新選區，預設「純設計版面」＝現狀輸出）：
  上傳商品照／上傳人物照／上傳店面照。人物照模式咒語掛
  `identityLock`＋`faceGeometryLock`＋`storeAdCore.lighting`
  （**順手修好 lighting 已定義未使用的既有問題**，僅人物模式掛，其他模式輸出不變）。
- **節慶快選**：活動類型選「節慶活動」時出現 8 節慶下拉（春節/情人節/母親節/父親節/
  中秋/萬聖/聖誕/周年慶），選了會插入對應視覺元素英文句。
- **風格 +4**：手繪插畫風／日系雜誌風／復古台味／科技3C感。
- **文字可讀性**：咒語固定加一句「文字放高對比純色底或留白；無法完整渲染的中文字寧可留白」。
- **比例 +1**：橫式 16:9（FB 封面/看板）。
- 注意：store-ad 預設會即時 generate，新固定句會出現在所有新輸出中（這是 S4 設計目的）。

## 五、未做（留給 Codex 或下波）

- L3 magazine 93 preset UI 分組、F4 fantasy 材質 UI 分組：純 UI 排版工程，
  需重排大量 HTML chips，不影響咒語輸出，建議另開一波做。
- L5 travel styleBlock 裁決句：屬既有輸出文字變更，仍待 owner 另行同意。

## 待 owner 確認

看過本文件與 sample 後回覆，即可 git commit（目前所有改動都在工作目錄未提交）。
