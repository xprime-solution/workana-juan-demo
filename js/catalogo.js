// Catálogo — filtros reales sobre window.VEHICLES, orden y paginación en el cliente.
(function () {
  TG_PARTIALS.mount("catalogo.html");

  const state = {
    search: "", marca: new Set(), carroceria: new Set(), motor: new Set(), origen: new Set(),
    estado: new Set(), disp: new Set(), trans: new Set(), traccion: new Set(),
    puertas: new Set(), asientos: new Set(), adas: new Set(), color: "",
    anioMin: null, fobMax: null, potMin: null, torqueMin: null, batMin: null, autMin: null, kmMax: null,
    sort: "relevancia", page: 1,
  };
  const PAGE_SIZE = 9;

  const uniq = (key) => [...new Set(VEHICLES.map(v => v[key]))].sort();
  const min = (key) => Math.min(...VEHICLES.map(v => v[key] || 0));
  const max = (key) => Math.max(...VEHICLES.map(v => v[key] || 0));

  function buildChipGroup(containerId, values, stateSet, rerender) {
    const el = document.getElementById(containerId);
    el.innerHTML = values.map(v => `<button type="button" class="toggle-chip" data-v="${v}">${v}</button>`).join("");
    el.querySelectorAll(".toggle-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-v");
        if (stateSet.has(v)) stateSet.delete(v); else stateSet.add(v);
        btn.classList.toggle("active");
        state.page = 1;
        rerender();
      });
    });
  }

  function buildChecklist(containerId, values, stateSet, rerender) {
    const el = document.getElementById(containerId);
    el.innerHTML = values.map(v => `<label><input type="checkbox" data-v="${v}">${v}</label>`).join("");
    el.querySelectorAll("input").forEach(cb => {
      cb.addEventListener("change", () => {
        const v = cb.getAttribute("data-v");
        if (cb.checked) stateSet.add(v); else stateSet.delete(v);
        state.page = 1;
        rerender();
      });
    });
  }

  function setupRange(id, lo, hi, step, initial, labelId, formatter, onChange) {
    const el = document.getElementById(id);
    el.min = lo; el.max = hi; el.step = step; el.value = initial;
    document.getElementById(labelId).textContent = formatter(initial);
    el.addEventListener("input", () => {
      document.getElementById(labelId).textContent = formatter(parseFloat(el.value));
      onChange(parseFloat(el.value));
      state.page = 1;
      render();
    });
    onChange(initial);
  }

  function passesFilters(v) {
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!(v.marca.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q) || v.version.toLowerCase().includes(q))) return false;
    }
    if (state.marca.size && !state.marca.has(v.marca)) return false;
    if (state.carroceria.size && !state.carroceria.has(v.carroceria)) return false;
    if (state.motor.size && !state.motor.has(v.motorizacion)) return false;
    if (state.origen.size && !state.origen.has(v.origen)) return false;
    if (state.estado.size && !state.estado.has(v.estado)) return false;
    if (state.disp.size && !state.disp.has(v.disponibilidad)) return false;
    if (state.trans.size && !state.trans.has(v.transmision)) return false;
    if (state.traccion.size && !state.traccion.has(v.traccion)) return false;
    if (state.puertas.size && !state.puertas.has(String(v.puertas))) return false;
    if (state.asientos.size && !state.asientos.has(String(v.asientos))) return false;
    if (state.adas.size && !state.adas.has(v.adas)) return false;
    if (state.color && v.color !== state.color) return false;
    if (state.anioMin != null && v.anio < state.anioMin) return false;
    if (state.fobMax != null && v.fobUsd > state.fobMax) return false;
    if (state.potMin != null && v.potencia < state.potMin) return false;
    if (state.torqueMin != null && v.torque < state.torqueMin) return false;
    if (state.batMin != null && state.batMin > 0 && (!v.bateria || v.bateria < state.batMin)) return false;
    if (state.autMin != null && state.autMin > 0 && (!v.autonomia || v.autonomia < state.autMin)) return false;
    if (state.kmMax != null && v.km > state.kmMax) return false;
    return true;
  }

  function sortList(list) {
    const l = list.slice();
    if (state.sort === "precio-asc") l.sort((a, b) => a.fobUsd - b.fobUsd);
    else if (state.sort === "precio-desc") l.sort((a, b) => b.fobUsd - a.fobUsd);
    else if (state.sort === "anio-desc") l.sort((a, b) => b.anio - a.anio);
    else if (state.sort === "potencia-desc") l.sort((a, b) => b.potencia - a.potencia);
    return l;
  }

  function cardHtml(v) {
    return `
    <div class="vcard hover-lift entrance">
      <div class="vcard__img" style="background-image:url('${v.imagen}')">
        <span class="pill ${v.estado === 'Nuevo' ? 'pill-ok' : 'pill-neutral'}">${v.estado}${v.estado === 'Usado' ? ' · ' + v.km.toLocaleString('es-CO') + ' km' : ''}</span>
        <span class="pill price">USD ${v.fobUsd.toLocaleString('en-US')}</span>
      </div>
      <div class="vcard__body">
        <h4>${v.marca} ${v.modelo}</h4>
        <div class="sub">${v.version} · ${v.anio} · ${v.origen}</div>
        <div class="vcard__specs">
          <span><span class="icon-slot" data-lucide="gauge" data-size="13"></span>${v.potencia} hp</span>
          <span><span class="icon-slot" data-lucide="fuel" data-size="13"></span>${v.motorizacion}</span>
          <span><span class="icon-slot" data-lucide="cog" data-size="13"></span>${v.transmision.split(' ')[0]}</span>
          <span class="pill pill-neutral" style="padding:2px 8px;">${v.disponibilidad}</span>
        </div>
        <div class="vcard__foot">
          <a class="btn btn-ghost btn-sm btn-block" href="vehiculo.html?id=${v.id}">Ver ficha</a>
          <a class="btn btn-primary btn-sm btn-block" href="calculadora.html?vehiculo=${v.id}">Cotizar</a>
        </div>
      </div>
    </div>`;
  }

  function render() {
    const filtered = sortList(VEHICLES.filter(passesFilters));
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    document.getElementById("resultsCount").textContent = total + (total === 1 ? " vehículo encontrado" : " vehículos encontrados");
    document.getElementById("resultsGrid").innerHTML = pageItems.map(cardHtml).join("");
    document.getElementById("emptyState").classList.toggle("hidden", total !== 0);
    document.getElementById("resultsGrid").classList.toggle("hidden", total === 0);

    document.getElementById("pageInfo").textContent = total === 0 ? "" :
      `Mostrando ${start + 1} a ${Math.min(start + PAGE_SIZE, total)} de ${total}`;

    const pager = document.getElementById("pager");
    let pagerHtml = `<button ${state.page === 1 ? "disabled" : ""} id="pagerPrev"><span class="icon-slot" data-lucide="chevron-left" data-size="15"></span></button>`;
    for (let p = 1; p <= totalPages; p++) {
      pagerHtml += `<button class="${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    pagerHtml += `<button ${state.page === totalPages ? "disabled" : ""} id="pagerNext"><span class="icon-slot" data-lucide="chevron-right" data-size="15"></span></button>`;
    pager.innerHTML = pagerHtml;
    pager.querySelectorAll("button[data-page]").forEach(b => b.addEventListener("click", () => { state.page = parseInt(b.dataset.page, 10); render(); window.scrollTo({top: document.querySelector('.catlayout').offsetTop - 100, behavior:"smooth"}); }));
    const prevBtn = document.getElementById("pagerPrev"); if (prevBtn) prevBtn.addEventListener("click", () => { state.page--; render(); });
    const nextBtn = document.getElementById("pagerNext"); if (nextBtn) nextBtn.addEventListener("click", () => { state.page++; render(); });

    TG_ICONS.mountIcons(document);
  }

  // ---- construir filtros ----
  buildChecklist("fMarca", uniq("marca"), state.marca, render);
  buildChipGroup("fCarroceria", uniq("carroceria"), state.carroceria, render);
  buildChipGroup("fMotor", uniq("motorizacion"), state.motor, render);
  buildChipGroup("fOrigen", uniq("origen"), state.origen, render);
  buildChipGroup("fEstado", uniq("estado"), state.estado, render);
  buildChipGroup("fDisp", uniq("disponibilidad"), state.disp, render);
  buildChipGroup("fTrans", uniq("transmision"), state.trans, render);
  buildChipGroup("fTraccion", uniq("traccion"), state.traccion, render);
  buildChipGroup("fPuertas", uniq("puertas").map(String), state.puertas, render);
  buildChipGroup("fAsientos", uniq("asientos").map(String), state.asientos, render);
  buildChipGroup("fAdas", uniq("adas"), state.adas, render);

  const colorSel = document.getElementById("fColor");
  uniq("color").forEach(c => colorSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
  colorSel.addEventListener("change", () => { state.color = colorSel.value; state.page = 1; render(); });

  setupRange("fAnioMin", min("anio"), max("anio"), 1, min("anio"), "fAnioMinVal", v => v, v => state.anioMin = v);
  setupRange("fFobMax", min("fobUsd"), max("fobUsd"), 500, max("fobUsd"), "fFobMaxVal", v => "USD " + Math.round(v).toLocaleString("en-US"), v => state.fobMax = v);
  setupRange("fPotMin", min("potencia"), max("potencia"), 5, min("potencia"), "fPotMinVal", v => Math.round(v) + " hp", v => state.potMin = v);
  setupRange("fTorqueMin", min("torque"), max("torque"), 5, min("torque"), "fTorqueMinVal", v => Math.round(v) + " Nm", v => state.torqueMin = v);
  setupRange("fBatMin", 0, max("bateria"), 1, 0, "fBatMinVal", v => v > 0 ? v + " kWh" : "Todos", v => state.batMin = v);
  setupRange("fAutMin", 0, max("autonomia"), 10, 0, "fAutMinVal", v => v > 0 ? v + " km" : "Todos", v => state.autMin = v);
  setupRange("fKmMax", 0, max("km"), 100, max("km"), "fKmMaxVal", v => Math.round(v).toLocaleString("es-CO") + " km", v => state.kmMax = v);

  document.getElementById("searchInput").addEventListener("input", (e) => { state.search = e.target.value; state.page = 1; render(); });
  document.getElementById("sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  function clearAll() {
    ["marca","carroceria","motor","origen","estado","disp","trans","traccion","puertas","asientos","adas"].forEach(k => state[k].clear());
    document.querySelectorAll(".toggle-chip.active").forEach(b => b.classList.remove("active"));
    document.querySelectorAll('#fMarca input:checked').forEach(cb => cb.checked = false);
    state.color = ""; colorSel.value = "";
    state.search = ""; document.getElementById("searchInput").value = "";
    state.anioMin = min("anio"); document.getElementById("fAnioMin").value = min("anio"); document.getElementById("fAnioMinVal").textContent = min("anio");
    state.fobMax = max("fobUsd"); document.getElementById("fFobMax").value = max("fobUsd"); document.getElementById("fFobMaxVal").textContent = "USD " + max("fobUsd").toLocaleString("en-US");
    state.potMin = min("potencia"); document.getElementById("fPotMin").value = min("potencia"); document.getElementById("fPotMinVal").textContent = min("potencia") + " hp";
    state.torqueMin = min("torque"); document.getElementById("fTorqueMin").value = min("torque"); document.getElementById("fTorqueMinVal").textContent = min("torque") + " Nm";
    state.batMin = 0; document.getElementById("fBatMin").value = 0; document.getElementById("fBatMinVal").textContent = "Todos";
    state.autMin = 0; document.getElementById("fAutMin").value = 0; document.getElementById("fAutMinVal").textContent = "Todos";
    state.kmMax = max("km"); document.getElementById("fKmMax").value = max("km"); document.getElementById("fKmMaxVal").textContent = max("km").toLocaleString("es-CO") + " km";
    state.page = 1;
    render();
  }
  document.getElementById("clearFilters").addEventListener("click", (e) => { e.preventDefault(); clearAll(); });
  document.getElementById("emptyClear").addEventListener("click", clearAll);
  document.getElementById("btnToggleFilters").addEventListener("click", () => document.getElementById("filterSidebar").classList.toggle("open"));

  render();
})();
