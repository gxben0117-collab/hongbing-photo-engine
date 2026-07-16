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
- 下一步：owner 用 ChatGPT 出圖實測（a）第三波核心瘦身 A/B（`output/ab-test-2026-07-07-c-final/`）
  （b）第四波新選項抽測（中式庭院茶席、彼岸花金箔、藍焰蓮花、古風私房）
  （c）新特效模板抽測（墨染水雲/碎鏡爆散/冰晶凍結）
  （d）7-16 新增抽測（水晶森林+銀白髮、彩虹雲海+粉彩虹髮、玻璃城市+現代西裝）。
  選配待議：L5 travel 主題裁決句（改舊輸出需同意）、doll.html 全頁體檢。
