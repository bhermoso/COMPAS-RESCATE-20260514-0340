# ESTABILIZACION-MULTICAPA-R1 — Formalización del gobierno taxonómico multicapa
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** ESTABILIZACION-MULTICAPA-R1  
**Tipo:** Gobierno taxonómico — formalización de propuesta  
**Revisión:** R1 (inicial)  
**Estado:** VIGENTE  
**Fecha:** 2026-05-28  
**Ámbito:** CAP-005 y bloques posteriores  
**Prerequisitos:** MARCO-METODOLOGICO-CARTOGRAFIA-R1, ESTRUCTURA-CAP-005-R1  

---

## PREÁMBULO

Este documento formaliza la propuesta de estabilización multicapa presentada ante el sistema de gobierno de la cartografía COMPÁS. Su función es doble:

1. **Evaluación crítica:** revisar cada elemento de la propuesta contra los criterios del MARCO-METODOLOGICO-CARTOGRAFIA-R1 (especialmente §3.1 sobre creación de categorías nuevas).
2. **Formalización vinculante:** establecer el conjunto definitivo de instrumentos taxonómicos para CAP-005-R1 y bloques posteriores.

Las decisiones de este documento son PRESCRITAS para CAP-005-R1. Cualquier desviación requiere enmienda formal.

---

## ÍNDICE

1. Evaluación de las capas canónicas
2. Evaluación de los nuevos tipos de entidad
3. Reglas de clasificación — revisión
4. Sistema de niveles de riesgo — revisión
5. Taxonomía consolidada para CAP-005-R1
6. Instrucciones de implementación
7. Límites de la expansión taxonómica
8. Veredicto formal

---

## 1. EVALUACIÓN DE LAS CAPAS CANÓNICAS

Las seis capas propuestas (UI-S, UI-D, RT, PER, IA, LEG) ya fueron establecidas como modelo operativo en ESTRUCTURA-CAP-005-R1 §2. Este documento las confirma y precisa sus criterios de aplicación.

### 1.1 Decisión: CAPAS ACEPTADAS EN BLOQUE

Las 6 capas son aceptadas sin modificación de nombre ni código. Se ajustan únicamente las definiciones de exclusión para hacerlas operacionalmente precisas.

| Capa | Decisión | Modificación |
|------|----------|-------------|
| UI-S | ACEPTADA | Ninguna |
| UI-D | ACEPTADA | Ninguna |
| RT | ACEPTADA | Aclaración: RT es la capa de la _función_ activadora, no del elemento HTML que la llama |
| PER | ACEPTADA | Aclaración: PER requiere evidencia observable (nombre de función, atributo, comentario) |
| IA | ACEPTADA | Restricción: IA NO puede asignarse a un ENT por inferencia del nombre; requiere evidencia E1–E4 |
| LEG | ACEPTADA | Aclaración adicional en §1.2 |

### 1.2 Precisión sobre LEG — arqueología funcional activa

La propuesta define LEG como "arqueología funcional activa". Esta es una definición epistemológicamente correcta pero necesita criterio operacional para evitar la subjetividad.

**Criterio de asignación LEG (obligatorio):** un ENT recibe la capa LEG si y solo si existe en el HTML al menos UNA de las siguientes evidencias:

| Tipo de evidencia LEG | Ejemplos observados en CAP-005 |
|----------------------|-------------------------------|
| E-LEG-1: `display:none` como estado inicial estructural (no como estado de carga) | `#panel-carga-datos`, `#at2-bloque`, `#ia-progreso` |
| E-LEG-2: Comentario HTML de desactivación o convivencia | `[DESACTIVADO TEMPORALMENTE 2026-04-17]`, `"Convivencia: display:none hasta activación"` |
| E-LEG-3: Atributo `disabled` en HTML | `#btn-guardar-analisis-ia disabled` |
| E-LEG-4: Identificador con sufijo `-legacy` o comentario que lo denomina tal | `#panel-ibse-visual-legacy` |
| E-LEG-5: Versión numerada coexistente con versión activa | `at2-bloque` vs. `seccion-analisis-ia` |

**Regla de exclusión LEG:** el mero hecho de que un elemento sea antiguo, ineficiente o de estilo distinto al resto NO califica como LEG. LEG requiere evidencia de coexistencia o desactivación parcial.

### 1.3 Uso de capas como atributo multi-valor

Un ENT puede recibir varias capas simultáneamente. La asignación sigue este esquema:

- **CAPA_DOMINANTE:** la capa que describe la función primaria del ENT.
- **CAPAS_SECUNDARIAS:** capas adicionales presentes.

Ejemplo de aplicación: `#panel-carga-datos`
- CAPA_DOMINANTE: `UI-D` (es un panel de interfaz activable)
- CAPAS_SECUNDARIAS: `LEG` (tiene `display:none` estructural), `RT` (activado por función JS), `PER` (contiene sub-paneles con funciones de persistencia)

---

## 2. EVALUACIÓN DE LOS NUEVOS TIPOS DE ENTIDAD

La propuesta introduce 8 nuevos tipos: SURF, HYD, OVL, LAT, COEX, PERS, PIPE, GATE.

Evaluación de cada uno según MARCO-METODOLOGICO §3.1, que exige 4 condiciones para crear una categoría nueva:

- **C1:** No puede expresarse con categorías existentes.
- **C2:** Aparece ≥2 veces o tiene alta probabilidad de reaparición.
- **C3:** Tiene definición operacional precisa que la distingue.
- **C4:** No es sub-familia de categoría existente expresable con modificador.

### 2.1 SURF — Superficie dinámica

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | PARCIAL | Podría expresarse como ENT con CAPA=RT + nota. Pero la densidad (43 instancias) hace la nota insuficiente para trazabilidad. |
| C2 | SÍ | 43 instancias en CAP-005; patrón presente desde CAP-004. |
| C3 | SÍ | Div con ID cuyo contenido es generado en runtime; vacío o con placeholder en HTML estático. |
| C4 | NO | Es sub-familia de ENT. |

**Decisión: ACEPTADA COMO QUALIFIER DE ENT** — no como prefijo de identificador nuevo. Se asigna como `TIPO_ENT: SURF` en el campo de tipo de la entidad. No genera contador separado. Mantiene el contador ENT global.

**Definición formalizada:**

> SURF: sub-tipo de ENT. Div (u otro elemento) con ID propio, cuyo contenido o estado completo en HTML estático es un placeholder (vacío o texto de estado inicial) destinado a ser poblado o sustituido por JS en tiempo de ejecución. La superficie recibe datos, no los produce.

**Distinción con ENT regular:** un ENT regular tiene contenido estructural propio observable en el HTML. Un ENT-SURF no tiene contenido funcional en HTML estático — su contenido real sólo existe en runtime.

---

### 2.2 HYD — Superficie hidratable

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | NO | HYD es un caso especial de SURF donde el mecanismo de población es "hydration" (JS convierte estructura vacía en estructura funcional). En la práctica, HYD y SURF no son distinguibles desde el HTML estático sin conocer la implementación JS. |
| C3 | INSUFICIENTE | La diferencia entre "div que recibe datos" (SURF) y "div que es hidratado" (HYD) no es observable desde el HTML. |

**Decisión: RECHAZADA — FUSIONADA CON SURF.** La distinción HYD/SURF requiere conocimiento de la implementación JS para ser significativa. Desde el HTML estático, todo ENT-SURF puede ser hidratado o no — no hay evidencia E1–E4 que lo distinga. Documentar como SURF con nota INFERIDO si hay evidencia de hidratación.

---

### 2.3 OVL — Overlay

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | PARCIAL | Un overlay podría documentarse como ENT-LAT con nota "activa como overlay". Pero el patrón overlay tiene características propias: panel modal/colgante activado por un GATE específico, con botón de cierre propio. |
| C2 | SÍ | Al menos 2 instancias en CAP-005 (#panel-carga-datos); patrón probable en bloques posteriores. |
| C3 | SÍ | Panel inicialmente oculto (display:none o CAPA=LEG) que, al activarse, se superpone visualmente al contenido existente sin navegar a otro elemento. Tiene: (a) activador en otro segmento del DOM; (b) botón de cierre propio; (c) gestión de visibilidad por función JS nombrada toggle* o similar. |
| C4 | DEBATIBLE | Es sub-familia de ENT-LAT, pero tiene restricciones adicionales. |

**Decisión: ACEPTADA COMO QUALIFIER DE ENT.** `TIPO_ENT: OVL`. El patrón overlay tiene suficiente especificidad (3 rasgos observables) para justificar su designación.

**Definición formalizada:**

> OVL: sub-tipo de ENT-LAT (hereda la condición de latencia/display:none). Panel estructuralmente oculto en HTML estático que, al activarse, se superpone visualmente a la capa de contenido principal. Observable por: (a) `display:none` como estado inicial; (b) función JS de activación con patrón toggle/show nombrada en otro elemento del DOM; (c) presencia de botón o mecanismo de cierre propio dentro del panel.

---

### 2.4 LAT — Estructura latente

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | SÍ | La latencia (`display:none` estructural, `disabled`, versiones ocultas) no es capturada adecuadamente por ningún calificador existente. |
| C2 | SÍ | ~10 instancias en CAP-005; presente en CAP-004 (formulario de hito). |
| C3 | SÍ | Elemento presente en el DOM en HTML estático pero no visible ni activo, cuya activación requiere JS externo o una transición de estado explícita. |
| C4 | NO | LAT no es sub-familia de ningún ENT existente — es una categoría transversal. |

**Decisión: ACEPTADA COMO QUALIFIER DE ENT. Prioritaria.** `TIPO_ENT: LAT` es la extensión más crítica del sistema porque permite distinguir estructuras latentes de estructuras activas, información que afecta directamente la evaluación de riesgo de modificación.

**Definición formalizada:**

> LAT: sub-tipo de ENT. Elemento presente en el HTML estático con `display:none` como style inline, atributo `disabled`, o comentario de desactivación parcial (E-LEG-2), cuya activación o habilitación requiere una acción JS externa al HTML. Un ENT-LAT es estructuralmente real, funcionalmente completo (tiene IDs, contenido, lógica asociada) pero operativamente inerte en la carga inicial.

**Sub-tipos de LAT:**
- `LAT-HIDDEN`: `display:none` inline, activable por JS.
- `LAT-DISABLED`: atributo HTML `disabled`, habilitado por JS.
- `LAT-LEGACY`: elemento con E-LEG-4 o E-LEG-5 (coexistencia v1/v2 o denominación legacy).

---

### 2.5 COEX — Coexistencia temporal

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | NO | La coexistencia no es una propiedad de un elemento — es una relación entre dos elementos. Como tipo de entidad, COEX carecería de referencia a sí mismo en el DOM. |
| C3 | PARCIAL | Definible, pero como RELACIÓN (REL-COEX) o como patrón de DV, no como ENT. |
| C4 | NO | No es sub-familia de ENT. |

**Decisión: RECHAZADA COMO TIPO DE ENT — TRANSFORMADA EN DV SUB-TIPO.**

La coexistencia v1/v2 es un patrón observable que afecta a pares de ENT (un ENT activo + un ENT-LAT-LEGACY). Se documenta como:

- DV con subtipo `COEX`: `DV-COEX` — documenta el patrón de coexistencia, referencia ambos ENTs involucrados, describe la relación declarada en el HTML (comentario de convivencia) y evalúa el riesgo de mantenimiento.
- La relación entre el ENT activo y el ENT-LAT-LEGACY se captura como REL con tipo "coexistencia declarada".

---

### 2.6 PERS — Persistencia estructural

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | PARCIAL | En la mayoría de casos, un elemento con CAPA=PER es suficiente. Pero hay elementos cuya FUNCIÓN PRIMARIA es la persistencia — no sólo la tienen como capa secundaria. El sub-panel de Marco estratégico existe principalmente para configurar y guardar datos en Firebase. |
| C2 | SÍ | Múltiples instancias en CAP-005; presente en bloques JS posteriores. |
| C3 | SÍ con condición | ENT cuya función primaria es el guardado o recuperación de datos; tiene al menos un control de guardado explícito (botón con función PER observable) Y una o más superficies de entrada de datos vinculadas al guardado. |
| C4 | DEBATIBLE | Es sub-familia de ENT con CAPA_DOMINANTE=PER. |

**Decisión: ACEPTADA CON CONDICIÓN RESTRICTIVA.** `TIPO_ENT: PERS`. Solo cuando CAPA_DOMINANTE=PER y el ENT tiene al menos: (1) función de guardado observable, (2) campos de entrada vinculados al guardado.

**Distinción con ENT+CAPA=PER:** todo ENT-PERS tiene CAPA=PER, pero no todo ENT con CAPA=PER es ENT-PERS. Un ENT con un botón secundario de guardado tiene CAPA=PER secundaria; un ENT cuyo propósito central es la gestión de datos persistentes es PERS.

---

### 2.7 PIPE — Pipeline funcional

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | NO | Un pipeline es un patrón de secuencia de funciones JS — no es un elemento HTML. No tiene nodo DOM propio. |
| C3 | INSUFICIENTE | "Secuencia de operaciones" no es observable en HTML estático. La presencia de 3 estados UI (inicial/proceso/resultado) SUGIERE un pipeline, pero la secuencia no es verificable desde el HTML. |

**Decisión: RECHAZADA COMO TIPO DE ENT.** Un pipeline no tiene representación en el HTML estático. El patrón "máquina de 3 estados UI" (inicial/proceso/resultado observable como 3 divs con `display:none`) se documentará como:

- Los 3 divs → 3 ENT independientes (tipo: LAT-HIDDEN para los 2 ocultos, regular para el visible).
- El patrón de máquina de estados → GAP con tipo "GAP-STATE-MACHINE": documenta la secuencia de estados, con las transiciones marcadas como FUERA_DEL_RANGO_AUDITADO.

---

### 2.8 GATE — Punto de activación

**Evaluación:**

| Criterio | Cumplimiento | Nota |
|----------|-------------|------|
| C1 | PARCIAL | Un GATE es un botón con onclick que activa un componente mayor. Ya se documenta como ENT + REL. Pero hay una categoría de botones que son "puertas de acceso" a sistemas completos (activar el panel de carga, abrir el monitor IBSE) vs. botones que ejecutan operaciones. |
| C2 | SÍ | Patrón presente en botones como `togglePanelCargaDatos()`, `togglePanelIBSEVisual()`, `mostrarFormularioHito()`. |
| C3 | SÍ con condición | Botón o elemento interactivo cuyo onclick activa o desactiva la visibilidad o estado de un ENT-OVL, ENT-LAT o componente mayor (no de una operación de datos). |

**Decisión: ACEPTADA CON RESTRICCIÓN DE ALCANCE.** `TIPO_ENT: GATE`. Solo para elementos cuya función observable es la activación/desactivación de una ESTRUCTURA COMPLETA (OVL, LAT, sección mayor), no para botones de operación de datos (guardar, exportar, registrar).

**Distinción GATE vs. ENT regular con onclick:**
- `btn-valoracion` (CAP-004): activa subsección → GATE potencial
- `btn-registrar` (CAP-004): envía formulario → ENT regular con CAPA=RT
- `togglePanelCargaDatos()` botón (CAP-005): activa OVL → GATE

---

### 2.9 Tabla resumen de decisiones sobre tipos de ENT

| Tipo propuesto | Decisión | Código final | Implementación |
|---------------|----------|-------------|----------------|
| SURF | ACEPTADO | `TIPO_ENT: SURF` | Qualifier en campo ENT; no nuevo contador |
| HYD | RECHAZADO — FUSIONADO | — | Usar SURF + nota INFERIDO si corresponde |
| OVL | ACEPTADO | `TIPO_ENT: OVL` | Qualifier; hereda LAT; no nuevo contador |
| LAT | ACEPTADO (PRIORITARIO) | `TIPO_ENT: LAT` | Qualifier con sub-tipos LAT-HIDDEN/DISABLED/LEGACY |
| COEX | RECHAZADO COMO ENT — TRANSFORMADO | `DV-COEX` | Sub-tipo de DV; referencia par de ENTs |
| PERS | ACEPTADO CON CONDICIÓN | `TIPO_ENT: PERS` | Qualifier; requiere CAPA_DOMINANTE=PER + función guardado |
| PIPE | RECHAZADO | — | Documentar como GAP-STATE-MACHINE + 3 ENT-LAT |
| GATE | ACEPTADO CON RESTRICCIÓN | `TIPO_ENT: GATE` | Qualifier; solo para activadores de estructuras completas |

---

## 3. REGLAS DE CLASIFICACIÓN — REVISIÓN

### Regla 1 — Multicapa permitida: CONFIRMADA

Un ENT puede tener múltiples capas. Formato canónico:

```
CAPA_DOMINANTE: [código]
CAPAS_SECUNDARIAS: [código1], [código2]
```

### Regla 2 — Capa dominante obligatoria: CONFIRMADA CON ACLARACIÓN

La CAPA_DOMINANTE es la que determina qué riesgos aplican al ENT y qué GAPs son esperables. Criterio de determinación:

- Si el ENT es **visible en carga inicial y responde a eventos** → UI-D dominante
- Si el ENT es **invisible en carga inicial** → LEG dominante (aunque sea plenamente funcional cuando se activa)
- Si el ENT es **un div vacío** → RT dominante
- Si el ENT tiene **función primaria de guardado** → PER dominante
- Si el ENT es **generador/receptor de análisis IA** → IA dominante

### Regla 3 — No inferencia ilegítima en IA: CONFIRMADA CON EJEMPLO

Solo clasifica IA cuando al menos una de estas evidencias E1–E4 está presente:
- `onclick` que llama a función con nombre semántico de análisis (`generarAnalisisIA`, `at2_generar`, `generarPerfilSaludLocal`)
- Presencia de campo tipo `password` para API key de IA (`#anthropic-api-key`)
- Comentario HTML que menciona IA, Claude, o motor analítico

No clasifica IA:
- Un `fetch()` genérico (no observable desde HTML estático)
- Un JSON que podría enviarse a una API (no observable)
- Un botón con texto que menciona "análisis" sin evidencia de integración IA

### Regla 4 — LEG requiere evidencia: CONFIRMADA — Ver §1.2 para criterios E-LEG-1 a E-LEG-5.

### Regla 5 (nueva) — Tipos de ENT son qualifiers, no contadores separados

**Los tipos SURF, OVL, LAT, PERS, GATE no generan prefijos de identificador nuevos.** Todos los elementos del HTML con identidad propia son ENT. El tipo es un ATRIBUTO adicional del ENT.

Formato de documentación en CAP-005-R1:

```
ENT-050 — [Nombre del elemento]
  SELECTOR: [div#id o similar]
  TIPO_ENT: SURF | OVL | LAT | PERS | GATE | (vacío si es ENT regular)
  SUBTIPO_LAT: LAT-HIDDEN | LAT-DISABLED | LAT-LEGACY (si TIPO_ENT=LAT)
  CAPA_DOMINANTE: [UI-S | UI-D | RT | PER | IA | LEG]
  CAPAS_SECUNDARIAS: [lista]
  ...resto de campos estándar...
```

### Regla 6 (nueva) — GAP-STATE-MACHINE para máquinas de estados UI

Cuando el HTML contiene ≥2 estados UI coexistentes (siblings con display:none que se alternan), documentar:
- Cada estado como ENT independiente (con TIPO_ENT: LAT si está oculto)
- Un GAP con subtipo GAP-STATE-MACHINE que referencia todos los ENTs de la máquina y declara que la lógica de transición es FUERA_DEL_RANGO_AUDITADO

### Regla 7 (nueva) — DV-COEX para coexistencia v1/v2

Cuando dos ENTs representan versiones paralelas del mismo sistema (v1/v2, legacy/sucesor):
- Documentar ambos como ENT individuales (el activo sin tipo especial; el oculto con TIPO_ENT: LAT-LEGACY)
- Crear una DV con subtipo COEX que los referencia a ambos
- Incluir en la DV el comentario HTML de convivencia si existe (evidencia E3)

---

## 4. SISTEMA DE NIVELES DE RIESGO — REVISIÓN

El sistema de 4 niveles propuesto es aceptado con un ajuste de definición para mayor precisión operacional.

| Nivel | Código | Definición formalizada | Acción recomendada |
|-------|--------|----------------------|-------------------|
| BAJO | RIESGO-BAJO | Segmento legible de forma lineal; todos los elementos son UI-S o UI-D simple sin dependencias externas críticas | Auditoría lineal estándar |
| MEDIO | RIESGO-MEDIO | Segmento con CAPA=RT o CAPA=LEG presente; dependencias JS parcialmente observables; ≤5 funciones por 100 líneas | Auditoría lineal con GAPs explícitos para dependencias RT |
| ALTO | RIESGO-ALTO | Segmento con ≥2 capas no-UI; ≥1 superficie dinámica mayor; dependencias Firebase o externas observables; >5 funciones por 100 líneas | Aplicar TIPO_ENT, CAPA_DOMINANTE, EXT-01/02/03 |
| MUY ALTO | RIESGO-MUY-ALTO | Segmento con ≥4 capas presentes; coexistencia v1/v2; máquinas de estado UI; dependencias IA; >8 funciones por 100 líneas | Aplicar GAP-STATE-MACHINE, DV-COEX, verificar cada afirmación contra jerarquía de certeza §5.2 del MARCO |

Asignación a segmentos de CAP-005 (referencia):

| Segmento | Nivel de riesgo |
|----------|----------------|
| SEG-A | RIESGO-BAJO |
| SEG-B | RIESGO-MEDIO |
| SEG-C | RIESGO-BAJO |
| SEG-D1 | RIESGO-ALTO |
| SEG-D2 | RIESGO-ALTO |
| SEG-D3 | **RIESGO-MUY-ALTO** |
| SEG-D4 | RIESGO-BAJO |
| SEG-D5 | RIESGO-MEDIO |
| SEG-D6 | RIESGO-MEDIO |
| SEG-D7 | RIESGO-ALTO |
| SEG-D8 | RIESGO-MEDIO |
| SEG-E1/E6 | RIESGO-MEDIO |
| SEG-E7 (07-v1 IA) | **RIESGO-MUY-ALTO** |
| SEG-E8 (07-v2 at2) | **RIESGO-MUY-ALTO** |
| SEG-F | RIESGO-BAJO |

---

## 5. TAXONOMÍA CONSOLIDADA PARA CAP-005-R1

Este apartado es la referencia operacional para el cartógrafo de CAP-005-R1.

### 5.1 Identificadores (sin cambios respecto a MARCO-METODOLOGICO)

| Prefijo | Objeto | Primer disponible |
|---------|--------|------------------|
| MR | Micro-Rango | MR-067 |
| ENT | Entidad (todos los sub-tipos) | ENT-050 |
| REL | Relación | REL-031 |
| CON | Contrato de visibilidad | CON-029 |
| GAP | Brecha de auditabilidad | GAP-028 |
| DV | Deuda visual/arquitectónica | DV-022 |

### 5.2 Tipos de ENT disponibles en CAP-005-R1

| TIPO_ENT | Descripción breve | Condición de uso |
|----------|------------------|-----------------|
| (vacío) | ENT estándar | Elemento con identidad propia sin característica especial |
| SURF | Superficie dinámica | Div vacío / placeholder de runtime |
| OVL | Overlay | Panel oculto que se superpone; activado por GATE |
| LAT | Estructura latente | display:none / disabled / comentario desactivación |
| PERS | Persistencia estructural | Función primaria = guardado/recuperación de datos |
| GATE | Punto de activación | Activa/desactiva ENT-OVL, ENT-LAT o sección mayor |

### 5.3 Sub-tipos de LAT

| SUBTIPO_LAT | Condición |
|-------------|-----------|
| LAT-HIDDEN | `display:none` inline como estado inicial estructural |
| LAT-DISABLED | Atributo HTML `disabled` presente |
| LAT-LEGACY | E-LEG-4 o E-LEG-5 (denominación legacy o coexistencia v1/v2) |

### 5.4 Capas canónicas

| Código | Nombre | CAPA_DOMINANTE cuando... |
|--------|--------|--------------------------|
| UI-S | UI Estática | Elemento visible, sin eventos, sin dependencias dinámicas |
| UI-D | UI Dinámica | Elemento visible con onclick/onchange/listeners conocidos |
| RT | Runtime | Elemento cuya función primaria es activar/ejecutar JS |
| PER | Persistencia | Elemento cuya función primaria es guardar/recuperar datos |
| IA | IA | Elemento generador/receptor de análisis semántico inteligente |
| LEG | Legacy/Latente | Elemento oculto, desactivado o en coexistencia |

### 5.5 Sub-tipos de GAP relevantes para CAP-005

| Sub-tipo GAP | Cuándo usar |
|-------------|------------|
| GAP estándar | Función JS referenciada; implementación FUERA |
| GAP-STATE-MACHINE | ≥2 estados UI coexistentes con transiciones FUERA |
| GAP-PERSISTENCE | Mecanismo de Firebase/localStorage FUERA |
| GAP-IA-ENGINE | Motor de análisis IA; prompts; lógica semántica FUERA |
| GAP-EXTERNAL-DEP | URL hardcodeada, REDCap, plataforma externa |

### 5.6 Sub-tipos de DV relevantes para CAP-005

| Sub-tipo DV | Cuándo usar |
|------------|------------|
| DV estándar | Duplicación, inline styles aislados |
| DV-COEX | Par v1/v2 con relación de coexistencia observable |
| DV-INLINE-SYS | Inline styles como sistema arquitectónico (no como excepción) |
| DV-HANDLER-EMPTY | `onchange=""` u handler vacío en grupo de ≥3 elementos |
| DV-HARDCODED-URL | URL hardcodeada en onclick/href |

### 5.7 Sub-tipos de CON relevantes para CAP-005

| Mecanismo | Campo adicional en CON |
|-----------|----------------------|
| Clase CSS (patrón previo) | `mecanismo: clase-CSS` |
| display:none inline (nuevo) | `mecanismo: inline-display-none` |
| Atributo disabled (nuevo) | `mecanismo: atributo-disabled` |

### 5.8 Extensiones EXT obligatorias en CAP-005-R1

Estas tres extensiones son obligatorias. Su omisión en cualquier ENT es un error de documentación.

| Extensión | Campo obligatorio | Valores |
|-----------|-----------------|---------|
| EXT-01 | `CAPA_DOMINANTE` + `CAPAS_SECUNDARIAS` | Ver §5.4 |
| EXT-02 | `mecanismo` en CON con display:none | `inline-display-none` |
| EXT-03 | `DV-COEX` para cada par v1/v2 | Referencias a ambos ENTs |

---

## 6. INSTRUCCIONES DE IMPLEMENTACIÓN

### 6.1 Para el cartógrafo de CAP-005-R1

1. **Leer** ESTRUCTURA-CAP-005-R1 antes de comenzar — el mapa de segmentos es el esquema de MR.
2. **Aplicar TIPO_ENT** a cada ENT documentado; no dejar el campo vacío a menos que el ENT sea genuinamente estándar.
3. **Los ENT-LAT** deben documentarse con su estado inicial observable (qué tiene `display:none`), su activador (qué función lo hace visible, marcado FUERA_DEL_RANGO_AUDITADO), y su SUBTIPO_LAT.
4. **Los GAP-STATE-MACHINE** deben referenciar todos los ENTs de la máquina de estados en su descripción.
5. **Las DV-COEX** deben incluir: (a) ENT activo, (b) ENT-LAT-LEGACY correspondiente, (c) comentario HTML de convivencia si existe.
6. **Los onchange="" vacíos** del Marco estratégico (7 instancias) se documentan como UN ÚNICO DV-HANDLER-EMPTY — no 7 GAPs individuales.
7. **La URL hardcodeada** de REDCap se documenta como DV-HARDCODED-URL + GAP-EXTERNAL-DEP.

### 6.2 Para el intérprete de CAP-005-R1

- Los ENT-LAT son estructuras REALES con riesgo de modificación tan alto como los ENT visibles — su ocultamiento no los hace prescindibles.
- Las capas CAPA=PER y CAPA=IA en un ENT implican siempre un GAP-PERSISTENCE o GAP-IA-ENGINE respectivamente.
- Un DV-COEX no es una recomendación de eliminar una versión — es documentación de un estado arquitectónico observable sin prescripción.

---

## 7. LÍMITES DE LA EXPANSIÓN TAXONÓMICA

Este apartado fija el punto de congelación de la taxonomía. No se añadirán nuevos tipos de ENT, sub-tipos de GAP o sub-tipos de DV sin revisión formal del MARCO-METODOLOGICO-CARTOGRAFIA.

### 7.1 Qué se ha añadido

Con ESTABILIZACION-MULTICAPA-R1, el sistema ha incorporado:

- 5 tipos de ENT: SURF, OVL, LAT, PERS, GATE
- 3 sub-tipos de LAT: LAT-HIDDEN, LAT-DISABLED, LAT-LEGACY
- 5 sub-tipos de GAP: estándar, STATE-MACHINE, PERSISTENCE, IA-ENGINE, EXTERNAL-DEP
- 5 sub-tipos de DV: estándar, COEX, INLINE-SYS, HANDLER-EMPTY, HARDCODED-URL
- 3 mecanismos de CON: clase-CSS, inline-display-none, atributo-disabled

### 7.2 Qué se ha rechazado y por qué

| Tipo rechazado | Razón |
|---------------|-------|
| HYD | Indistinguible de SURF desde HTML estático |
| COEX (ENT) | Es una relación, no una entidad; se expresa como DV-COEX |
| PIPE | No observable en HTML estático; patrón JS puro |

### 7.3 Señal de alerta para revisión futura

Si en CAP-006 o posteriores emergen más de 3 instancias de un patrón no cubierto por la taxonomía actual, proceder a revisión del MARCO-METODOLOGICO-CARTOGRAFIA (creando R2) antes de auditar el bloque. No añadir sub-tipos ad-hoc dentro de un CAP.

---

## 8. VEREDICTO FORMAL

```
╔══════════════════════════════════════════════════════════════════════╗
║  VEREDICTO: TAXONOMIA_MULTICAPA_ESTABILIZADA                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  Capas canónicas: 6 — CONFIRMADAS (UI-S, UI-D, RT, PER, IA, LEG)   ║
║  Tipos de ENT nuevos: 5 ACEPTADOS — SURF, OVL, LAT, PERS, GATE     ║
║  Tipos rechazados: 3 — HYD (→SURF), COEX ENT (→DV), PIPE (→GAP)   ║
║  Sub-tipos de LAT: 3 — HIDDEN, DISABLED, LEGACY                    ║
║  Sub-tipos de GAP: 5 — incluyendo STATE-MACHINE, PERSISTENCE, IA   ║
║  Sub-tipos de DV: 5 — incluyendo COEX, INLINE-SYS, HANDLER-EMPTY  ║
║  Mecanismos de CON: 3 — CSS, inline-display-none, disabled         ║
║  Extensiones EXT obligatorias en CAP-005-R1: EXT-01, EXT-02, EXT-03║
║  Expansión taxonómica: CONGELADA hasta próxima revisión del MARCO  ║
╚══════════════════════════════════════════════════════════════════════╝
```

**El sistema de gobierno está estabilizado. CAP-005-R1 puede iniciarse.**

---

*ESTABILIZACION-MULTICAPA-R1 — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
