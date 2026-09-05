// Sistema mínimo de notificaciones toast, compartido por todas las páginas.
(function () {
  function ensureStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    return stack;
  }

  function show(message, kind) {
    kind = kind || "ok";
    const icon = kind === "ok" ? "circle-check" : kind === "warn" ? "triangle-alert" : "info";
    const stack = ensureStack();
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML =
      '<span class="icon-slot ' + kind + '" data-lucide="' + icon + '" data-size="18"></span>' +
      "<span>" + message + "</span>";
    stack.appendChild(el);
    if (window.TG_ICONS) window.TG_ICONS.mountIcons(el);
    setTimeout(function () {
      el.style.transition = "opacity .3s ease, transform .3s ease";
      el.style.opacity = "0";
      el.style.transform = "translateX(8px)";
      setTimeout(function () { el.remove(); }, 300);
    }, 3200);
  }

  window.TG_TOAST = { show };
})();
