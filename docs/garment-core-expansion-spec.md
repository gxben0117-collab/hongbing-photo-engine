# 服裝改造核心主題化擴充｜完整開發說明

> 文件狀態：已依本規格完成本地實作與回歸驗收；尚未代表已部署 GitHub Pages。
> 適用範圍：目前正式站內已具有「服裝改造核心」的 14 個人物出圖工具頁。

本次採漸進式相容實作：共用 Layer 與片段 helper 已集中到 `assets/garment-core.js`，各頁的主題資料
先保留在各自 HTML，避免一次搬移既有靜態頁資料而改變已驗證的 Prompt 組裝邊界；後續若要進一步
拆分 `assets/garment-themes/`，可在不改變本次資料契約的前提下進行。

## 1. 開發目標

目前各頁的 Layer 0／3／6／9／隨機 Layer 已大致同步，但選項資料仍有三種不同世代：

- `xianxia.html`：胸口 28、腰側 22、肩部 21，共 71 項，為早期完整試點。
- 古代女神、動漫人物、戰鬥學院、花漾甜美、花仙子、晚宴名媛、異世界、韓系偶像：
  胸口 14、腰側 12、肩部 11，共 37 項。
- 中式古典、和服、韓服、幻想廣告、雜誌棚拍：目前只有 14～17 項精簡剪裁。

本次目標不是讓每頁擁有完全相同的 71 項，而是建立：

1. 共用 Layer 行為。
2. 共用的基礎剪裁能力。
3. 每個主題自己的胸口、腰側、肩部改造語彙。
4. 主題相容的隨機池與一鍵模板。
5. 不破壞原服裝輪廓、文化辨識度、人物骨架與鎖臉核心。

## 2. 核心設計原則

### 2.1 三個控制層不得混淆

- 服裝主題／服裝輪廓：決定整件衣服是什麼。
- 材質與裝飾：決定絲綢、珠繡、金屬、花瓣等表面語言。
- 服裝改造核心：只改胸口、腰側、肩部的局部結構。

服裝改造核心不得自行把漢服改成西式晚禮服、把和服改成洋裝、把韓服改成舞台服，
也不得取代原頁面的服裝主題 Prompt。

### 2.2 選項數量不追求完全一致

- 商業時裝、幻想廣告、仙俠可以有較多結構變化。
- 漢服、和服、韓服應以文化輪廓完整性優先，數量可以較少。
- 戰鬥學院應以制服與裝甲功能為主，不追求裸露剪裁數量。
- 每頁建議控制在 30～55 個可見選項；仙俠現有 71 項先保留，但需重新分類與調整隨機權重。

### 2.3 手動選擇與隨機行為分離

- 使用者手動選擇的項目不得被隨機套用覆蓋。
- 某些大幅改造可保留為手動選項，但不必進入所有一鍵模板或隨機池。
- 傳統服飾頁的深 V、高衩等現有選項保留為使用者主動覆寫；嚴謹古典模板不得自動抽到。
- 選擇「無修改／原服裝一致」時不輸出任何英文片段。

## 3. 共用 Layer 契約

所有 14 頁維持相同定義：

| Layer | 隨機套用行為 |
| --- | --- |
| Layer 0 | 胸口、腰側、肩部皆維持原始服裝 |
| Layer 3 | 從未被手動指定的區域補足約 1 個部位 |
| Layer 6 | 從未被手動指定的區域補足約 2 個部位 |
| Layer 9 | 三個部位皆有改造；手動選擇優先 |
| 隨機 Layer | 每次先抽 0／3／6／9，再依同一規則執行 |

Layer 本身不輸出 Prompt。最終 Prompt 只組入三區實際選中的非空片段。

## 4. 建議資料架構

不要把 14 個主題全部塞回同一個巨大 HTML 或單一資料檔。

- `assets/garment-core.js`：只放 Layer 演算法、手動鎖定、去重、相容性篩選等共用邏輯。
- `assets/garment-themes/xianxia.js` 等：每個主題一個資料檔，保存該頁選項與英文 Prompt。
- 各 HTML：只保留頁面結構、主題載入與既有 generate 組裝位置。

每個選項建議使用同一資料格式：

```js
{
  key: 'cloudShoulderOverlay',
  label: '雲肩疊搭',
  description: '傳統雲肩覆於肩線，保留交領與寬袖輪廓',
  prompt: 'a layered embroidered cloud-shoulder overlay preserving the robe collar and wide-sleeve silhouette',
  tags: ['classical', 'ornamental'],
  randomWeight: 2,
  presetSafe: true
}
```

`randomWeight: 0` 表示保留手動使用，但一鍵隨機不主動選取。不得用顯示文字當資料 key。

## 5. 各主題擴充內容

以下為優先新增的主題專屬選項。既有共用項目不必重複建立；名稱相同但 Prompt 不同時，
應保留主題版本並讓主題版本優先。

### 5.1 中式仙俠 `xianxia.html`

仙俠已有最多選項，本次重點是補回仙衣辨識度並調整隨機權重，不再大量堆通用西式裝飾。

- 胸口：雲紋交領疊襟 `layered cloud-pattern cross-collar panels`；玉扣護心襟
  `a jade-clasped protective center panel`；流紗垂襟 `flowing silk drapery descending from the collar`；
  仙門刺繡胸襟 `an embroidered sect-style chest panel integrated into the robe`。
- 腰側：雲紋寬腰封 `a broad cloud-pattern embroidered sash`；玉佩垂帶腰封
  `a layered sash with jade pendants and hanging silk cords`；飛帶結腰 `a knotted waist sash with trailing ribbon ends`；
  輕甲束腰 `a fitted light-armor waist guard over flowing robe layers`。
- 肩部：雲肩疊搭 `a layered embroidered cloud-shoulder overlay`；披帛繞肩
  `a long silk pibo draped naturally around the shoulders and arms`；仙門披肩 `a ceremonial sect mantle over the shoulders`；
  輕甲護肩 `light sculpted shoulder guards integrated into the robe`。
- 隨機限制：蕾絲、透明網紗、水鑽、鏈條肩帶等現代詞降低權重；仍保留手動使用。

### 5.2 中式古典美學 `chinese-classical.html`

- 胸口：交領雙層襟 `double-layered cross-collar front panels`；立領盤扣襟
  `a refined standing collar with handmade Chinese knot buttons`；刺繡護領 `an embroidered collar guard following the original neckline`；
  雲肩胸襟 `a decorative cloud-collar panel framing the upper bodice`。
- 腰側：織帶寬腰封 `a broad woven silk waist sash`；玉佩禁步垂飾
  `a restrained jade pendant set suspended from the waist sash`；馬面裙側褶 `structured side pleats inspired by a mamian skirt`；
  疊襟纏腰 `layered wrap-front panels secured at the waist`。
- 肩部：雲肩覆層 `an embroidered cloud-shoulder overlay`；披帛柔搭
  `a soft silk shawl draped across the shoulders`；寬袖肩線 `a clean dropped shoulder line supporting wide flowing sleeves`；
  新中式披肩 `a tailored modern Chinese shoulder cape`。
- 隨機限制：古典漢、唐、宋模板不抽深 V 至腰、高衩或掛脖；新式改良與新式古風可低權重抽取。
- 正向資料不得出現仙俠、法術、機械、賽博或未來科技語彙。

### 5.3 日本和服美學 `japanese-kimono.html`

- 胸口：重疊襟領 `precisely layered kimono eri collars`；刺繡半襟
  `an embroidered haneri insert following the kimono collar`；伊達襟層次 `a contrasting date-eri collar layer`；
  現代不對稱和領 `a modern asymmetric kimono collar while preserving the wrap-front construction`。
- 腰側：丸帶寬腰結 `a formal broad maru-obi arrangement`；帶締珠結
  `a decorative obijime cord knot centered over the obi`；帶揚柔層 `a softly folded obiage accent above the obi`；
  側向太鼓結 `a refined side-visible taiko-style obi structure`。
- 肩部：振袖垂墜肩線 `long furisode sleeves flowing from a natural shoulder line`；羽織疊搭
  `a tailored haori layer over the kimono shoulders`；薄紗袖覆層 `a translucent sleeve overlay following kimono sleeve geometry`；
  現代短披肩 `a minimal modern capelet preserving the kimono collar and sleeves`。
- 隨機限制：傳統留袖、振袖、白無垢、浴衣模板不抽深 V、高衩、掛脖、露肩；現代改良類才可使用現代剪裁。
- 不得生成韓服、中式交領、仙俠披帛或一般西式晚禮服輪廓。

### 5.4 韓國韓服美學 `korean-hanbok.html`

- 胸口：東正領緣 `a crisp contrasting dongjeong collar edge`；衣帶結胸襟
  `a refined goreum ribbon knot integrated into the jeogori front`；刺繡短襦胸片
  `an embroidered chest panel following the jeogori construction`；現代方領短襦
  `a modern square-neck jeogori interpretation preserving hanbok proportions`。
- 腰側：高腰裙結 `a high-waisted chima fastening with a clean ribbon structure`；垂墜佩飾
  `a restrained norigae ornament suspended from the front tie`；雙層裙腰
  `a layered chima waistband with soft volume`；現代收腰帶 `a modern fitted waist band preserving the full chima silhouette`。
- 肩部：圓弧袖肩 `soft curved shoulders flowing into traditional rounded sleeves`；褙子疊搭
  `a sleeveless baeja vest layer over the jeogori`；圓衫薄覆層 `a translucent ceremonial outer robe layer`；
  現代短披肩 `a minimal modern capelet retaining hanbok collar geometry`。
- 隨機限制：傳統宮廷、婚禮與生活韓服不抽深 V、高衩、掛脖或西式露肩；現代改良韓服才可低權重使用。
- 不得生成和服腰帶、中式漢服交領、仙俠或 K-pop 舞台服輪廓。

### 5.5 幻想廣告 `fantasy-fashion.html`

- 胸口：液態金屬框架胸衣 `a sculptural liquid-metal bodice frame`；晶體切面領口
  `a faceted crystal neckline integrated into the garment`；透明樹脂拼接 `transparent resin insets with clean couture edges`；
  材質懸浮胸襟 `a suspended material-panel bodice supported by visible couture structure`。
- 腰側：鏡面金屬腰甲 `a mirrored metallic waist structure`；流體雕塑腰線
  `a flowing sculptural waist form made from the selected material`；晶體環腰 `a faceted crystal belt integrated into the silhouette`；
  不對稱材質垂片 `asymmetric material drapery descending from the waist`。
- 肩部：建築式肩線 `an architectural couture shoulder structure`；晶體肩甲
  `faceted crystal shoulder guards integrated into the outfit`；材質花瓣肩片 `layered material petals forming the shoulder line`；
  懸浮環形肩飾 `a floating ring-like shoulder ornament positioned behind and clear of the arms`。
- 保護規則：硬質、液體、翅膀或懸浮材質不得取代手臂、胸腔、頸部或頭髮。

### 5.6 雜誌棚拍 `magazine.html`

- 胸口：垂墜領 `a refined cowl neckline`；肖像領 `a wide portrait collar framing the shoulders`；
  結構馬甲胸衣 `a structured editorial corset bodice`；雕塑不對稱領口 `a sculptural asymmetric editorial neckline`；
  西裝翻領胸衣 `a sharply tailored lapel-front bodice`。
- 腰側：高訂抓褶腰線 `couture draping gathered at the waist`；雕塑腰封
  `a sculptural corset-inspired waist belt`；立體荷葉腰片 `an architectural peplum waist panel`；
  金屬腰帶 `a polished statement metal belt`；不對稱垂墜裙片 `an asymmetric draped skirt panel from the waist`。
- 肩部：高訂披肩 `a couture shoulder cape`；雕塑誇張肩線 `a sculptural statement shoulder line`；
  羽毛肩飾 `a refined feather shoulder accent`；立體泡袖 `structured voluminous sleeves at the shoulders`；
  珠寶肩帶 `jewel-set shoulder straps integrated into the garment`。
- 一鍵模板應依美妝、珠寶、封面、婚嫁與時裝大片方向使用不同權重，不要每個模板都抽深 V。

### 5.7 神話古文明女神 `ancient-goddess.html`

- 胸口：金屬護胸片 `an engraved ceremonial pectoral plate`；褶襉垂墜胸衣
  `a pleated draped bodice inspired by classical sculpture`；月桂鏈飾領 `a laurel-linked ornamental neckline`；
  貝殼雕塑胸衣 `a shell-inspired sculptural bodice`。
- 腰側：古典繩結腰帶 `a braided ceremonial cord belt`；金葉寬腰封 `a broad engraved gold-leaf waist band`；
  垂布側褶 `classical side drapery gathered at the waist`；寶石祭典腰鍊 `a restrained gemstone ceremonial waist chain`。
- 肩部：單肩扣袍 `a one-shoulder robe secured by an engraved clasp`；月桂披肩
  `a laurel-trimmed ceremonial shoulder mantle`；古典披帛肩帶 `classical drapery pinned naturally at the shoulders`；
  女戰神護肩 `sculpted ceremonial shoulder armor integrated into the gown`。
- 隨機池應依希臘羅馬、敦煌／絲路、戰神、海洋女神等服裝主題加權，避免文明語彙混搭。

### 5.8 動漫人物 `anime-character.html`

- 胸口：水手領疊片 `a layered sailor-collar panel`；大型蝴蝶結胸飾
  `a structured statement ribbon bow at the chest`；動畫色塊胸片 `clean graphic color-block bodice panels`；
  英雄制服拉鍊襟 `a fitted hero-uniform zipper front`。
- 腰側：百褶裙腰片 `a structured pleated-skirt waistband`；角色腰包系統
  `compact character utility pouches secured at the waist`；魔法少女蝴蝶結腰封
  `a layered magical-girl bow sash`；飛行員束帶腰封 `a functional pilot harness around the waist`。
- 肩部：泡袖蝴蝶結肩 `puffed sleeves with ribbon shoulder accents`；分離角色袖
  `detached character sleeves aligned with the arms`；英雄輕甲肩片 `light hero armor at the shoulders`；
  短披風肩扣 `a short cape secured behind the shoulders`。
- 校服、魔法少女、戰鬥角色、機甲駕駛與傳統角色應使用各自子池；不得讓機甲肩甲進入普通校園模板。

### 5.9 戰鬥制服學園 `battle-academy.html`

- 胸口：高領制服護片 `a high-collar reinforced uniform chest panel`；領帶／領結模組
  `a clean academy tie or ribbon module`；徽章胸甲 `a light armored chest panel with a school insignia`；
  戰術拉鍊襟 `a functional tactical zipper front`。
- 腰側：制服寬腰帶 `a structured academy utility belt`；側掛裝備扣
  `compact equipment clasps positioned at the waist`；裝甲裙片 `layered armored skirt panels preserving leg movement`；
  雙層制服腰封 `a reinforced double-layer uniform waistband`。
- 肩部：校徽肩章 `structured academy epaulettes with insignia`；輕型護肩
  `light protective shoulder guards`；指揮官披肩 `a short commander mantle secured behind the shoulders`；
  機能分離袖 `functional detached sleeves aligned with the arms`。
- 主題限制：隨機與一鍵模板不選深 V 至腰、高衩、透明網紗、裸露鏤空或內衣式結構。
  服裝改造必須維持成年戰鬥制服、校徽、裝甲與可活動性，不塑造成性感校服。

### 5.10 花漾甜美 `floral-sweet.html`

- 胸口：荷葉邊心形領 `a sweetheart neckline framed by soft ruffles`；蝴蝶結胸襟
  `a ribbon-bow front panel`；蕾絲娃娃領 `a delicate lace Peter Pan collar`；
  花卉抓褶胸衣 `a softly ruched floral bodice`。
- 腰側：蝴蝶結腰封 `a soft statement bow sash at the waist`；花邊束腰
  `a lace-trimmed fitted waistband`；輕蓬裙腰片 `a softly gathered overskirt panel`；
  花卉荷葉裙片 `layered floral ruffles descending from the waist`。
- 肩部：蝴蝶結肩帶 `ribbon-tied shoulder straps`；花苞泡袖 `soft flower-bud puff sleeves`；
  荷葉肩片 `layered ruffle shoulder panels`；珍珠肩帶 `delicate pearl-accented shoulder straps`。
- 隨機結果應維持清新、浪漫與精緻，避免過多金屬裝甲、尖銳肩線或重型鏈條。

### 5.11 花仙子 `flower-fairy.html`

- 胸口：花瓣疊領 `overlapping petal-shaped neckline panels`；藤蔓交織胸衣
  `a vine-woven fitted bodice`；花蕊中央胸飾 `a flower-center ornament integrated into the bodice`；
  透明花瓣拼接 `translucent petal-shaped bodice insets`。
- 腰側：藤蔓纏腰 `organic vines wrapping naturally around the waist`；花瓣層疊腰片
  `layered petal overskirt panels`；花簇側腰 `a sculpted flower cluster at one side of the waist`；
  葉形鏤空 `leaf-shaped couture cutouts with finished edges`。
- 肩部：花瓣肩翼 `petal-shaped shoulder fins attached to the garment`；藤蔓肩帶
  `vine-formed shoulder straps`；花冠披肩 `a floral garland shoulder cape`；
  薄霧花袖 `translucent mist-like floral sleeves`。
- 所有植物結構必須是服裝的一部分，不得從皮膚、手臂或骨骼異常生長。

### 5.12 氣質名媛宴會 `gala-socialite.html`

- 胸口：垂墜緞面領 `a softly draped satin cowl neckline`；珠寶肖像領
  `a jeweled portrait collar`；立體馬甲胸衣 `a sculpted evening corset bodice`；
  絲絨翻領 `a refined velvet lapel neckline`。
- 腰側：抓褶緞面腰線 `satin drapery gathered elegantly at the waist`；珠寶腰封
  `a gemstone statement waist belt`；立體裙腰 `a sculptural peplum waist structure`；
  垂墜側裙片 `a long draped side panel from the waist`。
- 肩部：歌劇披肩 `an elegant opera-style shoulder cape`；羽毛披肩線
  `a restrained feather-trimmed shoulder line`；珠寶肩扣 `gemstone clasps securing the shoulder drape`；
  雕塑單肩 `a sculptural one-shoulder evening construction`。
- 隨機池偏向高級宴會與正式禮服，避免可愛校園、戰術裝備或大型幻想機械結構。

### 5.13 日式異世界 `isekai-fantasy.html`

- 胸口：冒險者皮革束帶 `functional leather cross-straps over the bodice`；符文護胸
  `a rune-trimmed protective chest panel`；聖職披領 `a layered ceremonial priestess collar`；
  王族寶石胸襟 `a jeweled royal front panel integrated into the gown`。
- 腰側：冒險者裝備腰帶 `a functional adventurer utility belt`；藥水袋掛扣
  `small potion pouches secured at the side waist`；分層戰裙腰甲 `layered battle-skirt armor at the waist`；
  法袍符文腰封 `an embroidered rune sash around the robe waist`。
- 肩部：單側輕甲肩片 `a single light pauldron for an adventurer outfit`；短披風肩扣
  `a short cape secured behind the shoulders`；聖女披肩 `a ceremonial saintess shoulder mantle`；
  精靈葉紋護肩 `leaf-engraved elven shoulder guards`。
- 各職業子池分開；騎士不抽花仙子肩翼，精靈不抽機甲，日常獸人服不抽王冠禮服結構。

### 5.14 韓系氣質偶像 `kpop-idol.html`

- 胸口：舞台拉鍊胸衣 `a fitted stage bodice with a polished zipper front`；水鑽束帶胸衣
  `a rhinestone strap structure integrated into the stage top`；不對稱短版上衣
  `an asymmetric cropped performance top`；亮片掛脖胸衣 `a sequined halter stage bodice`。
- 腰側：水鑽腰鍊 `a refined rhinestone waist chain`；舞台束腰 `a fitted stage corset belt`；
  百褶裙腰片 `a crisp pleated performance-skirt waistband`；流蘇動態腰飾 `fringe accents attached at the waist for stage movement`。
- 肩部：單袖舞台剪裁 `a one-sleeve performance construction`；短版小外套肩線
  `a cropped bolero jacket shaping the shoulders`；水鑽肩帶 `rhinestone shoulder straps`；
  流蘇肩章 `fringed performance epaulettes`。
- 舞台、概念照、機場時尚與街頭服應分池；機場與日常模板不主動抽舞台水鑽或大面積鏤空。

## 6. UI 呈現規格

每個部位在選項超過 12 個後，按主題使用 2～4 個小分類標籤，例如：

- 胸口：領型／結構、鏤空／綁帶、材質／裝飾、主題專屬。
- 腰側：裙型／開衩、束腰／腰封、垂飾／拼接、主題專屬。
- 肩部：肩線／袖型、披肩／護肩、材質／裝飾、主題專屬。

分類標籤不是額外可選值，不得輸出 Prompt。手機版應維持單欄或雙欄可讀性，不能為了容納選項縮小文字。

## 7. Prompt 組裝規格

1. 身份鎖定與真人骨架核心維持既有順序，不得修改。
2. 先輸出服裝主題／輪廓，再輸出材質，最後輸出服裝改造核心。
3. 改造區塊固定使用一個短導句，三區片段以逗號組合。
4. 完全相同的片段只保留第一次；不得做單字級去重。
5. 每區只輸出一個選項；自填值存在時依現有規則覆寫該區 radio。
6. 三區皆無修改時，整個服裝改造區塊完全省略。
7. 主題保護語只保留必要的一句，不重複描述整套衣服，避免稀釋鎖臉核心。

## 8. 一鍵模板與隨機套用

- 現有 preset 必須全部通過引用驗證。
- 每頁至少挑 3 組代表性 preset 改用新增的主題專屬選項。
- 傳統／制服／日常 preset 使用 `presetSafe: true` 的保守主題池。
- 高訂、舞台、幻想與現代改良 preset 才能使用較強剪裁。
- 隨機抽選依目前選中的服裝主題或服裝分類決定子池，不得跨主題任意混抽。
- 隨機 Layer 遇到相容選項不足時，寧可少改一區，不得硬塞不相容選項。

## 9. 不納入範圍

- `travel.html`：目前服裝由旅拍情境與服裝方向控制，本次不新增服裝改造核心。
- `editorial-identity.html`：Stage 2 以原圖服裝、姿勢與背景鎖定為主，本次不加入。
- `doll.html`：輸出目標是公仔產品，不使用真人服裝改造核心。
- `store-ad.html`：輸出店家海報企劃，不加入人物服裝三區控制。
- 不修改 `assets/core-prompt.js` 的身份、臉部幾何與真人骨架核心。

## 10. 實作順序

1. 建立共用資料契約與 Layer helper，但不改變既有 Prompt 結果。
2. 先完成 `magazine.html`、`fantasy-fashion.html`、`chinese-classical.html` 三種代表頁。
3. 驗證商業時裝、幻想材質、文化服飾三種相容性策略。
4. 再處理和服、韓服與其餘 8 個 37 項頁面。
5. 最後整理仙俠 71 項分類與權重，不先刪除既有 key，避免 preset 失效。
6. 同步文件、版本與開發日誌後才部署 GitHub Pages。

## 11. 驗收標準

### 功能驗收

- 14 頁皆有 Layer 0／3／6／9／隨機 Layer。
- 每頁胸口、腰側、肩部至少各有 1 組明確的主題專屬改造。
- 手動選項不被隨機覆蓋。
- `none` 不產生任何 Prompt。
- 自填、preset、隨機、生成與複製功能皆正常。
- 服裝主題切換後，相容池立即正確更新，不留下已失效的隱藏選項。

### 主題驗收

- 漢服、和服、韓服仍一眼可辨識其文化服裝輪廓。
- 戰鬥學院維持制服與裝甲功能，不被隨機性感化。
- 花仙子植物結構不取代人體。
- 幻想廣告硬質或懸浮材質不取代手臂、頸部與胸腔。
- 雜誌、名媛、韓系偶像的改造語彙能明確區分棚拍高訂、宴會禮服與舞台服。
- 任何頁面都不應隨機輸出其他主題專屬詞彙。

### 自動檢查

完成後必須執行：

```powershell
node scripts\check-static.mjs
node scripts\check-ui-flows.mjs
node scripts\validate-preset-refs.mjs
node scripts\audit-100x.mjs
node scripts\build-prompt-preview.mjs
git diff --check
```

`audit-100x.mjs` 應新增每頁服裝改造主題契約，至少模擬 100 次 × 14 頁，檢查：

- key、label、prompt 不為空或 `undefined`。
- 三區最多各輸出一項。
- Layer 命中數正確。
- 手動選擇保持不變。
- 沒有跨文化、跨職業或跨主題語彙污染。
- Prompt 長度沒有因重複主題描述異常膨脹。

## 12. 完成定義

只有在 14 頁 UI、資料、隨機、一鍵模板、Prompt、驗證腳本與文件全部同步，且 GitHub Pages
線上逐頁抽查無 JavaScript 錯誤後，才可標記「服裝改造核心主題化擴充」完成。
