// Icon rendering helper. Reads real Lucide path data from window.LUCIDE_ICONS
// (see icons-data.js) and mounts it wherever a placeholder element declares
// data-lucide="<name>". Every generated <svg> carries explicit width/height
// attributes, never viewBox alone, so nothing renders at the browser's
// default intrinsic size.
(function () {
  function svgFor(name, size, strokeWidth) {
    var inner = window.LUCIDE_ICONS && window.LUCIDE_ICONS[name];
    if (!inner) {
      console.warn("[icons] missing lucide icon:", name);
      inner = "";
    }
    var w = size || 20;
    var sw = strokeWidth || 2;
    return (
      '<svg width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" ' +
      'stroke-linejoin="round" class="lucide-icon" aria-hidden="true">' + inner + "</svg>"
    );
  }

  function mountIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-lucide]");
    nodes.forEach(function (el) {
      var name = el.getAttribute("data-lucide");
      var size = el.getAttribute("data-size") || el.dataset.size;
      var sw = el.getAttribute("data-stroke");
      el.innerHTML = svgFor(name, size ? parseInt(size, 10) : undefined, sw ? parseFloat(sw) : undefined);
      el.classList.add("icon-slot");
      el.removeAttribute("data-lucide");
    });
  }

  window.TG_ICONS = { svgFor: svgFor, mountIcons: mountIcons };

  document.addEventListener("DOMContentLoaded", function () {
    mountIcons(document);
  });
})();
