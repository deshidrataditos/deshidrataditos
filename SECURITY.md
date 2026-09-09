# Seguridad de Deshidrataditos

La tienda es un catálogo estático. Las solicitudes se revisan por WhatsApp; la página no verifica transferencias, procesa tarjetas ni autentica pedidos.

## Comunicar un problema

Contacta al negocio mediante [su WhatsApp oficial](https://wa.me/523931173611) con la URL afectada y una descripción breve. No incluyas contraseñas, códigos bancarios, tokens ni datos de clientes. Evita publicar detalles de un problema sin corregir en un issue público. Este canal no promete un plazo de atención ni constituye un programa de recompensas.

## Controles del sitio

- Política CSP en el HTML, antes de cargar recursos: scripts del propio sitio; sin scripts inline, manejadores HTML o evaluación de texto como código. Bloquea objetos, subdocumentos, workers, conexiones de scripts y envíos nativos de formularios.
- Hojas de estilo locales y Google Fonts en orígenes explícitos. Las posiciones de las fotos usan clases CSS; no se generan estilos dentro del HTML. Las imágenes del catálogo se limitan a archivos de `assets`.
- Política de referente `no-referrer` y enlaces externos con `noopener noreferrer`. Los enlaces de WhatsApp siguen compartiendo el texto que contienen con WhatsApp al abrirlos; estas medidas no ocultan ese texto al destinatario.
- Cotizaciones de cobertura con código postal, ciudad y estado. Los datos de contacto no se guardan en el carrito. Los enlaces preparados se invalidan al editar formularios, restablecerlos o abandonar la página.
- Lectura acotada del carrito persistido, precios reconstruidos desde el catálogo y cantidades limitadas. Texto de contacto acotado y sin separadores o controles que aparenten líneas independientes del resumen.
- Pruebas de seguridad y comercio en GitHub, análisis CodeQL con bloqueo explícito ante hallazgos o resultados incompletos y propuestas de actualización de acciones y herramientas de pruebas. El HTML se inspecciona con un parser HTML5; los límites de contacto conservan Unicode válido. Consulta [la configuración](notes/seguridad-github.md) y [la auditoría de corrección](notes/auditoria-seguridad-20260909.md).

## Límites operativos

El navegador y el mensaje de WhatsApp están bajo control del comprador. El negocio debe cotejar productos, presentaciones, cantidades, envío y total con su catálogo antes de confirmar. La recepción del dinero se comprueba en la cuenta del negocio; una captura de pantalla o el texto del pedido no acreditan el pago. Si se automatizan cobros, los importes y la confirmación del proveedor de pagos deben validarse en un servidor.

La CSP del HTML no sustituye las cabeceras del alojamiento. En particular, `frame-ancestors`, `X-Frame-Options`, HSTS y `X-Content-Type-Options` no se implementan mediante etiquetas meta. Esta entrega no los declara activos ni añade un archivo de cabeceras que GitHub Pages no vaya a aplicar. Su configuración requiere una capa de publicación que permita esas cabeceras y una comprobación posterior del sitio servido.

La protección de `main`, la verificación del dominio, la detección de secretos y la doble autenticación requieren configuración administrativa. La conexión disponible rechazó la consulta de protección de ramas con `403 Resource not accessible by integration`; no se han cambiado esas opciones ni las credenciales de las cuentas.

Referencias: [CSP y alcance de la etiqueta meta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors), [lógica de negocio y datos del cliente](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html).
