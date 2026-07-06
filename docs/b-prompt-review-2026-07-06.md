# 任務 B 咒語改動審核稿 — 2026-07-06

本文原為改動草案。Owner 已於 2026-07-06 回覆「同意」，Codex 已套用到
`assets/core-prompt.js`、`travel.html`、`magazine.html`。

## 結論

建議分兩段實作：

1. **B1 核心瘦身：先做保守精簡版**
   - 不改最終輸出段落順序。
   - 不移除身份鎖定、臉部幾何、骨架比例、光線一致性。
   - 只把重複的逐行句改成合併句。
   - 估計核心字數下降約 15% 到 25%，不是激進 40%。

2. **B2 插畫媒材條件化：先處理 travel / magazine**
   - `travel.html` 插畫媒材時，改用「插畫媒材版骨架核心」，保留身份與骨架，拿掉真實膚質核心。
   - `magazine.html` 插畫媒材時，同樣改用插畫媒材版骨架核心，並把「膚質質感」改成媒材化描述，避免漫畫 / 插畫仍被真實毛孔拉回攝影感。
   - `fantasy-fashion.html` 第一波不動，因為它沒有獨立媒材選項，且目前主體是商業寫實幻想廣告。

---

## B1：核心瘦身 before / after

### 1. 身份優先級重複句

#### Before

```text
Identity Preservation Priority Above Costume.
Identity Preservation Priority Above Pose.
Identity Preservation Priority Above Body Styling.
Identity Preservation Priority Above Editorial Style.
Identity Preservation Priority Above Materials.
Identity Preservation Priority Above Environment.
Identity Preservation Priority Above Advertising Style.
```

#### After

```text
Identity preservation has priority above costume, pose, body styling, editorial style, materials, environment and advertising style.
```

### 2. 身份負面句

#### Before

```text
No face swap.
No AI beauty template face.
No influencer face.
No celebrity face.
No template face.
No identity drift.
No facial reconstruction.
No facial redesign.
No beautification that changes identity.
```

#### After

```text
No face swap, identity drift, facial reconstruction, facial redesign or beautification that changes identity.
No AI beauty template face, influencer face, celebrity face or generic template face.
```

### 3. 臉部幾何負面句

#### Before

```text
No Facial Reconstruction.
No Facial Redesign.
No Facial Beautification.
No Facial Stylization.
```

#### After

```text
No facial reconstruction, redesign, beautification or stylization.
```

### 4. 真人骨架負面句

#### Before

```text
No oversized head.
No big head small body effect.
No doll proportions unless doll page explicitly requires doll style.
No deformed body.
No warped anatomy.
No extra limbs.
No extra arms.
No extra fingers.
No broken hands.
No pasted-on face.
No mismatched head and body angle.
No twisted neck.
```

#### After

```text
No oversized head, big head small body effect, deformed body, warped anatomy, extra limbs, extra arms, extra fingers or broken hands.
No doll proportions unless doll page explicitly requires doll style.
No pasted-on face, mismatched head and body angle or twisted neck.
```

### B1 影響判斷

- 身份鎖定語意：不變。
- 臉部幾何語意：不變。
- 骨架語意：不變。
- 段落順序：不變。
- 風險：低到中。主要風險是 ChatGPT 對逐行 `No` 的注意力可能略降，但語意仍保留。

---

## B2：插畫媒材條件化 before / after

### Travel 插畫媒材範圍

插畫媒材 key：

```js
watercolor_travel
postcard_illustration
animated_travel
oil_travel_portrait
```

### Travel before

不論選寫實或插畫，`sections` 都固定輸出：

```js
CORE.identity,
CORE.skeleton,
CORE.lighting,
CORE.pose,
CORE.photographer,
...
mediaBlock,
...
```

其中 `CORE.skeleton` 目前等於：

```text
【真人骨架系統】
...

【鏡頭重建系統】
...
Commercial photography camera logic.
...

【真實膚質系統】
Realistic skin texture.
Visible fine pores.
Natural skin micro-detail.
...
```

水彩 / 明信片 / 動畫 / 油畫會被 `Realistic skin texture`、`Visible fine pores`、`Commercial photography camera logic` 拉回攝影感。

### Travel after

插畫媒材時改成：

```js
const isIllustrationMedia = ILLUSTRATION_MEDIA_KEYS.has(mediaKey);
const skeletonBlock = isIllustrationMedia ? CORE.illustrationSkeleton : CORE.skeleton;
```

插畫版骨架核心：

```text
【真人骨架系統】

Realistic adult female anatomy.
Same person face and body.
Natural shoulder width.
Natural neck length.
Natural torso depth.
Natural limb proportions.
Natural head to body ratio.
Natural center of gravity.
Head, neck, shoulders and spine alignment must be anatomically coherent.
Face and head must belong naturally to the same body pose.
Pose must match head direction and facial gaze.
No oversized head, big head small body effect, deformed body, warped anatomy, extra limbs, extra arms, extra fingers or broken hands.
No doll proportions unless doll page explicitly requires doll style.
No pasted-on face, mismatched head and body angle or twisted neck.

【插畫媒材比例重建系統】

Ignore original selfie perspective.
Ignore original lens distortion.
Reconstruct full human body naturally when body is visible.
Body scale priority over face scale.
Head size follows selected framing.
If full body or wide poster framing is selected, keep body proportion coherent and do not enlarge the head to preserve the face.
Face remains readable and recognizable even when the face is smaller in frame.
Render skin, face and body through the selected illustration medium instead of photographic pore detail.
Preserve recognizable facial geometry, natural skin tone impression and age impression within the selected illustration style.
No plastic face.
No detached face look.
```

### Magazine 插畫媒材範圍

插畫媒材 key：

```js
manga_cover
fashion_illustration
oil_portrait
american_comic
korean_webtoon
japanese_anime
```

寫實媒材 key 維持原邏輯：

```js
realistic_studio
black_white_photo
```

### Magazine before

不論寫實或插畫都固定輸出：

```js
CORE.identity,
CORE.skeleton,
bodyShapeBlock,
...
mediaBlock,
...
makeupBlock,
skinTextureBlock,
jewelryBlock,
...
```

問題是插畫媒材時同時存在：

```text
Manga Cover Illustration / Fashion Editorial Illustration / Japanese Anime Illustration Style
```

以及：

```text
Realistic skin texture.
Visible fine pores.
Natural skin micro-detail.
```

再加上使用者的膚質選項可能輸出「真實毛孔」「高級商業膚質」，插畫會被拉回寫實棚拍。

### Magazine after

插畫媒材時：

```js
const isIllustrationMedia = MAGAZINE_ILLUSTRATION_MEDIA_KEYS.has(mediaKey);
const skeletonBlock = isIllustrationMedia ? CORE.illustrationSkeleton : CORE.skeleton;
const resolvedSkinTextureBlock = isIllustrationMedia
  ? illustrationSkinTextureBlock
  : skinTextureBlock;
```

插畫媒材版膚質：

```text
【膚質質感｜插畫媒材版】

Represent skin and makeup through the selected illustration medium.
Preserve the original person's facial identity, natural skin tone impression, age impression and makeup direction.
Do not force photographic pore detail, beauty retouching texture or hyper-real skin micro-detail.
No plastic face.
No detached face look.
```

### B2 影響判斷

- 寫實攝影媒材：輸出不變。
- 插畫媒材：輸出會明顯更尊重媒材，不再被真實膚質核心壓回攝影。
- 身份鎖定：保留。
- 骨架比例：保留。
- 段落順序：不變；只替換同位置的 `CORE.skeleton` 與 `skinTextureBlock` 內容。
- 風險：中。插畫媒材會比較容易出插畫感，但可能比原本少一點真實臉部細節，需要 owner 用 ChatGPT A/B 測 5 到 10 張。

---

## 建議實作順序

1. 先套 B1 保守核心瘦身。
2. 跑 `node scripts\check-static.mjs`。
3. 產出 travel 水彩、magazine 日系動畫各一組 before / after 咒語給 owner A/B。
4. owner 確認後，再套 B2 插畫媒材條件化。

## 需要 owner 確認

請確認是否同意：

- B1 採用「保守瘦身」而不是激進刪除大量 `No`。
- B2 第一波只處理 `travel.html`、`magazine.html`，暫不動 `fantasy-fashion.html`。
- Magazine 插畫媒材時，允許覆蓋原本的膚質質感段落，改用「插畫媒材版膚質」。
