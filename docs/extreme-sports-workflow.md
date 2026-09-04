# 極限運動高速攝影流程

## 頁面定位

`extreme-sports.html` 是獨立的戶外動態寫真工具，專注於衝浪、滑雪、滑板與酷跑。核心不是一般運動肖像，而是用高速攝影捕捉一個可讀、可信、具有器材接觸與環境反應的決定性瞬間。

## 控制軸

- 畫面語氣與運動分類
- 動作瞬間與 AI 判斷最佳瞬間
- 運動服裝與器材
- 服裝改造核心與 Layer 0／3／6／9／隨機 Layer
- 身形輪廓、人物姿勢與身體方向
- 光影、色彩與戶外背景
- 拍攝角度、鏡頭感、圖片比例與畫面強度
- 自訂服裝、姿勢、背景、配色與其他要求

每個一鍵模板都回填完整作品概念，不只替換運動名稱。Prompt 組裝會先建立人物與真人骨架，再加入運動一致性、作品概念、器材、動作、場景、攝影與輸出控制。

## 高速攝影規則

頁面專屬核心要求：高速快門凝結一個決定性瞬間；人物、器材、地形與運動方向保持物理合理；水花、雪霧、塵土與衣物反應要服務動作，不得變成無關裝飾。高風險動作以合理安全裝備與可讀接觸面呈現。

## 核心邊界

頁面沿用共用身份鎖定、臉部幾何、真人骨架、鏡頭重建、光線一致與輸出品質核心，不建立平行鎖臉系統。運動頁不納入重機賽車與會遮住臉部的頭盔主題；滑雪等必要安全裝備仍由相符的運動服裝資料控制。

## 驗證

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
node scripts\validate-preset-refs.mjs
node scripts\check-theme-classification.mjs
node scripts\reorder-dom-sections.mjs --check
node scripts\audit-100x.mjs 100
git diff --check
```
