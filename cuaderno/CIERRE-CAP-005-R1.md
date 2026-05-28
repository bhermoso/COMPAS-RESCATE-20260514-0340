# CIERRE-CAP-005-R1 — Cierre estratégico y metodológico
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** CIERRE-CAP-005-R1  
**Tipo:** Cierre estratégico — consolidación epistemológica y metodológica  
**Estado:** VIGENTE  
**Fecha:** 2026-05-28  
**Bloque cerrado:** BLOQUE-005 — `#fase-2-contenido`  
**Fuente auditada:** index.html l.2833–l.3821  

---

## ÍNDICE

1. Estado formal de CAP-005-R1
2. Evaluación del régimen LINEAL AUMENTADO
3. Evaluación de las extensiones EXT-01 / EXT-02 / EXT-03
4. Evaluación de la taxonomía multicapa por capa
5. Consolidación de hallazgos transversales críticos
6. Evaluación de coexistencias v1/v2
7. Evaluación de la persistencia Firebase
8. Evaluación del runtime reactivo y onchange vacío
9. Evaluación de overlays y estructuras latentes
10. Riesgos metodológicos persistentes
11. Riesgos epistemológicos
12. Límites de auditabilidad estática
13. Necesidades de verificación runtime
14. Impacto estratégico
15. Veredicto formal y consecuencias para el sistema

---

## 1. ESTADO FORMAL DE CAP-005-R1

### 1.1 Datos de cierre

| Campo | Valor |
|-------|-------|
| Artefacto | CAP-005-R1 |
| Estado | CONGELABLE_CON_OBSERVACIONES |
| Rango auditado | l.2833–l.3821 |
| Total de líneas | 989 (verificado aritméticamente) |
| Cobertura | 100% (MR-067 a MR-081, 15 de 15 micro-rangos) |
| Iteraciones de producción | 2 (entrega 1: l.2833–l.3050; entrega 2: l.3051–l.3821) |
| Fecha de inicio | 2026-05-28 |
| Fecha de cierre | 2026-05-28 |

### 1.2 Contadores al cierre

| Tipo | Último usado | Próximo disponible |
|------|-----------|--------------------|
| MR | MR-081 | MR-082 |
| ENT | ENT-092 | ENT-093 |
| REL | REL-064 | REL-065 |
| CON | CON-044 | CON-045 |
| GAP | GAP-051 | GAP-052 |
| DV | DV-025 | DV-026 |

### 1.3 Justificación del estado CONGELABLE_CON_OBSERVACIONES

La cartografía estructural cubre la totalidad del rango (989/989 líneas). Las observaciones activas son brechas de auditabilidad inherentes a la capa IA y a la arquitectura PER-Firebase, no defectos de la cartografía. Ninguna observación activa es bloqueante per MARCO-METODOLOGICO-CARTOGRAFIA-R1 §9. El criterio específico:

- **DV-023** (7 `onchange=""` vacíos): deuda observable documentada sin prescripción. No bloquea.
- **DV-025** (DV-COEX par v1/v2): completamente documentada con EXT-03. No bloquea.
- **GAP-045 y GAP-051** (GAP-IA-ENGINE): inherentes a la imposibilidad de auditar motores JS desde HTML estático. El MARCO-METODOLOGICO §6 reconoce este límite como estructural, no como deficiencia metodológica.
- **GAP-040/041** (Firebase): la ruta Firebase no es auditable desde HTML estático per definición. GAP registrado correctamente.

El bloque NO puede pasar a EXPEDIENTE_CERRADO sin los artefactos de cierre completos (CHK-005, ARB-005, DERIVABILIDAD-CAP-005, este CIERRE). La transición a EXPEDIENTE_CERRADO queda fuera del alcance de este documento.

---

## 2. EVALUACIÓN DEL RÉGIMEN LINEAL AUMENTADO

### 2.1 Veredicto sobre la adecuación del régimen

El régimen LINEAL AUMENTADO, propuesto en ESTRUCTURA-CAP-005-R1 §10 y formalizado en ESTABILIZACION-MULTICAPA-R1, ha demostrado ser adecuado para auditar BLOQUE-005.

**Evidencia de adecuación:**

1. **Cobertura completa sin ruptura taxonómica.** Las 989 líneas fueron cubiertas con los 15 MR planificados, sin necesidad de nuevas categorías fuera de las previstas por EXT-01/02/03.
2. **Captura de complejidad multicapa.** La combinación de CAPA_DOMINANTE + CAPAS_SECUNDARIAS en cada ENT produjo un inventario semánticamente rico que el régimen lineal simple no habría podido generar.
3. **Gestión de los 11 CONs con `inline-display-none`.** EXT-02 permitió distinguir los 11 contratos con `display:none` inline de los 12 contratos previos (CAP-001 a CAP-004) basados en clase CSS, sin crear una nueva categoría CON — solo un nuevo valor en el campo `mecanismo`.
4. **Documentación del par v1/v2 mediante DV-COEX.** EXT-03 capturó la coexistencia del par IA v1/v2 sin fragmentar el análisis ni crear nuevas entidades de relación.

**Limitaciones observadas:**

1. **El régimen no captura dependencias cruzadas entre capas.** Las relaciones entre, por ejemplo, la capa PER (guardarTodoFirebase) y la capa IA (generarAnalisisIA) son FUERA_DEL_RANGO_AUDITADO en su dimensión de integración. El régimen documenta cada capa por separado pero no el grafo de dependencias entre capas.
2. **La densidad de MR-080 (253 líneas) rozó el límite metodológico.** MARCO-METODOLOGICO §8.2 establece que bloques >300 líneas deben justificarse explícitamente. MR-080 quedó por debajo del umbral pero con una densidad de estados UI y funciones JS que hace este micro-rango el más complejo documentado hasta la fecha.
3. **Los GAP-IA-ENGINE son brechas estructuralmente irresolubles desde HTML.** El régimen genera GAPs correctos pero no ofrece mecanismos para cerrarlos sin acceso al código JS.

### 2.2 Comparación con regímenes anteriores

| Dimensión | CAP-001 a CAP-004 (régimen lineal simple) | CAP-005 (régimen LINEAL AUMENTADO) |
|-----------|------------------------------------------|--------------------------------------|
| Superficies dinámicas (SURFs) | 3 en total (CAP-004) | 43 en BLOQUE-005 |
| Funciones JS referenciadas | ~15 en CAP-004 | ~44 en BLOQUE-005 |
| Contratos de visibilidad (CON) | mecanismo clase-CSS exclusivo | clase-CSS + inline-display-none + atributo-disabled |
| Capas simultáneas por entidad | 1 implícita (no documentada) | 2–5 explícitas por ENT |
| Coexistencias documentadas | 0 | 2 pares v1/v2 (DV-025, H-003) |
| Anomalías transversales formalizadas | 0 | 5 (T001–T005 de ESTRUCTURA-CAP-005-R1) |
| Dependencias externas de plataforma | 0 | 3 (Firebase, REDCap, Anthropic/Claude) |

El incremento de complejidad no es lineal respecto al número de líneas (989 vs. ~300 de CAP-004) — es cualitativo. BLOQUE-005 no es más largo que bloques anteriores proporcionales: es arquitectónicamente más denso per unidad de línea.

---

## 3. EVALUACIÓN DE LAS EXTENSIONES EXT-01 / EXT-02 / EXT-03

### 3.1 EXT-01 — CAPA_DOMINANTE + CAPAS_SECUNDARIAS en ENT

**Estado:** APLICADA CORRECTAMENTE en los 43 ENTs de CAP-005-R1.

**Valor metodológico demostrado:** La distinción CAPA_DOMINANTE / CAPAS_SECUNDARIAS permitió identificar que ninguna entidad del bloque es puramente UI-S: incluso los elementos más estáticos (badges de leyenda, estructuras contenedoras) heredan capas dinámicas de sus hijos. Esto es evidencia estructural de que BLOQUE-005 es fundamentalmente un bloque dinámico con recubrimiento estático mínimo.

**Patrón inesperado:** 11 de los 43 ENTs tienen como CAPA_DOMINANTE IA (exclusivamente en MR-080 y MR-081). Esto es notable porque confirma que el acordeón 07 (en ambas versiones) no es simplemente un UI más — es una entidad arquitectónica de primer orden en el sistema.

**Recomendación para CAP-006+:** EXT-01 debe mantenerse como obligatoria. La información de capa ha demostrado ser diferencial, no redundante.

### 3.2 EXT-02 — mecanismo en CON

**Estado:** APLICADA CORRECTAMENTE en los 12 CONs de CAP-005-R1 (CON-033 a CON-044).

**Distribución por mecanismo:**

| mecanismo | Instancias | CONs |
|-----------|-----------|------|
| `inline-display-none` | 10 | CON-033 a CON-038, CON-040, CON-042 a CON-044 |
| `atributo-disabled` | 1 | CON-039 |
| `clase-CSS` | 1 | CON-041 |

**Hallazgo estructural:** el mecanismo `inline-display-none` supera al mecanismo `clase-CSS` (10 vs. 1) en BLOQUE-005. Esto es la inversión exacta del patrón de bloques anteriores (donde `clase-CSS` dominaba). La inversión no es aleatoria: los estados ocultos de máquinas IA (`display:none` inline) se controlan desde JS, no desde clases CSS — lo que refleja una arquitectura de estado más imperativa que declarativa en la capa IA.

**Implicación para modificabilidad:** cambiar el estado de un CON con `clase-CSS` (como en CAP-003/004) requiere tocar la lógica CSS. Cambiar el estado de un CON con `inline-display-none` (como en CAP-005) requiere tocar JS directamente — mayor acoplamiento, menor separación de responsabilidades.

**Recomendación para CAP-006+:** EXT-02 debe mantenerse. El campo `mecanismo` es diagnóstico de la arquitectura de estado del bloque.

### 3.3 EXT-03 — DV-COEX para coexistencias v1/v2

**Estado:** APLICADA correctamente en DV-025 (par `#seccion-analisis-ia` / `#at2-bloque`).

**Cobertura:** EXT-03 cubrió el caso declarado en APERTURA-CAP-005-AUDITADA OBS-005. La coexistencia `ibse_v2_abrir()` duplicado (H-003 en VALIDACION-ESTRUCTURAL) es una coexistencia de comportamiento UI, no de versiones completas del sistema, y fue documentada como observación en MR-072 sin EXT-03 aplicada — decisión metodológicamente correcta, ya que EXT-03 se reserva para pares de sistemas completos, no para botones duplicados.

**Evaluación crítica:** el criterio de aplicación de EXT-03 quedó implícito en la práctica. Recomendación: formalizar el umbral de EXT-03 en MARCO-METODOLOGICO como: *"EXT-03 se aplica cuando dos versiones completas de un sistema (con estados, funciones y contenedores propios) coexisten en el DOM simultáneamente."* Un único botón duplicado no califica.

---

## 4. EVALUACIÓN DE LA TAXONOMÍA MULTICAPA POR CAPA

### 4.1 Capa UI-S — Infraestructura presentacional estática

**Presencia en BLOQUE-005:** omnipresente como capa secundaria; raramente dominante.

**Hallazgo:** en BLOQUE-005 no existe ningún ENT con CAPA_DOMINANTE UI-S pura. Los elementos aparentemente estáticos (headers de sub-panel, badges de fiabilidad, etiquetas) son siempre secundarios respecto a una capa funcional dominante. Esto contrasta con CAP-001 (CSS) y CAP-003 (elementos de navegación) donde UI-S era dominante en múltiples ENTs.

**Interpretación:** BLOQUE-005 es un bloque de código funcionalmente denso donde no existe "decoración estática" en sentido estricto — todo elemento observable tiene función o capa dinámica asociada. La leyenda de fiabilidad (MR-069), aparentemente estática, es UI-S pero sirve como contexto semántico de un sistema dinámico de carga de fuentes.

### 4.2 Capa UI-D — Interfaz dinámica activable

**Presencia:** en todos los segmentos con excepción de SEG-A, SEG-C, SEG-F.

**Hallazgo principal:** UI-D es la capa más uniformemente distribuida del bloque. Aparece en el panel de carga (MR-070 a MR-077), en los acordeones del perfil (MR-078 a MR-081), y en ambas versiones del motor IA. Esto confirma que BLOQUE-005 es fundamentalmente un bloque de interacción, no de visualización.

**Anomalía observada:** los 7 inputs del Marco estratégico (MR-076) son UI-D con CAPA_DOMINANTE PER, pero sus manejadores `onchange=""` están vacíos (DV-023). Esto produce una situación paradójica: la capa UI-D está presente (los inputs son interactivos por defecto del navegador) pero el contrato entre UI-D y PER no está implementado en HTML estático.

### 4.3 Capa RT — Runtime reactivo

**Presencia:** la capa RT aparece en 38 de los 43 ENTs como capa dominante o secundaria. Es la capa más extendida del bloque.

**Hallazgo:** RT en BLOQUE-005 tiene dos modalidades distintas que el sistema de capas no distingue actualmente:

- **RT-hidratación:** un div vacío que JS poblará con contenido generado (acordeones 01–06, `#ia-conclusiones`, etc.).
- **RT-estado:** un div con placeholder que JS actualizará según el estado del sistema (`#estado-informe`, `#ia-check-*`, etc.).

Ambas son RT pero tienen implicaciones de modificabilidad diferentes: RT-hidratación vacía es segura de modificar en layout (el contenido viene de JS); RT-estado con placeholder tiene texto hardcodeado que puede quedar huérfano si el estado JS cambia.

**Recomendación:** en bloques futuros, considerar sub-tipo RT-HIDRATACION vs. RT-ESTADO como qualifiers de SURF (no como capas nuevas — esto cae dentro de EXT-01).

### 4.4 Capa PER — Persistencia

**Presencia:** 6 ENTs con PER como capa dominante o secundaria. Concentrada en MR-071, MR-076, MR-080.

**Evidencia de PER en BLOQUE-005:**

| Función | Línea | Tipo de PER | Calificador |
|---------|-------|------------|------------|
| `COMPAS_guardarInforme()` | l.2936 | PER nominal | FUERA_DEL_RANGO_AUDITADO |
| `guardarTodoFirebase()` | l.3231 | PER Firebase explícita | FUERA_DEL_RANGO_AUDITADO |
| `borrarDatosMunicipio()` | l.3235 | PER destructiva | FUERA_DEL_RANGO_AUDITADO |
| `COMPAS_limpiarEstudiosComplementarios()` | l.3353 | PER destructiva + Firebase | FUERA_DEL_RANGO_AUDITADO |
| `guardarApiKey(this.value)` | l.3558 | PER de credencial | FUERA_DEL_RANGO_AUDITADO |
| `#btn-guardar-analisis-ia` (disabled) | l.3608 | PER latente (LAT-DISABLED) | FUERA_DEL_RANGO_AUDITADO |

**Hallazgo crítico:** BLOQUE-005 es el primer bloque auditado con persistencia destructiva observable (`borrarDatosMunicipio`, `COMPAS_limpiarEstudiosComplementarios`). Las acciones destructivas están declaradas en atributos HTML directamente observables — no están ocultas en JS. Esto es evidencia de que el sistema confía en la UI (y no solo en la lógica JS) para comunicar el carácter destructivo de las operaciones.

**Evaluación epistemológica:** la capa PER en BLOQUE-005 está completamente confirmada por evidencia nominal (E4: nombre de función) pero NINGUNA de sus rutas de persistencia es verificable desde HTML estático. Todo lo relativo a la estructura de datos Firebase, el payload de guardado, y el alcance del borrado son GAP-PERSISTENCE no auditables sin acceso al código JS.

### 4.5 Capa IA — Inteligencia artificial

**Presencia:** exclusivamente en MR-080 y MR-081 (acordeones 07 v1 y v2). Primera aparición de la capa IA en el rango auditado total (CAP-001 a CAP-005).

**Hallazgo arquitectónico:** la capa IA no es una capa transversal del bloque — es una capa localizada en dos entidades hermanas (v1 y v2 del mismo acordeón). Esto tiene implicaciones de gobierno importantes: la IA en COMPÁS no está dispersa por la interfaz, está concentrada en un único punto de entrada (el acordeón 07) con una arquitectura de sustitución ya iniciada (v2 latente).

**Topografía IA observada:**

```
CAPA IA — estructura observada en HTML estático:

Punto de entrada único
└── Acordeón 07 v1 (#seccion-analisis-ia) — ACTIVO, .abierto
    ├── Checklist de 6 fuentes (#ia-check-*)   → RT
    ├── Evidencia territorial (#evidencia-territorial-ref) → LAT-HIDDEN
    ├── 3 checkboxes de selección de fuentes   → UI-D
    ├── Bloque API key (#ia-apikey-bloque)      → LAT-HIDDEN (PER)
    ├── Motor: generarAnalisisIA()              → GAP-IA-ENGINE
    └── 3 estados UI: inicial/progreso/resultado
        ├── #ia-estado-inicial                 → visible
        ├── #ia-progreso                       → LAT-HIDDEN
        └── #ia-resultado                      → LAT-HIDDEN
            ├── #btn-guardar-analisis-ia        → LAT-DISABLED
            └── Receptores: #ia-conclusiones/recomendaciones/prioridades

└── Acordeón 07 v2 (#at2-bloque) — LATENTE, display:none
    ├── Lectura de fuentes (#at2-fuentes-lectura) → RT
    ├── Motor: at2_generar()                    → GAP-IA-ENGINE
    └── 3 estados UI: inicial/proceso/resultado
        ├── #at2-inicial                       → visible (dentro del bloque oculto)
        ├── #at2-proceso                       → LAT-HIDDEN
        └── #at2-resultado                     → LAT-HIDDEN
            └── Receptores: #at2-conclusiones/recomendaciones/prioridades
```

**Evaluación crítica:** la arquitectura IA de BLOQUE-005 es observable en su estructura pero opaca en su funcionamiento. Lo que el HTML estático revela:

- Evidencia: el sistema integra hasta 6 fuentes documentales para el análisis (checklist).
- Evidencia: existe selección de fuentes de priorización (3 checkboxes).
- Evidencia: hay arquitectura dual (motor local + API Claude).
- No verificable: qué motor se usa por defecto; qué hace `generarAnalisisIA()`; si ambas versiones usan el mismo motor.

**Riesgo de gobernanza IA:** el campo `#anthropic-api-key` tipo "password" con `oninput="guardarApiKey(this.value)"` sugiere que la API key se persiste en tiempo real con cada keystroke. El destino de esa persistencia (localStorage, sessionStorage, Firebase) es no verificable desde HTML, pero su sensibilidad es evidente: es una credencial de integración con Anthropic.

### 4.6 Capa LEG — Legacy / arqueología funcional activa

**Presencia:** 11 ENTs con LEG como capa dominante o secundaria.

**Inventario de evidencias LEG en BLOQUE-005:**

| Entidad | Tipo evidencia LEG | Subtipo LAT |
|---------|-------------------|-------------|
| `#panel-carga-datos` | E-LEG-1 (display:none) | LAT-HIDDEN |
| `#ibse-badge-fuente` | E-LEG-1 | LAT-HIDDEN |
| btn Monitor IBSE (desactivado) | E-LEG-2 (comentario 2026-04-17) | LAT-HIDDEN |
| `#panel-ibse-visual-legacy` | E-LEG-1 + E-LEG-4 (-legacy en ID) | LAT-LEGACY |
| `ibse_v2_abrir()` duplicado visible | — (UI-D activa pero coexiste) | — |
| `#ia-apikey-bloque` | E-LEG-1 | LAT-HIDDEN |
| `#ia-apikey-ok` | E-LEG-1 | LAT-HIDDEN |
| `#ia-progreso` | E-LEG-1 | LAT-HIDDEN |
| `#ia-resultado` | E-LEG-1 | LAT-HIDDEN |
| `#btn-guardar-analisis-ia` | E-LEG-3 (disabled) | LAT-DISABLED |
| `#at2-bloque` | E-LEG-1 + E-LEG-2 (comentario convivencia) + E-LEG-5 (coexistencia v2) | LAT-LEGACY |

**Divergencia controlada C-002 (de VALIDACION-ESTRUCTURAL):** los estados `#ia-progreso`, `#ia-resultado`, `#at2-proceso`, `#at2-resultado` tienen `display:none` pero son estados de máquina UI, no legacy en sentido arqueológico. CAP-005-R1 los clasificó como LAT-HIDDEN correctamente — el criterio E-LEG-1 se aplica al `display:none` como estado inicial estructural, independientemente de si la ocultación es "legado" o "estado de proceso". La divergencia C-002 es metodológicamente real pero no modifica la clasificación: LAT-HIDDEN abarca ambos casos (estados de proceso ocultos Y legado arqueológico oculto).

**Recomendación para ESTABILIZACION-MULTICAPA-R2:** considerar sub-tipificar LAT-HIDDEN en LAT-ESTADO (componente de máquina UI) y LAT-ARQU (elemento legado sin activación prevista inmediata) para separar semánticamente `#ia-progreso` de `#panel-ibse-visual-legacy`.

---

## 5. CONSOLIDACIÓN DE HALLAZGOS TRANSVERSALES CRÍTICOS

### 5.1 DV-COEX y la doble versión del motor de diagnóstico

DV-025 documenta el par v1/v2 del acordeón 07. Es la primera DV-COEX del rango auditado total y representa un cambio cualitativo respecto a las deudas de bloques anteriores.

**Naturaleza de la coexistencia:** no es una coexistencia accidental o residual. El comentario HTML de v2 (`"Convivencia: display:none hasta activación. Legacy intacto arriba."`, l.3687–3690) es una declaración explícita de diseño intencional. El sistema conoce que tiene dos versiones y ha tomado la decisión de mantenerlas activas simultáneamente durante la transición.

**Implicaciones para el gobierno del sistema:**

1. La activación de v2 requiere desactivar v1. Este mecanismo no está observable en HTML — es FUERA_DEL_RANGO_AUDITADO y representa el GAP más crítico del bloque.
2. Las dos versiones tienen semántica parcialmente diferente: v1 usa nomenclatura "Análisis IA" (motor Anthropic explícito); v2 usa "Diagnóstico Territorial" (denominación institucional). Esto sugiere que la transición v1→v2 no es solo técnica sino también de governance terminológica.
3. La barra de progreso de v2 (`#at2-proceso-barra`, `width:0%`) es más sofisticada que el spinner de v1 — evidencia de iteración de UX entre versiones.

### 5.2 LAT-LEGACY como señal de arqueología operacional activa

BLOQUE-005 tiene la mayor concentración de LAT (11 elementos) del rango auditado total. Esto no es indicativo de deuda técnica acumulada — es indicativo de un sistema en transición activa.

La distinción es importante epistemológicamente:
- **Deuda técnica pasiva** (no documentada, sin intención): `#panel-ibse-visual-legacy` — el propio nombre del ID sugiere que fue nombrado en un momento posterior a su desactivación.
- **Transición activa intencional** (documentada, con hoja de ruta implícita): `#at2-bloque` — el comentario de convivencia indica que la versión v2 está lista pero no activada, esperando una condición externa.
- **Estado de máquina** (ni legado ni deuda): `#ia-progreso`, `#ia-resultado` — estados normales de un flujo UI de 3 pasos.

### 5.3 GAP-IA-ENGINE como límite estructural del sistema cartográfico

GAP-045 (`generarAnalisisIA`) y GAP-051 (`at2_generar`) representan una clase de brecha que el sistema cartográfico actual no puede cerrar sin acceso al código JS. Esto no es una limitación metodológica sino una limitación del objeto de auditoría: HTML estático describe estructura, no comportamiento.

**Consecuencia para la gobernanza:** el sistema COMPÁS tiene un motor de análisis IA que opera sobre hasta 6 fuentes documentales pero cuyo funcionamiento interno es completamente opaco desde HTML. Cualquier evaluación de la calidad del análisis IA requiere acceso a la implementación JS — no está en el alcance de la cartografía CAP.

### 5.4 GAP-STATE-MACHINE como patrón emergente

BLOQUE-005 introduce por primera vez el subtipo GAP-STATE-MACHINE. Con 9 instancias (GAP-037 a GAP-049, excluyendo los IA-ENGINE), este subtipo revela que el sistema tiene múltiples máquinas de estado parcialmente observable — se puede ver el número de estados y el estado inicial, pero no las transiciones.

**Patrón de máquinas de estado en BLOQUE-005:**

| Máquina | Estados observados | Estado inicial | Transiciones |
|---------|-------------------|----------------|-------------|
| IA v1 (`#ia-estado-inicial` / `#ia-progreso` / `#ia-resultado`) | 3 | estado-inicial (visible) | FUERA_DEL_RANGO |
| AT2 v2 (`#at2-inicial` / `#at2-proceso` / `#at2-resultado`) | 3 | at2-inicial (visible dentro de bloque oculto) | FUERA_DEL_RANGO |
| API key (`#ia-apikey-bloque` / `#ia-apikey-ok`) | 2 | apikey-bloque (oculto) | FUERA_DEL_RANGO |
| Estado de cargo ×5 (`#estado-informe`, `#estado-determinantes`, etc.) | 2 (cargado / sin cargar) | sin cargar | FUERA_DEL_RANGO |
| Panel de carga (`#panel-carga-datos`) | 2 (oculto / visible) | oculto | FUERA_DEL_RANGO |

**Hallazgo de diseño:** todas las máquinas de estado de BLOQUE-005 tienen el estado "incompleto" o "sin datos" como estado inicial visible. El sistema nunca llega pre-cargado con datos: el usuario siempre empieza desde cero. Esta es una decisión de diseño observable desde HTML.

---

## 6. EVALUACIÓN DE COEXISTENCIAS v1/v2

### 6.1 Taxonomía de coexistencias en BLOQUE-005

BLOQUE-005 contiene tres casos distintos de coexistencia, con naturalezas diferentes:

**Caso A — Coexistencia de sistema completo (DV-025):**
- Acordeón 07 v1 (`#seccion-analisis-ia`) vs. acordeón 07 v2 (`#at2-bloque`)
- Ambas versiones tienen UI completa, estados, funciones, y receptores de resultado
- La coexistencia es intencional y documentada en el comentario HTML
- Evidencia: E-LEG-5 (versiones coexistentes), E3 (comentario de convivencia)
- Riesgo: activación simultánea accidental produciendo dos "07" visibles

**Caso B — Coexistencia de botón duplicado (H-003 de VALIDACION-ESTRUCTURAL):**
- `ibse_v2_abrir()` visible ("📊 Local") vs. `ibse_v2_abrir()` oculto (desactivado temporalmente 2026-04-17)
- Mismo destino funcional, dos botones con estados UI distintos
- La coexistencia es documentada en el comentario de desactivación
- No es DV-COEX sino DV de botón duplicado (no documentada como DV independiente en CAP-005-R1; documentada como observación en MR-072)
- **Laguna de documentación:** esta coexistencia no recibió DV propia. El cartógrafo optó por documentarla en la descripción del MR — decisión válida pero que reduce su trazabilidad futura.

**Caso C — Legacy sin sucesor activo (`#panel-ibse-visual-legacy`):**
- Panel legacy vacío con `display:none`; el activo está declarado en `#seccion-estudios-complementarios` (por comentario)
- No hay dos versiones activas — hay un elemento desactivado cuyo sucesor está en otro lugar
- Es LAT-LEGACY pero no DV-COEX

**Conclusión:** EXT-03 (DV-COEX) debe aplicarse únicamente al Caso A. El Caso B merece su propia DV (pendiente de apertura en futuro mantenimiento). El Caso C es LAT-LEGACY sin DV-COEX.

### 6.2 Riesgo de la coexistencia IA v1/v2

La coexistencia IA v1/v2 es, de todos los hallazgos del bloque, el de mayor riesgo de gobernanza para el sistema a largo plazo. Las razones:

1. **Duplicidad semántica de resultados:** conclusiones/recomendaciones/prioridades existen en dos lugares del DOM simultáneamente. Un error en la activación de v2 sin desactivar v1 producirá una experiencia de usuario incoherente.
2. **Diferencia de UX no documentada:** v1 tiene checkboxes de selección de fuentes; v2 no. v1 tiene campo de API key; v2 no. Esta diferencia es observable pero su razón de diseño no es inferible desde HTML.
3. **El mecanismo de transición v1→v2 es el GAP más crítico del bloque.** Sin saber qué activa la transición, el sistema queda en un estado de gobierno incompleto.

---

## 7. EVALUACIÓN DE LA PERSISTENCIA FIREBASE

### 7.1 Evidencias de Firebase en BLOQUE-005

| Evidencia | Línea | Tipo | Calificador |
|-----------|-------|------|------------|
| `guardarTodoFirebase()` | l.3231 | Función de escritura | FUERA_DEL_RANGO_AUDITADO |
| `"Se borran datos locales y de Firebase."` | l.3353 | Texto de UI (confirmación) | OBSERVABLE (E1) |
| `COMPAS_limpiarEstudiosComplementarios()` | l.3353 | Función de borrado PER | FUERA_DEL_RANGO_AUDITADO |
| `borrarDatosMunicipio()` | l.3235 | Función de borrado PER | FUERA_DEL_RANGO_AUDITADO |

BLOQUE-005 introduce Firebase como plataforma de persistencia del sistema COMPÁS. Es la primera evidencia de Firebase en el rango auditado total (CAP-001 a CAP-005). 

### 7.2 Lo que el HTML revela sobre el modelo de persistencia

**Observable:**
- COMPÁS usa Firebase como back-end de persistencia (confirmado por nombre de función con plataforma explícita).
- La persistencia opera a nivel de municipio (`borrarDatosMunicipio`, `actualizarMunicipio`).
- Existen tanto operaciones de escritura como de borrado destructivo.
- El borrado de estudios complementarios afecta simultáneamente a datos locales y Firebase.

**No observable desde HTML:**
- La ruta Firebase (colección/documento/campo).
- El payload de `guardarTodoFirebase()` — si guarda solo la configuración del marco estratégico o todo el estado de FASE 2.
- Si `borrarDatosMunicipio()` borra solo la configuración o todos los datos de FASE 2 del municipio.
- Si existe autenticación antes de las operaciones de escritura/borrado.

### 7.3 Riesgo crítico: acciones destructivas sin confirmación observable

`borrarDatosMunicipio()` (l.3235) no tiene ningún mecanismo de confirmación observable en HTML (a diferencia de `COMPAS_limpiarEstudiosComplementarios()` que sí usa `confirm()`). Esto es un riesgo de UX potencialmente grave: el botón "🗑️ Borrar datos" puede ejecutarse con un click sin ninguna barrera de protección visible en el HTML estático.

**Estado epistemológico:** es posible que `borrarDatosMunicipio()` tenga confirmación en su implementación JS. Pero el HTML no lo declara. La disparidad entre los dos patrones (con y sin `confirm()`) en el mismo sub-panel es observable y debe registrarse como riesgo metodológico.

---

## 8. EVALUACIÓN DEL RUNTIME REACTIVO Y onchange VACÍO

### 8.1 Taxonomía de triggers de evento en BLOQUE-005

| Tipo de trigger | Instancias | Patrón |
|-----------------|-----------|--------|
| `onclick` | ~30 | Activación explícita por usuario |
| `onchange` (con función) | 4 (sub-paneles 4, 5, informe) | Activación automática en cambio de archivo |
| `oninput` (con función) | 1 (`guardarApiKey`) | Activación reactiva en tiempo real |
| `onchange=""` (VACÍO) | 7 (Marco estratégico) | Atributo presente sin función — DV-023 |

### 8.2 DV-023: los 7 onchange="" vacíos

El sub-panel 6 (Marco estratégico) tiene 7 inputs con `onchange=""` vacío. Esta es la única DV específicamente asignada a un patrón de handler en BLOQUE-005.

**Evaluación epistemológica:** no puede determinarse desde HTML si:
- Los handlers vacíos son intencionales (el guardado se hace manualmente via botón Firebase).
- Los handlers vacíos son residuos de una refactorización donde los handlers se movieron al botón explícito.
- Los handlers vacíos están planificados para una implementación futura de autoguardado.

**Lo observable:** el contraste con `oninput="guardarApiKey(this.value)"` en el mismo bloque es significativo. El campo de API key usa `oninput` reactivo (guarda en tiempo real), mientras que los 7 campos de configuración tienen `onchange=""` inerte. La API key tiene mayor prioridad de persistencia reactiva que la configuración del plan.

**Implicación para mantenimiento:** si se implementa autoguardado en los 7 campos en el futuro, el patrón correcto debería ser `oninput` o `onchange` con debounce, consistente con el patrón del campo API key — no `onchange` puro que puede dispararse con lag.

---

## 9. EVALUACIÓN DE OVERLAYS Y ESTRUCTURAS LATENTES

### 9.1 Resolución de la divergencia C-001: ¿es #panel-carga-datos un OVL?

VALIDACION-ESTRUCTURAL-CAP-005-R1 planteó como divergencia metodológica (C-001) que `#panel-carga-datos` fue clasificado como OVL en CAP-005-R1 pero no tiene `position:fixed`, `position:absolute`, `z-index` ni overlay backdrop visible en HTML estático.

**Evaluación a cierre:**

CAP-005-R1 clasificó `#panel-carga-datos` como OVL. La VALIDACION-ESTRUCTURAL propuso degradarlo a LAT/UI-D/PER con nota PROBABLE_OVL. Esta divergencia requiere resolución formal.

**Resolución:** la clasificación OVL de `#panel-carga-datos` en CAP-005-R1 **no contradice** la VALIDACION-ESTRUCTURAL si se adopta la definición ESTABILIZACION-MULTICAPA-R1 §2.3 (OVL como panel con activador externo, contenedor oculto con display:none, y botón de cierre propio). Los tres criterios están presentes:
- Activador externo: `togglePanelCargaDatos()` en l.2859.
- Contenedor oculto: `display:none` en l.2888.
- Cierre interno: botón ✕ con `togglePanelCargaDatos()` en l.2902.

La superposición visual modal es un criterio de UX (runtime), no de HTML estático. La cartografía no puede pronunciarse sobre si el panel se superpone o se inserta inline — eso es FUERA_DEL_RANGO_AUDITADO. La clasificación OVL es correcta como clasificación de estructura HTML observable; la pregunta de si visualmente es un "overlay real" queda para verificación runtime (sección 13).

**Decisión de cierre:** la clasificación OVL de `#panel-carga-datos` en CAP-005-R1 se considera **CONFIRMADA CON CALIFICADOR PENDIENTE_VERIFICACION_RUNTIME**. No se retroactiva la clasificación.

### 9.2 Densidad de estructuras latentes: cambio de paradigma

BLOQUE-005 tiene 11 estructuras LAT. Los bloques CAP-001 a CAP-004 tenían 4 en total (acumulados). Esto representa un cambio cualitativo: el sistema COMPÁS en FASE 2 opera mediante visibilidad condicional generalizada, no como excepción.

**Consecuencia para la estrategia de modificación:** cualquier intervención de refactorización en BLOQUE-005 debe partir del principio de que al menos 11 elementos son invisibles en carga inicial y tienen lógica de activación en JS. El riesgo de "invisible en HTML pero activo en runtime" es permanente y transversal.

---

## 10. RIESGOS METODOLÓGICOS PERSISTENTES

Los siguientes riesgos fueron identificados durante la auditoría y no están resueltos por la cartografía estática.

### RM-001 — Motor IA sin auditabilidad

**Descripción:** `generarAnalisisIA()` y `at2_generar()` son las funciones más críticas del bloque (generan el producto principal de FASE 2) y son completamente opacas desde HTML. No es posible evaluar la calidad, fiabilidad, o seguridad del análisis desde la cartografía estática.

**Nivel de riesgo:** MUY ALTO  
**Calificador:** ESTRUCTURALMENTE_IRRESOLUBLE_DESDE_HTML  
**Mitigación posible:** auditoría JS específica del motor de análisis (fuera del alcance de CAP).

### RM-002 — Persistencia destructiva sin trazabilidad de alcance

**Descripción:** `borrarDatosMunicipio()` y `COMPAS_limpiarEstudiosComplementarios()` tienen efectos destructivos en Firebase pero sus alcances no son verificables desde HTML. Una implementación incorrecta podría borrar datos de municipios erróneos, fuentes no relacionadas, o producir estados inconsistentes.

**Nivel de riesgo:** ALTO  
**Calificador:** FUERA_DEL_RANGO_AUDITADO  
**Mitigación posible:** test de integración con Firebase en entorno de staging (fuera del alcance de CAP).

### RM-003 — Activación simultánea accidental de v1 y v2

**Descripción:** si el mecanismo de transición v1→v2 falla (o no desactiva v1 antes de mostrar v2), el usuario verá dos acordeones "07" simultáneamente con resultados diferentes. El HTML no protege contra este escenario.

**Nivel de riesgo:** MEDIO  
**Calificador:** FUERA_DEL_RANGO_AUDITADO  
**Mitigación posible:** verificación del script de activación de v2 (fuera del alcance de CAP).

### RM-004 — Credencial API key con persistencia reactiva

**Descripción:** `guardarApiKey(this.value)` se llama con cada `oninput` del campo de contraseña. El destino de persistencia no es verificable. Si la clave se guarda en localStorage o en un objeto global no protegido, existe un riesgo de exposición de credencial.

**Nivel de riesgo:** ALTO (desde perspectiva de seguridad de credenciales)  
**Calificador:** PARCIALMENTE_OBSERVABLE — la persistencia reactiva es observable; el destino es FUERA_DEL_RANGO_AUDITADO.

### RM-005 — `borrarDatosMunicipio()` sin confirmación HTML observable

**Descripción:** a diferencia de `COMPAS_limpiarEstudiosComplementarios()` (que usa `confirm()` antes de llamar a la función), `borrarDatosMunicipio()` no tiene ninguna barrera de confirmación visible en HTML. Si la implementación JS tampoco la tiene, el borrado es un click destructivo sin protección.

**Nivel de riesgo:** ALTO  
**Calificador:** PARCIALMENTE_OBSERVABLE — ausencia de `confirm()` es observable; comportamiento del JS no lo es.

---

## 11. RIESGOS EPISTEMOLÓGICOS

Los riesgos epistemológicos son aquellos que afectan a la interpretación de la cartografía, no al sistema auditado.

### RE-001 — Riesgo de convertir evidencia nominal PER en ruta verificada

La presencia de `guardarTodoFirebase()` en el HTML confirma que existe la intención de persistencia, pero NO confirma que la función persiste correctamente o que el destino Firebase está correctamente configurado. Ninguna afirmación sobre la estructura de datos de Firebase puede hacerse desde la cartografía estática.

**Regla epistemológica aplicada correctamente en CAP-005-R1:** todas las referencias a Firebase están calificadas como FUERA_DEL_RANGO_AUDITADO.

### RE-002 — Riesgo de convertir comentarios E3 en comportamiento verificado

Los comentarios HTML de BLOQUE-005 son inusualmente ricos en información de arquitectura (ANOMALÍA-T005 en ESTRUCTURA-CAP-005-R1). El riesgo es tomarlos como documentación de comportamiento confirmado, cuando son declaraciones de intención que pueden o no coincidir con la implementación JS.

**Caso crítico:** el comentario `"No alimenta motores, propuestaEPVSA ni scores. Solo lectura DOM."` en `#evidencia-territorial-ref` (l.3497–3499) declara un comportamiento de aislamiento de datos. Si la implementación JS viola este contrato declarado, el HTML no puede detectarlo.

**Regla epistemológica:** los comentarios E3 son evidencia de intención de diseño, no de comportamiento ejecutado.

### RE-003 — Riesgo de sobreclasificación LEG por E-LEG-1

E-LEG-1 (`display:none` estructural) puede clasificar incorrectamente estados de máquina UI como "legacy". `#ia-progreso` no es legado — es un estado normal de procesamiento. La clasificación LAT-HIDDEN es correcta, pero la asociación con LEG puede crear la impresión de que el sistema tiene más "deuda técnica" de la que realmente tiene.

**Evaluación en CAP-005-R1:** el problema fue manejado correctamente usando SUBTIPO_LAT para distinguir LAT-HIDDEN (estados de máquina) de LAT-LEGACY (elementos en coexistencia con sucesores). La distinción es metodológicamente válida aunque no elimina el riesgo de interpretación.

---

## 12. LÍMITES DE AUDITABILIDAD ESTÁTICA

Los siguientes elementos de BLOQUE-005 son auditables estructuralmente pero no funcionalmente desde HTML estático. Esta tabla consolida todos los GAPs activos al cierre.

| ID | Tipo | Elemento | Límite específico |
|----|------|----------|------------------|
| GAP-037 | STATE-MACHINE | `#estado-priorizacion-popular` | Mecanismo de actualización desde Tab 3 |
| GAP-038 | STATE-MACHINE | `#estado-determinantes` | Transformación del CSV EAS |
| GAP-039 | STATE-MACHINE | `#estado-indicadores` | Estructura de los 50 indicadores |
| GAP-040 | PERSISTENCE | `guardarTodoFirebase()` | Payload y ruta Firebase |
| GAP-041 | PERSISTENCE | `borrarDatosMunicipio()` | Alcance destructivo y confirmación JS |
| GAP-042 | STATE-MACHINE | `COMPAS_renderInventarioDocumentalDebug()` | Formato del inventario |
| GAP-043 | STATE-MACHINE | `#contenido-perfil-dinamico` | Mecanismo de hidratación de acordeones |
| GAP-044 | EXTERNAL-DEP | `COMPAS_limpiarEstudiosComplementarios()` | Alcance del borrado Firebase/local |
| GAP-045 | IA-ENGINE | `generarAnalisisIA()` | Motor, pipeline, integración de fuentes |
| GAP-046 | STATE-MACHINE | Máquina IA v1 (3 estados) | Condiciones de transición |
| GAP-047 | EXTERNAL-DEP | `#anthropic-api-key` | Destino de persistencia de credencial |
| GAP-048 | STATE-MACHINE | `#evidencia-territorial-ref` | Condición de activación |
| GAP-049 | STATE-MACHINE | `#ia-enriquecimiento-territorial-diagnostico` | "Fase 0 · pasivo" → activación |
| GAP-050 | STATE-MACHINE | Máquina AT2 v2 (3 estados) | Condiciones de transición |
| GAP-051 | IA-ENGINE | `at2_generar()` | Motor, diferencias con v1 |

**Total GAPs activos al cierre: 15** (GAP-037 a GAP-051)

**Distribución por tipo:**
- GAP-IA-ENGINE: 2 (GAP-045, GAP-051) — irreducibles desde HTML
- GAP-PERSISTENCE: 3 (GAP-040, GAP-041, GAP-044) — irreducibles sin acceso a Firebase
- GAP-STATE-MACHINE: 9 — reducibles mediante auditoría JS
- GAP-EXTERNAL-DEP: 1 (GAP-047) — reducible con revisión de seguridad

---

## 13. NECESIDADES DE VERIFICACIÓN RUNTIME

Las siguientes verificaciones no pueden realizarse desde HTML estático y deben ejecutarse con el sistema en funcionamiento.

### Prioridad ALTA

| Verificación | Elemento | Pregunta específica |
|-------------|---------|---------------------|
| VR-001 | `#panel-carga-datos` | ¿Se superpone modalmente o se inserta inline? ¿Tiene backdrop? |
| VR-002 | `guardarTodoFirebase()` | ¿Qué payload persiste? ¿Solo config o todo FASE 2? |
| VR-003 | `borrarDatosMunicipio()` | ¿Tiene confirmación JS? ¿Qué rutas Firebase borra? |
| VR-004 | `guardarApiKey(this.value)` | ¿Dónde persiste la API key? ¿Está cifrada? |
| VR-005 | Transición v1→v2 (`#at2-bloque`) | ¿Qué activa la sustitución? ¿Desactiva v1 automáticamente? |

### Prioridad MEDIA

| Verificación | Elemento | Pregunta específica |
|-------------|---------|---------------------|
| VR-006 | `generarAnalisisIA()` | ¿Qué motor usa? ¿Local o API? ¿Cómo integra las 6 fuentes? |
| VR-007 | `at2_generar()` | ¿Es el mismo motor que v1 o arquitectura diferente? |
| VR-008 | `actualizarChecklistIA()` | ¿Qué criterios usa para ✅/⬜ en los 6 checkboxes? |
| VR-009 | `#evidencia-territorial-ref` | ¿Qué condición la hace visible? ¿Qué muestra `#evidencia-territorial-lista`? |
| VR-010 | `togglePanelCargaDatos()` | ¿El panel recuerda su estado o siempre empieza oculto? |

### Prioridad BAJA (pero no trivial)

| Verificación | Elemento | Pregunta específica |
|-------------|---------|---------------------|
| VR-011 | `#ia-enriquecimiento-territorial-diagnostico` | ¿Cuándo pasa de "fase 0 pasivo" a activo? |
| VR-012 | `#btn-guardar-analisis-ia` (disabled) | ¿Qué evento lo habilita? ¿Formato del payload? |
| VR-013 | `ibse_v2_abrir()` (duplicado) | ¿Los dos botones ejecutan exactamente lo mismo o hay diferencia de contexto? |
| VR-014 | `at2_actualizarFuentes()` | ¿Qué muestra `#at2-fuentes-lectura`? ¿Mismo inventario que checklist v1? |

---

## 14. IMPACTO ESTRATÉGICO

### 14.1 Arqueología operacional

BLOQUE-005 representa el umbral de complejidad a partir del cual la arqueología operacional de COMPÁS pasa de ser "documentación" a ser "infraestructura de gobierno". Las razones:

1. **~43 superficies dinámicas** no son auditables sin conocer el estado del sistema en runtime. La arqueología de COMPÁS debe incluir en el futuro un inventario de estado del sistema en momentos específicos, no solo del HTML estático.
2. **La coexistencia v1/v2** introduce una arqueología temporal: el HTML contiene evidencia del pasado (v1 "legacy intacto") y del futuro (v2 "hasta activación") simultáneamente. Cualquier cambio debe gestionar ambas versiones.
3. **Los comentarios HTML como sistema de documentación interna** (ANOMALÍA-T005) son un activo arqueológico de primer orden. Los comentarios `[DESACTIVADO TEMPORALMENTE 2026-04-17]` y `[Fase B — 2026-05-19]` contienen fechas y motivaciones que el sistema de gobierno externo (cuaderno CAP) no puede deducir por sí solo. La preservación de estos comentarios es obligatoria.

### 14.2 Auditoría IA

BLOQUE-005 es el primer bloque auditado que contiene un motor de análisis IA como componente de producción del sistema. Esto tiene consecuencias directas para la metodología de auditoría:

1. **La capa IA no puede auditarse completamente desde HTML.** La cartografía puede documentar la superficie (inputs, outputs, estados UI) pero no el motor. Una auditoría IA completa requiere revisión del código JS de `generarAnalisisIA()` y `at2_generar()`.
2. **La arquitectura dual (motor local + API Claude)** introduce un riesgo de comportamiento diferencial según el entorno de ejecución: el sistema puede comportarse de forma distinta con o sin API key. Esto no es auditable desde HTML.
3. **Los 6 checkboxes de selección de fuentes** y el comentario `"No alimenta motores, propuestaEPVSA ni scores"` de `#evidencia-territorial-ref` sugieren que el sistema tiene una arquitectura de selección de datos para el análisis IA. La calidad del análisis depende directamente de qué fuentes se incluyen y cómo se procesan — esto es opaco desde HTML.

### 14.3 Desacoplamiento Anthropic y riesgos de dependencia

La presencia de `#anthropic-api-key` y el badge "IA · Claude" en el acordeón 07 v1 confirma una dependencia de proveedores de IA nombrada explícitamente en el HTML. Sin embargo, el texto "COMPÁS funciona con motores locales sin necesidad de clave" es una declaración de desacoplamiento parcial: el sistema no requiere API Claude para funcionar, la utiliza como "integración avanzada".

**Implicación de gobernanza:** la arquitectura dual (motor local + API) es una decisión de diseño de desacoplamiento observable. El acordeón 07 v2 (`#at2-bloque`, "Diagnóstico Territorial") omite el bloque de API key visible en v1 — lo que puede indicar que v2 está diseñado para operar exclusivamente con motor local, completando el desacoplamiento de Anthropic.

Esta hipótesis es **NO VERIFICABLE desde HTML** pero es metodológicamente consistente con las evidencias observadas:
- v1: menciona Claude/IA, tiene campo API key, colores índigo IA.
- v2: denominación institucional "Diagnóstico Territorial", no menciona Claude, no tiene campo API key, colores institucionales COMPÁS.

### 14.4 Transición v1→v2: implicaciones de gobierno

La transición del acordeón 07 de v1 (análisis IA Anthropic) a v2 (diagnóstico territorial institucional) es la señal de cambio estratégico más significativa observable en BLOQUE-005. Si esta transición se completa:

1. **La dependencia Anthropic quedará encapsulada** en v1 (marcado como legacy en el DOM).
2. **El lenguaje institucional cambiará** de "Análisis inteligente" a "Diagnóstico Territorial".
3. **La UX se simplificará** (v2 no tiene checkboxes de selección, no tiene API key visible).
4. **La arquitectura de resultado se preserva** (conclusiones/recomendaciones/prioridades están en ambas versiones con la misma estructura semántica).

Esta transición no está activa todavía (v2 tiene `display:none` declarado) pero el HTML estático la documenta como diseño intencional, no como desarrollo experimental.

---

## 15. VEREDICTO FORMAL Y CONSECUENCIAS PARA EL SISTEMA

### 15.1 Veredicto de cierre

```
╔══════════════════════════════════════════════════════════════════════╗
║  CIERRE-CAP-005-R1 — VEREDICTO FORMAL                               ║
╠══════════════════════════════════════════════════════════════════════╣
║  Estado de CAP-005-R1:    CONGELABLE_CON_OBSERVACIONES              ║
║  Cobertura del rango:     989/989 líneas (100%)                     ║
║  Régimen aplicado:        LINEAL AUMENTADO — ADECUADO               ║
║  EXT-01/02/03:            APLICADAS CORRECTAMENTE                   ║
║  Taxonomía multicapa:     CONSOLIDADA — 6 capas operativas          ║
║  Divergencias críticas:   RESUELTAS (C-001 → PENDIENTE_VR_RUNTIME)  ║
║  Deudas activas:          DV-023, DV-025                            ║
║  GAPs activos al cierre:  15 (GAP-037 a GAP-051)                   ║
╠══════════════════════════════════════════════════════════════════════╣
║  Riesgos persistentes de PRIMER ORDEN:                              ║
║    RM-001 — Motor IA sin auditabilidad (GAP-045, GAP-051)           ║
║    RM-002 — Persistencia destructiva sin trazabilidad de alcance    ║
║    RM-004 — Credencial API key con persistencia reactiva            ║
╠══════════════════════════════════════════════════════════════════════╣
║  Verificaciones runtime requeridas antes de modificación:           ║
║    VR-001 — panel-carga-datos (overlay vs. inline)                  ║
║    VR-003 — borrarDatosMunicipio (confirmación JS, alcance)         ║
║    VR-005 — transición v1→v2 (mecanismo de activación)             ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 15.2 Consecuencias para siguientes CAPs

**Consecuencia 1 — El régimen LINEAL AUMENTADO debe mantenerse para CAP-006+.**

BLOQUE-005 demostró que las extensiones EXT-01/02/03 son necesarias y suficientes para la complejidad actual del sistema. No deben eliminarse. Deben revisarse únicamente si emergen nuevos patrones no capturables con el esquema actual.

**Consecuencia 2 — CAP-006 (FASE 3 — Plan de acción) comenzará con mayor complejidad metodológica de base.**

Los patrones establecidos en BLOQUE-005 (máquinas de estado, DV-COEX, GAP-IA-ENGINE) son estructuras que pueden reproducirse en FASE 3. El cartógrafo de CAP-006 debe iniciar con el régimen LINEAL AUMENTADO activo, no como novedad sino como protocolo estándar.

**Consecuencia 3 — Las dependencias externas de plataforma (Firebase, REDCap, Anthropic) deben recibir tratamiento formal en la metodología.**

BLOQUE-005 introduce tres plataformas externas por primera vez. El MARCO-METODOLOGICO-CARTOGRAFIA-R1 no tiene una sección específica para dependencias de plataforma — todo cae en FUERA_DEL_RANGO_AUDITADO. Recomendación: considerar una sección §12 o §13 en R2 del MARCO sobre taxonomía de dependencias externas (Firebase como PER-FIREBASE, REDCap como EXT-REDCAP, etc.).

**Consecuencia 4 — La capa IA requiere metodología de sub-auditoría específica.**

La cartografía estática no puede cerrar GAP-045 ni GAP-051. Para que COMPÁS tenga una auditoría IA completa, se necesitará en el futuro un artefacto de tipo "CAP-IA" o "AUDITORIA-MOTOR-IA" que revisite `generarAnalisisIA()` y `at2_generar()` en el contexto de su implementación JS. Este artefacto no es un CAP (no es cartografía HTML lineal) — requeriría un nuevo tipo de documento en el sistema de gobierno.

**Consecuencia 5 — La coexistencia v1/v2 introduce un riesgo de fragmentación documental.**

CAP-005-R1 documenta ambas versiones del acordeón 07. Si en el futuro v2 se activa y v1 se elimina, el CAP quedará con documentación de una entidad eliminada. El sistema de gobierno debe prever un mecanismo de marcado de entidades suprimidas (análogo al `EXPEDIENTE_CERRADO` de los CAPs pero a nivel de ENT). Este mecanismo no existe actualmente.

**Consecuencia 6 — Los contadores oficiales deben actualizarse antes de iniciar CAP-006.**

Los contadores al cierre de CAP-005 (MR-081, ENT-092, REL-064, CON-044, GAP-051, DV-025) están ya actualizados en INDICE_MAESTRO_CUADERNO. No se requiere acción adicional — pero deben verificarse contra INDICE_MAESTRO antes de comenzar cualquier nuevo bloque.

### 15.3 Recomendaciones de cierre

1. **Prioridad INMEDIATA:** antes de cualquier modificación del acordeón 07 o del panel de carga de fuentes, ejecutar VR-003 (alcance de borrarDatosMunicipio) y VR-004 (destino de guardarApiKey). Estas son operaciones con implicaciones de seguridad y de datos.

2. **Prioridad ALTA:** documentar el mecanismo de activación de #at2-bloque (VR-005) antes de cualquier intervención en el par v1/v2. Sin conocer este mecanismo, cualquier modificación de la interfaz del acordeón 07 tiene riesgo de romper la transición.

3. **Prioridad MEDIA:** revisar el código JS de `borrarDatosMunicipio()` para confirmar o descartar la presencia de `confirm()`. Si no existe confirmación JS, añadir una en HTML es una acción de bajo riesgo y alto impacto de UX.

4. **Prioridad MEDIA:** formalizar el mecanismo de sub-tipificación LAT en ESTABILIZACION-MULTICAPA-R2 para distinguir LAT-ESTADO (componente de máquina UI) de LAT-ARQU (elemento en coexistencia arqueológica). Esta distinción tiene valor metodológico para CAP-006+.

5. **Prioridad BAJA:** considerar la apertura de una DV específica para la coexistencia del botón duplicado `ibse_v2_abrir()` (Caso B en sección 6.1), actualmente documentada solo como observación en MR-072. Sin DV propia, su trazabilidad en auditorías futuras es más débil.

---

*CIERRE-CAP-005-R1 — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
