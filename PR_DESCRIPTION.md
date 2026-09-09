# Reforzar seguridad del catálogo y reducir datos de cotización

La tienda limitaba cantidades y reconstruía precios, pero no tenía una política de contenido y pedía el domicilio completo para consultar cobertura. Esta entrega añade CSP antes de cargar recursos y reduce esa consulta a ciudad, estado y código postal. Mantiene el pedido revisable por WhatsApp.

Los scripts se limitan al propio sitio, sin ejecución inline ni eval. Se bloquean conexiones de scripts, objetos, frames, workers y envíos nativos de formularios; fuentes y estilos externos se restringen a Google Fonts. Las fotos usan clases de posición y rutas de assets verificadas. Los enlaces externos no conservan acceso a la ventana de origen ni transmiten el referente.

La lectura del carrito limita tamaño y tolera contenido inválido. Los campos del mensaje limitan longitud y eliminan controles y saltos que puedan aparentar líneas de importes. Los enlaces preparados se invalidan al editar, restablecer o abandonar la página. Se aclara cuándo se comparten datos con WhatsApp y que el negocio confirma importes y pago.

## Validación

- 17 pruebas de comercio y 10 de seguridad, sintaxis y sincronización exacta de dist/docs.
- Navegador: 6 comprobaciones de CSP aprobadas (script local permitido; scripts inline, manejadores HTML, eval, Function y conexiones de scripts bloqueados).
- Consulta de cobertura limitada a ciudad, estado y C.P.; sus enlaces y los del pedido se descartan al editar. Carrito y pedido de 2 presentaciones de plátano macho de 100 g: subtotal $98 y total nacional $298. Texto especial codificado, fotos cargadas con sus encuadres y consola sin errores. No se enviaron mensajes.
- Workflow validado con actionlint. Verificar tienda comprueba los archivos entregados antes del build y exige que la preparación no cambie la publicación.
- CodeQL para JavaScript separado del trabajo de pruebas; acciones oficiales fijadas a SHA y con permisos mínimos. Dependabot propone actualizaciones de acciones.

## Alcance

Los controles se entregan en una rama y no modifican la configuración de cuentas, DNS o publicación. La conexión de GitHub carece de acceso administrativo para verificar o exigir protección de main. El administrador debe exigir Verificar tienda y revisar CodeQL, doble autenticación, dominio y detección de secretos.

El HTML no puede activar frame-ancestors, X-Frame-Options, HSTS o nosniff: requieren cabeceras reales en la capa de publicación. No se añaden etiquetas meta o archivos que aparenten activar esos controles. Los importes del navegador siguen siendo orientativos; la confirmación manual del negocio continúa siendo necesaria.
