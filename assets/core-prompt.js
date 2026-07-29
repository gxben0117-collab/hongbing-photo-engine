(function(){
  const CORE_IDENTITY_LOCK = `【身份鎖定系統｜最高優先級】

Use uploaded person/photo as the only subject and identity source; same face/identity, family/friends recognizable at first sight.

The reference photo locks identity only, not the original composition — body, pose, clothing, hairstyle and environment may be freely reconstructed for the new scene unless explicitly requested otherwise.

Preserve original face shape, eyes, eyebrows, nose, lips, jawline, proportions, gaze, age impression, natural asymmetry, personal features and temperament.
Style, costume, material, lighting, pose and background must not overwrite/redesign the face; identity priority stays above all styling, editorial, material and environment changes.

No face swap, identity drift, facial reconstruction/redesign or identity-changing beautification.
No AI beauty, influencer, celebrity or generic template face.`;

  const CORE_FACE_GEOMETRY_LOCK = `【臉部幾何鎖定系統】

Preserve original forehead height, face width, eye shape/distance, nose shape/width/bridge, lip shape, jawline width and chin shape.

Face Similarity Maximum.
No facial reconstruction, redesign, beautification or stylization.`;

  const CORE_REALISTIC_ANATOMY = `【真人骨架系統】

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
Head pose may freely turn, tilt or gaze in whatever direction the selected pose requires; identity and facial geometry stay unchanged regardless of head direction. Neck, shoulders, torso and spine must always rotate to naturally follow and support the established head direction — never force the head or face to twist away from a natural angle just to match a body or pose direction instead.

No oversized head, big head small body effect, deformed body, warped anatomy, extra limbs, extra arms, extra fingers or broken hands.
No doll proportions unless doll page explicitly requires doll style.
No pasted-on face, mismatched head and body angle or twisted neck.`;

  const CORE_CAMERA_RECONSTRUCTION = `【鏡頭重建系統】

Ignore original selfie perspective.
Ignore original lens distortion.
Reconstruct full human body naturally when body is visible.
Fashion editorial camera distance.
Commercial photography camera logic.
Body scale priority over face scale.
Head size follows selected framing.
If full body or wide poster framing is selected, keep body proportion coherent and do not enlarge the head to preserve the face.
Face remains readable and recognizable even when the face is smaller in frame.`;

  const CORE_LIGHTING_UNIFICATION = `【光線一致性系統】

Unified light: one global source, direction, color temp and exposure apply to face, body, outfit and background.
Environmental/material reflections affect the entire subject, including face.
Render face/body/outfit/background as one integrated photograph with natural shadows.
No independent face/beauty/portrait light, face relighting, pasted/separately rendered face or floating subject.`;

  const CORE_SKIN_TEXTURE = `【真實膚質系統】

Realistic skin texture.
Visible fine pores.
Natural skin tone.
Natural facial structure.
Natural skin micro-detail.
No plastic skin.
No over-smoothing.
No waxy face.
No porcelain doll skin unless doll page explicitly requires it.`;

  const CORE_ILLUSTRATION_RECONSTRUCTION = `【插畫媒材比例重建系統】

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
No detached face look.`;

  const CORE_NEGATIVE_PROMPT = `【通用負面約束】

No face swap/drift, AI/influencer/celebrity/template face, duplicated/pasted face.
No oversized head, extra limbs/arms/fingers, broken hands, warped anatomy, inconsistent/independent face light, random text or watermark.`;

  const CORE_OUTPUT_QUALITY = `【輸出規格】

4K Quality.
Ultra Detailed.
High-End Commercial Photography.
Magazine Quality.
Cinematic Photography.
Sharp focus.
Professional color grading.`;

  const CORE_POSE_NATURALITY = `【姿勢自然性系統】

Natural body mechanics: weight, gravity, hands, body turn and head angle.
Head/gaze/shoulders/torso/arms/legs form one coherent moment.
No contradictory head/body direction, stiff/robot pose or broken limbs.`;

  const CORE_CLEAN_FRAME = `【畫面淨化系統】

Only One Human / Solo Subject.
No Crowd.
No Extra Person.
No duplicated person.
Luxury Editorial Quality.`;

  const identityCore = [
    CORE_IDENTITY_LOCK,
    CORE_FACE_GEOMETRY_LOCK
  ].join("\n\n");

  const humanCore = [
    CORE_REALISTIC_ANATOMY,
    CORE_CAMERA_RECONSTRUCTION,
    CORE_SKIN_TEXTURE
  ].join("\n\n");

  const illustrationHumanCore = [
    CORE_REALISTIC_ANATOMY,
    CORE_ILLUSTRATION_RECONSTRUCTION
  ].join("\n\n");

  const travelCore = {
    identity: identityCore,
    skeleton: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    pose: CORE_POSE_NATURALITY,
    photographer: `【時尚攝影師模組】

Human-Centered Editorial Composition.
Pose And Framing Support Identity Recognition.
Refined Travel Fashion Storytelling.
Professional Commercial Photography Direction.`,
    motion: `【旅拍動作導演模組】

Captured Mid-Step.
Captured Between Movements.
Turning While Walking.
Interacting With Environment.
Hair Movement.
Dress Movement.
Looking Toward Destination.
Candid Editorial Moment.
Identity And Facial Features Remain Clearly Recognizable During Motion.`,
    lighting: CORE_LIGHTING_UNIFICATION,
    cleanframe: CORE_CLEAN_FRAME,
    output: CORE_OUTPUT_QUALITY
  };

  const magazineCore = {
    identity: identityCore,
    skeleton: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    pose: CORE_POSE_NATURALITY,
    photographer: `【時尚攝影師模組】

Human-Centered Editorial Composition.
Pose And Framing Support Identity Recognition.
Refined Magazine Storytelling.
Professional Cover Photography Direction.`,
    lighting: CORE_LIGHTING_UNIFICATION,
    cleanframe: CORE_CLEAN_FRAME,
    output: CORE_OUTPUT_QUALITY
  };

  const fantasyCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, fantasy material and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const xianxiaCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, xianxia material and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const isekaiCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, Japanese isekai/JRPG costume design and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.
This is a photorealistic photography campaign, not an anime/illustration conversion — render skin, face and body with realistic photographic detail, not cel-shaded or illustrated medium.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const CORE_ANIME_IDENTITY_PRESERVATION = `【動漫化身份保留系統】

Anime style affects rendering technique only — line art, cel shading, color palette and visual medium; it must not redesign or replace the person's identity.

Preserve: original face shape, eye shape and relative proportions, eyebrow shape, nose shape, lip shape, jawline, chin shape, age impression, personal temperament and recognizable identity — all translated into anime style, not overwritten by it.

No generic anime girl face, no template moe/bishoujo face, no oversized template doe-eyes replacing the reference eye shape, no exaggerated tiny pointed chin unless the reference face already has that structure.

The character must remain recognizable as the same person even after anime stylization.`;

  const animeCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      CORE_ANIME_IDENTITY_PRESERVATION
    ].join("\n\n"),
    anatomyGuard: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const flowerFairyCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, floral material and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const CORE_JAPANESE_SUMMER_EDITORIAL_DIRECTION = `【日系商業旅拍美學方向】

Japanese commercial summer resort editorial photography aesthetic.
Refined, natural and premium Japanese summer magazine visual language.

Affects photography aesthetic, composition mood and visual language only; never overrides subject identity, facial geometry, age impression or recognizable features.`;

  const CORE_JAPANESE_SWIMWEAR_EDITORIAL_ADDENDUM = `Japanese commercial swimwear editorial photography aesthetic, refined summer resort magazine presentation.`;

  const summerIslandCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, summer island material and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    photographyDirection: CORE_JAPANESE_SUMMER_EDITORIAL_DIRECTION,
    swimwearDirection: CORE_JAPANESE_SWIMWEAR_EDITORIAL_ADDENDUM,
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const dollCore = {
    identityLock: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Doll page exception:
Cute doll proportions and porcelain-like material are allowed only for the doll figure style.
Even in doll style, the character must remain recognizable as the uploaded person.`
    ].join("\n\n")
  };

  const storeAdCore = {
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY,
    lighting: CORE_LIGHTING_UNIFICATION
  };

  window.CORE_IDENTITY_LOCK = CORE_IDENTITY_LOCK;
  window.CORE_FACE_GEOMETRY_LOCK = CORE_FACE_GEOMETRY_LOCK;
  window.CORE_REALISTIC_ANATOMY = CORE_REALISTIC_ANATOMY;
  window.CORE_CAMERA_RECONSTRUCTION = CORE_CAMERA_RECONSTRUCTION;
  window.CORE_LIGHTING_UNIFICATION = CORE_LIGHTING_UNIFICATION;
  window.CORE_SKIN_TEXTURE = CORE_SKIN_TEXTURE;
  window.CORE_NEGATIVE_PROMPT = CORE_NEGATIVE_PROMPT;
  window.CORE_OUTPUT_QUALITY = CORE_OUTPUT_QUALITY;
  window.HB_CORE_PROMPT = {
    version: "v4.3",
    blocks: {
      identityLock: CORE_IDENTITY_LOCK,
      faceGeometryLock: CORE_FACE_GEOMETRY_LOCK,
      realisticAnatomy: CORE_REALISTIC_ANATOMY,
      cameraReconstruction: CORE_CAMERA_RECONSTRUCTION,
      lightingUnification: CORE_LIGHTING_UNIFICATION,
      skinTexture: CORE_SKIN_TEXTURE,
      illustrationReconstruction: CORE_ILLUSTRATION_RECONSTRUCTION,
      negativePrompt: CORE_NEGATIVE_PROMPT,
      outputQuality: CORE_OUTPUT_QUALITY,
      poseNaturality: CORE_POSE_NATURALITY,
      cleanFrame: CORE_CLEAN_FRAME
    },
    page: {
      travel: travelCore,
      magazine: magazineCore,
      fantasy: fantasyCore,
      xianxia: xianxiaCore,
      anime: animeCore,
      flowerFairy: flowerFairyCore,
      isekai: isekaiCore,
      summerIsland: summerIslandCore,
      doll: dollCore,
      storeAd: storeAdCore
    }
  };
})();
