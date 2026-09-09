# Corregir alertas de CodeQL y exigir resultados sin hallazgos

La primera entrega terminó su análisis en verde aunque CodeQL señaló dos problemas en las pruebas de HTML: cierres de script no reconocidos y eliminación incompleta de comentarios. Esta corrección analiza el documento original con parse5 y comprueba variantes mal formadas que los navegadores aceptan. No desactiva reglas ni excluye las pruebas del análisis.

Se añade un bloqueo explícito después de CodeQL. Revisa el SARIF y hace fallar el trabajo ante cualquier hallazgo o salida ausente, inválida o incompleta. El resumen indica regla, archivo, nivel y severidad; terminar la acción de análisis ya no basta para aprobar el trabajo. Para impedir una fusión se deben exigir los dos trabajos en la protección de main, que requiere administración.

La nueva auditoría detectó además un recorte de emojis que podía provocar URIError al preparar WhatsApp. Los límites ahora conservan Unicode válido. La herramienta HTML solo se instala para verificar el proyecto, con versiones e integridad en el lockfile y sin ejecutar scripts de instalación; no forma parte de la tienda publicada. Se actualizan las versiones de recursos y la copia exacta dist/docs.

## Validación

- 17 pruebas de comercio, 13 de seguridad y 6 grupos de comprobaciones SARIF aprobados; sintaxis, referencias y publicación sincronizada.
- Casos que reproducen las dos alertas; casos de emojis y unidades Unicode sueltas; pruebas del bloqueo con cero/un hallazgo, salida ausente o inválida y ejecución fallida.
- 6 comprobaciones CSP aprobadas en navegador, con eventos reales de bloqueo. Carrito, total nacional, texto especial, límites de notas y privacidad de cobertura revisados sin enviar mensajes. Consola de la tienda sin errores.
- npm audit: cero vulnerabilidades conocidas en las dos dependencias de desarrollo. Workflow validado con actionlint.
- Se comprobará el resultado real de CodeQL en esta propuesta: el bloqueo exige análisis completo y cero hallazgos.

Informe y límites: [auditoría de corrección](notes/auditoria-seguridad-20260909.md). La configuración administrativa de cuentas, protección de ramas y cabeceras del alojamiento sigue pendiente; esta propuesta no modifica DNS ni fusiona cambios automáticamente.
