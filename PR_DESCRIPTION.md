# Ampliar catálogo y mejorar descubrimiento y pedidos de Deshidrataditos

El catálogo incorpora 12 artículos sobre pedido, para un total de 28: naranja, limón y toronja en rodajas; tisanas de jamaica–piña y manzana–canela–naranja; mix tropical; dos sazonadores; dos rollitos; jitomate con hierbas y paquete degustación.

Los clientes pueden buscar y filtrar productos, comparar presentaciones por 100 g, consultar usos y armar su pedido. Las cotizaciones para cafeterías, bares, restaurantes y tiendas tienen un formulario propio. Las solicitudes se preparan como un mensaje revisable; el usuario decide abrir WhatsApp y enviarlo.

## Cambios relevantes

- Nueva portada, acceso al catálogo completo y colecciones de cítricos, cocina y paquetes, conservando las rutas anteriores y la identidad visual.
- Variantes de 25 g, 50 g, 60 g, 100 g, 120 g y 250 g según el producto; paquetes con peso y contenido explícitos.
- Precio por 100 g y ahorro del paquete derivados de los datos reales del catálogo.
- Carrito resistente a datos dañados o precios antiguos; normalización, límite de 99 unidades por variante y sincronización entre pestañas.
- Recomendaciones según afinidad de uso, excluyendo productos ya seleccionados.
- Envío nacional de $200 y gratuito desde $2,000; costo regional pendiente cuando corresponde, con etiqueta clara del total sin entrega.
- Contra entrega deshabilitada para envío nacional. Se retiran Mercado Pago no conectado y el cupón inactivo.
- Se incluye el correo opcional y las notas en el mensaje de pedido; los datos personales no se almacenan en el carrito.
- Carrito con gestión del foco y teclado, diálogo de producto nativo, estados vacíos, avisos accesibles e imágenes ilustrativas identificadas.
- Se retiran afirmaciones de vida de anaquel no confirmadas del catálogo.
- Fuentes de productos y reglas separadas del controlador de interfaz; build reproducible sin dependencias y docs/dist sincronizados.

## Validación

- `node scripts/build.mjs`: 18 archivos públicos sincronizados.
- `node scripts/check.mjs`: sintaxis correcta, 12 pruebas de comercio aprobadas y revisión de IDs, enlaces internos, archivos, imágenes y sincronización.
- Vista previa HTTP local: respuesta 200 para la página principal.
- No se realizaron pruebas visuales ni de interacción en navegador; tampoco se enviaron pedidos o cotizaciones ni se procesaron pagos.

## Alcance comercial

Los precios de los productos nuevos son propuestas de lanzamiento y necesitan contrastarse con los costos de producción. Todos figuran sobre pedido; disponibilidad, ingredientes y preparación se confirman antes del pago. Las cotizaciones de volumen no prometen descuentos ni plazos automáticos. Las imágenes nuevas son editoriales generadas con IA, no fotografías del producto final.

La publicación continúa siendo estática en GitHub Pages, desde `/docs`. La entrega no contiene integraciones de pago, inventario en tiempo real ni almacenamiento de pedidos en servidor.
