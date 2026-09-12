# Deshidrataditos

Tienda estática de alimentos deshidratados de La Barca, Jalisco. GitHub Pages publica la carpeta `/docs` de la rama `main`; la fuente editable está en `/dist`.

## Catálogo y compra

- 27 artículos: frutas de temporada, favoritos, cítricos, tisanas, sazonadores y paquetes.
- Desde el 12 de septiembre de 2026 se retiran las presentaciones de 1 kg de los 14 artículos que las ofrecían; conservan sus opciones de 50 g, 100 g y 250 g con los mismos precios. El resto de las presentaciones y paquetes sigue vigente. Los carritos guardados descartan las opciones retiradas al cargar el catálogo actual.
- Fresa con chile se mantiene; plátano natural pasa a plátano macho deshidratado con imagen propia. Se retiran piña con chile, mango con chile, rollito de mango y mix tropical enchilado.
- Tomate cherry deshidratado con opciones natural y finas hierbas; ajo deshidratado en hojuelas como incorporación sobre pedido.
- Frutas de temporada, cherry y ajo se consultan por WhatsApp, conservando la opción elegida, sin inventar precios o presentaciones. No entran al carrito hasta contar con una oferta definida.
- Búsqueda sin distinción de acentos, filtros por categoría/uso/novedades y orden por precio, precio por 100 g o nombre.
- Fichas con imagen dedicada, ingredientes de referencia, conservación y cuidados después de abrir, uso sugerido, variantes, cantidad y contenido exacto de paquetes. Los ingredientes de cherry cambian con la opción natural o finas hierbas.
- Carrito local con recuperación tolerante a datos dañados, precios recalculados desde el catálogo, cantidades limitadas y sincronización entre pestañas.
- Recomendaciones por afinidad con los productos del carrito.
- “Arma tu paquete” en Paquetes, con acceso desde Tienda: tres sabores distintos en bolsas de 50 g, vista previa de cada producto, ingredientes, disponibilidad y total actualizado al elegir. Se suman los precios individuales sin descuento adicional; las tres bolsas se agregan juntas como artículos normales al carrito y al resumen de WhatsApp. Las opciones sobre pedido se identifican antes de agregar. No se permiten selecciones incompletas, duplicadas, agotadas o por cotizar; si una bolsa supera el límite del carrito se rechaza toda la adición.
- Envío nacional de $200, gratis desde $2,000; entrega regional pendiente de cotización por debajo de ese importe.
- Pedido y cotizaciones para negocios mediante un resumen que el cliente revisa y envía en WhatsApp. No se procesa ningún cobro en la página.

## Editar y comprobar

Requiere Node.js 20.19 o posterior; se recomienda Node.js 24 LTS. Las pruebas usan parse5 como herramienta de desarrollo, fijada en el archivo de bloqueo. No se carga en la tienda ni se publica en `docs`.

```sh
npm ci --ignore-scripts
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

`node scripts/check.mjs` comprueba sintaxis, 22 casos de comercio, 13 casos de seguridad y 6 grupos de comprobaciones del bloqueo de CodeQL; también referencias HTML, navegación, recursos y correspondencia exacta entre docs y dist. Se cubren precios alterados, límites, selección y adición completa de paquetes personalizados, consultas, Unicode, privacidad, CSP, enlaces y las variantes de HTML mal formado que originaron las alertas anteriores. El HTML se interpreta con parse5 sin eliminar comentarios ni usar expresiones regulares para reconocer scripts.

El workflow de GitHub revisa los archivos entregados antes de ejecutar el build y después comprueba que el build no modifica la publicación. CodeQL analiza JavaScript en otro trabajo con permisos limitados. El trabajo falla si su salida SARIF contiene cualquier hallazgo o no puede verificarse; terminar de ejecutar CodeQL no basta para aprobar. Dependabot propone actualizaciones de acciones y herramientas npm. Para impedir una fusión hay que exigir ambos trabajos en la protección de `main`, que requiere acceso de administrador. Detalles en [SECURITY.md](SECURITY.md), [Seguridad en GitHub](notes/seguridad-github.md) y [Auditoría de corrección](notes/auditoria-seguridad-20260909.md).

Se verificaron en navegador la ficha e imagen de plátano macho, la compra de dos bolsas de 100 g (subtotal $98), las opciones de cherry y sus enlaces de consulta tanto en tarjeta como en ficha, y la ficha de cherry a 390 px de ancho. Las comprobaciones de WhatsApp revisan el enlace preparado; no envían mensajes.

## Datos comerciales

Se conservan los precios existentes de los productos que siguen en catálogo, incluido el plátano al cambiar a macho. Los precios heredados de incorporaciones anteriores son propuestas de lanzamiento, no márgenes calculados. Frutas de temporada, cherry y ajo quedan por cotizar. El paquete de 3 bolsas de 50 g contiene fresa con chile, plátano macho y manzana con canela: $99 frente a $113 por separado, ahorro de $14 calculado desde el catálogo. No se ofrecen descuentos mayoristas automáticos.

La viabilidad técnica inicial del ajo, los límites de la evaluación del equipo Desali de 16 bandejas y el costeo por tanda están documentados en [Producción y temporada](notes/produccion-y-temporada.md). La rentabilidad requiere medir insumos, merma, energía, trabajo, empaque y demanda.

La página no afirma vidas de anaquel, ingredientes completos, propiedades de salud o existencias de los productos nuevos sin respaldo. El cliente puede consultar ingredientes y alérgenos y debe seguir el etiquetado del lote. Antes de operar estos productos, el negocio debe cerrar formulaciones, costos, etiquetado y fechas de conservación.

Mercado Pago y el campo de cupones sin funcionalidad se retiraron del flujo visible. Transferencia y contra entrega regional se acuerdan al confirmar la solicitud. El carrito solo guarda identificadores, variantes, cantidades y precios de catálogo; los datos de contacto no se guardan en localStorage.

Las consultas de cobertura solicitan únicamente ciudad, estado y código postal. Para un pedido se solicita el domicilio necesario para la entrega; al abrir WhatsApp, los datos se comparten con ese servicio mediante el enlace preparado. El negocio debe verificar importes y pagos por su cuenta: los cálculos del navegador no autentican pedidos.

## Imágenes

Los 27 artículos tienen una imagen de estudio dedicada generada con ImageGen, con fondo marfil, iluminación suave y textura realista del alimento deshidratado. Las fichas y tarjetas comparten la foto correcta de cada artículo; no utilizan recortes de las antiguas imágenes por categoría. Las imágenes se identifican como ilustrativas y no sustituyen fotografías del producto final. La ficha de cherry aclara que la fotografía representa la opción natural.

Cada imagen se publica en `dist/assets/products/{id}-studio.webp` (1,000 × 1,000) y en una versión `{id}-studio-480.webp` (480 × 480), sincronizadas con `docs/assets/products/`. Las 54 imágenes suman aproximadamente 5 MB; la tienda elige el tamaño según el espacio de visualización. Los originales PNG se conservaron fuera de la carpeta pública, en `../asset-work/studio-originals/`. Los recursos editoriales anteriores se mantienen para cabeceras y compatibilidad.

Inventario, fuentes y alcance de la información alimentaria: [Catálogo, fotografías e ingredientes](notes/catalogo-fotografias-ingredientes.md). Prompts exactos y método de generación: [Prompts de las 27 fotografías](notes/fotografias-prompts.json).

## Proponer cambios

Trabajar en una rama nueva y abrir una propuesta hacia `main` con `dist` y `docs` sincronizados. Antes de la revisión, ejecutar el build y las comprobaciones descritas arriba. La propuesta debe incluir la validación de las fichas y explicar qué datos comerciales o de etiquetado siguen pendientes de confirmar. La publicación de GitHub Pages utiliza la carpeta `docs` de `main`.
