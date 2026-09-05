Hola Juan. Esto es Top Gear, la primera versión funcionando de la plataforma que describiste en tu publicación: un sitio D2C para importar vehículos a Colombia, con el motor de liquidación como el corazón del producto. No es una maqueta ni una serie de pantallas bonitas sin nada detrás. Es el motor real, con la misma lógica de tu plantilla de Excel, corriendo en el navegador, más el catálogo, la propuesta comercial y el portal de seguimiento que pediste para esta primera fase.

Para abrirlo, solo hace falta abrir `index.html` en cualquier navegador, sin instalar nada ni tener internet prendido. Las fotos, los íconos y el logo ya están guardados adentro de la carpeta del proyecto.

## Por dónde empieza el recorrido

La portada es la vitrina: el titular ya dice de qué se trata el negocio ("cotizá tu carro importado con el costo real de nacionalizarlo"), y a la derecha del encabezado ves la TRM del día, actualizada automáticamente. Ahí mismo, antes de bajar a ver un solo vehículo, hay una calculadora chica donde podés elegir un origen y una motorización y ver el arancel y el IVA cambiar en el momento. La puse ahí a propósito: quiero que cualquiera que entre a la página entienda en cinco segundos que el diferencial de Top Gear no es tener autos lindos, es saber cobrar bien los impuestos de cada uno.

Más abajo están los cuatro pasos del negocio (elegir, calcular, generar la propuesta, seguir el pedido), una vista rápida de seis vehículos del catálogo, tres testimonios de compradores que ya importaron con nosotros, y una tarjeta con tu foto real como asesor de importación asignado. Esa tarjeta la dejé a propósito: como todavía no hay chatbot de IA en esta fase, quiero que quede claro que del otro lado hay una persona respondiendo, no un bot a medio armar.

## El catálogo, con filtros que filtran de verdad

Desde "Catálogo" en el menú entrás a los 15 vehículos que cargamos a mano para esta primera versión. A la izquierda hay veinte filtros reales: marca, carrocería, motorización, origen, estado, disponibilidad, transmisión, tracción, puertas, asientos, ADAS, color, y rangos de año, precio FOB, potencia, torque, batería, autonomía y kilometraje. Cada uno de esos filtros de verdad recorta la lista de vehículos, y podés combinarlos entre sí: si marcás "Eléctrico" y ordenás por precio, el resultado se actualiza al instante y el contador de arriba ("15 vehículos encontrados") cambia con vos. Abajo hay paginación real, no una lista infinita ni una que corta a la mitad.

Fijate que dejé dos vehículos Tesla del mismo modelo con distinto origen a propósito en el catálogo completo: un Model 3 que llega de la planta de Shanghái. Es el ejemplo más claro de por qué el motor tiene que mirar el origen del vehículo y no la marca: el mismo auto paga 35% de arancel si viene de China y 0% si viniera de Estados Unidos, y esa diferencia la calcula el motor, no una tabla fija por marca.

## La ficha de cada vehículo

Al entrar a un vehículo (por ejemplo la Hilux) ves la foto, la ficha de especificaciones y cuatro pestañas: Resumen, Ficha técnica, Costos y Documentos. La pestaña Costos no es un texto fijo, es el mismo motor de liquidación de la calculadora, ya cargado con los datos de esa unidad puntual. Si cambiás la TRM a mano o le decís que el contenedor lo comparten dos vehículos en vez de tres, el valor nacionalizado de la derecha se recalcula ahí mismo. La pestaña Documentos lista los seis papeles que hacen falta para nacionalizar un vehículo (factura comercial, conocimiento de embarque, certificado de origen, homologación RUNT, declaración de importación y póliza de transporte), cada uno con el estado real que tendría en ese momento del proceso.

## El motor de liquidación, en su propia pantalla

Esta es la pantalla que más tiempo me llevó, porque es la que resuelve lo que vos describiste como lo más importante: "resumir cada vez que coticemos un vehículo... y entrega un valor completo". A la izquierda configurás todo: podés partir de un vehículo del catálogo (que autocompleta el FOB, el origen y la motorización pero te deja seguir editando) o armar una cotización libre desde cero. Ahí elegís el origen, la motorización, el valor FOB, el flete del contenedor completo, cuántos vehículos lo comparten, y si la TRM es la automática del día o una que vos cargás a mano.

En el medio ves el desglose completo, paso por paso: FOB, flete prorrateado, seguro, CIF, arancel según el tratado del origen, IVA según la motorización, impoconsumo según el tramo de valor, y los gastos operativos de Buenaventura. Cada línea te dice de dónde sale el número, no solo cuánto es. A la derecha está el resultado grande: el valor total nacionalizado, en pesos y en dólares, con las tres tasas aplicadas a la vista. Ese "Guardar cotización y continuar" es lo que conecta esta pantalla con el checkout: lo que armaste acá viaja con vos al siguiente paso, no hay que volver a cargar nada.

Las tablas de arancel, IVA e impoconsumo que armé para este demo son un punto de partida razonable (el arancel según los tratados vigentes de Colombia, el IVA reducido para eléctricos e híbridos enchufables, el impoconsumo por tramos de valor), pero quedan escritas en un solo archivo (`js/data.js`) fáciles de reemplazar por tus tablas reales apenas las tengamos. Ese es justo el punto que te pregunté en el mensaje después de la propuesta: quién te entrega esas tablas y con qué frecuencia cambian, porque el motor tiene que quedar armado para que las actualicés vos mismo.

## De la cotización a la propuesta comercial

Desde la ficha de un vehículo o desde la calculadora, "Cotizar este vehículo" te lleva al checkout. Ahí el flujo tiene cuatro pasos: un resumen de lo que ya calculaste, tus datos como comprador, un pago (simulado, como te explico más abajo) y la propuesta comercial. Esa propuesta es un documento con membrete de Top Gear, la foto y los datos del vehículo, y el mismo desglose de costos que viste en la calculadora, ahora en formato de documento para imprimir o guardar como PDF con el botón de imprimir del navegador. No hace falta ninguna librería de servidor para esto: es HTML con una hoja de estilos pensada para papel, y el navegador se encarga del resto.

Cuando confirmás el pedido, ahí mismo se crea un número de pedido nuevo y te manda directo al portal del cliente, ya con ese pedido cargado.

## El portal del cliente

Esta pantalla es el "¿dónde está mi carro?" resuelto de una vez. Buscás por número de pedido (o elegís uno de la lista de "Tus pedidos" a la derecha) y ves: el vehículo, el número de pedido, una barra con las ocho etapas reales de una importación a Buenaventura (compra confirmada, consolidación, zarpe, puerto, aduana, zona franca, matrícula y entrega), cuánto se pagó y cuánto falta, la fecha estimada de entrega, los documentos pendientes con su estado, y una tarjeta con tu foto como asesor asignado. También dejé una foto real del Puerto de Buenaventura en el panel derecho, para que la etapa física del contenedor no sea solo un ícono. Si buscás un número de pedido que no existe, el portal te lo dice claro y te ofrece elegir uno de los que sí tenés, en vez de mostrar cualquier cosa.

Para que veas que todo esto está conectado de verdad y no son pantallas sueltas: hay un pedido ya cargado (Toyota Hilux, en la etapa de aduana) para que el portal no arranque vacío, y si completás un checkout entero desde cero, ese pedido nuevo aparece también en la lista, con su propio número y su propio estado en "compra confirmada". Es la misma base de datos liviana (guardada en el navegador) la que alimenta el catálogo, la calculadora, el checkout y el portal.

## Qué es real y qué está simulado

Quiero ser directo con esto, porque es la pregunta que más importa. El motor de liquidación es real: cada número que ves (arancel, IVA, impoconsumo, CIF, flete prorrateado) sale de una fórmula que corre en el momento, no de un valor guardado de antemano. Podés cambiar el origen, la motorización o la TRM y ver cómo cambia el resultado, ese es justo el punto de esta primera fase.

Lo único simulado es el pago del checkout: no hay pasarela de pago real conectada, así que "procesar el pago" muestra el mismo recorrido que tendría un pago real (procesando, aprobado, transacción creada) pero sin cobrar nada. En un build en producción ahí va Wompi, PayU o la pasarela que definas, sin que el resto del flujo cambie.

## Lo que no entra en esta fase

Como hablamos en el mensaje después de la propuesta, esta primera fase cubre el motor de liquidación completo, el catálogo con sus filtros, la propuesta comercial en PDF y el portal básico del cliente. Lo que dejamos para una segunda fase, que se cotiza aparte una vez esta primera esté generando cotizaciones reales, son las cuatro cosas que mencionaste y que a propósito no están acá: la sincronización automática con Manheim o Alibaba para traer vehículos, la sincronización con TuCarro y CarroYa, el chatbot de atención con IA, y el rastreo GPS en vivo del contenedor. El portal de seguimiento que sí construimos te muestra la etapa en la que está el pedido, pero es un estado, no un mapa en tiempo real: esa diferencia es exactamente la que separa esta fase de la siguiente.

## Los datos de prueba y cómo reiniciar

Los 15 vehículos, los tres testimonios y el pedido de ejemplo son datos de prueba que armamos para que el demo se vea como un catálogo real desde el primer segundo, no como una pantalla vacía. Si querés volver a mostrar el demo desde cero después de crear pedidos nuevos o cambiar filtros, "Reiniciar demo" (abajo a la derecha, en el pie de cualquier página) borra lo que se guardó en el navegador y vuelve a dejar todo como al principio.

## Lo que pediste, reflejado en lo que ves

Tu publicación decía que lo más importante era resumir la cotización de cada vehículo con arancel, IVA e impoconsumo calculados según origen, motorización y tipo de vehículo, y que quedara un valor completo. Eso es la calculadora y la pestaña de costos de cada ficha. Pediste un catálogo con los filtros del negocio: son los veinte filtros reales del catálogo. Pediste el PDF de la propuesta comercial: es el documento imprimible del checkout. Y pediste un portal básico para que el cliente vea el estado de su pedido: son las ocho etapas del portal, con los documentos y los pagos al lado.

Cualquier duda que tengas mirándolo, decime y lo repasamos juntos con el demo abierto.
