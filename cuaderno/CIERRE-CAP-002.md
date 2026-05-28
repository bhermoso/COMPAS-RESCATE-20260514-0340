# CIERRE-CAP-002 — Expediente de cierre
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** CIERRE-CAP-002  
**Estado:** CERRADO  
**Fecha de cierre:** 2026-05-27

---

## 1. Identificación del expediente

| Campo | Valor |
|-------|-------|
| Expediente | CAP-002 |
| Tipo | Cartografía de bloque CSS |
| Código de bloque | BLOQUE-002 |
| Apertura | APERTURA-CAP-002-AUDITADA.md |
| Fuente auditada | index.html |
| Documento cartográfico vigente | CAP-002-R2.md |

---

## 2. Rango cubierto

| Campo | Valor |
|-------|-------|
| Línea inicial | l.2001 |
| Línea final | l.2452 |
| Total de líneas | 452 |
| Verificación aritmética | 19+118+104+37+107+62+5 = 452 ✓ |
| Dominio | CSS exclusivo (l.2001–2447 CSS activo; l.2448–2452 cierre estructural) |

---

## 3. Unidad arquitectónica documentada

**Nombre:** CSS de completación y cierre estructural — BLOQUE-002  
**Descripción:** Última sección activa del bloque CSS principal de COMPÁS. Contiene el cierre del spinner de carga iniciado en BLOQUE-001, el sistema completo de votación ciudadana, el modo encuesta ciudadana (con doble definición CSS documentada), el panel de dashboard IBSE importado de fuente externa, el perfil de salud local institucional (tipografía serif), y el cierre del bloque `<style>`, `</head>` y apertura de `<body>`.

**Micro-rangos documentados:**

| MR | Descripción | Líneas | Extensión |
|----|-------------|--------|-----------|
| MR-047 | Cierre spinner + sección vacante botón flotante | l.2001–2019 | 19 líneas |
| MR-048 | ENT-031 Sistema de votación ciudadana | l.2020–2137 | 118 líneas |
| MR-049 | ENT-032 Modo encuesta ciudadana — primera definición + responsive compartido | l.2138–2241 | 104 líneas |
| MR-050 | ENT-032 Segunda definición EPVSA (/* CAMBIO COMPAS */) | l.2242–2278 | 37 líneas |
| MR-051 | ENT-033 IBSE Dashboard Panel (importado) | l.2279–2385 | 107 líneas |
| MR-052 | ENT-034 Perfil de Salud Local institucional | l.2386–2447 | 62 líneas |
| MR-053 | Cierre estructural </style> </head> <body> | l.2448–2452 | 5 líneas |

**Entidades documentadas:**

| ENT | Nombre | Estado |
|-----|--------|--------|
| ENT-030 | Spinner de carga (cierre de CAP-001) | AUDITADO_PROVISIONAL |
| ENT-031 | Sistema de votación ciudadana | AUDITADO_PROVISIONAL |
| ENT-032 | Modo encuesta ciudadana (doble definición CSS) | AUDITADO_PROVISIONAL |
| ENT-033 | IBSE Dashboard Panel (CSS importado externo) | AUDITADO_PROVISIONAL |
| ENT-034 | Perfil de Salud Local / Documento Institucional | AUDITADO_PROVISIONAL |

---

## 4. Revisiones realizadas

| Revisión | Acción | Resultado |
|----------|--------|-----------|
| R0 | Documentación provisional inicial | Sustituida por R1 |
| R1 | Primera documentación completa con resolución de OBS-A001/A002 | Sustituida por R2 |
| R2 | Corrección tras auditoría hostil (MAY-001, MAY-002, MAY-003) | **VIGENTE** |

---

## 5. Auditorías realizadas

| Auditoría | Artefacto | Veredicto |
|-----------|-----------|-----------|
| Auditoría de apertura | APERTURA-CAP-002-AUDITADA.md | DELIMITACIÓN_APROBADA |
| Auditoría de derivados R0 | Sobre CHK-002 R0 / ARB-002 R0 / DERIVABILIDAD R0 | REQUIERE_CORRECCIÓN (hallazgos COR-01 a COR-04) |
| Auditoría hostil CAP-002-R1 | Sobre CAP-002-R1 | 3 hallazgos mayores aceptados (MAY-001/002/003) |
| Verificación COR-01 | Sobre ARB-002-R2 | CERRABLE |

---

## 6. Correcciones aplicadas

**En CAP-002 (R1 → R2):**

| ID | Hallazgo | Corrección |
|----|---------|-----------|
| MAY-001 | ENT-033 contaba 13 custom properties cuando eran 15 | Corregido a 15 en ENT-033, DV-012 y MR-051 |
| MAY-002 | DV-013 incluía #059669 (MR-050/ENT-032) atribuido incorrectamente a ENT-034 | DV-013 depurado; sólo #004e8c/MR-052/ENT-034; atribución MR corregida a MR-052 |
| MAY-003 | REL-020 en estado PARCIAL sin evidencia de invocación JS | REL-020 degradada a PENDIENTE_VALIDACION; CDN-05 sin cambio de estado |

**En derivados (R0 → R1):**

| ID | Hallazgo | Artefacto corregido |
|----|---------|---------------------|
| COR-01 | CDN-01 a CDN-07 enumerados en ARB como nodos derivados, no reconstruibles desde CAP-002-R2 | ARB-002-R1 / ARB-002-R2 |
| COR-02 | Conteos ARB incluían 7 nodos CDN no derivables (35→28 nodos; 83%→71%) | ARB-002-R1 / DERIVABILIDAD-R1 |
| COR-03 | CHK-B05 y CHK-F03 nombraban Firebase como hecho; CAP-002-R2 declara NO_OBSERVADO | CHK-002-R1 / DERIVABILIDAD-R1 |
| COR-04 | [NO_DERIVABLE_DESDE_CAP_002] usado como etiqueta informal en árbol y derivabilidad | ARB-002-R1 / CHK-002-R1 / DERIVABILIDAD-R1 |
| COR-01 residual | ARB-002-R1 seguía enumerando nombres de CDN heredadas (firebase-app-compat…) en nota metodológica | ARB-002-R2 |

---

## 7. Derivados vigentes

| Artefacto | Revisión vigente | Estado |
|-----------|-----------------|--------|
| CAP-002 | R2 | Fuente autorizada |
| CHK-002 | R1 | Vigente |
| ARB-002 | R2 | Vigente — COR-01 RESUELTO verificado |
| DERIVABILIDAD-CAP-002 | R1 | Vigente |

---

## 8. Resultado de auditorías de derivabilidad

**Veredicto DERIVABILIDAD-CAP-002-R1:** `DERIVABLE_CON_LIMITACIONES`

| Artefacto | Ítems totales | Completos desde CAP | Parciales desde CAP | No representables |
|-----------|--------------|---------------------|--------------------|--------------------|
| CHK-002-R1 | 37 | 26 (70%) VERIFICADO_EN_CAP | 4 (11%) PENDIENTE | 7 (19%) FUERA_DEL_RANGO_AUDITADO |
| ARB-002-R2 | 28 nodos | 20 (71%) completos | 8 (29%) parciales | 0 |

Limitaciones de derivabilidad atribuibles exclusivamente al rango auditado (l.2001–2452 íntegramente CSS; productores JS en l.2453+).

---

## 9. Observaciones abiertas no bloqueantes

| ID | Elemento | Descripción | Resolución |
|----|---------|-------------|-----------|
| GAP-13 | MR-047 / DV-015 | Implementación HTML/JS del botón flotante auto-diagnóstico | Requiere l.2453+ |
| GAP-14 | CON-021 a CON-025 | Productores JS de todos los contratos del bloque | Requiere l.2453+ |
| GAP-15 | ENT-031 / .votacion-feed | Origen de datos del feed — NO_OBSERVADO en rango | Requiere l.2453+ |
| GAP-16 | ENT-032 | Comportamiento real en navegador de doble definición CSS | Requiere QA |
| REL-020 | CDN-05 / ENT-031 | Estado PENDIENTE_VALIDACION — invocación JS QRCode() no confirmada | Requiere l.2453+ |
| OBS-ENT-033 | ENT-033 | 15 custom properties externas a paleta COMPÁS (DV-012) | Deuda conocida, no bloqueante |
| OBS-ENT-034 | ENT-034 | #004e8c ≠ #0074c8 COMPÁS primary (DV-013) | Deuda conocida, no bloqueante |
| OBS-ENT-032 | ENT-032 | Doble definición CSS con clases semánticas inconsistentes (DV-014, DV-016, DV-017) | Deuda conocida, no bloqueante |

Ninguna observación abierta bloquea el cierre del expediente. Todas tienen criterio de resolución explícito y están correctamente documentadas en CAP-002-R2 y derivados.

---

## 10. Estado final

| Indicador | Estado |
|-----------|--------|
| Cobertura de rango (452 líneas) | COMPLETA — verificada aritméticamente |
| Hallazgos mayores abiertos | NINGUNO |
| Correcciones pendientes | NINGUNA |
| Coherencia CAP ↔ CHK ↔ ARB ↔ DERIVABILIDAD | CONFIRMADA |
| COR-01 residual | RESUELTO — verificado el 2026-05-27 |
| Derivados sin revisión pendiente | CONFIRMADO |

---

## 11. Veredicto formal de cierre

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: EXPEDIENTE_CERRADO                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAP-002 — BLOQUE-002 — l.2001–2452                        ║
║  Artefacto vigente: CAP-002-R2                              ║
║  Derivados vigentes: CHK-002-R1 / ARB-002-R2 /             ║
║                      DERIVABILIDAD-CAP-002-R1               ║
║  Hallazgos mayores abiertos: 0                              ║
║  Correcciones pendientes: 0                                 ║
╚══════════════════════════════════════════════════════════════╝
```

**Base del veredicto:**

1. El rango l.2001–2452 está documentado con 100% de cobertura (452 líneas, 7 MR, verificación aritmética confirmada).
2. Los tres hallazgos mayores de la auditoría hostil (MAY-001/002/003) fueron corregidos en R2 y están documentados.
3. Los cuatro hallazgos de la auditoría de derivados (COR-01 a COR-04) fueron resueltos en las revisiones R1/R2 de los derivados.
4. COR-01 residual (enumeración de nombres CDN en nota metodológica) fue resuelto en ARB-002-R2 y verificado formalmente con resultado CERRABLE.
5. No existen hallazgos mayores conocidos pendientes de resolución.
6. Las observaciones abiertas (GAP-13 a GAP-16, REL-020, deudas DV) son no bloqueantes, tienen criterio de resolución explícito, y están correctamente documentadas como límites del rango auditado.

---

*CIERRE-CAP-002 — 2026-05-27*  
*Cuaderno de Gobierno del Código COMPÁS*
