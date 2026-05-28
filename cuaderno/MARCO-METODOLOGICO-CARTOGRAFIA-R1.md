# MARCO-METODOLOGICO-CARTOGRAFIA-R1
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** MARCO-METODOLOGICO-CARTOGRAFIA-R1  
**Tipo:** Consolidación metodológica — documento de gobernanza  
**Revisión:** R1 (inicial)  
**Estado:** VIGENTE  
**Fecha:** 2026-05-28  
**Ámbito:** Cartografía de index.html — bloques CAP-001 a CAP-004 y posteriores  

---

## PREÁMBULO

Este documento consolida explícitamente la metodología de cartografía emergida en los bloques CAP-001 a CAP-004. Su propósito no es describir lo que se cartografía, sino cómo se cartografía: las categorías que se usan, las reglas que gobiernan su uso, los límites que no deben cruzarse y los riesgos que deben vigilarse.

El documento es prescriptivo respecto a la metodología futura y descriptivo respecto a la metodología pasada. No deroga ni modifica ningún CAP previo. Es la fuente de referencia para resolver ambigüedades metodológicas en CAP-005 y posteriores.

---

## ÍNDICE

1. Glosario metodológico
2. Taxonomía observada y consolidada
3. Gobernanza taxonómica
4. Gobernanza de identificadores
5. Disciplina de inferencia
6. Auditoría epistemológica
7. Propuesta de evolución controlada
8. Criterios de apertura de nuevos rangos
9. Criterios de congelación de CAP
10. Riesgos estructurales del sistema
11. Recomendaciones de disciplina analítica
12. Veredicto formal

---

## 1. GLOSARIO METODOLÓGICO

Las definiciones siguientes son operacionales: su propósito es delimitar el significado exacto de cada término dentro de este sistema de cartografía, no proveer definiciones académicas generales.

---

### 1.1 Entidad (ENT)

**Definición:** Unidad estructural o semántica del HTML que puede ser identificada, delimitada y descrita de forma autónoma dentro de un rango auditado. Una entidad existe cuando cumple al menos uno de los siguientes criterios:

- Tiene un `id` único en el HTML.
- Tiene una clase CSS semánticamente específica que la identifica como componente (no como modificador auxiliar).
- Contiene una función observable del sistema (formulario, lista, contenedor de exportación, etc.).
- Es referenciada desde otra entidad o desde el HTML circundante.

**Lo que NO es una entidad:** un blanco de formato, un separador sin semántica, un `</div>` de cierre sin identidad propia, un modificador de clase auxiliar (`secundario`, `terciario`) sin función independiente.

**Estado de una entidad:** toda entidad recibe el estado `AUDITADO_PROVISIONAL` al ser documentada por primera vez. El estado evoluciona a través del proceso de auditoría.

**Granularidad:** una entidad debe ser la unidad mínima con identidad propia. Si un elemento sólo existe en función de su contenedor (ej.: un `<span>` dentro de un botón), se documenta como sub-elemento del contenedor, no como entidad independiente, salvo que tenga un ID propio o una función semántica autónoma verificable.

---

### 1.2 Relación (REL)

**Definición:** Vínculo observable o inferido entre dos o más elementos del sistema — entidades, funciones JS, eventos, contratos — que expresa una dependencia funcional, una activación, un flujo de datos o una referencia estructural.

**Tipos de relación reconocidos:**

| Tipo | Descripción | Evidencia requerida |
|------|-------------|---------------------|
| Activación inline | Atributo `onclick`, `onchange`, `onmouseover`, etc. directamente en el HTML | Atributo observable en el rango |
| Referencia implícita | ID presente en el HTML sin `onclick`; consumidor JS presumible | ID observable + justificación funcional documentada |
| Anidamiento estructural | Relación padre/hijo en el DOM | Estructura observable |
| Dependencia de clase CSS | Elemento usa clase cuya definición está fuera del rango | Clase observable + ubicación de definición marcada FUERA_DEL_RANGO_AUDITADO |
| Flujo de datos | Campo de formulario consumido por función JS | Combinación de campo observable + función referenciada |

**Regla de documentación:** toda relación debe declarar explícitamente si su destino es OBSERVABLE o FUERA_DEL_RANGO_AUDITADO. No puede documentarse una relación cuyo destino no haya sido calificado epistemológicamente.

---

### 1.3 Contrato (CON)

**Definición:** Mecanismo declarativo — generalmente mediado por clases CSS — que establece un estado visual o funcional observable en el HTML estático. Un contrato expresa que la presencia o ausencia de una clase CSS en un elemento produce un efecto determinado en la presentación o comportamiento del sistema.

**Condición necesaria para documentar un contrato:** debe existir evidencia directa en el HTML — una clase presente en el atributo `class` del elemento — que actúe como activador o marcador de un estado. No puede documentarse un contrato a partir únicamente de su función JS productora.

**Estado de un contrato:**
- `COMPLETO`: el activador HTML es observable Y la regla CSS que lo implementa está en el rango auditado.
- `PARCIAL`: el activador HTML es observable, pero la regla CSS y/o el consumidor JS están FUERA_DEL_RANGO_AUDITADO. Este es el estado habitual para contratos en bloques HTML cuando el CSS reside en CAP-001.

**Contratos emergidos hasta CAP-004:**
- CON-001 a CON-025: documentados en CAP-001 a CAP-002 (CSS).
- CON-026: clase `.activa` en `.fase` de nav.relas-container (CAP-003).
- CON-027: clase `.activa` en `#fase-1-contenido` (CAP-004).
- CON-028: clase `.formulario-hito` en `#formulario-hito-personalizado` (CAP-004).

---

### 1.4 Deuda visual / arquitectónica (DV)

**Definición:** Observación de un patrón observable en el HTML que sugiere una limitación, inconsistencia o riesgo de mantenimiento respecto a las convenciones del sistema. Las DV no son errores confirmados — son señales de vigilancia documentadas.

**Condición para documentar una DV:** el patrón debe ser directamente observable en el HTML. La calificación como "deuda" puede contener un componente interpretativo (INFERIDO), que debe ser explicitado. Una DV nunca puede elevarse a hecho arquitectónico verificado basándose únicamente en el HTML estático.

**Tipos de DV reconocidos:**

| Tipo | Descripción | Ejemplo emergido |
|------|-------------|-----------------|
| Duplicación estructural | Bloque HTML repetido literalmente | DV-020: export-buttons top/bottom |
| Uso de inline styles | Estilo presentacional en atributo `style` donde cabría clase CSS | DV-021: contenedores y botones en CAP-004 |
| Inconsistencia de atribución | Clase o función atribuida incorrectamente en documentación (no en HTML) | MAY-001 en CAP-003 |
| Estado transitorio no gestionado | Elemento en estado que sugiere intervención manual incompleta | Comentario `<!-- CAMBIO COMPAS -->` en l.2677 |

---

### 1.5 Gap (GAP)

**Definición:** Límite explícito del conocimiento derivable del rango auditado. Un GAP no es una anomalía — es la declaración honesta de que un aspecto del sistema es real y relevante pero no cartografiable desde el rango actual.

**Condición para documentar un GAP:** debe existir un elemento observable en el rango (ID, clase, `onclick`, div vacío, etc.) que apunta hacia una funcionalidad cuya implementación está fuera del rango. No se documentan GAPs para aspectos puramente hipotéticos.

**Tipos de GAP reconocidos:**

| Tipo | Descripción | Ejemplo emergido |
|------|-------------|-----------------|
| Implementación JS ausente | Función referenciada mediante `onclick` cuya implementación está en l.X+ | GAP-26 (funciones de exportación) |
| Consumidor JS implícito | ID sin `onclick` con consumidor JS presumible | GAP-25 (btn-valoracion, etc.) |
| Contenedor dinámico vacío | `div` vacío cuyo contenido es generado en tiempo de ejecución | GAP-23 (#contenido-informe-dinamico) |
| Dependencia CSS externa | Clase cuya definición está en otro bloque auditado | Mención habitual en ENT con "FUERA_DEL_RANGO_AUDITADO (CAP-001)" |
| Datos de runtime | Valores dinámicos (ej.: opciones de selector, texto de municipio) | GAP-18 (#municipio) |

**Criterio de resolución:** todo GAP debe declarar dónde puede resolverse (ej.: "Requiere l.2833+"). Un GAP sin criterio de resolución es una deuda epistemológica.

---

### 1.6 Evidencia

**Definición:** Fundamento observable que justifica una afirmación en la cartografía. La evidencia es el puente entre el HTML estático y la afirmación documental.

**Jerarquía de evidencia (de mayor a menor solidez):**

| Nivel | Tipo | Descripción |
|-------|------|-------------|
| E1 | Atributo HTML directo | `id`, `class`, `type`, `onclick`, `data-*`, `required`, `value` |
| E2 | Contenido textual | Texto visible en etiquetas, placeholders, `<option>` |
| E3 | Comentario HTML | `<!-- -->` — evidencia de intención editorial, no de comportamiento |
| E4 | Estructura de anidamiento | Jerarquía DOM observable |
| E5 | Ausencia significativa | Div vacío, campo sin `required`, botón sin `onclick` |
| E6 | Convención de nombre | Nombre de función, clase o ID sugerente de función |

**Regla:** toda afirmación de CAP debe referenciar implícita o explícitamente un nivel de evidencia E1–E5 como mínimo. Las afirmaciones basadas únicamente en E6 (convención de nombre) deben ser marcadas como INFERIDO.

---

### 1.7 Observación

**Definición:** Afirmación respaldada por evidencia E1–E5 sobre la estructura, contenido o comportamiento estático del HTML en el rango auditado. Una observación es verificable directamente leyendo el HTML.

**Distinción respecto a inferencia:** una observación describe lo que está; una inferencia describe lo que probablemente hace o significa.

---

### 1.8 Placeholder

**Definición:** Elemento HTML cuyo contenido o funcionalidad en el HTML estático es incompleto o vacío, destinado a ser completado en tiempo de ejecución. Un placeholder es un contrato implícito con el runtime: "aquí habrá contenido".

**Tipos reconocidos:**
- Div vacío con ID (`#contenido-informe-dinamico`, `#hitos-lista`): contenido generado íntegramente por JS.
- Texto de estado inicial (`"No hay miembros."`, `"Padul"` en span dinámico): valor estático sustituible en runtime.
- Campo de formulario vacío: valor a ser provisto por el usuario o pre-poblado por JS.

**Implicación metodológica:** los placeholders deben documentarse como tales — no como "elementos incompletos" sino como "superficies de hidratación previstas".

---

### 1.9 Superficie runtime

**Definición:** Zona del HTML estructuralmente presente en la carga estática pero cuyo contenido, estado o comportamiento final depende de la ejecución del JS. Las superficies runtime son la interfaz entre la estructura estática y el sistema dinámico.

**Ejemplos emergidos:**
- `#contenido-informe-dinamico` (ENT-044): superficie de contenido de informe.
- `#tabla-miembros` (ENT-046): superficie de lista de miembros.
- `#hitos-lista` (ENT-049): superficie de lista de hitos.
- `<span class="nombre-municipio-dinamico">Padul</span>`: superficie de texto dinámico.

**Criterio de documentación:** una superficie runtime debe cartografiarse con su estado estático observable (vacío / con placeholder / con valor por defecto) y con el GAP correspondiente a su contenido dinámico.

---

### 1.10 Hidratación

**Definición:** Proceso por el cual el JS popula, actualiza o transforma el contenido de una superficie runtime. La hidratación es FUERA_DEL_RANGO_AUDITADO cuando su mecanismo JS reside fuera del rango analizado.

**Uso metodológico:** se usa el término "pendiente de hidratación" para indicar que una superficie runtime ha sido identificada pero su ciclo de vida dinámico no es cartografiable desde el rango actual. No es sinónimo de "incompleto" ni de "error".

---

### 1.11 Dependencia

**Definición:** Relación en la que un elemento A requiere la existencia o comportamiento de un elemento B para funcionar correctamente. Las dependencias pueden ser:
- **Estructurales:** A depende del posicionamiento de B en el DOM.
- **Funcionales:** A depende de que B ejecute cierta acción JS.
- **Visuales:** A depende de que B defina una clase CSS.
- **De datos:** A depende de que B provea ciertos datos en runtime.

**Regla:** toda dependencia debe calificarse como OBSERVABLE o FUERA_DEL_RANGO_AUDITADO.

---

### 1.12 Consumidor

**Definición:** Entidad o función que lee, procesa o utiliza el estado o contenido de otra entidad. El consumidor es el destino de una dependencia.

**Tipos reconocidos:**
- Consumidor JS de un ID: función JS que referencia un elemento por ID para leer o modificar su contenido.
- Consumidor CSS: regla CSS que selecciona un elemento por clase o ID para aplicar estilos.
- Consumidor de evento: función ligada a un evento (click, change) de un elemento.

**Regla de inferencia:** cuando un consumidor no es observable en el rango, puede documentarse como "consumidor presumible" sólo si existe evidencia E1–E5 que lo haga necesario (ej.: div vacío con ID, botón con `onclick` declarado).

---

### 1.13 Productor

**Definición:** Entidad o función que genera, actualiza o provee el contenido o estado de otra entidad. El productor es el origen de una dependencia.

**Ejemplos emergidos:**
- `registrarMiembro()` como productor de `#tabla-miembros`.
- El selector `#municipio` (ENT-039) como productor de `<span class="nombre-municipio-dinamico">`.
- `guardarHitoPersonalizado()` como productor de nuevos elementos en `#hitos-lista`.

---

### 1.14 Trigger

**Definición:** Elemento o mecanismo que inicia una acción en el sistema. En el contexto de este HTML, los triggers observables son:
- Atributos de evento inline (`onclick`, `onchange`, `onmouseover`, `onmouseout`).
- IDs de botones o controles que son objetivo de `addEventListener` en JS (consumidor FUERA_DEL_RANGO_AUDITADO).

**Distinción trigger / relación:** un trigger es un hecho del HTML (observable); la relación REL es la formalización documental de ese trigger junto con su destino.

---

### 1.15 Estado visual

**Definición:** Configuración de presentación de un elemento determinada por la presencia o ausencia de una clase CSS. Los estados visuales son el mecanismo por el que el JS modifica la apariencia de la interfaz sin necesidad de recargar la página.

**Ejemplos emergidos:**
- `.activa` en `.fase` (CON-026): determina qué fase RELAS es visible.
- `.activa` en `#fase-1-contenido` (CON-027): determina la visibilidad de la fase principal.
- `.formulario-hito` (CON-028): determina la visibilidad del formulario de hito.

---

### 1.16 Estructura legacy

**Definición:** Elemento HTML presente en el código que evidencia una intención de diseño o implementación anterior, posiblemente modificada o no completamente actualizada. Una estructura legacy no es necesariamente incorrecta — es una huella del historial de cambios.

**Evidencias de legacy en el rango auditado:**
- Comentario `<!-- CAMBIO COMPAS: eliminar inline que anulaba CSS -->` (l.2677): documenta una intervención pasada.
- Presencia de `style` inline en `#contenido-informe-dinamico` y `.export-buttons` (l.2684, l.2698): patrón anterior que convive con el sistema de clases.

**Regla de documentación:** las estructuras legacy se documentan como DV o como notas observacionales, nunca como errores activos, a menos que exista evidencia de conflicto funcional observable.

---

### 1.17 Estructura activa

**Definición:** Elemento HTML que participa activamente en el funcionamiento actual del sistema: tiene consumidores, produce estados, es referenciado desde el JS, o tiene efectos visuales observables. Opuesto relativo a estructura legacy.

---

### 1.18 Trazabilidad

**Definición:** Capacidad de rastrear cualquier afirmación documental hasta su evidencia en el HTML fuente. Una afirmación es trazable si puede localizarse la línea o rango de líneas de index.html que la respalda.

**Regla de trazabilidad:** toda afirmación de CAP que no pueda trazarse a una línea o rango específico de index.html debe marcarse como INFERIDO o eliminarse.

---

### 1.19 Auditabilidad

**Definición:** Capacidad de un elemento o aspecto del sistema de ser cartografiado con precisión desde el rango analizado. La auditabilidad es función del rango: un elemento puede ser auditable en un rango más amplio aunque no lo sea en el rango actual.

**Límites de auditabilidad reconocidos:**
- CSS en bloque distinto al auditado: FUERA_DEL_RANGO_AUDITADO (referencia a CAP-001).
- Implementación JS en rango posterior: FUERA_DEL_RANGO_AUDITADO (referencia a l.X+).
- Contenido dinámico en tiempo de ejecución: NO_AUDITABLE_DESDE_HTML_ESTÁTICO.
- Comportamiento de persistencia (Firebase, localStorage): NO_AUDITABLE_DESDE_HTML_ESTÁTICO.

---

## 2. TAXONOMÍA OBSERVADA Y CONSOLIDADA

### 2.1 Categorías de identificador

Las categorías de identificador son los tipos de objeto que el sistema de cartografía reconoce como unidades documentales formales. Cada categoría tiene prefijo propio, contador global y reglas de creación.

| Prefijo | Nombre completo | Objeto que representa |
|---------|-----------------|----------------------|
| MR | Micro-Rango | Segmento contiguo de líneas dentro de un bloque |
| ENT | Entidad | Unidad estructural/semántica con identidad propia |
| REL | Relación | Vínculo observable entre elementos del sistema |
| CON | Contrato | Mecanismo de estado visual basado en clase CSS |
| GAP | Brecha | Límite explícito de auditabilidad con criterio de resolución |
| DV | Deuda visual/arquitectónica | Patrón observable de riesgo o inconsistencia |

### 2.2 Estados de objeto

Los estados son calificaciones del nivel de completitud o verificación de un objeto cartográfico.

**Estados de entidad (ENT):**

| Estado | Significado |
|--------|-------------|
| `AUDITADO_PROVISIONAL` | Documentado desde el rango actual; pendiente de auditoría formal |
| `CONGELABLE_CON_OBSERVACIONES` | Auditable con limitaciones conocidas y documentadas |
| `FUERA_DEL_RANGO_AUDITADO` | El elemento existe pero su definición está en otro rango |
| `VERIFICADO_EN_CAP` | Verificado directamente en el artefacto CAP correspondiente |
| `PENDIENTE_VALIDACION` | Requiere confirmación en QA o bloque posterior |

**Estados de contrato (CON):**

| Estado | Significado |
|--------|-------------|
| `COMPLETO` | Activador HTML + CSS observables en el mismo rango |
| `PARCIAL` | Activador HTML observable; CSS y/o JS en otro rango |

**Estados de derivado (CHK, ARB, DERIVABILIDAD):**

| Estado | Significado |
|--------|-------------|
| `VERIFICADO_EN_CAP` | Ítem completamente derivable del CAP fuente |
| `FUERA_DEL_RANGO_AUDITADO` | Ítem no derivable desde el CAP fuente |
| `PENDIENTE` | Ítem requiere QA o fuente externa |

**Estados de CAP (bloque):**

| Estado | Significado |
|--------|-------------|
| `AUDITADO_PROVISIONAL` | Primera documentación, pendiente de auditoría |
| `CONGELABLE_CON_OBSERVACIONES` | Documentación completa con GAPs y DV no bloqueantes |
| `NO_CONGELABLE` | Hallazgos mayores que impiden congelación |
| `EXPEDIENTE_CERRADO` | Ciclo completo: CAP + CHK + ARB + DERIVABILIDAD + CIERRE |

**Estados de apertura:**

| Estado | Significado |
|--------|-------------|
| `DELIMITACIÓN_APROBADA` | Rango del siguiente bloque aprobado; CAP no iniciado |
| `DELIMITACIÓN_CON_OBSERVACIONES` | Rango aprobado con reservas documentadas |
| `DELIMITACIÓN_NO_APROBADA` | Rango rechazado; requiere nueva propuesta |

### 2.3 Calificadores epistemológicos

Los calificadores epistemológicos son adjetivos metodológicos que acompañan a cualquier afirmación sobre el sistema para declarar su nivel de certeza.

| Calificador | Significado | Tipo de evidencia requerida |
|-------------|-------------|---------------------------|
| `OBSERVABLE` | Verificable directamente leyendo el HTML del rango | E1–E4 |
| `PARCIALMENTE_OBSERVABLE` | Parte observable en el rango; parte en otro rango | E1–E4 + referencia al rango externo |
| `INFERIDO` | Derivado de convención, nombre o contexto; no verificable directamente | E5–E6 con justificación explícita |
| `ALTAMENTE_INFERIDO` | Derivado de suposiciones sobre el sistema; riesgo epistemológico alto | E6 con advertencia explícita |
| `FUERA_DEL_RANGO_AUDITADO` | La información existe pero en otro rango | Referencia al rango donde se resuelve |
| `NO_VERIFICABLE_DESDE_HTML_ESTÁTICO` | No determinable desde el HTML sin ejecutar el sistema | Sin evidencia posible en HTML |

---

## 3. GOBERNANZA TAXONÓMICA

### 3.1 Cuándo puede crearse una categoría nueva

Una categoría nueva (nuevo tipo de identificador o estado) puede crearse únicamente cuando se cumplen **todas** las condiciones siguientes:

1. El objeto a representar no puede documentarse adecuadamente con ninguna categoría existente.
2. El objeto aparece al menos dos veces en el rango analizado o tiene alta probabilidad de reaparecer en bloques futuros.
3. La categoría nueva tiene una definición operacional precisa que la distingue inequívocamente de las existentes.
4. La categoría no es una subfamilia de una categoría existente que podría expresarse con un modificador (ej.: un tipo de ENT no requiere nueva categoría si puede tipificarse con un atributo adicional).

**La creación de una categoría nueva debe ser explícita en el documento que la introduzca** — no puede surgir implícitamente en el cuerpo de un CAP sin declaración formal.

### 3.2 Cuándo NO puede crearse una categoría nueva

- Cuando refleja únicamente una preferencia semántica del cartógrafo.
- Cuando es equivalente a una categoría existente con distinto nombre.
- Cuando su ámbito se solapa más del 50% con una categoría existente.
- Cuando no aparece evidencia de su necesidad en el rango analizado.
- Cuando es una categoría provisional para documentar un caso único.

### 3.3 Cuándo una categoría debe fusionarse

Una categoría debe fusionarse con otra cuando:
- Su definición operacional se vuelve indistinguible de la otra en la práctica.
- Los objetos que documenta habrían podido documentarse con la otra sin pérdida de información.
- La separación genera confusión o inconsistencia en la aplicación.

La fusión debe realizarse mediante una enmienda formal al MARCO-METODOLOGICO con número de revisión.

### 3.4 Cuándo una categoría es redundante

Una categoría es redundante cuando puede reemplazarse por la combinación de una categoría existente + un calificador epistemológico o un tipo declarado explícitamente en el cuerpo del objeto.

**Ejemplo hipotético:** si se plantea crear "ENT-DINAMICA" para entidades con superficie runtime, esta categoría sería redundante — las entidades con superficie runtime pueden documentarse como ENT con atributo `superficie runtime: Sí` y GAP asociado.

### 3.5 Control de proliferación de estados

Los estados son los valores posibles de un atributo de estado de un objeto (ENT, CON, CAP, etc.). Los estados son especialmente propensos a proliferación.

**Regla:** antes de introducir un nuevo estado, verificar que no puede expresarse como:
- Un estado existente + una observación en el campo "notas".
- Un estado existente con un calificador `_CON_RESERVAS` o `_PROVISIONAL`.
- La combinación de dos estados en documentos distintos.

**Estados prohibidos por redundancia** (no introducirlos):
- `AUDITADO_COMPLETO` (ya cubierto por `CONGELABLE_CON_OBSERVACIONES` cuando no hay hallazgos mayores).
- `VERIFICADO_SIN_OBSERVACIONES` (ya cubierto por `VERIFICADO_EN_CAP`).
- `FUERA_DE_ALCANCE` (ya cubierto por `FUERA_DEL_RANGO_AUDITADO`).

### 3.6 Registro de nuevas familias analíticas

Si en CAP-005 o posteriores emerge un patrón que requiere una nueva familia analítica (ej.: comportamiento Firebase, estado de inicialización, ciclo de vida de componente), el proceso es:

1. Documentar el patrón como OBS (observación) en el CAP donde emerge.
2. Si el patrón reaparece en dos o más instancias en bloques distintos, proponer formalización en una revisión del MARCO-METODOLOGICO.
3. La formalización requiere: nombre de categoría, definición operacional, criterios de creación, relación con categorías existentes.

---

## 4. GOBERNANZA DE IDENTIFICADORES

### 4.1 Principio fundamental

Los identificadores son globales, únicos e irreversibles. Un identificador asignado a un objeto en CAP-N no puede:
- Reutilizarse para un objeto distinto.
- Eliminarse y reasignarse.
- Modificarse retroactivamente sin una enmienda formal con trazabilidad completa.

### 4.2 Reglas de creación

| Prefijo | Regla de creación |
|---------|------------------|
| MR | Se crea uno por segmento contiguo de líneas dentro del bloque. Los segmentos deben ser no solapados y juntos cubrir el 100% del rango. |
| ENT | Se crea uno por elemento que cumple la definición de entidad (§1.1). |
| REL | Se crea uno por vínculo funcional distinto. Varios `onclick` del mismo tipo y origen pueden agruparse en una REL si son funcionalmente homogéneos. |
| CON | Se crea uno por estado visual gestionado por clase CSS. |
| GAP | Se crea uno por límite de auditabilidad con criterio de resolución distinto. No duplicar GAPs que apuntan al mismo rango de resolución y el mismo tipo de límite. |
| DV | Se crea uno por patrón de riesgo o inconsistencia observable con identidad propia. |

### 4.3 Continuidad inter-CAP

Los contadores son globales a toda la cartografía de index.html. El primer identificador de un CAP-N es la continuación del último identificador de CAP-(N-1).

**Estado actual de contadores tras CAP-004-R1:**

| Tipo | Último usado | Próximo disponible |
|------|-------------|-------------------|
| MR | MR-066 | MR-067 |
| ENT | ENT-049 | ENT-050 |
| REL | REL-030 | REL-031 |
| CON | CON-028 | CON-029 |
| GAP | GAP-027 | GAP-028 |
| DV | DV-021 | DV-022 |

**Regla de continuidad:** el primer acto de un nuevo CAP es declarar explícitamente los identificadores heredados del bloque anterior. Cualquier discontinuidad (salto numérico, reutilización) es un error de trazabilidad.

### 4.4 Reglas de reutilización

Los identificadores **no se reutilizan**. Si un objeto fue documentado en un CAP anterior, se hace referencia a él por su identificador original. Ejemplo: "Véase ENT-039 (CAP-003)" es la forma correcta de referirse a un objeto de un bloque anterior; no se le asigna un nuevo número ENT en el bloque actual.

### 4.5 Reglas de congelación

Un identificador se considera "congelado" cuando su CAP fuente alcanza el estado `EXPEDIENTE_CERRADO`. A partir de ese momento:
- El objeto que representa no puede modificarse sin una enmienda al CAP fuente.
- Cualquier nueva observación sobre el objeto se documenta como nota en el CAP donde emerge, con referencia al identificador congelado.

### 4.6 Reglas de invalidación

Un identificador puede invalidarse únicamente si:
- El elemento que representa desaparece del código fuente en una revisión de index.html documentada formalmente.
- La invalidación se documenta explícitamente en el CAP que la detecta, con referencia al CAP original y al identificador invalidado.

Los identificadores invalidados no se reutilizan; el contador continúa desde el siguiente número.

---

## 5. DISCIPLINA DE INFERENCIA

### 5.1 Fundamento

La cartografía es un sistema de afirmaciones sobre el código. La calidad del sistema depende de la precisión con la que se distingue lo que se sabe de lo que se supone. La mezcla de observaciones e inferencias sin calificación explícita es el principal vector de corrupción documental.

### 5.2 Jerarquía de certeza

```
OBSERVABLE
    ↑ más certeza
    │
    PARCIALMENTE_OBSERVABLE
    │
    INFERIDO (con justificación explícita)
    │
    ALTAMENTE_INFERIDO (con advertencia explícita)
    │
    FUERA_DEL_RANGO_AUDITADO (neutral — no es incertidumbre, es límite de rango)
    │
    NO_VERIFICABLE_DESDE_HTML_ESTÁTICO (muro epistémico)
    ↓ menos certeza
```

### 5.3 Qué puede afirmarse sin calificador

Las afirmaciones siguientes pueden hacerse sin calificador epistemológico explícito porque son directamente verificables en el HTML:

- La existencia de un elemento HTML con atributo específico.
- El valor de un atributo (`id`, `class`, `type`, `value`, `onclick`, `data-*`).
- El anidamiento estructural (quién es padre/hijo de quién).
- El contenido textual visible en una etiqueta.
- La presencia o ausencia de un atributo.
- El número de elementos de un tipo en un rango.
- El estado de un div como "vacío" (sin nodos hijo) en HTML estático.

### 5.4 Qué requiere calificador INFERIDO

Las afirmaciones siguientes requieren el calificador `INFERIDO` con justificación:

- Que una función JS hace X basándose en su nombre (ej.: `exportarInformeWord()` exporta a Word porque su nombre lo sugiere).
- Que un botón sin `onclick` activa un subsistema específico basándose en la concordancia semántica entre el ID del botón y el ID del contenedor.
- Que un div vacío es el destino de inserción de cierto JS basándose en la proximidad estructural y el nombre del ID.
- Que un valor estático de un campo ("Padul") es un valor por defecto que será sustituido en runtime.
- Que la presencia de `required` en un formulario implica validación en JS.

### 5.5 Qué requiere calificador ALTAMENTE_INFERIDO

Las afirmaciones siguientes requieren `ALTAMENTE_INFERIDO` con advertencia explícita de riesgo epistemológico:

- Que la arquitectura del sistema sigue un patrón X basándose en 2–3 instancias observadas.
- Que una función es "de persistencia crítica" basándose únicamente en el prefijo de su nombre.
- Que la intención de diseño de un componente es X basándose en su estructura.
- Que un patrón de código es intencional vs. accidental.

### 5.6 Qué NO puede afirmarse

Las afirmaciones siguientes nunca pueden incluirse en una cartografía CAP, independientemente de la evidencia disponible:

- Comportamientos en tiempo de ejecución cuya implementación JS no está en el rango (ej.: "el formulario valida email antes de enviar").
- Estados de persistencia (qué hay en localStorage, en Firebase, en el servidor).
- Flujos de usuario (qué hace el usuario antes/después de interactuar con X).
- Rendimiento o latencia de operaciones.
- Compatibilidad de navegadores.
- La corrección o incorrección de la lógica de negocio.
- Intenciones de diseño no expresadas en el HTML o en comentarios HTML.

### 5.7 Regla del comentario HTML

Los comentarios HTML (`<!-- -->`) son evidencia E3 — son afirmaciones del autor del código, no del sistema en ejecución. Un comentario puede justificar una inferencia pero no la convierte en observable. Si el comportamiento descrito en un comentario no es verificable en el HTML circundante, la afirmación sigue siendo INFERIDA.

**Ejemplo correcto:**
- HTML: `<!-- FASE 1 -->` seguido de `<div class="fase-contenido activa" id="fase-1-contenido">`
- Afirmación correcta: "El comentario `<!-- FASE 1 -->` demarca el inicio de la Fase 1 RELAS. La clase `activa` es OBSERVABLE en el atributo `class` del div."
- Afirmación incorrecta: "El comentario confirma que esta es la fase activa al cargar." (El comentario no afirma eso; la clase `activa` lo implica.)

### 5.8 Regla de la función JS referenciada

Cuando una función JS es referenciada mediante `onclick` y su nombre sugiere un comportamiento:

**Permitido:**
- Documentar que la función existe y está ligada al elemento (OBSERVABLE).
- Documentar que el nombre sugiere X (INFERIDO, con calificador).
- Documentar que su implementación está FUERA_DEL_RANGO_AUDITADO.

**No permitido:**
- Afirmar que la función hace X (sin verla implementada).
- Afirmar que la función usa cierta librería.
- Afirmar que la función modifica cierto elemento DOM.

---

## 6. AUDITORÍA EPISTEMOLÓGICA

### 6.1 Riesgos epistemológicos identificados

Los siguientes riesgos han sido identificados en el proceso de cartografía de CAP-001 a CAP-004. Algunos se materializaron (y generaron correcciones MAY o COR); otros están latentes.

---

#### RIESGO-EP-001 — Ilusión de comprensión

**Descripción:** El cartógrafo documenta con detalle la estructura de un componente y, al terminar, tiene la sensación de haber entendido cómo funciona el componente. Pero la cartografía describe la estructura estática — no el comportamiento dinámico.

**Ejemplo materializado:** MAY-002 en CAP-003-R0. REL-023 afirmaba que el JS gestionaba `data-fase` mediante listeners de click y `.fase-contenido` — comportamiento no observable desde el HTML.

**Medida correctora:** distinguir siempre entre "structure understood" (estructura cartografiada) y "behavior understood" (comportamiento conocido). La cartografía provee lo primero; el segundo requiere análisis JS.

---

#### RIESGO-EP-002 — Ilusión de completitud

**Descripción:** El rango está 100% cubierto en líneas, todas las entidades tienen entradas, todos los GAPs tienen criterio de resolución → el cartógrafo concluye que el bloque está "completamente entendido". Pero la cobertura de líneas no es equivalente a comprensión de comportamiento.

**Medida correctora:** los GAPs son la declaración formal de lo que no se sabe. Un documento sin GAPs no es un documento más completo — es un documento que no ha reconocido sus límites.

---

#### RIESGO-EP-003 — Sobrelectura semántica

**Descripción:** El cartógrafo extrae significado de nombres de funciones, clases o IDs más allá de lo que el HTML confirma.

**Ejemplo potencial:** documentar que `COMPAS_guardarHojaRuta()` "guarda en Firebase" basándose en el prefijo y el nombre, cuando lo único observable es que la función existe y está ligada a un `onclick`.

**Medida correctora:** aplicar la Regla §5.8 estrictamente. Toda afirmación derivada de un nombre de función debe tener calificador `INFERIDO` o `ALTAMENTE_INFERIDO`.

---

#### RIESGO-EP-004 — Inferencia arquitectónica no demostrada

**Descripción:** El cartógrafo observa 2–3 instancias de un patrón y generaliza a una afirmación arquitectónica global.

**Ejemplo:** "El sistema sigue un patrón MVC" o "Todo el estado de la aplicación se gestiona mediante clases CSS" basándose en los contratos observados hasta CAP-004.

**Medida correctora:** las afirmaciones arquitectónicas globales sólo pueden formularse cuando el rango auditado cubre el 100% del código relevante, o cuando existe documentación explícita (comentario HTML, README) que las respalda.

---

#### RIESGO-EP-005 — Contaminación retrospectiva

**Descripción:** El conocimiento adquirido en bloques posteriores es inconscientemente proyectado sobre la cartografía de bloques anteriores. O, inversamente, las afirmaciones de bloques anteriores son usadas como evidencia en bloques posteriores sin calificación.

**Ejemplo materializado:** COR-02 en DERIVABILIDAD-CAP-003-R0 comparó patrones con bloques anteriores, introduciendo referencias externas al ámbito de derivación.

**Medida correctora:** cada CAP se deriva exclusivamente de su fuente declarada. Las referencias cruzadas son permitidas como "véase ENT-XXX (CAP-YYY)" pero nunca como evidencia que fundamenta una afirmación.

---

#### RIESGO-EP-006 — Mezcla de runtime y estructura

**Descripción:** El cartógrafo describe un estado del sistema que sólo existe en runtime (ej.: "el formulario valida email") como si fuera un hecho del HTML estático.

**Ejemplo potencial:** describir `#tabla-miembros` como "lista de miembros" cuando en el HTML estático sólo existe un `<p class="sin-miembros">No hay miembros.</p>`.

**Medida correctora:** el estado observable del HTML estático siempre se describe con el calificador "en HTML estático". El estado en runtime se documenta como GAP o como superficie runtime.

---

#### RIESGO-EP-007 — Falsa causalidad

**Descripción:** El cartógrafo documenta que A produce B porque A y B están estructuralmente próximos o porque sus nombres son concordantes.

**Ejemplo:** documentar que `btn-valoracion` activa `#informe-container` porque están ambos en `#fase-1-contenido` y sus nombres son coherentes. Esta conexión es INFERIDA — no está demostrada por el HTML.

**Medida correctora:** la proximidad estructural no es evidencia de causalidad funcional. Toda causalidad no demostrada por `onclick` explícito debe marcarse INFERIDO.

---

#### RIESGO-EP-008 — Falsa dependencia

**Descripción:** El cartógrafo documenta una dependencia que no puede verificarse desde el HTML y que podría no existir (o existir de forma distinta a la asumida).

**Medida correctora:** las dependencias documentadas como INFERIDO deben incluir la calificación "no verificable desde este rango". Las dependencias documentadas como FUERA_DEL_RANGO_AUDITADO implican que la dependencia existe pero su naturaleza es desconocida.

---

#### RIESGO-EP-009 — Deriva taxonómica progresiva

**Descripción:** Con cada nuevo bloque, emergen patrones nuevos que tentarán a crear nuevas categorías, subestados y calificadores. Sin gobernanza activa, el sistema de categorías crece de forma no gobernada hasta que los documentos de distintos bloques son incompatibles entre sí.

**Medida correctora:** aplicar §3. Antes de crear cualquier categoría nueva, verificar que no puede expresarse con las existentes. Documentar formalmente cualquier categoría nueva en el MARCO-METODOLOGICO antes de usarla en un CAP.

---

#### RIESGO-EP-010 — Falsa precisión

**Descripción:** El documento produce afirmaciones con alta especificidad que dan apariencia de precisión pero que no están fundamentadas. Ejemplo: afirmar que `#contenido-informe-dinamico` contiene "tablas de indicadores de salud, pirámides poblacionales y análisis epidemiológico" basándose en el nombre del div y el contexto del sistema.

**Medida correctora:** las afirmaciones de alta especificidad sobre contenido dinámico son siempre ALTAMENTE_INFERIDAS. En caso de duda, la forma correcta es: "El nombre del ID sugiere que este contenedor podría recibir [X] en runtime — ALTAMENTE_INFERIDO. En HTML estático: vacío."

---

### 6.2 Protocolo de detección de riesgos

Para cada afirmación de un CAP futuro, aplicar el siguiente test mínimo:

1. **Test de trazabilidad:** ¿puedo señalar la línea exacta de index.html que respalda esta afirmación? → Si no, debe ser INFERIDO o eliminada.
2. **Test de calificación:** ¿tiene la afirmación su calificador epistemológico explícito? → Si no, añadirlo.
3. **Test de riesgo:** ¿cae la afirmación en alguno de los RIESGO-EP-001/010? → Si sí, revisar formulación.
4. **Test de límite:** ¿pertenece la afirmación al rango auditado o a runtime? → Si es runtime, documentar como GAP o superficie runtime.

---

## 7. PROPUESTA DE EVOLUCIÓN CONTROLADA

### 7.1 Condiciones metodológicas mínimas para abrir CAP-005

CAP-005 puede abrirse cuando se cumplan **todas** las condiciones siguientes:

**Condiciones de continuidad:**
1. Los contadores de identificadores están correctamente declarados (MR-067, ENT-050, REL-031, CON-029, GAP-028, DV-022 como primeros disponibles).
2. El rango de CAP-005 está aprobado mediante un artefacto APERTURA-CAP-005-AUDITADA con veredicto `DELIMITACIÓN_APROBADA`.
3. El presente MARCO-METODOLOGICO-CARTOGRAFIA-R1 está disponible como referencia.

**Condiciones epistemológicas:**
4. El cartógrafo conoce y aplica la jerarquía de certeza (§5.2).
5. Las afirmaciones sobre funciones JS referenciadas se formulan con calificador adecuado (§5.8).
6. Las superficies runtime se documentan con su estado estático observable + GAP.

**Condiciones taxonómicas:**
7. No se introducen categorías nuevas sin seguir el proceso de §3.6.
8. Los estados de objeto no se extienden sin declaración formal en el MARCO-METODOLOGICO.

### 7.2 Señales de alerta durante CAP-005

Las siguientes señales deben activar una pausa para revisión metodológica:

- Más de 12 GAPs en un bloque: posible infradocumentación de los límites del rango.
- Más de 15 REL en un bloque: considerar si algunas relaciones pueden agruparse por tipo y origen.
- Introducción de más de 2 categorías nuevas en un bloque: aplicar §3.
- Una entidad sin ningún GAP y sin CSS en el mismo rango: revisitar si sus dependencias externas están documentadas.
- Una relación marcada `FUERA_DEL_RANGO_AUDITADO` sin criterio de resolución: añadir criterio.

### 7.3 Gestión de la creciente complejidad

Los bloques de CAP-005 y posteriores documentarán FASE 2 a FASE 6 de RELAS, que son previsiblemente más complejas que FASE 1 (la evidencia estructural de FASE 2 inicia en l.2833 con un bloque de ~987 líneas). La complejidad creciente exige:

**Estrategia de micro-rangos adaptativos:** no forzar un número fijo de MR. El número de MR debe reflejar la estructura real del bloque: bloques más complejos tendrán más MR.

**Agrupación funcional de REL:** en bloques con alta densidad de `onclick`, agrupar las relaciones por función semántica (exportaciones, gestión de estado, registro de datos) en lugar de crear una REL por cada `onclick` individual.

**Escalado de GAP:** en bloques con alta densidad de placeholders y funciones JS, los GAPs pueden agruparse por tipo de resolución (ej.: "GAP-028: implementaciones de todas las funciones de exportación de FASE 2 — resolución en l.X+") en lugar de uno por función.

**Preservación de la granularidad de ENT:** las entidades no deben agruparse bajo ninguna circunstancia. Cada elemento con identidad propia merece su ENT individual. La agrupación de ENT crea ambigüedad de trazabilidad.

---

## 8. CRITERIOS DE APERTURA DE NUEVOS RANGOS

### 8.1 Criterios de corte natural

Un corte entre bloques es natural cuando coincide con al menos uno de los siguientes marcadores:

1. Comentario HTML de demarcación de sección (`<!-- FASE N -->`, `<!-- FIN FASE N -->`).
2. Apertura o cierre de un `div` de primer nivel dentro de `<main>` (ej.: `<div class="fase-contenido" id="fase-N-contenido">`).
3. Cambio de dominio funcional (de CSS a HTML, de HTML a JS).
4. Cambio de tipo de contenido (de estructura de navegación a contenido de aplicación).
5. Bloque de blancos > 2 líneas que separa secciones reconocibles.

### 8.2 Criterios de extensión de rango

El rango de un bloque debe ser:
- **Suficientemente grande** para contener una unidad funcional completa (no truncar un `div` con ID a la mitad).
- **Suficientemente pequeño** para ser auditable con rigor: bloques de más de 300 líneas deben justificarse explícitamente.
- **Estructuralmente cerrado**: el rango debe comenzar y terminar en puntos de apertura/cierre de estructura que no dejen anidamientos incompletos.

### 8.3 Atribución de blancos de frontera

Los blancos entre el cierre del último elemento de un bloque y el inicio del siguiente pertenecen al bloque precedente. Este criterio se ha aplicado consistentemente en CAP-001 a CAP-004 y debe mantenerse.

---

## 9. CRITERIOS DE CONGELACIÓN DE CAP

### 9.1 Condiciones para CONGELABLE

Un CAP puede declararse `CONGELABLE_CON_OBSERVACIONES` cuando:

1. El rango completo está cubierto (verificación aritmética de MR confirmada).
2. No existen hallazgos mayores abiertos (MAY sin resolver).
3. Todos los GAPs tienen criterio de resolución explícito.
4. Todas las DV están documentadas como observaciones, no como errores bloqueantes.
5. Las relaciones tienen su evidencia declarada.
6. Los contratos tienen su estado (COMPLETO / PARCIAL) declarado.

### 9.2 Condiciones para NO_CONGELABLE

Un CAP debe declararse `NO_CONGELABLE` cuando:

1. Existen hallazgos mayores (MAY) sin resolver que comprometen la fiabilidad de la documentación.
2. La cobertura de líneas no es del 100% (verificación aritmética falla).
3. Existen entidades identificadas pero no documentadas.
4. Existen relaciones documentadas con afirmaciones de comportamiento no respaldadas por evidencia.

### 9.3 Proceso de cierre de expediente

El ciclo completo de un bloque es:

```
APERTURA-CAP-N-AUDITADA (delimitación)
    ↓
CAP-N-R0 (cartografía inicial)
    ↓
[Auditoría hostil / Codex → hallazgos MAY]
    ↓
CAP-N-R1 (correcciones aplicadas)
    ↓
CHK-N (checklist derivado de CAP-N-R1)
    ↓
ARB-N (árbol derivado de CAP-N-R1)
    ↓
DERIVABILIDAD-CAP-N (auditoría de derivados)
    ↓
[Correcciones si las hay → R1 de derivados]
    ↓
CIERRE-CAP-N (expediente cerrado)
```

Ningún paso puede omitirse. La apertura del siguiente bloque puede iniciarse en paralelo con los pasos de derivados si el CAP principal ha sido corregido.

---

## 10. RIESGOS ESTRUCTURALES DEL SISTEMA

### 10.1 Riesgo de crecimiento exponencial

Con 6 fases RELAS (FASE 1 ya cartografiada: 169 líneas) y el patrón de tamaño observado (FASE 2 ~987 líneas, FASE 4–6 estimadas en rangos similares o mayores), la cartografía total del contenido de `<main>` puede superar los 5000+ CAP-documentos de línea. El riesgo es que los documentos derivados (CHK, ARB, DERIVABILIDAD) se vuelvan inmanejablemente grandes.

**Medida:** mantener la delimitación por unidad funcional completa (una fase = un CAP), no por tamaño fijo. Para bloques muy grandes (>500 líneas), considerar sub-bloques temáticos dentro del CAP con MR suficientemente descriptivos.

### 10.2 Riesgo de inconsistencia inter-CAP

A medida que aumenta el número de CAPs, aumenta la probabilidad de que una misma entidad sea referenciada en múltiples CAPs con distinto nivel de detalle o formulaciones inconsistentes.

**Medida:** las referencias inter-CAP siempre se hacen por identificador formal (ENT-XXX de CAP-YYY) y nunca se redefine un objeto ya cartografiado en un bloque posterior. Las nuevas observaciones sobre objetos previos van en el CAP actual con referencia, no como modificaciones implícitas al CAP original.

### 10.3 Riesgo de pérdida de contexto acumulativo

Los CAPs posteriores deben ser comprensibles sin necesidad de leer todos los CAPs anteriores. Pero la complejidad acumulativa puede hacer que las referencias inter-CAP sean imprescindibles para entender un bloque tardío.

**Medida:** cada CAP incluye en su cabecera un apartado "Continuación de [CAP anterior]" con referencia explícita. Los identificadores de rango previo que son relevantes para el bloque actual se mencionan con su CAP de origen.

### 10.4 Riesgo de solapamiento entre GAP y REL

A medida que aumenta la densidad funcional, puede surgir ambigüedad entre documentar algo como GAP (límite de auditabilidad) o como REL (relación con destino FUERA_DEL_RANGO_AUDITADO).

**Criterio de distinción:**
- Si el elemento observable en el rango es el **origen** de la relación (ej.: un `onclick`), se documenta como REL con destino FUERA_DEL_RANGO_AUDITADO.
- Si el elemento observable en el rango es el **destino** de una relación no observable (ej.: un div vacío cuyo productor JS no está en el rango), se documenta como GAP.
- Pueden coexistir una REL y un GAP sobre el mismo par de elementos cuando hay información en ambos sentidos.

---

## 11. RECOMENDACIONES DE DISCIPLINA ANALÍTICA

### 11.1 Para la producción de CAP

1. **Leer antes de escribir:** leer el rango completo una vez antes de comenzar la documentación. No documentar mientras se lee por primera vez.
2. **Separar estructura de comportamiento:** en cada ENT, primero documentar lo observable (atributos, contenido), después las dependencias (con calificadores), nunca mezclar ambas en la misma afirmación.
3. **GAP primero:** ante cualquier aspecto que no esté en el rango, crear el GAP antes de proceder. El GAP es el reconocimiento honesto del límite — no es un fallo.
4. **Calificador en el lugar de la afirmación:** el calificador epistemológico va en la misma frase que la afirmación, no en un apartado separado al final.
5. **Verificación aritmética antes de declarar cobertura completa:** la suma de extensiones de MR debe coincidir con el total de líneas del rango. Cualquier discrepancia indica un MR faltante o un error de numeración.

### 11.2 Para la producción de derivados (CHK, ARB, DERIVABILIDAD)

1. **Derivación estricta:** cada ítem de CHK y cada nodo de ARB debe poder trazarse a una afirmación específica del CAP fuente. Si no puede trazarse, no se incluye.
2. **Sin inferencias nuevas:** los derivados no pueden introducir inferencias que no estén en el CAP fuente. El análisis de derivabilidad sólo evalúa lo que está en el CAP — no complementa el CAP.
3. **Coherencia de estado:** los estados de los ítems en CHK deben ser consistentes con los estados de las entidades en CAP. Un ítem en CHK no puede tener estado VERIFICADO_EN_CAP si la entidad correspondiente en CAP está marcada como FUERA_DEL_RANGO_AUDITADO.

### 11.3 Para la auditoría de CAPs

1. **Auditoría hostil es una garantía de calidad:** no es una confrontación sino un protocolo de verificación. El objetivo es detectar afirmaciones no respaldadas, no encontrar fallos en el cartógrafo.
2. **Hallazgos MAY vs. observaciones:** un hallazgo mayor (MAY) es una afirmación que compromete la fiabilidad del documento. Una observación abierta (OBS) es una limitación conocida que no bloquea el uso del documento.
3. **Correcciones mínimas:** aplicar sólo las correcciones necesarias para resolver los hallazgos. No ampliar el scope de una corrección para "mejorar" otros aspectos del documento.

---

## 12. VEREDICTO FORMAL

### 12.1 Evaluación del estado actual

| Dimensión | Estado evaluado |
|-----------|----------------|
| Taxonomía | 6 categorías establecidas (MR/ENT/REL/CON/GAP/DV) — suficientes y diferenciadas |
| Calificadores epistemológicos | 6 niveles definidos — cobertura completa de los casos emergidos |
| Gobernanza de identificadores | Contadores globales continuos, sin lagunas — CAP-001 a CAP-004 consistentes |
| Disciplina de inferencia | Formalizada — reglas aplicadas en CAP-004 (calificadores, GAPs con criterio) |
| Riesgos epistemológicos | 10 riesgos identificados y formalizados — protocolo de detección establecido |
| Riesgos de deriva taxonómica | Presentes pero gobernables — §3 define los controles |
| Continuidad metodológica | Asegurada — el presente documento cubre CAP-005 y posteriores |

### 12.2 Factores que podrían cambiar el veredicto

El veredicto puede degradarse a `RIESGO_DE_DERIVA_TAXONOMICA` si en CAP-005 o posteriores se detecta alguno de los siguientes:

- Introducción de más de 3 categorías nuevas sin seguir el proceso de §3.6.
- Afirmaciones de comportamiento JS formuladas como observables sin evidencia E1–E4.
- Contadores de identificadores con discontinuidades o reutilizaciones.
- Derivados que introducen inferencias no presentes en el CAP fuente.
- Confusión sistemática entre estado estático y estado runtime.

### 12.3 Veredicto

```
╔══════════════════════════════════════════════════════════════════╗
║  VEREDICTO: CARTOGRAFIA_GOBERNABLE                              ║
╠══════════════════════════════════════════════════════════════════╣
║  Marco metodológico: VIGENTE (R1)                               ║
║  Taxonomía: CONSOLIDADA — 6 categorías, 6 calificadores         ║
║  Gobernanza de identificadores: ACTIVA                          ║
║  Riesgos epistemológicos: IDENTIFICADOS Y FORMALIZADOS (EP-010) ║
║  Riesgo de deriva taxonómica: PRESENTE pero CONTROLABLE         ║
║  Condiciones para CAP-005: DEFINIDAS (§7.1)                     ║
║  Revisión recomendada: cuando emerja patrón nuevo no cubierto   ║
╚══════════════════════════════════════════════════════════════════╝
```

**Base del veredicto:**

1. Las 6 categorías de identificador (MR/ENT/REL/CON/GAP/DV) han demostrado suficiencia para cartografiar 4 bloques de naturaleza distinta (CSS puro, CSS+HTML mixto, HTML estructural, HTML funcional con formularios y placeholders dinámicos).
2. Los calificadores epistemológicos (OBSERVABLE, PARCIALMENTE_OBSERVABLE, INFERIDO, ALTAMENTE_INFERIDO, FUERA_DEL_RANGO_AUDITADO, NO_VERIFICABLE_DESDE_HTML_ESTÁTICO) cubren todos los casos de incertidumbre emergidos.
3. Los 10 riesgos epistemológicos identificados son vigilables con el protocolo de §6.2 sin necesidad de reestructurar el sistema.
4. El riesgo de deriva taxonómica es real pero está correctamente acotado por §3 (gobernanza taxonómica) y §6.9 (riesgo EP-009).
5. Las condiciones para continuar a CAP-005 están definidas con precisión suficiente para prevenir apertura prematura.
6. La metodología es internamente consistente: no se han detectado contradicciones entre las reglas de distintas secciones.

---

*MARCO-METODOLOGICO-CARTOGRAFIA-R1 — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
