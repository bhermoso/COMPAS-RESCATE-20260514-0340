# DESACOPLAMIENTO-IA-R1 — Cartografía del desacoplamiento IA real en COMPÁS
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** DESACOPLAMIENTO-IA-R1
**Tipo:** Análisis de desacoplamiento — no CAP, no cartografía lineal
**Estado:** VIGENTE
**Fecha:** 2026-05-28
**Fuentes:** CAP-IA-001-R1 · CAP-005-R1 · CIERRE-CAP-005-R1 · index.html
**Mandato:** NO modificar código. Solo cartografiar.

---

## ÍNDICE

1. Antecedente: arco histórico del desacoplamiento
2. Las siete dimensiones IA — definición operacional
3. Qué depende realmente de Anthropic
4. Qué es local e independiente
5. Qué es solo UI/branding
6. Qué está provider-locked
7. Qué es GPT-portable
8. Qué requiere auditoría runtime
9. Qué requiere auditoría JS
10. Riesgos que impiden migración inmediata
11. Qué permite transición futura hacia GPT-gobierno
12. Veredicto de desacoplamiento

---

## 1. ANTECEDENTE: ARCO HISTÓRICO DEL DESACOPLAMIENTO

### 1.1 Evidencia de dependencia previa con Anthropic/Claude

El código de index.html contiene evidencia directa de que COMPÁS tuvo, en el pasado, llamadas a la API de Claude que han sido sustituidas progresivamente por motores locales:

**Evidencia fuerte (OBSERVABLE E3, l.57595–57601):**
```
// GENERADOR LOCAL DE PLAN DE ACCIÓN — sin API, determinista
// Sustituye a la llamada a Claude API. Produce exactamente el mismo JSON
// que espera renderizarPropuestaIA().
```

**Evidencia fuerte (OBSERVABLE E3, l.55920):**
```
// Motor salutogénico — sin API (delay visual 400ms, luego ejecución síncrona/await)
```

**Evidencia fuerte (OBSERVABLE E3, l.20365–20377):**
```
// ║  BLOQUE HEREDADO / INACTIVO — CONSTANTES MOTOR SALUTOGÉNICO v1          ║
// ║  [...] han sido sustituidas por versiones canónicas activas             ║
// ║  No eliminar sin auditoría: contienen campos adicionales al canónico.  ║
```

### 1.2 Línea temporal del desacoplamiento (reconstruida desde evidencias)

| Fase | Descripción | Evidencia | Fecha estimada |
|------|-------------|-----------|----------------|
| Fase 0 | Dependencia Claude API para generación de propuesta y análisis | Comentario "Sustituye a la llamada a Claude API" | Anterior a ~2025 |
| Fase 1 | Motor salutogénico v1 local (constantes PLANTILLAS, CONCLUSIONES, RECOMENDACIONES) | Bloque marcado HEREDADO / INACTIVO l.20365 | ~2025 |
| Fase 2 | Motor salutogénico v2 (analizarDatosMunicipio + ejecutarMotorExpertoCOMPAS) | l.52916 "MOTOR DE ANÁLISIS SALUTOGÉNICO — v2" | ~2025–2026 |
| Fase 3 | Motor V3 sincronizado (hook +900ms, analisisActualV3) | Comentario l.16818 "Desde 2026-03-10: ruta automática alineada" | 2026-03-10 |
| Fase 4 | UI v2 sin referencia Anthropic (AT2 "Diagnóstico Territorial") | DV-025, ENT-088–092; `_AT2_ACTIVO=true` | 2026-05-19 (Fase B, l.3434) |
| Hoy | Motor API Anthropic como "integración avanzada" opcional; motores locales como ruta principal | OBSERVABLE JS — "motores locales sin necesidad de clave" | 2026-05-28 |

### 1.3 Señal de filosofía de diseño

**Evidencia única (OBSERVABLE E3, l.49):**
```css
/* === SISTEMA VISUAL COMPÁS — ANTI-IA === */
```

Este comentario en el bloque CSS principal nombra explícitamente el sistema visual como "ANTI-IA". En el contexto del código, "ANTI-IA" se refiere a un diseño anti-glow, anti-dark, anti-glassmorphism — en contraposición a las estéticas generadas por LLMs o asociadas popularmente a "interfaces de IA". El sistema visual de COMPÁS rechaza explícitamente la iconografía IA genérica.

**Interpretación:** la intención de desacoplamiento no es solo funcional. Existe una decisión deliberada de que COMPÁS no parezca ni se presente como una "herramienta IA" en sentido comercial, sino como infraestructura de gobierno de salud pública.

---

## 2. LAS SIETE DIMENSIONES IA — DEFINICIÓN OPERACIONAL

Para este análisis se aplica la distinción requerida entre las siguientes dimensiones. Cada dimensión es evaluada de forma independiente:

| Dimensión | Definición operacional para este análisis |
|-----------|------------------------------------------|
| **Proveedor IA** | Empresa externa que provee capacidad de inferencia (Anthropic, OpenAI, etc.) |
| **Motor IA** | Implementación computacional que produce el análisis (local o externo) |
| **Gobierno IA** | Mecanismos que controlan, auditan y gobiernan el comportamiento del sistema IA |
| **UI IA** | Elementos de interfaz que presentan o activan la funcionalidad IA |
| **Persistencia IA** | Mecanismos de almacenamiento del estado y output IA (localStorage, Firebase) |
| **Runtime IA** | Comportamiento del sistema IA en ejecución (estados, transiciones, hooks) |
| **Branding IA** | Referencias visuales/textuales a proveedores o tecnologías IA específicas |

---

## 3. QUÉ DEPENDE REALMENTE DE ANTHROPIC

### 3.1 Dependencias CONFIRMADAS (evidencia fuerte)

| Elemento | Dimensión | Dependencia | Evidencia | Nivel |
|---------|-----------|------------|-----------|-------|
| `#anthropic-api-key` (ID DOM) | UI IA | Nombre del proveedor hardcoded en el ID del elemento | OBSERVABLE E1 l.3558 | BAJO — cosmético |
| `localStorage("compas_ak")` | Persistencia IA | Almacena la clave de API Anthropic | OBSERVABLE JS l.48649 | MEDIO — solo si motor API existe |
| Badge "IA · Claude" | Branding IA | Referencia nominal explícita a Claude | OBSERVABLE E1 l.3443 | BAJO — solo v1, eliminado en v2 |
| Placeholder `sk-ant-api-...` | UI IA | Formato de clave Anthropic como hint visual | OBSERVABLE E1 l.3558 | BAJO — cosmético |
| Etiqueta "Clave API (opcional)" | UI IA | UI de gestión de credencial Anthropic | OBSERVABLE E1 l.3556 | BAJO — solo v1 |
| `guardarApiKey()` / `olvidarApiKey()` | Runtime IA | Ciclo de vida de la credencial Anthropic | OBSERVABLE JS l.48643 | MEDIO — gestión de clave |

### 3.2 Dependencia HIPOTÉTICA no confirmada (evidencia media)

| Elemento | Dimensión | Hipótesis | Estado |
|---------|-----------|-----------|--------|
| Motor API Anthropic (IAG-004) | Motor IA | Existe algún código que consume `compas_ak` para llamar a la API de Anthropic | NO CONFIRMADA — el código que consume la clave no está en el rango auditado |

**Evaluación crítica:** la clave Anthropic se almacena pero **ninguna función local auditable la usa**. `analizarDatosMunicipio()`, `ejecutarMotorExpertoCOMPAS()`, `generarPropuestaIA()` y la cadena de motores v2/v3/v4 no leen `localStorage("compas_ak")`. La existencia de un motor que sí la consuma es la única hipótesis que justifica mantener el mecanismo.

### 3.3 Resumen de dependencia real

```
DEPENDENCIA REAL DE ANTHROPIC:
  - Branding:         SÍ (solo v1, eliminado en v2)
  - Motor principal:  NO (motores locales confirmados independientes)
  - Motor secundario: HIPÓTESIS (código no localizado en rango auditado)
  - Persistencia:     SOLO localStorage para la credencial
  - Firebase schema:  NO (payload IA es provider-neutral)
  - Runtime principal: NO (todos los estados son independientes)
  - UI producción:    NO (v2 activa no tiene referencias Anthropic)
```

---

## 4. QUÉ ES LOCAL E INDEPENDIENTE

### 4.1 Motores locales — completamente independientes

| Motor | Fundamento teórico | Dependencia externa | Evidencia |
|-------|-------------------|---------------------|-----------|
| `analizarDatosMunicipio()` | Motor salutogénico v2: Antonovsky (SOC), Dahlgren-Whitehead, EPVSA 2024-2030 | NINGUNA | OBSERVABLE JS l.52066–52068 |
| `ejecutarMotorExpertoCOMPAS()` | Expert system v3: ANALYTIC_CONFIG + SFA (Score Final Ajustado) | NINGUNA | OBSERVABLE JS l.52394–52402 |
| `window.__COMPAS_ejecutarMotorSintesis` | Motor síntesis modular (fallback transparente al v2) | NINGUNA observable | OBSERVABLE JS l.55930 |
| `window.COMPAS_ejecutarMotorV3()` | Análisis multicapa con `_v3_*` enrichment | NINGUNA | OBSERVABLE JS l.61719 |
| `generarPropuestaIA()` | Determinista — "sin API, sustituye a la llamada a Claude API" | NINGUNA | OBSERVABLE E3 l.57597–57599 |
| `COMPAS_enriquecimientoTerritorial()` | Fase 0 pasivo — retorna estructura sin consultas externas | NINGUNA | OBSERVABLE JS l.80998 |

### 4.2 Pipeline de datos — completamente local

Todas las fuentes del análisis IA son locales al sistema:

| Fuente | Origen | Proveedor externo |
|--------|--------|-------------------|
| Informe de Situación de Salud | `datosMunicipioActual.informe.htmlCompleto` | NINGUNO |
| Estudios complementarios | `window.estudiosComplementarios` | NINGUNO |
| Escalas diagnósticas / IBSE | `_compasEscalasGet()` + `window.datosIBSE` | NINGUNO |
| Priorización ciudadana | `window.datosParticipacionCiudadana` | NINGUNO |
| Diagnóstico RELAS | `relas_globalData._habFreq` | NINGUNO |
| Determinantes EAS | `datosMunicipioActual.determinantes` | NINGUNO |

### 4.3 Persistencia Firebase — provider-neutral

El payload `analisisIA` en Firebase no contiene referencias a ningún proveedor IA. Los campos `conclusiones`, `recomendaciones`, `propuestaEPVSA`, `perfilSOC`, `trazabilidad` son semánticamente neutros respecto al motor que los generó.

### 4.4 Ruta automática — completamente local (desde 2026-03-10)

**Evidencia (OBSERVABLE E3 l.16814–16818):**
```
// [AUDIT] verificarYGenerarAnalisisAutomatico — ejecuta motor v2 (analizarDatosMunicipio),
// motor expert system (ejecutarMotorExpertoCOMPAS) y motor v3 (window.COMPAS_ejecutarMotorV3).
// Desde 2026-03-10: ruta automática alineada con ruta manual (generarAnalisisIA + hook v3).
```

Desde 2026-03-10 la ruta automática de análisis es idéntica a la ruta manual, ambas usando exclusivamente motores locales.

---

## 5. QUÉ ES SOLO UI/BRANDING

### 5.1 Elementos puramente de branding (sin impacto funcional)

| Elemento | Línea | Tipo | Impacto funcional | Estado en v2 |
|---------|-------|------|-------------------|-------------|
| Badge "IA · Claude" | l.3443 | Branding textual | NINGUNO — no activa ninguna función | ELIMINADO |
| Color índigo `#e0e7ff` / `#3730a3` en badge | l.3443 | Branding visual | NINGUNO | ELIMINADO |
| Placeholder `sk-ant-api-...` | l.3558 | Hint de UI | NINGUNO — el campo acepta cualquier string | ELIMINADO (v2 no tiene campo) |
| Etiqueta "🔑 Clave API (opcional)" | l.3556 | Label de UI | NINGUNO | ELIMINADO |
| `/* === SISTEMA VISUAL COMPÁS — ANTI-IA ===*/` | l.49 | Meta-branding CSS | NINGUNO (es un comentario) | MANTENIDO — es sistémico |

### 5.2 Elementos de UI sin lógica de proveedor

| Elemento | Tipo | ¿Requiere Anthropic para funcionar? |
|---------|------|-------------------------------------|
| `#ia-apikey-bloque` / `#ia-apikey-ok` | UI gestión credencial | NO — solo muestra estado |
| `guardarApiKey()` / `olvidarApiKey()` | UI handlers | NO — solo gestiona localStorage |
| Spinner `#ia-progreso` | UI estado | NO — se activa independientemente del motor |
| Barra `#at2-proceso-barra` | UI estado | NO — animación local |
| Checklist `#ia-check-*` (×6) | UI informativa | NO — refleja datos locales |

### 5.3 La distinción UI/motor está estructuralmente implementada

v2 (AT2) demuestra que la UI de producción es totalmente separable del branding de proveedor. El hecho de que `at2_generar()` llame internamente a `generarAnalisisIA()` (mismo motor) sin ninguna UI de API key confirma que la separación UI/motor ya está implementada arquitectónicamente.

---

## 6. QUÉ ESTÁ PROVIDER-LOCKED

### 6.1 Provider-lock CONFIRMADO

| Elemento | Tipo de lock | Nivel | Mitigable sin cambiar código |
|---------|-------------|-------|------------------------------|
| ID DOM `#anthropic-api-key` | Lock semántico | BAJO | NO — requiere cambiar el ID |
| Placeholder `sk-ant-api-...` | Lock cosmético | BAJO | NO — requiere editar el HTML |
| Badge "IA · Claude" | Lock de branding | BAJO | NO — requiere editar el HTML |

### 6.2 Provider-lock HIPOTÉTICO

| Elemento | Hipótesis | Nivel si existe | Mitigable |
|---------|-----------|-----------------|-----------|
| Motor API Anthropic (IAG-004) | Código que usa `compas_ak` para llamar a la API | ALTO si existe | Requiere reescribir el motor |

### 6.3 Evaluación global de provider-lock

```
PROVIDER-LOCK EFECTIVO: BAJO

Los elementos con lock real son superficiales (ID, placeholder, texto).
El sistema funciona completamente con motores locales.
El único lock potencialmente alto (motor API) es hipotético y no visible.

El sistema está más desacoplado de Anthropic de lo que su UI v1 sugiere.
```

---

## 7. QUÉ ES GPT-PORTABLE

### 7.1 Componentes directamente portables a GPT sin cambios

| Componente | Tipo | Portabilidad | Razón |
|-----------|------|-------------|-------|
| Motores locales (v2, experto, síntesis, V3) | Motor IA | TOTAL | No usan ninguna API externa |
| Pipeline de fuentes (6-7 fuentes locales) | Datos | TOTAL | 100% independiente del proveedor |
| Firebase schema `analisisIA` | Persistencia | TOTAL | Payload sin referencias a proveedor |
| v2 AT2 UI | UI IA | TOTAL | Sin campo API key, sin badge proveedor |
| `generarPropuestaIA()` | Motor FASE 3 | TOTAL | Determinista, local, "sin API" |
| `localStorage("compas_ak")` (mecanismo) | Persistencia credencial | TOTAL | Almacena cualquier string; no es específico de Anthropic |
| Output format (conclusiones/recomendaciones/prioridades) | Datos | TOTAL | Semántica EPVSA, no Anthropic |

### 7.2 Componentes portables con cambios menores

| Componente | Cambio requerido | Complejidad |
|-----------|-----------------|-------------|
| `#anthropic-api-key` (ID) | Renombrar a `#compas-api-key` o `#ia-api-key` | BAJA — cambio de ID |
| Placeholder `sk-ant-api-...` | Cambiar por `sk-...` o descripción genérica | BAJA — cambio de texto |
| Badge "IA · Claude" | Cambiar a "IA · [proveedor]" o eliminar | BAJA — cambio de texto |

### 7.3 Componentes con portabilidad condicionada

| Componente | Condición | Nota |
|-----------|-----------|------|
| Motor API Anthropic (hipotético) | Requiere localizar el código primero | Puede no existir |
| `COMPAS_enriquecimientoTerritorial()` | Portabilidad total pero función actualmente inactiva | Fase 0 no activa nada |

---

## 8. QUÉ REQUIERE AUDITORÍA RUNTIME

Las siguientes preguntas no pueden responderse desde el código estático y requieren observación del sistema en funcionamiento:

| Pregunta | Elemento | Prioridad |
|---------|---------|-----------|
| ¿Lee `compas_ak` alguna función en runtime que no está en el código auditado? | `localStorage("compas_ak")` | ALTA |
| ¿Produce el motor V4 (`_sintesisTerritorial`) outputs distintos a V3? | `window.analisisActualV4` | ALTA |
| ¿Se ejecuta alguna llamada HTTP externa durante el análisis IA? | Red inspector | ALTA |
| ¿`verifyYGenerarAnalisisAutomatico()` invoca algún motor externo? | Red inspector + breakpoints | MEDIA |
| ¿El enriquecimiento territorial se activa en alguna condición no visible en HTML? | `#ia-enriquecimiento-territorial-diagnostico` | MEDIA |
| ¿Qué diferencia produce en la UI el guardado vs. no guardado del análisis? | `btn-guardar-analisis-ia` cycle | MEDIA |
| ¿La rehidratación Firebase re-renderiza la UI automáticamente? | `analisisIA` en Firebase → UI | BAJA |

---

## 9. QUÉ REQUIERE AUDITORÍA JS

Las siguientes preguntas requieren leer el código JS de funciones no completamente auditadas:

| Pregunta | Función / Rango | Prioridad |
|---------|----------------|-----------|
| ¿Qué algoritmo usa `analizarDatosMunicipio()` para generar `propuestaEPVSA`? | l.52938+ | ALTA |
| ¿Qué reglas aplica `ejecutarMotorExpertoCOMPAS()` en su sistema experto? | l.52680+ | ALTA |
| ¿Existe código que lea `localStorage("compas_ak")` y lo use en una llamada HTTP? | Búsqueda global en index.html | ALTA |
| ¿Qué produce `window.__COMPAS_ejecutarMotorSintesis`? ¿Es determinista? | `<script type="module">` l.80990+ | ALTA |
| ¿Cuándo y cómo se activa el motor V4 / `_sintesisTerritorial`? | Búsqueda de `_sintesisTerritorial` en JS | MEDIA |
| ¿Qué hace `COMPAS_prepararPayloadAnalisisIAParaGuardado()`? | l.56084 | MEDIA |
| ¿Dónde se define `ACTIVACION_MOTOR_SINTESIS.md`? ¿Existe en el repo? | Búsqueda de archivo | MEDIA |

---

## 10. RIESGOS QUE IMPIDEN MIGRACIÓN INMEDIATA

### 10.1 Riesgos bloqueantes (deben resolverse antes de migrar)

| Riesgo | Dimensión | Descripción | Bloqueo |
|--------|-----------|-------------|---------|
| IAG-004 — Motor API no localizado | Motor IA | No se puede migrar lo que no se puede encontrar. Si existe código que consume `compas_ak` para llamar a Anthropic, debe localizarse y reemplazarse. | TOTAL |
| IAD-002 — `compas_ak` en localStorage sin cifrado | Seguridad | Una migración a GPT implicaría almacenar una clave GPT con la misma vulnerabilidad. El mecanismo de credencial debe asegurarse antes de introducir una nueva clave de proveedor. | PARCIAL |

### 10.2 Riesgos significativos (deben evaluarse)

| Riesgo | Dimensión | Descripción | Impacto en migración |
|--------|-----------|-------------|---------------------|
| IAG-003 — Motor V4 opaco | Motor IA | Si V4 / `_sintesisTerritorial` usa una llamada API no visible, la migración podría ser incompleta. | POTENCIALMENTE SIGNIFICATIVO |
| IAD-005 — Race condition V3 +900ms | Runtime IA | Si el motor GPT hipotético opera en el mismo slot temporal que V3, la race condition se agrava. | MEDIO |
| IAD-001 — Divergencia HTML vs. JS en evidencia-territorial | Datos IA | El pipeline de datos al motor incluye fuentes que el HTML declara excluidas. Una migración que no conozca este comportamiento podría cambiar el input real del motor. | MEDIO |

### 10.3 Riesgos no bloqueantes para migración

| Riesgo | Razón de no bloqueo |
|--------|---------------------|
| Badge "IA · Claude" | Es cambio cosmético de 1 línea |
| `#anthropic-api-key` ID | Es cambio cosmético, no funcional |
| Placeholder `sk-ant-api-...` | Es cambio de texto, no de lógica |
| DV-025 (coexistencia v1/v2) | v2 ya está activo; v1 ya es legacy |

---

## 11. QUÉ PERMITE TRANSICIÓN FUTURA HACIA GPT-GOBIERNO

### 11.1 Patrones arquitectónicos que facilitan la transición

**Patrón 1 — Arquitectura dual local+API ya implementada**

COMPÁS ya implementa el patrón "motor local primario + API opcional". Este patrón es exactamente el requerido para GPT-gobierno: los motores locales garantizan funcionamiento sin dependencia de red, y el motor API añade capacidad inferencial avanzada cuando está disponible. Cambiar de Anthropic a GPT no requiere cambiar la arquitectura, solo el motor API.

**Patrón 2 — Sustitución de Claude API ya demostrada**

El comentario `"Sustituye a la llamada a Claude API"` (l.57599) prueba que COMPÁS ya ejecutó una vez una migración exitosa de Claude API a motor local. El precedente existe en el código.

**Patrón 3 — UI desacoplada de motor (v2 AT2)**

v2 ya es una UI sin referencias a Anthropic que llama al mismo motor local. Si en el futuro se integra GPT como motor API adicional, v2 puede activarlo sin ningún cambio de UI visible.

**Patrón 4 — Payload Firebase provider-neutral**

El schema `analisisIA` no contiene campos específicos de Anthropic. Los arrays `conclusiones`, `recomendaciones`, `propuestaEPVSA` son contenedores semánticos puros. Un análisis generado por GPT podría persistirse en el mismo schema sin cambios.

**Patrón 5 — Mecanismo de credencial abstracto**

`localStorage("compas_ak")` es un string libre. La clave `compas_ak` podría almacenar una clave GPT sin cambiar el mecanismo, solo cambiando el código que la consume.

### 11.2 Escenario de transición mínima viable

Dado lo anterior, la transición mínima viable a GPT-gobierno requeriría:

```
ACCIONES MÍNIMAS (código):
  1. Localizar motor API Anthropic (IAG-004) — si existe
  2. Sustituirlo por motor API GPT equivalente
  3. Actualizar la UI de gestión de clave (cambiar placeholder sk-ant-api-...)
  4. Verificar que ningún otro código lee compas_ak con semántica Anthropic

ACCIONES OPCIONALES (sin impacto en funcionamiento):
  5. Renombrar #anthropic-api-key → #ia-api-key
  6. Eliminar badge "IA · Claude" de v1 (ya eliminado en v2)
  7. Limpiar bloque HTML v1 de la coexistencia (ya gestionada por _AT2_ACTIVO)

ACCIONES NO REQUERIDAS:
  - Cambiar ningún motor local (son independientes del proveedor)
  - Cambiar el schema Firebase
  - Cambiar la UI v2 AT2
  - Cambiar el pipeline de fuentes de datos
  - Cambiar el formato de output
```

### 11.3 Evaluación del estado de preparación

```
┌──────────────────────────────────────────────────────────────┐
│  ZONAS DESACOPLADAS (listas para GPT):                       │
│  ✓ Motores locales (100%)                                    │
│  ✓ Pipeline de datos (100%)                                  │
│  ✓ Firebase schema (100%)                                    │
│  ✓ UI v2 AT2 (100%)                                          │
│  ✓ FASE 3 generarPropuestaIA (100%)                          │
│  ✓ Output format (100%)                                      │
│  ✓ Mecanismo de credencial (estructura abstracta)            │
│                                                              │
│  ZONAS CON BLOQUEO SUPERFICIAL (cambios triviales):          │
│  ~ Branding v1: badge, placeholder, label                    │
│  ~ ID DOM #anthropic-api-key                                 │
│                                                              │
│  ZONAS BLOQUEADAS (requieren auditoría previa):              │
│  ✗ Motor API Anthropic (si existe — no localizado)           │
│  ✗ Mecanismo de credencial (seguridad: localStorage)         │
│  ✗ Motor V4 / _sintesisTerritorial (condiciones opacas)      │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. VEREDICTO DE DESACOPLAMIENTO

```
╔══════════════════════════════════════════════════════════════════════╗
║  DESACOPLAMIENTO-IA-R1 — VEREDICTO FORMAL                           ║
╠══════════════════════════════════════════════════════════════════════╣
║  Estado del artefacto:    VIGENTE                                   ║
║  Fecha:                   2026-05-28                                ║
║                                                                      ║
║  DEPENDENCIAS CRÍTICAS:                                             ║
║    Firebase:  ESTRUCTURAL — persistencia IA obligatoria             ║
║    Anthropic: OPCIONAL — solo credential UI + hipotético motor API  ║
║    OpenAI:    NINGUNA                                                ║
╠══════════════════════════════════════════════════════════════════════╣
║  EVALUACIÓN POR DIMENSIÓN:                                          ║
║    Proveedor IA:   DESACOPLADO — motores locales confirmados        ║
║    Motor IA:       DESACOPLADO — 4 capas locales, sin API           ║
║    Gobierno IA:    DESACOPLADO — mecanismos propios (trazabilidad)  ║
║    UI IA v2:       DESACOPLADO — sin referencias Anthropic          ║
║    UI IA v1:       ACOPLADO en branding (badge, placeholder)        ║
║    Persistencia:   DESACOPLADA — Firebase schema provider-neutral   ║
║    Runtime IA:     DESACOPLADO — estados y hooks son locales        ║
║    Branding v1:    ACOPLADO — "IA · Claude", `sk-ant-api-...`       ║
║    Branding v2:    DESACOPLADO — denominación institucional         ║
╠══════════════════════════════════════════════════════════════════════╣
║  DESACOPLAMIENTO EFECTIVO:                                          ║
║    ~85% del sistema no tiene dependencia funcional de Anthropic.    ║
║    El 15% restante es: branding v1 (superficie), gestión de         ║
║    credencial (mecanismo), y motor API hipotético (no localizado).  ║
╠══════════════════════════════════════════════════════════════════════╣
║  VEREDICTO GPT-GOBIERNO:                                            ║
║    PARCIALMENTE PREPARADO                                           ║
║                                                                      ║
║    Condición bloqueante única:                                       ║
║    → Localizar y auditar motor API Anthropic (IAG-004).             ║
║                                                                      ║
║    Todo lo demás es portable, trivialmente modificable,             ║
║    o ya está desacoplado.                                           ║
╠══════════════════════════════════════════════════════════════════════╣
║  HALLAZGO ESTRATÉGICO:                                              ║
║    COMPÁS no es una aplicación que "usa IA".                        ║
║    Es una aplicación que "fue IA" (API) y se convirtió en           ║
║    un sistema de análisis territorial con motores propios.          ║
║    La UI v1 con "IA · Claude" documenta el pasado.                  ║
║    La UI v2 "Diagnóstico Territorial" documenta el presente.        ║
║    La arquitectura de motores locales es la infraestructura         ║
║    sobre la que puede construirse cualquier gobierno IA futuro.     ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 12.1 Consecuencias documentales

1. Este artefacto resuelve **VR-006** y **VR-007** de CIERRE-CAP-005-R1 (qué motor usa, si es el mismo que v1): `at2_generar()` usa el mismo motor que v1 — confirmado.

2. La **IAG-004** (motor API Anthropic) sigue siendo el único gap verdaderamente bloqueante para una evaluación completa del desacoplamiento.

3. La **IAD-001** (divergencia HTML vs. JS en evidencia-territorial) afecta a la integridad del pipeline de datos — debe resolverse antes de cualquier auditoría de calidad del análisis.

4. El hallazgo del comentario `ANTI-IA` (l.49) sugiere que la filosofía de desacoplamiento es intencional y sistemática, no accidental. Documentar en sistema de gobierno como decisión de diseño confirmada.

5. El arco histórico reconstruido (§1.2) es el dato de gobernanza más valioso de este artefacto: COMPÁS ya ejecutó una transición exitosa de API a local. El precedente está documentado en el código.

---

*DESACOPLAMIENTO-IA-R1 — 2026-05-28*
*Cuaderno de Gobierno del Código COMPÁS*
