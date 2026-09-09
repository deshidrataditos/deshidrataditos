# Auditoría de corrección — 9 de septiembre de 2026

Se revisó de nuevo la entrega de seguridad ya integrada mediante el PR #4, partiendo de `dee6c9847b0f4ad5dd8cceb985b60312fd1406f3`. La revisión cubre el código de la tienda, sus pruebas, la publicación estática, las dependencias de verificación y los resultados de CodeQL. No es una prueba de intrusión contra infraestructura ni una certificación de ausencia de vulnerabilidades.

## Hallazgos y correcciones

| Hallazgo | Efecto observado | Corrección |
| --- | --- | --- |
| CodeQL `js/bad-tag-filter`, alerta #1, mostrada como High | El test no reconocía cierres de script que el navegador acepta, como `</script foo="bar">`. | Se reemplazó la búsqueda por expresiones regulares por un parser HTML5, parse5. Pruebas con cierres mal formados exigen detectar el script y su contenido. |
| CodeQL `js/incomplete-multi-character-sanitization`, alerta #2 | Eliminar comentarios mediante reemplazos puede crear texto distinto del que interpreta el navegador. | Se analiza el HTML original; los comentarios se interpretan como nodos. Se cubren comentarios anidados aparentes, cierre `--!>` y entidades en atributos. |
| Recorte de Unicode en los campos de contacto | Un emoji que cruza el límite podía quedar incompleto y provocar `URIError` al preparar WhatsApp. Reproducido en la función de limpieza. | Se conservan caracteres completos dentro del límite UTF-16 y se reemplazan unidades sueltas inválidas. Pruebas de límites de 5 a 500 unidades y preparación real del enlace. |
| Confusión entre análisis terminado y análisis sin hallazgos | El trabajo de CodeQL había terminado en verde con dos alertas. | Un paso posterior verifica el SARIF y falla ante cualquier resultado, archivo ausente o inválido, error o análisis incompleto. No se excluyen tests ni se suprimen reglas. |

Las dos alertas originales están en las pruebas y no demuestran una explotación de la tienda. Se corrigieron las limitaciones del verificador en lugar de ocultar los avisos.

## Evidencia local

- 17 pruebas de comercio, 13 de seguridad y 6 grupos de comprobaciones del bloqueo SARIF aprobados. Los casos de CLI demuestran salida correcta con cero hallazgos y salida de error con un hallazgo; se prueban también resultados vacíos, inválidos y análisis fallidos.
- Sintaxis, rutas, recursos y correspondencia exacta de los 20 archivos de `dist` con `docs` verificadas. No se publican dependencias ni herramientas de pruebas. No se encontraron enlaces simbólicos ni coincidencias de los patrones de claves privadas y tokens examinados en esas carpetas; esta búsqueda acotada no sustituye la detección de secretos de GitHub.
- Instalación reproducible mediante `npm ci --ignore-scripts`. parse5 8.0.1 y entities 8.1.0 quedan fijados con integridad en el lockfile, únicamente para desarrollo. `npm audit` informó cero vulnerabilidades conocidas en estas dependencias en la fecha de revisión.
- Workflow comprobado con actionlint. Se conservan permisos mínimos y acciones oficiales fijadas a SHA. Dependabot revisa acciones y dependencias npm.

## Comprobaciones del navegador

- Se repitieron las 6 comprobaciones de CSP con la política literal del sitio: script local permitido; script inline, manejador inline, eval, Function y fetch bloqueados, con eventos de bloqueo del navegador.
- Carrito recuperado con 2 bolsas de plátano macho de 100 g: subtotal $98, envío nacional $200 y total $298.
- Nombre con caracteres especiales y emoji conservado como texto. Notas con un emoji al cruzar el límite preparan el enlace sin errores. Una etiqueta HTML con manejador de evento en notas no crea elementos; un salto seguido de un importe falso permanece dentro de la línea de notas y el total calculado conserva su propia línea.
- Editar un pedido o una consulta invalida el enlace anterior. La cobertura comparte únicamente ciudad, estado y C.P. No se enviaron mensajes ni solicitudes al negocio.
- La consola de la tienda no registró errores durante estos recorridos. El fixture de bloqueo, separado de la tienda y fuera del repositorio, genera deliberadamente eventos CSP.

## Alcance restante y cierre

La consulta pasiva al dominio devolvió HTTP 200 y CSP en el HTML. GitHub Pages no entregó cabeceras CSP, X-Frame-Options, HSTS, X-Content-Type-Options o Referrer-Policy en esa consulta. La política de referente está en el HTML. La protección contra incrustación y otras cabeceras siguen requiriendo una capa de alojamiento que las permita; no se declaran activas.

El negocio continúa verificando catálogo, entrega e ingreso del pago manualmente. El navegador y el mensaje de WhatsApp no autentican importes. La protección de ramas y cuentas requiere administración. Para impedir fusiones con fallos se deben exigir **Verificar tienda** y **Analizar JavaScript con CodeQL** en `main`; el workflow por sí solo no configura esa exigencia.

El cierre de esta corrección exige revisar en la propuesta de GitHub la salida real del nuevo bloqueo: análisis completo y `findings: []`, además de las pruebas aprobadas. El resultado remoto y el commit auditado se consignan en la propuesta. Las alertas históricas de `main` pueden seguir abiertas hasta integrar y analizar la corrección.

Referencias: [alerta #1](https://github.com/deshidrataditos/deshidrataditos/security/code-scanning/1), [alerta #2](https://github.com/deshidrataditos/deshidrataditos/security/code-scanning/2), [regla de etiquetas HTML](https://codeql.github.com/codeql-query-help/javascript/js-bad-tag-filter/), [API de parse5](https://parse5.js.org/functions/parse5.parse.html), [controles y límites del repositorio](seguridad-github.md).
