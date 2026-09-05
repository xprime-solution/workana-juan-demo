// =============================================================================
// TOP GEAR — cabecera y pie compartidos.
// Genera el mismo marcado real (enlaces reales a archivos .html reales) en
// cada página para que las seis pantallas se sientan como un solo producto,
// sin repetir a mano el HTML seis veces y arriesgar que se desalineen.
// =============================================================================
(function () {
  const NAV_ITEMS = [
    { href: "index.html", label: "Inicio", icon: "house" },
    { href: "catalogo.html", label: "Catálogo", icon: "layout-grid" },
    { href: "calculadora.html", label: "Motor de liquidación", icon: "calculator" },
    { href: "portal.html", label: "Portal del cliente", icon: "route" },
  ];

  function topnavHtml(active) {
    const links = NAV_ITEMS.map(function (item) {
      const cls = item.href === active ? "active" : "";
      return (
        '<a href="' + item.href + '" class="' + cls + '">' +
        '<span class="icon-slot" data-lucide="' + item.icon + '" data-size="16"></span>' +
        "<span>" + item.label + "</span></a>"
      );
    }).join("");

    return (
      '<div class="shell topnav__row">' +
        '<a href="index.html" class="brand">' +
          '<span class="brand__mark" data-tg-logo data-size="40"></span>' +
          '<span class="brand__word"><b>TOP <em>GEAR</em></b><span>Motor de liquidación de importación</span></span>' +
        "</a>" +
        '<nav class="navlinks">' + links + "</nav>" +
        '<div class="navutil">' +
          '<div class="navutil__lang"><span class="icon-slot" data-lucide="globe" data-size="14"></span><span>ES</span></div>' +
          '<button class="navutil__badge" type="button" title="Cotización activa" aria-label="Cotización activa" id="navCartBadge">' +
            '<span class="icon-slot" data-lucide="file-text" data-size="17"></span>' +
          "</button>" +
          '<button class="navutil__badge" type="button" title="Notificaciones" aria-label="Notificaciones">' +
            '<span class="icon-slot" data-lucide="bell" data-size="17"></span>' +
            '<span class="dot">1</span>' +
          "</button>" +
          '<a href="portal.html" class="navutil__account">' +
            '<img src="assets/images/avatars/customer_camilo.jpg" alt="">' +
            '<span class="who"><b>Camilo Rojas</b><small>Comprador verificado</small></span>' +
          "</a>" +
          '<button class="navutil__badge navtoggle" type="button" id="navToggleBtn" title="Menú" aria-label="Abrir menú">' +
            '<span class="icon-slot" data-lucide="menu" data-size="18"></span>' +
          "</button>" +
        "</div>" +
      "</div>" +
      '<nav class="mobiledrawer" id="mobileDrawer">' + links + "</nav>"
    );
  }

  function footerHtml() {
    const items = [
      { icon: "calculator", title: "Motor de liquidación real", text: "Arancel, IVA e impoconsumo calculados con fórmulas reales, no una cifra fija." },
      { icon: "layout-grid", title: "Catálogo con filtros reales", text: "Marca, motorización, batería y 15 variables más, cruzadas en vivo." },
      { icon: "file-text", title: "Propuesta comercial en PDF", text: "Desglose de landing cost listo para imprimir o enviar por correo." },
      { icon: "route", title: "Portal de seguimiento", text: "Estado del pedido desde la compra hasta la matrícula, en ocho etapas." },
    ];
    const grid = items.map(function (it) {
      return (
        '<div class="capstrip__item">' +
          '<span class="icon-slot" data-lucide="' + it.icon + '" data-size="20"></span>' +
          '<div><b>' + it.title + "</b><p>" + it.text + "</p></div>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="capstrip"><div class="shell capstrip__grid">' + grid + "</div></div>" +
      '<div class="sitefoot"><div class="shell sitefoot__row">' +
        '<span>Top Gear S.A.S. &middot; Importación D2C de vehículos a Colombia &middot; Buenaventura, Valle del Cauca</span>' +
        '<div class="sitefoot__links">' +
          '<a href="#" id="resetDemoLink"><span class="icon-slot" data-lucide="rotate-ccw" data-size="13" style="margin-right:5px;vertical-align:-2px;"></span>Reiniciar demo</a>' +
          '<span>Fase 2 (scraping, sincronización, IA, GPS) se cotiza aparte</span>' +
        "</div>" +
      "</div></div>"
    );
  }

  function refreshCartBadge() {
    const btn = document.getElementById("navCartBadge");
    if (!btn) return;
    const existingDot = btn.querySelector(".dot");
    const quote = window.TG_STORE ? window.TG_STORE.getQuote() : null;
    if (quote && !existingDot) {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.textContent = "1";
      btn.appendChild(dot);
    } else if (!quote && existingDot) {
      existingDot.remove();
    }
  }

  function mount(active) {
    const navRoot = document.getElementById("topnav-root");
    const footRoot = document.getElementById("footer-root");
    if (navRoot) navRoot.innerHTML = topnavHtml(active);
    if (footRoot) footRoot.innerHTML = footerHtml();
    if (window.TG_LOGO) window.TG_LOGO.mount(document);
    if (window.TG_ICONS) window.TG_ICONS.mountIcons(document);
    refreshCartBadge();
    const toggleBtn = document.getElementById("navToggleBtn");
    const drawer = document.getElementById("mobileDrawer");
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", () => drawer.classList.toggle("open"));
      drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => drawer.classList.remove("open")));
    }
    const resetLink = document.getElementById("resetDemoLink");
    if (resetLink) {
      resetLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.TG_STORE) window.TG_STORE.resetDemo();
        window.location.href = "index.html";
      });
    }
  }

  window.TG_PARTIALS = { mount, refreshCartBadge };
})();
