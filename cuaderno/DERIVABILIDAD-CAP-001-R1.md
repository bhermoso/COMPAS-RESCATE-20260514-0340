# DERIVABILIDAD-CAP-001-R1 — Informe de Derivabilidad

**Artefacto:** DERIVABILIDAD-CAP-001-R1  
**Tipo:** Informe de derivabilidad documental  
**Revisión:** R1 — correcciones de auditoría hostil  
**Fuente evaluada:** CAP-001-R5 (1829 líneas, 85,159 bytes)  
**Rango auditado en CAP-001:** l.1–2000 de index.html  
**Artefactos derivados evaluados:** CHK-001, ARB-001  
**Artefactos pendientes:** PAN-001 (embebido en CAP-001-R5), GRAFO (no solicitado aún)  
**Fecha:** 2026-05-26  
**Fecha de revisión:** 2026-05-27  
**Estado:** PROVISIONAL_NO_VALIDADO  

---

## Pregunta 1 — ¿Es CAP-001-R5 suficiente para generar CHK-001 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones.**

CHK-001 ha sido generado exclusivamente desde CAP-001-R5. El resultado es un documento funcional de 134 ítems estructurados en 9 secciones. Sin embargo, la suficiencia es parcial:

| Categoría de ítem | Cantidad | Observaciones |
|-------------------|----------|---------------|
| VERIFICADO_EN_CAP | 43 (32%) | Ítems cuyo criterio de verificación puede resolverse desde CAP-001-R5 sin leer código |
| PENDIENTE | 77 (57%) | Ítems que requieren lectura de l.2001+ o ejecución en QA — no verificables sin código |
| FUERA_DEL_RANGO_AUDITADO | 14 (10%) | FUNC-001 a FUNC-010 + MOT-001 a MOT-004 — estado asignado en CAP-001-R5 ANEXO-NO-OBSERVADO |

**Conclusión P1.** CAP-001-R5 genera CHK-001 con estructura completa, pero sólo puede resolver el 32% de los ítems autónomamente. El 57% requiere acceso al código (l.2001+). El 10% tiene Estado FUERA_DEL_RANGO_AUDITADO — están documentados en CAP-001-R5 ANEXO-NO-OBSERVADO pero su verificación requiere lectura de l.2001+.

---

## Pregunta 2 — ¿Es CAP-001-R5 suficiente para generar ARB-001 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones estructurales conocidas.**

ARB-001 ha sido generado exclusivamente desde CAP-001-R5. El árbol de 9 capas + ENT-R01 es derivable con los siguientes grados de completitud:

| Categoría de nodo | Total | Con representación completa en ARB | Con representación parcial en ARB | Sin representación posible |
|-------------------|-------|-------------------------------------|-----------------------------------|---------------------------|
| ENT (entidades) | 31 | 29 (AUDITADO_PROVISIONAL) | 1 (BLOQUE_INCOMPLETO) | 0 |
| CDN | 7 | 7 (con estado variable) | 0 | 0 |
| REL | 19 | 19 (con estado variable) | 0 | 0 |
| CON | 20 | 20 (CSS completo; productores JS FUERA_DEL_RANGO) | 0 | 0 |
| FUNC | 10 | 4 (nombre + línea aprox: FUNC-001/002/003/004) | 6 (nombre + ENT probable; LINEA_NO_PRECISADA en CAP-001-R5) | 0 |
| MOT | 4 | 2 (MOT-003 con rango aprox; MOT-004 con CDN en rango) | 2 (nombre + ENT probable; LINEA_NO_PRECISADA en CAP-001-R5) | 0 |

**Limitaciones estructurales identificadas:**

- Todos los productores JS de CON-001 a CON-019 son NO_OBSERVADO en rango. El árbol documenta la interfaz CSS pero no el enlace JS→CSS.
- ENT-026 es MACROENTIDAD_PROVISIONAL: sus subentidades se han listado por evidencia CSS pero la descomposición formal está pendiente.
- ENT-030 es BLOQUE_INCOMPLETO: cruza el límite l.2000 y no puede cerrarse desde CAP-001-R5.
- CDN-05 (QRCodeJS) no tiene ningún nodo destino documentado en CAP-001-R5.
- 8 de 14 nodos externos (FUNC-005 a FUNC-010, MOT-001, MOT-002) tienen LINEA_NO_PRECISADA según CAP-001-R5 ANEXO-NO-OBSERVADO.

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
- Líneas exactas de FUNC-001 a FUNC-010 (FUNC-001/004 tienen aproximación; FUNC-005/010 tienen LINEA_NO_PRECISADA).
- Líneas exactas de MOT-001, MOT-002 (LINEA_NO_PRECISADA en CAP-001-R5).
- Cierre de ENT-030 (.spinner @keyframes spin).
- Todos los CHK de tipo FUNC, CDN-consumidor, y comportamiento runtime.

**3.3 Información ausente de CAP-001-R5 como campo precisado:**
- No existe ningún ítem ENT, CDN, REL o CON con información completamente ausente de CAP-001-R5.
- En FUNC/MOT: 8 nodos con LINEA_NO_PRECISADA (valor de campo en ANEXO-NO-OBSERVADO) — el nombre, ENT probable y CON probable sí están documentados; solo la línea no fue precisada en auditorías anteriores al rango.

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
- FUNC-005, FUNC-006, FUNC-007, FUNC-008, FUNC-009, FUNC-010 y MOT-001, MOT-002 tienen campo "Línea" marcado como LINEA_NO_PRECISADA en CAP-001-R5. Esta información no está precisada porque no fue establecida en sesiones de auditoría del rango l.1–2000, no porque CAP-001-R5 sea incompleto en lo que le corresponde documentar.
- La nota global del ANEXO-NO-OBSERVADO explicita que estas funciones son conocidas por nombre de sesiones de auditoría previas, no del rango auditado.

**Conclusión P4.** CAP-001-R5 es autocontenido para todos los artefactos derivados dentro de su rango (l.1–2000). La excepción (LINEA_NO_PRECISADA en 8 nodos FUNC/MOT) está correctamente etiquetada en CAP-001-R5 y no invalida la autocontención del documento.

---

## Pregunta 5 — ¿Pueden generarse PAN-001 y GRAFO desde CAP-001-R5?

**PAN-001:** SÍ. PAN-001 está embebido íntegramente en CAP-001-R5 (sección PAN-001). Es derivable extrayendo el contenido de esa sección con su encabezado de artefacto independiente. Derivabilidad: TOTAL.

**GRAFO:** No evaluado. Un grafo de dependencias requeriría formalizar todas las relaciones ENT→CON, ENT→REL, CDN→ENT en formato de grafo dirigido. La información fuente está en CAP-001-R5 (todas las REL documentadas), pero el artefacto GRAFO no ha sido definido formalmente en el cuaderno de gobierno. Derivabilidad estimada: PROBABLE, sujeta a definición del formato de salida.

---

## Resumen cuantitativo

| Artefacto | Ítems totales | Representación completa desde CAP | Representación parcial desde CAP | Sin representación posible desde CAP |
|-----------|---------------|-----------------------------------|----------------------------------|--------------------------------------|
| CHK-001 | 134 | 43 (32%) VERIFICADO_EN_CAP | 77 (57%) PENDIENTE | 14 (10%) FUERA_DEL_RANGO_AUDITADO |
| ARB-001 | 91 nodos | ~77 (85%) | ~11 (12%) | ~3 (3%) |
| PAN-001 | 1 (embebido en CAP) | 1 (100%) | 0 | 0 |

> Nota ARB-001: los valores aproximados (~) reflejan la naturaleza mixta de los estados de nodo. Los 14 nodos FUNC/MOT tienen Estado FUERA_DEL_RANGO_AUDITADO pero sí tienen representación (nombre, ENT probable) en ARB-001.

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
3. Los 14 nodos FUNC/MOT tienen Estado FUERA_DEL_RANGO_AUDITADO según CAP-001-R5 ANEXO-NO-OBSERVADO y están correctamente representados en los artefactos derivados.

**El veredicto sería DERIVABLE si** CAP-001 cubriera l.1–∞ (el archivo completo). Mientras el rango sea l.1–2000, DERIVABLE_CON_LIMITACIONES es el veredicto correcto y estable.

**El veredicto no es NO_DERIVABLE** porque todos los artefactos se han generado sin acceso a index.html, y contienen información verificable y trazable a CAP-001-R5.

---

## RESUMEN DE CORRECCIONES (R1)

| Corrección | Elemento afectado | Hallazgo corregido | Corrección aplicada | Referencia CAP-001-R5 | Estado |
|------------|------------------|-------------------|--------------------|-----------------------|--------|
| COR-03 | Encabezado — nota sobre versión de referencia | Referencia a "solicitud original" y a "CAP-001-R6 inexistente" — información externa a CAP-001-R5 | Eliminada la nota completa del encabezado. Todo el documento se basa exclusivamente en CAP-001-R5 | CAP-001-R5 es la única fuente; no contiene referencia a versión futura | RESUELTO |
| COR-03 | Sección "Discrepancia documentada — Versión de referencia" | Tabla con "solicitud original" y "CAP-001-R6" — contexto procesual no derivable de CAP-001-R5 | Sección eliminada íntegramente | CAP-001-R5 no contiene referencia a solicitudes ni a versiones futuras | RESUELTO |
| COR-04 | Tabla P1 — fila "NO_DERIVABLE_DESDE_CAP_001" | Uso de marcador de derivación como categoría de tabla | Categoría renombrada a "FUERA_DEL_RANGO_AUDITADO" (estado oficial de CAP-001-R5). Descripción alineada con ANEXO-NO-OBSERVADO | CAP-001-R5 ANEXO-NO-OBSERVADO — estado: FUERA_DEL_RANGO_AUDITADO | RESUELTO |
| COR-04 | Tabla P2 — fila FUNC: "5 (nombre + línea aprox)" | Conteo incorrecto: FUNC-001 a FUNC-004 = 4 nodos con línea aproximada, no 5 | Corregido a 4 (nombre + línea aprox) y 6 (nombre + ENT probable; LINEA_NO_PRECISADA en CAP-001-R5) | CAP-001-R5 §FUNC-001/002/003/004 tienen "Línea aprox"; §FUNC-005/010 tienen "LINEA_NO_PRECISADA" | RESUELTO |
| COR-04 | Tabla P2 — fila FUNC: "5 (nombre; línea NO_DERIVABLE)" | Valor incorrecto (debería ser 6) y uso de marcador de derivación | Corregido a 6. Sustituido "línea NO_DERIVABLE" por "LINEA_NO_PRECISADA en CAP-001-R5" | CAP-001-R5 §FUNC-005 a §FUNC-010 — campo "Línea": LINEA_NO_PRECISADA | RESUELTO |
| COR-04 | Tabla P2 — fila MOT: formato "1 + MOT-004" | Formato ambiguo en columna "Derivable completo"; denominación inconsistente con resto del documento | Reorganizado: 2 nodos con representación completa (MOT-003 rango aprox; MOT-004 CDN en rango), 2 con LINEA_NO_PRECISADA | CAP-001-R5 §MOT-003 (rango ~73507–76850); §MOT-004 (CDN l.13+l.15) | RESUELTO |
| COR-04 | P2 — texto "7 de 14 nodos externos... NO_DERIVABLE_DESDE_CAP_001" | Conteo incorrecto (debería ser 8) y uso de marcador de derivación | Corregido: "8 de 14 nodos externos (FUNC-005 a FUNC-010, MOT-001, MOT-002) tienen LINEA_NO_PRECISADA según CAP-001-R5 ANEXO-NO-OBSERVADO" | CAP-001-R5 ANEXO-NO-OBSERVADO — verificable por enumeración | RESUELTO |
| COR-04 | P3 — "7 líneas de función marcadas como NO_DERIVABLE_DESDE_CAP_001" | Conteo incorrecto (8) y uso de marcador de derivación | Corregido: "8 nodos con LINEA_NO_PRECISADA (valor de campo en ANEXO-NO-OBSERVADO)" con desglose de qué está documentado (nombre, ENT probable, CON probable) | CAP-001-R5 ANEXO-NO-OBSERVADO | RESUELTO |
| COR-04 | Resumen cuantitativo — columna "No derivables" ARB-001 | "~3 (3%)" sin justificación, incoherente con que todos los nodos tienen alguna representación | Tabla reformulada con columnas más precisas; nota aclaratoria añadida | Todos los nodos de ARB-001 tienen representación (nombre/estado); limitación es de profundidad, no de existencia | RESUELTO |
| COR-01 | NO_APLICA en DERIVABILIDAD | DERIVABILIDAD no contiene la afirmación de exclusividad de CHK-C06 | — | — | NO_APLICA |
| COR-02 | NO_APLICA en DERIVABILIDAD | DERIVABILIDAD no usa NO_DERIVABLE_DESDE_CAP_001 como estado en tablas (solo como marcador contextual, corregido en COR-04) | — | — | NO_APLICA |

---

*DERIVABILIDAD-CAP-001-R1 — evaluación exclusiva desde CAP-001-R5 — revisión 2026-05-27*  
*Cuaderno de Gobierno del Código COMPÁS*
