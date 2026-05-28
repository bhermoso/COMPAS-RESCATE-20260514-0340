# APERTURA-CAP-002-AUDITADA — Auditoría de Apertura del Expediente CAP-002

**Artefacto:** APERTURA-CAP-002-AUDITADA  
**Tipo:** Auditoría de delimitación de expediente  
**Expediente auditado:** CAP-002 (CAP-002.md, estado APERTURA — PROVISIONAL_NO_VALIDADO)  
**Fuente primaria:** index.html (verificación directa de los hitos declarados)  
**Referencia de cierre anterior:** CIERRE-CAP-001 (estado VALIDADO_CON_OBSERVACIONES)  
**Fecha de auditoría:** 2026-05-27  

---

## 1. Identificación de la delimitación propuesta

| Parámetro | Valor declarado en CAP-002.md | Verificado en código |
|-----------|-------------------------------|---------------------|
| Línea inicial | 2001 | CONFIRMADO |
| Línea final | 2452 | CONFIRMADO |
| Tamaño total | 452 líneas | CONFIRMADO |
| Hito de apertura | Continuación directa desde CAP-001 | CONFIRMADO — l.2001 es vacía; primera acción documentable en l.2004 (@keyframes spin) |
| Hito de cierre | `</style>` en l.2448 | CONFIRMADO — l.2448: `</style>` exacto |
| Cierre estructural | `</head>` l.2450, `<body>` l.2452 | CONFIRMADO — verificados por lectura directa |

---

## 2. Respuestas a los doce puntos de auditoría

### 2.1 Línea inicial

**l.2001** — Continuación directa e ininterrumpida desde el límite superior de CAP-001 (l.2000). No hay solapamiento ni hueco entre bloques. Las primeras tres líneas del bloque (l.2001–2003) son vacías o de indentación, patrón idéntico al observado en transiciones entre secciones CSS de BLOQUE-001.

### 2.2 Línea final

**l.2452** — Línea que contiene `<body>`, apertura del cuerpo HTML estructural. La elección de l.2452 como límite superior captura:

- l.2448: `</style>` — cierre del bloque CSS abierto en l.43
- l.2449: línea en blanco
- l.2450: `</head>` — cierre del elemento head
- l.2451: línea en blanco
- l.2452: `<body>` — apertura del cuerpo estructural

Estas cinco líneas constituyen una unidad de cierre de dominio CSS e inicio de dominio HTML/JS. Incluirlas en CAP-002 en lugar de cortar en l.2448 es correcto: captura el hito estructural completo sin entrar en contenido HTML/JS.

### 2.3 Tamaño aproximado

**452 líneas** (l.2001–l.2452 inclusive). Comparación con CAP-001:

| Expediente | Rango | Líneas | MR | Líneas/MR media |
|------------|-------|--------|----|-----------------|
| CAP-001 | l.1–2000 | 2000 | 46 | 43,5 |
| CAP-002 | l.2001–2452 | 452 | 7 | 64,6 |

El volumen reducido de CAP-002 respecto a CAP-001 es coherente con el tipo de contenido: CAP-001 cubre el CSS principal completo de COMPÁS; CAP-002 cubre el CSS de componentes especializados tardíos. La densidad de entidades por línea es comparable: CAP-001 produjo 30 ENT en 2000 líneas (15 líneas/ENT); CAP-002 produce 4 ENT nuevas + 1 cierre en 452 líneas (90 líneas/ENT), lo cual es coherente dado que el CSS de los componentes tardíos (IBSE, PSL) es más extenso por entidad.

### 2.4 Criterio de delimitación utilizado

**Criterio primario:** Cierre del bloque `<style>` en l.2448.

El bloque `<style>` fue abierto en l.43 (BLOQUE-001) y se cierra en l.2448 (BLOQUE-002). Este cierre delimita la totalidad del dominio CSS del archivo. Es un límite:

- **Verificable:** localizable por lectura directa de l.2448.
- **No ambiguo:** no existe ningún otro `</style>` entre l.42 y l.2448.
- **Estructural:** impuesto por la sintaxis HTML, no por decisión editorial.
- **Completo:** no deja ninguna entidad CSS sin su definición correspondiente en el bloque.

**Criterio secundario:** Inclusión de `</head>` y `<body>` en MR-053, que extiende el límite a l.2452 para capturar el hito de transición de dominio.

**Criterio de exclusión:** l.2453+ pertenece al dominio HTML estructural y JS. Incluirlo requeriría nuevas categorías de MR incompatibles con la metodología de BLOQUE-001 y BLOQUE-002 (ambos íntegramente CSS).

### 2.5 Unidad arquitectónica identificada

**Cierre del dominio CSS de COMPÁS.**

CAP-001 y CAP-002 juntos cubren el único bloque `<style>` del archivo (l.43–l.2448, ~2406 líneas activas). CAP-002 cierra esta unidad arquitectónica mayor. La unidad es:

- **Autolimitada:** tiene apertura (l.43) y cierre (l.2448) precisos.
- **Homogénea en tipo:** todo CSS declarativo, sin JS ni HTML estructural.
- **Reconocible:** corresponde al ámbito de estilos visuales que determina la apariencia de toda la SPA.

### 2.6 Entidades principales presentes

| ENT | Nombre | Tipo | Novedad |
|-----|--------|------|---------|
| ENT-030 | Spinner de carga | ANIMACIÓN | Herencia de CAP-001 — cierre en MR-047 |
| ENT-031 | Sistema de votación ciudadana | PARTICIPACIÓN_CIUDADANA | Nueva |
| ENT-032 | Modo encuesta ciudadana | PARTICIPACIÓN_CIUDADANA | Nueva — MACROENTIDAD_CON_CONFLICTO_CSS |
| ENT-033 | IBSE Dashboard Panel | VISUALIZACIÓN_DATOS | Nueva — COMPONENTE_IMPORTADO |
| ENT-034 | Perfil de Salud Local — Documento Institucional | DOCUMENTO_INSTITUCIONAL | Nueva — COMPONENTE_IMPORTADO |

Las cuatro entidades nuevas son temáticamente distintas y arquitectónicamente autocontenidas. No existe dependencia entre ellas dentro del rango auditado. Los dos nuevos clasificadores de entidad (MACROENTIDAD_CON_CONFLICTO_CSS y COMPONENTE_IMPORTADO) están justificados por evidencia directa: comentario `/* CAMBIO COMPAS */` en l.2268 para ENT-032; comentario de origen en l.2279 para ENT-033.

### 2.7 Contratos principales presentes

| CON | Clase trigger | Semántica | Estado |
|-----|--------------|-----------|--------|
| CON-021 | .votacion-estado.activa | Sesión de votación activa | PARCIAL |
| CON-022 | .votacion-estado.inactiva | Votación cerrada | PARCIAL |
| CON-023 | .votacion-estado.esperando | Espera entre fases | PARCIAL |
| CON-024 | .encuesta-opcion.selected | Selección de opción (primera def.) | PARCIAL |
| CON-025 | .encuesta-opcion.seleccionado | Selección de opción (segunda def. EPVSA) | PARCIAL |

Todos los contratos tienen productor JS NO_OBSERVADO en el rango l.2001–2452 (el rango es íntegramente CSS). Esto es coherente con el patrón de CAP-001, donde todos los contratos CON-001 a CON-020 también tenían productor JS NO_OBSERVADO. La dualidad CON-024/CON-025 (mismo estado semántico, dos clases distintas) es una anomalía documentada como DV-014, no un error de documentación.

### 2.8 Dependencias relevantes

**Dependencias heredadas de CAP-001 (activas en este bloque):**

| Dependencia | Tipo | Estado en CAP-002 |
|-------------|------|-------------------|
| CDN-05 QRCodeJS (l.21) | Librería externa | Elevado de PENDIENTE_VALIDACION a PARCIAL — REL-020 |
| CDN-01 firebase-app-compat (l.13) | Infraestructura | Dependencia implícita de ENT-031 (.votacion-feed) — PROBABLE |
| CDN-02 firebase-database-compat (l.15) | Infraestructura | Dependencia implícita de ENT-031 — PROBABLE |

**Dependencias propias del bloque:**

- ENT-033 declara origen externo `db_ibse_v3_dashboard.html` — componente importado cuyo archivo fuente no forma parte del repositorio actual. No crea dependencia CDN.
- ENT-034 no declara origen CDN.

**No hay nuevas CDN en este bloque.** Confirmado: todas las declaraciones `<script>` están en l.13–25 (BLOQUE-001).

### 2.9 Riesgos de corte prematuro

**Evaluación: NINGUNO — la delimitación no sufre riesgo de corte prematuro.**

Se evaluaron tres alternativas de corte anticipado:

| Alternativa | Línea de corte | Problema |
|-------------|---------------|---------|
| Antes de MR-053 | l.2447 | Dejaría `</style>`, `</head>`, `<body>` fuera del bloque o en un expediente de 5 líneas sin entidades — expediente no viable |
| Antes de MR-052 | l.2385 | ENT-034 (PSL) quedaría sin bloque documentable — fragmentaría una entidad cohesionada |
| Antes de MR-051 | l.2278 | ENT-033 (IBSE) quedaría en expediente propio de 106 líneas — expediente viable pero que rompería el hito estructural `</style>` |

La delimitación l.2001–l.2452 es la única que no corta ninguna entidad a la mitad y captura el hito estructural mayor.

### 2.10 Riesgos de extensión excesiva

**Evaluación: NINGUNO — la delimitación no se extiende más allá del hito estructural.**

Extender a l.2453+ implicaría:

1. **Cambio de dominio de código:** de CSS declarativo a HTML estructural y JS imperativo. Los MR de HTML/JS requieren categorías diferentes (elementos DOM, listeners, funciones) que no están presentes en la metodología de BLOQUE-001 ni de BLOQUE-002.
2. **Ruptura de homogeneidad:** CAP-001 y CAP-002 son íntegramente CSS. Un CAP-002 que incluya HTML/JS habría mezclado dominios, haciendo que los artefactos derivados (CHK, ARB) fueran metodológicamente incompatibles con CAP-001.
3. **Inflado del expediente:** l.2453+ contiene HTML estructural extenso (elementos DOM, scripts). Incorporarlo habría aumentado el tamaño del expediente de 452 a un volumen indeterminado sin criterio natural de cierre.

### 2.11 Dependencias con CAP-001

| Tipo de dependencia | Detalle | Impacto en CAP-002 |
|---------------------|---------|-------------------|
| ENT transversal | ENT-030 (spinner) — BLOQUE_INCOMPLETO_EN_LÍMITE en CAP-001 | MR-047 cierra ENT-030 en l.2004–2008. Dependencia resuelta. |
| CDN heredadas | CDN-01 a CDN-07 declaradas en l.13–25 (BLOQUE-001) | Ninguna CDN nueva. REL-020 usa CDN-05 ya registrada. |
| FUNC/MOT pendientes | FUNC-001 a FUNC-010, MOT-001 a MOT-004 con LINEA_NO_PRECISADA en CAP-001-R5 | Ninguno observable en l.2001–2452 (rango íntegramente CSS). No resolubles desde CAP-002. |
| Nodos CON heredados | CON-001 a CON-020 con productor JS NO_OBSERVADO | Permanecen en estado NO_OBSERVADO — sus productores están en l.2453+. |
| Nodos GAP heredados | GAP-01 a GAP-12 de CAP-001 | Ninguno se resuelve en BLOQUE-002 por misma razón (sin JS/HTML). |
| Paleta COMPÁS | Confirmada en BLOQUE-001: #0074c8, #00acd9, #94d40b, #ffb61b, #ff6600, #dc143c | ENT-033 y ENT-034 introducen paletas externas explícitamente escopadas bajo IDs. No contaminan la paleta COMPÁS. |

La única dependencia que se resuelve en CAP-002 es el cierre de ENT-030. Todas las demás dependencias con CAP-001 permanecen abiertas hacia CAP-003+.

### 2.12 Probabilidad de derivación futura

#### CHK-002

**Probabilidad: ALTA**

- 10 ítems identificados en CAP-002.md (CHK-B01 a CHK-B10), todos con criterio de verificación explícito.
- La estructura es análoga a CHK-001: ítems PENDIENTE (requieren l.2453+ o QA), con criterio de grep o lectura directa documentado.
- CHK-B01 es el único ítem verificable directamente desde código (confirmado en esta auditoría: `</style>` en l.2448).
- Limitación: el 90% de los ítems requieren acceso a l.2453+ o a QA — análogo al 57% PENDIENTE de CHK-001.
- Derivabilidad desde CAP-002.md: equivalente a la obtenida en DERIVABILIDAD-CAP-001-R1.

#### ARB-002

**Probabilidad: ALTA**

- ARB-002 provisional está embebido en CAP-002.md con estructura de 9 nodos de primer nivel.
- El árbol es derivable directamente desde el documento sin acceder a index.html.
- La estructura de ENT-032 (MACROENTIDAD_CON_CONFLICTO_CSS con doble definición) está documentada en el árbol con rama explícita para cada definición.
- Limitación: productores JS de CON-021 a CON-025 son NO_OBSERVADO — el árbol refleja esto como rama abierta, no como ausencia de nodo.

#### DERIVABILIDAD-CAP-002

**Probabilidad: ALTA con limitaciones análogas a DERIVABILIDAD-CAP-001**

- La relación CAP-002.md → CHK-002 y ARB-002 sigue el mismo patrón que CAP-001-R5 → CHK-001 y ARB-001.
- El veredicto esperado es DERIVABLE_CON_LIMITACIONES por las mismas razones estructurales: productores JS en l.2453+, comportamiento runtime no determinable desde CSS.
- No se anticipa ningún hallazgo que cambie el veredicto a NO_DERIVABLE.

---

## 3. Comparación con la experiencia de CAP-001

| Dimensión | CAP-001 | CAP-002 | Evaluación |
|-----------|---------|---------|------------|
| Criterio de delimitación | Propuesto editorialmente (bloque de 2000 líneas como unidad operativa) | Impuesto estructuralmente (`</style>` l.2448) | CAP-002 tiene criterio más robusto |
| Coherencia del rango | Alta — contenido homogéneo (CSS) | Alta — contenido homogéneo (CSS cierre) | Equivalente |
| Hito de cierre | l.2000 — sin hito estructural claro (CSS abierto) | l.2452 — hito estructural mayor (`</style>`, `</head>`, `<body>`) | CAP-002 superior |
| Entidades truncadas al cierre | ENT-030 (BLOQUE_INCOMPLETO_EN_LÍMITE) | Ninguna | CAP-002 superior |
| Dependencias sin resolver | Múltiples (FUNC/MOT, CON productores, GAP-01/12) | Equivalentes al cierre — heredadas | Idéntico patrón |
| MR por expediente | 46 | 7 | Proporción diferente, justificada por naturaleza del contenido |
| Viabilidad de derivación | DERIVABLE_CON_LIMITACIONES | ALTA — misma estructura | Coherente |

La experiencia de CAP-001 muestra que el mayor riesgo fue el corte artificial en l.2000 sin hito estructural, que dejó ENT-030 en estado BLOQUE_INCOMPLETO_EN_LÍMITE y requirió un expediente de apertura en CAP-002 para resolverlo. CAP-002 no reproduce ese riesgo: su cierre en l.2452 es un hito estructural verificable que no deja ninguna entidad truncada.

---

## 4. Respuesta a la pregunta de coherencia

**¿La delimitación elegida maximiza coherencia documental y minimiza riesgo de fragmentación?**

**SÍ — de forma inequívoca.**

Argumentos:

1. **Coherencia de dominio:** el bloque l.2001–l.2452 es íntegramente CSS (l.2001–2447) más el cierre estructural (l.2448–2452). No hay mezcla de dominios. Esta homogeneidad garantiza que todos los MR, ENT, CON y REL del expediente pertenecen al mismo tipo de artefacto analizado, lo que hace que la metodología de CAP-001 sea directamente aplicable.

2. **Completitud de la unidad arquitectónica:** el bloque CSS de COMPÁS (l.43–l.2448) es la unidad arquitectónica natural del archivo. CAP-001 + CAP-002 la cubren exactamente, sin hueco y sin solapamiento. Ninguna entidad definida en este rango queda sin expediente.

3. **Ausencia de alternativas mejores:** no existe ningún hito estructural en l.2001–l.2447 que justifique una partición interna. Los comentarios de sección (`/* SISTEMA DE VOTACIÓN */`, `/* MODO ENCUESTA */`, etc.) son hitos editoriales del CSS, no estructurales del archivo. El único hito estructural del tramo es `</style>` en l.2448.

4. **Minimización de fragmentación:** cortar antes de l.2448 crearía una fragmentación metodológica: un expediente sin hito de cierre y un expediente contiguo de entre 5 y 170 líneas sin entidades suficientes para generar CHK y ARB coherentes. La delimitación actual evita este escenario.

5. **Continuidad con CAP-001:** el límite inferior de CAP-002 (l.2001) es la continuación directa del límite superior de CAP-001 (l.2000), sin hueco ni solapamiento. La cobertura conjunta l.1–l.2452 es continua y sin omisiones.

---

## 5. Observaciones

### OBS-A001 — Brecha de atribución MR entre MR-049 y MR-050

**Naturaleza:** l.2239–l.2241 son tres líneas vacías no atribuidas a ningún MR (MR-049 termina en l.2238, MR-050 empieza en l.2242).  
**Impacto en delimitación:** NINGUNO. Las líneas son vacías (separadores) y no contienen código auditable.  
**Impacto en documentación:** MENOR. La cobertura de los MR es del 99,1% del bloque — las 4 líneas no atribuidas (incluyendo OBS-A002) son todas vacías.  
**Acción requerida:** Ninguna sobre la delimitación del bloque. Deberá resolverse en la validación formal de CAP-002.md, atribuyendo las líneas vacías al cierre de MR-049 o la apertura de MR-050 según el criterio adoptado en CAP-001.

### OBS-A002 — Brecha de atribución MR entre MR-051 y MR-052

**Naturaleza:** l.2385 es una línea vacía no atribuida a ningún MR (MR-051 termina en l.2384, MR-052 empieza en l.2386).  
**Impacto en delimitación:** NINGUNO.  
**Acción requerida:** Idéntica a OBS-A001.

### OBS-A003 — Clasificadores de ENT nuevos no registrados en GOV-001

**Naturaleza:** CAP-002.md usa dos clasificadores de ENT que no constan en GOV-001-R1: MACROENTIDAD_CON_CONFLICTO_CSS (ENT-032) y COMPONENTE_IMPORTADO (ENT-033).  
**Impacto en delimitación:** NINGUNO — la delimitación no depende de la taxonomía de clasificadores.  
**Impacto en gobierno:** MEDIO. Los clasificadores nuevos son semánticamente precisos y están justificados, pero requieren registro en GOV-001 antes de la validación formal de CAP-002. GOV-001-R2 está pendiente (auditoría hostil con CRT-001, CRT-002, MAY-001 a MAY-007 no aplicada).  
**Acción requerida:** Incorporar MACROENTIDAD_CON_CONFLICTO_CSS y COMPONENTE_IMPORTADO en GOV-001-R2 antes de la validación de CAP-002. No bloquea la apertura.

---

## 6. Veredicto

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DELIMITACIÓN_APROBADA                            ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación:**

La delimitación l.2001–l.2452 es correcta, verificable y justificada por el criterio estructural más sólido disponible en el archivo: el cierre del bloque `<style>` en l.2448, el único hito HTML estructural del tramo. No hay ninguna alternativa que mejore la coherencia documental ni que reduzca el riesgo de fragmentación.

Las observaciones OBS-A001 a OBS-A003 son menores y no afectan a la delimitación del bloque. Se trasladan a la validación formal de CAP-002.md.

**Condición de apertura formal:**

CAP-002 puede proceder a la documentación formal bajo la delimitación l.2001–l.2452. Antes de la validación de CAP-002.md deberán resolverse OBS-A001, OBS-A002 (atribución de líneas vacías a los MR correspondientes) y OBS-A003 (GOV-001-R2 con los nuevos clasificadores de ENT).

---

*APERTURA-CAP-002-AUDITADA — Cuaderno de Gobierno del Código COMPÁS — 2026-05-27*
