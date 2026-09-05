// =============================================================================
// TOP GEAR — marca gráfica personalizada (no es un icono de librería).
// Un sello hexagonal de aduana/nacionalización atravesado por tres barras
// diagonales ascendentes: a la vez una franja de velocidad automotriz y una
// lectura de barras subiendo, la misma idea del motor de liquidación
// (aranceles e impuestos que suben por tramos) resuelta como una sola marca.
// Se monta por JS en cada [data-tg-logo] para poder darle un id de gradiente
// único por instancia sin duplicar ids de SVG en el documento.
// =============================================================================
(function () {
  let counter = 0;

  function markSvg(size) {
    counter += 1;
    const gid = "tgGoldGrad" + counter;
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0%" stop-color="#f6d98a"/>' +
      '<stop offset="45%" stop-color="#e5ab3d"/>' +
      '<stop offset="100%" stop-color="#a8721f"/>' +
      "</linearGradient></defs>" +
      '<path d="M55.38 45.5 L32 59 L8.62 45.5 L8.62 18.5 L32 5 L55.38 18.5 Z" ' +
      'stroke="url(#' + gid + ')" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M17 44 L25 44 L30 35 L22 35 Z" fill="url(#' + gid + ')" opacity="0.55"/>' +
      '<path d="M27 44 L35 44 L40 27 L32 27 Z" fill="url(#' + gid + ')" opacity="0.78"/>' +
      '<path d="M37 44 L45 44 L50 19 L42 19 Z" fill="url(#' + gid + ')"/>' +
      "</svg>"
    );
  }

  function mount(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-tg-logo]").forEach(function (el) {
      const size = el.getAttribute("data-size") || 40;
      el.innerHTML = markSvg(size);
    });
  }

  window.TG_LOGO = { mount: mount, markSvg: markSvg };
  document.addEventListener("DOMContentLoaded", function () { mount(document); });
})();
