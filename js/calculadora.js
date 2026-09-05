// Motor de liquidación — pantalla completa. Modo "del catálogo" (autocompleta
// desde un vehículo real y sigue siendo editable) o "cotización libre"
// (todos los campos a mano). Recalcula en vivo con cada cambio de input.
(function () {
  TG_PARTIALS.mount("calculadora.html");

  const params = new URLSearchParams(location.search);
  let mode = "catalogo";

  const $ = (id) => document.getElementById(id);

  // ---- selects ----
  Object.keys(ORIGENES).forEach(o => $("cOrigen").insertAdjacentHTML("beforeend", `<option value="${o}">${o}</option>`));
  Object.keys(MOTORIZACIONES).forEach(m => $("cMotor").insertAdjacentHTML("beforeend", `<option value="${m}">${m}</option>`));
  VEHICLES.forEach(v => $("cVehiculo").insertAdjacentHTML("beforeend",
    `<option value="${v.id}">${v.marca} ${v.modelo} ${v.version} — USD ${v.fobUsd.toLocaleString('en-US')}</option>`));

  $("hintTrmHoy").textContent = "$" + TRM_HOY.valor.toLocaleString("es-CO") + " (" + TRM_HOY.fecha + ")";
  $("cTrm").value = TRM_HOY.valor;
  $("cTrm").disabled = true;

  function setCategoria(cat) {
    $("cCategoria").querySelectorAll(".toggle-chip").forEach(b => b.classList.toggle("active", b.dataset.v === cat));
  }
  function getCategoria() {
    const active = $("cCategoria").querySelector(".toggle-chip.active");
    return active ? active.dataset.v : "liviano";
  }

  function loadVehicleIntoForm(v) {
    $("cOrigen").value = v.origen;
    $("cMotor").value = v.motorizacion;
    $("cFob").value = v.fobUsd;
    $("cFlete").value = ORIGENES[v.origen].fleteContenedorUsd;
    $("cCompartidos").value = v.capacidadContenedor;
    $("cCompartidos").max = 6;
    setCategoria(v.categoriaGastos);
    updateHints();
  }

  function updateHints() {
    const origen = $("cOrigen").value, motor = $("cMotor").value;
    const od = ORIGENES[origen], md = MOTORIZACIONES[motor];
    $("hintOrigen").innerHTML = od.tratado + " &rarr; arancel <b>" + TG_ENGINE.formatPct(od.arancel) + "</b>";
    $("hintMotor").innerHTML = "IVA aplicable &rarr; <b>" + TG_ENGINE.formatPct(md.iva) + "</b>";
  }

  function setMode(next) {
    mode = next;
    $("modeCatalogo").classList.toggle("active", mode === "catalogo");
    $("modeCatalogo").classList.toggle("btn-ghost", mode === "catalogo");
    $("modeCatalogo").classList.toggle("btn-outline", mode !== "catalogo");
    $("modeLibre").classList.toggle("active", mode === "libre");
    $("modeLibre").classList.toggle("btn-ghost", mode === "libre");
    $("modeLibre").classList.toggle("btn-outline", mode !== "libre");
    $("vehiculoField").style.display = mode === "catalogo" ? "" : "none";
    if (mode === "catalogo") loadVehicleIntoForm(VEHICLES.find(v => v.id === $("cVehiculo").value) || VEHICLES[0]);
    recalc();
  }
  $("modeCatalogo").addEventListener("click", () => setMode("catalogo"));
  $("modeLibre").addEventListener("click", () => setMode("libre"));
  $("cVehiculo").addEventListener("change", () => { if (mode === "catalogo") loadVehicleIntoForm(VEHICLES.find(v => v.id === $("cVehiculo").value)); recalc(); });

  $("cCategoria").querySelectorAll(".toggle-chip").forEach(btn => btn.addEventListener("click", () => { setCategoria(btn.dataset.v); recalc(); }));

  $("trmAuto").addEventListener("click", () => {
    $("trmAuto").classList.add("active"); $("trmManual").classList.remove("active");
    $("cTrm").disabled = true; $("cTrm").value = TRM_HOY.valor;
    recalc();
  });
  $("trmManual").addEventListener("click", () => {
    $("trmManual").classList.add("active"); $("trmAuto").classList.remove("active");
    $("cTrm").disabled = false; $("cTrm").focus();
  });

  ["cOrigen", "cMotor"].forEach(id => $(id).addEventListener("change", () => { updateHints(); recalc(); }));
  ["cFob", "cFlete", "cCompartidos", "cTrm"].forEach(id => $(id).addEventListener("input", recalc));

  function recalc() {
    const origen = $("cOrigen").value, motor = $("cMotor").value;
    const fobUsd = parseFloat($("cFob").value) || 0;
    const fleteContenedorUsd = parseFloat($("cFlete").value) || 0;
    const vehiculosCompartidos = Math.max(1, parseInt($("cCompartidos").value, 10) || 1);
    const trm = parseFloat($("cTrm").value) || TRM_HOY.valor;
    const categoriaGastos = getCategoria();

    const r = TG_ENGINE.calcularLiquidacion({ fobUsd, origen, motorizacion: motor, categoriaGastos, fleteContenedorUsd, vehiculosCompartidos, trm });

    $("rTotalCop").textContent = TG_ENGINE.formatCop(r.valorTotalCop);
    $("rTotalUsd").textContent = "≈ " + TG_ENGINE.formatUsd(r.valorTotalUsd) + " al TRM usado";
    $("rTratado").textContent = r.tratado;
    $("rArancelPill").textContent = "Arancel " + TG_ENGINE.formatPct(r.arancelRate);
    $("rIvaPill").textContent = "IVA " + TG_ENGINE.formatPct(r.ivaRate);
    $("rImpoPill").textContent = "Impoconsumo " + TG_ENGINE.formatPct(r.impoconsumoRate);

    const steps = [
      { n: 1, t: "Valor FOB", note: "Precio del vehículo puesto en el puerto de origen.", v: "USD " + fobUsd.toLocaleString("en-US") },
      { n: 2, t: "Flete marítimo prorrateado", note: "USD " + fleteContenedorUsd.toLocaleString("en-US") + " del contenedor, dividido entre " + vehiculosCompartidos + " vehículo(s).", v: "USD " + r.fletePorVehiculoUsd.toFixed(0) },
      { n: 3, t: "Seguro de transporte", note: "1.5% sobre FOB + flete.", v: "USD " + r.seguroUsd.toFixed(0) },
      { n: 4, t: "CIF (Costo + Seguro + Flete)", note: "Convertido a pesos con TRM " + trm.toLocaleString("es-CO") + ".", v: "USD " + r.cifUsd.toFixed(0) + " · " + TG_ENGINE.formatCop(r.cifCop) },
      { n: 5, t: "Arancel", note: r.tratado + " → " + TG_ENGINE.formatPct(r.arancelRate) + " sobre el CIF.", v: TG_ENGINE.formatCop(r.arancelCop) },
      { n: 6, t: "IVA", note: motor + " → " + TG_ENGINE.formatPct(r.ivaRate) + " sobre CIF + arancel.", v: TG_ENGINE.formatCop(r.ivaCop) },
      { n: 7, t: "Impoconsumo", note: r.impoconsumoTramo + " según el valor CIF en pesos.", v: TG_ENGINE.formatCop(r.impoconsumoCop) },
      { n: 8, t: "Gastos operativos Buenaventura", note: "Agenciamiento aduanero, puerto y trámites (" + categoriaGastos + ").", v: TG_ENGINE.formatCop(r.gastosOperativosCop) },
    ];
    $("breakdownCard").innerHTML = steps.map(s => `
      <div class="step">
        <div class="n">${s.n}</div>
        <div class="step__body">
          <div class="step__head"><span>${s.t}</span><b>${s.v}</b></div>
          <div class="step__note">${s.note}</div>
        </div>
      </div>`).join("") + `
      <div class="step total">
        <div class="n"><span class="icon-slot" data-lucide="flag" data-size="13"></span></div>
        <div class="step__body">
          <div class="step__head"><span>Valor total nacionalizado</span><b>${TG_ENGINE.formatCop(r.valorTotalCop)}</b></div>
          <div class="step__note">Equivalente a ${TG_ENGINE.formatUsd(r.valorTotalUsd)} al TRM usado en este cálculo.</div>
        </div>
      </div>`;

    window._tgLastCalc = { input: { fobUsd, origen, motorizacion: motor, categoriaGastos, fleteContenedorUsd, vehiculosCompartidos, trm }, result: r, vehiculoId: mode === "catalogo" ? $("cVehiculo").value : null };
    TG_ICONS.mountIcons(document);
  }

  $("btnGuardar").addEventListener("click", () => {
    const calc = window._tgLastCalc;
    TG_STORE.setQuote({ ...calc, guardadoEn: new Date().toISOString() });
    TG_PARTIALS.refreshCartBadge();
    TG_TOAST.show("Cotización guardada. Ya podés continuar al checkout.", "ok");
    setTimeout(() => { window.location.href = "checkout.html"; }, 650);
  });

  // ---- estado inicial ----
  const preselect = params.get("vehiculo");
  const initialVehicle = VEHICLES.find(v => v.id === preselect) || VEHICLES[0];
  $("cVehiculo").value = initialVehicle.id;
  loadVehicleIntoForm(initialVehicle);
  setMode("catalogo");
})();
