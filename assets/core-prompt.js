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

  const CORE_FINAL_IDENTITY_PRIORITY = `Final identity priority: preserve the reference face, facial geometry, age impression and recognizable features. Any custom direction may change only styling, clothing, pose, lighting, background or composition; never replace, redesign, beautify, composite or separately render the face.`;

  const CORE_AUTO_POSE_PROMPT = `AI pose selection: choose the single most suitable natural photographic pose for the selected theme, garment silhouette, composition, camera angle, lighting and setting. Present the clothing and subject clearly with relaxed hands, balanced weight and coherent head-neck-shoulder-spine alignment; do not combine incompatible actions or multiple poses.`;

  const CORE_AUTO_COLOR_PROMPT = `AI theme-aware color selection: based on the selected theme, garment silhouette, materials, lighting and background, choose one coherent dominant color, one supporting color and one restrained accent color. Keep the palette culturally and contextually appropriate, preserve subject-background separation, material readability and premium editorial harmony; do not randomly mix unrelated hues or override the selected theme.`;

  const CANONICAL_RATIO_VALUES = Object.freeze([
    "9:16", "4:5", "1:1", "2:3", "3:4", "16:9", "4:3", "21:9"
  ]);

  const CANONICAL_RATIO_PROMPTS = Object.freeze({
    "9:16": "aspect ratio 9:16, vertical social media story composition",
    "4:5": "aspect ratio 4:5, vertical social media feed composition",
    "1:1": "aspect ratio 1:1, square commercial composition",
    "2:3": "aspect ratio 2:3, vertical magazine composition",
    "3:4": "aspect ratio 3:4, vertical editorial poster composition",
    "16:9": "aspect ratio 16:9, horizontal cinematic composition",
    "4:3": "aspect ratio 4:3, horizontal editorial composition",
    "21:9": "aspect ratio 21:9, cinematic wide banner composition",
    A4: "A4 vertical print poster composition"
  });

  const DOLL_RATIO_VALUES = Object.freeze(["9:16", "1:1", "3:4", "4:3", "2:3", "4:5"]);

  const STANDARD_PORTRAIT_PAGE_FILES = Object.freeze([
    "magazine.html", "fantasy-fashion.html", "chinese-classical.html",
    "japanese-kimono.html", "korean-hanbok.html", "xianxia.html",
    "anime-character.html", "flower-fairy.html", "isekai-fantasy.html",
    "floral-sweet.html", "gala-socialite.html", "bridal-editorial.html",
    "kpop-idol.html", "battle-academy.html", "ancient-goddess.html"
  ]);

  const STANDARD_PORTRAIT_CONTROLS = Object.freeze([
    "camera", "ratio", "bodyShape", "garmentLayer", "pose"
  ]);

  const TOOL_PAGE_CONTRACTS = {};
  STANDARD_PORTRAIT_PAGE_FILES.forEach(file => {
    TOOL_PAGE_CONTRACTS[file] = {
      family: "standardPortrait",
      identityMode: "referencePortrait",
      sharedControls: STANDARD_PORTRAIT_CONTROLS,
      ratioValues: CANONICAL_RATIO_VALUES
    };
  });
  TOOL_PAGE_CONTRACTS["travel.html"] = {
    family: "travelPortrait",
    identityMode: "referencePortrait",
    sharedControls: ["camera", "ratio", "pose"],
    ratioValues: CANONICAL_RATIO_VALUES
  };
  TOOL_PAGE_CONTRACTS["doll.html"] = {
    family: "dollTransformation",
    identityMode: "dollConversion",
    sharedControls: ["ratio", "pose"],
    ratioValues: DOLL_RATIO_VALUES
  };
  TOOL_PAGE_CONTRACTS["store-ad.html"] = {
    family: "storeAdvertisement",
    identityMode: "conditionalPersonHero",
    sharedControls: ["ratio"],
    ratioValues: ["4:5", "9:16", "1:1", "A4", "16:9"]
  };
  TOOL_PAGE_CONTRACTS["editorial-identity.html"] = {
    family: "editorialDesignStage2",
    identityMode: "sourceImageLock",
    sharedControls: ["ratio"],
    ratioValues: ["2:3", "3:4", "4:5", "1:1", "9:16", "4:3", "3:2", "16:9", "2:1"]
  };
  Object.freeze(TOOL_PAGE_CONTRACTS);

  const CUSTOM_IDENTITY_CONFLICT_MESSAGE = "這段自訂要求可能與身份鎖定衝突；生成器仍會優先保留參考照的臉部與身份。請改寫為服裝、姿勢、光線、背景或構圖要求。";
  const CUSTOM_IDENTITY_CONFLICT_PATTERN = /(face\s*swap|swap\s*(the\s*)?face|replace\s*(the\s*)?face|change\s*(the\s*)?(face|identity|person)|different\s*(face|person)|new\s*(face|identity)|redesign\s*(the\s*)?face|regenerate\s*(the\s*)?face|改成另一個人|換臉|換成別人|更換臉|改臉|重做臉|重新設計臉|不同身份|另一張臉)/iu;

  function installCustomIdentityConflictWarning(root) {
    if (!root || !root.querySelectorAll) return;
    const inputs = Array.from(root.querySelectorAll([
      "input[id^=custom]", "textarea[id^=custom]", "input[name^=custom]", "textarea[name^=custom]",
      "#extraNote", "#colorNote", "#customStyling"
    ].join(",")));
    if (!inputs.length) return;

    if (!root.querySelector("style[data-hb-lock-warning]")) {
      const style = root.createElement("style");
      style.dataset.hbLockWarning = "";
      style.textContent = ".hb-lock-warning{display:none;margin-top:6px;color:#F0B7C5;font-size:12px;line-height:1.55}.hb-lock-warning.is-visible{display:block}";
      (root.head || root.documentElement).appendChild(style);
    }

    inputs.forEach(input => {
      if (input.dataset.hbLockWarningReady === "true") return;
      input.dataset.hbLockWarningReady = "true";
      const warning = root.createElement("div");
      warning.className = "hb-lock-warning";
      warning.setAttribute("role", "status");
      warning.textContent = CUSTOM_IDENTITY_CONFLICT_MESSAGE;
      const container = input.closest(".field, .custom-choice, label") || input.parentElement;
      if (container) container.appendChild(warning);
      const warningId = `${input.id || input.name || "custom-input"}-lock-warning`;
      warning.id = warningId;
      const describedBy = input.getAttribute("aria-describedby");
      input.setAttribute("aria-describedby", describedBy ? `${describedBy} ${warningId}` : warningId);
      const update = () => warning.classList.toggle("is-visible", CUSTOM_IDENTITY_CONFLICT_PATTERN.test(input.value || ""));
      input.addEventListener("input", update);
      update();
    });
  }

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

Reconstruct one continuous physical person — head, neck, clavicle, rib cage and spine as one coherent anatomical structure. The preserved identity must emerge naturally within that body, never as a composited, overlaid, pasted-on or independently rendered face.

No oversized head, big head small body effect, deformed body, warped anatomy, extra limbs, extra arms, extra fingers or broken hands.
No doll proportions unless doll page explicitly requires doll style.
No pasted-on face, floating face, composited or separately rendered face, identity overlay or independently rotated head.
No mismatched head-body angle, disconnected neck, twisted neck or broken head-neck-shoulder alignment.`;

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

  const CORE_LIGHTING_UNIFICATION = `【光線與膚色一致性系統】

Unified light: one global source, direction, color temperature and exposure apply to face, body, outfit and background.
Environmental and material reflections affect the entire subject, including the face; face and body share the same color temperature, white balance and skin tone rendering.
The face is part of the scene and must be rendered within the same integrated photograph, not processed, relit or exposed separately.
No independent beauty/portrait light, no face relighting, no artificial facial whitening or separate facial brightening, no beauty filter or face enhancement pipeline, no pasted/separately-rendered face or floating subject.
A natural, subtle facial fill and eye catchlight are allowed, but only as part of the same global lighting environment — never flat, never overexposed, never breaking the shared white balance.`;

  const CORE_COMPOSITION_CONTROL = `Commercial Composition Control:
Subject scale follows the selected framing ratio.
Keep the subject clear inside the crop, with clean breathing room around the head and body.
If the body is visible, keep the body proportion coherent and do not enlarge the head to preserve the face; facial likeness stays readable even when the face is small in frame.
Poster layout, negative space and material effects must support the model instead of crowding the face.`;

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
No oversized head, extra limbs/arms/fingers, broken hands, warped anatomy, inconsistent/independent face light, random text or watermark.

${CORE_FINAL_IDENTITY_PRIORITY}`;

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
Luxury Editorial Quality.

${CORE_FINAL_IDENTITY_PRIORITY}`;

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
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const chineseClassicalCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Traditional Chinese clothing aesthetics and editorial art direction only affect clothing, ornaments, background, lighting, composition, mood and textile surface.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: [
      CORE_NEGATIVE_PROMPT,
      `Chinese classical page scope:
No xianxia fantasy, no cultivator identity, no magical aura, no spell effects,
no futuristic technology, no cyberpunk, no sci-fi, no mecha,
no mechanical armor, no technology interface, no generic Western fantasy costume.
Keep the positive visual language grounded in traditional Chinese clothing,
period-informed Chinese silhouettes and refined Chinese editorial photography.`
    ].join("\n\n"),
    output: CORE_OUTPUT_QUALITY
  };

  const japaneseKimonoCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Japanese kimono aesthetics and Japanese editorial art direction only affect clothing, ornaments, background, lighting, composition, mood and textile surface.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: [
      CORE_NEGATIVE_PROMPT,
      `Japanese kimono page scope:
No Chinese hanfu, no Korean hanbok, no qipao, no xianxia fantasy, no magical aura,
no generic fantasy robe, no anime cosplay, no samurai armor, no futuristic technology,
no cyberpunk, no sci-fi, no mecha or mechanical armor.
Keep the positive visual language grounded in authentic Japanese kimono construction,
Japanese textile traditions and culturally coherent Japanese settings.`
    ].join("\n\n"),
    output: CORE_OUTPUT_QUALITY
  };

  const koreanHanbokCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Korean hanbok aesthetics and Korean editorial art direction only affect clothing, ornaments, background, lighting, composition, mood and textile surface.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    illustrationSkeleton: illustrationHumanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: [
      CORE_NEGATIVE_PROMPT,
      `Korean hanbok page scope:
No Japanese kimono, no Chinese hanfu, no qipao, no xianxia fantasy, no magical aura,
no generic fantasy robe, no anime cosplay, no samurai styling, no futuristic technology,
no cyberpunk, no sci-fi, no mecha or mechanical armor.
Keep the positive visual language grounded in authentic Korean hanbok construction,
Korean textile traditions and culturally coherent Korean settings.`
    ].join("\n\n"),
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
    compositionGuard: CORE_COMPOSITION_CONTROL,
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
    compositionGuard: CORE_COMPOSITION_CONTROL,
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
    compositionGuard: CORE_COMPOSITION_CONTROL,
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
    compositionGuard: CORE_COMPOSITION_CONTROL,
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

  const editorialCore = {
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const floralSweetCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, sweet floral fashion and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const galaSocialiteCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, evening gala fashion and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const kpopIdolCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, Korean idol stage and street fashion art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const battleAcademyCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, Japanese school-battle manga inspired uniform design (gakuran, sailor fuku, kimono-inspired academy wear) and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.
This is a photorealistic live-action photography campaign, not an anime/illustration conversion — render skin, face and body with realistic photographic detail, not cel-shaded or illustrated medium.

Uniform battle-ification is not armor-ification: fashion first, school identity second, fantasy styling third; armor stays OFF by default and only appears when explicitly selected. No cape or cloak is ever added. Fantasy details enhance the uniform, never replace it or its archetype.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  const bridalEditorialCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      "Style Scope Rule:\nBridal fashion, veil, wedding accessories and fine-art editorial direction only affect clothing, ornaments, background, lighting, composition, mood and textile surface.\nThey must not change the person's facial structure, identity, age impression or recognizable features.\nThis is a solo bridal portrait, not a multi-person wedding scene."
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: [
      CORE_NEGATIVE_PROMPT,
      "Bridal page scope:\nNo extra person, no groom, no bridal party, no duplicated bride, no wedding text, no random lettering,\nno generic fantasy costume, no magical effects, no futuristic technology, no cyberpunk, no armor.\nKeep the visual language grounded in premium bridal fashion photography and coherent wedding couture."
    ].join("\n\n"),
    output: CORE_OUTPUT_QUALITY
  };

  const ancientGoddessCore = {
    identityGuard: [
      CORE_IDENTITY_LOCK,
      CORE_FACE_GEOMETRY_LOCK,
      `Style Scope Rule:
Commercial style, ancient-civilization and mythological goddess fashion (Greco-Roman temple attire, Dunhuang mural apsara costume) and art direction only affect clothing, ornaments, background, lighting, composition, mood and surface texture.
They must not change the person's facial structure, identity, age impression or recognizable features.`
    ].join("\n\n"),
    anatomyGuard: humanCore,
    poseGuard: CORE_POSE_NATURALITY,
    lightingGuard: CORE_LIGHTING_UNIFICATION,
    compositionGuard: CORE_COMPOSITION_CONTROL,
    negativePrompt: CORE_NEGATIVE_PROMPT,
    output: CORE_OUTPUT_QUALITY
  };

  window.CORE_IDENTITY_LOCK = CORE_IDENTITY_LOCK;
  window.CORE_FACE_GEOMETRY_LOCK = CORE_FACE_GEOMETRY_LOCK;
  window.CORE_REALISTIC_ANATOMY = CORE_REALISTIC_ANATOMY;
  window.CORE_CAMERA_RECONSTRUCTION = CORE_CAMERA_RECONSTRUCTION;
  window.CORE_LIGHTING_UNIFICATION = CORE_LIGHTING_UNIFICATION;
  window.CORE_SKIN_TEXTURE = CORE_SKIN_TEXTURE;
  window.CORE_FINAL_IDENTITY_PRIORITY = CORE_FINAL_IDENTITY_PRIORITY;
  window.HB_AUTO_POSE_PROMPT = CORE_AUTO_POSE_PROMPT;
  window.HB_AUTO_COLOR_PROMPT = CORE_AUTO_COLOR_PROMPT;
  window.CORE_NEGATIVE_PROMPT = CORE_NEGATIVE_PROMPT;
  window.CORE_OUTPUT_QUALITY = CORE_OUTPUT_QUALITY;
  window.HB_CANONICAL_RATIO_VALUES = CANONICAL_RATIO_VALUES;
  window.HB_CANONICAL_RATIO_PROMPTS = CANONICAL_RATIO_PROMPTS;
  window.HB_TOOL_CONTRACTS = TOOL_PAGE_CONTRACTS;
  window.HB_CUSTOM_IDENTITY_CONFLICT_MESSAGE = CUSTOM_IDENTITY_CONFLICT_MESSAGE;
  window.HB_INSTALL_CUSTOM_IDENTITY_WARNING = installCustomIdentityConflictWarning;
  window.HB_CORE_PROMPT = {
    version: "v4.41",
    contracts: TOOL_PAGE_CONTRACTS,
    ratios: CANONICAL_RATIO_PROMPTS,
    controls: {
      autoPose: CORE_AUTO_POSE_PROMPT,
      autoColor: CORE_AUTO_COLOR_PROMPT
    },
    blocks: {
      identityLock: CORE_IDENTITY_LOCK,
      faceGeometryLock: CORE_FACE_GEOMETRY_LOCK,
      realisticAnatomy: CORE_REALISTIC_ANATOMY,
      cameraReconstruction: CORE_CAMERA_RECONSTRUCTION,
      lightingUnification: CORE_LIGHTING_UNIFICATION,
      skinTexture: CORE_SKIN_TEXTURE,
      finalIdentityPriority: CORE_FINAL_IDENTITY_PRIORITY,
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
      chineseClassical: chineseClassicalCore,
      japaneseKimono: japaneseKimonoCore,
      koreanHanbok: koreanHanbokCore,
      xianxia: xianxiaCore,
      anime: animeCore,
      flowerFairy: flowerFairyCore,
      isekai: isekaiCore,
      doll: dollCore,
      storeAd: storeAdCore,
      floralSweet: floralSweetCore,
      galaSocialite: galaSocialiteCore,
      bridalEditorial: bridalEditorialCore,
      kpopIdol: kpopIdolCore,
      battleAcademy: battleAcademyCore,
      ancientGoddess: ancientGoddessCore,
      editorial: editorialCore
    }
  };

  if (typeof document !== "undefined") {
    const mountCustomIdentityWarning = () => installCustomIdentityConflictWarning(document);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountCustomIdentityWarning, { once: true });
    else mountCustomIdentityWarning();
  }
})();
