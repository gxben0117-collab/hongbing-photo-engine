(function () {
  'use strict';

  const catalog = Object.freeze({
    venetianBlindShadowStripe: Object.freeze({
      label: '百葉窗格柵光影',
      family: 'architectural',
      type: 'projected-shadow',
      direction: 'side',
      quality: 'hard',
      contrast: 'high',
      temperature: 'neutral-warm',
      prompt: 'hard directional daylight filtered through venetian blinds, crisp repeating horizontal shadow stripes fall across the subject and background, face remains naturally readable, one unified scene exposure'
    }),
    hardArchitecturalShadowBlock: Object.freeze({
      label: '建築硬光矩形塊影',
      family: 'architectural',
      type: 'projected-shadow',
      direction: 'side',
      quality: 'hard',
      contrast: 'high',
      temperature: 'cool-neutral',
      prompt: 'hard architectural shadow-block lighting, a single directional source casts one crisp rectangular shadow across the wall or floor, dividing the scene into a bright zone and a deep cool shadow zone, face and body share the same exposure'
    }),
    dappledFoliageGradientShadow: Object.freeze({
      label: '枝葉斑駁漸層光影',
      family: 'natural',
      type: 'filtered-sunlight',
      direction: 'top-side',
      quality: 'semi-hard',
      contrast: 'natural-dimensional',
      temperature: 'warm-natural',
      prompt: 'dappled sunlight filtered through leaves and branches, irregular light patches transition from soft shade to gentle full sun across the subject and background, natural exposure and readable face'
    }),
    selfSilhouetteWallDouble: Object.freeze({
      label: '自身剪影疊影牆',
      family: 'architectural',
      type: 'cast-shadow',
      direction: 'side-back',
      quality: 'hard',
      contrast: 'high',
      temperature: 'neutral',
      prompt: 'hard directional light renders the subject naturally while casting her own crisp hard-edged silhouette onto a nearby wall, subject and shadow remain part of one physically coherent scene with aligned light direction'
    }),
    warmCoolSplitAmbient: Object.freeze({
      label: '冷暖雙色溫對比光',
      family: 'mixed-ambient',
      type: 'dual-source',
      direction: 'opposing-sides',
      quality: 'soft-directional',
      contrast: 'controlled',
      temperature: 'warm-cool',
      prompt: 'two distinct environmental light sources meet across the frame, warm amber light on one side and cool blue-violet light on the other, face body clothing and background share the same deliberate warm-versus-cool exposure'
    })
  });

  function resolve(localData, key) {
    if (localData && localData[key]) return localData[key];
    return catalog[key] ? catalog[key].prompt : '';
  }

  function getCatalogData() {
    return catalog;
  }

  function getPromptKeys() {
    return Object.keys(catalog);
  }

  window.HB_LIGHTING_SYSTEM = Object.freeze({
    version: 'v1',
    catalog,
    resolve,
    getCatalogData,
    getPromptKeys
  });
})();
