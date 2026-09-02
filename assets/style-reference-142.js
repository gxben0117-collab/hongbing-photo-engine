(function () {
  // This registry stores only anonymized row ids and routing metadata. The
  // source workbook and private reference images stay outside the repository.
  const clusterIds = Object.freeze({
    naturalLifestyle: Object.freeze([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 15, 16, 17, 18, 19, 20, 22, 23,
      27, 28, 30, 32, 34, 37, 39, 42, 48, 50, 51, 52, 54, 58, 59, 61, 62,
      63, 64, 65, 66, 69, 72, 73, 74, 75, 78, 79, 80, 82, 83, 85, 89, 93,
      94, 95, 97, 98, 100, 101, 107, 108, 118, 119, 122, 123, 124, 125, 126,
      127, 128, 129, 130, 131, 132, 134, 135, 136, 137, 138, 139, 140, 141,
      142
    ]),
    resortVacation: Object.freeze([
      14, 21, 25, 29, 33, 35, 36, 43, 47, 49, 53, 68, 76, 77, 81, 86, 91,
      92, 96, 99, 102, 105, 106, 109, 110, 112, 113, 114, 115
    ]),
    brandActivity: Object.freeze([38, 40, 56, 60, 67, 70, 84, 90, 103, 104, 111, 116, 117]),
    artCommercial: Object.freeze([10, 11, 26, 41, 44, 45, 46, 55, 71, 133]),
    nightFashion: Object.freeze([24, 31, 57, 87, 88, 120, 121])
  });

  const defaultOwnerByCluster = Object.freeze({
    naturalLifestyle: 'modern-portrait.html',
    resortVacation: 'travel.html',
    brandActivity: 'magazine.html',
    artCommercial: 'magazine.html',
    nightFashion: 'modern-portrait.html'
  });

  const ownerOverrides = Object.freeze({
    'travel.html': Object.freeze([37, 100, 131, 132]),
    'luxury-lifestyle.html': Object.freeze([30, 39, 59, 81, 93, 99, 118, 136, 137, 141, 142]),
    'magazine.html': Object.freeze([32, 33, 35, 65, 84, 97, 103, 104, 106, 110, 111, 116, 117]),
    'gala-socialite.html': Object.freeze([27, 31, 42, 78, 89, 119]),
    'festival-editorial.html': Object.freeze([38, 40, 57, 80]),
    'floral-sweet.html': Object.freeze([44, 45, 46, 50, 55, 71]),
    'fantasy-fashion.html': Object.freeze([11]),
    'anime-character.html': Object.freeze([121])
  });

  const ownerById = {};
  for (const [cluster, ids] of Object.entries(clusterIds)) {
    for (const id of ids) ownerById[id] = defaultOwnerByCluster[cluster];
  }
  for (const [owner, ids] of Object.entries(ownerOverrides)) {
    for (const id of ids) ownerById[id] = owner;
  }

  const specialCases = Object.freeze([
    { id: 11, title: '黑墨幻想禮服', owner: 'fantasy-fashion.html', status: 'adopt', reason: '非現實水墨禮服與雲霧世界觀主導' },
    { id: 38, title: '紅色高衩活動坐姿', owner: 'festival-editorial.html', status: 'adopt', reason: '明確聖誕活動場景' },
    { id: 40, title: '紅色禮服回眸', owner: 'festival-editorial.html', status: 'adopt', reason: '聖誕樹與節慶背板主導' },
    { id: 57, title: '生日蛋糕夜拍', owner: 'festival-editorial.html', status: 'reserve', reason: '生日是節慶候選子題，先不新增獨立 UI' },
    { id: 80, title: '紅貝雷帽商場', owner: 'festival-editorial.html', status: 'adopt', reason: '聖誕燈飾是主要事件線索' },
    { id: 90, title: '綠牆商品肖像', owner: 'magazine.html', status: 'adopt', reason: '人物與商品展示構成商業產品肖像' },
    { id: 121, title: '黑色毛絨貓耳造型', owner: 'anime-character.html', status: 'reserve', reason: '角色配件單次出現，不進現代寫真選項池' }
  ]);

  window.HB_STYLE_REFERENCE_142 = Object.freeze({
    source: 'C:/Users/User/Downloads/風格範例_142張逐張咒語分析.xlsx',
    expectedCount: 142,
    clusterIds,
    defaultOwnerByCluster,
    ownerOverrides,
    ownerById: Object.freeze(ownerById),
    specialCases
  });
})();
