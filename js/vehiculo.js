// Ficha de vehículo — lee ?id= de la URL, arma la galería, la ficha técnica,
// la pestaña de costos (motor real) y la lista de documentos.
(function () {
  TG_PARTIALS.mount("");

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || VEHICLES[0].id;
  const v = VEHICLES.find(x => x.id === id) || VEHICLES[0];

  document.title = v.marca + " " + v.modelo + " — Top Gear";
  document.getElementById("crumbName").textContent = v.marca + " " + v.modelo;
  document.getElementById("titleName").textContent = v.marca + " " + v.modelo + " " + v.version;
  document.getElementById("titleSub").textContent = v.anio + " · " + v.origen + " · " + v.color;
  document.getElementById("titleBadges").innerHTML =
    `<span class="pill ${v.estado === 'Nuevo' ? 'pill-ok' : 'pill-neutral'}">${v.estado}</span>` +
    `<span class="pill pill-info">${v.disponibilidad}</span>`;

  // ---- galería: mismas fotos reales, distintos encuadres del mismo archivo ----
  const main = document.getElementById("galleryMain");
  main.style.backgroundImage = `url('${v.imagen}')`;
  const crops = [
    { label: "Vista general", pos: "center 45%" },
    { label: "Frontal", pos: "left 20%" },
    { label: "Lateral", pos: "center 60%" },
    { label: "Detalle", pos: "right 55%" },
  ];
  document.getElementById("galleryThumbs").innerHTML = crops.map((c, i) =>
    `<button style="background-image:url('${v.imagen}');background-position:${c.pos};" class="${i === 0 ? 'active' : ''}" data-pos="${c.pos}" title="${c.label}"></button>`
  ).join("");
  document.querySelectorAll(".gallery__thumbs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gallery__thumbs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      main.style.backgroundPosition = btn.dataset.pos;
    });
  });

  // ---- specs rápidas ----
  const quickSpecs = [
    { icon: "gauge", label: "Potencia", value: v.potencia + " hp" },
    { icon: "cog", label: "Transmisión", value: v.transmision },
    { icon: "compass", label: "Tracción", value: v.traccion },
    { icon: "fuel", label: "Motorización", value: v.motorizacion },
  ];
  document.getElementById("specRow").innerHTML = quickSpecs.map(s =>
    `<div class="mini"><span class="icon-slot" data-lucide="${s.icon}" data-size="18"></span><b>${s.value}</b><span>${s.label}</span></div>`
  ).join("");

  // ---- resumen ----
  document.getElementById("resumenTexto").textContent = v.resumen;
  const chips = [v.carroceria, v.motorizacion, v.origen, v.puertas + " puertas", v.asientos + " asientos", "ADAS " + v.adas];
  if (v.bateria) chips.push(v.bateria + " kWh");
  if (v.autonomia) chips.push(v.autonomia + " km autonomía");
  document.getElementById("resumenChips").innerHTML = chips.map(c => `<span class="pill pill-neutral">${c}</span>`).join("");

  // ---- ficha técnica ----
  const ficha = [
    ["Marca", v.marca], ["Modelo", v.modelo], ["Versión", v.version], ["Año", v.anio],
    ["Carrocería", v.carroceria], ["Motorización", v.motorizacion], ["Potencia", v.potencia + " hp"],
    ["Torque", v.torque + " Nm"], ["Transmisión", v.transmision], ["Tracción", v.traccion],
    ["Puertas", v.puertas], ["Asientos", v.asientos],
    ["Batería", v.bateria ? v.bateria + " kWh" : "No aplica"],
    ["Autonomía eléctrica", v.autonomia ? v.autonomia + " km" : "No aplica"],
    ["ADAS", v.adas], ["Color", v.color], ["Kilometraje", v.km.toLocaleString("es-CO") + " km"],
    ["Estado", v.estado], ["Disponibilidad", v.disponibilidad], ["Origen", v.origen],
    ["Valor FOB", "USD " + v.fobUsd.toLocaleString("en-US")],
  ];
  document.getElementById("fichaBody").innerHTML = ficha.map(([k, val]) => `<tr><td>${k}</td><td>${val}</td></tr>`).join("");

  // ---- documentos requeridos ----
  const docs = [
    { icon: "file-text", n: "Factura comercial (Commercial Invoice)", d: "Emitida por el vendedor en el país de origen, con el valor FOB.", estado: "Disponible" },
    { icon: "ship", n: "Bill of Lading / conocimiento de embarque", d: "Se genera al confirmar el zarpe del contenedor.", estado: "Se genera al zarpe" },
    { icon: "badge-check", n: "Certificado de origen", d: "Necesario para aplicar el tratado y su arancel preferencial.", estado: "Disponible" },
    { icon: "clipboard-check", n: "Ficha de homologación RUNT", d: "Habilita la matrícula del vehículo en Colombia.", estado: "Pendiente del taller" },
    { icon: "file-clock", n: "Declaración de importación (Formulario 500)", d: "La presenta la agencia de aduanas en Buenaventura.", estado: "Se genera en aduana" },
    { icon: "shield-check", n: "Póliza de seguro de transporte", d: "Cubre el vehículo durante el tránsito marítimo hasta Buenaventura.", estado: "Disponible" },
  ];
  const pillFor = (estado) => estado === "Disponible" ? "pill-ok" : estado.startsWith("Pendiente") ? "pill-warn" : "pill-info";
  document.getElementById("docList").innerHTML = docs.map(d =>
    `<div class="docrow"><span class="icon-slot" data-lucide="${d.icon}" data-size="18"></span><div><b>${d.n}</b><p>${d.d}</p></div><span class="pill ${pillFor(d.estado)}">${d.estado}</span></div>`
  ).join("");

  // ---- motor de liquidación (sidebar + pestaña costos) ----
  const origenData = ORIGENES[v.origen];
  document.getElementById("dTrm").value = TRM_HOY.valor;
  document.getElementById("dCompartidos").value = v.capacidadContenedor;
  document.getElementById("dCompartidos").max = v.capacidadContenedor;
  document.getElementById("dCompartidos").min = 1;
  document.getElementById("dFlete").value = origenData.fleteContenedorUsd;

  function recalcular() {
    const trm = parseFloat(document.getElementById("dTrm").value) || TRM_HOY.valor;
    const compartidos = Math.max(1, parseInt(document.getElementById("dCompartidos").value, 10) || 1);
    const flete = parseFloat(document.getElementById("dFlete").value) || origenData.fleteContenedorUsd;

    const r = TG_ENGINE.calcularLiquidacion({
      fobUsd: v.fobUsd, origen: v.origen, motorizacion: v.motorizacion, categoriaGastos: v.categoriaGastos,
      fleteContenedorUsd: flete, vehiculosCompartidos: compartidos, trm,
    });

    document.getElementById("sideFob").textContent = "USD " + v.fobUsd.toLocaleString("en-US");
    document.getElementById("sideTotal").textContent = TG_ENGINE.formatCop(r.valorTotalCop);
    document.getElementById("sideTratado").textContent = r.tratado;
    document.getElementById("sideArancel").textContent = TG_ENGINE.formatPct(r.arancelRate) + " · " + TG_ENGINE.formatCop(r.arancelCop);
    document.getElementById("sideIva").textContent = TG_ENGINE.formatPct(r.ivaRate) + " · " + TG_ENGINE.formatCop(r.ivaCop);
    document.getElementById("sideImpo").textContent = TG_ENGINE.formatPct(r.impoconsumoRate) + " · " + TG_ENGINE.formatCop(r.impoconsumoCop);

    document.getElementById("dBreakdown").innerHTML = `
      <div class="costrow"><span>Flete prorrateado (÷${compartidos})</span><b>USD ${r.fletePorVehiculoUsd.toFixed(0)}</b></div>
      <div class="costrow"><span>Seguro de transporte (1.5%)</span><b>USD ${r.seguroUsd.toFixed(0)}</b></div>
      <div class="costrow"><span>CIF</span><b>USD ${r.cifUsd.toFixed(0)} · ${TG_ENGINE.formatCop(r.cifCop)}</b></div>
      <div class="costrow"><span>Arancel (${TG_ENGINE.formatPct(r.arancelRate)})</span><b>${TG_ENGINE.formatCop(r.arancelCop)}</b></div>
      <div class="costrow"><span>IVA (${TG_ENGINE.formatPct(r.ivaRate)})</span><b>${TG_ENGINE.formatCop(r.ivaCop)}</b></div>
      <div class="costrow"><span>Impoconsumo (${r.impoconsumoTramo})</span><b>${TG_ENGINE.formatCop(r.impoconsumoCop)}</b></div>
      <div class="costrow"><span>Gastos operativos (Buenaventura)</span><b>${TG_ENGINE.formatCop(r.gastosOperativosCop)}</b></div>
      <div class="costrow" style="border-top:1px solid var(--border-strong);padding-top:12px;margin-top:4px;"><span style="font-weight:800;">Valor total nacionalizado</span><b style="font-size:15px;color:var(--accent-strong);">${TG_ENGINE.formatCop(r.valorTotalCop)}</b></div>
    `;
  }
  ["dTrm", "dCompartidos", "dFlete"].forEach(id => document.getElementById(id).addEventListener("input", recalcular));
  recalcular();

  document.getElementById("btnCotizar").href = "calculadora.html?vehiculo=" + v.id;
  document.getElementById("btnVerDocs").addEventListener("click", () => switchTab("documentos"));

  // ---- tabs ----
  function switchTab(name) {
    document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tabpanel").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
  }
  document.querySelectorAll(".tabbar button").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  TG_ICONS.mountIcons(document);
})();
