// Portal del cliente — busca un pedido por número, arma el tracker de ocho
// etapas y calcula el resumen de pago con el mismo motor de liquidación.
(function () {
  TG_PARTIALS.mount("portal.html");

  const params = new URLSearchParams(location.search);

  function quoteForOrder(order) {
    if (order.quote) return order.quote;
    const v = VEHICLES.find(x => x.id === order.vehiculoId);
    if (!v) return null;
    const input = {
      fobUsd: v.fobUsd, origen: v.origen, motorizacion: v.motorizacion, categoriaGastos: v.categoriaGastos,
      fleteContenedorUsd: ORIGENES[v.origen].fleteContenedorUsd, vehiculosCompartidos: v.capacidadContenedor, trm: TRM_HOY.valor,
    };
    return { input, result: TG_ENGINE.calcularLiquidacion(input), vehiculoId: v.id };
  }

  function renderOrdersList(orders, activeNumero) {
    const html = orders.map(o => {
      const v = VEHICLES.find(x => x.id === o.vehiculoId);
      return `<a href="portal.html?numero=${o.numero}" class="${o.numero === activeNumero ? 'active' : ''}"><span>${o.numero}</span><span>${v ? v.marca + ' ' + v.modelo : 'Vehículo'}</span></a>`;
    }).join("");
    document.getElementById("ordersList").innerHTML = html;
    document.getElementById("ordersListAlt").innerHTML = html;
  }

  function renderOrder(order) {
    const v = VEHICLES.find(x => x.id === order.vehiculoId);
    const quote = quoteForOrder(order);
    const r = quote ? quote.result : null;

    document.getElementById("oVehImg").src = v ? v.imagen : "assets/images/misc/hero.jpg";
    document.getElementById("oVehTitle").textContent = v ? `${v.marca} ${v.modelo} ${v.version}` : "Vehículo por definir";
    document.getElementById("oVehSub").textContent = v ? `${v.anio} · ${v.origen} · ${v.motorizacion}` : "";
    document.getElementById("oNumero").textContent = order.numero;

    // ---- tracker ----
    document.getElementById("tracker").innerHTML = ETAPAS_IMPORTACION.map((e, i) => {
      const cls = i < order.etapaActualIndex ? "done" : i === order.etapaActualIndex ? "current" : "";
      const iconName = i < order.etapaActualIndex ? "check" : e.icon;
      return `<div class="tstep ${cls}"><div class="circle"><span class="icon-slot" data-lucide="${iconName}" data-size="17"></span></div><b>${e.label}</b></div>`;
    }).join("");

    // ---- pagos ----
    const fraction = Math.min(0.92, 0.15 + order.etapaActualIndex * 0.12);
    if (r) {
      const total = r.valorTotalCop;
      const abonado = total * fraction;
      document.getElementById("oTotal").textContent = TG_ENGINE.formatCop(total);
      document.getElementById("oTotalUsd").textContent = "≈ " + TG_ENGINE.formatUsd(r.valorTotalUsd);
      document.getElementById("oAbonado").textContent = TG_ENGINE.formatCop(abonado);
      document.getElementById("oAbonadoPct").textContent = Math.round(fraction * 100) + "% del total";
      document.getElementById("oPendiente").textContent = TG_ENGINE.formatCop(total - abonado);
    }
    document.getElementById("oFecha").textContent = order.fechaEstimadaEntrega;
    document.getElementById("oFechaDesde").textContent = "Compra: " + order.fechaCompra;

    // ---- documentos ----
    const pillFor = (estado) => estado === "listo" ? "pill-ok" : estado === "en_tramite" ? "pill-info" : "pill-warn";
    const labelFor = (estado) => estado === "listo" ? "Listo" : estado === "en_tramite" ? "En trámite" : "Pendiente";
    document.getElementById("oDocs").innerHTML = order.documentosPendientes.map(d =>
      `<div class="docrow2"><span class="icon-slot" data-lucide="file-text" data-size="16"></span><span class="nm">${d.nombre}</span><span class="pill ${pillFor(d.estado)}">${labelFor(d.estado)}</span></div>`
    ).join("");

    // ---- asesor ----
    document.getElementById("oAsesorImg").src = order.asesor.avatar;
    document.getElementById("oAsesorNombre").textContent = order.asesor.nombre;
    document.getElementById("oAsesorRol").textContent = order.asesor.rol;

    TG_ICONS.mountIcons(document);
  }

  function findAndRender(numero) {
    const orders = TG_STORE.getOrders();
    renderOrdersList(orders, numero);
    const order = orders.find(o => o.numero === numero) || (numero ? null : orders[0]);
    if (!order) {
      document.getElementById("lookupNumero").value = numero;
      document.getElementById("notFoundLayout").classList.remove("hidden");
      document.getElementById("orderView").classList.add("hidden");
      TG_ICONS.mountIcons(document);
      return;
    }
    document.getElementById("notFoundLayout").classList.add("hidden");
    document.getElementById("orderView").classList.remove("hidden");
    document.getElementById("lookupNumero").value = order.numero;
    renderOrder(order);
  }

  document.getElementById("btnBuscar").addEventListener("click", () => findAndRender(document.getElementById("lookupNumero").value.trim()));
  document.getElementById("lookupNumero").addEventListener("keydown", (e) => { if (e.key === "Enter") findAndRender(e.target.value.trim()); });

  const initialNumero = params.get("numero") || TG_STORE.getOrders()[0].numero;
  findAndRender(initialNumero);
})();
