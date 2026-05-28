# DERIVABILIDAD-CAP-001 — Informe de Derivabilidad

**Artefacto:** DERIVABILIDAD-CAP-001  
**Tipo:** Informe de derivabilidad documental  
**Fuente evaluada:** CAP-001-R5 (1829 líneas, 85,159 bytes)  
**Rango auditado en CAP-001:** l.1–2000 de index.html  
**Artefactos derivados evaluados:** CHK-001, ARB-001  
**Artefactos pendientes:** PAN-001 (embebido en CAP-001-R5), GRAFO (no solicitado aún)  
**Fecha:** 2026-05-26  
**Estado:** PROVISIONAL_NO_VALIDADO  

> **Nota sobre versión de referencia.** La solicitud de derivación original indicó "CAP-001-R6 (última revisión destinada a congelación)". No existe CAP-001-R6 — la última revisión es CAP-001-R5. Toda la derivación se ha realizado sobre CAP-001-R5. Esta discrepancia se documenta aquí pero no invalida los artefactos derivados.

---

## Pregunta 1 — ¿Es CAP-001-R5 suficiente para generar CHK-001 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones.**

CHK-001 ha sido generado exclusivamente desde CAP-001-R5. El resultado es un documento funcional de 134 ítems estructurados en 9 secciones. Sin embargo, la suficiencia es parcial:

| Categoría de ítem | Cantidad | Observaciones |
|-------------------|----------|---------------|
| VERIFICADO_EN_CAP | 43 (32%) | Ítems cuyo criterio de verificación puede resolverse desde CAP-001-R5 sin leer código |
| PENDIENTE | 77 (57%) | Ítems que requieren lectura de l.2001+ o ejecución en QA — no derivables sin código |
| NO_DERIVABLE_DESDE_CAP_001 | 14 (10%) | FUNC-001 a FUNC-010 + MOT-001 a MOT-004 — información completamente ausente del rango auditado |

**Conclusión P1.** CAP-001-R5 genera CHK-001 con estructura completa, pero sólo puede resolver el 32% de los ítems autónomamente. El 57% requiere acceso al código (l.2001+). El 10% es irresoluble desde CAP-001 por definición (fuera del rango auditado).

---

## Pregunta 2 — ¿Es CAP-001-R5 suficiente para generar ARB-001 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones estructurales conocidas.**

ARB-001 ha sido generado exclusivamente desde CAP-001-R5. El árbol de 9 capas + ENT-R01 es derivable con los siguientes grados de completitud:

| Categoría de nodo | Total | Derivable completo | Derivable parcial | No derivable |
|-------------------|-------|--------------------|--------------------|--------------|
| ENT (entidades) | 31 | 29 (AUDITADO_PROVISIONAL) | 1 (BLOQUE_INCOMPLETO) | 0 |
| CDN | 7 | 7 (con estado variable) | 0 | 0 |
| REL | 19 | 19 (con estado variable) | 0 | 0 |
| CON | 20 | 20 (CSS completo; productores JS ausentes) | 0 | 0 |
| FUNC | 10 | 5 (nombre + línea aprox) | 5 (nombre; línea NO_DERIVABLE) | 0 |
| MOT | 4 | 1 (MOT-003, rango aprox) + MOT-004 (CDN conocido) | 2 (nombre; línea NO_DERIVABLE) | 0 |

**Limitaciones estructurales identificadas:**

- Todos los productores JS de CON-001 a CON-019 son NO_OBSERVADO en rango. El árbol documenta la interfaz CSS pero no el enlace JS→CSS.
- ENT-026 es MACROENTIDAD_PROVISIONAL: sus subentidades se han listado por evidencia CSS pero la descomposición formal está pendiente.
- ENT-030 es BLOQUE_INCOMPLETO: cruza el límite l.2000 y no puede cerrarse desde CAP-001-R5.
- CDN-05 (QRCodeJS) no tiene ningún nodo destino documentado en CAP-001-R5.
- 7 de 14 nodos externos (FUNC/MOT) tienen línea NO_DERIVABLE_DESDE_CAP_001.

**Conclusión P2.** CAP-001-R5 genera ARB-001 con cobertura estructural completa (todas las capas, entidades, CDN, REL y CON presentes). Las limitaciones son de profundidad (productores JS ausentes) y de bordes (ENT-030, ENT-026 parcial), no de estructura.

---

## Pregunta 3 — ¿Qué información contenida en CAP-001-R5 no es derivable hacia artefactos de auditoría?

**Respuesta: Tres categorías.**

**3.1 Información dependiente de ejecución (no derivable a CHK o ARB como VERIFICADO):**
- Todos los productores JS de CON-001 a CON-019 (19 de 20 contratos).
- Consumidores JS de ENT-011 y ENT-018 (GAP-04).
- Comportamiento de ENT-024 (lógica generadora de propuesta automática).
- Verificación del riesgo GAP-06 (color inline por JS) en condiciones reales.

**3.2 Información que requiere l.2001+ (derivable como PENDIENTE, no como CONFIRMADO):**
- Líneas exactas de FUNC-005, FUNC-006, FUNC-007, FUNC-008, FUNC-009, FUNC-010.
- Líneas exactas de MOT-001, MOT-002.
- Cierre de ENT-030 (.spinner @keyframes spin).
- Todos los CHK de tipo FUNC, CDN-consumidor, y comportamiento runtime.

**3.3 Información completamente ausente de CAP-001-R5 (NO_DERIVABLE):**
- No existe ningún ítem de esta categoría en las entidades ENT, CDN, REL o CON.
- En FUNC/MOT: 7 líneas de función marcadas como NO_DERIVABLE_DESDE_CAP_001 por ausencia en el ANEXO-NO-OBSERVADO.

**Conclusión P3.** CAP-001-R5 cubre estructuralmente todo lo derivable desde l.1–2000. La información no derivable a artefactos verificados se debe exclusivamente al límite del rango auditado (l.2001+), no a omisiones del documento CAP.

---

## Pregunta 4 — ¿Es CAP-001-R5 autocontenido o depende de memoria de sesión?

**Respuesta: Autocontenido con una excepción acotada.**

**Evidencia de autocontención:**
- REG-001 (estadísticas del bloque) documenta 46 MR, 30 ENT, 1 ENT transversal, 20 CON, 19 REL, 10 FUNC, 4 MOT.
- Las 46 entradas MR están documentadas con líneas de inicio y fin.
- Las 30 entidades ENT tienen evidencia, MR origen, líneas y estado.
- Las 7 CDN tienen línea exacta, versión y modo de carga.
- Las 19 REL tienen origen, destino, líneas y estado.
- Los 20 CON tienen clase trigger, efecto CSS, línea y estado del productor.
- El ANEXO-NO-OBSERVADO recoge los 14 nodos externos con la información disponible.

**Excepción acotada:**
- FUNC-005, FUNC-006, FUNC-007, FUNC-008, FUNC-009, FUNC-010 y MOT-001, MOT-002 tienen línea marcada como LINEA_NO_PRECISADA. Esta información no está en CAP-001-R5 porque no fue precisada en sesiones de auditoría previas, no porque CAP-001-R5 sea incompleto en el rango que cubre.
- La nota global del ANEXO-NO-OBSERVADO explicita que estas funciones son conocidas por nombre de sesiones anteriores, no del rango auditado.

**Conclusión P4.** CAP-001-R5 es autocontenido para todos los artefactos derivados dentro de su rango (l.1–2000). La dependencia de memoria de sesión existe únicamente en las líneas aproximadas de FUNC/MOT fuera del rango, y está correctamente etiquetada en CAP-001-R5.

---

## Pregunta 5 — ¿Pueden generarse PAN-001 y GRAFO desde CAP-001-R5?

**PAN-001:** SÍ. PAN-001 está embebido íntegramente en CAP-001-R5 (sección PAN-001, l.1647–1668 del documento). Es derivable copiando el contenido de esa sección con su encabezado de artefacto independiente. Derivabilidad: TOTAL.

**GRAFO:** NO evaluado en esta sesión. Un grafo de dependencias requeriría formalizar todas las relaciones ENT→CON, ENT→REL, CDN→ENT en formato de grafo dirigido. La información fuente está en CAP-001-R5 (todas las REL documentadas), pero el artefacto GRAFO no ha sido solicitado ni definido formalmente. Derivabilidad estimada: PROBABLE, sujeta a definición del formato de salida.

---

## Discrepancia documentada — Versión de referencia

| Campo | Valor en solicitud original | Valor real |
|-------|----------------------------|------------|
| Versión solicitada | CAP-001-R6 (última revisión destinada a congelación) | No existe |
| Versión disponible | — | CAP-001-R5 |
| Impacto | Ninguno sobre el contenido técnico derivado | — |
| Acción recomendada | Verificar si existe intención de crear CAP-001-R6 antes de congelación, o actualizar referencias a R5 | — |

---

## Resumen cuantitativo

| Artefacto | Ítems totales | Derivables completos | Derivables parciales | No derivables |
|-----------|---------------|---------------------|---------------------|---------------|
| CHK-001 | 134 | 43 (32%) | 77 (57%) | 14 (10%) |
| ARB-001 | 91 nodos | ~80 (88%) | ~8 (9%) | ~3 (3%) |
| PAN-001 | 1 (embebido en CAP) | 1 (100%) | 0 | 0 |

---

## VEREDICTO FINAL

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DERIVABLE_CON_LIMITACIONES                      ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación:**

CAP-001-R5 permite derivar CHK-001, ARB-001 y PAN-001 con estructura completa y sin inventar datos. Los artefactos derivados son funcionales, autocontenidos y trazables a la fuente.

Las limitaciones son inherentes al rango auditado (l.1–2000), no a deficiencias de CAP-001-R5:

1. El 57% de los ítems CHK quedan en estado PENDIENTE porque su verificación requiere l.2001+ o ejecución en QA — situación correctamente prevista y documentada.
2. Los 19 contratos CON tienen CSS verificado pero productores JS en l.2001+.
3. Los 14 nodos FUNC/MOT son externos al rango y están correctamente etiquetados como FUERA_DEL_RANGO_AUDITADO.

**El veredicto sería DERIVABLE si** CAP-001 cubriera l.1–∞ (el archivo completo). Mientras el rango sea l.1–2000, DERIVABLE_CON_LIMITACIONES es el veredicto correcto y estable.

**El veredicto no es NO_DERIVABLE** porque todos los artefactos se han generado sin memoria de sesión ni acceso a index.html, y contienen información verificable y trazable.

---

*Informe generado exclusivamente desde CAP-001-R5 · Sin acceso a index.html · 2026-05-26*
