(function () {
  // Routing manifest only. Source images and source prompt text stay outside the public site.
  const clusterIds = {
    modernPortrait: [1, 5, 12, 19],
    luxuryLifestyle: [2, 15],
    magazineBeauty: [3],
    travel: [4, 10, 14, 22],
    fantasyFashion: [7, 8, 9, 11, 16, 21],
    animeCharacter: [6, 18],
    kpopIdol: [17],
    doll: [13],
    chineseClassicalCandidate: [20]
  };

  const defaultOwnerByCluster = {
    modernPortrait: 'modern-portrait.html',
    luxuryLifestyle: 'luxury-lifestyle.html',
    magazineBeauty: 'magazine.html',
    travel: 'travel.html',
    fantasyFashion: 'fantasy-fashion.html',
    animeCharacter: 'anime-character.html',
    kpopIdol: 'kpop-idol.html',
    doll: 'doll.html',
    chineseClassicalCandidate: 'chinese-classical.html'
  };

  const sourceFiles = {
    1: '765958478_122131493115351811_4657255906291385306_n.jpg',
    2: '766008206_122123655686810342_5905976644216513484_n.jpg',
    3: '785200755_1082498991202573_2529650869947719464_n.jpg',
    4: '788967330_10163863597973731_2061338909842825778_n.jpg',
    5: '789178734_122112730557423635_5785654117771566840_n.jpg',
    6: '789680570_122127607418810342_5760096007092161203_n.jpg',
    7: '789987068_122124662763372705_1372300037812757873_n.jpg',
    8: '790003287_27863554036677314_5666411231396426777_n.jpg',
    9: '790209219_10175029560805244_1363132621867333185_n.jpg',
    10: '790256744_122112886083428973_1217580046522952904_n.jpg',
    11: '790440039_10234742453891643_5171216940761006641_n.jpg',
    12: '790477075_29174557198812498_6642056522845114255_n.jpg',
    13: '790519947_10165026684227764_245956128486593196_n.jpg',
    14: '790541206_1381728603483776_8202393485356476298_n.jpg',
    15: '790685598_29174556772145874_4617307729151797863_n.jpg',
    16: '790970140_29183922774527796_4834290644937849705_n.jpg',
    17: '791130090_1541805457750136_790803569624990576_n.jpg',
    18: '791144997_29183921764527897_4882791114605822927_n.jpg',
    19: '791276671_122130002624778725_5795778422837569124_n.jpg',
    20: '792104670_2896363890730728_590905845153094728_n.jpg',
    21: '792910620_10239492300900604_7365697305275932506_n.jpg',
    22: '793204028_10245121926169106_6421530320238265276_n.jpg'
  };

  const ownerById = {};
  for (const [cluster, ids] of Object.entries(clusterIds)) {
    for (const id of ids) ownerById[id] = defaultOwnerByCluster[cluster];
  }

  const specialCases = [
    { id: 1, action: 'record-only', reason: '茶飲店畫面可能含店家招牌、菜單或可讀文字；只吸收日常紀錄構圖，不複製文字或品牌。' },
    { id: 3, action: 'record-only', reason: '美妝近景與粉色羽飾方向已由雜誌頁既有語彙涵蓋；不新增來源妝容、唇色或身份特徵。' },
    { id: 4, action: 'record-only', reason: '雪景溫泉和風方向已由旅拍既有模板涵蓋；不重複建立同質的雪景服裝控制。' },
    { id: 5, action: 'record-only', reason: '醫療／捐血場景含制服、標誌與可讀資訊；不把醫療身份或來源文字帶入正式模板。' },
    { id: 6, action: 'record-only', reason: '制服靈感可作動漫真人分類參考，但不推定來源年齡，也不複製校名、人物或角色身份。' },
    { id: 8, action: 'record-only', reason: '多角色插畫屬既有插畫媒材方向；不把角色、畫風或多人物關係混入真人幻想模板。' },
    { id: 9, action: 'record-only', reason: '未來城市服裝含強烈科幻語彙；只保留分類紀錄，不新增跨頁科技幻想控制。' },
    { id: 13, action: 'record-only', reason: '畫面含工作室名稱或可讀字樣；不複製品牌、字體、商標或原圖文字。' },
    { id: 16, action: 'record-only', reason: '來源畫面帶有水印／來源文字與偏暗藝術語氣；不將水印、固定色調或來源身份帶入頁面。' },
    { id: 18, action: 'record-only', reason: '畫面可能對應既有動漫／IP角色；不複製角色姓名、臉部、服裝專屬符號或版權內容。' },
    { id: 20, action: 'candidate-only', reason: '旗袍與圓扇具中式古典候選特徵，但目前中式頁主軸是漢風、盛唐、宋韻與新式漢服，先不擴張成旗袍模板。' },
    { id: 22, action: 'record-only', reason: '度假泳裝畫面涉及單張身材與服裝尺度；旅拍既有度假方向足夠，不新增身材或泳裝核心。' }
  ];

  window.HB_STYLE_REFERENCE_BATCH_2026_09_02_SECOND = {
    batchId: '2026-09-02-folder-22-second-batch',
    sourceFolder: 'C:/Users/User/Desktop/ai生圖/風格範例',
    expectedCount: 22,
    sourcePromptFiles: [],
    clusterIds,
    defaultOwnerByCluster,
    ownerById,
    sourceFiles,
    specialCases,
    adoptionPlan: {
      modernPortrait: [{ key: 'teaShopSnapshot', sourceIds: [1] }],
      travel: [{ key: 'coastalBicycleFloral', sourceIds: [14] }],
      fantasyFashion: [
        { key: 'crystalShardBeautyPortrait', sourceIds: [7] },
        { key: 'scarletGauzeFieldEditorial', sourceIds: [11] },
        { key: 'inkCalligraphyCouture', sourceIds: [21] }
      ],
      recordOnly: ['luxuryLifestyle', 'magazineBeauty', 'animeCharacter', 'kpopIdol', 'doll'],
      candidateOnly: ['chineseClassicalCandidate']
    },
    corePolicy: 'Do not copy source identity, appearance, brand text, readable text, fixed body ratios or whole source prompts into shared cores. New formal templates may reuse existing page-local option keys, but must not modify assets/core-prompt.js.'
  };
})();
