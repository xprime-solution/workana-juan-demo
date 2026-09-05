// =============================================================================
// TOP GEAR — motor de liquidación de importación.
// Esta es la pieza central del producto: la misma plantilla de Excel que Juan
// describió (origen -> flete -> CIF -> arancel según tratado -> IVA según
// motorización -> impoconsumo por tramo -> prorrateo de contenedor) convertida
// en funciones reales, encadenadas, que cualquier pantalla puede invocar con
// números reales del usuario. Nada aquí es una animación de "calculando...":
// cada función recibe entradas y devuelve el resultado real de la fórmula.
// =============================================================================

(function () {
  /**
   * Calcula la liquidación completa de un vehículo importado.
   * @param {Object} input
   * @param {number} input.fobUsd            Valor FOB del vehículo en USD.
   * @param {string} input.origen             Debe existir en window.ORIGENES.
   * @param {string} input.motorizacion       Debe existir en window.MOTORIZACIONES.
   * @param {string} input.categoriaGastos    "liviano" | "pesado".
   * @param {number} input.fleteContenedorUsd Costo total del contenedor compartido, en USD.
   * @param {number} input.vehiculosCompartidos Cuántos vehículos se reparten ese flete (>=1).
   * @param {number} input.trm                 COP por USD a usar (automático o manual).
   * @param {number} [input.seguroRate]         Tasa de seguro sobre FOB+flete (por defecto SEGURO_RATE).
   * @returns {Object} desglose completo con cada línea de la liquidación.
   */
  function calcularLiquidacion(input) {
    const origenData = window.ORIGENES[input.origen];
    const motorData = window.MOTORIZACIONES[input.motorizacion];
    if (!origenData) throw new Error("Origen no reconocido: " + input.origen);
    if (!motorData) throw new Error("Motorización no reconocida: " + input.motorizacion);

    const seguroRate = typeof input.seguroRate === "number" ? input.seguroRate : window.SEGURO_RATE;
    const vehiculosCompartidos = Math.max(1, Number(input.vehiculosCompartidos) || 1);
    const trm = Number(input.trm) || window.TRM_HOY.valor;
    const fobUsd = Number(input.fobUsd) || 0;
    const fleteContenedorUsd = Number(input.fleteContenedorUsd) || 0;

    // 1. Flete prorrateado entre los vehículos que comparten el contenedor.
    const fletePorVehiculoUsd = fleteContenedorUsd / vehiculosCompartidos;

    // 2. Seguro de transporte sobre FOB + flete (regla estándar de la póliza CIF).
    const seguroUsd = (fobUsd + fletePorVehiculoUsd) * seguroRate;

    // 3. CIF = FOB + flete prorrateado + seguro.
    const cifUsd = fobUsd + fletePorVehiculoUsd + seguroUsd;
    const cifCop = cifUsd * trm;

    // 4. Arancel, según el tratado del origen.
    const arancelRate = origenData.arancel;
    const arancelCop = cifCop * arancelRate;

    // 5. Base gravable de IVA e impoconsumo: CIF + arancel.
    const baseImpuestosCop = cifCop + arancelCop;

    // 6. IVA, según motorización (5% eléctrico/híbrido enchufable, 19% el resto).
    const ivaRate = motorData.iva;
    const ivaCop = baseImpuestosCop * ivaRate;

    // 7. Impoconsumo, por tramo de valor CIF.
    const tramo = window.tramoImpoconsumo(cifCop);
    const impoconsumoCop = baseImpuestosCop * tramo.tasa;

    // 8. Gastos operativos: agenciamiento aduanero, puerto y trámites en Buenaventura.
    const gastosOperativosCop = window.GASTOS_OPERATIVOS[input.categoriaGastos || "liviano"];

    // 9. Totales.
    const totalNacionalizacionCop = arancelCop + ivaCop + impoconsumoCop + gastosOperativosCop;
    const valorTotalCop = cifCop + totalNacionalizacionCop;
    const valorTotalUsd = trm > 0 ? valorTotalCop / trm : 0;

    return {
      entradas: { fobUsd, origen: input.origen, motorizacion: input.motorizacion, trm, seguroRate, fleteContenedorUsd, vehiculosCompartidos },
      tratado: origenData.tratado,
      fletePorVehiculoUsd,
      seguroUsd,
      cifUsd,
      cifCop,
      arancelRate,
      arancelCop,
      ivaRate,
      baseImpuestosCop,
      ivaCop,
      impoconsumoRate: tramo.tasa,
      impoconsumoTramo: tramo.tramo,
      impoconsumoCop,
      gastosOperativosCop,
      totalNacionalizacionCop,
      valorTotalCop,
      valorTotalUsd,
    };
  }

  function formatCop(value) {
    return "$" + Math.round(value).toLocaleString("es-CO") + " COP";
  }
  function formatUsd(value) {
    return "USD " + Math.round(value).toLocaleString("en-US");
  }
  function formatPct(value) {
    return (value * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "%";
  }

  window.TG_ENGINE = { calcularLiquidacion, formatCop, formatUsd, formatPct };
})();
