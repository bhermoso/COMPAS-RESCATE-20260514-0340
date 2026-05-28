# ESTRUCTURA-CAP-005-R1 — Mapa de segmentación interna
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** ESTRUCTURA-CAP-005-R1  
**Tipo:** Preparación de auditoría — análisis estructural previo  
**Revisión:** R1 (inicial)  
**Estado:** VIGENTE  
**Fecha:** 2026-05-28  
**Ámbito:** index.html l.2833–l.3821 — #fase-2-contenido  
**Prerequisito:** APERTURA-CAP-005-AUDITADA (DELIMITACIÓN_APROBADA)  

---

## PREÁMBULO

Este documento no es CAP-005. No asigna identificadores definitivos MR/ENT/REL/CON/GAP/DV. No produce cartografía line-by-line. Su propósito es:

1. Mapear la arquitectura interna de CAP-005 antes de auditar.
2. Identificar las capas concurrentes presentes en el bloque.
3. Señalar zonas de riesgo metodológico.
4. Determinar si la cartografía lineal estándar es suficiente o requiere extensión multicapa.
5. Proveer al cartógrafo de un mapa de orientación para CAP-005-R1.

Las cifras de líneas son aproximadas y orientativas. Las cifras definitivas se establecerán en CAP-005-R1 con verificación aritmética.

---

## ÍNDICE

1. Inventario de segmentos arquitectónicos
2. Modelo de capas (layers)
3. Mapa A — Segmentos y clasificación
4. Mapa B — Densidad funcional
5. Mapa C — Riesgo metodológico por segmento
6. Mapa D — Superficies dinámicas y placeholders
7. Mapa E — Coexistencia temporal (v1/v2, activo/latente)
8. Mapa F — Zonas críticas para CAP-005-R1
9. Anomalías transversales observadas
10. Análisis de la pregunta metodológica central
11. Veredicto formal

---

## 1. INVENTARIO DE SEGMENTOS ARQUITECTÓNICOS

El bloque l.2833–l.3821 se articula en 6 segmentos principales. Cuatro de ellos contienen sub-segmentos con identidad propia.

```
l.2833 ┌────────────────────────────────────────────────────┐
       │  SEG-A  Apertura de fase (~6 líneas)               │
l.2838 └────────────────────────────────────────────────────┘
l.2839 ┌────────────────────────────────────────────────────┐
       │  SEG-B  HEADER (~29 líneas)                        │
l.2867 └────────────────────────────────────────────────────┘
l.2868 ┌────────────────────────────────────────────────────┐
       │  SEG-C  LEYENDA DE FIABILIDAD (~17 líneas)         │
l.2884 └────────────────────────────────────────────────────┘
l.2885 ┌────────────────────────────────────────────────────┐
       │  SEG-D  PANEL DE CARGA DE FUENTES (~390 líneas)    │
       │  ┌──────────────────────────────────────────────┐  │
       │  │ D1  Wrapper + cabecera del panel (~18 l.)    │  │
       │  │ D2  Sub-panel 1: Informe Word/PDF (~31 l.)   │  │
       │  │ D3  Sub-panel 2: IBSE + estudios (~101 l.)   │  │
       │  │ D4  Sub-panel 3: Priorización (~25 l.)       │  │
       │  │ D5  Sub-panel 4: Determinantes EAS (~35 l.)  │  │
       │  │ D6  Sub-panel 5: Indicadores (~35 l.)        │  │
       │  │ D7  Sub-panel 6: Marco estratégico (~85 l.)  │  │
       │  │ D8  Debug: Inventario documental (~26 l.)    │  │
       │  │ D9  Cierres de panel (~6 l.)                 │  │
       │  └──────────────────────────────────────────────┘  │
l.3274 └────────────────────────────────────────────────────┘
l.3275 ┌────────────────────────────────────────────────────┐
       │  SEG-E  SECCIONES DEL PERFIL (~540 líneas)         │
       │  ┌──────────────────────────────────────────────┐  │
       │  │ E1  Acordeón 01: Marco estratégico (~19 l.)  │  │
       │  │ E2  Acordeón 02: Informe situación (~29 l.)  │  │
       │  │ E3  Acordeón 03: Estudios complem. (~24 l.)  │  │
       │  │ E4  Acordeón 04: Priorización (~21 l.)       │  │
       │  │ E5  Acordeón 05: Determinantes (~21 l.)      │  │
       │  │ E6  Acordeón 06: Indicadores (~20 l.)        │  │
       │  │ E7  Acordeón 07 v1: Análisis IA (~252 l.)   │  │
       │  │ E8  Acordeón 07 v2: at2-bloque (~124 l.)    │  │
       │  │ E9  Cierres de perfil (~4 l.)                │  │
       │  └──────────────────────────────────────────────┘  │
l.3814 └────────────────────────────────────────────────────┘
l.3815 ┌────────────────────────────────────────────────────┐
       │  SEG-F  Cierre de fase (~7 líneas)                 │
l.3821 └────────────────────────────────────────────────────┘
```

**Verificación de cobertura estimada:** 6+29+17+390+540+7 ≈ 989 ✓

---

## 2. MODELO DE CAPAS (LAYERS)

El análisis del bloque revela seis capas concurrentes presentes en el HTML. Las capas no son secciones lineales — son dimensiones analíticas que coexisten dentro de los mismos segmentos.

### Definición de capas

| Capa | Código | Descripción | Mecanismo de identificación |
|------|--------|-------------|----------------------------|
| UI Estática | `UI-S` | Elementos puramente presentacionales, sin IDs dinámicos, sin onclick, sin display:none | Ausencia de todos los indicadores dinámicos |
| UI Dinámica | `UI-D` | Elementos con onclick, onchange, IDs referenciados por JS, o display condicional | Presencia de atributos de evento o IDs con función observable |
| Runtime | `RT` | Superficies de hidratación: divs vacíos o con placeholder, destinados a ser poblados por JS | Div vacío con ID, o contenido de estado inicial ("⏳ Sin cargar") |
| Persistencia | `PER` | Funciones y mecanismos de guardado/recuperación de datos | `COMPAS_guardar*`, `guardarTodoFirebase()`, `Firebase` |
| IA | `IA` | Superficies del motor de análisis inteligente y sus estados | Sección 07, `generarAnalisisIA()`, `#anthropic-api-key` |
| Legacy/Latente | `LEG` | Elementos inactivos, desactivados o en proceso de sustitución | `display:none` estructural, `disabled`, comentarios de desactivación |

### Presencia de capas por segmento

| Segmento | UI-S | UI-D | RT | PER | IA | LEG |
|----------|:----:|:----:|:--:|:---:|:--:|:---:|
| SEG-A Apertura | ✓ | — | — | — | — | — |
| SEG-B HEADER | ✓ | ✓ | — | — | — | — |
| SEG-C LEYENDA | ✓ | — | — | — | — | — |
| SEG-D1 Panel wrapper | ✓ | ✓ | — | — | — | ✓ |
| SEG-D2 Informe Word/PDF | ✓ | ✓ | ✓ | ✓ | — | — |
| SEG-D3 IBSE + estudios | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| SEG-D4 Priorización popular | ✓ | — | ✓ | — | — | — |
| SEG-D5 Determinantes EAS | ✓ | ✓ | ✓ | — | — | — |
| SEG-D6 Indicadores | ✓ | ✓ | ✓ | — | — | — |
| SEG-D7 Marco estratégico | ✓ | ✓ | — | ✓ | — | — |
| SEG-D8 Debug inventario | ✓ | ✓ | ✓ | — | — | — |
| SEG-E1/E6 Acordeones 01-06 | ✓ | ✓ | ✓ | — | — | — |
| SEG-E7 Acordeón 07 v1 (IA) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SEG-E8 Acordeón 07 v2 (at2) | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| SEG-F Cierre | ✓ | — | — | — | — | — |

**Observación:** no existe un segmento que sea solo `UI-S`. Incluso el más simple (SEG-C LEYENDA) está relacionado funcionalmente con otros segmentos. La capa `UI-S` nunca aparece sola en los segmentos funcionales.

---

## 3. MAPA A — SEGMENTOS Y CLASIFICACIÓN ARQUITECTÓNICA

| Segmento | Líneas (aprox.) | Capas presentes | Clasificación primaria | Estado inicial observable |
|----------|----------------|----------------|----------------------|--------------------------|
| SEG-A Apertura | l.2833–l.2838 | UI-S | Infraestructura / demarcación | visible |
| SEG-B HEADER | l.2839–l.2867 | UI-S, UI-D | UI dinámica / navegación | visible |
| SEG-C LEYENDA | l.2868–l.2884 | UI-S | UI estática / presentación | visible |
| SEG-D Panel carga | l.2885–l.3274 | UI-S, UI-D, RT, PER, LEG | Overlay / gestión de fuentes | **oculto** (`display:none`) |
| SEG-D1 Wrapper | l.2888–l.2906 | UI-S, UI-D, LEG | Overlay header | oculto (hereda de panel) |
| SEG-D2 Informe | l.2907–l.2941 | UI-S, UI-D, RT, PER | Carga documental / persistencia | oculto |
| SEG-D3 IBSE | l.2942–l.3048 | UI-S, UI-D, RT, PER, LEG | Carga IBSE / integraciones externas | oculto |
| SEG-D4 Priorización | l.3049–l.3076 | UI-S, RT | Estado referencial (solo lectura) | oculto |
| SEG-D5 Determinantes | l.3077–l.3114 | UI-S, UI-D, RT | Carga CSV EAS | oculto |
| SEG-D6 Indicadores | l.3115–l.3152 | UI-S, UI-D, RT | Carga CSV indicadores | oculto |
| SEG-D7 Marco estratégico | l.3153–l.3239 | UI-S, UI-D, PER | Configuración / persistencia Firebase | oculto |
| SEG-D8 Debug | l.3240–l.3273 | UI-S, UI-D, RT | Vista debug solo lectura | oculto |
| SEG-E Perfil | l.3275–l.3814 | todos | Sistema de visualización de perfil | visible (contenedor) |
| SEG-E1 01 Marco | l.3282–l.3297 | UI-D, RT | Acordeón / runtime puro | acordeón cerrado |
| SEG-E2 02 Informe | l.3300–l.3330 | UI-D, RT | Acordeón / estado inicial | acordeón cerrado |
| SEG-E3 03 Estudios | l.3332–l.3357 | UI-D, RT, PER | Acordeón / renderizado dinámico | acordeón cerrado |
| SEG-E4 04 Priorización | l.3359–l.3381 | UI-D, RT | Acordeón / renderizado dinámico | acordeón cerrado |
| SEG-E5 05 Determinantes | l.3383–l.3404 | UI-D, RT | Acordeón / runtime puro | acordeón cerrado |
| SEG-E6 06 Indicadores | l.3407–l.3428 | UI-D, RT | Acordeón / runtime puro | acordeón cerrado |
| SEG-E7 07-v1 Análisis IA | l.3431–l.3683 | UI-D, RT, PER, IA, LEG | Motor IA / 3 estados UI / v1 activa | acordeón **abierto** |
| SEG-E8 07-v2 at2-bloque | l.3684–l.3811 | UI-D, RT, IA, LEG | Motor IA v2 / 3 estados UI / v2 oculta | **oculto** (`display:none`) |
| SEG-F Cierre | l.3815–l.3821 | UI-S | Cierre estructural | — |

---

## 4. MAPA B — DENSIDAD FUNCIONAL

La densidad funcional se mide por segmento como número de funciones JS referenciadas mediante atributos de evento observables.

### Conteo de referencias a funciones JS por segmento

| Segmento | Funciones referenciadas | Tipo de referencia |
|----------|------------------------|-------------------|
| SEG-B HEADER | `togglePanelCargaDatos()`, `generarPerfilSaludLocal()` | onclick ×2 |
| SEG-D1 Wrapper panel | `togglePanelCargaDatos()` | onclick ×1 (botón cierre) |
| SEG-D2 Informe | `cargarInformeWord()`, `COMPAS_guardarInforme()` | onchange ×1, onclick ×1 |
| SEG-D3 IBSE | `ibse_cargarCSV()`, `window.open(URL hardcodeada)`, `ibse_v2_abrir()` (×2 instancias), `ibseSM_abrir()`, `ibse_borrarDatos()`, `togglePanelIBSEVisual()`, `togglePerfilSaludLocal()`, `ibse_config_guardarNObj()`, `cargarEstudiosComplementarios()`, `cargarEstudioTextoLibre()` | onclick ×8, onchange ×3 |
| SEG-D4 Priorización | — | — (estado referencial solo lectura) |
| SEG-D5 Determinantes | `cargarDeterminantesCSV()`, `descargarPlantillaDeterminantes()` | onchange ×1, onclick ×1 |
| SEG-D6 Indicadores | `cargarIndicadoresCSV()`, `descargarPlantillaIndicadores()` | onchange ×1, onclick ×1 |
| SEG-D7 Marco estratégico | `guardarTodoFirebase()`, `actualizarMunicipio()`, `borrarDatosMunicipio()` | onclick ×3; también: `onchange=""` ×7 (handlers vacíos) |
| SEG-D8 Debug | `COMPAS_renderInventarioDocumentalDebug()` | onclick ×1 |
| SEG-E1/E6 Acordeones 01–06 | `toggleAcordeon()` (×6 repeticiones), `renderizarSeccionEstudios()`, `renderizarSeccionPriorizacion()`, `COMPAS_limpiarEstudiosComplementarios()` | onclick ×8 |
| SEG-E7 07-v1 IA | `toggleAcordeon()`, `actualizarChecklistIA()`, `generarAnalisisIA()`, `guardarApiKey()`, `olvidarApiKey()`, `regenerarAnalisisIA()` | onclick ×6, oninput ×1 |
| SEG-E8 07-v2 at2 | `toggleAcordeon()`, `at2_actualizarFuentes()`, `at2_generar()`, `at2_regenerar()` | onclick ×4 |

**Total estimado de referencias a funciones JS:** ~44 (frente a ~15 en CAP-004)

### Distribución de densidad

```
Densidad (funciones/100 líneas):

SEG-B  HEADER         ████  6.9
SEG-C  LEYENDA        ·     0.0
SEG-D2 Informe        ████  6.4
SEG-D3 IBSE           ██████████  10.9   ← máximo absoluto
SEG-D4 Priorización   ·     0.0
SEG-D5 Determinantes  █████  5.7
SEG-D6 Indicadores    █████  5.7
SEG-D7 Marco estrat.  ████  3.5  (+7 onchange vacíos)
SEG-D8 Debug          ████  3.8
SEG-E1/E6 Acordeones  ████  4.0
SEG-E7 07-v1 IA       ████  2.4  (pero máxima complejidad de estado)
SEG-E8 07-v2 at2      ███   3.2
```

**Hallazgo:** SEG-D3 (IBSE + estudios) es el segmento de mayor densidad funcional del bloque. SEG-E7 (IA v1) tiene menor densidad de funciones pero la mayor complejidad de estados UI.

---

## 5. MAPA C — RIESGO METODOLÓGICO POR SEGMENTO

Cinco dimensiones de riesgo: inferencia semántica (INF), mezcla runtime/estático (MIX), inestabilidad de identificadores (ID), legacy oculto (LEG), sobrecomplejidad de documentación (DOC).

| Segmento | INF | MIX | ID | LEG | DOC | RIESGO GLOBAL |
|----------|:---:|:---:|:--:|:---:|:---:|:-------------:|
| SEG-A Apertura | — | — | — | — | — | BAJO |
| SEG-B HEADER | ● | ● | — | — | — | MEDIO |
| SEG-C LEYENDA | — | — | — | — | — | BAJO |
| SEG-D Panel (todo) | ●● | ●● | ● | ●● | ●● | **ALTO** |
| SEG-D3 IBSE | ●● | ●● | ●● | ●● | ●●● | **MUY ALTO** |
| SEG-D7 Marco estrat. | ●● | ● | ●● | — | ●● | ALTO |
| SEG-D8 Debug | ● | ●● | — | — | ● | MEDIO |
| SEG-E Acordeones 01–06 | ● | ●● | ● | — | ● | MEDIO |
| SEG-E7 07-v1 IA | ●●● | ●●● | ●● | ●● | ●●● | **MUY ALTO** |
| SEG-E8 07-v2 at2 | ●● | ●●● | ●● | ●●● | ●●● | **MUY ALTO** |

**Leyenda:** `—`=ausente `●`=bajo `●●`=medio `●●●`=alto

### Descripción de los riesgos específicos por zona de mayor riesgo

**SEG-D3 IBSE (MUY ALTO):**
- `ibse_v2_abrir()` aparece dos veces: una instancia con `display:none` (desactivada) y otra activa. Mismo nombre de función, dos comportamientos visuales distintos. Riesgo de confusión en documentación.
- `#panel-ibse-visual-legacy` — etiqueta "legacy" directamente en el ID; `display:none`. El sistema incluye su propia denominación de legado.
- Botón con `[DESACTIVADO TEMPORALMENTE 2026-04-17]` — estado temporal documentado en HTML; la condición de reactivación está en el comentario pero es INFERIDA.
- `window.open()` con URL hardcodeada — primera URL hardcodeada del rango auditado; valor observable pero no configurable.

**SEG-E7 Análisis IA v1 (MUY ALTO):**
- Máquina de estados UI con 3 estados coexistentes en HTML estático:
  - `#ia-estado-inicial`: visible por defecto
  - `#ia-progreso`: `display:none`
  - `#ia-resultado`: `display:none`
  - Los 3 son hijos directos del mismo div `#seccion-analisis-ia`
- `#btn-guardar-analisis-ia` tiene atributo HTML `disabled` — estado de deshabilitado declarado en HTML, no solo visualmente mediante CSS.
- `#evidencia-territorial-ref`: `display:none` con comentario `[Fase B — 2026-05-19] Trazabilidad visible subordinada. No alimenta motores, propuestaEPVSA ni scores. Solo lectura DOM.` — declaración de intención de uso explícita y fechada.
- `#anthropic-api-key` (type="password") — campo sensible observable.
- Comentario `<!-- CAMBIO COMPAS: botón generar análisis — sistema visual -->` en botón generador.

**SEG-E8 Análisis IA v2 / at2-bloque (MUY ALTO):**
- Comentario de convivencia: `"Convivencia: display:none hasta activación. Legacy intacto arriba."` — declara la relación con v1.
- También tiene 3 estados UI coexistentes: `#at2-inicial`, `#at2-proceso`, `#at2-resultado`.
- `#at2-proceso-barra` con `width:0%` hardcodeado en style — estado inicial explícito de la barra de progreso.
- La función `at2_actualizarFuentes()` está ligada a `onclick` del header del acordeón — se ejecuta al expandir, no hay botón explícito de actualizar separado.

---

## 6. MAPA D — SUPERFICIES DINÁMICAS Y PLACEHOLDERS

Las superficies dinámicas son elementos cuyo contenido en HTML estático es un estado inicial no definitivo. Se clasifican por tipo de superficie según MARCO-METODOLOGICO §1.9.

### Inventario de superficies dinámicas

| ID | Segmento | Estado estático observable | Tipo de placeholder | Productor probable |
|----|----------|--------------------------|--------------------|--------------------|
| `#panel-carga-datos` | SEG-D | `display:none` | Overlay oculto | `togglePanelCargaDatos()` |
| `#estado-informe` | SEG-D2 | `⏳ Sin cargar` | Estado de carga | `cargarInformeWord()` |
| `#panel-ibse` | SEG-D3 | `⏳ Sin datos IBSE para este municipio` | Estado de datos | `ibse_cargarCSV()` |
| `#ibse-badge-fuente` | SEG-D3 | `display:none` + vacío | Badge de estado dinámico | JS de IBSE |
| `#panel-ibse-visual-legacy` | SEG-D3 | `display:none` + vacío | Legacy desactivado | n/a (legacy) |
| `#ibse-config-nobj-estado` | SEG-D3 | vacío | Estado de confirmación | `ibse_config_guardarNObj()` |
| `#estado-priorizacion-popular` | SEG-D4 | `⏳ Pendiente de realizar en Tab 3` | Estado referencial | Tab 3 (externo al rango) |
| `#estado-determinantes` | SEG-D5 | `⏳ Sin cargar` | Estado de carga | `cargarDeterminantesCSV()` |
| `#estado-estudios` | SEG-D3 | `⏳ Sin cargar` | Estado de carga | `cargarEstudiosComplementarios()` |
| `#estado-indicadores` | SEG-D6 | `⏳ Sin cargar` | Estado de carga | `cargarIndicadoresCSV()` |
| `#compas-inventario-documental-debug-body` | SEG-D8 | `"Inventario documental pendiente de actualización."` | Debug placeholder | `COMPAS_renderInventarioDocumentalDebug()` |
| `#seccion-marco-estrategico` | SEG-E1 | vacío | Acordeón RT | JS de marco estratégico |
| `#seccion-informe-situacion` | SEG-E2 | Placeholder: "Carga el Informe..." | Acordeón RT con estado inicial | JS de informe |
| `#seccion-estudios-complementarios` | SEG-E3 | vacío | Acordeón RT | `renderizarSeccionEstudios()` |
| `#seccion-priorizacion-popular` | SEG-E4 | vacío | Acordeón RT | `renderizarSeccionPriorizacion()` |
| `#seccion-determinantes` | SEG-E5 | vacío | Acordeón RT | JS de determinantes |
| `#seccion-indicadores` | SEG-E6 | vacío | Acordeón RT | JS de indicadores |
| `#ia-check-informe` | SEG-E7 | `⬜ Informe de Situación de Salud` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-check-estudios` | SEG-E7 | `⬜ Estudios complementarios` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-check-priorizacion` | SEG-E7 | `⬜ Priorización ciudadana` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-check-relas` | SEG-E7 | `⬜ Hábitos, problemas y colectivos` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-check-determinantes` | SEG-E7 | `⬜ Datos EAS` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-check-indicadores` | SEG-E7 | `⬜ Indicadores de salud` | Checklist de estado | `actualizarChecklistIA()` |
| `#ia-error-msg` | SEG-E7 | `display:none` + vacío | Error dinámico | `generarAnalisisIA()` |
| `#ia-progreso` | SEG-E7 | `display:none` | Estado UI: procesando | `generarAnalisisIA()` |
| `#ia-progreso-texto` | SEG-E7 | "Analizando fuentes disponibles..." | Texto de progreso | JS de análisis |
| `#ia-resultado` | SEG-E7 | `display:none` | Estado UI: resultado | `generarAnalisisIA()` |
| `#ia-enriquecimiento-territorial-diagnostico` | SEG-E7 | `display:none` + vacío | Superficie diagnóstica | JS territorial |
| `#evidencia-territorial-ref` | SEG-E7 | `display:none` | Superficie de trazabilidad | JS territorial |
| `#evidencia-territorial-lista` | SEG-E7 | vacío (hijo del anterior) | Lista de evidencias | JS territorial |
| `#ia-conclusiones` | SEG-E7 | vacío | Resultado IA | `generarAnalisisIA()` |
| `#ia-recomendaciones` | SEG-E7 | vacío | Resultado IA | `generarAnalisisIA()` |
| `#ia-prioridades` | SEG-E7 | vacío | Resultado IA | `generarAnalisisIA()` |
| `#ia-fecha-generacion` | SEG-E7 | vacío | Metadata de resultado | `generarAnalisisIA()` |
| `#at2-bloque` | SEG-E8 | `display:none` (todo el acordeón) | Bloque v2 oculto | JS de activación v2 |
| `#at2-fuentes-lectura` | SEG-E8 | vacío | Lectura metodológica | `at2_actualizarFuentes()` |
| `#at2-proceso-barra` | SEG-E8 | `width:0%` | Barra de progreso | `at2_generar()` |
| `#at2-proceso` | SEG-E8 | `display:none` | Estado UI: procesando (v2) | `at2_generar()` |
| `#at2-resultado` | SEG-E8 | `display:none` | Estado UI: resultado (v2) | `at2_generar()` |
| `#at2-conclusiones` | SEG-E8 | vacío | Resultado IA v2 | `at2_generar()` |
| `#at2-recomendaciones` | SEG-E8 | vacío | Resultado IA v2 | `at2_generar()` |
| `#at2-prioridades` | SEG-E8 | vacío | Resultado IA v2 | `at2_generar()` |
| `#at2-meta-fecha` | SEG-E8 | vacío | Metadata v2 | `at2_generar()` |
| `#at2-meta-fuentes` | SEG-E8 | vacío | Metadata v2 | `at2_generar()` |

**Total de superficies dinámicas identificadas: ~43**

Comparación: CAP-004 tenía 3 placeholders (`#contenido-informe-dinamico`, `#tabla-miembros`, `#hitos-lista`). CAP-005 tiene ~43. El incremento es de ×14.

---

## 7. MAPA E — COEXISTENCIA TEMPORAL (v1/v2, activo/latente)

Este mapa documenta los elementos donde dos versiones de un mismo sistema coexisten en el HTML simultáneamente.

### Instancias de coexistencia

**Caso 1: Panel de carga de fuentes — botón `ibse_v2_abrir()` duplicado**

| Instancia | Línea aprox. | Estado | Clase | Comentario asociado |
|-----------|-------------|--------|-------|---------------------|
| ibse_v2_abrir() — desactivado | ~l.2988 | `display:none` | button | `[DESACTIVADO TEMPORALMENTE 2026-04-17]` |
| ibse_v2_abrir() — activo | ~l.2990 | visible | button (verde #0f766e) | — |

Misma función, dos botones, solo uno visible. El desactivado tiene toda la información del HTML de "por qué" está desactivado (comentario con fecha, motivo, condición de reactivación).

**Caso 2: Acordeón 07 — sistema de análisis v1 / v2**

| Instancia | Segmento | Estado | ID del bloque | Comentario de convivencia |
|-----------|---------|--------|--------------|--------------------------|
| Análisis IA v1 (activa) | SEG-E7 | acordeón abierto, `class="acordeon-item abierto"` | `#seccion-analisis-ia` | — (sistema activo) |
| Análisis IA v2 (oculta) | SEG-E8 | `display:none` en div padre | `#at2-bloque` | "Convivencia: display:none hasta activación. Legacy intacto arriba." |

Las dos versiones son funcionalmente paralelas: ambas tienen estados inicial/proceso/resultado, ambas generan conclusiones/recomendaciones/prioridades, ambas se activan por diferentes funciones JS.

**Caso 3: Subtipo legacy en IBSE — `#panel-ibse-visual-legacy`**

| ID | Estado | Label | Comentario |
|----|--------|-------|-----------|
| `#panel-ibse-visual-legacy` | `display:none` + vacío | "legacy" en el propio nombre de ID | "el panel activo está en #seccion-estudios-complementarios" |

Elemento legacy nombrado como tal, inactivo pero presente en el DOM.

**Caso 4: Estado `disabled` en `#btn-guardar-analisis-ia`**

El botón tiene el atributo HTML `disabled` — no es solo visual. Su estado de habilitación es controlado por JS externo. Es un estado latente declarado en el HTML que será activado en runtime.

### Patrón temporal de coexistencia

```
PASADO          PRESENTE (HTML estático)         FUTURO (runtime)
─────────────────────────────────────────────────────────────────
ibse_v2_abrir  │ [desactivado 2026-04-17]     │ [reactivable con microdatos]
(monitor ext.) │  display:none                │
               │                              │
at2-bloque v2  │ [oculto, display:none]        │ [activable cuando v2 esté lista]
(sucesor v1)   │  "Legacy intacto arriba"      │
               │                              │
#btn-guardar   │ [disabled]                   │ [habilitado tras generación IA]
-analisis-ia   │  cursor:not-allowed          │
─────────────────────────────────────────────────────────────────
```

---

## 8. MAPA F — ZONAS CRÍTICAS PARA CAP-005-R1

Las siguientes zonas requieren decisiones metodológicas específicas al producir CAP-005-R1.

### ZONA-CRIT-001 — Mecanismo `display:none` inline vs. clase CSS

**Problema:** en CAP-003/004, la visibilidad condicional se documentó mediante CON (contratos basados en clase CSS). En CAP-005, el mecanismo dominante de visibilidad es `display:none` como style inline, no como clase. Los estados `#ia-progreso`, `#ia-resultado`, `#at2-proceso`, `#at2-resultado`, `#panel-carga-datos` usan este mecanismo.

**Decisión requerida para CAP-005-R1:** ¿documentar estos como CON con nueva semántica, o como tipo de relación REL con nota `display:none observable`?

**Recomendación:** crear CON con subtipo `display:none` explícito. El CON sigue siendo el mecanismo correcto (contrato de visibilidad), pero debe quedar claro que el activador no es una clase CSS sino la modificación directa del estilo por JS.

### ZONA-CRIT-002 — Máquina de 3 estados UI en acordeones IA (v1 y v2)

**Problema:** los acordeones IA tienen 3 estados coexistentes en el HTML estático. Documentar cada div como ENT genera 3 entidades por acordeón, todas con `display:none` o visible, con el mismo nivel jerárquico. La lógica de estado (solo uno activo a la vez) es FUERA_DEL_RANGO_AUDITADO.

**Decisión requerida:** ¿documentar los 3 estados como ENT independientes, o como un único ENT con 3 sub-estados observables?

**Recomendación:** documentar como 3 ENT independientes (cada uno tiene ID, tiene contenido propio y es referenceable por JS por su ID) + un GAP que documente la máquina de estados como sistema no auditable desde el HTML estático.

### ZONA-CRIT-003 — Doble instancia de `ibse_v2_abrir()` con comportamientos distintos

**Problema:** la misma función (`ibse_v2_abrir()`) está referenciada dos veces en el mismo bloque HTML, con comportamientos observables distintos (una visible, una con `display:none` + comentario de desactivación).

**Decisión requerida:** ¿documentar como una REL con nota sobre la duplicación, o como dos REL separadas con estados distintos?

**Recomendación:** documentar como dos REL separadas (REL-X y REL-Y) que comparten el nombre de función destino pero difieren en estado: una REL activa, una REL latente (con DV sobre la duplicación y el riesgo de confusión de mantenimiento).

### ZONA-CRIT-004 — `onchange=""` vacío en 7 campos del marco estratégico

**Problema:** los campos `#config-anio-informe`, `#config-anio-encuesta`, `#config-mes-priorizacion`, `#config-anio-priorizacion`, `#config-lineas-estrategia`, `#config-distrito`, `#config-redcap-tematica` tienen `onchange=""` — handler vacío. Observable como atributo presente pero sin función asignada. ¿Es intencional (placeholder para futura implementación) o es un residuo de refactorización?

**Decisión requerida:** ¿documentar como REL con destino VACÍO (sin función), o como DV (anomalía observacional)?

**Recomendación:** documentar como DV (patrón de 7 handlers vacíos en el mismo segmento) con OBS epistemológica: no puede afirmarse si es intencional o residual desde el HTML estático. Los campos que guardan mediante `guardarTodoFirebase()` (botón explícito) funcionan sin necesitar el onchange; la ausencia de función en onchange puede ser deliberada.

### ZONA-CRIT-005 — `#evidencia-territorial-ref` con comentario de arquitectura compleja

**Problema:** el bloque `#evidencia-territorial-ref` (`display:none`) tiene un comentario de 3 líneas que declara su posición arquitectónica: `[Fase B — 2026-05-19] Trazabilidad visible subordinada. No alimenta motores, propuestaEPVSA ni scores. Solo lectura DOM.` Esto es evidencia E3 (comentario) con información de intención de diseño.

**Decisión requerida:** ¿incluir esta información como observación de auditoría (OBS epistemológica), como DV, o como parte de la descripción de la ENT?

**Recomendación:** incluir el comentario como parte de la descripción del ENT (`#evidencia-territorial-ref`), con calificación explícita de que el comentario es evidencia E3 (declaración de intención, no verificable en ejecución). Añadir OBS sobre la referencia a "propuestaEPVSA" y "scores" que implican un sistema de puntuación/propuesta no auditable desde este rango.

---

## 9. ANOMALÍAS TRANSVERSALES OBSERVADAS

Las siguientes anomalías atraviesan más de un segmento o tienen implicaciones metodológicas que exceden un segmento específico.

### ANOMALÍA-T001 — `display:none` como mecanismo de visibilidad dominante (no CSS-class)

**Presencia:** SEG-D (panel-carga-datos), SEG-E7 (#ia-progreso, #ia-resultado, #ia-apikey-bloque, #ia-apikey-ok, #ia-error-msg, #ia-enriquecimiento-territorial-diagnostico, #evidencia-territorial-ref), SEG-E8 (todo #at2-bloque)

**Magnitud:** ~10 elementos con `display:none` inline como estado inicial observable.

**Implicación:** a diferencia de los contratos CON de CAP-003/004 (que usaban clases CSS como marcadores de estado), estos elementos declaran su estado inicial directamente en el atributo `style`. El contrato de visibilidad es igual de real pero el mecanismo es diferente.

### ANOMALÍA-T002 — Inline styles como lenguaje de presentación completo

**Presencia:** SEG-B, SEG-D (prácticamente todos los sub-paneles), SEG-E7, SEG-E8

**Magnitud:** el panel de carga de fuentes (SEG-D, ~390 líneas) no usa clases CSS para layout — toda la presentación está en atributos `style`. Estimación: >100 atributos `style` en el bloque.

**Implicación metodológica:** en bloques anteriores, DV-021 documentaba los inline styles como excepción al patrón. En CAP-005, el inline style es el patrón dominante. La DV debe reformularse: no es "uso excepcional de inline styles" sino "arquitectura de presentación inline sistemática en SEG-D".

### ANOMALÍA-T003 — Dependencias externas referenciadas en el HTML

Tres tipos de dependencia externa observable:

| Tipo | Elemento | Referencia observable |
|------|----------|----------------------|
| Firebase | `guardarTodoFirebase()` (SEG-D7) | Nombre de función con plataforma explícita |
| REDCap | `window.open('https://redcap-fibao.granadasalud.es/...')` (SEG-D3) | URL hardcodeada |
| Anthropic/Claude | `#anthropic-api-key`, `generarAnalisisIA()` (SEG-E7) | Campo de API key + comentario de integración avanzada |

Estas son las primeras dependencias de plataformas externas observadas en el rango auditado total (CAP-001 a CAP-005). Sus implementaciones son FUERA_DEL_RANGO_AUDITADO pero su existencia es observable.

### ANOMALÍA-T004 — Patrón `⏳ Sin cargar` como estado inicial estandarizado

Aparece en: `#estado-informe`, `#estado-determinantes`, `#estado-estudios`, `#estado-indicadores`. Es un patrón semiestandarizado de estado inicial de carga. Las variaciones son:
- `⏳ Sin cargar` (3 instancias)
- `⏳ Sin datos IBSE para este municipio` (variante IBSE)
- `⏳ Pendiente de realizar en Tab 3` (variante referencial)
- `⬜ [Fuente]` (checklist IA — misma semántica visual con icono distinto)

Este patrón no existía en CAP-004. Es un vocabulario de estado emergente en el sistema.

### ANOMALÍA-T005 — Comentarios HTML como documentación de arquitectura

En CAP-001/002/003/004 los comentarios HTML eran demarcaciones de sección. En CAP-005 los comentarios HTML contienen:
- Decisiones técnicas con fecha: `[DESACTIVADO TEMPORALMENTE 2026-04-17]`
- Instrucciones de reactivación: `Para reactivar: eliminar display:none del botón siguiente`
- Notas de convivencia: `"Convivencia: display:none hasta activación. Legacy intacto arriba."`
- Declaraciones de intención: `[Fase B — 2026-05-19] Trazabilidad visible subordinada. No alimenta motores...`
- Marcadores de intervención: `<!-- CAMBIO COMPAS: exportar PDF — sistema -->`

Esto representa un salto cualitativo en el uso de comentarios como sistema de documentación interna del código. La evidencia E3 es más rica aquí que en bloques anteriores.

---

## 10. ANÁLISIS DE LA PREGUNTA METODOLÓGICA CENTRAL

**¿Puede CAP-005 auditarse linealmente, o requiere cartografía multicapa?**

### Argumento a favor de lineal (L)

1. La estructura del HTML sigue siendo un documento DOM lineal — hay un inicio, un fin, y una jerarquía de anidamiento navegable de arriba a abajo.
2. Los micro-rangos MR pueden cubrir el bloque completo como en bloques anteriores.
3. La complejidad adicional (display:none, estados UI, v1/v2) puede acomodarse dentro del esquema actual añadiendo atributos a los ENT y CON existentes.
4. Crear una metodología nueva para un único bloque viola el principio de parsimonia del MARCO-METODOLOGICO (§3.1: una categoría nueva solo se crea si no puede expresarse con las existentes).

### Argumento a favor de multicapa (M)

1. El esquema lineal MR→ENT→REL→CON→GAP→DV no captura la dimensión temporal de coexistencia (v1/v2, activo/latente) sin forzar la estructura.
2. Hay ~10 elementos con `display:none` que son entidades completas con sus propios IDs, estados y funciones — en el esquema lineal serían ENTs individuales, pero funcionalmente son estados de un mismo sistema.
3. La máquina de estados UI (inicial/proceso/resultado) en los acordeones IA es un patrón que el esquema actual no tiene categoría para expresar.
4. Las capas (UI-S, UI-D, RT, PER, IA, LEG) son atributos reales de los elementos que afectan qué puede decirse de ellos y qué riesgos tienen.

### Resolución

Ninguno de los dos argumentos es completamente correcto en aislamiento. La resolución es:

**CAP-005 puede auditarse linealmente SI se adoptan tres extensiones mínimas:**

1. **Atributo de capa (CAPA):** cada ENT declarado en CAP-005-R1 debe incluir su clasificación de capa (UI-S, UI-D, RT, PER, IA, LEG) como campo adicional. Este atributo no rompe el esquema ENT — lo enriquece.

2. **CON extendido para `display:none` inline:** documentar contratos de visibilidad `display:none` como CON con el campo "mecanismo: inline-style" en lugar de "mecanismo: clase CSS". Esta extensión no crea una nueva categoría — extiende la definición de CON existente.

3. **DV de coexistencia:** el patrón v1/v2 se documenta como DV específica de coexistencia, con referencias a ambas versiones y la relación declarada en el HTML (comentario de convivencia). No requiere nueva categoría.

Estas tres extensiones permiten auditar CAP-005 linealmente sin perder la información de las capas. La cartografía multicapa NO es una nueva metodología — es la cartografía lineal con los tres atributos adicionales citados.

---

## 11. VEREDICTO FORMAL

```
╔══════════════════════════════════════════════════════════════════════╗
║  VEREDICTO: CAP-005_REQUIERE_CARTOGRAFIA_MULTICAPA                  ║
╠══════════════════════════════════════════════════════════════════════╣
║  Régimen recomendado: LINEAL AUMENTADO (no sustitución)             ║
║  Extensiones metodológicas obligatorias para CAP-005-R1:            ║
║                                                                      ║
║  EXT-01: Atributo CAPA en cada ENT                                  ║
║          (UI-S / UI-D / RT / PER / IA / LEG)                        ║
║                                                                      ║
║  EXT-02: CON extendido para display:none inline                     ║
║          (campo adicional: mecanismo: inline-style vs. clase CSS)   ║
║                                                                      ║
║  EXT-03: DV de coexistencia para patrones v1/v2                     ║
║          (referencias cruzadas a ambas versiones)                   ║
║                                                                      ║
║  Zonas de máximo riesgo: SEG-D3, SEG-E7, SEG-E8                    ║
║  Superficies dinámicas a documentar: ~43                            ║
║  Funciones JS referenciadas: ~44                                     ║
║  Anomalías transversales: 5                                          ║
║  Decisiones metodológicas requeridas (ZONA-CRIT): 5                 ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Base del veredicto:**

1. La complejidad de CAP-005 excede la del modelo lineal simple: ~43 superficies dinámicas (×14 respecto a CAP-004), ~44 referencias a funciones (×3 respecto a CAP-004), 5 zonas de riesgo metodológico, 3 instancias de coexistencia v1/v2.

2. Sin embargo, la arquitectura subyacente sigue siendo HTML lineal — no justifica una metodología completamente nueva. Las tres extensiones mínimas (EXT-01/02/03) permiten capturar la información multicapa dentro del esquema existente.

3. El veredicto es "REQUIERE" (no "puede opcionalmente usar") multicapa porque sin EXT-01 (atributo CAPA) las entidades `display:none` quedarían documentadas igual que las entidades visibles, perdiendo información crítica para la evaluación de riesgos de modificación. Sin EXT-02, los contratos de visibilidad de los estados IA serían indistinguibles de los CON CSS de bloques anteriores. Sin EXT-03, el patrón v1/v2 no tendría representación adecuada.

4. El "lineal aumentado" no modifica el MARCO-METODOLOGICO-CARTOGRAFIA-R1 — lo aplica. El §3.1 establece que un atributo adicional dentro de una categoría existente no requiere nueva categoría; el §3.6 establece cómo registrar nuevas familias analíticas si fueran necesarias.

---

*ESTRUCTURA-CAP-005-R1 — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
