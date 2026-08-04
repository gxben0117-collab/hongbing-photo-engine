(function () {
  const base = `High-budget editorial campaign production,
deliberate visual hierarchy with one clear hero subject,
restrained set dressing and controlled negative space,
directional key light, controlled fill and subtle rim separation,
rich tonal depth with smooth highlight roll-off,
realistic textile weight, weave, seams and couture construction,
clean material edges and refined craftsmanship,
restrained two-to-three-color palette,
natural optical depth and premium medium-format detail.`;

  const negative = `No flat e-commerce catalog lighting,
no rental-costume appearance,
no plastic ornaments,
no printed-on embroidery,
no synthetic fabric shine,
no overcrowded decorative set,
no excessive saturation,
no generic photo-booth composition.`;

  const themes = {
    chineseClassical: `Authentic Chinese textile construction with believable silk, kesi and brocade weight,
dimensional embroidery and restrained jade or metal reflections;
use lacquer black, ink, jade or antique gold as controlled editorial accents,
never as a crowded costume display.`,
    japaneseKimono: `Authentic Japanese kimono construction with believable silk and Nishijin weave,
structured obi thickness, precise eri and sleeve geometry,
subtle irregular gold-leaf or lacquer reflection,
refined archive-fashion direction rather than tourist rental styling.`,
    kpopIdol: `High-end idol couture with real tailoring, seams, hardware and controlled surface reflection;
choose one hero visual effect only,
keep stage technology secondary to the subject,
use restrained black, silver, charcoal or champagne campaign styling.`,
    bridalEditorial: `High-end bridal couture with believable lace mesh, satin weight,
corsetry support and beadwork attachment;
use one hero bridal material and one supporting craft,
keep veil, jewelry and floral details controlled and editorial rather than showroom decoration.`
  };

  window.HB_EDITORIAL_FINISH = Object.freeze({
    base,
    negative,
    themes: Object.freeze(themes),
    forPage(pageKey) {
      return Object.freeze({
        base,
        theme: themes[pageKey] || '',
        negative
      });
    }
  });
})();
