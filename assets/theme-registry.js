(function () {
  const registry = {
    'index.html': {
      label: '寫真引擎首頁',
      family: 'hub',
      productionMode: 'toolDirectory',
      primaryIntent: '導覽至正確的專題工具',
      owns: ['工具分類與入口連結'],
      allowed: ['所有正式工具頁的正確摘要與入口'],
      forbidden: ['把不同工具的專題素材混成同一頁的生成語言']
    },
    'travel.html': {
      label: '寫真旅拍',
      family: 'travelPortrait',
      productionMode: 'referencePortrait',
      primaryIntent: '真實地點與旅途情境中的人物寫真',
      owns: ['地點', '旅拍情境', '旅行動態', '戶外光線'],
      allowed: ['真實城市、自然景點、交通與旅途中可觀察的生活互動'],
      forbidden: ['棚拍封面專題主導', '純住宅生活方式主導', '奇幻世界觀主導']
    },
    'magazine.html': {
      label: '雜誌棚拍',
      family: 'magazineEditorial',
      productionMode: 'referencePortrait',
      primaryIntent: '人物中心的雜誌封面與棚拍編輯攝影',
      owns: ['封面語氣', '主題服裝', '妝容', '棚拍光線', '封面構圖'],
      allowed: ['高級時裝、精品美妝、封面景別、棚拍背景與編輯表情'],
      forbidden: ['把旅遊地點當成主要敘事', '把完整平面設計當成生成照片本身', '仙俠世界觀']
    },
    'luxury-lifestyle.html': {
      label: 'Luxury Lifestyle',
      family: 'luxuryLifestyle',
      productionMode: 'referencePortrait',
      primaryIntent: '高級住宅中的生活方式廣告與人物寫真',
      owns: ['住宅空間', '沙發', '咖啡桌', '床上', '窗前', '門口', '庭院', '陽台', '吧檯', '生活互動'],
      allowed: ['家具尺度、室內材質、住宅品牌主視覺、生活道具'],
      forbidden: ['把一般戶外旅拍當成主題', '奇幻材質世界觀', '平面設計後製流程']
    },
    'modern-portrait.html': {
      label: '現代寫真攝影',
      family: 'modernPortrait',
      productionMode: 'referencePortrait',
      primaryIntent: '以人物狀態、姿勢與生活光線為核心的現代人像寫真',
      owns: ['現代畫面語氣', '臥室', '沙發客廳', '日式室內', '走廊', '戶外綠意', '姿態攝影', '現代服裝'],
      allowed: ['居家生活、自然光、窗影、人物互動、現代時裝肖像與完整作品概念'],
      forbidden: ['把 Luxury Lifestyle 的住宅品牌敘事強制套到所有模板', '旅遊地點主導', '奇幻、仙俠或動漫世界觀']
    },
    'doll.html': {
      label: '公仔系列',
      family: 'dollTransformation',
      productionMode: 'objectTransformation',
      primaryIntent: '把人物參考照轉成可收藏的公仔或展示物',
      owns: ['公仔材質', '玩具形式', '包裝', '底座', '展示方式'],
      allowed: ['收藏玩具、模型展示、包裝設計與物件攝影'],
      forbidden: ['把公仔比例誤當成真人寫真比例']
    },
    'fantasy-fashion.html': {
      label: '幻想廣告',
      family: 'fantasyAdvertising',
      productionMode: 'referencePortrait',
      primaryIntent: '奇幻材質與世界觀驅動的品牌級人物廣告',
      owns: ['奇幻材質', '特殊服裝', '世界觀背景', '廣告構圖', '非現實光影'],
      allowed: ['幻想廣告、奇幻服裝、紙雕、水彩、花材、材質藝術與幻想背景'],
      forbidden: ['把奇幻詞彙帶入中式古典、和服或韓服正向資料']
    },
    'chinese-classical.html': {
      label: '中式古典美學',
      family: 'chineseClassical',
      productionMode: 'referencePortrait',
      primaryIntent: '漢風、盛唐、宋韻與唯美古風的中式服飾寫真',
      owns: ['漢服輪廓', '中式材質紋樣', '中式飾品', '古典姿態', '中國古典場景'],
      allowed: ['漢唐宋服飾、改良漢服、江南水墨、宮苑、書齋、傳統工藝'],
      forbidden: ['仙俠、法術、科技幻想、機甲與西式奇幻服裝']
    },
    'japanese-kimono.html': {
      label: '日本和服美學',
      family: 'japaneseKimono',
      productionMode: 'referencePortrait',
      primaryIntent: '日本和服結構、織物與和風場景的人物寫真',
      owns: ['和服輪廓', '帶結', '日本紋樣', '簪飾', '庭園與町家'],
      allowed: ['振袖、浴衣、婚禮和服、大正浪漫、日本庭園與町家'],
      forbidden: ['漢服、韓服、旗袍、仙俠、科幻機甲與動漫角色扮演正向混入']
    },
    'korean-hanbok.html': {
      label: '韓國韓服美學',
      family: 'koreanHanbok',
      productionMode: 'referencePortrait',
      primaryIntent: '韓服比例、色彩與韓式宮廷生活美學的人物寫真',
      owns: ['韓服輪廓', '襖裙', '韓式紋樣', '宮廷配件', '韓屋與宮廷場景'],
      allowed: ['朝鮮傳統韓服、宮廷婚服、韓屋、宮廷長廊與季節庭院'],
      forbidden: ['和服、漢服、旗袍、仙俠、科幻機甲與動漫角色扮演正向混入']
    },
    'xianxia.html': {
      label: '中式仙俠',
      family: 'xianxia',
      productionMode: 'referencePortrait',
      primaryIntent: '仙門、法器、靈獸與東方奇幻世界觀寫真',
      owns: ['仙俠服裝', '法器靈獸', '仙境背景', '戰鬥與飛行姿態', '幻想光影'],
      allowed: ['仙俠世界觀、仙境、法器、靈獸、御劍與幻想廣告語言'],
      forbidden: ['把仙俠詞彙回灌到中式古典的古典正向核心']
    },
    'anime-character.html': {
      label: '動漫人物美圖',
      family: 'animeCharacter',
      productionMode: 'illustrationTransformation',
      primaryIntent: '以動漫媒材重建人物身份與原創角色視覺',
      owns: ['賽璐璐上色', '動漫服裝', '插畫媒材', '角色背景'],
      allowed: ['動漫、漫畫、賽璐璐、原創角色與插畫背景'],
      forbidden: ['把插畫膚質規則誤套到真人攝影頁']
    },
    'flower-fairy.html': {
      label: '花仙子',
      family: 'flowerFairy',
      productionMode: 'referencePortrait',
      primaryIntent: '花卉主題服裝與精靈感寫真',
      owns: ['花卉禮服', '花材', '翅膀', '蝴蝶點綴', '花園背景'],
      allowed: ['花卉材質、花園、花瓣與精緻夢幻寫真'],
      forbidden: ['把花仙子翅膀與奇幻機甲或仙俠法器跨頁混用']
    },
    'isekai-fantasy.html': {
      label: '日式異世界',
      family: 'isekaiFantasy',
      productionMode: 'referencePortrait',
      primaryIntent: '日式輕小說與 JRPG 世界觀的真人寫實人物',
      owns: ['勇者與魔法使造型', '異世界陣營', 'JRPG 背景', '角色道具'],
      allowed: ['日式異世界、魔法使、勇者、精靈、獸娘與真人寫實轉換'],
      forbidden: ['把異世界角色標籤帶入文化服飾頁正向資料']
    },
    'store-ad.html': {
      label: '店家活動廣告',
      family: 'storeAdvertisement',
      productionMode: 'conditionalPersonHero',
      primaryIntent: '店家活動主視覺與後製文案配置',
      owns: ['活動資訊', '店家主視覺', '海報文案', '商品或服務焦點'],
      allowed: ['活動日期、地點、優惠、品牌色與店家內容'],
      forbidden: ['把人物身份核心當成所有店家素材的固定主體']
    },
    'floral-sweet.html': {
      label: '花漾甜美系',
      family: 'floralSweet',
      productionMode: 'referencePortrait',
      primaryIntent: '甜美穿搭、花束配飾與討喜生活寫真',
      owns: ['甜美服裝', '花束', '生活感背景', '柔和表情'],
      allowed: ['花漾穿搭、花束、甜美色彩與輕柔生活場景'],
      forbidden: ['把花漾甜美的粉彩規則強制帶入所有頁面']
    },
    'gala-socialite.html': {
      label: '氣質名媛宴會',
      family: 'galaSocialite',
      productionMode: 'referencePortrait',
      primaryIntent: '晚宴禮服、珠寶與社交場合的高級人物寫真',
      owns: ['晚宴禮服', '珠寶', '紅毯', '宴會廳', '名媛姿態'],
      allowed: ['晚宴、紅毯、珠寶廣告、宴會廳與高級社交氛圍'],
      forbidden: ['把晚宴場景當成所有現代生活頁的預設']
    },
    'bridal-editorial.html': {
      label: '婚紗藝術寫真',
      family: 'bridalEditorial',
      productionMode: 'referencePortrait',
      primaryIntent: '單人新娘的婚紗廣告與藝術寫真',
      owns: ['婚紗輪廓', '蕾絲珠繡', '頭紗', '新娘配件', '婚紗光影'],
      allowed: ['高訂婚紗、頭紗、珠繡、婚禮空間與單人新娘肖像'],
      forbidden: ['85mm 婚紗人像舊選項', '多人物婚禮主題', '仙俠或科技幻想']
    },
    'kpop-idol.html': {
      label: '韓系氣質偶像風',
      family: 'kpopIdol',
      productionMode: 'referencePortrait',
      primaryIntent: '舞台、機場與城市時尚的偶像人物寫真',
      owns: ['舞台服', '機場穿搭', '偶像姿態', '演出與城市背景'],
      allowed: ['韓系偶像、舞台、街頭、城市夜景與時尚活動'],
      forbidden: ['把偶像舞台特效當成一般現代人像預設']
    },
    'battle-academy.html': {
      label: '戰鬥制服學園',
      family: 'battleAcademy',
      productionMode: 'referencePortrait',
      primaryIntent: '學校身份、制服與戰鬥學園世界觀人物',
      owns: ['學校身份', '制服類型', '裝甲模組', '校園背景', '戰鬥姿態'],
      allowed: ['學園制服、改良戰鬥服、校園場景與真人漫畫感'],
      forbidden: ['把戰鬥裝甲模組帶入一般服裝改造頁']
    },
    'ancient-goddess.html': {
      label: '神話古文明女神',
      family: 'ancientGoddess',
      productionMode: 'referencePortrait',
      primaryIntent: '希臘羅馬與敦煌古文明女神的史詩寫真',
      owns: ['古文明服裝', '神殿', '敦煌壁畫語彙', '史詩光影', '女神姿態'],
      allowed: ['古文明、神殿、敦煌、神話服裝與莊嚴人物氣場'],
      forbidden: ['把神話女神的宗教或文明語彙泛化到其他文化服飾頁']
    },
    'editorial-identity.html': {
      label: '編輯視覺設計',
      family: 'editorialDesignStage2',
      productionMode: 'sourceImageLock',
      primaryIntent: '在已完成照片上進行封面、人物卡與平面視覺設計',
      owns: ['版型', '字體', '文案', '圖形', '印刷質感', '資訊欄'],
      allowed: ['雜誌封面、人物卡、電影海報、動漫封面、寫真書與旅遊設計'],
      forbidden: ['重畫人物、改臉、改變來源照片身份', '犯罪、恐怖與心理驚悚模板']
    }
  };

  window.HB_THEME_REGISTRY = Object.freeze(registry);
})();
