# APERTURA-CAP-005-AUDITADA — Expediente de apertura
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** APERTURA-CAP-005-AUDITADA  
**Tipo:** Delimitación de bloque — auditoría de apertura  
**Estado:** DELIMITACIÓN_APROBADA  
**Fecha:** 2026-05-28  
**Fuente auditada:** index.html  

---

## 1. Contexto de continuidad

| Campo | Valor |
|-------|-------|
| Último bloque cerrado | CAP-003 (EXPEDIENTE_CERRADO) |
| Último bloque documentado | CAP-004-R1 (CONGELABLE_CON_OBSERVACIONES) |
| Último rango cubierto | l.2664–l.2832 |
| Primera línea disponible | l.2833 |
| Último MR | MR-066 |
| Último ENT | ENT-049 |
| Último REL | REL-030 |
| Último CON | CON-028 |
| Último GAP | GAP-027 |
| Último DV | DV-021 |

---

## 2. Exploración inicial del rango disponible

### 2.1 Primera línea tras CAP-004

```
l.2832  (blanco — último de CAP-004)
l.2833      <!-- FASE 2: Perfil de salud local -->
l.2834  (blanco)
l.2835      <div class="fase-contenido" id="fase-2-contenido">
```

La primera línea disponible (l.2833) es el comentario de demarcación de FASE 2, coherente con el patrón establecido en MR-061 (CAP-004), donde el comentario `<!-- FASE 1 -->` fue incluido en el rango del bloque.

### 2.2 Final del bloque de FASE 2

```
l.3814      </div><!-- fin contenido-perfil-dinamico -->
l.3815  (blanco)
l.3816  (blanco)
l.3817  (blanco)
l.3818      </div>              ← cierre de #fase-2-contenido
l.3819  (blanco)
l.3820  (blanco)
l.3821  (blanco)
l.3822          <!-- FASE 3: Plan de acción -->    ← territorio CAP-006
l.3823  (blanco)
l.3824      <div class="fase-contenido" id="fase-3-contenido">
```

**Corte natural:** l.3821 es el último blanco antes del comentario de demarcación de FASE 3 (l.3822). La atribución de blancos de frontera al bloque precedente es consistente con el criterio aplicado en CAP-001/002/003/004.

---

## 3. Propuesta de delimitación

### Opción A — Fase 2 completa (PROPUESTA PRINCIPAL)

| Campo | Valor |
|-------|-------|
| Rango propuesto | l.2833–l.3821 |
| Total de líneas | **989** (3821 − 2833 + 1) |
| Inicio | `<!-- FASE 2: Perfil de salud local -->` (l.2833) |
| Fin | Último blanco antes de `<!-- FASE 3 -->` (l.3821) |
| Unidad arquitectónica | Perfil de salud local — `#fase-2-contenido` |
| Estructura de cierre | `</div>` en l.3818 — cierre de `#fase-2-contenido` |

**Justificación del tamaño (989 líneas):**

Según MARCO-METODOLOGICO-CARTOGRAFIA-R1 §8.2, los bloques >300 líneas deben justificarse explícitamente. La justificación es:

1. `#fase-2-contenido` es un div estructuralmente cerrado con identidad semántica propia — dividirlo produciría un rango con entidades truncadas, violando el criterio de "estructuralmente cerrado" (§8.2).
2. No existen cortes naturales internos que generen unidades funcionalmente autónomas e independientes: las 4 secciones internas (HEADER, LEYENDA, PANEL DE CARGA, SECCIONES DEL PERFIL) son componentes de un mismo sistema de diagnóstico de salud municipal y comparten superficies de datos (mismo municipio, mismas fuentes, mismo contexto territorial).
3. La estrategia de micro-rangos adaptativos (MARCO-METODOLOGICO §7.3) permite gestionar la complejidad interna mediante MR suficientemente descriptivos sin fragmentar la unidad funcional.

### Opción B — División en dos sub-bloques

| Sub-bloque | Rango propuesto | Líneas | Unidad |
|-----------|----------------|--------|--------|
| CAP-005a | l.2833–l.3276 | ~444 | Header + Leyenda + Panel de carga de fuentes |
| CAP-005b | l.3277–l.3821 | ~545 | Secciones del perfil (#contenido-perfil-dinamico) |

**Razón de descarte:** la división produciría dos CAPs cuyo primer elemento (A: #panel-carga-datos) y cuyo segundo elemento (B: #contenido-perfil-dinamico) son funcionalmente interdependientes — las secciones del perfil consumen los datos cargados en el panel. Documentarlos en CAPs separados fragmentaría las relaciones entre productores de datos y sus consumidores de visualización. La opción A es metodológicamente más honesta.

### Opción C — Fase 2 completa + Fase 3 completa

**Descartada:** combinaría dos unidades funcionales heterogéneas en un único bloque de >1800 líneas, violando el principio de unidad arquitectónica.

---

## 4. Estructura interna del bloque propuesto

La estructura de FASE 2 está articulada en 4 secciones principales demarcadas por comentarios HTML, y una sub-estructura interna de acordeones.

### 4.1 Secciones principales observadas

| Sección | Comentario HTML | Líneas aproximadas | Descripción |
|---------|----------------|-------------------|-------------|
| S1 | Apertura de fase | l.2833–l.2838 | Comentario + apertura `#fase-2-contenido` + blancos |
| S2 | `<!-- HEADER -->` | l.2839–l.2867 | Cabecera con título, municipio dinámico, botones de acción |
| S3 | `<!-- LEYENDA DE FIABILIDAD -->` | l.2868–l.2883 | Leyenda de 3 niveles de fiabilidad de fuentes |
| S4 | `<!-- PANEL DE CARGA DE FUENTES -->` | l.2884–l.3275 | Panel colapsable (#panel-carga-datos, display:none) con 6 sub-paneles + vista debug |
| S5 | `<!-- SECCIONES DEL PERFIL -->` | l.3276–l.3814 | #contenido-perfil-dinamico con 7 ítems de acordeón (01–07) |
| S6 | Cierre de fase | l.3815–l.3821 | Blancos pre-cierre + `</div>` + blancos post-cierre |

### 4.2 Sub-paneles del Panel de carga de fuentes (#panel-carga-datos)

El panel tiene `style="display:none"` en HTML estático — oculto en carga inicial. Contiene:

| N.º | Comentario HTML | Fuente documental | Nivel de fiabilidad |
|-----|----------------|------------------|---------------------|
| 1 | `<!-- 1. INFORME Word/PDF -->` | Informe epidemiológico Word/PDF | 🟢 Dato real |
| 2 | `<!-- 2. ESTUDIOS COMPLEMENTARIOS: IBSE + otros -->` | IBSE (REDCap CSV) + otros estudios | 🟢 Dato real |
| 3 | `<!-- 3. PRIORIZACIÓN POPULAR -->` | Votación ciudadana (referencia Tab 3) | 🟢 Dato real |
| 4 | `<!-- 4. DETERMINANTES EAS -->` | Encuesta Andaluza de Salud (CSV) | ⚠️ Estimación |
| 5 | `<!-- 5. INDICADORES -->` | Cuadro de mandos — 50 indicadores (CSV) | 🔶 Parciales |
| 6 | `<!-- 6. MARCO ESTRATÉGICO -->` | Configuración: año, mes, distrito, REDCap URL | — |
| + | `<!-- Vista debug: inventario documental -->` | `#compas-inventario-documental-debug` | Solo lectura |

### 4.3 Ítems de acordeón de #contenido-perfil-dinamico

| N.º | Comentario HTML | ID del contenido | Trigger observable |
|-----|----------------|-----------------|-------------------|
| 01 | `<!-- 01 MARCO ESTRATÉGICO (siempre visible) -->` | `#seccion-marco-estrategico` | `toggleAcordeon(this)` |
| 02 | `<!-- 02 INFORME DE SITUACIÓN -->` | `#seccion-informe-situacion` | `toggleAcordeon(this)` |
| 03 | `<!-- 03 ESTUDIOS COMPLEMENTARIOS -->` | `#seccion-estudios-complementarios` | `toggleAcordeon(this); renderizarSeccionEstudios();` |
| 04 | `<!-- 04 PRIORIZACIÓN CIUDADANA -->` | `#seccion-priorizacion-popular` | `toggleAcordeon(this); renderizarSeccionPriorizacion();` |
| 05 | `<!-- 05 DETERMINANTES -->` | `#seccion-determinantes` | `toggleAcordeon(this)` |
| 06 | `<!-- 06 INDICADORES -->` | `#seccion-indicadores` | `toggleAcordeon(this)` |
| 07 (v1) | `<!-- 07 ANÁLISIS IA -->` | `#seccion-analisis-ia` | `toggleAcordeon(this); actualizarChecklistIA();` |
| 07 (v2) | `<!-- ═══ 07 DIAGNÓSTICO TERRITORIAL v2 ═══ -->` | `#at2-bloque` (display:none) | `toggleAcordeon(this); at2_actualizarFuentes();` |

**Nota sobre 07 v1 / 07 v2:** el comentario del bloque v2 declara explícitamente `"Convivencia: display:none hasta activación. Legacy intacto arriba."` — patrón de sustitución progresiva documentado en HTML. El item 07 existe en dos versiones coexistentes en el HTML: v1 activa y v2 oculta.

---

## 5. Observaciones para CAP-005

Las observaciones siguientes deben ser consideradas al producir CAP-005. No son hallazgos bloqueantes — son señales de complejidad que el cartógrafo debe anticipar.

### OBS-001 — Uso masivo de inline styles como patrón dominante del bloque

A diferencia de bloques anteriores donde el uso de inline styles era la excepción (DV-021 en CAP-004), en FASE 2 el inline style es el mecanismo de presentación dominante para el Panel de carga de fuentes y sus sub-paneles. Prácticamente ninguno de los contenedores del panel usa clases CSS para layout — toda la presentación está definida inline. Este patrón no es una anomalía puntual sino una decisión de diseño que abarca ~388 líneas. CAP-005 debe documentarlo como tal, con DV apropiada, sin sobre-interpretarlo como deuda acumulada.

### OBS-002 — `#panel-carga-datos` con `display:none` inline como mecanismo de visibilidad explícito

El panel tiene `style="display:none"` en el HTML estático (l.2888). Esto es diferente de los contratos CON basados en clases CSS: aquí el estado inicial (oculto) está declarado directamente como estilo inline, no como clase. El mecanismo de activación (`togglePanelCargaDatos()`) está en el header del bloque. Esto requiere un CON específico que distinga este patrón del patrón clase-CSS de CAP-003/004.

### OBS-003 — Primera referencia explícita a Firebase en el rango auditado

El botón `guardarTodoFirebase()` (aproximadamente l.3231) es la primera aparición del nombre "Firebase" en el HTML auditado hasta la fecha. Aunque la función está FUERA_DEL_RANGO_AUDITADO, su presencia confirma que el sistema usa Firebase como mecanismo de persistencia. GAP correspondiente necesario. No inferir el alcance del guardado.

### OBS-004 — Botón desactivado con marcación temporal fechada

El comentario `<!-- [DESACTIVADO TEMPORALMENTE 2026-04-17] -->` (aproximadamente l.2982–l.2987) desactiva un botón de monitor comparativo externo de IBSE. El comentario incluye: (a) fecha de desactivación, (b) motivo técnico-metodológico, (c) condición de reactivación, (d) instrucción de reactivación. Es la instancia más completa de documentación de desactivación observada en el rango auditado total. Se documenta como DV (estructura con estado de desactivación visible) con OBS epistemológica.

### OBS-005 — Doble versión del ítem 07 (v1 activa / v2 oculta con `display:none`)

El patrón de coexistencia legacy/sucesor es observable explícitamente: v1 (`#seccion-analisis-ia`) está activa; v2 (`#at2-bloque`) está oculta (`display:none`) con comentario de convivencia. A diferencia de patrones anteriores donde la herencia se infería, aquí está declarada en el HTML. Requiere documentación específica de ambas versiones como entidades distintas, con la relación de sustitución documentada.

### OBS-006 — `#anthropic-api-key` — campo de tipo `password` para API key

El campo `#anthropic-api-key` (type="password") almacena una clave de integración con Claude/Anthropic. El texto del párrafo adyacente declara: "COMPÁS funciona con motores locales sin necesidad de clave. Este campo está reservado para integraciones avanzadas." Documenta la arquitectura dual (motores locales + integración vía API). No inferir el mecanismo de los motores locales desde este rango.

### OBS-007 — Hardcoded URL en onclick (`window.open(...)`)

El botón de apertura del formulario REDCap (aproximadamente l.2980) contiene una URL completa hardcodeada como argumento de `window.open()`. Es la primera aparición de una URL hardcodeada en el rango auditado. Requiere documentación como DV (fragilidad de mantenimiento: la URL no es configurable desde el HTML estático).

### OBS-008 — Densidad de IDs de estado dinámico

El bloque contiene al menos 20 IDs con prefijo semántico de estado (`#estado-informe`, `#estado-estudios`, `#estado-determinantes`, `#estado-indicadores`, `#estado-priorizacion-popular`, `#ia-check-*`, `#ia-estado-inicial`, `#ia-progreso`, `#ia-resultado`, etc.). Todos son placeholders dinámicos. La magnitud de GAPs asociados superará la de CAP-004.

---

## 6. Identificadores disponibles para CAP-005

| Tipo | Primero disponible |
|------|--------------------|
| MR | MR-067 |
| ENT | ENT-050 |
| REL | REL-031 |
| CON | CON-029 |
| GAP | GAP-028 |
| DV | DV-022 |

---

## 7. Veredicto formal

```
╔══════════════════════════════════════════════════════════════════╗
║  VEREDICTO: DELIMITACIÓN_APROBADA                               ║
╠══════════════════════════════════════════════════════════════════╣
║  CAP-005 — BLOQUE-005                                           ║
║  Rango aprobado: l.2833–l.3821                                  ║
║  Líneas: 989                                                    ║
║  Unidad: Perfil de salud local — #fase-2-contenido              ║
║  Inicio: <!-- FASE 2: Perfil de salud local --> (l.2833)        ║
║  Fin: Último blanco antes de <!-- FASE 3 --> (l.3821)           ║
║  Alternativas descartadas: B (división, fragmenta relaciones),  ║
║                             C (FASE 2+3, unidad heterogénea)    ║
║  Observaciones para CAP-005: OBS-001 a OBS-008                  ║
╚══════════════════════════════════════════════════════════════════╝
```

**Base del veredicto:**

1. El rango l.2833–l.3821 delimita una unidad arquitectónica completa y estructuralmente cerrada: `#fase-2-contenido` abre en l.2835 y cierra en l.3818, con los blancos de frontera correctamente atribuidos.
2. El tamaño de 989 líneas está justificado por la indivisibilidad funcional del bloque — la alternativa de división (Opción B) fragmentaría las relaciones productor/consumidor entre el panel de carga de fuentes y las secciones del perfil.
3. Los cortes de inicio (l.2833, inmediatamente posterior al último blanco de CAP-004) y fin (l.3821, último blanco antes del comentario de FASE 3) son naturales y consistentes con los criterios establecidos en MARCO-METODOLOGICO-CARTOGRAFIA-R1 §8.
4. Las 8 observaciones identificadas son señales anticipatorias para el cartógrafo de CAP-005 — ninguna bloquea la apertura.
5. Los contadores de identificadores están correctamente establecidos (MR-067, ENT-050, REL-031, CON-029, GAP-028, DV-022).

---

*APERTURA-CAP-005-AUDITADA — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
