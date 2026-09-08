# Ajustar catálogo a frutas de temporada, plátano macho y nuevas opciones de cocina

La oferta deja de depender de piña con chile y mango. Se retiran esos productos, el rollito de mango y el mix que los contenía; una ficha de frutas de temporada permite consultar la selección disponible. La fresa con chile se mantiene y el plátano pasa a macho deshidratado con una imagen propia inspirada en la referencia del negocio.

En sazonadores y cocina se incorporan tomate cherry deshidratado, seleccionable natural o con finas hierbas, y ajo deshidratado en hojuelas. Los tres productos sin precio confirmado preparan consultas por WhatsApp conservando la opción elegida; no se agregan al carrito ni se muestran como gratuitos. Al ordenar por precio, aparecen después de los artículos con importe definido.

El paquete degustación contiene ahora fresa con chile, plátano macho y manzana con canela: tres bolsas de 50 g por $99. El ahorro se recalcula contra $113 por separado. Los productos retirados se descartan de carritos guardados.

## Validación

- Build de dist a docs y 17 pruebas de comercio aprobadas, con verificación de sintaxis, referencias HTML, navegación, imágenes y correspondencia entre carpetas.
- Comprobación en navegador de la nueva imagen, dos bolsas de plátano macho de 100 g con subtotal de $98, y enlaces de cherry que conservan Natural o Finas hierbas desde tarjeta y ficha.
- Ficha de cherry revisada a 390 px de ancho. No se enviaron mensajes ni pedidos durante la validación.
- Versiones de recursos actualizadas conjuntamente; se conserva el dominio ya configurado en GitHub y se incluye CNAME en la fuente para mantener la sincronización.

## Datos pendientes de operación

La fruta actual, presentaciones y precios de temporada, cherry y ajo se confirman por consulta. El catálogo no calcula cosechas o existencias automáticamente. El ajo es una opción técnicamente viable, con rentabilidad pendiente de costos y rendimiento de una tanda real. Se incluye una nota interna con fuentes y costeo para el equipo Desali de 16 bandejas, sin atribuirle una capacidad de producción no medida.

La imagen de plátano macho es ilustrativa, generada con ImageGen y optimizada a JPEG de 1,000 × 1,000 px. Se incluyen el prompt y el método. Esta entrega se sube a una rama separada; main y la web publicada no se actualizan automáticamente.
