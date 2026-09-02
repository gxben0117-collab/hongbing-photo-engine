(function () {
  // Routing manifest only. Source images and source prompt text stay outside the public site.
  const clusterIds = {
    bridalCore: Array.from({ length: 26 }, (_, index) => index + 1),
    modernPortrait: Array.from({ length: 6 }, (_, index) => index + 27),
    travel: [33],
    magazineFashion: [34, 35, 36, 37],
    chineseClassicalCandidate: [38]
  };

  const defaultOwnerByCluster = {
    bridalCore: 'bridal-editorial.html',
    modernPortrait: 'modern-portrait.html',
    travel: 'travel.html',
    magazineFashion: 'magazine.html',
    chineseClassicalCandidate: 'chinese-classical.html'
  };

  const sourceFiles = {
    1: '38-2.jpg',
    2: '52909876348_167c3c7651_o.jpg',
    3: 'dress2 (1).jpg',
    4: 'images (1).jpg',
    5: 'images (2).jpg',
    6: 'images (3).jpg',
    7: 'images (4).jpg',
    8: 'images (5).jpg',
    9: 'images (6).jpg',
    10: 'images (7).jpg',
    11: 'images (8).jpg',
    12: 'images (9).jpg',
    13: 'images (10).jpg',
    14: 'images (11).jpg',
    15: 'images (12).jpg',
    16: 'images (13).jpg',
    17: 'images (14).jpg',
    18: 'images (15).jpg',
    19: 'images (16).jpg',
    20: 'images.jpg',
    21: 'f7d91492258223f7a341c407fc38f400_35a61c0c0c0c7509a760277848fd906c8a134185.webp',
    22: 'bd3738d50092d7677382f1a23102eade4.webp',
    23: '高雄法國台北婚紗.jpg',
    24: '高雄法國台北婚紗-婚紗照-26.jpg',
    25: '蝴蝶結01.jpg',
    26: '囍聚手工婚紗-1.婚紗-首圖-1.jpg',
    27: '2026-09-02 12.08.12.jpg',
    28: '2026-09-02 12.08.23.jpg',
    29: '2026-09-02 12.08.30.jpg',
    30: '2026-09-02 12.08.36.jpg',
    31: '2026-09-02 12.08.56.jpg',
    32: '2026-09-02 12.09.02.jpg',
    33: '2026-09-02 11.40.41.jpg',
    34: '20250103185017.png',
    35: 'op9lp89mfix8kb5.jpg',
    36: '桃園婚紗推薦,台北婚紗推薦,新北婚紗推薦,婚紗租借,婚紗攝影,美式婚紗,租禮服,婚紗風格,大尺碼婚紗,婚紗包套,婚紗展,宴客禮服,媽媽禮服,伴娘服_ plus平口魚尾1.jpg',
    37: 'product-5512769.webp',
    38: '791975503_122118380643395900_4390467361294184553_n.jpg'
  };

  const ownerById = {};
  for (const [cluster, ids] of Object.entries(clusterIds)) {
    for (const id of ids) ownerById[id] = defaultOwnerByCluster[cluster];
  }

  const specialCases = [
    { id: 1, action: 'record-only', reason: '來源畫面可能含品牌或疊字；只記錄分類，不複製可讀文字。' },
    { id: 11, action: 'record-only', reason: '來源為商業婚紗素材；不採用來源人物身份、品牌或固定外貌。' },
    { id: 23, action: 'record-only', reason: '檔名帶有店家／地區脈絡；正式 Prompt 不引用店家名稱。' },
    { id: 24, action: 'record-only', reason: '商業婚紗來源；不把原圖文字、品牌或單一模特兒特徵帶入模板。' },
    { id: 34, action: 'record-only', reason: '偏正式／商品展示構圖，留在雜誌候選歸屬，不新增婚紗模板。' },
    { id: 36, action: 'record-only', reason: '來源檔名含大量搜尋／品牌語彙；只採用可辨識的服裝展示方向。' },
    { id: 37, action: 'record-only', reason: '商品／品牌展示候選；不複製品牌、浮水印或可讀文案。' },
    { id: 38, action: 'candidate-only', reason: '具中式古典服飾候選特徵，但本批沒有配套咒語文字，先不進正式模板。' },
    { id: 33, action: 'reviewed', reason: '以海上／遊艇環境敘事分流旅拍，不因白色服裝自行改判為婚紗。' }
  ];

  window.HB_STYLE_REFERENCE_BATCH_2026_09_02 = {
    batchId: '2026-09-02-folder-38',
    sourceFolder: 'C:/Users/User/Desktop/ai生圖/風格範例',
    expectedCount: 38,
    clusterIds,
    defaultOwnerByCluster,
    ownerById,
    sourceFiles,
    specialCases,
    adoptionPlan: {
      bridal: [
        'coastalDaylight',
        'coastalHighKeyDaylight',
        'backViewTrainEditorial',
        'backViewOverShoulder',
        'threeBridalEditorialPresets'
      ],
      modernPortrait: 'record-only',
      travel: 'record-only',
      magazine: 'record-only',
      chineseClassical: 'candidate-only'
    },
    corePolicy: 'Do not copy source identity, appearance, brand text, readable text, fixed body ratios or whole source prompts into shared cores.'
  };
})();
