// =============================================================================
// TOP GEAR — persistencia local compartida entre páginas (localStorage).
// Así una cotización iniciada en el catálogo llega viva a la calculadora, al
// checkout y termina como pedido visible en el portal del cliente, tal como
// pide el flujo central del producto.
// =============================================================================
(function () {
  const KEYS = {
    ORDERS: "tg_orders_v1",
    QUOTE: "tg_quote_v1",
    TRM_OVERRIDE: "tg_trm_override_v1",
    SEEN_INIT: "tg_seen_init_v1",
  };

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
  }

  function ensureSeeded() {
    if (!readJson(KEYS.SEEN_INIT, null)) {
      writeJson(KEYS.ORDERS, [window.SEED_ORDER]);
      writeJson(KEYS.SEEN_INIT, true);
    }
    if (!readJson(KEYS.ORDERS, null)) {
      writeJson(KEYS.ORDERS, [window.SEED_ORDER]);
    }
  }

  function getOrders() {
    ensureSeeded();
    return readJson(KEYS.ORDERS, [window.SEED_ORDER]);
  }

  function getOrderByNumero(numero) {
    return getOrders().find(function (o) { return o.numero === numero; }) || null;
  }

  function addOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    writeJson(KEYS.ORDERS, orders);
    return order;
  }

  function nextOrderNumero() {
    const orders = getOrders();
    let max = 842;
    orders.forEach(function (o) {
      const m = /TG-(\d{4})-(\d+)/.exec(o.numero);
      if (m) max = Math.max(max, parseInt(m[2], 10));
    });
    return "TG-2026-" + String(max + 1).padStart(5, "0");
  }

  function getQuote() { return readJson(KEYS.QUOTE, null); }
  function setQuote(quote) { writeJson(KEYS.QUOTE, quote); }
  function clearQuote() { try { localStorage.removeItem(KEYS.QUOTE); } catch (e) {} }

  function getTrmOverride() { return readJson(KEYS.TRM_OVERRIDE, null); }
  function setTrmOverride(v) { writeJson(KEYS.TRM_OVERRIDE, v); }

  function resetDemo() {
    try {
      localStorage.removeItem(KEYS.ORDERS);
      localStorage.removeItem(KEYS.QUOTE);
      localStorage.removeItem(KEYS.TRM_OVERRIDE);
      localStorage.removeItem(KEYS.SEEN_INIT);
    } catch (e) { /* noop */ }
    ensureSeeded();
  }

  window.TG_STORE = {
    getOrders, getOrderByNumero, addOrder, nextOrderNumero,
    getQuote, setQuote, clearQuote,
    getTrmOverride, setTrmOverride,
    resetDemo,
  };

  ensureSeeded();
})();
