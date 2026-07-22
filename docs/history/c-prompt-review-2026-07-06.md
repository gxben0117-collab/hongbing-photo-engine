# 任務 C 咒語優化審核稿 — 2026-07-06

本文是第三波任務 C 的 owner 審核稿與正式套用紀錄。Owner 已於 2026-07-07 同意正式套用 C0 / C1 / C2。

## 產出位置

- 預覽工具：`scripts/build-prompt-preview.mjs`
- 對照包：`output/ab-test-2026-07-06-c/`
- Base revision：`HEAD`

對照包包含：

- `base-travel-realistic.txt` / `worktree-travel-realistic.txt`
- `base-travel-watercolor.txt` / `worktree-travel-watercolor.txt`
- `base-magazine-realistic.txt` / `worktree-magazine-realistic.txt`
- `base-magazine-illustration.txt` / `worktree-magazine-illustration.txt`
- `base-fantasy-default.txt` / `worktree-fantasy-default.txt`
- `preview-report.md`

## C1 核心第二刀瘦身

### 核心字數量測

| Block | Before | After | Delta |
| --- | ---: | ---: | ---: |
| `identityLock` | 862 | 646 | -216 |
| `faceGeometryLock` | 413 | 237 | -176 |
| `realisticAnatomy` | 666 | 666 | 0 |
| `cameraReconstruction` | 491 | 491 | 0 |
| `lightingUnification` | 843 | 400 | -443 |
| `skinTexture` | 239 | 239 | 0 |
| `illustrationReconstruction` | 695 | 695 | 0 |
| `negativePrompt` | 346 | 230 | -116 |
| `outputQuality` | 150 | 150 | 0 |
| `poseNaturality` | 330 | 218 | -112 |
| `cleanFrame` | 127 | 127 | 0 |
| **total** | **5162** | **4099** | **-1063** |

結果：核心 blocks 總量降到 4099，進入任務 C 目標區間 3900–4100。

### 語意對照

| 區塊 | Before | After | 語意變化 |
| --- | --- | --- | --- |
| `identityLock` | `Use the uploaded person as the only subject.` + `Use the uploaded photo as the only identity source.` + `Same person face.` + `Same facial identity.` + `Identity Recognition Priority Maximum.` + `Recognizable By Family And Friends At First Sight.` | `Use uploaded person/photo as the only subject and identity source; same face/identity, family/friends recognizable at first sight.` | 同義合併，保留唯一人物、唯一身份來源、本人臉、身份辨識與親友辨識。 |
| `identityLock` | `Preserve original face shape...` + `Preserve natural asymmetry...` | `Preserve original face shape, eyes, eyebrows, nose, lips, jawline, proportions, gaze, age impression, natural asymmetry, personal features and temperament.` | 同義合併，保留五官、比例、眼神、年齡感、自然不對稱與氣質。 |
| `identityLock` | `Style, costume... must not overwrite...` + `Identity preservation has priority above...` | `Style, costume, material, lighting, pose and background must not overwrite/redesign the face; identity priority stays above all styling, editorial, material and environment changes.` | 同義合併，保留身份優先級。 |
| `identityLock` | `No face swap... No beautification that changes identity.` | `No face swap, identity drift, facial reconstruction/redesign or identity-changing beautification.` | No 系列合併，語意保留。 |
| `identityLock` | `No AI beauty template face...` | `No AI beauty, influencer, celebrity or generic template face.` | No 系列合併，語意保留。 |
| `faceGeometryLock` | 10 行 `Preserve Original X` | `Preserve original forehead height, face width, eye shape/distance, nose shape/width/bridge, lip shape, jawline width and chin shape.` | 列舉合併，保留全部臉部幾何項。 |
| `lightingUnification` | 同一光源 / 同方向 / 臉身一致 / 環境光 / 材質反射等多行 | `Unified light: one global source, direction, color temp and exposure apply to face, body, outfit and background.` + `Environmental/material reflections affect the entire subject, including face.` | 同義合併，保留全局光源、方向、色溫、曝光、環境與材質反射。 |
| `lightingUnification` | 整合照片與自然陰影多行 | `Render face/body/outfit/background as one integrated photograph with natural shadows.` | 合併，保留整合照片與自然陰影。 |
| `lightingUnification` | No independent face lighting / beauty light / portrait lighting / relighting / pasted face / floating subject | `No independent face/beauty/portrait light, face relighting, pasted/separately rendered face or floating subject.` | No 系列合併，語意保留。 |
| `negativePrompt` | 18 行逐條 No | 2 行合併式 No | 未移除負面類別，只把 face / anatomy / lighting / text / watermark 合併。 |
| `poseNaturality` | Natural body mechanics / weight / center / hands / body turn / head angle 分行 | `Natural body mechanics: weight, gravity, hands, body turn and head angle.` | 同義合併，保留自然姿勢機制。 |
| `poseNaturality` | `Head, gaze, shoulders... must belong to one coherent moment.` | `Head/gaze/shoulders/torso/arms/legs form one coherent moment.` | 縮寫，語意保留。 |
| `poseNaturality` | No contradictory direction / stiff pose / robot pose / broken limb geometry | `No contradictory head/body direction, stiff/robot pose or broken limbs.` | No 系列合併，語意保留。 |

### 刪除條目清單與理由

本輪沒有刪除獨立語意；所有刪除行都被合併進新句。

未動區塊：

- `realisticAnatomy`
- `cameraReconstruction`
- `skinTexture`
- `illustrationReconstruction`
- `outputQuality`
- `cleanFrame`

## C2 fantasy-fashion 插畫媒材條件化

### 新增核心輸出

`assets/core-prompt.js` 的 `fantasyCore` 新增：

```js
illustrationSkeleton: illustrationHumanCore
```

### fantasy 非攝影材質第一波清單

本輪只選明確偏紙雕 / 水彩 / 水墨的材質，不把金屬、玻璃、寶石、食物、科技材質一起插畫化：

- `paperOiran`
- `paperSculpture`
- `redPaperWedding`
- `watercolorBloom`
- `inkPeony`
- `inkGold`
- `whitePaperFlower`

自訂材質若包含 `illustration`、`watercolor`、`anime`、`manga`、`oil painting`、`paper`、`ink`，也會走插畫骨架。

### C2 驗證

對照包中：

- `base-fantasy-default.txt` 含【真實膚質系統】與 `Visible fine pores`
- `worktree-fantasy-default.txt` 含【插畫媒材比例重建系統】
- `worktree-fantasy-default.txt` 不含【真實膚質系統】與 `Visible fine pores`

## C4 選配提案

以下只列提案，未套用：

- 把【主題】區塊提前到身份鎖定之後。優點是 ChatGPT 更早知道場景；缺點是改段落順序，屬契約管制。
- travel `STYLES` 中英格式統一。優點是可讀性一致；缺點是會改大量風格字句，需要另外 A/B。

## 驗證

- `node scripts\check-static.mjs`：PASS
- `node scripts\build-prompt-preview.mjs --base HEAD --out output\ab-test-2026-07-07-c-final`：PASS
- 核心量測：total 4099
- Chrome UI 實測：`travel.html`、`magazine.html`、`doll.html`、`fantasy-fashion.html`、`store-ad.html` 皆可生成與複製。
- C2 條件化實測：travel 水彩、magazine 漫畫、fantasy `paperSculpture` 皆切到插畫骨架/插畫膚質；travel / magazine 寫實媒材仍保留真實膚質。

## 套用狀態

- C0 預覽工具：已正式套用。
- C1 核心第二刀瘦身：已正式套用。
- C2 fantasy-fashion 插畫媒材條件化：已正式套用。
- C4 選配提案：未套用，保留為後續提案。
