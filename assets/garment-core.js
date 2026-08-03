// Shared garment-core helpers. Theme data stays in each page; this file keeps
// Layer selection, random-pool filtering and prompt-fragment handling consistent.
(function installGarmentCore(global) {
  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function randomKeys(data, preferredKeys) {
    const available = Object.keys(data || {}).filter(key => key !== 'none' && data[key]);
    const preferred = Array.isArray(preferredKeys)
      ? preferredKeys.filter(key => available.includes(key))
      : [];
    return preferred.length ? preferred : available;
  }

  function resolveLayer(selectedLayer, layerKeys, layerCounts) {
    const keys = Array.isArray(layerKeys) && layerKeys.length ? layerKeys : Object.keys(layerCounts || {});
    const key = selectedLayer === 'random'
      ? keys[Math.floor(Math.random() * keys.length)]
      : selectedLayer;
    return { key, targetCount: Number(layerCounts?.[key] ?? 0) };
  }

  function chooseFreeZones(zoneFields, selectedValue, targetCount) {
    const zoneNames = Object.keys(zoneFields || {});
    const active = zoneNames.filter(name => selectedValue(name) !== 'none');
    const free = zoneNames.filter(name => selectedValue(name) === 'none');
    const count = Math.max(0, Math.min(targetCount - active.length, free.length));
    const zones = free.slice().sort(() => Math.random() - 0.5).slice(0, count);
    return { active, free, zones };
  }

  function weightedRandom(items) {
    const pool = (items || []).filter(item => item && item.key);
    if (!pool.length) return '';
    const total = pool.reduce((sum, item) => sum + Math.max(0, Number(item.weight) || 1), 0);
    let cursor = Math.random() * (total || pool.length);
    for (const item of pool) {
      cursor -= Math.max(0, Number(item.weight) || 1);
      if (cursor <= 0) return item.key;
    }
    return pool[pool.length - 1].key;
  }

  function compactPromptParts(parts) {
    return unique(parts.map(part => String(part).trim()));
  }

  global.HB_GARMENT_CORE = Object.freeze({
    randomKeys,
    resolveLayer,
    chooseFreeZones,
    weightedRandom,
    compactPromptParts,
  });
}(window));
