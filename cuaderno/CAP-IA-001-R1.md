# CAP-IA-001-R1 — Auditoría de Infraestructura IA
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** CAP-IA-001-R1
**Tipo:** Auditoría de infraestructura IA — nuevo tipo documental (ver §2)
**Estado:** CONGELABLE_CON_OBSERVACIONES
**Fecha:** 2026-05-28
**Fuente de verdad:** index.html (HTML + JS inline)
**Rango JS principal:** l.48641–48694 / l.52680–62500 / l.80974–81076 / l.96477–96602
**Superficies HTML:** ENT-074 a ENT-092 (ya cartografiadas en CAP-005-R1)
**Origen:** CIERRE-CAP-005-R1 §14.2 — propuesta de artefacto CAP-IA

---

## ÍNDICE

1. Régimen documental — nuevo tipo CAP-IA
2. Taxonomía provisional de identificadores IA
3. Cartografía de superficies IA
4. Entradas y salidas IA
5. Arquitectura de motores IA (cadena completa)
6. Máquinas de estado IA
7. Contratos de visibilidad IA — capa JS
8. Persistencia IA
9. Claves API — proveedor y gobierno
10. Hooks IA y activación
11. Coexistencias IA v1/v2 — estado real en runtime
12. Relaciones Firebase ↔ IA
13. Distinción proveedor / motor / gobierno
14. Riesgos críticos
15. Límites de auditabilidad
16. Estado de madurez IA real
17. Preparación para transición GPT-gobierno
18. Veredicto formal

---

## 1. RÉGIMEN DOCUMENTAL — NUEVO TIPO CAP-IA

### 1.1 Justificación del nuevo tipo

CIERRE-CAP-005-R1 §14.2 y §15 establecieron que la capa IA de COMPÁS no puede auditarse completamente desde HTML estático y requiere "un artefacto de tipo CAP-IA o AUDITORIA-MOTOR-IA" con metodología específica.

**Este documento NO es un CAP estándar**. Las diferencias son:

| Dimensión | CAP estándar | CAP-IA |
|-----------|-------------|--------|
| Fuente de verdad primaria | HTML estático lineal | JS inline + HTML combinados |
| Cobertura | 100% de líneas del rango | 100% de la infraestructura IA (no lineal) |
| Objeto de auditoría | Estructura DOM | Comportamiento de motores + dependencias |
| Entidades | Elementos HTML con ID | Funciones JS, globales, rutas Firebase, estados runtime |
| Régimen | LINEAL AUMENTADO | INFRAESTRUCTURA IA — transversal al archivo |

### 1.2 Mandato de no-modificación

- NO se modifica index.html.
- NO se modifican CAPs previos ni la taxonomía multicapa.
- NO se actualizan contadores ENT/REL/CON/GAP/DV (reservados para cartografía HTML lineal).
- Las entidades HTML ya documentadas (ENT-074 a ENT-092) se referencian por sus IDs originales.
- Los nuevos identificadores IA (IAE/IAR/IAG/IAD) son provisionales para este artefacto.

---

## 2. TAXONOMÍA PROVISIONAL DE IDENTIFICADORES IA

Por aplicación de MARCO-METODOLOGICO-CARTOGRAFIA-R1 §3.6 (documentar el patrón antes de formalizarlo):

| Prefijo | Nombre | Objeto que representa |
|---------|--------|-----------------------|
| IAE | IA Entity | Motor JS, función crítica IA, variable global IA, runtime object |
| IAR | IA Relation | Dependencia funcional entre componentes IA |
| IAG | IA Gap | Límite de auditabilidad específico de la capa IA |
| IAD | IA Debt | Deuda o anomalía en la arquitectura IA |

**Alcance:** estos prefijos son válidos EXCLUSIVAMENTE en artefactos de tipo CAP-IA.
**Continuidad:** no interfieren con los contadores globales ENT/REL/GAP/DV de la cartografía HTML.
**Formalización pendiente:** recomendado incorporar al MARCO-METODOLOGICO-R2 si el patrón se reitera.

---

## 3. CARTOGRAFÍA DE SUPERFICIES IA

### 3.1 Módulo FASE 2 — Tab 07 v1 "Análisis IA" (acordeón v1)

**Referencia HTML:** ENT-074 a ENT-087 (CAP-005-R1, MR-080), l.3431–l.3683.

| IAE | ID/Función | Tipo | Evidencia | Nota |
|-----|-----------|------|-----------|------|
| IAE-001 | `#seccion-analisis-ia` | Contenedor UI IA v1 | OBSERVABLE E1 | Acordeón 07 v1; LATENTE en runtime (§11) |
| IAE-002 | `#ia-estado-inicial` | Estado 0 (visible inicial) | OBSERVABLE E1 | Máquina estado 3-pasos |
| IAE-003 | `#ia-fuentes-check` | Panel checklist 6 fuentes | OBSERVABLE E1 | Actualizado por `actualizarChecklistIA()` |
| IAE-004 | `#ia-check-*` (×6) | Indicadores de fuente disponible | OBSERVABLE E1 | IDs: informe, estudios, priorizacion, relas, determinantes, indicadores |
| IAE-005 | `#ia-apikey-bloque` | Bloque entrada API key | OBSERVABLE E1 | LAT-HIDDEN, display:none inicial |
| IAE-006 | `#anthropic-api-key` | Input credencial Anthropic | OBSERVABLE E1 | type=password; oninput=guardarApiKey |
| IAE-007 | `#ia-apikey-ok` | Confirmación clave guardada | OBSERVABLE E1 | LAT-HIDDEN, display:none inicial |
| IAE-008 | `#ia-error-msg` | Receptor mensajes de error | OBSERVABLE E1 | LAT-HIDDEN, vacío estático |
| IAE-009 | `#btn-generar-ia` | Disparador motor v1 | OBSERVABLE E1 | onclick=`generarAnalisisIA()` |
| IAE-010 | `#ia-progreso` | Estado 1 (en proceso) | OBSERVABLE E1 | LAT-HIDDEN, display:none |
| IAE-011 | `#ia-resultado` | Estado 2 (resultado) | OBSERVABLE E1 | LAT-HIDDEN, display:none |
| IAE-012 | `#btn-guardar-analisis-ia` | Disparador persistencia explícita | OBSERVABLE E1 | LAT-DISABLED; habilitado post-generación |
| IAE-013 | `#ia-enriquecimiento-territorial-diagnostico` | Receptor enriquecimiento territorial | OBSERVABLE E1 | display:none, "fase 0 · pasivo" |
| IAE-014 | `#ia-conclusiones` | Receptor conclusiones | OBSERVABLE E1 | Vacío estático; hidratado por motor |
| IAE-015 | `#ia-recomendaciones` | Receptor recomendaciones | OBSERVABLE E1 | Vacío estático; hidratado por motor |
| IAE-016 | `#ia-prioridades` | Receptor prioridades EPVSA | OBSERVABLE E1 | Vacío estático; hidratado por motor |

### 3.2 Módulo FASE 2 — Tab 07 v2 "Diagnóstico Territorial AT2"

**Referencia HTML:** ENT-088 a ENT-092 (CAP-005-R1, MR-081), l.3684–l.3821.

| IAE | ID/Función | Tipo | Evidencia | Nota |
|-----|-----------|------|-----------|------|
| IAE-017 | `#at2-bloque` | Contenedor UI IA v2 | OBSERVABLE E1 | LAT-LEGACY en HTML; ACTIVO en runtime (§11) |
| IAE-018 | `#seccion-analisis-territorial-v2` | Contenedor interno v2 | OBSERVABLE E1 | — |
| IAE-019 | `#at2-inicial` | Estado 0 v2 | OBSERVABLE E1 | Visible dentro del bloque oculto |
| IAE-020 | `#at2-fuentes-lectura` | Panel dinámico de fuentes | OBSERVABLE E1 | Hidratado por `at2_actualizarFuentes()` |
| IAE-021 | `#at2-btn-generar` | Disparador motor v2 | OBSERVABLE E1 | onclick=`at2_generar()` |
| IAE-022 | `#at2-proceso` | Estado 1 v2 (con barra progreso) | OBSERVABLE E1 | LAT-HIDDEN; barra `width:0%` |
| IAE-023 | `#at2-proceso-barra` | Barra de progreso CSS | OBSERVABLE E1 | Animación JS vía `_setProgress()` |
| IAE-024 | `#at2-resultado` | Estado 2 v2 (resultado) | OBSERVABLE E1 | LAT-HIDDEN |
| IAE-025 | `#at2-conclusiones` | Receptor conclusiones v2 | OBSERVABLE E1 | Vacío estático |
| IAE-026 | `#at2-recomendaciones` | Receptor recomendaciones v2 | OBSERVABLE E1 | Vacío estático |
| IAE-027 | `#at2-prioridades` | Receptor prioridades v2 | OBSERVABLE E1 | Vacío estático |

### 3.3 Módulo FASE 3 — Modo Automático "Propuesta EPVSA"

**HTML:** l.3912–3978. ENT no asignados en CAP-005 (BLOQUE-005 termina en l.3821). Pendiente de auditoría en CAP-006.

| IAE | ID/Función | Tipo | Evidencia | Nota |
|-----|-----------|------|-----------|------|
| IAE-028 | `#plan-modo-auto` | Contenedor modo automático | OBSERVABLE E1 | display:none; activa por `cambiarModoPlan('auto')` |
| IAE-029 | `#auto-ia-estado-inicial` | Estado 0 modo auto | OBSERVABLE E1 | Visible cuando modo-auto activo |
| IAE-030 | `generarPropuestaIA()` | Disparador motor propuesta | OBSERVABLE E1 | onclick en l.3931; motor determinista |
| IAE-031 | `#auto-ia-progreso` | Estado 1 modo auto (spinner verde) | OBSERVABLE E1 | display:none |
| IAE-032 | `#propuesta-automatica-container` | Contenedor resultado propuesta | OBSERVABLE E1 | display:none |
| IAE-033 | `#btn-aceptar-propuesta` | Aceptación de propuesta | OBSERVABLE E1 | onclick=`aceptarPropuesta()` |
| IAE-034 | `#propuesta-aceptada-acciones` | Bloque post-aceptación | OBSERVABLE E1 | display:none |
| IAE-035 | `generarDocumentoPlan()` | Generador de documento plan | OBSERVABLE E1 | onclick en l.3974 |

### 3.4 Banner v3 y superficie auxiliar

| IAE | ID/Función | Tipo | Evidencia | Nota |
|-----|-----------|------|-----------|------|
| IAE-036 | `#plan-v3-propuesta-banner` | Banner lectura analítica v3 | INFERIDO E6 | Referenciado en JS l.61410; HTML fuera del rango auditado (FASE 3 posterior) |

---

## 4. ENTRADAS Y SALIDAS IA

### 4.1 Entradas (fuentes de datos del pipeline IA)

| Entrada | Fuente | Tipo | Evidencia |
|---------|--------|------|-----------|
| Informe de Situación de Salud | `datos.informe.htmlCompleto` | Texto HTML → stripped (8000 chars) | OBSERVABLE JS l.55550 |
| Estudios complementarios | `window.estudiosComplementarios[]` | Array de objetos {nombre, texto} (3000 chars c/u) | OBSERVABLE JS l.55562 |
| Escalas diagnósticas (incl. IBSE) | `_compasEscalasGet()` + `window.datosIBSE` | Objetos normalizados | OBSERVABLE JS l.55574 |
| Priorización ciudadana | `window.datosParticipacionCiudadana` o `COMPAS.prioridades.epvsa` | Objeto con `temasFreq`/`habFreq` | OBSERVABLE JS l.55820 |
| Evidencia territorial (`#evidencia-territorial-ref`) | Documentos externos cargados | Texto sliced 1500 chars c/u | OBSERVABLE JS l.55875 |
| Determinantes EAS | `datosMunicipioActual.determinantes` | Datos encuesta | INFERIDO via `analizarDatosMunicipio()` |
| Diagnóstico RELAS | `relas_globalData._habFreq` | Frecuencias de hábitos | OBSERVABLE JS l.96591 |

**Nota sobre `#evidencia-territorial-ref`:** el comentario HTML (l.3497–3499) declara `"No alimenta motores, propuestaEPVSA ni scores. Solo lectura DOM."` — PERO el código JS en l.55875 SÍ lee esa evidencia y la añade al contexto de análisis. **Esto es una DIVERGENCIA entre declaración HTML (E3) y comportamiento JS (OBSERVABLE JS).** Clasificado como IAD-001.

### 4.2 Salidas (productos del pipeline IA)

| Salida | Receptor HTML | Tipo | Persistencia |
|--------|--------------|------|-------------|
| Conclusiones | `#ia-conclusiones` / `#at2-conclusiones` | Array objetos {tipo, titulo, texto, fuentes, fuerzaEvidencia} | Firebase + runtime |
| Recomendaciones | `#ia-recomendaciones` / `#at2-recomendaciones` | Array objetos | Firebase + runtime |
| Prioridades EPVSA | `#ia-prioridades` / `#at2-prioridades` | Array propuestaEPVSA (líneas LE1-LE4) | Firebase + runtime |
| Perfil SOC | (oculto en UI, en payload) | Objeto perfilSOC | Firebase + runtime |
| Narrativa / síntesis | `#ia-enriquecimiento-territorial-diagnostico` | Objeto narrativa (si motor v4) | Runtime |
| Propuesta automática | `#propuesta-resumen` + `#propuesta-detalle` | JSON operativo EPVSA | Runtime (no Firebase directo) |
| Lectura analítica v3 | `#plan-v3-propuesta-banner` | Señal de líneas EPVSA relevantes | Runtime |

---

## 5. ARQUITECTURA DE MOTORES IA

### 5.1 Cadena de ejecución confirmada

```
generarAnalisisIA()  [async, l.55526]
│
├─ actualizarChecklistIA()  — actualiza indicadores visuales ×6
├─ renderizarSeccionPriorizacion()  — pre-renderiza sección ciudadana
│
├─ RAMA PRIMARIA: window.__COMPAS_ejecutarMotorSintesis  [<script type="module">, l.80990]
│    └─ motor modular (fallback transparente si falla la carga)
│
└─ RAMA FALLBACK (si __COMPAS_ejecutarMotorSintesis no existe o falla):
     ├─ analizarDatosMunicipio()  [l.52938]  → window.analisisActual
     └─ ejecutarMotorExpertoCOMPAS(analisis)  [l.52680]  → enriquece analisisActual
│
├─ COMPAS_postprocesarConclusionesRecomendaciones(analisis)  [si existe]
├─ _adaptarAnalisisAFormatoUI(analisis, fuentesUsadas)  → resultado UI
│
├─ PERSISTENCIA: window.__COMPAS_analisisIA_pendienteGuardar = paraFirebase
│    └─ btn-guardar-analisis-ia habilitado → COMPAS_guardarAnalisisIAExplicito()
│
└─ HOOK ASÍNCRONO [+900ms vía setTimeout]:
     window.COMPAS_ejecutarMotorV3()  [l.61719]
          ├─ genera window.analisisActualV3
          ├─ puede modificar propuestaEPVSA de analisisActual
          └─ [si _sintesisTerritorial activa] motor V4 cede render
```

### 5.2 Inventario de motores

| IAE | Motor | Tipo | Alcance | Evidencia |
|-----|-------|------|---------|-----------|
| IAE-037 | `window.__COMPAS_ejecutarMotorSintesis` | Motor síntesis primario (modular) | Genera análisis completo | OBSERVABLE JS l.55930 |
| IAE-038 | `analizarDatosMunicipio()` | Motor base heredado | Genera `window.analisisActual` | OBSERVABLE JS l.52938 |
| IAE-039 | `ejecutarMotorExpertoCOMPAS(analisis)` | Motor experto — enriquecedor | Enriquece `analisisActual` | OBSERVABLE JS l.52680 |
| IAE-040 | `COMPAS_postprocesarConclusionesRecomendaciones` | Post-procesador opcional | Refina conclusiones/recomendaciones | OBSERVABLE JS l.55949 |
| IAE-041 | `window.COMPAS_ejecutarMotorV3()` | Motor V3 síncrono, +900ms | Genera `window.analisisActualV3` | OBSERVABLE JS l.61719, l.62468 |
| IAE-042 | `_sintesisTerritorial` / motor V4 | Síntesis territorial (si corre V4) | Bloquea render de V3; provee narrativa | PARCIALMENTE_OBSERVABLE JS l.61439 |
| IAE-043 | `generarPropuestaIA()` | Motor propuesta EPVSA (FASE 3) | Genera propuesta operativa determinista | OBSERVABLE JS l.57915 |
| IAE-044 | `at2_generar()` | Orquestador AT2 v2 | Llama a `generarAnalisisIA()` internamente | OBSERVABLE JS l.96603 |
| IAE-045 | `COMPAS_enriquecimientoTerritorial()` | Enriquecimiento territorial pasivo (fase 0) | Retorna objeto con estado:'pasivo' | OBSERVABLE JS l.80998 |

### 5.3 Hallazgo crítico: AT2 NO es un motor independiente

**Evidencia fuerte (OBSERVABLE JS l.96626):**
```javascript
if (typeof generarAnalisisIA === 'function') {
    await generarAnalisisIA();
}
```

`at2_generar()` llama internamente a `generarAnalisisIA()`. El "motor v2" es un **orquestador de UI** sobre el mismo motor local de v1. La diferencia entre v1 y v2 es de:
- Interfaz de usuario (v2 tiene barra de progreso, sin checkboxes, sin API key visible)
- Denominación ("Diagnóstico Territorial" vs. "Análisis IA")
- Renderizado final (at2 selecciona el resultado de `analisisActualV3` o `analisisActual`)

La computación es idéntica. No hay arquitectura de motor distinta entre v1 y v2.

### 5.4 Estado de los objetos globales IA

| IAE | Global | Productor | Consumidores | Evidencia |
|-----|--------|-----------|-------------|-----------|
| IAE-046 | `window.analisisActual` | `analizarDatosMunicipio()` | `generarPropuestaIA()`, `at2_generar()`, `_calcularICP()`, Firebase | OBSERVABLE JS |
| IAE-047 | `window.analisisActualV3` | `COMPAS_ejecutarMotorV3()` | `at2_generar()`, `_renderizarV3EnUI()`, Firebase | OBSERVABLE JS |
| IAE-048 | `window.analisisActualV4` | Motor V4 (condicional) | `_renderizarV3EnUI()` (cede render) | PARCIALMENTE_OBSERVABLE JS |
| IAE-049 | `window.__COMPAS_analisisIA_pendienteGuardar` | `generarAnalisisIA()` | `COMPAS_guardarAnalisisIAExplicito()` | OBSERVABLE JS l.56027 |

---

## 6. MÁQUINAS DE ESTADO IA

### 6.1 Máquina IA v1 (3 estados)

| Estado | ID | Visible inicial | Transición a |
|--------|----|----------------|--------------|
| 0 — Inicial | `#ia-estado-inicial` | SÍ (en HTML) | → Estado 1 al pulsar botón generar |
| 1 — Progreso | `#ia-progreso` | NO (display:none) | → Estado 2 al completar motor / → Estado 0 si error |
| 2 — Resultado | `#ia-resultado` | NO (display:none) | → Estado 0 al regenerar |

**Condición de transición 0→1:** `generarAnalisisIA()` ejecuta (JS muta display).
**Condición de transición 1→2:** motor completa sin error.
**Condición de transición 1→0:** error en motor (`catch`).
**Condición de transición 2→0:** `regenerarAnalisisIA()`.

### 6.2 Máquina AT2 v2 (3 estados)

| Estado | ID | Visible inicial | Transición a |
|--------|----|----------------|--------------|
| 0 — Inicial | `#at2-inicial` | SÍ (dentro de bloque que DOMContentLoaded activa) | → Estado 1 al pulsar botón generar |
| 1 — Proceso | `#at2-proceso` | NO (display:none) | → Estado 2 al completar / → Estado 0 si error |
| 2 — Resultado | `#at2-resultado` | NO (display:none) | — (no hay regenerar en v2, solo re-ejecución) |

### 6.3 Máquina API key v1 (2 estados)

| Estado | ID | Visible inicial | Transición a |
|--------|----|----------------|--------------|
| Sin clave | `#ia-apikey-bloque` (oculto) | NO (DOMContentLoaded restaura si hay clave guardada) | → Con clave al completar `guardarApiKey()` |
| Con clave | `#ia-apikey-ok` (oculto) | NO (a menos que localStorage tenga clave) | → Sin clave al ejecutar `olvidarApiKey()` |

**Nota:** en HTML estático AMBOS estados tienen display:none. El estado activo inicial se determina en DOMContentLoaded según localStorage. Desde HTML estático es imposible determinar cuál de los dos está activo.

### 6.4 Máquina modo automático FASE 3 (3 estados)

| Estado | ID | Condición |
|--------|----|-----------|
| 0 — Sin generar | `#auto-ia-estado-inicial` | Inicial; visible cuando modo-auto activo |
| 1 — Generando | `#auto-ia-progreso` | display:none hasta activar motor |
| 2 — Con propuesta | `#propuesta-automatica-container` | display:none hasta motor completado |
| 2b — Aceptada | `#propuesta-aceptada-acciones` | display:none; visible tras `aceptarPropuesta()` |

### 6.5 Máquina enriquecimiento territorial (2 estados)

| Estado | ID | Condición |
|--------|----|-----------|
| Pasivo (fase 0) | `#ia-enriquecimiento-territorial-diagnostico` | display:none; texto "fase 0 · pasivo" |
| Activo | `#ia-enriquecimiento-territorial-diagnostico` | visible; contenido generado por `COMPAS_enriquecimientoTerritorial()` |

**Condición de activación:** PENDIENTE_RUNTIME. `COMPAS_enriquecimientoTerritorial()` actualmente retorna `{estado: 'pasivo'}` en todas las circunstancias — no existe código observable que lo active. Estado: Implementación en fase 0, no activable desde el sistema actual.

---

## 7. CONTRATOS DE VISIBILIDAD IA — CAPA JS

Los contratos CON-033 a CON-044 (CAP-005-R1) documentan los mecanismos HTML. Esta sección documenta los mecanismos JS que los activan, completando la auditoría.

| CON (CAP-005) | Mecanismo HTML | Función JS activadora | Línea JS |
|---------------|----------------|----------------------|----------|
| CON-033 | `#ia-apikey-bloque` display:none | `guardarApiKey()` / DOMContentLoaded | l.48651 / l.48687 |
| CON-034 | `#ia-apikey-ok` display:none | `guardarApiKey()` / `olvidarApiKey()` | l.48653 / l.48669 |
| CON-036 | `#ia-error-msg` display:none | Catch en `generarAnalisisIA()` | l.55900–55903 |
| CON-037 | `#ia-progreso` display:none | `generarAnalisisIA()` inicio | l.55914 |
| CON-038 | `#ia-resultado` display:none | `renderizarResultadoIA()` / `regenerarAnalisisIA()` | l.56645 / l.56175 |
| CON-039 | `#btn-guardar-analisis-ia` disabled | Post-render: habilitado por `generarAnalisisIA()` | l.56029–56037 |
| CON-040 | `#ia-enriquecimiento-territorial-diagnostico` display:none | `COMPAS_enriquecimientoTerritorial()` (no activa actualmente) | l.56492 |
| CON-042 | `#at2-bloque` display:none (HTML) | **`at2_aplicarFlag()`** — DOMContentLoaded | l.96490 |
| CON-043 | `#at2-proceso` display:none | `at2_generar()` inicio | l.96612 |
| CON-044 | `#at2-resultado` display:none | `at2_generar()` completado | l.96684+ |

---

## 8. PERSISTENCIA IA

### 8.1 localStorage — Credencial API key

**Ruta:** `localStorage("compas_ak")`
**Evidencia fuerte (OBSERVABLE JS l.48649):** `localStorage.setItem("compas_ak", val)`

| Función | Operación | Condición | Línea |
|---------|-----------|-----------|-------|
| `guardarApiKey(val)` | SET | valor no vacío + trim | l.48643 |
| `olvidarApiKey()` | REMOVE | onclick usuario | l.48661 |
| DOMContentLoaded | GET + restaurar UI | al cargar la página | l.48673 |

**Análisis de seguridad:** la API key Anthropic se persiste en localStorage sin cifrado observable. localStorage es accesible a cualquier JS en el mismo origen. La clave es recuperable por extensiones de navegador maliciosas o por inyección de scripts en la misma página.

### 8.2 Firebase — analisisIA

**Ruta Firebase confirmada (OBSERVABLE JS l.56110):**
`estrategias/${estrategiaActual}/municipios/${municipioId}/analisisIA`

**Payload completo documentado:**

```
analisisIA {
  conclusiones:          Array<Conclusion>
  recomendaciones:       Array<Recomendacion>
  prioridades_epvsa:     Array<PrioridadEPVSA>
  propuestaEPVSA:        Array<LineaEPVSA>
  fechaGeneracion:       ISO string
  fechaGuardadoExplicito: ISO string
  fuentes:               Array<string>
  fortalezas:            Array (max 10)
  oportunidades:         Array (max 10)
  alertasInequidad:      Array
  perfilSOC:             Object | null
  patronesTransversales: Array
  narrativa:             Object | null
  renderCientifico: {
    narrativa, perfilSOC, alertasInequidad, fortalezas, oportunidades,
    patronesTransversales, conclusiones, recomendaciones,
    propuestaEPVSA, priorizacion
  }
  priorizacion:          Array
}
```

**Modelo de guardado: EXPLÍCITO** — no automático.
1. Motor genera resultado → `window.__COMPAS_analisisIA_pendienteGuardar = paraFirebase`
2. `#btn-guardar-analisis-ia` se habilita
3. Usuario pulsa → `COMPAS_guardarAnalisisIAExplicito()` → Firebase SET
4. Botón vuelve a disabled + texto "✅ Análisis guardado"

**Nota de arquitectura (E3, comentario l.55961–55968):** el sistema incluye un comentario de auditoría interno (`[AUDIT]`) que documenta un race condition potencial: el análisis puede persistirse en `/analisisIA` con `lineaId` fuera de rango (6,7,8,9) si el motor v3 no ha corrido todavía cuando el usuario guarda. El propio código documenta este riesgo.

### 8.3 Runtime — objetos en memoria

| Global | Ciclo de vida | Persistido en Firebase |
|--------|--------------|----------------------|
| `window.analisisActual` | Por sesión; se sobreescribe | SÍ (via `analisisIA`) |
| `window.analisisActualV3` | Por sesión; por `COMPAS_ejecutarMotorV3` | SÍ (dentro de `analisisIA.renderCientifico`) |
| `window.analisisActualV4` | Por sesión; condicional | SÍ (dentro de `analisisIA._sintesisTerritorial`) |
| `window.__COMPAS_analisisIA_pendienteGuardar` | Buffer temporal; null post-guardado | NO (es el buffer pre-Firebase) |

---

## 9. CLAVES API — PROVEEDOR Y GOBIERNO

### 9.1 Anthropic API key

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| Presencia en UI | SÍ — `#anthropic-api-key` type=password | OBSERVABLE E1 |
| Almacenamiento | localStorage("compas_ak") | OBSERVABLE JS l.48649 |
| Cifrado | NO observable — texto plano en localStorage | OBSERVABLE JS — ausencia de cifrado |
| Exposición | Accesible desde JS del mismo origen | OBSERVABLE JS l.48663 |
| Opcionalidad | SÍ — "motores locales sin necesidad de clave" | OBSERVABLE E2 (texto UI) |
| Uso por motores locales | NO — los motores locales no leen `compas_ak` | OBSERVABLE JS — ninguna función local lee localStorage("compas_ak") en el pipeline |

**Hallazgo crítico:** la clave Anthropic es almacenada pero **no se observa su uso en ningún motor local** en el código auditado. Las funciones `analizarDatosMunicipio()`, `ejecutarMotorExpertoCOMPAS()`, y `generarPropuestaIA()` no leen `localStorage("compas_ak")` en ningún punto visible. La hipótesis de uso es que sería consumida por un motor API externo (llamada a la API Anthropic) cuyo código no está visible en el rango auditado.

**Clasificación de riesgo:** MEDIO-ALTO — la clave se persiste con toda la sesión sin cifrado, pero si los motores locales no la usan, el riesgo de exposición depende del código no visible.

### 9.2 OpenAI / GPT

**Estado:** SIN EVIDENCIA EN EL RANGO AUDITADO.

No existe mención de `openai`, `gpt`, `gpt-4`, `sk-openai`, ni patrón equivalente en el código auditado (HTML + JS inline de index.html). La arquitectura actual de COMPÁS no tiene dependencia observable con OpenAI.

### 9.3 Otras claves

No se observan otras claves API, tokens de autenticación, o credenciales de terceros en el rango auditado.

---

## 10. HOOKS IA Y ACTIVACIÓN

| IAR | Hook | Momento | Efecto | Evidencia |
|-----|------|---------|--------|-----------|
| IAR-001 | `document.addEventListener('DOMContentLoaded', at2_aplicarFlag)` | Carga de página | Invierte estado v1/v2 según `_AT2_ACTIVO` | OBSERVABLE JS l.96494 |
| IAR-002 | `document.addEventListener('DOMContentLoaded', restaurarApiKey)` | Carga de página | Restaura UI API key desde localStorage | OBSERVABLE JS l.48673 |
| IAR-003 | `setTimeout(COMPAS_ejecutarMotorV3, 900)` | 900ms post-`generarAnalisisIA()` | Ejecuta motor V3 asíncrono | OBSERVABLE JS l.62468 |
| IAR-004 | `window.generarAnalisisIA = async function(){...setTimeout(COMPAS_ejecutarMotorV3,900)...}` | Al cargar el script wrapper | Reemplaza `generarAnalisisIA` para inyectar hook V3 | OBSERVABLE JS l.62468 |
| IAR-005 | `actualizarChecklistIA()` (desde múltiples contextos) | Al cargar datos, al cambiar fuentes | Sincroniza checklist de 6 fuentes | OBSERVABLE JS l.49089, l.57204 |

**Nota sobre IAR-004:** el motor V3 no se llama directamente desde `generarAnalisisIA()`. El código REEMPLAZA la función original en el scope global con una versión wrapeada que añade el `setTimeout`. Esta es una técnica de monkey-patching observable en JS.

---

## 11. COEXISTENCIAS IA v1/v2 — ESTADO REAL EN RUNTIME

### 11.1 Resolución de VR-005 (de CIERRE-CAP-005-R1)

VR-005 preguntaba: *"¿Qué activa la sustitución? ¿Desactiva v1 automáticamente?"*

**Respuesta confirmada (OBSERVABLE JS l.96477–96494):**

```javascript
var _AT2_ACTIVO = true;  // l.96480 — flag de activación

function at2_aplicarFlag() {
    var legacy = document.querySelector('.acordeon-item:has(#seccion-analisis-ia)');
    var v2 = document.getElementById('at2-bloque');
    if (legacy) legacy.style.display = _AT2_ACTIVO ? 'none' : '';  // v1 OCULTO si AT2_ACTIVO=true
    if (v2)     v2.style.display     = _AT2_ACTIVO ? ''     : 'none'; // v2 VISIBLE si AT2_ACTIVO=true
}

document.addEventListener('DOMContentLoaded', at2_aplicarFlag);  // l.96494
```

### 11.2 Inversión del estado HTML → Runtime

| | Estado HTML estático | Estado REAL en runtime |
|--|---------------------|----------------------|
| v1 (`#seccion-analisis-ia`) | VISIBLE — acordeón `.abierto` | **OCULTO** — `display:none` vía JS |
| v2 (`#at2-bloque`) | OCULTO — `display:none` inline | **VISIBLE** — `display:''` vía JS |

**Consecuencia para CAP-005-R1:** La clasificación ENT-088 (`#at2-bloque`) como LAT-LEGACY es correcta desde HTML estático, pero en runtime v2 ES la versión activa de producción. v1 es el legacy real.

**Consecuencia para DV-025:** DV-025 documentó la coexistencia correctamente. La transición v1→v2 está COMPLETADA a nivel de flag (`_AT2_ACTIVO = true`). La coexistencia es un legado de compatibilidad que puede eliminarse cuando v1 sea confirmado como no necesario.

### 11.3 Condiciones de la transición

| Condición | Estado |
|-----------|--------|
| Mecanismo de activación | RESUELTO: `_AT2_ACTIVO = true` + `at2_aplicarFlag()` |
| Reversibilidad | SÍ: cambiar `_AT2_ACTIVO = false` desde consola y ejecutar `at2_aplicarFlag()` |
| Documentado en HTML | SÍ: comentario l.3687–3690 ("Convivencia: display:none hasta activación") |
| Documentado en JS | SÍ: comentario l.96478 ("AT2: coexistencia legacy / v2") |
| Riesgo de activación simultánea | MÍNIMO: `at2_aplicarFlag()` gestiona ambos states mutuamente excluyentes |

---

## 12. RELACIONES FIREBASE ↔ IA

| IAR | Relación | Dirección | Función | Ruta Firebase | Evidencia |
|-----|---------|-----------|---------|--------------|-----------|
| IAR-006 | generarAnalisisIA → Firebase | ESCRITURA (explícita) | `COMPAS_guardarAnalisisIAExplicito()` | `estrategias/${estrategiaActual}/municipios/${municipioId}/analisisIA` | OBSERVABLE JS l.56110 |
| IAR-007 | Firebase → analisisActual | LECTURA (rehidratación) | DOMContentLoaded o carga municipio | `estrategias/.../municipios/.../analisisIA` | OBSERVABLE JS l.62362 |
| IAR-008 | analisisActualV3 → Firebase | LECTURA (rehidratación V3) | `_v3payload` desde Firebase | Nested en `analisisIA` | OBSERVABLE JS l.62415 |
| IAR-009 | analisisIA → compilador | LECTURA (compilador) | `actualizarEstadoCompilador()` | Runtime | OBSERVABLE JS l.56138 |

**Ruta Firebase IA confirmada:** `estrategias/${estrategiaActual}/municipios/${municipioId}/analisisIA`

**Rehidratación:** al cargar un municipio, si existe `analisisIA` en Firebase, el sistema rehidrata `window.analisisActual` y (si tiene sub-objeto v3) también `window.analisisActualV3`. La rehidratación es defensiva y no automáticamente re-renderiza la UI.

---

## 13. DISTINCIÓN PROVEEDOR / MOTOR / GOBIERNO

Esta distinción es OBLIGATORIA por mandato del prompt. Las tres dimensiones son independientes.

### 13.1 Proveedor IA

**Definición:** empresa externa que provee capacidad de inferencia.

| Proveedor | Evidencia de dependencia | Nivel de dependencia | Estado |
|-----------|------------------------|---------------------|--------|
| Anthropic / Claude | `#anthropic-api-key`, badge "IA · Claude", localStorage "compas_ak" | OPCIONAL (declarado explícitamente) | Activo como opción, no obligatorio |
| OpenAI / GPT | NINGUNA evidencia | SIN DEPENDENCIA | No presente |
| Firebase (Google) | `db.ref(...).set(...)` | ESTRUCTURAL para persistencia | Activo y obligatorio para PER |

### 13.2 Motor IA

**Definición:** implementación computacional que produce el análisis.

| Motor | Proveedor de infraestructura | Tipo | Dependencia externa |
|-------|---------------------------|------|---------------------|
| `analizarDatosMunicipio()` | COMPÁS (local) | Determinista, basado en reglas | NINGUNA |
| `ejecutarMotorExpertoCOMPAS()` | COMPÁS (local) | Sistema experto | NINGUNA |
| `window.__COMPAS_ejecutarMotorSintesis` | COMPÁS (modular) | Síntesis local | NINGUNA observable |
| `COMPAS_ejecutarMotorV3()` | COMPÁS (local) | Análisis multicapa | NINGUNA |
| Motor V4 / `_sintesisTerritorial` | COMPÁS (local) | Síntesis territorial | NINGUNA observable |
| Motor API Anthropic (hipótesis) | Anthropic | LLM externo | REQUIERE `compas_ak` |

**Conclusión:** los motores locales son TOTALMENTE independientes de Anthropic. La API key Anthropic activa hipotéticamente un motor adicional no visible en el código auditado.

### 13.3 Gobierno IA

**Definición:** mecanismos que controlan, auditan y gobiernan el comportamiento del sistema IA.

| Mecanismo | Tipo | Estado |
|-----------|------|--------|
| Checklist de 6 fuentes | Control de cobertura de datos | ACTIVO — observable |
| `trazabilidad` en payload Firebase | Trazabilidad de fuentes del análisis | ACTIVO — en payload |
| Guardado MANUAL (no automático) | Control de cuándo persiste | ACTIVO — intencional |
| `[AUDIT]` comments en JS | Auto-auditoría interna del código | ACTIVO — E3 |
| `renderCientifico` sub-objeto | Estabilidad de contrato Firebase | ACTIVO |
| `ACTIVACION_MOTOR_SINTESIS.md` (referencia) | Documentación de arquitectura IA | REFERENCIADO en JS l.55928 — archivo externo (no en repo visible) |
| Cuaderno de Gobierno COMPÁS | Meta-gobierno documental | ACTIVO (este documento) |

**Hallazgo notable:** el sistema tiene mecanismos de auto-gobierno IA inusuales para una SPA monolítica. Los comentarios `[AUDIT]` y `[PARCHE]` en el JS son evidencia de un sistema de documentación interna de la deuda técnica IA. ACTIVACION_MOTOR_SINTESIS.md es un documento de arquitectura referenciado pero no encontrado en el repo auditado — posible documentación externa.

---

## 14. RIESGOS CRÍTICOS

### 14.1 Riesgos de provider-lock

| IAD | Riesgo | Nivel | Evidencia | Mitigación observable |
|-----|--------|-------|-----------|----------------------|
| IAD-002 | API key Anthropic en localStorage sin cifrado | ALTO | OBSERVABLE JS l.48649 | `olvidarApiKey()` permite revocar; clave es opcional |
| IAD-003 | Badge "IA · Claude" en UI vincula identidad visual a Anthropic | BAJO | OBSERVABLE E1 l.3443 | v2 elimina esta referencia — ya mitigado en AT2 |
| IAD-004 | Si motor API Anthropic existe (hipótesis), desacoplarlo requeriría más que cambiar la clave | MEDIO | HIPÓTESIS — motor no visible | Motores locales confirmados como independientes |

**Evaluación global provider-lock:** BAJO para motores locales (confirmados independientes). MEDIO para la arquitectura de credencial. El riesgo principal no es funcional sino de seguridad de credencial.

### 14.2 Riesgos de runtime-state-machine

| IAD | Riesgo | Nivel | Evidencia |
|-----|--------|-------|-----------|
| IAD-005 | Race condition V3 (+900ms): si el usuario guarda antes del V3, `propuestaEPVSA` puede tener lineaId fuera de rango | MEDIO | OBSERVABLE JS l.55961–55968 (comentario [AUDIT] propio) |
| IAD-006 | `at2_generar()` llama a `generarAnalisisIA()` que TAMBIÉN actualiza v1 UI; si v1 no está oculto, ambas UIs recibirían el resultado simultáneamente | BAJO (resuelto por _AT2_ACTIVO) | OBSERVABLE JS l.96626 |
| IAD-007 | `window.generarAnalisisIA` es monkey-patched (IAR-004); cualquier referencia directa al nombre antes del patch podría perder el hook V3 | BAJO | OBSERVABLE JS l.62468 |
| IAD-008 | `window.analisisActual` es sobreescrito sin guardado: si `generarAnalisisIA()` se llama dos veces, el primer análisis se pierde a menos que ya hubiera sido guardado en Firebase | MEDIO | OBSERVABLE JS — ausencia de protección de escritura |

### 14.3 Riesgos de persistencia IA

| IAD | Riesgo | Nivel | Evidencia |
|-----|--------|-------|-----------|
| IAD-009 | Análisis generado se pierde si el usuario no pulsa "Guardar" — modelo de guardado MANUAL | MEDIO | OBSERVABLE JS l.56026 (console.info '[AUSTERO]') |
| IAD-010 | Payload incluye referencias a objetos anidados; `_sanearPayloadFirebase()` filtra `undefined` pero no clona profundamente — riesgo de referencias circulares residuales | BAJO | OBSERVABLE JS l.56091 |
| IAD-011 | Firebase path depende de `estrategiaActual` — variable global; si es `undefined`, el guardado falla silenciosamente (condición `typeof db !== 'undefined'`) | MEDIO | OBSERVABLE JS l.55973 |

### 14.4 Riesgos epistemológicos IA

| IAD | Riesgo | Nivel | Descripción |
|-----|--------|-------|-------------|
| IAD-001 | Divergencia declaración HTML vs. comportamiento JS en `#evidencia-territorial-ref` | ALTO | El comentario HTML dice "No alimenta motores" pero el JS SÍ la incluye en el contexto de análisis (l.55875) |
| IAD-012 | `ACTIVACION_MOTOR_SINTESIS.md` referenciado en JS pero no encontrado en el repo | MEDIO | Documentación de arquitectura IA con posible existencia externa al repo |
| IAD-013 | Los comentarios `[AUDIT]` en JS son auto-documentación de deuda que el cuaderno externo (CAP) no captura | MEDIO | OBSERVABLE JS — patrón sistemático |
| IAD-014 | Motor V4 / `_sintesisTerritorial` inferido pero no directamente observable en el rango auditado | ALTO | PARCIALMENTE_OBSERVABLE — condiciones de activación desconocidas |

---

## 15. LÍMITES DE AUDITABILIDAD

| IAG | Elemento | Tipo de límite | Pregunta no respondida |
|-----|---------|---------------|----------------------|
| IAG-001 | `window.__COMPAS_ejecutarMotorSintesis` | Motor modular — JS de `<script type="module">` | ¿Qué algoritmo usa? ¿Produce resultados deterministas? |
| IAG-002 | `ejecutarMotorExpertoCOMPAS()` | Sistema experto — l.52680+ | ¿Qué reglas aplica? ¿Cómo prioriza fuentes? |
| IAG-003 | Motor V4 / `_sintesisTerritorial` | Existencia y condiciones | ¿Cuándo corre? ¿Qué produce en `_sintesisTerritorial`? |
| IAG-004 | Motor API Anthropic | Existencia en código no visible | ¿Existe un motor que use `compas_ak`? ¿En qué rango? |
| IAG-005 | `analizarDatosMunicipio()` internals | l.52938+ — fuera del rango explícito | ¿Qué pesos/reglas usa para generar `propuestaEPVSA`? |
| IAG-006 | `ACTIVACION_MOTOR_SINTESIS.md` | Archivo externo referenciado | ¿Dónde está? ¿Qué documenta? |
| IAG-007 | `COMPAS_prepararPayloadAnalisisIAParaGuardado()` | Función opcional l.56084 | ¿Existe? ¿Qué consolida? |
| IAG-008 | Rehidratación Firebase → runtime | Condiciones de re-render | ¿Se re-renderiza automáticamente la UI al cargar análisis previo? |
| IAG-009 | Calidad del análisis IA | Interna a los motores | ¿Qué validaciones existen sobre la coherencia del output? |

---

## 16. ESTADO DE MADUREZ IA REAL

### 16.1 Dimensiones evaluadas

| Dimensión | Estado | Evidencia |
|-----------|--------|-----------|
| Motores locales | MADUROS — múltiples versiones (v2/v3/v4), cadena completa documentada | OBSERVABLE JS |
| Independencia de proveedor externo | ALTA — motores locales confirmados sin dependencia Anthropic | OBSERVABLE JS |
| Coexistencia v1/v2 | RESUELTA a nivel de runtime (`_AT2_ACTIVO = true`) | OBSERVABLE JS l.96480 |
| Persistencia IA | FUNCIONAL pero MANUAL; ruta Firebase confirmada | OBSERVABLE JS l.56110 |
| Gobierno credencial | DÉBIL — localStorage sin cifrado | OBSERVABLE JS l.48649 |
| Trazabilidad de análisis | PRESENTE — payload incluye `fuentes`, `trazabilidad`, fechas | OBSERVABLE JS l.55985 |
| Auto-documentación interna | INUSUALMENTE ALTA — comentarios `[AUDIT]`, `[PARCHE]`, `[CANÓNICO]` | OBSERVABLE E3 |
| Gestión de race conditions | PARCIAL — documentada (`[AUDIT]` en l.55961) pero no resuelta | OBSERVABLE JS |
| Integración IBSE ↔ IA | CONFIRMADA — `window.datosIBSE` es fuente del pipeline | OBSERVABLE JS l.55576 |

### 16.2 Veredicto de madurez

```
MADUREZ IA: SISTEMA LOCAL MADURO CON DEPENDENCIA EXTERNA OPCIONAL

Los motores locales de COMPÁS son una arquitectura IA madura:
- 4 capas de motor (base, experto, síntesis, V3) con fallbacks
- Análisis multicapa con trazabilidad de fuentes
- Integración de 6-7 fuentes de datos
- Guardado explícito con payload estructurado
- Coexistencia v1/v2 gestionada programáticamente

La dependencia Anthropic es opcional y está arquitectónicamente desacoplada.
La gestión de credenciales (localStorage sin cifrado) es la deuda de seguridad
más significativa.
```

---

## 17. PREPARACIÓN PARA TRANSICIÓN GPT-GOBIERNO

### 17.1 Evaluación de preparación

| Condición necesaria para GPT-gobierno | Estado actual | Evidencia |
|---------------------------------------|---------------|-----------|
| Independencia de Anthropic en motores locales | CUMPLIDA | Motores locales sin dependencia observable |
| Interfaz de credencial abstracta (no hardcoded Anthropic) | PARCIALMENTE cumplida | localStorage "compas_ak" (no hardcoded a Anthropic) pero badge UI dice "Claude" |
| API key genérica (no específica al proveedor) | PARCIAL — `sk-ant-api-...` en placeholder | Placeholder revela sesgo Anthropic; estructura de clave genérica (string libre) |
| Motores locales como sistema principal | CUMPLIDA | `generarPropuestaIA()` y pipeline base son 100% locales |
| Separación UI / motor | PARCIAL | v2 elimina UI de API key; motor es el mismo |
| Payload Firebase independiente del proveedor | CUMPLIDA | Payload no referencia "Anthropic" ni "Claude" |

### 17.2 Pasos requeridos para una transición GPT

Si en el futuro se quisiera integrar GPT como motor externo alternativo o sustituto de Anthropic:

1. **Cambiar la clave en UI:** el campo `#anthropic-api-key` usa `sk-ant-api-...` como placeholder. Requiere actualizar el placeholder y la lógica que usa la clave.
2. **Identificar el código del motor API:** el motor que consume `localStorage("compas_ak")` no es visible en el rango auditado. Debe localizarse y modificarse.
3. **Badge visual:** "IA · Claude" en l.3443 es hardcoded. v2 (AT2) ya eliminó esta dependencia visual.
4. **v2 AT2 ya no tiene UI de API key** — si se activa definitivamente, el punto de entrada externo desaparece de la UI.

**Evaluación:** la arquitectura está PREPARADA PARA TRANSICIÓN a nivel de motores locales. La transición del hipotético motor API Anthropic a GPT requiere localizar ese código (fuera del rango auditado). Los motores locales no necesitan cambios.

### 17.3 Hipótesis sobre desacoplamiento en v2

v2 (AT2) no tiene:
- Campo `#anthropic-api-key`
- Badge "IA · Claude"
- Bloque `#ia-apikey-bloque`

Si la hipótesis del CIERRE-CAP-005-R1 §14.3 es correcta (v2 es un intento de UI desacoplada de Anthropic), la transición a GPT sería invisible para el usuario: solo se cambiaría el motor interno sin modificar la UI de v2.

---

## 18. VEREDICTO FORMAL

```
╔══════════════════════════════════════════════════════════════════════╗
║  CAP-IA-001-R1 — VEREDICTO FORMAL                                   ║
╠══════════════════════════════════════════════════════════════════════╣
║  Estado:              CONGELABLE_CON_OBSERVACIONES                  ║
║  Tipo de artefacto:   CAP-IA (nuevo tipo — no CAP HTML lineal)      ║
║  Fuentes auditadas:   HTML (ENT-074–092) + JS inline                ║
║  Rango JS principal:  l.48641–96602 (no lineal — transversal)       ║
║  Entidades IA:        IAE-001 a IAE-049 (49 entidades)              ║
║  Relaciones IA:       IAR-001 a IAR-009 (9 relaciones clave)        ║
║  Gaps IA:             IAG-001 a IAG-009 (9 límites)                 ║
║  Deudas IA:           IAD-001 a IAD-014 (14 observaciones)         ║
╠══════════════════════════════════════════════════════════════════════╣
║  HALLAZGOS CRÍTICOS:                                                ║
║    H1: _AT2_ACTIVO=true → v2 ES la versión activa en runtime        ║
║        (invierte estado HTML estático documentado en CAP-005-R1)   ║
║    H2: at2_generar() llama a generarAnalisisIA() — mismo motor      ║
║    H3: API key → localStorage("compas_ak") sin cifrado             ║
║    H4: IAD-001: divergencia HTML vs. JS en evidencia-territorial    ║
║    H5: Ruta Firebase IA confirmada explícitamente en JS             ║
║    H6: 4 capas de motor local; ninguna requiere API Anthropic       ║
╠══════════════════════════════════════════════════════════════════════╣
║  DEPENDENCIAS CRÍTICAS:                                             ║
║    - Firebase: ESTRUCTURAL (persistencia IA)                        ║
║    - Anthropic: OPCIONAL (localStorage, solo motor API hipotético) ║
║    - OpenAI: NINGUNA                                                ║
╠══════════════════════════════════════════════════════════════════════╣
║  RIESGOS CRÍTICOS ACTIVOS:                                          ║
║    IAD-001 — divergencia HTML/JS en evidencia-territorial           ║
║    IAD-002 — API key en localStorage sin cifrado                    ║
║    IAD-005 — race condition V3 (+900ms) pre-guardado Firebase       ║
║    IAD-014 — motor V4/_sintesisTerritorial parcialmente opaco       ║
╠══════════════════════════════════════════════════════════════════════╣
║  COEXISTENCIAS IA:                                                  ║
║    v1 "Análisis IA" → LEGACY en runtime (_AT2_ACTIVO=true)         ║
║    v2 "Diagnóstico Territorial" → ACTIVO en runtime                 ║
║    Mecanismo de transición: RESUELTO (VR-005 → _AT2_ACTIVO)        ║
╠══════════════════════════════════════════════════════════════════════╣
║  MADUREZ IA:  SISTEMA LOCAL MADURO / DEPENDENCIA EXTERNA OPCIONAL  ║
║  PREPARACIÓN TRANSICIÓN GPT: PARCIALMENTE PREPARADO                ║
║  Req. para transición GPT: localizar motor API (no visible aún)     ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 18.1 Consecuencias para siguientes artefactos

1. **DV-025 merece una nota de actualización:** la coexistencia v1/v2 está resuelta a nivel de runtime. v2 ES producción. La DV no está cerrada (coexistencia persiste en HTML) pero su riesgo es menor de lo documentado.

2. **VR-005 de CIERRE-CAP-005-R1 queda RESUELTO** por este artefacto: `_AT2_ACTIVO = true` + `at2_aplicarFlag()` en DOMContentLoaded.

3. **IAD-001 requiere acción:** si el comentario HTML de `#evidencia-territorial-ref` declara "No alimenta motores" pero el JS sí la incluye, existe una inconsistencia de gobernanza. Requiere clarificación del autor del sistema.

4. **La identificación del motor API Anthropic** (que consumiría `localStorage("compas_ak")`) es el próximo gap crítico. Debe localizarse en la auditoría JS de la función `generarAnalisisIA` en rangos superiores o en archivos externos.

5. **ACTIVACION_MOTOR_SINTESIS.md** — debe localizarse como documento de arquitectura IA. Si existe fuera del repo, incorporar al sistema de gobierno.

6. **Los identificadores IAE/IAR/IAG/IAD** deben formalizarse en MARCO-METODOLOGICO-R2 para artefactos CAP-IA futuros.

---

*CAP-IA-001-R1 — 2026-05-28*
*Cuaderno de Gobierno del Código COMPÁS*
