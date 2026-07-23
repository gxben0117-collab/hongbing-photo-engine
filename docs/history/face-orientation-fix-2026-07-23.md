# 臉部朝向修正：改前／改後

## 起因

owner 在 anime-hero.html 用「背對背蓄勢」互動實測，發現原圖是正面／接近正面，咒語
也沒有要求側臉，但出圖卻側臉了。經 owner 貼 ChatGPT 的診斷討論，確認根因：
`assets/core-prompt.js` 共用骨架文字裡有一句方向模糊的規則，被「背對背、各自面向
相反方向」這類姿勢描述帶偏，讓 AI 把「姿勢」誤解為可以拖著「臉」一起轉向。

owner 確認原始設計是「臉為主，姿勢配合臉部」，不是反過來。

## 改動 1：共用核心（`assets/core-prompt.js`，影響全部 6 個工具頁）

| | 內容 |
|---|---|
| 改前 | `Pose must match head direction and facial gaze.` |
| 改後 | `Head and facial gaze direction take priority; body, shoulders and torso must rotate to naturally support the existing head direction — never rotate the head or face away from its natural front-facing angle just to match a body-direction instruction.` |

這句屬於 `CORE_REALISTIC_ANATOMY`（【真人骨架系統】），透過 `humanCore`/
`illustrationHumanCore` 被 travel/magazine/doll/fantasy-fashion/anime-hero/
store-ad 共用。改動只釐清因果方向（臉優先、身體配合），不改變原本「防止頭身
角度不一致、脫離身體的臉」的防呆語意。

## 改動 2：anime-hero.html 專屬（只影響這一頁）

新增 `FACE_ORIENTATION_GUARD` 常數，插在【互動構圖】之後、【構圖法則】之前：

```
【臉部朝向保護系統｜高優先級】

Any "opposite direction", "back to back", "facing away", "face one another" or similar interaction-staging language describes the companion's and the human subject's body, shoulder and torso placement only.
The human subject's face must remain front-facing or near-front-facing toward the camera regardless of interaction staging, unless the selected camera angle explicitly calls for a profile or three-quarter view.
No profile face. No extreme three-quarter facial angle caused by interaction staging alone.
```

同時修正三個本來就帶方向性描述、風險最高的互動姿勢文字，讓身體轉向跟臉部朝向
明確拆開（其餘互動如 backGuard／sideBySync／energyLink 等配角在旁或在後，本來
就不需要主角轉頭，未動）：

- **背對背蓄勢（backToBack）**：加註「opposing placement 只描述肩膀與軀幹，
  頭部仍轉回鏡頭方向、臉部維持清楚可見」。
- **鏡界對視（mirrorGaze）**：把「face one another」改成「angle their bodies
  toward one another」，並加註「頭與眼神轉回鏡頭方向，臉呈現接近正面的
  三分之二角度，而不是側臉」。
- **對戰蓄勢（faceoffReady）**：把「face the same off-frame direction」改成
  「angle their bodies toward the same off-frame direction」，並加註這只是
  肩膀／軀幹對齊，臉仍朝向鏡頭。

## 驗證

- `check-static.mjs`／`validate-preset-refs.mjs`（anime-hero 20 筆 presets）／
  `audit-100x.mjs`（六頁共 600 次模擬）全過 0 issue。
- scratchpad jsdom smoke test：對 backToBack/mirrorGaze/faceoffReady/backGuard/
  sideBySync 五種互動逐一 dispatch change + 點真正的 `generateBtn`，確認輸出都
  含新的 `FACE_ORIENTATION_GUARD`（「臉部朝向保護系統」「No profile face」）；
  另外確認輸出含新的骨架句、不再含舊的模糊句。0 JS error、0 failure。
- `build-prompt-preview.mjs` 這次**預期會有 diff**（因為共用核心文字本來就是
  刻意改變的一部分，不是意外 regression）。
