# GOV-001 — Taxonomía de auditorías y categorías de gobierno documental
## Cuaderno de Gobierno del Código COMPÁS

---

## Estado del documento

- Estado: PROVISIONAL_NO_VALIDADO
- Validación usuario: PENDIENTE
- Fecha: 2026-05-26
- Relación con CAP-001: Este documento formaliza las categorías metodológicas emergidas durante la elaboración y revisión de CAP-001-R1 a CAP-001-R5. Es independiente de CAP-001 pero nació de ese proceso.
- Propósito: Estabilizar como artefacto documental versionado las categorías de auditoría y control utilizadas en los Cuadernos de Gobierno del Código COMPÁS, de modo que no dependan de memoria conversacional de ningún agente (ChatGPT, Claude, Codex u otro).

---

## Principio general

Las categorías de gobierno no deben quedar en memoria conversacional. Deben existir como artefactos documentales versionados, auditables y localizables.

Toda categoría metodológica que pase a formar parte del vocabulario operativo de COMPÁS debe estar registrada en GOV-001 o en un artefacto GOV posterior antes de ser utilizada en un Cuaderno de Gobierno del Código. Las categorías no documentadas en GOV son ocurrencias conversacionales, no estándares operativos.

---

## AUD-001 — Auditoría de aceptación

### Definición

Revisión formal aplicada a un Cuaderno de Gobierno del Código (CAP) antes de su congelación. Determina si el artefacto es apto para ser congelado tal como está, con observaciones, o si requiere corrección previa.

### Objetivo

Producir un veredicto documentado sobre la aptitud del CAP para congelación. No busca perfección técnica absoluta, sino ausencia de errores bloqueantes y coherencia interna suficiente para que el documento sea operable como referencia estable.

### Cuándo se usa

Tras la última revisión (Rn) de un CAP, antes de emitir la congelación. Se ejecuta una vez por versión candidata. Si el veredicto es REQUIERE_REVISION o NO_CONGELABLE, se abre una nueva revisión (Rn+1) y se repite.

### Qué busca

- Errores críticos: contradicciones directas con el código fuente verificado
- Errores mayores: inconsistencias de identidad documental, estados incorrectos, referencias cruzadas rotas
- Errores menores: imprecisiones de redacción que no alteran el significado técnico
- Presencia del ESTADO_DE_CONGELACIÓN con campos obligatorios completos
- Coherencia entre versión del archivo físico y referencias internas

### Qué no busca

- Completitud total del sistema (los GAP son aceptables si están documentados)
- Validación de líneas fuera del rango auditado
- Verificación de comportamiento en runtime

### Entradas

- Archivo CAP-XXX-Rn.md (versión candidata)
- Rango auditado declarado en el documento
- Resultados de auditorías previas (AUD-002, AUD-003) si están disponibles

### Salidas

- Veredicto (ver tabla de veredictos)
- Lista de errores críticos (si los hay)
- Lista de errores mayores (si los hay)
- Lista de errores menores (si los hay)
- Instrucción de acción: congelar / abrir Rn+1 con correcciones específicas

### Criterios de veredicto

| Veredicto | Condición | Acción |
|-----------|-----------|--------|
| CONGELABLE | 0 errores críticos, 0 errores mayores | Congelar sin modificación |
| CONGELABLE_CON_OBSERVACIONES | 0 errores críticos, errores menores documentados | Congelar; errores menores pasan a deuda CAP-002 |
| REQUIERE_REVISION | 0 errores críticos, ≥1 error mayor | Abrir Rn+1 corrigiendo errores mayores |
| NO_CONGELABLE | ≥1 error crítico | Abrir Rn+1; los errores críticos son bloqueantes absolutos |

### Relación con congelación

Un CAP solo puede congelarse si el veredicto de AUD-001 es CONGELABLE o CONGELABLE_CON_OBSERVACIONES. El ESTADO_DE_CONGELACIÓN del CAP debe recoger el veredicto y la fecha de la auditoría.

---

## AUD-002 — Auditoría de consistencia documental

### Definición

Revisión que verifica la coherencia interna del documento: que todos los identificadores, referencias cruzadas, estados y etiquetas sean coherentes entre sí y con la versión declarada del artefacto.

### Objetivo

Detectar contradicciones internas que no requieren leer el código fuente: errores de identidad, referencias a versiones incorrectas, identificadores duplicados o ausentes, estados contradictorios en el mismo artefacto.

### Qué busca

- Referencias de versión inconsistentes (el documento se llama Rn pero cita Rn-1 en campos internos)
- Identificadores duplicados (dos ENT con el mismo ID, dos REL con el mismo nombre)
- Referencias cruzadas rotas (REL cita una ENT que no existe en el catálogo)
- Estados contradictorios (mismo ítem marcado como CONFIRMADO en un campo y PROBABLE en otro)
- Campos obligatorios ausentes en MR, ENT, REL, CON, CHK, ARB, PAN
- Discrepancias entre conteos declarados y elementos reales (ej. "20 contratos" pero solo 19 en catálogo)

### Qué no busca

- Corrección técnica respecto al código fuente (eso es AUD-001 o AUD-003)
- Completitud del sistema
- Validez de los estados asignados (eso es AUD-003)

### Ejemplos de errores detectados en CAP-001

- CAP-001-R4 declaraba `Revisión: R3` en el encabezado (error de identidad documental — corregido en R5)
- `Versión: CAP-001-R3` en ESTADO_DE_CONGELACIÓN cuando el archivo era R4
- Footer del documento citaba R3 tras haber sido promovido a R4

### Aplicación a artefactos COMPÁS

| Artefacto | Campos críticos a verificar |
|-----------|----------------------------|
| CAP | Revisión, Versión, Rango, Fecha — coherencia entre encabezado, footer y ESTADO_DE_CONGELACIÓN |
| MR | Rango de líneas contiguo sin huecos; ENT/REL/CON referenciadas existen en catálogo |
| ENT | ID único; Tipo válido según taxonomía; REL asociadas son bidireccionales |
| REL | Origen y Destino existen; Líneas corresponden al rango declarado |
| CON | Clase trigger existe en algún MR; Efecto CSS verificable en rango |
| CHK | Referencia a línea o función verificable; no duplicado con otro CHK |
| ARB | ENT y CDN referenciadas coinciden con catálogo; estados de nodo coherentes |
| PAN | Afirmaciones cuantitativas (≥N componentes) coherentes con evidencia en MR |

---

## AUD-003 — Auditoría epistemológica

### Definición

Revisión que verifica que los estados de conocimiento asignados a cada elemento (ENT, REL, CON, FUNC, MOT, MR) reflejan con precisión lo que se ha observado directamente en el código frente a lo que se infiere, estima o desconoce.

### Objetivo

Garantizar que el Cuaderno no mezcla certeza observada con inferencia plausible ni con desconocimiento. Cada estado debe ser la etiqueta más precisa posible dado el código efectivamente leído.

### Estados documentales controlados

| Estado | Significado |
|--------|-------------|
| CONFIRMADO | Observado directamente en código leído dentro del rango auditado. Sin ambigüedad. |
| PARCIAL | Una parte de la relación o función está confirmada por observación directa; otra parte no ha sido leída. |
| PROBABLE | La conexión o función es plausible por nombre, comentario o contexto CSS, pero el código que la activa no ha sido leído. |
| NO_OBSERVADO | Mencionado como existente por referencias externas (commits, comentarios, nombres conocidos) pero no leído directamente. |
| FUERA_DEL_RANGO_AUDITADO | Existe o probablemente existe, pero su definición o comportamiento está en líneas fuera del rango declarado para este CAP. No es un fallo: es un límite metodológico explícito. |
| PENDIENTE_VALIDACION | El estado ha sido asignado provisionalmente y requiere que el usuario (Blas) confirme o corrija mediante lectura directa o conocimiento del sistema. |

### Diferencias clave entre estados

- **CONFIRMADO vs PARCIAL:** CONFIRMADO requiere que tanto el origen como el destino de la relación sean observados. PARCIAL aplica cuando solo uno de los dos lados ha sido leído (ej. el CDN está en l.19 pero la invocación JS no ha sido leída).
- **PROBABLE vs PARCIAL:** PROBABLE no tiene ninguna observación directa de la conexión activa; solo hay evidencia circunstancial (nombre de clase, comentario CSS). PARCIAL tiene al menos un lado observado.
- **NO_OBSERVADO vs FUERA_DEL_RANGO_AUDITADO:** NO_OBSERVADO puede ser recuperable en el mismo rango si se lee más código. FUERA_DEL_RANGO_AUDITADO es estructuralmente irrecuperable en este CAP — requiere CAP-002 o auditoría de otro rango.
- **PENDIENTE_VALIDACION vs cualquier otro:** Es un meta-estado: el auditor ha asignado un estado provisional que el usuario debe confirmar. No indica incertidumbre sobre el código, sino sobre la corrección de la clasificación.

### Riesgos que evita

- Presentar inferencias como certezas (overclaiming): afirmar que una CDN está "en uso" cuando solo está declarada
- Presentar desconocimiento como negación: afirmar que una función "no existe" cuando simplemente no ha sido leída
- Mezclar estados en el mismo campo: un ítem no puede ser CONFIRMADO y PROBABLE simultáneamente
- Afirmaciones totalizantes sin respaldo: "todo componente del sistema depende de X" sin haber leído todo el sistema

### Ejemplos de mala práctica detectados en CAP-001

- REL-001 original: Mammoth marcado como CONFIRMADA cuando solo se había leído el CDN import y un comentario CSS — debía ser PARCIAL
- PAN-001 original: "El sistema no arranca sin red" — afirmación sobre comportamiento runtime no verificable desde CSS
- ARB-001 original: Firebase como `<script type="module">` cuando el código usa compat mode sin `type="module"`
- MOT-004 original: `CDN: l.14–15` cuando los scripts están en l.13 y l.15 (no en l.14, que es una línea en blanco)

---

## AUD-004 — Auditoría de derivabilidad

### Definición

Revisión que verifica que los artefactos derivados (CHK, ARB, PAN, GRAFO, TARJETAS DE SALA DE CONTROL) pueden ser generados o regenerados íntegramente a partir del Cuaderno de Gobierno del Código sin recurrir a memoria conversacional, contexto de sesión ni conocimiento implícito del auditor.

### Objetivo

Garantizar que el Cuaderno es autosuficiente como fuente de verdad para la derivación de artefactos operativos. Si el Cuaderno se entrega a un tercero o a un nuevo agente, ese tercero debe poder producir los mismos CHK, ARB, PAN y GRAFO que el equipo original.

### Pregunta central

> ¿Puede derivarse CHK / ARB / PAN / GRAFO / TARJETAS desde el Cuaderno sin memoria externa?

La respuesta debe ser SÍ para cada artefacto derivado. Si es NO, el Cuaderno tiene una deuda de derivabilidad que debe documentarse como GAP.

### Qué busca

- Que cada CHK tenga un campo "Cómo verificar" suficientemente preciso para ejecutarse sin conocimiento previo
- Que cada nodo de ARB-001 tenga Tipo y Estado que permitan reconstruir el grafo sin ambigüedad
- Que PAN-001 cite líneas exactas o MR exactos como respaldo de cada afirmación
- Que los conteos en PAN-001 (≥N componentes, N funciones, etc.) sean derivables contando los elementos del catálogo
- Que el GRAFO de dependencias pueda trazarse de REL sin información adicional

### Qué no busca

- Que el Cuaderno contenga el código fuente (no es su función)
- Que los artefactos derivados estén físicamente presentes en el Cuaderno
- Que la derivación sea automática (puede requerir trabajo manual)

### Relación con Sala de Control

La Sala de Control de COMPÁS consume ARB, PAN y GRAFO como entradas. Si AUD-004 detecta que alguno de estos no es derivable del Cuaderno, la Sala de Control queda desconectada de su fuente de verdad documental — lo que convierte en frágil cualquier decisión tomada desde ella.

---

## AUD-005 — Auditoría de transferibilidad

### Definición

Revisión que verifica que el Cuaderno de Gobierno del Código puede ser comprendido, auditado y asumido operativamente por un tercero sin depender del conocimiento personal de Blas Hermoso ni del historial conversacional con ningún agente de IA.

### Objetivo

Garantizar que el Cuaderno es transferible como artefacto institucional: que un técnico del Servicio de Informática, un auditor externo o un sucesor del proyecto pueda usar el documento como referencia sin necesitar contexto oral o conversacional adicional.

### Pregunta central

> ¿Puede un tercero entender, auditar y asumir esta parte del sistema sin depender de Blas?

La respuesta debe ser SÍ o SÍ_CON_FORMACIÓN_MÍNIMA. Si es NO, el Cuaderno tiene deuda de transferibilidad.

### Qué busca

- Que el vocabulario técnico esté definido o referenciado en GOV-001 u otro artefacto GOV
- Que los estados epistemológicos (CONFIRMADO, PARCIAL, etc.) estén formalizados y sean consultables
- Que los identificadores (ENT, REL, CON, MR, CHK, etc.) sean autoexplicativos o tengan definición accesible
- Que los GAP y deudas documentadas sean comprensibles sin contexto oral
- Que el ESTADO_DE_CONGELACIÓN resuma el estado del artefacto de forma que no requiera leer todo el documento para entender qué está validado y qué no
- Que las limitaciones del rango auditado estén explícitamente declaradas (no implícitas)

### Qué no busca

- Que el Cuaderno sea un manual de usuario de COMPÁS
- Que toda la deuda técnica esté resuelta
- Que el tercero pueda operar COMPÁS sin formación sobre el sistema

### Relación con entrega institucional futura

COMPÁS está diseñado para transferirse a una institución (Servicio de Informática, entidad sanitaria u organismo público). Los Cuadernos de Gobierno del Código son parte de esa entrega. AUD-005 garantiza que la transferencia documental sea operativa, no solo formal.

### Relación con Servicio de Informática

El Servicio de Informática receptor necesita poder auditar el sistema de forma independiente. AUD-005 verifica que los Cuadernos habilitan esa auditoría sin necesidad de mediar Blas como intérprete del sistema.

---

## Matriz resumen

| ID | Nombre | Objetivo | Momento de uso | Veredicto posible | Bloquea congelación |
|----|--------|----------|----------------|-------------------|---------------------|
| AUD-001 | Auditoría de aceptación | Determinar aptitud para congelación | Antes de congelar cada CAP-Rn | CONGELABLE / CONGELABLE_CON_OBSERVACIONES / REQUIERE_REVISION / NO_CONGELABLE | SÍ |
| AUD-002 | Auditoría de consistencia documental | Detectar contradicciones internas sin leer código | En cualquier revisión Rn | Sin veredicto formal — lista de errores | SÍ (si hay errores mayores detectados por AUD-001) |
| AUD-003 | Auditoría epistemológica | Verificar que los estados de conocimiento son precisos | En cualquier revisión Rn | Sin veredicto formal — lista de overclaims y underclaims | SÍ (si hay errores críticos detectados por AUD-001) |
| AUD-004 | Auditoría de derivabilidad | Verificar que ARB/PAN/CHK/GRAFO pueden generarse desde el Cuaderno | Antes de derivar artefactos operativos | SÍ / SÍ_CON_GAPS / NO | NO directamente — genera GAP documentados |
| AUD-005 | Auditoría de transferibilidad | Verificar que el Cuaderno es operable por un tercero | Antes de entrega institucional | TRANSFERIBLE / TRANSFERIBLE_CON_FORMACIÓN / NO_TRANSFERIBLE | NO directamente — genera deuda de transferibilidad |

---

## Relación con flujo de Cuadernos

```
CAP-XXX creado (MR cartografiados, ENT/REL/CON/CHK/ARB/PAN poblados)
  │
  ▼
AUD-002 — consistencia documental
AUD-003 — epistemológica
  │
  ▼ (correcciones → Rn+1 si necesario)
  │
AUD-001 — aceptación
  │
  ├── REQUIERE_REVISION → abrir Rn+1 → volver a AUD-001
  │
  └── CONGELABLE / CONGELABLE_CON_OBSERVACIONES
        │
        ▼
      CONGELACIÓN (CAP-XXX-Rn queda inmutable)
        │
        ▼
      DERIVACIÓN
        ├── CHK (checklist de verificación)
        ├── ARB (árbol de dependencias)
        ├── PAN (panóptico visual)
        └── GRAFO (grafo de relaciones)
              │
              ▼
            AUD-004 — derivabilidad (retroalimenta calidad del CAP)
            AUD-005 — transferibilidad (antes de entrega institucional)
```

---

## Criterio de uso futuro

Ninguna nueva categoría metodológica puede incorporarse al vocabulario operativo de COMPÁS (Cuadernos, Sala de Control, artefactos derivados) sin estar registrada previamente en GOV-001 o en un artefacto GOV posterior con identificador asignado.

Una categoría metodológica usada en un Cuaderno pero no registrada en un artefacto GOV es una ocurrencia conversacional. Las ocurrencias conversacionales no son estándares operativos y no pueden utilizarse como base para auditorías, decisiones de congelación ni derivación de artefactos.

El proceso de alta de una nueva categoría es:
1. Identificar la categoría emergente durante el trabajo en un CAP
2. Documentarla en GOV-001 (si encaja en el alcance) o crear GOV-002+ (si abre un nuevo dominio)
3. Referenciar el GOV correspondiente en el CAP donde se usa por primera vez
4. No usar la categoría en producción hasta que el GOV esté en estado mínimo PROVISIONAL_NO_VALIDADO

---

*GOV-001 — PROVISIONAL_NO_VALIDADO — 2026-05-26*  
*Cuaderno de Gobierno del Código COMPÁS*
