# Deshidrataditos

Tienda estática de alimentos deshidratados de La Barca, Jalisco. GitHub Pages publica la carpeta `/docs` de la rama `main`; la fuente editable está en `/dist`.

## Catálogo y compra

- 28 artículos: los 16 existentes y 12 incorporaciones sobre pedido.
- Cítricos para bebidas, tisanas frutales, mix tropical, sazonadores, rollitos, jitomate y paquete degustación.
- Búsqueda sin distinción de acentos, filtros por categoría/uso/novedades y orden por precio, precio por 100 g o nombre.
- Fichas con uso sugerido, variantes, cantidad y contenido exacto de paquetes.
- Carrito local con recuperación tolerante a datos dañados, precios recalculados desde el catálogo, cantidades limitadas y sincronización entre pestañas.
- Recomendaciones por afinidad con los productos del carrito.
- Envío nacional de $200, gratis desde $2,000; entrega regional pendiente de cotización por debajo de ese importe.
- Pedido y cotizaciones para negocios mediante un resumen que el cliente revisa y envía en WhatsApp. No se procesa ningún cobro en la página.

## Editar y comprobar

Requiere Node.js 20 o posterior. No hay dependencias que instalar.

```sh
node scripts/build.mjs
node scripts/check.mjs
node scripts/preview.mjs
```

También están disponibles `npm run build`, `npm test` y `npm run preview`. La vista previa escucha únicamente en `http://127.0.0.1:4173`.

1. Editar `dist/catalog.js` para modificar productos, precios, presentaciones, imágenes y disponibilidad. Los datos existentes están en `PRODUCTS`; las incorporaciones en `ADDITIONS`.
2. Editar `dist/commerce.js` para cambiar reglas de precios, envío, normalización del carrito o recomendaciones.
3. Editar `dist/app.js`, `dist/index.html` y los CSS para cambiar la interfaz.
4. Ejecutar build y pruebas; incluir en el PR tanto `/dist` como `/docs`. El build copia y no borra archivos. Si se retira un archivo público, retirarlo explícitamente en ambas carpetas.
5. Si cambia JavaScript o CSS, actualizar de forma conjunta la versión de los recursos en `dist/index.html` para evitar mezclas con archivos almacenados en caché.

`cart-enhancements.js` se conserva como archivo de compatibilidad sin ejecutar lógica; la página actual usa un único controlador en `app.js`. Las rutas de las categorías anteriores siguen funcionando con sus anclas.

## Validación incluida

`node scripts/check.mjs` comprueba sintaxis, 12 casos de comercio, referencias HTML, navegación, presencia de recursos y correspondencia exacta entre docs y dist. Las pruebas cubren límites de envío, precios alterados en almacenamiento, duplicados, variantes, recomendaciones, paquetes y contenido del mensaje.

La validación de esta entrega fue de código, reglas y recursos; no se ejecutaron pruebas visuales o de interacción en navegador.

## Datos comerciales

Los precios de las incorporaciones son propuestas de lanzamiento, no márgenes calculados: faltan costos reales de producción, empaque y merma. Todas se ofrecen sobre pedido y requieren confirmar disponibilidad y preparación antes del pago. El paquete de 3 bolsas de 50 g cuesta $99 frente a $105 por separado; el ahorro se obtiene del catálogo. No se ofrecen descuentos mayoristas automáticos.

La página no afirma vidas de anaquel, ingredientes completos, propiedades de salud o existencias de los productos nuevos sin respaldo. El cliente puede consultar ingredientes y alérgenos y debe seguir el etiquetado del lote. Antes de operar estos productos, el negocio debe cerrar formulaciones, costos, etiquetado y fechas de conservación.

Mercado Pago y el campo de cupones sin funcionalidad se retiraron del flujo visible. Transferencia y contra entrega regional se acuerdan al confirmar la solicitud. El carrito solo guarda identificadores, variantes, cantidades y precios de catálogo; los datos de contacto no se guardan en localStorage.

## Imágenes

Se conservan los assets originales. Se agregaron tres imágenes editoriales generadas con IA para cítricos, sazonadores y rollitos, optimizadas a JPEG de 1,000 × 1,000 px. Las imágenes del catálogo se identifican como ilustrativas y no sustituyen fotografías del producto final.

## Pull request

El resumen preparado está en `PR_DESCRIPTION.md`. Esta carpeta se recibió como copia de archivos sin `.git`; no se creó una rama, un commit ni un PR remoto.
