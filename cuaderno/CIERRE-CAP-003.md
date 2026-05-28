# CIERRE-CAP-003 — Expediente de cierre
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** CIERRE-CAP-003  
**Estado:** CERRADO  
**Fecha de cierre:** 2026-05-28

---

## 1. Identificación del expediente

| Campo | Valor |
|-------|-------|
| Expediente | CAP-003 |
| Tipo | Cartografía de bloque HTML |
| Código de bloque | BLOQUE-003 |
| Apertura | APERTURA-CAP-003-AUDITADA.md |
| Fuente auditada | index.html |
| Documento cartográfico vigente | CAP-003-R1.md |

---

## 2. Rango cubierto

| Campo | Valor |
|-------|-------|
| Línea inicial | l.2453 |
| Línea final | l.2663 |
| Total de líneas | 211 |
| Verificación aritmética | 9+22+52+52+48+5+23 = 211 ✓ |
| Dominio | HTML — armazón estructural del cuerpo de página (body shell) |

---

## 3. Unidad arquitectónica documentada

**Nombre:** Armazón estructural del cuerpo de página — BLOQUE-003  
**Descripción:** Primera sección HTML de index.html tras el cierre del bloque CSS. Cubre el contenedor de notificaciones toast, el `<header>` institucional completo (logos, identidad COMPÁS, ciclo de trabajo de 5 fases, selectores de contexto territorial y atribución), el separador `.franja`, el `<nav>` de fases RELAS, y la apertura de `<main>` como límite de transición al dominio de contenido de aplicación.

**Micro-rangos documentados:**

| MR | Descripción | Líneas | Extensión |
|----|-------------|--------|-----------|
| MR-054 | Blancos post-body + Contenedor de notificaciones toast | l.2453–2461 | 9 líneas |
| MR-055 | Header: logos institucionales | l.2462–2483 | 22 líneas |
| MR-056 | Header: identidad COMPÁS (branding, botones de acción) | l.2484–2535 | 52 líneas |
| MR-057 | Header: ciclo de trabajo COMPÁS (5 fases) | l.2536–2587 | 52 líneas |
| MR-058 | Header: selectores de contexto + atribución + cierre | l.2588–2635 | 48 líneas |
| MR-059 | Franja separadora | l.2636–2640 | 5 líneas |
| MR-060 | Navegación RELAS + cierre pre-main | l.2641–2663 | 23 líneas |

**Entidades documentadas:**

| ENT | Nombre | Estado |
|-----|--------|--------|
| ENT-035 | Contenedor de notificaciones toast (#toast-container) | AUDITADO_PROVISIONAL |
| ENT-036 | Logos institucionales (.logos-institucionales) | AUDITADO_PROVISIONAL |
| ENT-037 | Identidad COMPÁS / Bloque de branding (.itaca-branding) | AUDITADO_PROVISIONAL |
| ENT-038 | Ciclo de trabajo COMPÁS — visualización 5 fases | AUDITADO_PROVISIONAL |
| ENT-039 | Selectores de contexto territorial (#estrategia-salud / #municipio) | AUDITADO_PROVISIONAL |
| ENT-040 | Navegación RELAS — 6 fases de aplicación (nav.relas-container) | AUDITADO_PROVISIONAL |

**Nota:** MR-059 (.franja) no genera entidad semántica propia — documentado en CAP-003-R1.

---

## 4. Revisiones realizadas

| Revisión | Acción | Resultado |
|----------|--------|-----------|
| R0 | Documentación provisional inicial | Sustituida por R1 |
| R1 | Corrección tras auditoría hostil (MAY-001 a MAY-004) | **VIGENTE** |

---

## 5. Auditorías realizadas

| Auditoría | Artefacto | Veredicto |
|-----------|-----------|-----------|
| Auditoría de apertura | APERTURA-CAP-003-AUDITADA.md | DELIMITACIÓN_APROBADA |
| Auditoría hostil CAP-003-R0 | Sobre CAP-003-R0 | 4 hallazgos mayores aceptados (MAY-001 a MAY-004) |
| Auditoría Codex de derivados | Sobre CHK-003, ARB-003, DERIVABILIDAD-CAP-003 R0 | REQUIERE_CORRECCIÓN (hallazgos COR-01, COR-02 en DERIVABILIDAD) |

---

## 6. Correcciones aplicadas

**En CAP-003 (R0 → R1):**

| ID | Hallazgo | Corrección |
|----|---------|-----------|
| MAY-001 | ENT-038/MR-057 atribuían el ciclo de 5 fases al "proceso metodológico EPVSA" — no observable desde el HTML | Corregido: ciclo documentado como "visualización del ciclo de trabajo COMPÁS" según comentario HTML l.2537; distinción explícita respecto a las 6 fases RELAS de ENT-040 |
| MAY-002 | REL-023 afirmaba comportamiento JS específico (listener de clicks, gestión de `.fase-contenido`) no observable en el rango | REL-023 y GAP-21 reformulados: mecanismo consumidor declarado FUERA_DEL_RANGO_AUDITADO sin especificar comportamiento no observable |
| MAY-003 | Marcador `l.2453+` incorrecto en 6 loci (REL-021, GAP-17, GAP-18, GAP-19, GAP-20, GAP-21) — el rango auditado es precisamente l.2453–2663 | Corregido a `l.2664+` en todos los loci afectados |
| MAY-004 | Evaluación preliminar afirmaba "HTML estático; toda lógica JS en l.2453+" ignorando los atributos de evento inline observables (onclick, onchange, onmouseover, onmouseout) | Reformulado: "el rango contiene atributos de evento inline observables, pero no implementación JS" |

**En derivados (R0 → R1):**

| ID | Hallazgo | Artefacto corregido |
|----|---------|---------------------|
| COR-01 | Tabla "Verificación interna" de DERIVABILIDAD referenciaba "el sistema GOV establecido" como fundamento de las categorías — no derivable exclusivamente de CAP-003-R1 | DERIVABILIDAD-CAP-003-R1: sustituido por enumeración explícita de estados presentes en CAP-003-R1 |
| COR-02 | Párrafo "Coherencia con bloques anteriores" en veredicto final citaba DERIVABILIDAD-CAP-001-R1 y DERIVABILIDAD-CAP-002-R1 — fuentes externas al ámbito de derivación de CAP-003-R1 | DERIVABILIDAD-CAP-003-R1: párrafo eliminado |

---

## 7. Derivados vigentes

| Artefacto | Revisión vigente | Estado |
|-----------|-----------------|--------|
| CAP-003 | R1 | CONGELABLE_CON_OBSERVACIONES — fuente autorizada |
| CHK-003 | R0 | VALIDADO |
| ARB-003 | R0 | VALIDADO |
| DERIVABILIDAD-CAP-003 | R1 | DERIVACIÓN_VÁLIDA_CON_OBSERVACIONES |

---

## 8. Resultado de auditorías de derivabilidad

**Veredicto DERIVABILIDAD-CAP-003-R1:** `DERIVABLE_CON_LIMITACIONES`

| Artefacto | Ítems totales | Completos desde CAP | Parciales desde CAP | No representables |
|-----------|--------------|---------------------|--------------------|--------------------|
| CHK-003 | 33 | 18 (55%) VERIFICADO_EN_CAP | 0 (0%) PENDIENTE | 15 (45%) FUERA_DEL_RANGO_AUDITADO |
| ARB-003 | 24 nodos | 17 (71%) completos | 7 (29%) parciales | 0 |

Limitaciones de derivabilidad atribuibles al rango auditado: CSS de los elementos en CAP-001 (FUERA_DEL_RANGO_AUDITADO) e implementaciones JS en l.2664+ (FUERA_DEL_RANGO_AUDITADO). No existen ítems PENDIENTE de QA.

---

## 9. Observaciones abiertas no bloqueantes

| ID | Elemento | Descripción | Resolución |
|----|---------|-------------|-----------|
| GAP-17 | ENT-036 | `src` de los 5 elementos `<img class="logo-institucional">` no declarado en HTML estático | Requiere l.2664+ o recursos estáticos externos |
| GAP-18 | ENT-039 / #municipio | Datos dinámicos del selector de municipio — carga en tiempo de ejecución | Requiere l.2664+ |
| GAP-19 | REL-021 / ENT-039 | Implementación de `onCambioEstrategia()` | Requiere l.2664+ |
| GAP-20 | REL-022 / ENT-037 | Implementaciones de `mostrarMetodologia()` y `abrirDrawerDocumentos()` | Requiere l.2664+ |
| GAP-21 | REL-023 / ENT-040 / CON-026 | Consumidor JS del mecanismo `data-fase` y productor de `.fase.activa` | Requiere l.2664+ |
| OBS-REL-021 | REL-021 | Descripción del efecto de `onCambioEstrategia()` (repoblado de municipios, recarga de datos) parcialmente interpretativa — inferida del nombre de la función, no observable en l.2453–2663 | Deuda epistemológica menor; no bloqueante |
| OBS-DV-019 | DV-019 / ENT-039 | La calificación "arquitectura preparada para múltiples estrategias/regiones" es parcialmente interpretativa — se apoya en el comentario HTML `<!-- Selector de Estrategia de Salud (COMPAS EU) -->` y en el valor `es-andalucia-epvsa`, pero la intención de diseño no es completamente verificable desde el HTML estático | Deuda epistemológica menor; no bloqueante |
| OBS-HIST | DERIVABILIDAD-CAP-003-R1 | La tabla RESUMEN DE CORRECCIONES incluye, en la columna "Texto sustituido" de COR-02, la cita histórica del texto eliminado, que contenía referencias a DERIVABILIDAD-CAP-001-R1 y DERIVABILIDAD-CAP-002-R1. Estas referencias aparecen como registro histórico de la corrección, no como afirmaciones activas del documento | Residuo histórico en tabla de trazabilidad; no bloqueante |

Ninguna observación abierta bloquea el cierre del expediente. Los 5 GAPs tienen criterio de resolución explícito apuntando a l.2664+. Las observaciones epistemológicas menores (OBS-REL-021, OBS-DV-019) están correctamente recogidas en los derivados sin haberse elevado a hechos verificados.

---

## 10. Estado final

| Indicador | Estado |
|-----------|--------|
| Cobertura de rango (211 líneas) | COMPLETA — verificada aritméticamente |
| Hallazgos mayores abiertos | NINGUNO |
| Correcciones pendientes | NINGUNA |
| Coherencia CAP ↔ CHK ↔ ARB ↔ DERIVABILIDAD | CONFIRMADA |
| Derivados sin revisión pendiente | CONFIRMADO |
| Continuidad de identificadores con bloques anteriores | CONFIRMADA — MR-054/060, ENT-035/040, REL-021/023, CON-026, GAP-17/21, DV-018/019 |

---

## 11. Veredicto formal de cierre

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: EXPEDIENTE_CERRADO                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAP-003 — BLOQUE-003 — l.2453–2663                        ║
║  Artefacto vigente: CAP-003-R1                              ║
║  Derivados vigentes: CHK-003 / ARB-003 /                   ║
║                      DERIVABILIDAD-CAP-003-R1               ║
║  Hallazgos mayores abiertos: 0                              ║
║  Correcciones pendientes: 0                                 ║
╚══════════════════════════════════════════════════════════════╝
```

**Base del veredicto:**

1. El rango l.2453–2663 está documentado con 100% de cobertura (211 líneas, 7 MR, verificación aritmética confirmada).
2. Los cuatro hallazgos mayores de la auditoría hostil (MAY-001 a MAY-004) fueron corregidos en R1 y están documentados con texto original, texto resultante y estado RESUELTO.
3. Los dos hallazgos de la auditoría Codex de derivados (COR-01 y COR-02) afectaban exclusivamente a DERIVABILIDAD-CAP-003 y fueron resueltos en R1, generando el artefacto vigente DERIVABILIDAD-CAP-003-R1.
4. CHK-003 y ARB-003 superaron la auditoría Codex sin hallazgos y están en estado VALIDADO.
5. No existen hallazgos mayores conocidos pendientes de resolución.
6. Las observaciones abiertas (GAP-17 a GAP-21, OBS-REL-021, OBS-DV-019, OBS-HIST) son no bloqueantes, tienen naturaleza epistemológica menor o criterio de resolución explícito en l.2664+, y están correctamente documentadas como límites del rango auditado.

---

*CIERRE-CAP-003 — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
