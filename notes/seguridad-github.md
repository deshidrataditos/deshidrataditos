# Controles de seguridad en GitHub

Configuración preparada el 9 de septiembre de 2026 para el repositorio público `deshidrataditos/deshidrataditos`. Estos archivos definen revisiones; no publican la tienda ni configuran por sí solos la protección de `main`.

## Revisiones incluidas

- El workflow **Seguridad y calidad** revisa los pushes y los pull requests dirigidos a `main`. Los pushes de `dependabot/**` se excluyen porque sus PR ya se revisan y el evento `push` puede impedir que su token publique resultados de CodeQL.
- **Verificar tienda** ejecuta `node scripts/check.mjs` antes de preparar el sitio. Esto detecta una carpeta `docs` desactualizada; después ejecuta la preparación y exige que no produzca diferencias en `dist` o `docs`.
- **Analizar JavaScript con CodeQL** analiza `dist`, `scripts` y `tests` con consultas de seguridad ampliadas. Se evita analizar de nuevo la copia idéntica de `docs`. El análisis no ejecuta la aplicación ni necesita instalar dependencias.
- La verificación tiene únicamente permiso de lectura del código. Solo el trabajo de CodeQL recibe `security-events: write`, necesario para registrar sus resultados. Ningún trabajo puede publicar, modificar archivos remotos o administrar el repositorio. No se conservan credenciales en el checkout ni se usa `pull_request_target`.
- Se utiliza Node.js 24, que está en soporte LTS activo en la fecha de esta revisión, con el último parche disponible. El proyecto no tiene dependencias npm: no se añade una instalación ni una auditoría de paquetes vacía.
- Las acciones se fijan a identificadores completos de commits de sus repositorios oficiales. Dependabot revisará sus versiones mensualmente cuando esta configuración esté en la rama predeterminada; las actualizaciones se proponen mediante PR y no se fusionan automáticamente.

## Aplicación en el repositorio

1. Después de que el workflow se ejecute correctamente en GitHub, exigir el control **Verificar tienda** en la protección o ruleset de `main`, con la rama actualizada antes de fusionar. Exigir PR, bloquear force pushes y la eliminación de la rama. Una revisión de otra persona solo es útil si hay un segundo colaborador disponible; el propietario no puede aprobar su propio PR.
2. Verificar que CodeQL use configuración avanzada y que no exista un análisis predeterminado duplicado. Revisar los resultados en **Security → Code scanning**. Que el trabajo termine correctamente significa que el análisis se realizó: no sustituye la revisión de sus alertas. Si está disponible, configurar protección de fusión por alertas de CodeQL de severidad alta o crítica.
3. Mantener el permiso predeterminado de Actions en lectura y la aprobación para ejecutar workflows de contribuciones externas. GitHub reduce a lectura los tokens de PR de forks; la subida de resultados de CodeQL mediante `pull_request` cuenta con el tratamiento específico documentado por GitHub. No habilitar tokens de escritura para forks ni añadir secretos para resolverlo.
4. Revisar las propuestas de Dependabot y las alertas de seguridad. La revisión mensual no es un servicio de vigilancia continuo ni garantiza detectar toda vulnerabilidad. Si el repositorio pasa a privado, revisar la disponibilidad de GitHub Code Security y los requisitos de permisos antes de mantener CodeQL obligatorio.
5. Activar o confirmar doble autenticación y métodos de recuperación en las cuentas de GitHub, dominio y servicio de DNS. Esto se gestiona en las cuentas, no en el código de la tienda.

## Versiones verificadas

Los SHA se resolvieron mediante la API oficial de GitHub contra las etiquetas de lanzamiento de los repositorios originales:

| Acción | Versión | Commit |
| --- | --- | --- |
| [actions/checkout](https://github.com/actions/checkout/releases/tag/v7.0.1) | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [actions/setup-node](https://github.com/actions/setup-node/releases/tag/v7.0.0) | v7.0.0 | `820762786026740c76f36085b0efc47a31fe5020` |
| [github/codeql-action](https://github.com/github/codeql-action/releases/tag/v4.37.9) | v4.37.9 | `cdf488f595d80d6e07e03d4674febd5ab45fa938` |

Referencias: [ciclo de soporte de Node.js](https://github.com/nodejs/Release#release-schedule), [permisos de CodeQL](https://github.com/github/codeql-action#workflow-permissions), [configuración del análisis](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options), [CodeQL y permisos de Dependabot](https://docs.github.com/en/code-security/reference/code-scanning/troubleshoot-analysis-errors/resource-not-accessible), [permisos de workflows y forks](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions), [actualizaciones de Actions con Dependabot](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions).
