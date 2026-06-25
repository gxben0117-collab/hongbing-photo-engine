(function(){
  const CORE_IDENTITY_LOCK = `【身份鎖定系統｜最高優先級】

Use the uploaded person as the only subject.
Use the uploaded photo as the only identity source.
Same person face.
Same facial identity.
Identity Recognition Priority Maximum.
Recognizable By Family And Friends At First Sight.

Preserve original face shape, eyes, eyebrows, nose, lips, jawline, facial proportions, gaze and age impression.
Preserve natural asymmetry, personal facial features and original temperament.
Style, costume, material, lighting, pose and background must not overwrite or redesign the face.

Identity Preservation Priority Above Costume.
Identity Preservation Priority Above Pose.
Identity Preservation Priority Above Body Styling.
Identity Preservation Priority Above Editorial Style.
Identity Preservation Priority Above Materials.
Identity Preservation Priority Above Environment.
Identity Preservation Priority Above Advertising Style.

No face swap.
No AI beauty template face.
No influencer face.
No celebrity face.
No template face.
No identity drift.
No facial reconstruction.
No facial redesign.
No beautification that changes identity.`;

  const CORE_FACE_GEOMETRY_LOCK = `【臉部幾何鎖定系統】

Preserve Original Forehead Height.
Preserve Original Face Width.
Preserve Original Eye Shape.
Preserve Original Eye Distance.
Preserve Original Nose Shape.
Preserve Original Nose Width.
Preserve Original Nose Bridge.
Preserve Original Lip Shape.
Preserve Original Jawline Width.
Preserve Original Chin Shape.

Face Similarity Maximum.
No Facial Reconstruction.
No Facial Redesign.
No Facial Beautification.
No Facial Stylization.`;

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
Pose must match head direction and facial gaze.

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
No twisted neck.`;

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

Unified Cinematic Lighting System.
Global Lighting Consistency.
Single Global Lighting Environment.
Same light source affects face, body, outfit and background.
Same light direction across face, body and background.
Face lighting must match body lighting.
Subject and environment share the same light source.
Environmental lighting affects entire subject.
Material reflections affect facial lighting.
Face receives light from surrounding materials and environment.
Face, body, outfit and background must be rendered as one integrated photograph.

No independent face lighting.
No independent beauty light.
No separate portrait lighting.
No separate face relighting.
No pasted face look.
Face must not look separately rendered.
Natural shadow transition.
Consistent exposure.
Consistent color temperature.
No floating subject effect.`;

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

  const CORE_NEGATIVE_PROMPT = `【通用負面約束】

No face swap.
No identity drift.
No AI beauty face.
No influencer face.
No celebrity face.
No template face.
No oversized head.
No extra limbs.
No extra arms.
No extra fingers.
No broken hands.
No warped anatomy.
No duplicated person.
No pasted face.
No inconsistent lighting.
No independent face lighting.
No random text.
No watermark.`;

  const CORE_OUTPUT_QUALITY = `【輸出規格】

4K Quality.
Ultra Detailed.
High-End Commercial Photography.
Magazine Quality.
Cinematic Photography.
Sharp focus.
Professional color grading.`;

  const CORE_POSE_NATURALITY = `【姿勢自然性系統】

Natural Body Mechanics.
Natural Weight Distribution.
Natural Center Of Gravity.
Natural hand placement.
Natural body turn.
Natural head angle.
Head, gaze, shoulders, torso, arms and legs must belong to one coherent moment.
No contradictory head and body direction.
No stiff pose.
No robot pose.
No broken limb geometry.`;

  const CORE_CLEAN_FRAME = `【畫面淨化系統】

Only One Human / Solo Subject.
No Crowd.
No Tourist.
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

  const travelCore = {
    identity: identityCore,
    skeleton: humanCore,
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
      negativePrompt: CORE_NEGATIVE_PROMPT,
      outputQuality: CORE_OUTPUT_QUALITY,
      poseNaturality: CORE_POSE_NATURALITY,
      cleanFrame: CORE_CLEAN_FRAME
    },
    page: {
      travel: travelCore,
      magazine: magazineCore,
      fantasy: fantasyCore,
      doll: dollCore,
      storeAd: storeAdCore
    }
  };
})();
