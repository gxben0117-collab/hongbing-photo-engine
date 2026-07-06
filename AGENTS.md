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
- 下一步：owner 可用 ChatGPT A/B 實測 travel 水彩、magazine 日系動畫等插畫媒材。
  後續若再改咒語文字，仍需依 `docs/core-prompt-contract.md` 先提供改前/改後對照。
- 已拍板不做：性別中性化（本產品即為女性設計）、多模型輸出切換（只給 ChatGPT 用）。
