# 三大產生器共用底層保護核心

適用頁面：

- `travel.html` 寫真旅拍
- `magazine.html` 雜誌棚拍
- `fantasy-fashion.html` 幻想廣告

這三個工具可以有不同外層風格，但底層保護核心必須一致。任何新增選項、模板、姿態、材質、光影或構圖時，都不可破壞以下優先順序。

## 最高優先順序

1. 身份鎖定
2. 臉部幾何鎖定
3. 頭身協調與人體自然性
4. 姿態自然性
5. 全局光線一致
6. 人物與場景融合
7. 外層風格、服裝、材質、場景、廣告效果

外層風格永遠不能覆蓋前六項。也就是說，旅拍、棚拍、幻想廣告都可以改變衣服、背景、材質、光線氛圍，但不能改變「這個人是誰」、臉部結構、頭身關係與整體光線邏輯。

## 身份鎖定

目的：避免 AI 把參考人物重建成模板美女、網紅臉、明星臉或廣告模特臉。

必要語意：

```text
Use the uploaded person as the only subject.
Use the reference photo for identity only.
Same person face, same facial identity.
Identity Recognition Priority Maximum.
Recognizable By Family And Friends At First Sight.

No face swap.
No AI beauty template face.
No celebrity face.
No influencer face.
No identity drift.
```

## 臉部幾何鎖定

目的：身份不只靠「像本人」這種抽象詞，還要鎖住額頭、眼型、鼻型、嘴型、下巴與臉寬。

必要語意：

```text
Facial Geometry Lock System
Preserve Original Forehead Height
Preserve Original Face Width
Preserve Original Eye Shape
Preserve Original Eye Distance
Preserve Original Nose Shape
Preserve Original Nose Width
Preserve Original Nose Bridge
Preserve Original Lip Shape
Preserve Original Jawline Width
Preserve Original Chin Shape

No Facial Reconstruction
No Facial Redesign
No Facial Beautification
No Facial Stylization

Identity Preservation Priority Above Costume
Identity Preservation Priority Above Materials
Identity Preservation Priority Above Environment
Identity Preservation Priority Above Advertising Style
```

## 頭身協調

目的：避免臉保住了，但頭部角度、脖子、肩膀、身體姿勢不自然，造成像貼圖或後製合成。

必要語意：

```text
Head Neck Shoulder Spine Alignment Must Be Anatomically Coherent.
Face And Head Must Belong Naturally To The Same Body Pose.
Pose Must Match Head Direction And Facial Gaze.
No Contradictory Head And Body Direction.
No pasted-on face.
No mismatched head and body angle.
No twisted neck.
```

## 身體比例與自然人體

目的：避免全身圖被拉成超模腿、超窄腰、娃娃比例或不符合參考人物的身材。

必要語意：

```text
Realistic Human Anatomy System
Natural head to body ratio.
Natural shoulder width.
Natural neck length.
Natural torso depth.
Natural limb proportions.
Preserve reference body type and mature natural body impression.

No supermodel body replacement.
No overlong legs.
No ultra narrow waist.
No fashion model body template.
No doll proportions.
No deformed body.
```

## 姿態自然性

目的：避免姿態與頭部、眼神、手腳方向互相矛盾。

必要語意：

```text
Natural Body Mechanics
Natural Weight Distribution
Natural Center Of Gravity
Natural hand placement
Natural head angle
Head, gaze, shoulders, torso, arms and legs belong to the same natural moment.

No stiff pose.
No broken limbs.
No impossible twist.
No extra fingers.
No unstable anatomy.
```

## 全局光線一致

目的：避免臉像棚燈補光，身體和背景卻是另一套光源，導致人物浮起來或像後製貼上。

必要語意：

```text
Global Lighting Consistency
Subject And Environment Share The Same Light Source
Face Lighting Must Match Body Lighting
Single Global Lighting Environment
Same Light Direction Across Face Body Hair Clothing And Background
Physically Accurate Light Interaction
Environmental Lighting Affects Entire Subject
Face Body Hair Costume Background Rendered Under The Same Lighting Conditions
Lighting Consistency Priority Maximum

No Independent Beauty Light
No Face Relighting
No Separate Portrait Lighting
No Detached Portrait Lighting
No Floating Subject Effect
```

## 人物與場景融合

目的：人物不是貼在背景上，而是在同一個旅拍現場、棚拍空間或幻想廣告場景中被同一套光線與材質影響。

必要語意：

```text
Integrated Subject Rendering System
Face Is Part Of The Scene
Face Must Not Be Rendered Separately
No Independent Face Exposure
No Separate Face Lighting
No Portrait Mode Face Processing
No Beauty Filter Rendering
No Face Enhancement Pipeline
Environmental Reflections Affect Face
Material Reflections Affect Face
Face Receives Light From Surrounding Materials
Face Receives Light From Surrounding Environment
Entire Subject Rendered As One Cohesive Scene
Integrated Subject Rendering Priority Maximum
```

## 全身與遠景特別規則

全身、遠景、海報全景、大景旅拍最容易身份漂移，因為臉部在畫面中的面積變小。這些模式必須額外保護。

必要語意：

```text
Full Body Identity Protection
When full body or wide poster framing is selected, keep the face readable and recognizable.
Do not sacrifice facial identity for outfit, body silhouette, background, particles or material spectacle.
Facial likeness remains the highest priority even when the face is small in frame.
```

## 實作規則

- 生成咒語的最前段必須先放身份與臉部幾何保護，再放風格、構圖、姿態、材質、光線。
- 外層模板只能設定分類預設，不可跳過底層保護核心。
- 強材質、全身構圖、走秀姿態、遠距鏡頭都必須保留臉部可辨識與頭身協調。
- 若新增高風險姿態，必須加強自然重心、手腳清楚、頭身方向一致。
- 若新增光影或場景，必須保留全局光線一致與人物融合系統。
- 若新增美妝、廣告、精品、超模類詞彙，必須避免觸發模板臉或過度美化。

## 檢查清單

每次修改三大產生器時，至少確認：

- 咒語最前面有身份鎖定或臉部幾何鎖定。
- 咒語包含全局光線一致。
- 咒語包含人物融合。
- 姿態描述不會讓頭部、臉、脖子、肩膀、身體方向互相矛盾。
- 全身與遠景模式仍要求臉部可辨識。
- 沒有使用會覆蓋身份的模板美女、網紅臉、明星臉、超模身材詞彙作為最高優先條件。
