# APERTURA-CAP-004-AUDITADA — Auditoría de delimitación
## Cuaderno de Gobierno del Código COMPÁS

**Artefacto:** APERTURA-CAP-004-AUDITADA  
**Estado:** PROVISIONAL — pendiente de ratificación documental  
**Fuente analizada:** index.html  
**Rango analizado:** l.2664–l.2832 (propuesto)  
**Fecha:** 2026-05-28

> Esta auditoría determina exclusivamente la delimitación del bloque. No documenta MR, ENT, REL, CON, CHK, ARB ni DERIVABILIDAD.

---

## 1. Línea inicial propuesta

**l.2664**

Primera línea del contenido de `<main class="main">`, inmediatamente después del marcador de transición l.2663 que fue la última línea de CAP-003. La apertura del elemento `<main>` en l.2663 actuó como límite de bloque en CAP-003 (analogía documentada con `<body>` en l.2452 de CAP-002). CAP-004 comienza en la primera línea del dominio de contenido de aplicación.

---

## 2. Línea final propuesta

**l.2832**

Último blank anterior al comentario explícito `<!-- FASE 2: Perfil de salud local -->` (l.2833). En l.2829 cierra `#fase-1-contenido` (`</div>`); l.2830–2832 son blancos de separación que pertenecen al bloque de FASE 1 según el criterio de atribución de blancos de cierre ya establecido en CAP-001/002/003. El comentario de FASE 2 en l.2833 proporciona un marcador explícito y limpio de inicio del bloque siguiente.

---

## 3. Extensión

**169 líneas** (2832 − 2664 + 1 = 169)

---

## 4. Unidad arquitectónica identificada

**Nombre propuesto:** Fase Inicial RELAS — contenido completo de `#fase-1-contenido`

**Descripción:** Primer `<div class="fase-contenido activa">` del `<main>` de la aplicación. Contiene el grupo de botones de acceso a los tres sub-contenedores de la Fase 1 (informe de situación, registro Grupo-Motor, hoja de ruta), los tres sub-contenedores completos con sus formularios e interfaces de exportación, y los blancos de cierre que separan FASE 1 de FASE 2.

**Dominio:** HTML de contenido de aplicación — primera fase del ciclo RELAS. No contiene bloques `<style>` ni `<script>` en el rango. Todos los `onclick` son atributos de evento inline; sus implementaciones están en l.2664+ (fuera del rango).

---

## 5. Justificación empírica del inicio

| Evidencia | Línea | Observación |
|-----------|-------|-------------|
| `<main class="main">` — marcador de límite de CAP-003 | l.2663 | Documentado en CAP-003-R1/MR-060 como límite de transición al dominio de contenido de aplicación |
| Blank line — primera línea sin atribuir a CAP-003 | l.2664 | Primer contenido de `<main>` |
| `<!-- FASE 1 -->` | l.2665 | Primer marcador semántico del bloque |
| `<div class="fase-contenido activa" id="fase-1-contenido">` | l.2667 | Apertura del contenedor principal del bloque |

El inicio en l.2664 respeta la frontera establecida por CAP-003 (última línea: l.2663 inclusive) y comienza en la primera línea no atribuida al bloque anterior.

---

## 6. Justificación empírica del final

| Evidencia | Línea | Observación |
|-----------|-------|-------------|
| Cierre de `#hoja-ruta-container` | l.2825 | Último sub-contenedor de FASE 1 cerrado |
| `</div>` — cierre de `#fase-1-contenido` | l.2829 | Cierre completo del contenedor principal del bloque |
| Blancos de separación | l.2830–2832 | Atribuidos a FASE 1 según criterio de atribución de blancos de cierre |
| `<!-- FASE 2: Perfil de salud local -->` | l.2833 | Marcador explícito de inicio del bloque siguiente — no incluido |

El comentario explícito de FASE 2 en l.2833 proporciona un límite natural claro. Ningún elemento de FASE 1 cruza este límite.

---

## 7. Componentes principales incluidos

| Componente | Líneas aprox. | Descripción |
|-----------|---------------|-------------|
| Apertura + `<!-- FASE 1 -->` | l.2664–2668 | Blancos de inicio, comentario de sección, apertura de `#fase-1-contenido` con `.activa` |
| `.botones-fase` | l.2669–2680 | 4 botones: `#btn-valoracion` (con `.nombre-municipio-dinamico`), `#btn-registro`, `#btn-hoja-ruta`, `#btn-exportar-json` |
| `#informe-container` | l.2682–2710 | Contenedor del informe de situación de salud: barra de exportación superior (Word/PDF/Imprimir), `#contenido-informe-dinamico` (vacío, población dinámica), barra de exportación inferior (duplicada) |
| `#registro-container` | l.2712–2770 | Formulario de registro del Grupo-Motor: campos nombre/teléfono/email/organización/cargo/sector; `#btn-registrar` → `registrarMiembro()`; `.miembros-lista` > `#tabla-miembros` |
| `#hoja-ruta-container` | l.2772–2825 | Gestión de hoja de ruta: `.hoja-ruta-header` con acciones de exportación y `#btn-añadir-hito`; `#formulario-hito-personalizado` con campos nombre/fecha; `#hitos-lista`; botón `COMPAS_guardarHojaRuta()` |
| Cierre + blancos de separación | l.2826–2832 | `</div>` (cierre `#fase-1-contenido`) + blancos de separación |

**Funciones JS observadas como atributos `onclick` (implementaciones FUERA_DEL_RANGO):**
`exportarInformeWord()`, `exportarInformePDF()`, `imprimirInforme()`,  
`exportarMiembrosWord()`, `exportarMiembrosPDF()`, `imprimirMiembros()`,  
`exportarHojaRutaWord()`, `exportarHojaRutaPDF()`, `imprimirHojaRuta()`,  
`registrarMiembro()`, `mostrarFormularioHito()`, `ocultarFormularioHito()`,  
`guardarHitoPersonalizado()`, `ordenarHitosPorFecha()`, `COMPAS_guardarHojaRuta()`

---

## 8. Componentes excluidos

| Componente | Línea inicio | Razón de exclusión |
|-----------|-------------|-------------------|
| FASE 2 (`#fase-2-contenido`) | l.2835 | Unidad funcional distinta — "Perfil de salud local"; extensión ~987 líneas; merece bloque propio |
| FASES 3–6 | l.3824–l.7797 | Unidades funcionales distintas de mayor tamaño |
| `</main>` + dominio post-main | l.7801+ | Dominio arquitectónico distinto (modales, scripts) |

---

## 9. Alternativas de corte consideradas

| Alternativa | Rango | Extensión | Estado |
|------------|-------|-----------|--------|
| A — FASE 1 sola (propuesta) | l.2664–2832 | 169 líneas | **SELECCIONADA** |
| B — FASE 1 + FASE 2 | l.2664–3821 | ~1158 líneas | DESCARTADA |
| C — FASE 1 sin blancos de cierre | l.2664–2829 | 166 líneas | DESCARTADA |
| D — Todo `<main>` (6 fases) | l.2664–7801 | ~5138 líneas | DESCARTADA |
| E — Fin en `</div>` interno de hoja-ruta | l.2664–2825 | 162 líneas | DESCARTADA |

---

## 10. Alternativas descartadas y motivo

**Alternativa B — FASE 1 + FASE 2 (l.2664–3821)**

Razón de descarte: FASE 2 ("Perfil de salud local") tiene ~987 líneas y una complejidad cualitativamente distinta (panel de carga de 6 fuentes, 7 secciones acordeón, análisis IA con checklist, referencias a REDCap, IBSE, EAS, indicadores). Combinar FASE 1 (169 líneas, 3 sub-contenedores simples) con FASE 2 en un único CAP mezclaría niveles de complejidad heterogéneos sin ventaja documental. El comentario explícito `<!-- FASE 2: Perfil de salud local -->` (l.2833) marca una transición arquitectónica real.

**Alternativa C — Fin en l.2829 (sin blancos de cierre)**

Razón de descarte: los blancos l.2830–2832 son blancos de cierre del bloque FASE 1, siguiendo el criterio de atribución de blancos establecido en CAP-001/002/003. Incluirlos en FASE 2 obligaría a ese bloque a abrirse con blancos no significativos antes de su propio marcador. El criterio ya establecido es que los blancos de separación pertenecen al bloque que los precede.

**Alternativa D — Todo `<main>` (l.2664–7801)**

Razón de descarte: ~5138 líneas con 6 fases de complejidades muy distintas. Inmanejable como unidad documental y violatorio del criterio de riesgo documental mínimo.

**Alternativa E — Fin en l.2825 (interior de `#fase-1-contenido`)**

Razón de descarte: dejaría l.2826–2829 (blancos internos y cierre del contenedor) sin atribuir, truncando la entidad `#fase-1-contenido`.

---

## 11. Riesgos de corte prematuro

| Riesgo | Evaluación |
|--------|-----------|
| Truncar `#fase-1-contenido` | ELIMINADO — el contenedor cierra en l.2829, dentro del rango |
| Truncar sub-contenedores internos | ELIMINADO — `#informe-container`, `#registro-container`, `#hoja-ruta-container` cierran todos antes de l.2829 |
| Dejar blancos sin atribuir | ELIMINADO — blancos l.2830–2832 incluidos en el rango |
| Cortar dentro de un formulario | ELIMINADO — el formulario de `#registro-container` (l.2730–2764) y el formulario de `#hoja-ruta-container` (l.2796–2816) cierran antes de l.2829 |

Riesgo de corte prematuro: **NINGUNO**

---

## 12. Riesgos de extensión excesiva

| Riesgo | Evaluación |
|--------|-----------|
| Incluir líneas de FASE 2 | ELIMINADO — el rango termina en l.2832, antes del comentario de FASE 2 (l.2833) |
| Densidad de funciones JS | GESTIONABLE — las ~15 funciones `onclick` son atributos HTML observables; sus implementaciones se marcarán como FUERA_DEL_RANGO_AUDITADO (l.2664+) |
| Extensión total (169 líneas) | DENTRO DE LO GESTIONABLE — comparable a CAP-003 (211 líneas) |

Riesgo de extensión excesiva: **NINGUNO**

---

## 13. Dependencias con CAP-003

| Elemento | Dependencia | Tipo |
|---------|-------------|------|
| `.fase-contenido` | Clase CSS definida en BLOQUE-001 (CAP-001); estado `.activa` documentado como CON-026 en CAP-003 | Dependencia de clase y estado — FUERA_DEL_RANGO_AUDITADO |
| `.activa` en `id="fase-1-contenido"` | Estado inicial por defecto de FASE 1 — espejo del `data-fase="1"` + clase `.activa` en ENT-040 (CAP-003/MR-060) | Contrato CON-026 aplicado a contenido — observable en HTML |
| `<main class="main">` | Contenedor padre documentado como marcador de límite en CAP-003/MR-060/l.2663 | Contenedor estructural — apertura documentada en CAP-003 |
| `.nombre-municipio-dinamico` | Clase de elemento dinámico; primera aparición en CAP-003 area (MR-058 / ENT-039 label); mecanismo de población JS en l.2664+ | Dependencia de clase con origen CSS en BLOQUE-001; población dinámica FUERA_DEL_RANGO |
| `.btn-accion`, `.btn-accion.secundario`, `.btn-accion.terciario`, `.btn-accion.btn-exportar` | Clases CSS de botones — origen en BLOQUE-001 (CAP-001); no documentadas en CAP-003 | Dependencias de estilo FUERA_DEL_RANGO_AUDITADO |

La frontera con CAP-003 es limpia: l.2663 (fin de CAP-003) → l.2664 (inicio de CAP-004), sin solapamiento.

---

## 14. Estados/contadores que deberá continuar CAP-004

| Contador | Valor al inicio de CAP-004 |
|----------|--------------------------|
| MR | Continúa desde MR-060 → próximo: **MR-061** |
| ENT | Continúa desde ENT-040 → próxima: **ENT-041** |
| REL | Continúa desde REL-023 → próxima: **REL-024** (si aplica) |
| CON | Continúa desde CON-026 → próximo: **CON-027** (si aplica) |
| GAP | Continúa desde GAP-21 → próximo: **GAP-22** (si aplica) |
| DV | Continúa desde DV-019 → próxima: **DV-020** (si aplica) |

**Observación sobre ENT:** el bloque contiene al menos 4 entidades observables: `.botones-fase`, `#informe-container`, `#registro-container`, `#hoja-ruta-container`. La documentación puede identificar sub-entidades adicionales según criterio de granularidad.

---

## 15. Observaciones para la documentación de CAP-004

- **OBS-001:** La clase `.activa` en `<div class="fase-contenido activa" id="fase-1-contenido">` es el estado inicial declarado en HTML estático, espejo del mecanismo ENT-040/CON-026 documentado en CAP-003. La documentación de CAP-004 deberá registrar esta clase como estado observable con origen en CON-026 (CAP-003), no como un nuevo contrato.

- **OBS-002:** `#contenido-informe-dinamico` (l.2696) y `#tabla-miembros` (l.2768) son contenedores vacíos en el HTML estático, poblados en tiempo de ejecución. Su estado inicial es observable; el mecanismo de población está FUERA_DEL_RANGO_AUDITADO.

- **OBS-003:** Las ~15 funciones JS referenciadas mediante `onclick` son observables como atributos HTML, pero sus implementaciones no existen en l.2664–2832. Documentar como relaciones con estado FUERA_DEL_RANGO_AUDITADO.

- **OBS-004:** El comentario `<!-- CAMBIO COMPAS: eliminar inline que anulaba CSS -->` en `#btn-exportar-json` (l.2677) es evidencia de una modificación arquitectónica intencionada. La documentación de CAP-004 deberá registrar este comentario como anotación estructural observable, no como inferencia.

- **OBS-005:** Las barras de exportación en `#informe-container` (`.export-buttons.export-top` y `.export-buttons.export-bottom`) duplican exactamente el mismo contenido HTML (3 botones: Word, PDF, Imprimir). Esta duplicación es observable en el HTML estático y deberá documentarse como hecho, no como deuda — a menos que genere una deuda visual identificable.

- **OBS-006:** `.nombre-municipio-dinamico` aparece en `#btn-valoracion` (l.2671) como primer uso de esta clase en contenido de aplicación (ya apareció en header en CAP-003/MR-058). La documentación de CAP-004 no deberá crear una nueva entidad para la clase — solo documentar su uso como instancia observable.

---

## 16. Veredicto de delimitación

```
╔══════════════════════════════════════════════════════════════╗
║  VEREDICTO: DELIMITACIÓN_APROBADA                           ║
╠══════════════════════════════════════════════════════════════╣
║  Bloque propuesto: l.2664–l.2832 (169 líneas)              ║
║  Unidad: Fase Inicial RELAS — #fase-1-contenido            ║
║  Riesgos de corte: NINGUNO                                  ║
║  Entidades truncadas: NINGUNA                               ║
║  Mezcla de dominios heterogéneos: NO                        ║
╚══════════════════════════════════════════════════════════════╝
```

**Justificación del veredicto:**

1. El rango l.2664–2832 forma una unidad arquitectónica coherente y autónoma: el contenido completo de la Fase Inicial RELAS (`#fase-1-contenido`), incluyendo su apertura, sus 3 sub-contenedores, y sus blancos de cierre.
2. No hay ningún elemento truncado: todos los sub-contenedores (`#informe-container`, `#registro-container`, `#hoja-ruta-container`) y sus formularios cierran dentro del rango.
3. La línea final (l.2832) deja FASE 2 con inicio limpio en su propio comentario explícito (l.2833 `<!-- FASE 2: Perfil de salud local -->`).
4. No existe mezcla de dominios: el rango es íntegramente HTML de contenido de la Fase 1 RELAS, sin CSS propios ni bloques `<script>`.
5. La frontera con CAP-003 es limpia: l.2663 (fin de CAP-003) → l.2664 (inicio de CAP-004), sin solapamiento ni líneas sin atribuir.
6. La extensión (169 líneas) es manejable y consistente con la granularidad establecida por los bloques anteriores.

---

*APERTURA-CAP-004-AUDITADA — 2026-05-28*  
*Cuaderno de Gobierno del Código COMPÁS*
