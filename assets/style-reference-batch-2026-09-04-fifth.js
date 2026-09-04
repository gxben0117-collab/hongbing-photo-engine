(function () {
  // Routing manifest only. Source images stay outside the public site.
  const clusterIds = {
    modernPortrait: [1, 2, 3, 4, 5, 9, 10, 11, 12, 14, 29],
    chineseClassical: [7, 8, 28, 45],
    bridal: [13, 19, 26],
    chineseBridal: [15, 16, 20],
    fantasy: [17, 18, 27],
    floralSweet: [6, 21, 22, 23, 24, 25],
    japaneseKimono: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 49],
    animeCharacter: [46, 47, 48],
    magazineEditorial: [30]
  };

  const defaultOwnerByCluster = {
    modernPortrait: 'modern-portrait.html',
    chineseClassical: 'chinese-classical.html',
    bridal: 'bridal-editorial.html',
    chineseBridal: 'chinese-bridal.html',
    fantasy: 'fantasy-fashion.html',
    floralSweet: 'floral-sweet.html',
    japaneseKimono: 'japanese-kimono.html',
    animeCharacter: 'anime-character.html',
    magazineEditorial: 'magazine.html'
  };

  const sourceFiles = {
    1: '2026-09-04 15.54.53.jpg',
    2: '2026-09-04 15.54.56.jpg',
    3: '2026-09-04 15.54.59.jpg',
    4: '2026-09-04 15.55.17.jpg',
    5: '2026-09-04 15.57.38.jpg',
    6: '2026-09-04 15.57.42.jpg',
    7: '2026-09-04 15.57.51.jpg',
    8: '2026-09-04 16.16.59.jpg',
    9: '2026-09-04 16.17.14.jpg',
    10: '2026-09-04 16.17.52.jpg',
    11: '2026-09-04 16.17.59.jpg',
    12: '2026-09-04 16.59.41.jpg',
    13: '2026-09-04 17.00.16.jpg',
    14: '2026-09-04 17.00.31.jpg',
    15: '2026-09-04 17.13.56.jpg',
    16: '2026-09-04 17.13.59.jpg',
    17: '2026-09-04 17.14.02.jpg',
    18: '2026-09-04 17.14.05.jpg',
    19: '2026-09-04 17.14.10.jpg',
    20: '2026-09-04 17.14.16.jpg',
    21: '2026-09-04 17.37.12.jpg',
    22: '2026-09-04 17.37.15.jpg',
    23: '2026-09-04 17.37.18.jpg',
    24: '2026-09-04 17.37.20.jpg',
    25: '2026-09-04 17.37.22.jpg',
    26: '2026-09-04 17.38.42.jpg',
    27: '2026-09-04 17.42.40.jpg',
    28: '2026-09-04 17.42.48.jpg',
    29: '2026-09-04 17.43.10.jpg',
    30: '2026-09-04 17.43.19.jpg',
    31: '2026-09-04 17.43.47.jpg',
    32: '2026-09-04 17.44.25.jpg',
    33: '2026-09-04 17.44.57.jpg',
    34: '2026-09-04 17.45.18.jpg',
    35: '2026-09-04 17.45.23.jpg',
    36: '2026-09-04 17.45.39.jpg',
    37: '2026-09-04 17.45.44.jpg',
    38: '2026-09-04 17.45.49.jpg',
    39: '2026-09-04 17.45.54.jpg',
    40: '2026-09-04 17.45.59.jpg',
    41: '2026-09-04 17.46.05.jpg',
    42: '2026-09-04 17.46.12.jpg',
    43: '2026-09-04 17.46.23.jpg',
    44: '2026-09-04 17.46.33.jpg',
    45: '2026-09-04 17.46.38.jpg',
    46: '2026-09-04 17.46.43.jpg',
    47: '2026-09-04 17.46.50.jpg',
    48: '2026-09-04 17.46.57.jpg',
    49: '2026-09-04 17.47.05.jpg'
  };

  const ownerById = {};
  for (const [cluster, ids] of Object.entries(clusterIds)) {
    for (const id of ids) ownerById[id] = defaultOwnerByCluster[cluster];
  }

  const specialCases = [
    { id: 6, action: 'reviewed', reason: '花卉甜美真人寫真可轉成花園、花束、柔光與互動控制；不複製來源人物身份。' },
    { id: 7, action: 'reviewed', reason: '中式古典服飾與團扇方向可轉成頁面專屬漢服構圖，不加入仙俠或科技幻想語彙。' },
    { id: 13, action: 'reviewed', reason: '西式婚紗的銀白水晶、教堂空間與冷暖珠光可形成獨立高訂婚紗模板。' },
    { id: 15, action: 'reviewed', reason: '中式婚嫁的紅金婚服與儀式性陳設可轉入中式婚嫁頁，不污染西式婚紗頁。' },
    { id: 17, action: 'record-only', reason: '幻想服裝方向與既有幻想廣告語彙接近；不複製來源角色、身份或固定造型。' },
    { id: 18, action: 'record-only', reason: '可能含角色化或版權風格線索；保留分類紀錄，不把角色名稱或專屬符號加入模板。' },
    { id: 20, action: 'reviewed', reason: '中式婚嫁的紅金禮服方向可用既有婚服資料鍵完成，不新增共用身材或鎖臉文字。' },
    { id: 27, action: 'record-only', reason: '幻想角色化配件與動物化線索可能跨越主題邊界；不帶入共用核心。' },
    { id: 30, action: 'record-only', reason: '雜誌棚拍已有相近精品語彙；只記錄構圖與棚拍方向，不複製品牌、字樣或來源身份。' },
    { id: 46, action: 'record-only', reason: '動漫真人方向保留給動漫角色頁，不把角色化妝髮或版權服裝混入現代真人頁。' },
    { id: 47, action: 'record-only', reason: '角色化視覺與既有動漫頁重疊；不複製角色姓名、臉部身份或專屬符號。' },
    { id: 48, action: 'record-only', reason: '角色化服裝與場景只做來源登記，避免把非現實角色語彙跨頁擴散。' }
  ];

  window.HB_STYLE_REFERENCE_BATCH_2026_09_04_FIFTH = {
    batchId: '2026-09-04-folder-49-fifth-batch',
    sourceFolder: 'C:/Users/User/Desktop/ai生圖/風格範例',
    expectedCount: 49,
    sourcePromptFiles: [],
    clusterIds,
    defaultOwnerByCluster,
    ownerById,
    sourceFiles,
    specialCases,
    adoptionPlan: {
      modernPortrait: [
        { key: 'sunlitWhiteMiniEditorial', sourceIds: [1] },
        { key: 'whiteCropDenimWall', sourceIds: [2] },
        { key: 'blackRuffleStoneWall', sourceIds: [3] },
        { key: 'whiteLaceVintageTable', sourceIds: [4] },
        { key: 'greenFloralCafeGarden', sourceIds: [5] },
        { key: 'blackQipaoMirrorRoom', sourceIds: [9] },
        { key: 'ivoryHydrangeaGarden', sourceIds: [10] },
        { key: 'plumSatinStudyNight', sourceIds: [11] },
        { key: 'brownChairWarmPortrait', sourceIds: [12] },
        { key: 'whiteBlouseCityCloseup', sourceIds: [14, 29] }
      ],
      chineseClassical: [
        { key: 'pastelButterflyFanPortrait', sourceIds: [7] },
        { key: 'ornateFloralHeaddressGarden', sourceIds: [8] },
        { key: 'peachBlossomFanPortrait', sourceIds: [28] },
        { key: 'cherryTemplePastelHanfu', sourceIds: [45] }
      ],
      bridal: [{ key: 'crystalCathedralBride', sourceIds: [13, 19, 26] }],
      chineseBridal: [
        { key: 'phoenixGoldClosePortrait', sourceIds: [15] },
        { key: 'redBlackCoutureBride', sourceIds: [16, 20] }
      ],
      floralSweet: [
        { key: 'hydrangeaGardenPortrait', sourceIds: [6, 21, 22] },
        { key: 'hydrangeaGardenSeated', sourceIds: [23, 24, 25] }
      ],
      japaneseKimono: [
        { key: 'snowLanternKimonoPortrait', sourceIds: [31, 32] },
        { key: 'hydrangeaBlueYukata', sourceIds: [33, 34] },
        { key: 'shrineWhiteYukata', sourceIds: [35, 36] },
        { key: 'teaShopWhiteYukata', sourceIds: [37, 38] },
        { key: 'iceCreamPastelYukata', sourceIds: [39, 40] },
        { key: 'whiteUmbrellaGarden', sourceIds: [41, 42, 43, 44, 49] }
      ],
      recordOnly: ['fantasy', 'animeCharacter', 'magazineEditorial']
    },
    corePolicy: 'Do not copy source identity, appearance, brand text, readable text, fixed body ratios or whole source prompts into shared cores. New formal templates may reuse existing page-local option keys, but must not modify assets/core-prompt.js.'
  };
})();
