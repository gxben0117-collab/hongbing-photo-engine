# 今日交接備忘

## 這次完成了什麼

### 幻想廣告咒語產生器

- 重新整理分類表，改成更清楚的層級：核心主題、造型輪廓、主題材質、視覺風格、構圖、姿態、鏡頭、光影、背景、自由補充、圖片比例。
- 新增完整的分類文件 [fantasy-ad-workflow.md](fantasy-ad-workflow.md)，讓後續 AI 可以直接照規格接手。
- 在 [fantasy-fashion.html](../fantasy-fashion.html) 重做頁面結構與 prompt 組裝，加入：
  - 核心主題 / 品牌感
  - 造型輪廓 / 服裝形式
  - 主題材質 / 藝術系統
  - 視覺風格 / 廣告調性
  - 構圖取景
  - 姿態動作
  - 鏡頭語法
  - 光影色彩
  - 背景場景 / 留白
  - 自由補充 / 約束
  - 圖片比例
- 補上比例重建語意，重點是：
  - `Reference photo used for identity only`
  - `Same person face`
  - `Face identity preserved`
  - `Body anatomy reconstructed`
  - `Ignore original selfie perspective`
  - `Body scale priority over face scale`
- 修正姿態區可點選但不更新樣式的問題，讓 06 姿態動作可以正常選取與回饋。

### 雜誌棚拍風格咒語產生器

- 在 [magazine.html](../magazine.html) 的 02 主題 / 服裝方向新增 `改良式漢服`。
- 將 `改良式漢服` 補進雜誌棚拍的姿態推薦聯動，讓它更自然地出現在：
  - 貴妃倚坐
  - 單膝跪姿
  - 水袖揚起
  - 持扇遮面
  - 雙手托花/道具

## 驗證結果

- 多次執行 `node scripts\check-static.mjs`，全部通過。
- 實際在瀏覽器中驗證：
  - [fantasy-fashion.html](../fantasy-fashion.html) 的姿態區可正常點選。
  - 光線選單不再輸出 `undefined`。
  - [magazine.html](../magazine.html) 已看得到 `改良式漢服` 選項。

## Git 狀態

- 已提交並推送到 `origin/master`。
- 最近一次 commit：`ec366c0`，訊息是 `Update fantasy and magazine workflows`。

## 接手時要注意

- 根目錄頁面是 GitHub Pages 直接部署模式，沒有 `.github/workflows`。
- 核心咒語內容已更新過，後續若要再改 prompt，先看 [docs/core-prompt-contract.md](core-prompt-contract.md)。
- 目前工作樹還有三個本地未追蹤檔案，屬於 scripts 暫存稿，不要誤納入本次發布：
  - `scripts/guizhou_captions.ass`
  - `scripts/make_guizhou_short.ps1`
  - `scripts/make_guizhou_short_video_heavy.ps1`

## 建議下一步

- 如果要再調整雜誌棚拍，可優先補強姿態與主題的推薦聯動。
- 如果要再調整幻想廣告，可從文案精簡與比例語意再微調。