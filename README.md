# Deshidrataditos

Tienda estática de alimentos deshidratados de La Barca, Jalisco. GitHub Pages publica la carpeta `/docs` de la rama `main`; la fuente editable está en `/dist`.

## Catálogo y compra

- 27 artículos: frutas de temporada, favoritos, cítricos, tisanas, sazonadores y paquetes.
- Fresa con chile se mantiene; plátano natural pasa a plátano macho deshidratado con imagen propia. Se retiran piña con chile, mango con chile, rollito de mango y mix tropical enchilado.
- Tomate cherry deshidratado con opciones natural y finas hierbas; ajo deshidratado en hojuelas como incorporación sobre pedido.
- Frutas de temporada, cherry y ajo se consultan por WhatsApp, conservando la opción elegida, sin inventar precios o presentaciones. No entran al carrito hasta contar con una oferta definida.
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

La ficha `fruta-temporada` mantiene la oferta abierta a la cosecha y disponibilidad real; no calcula temporadas ni existencias automáticamente. Actualizar descripción, opciones e imagen al confirmar la fruta del lote. `quoteOnly: true` y variantes sin importe mantienen el flujo de consulta. Para habilitar compra, definir primero gramajes y precios reales y retirar `quoteOnly`. Conservar el mismo estado en `dist` y `docs` mediante el build. Los archivos `CNAME` y `.nojekyll` también se mantienen en ambas carpetas.

## Validación incluida

`node scripts/check.mjs` comprueba sintaxis, 17 casos de comercio, referencias HTML, navegación, presencia de recursos y correspondencia exacta entre docs y dist. Las pruebas cubren límites de envío, precios alterados en almacenamiento, duplicados, variantes, recomendaciones, paquetes, productos retirados, consultas sin precio y contenido del mensaje.

Se verificaron en navegador la ficha e imagen de plátano macho, la compra de dos bolsas de 100 g (subtotal $98), las opciones de cherry y sus enlaces de consulta tanto en tarjeta como en ficha, y la ficha de cherry a 390 px de ancho. Las comprobaciones de WhatsApp revisan el enlace preparado; no envían mensajes.

## Datos comerciales

Se conservan los precios existentes de los productos que siguen en catálogo, incluido el plátano al cambiar a macho. Los precios heredados de incorporaciones anteriores son propuestas de lanzamiento, no márgenes calculados. Frutas de temporada, cherry y ajo quedan por cotizar. El paquete de 3 bolsas de 50 g contiene fresa con chile, plátano macho y manzana con canela: $99 frente a $113 por separado, ahorro de $14 calculado desde el catálogo. No se ofrecen descuentos mayoristas automáticos.

La viabilidad técnica inicial del ajo, los límites de la evaluación del equipo Desali de 16 bandejas y el costeo por tanda están documentados en [Producción y temporada](notes/produccion-y-temporada.md). La rentabilidad requiere medir insumos, merma, energía, trabajo, empaque y demanda.

La página no afirma vidas de anaquel, ingredientes completos, propiedades de salud o existencias de los productos nuevos sin respaldo. El cliente puede consultar ingredientes y alérgenos y debe seguir el etiquetado del lote. Antes de operar estos productos, el negocio debe cerrar formulaciones, costos, etiquetado y fechas de conservación.

Mercado Pago y el campo de cupones sin funcionalidad se retiraron del flujo visible. Transferencia y contra entrega regional se acuerdan al confirmar la solicitud. El carrito solo guarda identificadores, variantes, cantidades y precios de catálogo; los datos de contacto no se guardan en localStorage.

## Imágenes

Se conservan los assets originales. Se agregaron tres imágenes editoriales generadas con IA para cítricos, sazonadores y rollitos, optimizadas a JPEG de 1,000 × 1,000 px. Las imágenes del catálogo se identifican como ilustrativas y no sustituyen fotografías del producto final.

El plátano macho usa `dist/assets/platano-macho-editorial.jpg`, generado con ImageGen a partir de la referencia visual aportada y optimizado a 1,000 × 1,000 px. El prompt completo y el método están en [Imagen de plátano macho](notes/imagen-platano-macho.md).

## Pull request

El resumen de cambios está en `PR_DESCRIPTION.md`. La entrega se prepara en la rama `catalogo-temporada-platano-macho-20260908`, sin integrar cambios a `main`. La carpeta local se recibió sin `.git`; la rama se crea mediante la conexión de GitHub.
