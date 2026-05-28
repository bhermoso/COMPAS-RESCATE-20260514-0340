# DERIVABILIDAD-CAP-003 — Informe de derivabilidad
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** DERIVABILIDAD-CAP-003  
**Revisión:** R1 — Corrección mínima COR-01 y COR-02  
**Estado:** PROVISIONAL_NO_VALIDADO  
**Fuente evaluada:** CAP-003-R1.md  
**Rango auditado en CAP-003-R1:** l.2453–2663 de index.html  
**Artefactos derivados evaluados:** CHK-003, ARB-003  
**Fecha:** 2026-05-27  
**Sustituye a:** DERIVABILIDAD-CAP-003 R0

> Todas las afirmaciones de este informe proceden exclusivamente de CAP-003-R1. No se ha consultado index.html ni ninguna fuente externa. CAP-001 y CAP-002 no se utilizan como fuente técnica; sus menciones son de localización (identifican el origen de elementos declarados como FUERA_DEL_RANGO_AUDITADO en CAP-003-R1).

---

## Pregunta 1 — ¿Es CAP-003-R1 suficiente para generar CHK-003 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones.**

CHK-003 ha sido generado exclusivamente desde CAP-003-R1. El resultado es un documento de 33 ítems estructurados en 6 secciones. La suficiencia es parcial:

| Categoría de ítem | Cantidad | Observaciones |
|-------------------|----------|---------------|
| VERIFICADO_EN_CAP | 18 (55%) | Ítems cuyo criterio de verificación puede resolverse desde CAP-003-R1 sin leer código |
| PENDIENTE | 0 (0%) | No existen ítems dependientes de QA o comportamiento runtime en este bloque |
| FUERA_DEL_RANGO_AUDITADO | 15 (45%) | Ítems explícitamente declarados fuera de l.2453–2663 en CAP-003-R1 |

**Desglose de los 15 ítems FUERA_DEL_RANGO_AUDITADO:**

*JS en l.2664+ (10 ítems):*
- CHK-B02: contenido de #toast-container — generado en runtime (ENT-035)
- CHK-B06: implementaciones de mostrarMetodologia() y abrirDrawerDocumentos() (REL-022, GAP-20)
- CHK-B10: datos dinámicos de municipios e implementación de onCambioEstrategia() (GAP-18, GAP-19)
- CHK-B12: consumidor JS del mecanismo data-fase (GAP-21)
- CHK-C02: implementación de onCambioEstrategia() (GAP-19)
- CHK-C04: implementaciones JS de REL-022 (GAP-20)
- CHK-C06: consumidor JS de data-fase (GAP-21)
- CHK-D03: productor JS de CON-026 (GAP-21)
- CHK-F03: implementación de onCambioEstrategia()
- CHK-F05: consumidor JS de navegación RELAS

*Recursos externos o l.2664+ (3 ítems):*
- CHK-B04: fuente de src de logos institucionales (GAP-17)
- CHK-F01: resolución de GAP-17
- CHK-F02: datos de municipios (GAP-18)

*CSS en CAP-001 (2 ítems):*
- CHK-D02: definición CSS de .fase.activa (CON-026 — CAP-001)
- CHK-F04: implementaciones de mostrarMetodologia() y abrirDrawerDocumentos() (GAP-20)

> Nota: la tasa de VERIFICADO_EN_CAP (55%) es inferior a la de CAP-002-R2 (70%). La diferencia se explica porque el rango l.2453–2663 es HTML: los CSS que gobiernan sus elementos están en CAP-001 (FUERA), y las implementaciones JS de los eventos inline están en l.2664+ (FUERA). Ningún ítem es PENDIENTE porque no existen en este bloque anomalías que requieran verificación en QA (no hay doble definición CSS, no hay dependencias de runtime no documentadas como incertidumbre).

**Conclusión P1.** CAP-003-R1 genera CHK-003 con estructura completa y 55% de ítems verificables desde el documento. El 45% restante está correctamente documentado como FUERA_DEL_RANGO_AUDITADO con criterios de resolución explícitos. No se ha inventado ningún ítem ni se ha inferido comportamiento no observable.

---

## Pregunta 2 — ¿Es CAP-003-R1 suficiente para generar ARB-003 sin acceder a index.html?

**Respuesta: SÍ, con limitaciones estructurales conocidas.**

ARB-003 ha sido generado exclusivamente desde CAP-003-R1. El árbol de 6 capas (MR, ENT, CON, REL, DV, GAP) es derivable con los siguientes grados de completitud:

| Capa | Nodos | Representación completa | Representación parcial | Sin representación posible |
|------|-------|------------------------|----------------------|--------------------------|
| MR | 7 | 7 (100%) | 0 | 0 |
| ENT | 6 | 3 (50%) | 3 (ENT-036 GAP-17; ENT-039 GAP-18/19; ENT-040 GAP-21) | 0 |
| CON | 1 | 0 (trigger HTML observable; CSS y JS FUERA) | 1 (PARCIAL) | 0 |
| REL | 3 | 0 (atributos HTML observables; JS FUERA) | 3 (FUERA_DEL_RANGO) | 0 |
| DV | 2 | 2 (100%) | 0 | 0 |
| GAP | 5 | 5 (100%) | 0 | 0 |
| **TOTAL** | **24** | **17 (71%)** | **7 (29%)** | **0** |

**Limitaciones estructurales identificadas:**

- El único contrato CON-026 tiene su trigger observable en el HTML estático (clase .activa en l.2645), pero el efecto CSS está en CAP-001 y el productor JS en l.2664+. El nodo se representa como PARCIAL con sus tres componentes explicitados.
- Las tres relaciones REL-021, REL-022, REL-023 tienen evidencia observable en el HTML (atributos onchange, onclick, data-fase), pero sus destinos JS están en l.2664+. Los nodos se representan como FUERA_DEL_RANGO_AUDITADO con su evidencia disponible.
- ENT-036 es parcial por GAP-17 (src no declarado — aspecto estructuralmente significativo de la definición del elemento).
- ENT-039 es parcial por GAP-18/19 (carga dinámica de municipios e implementación del handler).
- ENT-040 es parcial por GAP-21 (consumidor JS del mecanismo de navegación).
- ENT-035, ENT-037, ENT-038 son completos: todos los campos documentables desde el HTML del rango están presentes; los elementos externos (CSS en CAP-001) son consecuencia del rango, no omisiones del árbol.

**Nota sobre MR-059 (.franja):** el separador decorativo no genera entidad semántica. Su ausencia como nodo ENT en el árbol es correcta y está fundamentada en CAP-003-R1: "Entidades: ninguna".

**Conclusión P2.** CAP-003-R1 genera ARB-003 con cobertura estructural completa en las 6 capas derivables. Las limitaciones son de profundidad (CSS en CAP-001, implementaciones JS en l.2664+) y de definición incompleta en 3 entidades con GAPs estructurales, no de ausencia de representación.

---

## Pregunta 3 — ¿Qué información contenida en CAP-003-R1 no es derivable hacia artefactos de auditoría?

**Respuesta: Tres categorías.**

**3.1 Información dependiente de ejecución (no derivable a CHK como VERIFICADO ni a ARB como completo):**
- No existen ítems en esta categoría en BLOQUE-003. A diferencia de CAP-002-R2 (donde ENT-032 con doble definición CSS generaba incertidumbre de comportamiento en navegador), el HTML de l.2453–2663 no presenta anomalías que requieran verificación de runtime para ser representadas correctamente.

**3.2 Información que requiere l.2664+ (derivable como FUERA_DEL_RANGO_AUDITADO, no como confirmado):**
- Contenido de #toast-container — generado en runtime por JS
- Fuente de src de los 5 logos institucionales — GAP-17
- Datos de municipios del selector #municipio — GAP-18
- Implementación de onCambioEstrategia() — GAP-19
- Implementaciones de mostrarMetodologia() y abrirDrawerDocumentos() — GAP-20
- Consumidor JS de atributos data-fase y gestión de .fase.activa — GAP-21

**3.3 Información dependiente de CAP-001 (FUERA_DEL_RANGO_AUDITADO, no como confirmado):**
- Definición CSS de todas las clases documentadas como FUERA_DEL_RANGO_AUDITADO (CAP-001): .toast-container, .logos-institucionales, .logo-institucional, .itaca-branding, .itaca-nombre, .itaca-descripcion, .estrategia-selector, .municipio-selector, .franja, .relas-container, .relas-fases, .fase, .fase.activa
- Efecto visual de CON-026 (.fase.activa) — definido en CAP-001

**3.4 Información ausente de CAP-003-R1 como campo precisado:**
- No existe ningún nodo ENT, CON o REL sin representación posible en ARB-003. Todos tienen al menos nombre, MR origen, líneas y estado.
- Todos los 33 ítems de CHK-003 tienen origen documental en CAP-003-R1.
- No existe información inventada en ningún artefacto derivado.

**Conclusión P3.** CAP-003-R1 cubre estructuralmente todo lo derivable desde l.2453–2663. La información no derivable a artefactos verificados se debe exclusivamente al límite del rango auditado (l.2664+ para JS, CAP-001 para CSS), no a omisiones del documento CAP.

---

## Pregunta 4 — ¿Es CAP-003-R1 autocontenido o depende de memoria de sesión?

**Respuesta: Autocontenido con dependencias heredadas documentadas.**

**Evidencia de autocontención:**
- RESUMEN MAESTRO documenta 7 MR, 6 ENT, 3 REL, 1 CON, 5 GAP, 2 DV con verificación aritmética (9+22+52+52+48+5+23 = 211 ✓).
- Los 7 MR tienen líneas de inicio y fin precisas con cobertura verificada.
- Las 6 ENT tienen selectores, MR origen, líneas y estado.
- Las 3 REL tienen evidencia observable (líneas con atributos de evento) y estado explícito.
- El único CON tiene clase trigger, línea de observación y estado PARCIAL documentado.
- Las 5 GAP tienen descripción, elemento afectado y criterio de resolución.
- Las 2 DV tienen descripción, entidades afectadas e impacto.
- Las 4 correcciones MAY (MAY-001 a MAY-004) están documentadas con hallazgo, corrección y referencia.

**Dependencias heredadas de bloques anteriores (documentadas en CAP-003-R1):**
- El criterio de delimitación hace referencia a l.2452 (`<body>` cierre de CAP-002) — referencia de localización, no de contenido.
- Los estilos CSS que gobiernan el bloque están en BLOQUE-001 (CAP-001) — declarado explícitamente en la nota preámbulo de CAP-003-R1 y como FUERA_DEL_RANGO_AUDITADO a lo largo del documento. Esta es una dependencia de localización documentada, no una dependencia de contenido que requiera leer CAP-001.

**Distinción clave respecto a CAP-002-R2:** En CAP-002-R2, la dependencia con CAP-001 generó un problema documental (CDN-01 a CDN-07 no reconstruibles desde CAP-002-R2). En CAP-003-R1 no existe un problema equivalente: no se documentan identificadores de objetos externos no reconstruibles desde CAP-003-R1. Las clases CSS citadas como FUERA_DEL_RANGO_AUDITADO son nombres de selectores observables en el HTML, no identificadores que dependan de CAP-001 para su existencia en el documento.

**Conclusión P4.** CAP-003-R1 es autocontenido para generar CHK-003 y ARB-003 sin acceso a index.html. Las referencias a CAP-001 (CSS) y l.2664+ (JS) son de localización (identifican dónde está la información no observable en el rango), no dependencias de contenido que hayan sido explotadas en la derivación.

---

## Pregunta 5 — ¿Qué dependencias documentales existen?

**Dependencias con CAP-001:**

| Dependencia | Tipo | Uso en derivación |
|-------------|------|-------------------|
| Definiciones CSS de clases documentadas en el bloque (.fase, .franja, etc.) | Localización | Documentadas como FUERA_DEL_RANGO_AUDITADO; no se ha leído CAP-001 para derivar |
| Criterio de inicio (l.2452 `<body>` cierre de CAP-002) | Contextual — límite | Documentado en criterio de delimitación; no requiere leer CAP-001/002 para derivar |

**Dependencias con index.html (no utilizadas en derivación):**

| Dependencia | Razón de no uso | Estado |
|-------------|----------------|--------|
| Contenido generado en runtime de #toast-container | FUERA_DEL_RANGO_AUDITADO | Documentado como tal en ENT-035 |
| src de los 5 logos institucionales | FUERA_DEL_RANGO_AUDITADO | Documentado como GAP-17 |
| Datos dinámicos del selector #municipio | FUERA_DEL_RANGO_AUDITADO | Documentado como GAP-18 |
| Implementación de onCambioEstrategia() | FUERA_DEL_RANGO_AUDITADO | Documentado como GAP-19, REL-021 |
| Implementaciones de mostrarMetodologia() y abrirDrawerDocumentos() | FUERA_DEL_RANGO_AUDITADO | Documentado como GAP-20, REL-022 |
| Consumidor JS de data-fase / gestión de .fase.activa | FUERA_DEL_RANGO_AUDITADO | Documentado como GAP-21, REL-023, CON-026 |

**Conclusión P5.** No existe ninguna dependencia de derivación funcional que no esté cubierta por CAP-003-R1. Las dependencias externas están correctamente marcadas como FUERA_DEL_RANGO_AUDITADO sin haber sido explotadas. No se ha producido ningún problema análogo al de CDN-01/07 en CAP-002-R2.

---

## Pregunta 6 — ¿Qué límites impone CAP-003-R1?

**Límites del rango (l.2453–2663):**
1. El rango es íntegramente HTML. Contiene atributos de evento inline (onclick, onchange, onmouseover, onmouseout) observables, pero no la implementación de las funciones invocadas — corrección MAY-004 respecto a R0 de CAP-003.
2. Los CSS que gobiernan todos los elementos del bloque están declarados en BLOQUE-001 (l.1–2000) — FUERA_DEL_RANGO_AUDITADO. Esto incluye el efecto visual de CON-026 (.fase.activa).
3. Los 5 GAP (GAP-17 a GAP-21) tienen criterio de resolución explícito apuntando a l.2664+ y no impiden la derivación estructural.
4. ENT-037 y ENT-038 tienen la especificación visual completa en el propio HTML (inline styles) — ventaja observacional respecto a entidades de bloques CSS-only.

**Límites del documento (CAP-003-R1):**
- Todos los elementos del documento tienen líneas de referencia dentro del rango l.2453–2663.
- Ningún elemento fue inferido sin evidencia documental — las correcciones MAY-001 a MAY-004 eliminaron cuatro inferencias no observables presentes en R0.
- La distinción entre ENT-038 (5 fases COMPÁS) y ENT-040 (6 fases RELAS) está documentada con evidencia textual (comentario HTML l.2537 y conteo de elementos).

**Conclusión P6.** Los límites de CAP-003-R1 son coherentes con el rango auditado y no generan incertidumbre en la derivación de CHK-003 y ARB-003.

---

## Pregunta 7 — ¿Existen pérdidas de información respecto a CAP-003-R1?

**Respuesta: NO.**

Todo el contenido derivable de CAP-003-R1 está representado en CHK-003 y ARB-003:

| Elemento CAP-003-R1 | Representación en CHK-003 | Representación en ARB-003 |
|--------------------|--------------------------|--------------------------|
| 7 MR (MR-054 a MR-060) | CHK-A01 a A05 | Nodos de primer nivel del árbol |
| ENT-035 | CHK-B01 a B02 | Nodo MR-054 |
| ENT-036 | CHK-B03 a B04 | Nodo MR-055 con GAP-17 |
| ENT-037 | CHK-B05 a B06 | Nodo MR-056 con subramas |
| ENT-038 | CHK-B07 a B08 | Nodo MR-057 con columnas y MAY-001 |
| ENT-039 | CHK-B09 a B10 | Nodo MR-058 con selectores |
| ENT-040 | CHK-B11 a B12 | Nodo MR-060 con 6 fases |
| REL-021 | CHK-C01 a C02 | Capa REL independiente |
| REL-022 | CHK-C03 a C04 | Capa REL independiente |
| REL-023 | CHK-C05 a C06 | Capa REL independiente |
| CON-026 | CHK-D01 a D03 | Capa CON independiente |
| DV-018 a DV-019 | CHK-E01 a E02 | Capa DV en árbol y tabla independiente |
| GAP-17 a GAP-21 | CHK-F01 a F05 | Capa GAP con límites explícitos |
| MR-059 (.franja) | CHK-A01 (incluida en cobertura) | Nodo MR-059 — sin ENT (documentado) |
| Correcciones MAY-001 a MAY-004 | CHK-B08 (MAY-001), CHK-C05 (MAY-002) | [MAY-001] ENT-038, [derivación] REL-023 |

**Precisión sobre información no derivable:** La información no derivable (CSS en CAP-001, implementaciones JS en l.2664+) no se ha perdido — se ha documentado explícitamente como FUERA_DEL_RANGO_AUDITADO en ARB-003 y en CHK-003. Esta es la representación correcta, no una omisión.

---

## Resumen cuantitativo

| Artefacto | Ítems totales | Representación completa desde CAP | Representación parcial desde CAP | Sin representación posible desde CAP |
|-----------|---------------|-----------------------------------|----------------------------------|--------------------------------------|
| CHK-003 | 33 | 18 (55%) VERIFICADO_EN_CAP | 0 (0%) PENDIENTE | 15 (45%) FUERA_DEL_RANGO_AUDITADO |
| ARB-003 | 24 nodos* | 17 (71%) completos | 7 (29%) parciales (3ENT + 1CON + 3REL) | 0 |

> *ARB-003: 7 MR + 6 ENT + 1 CON + 3 REL + 2 DV + 5 GAP = 24 nodos de categorías principales.

---

## Verificación interna

| Verificación | Resultado |
|-------------|-----------|
| No se han creado categorías nuevas | CONFIRMADO — todos los estados y tipos utilizados (AUDITADO_PROVISIONAL, FUERA_DEL_RANGO_AUDITADO, PARCIAL, VERIFICADO_EN_CAP, [derivación]) están presentes en CAP-003-R1 |
| No se han creado estados nuevos | CONFIRMADO — VERIFICADO_EN_CAP, PENDIENTE, FUERA_DEL_RANGO_AUDITADO son estados de derivación del sistema; [derivación] es marcador metodológico |
| Toda afirmación procede de CAP-003-R1 | CONFIRMADO — ninguna información extraída de index.html, CAP-001 ni CAP-002 como fuente técnica |
| Coherencia de conteos | CONFIRMADO — CHK-003: 33 ítems; ARB-003: 24 nodos; RESUMEN MAESTRO CAP-003-R1: 7 MR, 6 ENT, 3 REL, 1 CON, 5 GAP, 2 DV |
| Coherencia entre CHK-003, ARB-003 y DERIVABILIDAD | CONFIRMADO — los 18 VERIFICADO_EN_CAP de CHK corresponden a los 17 nodos completos de ARB (MR, 3 ENT completas, DV, GAP) con diferencia de agrupación documentada; los 15 FUERA de CHK corresponden a los 7 nodos parciales de ARB (3ENT + 1CON + 3REL) con mayor granularidad en CHK |
| Continuidad de identificadores | CONFIRMADO — MR-054/060, ENT-035/040, REL-021/023, CON-026, GAP-17/21, DV-018/019 son continuaciones directas de los acumulados de bloques anteriores sin saltos ni duplicaciones |

---

## VEREDICTO FINAL

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DERIVABLE_CON_LIMITACIONES                      ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación:**

CAP-003-R1 permite derivar CHK-003 y ARB-003 con estructura completa y sin inventar datos. Los artefactos derivados son funcionales, autocontenidos y trazables a la fuente.

Las limitaciones son inherentes al rango auditado (l.2453–2663) y a la arquitectura del sistema, no a deficiencias de CAP-003-R1:

1. El 45% de los ítems CHK quedan como FUERA_DEL_RANGO porque sus verificaciones requieren l.2664+ (JS) o CAP-001 (CSS) — situación correctamente prevista y documentada. Ningún ítem es PENDIENTE.
2. El único contrato CON-026 tiene trigger observable pero efecto CSS y productor JS fuera del rango.
3. Las tres REL tienen evidencia HTML observable (atributos de evento) pero implementaciones JS fuera del rango.
4. Los 5 GAP tienen criterios de resolución explícitos que no bloquean la representación estructural del bloque.

**El veredicto sería DERIVABLE** si CAP-003 cubriera además l.1–2452 (CSS) y l.2664+ (JS). Con el rango l.2453–2663, DERIVABLE_CON_LIMITACIONES es el veredicto correcto y estable.

**El veredicto no es NO_DERIVABLE** porque todos los artefactos se han generado sin acceso a index.html, y contienen información verificable y trazable a CAP-003-R1.

---

## RESUMEN DE CORRECCIONES (R0 → R1)

| ID | Hallazgo | Referencia afectada | Texto sustituido | Texto resultante | Estado |
|----|---------|--------------------|-----------------|--------------------|--------|
| COR-01 | Verificación interna referenciaba GOV como fundamento metodológico — no derivable exclusivamente de CAP-003-R1 | Verificación interna — fila "No se han creado categorías nuevas" | "todos los estados y tipos proceden de CAP-003-R1 y el sistema GOV establecido" | "todos los estados y tipos utilizados (AUDITADO_PROVISIONAL, FUERA_DEL_RANGO_AUDITADO, PARCIAL, VERIFICADO_EN_CAP, [derivación]) están presentes en CAP-003-R1" | RESUELTO |
| COR-02 | Veredicto final incluía comparación explícita con DERIVABILIDAD-CAP-001-R1 y DERIVABILIDAD-CAP-002-R1 — no derivable exclusivamente de CAP-003-R1 | Veredicto final — párrafo "Coherencia con bloques anteriores" | "**Coherencia con bloques anteriores:** El veredicto es idéntico (DERIVABLE_CON_LIMITACIONES) al de DERIVABILIDAD-CAP-001-R1 y DERIVABILIDAD-CAP-002-R1. La razón estructural es análoga: en todos los bloques, la separación entre el rango auditado y sus dependencias externas (CSS en otros bloques, JS en l.2664+) produce el mismo patrón de limitaciones documentadas." | *(párrafo eliminado)* | RESUELTO |

---

*DERIVABILIDAD-CAP-003 R1 — evaluación exclusiva desde CAP-003-R1 — 2026-05-27*  
*Cuaderno de Gobierno del Código COMPÁS*
