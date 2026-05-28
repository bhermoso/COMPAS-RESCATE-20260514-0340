# VALIDACION-ESTRUCTURAL-CAP-005-R1

**Artefacto:** VALIDACION-ESTRUCTURAL-CAP-005-R1  
**Tipo:** auditoria cruzada y divergencia controlada  
**Estado:** PROVISIONAL / NO SUSTITUYE CAP-005-R1  
**Fecha:** 2026-05-28  
**Repositorio:** C:/Users/blash/Desktop/COMPAS_REPO_DEPURADO_20260409  
**Rango contrastado:** index.html l.2833-l.3821  

---

## 0. Alcance y limites

Esta validacion revisa de forma independiente el rango l.2833-l.3821 de `index.html` contra:

- `cuaderno/ESTRUCTURA-CAP-005-R1.md`
- `cuaderno/ESTABILIZACION-MULTICAPA-R1.md`
- `cuaderno/INDICE_MAESTRO_CUADERNO.md`

No produce CAP-005-R1 completo. No asigna contadores oficiales nuevos. No modifica taxonomia. No altera ningun documento existente.

---

## 1. Validacion general del regimen multicapa

### 1.1 Capas oficiales confirmadas

El rango confirma que CAP-005 necesita lectura multicapa. Hay evidencia observable de:

| Capa | Validacion paralela | Evidencia en index.html |
| --- | --- | --- |
| UI-S | CONFIRMADA | Header y leyenda estatica l.2839-l.2882 |
| UI-D | CONFIRMADA | `onclick`, `onchange`, `oninput` en l.2859, l.2862, l.2928, l.2974, l.3558 |
| RT | CONFIRMADA COMO DESTINO REFERENCIADO | Divs vacios o placeholders con ID: `#seccion-estudios-complementarios` l.3351, `#ia-conclusiones` l.3631, `#at2-conclusiones` l.3768 |
| PER | CONFIRMADA CON EVIDENCIA NOMINAL | `COMPAS_guardarInforme()` l.2936, `guardarTodoFirebase()` l.3231, `COMPAS_limpiarEstudiosComplementarios()` l.3353 |
| IA | CONFIRMADA | Seccion `07 ANALISIS IA` l.3432, badge `IA Claude` l.3443, `generarAnalisisIA()` l.3569 |
| LEG | CONFIRMADA CON MATICES | Comentario desactivacion IBSE l.2982-l.2987, `#panel-ibse-visual-legacy` l.3018-l.3019, coexistencia IA v1/v2 l.3688-l.3692 |

La validacion es coherente con `ESTABILIZACION-MULTICAPA-R1.md`, que estabiliza las capas UI-S, UI-D, RT, PER, IA y LEG y exige que IA, PER y LEG tengan evidencia observable.

### 1.2 Confirmacion de extensiones obligatorias

`INDICE_MAESTRO_CUADERNO.md` registra EXT-01, EXT-02 y EXT-03 como obligatorias:

- EXT-01: CAPA_DOMINANTE y CAPAS_SECUNDARIAS en ENT.
- EXT-02: mecanismo obligatorio en CON, con valores como `inline-display-none` y `atributo-disabled`.
- EXT-03: DV-COEX obligatorio para coexistencias v1/v2.

El rango CAP-005 contiene los tres casos:

- CAPAS multiples: `#panel-carga-datos` l.2888 combina UI-D, RT referenciado, PER indirecta y LEG por `display:none`.
- CON `inline-display-none`: `#ia-progreso` l.3581, `#ia-resultado` l.3595, `#at2-bloque` l.3691-l.3692.
- DV-COEX: IA v1 `#seccion-analisis-ia` l.3432-l.3683 y IA v2 `#at2-bloque` l.3688-l.3810.

---

## 2. Hallazgos estructurales principales

### H-001 - Panel de carga: estructura latente confirmada, overlay no plenamente demostrado

**Estado:** DIVERGENCIA METODOLOGICA CONTROLADA  
**Evidencia:**

- Activador externo: `togglePanelCargaDatos()` en l.2859.
- Contenedor oculto: `#panel-carga-datos` con `display:none` en l.2888.
- Boton de cierre interno: `togglePanelCargaDatos()` en l.2902.

**Validacion:** cumple LAT por `display:none` y UI-D por activador/cierre.  
**Divergencia:** la categoria OVL requiere que el panel se superponga visualmente al contenido. En el HTML observado no hay `position:fixed`, `position:absolute`, `z-index`, overlay backdrop ni estructura modal. El panel parece mas bien un panel desplegable inline dentro de la fase.

**Conclusion:** documentable como LAT/UI-D/PER, pero OVL debe quedar como PROBABLE o PENDIENTE_VERIFICACION_RUNTIME, no CONFIRMADO, salvo evidencia runtime posterior.

### H-002 - IBSE concentra la mayor densidad de hooks operativos dentro del panel de fuentes

**Estado:** CONFIRMADO  
**Evidencia:**

- `ibse_cargarCSV(this)` l.2974.
- `window.open(...)` a REDCap l.2980.
- `ibse_v2_abrir()` oculto por `display:none` l.2988.
- `ibse_v2_abrir()` visible como "Local" l.2990.
- `ibseSM_abrir()` l.2992.
- `ibse_borrarDatos()` l.2994.
- `togglePanelIBSEVisual()` l.2996.
- `togglePerfilSaludLocal()` l.2998.
- `ibse_config_guardarNObj()` l.3012.
- `#panel-ibse-visual-legacy` l.3018-l.3019.

**Validacion:** ESTRUCTURA-CAP-005-R1 identifica SEG-D3 como zona de mayor densidad funcional. La evidencia lo confirma.

### H-003 - Doble referencia a `ibse_v2_abrir()` es una coexistencia funcionalmente ambigua

**Estado:** CONFIRMADO COMO COEXISTENCIA UI; RUNTIME NO VERIFICADO  
**Evidencia:**

- Primer boton `ibse_v2_abrir()` oculto, con comentario de desactivacion l.2982-l.2988.
- Segundo boton `ibse_v2_abrir()` visible como "Local" l.2990.

**Validacion multicapa:** LEG en el boton oculto; UI-D en ambos; RT como funcion referenciada.  
**Riesgo:** el mismo destino funcional visible y oculto puede generar REL duplicadas si no se separa por estado.

### H-004 - `#panel-ibse-visual-legacy` es LEG fuerte

**Estado:** CONFIRMADO  
**Evidencia:** comentario "contenedor legacy" y `display:none` en l.3018-l.3019.

**Validacion:** satisface E-LEG por nombre `legacy`, comentario y latencia.

### H-005 - Marco estrategico contiene persistencia visible y handlers vacios

**Estado:** CONFIRMADO  
**Evidencia:**

- Inputs con `onchange=""`: l.3171, l.3179, l.3187, l.3199, l.3207, l.3215, l.3223.
- Guardado explicito: `guardarTodoFirebase()` l.3231.
- Recarga: `actualizarMunicipio()` l.3233.
- Borrado: `borrarDatosMunicipio()` l.3235.

**Validacion:** PER visible por nombre de funcion, no por implementacion interna.  
**Divergencia:** los `onchange=""` son evidencia de atributo de evento sin destino. Deben tratarse como posible DV-HANDLER-EMPTY o GAP de activacion, no como REL funcional.

### H-006 - Vista debug documental introduce observabilidad no persistente

**Estado:** CONFIRMADO  
**Evidencia:**

- `#compas-inventario-documental-debug` l.3246.
- Texto "Vista debug de inventario documental. Solo lectura." l.3254.
- Boton `COMPAS_renderInventarioDocumentalDebug()` l.3258.
- Body placeholder `Inventario documental pendiente de actualizacion.` l.3262-l.3264.

**Validacion:** superficie dinamica de observabilidad. No hay persistencia visible en este subbloque.

### H-007 - Acordeones 01-06 son superficies RT de visualizacion

**Estado:** CONFIRMADO  
**Evidencia:**

- `#seccion-marco-estrategico` vacio l.3295.
- `#seccion-estudios-complementarios` vacio con render asociado l.3337-l.3351.
- `#seccion-priorizacion-popular` vacio con render asociado l.3364-l.3378.
- `#seccion-determinantes` vacio l.3402.
- `#seccion-indicadores` vacio l.3426.

**Riesgo:** no debe confundirse placeholder DOM con contenido real. El contenido efectivo queda FUERA_DEL_RANGO_AUDITADO.

### H-008 - Limpieza de estudios complementarios mezcla UI, PER y riesgo destructivo

**Estado:** CONFIRMADO  
**Evidencia:** boton con confirmacion: "Se borran datos locales y de Firebase" y llamada a `COMPAS_limpiarEstudiosComplementarios()` l.3353.

**Validacion:** PER visible por texto y funcion.  
**Riesgo metodologico:** no basta con marcar UI-D; debe registrarse riesgo de persistencia destructiva visible, aunque la implementacion quede fuera de rango.

### H-009 - Bloque IA v1 combina IA, PER, RT, LAT y seleccion de fuentes

**Estado:** CONFIRMADO  
**Evidencia:**

- Seccion `07 ANALISIS IA` l.3432.
- Badge `IA Claude` l.3443.
- Checklist de fuentes l.3477-l.3495.
- `#evidencia-territorial-ref` con `display:none` l.3500-l.3504.
- Comentario "No alimenta motores, propuestaEPVSA ni scores. Solo lectura DOM." l.3497-l.3499.
- Checkboxes de priorizacion a integrar l.3524-l.3546.
- API key `#anthropic-api-key` l.3558.
- Boton `generarAnalisisIA()` l.3569.
- `#btn-guardar-analisis-ia` con `disabled` l.3608.

**Validacion:** ESTRUCTURA-CAP-005-R1 acierta al identificar esta zona como muy alta complejidad.

### H-010 - Evidencia territorial tiene comentario de arquitectura que excede el HTML ejecutable

**Estado:** CONFIRMADO COMO COMENTARIO E3, NO COMO RUNTIME  
**Evidencia:** l.3497-l.3499 y l.3500-l.3515.

**Lectura:** el comentario declara que no alimenta motores, propuestaEPVSA ni scores. Esto es evidencia documental interna, no prueba runtime. Debe conservarse como observacion metodologica y no como verificacion funcional.

### H-011 - Los tres estados IA v1 forman una maquina de estados no verificable solo desde HTML

**Estado:** CONFIRMADO COMO ESTRUCTURA; TRANSICIONES NO OBSERVADAS  
**Evidencia:**

- Estado inicial: `#ia-estado-inicial` l.3463.
- Progreso: `#ia-progreso` con `display:none` l.3581.
- Resultado: `#ia-resultado` con `display:none` l.3595.

**Divergencia:** se observa coexistencia de estados, pero no se observa en este rango la logica que garantiza exclusividad de estado. Requiere GAP-STATE-MACHINE.

### H-012 - `#btn-guardar-analisis-ia` es LAT-DISABLED y PER latente

**Estado:** CONFIRMADO  
**Evidencia:** boton `#btn-guardar-analisis-ia` con atributo `disabled` l.3608.

**Validacion:** coincide con ESTABILIZACION-MULTICAPA-R1: atributo `disabled` es evidencia LEG/LAT.  
**Matiz:** la persistencia es visible por texto "Guardar analisis", pero el activador de habilitacion queda fuera de rango.

### H-013 - IA v2 `#at2-bloque` es coexistencia declarada, no sustitucion activa

**Estado:** CONFIRMADO  
**Evidencia:**

- Comentario: "Convivencia: display:none hasta activacion. Legacy intacto arriba." l.3688-l.3689.
- Contenedor `#at2-bloque` con `display:none` l.3691-l.3692.
- Header llama `at2_actualizarFuentes()` l.3695.
- Boton `at2_generar()` l.3728.
- Boton `at2_regenerar()` l.3800.

**Validacion:** DV-COEX obligatorio. IA v2 debe documentarse como latente/coexistente, no como flujo activo confirmado.

### H-014 - IA v2 reproduce maquina de tres estados

**Estado:** CONFIRMADO COMO ESTRUCTURA; TRANSICIONES NO OBSERVADAS  
**Evidencia:**

- `#at2-inicial` l.3706.
- `#at2-proceso` con `display:none` l.3738.
- `#at2-resultado` con `display:none` l.3752.
- Resultado subdividido en `#at2-conclusiones`, `#at2-recomendaciones`, `#at2-prioridades` l.3768, l.3779, l.3790.

**Riesgo:** duplicidad conceptual con IA v1: conclusiones, recomendaciones y prioridades existen en ambos bloques.

---

## 3. Contradicciones o divergencias multicapa detectadas

### C-001 - `#panel-carga-datos` no demuestra overlay en sentido estricto

`ESTABILIZACION-MULTICAPA-R1.md` acepta OVL como panel oculto que se superpone visualmente. En `index.html` l.2888-l.2906 no se observa posicionamiento modal ni capa de fondo. El panel podria ser desplegable inline.

**Clasificacion propuesta:** divergencia menor-metodologica.  
**Impacto:** evitar clasificar OVL como confirmado sin prueba runtime.

### C-002 - LEG por `display:none` puede sobreclasificar estados normales de carga

El criterio E-LEG-1 acepta `display:none` estructural como LEG, pero el rango contiene estados de proceso/resultado (`#ia-progreso`, `#ia-resultado`, `#at2-proceso`, `#at2-resultado`) que son componentes normales de una maquina UI, no necesariamente legacy.

**Evidencia:** l.3581, l.3595, l.3738, l.3752.  
**Clasificacion propuesta:** no contradice el regimen, pero exige CAPA_DOMINANTE distinta: LAT/RT dominante, LEG solo secundaria o no asignada si el documento decide reservar LEG para arqueologia/coexistencia.

### C-003 - `PER` visible no implica ruta Firebase verificada

El rango contiene `guardarTodoFirebase()` l.3231 y texto Firebase l.3353, pero no rutas Firebase concretas. La capa PER queda confirmada por evidencia nominal, no por trazabilidad de ruta.

**Clasificacion:** GAP-PERSISTENCE.

### C-004 - IA por texto no debe convertirse en veredicto de motor ejecutado

El rango contiene `generarAnalisisIA()` l.3569, `Claude` l.3443 y `#anthropic-api-key` l.3558. Esto confirma superficie IA, pero no confirma ejecucion del motor, proveedor real, ni salida efectiva.

**Clasificacion:** GAP-IA.

### C-005 - Comentarios internos tienen alta carga arquitectonica pero no son prueba runtime

Comentarios como l.3497-l.3499 y l.3688-l.3689 son evidencia documental interna. Deben registrarse, pero separando:

- declaracion observable;
- comportamiento no verificado.

---

## 4. Posibles DV

No se asignan contadores oficiales. Los siguientes son candidatos para CAP-005-R1:

| Candidato | Tipo probable | Evidencia | Motivo |
| --- | --- | --- | --- |
| DV-CAP005-A | DV-OVL-PROBABLE | `#panel-carga-datos` l.2888; activadores l.2859 y l.2902 | OVL no demostrado visualmente desde HTML |
| DV-CAP005-B | DV-COEX | `ibse_v2_abrir()` oculto l.2988 y visible l.2990 | misma funcion, dos estados UI |
| DV-CAP005-C | DV-LEGACY-ID | `#panel-ibse-visual-legacy` l.3018-l.3019 | legacy declarado en ID/comentario |
| DV-CAP005-D | DV-HANDLER-EMPTY | `onchange=""` l.3171, l.3179, l.3187, l.3199, l.3207, l.3215, l.3223 | atributos de evento vacios |
| DV-CAP005-E | DV-COEX | IA v1 l.3432-l.3683 e IA v2 l.3688-l.3810 | doble subsistema de sintesis territorial |
| DV-CAP005-F | DV-INLINE-SYS | estilos inline dominantes en todo el rango | estilo inline no es excepcion sino patron sistemico |

---

## 5. Posibles GAP

No se asignan contadores oficiales. Candidatos:

| Candidato | Tipo probable | Evidencia | Justificacion |
| --- | --- | --- | --- |
| GAP-CAP005-A | GAP-RUNTIME | `togglePanelCargaDatos()` l.2859/l.2902 | no se observa implementacion ni modo real de despliegue |
| GAP-CAP005-B | GAP-PERSISTENCE | `guardarTodoFirebase()` l.3231 | no se observa ruta Firebase ni payload |
| GAP-CAP005-C | GAP-DESTRUCTIVE-PERSISTENCE | texto "Se borran datos locales y de Firebase" l.3353 | no se observa alcance real del borrado |
| GAP-CAP005-D | GAP-STATE-MACHINE | IA v1 estados l.3463/l.3581/l.3595 | transiciones no observadas |
| GAP-CAP005-E | GAP-IA | `generarAnalisisIA()` l.3569 | motor no visible en rango |
| GAP-CAP005-F | GAP-STATE-MACHINE | IA v2 estados l.3706/l.3738/l.3752 | transiciones no observadas |
| GAP-CAP005-G | GAP-RUNTIME | `at2_generar()`, `at2_regenerar()` l.3728/l.3800 | implementacion fuera de rango |
| GAP-CAP005-H | GAP-DOCUMENTAL | `COMPAS_renderInventarioDocumentalDebug()` l.3258 | contenido real del inventario no visible |

---

## 6. Entidades posiblemente no cartografiadas aun

Estas no deben consolidarse automaticamente. Son superficies o entidades candidatas que CAP-005-R1 deberia tratar con cuidado:

| Candidato | Lineas | Motivo |
| --- | --- | --- |
| `#panel-carga-datos` | l.2888-l.3273 | panel latente complejo con subpaneles PER/RT |
| `#ibse-badge-fuente` | l.2964 | badge dinamico oculto |
| `#panel-ibse` | l.2968 | placeholder IBSE municipal |
| boton IBSE monitor oculto | l.2982-l.2988 | latente desactivado con reactivacion documentada |
| boton IBSE local visible | l.2990 | misma funcion que boton oculto |
| `#panel-ibse-visual-legacy` | l.3018-l.3019 | legacy explicito |
| `#compas-inventario-documental-debug` | l.3246-l.3266 | observabilidad documental debug |
| `#seccion-estudios-complementarios` | l.3337-l.3353 | superficie dinamica + accion destructiva |
| `#evidencia-territorial-ref` | l.3497-l.3515 | contexto territorial latente con comentario metodologico |
| `#ia-fuentes-check` | l.3477-l.3495 | checklist runtime IA |
| `#ia-apikey-bloque` / `#ia-apikey-ok` | l.3554-l.3564 | estado credencial latente |
| `#ia-progreso` / `#ia-resultado` | l.3581 / l.3595 | estados de maquina IA v1 |
| `#btn-guardar-analisis-ia` | l.3608 | persistencia latente con `disabled` |
| `#at2-bloque` | l.3688-l.3810 | IA v2 latente/coexistente |
| `#at2-fuentes-lectura` | l.3721-l.3725 | superficie de lectura metodologica |

---

## 7. Superficies dinamicas de alta densidad

### Zona A - Panel IBSE y estudios

**Lineas:** l.2944-l.3044  
**Densidad:** muy alta.  
**Motivos:**

- multiples entradas de archivo;
- URL externa REDCap;
- doble monitor IBSE;
- boton de borrado;
- panel visual;
- perfil institucional;
- configuracion de N objetivo;
- estudios complementarios multiarchivo y texto libre.

### Zona B - Marco estrategico y Firebase

**Lineas:** l.3155-l.3239  
**Densidad:** media-alta.  
**Motivos:**

- inputs configurables;
- `onchange=""` repetidos;
- guardado Firebase;
- recarga municipal;
- borrado de datos.

### Zona C - Analisis IA v1

**Lineas:** l.3432-l.3683  
**Densidad:** muy alta.  
**Motivos:**

- checklist;
- seleccion de fuentes;
- evidencia territorial latente;
- API key;
- error/progreso/resultado;
- guardado disabled;
- conclusiones/recomendaciones/prioridades.

### Zona D - Diagnostico territorial v2

**Lineas:** l.3688-l.3810  
**Densidad:** alta por coexistencia.  
**Motivos:**

- bloque completo oculto;
- comentario de convivencia;
- tres estados;
- conclusiones/recomendaciones/prioridades paralelas a v1.

---

## 8. Riesgos metodologicos

1. **Riesgo de confirmar OVL sin evidencia visual suficiente.**  
   `#panel-carga-datos` tiene latencia y cierre, pero no evidencia de superposicion modal.

2. **Riesgo de convertir `display:none` en LEG universal.**  
   No todo `display:none` es legacy. Algunos son estados normales de una maquina UI.

3. **Riesgo de sobreconfirmar IA.**  
   La superficie IA es real, pero el motor y sus outputs no se verifican en este rango.

4. **Riesgo de sobreconfirmar Firebase.**  
   Hay funciones y texto Firebase, pero no rutas ni payloads visibles.

5. **Riesgo de duplicar entidades por maquina de estados.**  
   IA v1 y v2 tienen inicial/progreso/resultado. Si cada estado se eleva sin relacion de maquina, el arbol se fragmenta.

6. **Riesgo de perder de vista acciones destructivas.**  
   `COMPAS_limpiarEstudiosComplementarios()` y `borrarDatosMunicipio()` requieren marca de riesgo aunque sus implementaciones esten fuera del rango.

7. **Riesgo de mezclar evidencia documental interna con comportamiento ejecutado.**  
   Comentarios como l.3497-l.3499 y l.3688-l.3689 son valiosos, pero deben etiquetarse como declaracion interna.

---

## 9. Zonas que requieren verificacion runtime posterior

| Zona | Lineas | Pregunta runtime |
| --- | --- | --- |
| `togglePanelCargaDatos()` | l.2859/l.2902/l.2888 | El panel se superpone como overlay o se despliega inline? |
| `ibse_v2_abrir()` doble | l.2988/l.2990 | Ambos botones ejecutan exactamente el mismo monitor o rutas distintas? |
| `ibseSM_abrir()` | l.2992 | Que fuente de datos usa el monitor Super? |
| `togglePanelIBSEVisual()` | l.2996 | Activa `#panel-ibse-visual-legacy` o otro contenedor? |
| `guardarTodoFirebase()` | l.3231 | Que rutas y payloads persiste? |
| `borrarDatosMunicipio()` | l.3235 | Que alcance destructivo tiene? |
| `COMPAS_limpiarEstudiosComplementarios()` | l.3353 | Borra rutas locales, Firebase o ambas? |
| `actualizarChecklistIA()` | l.3437 | Que criterios usa para marcar fuentes? |
| `generarAnalisisIA()` | l.3569 | Consume solo fuentes seleccionadas o tambien evidencia territorial latente? |
| `btn-guardar-analisis-ia` | l.3608 | Que evento habilita el boton y que payload guarda? |
| `at2_generar()` | l.3728 | Es motor real, wrapper, experimento o sucesor parcial de v1? |
| `at2_regenerar()` | l.3800 | Reutiliza salida previa o recalcula? |

---

## 10. Resultado de validacion cruzada

### Confirmado

- CAP-005 requiere cartografia multicapa.
- Las capas oficiales UI-S, UI-D, RT, PER, IA y LEG aparecen con evidencia directa.
- EXT-01, EXT-02 y EXT-03 son necesarias para no perder informacion.
- Existen coexistencias v1/v2 y estructuras latentes.
- Existen hooks de persistencia visibles.
- Existen dependencias IA visibles.
- Existen bloques LEG fuertes: IBSE legacy y AT2 oculto.

### Divergencias controladas

- `#panel-carga-datos` no debe tratarse como OVL confirmado sin verificacion runtime.
- `display:none` no debe producir LEG automaticamente en todos los estados de carga/progreso/resultado.
- PER debe marcarse como visible por funcion/nombre, no como ruta persistente verificada.
- IA debe marcarse como superficie visible, no como motor ejecutado.

### Posicion final

**VALIDACION ESTRUCTURAL:** CAP-005_REQUIERE_CARTOGRAFIA_MULTICAPA_CONFIRMADO  
**CON OBSERVACION:** aplicar el regimen multicapa con cautela epistemologica en OVL, LEG, PER e IA.  
**PROPOSITO:** servir como auditoria cruzada y divergencia controlada para el trabajo de Claude, sin sustituir CAP-005-R1.

