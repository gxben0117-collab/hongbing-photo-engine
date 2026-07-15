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
  `output/ab-test-2026-07-15/`。**尚未 commit，等 owner 確認 review 文件後提交。**
