# 專案文件索引

## 先讀這兩份

- [開發日誌](development-log.md) — 依時間排序的完整開發記錄，想知道「現在狀態」
  或「某功能是哪一批加的、為什麼這樣改」都查這份。
- [核心咒語保護契約](core-prompt-contract.md) — 改動身份鎖定、臉部幾何、骨架、
  光線一致性等核心規則前，必看；未經 owner 同意不得修改受保護範圍。

## 核心參考文件（現況有效，會持續更新）

- [使用方式](usage.md)
- [核心咒語邏輯](core-logic.md) — 共用核心區塊、輸出段落順序、插畫媒材條件化、
  stale 保護、元素級獨立隨機、版權角色名規則、三個驗證腳本的用途
- [底層保護核心](shared-protection-core.md) — travel/magazine/fantasy 共用的
  身份保護語意細節（最高優先順序、必要語意範本）
- [專案架構](architecture.md) — 目錄結構、腳本用途、搬移與維護原則
- [工程維護規劃](engineering.md) — 技術債判斷、模組化風險分級、上架前檢查
- [功能分類總表](function-category-map.md) — 新增模板/選項時該放哪一頁的判斷原則

### 各頁流程

- [寫真旅拍流程](travel-workflow.md)
- [雜誌棚拍流程](magazine-workflow.md)
- [幻想廣告咒語產生器分類表](fantasy-ad-workflow.md)
- [公仔工作流程](doll-workflow.md)

### 較舊、規模較大的參考文件

- [完整程式規格邏輯文件](full-program-spec.md) — 早期詳細規格書，新功能不保證
  已補進去，以 `development-log.md` 與各頁實際程式碼為準

## 開發紀錄歸檔（`history/`）

一次性的批次交接、A/B 對照文件，內容已經吸收進 `development-log.md`，
保留是為了追溯「當時為什麼這樣決定」的完整脈絡，**不用當成現況參考**：

- [2026-06-21 交接備忘](history/ai-handoff-2026-06-21.md)
- [2026-07-06 交接文件（任務 A/B/C 全計畫）](history/ai-handoff-2026-07-06.md)
- [2026-07-06 咒語瘦身 B 波對照](history/b-prompt-review-2026-07-06.md)
- [2026-07-07 咒語瘦身 C 波對照](history/c-prompt-review-2026-07-06.md)
- [2026-07-15 第四波方案（讀圖擴充三頁）](history/handoff-2026-07-15-batch4.md)
- [2026-07-15 咒語改動對照](history/d-prompt-review-2026-07-15.md)
- [2026-07-18 第三批讀圖對照](history/e-prompt-review-2026-07-18.md)
- [v4.3 版本記錄（原始版本說明，已併入開發日誌）](history/v4.3-change-log.md)
