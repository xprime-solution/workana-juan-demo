// =============================================================================
// TOP GEAR — datos semilla compartidos por todas las páginas.
// Todo vive aquí (nunca en fetch/JSON externo) para que el demo abra sin
// servidor, con file:// o con internet apagado.
// =============================================================================

// --- Tasa de cambio (TRM) ----------------------------------------------------
// Valor automático de referencia. El usuario puede sobreescribirlo a mano en
// la calculadora: eso alimenta el motor real, esto es solo el punto de partida.
window.TRM_HOY = { valor: 4078.50, fecha: "05/09/2026" };

// --- Tratado / arancel según origen ------------------------------------------
// Arancel 0% cuando existe un acuerdo comercial vigente con Colombia para
// vehículos de ese origen (TLC Colombia-EEUU, TLC Colombia-Corea, Alianza del
// Pacífico con México, Acuerdo Comercial Colombia-Unión Europea). Sin acuerdo
// vigente para autos (Japón, China) el arancel general es 35%.
window.ORIGENES = {
  "Estados Unidos": { tratado: "TLC Colombia - Estados Unidos", arancel: 0.00, fleteContenedorUsd: 3400 },
  "México":          { tratado: "Alianza del Pacífico (TLC G2)",  arancel: 0.00, fleteContenedorUsd: 2600 },
  "Corea del Sur":   { tratado: "TLC Colombia - Corea del Sur",   arancel: 0.00, fleteContenedorUsd: 4800 },
  "Alemania":        { tratado: "Acuerdo Comercial Colombia - Unión Europea", arancel: 0.00, fleteContenedorUsd: 6200 },
  "Japón":           { tratado: "Sin acuerdo comercial vigente",  arancel: 0.35, fleteContenedorUsd: 5100 },
  "China":           { tratado: "Sin acuerdo comercial vigente",  arancel: 0.35, fleteContenedorUsd: 4300 },
};

// --- IVA según motorización ---------------------------------------------------
// Refleja el tratamiento real de IVA reducido para eléctricos e híbridos
// enchufables en Colombia (5%) frente al 19% general del resto de motorizaciones.
window.MOTORIZACIONES = {
  "Eléctrico":              { iva: 0.05 },
  "Híbrido enchufable":     { iva: 0.05 },
  "Híbrido convencional":   { iva: 0.19 },
  "Gasolina":               { iva: 0.19 },
  "Diésel":                 { iva: 0.19 },
};

// --- Impoconsumo por tramo de valor CIF (COP) --------------------------------
// Supuesto del demo, no una tabla oficial vigente: exento hasta 90.000.000,
// 8% entre 90.000.000 y 180.000.000, 16% por encima. Ajustable a las tablas
// reales de Juan sin tocar la fórmula.
window.tramoImpoconsumo = function (cifCop) {
  if (cifCop <= 90000000) return { tasa: 0.00, tramo: "Exento" };
  if (cifCop <= 180000000) return { tasa: 0.08, tramo: "Tramo medio (8%)" };
  return { tasa: 0.16, tramo: "Tramo alto (16%)" };
};

// --- Seguro de transporte y gastos operativos --------------------------------
window.SEGURO_RATE = 0.015; // 1.5% sobre FOB + flete, práctica estándar de la póliza CIF
window.GASTOS_OPERATIVOS = {
  liviano: 2800000,  // agenciamiento aduanero, puerto y trámites en Buenaventura — sedán/SUV
  pesado: 3600000,   // idem, categoría pickup / SUV grande, maniobra de mayor tamaño
};

// --- Catálogo de vehículos ----------------------------------------------------
window.VEHICLES = [
  {
    id: "hilux", marca: "Toyota", modelo: "Hilux", version: "SR5 4x4", anio: 2024,
    carroceria: "Pickup", categoriaGastos: "pesado", capacidadContenedor: 2,
    motorizacion: "Diésel", potencia: 204, torque: 500, transmision: "Automática 6 vel.",
    traccion: "4x4", puertas: 4, asientos: 5, bateria: null, autonomia: null,
    adas: "Básico", color: "Negro Ébano", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "Japón", fobUsd: 27800, imagen: "assets/images/vehicles/hilux.jpg",
    resumen: "La pickup de trabajo más pedida para importación particular y de flota liviana.",
  },
  {
    id: "corolla-cross", marca: "Toyota", modelo: "Corolla Cross", version: "Hybrid XLE", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Híbrido convencional", potencia: 196, torque: 188, transmision: "CVT",
    traccion: "Delantera (FWD)", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Blanco Perla", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "Japón", fobUsd: 23500, imagen: "assets/images/vehicles/corolla-cross.jpg",
    resumen: "El SUV híbrido de entrada, pensado para uso urbano diario con bajo consumo.",
  },
  {
    id: "cx5", marca: "Mazda", modelo: "CX-5", version: "Grand Touring", anio: 2023,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 187, torque: 252, transmision: "Automática 6 vel.",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Gris Machine", km: 0, estado: "Nuevo", disponibilidad: "Bajo pedido",
    origen: "Japón", fobUsd: 21800, imagen: "assets/images/vehicles/cx5.jpg",
    resumen: "Terminación premium japonesa con tracción total de serie.",
  },
  {
    id: "tucson-hybrid", marca: "Hyundai", modelo: "Tucson", version: "Hybrid Limited", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Híbrido convencional", potencia: 226, torque: 350, transmision: "Automática 6 vel.",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Azul Amazonas", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "Corea del Sur", fobUsd: 25900, imagen: "assets/images/vehicles/tucson-hybrid.jpg",
    resumen: "El híbrido coreano con más potencia combinada de su segmento.",
  },
  {
    id: "sportage", marca: "Kia", modelo: "Sportage", version: "X-Line", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 187, torque: 245, transmision: "Automática 8 vel.",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Verde Selva", km: 12400, estado: "Usado", disponibilidad: "En stock",
    origen: "Corea del Sur", fobUsd: 20600, imagen: "assets/images/vehicles/sportage.jpg",
    resumen: "Unidad seminueva con historial único de dueño, revisión previa a embarque incluida.",
  },
  {
    id: "ev6", marca: "Kia", modelo: "EV6", version: "GT-Line", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Eléctrico", potencia: 320, torque: 605, transmision: "Directa (reductor 1 vel.)",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: 77.4, autonomia: 500,
    adas: "Avanzado", color: "Gris Meteor", km: 0, estado: "Nuevo", disponibilidad: "En tránsito",
    origen: "Corea del Sur", fobUsd: 37500, imagen: "assets/images/vehicles/ev6.jpg",
    resumen: "El eléctrico de mayor autonomía real del catálogo, con carga rápida de 350 kW.",
  },
  {
    id: "byd-han", marca: "BYD", modelo: "Han", version: "EV Performance", anio: 2024,
    carroceria: "Sedán", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Eléctrico", potencia: 313, torque: 550, transmision: "Directa (reductor 1 vel.)",
    traccion: "Trasera (RWD)", puertas: 4, asientos: 5, bateria: 85.4, autonomia: 521,
    adas: "Avanzado", color: "Negro Cósmico", km: 0, estado: "Nuevo", disponibilidad: "Bajo pedido",
    origen: "China", fobUsd: 28900, imagen: "assets/images/vehicles/byd-han.jpg",
    resumen: "Sedán eléctrico de batería de blindaje Blade, el más grande de la marca en el catálogo.",
  },
  {
    id: "byd-song-plus", marca: "BYD", modelo: "Song Plus", version: "DM-i", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Híbrido enchufable", potencia: 218, torque: 300, transmision: "DHT automática",
    traccion: "Delantera (FWD)", puertas: 5, asientos: 5, bateria: 18.3, autonomia: 120,
    adas: "Básico", color: "Blanco Cristal", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "China", fobUsd: 23400, imagen: "assets/images/vehicles/byd-song-plus.jpg",
    resumen: "Híbrido enchufable con 120 km en modo eléctrico puro antes de usar una gota de gasolina.",
  },
  {
    id: "tiguan", marca: "Volkswagen", modelo: "Tiguan", version: "Life", anio: 2023,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 150, torque: 250, transmision: "DSG 7 vel.",
    traccion: "Delantera (FWD)", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Básico", color: "Gris Platino", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "Alemania", fobUsd: 26700, imagen: "assets/images/vehicles/tiguan.jpg",
    resumen: "El SUV alemán familiar de entrada, con espacio de cabina de referencia en su clase.",
  },
  {
    id: "glc300", marca: "Mercedes-Benz", modelo: "GLC 300", version: "4MATIC", anio: 2023,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 258, torque: 400, transmision: "9G-Tronic automática",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Negro Obsidiana", km: 0, estado: "Nuevo", disponibilidad: "Bajo pedido",
    origen: "Alemania", fobUsd: 47600, imagen: "assets/images/vehicles/glc300.jpg",
    resumen: "El SUV premium alemán de la gama, con la terminación 4MATIC de serie.",
  },
  {
    id: "x3", marca: "BMW", modelo: "X3", version: "xDrive30i M Sport", anio: 2023,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 248, torque: 350, transmision: "Automática 8 vel.",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Blanco Alpino", km: 6800, estado: "Usado", disponibilidad: "En stock",
    origen: "Alemania", fobUsd: 44900, imagen: "assets/images/vehicles/x3.jpg",
    resumen: "Unidad seminueva con paquete M Sport, la de menor kilometraje del lote alemán.",
  },
  {
    id: "mache", marca: "Ford", modelo: "Mustang Mach-E", version: "Premium", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Eléctrico", potencia: 266, torque: 430, transmision: "Directa (reductor 1 vel.)",
    traccion: "AWD", puertas: 5, asientos: 5, bateria: 91, autonomia: 490,
    adas: "Avanzado", color: "Azul Grabber", km: 0, estado: "Nuevo", disponibilidad: "En tránsito",
    origen: "Estados Unidos", fobUsd: 41800, imagen: "assets/images/vehicles/mache.jpg",
    resumen: "El SUV eléctrico de batería más grande del catálogo, con ADN de Mustang.",
  },
  {
    id: "tahoe", marca: "Chevrolet", modelo: "Tahoe", version: "High Country", anio: 2024,
    carroceria: "SUV grande", categoriaGastos: "pesado", capacidadContenedor: 2,
    motorizacion: "Gasolina", potencia: 420, torque: 623, transmision: "Automática 10 vel.",
    traccion: "4x4", puertas: 4, asientos: 7, bateria: null, autonomia: null,
    adas: "Avanzado", color: "Blanco Perla", km: 0, estado: "Nuevo", disponibilidad: "Bajo pedido",
    origen: "Estados Unidos", fobUsd: 61900, imagen: "assets/images/vehicles/tahoe.jpg",
    resumen: "El SUV de 7 puestos más grande del catálogo, tope de gama de la marca.",
  },
  {
    id: "model3", marca: "Tesla", modelo: "Model 3", version: "Long Range", anio: 2024,
    carroceria: "Sedán", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Eléctrico", potencia: 366, torque: 493, transmision: "Directa (doble motor)",
    traccion: "AWD", puertas: 4, asientos: 5, bateria: 79.5, autonomia: 629,
    adas: "Avanzado", color: "Blanco Perla Multicapa", km: 0, estado: "Nuevo", disponibilidad: "En stock",
    origen: "China", fobUsd: 33200, imagen: "assets/images/vehicles/model3.jpg",
    resumen: "Unidad de exportación fabricada en la planta de Shanghái: mismo Model 3, arancel distinto al de origen EEUU.",
  },
  {
    id: "kicks", marca: "Nissan", modelo: "Kicks", version: "Advance", anio: 2024,
    carroceria: "SUV", categoriaGastos: "liviano", capacidadContenedor: 3,
    motorizacion: "Gasolina", potencia: 141, torque: 199, transmision: "CVT",
    traccion: "Delantera (FWD)", puertas: 5, asientos: 5, bateria: null, autonomia: null,
    adas: "Básico", color: "Rojo Fuego", km: 14200, estado: "Usado", disponibilidad: "En stock",
    origen: "México", fobUsd: 16900, imagen: "assets/images/vehicles/kicks.jpg",
    resumen: "El SUV de entrada más asequible del catálogo, con el flete más corto por su origen mexicano.",
  },
];

// --- Clientes / testimonios (reutilizados también en el portal) --------------
window.TESTIMONIOS = [
  {
    id: "camilo", nombre: "Camilo Andrés Rojas Peña", ciudad: "Medellín, Antioquia",
    vehiculoId: "hilux", avatar: "assets/images/avatars/customer_camilo.jpg",
    cita: "Cargué mi propia cotización de la Hilux en la calculadora antes de pagar nada, y el valor nacionalizado que me dieron fue el mismo que después certificó la agencia en Buenaventura.",
  },
  {
    id: "daniela", nombre: "Daniela Fernanda Ortiz Vélez", ciudad: "Bogotá, D.C.",
    vehiculoId: "byd-song-plus", avatar: "assets/images/avatars/customer_daniela.jpg",
    cita: "Con un híbrido enchufable el IVA cambia a 5% y no todos los que cotizan afuera lo saben aplicar bien. Aquí lo vi calculado con la tasa correcta desde el primer número.",
  },
  {
    id: "jorge", nombre: "Jorge Iván Salazar Méndez", ciudad: "Cali, Valle del Cauca",
    vehiculoId: "tahoe", avatar: "assets/images/avatars/customer_jorge.jpg",
    cita: "Importé una camioneta grande y compartí contenedor con otro comprador. El prorrateo del flete quedó desglosado línea por línea, nada de cifra genérica.",
  },
];

// --- Etapas del seguimiento de importación (portal del cliente) --------------
window.ETAPAS_IMPORTACION = [
  { key: "compra", label: "Compra confirmada", icon: "circle-check" },
  { key: "consolidacion", label: "En consolidación", icon: "warehouse" },
  { key: "zarpe", label: "Zarpe", icon: "ship" },
  { key: "puerto", label: "Puerto Buenaventura", icon: "anchor" },
  { key: "aduana", label: "Aduana", icon: "landmark" },
  { key: "zona-franca", label: "Zona Franca", icon: "package-check" },
  { key: "matricula", label: "Matrícula", icon: "file-check" },
  { key: "entrega", label: "Entrega", icon: "car" },
];

// --- Pedido semilla para el portal --------------------------------------------
window.SEED_ORDER = {
  numero: "TG-2026-00842",
  clienteId: "camilo",
  vehiculoId: "hilux",
  etapaActualIndex: 4, // "Aduana"
  fechaCompra: "12/07/2026",
  fechaEstimadaEntrega: "29/09/2026",
  totalCop: null, // se calcula con el motor al cargar el portal
  abonadoCop: null,
  documentosPendientes: [
    { nombre: "Declaración de importación (Formulario 500) firmada", estado: "pendiente" },
    { nombre: "Copia de cédula ampliada al 150%", estado: "listo" },
    { nombre: "Certificado de matrícula provisional", estado: "en_tramite" },
    { nombre: "Póliza de responsabilidad civil (SOAT)", estado: "pendiente" },
  ],
  asesor: {
    nombre: "Michael Lee",
    rol: "Asesor de importación asignado",
    avatar: "assets/images/avatars/admin_michael.png",
  },
};
