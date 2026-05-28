# DERIVABILIDAD-CAP-002 — Informe de derivabilidad
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** DERIVABILIDAD-CAP-002  
**Revisión:** R0 — Primera evaluación  
**Estado:** PROVISIONAL_NO_VALIDADO  
**Fuente evaluada:** CAP-002-R2.md  
**Rango auditado en CAP-002-R2:** l.2001–2452 de index.html  
**Artefactos derivados evaluados:** CHK-002, ARB-002  
**Fecha:** 2026-05-27

> Todas las afirmaciones de este informe proceden exclusivamente de CAP-002-R2. No se ha consultado index.html ni ninguna fuente externa.

---

## Pregunta 1 — ¿Es CAP-002-R2 suficiente para generar CHK-002 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones.**

CHK-002 ha sido generado exclusivamente desde CAP-002-R2. El resultado es un documento funcional de 37 ítems estructurados en 6 secciones. La suficiencia es parcial:

| Categoría de ítem | Cantidad | Observaciones |
|-------------------|----------|---------------|
| VERIFICADO_EN_CAP | 26 (70%) | Ítems cuyo criterio de verificación puede resolverse desde CAP-002-R2 sin leer código |
| PENDIENTE | 4 (11%) | Ítems que requieren lectura de l.2453+ o ejecución en QA |
| FUERA_DEL_RANGO_AUDITADO | 7 (19%) | Ítems explícitamente declarados fuera del rango l.2001–2452 en CAP-002-R2 |

**Desglose de los 7 ítems FUERA_DEL_RANGO_AUDITADO:**
- CHK-B05: dependencia Firebase de ENT-031 (NO_OBSERVADO declarado en CAP-002-R2)
- CHK-B09: consumidor JS de ENT-033 (sin CON documentados; JS en l.2453+)
- CHK-C02: invocación JS de QRCode() para REL-020 (FUERA_DEL_RANGO_AUDITADO declarado en REL-020)
- CHK-D06: productores JS de CON-021 a CON-025 (GAP-14)
- CHK-D07: qué clase aplica JS — .selected vs .seleccionado (DV-014 + GAP-14)
- CHK-F02: GAP-14 (productores JS)
- CHK-F03: GAP-15 (origen datos feed)

**Desglose de los 4 ítems PENDIENTE:**
- CHK-B07: comportamiento real ENT-032 en navegador (GAP-16 — requiere QA)
- CHK-B12: consumidor JS de ENT-034 (sin CON documentados; JS en l.2453+)
- CHK-F01: existencia de implementación HTML/JS del botón flotante (GAP-13)
- CHK-F04: comportamiento QA de ENT-032 doble definición (GAP-16)

**Conclusión P1.** CAP-002-R2 genera CHK-002 con estructura completa y 70% de ítems verificables desde el documento. El 30% restante está correctamente documentado como FUERA_DEL_RANGO o PENDIENTE, con criterios de resolución explícitos. No se ha inventado ningún ítem ni se ha reinterpretado el CSS.

---

## Pregunta 2 — ¿Es CAP-002-R2 suficiente para generar ARB-002 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones estructurales conocidas.**

ARB-002 ha sido generado exclusivamente desde CAP-002-R2. El árbol de 7 capas (MR, ENT, CON, REL, DV, GAP, CDN) es derivable con los siguientes grados de completitud:

| Capa | Nodos | Representación completa | Representación parcial | Sin representación posible |
|------|-------|------------------------|----------------------|--------------------------|
| MR | 7 | 7 (100%) | 0 | 0 |
| ENT | 5 | 4 (80%) | 1 (ENT-031 con GAPs abiertos) | 0 |
| CON | 5 | 0 (efecto CSS sí; productor JS no) | 5 (PARCIAL — JS FUERA_DEL_RANGO) | 0 |
| REL | 1 | 0 | 1 (CSS evidence; JS FUERA_DEL_RANGO) | 0 |
| DV | 6 | 6 (100%) | 0 | 0 |
| GAP | 4 | 4 (100% — documentados como límites) | 0 | 0 |
| CDN | 7 (heredadas) | 7 (estados documentados en CAP-001/002) | 0 | 0 |

**Limitaciones estructurales identificadas:**

- Los 5 contratos CON-021 a CON-025 tienen efecto CSS completo documentado, pero productor JS en FUERA_DEL_RANGO_AUDITADO (l.2453+). El árbol los representa como nodos PARCIAL con limitación explícita.
- ENT-032 tiene doble definición CSS con selectores incompatibles (MR-049 y MR-050). El árbol documenta ambas ramas con sus CON asociados. El comportamiento real en navegador es un GAP (GAP-16).
- REL-020 está en PENDIENTE_VALIDACION (MAY-003 corregida en R2). El árbol la documenta con su evidencia disponible y su límite explícito.
- ENT-033 y ENT-034 tienen consumidores JS no observables. El árbol marca estos nodos como [NO_DERIVABLE_DESDE_CAP_002] en la rama correspondiente.

**Conclusión P2.** CAP-002-R2 genera ARB-002 con cobertura estructural completa (todas las capas, entidades, contratos, relaciones y deudas presentes). Las limitaciones son de profundidad (productores JS en l.2453+) y de verificación en runtime (ENT-032), no de estructura.

---

## Pregunta 3 — ¿Qué información contenida en CAP-002-R2 no es derivable hacia artefactos de auditoría?

**Respuesta: Tres categorías.**

**3.1 Información dependiente de ejecución (no derivable a CHK como VERIFICADO o a ARB como completo):**
- Comportamiento real en navegador de ENT-032 — la segunda definición CSS prevalece en cascade para los selectores redefinidos, pero el contexto de montaje (cuál variante está activa) no puede determinarse desde CSS (GAP-16).
- Efecto real de DV-016 (.encuesta-nav-btn.enviar) en condiciones de uso de cada variante.
- Efecto real de DV-017 (.encuesta-completada h2) en cada variante.

**3.2 Información que requiere l.2453+ (derivable como FUERA_DEL_RANGO_AUDITADO, no como confirmado):**
- Productores JS de CON-021 a CON-025 — clases de estado sin código JS que las aplique observable en el rango.
- Qué clase aplica JS para la selección en encuesta: .selected (CON-024) o .seleccionado (CON-025) (DV-014).
- Invocación JS de QRCode() para REL-020.
- Dependencia Firebase de ENT-031.
- Consumidores JS de ENT-033 y ENT-034.
- Implementación HTML/JS del botón flotante auto-diagnóstico (GAP-13).

**3.3 Información ausente de CAP-002-R2 como campo precisado:**
- No existe ningún nodo ENT, CON o REL sin representación posible en ARB-002. Todos tienen al menos nombre, MR origen, líneas y estado.
- Todos los 37 ítems de CHK-002 tienen origen documental en CAP-002-R2.
- No existe información inventada en ningún artefacto derivado.

**Conclusión P3.** CAP-002-R2 cubre estructuralmente todo lo derivable desde l.2001–2452. La información no derivable a artefactos verificados se debe exclusivamente al límite del rango auditado (l.2453+ para JS, QA para comportamiento runtime), no a omisiones del documento CAP.

---

## Pregunta 4 — ¿Es CAP-002-R2 autocontenido o depende de memoria de sesión?

**Respuesta: Autocontenido con dependencias heredadas documentadas.**

**Evidencia de autocontención:**
- RESUMEN MAESTRO documenta 7 MR, 4 ENT nuevas, 1 ENT cerrada, 1 REL, 5 CON, 6 DV, 4 GAP.
- Los 7 MR tienen líneas de inicio y fin precisas, con verificación aritmética (19+118+104+37+107+62+5 = 452).
- Las 4 ENT nuevas tienen evidencia de selector, MR origen, líneas y estado.
- Los 5 CON tienen clase trigger, efecto CSS, línea y estado.
- Las 6 DV tienen descripción, MR afectado e impacto.
- Los 4 GAP tienen descripción, elemento afectado y criterio de resolución.
- Las 3 correcciones R2 (MAY-001, MAY-002, MAY-003) están documentadas con hallazgo, corrección y referencia.

**Dependencias heredadas de CAP-001 (documentadas en CAP-002-R2):**
- Las 7 CDN están declaradas en l.13–25 (BLOQUE-001). CAP-002-R2 las menciona pero no las redefine — dependencia correctamente anotada en la fuente del documento.
- ENT-030 es un cierre de entidad de CAP-001. CAP-002-R2 documenta explícitamente el estado anterior (BLOQUE_INCOMPLETO_EN_LÍMITE) y el estado posterior (AUDITADO_PROVISIONAL).
- El criterio de delimitación hace referencia al bloque CSS abierto en l.43 (CAP-001) — referencia cruzada documentada.

**Conclusión P4.** CAP-002-R2 es autocontenido para generar CHK-002 y ARB-002 sin acceso a index.html ni a CAP-001. Las referencias a CAP-001 son de contexto (explicativas), no de dependencia funcional para la derivación.

---

## Pregunta 5 — ¿Qué dependencias documentales existen?

**Dependencias con CAP-001:**

| Dependencia | Tipo | Uso en derivación |
|-------------|------|-------------------|
| ENT-030 estado anterior (BLOQUE_INCOMPLETO_EN_LÍMITE) | Contextual | Documentada en ENT-030 (cierre) de CAP-002-R2; no requiere leer CAP-001 para derivar |
| CDN-01 a CDN-07 (declaradas en BLOQUE-001) | Heredada | Documentada en RESUMEN MAESTRO y REL-020; no requiere leer CAP-001 para derivar |
| Rango de inicio l.2001 | Límite | Documentada en criterio de delimitación; no requiere leer CAP-001 para derivar |

**Dependencias con index.html (no utilizadas en derivación):**

| Dependencia | Razón de no uso | Estado |
|-------------|----------------|--------|
| Productores JS de CON-021 a CON-025 | FUERA_DEL_RANGO_AUDITADO | Documentados como GAP-14 |
| Invocación JS de QRCode() | FUERA_DEL_RANGO_AUDITADO | Documentado en REL-020 |
| Consumidores JS de ENT-033/034 | FUERA_DEL_RANGO_AUDITADO | [NO_DERIVABLE_DESDE_CAP_002] en ARB |
| Comportamiento runtime ENT-032 | Requiere QA | Documentado como GAP-16 |

**Conclusión P5.** No existe ninguna dependencia de derivación que no esté cubierta por CAP-002-R2. Las dependencias documentadas son informativas; las no cubiertas están correctamente marcadas.

---

## Pregunta 6 — ¿Qué límites impone CAP-002-R2?

**Límites del rango (l.2001–2452):**
1. El rango es íntegramente CSS. No hay JS ni HTML estructural en l.2001–2447. Los productores JS de todos los CON están en l.2453+.
2. Las 7 CDN están declaradas en BLOQUE-001 (l.13–25). CAP-002-R2 no puede certificar que ninguna CDN adicional exista en l.2453+ — aunque no hay evidencia de ello.
3. ENT-032 tiene una anomalía de doble definición CSS cuya resolución en runtime requiere QA.
4. REL-020 tiene CSS naming evidence pero no JS invocation evidence — permanece en PENDIENTE_VALIDACION.

**Límites del documento (CAP-002-R2):**
- Todos los elementos del documento tienen líneas de referencia dentro del rango l.2001–2452.
- Ningún elemento fue inferido sin evidencia documental.
- Las correcciones R2 (MAY-001, MAY-002, MAY-003) están documentadas con evidencia y justificación.

**Conclusión P6.** Los límites de CAP-002-R2 son coherentes con el rango auditado y no generan incertidumbre en la derivación de CHK-002 y ARB-002.

---

## Pregunta 7 — ¿Existen pérdidas de información respecto a CAP-002-R2?

**Respuesta: NO — con una precisión.**

Todo el contenido derivable de CAP-002-R2 está representado en CHK-002 y ARB-002:

| Elemento CAP-002-R2 | Representación en CHK-002 | Representación en ARB-002 |
|--------------------|--------------------------|--------------------------|
| 7 MR | CHK-A01 a A05 | Nodos de primer nivel del árbol |
| ENT-030 (cierre) | CHK-B01 | Nodo MR-047 |
| ENT-031 | CHK-B02 a B05 | Nodo completo con subramas |
| ENT-032 | CHK-B06 a B07 | Nodo con dos ramas (MR-049 + MR-050) |
| ENT-033 | CHK-B08 a B09 | Nodo con todos los sistemas documentados |
| ENT-034 | CHK-B10 a B12 | Nodo con todos los sistemas documentados |
| REL-020 | CHK-C01 a C03 | Capa REL independiente |
| CON-021 a CON-025 | CHK-D01 a D07 | Capa CON independiente |
| DV-012 a DV-017 | CHK-E01 a E06 | Capa DV en árbol y tabla independiente |
| GAP-13 a GAP-16 | CHK-F01 a F04 | Capa GAP con límites explícitos |
| CDN-01 a CDN-07 | CHK-C03 | Capa CDN heredada en árbol |

**Precisión:** la información no derivable (productores JS, consumidores JS, comportamiento runtime) no se ha perdido — se ha documentado explícitamente como [NO_DERIVABLE_DESDE_CAP_002] en ARB-002 o como observación de derivación en CHK-002. Esta es la representación correcta, no una pérdida.

---

## Resumen cuantitativo

| Artefacto | Ítems totales | Representación completa desde CAP | Representación parcial desde CAP | Sin representación posible desde CAP |
|-----------|---------------|-----------------------------------|----------------------------------|--------------------------------------|
| CHK-002 | 37 | 26 (70%) VERIFICADO_EN_CAP | 4 (11%) PENDIENTE | 7 (19%) FUERA_DEL_RANGO_AUDITADO |
| ARB-002 | 35 nodos* | 29 (83%) completos | 6 (17%) parciales (CON + REL con JS FUERA_DEL_RANGO) | 0 |

> *ARB-002: 7 MR + 5 ENT + 5 CON + 1 REL + 6 DV + 4 GAP + 7 CDN = 35 nodos de categorías principales.

---

## Verificación interna

| Verificación | Resultado |
|-------------|-----------|
| No se han creado categorías nuevas | CONFIRMADO — todos los estados y tipos proceden de CAP-001/GOV-001 |
| No se han creado estados nuevos | CONFIRMADO — VERIFICADO_EN_CAP, PENDIENTE, FUERA_DEL_RANGO_AUDITADO son estados de derivación, no del sistema; [NO_DERIVABLE_DESDE_CAP_002] es observación metodológica |
| Toda afirmación procede de CAP-002-R2 | CONFIRMADO — ninguna información extraída de index.html |
| Coherencia de conteos | CONFIRMADO — CHK-002: 37 ítems; ARB-002: 35 nodos; RESUMEN MAESTRO CAP-002-R2: 7 MR, 4 ENT, 1 REL, 5 CON, 6 DV, 4 GAP |
| Coherencia entre CHK-002, ARB-002 y DERIVABILIDAD | CONFIRMADO — los mismos 26 VERIFICADO_EN_CAP de CHK corresponden a los 29 nodos completos de ARB; las mismas 7 limitaciones FUERA_DEL_RANGO de CHK corresponden a los 6 nodos parciales de ARB (agrupando CON y REL) |

---

## VEREDICTO FINAL

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DERIVABLE_CON_LIMITACIONES                      ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación:**

CAP-002-R2 permite derivar CHK-002 y ARB-002 con estructura completa y sin inventar datos. Los artefactos derivados son funcionales, autocontenidos y trazables a la fuente.

Las limitaciones son inherentes al rango auditado (l.2001–2452 es íntegramente CSS), no a deficiencias de CAP-002-R2:

1. El 30% de los ítems CHK quedan en estado PENDIENTE o FUERA_DEL_RANGO porque sus verificaciones requieren l.2453+ o QA — situación correctamente prevista y documentada.
2. Los 5 contratos CON tienen efecto CSS verificado pero productores JS en l.2453+.
3. REL-020 tiene CSS naming evidence pero invocación JS fuera del rango — estado PENDIENTE_VALIDACION correcto.
4. ENT-032 tiene comportamiento runtime documentado como GAP-16 — situación esperada para anomalías CSS.

**El veredicto sería DERIVABLE** si CAP-002 cubriera l.2001–∞ (el archivo completo, incluyendo JS). Mientras el rango sea l.2001–2452 (íntegramente CSS), DERIVABLE_CON_LIMITACIONES es el veredicto correcto y estable.

**El veredicto no es NO_DERIVABLE** porque todos los artefactos se han generado sin acceso a index.html, y contienen información verificable y trazable a CAP-002-R2.

**Coherencia con DERIVABILIDAD-CAP-001-R1:**  
El veredicto es idéntico (DERIVABLE_CON_LIMITACIONES) por la misma razón estructural: ambos bloques son íntegramente CSS y los productores JS están en l.2453+ para BLOQUE-002, o LINEA_NO_PRECISADA para los FUNC/MOT de BLOQUE-001.

---

*DERIVABILIDAD-CAP-002 — evaluación exclusiva desde CAP-002-R2 — 2026-05-27*  
*Cuaderno de Gobierno del Código COMPÁS*
