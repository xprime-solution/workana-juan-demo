// Checkout — resumen de la cotización guardada, datos del comprador, pago
// simulado y generación de la propuesta comercial imprimible.
(function () {
  TG_PARTIALS.mount("");

  const quote = TG_STORE.getQuote();
  if (!quote) {
    document.getElementById("emptyQuote").classList.remove("hidden");
    TG_ICONS.mountIcons(document);
    return;
  }
  document.getElementById("checkoutFlow").classList.remove("hidden");

  const v = quote.vehiculoId ? VEHICLES.find(x => x.id === quote.vehiculoId) : null;
  const r = quote.result;
  const input = quote.input;

  // ---- paso 1: resumen ----
  document.getElementById("qImg").src = v ? v.imagen : "assets/images/misc/hero.jpg";
  document.getElementById("qTitle").textContent = v ? `${v.marca} ${v.modelo} ${v.version}` : "Cotización libre";
  document.getElementById("qSub").textContent = v ? `${v.anio} · ${v.origen} · ${v.motorizacion}` : `${input.origen} · ${input.motorizacion}`;
  document.getElementById("qSummary").innerHTML = `
    <div class="summaryline"><span>Valor FOB</span><b>USD ${input.fobUsd.toLocaleString('en-US')}</b></div>
    <div class="summaryline"><span>CIF</span><b>USD ${r.cifUsd.toFixed(0)}</b></div>
    <div class="summaryline"><span>Arancel</span><b>${TG_ENGINE.formatPct(r.arancelRate)} · ${TG_ENGINE.formatCop(r.arancelCop)}</b></div>
    <div class="summaryline"><span>IVA</span><b>${TG_ENGINE.formatPct(r.ivaRate)} · ${TG_ENGINE.formatCop(r.ivaCop)}</b></div>
    <div class="summaryline"><span>Impoconsumo</span><b>${r.impoconsumoTramo}</b></div>
    <div class="summaryline" style="border-top:1px solid var(--border-strong);padding-top:12px;"><span style="font-weight:800;">Valor total nacionalizado</span><b style="color:var(--accent-strong);font-size:15px;">${TG_ENGINE.formatCop(r.valorTotalCop)}</b></div>
  `;

  document.getElementById("asideTotal").textContent = TG_ENGINE.formatCop(r.valorTotalCop);
  document.getElementById("asideTotalUsd").textContent = "≈ " + TG_ENGINE.formatUsd(r.valorTotalUsd);
  document.getElementById("asideOrigen").textContent = input.origen;
  document.getElementById("asideMotor").textContent = input.motorizacion;
  document.getElementById("asideArancel").textContent = TG_ENGINE.formatPct(r.arancelRate);
  document.getElementById("asideIva").textContent = TG_ENGINE.formatPct(r.ivaRate);

  // ---- navegación entre pasos ----
  window.tgGoStep = function (n) {
    document.querySelectorAll(".steppanel").forEach(p => p.classList.toggle("active", p.dataset.panel === String(n)));
    document.querySelectorAll(".stepper .s").forEach(s => {
      const sn = parseInt(s.dataset.step, 10);
      s.classList.toggle("active", sn === n);
      s.classList.toggle("done", sn < n);
    });
    if (n === 4) buildProposal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- pago simulado ----
  document.querySelectorAll('[data-pay]').forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('[data-pay]').forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("payTarjeta").classList.toggle("hidden", btn.dataset.pay !== "tarjeta");
      document.getElementById("payPse").classList.toggle("hidden", btn.dataset.pay !== "pse");
    });
  });

  document.getElementById("btnPagar").addEventListener("click", function () {
    const btn = this;
    const status = document.getElementById("payStatus");
    btn.disabled = true;
    btn.innerHTML = '<span class="payspinner"></span> Procesando pago...';
    status.innerHTML = '<div class="pill pill-info">Procesando</div>';
    setTimeout(() => {
      status.innerHTML = '<div class="pill pill-ok"><span class="icon-slot" data-lucide="circle-check" data-size="13"></span>Pago aprobado</div><div class="text-muted mt-8" style="font-size:12px;">Anticipo confirmado. Transacción TG-PAY-' + Math.floor(100000 + Math.random()*899999) + '.</div>';
      btn.innerHTML = 'Pago aprobado <span class="icon-slot" data-lucide="circle-check" data-size="15"></span>';
      TG_ICONS.mountIcons(status); TG_ICONS.mountIcons(btn);
      TG_TOAST.show("Pago del anticipo aprobado.", "ok");
      setTimeout(() => tgGoStep(4), 700);
    }, 1400);
  });

  // ---- paso 4: propuesta comercial imprimible ----
  function buildProposal() {
    const today = new Date();
    const fecha = today.toLocaleDateString("es-CO");
    const nombre = document.getElementById("bNombre").value || "Comprador";
    const ciudad = document.getElementById("bCiudad").value || "";
    const doc = document.getElementById("proposalDoc");
    doc.innerHTML = `
      <div class="dochead">
        <div class="flex items-center gap-12"><span data-tg-logo data-size="34" style="filter:brightness(1.3);"></span><div class="tt">TOP GEAR</div></div>
        <div style="text-align:right;font-size:12px;opacity:.8;">Propuesta comercial<br>${fecha}</div>
      </div>
      <div class="docbody">
        <div class="docmeta">
          <span><b>Cliente:</b> ${nombre} — ${ciudad}</span>
          <span><b>Válida por:</b> 5 días hábiles</span>
        </div>
        <div class="docveh">
          <img src="${v ? v.imagen : 'assets/images/misc/hero.jpg'}" alt="">
          <div>
            <b style="font-size:14px;">${v ? v.marca + ' ' + v.modelo + ' ' + v.version : 'Vehículo a definir'}</b>
            <div style="font-size:12.5px;color:#555;margin-top:3px;">${v ? v.anio + ' · ' + v.origen + ' · ' + v.motorizacion + ' · ' + v.potencia + ' hp' : ''}</div>
          </div>
        </div>
        <table>
          <tr><td>Valor FOB</td><td>USD ${input.fobUsd.toLocaleString('en-US')}</td></tr>
          <tr><td>Flete marítimo prorrateado</td><td>USD ${r.fletePorVehiculoUsd.toFixed(0)}</td></tr>
          <tr><td>Seguro de transporte</td><td>USD ${r.seguroUsd.toFixed(0)}</td></tr>
          <tr><td>Valor CIF Buenaventura</td><td>${TG_ENGINE.formatCop(r.cifCop)}</td></tr>
          <tr><td>Arancel (${input.origen} — ${TG_ENGINE.formatPct(r.arancelRate)})</td><td>${TG_ENGINE.formatCop(r.arancelCop)}</td></tr>
          <tr><td>IVA (${input.motorizacion} — ${TG_ENGINE.formatPct(r.ivaRate)})</td><td>${TG_ENGINE.formatCop(r.ivaCop)}</td></tr>
          <tr><td>Impoconsumo (${r.impoconsumoTramo})</td><td>${TG_ENGINE.formatCop(r.impoconsumoCop)}</td></tr>
          <tr><td>Gastos de nacionalización (Buenaventura)</td><td>${TG_ENGINE.formatCop(r.gastosOperativosCop)}</td></tr>
          <tr class="totalrow"><td>Valor total nacionalizado</td><td>${TG_ENGINE.formatCop(r.valorTotalCop)}</td></tr>
        </table>
        <p style="font-size:11.5px;color:#777;margin-top:18px;">Cotización calculada con TRM ${input.trm.toLocaleString('es-CO')} COP/USD. El valor final se ajusta a la TRM vigente el día del pago de nacionalización. Documento generado automáticamente por el motor de liquidación de Top Gear, no reemplaza la liquidación oficial de la agencia aduanera.</p>
      </div>
    `;
    if (window.TG_LOGO) window.TG_LOGO.mount(doc);
  }

  // ---- confirmar pedido ----
  document.getElementById("btnConfirmarPedido").addEventListener("click", () => {
    const numero = TG_STORE.nextOrderNumero();
    const order = {
      numero,
      clienteId: null,
      clienteNombre: document.getElementById("bNombre").value,
      clienteCiudad: document.getElementById("bCiudad").value,
      vehiculoId: v ? v.id : null,
      etapaActualIndex: 0,
      fechaCompra: new Date().toLocaleDateString("es-CO"),
      fechaEstimadaEntrega: new Date(Date.now() + 78 * 86400000).toLocaleDateString("es-CO"),
      quote: quote,
      documentosPendientes: [
        { nombre: "Declaración de importación (Formulario 500) firmada", estado: "pendiente" },
        { nombre: "Copia de cédula ampliada al 150%", estado: "pendiente" },
        { nombre: "Certificado de matrícula provisional", estado: "pendiente" },
        { nombre: "Póliza de responsabilidad civil (SOAT)", estado: "pendiente" },
      ],
      asesor: { nombre: "Michael Lee", rol: "Asesor de importación asignado", avatar: "assets/images/avatars/admin_michael.png" },
    };
    TG_STORE.addOrder(order);
    TG_STORE.clearQuote();
    TG_TOAST.show("Pedido " + numero + " confirmado.", "ok");
    setTimeout(() => { window.location.href = "portal.html?numero=" + numero; }, 700);
  });

  TG_ICONS.mountIcons(document);
})();
