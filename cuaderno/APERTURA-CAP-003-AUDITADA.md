# APERTURA-CAP-003-AUDITADA — Auditoría de delimitación
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** APERTURA-CAP-003-AUDITADA  
**Estado:** PROVISIONAL — pendiente de ratificación documental  
**Fuente analizada:** index.html  
**Rango analizado:** l.2453–l.2663 (propuesto)  
**Fecha:** 2026-05-27

> Esta auditoría determina exclusivamente la delimitación del bloque. No documenta MR, ENT, REL, CON, CHK, ARB ni DERIVABILIDAD.

---

## 1. Línea inicial propuesta

**l.2453**

Primera línea después del marcador de transición `<body>` (l.2452), que fue la última línea de CAP-002. CAP-003 comienza en la primera línea del dominio HTML/JS activo.

---

## 2. Línea final propuesta

**l.2663**

Línea donde se abre el elemento `<main class="main">`. Este elemento es el contenedor de todo el contenido de aplicación (las 6 fases RELAS). Su apertura actúa como marcador de transición entre el "armazón estructural de la página" (chrome/shell) y el "dominio de contenido de aplicación" — análogamente a como `<body>` en l.2452 marcó la transición entre CSS y HTML en CAP-002.

---

## 3. Justificación empírica del inicio

| Evidencia | Observación |
|-----------|-------------|
| l.2452: `<body>` | Último elemento de CAP-002; marca apertura del dominio HTML |
| l.2453: línea en blanco | Primera línea no atribuida a CAP-002 |
| l.2456: `<!-- Contenedor de notificaciones toast -->` | Primer contenido HTML activo del cuerpo |
| l.2458: `<div id="toast-container" class="toast-container"></div>` | Primer elemento HTML estructural del cuerpo |

El inicio en l.2453 respeta la frontera establecida por CAP-002 (que terminó en l.2452 inclusive) y cubre desde la primera línea vacía posterior hasta el cierre del armazón de página.

---

## 4. Justificación empírica del final

El elemento `<main class="main">` en l.2663 es el límite natural entre dos dominios arquitectónicos distintos:

| Elemento | Líneas | Dominio arquitectónico |
|---------|--------|----------------------|
| `<div id="toast-container">` | l.2458 | Notificaciones — infraestructura de UI |
| `<header class="header">` | l.2462–2635 | Identidad institucional + chrome de página |
| `<div class="franja">` | l.2637 | Separador decorativo |
| `<nav class="relas-container">` | l.2641–2659 | Navegación de fases (estructura de aplicación) |
| *(blancos de transición)* | l.2660–2662 | Separación estructural |
| `<main class="main">` | l.2663 | **Límite propuesto** — apertura del contenido de aplicación |

El bloque l.2453–2663 forma una unidad semánticamente coherente: contiene todos los elementos que constituyen el **armazón estructural fijo de la página** (notificación, cabecera institucional, separador, navegación), sin entrar en el contenido dinámico de ninguna de las 6 fases RELAS (que comienza en l.2665 con `<!-- FASE 1 -->`).

**Extensión:** 2663 − 2453 + 1 = **211 líneas**

---

## 5. Unidad arquitectónica identificada

**Nombre propuesto:** Armazón estructural HTML del cuerpo de página (body shell)

**Componentes principales observados:**

| Componente | Líneas | Descripción |
|-----------|--------|-------------|
| Blancos post-`<body>` | l.2453–2455 | Separación estructural |
| Toast container | l.2456–2461 | Contenedor de notificaciones flotantes (`#toast-container`) |
| `<header>` institucional | l.2462–2635 | Logos institucionales (5), branding COMPÁS, descripción, ciclo de trabajo 5 fases, selector de estrategia, selector de municipio, atribución |
| Separador franja | l.2636–2640 | `<div class="franja">` + blancos |
| `<nav>` de fases | l.2641–2659 | 6 fases RELAS con `data-fase` y activación CSS (`fase activa`) |
| Blancos de transición | l.2660–2662 | Separación antes de `<main>` |
| Apertura `<main>` | l.2663 | Marcador de inicio del dominio de contenido de aplicación |

**Dominio:** HTML puro — sin CSS propio en el rango (el CSS que gobierna estos elementos está en BLOQUE-001/BLOQUE-002), sin bloques `<script>` en el rango propuesto.

**Observación:** el `<header>` contiene estilos inline (atributo `style=""`) en múltiples elementos. Estos no constituyen un bloque CSS independiente — son decoraciones inline de presentación, documentables como atributos de entidad, no como MR CSS.

---

## 6. Riesgos de corte

| Riesgo | Evaluación | Mitigación |
|--------|-----------|-----------|
| Corte dentro del `<header>` | ELIMINADO — el `<header>` cierra en l.2635, bien dentro del bloque | Sin riesgo |
| Corte dentro del `<nav>` | ELIMINADO — el `<nav>` cierra en l.2659, bien dentro del bloque | Sin riesgo |
| Corte a mitad de elemento `<main>` | ELIMINADO — l.2663 es la apertura del `<main>`, no su interior | Sin riesgo |
| Elementos `<script>` en el rango | No observados en l.2453–2663 | Sin riesgo |
| Estilos inline en `<header>` | Presentes — no constituyen bloque CSS independiente | Documentar como atributos de entidad |
| Dependencias del `<header>` con CSS de BLOQUE-001/002 | Presentes (clases como `.header`, `.logos-institucionales`, `.itaca-branding`, `.municipio-selector`) | Las clases tienen origen en CAP-001/CAP-002 — documentar como referencias cruzadas, no como nuevas entidades CSS |

**Riesgo principal identificado:** El `<header>` tiene alta densidad de selectores cuyos estilos están en BLOQUE-001. La documentación de CAP-003 requerirá cruzar referencias con CAP-001 para entidades como `.header`, `.header-content`, `.logo-institucional`. Esto es documentable mediante el estado FUERA_DEL_RANGO_AUDITADO para los orígenes CSS, y no constituye un riesgo de corte en la delimitación propuesta.

---

## 7. Dependencias con CAP-002

| Elemento | Dependencia | Tipo |
|---------|-------------|------|
| `<body>` (l.2452, CAP-002) | CAP-003 comienza inmediatamente después | Frontera de inicio — sin superposición |
| Clases CSS del `<header>` (`.header`, `.logos-institucionales`, etc.) | Definidas en BLOQUE-001 (CAP-001) | Dependencias de estilo FUERA_DEL_RANGO_AUDITADO de CAP-003 |
| Clases CSS del `<nav>` (`.relas-container`, `.relas-fases`, `.fase`, `.fase-nombre`) | Definidas en BLOQUE-001 (CAP-001) | Dependencias de estilo FUERA_DEL_RANGO_AUDITADO de CAP-003 |
| Selectores con inline style en `<header>` | No dependen de CAP-002 | Autónomos como atributos HTML |
| `.franja` | Definida en BLOQUE-001 (CAP-001) | Dependencia de estilo FUERA_DEL_RANGO_AUDITADO |

No existe ninguna superposición de contenido entre CAP-002 (l.2001–2452) y el rango propuesto para CAP-003 (l.2453–2663). La frontera es limpia.

---

## 8. Alternativas descartadas

**Alternativa A — Fin en l.2635 (`</header>` solamente)**

Razón de descarte: deja `<div class="franja">` (l.2637) y `<nav>` (l.2641–2659) sin atribuir a ningún bloque. Estos elementos son parte del mismo dominio arquitectónico (armazón de página) y su separación artificial incrementa el riesgo documental sin beneficio estructural.

**Alternativa B — Fin en l.2659 (`</nav>` solamente)**

Razón de descarte: deja los blancos de transición l.2660–2662 y la apertura de `<main>` (l.2663) sin atribuir. La apertura de `<main>` es un marcador de transición arquitectónica importante (análogo a `<body>` en CAP-002) que pierde valor documental si queda al inicio de CAP-004 en lugar de al final de CAP-003.

**Alternativa C — Fin en l.2829 (cierre de Fase 1)**

Razón de descarte: mezcla el armazón de página (header + nav) con el contenido de aplicación de la primera fase RELAS. Son dominios heterogéneos. Fase 1 es una unidad funcional completa que merece su propio bloque. El bloque resultante (~377 líneas) sería de tamaño manejable pero conceptualmente impuro.

**Alternativa D — Fin en l.2662 (últimas líneas en blanco antes de `<main>`)**

Razón de descarte: deja `<main>` (l.2663) como primera línea de CAP-004, lo que obliga a ese bloque a abrirse con un marcador de contenedor sin su contexto. Incluir `<main>` en CAP-003 como marcador de transición es más coherente con la metodología establecida en CAP-002 (que incluyó `<body>` como su última línea por la misma razón).

---

## 9. Veredicto de delimitación

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DELIMITACIÓN_APROBADA                           ║
╠══════════════════════════════════════════════════════════════╣
║  Bloque propuesto: l.2453–l.2663 (211 líneas)              ║
║  Unidad: Armazón estructural HTML del cuerpo de página      ║
║  Riesgos de corte: NINGUNO                                  ║
║  Entidades truncadas: NINGUNA                               ║
║  Mezcla de dominios heterogéneos: NO                        ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación del veredicto:**

1. El rango l.2453–2663 forma una unidad arquitectónica coherente y autónoma: el armazón estructural fijo de la página (shell), que incluye todos los elementos de chrome sin entrar en el contenido dinámico de ninguna fase RELAS.
2. No hay ningún elemento truncado: `<header>`, `<nav>` y `<div class="franja">` están completos dentro del rango.
3. La línea final (l.2663, `<main class="main">`) actúa como marcador de transición al dominio de contenido de aplicación, con el mismo rol arquitectónico que `<body>` (l.2452) tuvo como final de CAP-002.
4. No existe mezcla de dominios: el rango es íntegramente HTML estructural del armazón de página, sin CSS propios ni bloques `<script>`.
5. La frontera con CAP-002 es limpia: l.2452 (fin de CAP-002) → l.2453 (inicio de CAP-003), sin solapamiento ni líneas sin atribuir.

**Observaciones para la documentación de CAP-003:**

- OBS-001: Los estilos de los elementos HTML de este bloque (`.header`, `.relas-container`, `.fase`, `.franja`, etc.) tienen origen en BLOQUE-001 (CAP-001). La cartografía de CAP-003 documentará las entidades HTML con sus clases, referencias CSS y funciones, marcando el origen de los estilos como FUERA_DEL_RANGO_AUDITADO.
- OBS-002: El `<header>` contiene estilos inline extensos. Su documentación requerirá decisión sobre si los atributos `style=""` se tratan como entidades de presentación autónomas o como referencias a convenciones de BLOQUE-001/002.
- OBS-003: El `<nav>` usa `data-fase` como mecanismo de activación JS. La relación entre `data-fase` y el JS que la consume estará FUERA_DEL_RANGO_AUDITADO de CAP-003.

---

*APERTURA-CAP-003-AUDITADA — 2026-05-27*  
*Cuaderno de Gobierno del Código COMPÁS*
