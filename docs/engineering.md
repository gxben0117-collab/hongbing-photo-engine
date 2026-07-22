# 工程維護規劃

## 現況判斷

專案目前是純靜態 GitHub Pages，入口檔直接放在根目錄。這個設計部署成本低、相容性高，短期應保留。

主要技術債不是部署，而是三個工具頁逐漸變成大型單檔：

- `travel.html`：旅拍工具，規模中等
- `magazine.html`：棚拍工具，資料與互動最多，維護風險最高
- `doll.html`：公仔工具，互動相對獨立

## 建議模組方向

第一階段不急著拆 prompt data，避免改動核心咒語。

可優先抽出的低風險模組：

- 卡片單選 helper
- chip 單選 / 多選 helper
- 複製按鈕 helper
- output 顯示 helper
- 靜態檢查腳本
- 共用 CSS token 與版面間距

暫緩抽出的高風險模組：

- 各頁 prompt data
- 最終 prompt assembly
- 主題聯動預設
- 核心身份與五官約束

## 目標結構

在不破壞 GitHub Pages 的前提下，建議逐步形成：

```text
/
  index.html
  travel.html
  magazine.html
  doll.html
  assets/
    css/
    js/
  docs/
  scripts/
```

## 維護策略

1. 文件與檢查腳本先行。
2. 只抽共用 UI helper，不動咒語資料。
3. 每次抽取後，用靜態檢查與瀏覽器流程驗證。
4. prompt data 模組化需要 owner 另行同意。

## 靜態檢查

`powershell
node scripts\\check-static.mjs
`

這個腳本檢查入口檔、必要目錄、重複 id、本地連結與 inline JavaScript 語法。

## 上架前最低檢查

- `git status --short`
- `git diff --check`
- `node scripts\check-static.mjs`（HTML 本地連結、重複 id、inline JavaScript 語法）
- 若動到咒語組裝邏輯或新增/調整選項：
  - `node scripts\build-prompt-preview.mjs`（固定選項組合 0-diff 迴歸檢查）
  - `node scripts\audit-100x.mjs`（五頁各隨機 100 組選項，內容稽核）
  - `node scripts\validate-preset-refs.mjs`（三頁一鍵套用/預設連動物件引用的
    欄位值是否都存在於當下選項池，抓 composition/intensity 這類靜默失效）
- 五頁手動生成一次咒語，確認生成/複製正常
