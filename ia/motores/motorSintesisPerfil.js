/**
 * COMPÁS — Motor: Síntesis del Perfil de Salud
 * ia/motores/motorSintesisPerfil.js
 *
 * ITERACIÓN 10 — Motor modular como calculador real (no solo wrapper).
 *
 * ══════════════════════════════════════════════════════════════════════════════
 * CAMBIO RESPECTO A ITERACIÓN 8:
 *
 *   Antes: el motor llamaba internamente a analizarDatosMunicipio() y usaba
 *          su resultado como fuente principal (simple encapsulación).
 *
 *   Ahora: el motor calcula el análisis directamente desde ContextoIA usando
 *          el Cuadro de Mandos Integral, determinantes EAS, participación
 *          ciudadana y el modelo SFA. Solo si ese cálculo no tiene suficientes
 *          datos cae al motor heredado como fallback.
 *
 * RUTA PRINCIPAL (modular):
 *   _calcularAnalisisModular(contextoIA)
 *     ← CMI (50 indicadores INFOWEB, semáforos, componenteCI)
 *     ← determinantes EAS (mapa código → valor)
 *     ← participación ciudadana (temasFreq, nParticipantes)
 *     ← modelo SFA unificado (8 dimensiones — calcularScoreSFA)
 *   → analisis { fortalezas, oportunidades, conclusiones, recomendaciones,
 *                priorizacion, propuestaEPVSA, alertasInequidad, datosAnalisis }
 *
 * FALLBACK (heredado):
 *   _llamarMotorHeredado(contextoIA)
 *     ← analizarDatosMunicipio()       (HTML l.24486, intacto)
 *     ← ejecutarMotorExpertoCOMPAS()   (HTML l.24357, intacto)
 *   Se activa cuando: sin CMI Y sin determinantes → sinDatos en ruta modular.
 *
 * DIFERENCIAS VISIBLES EN LA UI:
 *   - propuestaEPVSA: [] en ruta modular (no hay mapeo EPVSA sin monolito)
 *   - priorizacion: basada en CMI + SFA, no en ANALYTIC_CONFIG
 *   - conclusiones/recomendaciones: generadas desde CMI, sin PLANTILLAS_SAL
 *   - origenCalculo: 'motor_modular' (identificador de trazabilidad)
 *
 * FUNCIÓN PÚBLICA CLAVE:
 *   adaptarSalidaMotorAAnalisisActual(salidaMotor, contextoIA)
 *   → Convierte SalidaMotor al formato plano que espera window.analisisActual.
 *     Llamada desde window.__COMPAS_ejecutarMotorSintesis() en COMPAS.html.
 *
 * MÓDULO: Sin DOM. Los bridges a funciones heredadas solo se llaman en fallback.
 */

import { crearMotor, ESTADOS_REVISION } from '../motorBase.js';
import { validarContextoAnalitico } from '../validacionIA.js';
import { calcularScoreSFA } from '../modeloSFA.js';

// ─────────────────────────────────────────────────────────────────────────────
// CÁLCULO MODULAR REAL
// (no llama a analizarDatosMunicipio — usa solo ContextoIA)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcula el análisis territorial desde el ContextoIA sin depender del monolito.
 *
 * Fuentes de datos que usa:
 *   1. contextoIA.cuadroMandos       → CuadroMandosIntegral (50 indicadores INFOWEB)
 *   2. contextoIA.determinantes      → mapa código → valor (EAS)
 *   3. contextoIA.participacion      → { temasFreq, rankingObjetivos, nParticipantes }
 *   4. calcularScoreSFA(contextoIA)  → 8 dimensiones SFA unificadas
 *   5. contextoIA.fuentes            → inventario de disponibilidad
 *
 * Produce un objeto plano compatible con window.analisisActual:
 *   - conclusiones[]    con { id, texto }          (IDs conocidos por _adaptarAnalisisAFormatoUI)
 *   - recomendaciones[] con { id, texto }|{ area, texto }
 *   - priorizacion[]    con { area, label, score, orden }
 *   - propuestaEPVSA[]  = [] (mapeo EPVSA requiere ESTRUCTURA_EPVSA del monolito)
 *   - fortalezas[], oportunidades[], alertasInequidad[], datosAnalisis{}
 *
 * @param {object} contextoIA - ContextoIA inmutable de contextoIA.js
 * @returns {object} Analisis plano o { sinDatos: true, razon: string }
 */
function _calcularAnalisisModular(contextoIA) {
    const cmi            = contextoIA.cuadroMandos;
    const f              = contextoIA.fuentes || {};
    const nDet           = Object.keys(contextoIA.determinantes || {}).length;
    const nEst           = (contextoIA.estudiosComplementarios || []).length;
    const hayInforme     = !!(contextoIA.informe);
    const hayParticipacion = !!(contextoIA.participacion);

    // Guard: sin ninguna fuente sustantiva → fallback al motor heredado
    if (!cmi && nDet === 0 && !hayInforme && !hayParticipacion && nEst === 0) {
        return {
            sinDatos: true,
            razon: 'Sin ninguna fuente sustantiva (CMI, determinantes EAS, informe, participación ni estudios complementarios). Activando fallback al motor heredado.',
        };
    }

    const municipio = contextoIA.ambitoNombre || contextoIA.ambitoId;

    // ── SFA dimensional scores ─────────────────────────────────────────────
    const perfilSFA = calcularScoreSFA(contextoIA);

    // ── Fortalezas (indicadores CMI favorables) ────────────────────────────
    const fortalezas = [];
    if (cmi && cmi.indicadores) {
        cmi.indicadores
            .filter(i => i.esFavorable)
            .slice(0, 8)
            .forEach(i => {
                fortalezas.push({
                    id:           `ind_favorable_${i.numero}`,
                    texto:        `${i.nombre}: tendencia favorable.`,
                    fuente_tipo:  'CMI',
                    especifica:   true,
                });
            });
    }
    // [auditoría 2026-05-17] 'determinantes_presentes' eliminado: es metadato de fuente,
    // no fortaleza territorial. "Se dispone de N determinantes" no describe el territorio.

    // ── Oportunidades (indicadores CMI a mejorar) ──────────────────────────
    const oportunidades = [];
    if (cmi && cmi.indicadores) {
        cmi.indicadores
            .filter(i => i.esAMejorar)
            .slice(0, 8)
            .forEach(i => {
                oportunidades.push({
                    id:          `ind_amejorar_${i.numero}`,
                    texto:       `${i.nombre}: tendencia desfavorable. Área de mejora prioritaria.`,
                    fuente_tipo: 'CMI',
                    especifica:  true,
                });
            });
    }

    // ── Oportunidades desde estudios complementarios ──────────────────────
    if (nEst > 0) {
        oportunidades.push({
            id: 'estudios_complementarios',
            texto: `Se dispone de ${nEst} estudio(s) complementario(s) que identifican áreas de intervención específicas en el municipio.`,
            fuente_tipo: 'estudios',
            especifica: false,
        });
    }

    // ── Oportunidades desde participación ciudadana ───────────────────────
    if (hayParticipacion && contextoIA.participacion.temasFreq) {
        const top = contextoIA.participacion.temasFreq.slice(0, 3);

        top.forEach((t, i) => {
            oportunidades.push({
                id: `participacion_${i}`,
                texto: `Prioridad ciudadana: ${t.label || t.k} (${t.v} menciones). Área de intervención comunitaria.`,
                fuente_tipo: 'participacion',
                especifica: true,
            });
        });
    }

    // ── Priorización (por categoría CMI, enriquecida con SFA) ──────────────
    //    Cada categoría del CMI es un área de priorización.
    //    Score = proporción de indicadores con tendencia desfavorable.
    //    Mayor score → mayor necesidad de intervención.
    const priorizacion = [];
    if (cmi && cmi.porCategoria) {
        Object.values(cmi.porCategoria)
            .filter(cat => cat.conDatos > 0)
            .map(cat => ({
                area:        cat.id,
                label:       cat.nombre,
                score:       parseFloat((cat.aMejorar / cat.conDatos).toFixed(3)),
                nAMejorar:   cat.aMejorar,
                nFavorables: cat.favorables,
                nConDatos:   cat.conDatos,
                fuente:      'CMI',
            }))
            .sort((a, b) => b.score - a.score)
            .forEach((area, idx) => {
                const pct = Math.round(area.score * 100);
                priorizacion.push({
                    ...area,
                    areaKey: area.area,
                    orden: idx + 1,
                    justificacion: area.nAMejorar > 0
                        ? `${area.nAMejorar} de ${area.nConDatos} indicadores con tendencia desfavorable (${pct}%).`
                        : `${area.nConDatos} indicadores analizados. Sin tendencias desfavorables destacadas.`,
                });
            });
    }

    // ── Fallback: priorización desde decisión persistida (si CMI no produjo datos) ──
    if (priorizacion.length === 0) {
        const dec = (typeof window !== 'undefined') && (
            window.decisionPriorizacionActual ||
            (contextoIA.decisionPriorizacion)
        );
        if (dec && Array.isArray(dec.areasResultantes) && dec.areasResultantes.length > 0) {
            dec.areasResultantes.forEach(function(areaKey, idx) {
                const _label = areaKey;
                const _area = (function(t) {
                    if (/Duke|apoyo/i.test(t))                              return 'apoyoSocial';
                    if (/PREDIMED|alimentaci[oó]n/i.test(t))                return 'alimentacionSaludable';
                    return t;
                })(areaKey);
                priorizacion.push({
                    area:         _area,
                    label:        _label,
                    score:        parseFloat((1 - idx / dec.areasResultantes.length).toFixed(3)),
                    nAMejorar:    0,
                    nFavorables:  0,
                    nConDatos:    0,
                    fuente:       'decisionPersistida',
                    areaKey:      areaKey,
                    orden:        idx + 1,
                    justificacion: 'Área resultante de la decisión de priorización guardada.',
                });
            });
        }
    }

    // ── PATH 2B — Priorización desde participación temática VRELAS ────────
    // Convierte temas votados por la ciudadanía en áreas canónicas EPVSA.
    // Usa temasFreq[temaId] porque ranking no conserva de forma fiable el id del tema.
    if (hayParticipacion && contextoIA.participacion && contextoIA.participacion.temasFreq) {
        const _temaAEpvsa = (typeof window !== 'undefined' && window._TEMA_A_EPVSA) || null;
        const _mapeoLE = (typeof window !== 'undefined' && window.COMPAS_MAPEO_AREA_LE) || null;
        const _tf = contextoIA.participacion.temasFreq;

        if (_temaAEpvsa && _mapeoLE && typeof _tf === 'object') {
            const _entradasVrelas = Object.keys(_tf)
                .map(function(temaId) {
                    const votos = Number(_tf[temaId]) || 0;
                    const mapa = _temaAEpvsa[parseInt(temaId, 10)];
                    const area = mapa && (mapa.area || mapa.areaCanonica || mapa.key || mapa.codigo);
                    return { temaId: temaId, votos: votos, mapa: mapa, area: area };
                })
                .filter(function(x) {
                    return x.votos > 0 && x.area && _mapeoLE[x.area];
                })
                .sort(function(a, b) { return b.votos - a.votos; })
                .slice(0, 5);

            const _maxVotos = _entradasVrelas.reduce(function(m, x) {
                return Math.max(m, x.votos);
            }, 1);

            _entradasVrelas.forEach(function(x, idx) {
                const _scoreCiudadano = parseFloat((0.24 + (x.votos / _maxVotos) * 0.18).toFixed(3));
                const _idxExistente = priorizacion.findIndex(function(p) {
                    return p && p.area === x.area;
                });

                if (_idxExistente >= 0) {
                    priorizacion[_idxExistente].score = parseFloat(
                        Math.min(1, priorizacion[_idxExistente].score + (_scoreCiudadano * 0.25)).toFixed(3)
                    );
                    priorizacion[_idxExistente].justificacion +=
                        ' + Refuerzo por priorización ciudadana VRELAS (' + x.votos + ' votos).';
                    return;
                }

                priorizacion.push({
                    area:         x.area,
                    label:        _mapeoLE[x.area].desc || x.area,
                    score:        _scoreCiudadano,
                    nAMejorar:    0,
                    nFavorables:  0,
                    nConDatos:    x.votos,
                    fuente:       'participacion_vrelas',
                    areaKey:      x.area,
                    orden:        priorizacion.length + 1,
                    justificacion: 'Área incorporada desde priorización temática ciudadana VRELAS: tema '
                                  + x.temaId + ' (' + x.votos + ' votos).',
                });
            });
        }
    }

    // ── PATH 3 — Análisis textual salutogénico (sin CMI ni decisión) ─────
    // Se activa cuando los paths CMI y decisionPriorizacion no produjeron datos.
    // Llama a window.COMPAS_analizarTextoInforme / COMPAS_analizarTextoEstudio
    // (funciones del monolito, disponibles en window cuando este módulo ejecuta).
    // No inventa datos: solo extrae señales de área presentes en el texto.
    if ((hayInforme || nEst > 0)
            && typeof window !== 'undefined'
            && typeof window.COMPAS_analizarTextoInforme === 'function') {

        const _modoCompl = priorizacion.length > 0;
        const _mapeoLE3 = (typeof window !== 'undefined') && window.COMPAS_MAPEO_AREA_LE;

        // Analizar informe
        const _infA = hayInforme
            ? window.COMPAS_analizarTextoInforme(contextoIA.informe.htmlCompleto)
            : null;

        // Analizar estudios complementarios que tengan texto
        const _estA = [];
        (contextoIA.estudiosComplementarios || []).forEach(function(e) {
            if (e && e.texto && typeof window.COMPAS_analizarTextoEstudio === 'function') {
                var a = window.COMPAS_analizarTextoEstudio(e.texto, e.nombre || 'Estudio');
                if (a) _estA.push(a);
            }
        });

        // Pesos: si hay estudios el informe cede parte de su peso
        var _wI = _estA.length > 0 ? 0.55 : 0.70;
        var _wE = _estA.length > 0 ? 0.45 / _estA.length : 0;

        // Fusionar areasDetectadas de todas las fuentes
        var _aMap = {};
        function _mergeArea(ad, peso) {
            if (!ad || !ad.area) return;
            if (!_aMap[ad.area]) _aMap[ad.area] = { score: 0, hits: 0 };
            _aMap[ad.area].score += (ad.confianza || 0) * peso;
            _aMap[ad.area].hits  += (ad.hits || 0);
        }
        if (_infA) {
            (_infA.areasDetectadas || []).forEach(function(ad) { _mergeArea(ad, _wI); });
        }
        _estA.forEach(function(est) {
            (est.areasDetectadas || []).forEach(function(ad) { _mergeArea(ad, _wE); });
        });

        // Construir priorizacion desde el mapa fusionado
        Object.entries(_aMap)
            .filter(function(entry) { var _umbral = _modoCompl ? 0.25 : 0.10; return entry[1].score >= _umbral; })
            .sort(function(a, b) { return b[1].score - a[1].score; })
            .forEach(function(entry, idx) {
                var areaKey = entry[0];
                var v       = entry[1];

                var _AMORT     = _modoCompl ? 0.60 : 1.0;
                var scoreFinal = parseFloat(Math.min(1, v.score * _AMORT).toFixed(3));

                // En modo complementario: reforzar área si ya existe en priorizacion CMI
                var _idxExist = _modoCompl
                    ? priorizacion.findIndex(function(p) { return p.area === areaKey; })
                    : -1;

                if (_idxExist >= 0) {
                    var _refuerzo = parseFloat((v.score * 0.25).toFixed(3));
                    priorizacion[_idxExist].score = parseFloat(
                        Math.min(1, priorizacion[_idxExist].score + _refuerzo).toFixed(3)
                    );
                    priorizacion[_idxExist].justificacion +=
                        ' + Evidencia textual complementaria (' + Math.round(v.score * 100) + '%).';
                    return;
                }

                priorizacion.push({
                    area:         areaKey,
                    label:        (_mapeoLE3 && _mapeoLE3[areaKey])
                                  ? _mapeoLE3[areaKey].desc
                                  : areaKey,
                    score:        scoreFinal,
                    nAMejorar:    0,
                    nFavorables:  0,
                    nConDatos:    v.hits,
                    fuente:       _modoCompl ? 'texto_salutogenico_complementario' : 'texto_salutogenico',
                    areaKey:      areaKey,
                    orden:        priorizacion.length + 1,
                    justificacion: 'Señal en informe/estudios (confianza: '
                                  + Math.round(v.score * 100)
                                  + (_modoCompl ? '%, amortiguada al 60%).' : '%).'),
                });
            });

        console.log('[motorSintesisPerfil] PATH 3 texto salutogénico: '
            + priorizacion.length + ' áreas desde informe/estudios.');
    }

    // ── Alertas de inequidad (desde SFA D4 o CMI determinantes) ───────────
    const alertasInequidad = [];
    const d4Score = perfilSFA.scorePorDimension['d4_inequidad'];
    if (d4Score && d4Score.score !== null && d4Score.score > 0.4) {
        alertasInequidad.push({
            tipo:  'inequidad_sfa',
            texto: `Indicadores de inequidad con score SFA elevado (D4 = ${(d4Score.score * 100).toFixed(0)}%). Revisar gradiente de desigualdad en salud.`,
        });
    }
    // Detectar desde CMI: alta proporción de indicadores desfavorables en determinantes
    if (cmi && cmi.porCategoria && cmi.porCategoria['determinantes']) {
        const catDet = cmi.porCategoria['determinantes'];
        if (catDet.conDatos > 0 && catDet.aMejorar / catDet.conDatos > 0.5) {
            alertasInequidad.push({
                tipo:  'determinantes_desfavorables',
                texto: `En "Determinantes de la salud": ${catDet.aMejorar} de ${catDet.conDatos} indicadores con tendencia desfavorable (${Math.round(catDet.aMejorar / catDet.conDatos * 100)}%).`,
            });
        }
    }

    // [2026-05-12] Activación estructural prudente de LE2:
    // Las alertas de inequidad no deben quedar solo como texto; si existe señal
    // empírica suficiente, incorporan "situacionEconomica" como área estratégica.
    if (alertasInequidad.length > 0 && !priorizacion.some(function(p) { return p && p.area === 'situacionEconomica'; })) {
        priorizacion.push({
            area:         'situacionEconomica',
            label:        'Equidad y determinantes sociales',
            score:        0.28,
            nAMejorar:    0,
            nFavorables:  0,
            nConDatos:    alertasInequidad.length,
            fuente:       'alertas_inequidad',
            areaKey:      'situacionEconomica',
            orden:        priorizacion.length + 1,
            justificacion: 'Activación estructural de LE2 por alerta(s) de inequidad detectada(s): '
                          + alertasInequidad.map(function(a) { return a.tipo; }).join(', ') + '.',
        });
    }

    // ── Conclusiones (con IDs conocidos por _adaptarAnalisisAFormatoUI) ────
    const conclusiones = [];

    // Tendencias CMI (ID: 'tendencias')
    // [2026-05-17] Lectura con gradación epistémica: introduce nota sobre qué significa el porcentaje
    // en términos de capacidad de monitorización y no solo como estado descriptivo.
    if (cmi && cmi.conTendencias > 0) {
        const pct = cmi.componenteCI;
        let _textTend;
        if (pct !== null) {
            if (pct >= 60) {
                _textTend = `La mayoría de los indicadores CMI con tendencias registradas (${pct}%) muestra evolución favorable. Conviene verificar si este patrón refleja mejora real en el territorio o si los indicadores disponibles tienen umbrales de clasificación favorables; la cobertura de medición condiciona la lectura.`;
            } else if (pct >= 40) {
                _textTend = `Una parte relevante de los indicadores CMI (${pct}%) evoluciona favorablemente, pero el perfil es intermedio. La concentración de señales desfavorables en áreas específicas —no el promedio— debe orientar la priorización.`;
            } else {
                _textTend = `Una minoría de los indicadores CMI (${pct}%) muestra evolución favorable. El perfil sugiere un contexto de mejora que puede requerir refuerzo de la capacidad de respuesta institucional, no solo ampliación de la agenda de actuaciones.`;
            }
        } else {
            _textTend = `Se dispone de ${cmi.conDatos} de 50 indicadores CMI con datos. La cobertura de seguimiento es parcial; la lectura debe interpretarse con cautela metodológica hasta disponer de mayor densidad de indicadores.`;
        }
        conclusiones.push({
            id:    'tendencias',
            texto: _textTend,
        });
    }

    // Categorías CMI con más problemas (ID: 'oportunidades')
    if (cmi && cmi.porCategoria) {
        const catsCriticas = Object.values(cmi.porCategoria)
            .filter(c => c.conDatos > 0 && c.aMejorar / c.conDatos >= 0.3)
            .sort((a, b) => (b.aMejorar / b.conDatos) - (a.aMejorar / a.conDatos))
            .slice(0, 2);
        if (catsCriticas.length) {
            const resumen = catsCriticas
                .map(c => `"${c.nombre}" (${c.aMejorar}/${c.conDatos} indicadores desfavorables)`)
                .join(' y ');
            conclusiones.push({
                id:    'oportunidades',
                texto: `Las áreas con mayor proporción de indicadores con tendencia desfavorable son: ${resumen}.`,
            });
        }
    }

    // [auditoría 2026-05-17] 'determinantes_sociales' eliminado: metadato de fuente, no análisis.
    // "Se han considerado N determinantes" describe el procedimiento, no el territorio.

    // Priorización ciudadana (ID: 'priorizacion_ciudadana')
    if (f.tienePopular && f.nParticipantes > 0) {
        conclusiones.push({
            id:    'priorizacion_ciudadana',
            texto: `La perspectiva ciudadana (${f.nParticipantes} participantes) ha sido integrada en el análisis territorial.`,
        });
    }

    // [auditoría 2026-05-17] Tres conclusiones procedimentales eliminadas:
    // - 'estudios_complementarios': "Se han incorporado N estudios" → metadato de fuente.
    // - 'marco_salutogenico': "El análisis se enmarca en el enfoque salutogénico" → framing universal.
    // - 'epvsa_alineamiento': "El diagnóstico se encuadra en EPVSA" → framing institucional universal.
    // Ninguna describe el territorio; todas son idénticas en cualquier municipio.

    // ── Recomendaciones ────────────────────────────────────────────────────
    const recomendaciones = [];

    // Intervenciones por área prioritaria (sin ID reservado → usa { area, texto })
    // [2026-05-17] Texto diferenciado por intensidad de señal: elimina el checklist automático
    // uniforme. Distingue tres situaciones:
    //   a) sin señal: vigilancia pasiva, no acción específica.
    //   b) señal alta (≥60% desfavorable): brecha estructural, evaluación de causas y sostenibilidad.
    //   c) señal moderada: refuerzo del seguimiento, validación de lo existente.
    priorizacion.slice(0, 3).forEach(area => {
        const _pctDesfav = area.nConDatos > 0 ? Math.round((area.nAMejorar / area.nConDatos) * 100) : 0;
        let _textRec;
        if (area.nAMejorar === 0) {
            _textRec = `Mantener vigilancia pasiva en "${area.label}": sin indicadores desfavorables en el ciclo analizado. No procede comprometer actuación específica hasta confirmar señal.`;
        } else if (_pctDesfav >= 60) {
            _textRec = `Priorizar atención en "${area.label}" (${area.nAMejorar}/${area.nConDatos} indicadores desfavorables, ${_pctDesfav}%). La concentración de señal sugiere una brecha que puede requerir evaluación de causas y sostenibilidad de la respuesta, no solo incorporación de nuevas actuaciones.`;
        } else {
            _textRec = `Reforzar el seguimiento en "${area.label}" (${area.nAMejorar}/${area.nConDatos} indicadores desfavorables). Conviene validar el alcance y continuidad de las actuaciones existentes antes de comprometer nuevas acciones en esta área.`;
        }
        recomendaciones.push({
            area:  area.label,
            texto: _textRec,
        });
    });

    // Prioridades ciudadanas (IDs rec_popular_N)
    // [2026-05-17] Introduce nota sobre el tipo de escucha necesaria para traducir la prioridad
    // ciudadana en actuaciones concretas. Evita la enumeración sin lectura.
    const pop = contextoIA.participacion;
    if (pop && pop.temasFreq) {
        Object.entries(pop.temasFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .forEach(([tema, votos], idx) => {
                recomendaciones.push({
                    id:    `rec_popular_${idx}`,
                    texto: `La ciudadanía ha señalado "${tema}" como área de interés (${votos} menciones). Esta demanda documentada requiere escucha cualitativa adicional para identificar qué aspecto concreto preocupa antes de traducirla en una actuación específica: la frecuencia de mención indica relevancia percibida, no diagnóstico.`,
                });
            });
    }

    // [auditoría 2026-05-17] Cuatro recomendaciones universales eliminadas:
    // - 'mapeo_activos': "Identificar y movilizar activos..." → aplicable a cualquier municipio.
    // - 'relas_gobernanza': "Incorporar RELAS como estructura..." → universal, no territorial.
    // - 'rec_estudios': "Integrar los N estudios..." → genérico, sin contenido del estudio.
    // - 'evaluacion_participativa': "Establecer sistema de seguimiento..." → universal.
    // Las recomendaciones territoriales reales quedan en priorizacion (por área) y participacion.

    // ── datosAnalisis (estadísticas CMI) ──────────────────────────────────
    const datosAnalisis = {
        indicadoresFavorables: cmi ? cmi.indicadores.filter(i => i.esFavorable) : [],
        indicadoresAMejorar:   cmi ? cmi.indicadores.filter(i => i.esAMejorar)  : [],
        totalIndicadores:      cmi ? cmi.conDatos : 0,
    };

    // ── propuestaEPVSA desde COMPAS_MAPEO_AREA_LE ─────────────────────────
    const propuestaEPVSA = (function() {
        const mapeoLE = (typeof window !== 'undefined') && window.COMPAS_MAPEO_AREA_LE;
        if (!mapeoLE || !priorizacion.length) return [];

        // [2026-05-07] Traducción CMI cat.id → COMPAS_MAPEO_AREA_LE keys.
        // Las categorías CMI ('determinantes', 'eventos_no_transmisibles', 'prevencion')
        // no coinciden con las claves de COMPAS_MAPEO_AREA_LE (bienestarEmocional, vidaActiva…).
        // Este mapeo conservador cubre solo relaciones semánticamente inequívocas.
        const _CMI_A_AREAS = {
            determinantes:            ['vidaActiva', 'alimentacionSaludable', 'consumoResponsable'],
            eventos_no_transmisibles: ['bienestarEmocional', 'vidaActiva', 'alimentacionSaludable'],
            prevencion:               ['entornoSaludable'],
        };

        // [2026-05-12] Selección con diversidad estratégica mínima:
        // Mantiene top 3 por score, pero permite incorporar una señal adicional cercana
        // si abre una línea EPVSA distinta y evita el colapso monolítico en LE1.
        const _candidatasConScore = priorizacion.filter(function(item) {
            return item && typeof item.score === 'number' && !isNaN(item.score) && item.score >= 0.24;
        });
        console.log('[motorSintesisPerfil][propuestaEPVSA] candidatas (score>=0.24):', _candidatasConScore.map(function(x) { return { area: x.area, score: x.score, fuente: x.fuente }; }));

        const priorizacionConScore = _candidatasConScore.slice(0, 3);
        var _extraDiversidad = null;
        if (priorizacionConScore.length >= 3) {
            const _lineasTop = {};
            priorizacionConScore.forEach(function(item) {
                const _areasTmp = (mapeoLE[item.area] ? [item.area] : (_CMI_A_AREAS[item.area] || []).slice(0, 1));
                _areasTmp.forEach(function(a) {
                    ((mapeoLE[a] && mapeoLE[a].le) || []).forEach(function(le) { _lineasTop[le] = true; });
                });
            });

            _extraDiversidad = _candidatasConScore.slice(3).find(function(item) {
                const _areasTmp = (mapeoLE[item.area] ? [item.area] : (_CMI_A_AREAS[item.area] || []).slice(0, 1));
                return _areasTmp.some(function(a) {
                    return ((mapeoLE[a] && mapeoLE[a].le) || []).some(function(le) { return !_lineasTop[le]; });
                });
            });

            if (_extraDiversidad) priorizacionConScore.push(_extraDiversidad);
        }
        console.log('[motorSintesisPerfil][propuestaEPVSA] priorizacionConScore (final, con posible extra diversidad):', priorizacionConScore.map(function(x) { return { area: x.area, score: x.score }; }));
        if (!priorizacionConScore.length) {
            console.warn('[motorSintesisPerfil] propuestaEPVSA no generada: priorizacion sin score válido (>= 0.24).');
            return [];
        }

        const lineasMap = {};
        const _le2Contribuciones = [];

        priorizacionConScore.forEach(function(item) {
            // [2026-05-12] Gobernanza semántica EPVSA:
            // Las categorías CMI agregadas no son áreas EPVSA operativas.
            // Solo se mapean directamente áreas canónicas reales; se evita expandir
            // determinantes/eventos_no_transmisibles/prevencion en múltiples áreas LE1.
            const _esCategoriaCMIAgregada = item.fuente === 'CMI'
                && Object.prototype.hasOwnProperty.call(_CMI_A_AREAS, item.area);

            const areaKeys = _esCategoriaCMIAgregada
                ? (_CMI_A_AREAS[item.area] || []).slice(0, 1)
                : (mapeoLE[item.area] ? [item.area] : []);
            const _tipoActivacion = _esCategoriaCMIAgregada ? 'categoría CMI' : 'texto directo';
            const _esDiversidad = item === _extraDiversidad;

            areaKeys.forEach(function(areaKey) {
                const mapeo = mapeoLE[areaKey];
                if (!mapeo || !mapeo.le) return;
                mapeo.le.forEach(function(leNum) {
                    if (!lineasMap[leNum]) {
                        lineasMap[leNum] = { lineaId: leNum, relevancia: 0, areas: [], objetivos: new Set(), programas: new Set() };
                    }
                    lineasMap[leNum].relevancia += Math.round((item.score || 0) * 100);
                    lineasMap[leNum].areas.push(item.label || areaKey);
                    (mapeo.obj || []).forEach(function(o) { lineasMap[leNum].objetivos.add(o); });
                    if (!lineasMap[leNum].programas) lineasMap[leNum].programas = new Set();
                    (mapeo.programas || []).forEach(function(p) { lineasMap[leNum].programas.add(p); });

                    if (leNum === 2) {
                        _le2Contribuciones.push({
                            itemArea: item.area,
                            areaKey: areaKey,
                            itemLabel: item.label || areaKey,
                            score: item.score || 0,
                            tipoActivacion: _tipoActivacion,
                            diversidadEstrategica: _esDiversidad,
                            fuente: item.fuente,
                        });
                    }
                });
            });
        });

        console.log('[motorSintesisPerfil][propuestaEPVSA] lineasMap tras mapeo EPVSA:', Object.keys(lineasMap).map(function(k) { return { LE: k, areas: lineasMap[k].areas, relevancia: lineasMap[k].relevancia }; }));
        const vals = Object.values(lineasMap);

        // [COMPÁS 2026-05-10] Líneas EPVSA incorporadas como soporte transversal.
        // Se conserva siempre la nomenclatura oficial de la EPVSA en la salida.
        // El carácter instrumental/metodológico se expresa mediante metadatos internos,
        // no sustituyendo el nombre oficial de la línea estratégica.
        // LE3 → denominación oficial EPVSA
        if ((hayInforme || hayParticipacion) && !lineasMap[3]) {
            lineasMap[3] = {
                lineaId: 3,
                relevancia: 18,
                areas: ['Difusión y comunicación de información veraz a la ciudadanía sobre los beneficios de una vida saludable y protección de la población frente a mensajes, publicidad y campañas perjudiciales para la salud'],
                objetivos: new Set([0]),
                programas: new Set([0]),
                _soporteTransversal: true
            };
        }

        // LE4 → formación, investigación y evaluación (IBSE, estudios)
        if ((nEst > 0 || hayInforme) && !lineasMap[4]) {
            lineasMap[4] = {
                lineaId: 4,
                relevancia: 15,
                areas: ['Impulso a la gestión del conocimiento, la investigación y la innovación en el área de la promoción de hábitos de vida saludables'],
                objetivos: new Set([0]),
                programas: new Set([0]),
                _soporteTransversal: true
            };
        }

        const valsFinal = Object.values(lineasMap);
        if (lineasMap[2]) {
            console.log('[motorSintesisPerfil][propuestaEPVSA][LE2] activación detectada:', _le2Contribuciones.map(function(x) {
                return {
                    itemArea: x.itemArea,
                    areaKey: x.areaKey,
                    itemLabel: x.itemLabel,
                    score: x.score,
                    tipoActivacion: x.tipoActivacion,
                    diversidadEstrategica: x.diversidadEstrategica,
                    fuente: x.fuente,
                };
            }));
            console.log('[motorSintesisPerfil][propuestaEPVSA][LE2] acumulado final:', lineasMap[2].relevancia, 'transversal:', valsFinal.filter(function(l) { return !!l._soporteTransversal; }).map(function(l) { return { lineaId: l.lineaId, relevancia: l.relevancia }; }));
        }
        console.log('[motorSintesisPerfil][propuestaEPVSA] LE2 presente:', !!lineasMap[2], '| líneas finales:', valsFinal.map(function(l) { return { lineaId: l.lineaId, relevancia: l.relevancia, soporte: !!l._soporteTransversal }; }));
        const maxRel = valsFinal.reduce(function(m, l) { return Math.max(m, l.relevancia); }, 1);

        var f = contextoIA.fuentes || {};
        var _nFp = [f.tieneInforme, f.tieneEstudios, f.tienePopular, f.tieneDet, f.tieneIndicadores].filter(Boolean).length;
        var _factorC = Math.min(0.85, _nFp * 0.17);

        const etiquetaFuentes = [
            hayParticipacion ? '🗳️ Prioridad ciudadana'   : null,
            hayInforme       ? '📄 Informe de situación'   : null,
            nEst > 0         ? 'Estudios complementarios' : null,
        ].filter(Boolean).join(' · ') || 'Análisis CMI';

        // Mapa per-línea: qué líneas EPVSA tienen temas votados por ciudadanos
        var _temasVotadosPorLinea = {};
        var _temaAEpvsaMap = (typeof window !== 'undefined' && window._TEMA_A_EPVSA) || null;

        if (hayParticipacion && contextoIA.participacion && _temaAEpvsaMap) {
            var _pop = contextoIA.participacion;

            // Path VRELAS: temasFreq es {temaId: votos}
            if (_pop.temasFreq && typeof _pop.temasFreq === 'object') {
                Object.keys(_pop.temasFreq).forEach(function(temaId) {
                    var _mapa = _temaAEpvsaMap[parseInt(temaId, 10)];
                    if (_mapa && _mapa.linea) {
                        var _leNum = parseInt(String(_mapa.linea).split('—')[0].trim(), 10);
                        if (_leNum) _temasVotadosPorLinea[_leNum] = true;
                    }
                });
            }

            // Path EPVSA legacy: rankingObjetivos es [{id, ...}]
            if (_pop.rankingObjetivos && Array.isArray(_pop.rankingObjetivos)) {
                _pop.rankingObjetivos.forEach(function(obj) {
                    var _mapa = _temaAEpvsaMap[obj.id];
                    if (_mapa && _mapa.linea) {
                        var _leNum = parseInt(String(_mapa.linea).split('—')[0].trim(), 10);
                        if (_leNum) _temasVotadosPorLinea[_leNum] = true;
                    }
                });
            }
        }

        return valsFinal.map(function(l) {

            var esSoporte = !!l._soporteTransversal;
            var tieneCiudadano = !!_temasVotadosPorLinea[l.lineaId];

            var fuentesLinea;

            if (esSoporte) {
                // LE3 / LE4 → soporte estructural
                fuentesLinea = [
                    hayInforme ? '📄 Informe de situación' : null,
                    nEst > 0 ? '🔬 Estudios / evaluación local' : null,
                    'Soporte transversal EPVSA'
                ].filter(Boolean).join(' · ');
            } else {
                // LE1 / LE2 → lógica habitual
                fuentesLinea = [
                    tieneCiudadano ? '🗳️ Prioridad ciudadana' : null,
                    hayInforme ? '📄 Informe de situación' : null,
                    nEst > 0 ? 'Estudios complementarios' : null,
                ].filter(Boolean).join(' · ') || 'Análisis CMI';
            }

            return {
                lineaId:         l.lineaId,
                relevancia:      Math.round((l.relevancia / maxRel) * 100 * _factorC),
                objetivos:       [...l.objetivos],
                programas:       l.programas ? [...l.programas].slice(0, 3) : [],
                justificacion:   'Línea EPVSA relacionada: ' + l.areas.join(', '),
                origenCiudadano: tieneCiudadano,
                fuentes:         fuentesLinea,
                _soporteTransversal: esSoporte,
                tipoLineaMotor:  esSoporte
                    ? 'soporte_transversal'
                    : (l.lineaId === 4
                        ? 'linea_habilitadora'
                        : (l.lineaId === 3
                            ? 'linea_comunicativa_transversal'
                            : (l.lineaId === 2
                                ? 'linea_estructural_contextual'
                                : 'prioridad_operativa_principal'))),
                conclusion_ids:  ['marco_salutogenico'],
            };
        }).sort(function(a, b) { return b.relevancia - a.relevancia; });
    })();

    return {
        // ── Campos de compatibilidad con window.analisisActual ─────────────
        municipio,
        motor_version:         '2.0-modular',
        fuentes:               f,

        fortalezas,
        oportunidades,
        conclusiones,
        recomendaciones,
        priorizacion,
        priorizacion_experta:  [],   // sin ANALYTIC_CONFIG en ruta modular
        propuestaEPVSA,
        alertasInequidad,
        narrativa:             {},   // sin PLANTILLAS_SAL en ruta modular
        perfilSOC:             null, // sin lógica SOC en ruta modular
        datosAnalisis,
        patronesTransversales: [],

        // ── Enriquecimiento territorial externo ────────────────────────────
        //    Campo contractual pasivo: no calcula, no busca, no persiste.
        enriquecimientoTerritorial: contextoIA.enriquecimientoTerritorial || null,

        // ── Metadatos de la ruta modular ───────────────────────────────────
        sinDatos:          false,
        origenCalculo:     'motor_modular',
        perfilSFA:         perfilSFA,  // 8 dimensiones SFA, para consumo modular
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZACIÓN DE SALIDA (compatible con ruta modular y heredada)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convierte cualquier objeto `analisis` (modular o heredado) al formato
 * estructurado del contrato modular SalidaMotor.
 *
 * Compatible con la salida de _calcularAnalisisModular() Y de _llamarMotorHeredado().
 *
 * @param {object} analisis   - Objeto plano de análisis (modular o heredado)
 * @param {object} contextoIA
 * @returns {object}
 */
function _normalizarAnalisis(analisis, contextoIA) {
    if (!analisis) return { sinDatos: true, mensaje: 'El motor no produjo análisis.' };
    if (analisis.sinDatos) return { sinDatos: true, mensaje: analisis.mensaje || 'Sin datos.' };

    const perfil = {
        municipio:             analisis.municipio || contextoIA.ambitoNombre,
        fortalezas:            analisis.fortalezas       || [],
        oportunidades:         analisis.oportunidades    || [],
        nFortalezas:           (analisis.fortalezas       || []).length,
        nOportunidades:        (analisis.oportunidades    || []).length,
        indicadoresFavorables: (analisis.datosAnalisis && analisis.datosAnalisis.indicadoresFavorables) || [],
        indicadoresAMejorar:   (analisis.datosAnalisis && analisis.datosAnalisis.indicadoresAMejorar)   || [],
        totalIndicadores:      (analisis.datosAnalisis && analisis.datosAnalisis.totalIndicadores) || 0,
        alertasInequidad:      analisis.alertasInequidad || [],
        nAlertasInequidad:     (analisis.alertasInequidad || []).length,
        narrativa:             analisis.narrativa || {},
        perfilSOC:             analisis.perfilSOC || null,
    };

    const priorizacion = {
        areas:                analisis.priorizacion         || [],
        nAreas:               (analisis.priorizacion        || []).length,
        areasExperta:         analisis.priorizacion_experta || [],
        patronesTransversales: analisis.patronesTransversales || [],
    };

    const propuestaEPVSA = analisis.propuestaEPVSA || [];

    const conclusiones = {
        lista:    analisis.conclusiones || [],
        nTotal:   (analisis.conclusiones || []).length,
        porFuente: _agruparPorCampo(analisis.conclusiones || [], 'fuente_tipo'),
    };

    const recomendaciones = {
        lista:  analisis.recomendaciones || [],
        nTotal: (analisis.recomendaciones || []).length,
    };

    const motorVersion = analisis.motor_version || analisis._v3_version || '2.0';

    return {
        analisis,           // objeto plano completo (para window.analisisActual)
        perfil,
        priorizacion,
        propuestaEPVSA,
        conclusiones,
        recomendaciones,
        motorVersion,
        trazabilidadInterna: analisis.trazabilidad || null,
        fuentes:             analisis.fuentes || {},
        origenCalculo:       analisis.origenCalculo || 'motor_heredado',
    };
}

function _agruparPorCampo(arr, campo) {
    return arr.reduce((acc, item) => {
        const key = item[campo] || 'sin_clasificar';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK — MOTOR HEREDADO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Llama al motor heredado analizarDatosMunicipio() cuando la ruta modular
 * no tiene datos suficientes.
 *
 * analizarDatosMunicipio() y ejecutarMotorExpertoCOMPAS() siguen intactos
 * en COMPAS.html. Este bridge los llama vía scope global.
 *
 * ⚠️ PROVISIONAL: Se elimina cuando los datos se carguen vía repositorios modulares.
 */
function _llamarMotorHeredado(contextoIA) {
    if (typeof analizarDatosMunicipio !== 'function') {
        console.warn('[motorSintesisPerfil] analizarDatosMunicipio no disponible. Usando análisis previo si existe.');
        return contextoIA.analisisPrevio || null;
    }

    const analisis = analizarDatosMunicipio();

    if (analisis && !analisis.sinDatos && typeof ejecutarMotorExpertoCOMPAS === 'function') {
        ejecutarMotorExpertoCOMPAS(analisis);
    }

    // Mantener window.analisisActual en ruta heredada (bridge de compatibilidad)
    if (analisis && !analisis.sinDatos) {
        window.analisisActual = analisis;
    }

    return analisis;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIANZA
// ─────────────────────────────────────────────────────────────────────────────

function _calcularConfianza(resultado, contextoIA) {
    if (!resultado || resultado.sinDatos) return 0;

    const f = contextoIA.fuentes || {};
    const nFuentes = [f.tieneInforme, f.tieneEstudios, f.tienePopular,
                      f.tieneDet, f.tieneIndicadores].filter(Boolean).length;

    let confianza = Math.min(0.85, nFuentes * 0.17);

    // Bonus si hay areasExperta (expert system corrió → ruta heredada o enriquecida)
    if (resultado.priorizacion && resultado.priorizacion.areasExperta &&
        resultado.priorizacion.areasExperta.length > 0) {
        confianza = Math.min(0.92, confianza + 0.07);
    }
    // Bonus si el análisis viene de la ruta modular con CMI completo
    if (resultado.origenCalculo === 'motor_modular' && contextoIA.cuadroMandos) {
        const cmi = contextoIA.cuadroMandos;
        if (cmi.coberturaPorcentaje >= 50) confianza = Math.min(0.88, confianza + 0.06);
    }
    // Bonus por conclusiones específicas
    const conclEspecificas = ((resultado.conclusiones && resultado.conclusiones.lista) || [])
        .filter(c => c.especifica).length;
    if (conclEspecificas > 2) confianza = Math.min(0.95, confianza + 0.05);

    return parseFloat(confianza.toFixed(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFINICIÓN DEL MOTOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Motor de Síntesis del Perfil de Salud.
 *
 * Ruta principal: _calcularAnalisisModular(contextoIA)
 *   Calcula desde CMI + determinantes + participación + modelo SFA.
 *   NO llama a analizarDatosMunicipio() en condiciones normales.
 *
 * Fallback: _llamarMotorHeredado(contextoIA)
 *   Se activa si la ruta modular devuelve sinDatos (sin CMI ni determinantes).
 *
 * Entrada:  ContextoIA
 * Salida:   SalidaMotor con { perfil, priorizacion, propuestaEPVSA, conclusiones, recomendaciones }
 * Revisión: PENDIENTE — el técnico debe revisar antes de usar el resultado.
 */
// -----------------------------------------------------------------------------
// MOTOR SINTESIS PERFIL v4 - CAPA INTERPRETATIVA PARALELA
// -----------------------------------------------------------------------------

const V4_VERSION = '4.0.0-paralela';

const V4_REGLAS_EPISTEMOLOGICAS = Object.freeze([
    'Separar observacion, evidencia, inferencia, hipotesis y recomendacion.',
    'No convertir marcos estrategicos en evidencia territorial directa.',
    'Las estrategias secundarias solo refuerzan senales territoriales previas.',
    'El mapeo de activos comunitarios es recomendacion estructural RELAS universal.',
    'Graduar la incertidumbre y evitar conclusiones causales sin soporte suficiente.',
    'Preservar propuestaEPVSA v3 sin sustituirla en esta fase.',
]);

const V4_ESTRATEGIAS_SECUNDARIAS = Object.freeze([
    {
        id: 'vida_sin_humo',
        label: 'Vida Sin Humo / tabaquismo',
        patron: /vida\s+sin\s+humo|tabac|tabaqu|fumar|humo|cigarr/i,
        senal: /tabac|tabaqu|fumar|humo|cigarr|consumo\s+responsable|adicc/i,
    },
    {
        id: 'alcohol_y_adicciones',
        label: 'Alcohol y adicciones',
        patron: /alcohol|adicc|drog|botell[oó]n|sustancias/i,
        senal: /alcohol|adicc|drog|botell[oó]n|sustancias|consumo\s+responsable/i,
    },
]);

function _v4_array(valor) {
    return Array.isArray(valor) ? valor : [];
}

function _v4_texto(valor) {
    if (!valor) return '';
    if (typeof valor === 'string') return valor.trim();
    if (typeof valor.texto === 'string') return valor.texto.trim();
    if (typeof valor.descripcion === 'string') return valor.descripcion.trim();
    if (typeof valor.justificacion === 'string') return valor.justificacion.trim();
    if (typeof valor.nombre === 'string') return valor.nombre.trim();
    return '';
}

function _v4_compactarTextos(items, max = 12) {
    return _v4_array(items).map(_v4_texto).filter(Boolean).slice(0, max);
}

function _v4_item(parcial) {
    const texto = _v4_texto(parcial);
    if (!texto) return null;
    return {
        id: parcial.id || `v4_${Math.random().toString(36).slice(2, 10)}`,
        tipo: parcial.tipo || 'interpretacion',
        categoria: parcial.categoria || 'general',
        texto,
        fuentes: _v4_array(parcial.fuentes),
        nivelEvidencia: parcial.nivelEvidencia || 4,
        certeza: parcial.certeza || 'media',
        justificacion: parcial.justificacion || '',
        trazabilidad: {
            motor: 'motor_sintesis_perfil_v4',
            version: V4_VERSION,
            regla: parcial.regla || 'lectura_interpretativa',
        },
        habilitaEPVSA: !!parcial.habilitaEPVSA,
        habilitaRecomendacion: !!parcial.habilitaRecomendacion,
    };
}

function _v4_push(lista, parcial) {
    const item = _v4_item(parcial);
    if (item && !lista.some(x => x.id === item.id || x.texto === item.texto)) lista.push(item);
    return item;
}

function _v4_fuentes(contextoIA, analisisBase) {
    const f = Object.assign({}, (contextoIA && contextoIA.fuentes) || {}, (analisisBase && analisisBase.fuentes) || {});
    const inventario = [];
    const add = (id, disponible, nivel, tipo, etiqueta) => {
        inventario.push({ id, etiqueta, disponible: !!disponible, nivelEvidencia: nivel, tipo });
    };

    add('indicadores_cmi', !!(contextoIA && contextoIA.cuadroMandos), 1, 'evidencia_territorial_directa', 'Cuadro de Mandos Integral / indicadores');
    add('determinantes_eas', !!(contextoIA && contextoIA.determinantes && Object.keys(contextoIA.determinantes).length), 1, 'evidencia_territorial_directa', 'Determinantes EAS');
    add('ibse', !!(f.tieneIBSE || f.tieneIbse || (analisisBase && analisisBase.perfilSOC)), 1, 'evidencia_territorial_directa', 'IBSE / perfil salutogenico');
    add('informe_salud', !!(contextoIA && contextoIA.informe), 2, 'evidencia_complementaria', 'Informe de situacion de salud');
    add('estudios_complementarios', !!(contextoIA && contextoIA.estudiosComplementarios && contextoIA.estudiosComplementarios.length), 2, 'evidencia_complementaria', 'Estudios complementarios');
    add('participacion', !!(contextoIA && contextoIA.participacion), 3, 'fuente_participativa', 'Participacion ciudadana / priorizacion');
    add('lt1', !!(typeof window !== 'undefined' && typeof window.COMPAS_construirLecturaTerritorialV1 === 'function'), 4, 'inferencia_territorial_prudente', 'Lectura territorial LT1');
    add('epvsa', true, 5, 'marco_estrategico_principal', 'Marco EPVSA 2024-2030');
    add('estrategias_secundarias', true, 6, 'marco_estrategico_secundario', 'Estrategias secundarias');

    return {
        inventario,
        disponibles: inventario.filter(x => x.disponible).map(x => x.id),
        jerarquia: {
            nivel1: 'Evidencia territorial directa',
            nivel2: 'Evidencia complementaria',
            nivel3: 'Participacion y priorizacion',
            nivel4: 'Inferencia territorial prudente',
            nivel5: 'Marco EPVSA',
            nivel6: 'Estrategias secundarias',
        },
    };
}

function _v4_extraerLT1(analisisBase) {
    if (typeof window === 'undefined' || typeof window.COMPAS_construirLecturaTerritorialV1 !== 'function' || !analisisBase) return null;
    try {
        return window.COMPAS_construirLecturaTerritorialV1(analisisBase);
    } catch (err) {
        return { error: err && err.message ? err.message : String(err) };
    }
}

function _v4_textosBase(contextoIA, analisisBase, lt1) {
    const textos = [];
    const add = valor => { const t = _v4_texto(valor); if (t) textos.push(t); };
    _v4_array(analisisBase && analisisBase.conclusiones).forEach(add);
    _v4_array(analisisBase && analisisBase.fortalezas).forEach(add);
    _v4_array(analisisBase && analisisBase.oportunidades).forEach(add);
    _v4_array(analisisBase && analisisBase.alertasInequidad).forEach(add);
    _v4_array(analisisBase && analisisBase.priorizacion).forEach(add);
    if (analisisBase && analisisBase.datosAnalisis) {
        _v4_array(analisisBase.datosAnalisis.indicadoresAMejorar).forEach(add);
        _v4_array(analisisBase.datosAnalisis.indicadoresFavorables).forEach(add);
    }
    if (contextoIA && contextoIA.participacion && contextoIA.participacion.temasFreq) {
        Object.keys(contextoIA.participacion.temasFreq).forEach(add);
    }
    ['observaciones', 'interpretaciones', 'inferencias', 'tensiones', 'activos', 'vulnerabilidades', 'oportunidades', 'orientaciones', 'prioridades'].forEach(k => {
        _v4_array(lt1 && lt1[k]).forEach(add);
    });
    return textos.join(' \n ');
}

function _v4_haySenalTerritorial(estrategia, textoBase) {
    return estrategia.senal.test(textoBase || '');
}

function _v4_construirObservaciones(contextoIA, analisisBase, lt1, salida) {
    const fuentes = salida.fuentes;
    const fuente = id => fuentes.disponibles.includes(id) ? [id] : [];

    if (contextoIA && contextoIA.cuadroMandos) {
        const cmi = contextoIA.cuadroMandos;
        _v4_push(salida.observaciones, {
            id: 'obs_cmi_disponible', tipo: 'observacion', categoria: 'indicadores',
            texto: `El territorio dispone de CMI con ${cmi.conDatos || 0} indicadores con datos.`,
            fuentes: ['indicadores_cmi'], nivelEvidencia: 1, certeza: 'alta',
            justificacion: 'Fuente cuantitativa territorial directa.', habilitaRecomendacion: true, habilitaEPVSA: true,
            regla: 'evidencia_territorial_directa',
        });
    }

    const nDet = contextoIA && contextoIA.determinantes ? Object.keys(contextoIA.determinantes).length : 0;
    if (nDet > 0) {
        _v4_push(salida.observaciones, {
            id: 'obs_determinantes_eas', tipo: 'observacion', categoria: 'determinantes',
            texto: `La lectura incorpora ${nDet} determinantes EAS disponibles.`,
            fuentes: ['determinantes_eas'], nivelEvidencia: 1, certeza: 'alta',
            justificacion: 'Los determinantes operan como evidencia territorial directa cuando estan cargados.',
            habilitaRecomendacion: true, habilitaEPVSA: true,
            regla: 'evidencia_territorial_directa',
        });
    }

    if (contextoIA && contextoIA.participacion) {
        const n = contextoIA.participacion.nParticipantes || contextoIA.participacion.totalParticipantes || null;
        _v4_push(salida.observaciones, {
            id: 'obs_participacion', tipo: 'observacion', categoria: 'participacion',
            texto: n ? `Existe participacion ciudadana registrada (${n} participantes).` : 'Existe participacion ciudadana registrada.',
            fuentes: ['participacion'], nivelEvidencia: 3, certeza: 'media',
            justificacion: 'La participacion orienta prioridades, pero no sustituye a la evidencia territorial directa.',
            habilitaRecomendacion: true, habilitaEPVSA: false,
            regla: 'participacion_no_equivale_a_evidencia_directa',
        });
    }

    _v4_compactarTextos(analisisBase && analisisBase.conclusiones, 8).forEach((texto, i) => {
        _v4_push(salida.evidencia.contextual, {
            id: `ev_conclusion_v3_${i + 1}`, tipo: 'evidencia', categoria: 'conclusion_v3', texto,
            fuentes: fuente('indicadores_cmi').concat(fuente('determinantes_eas'), fuente('informe_salud')),
            nivelEvidencia: fuentes.disponibles.includes('indicadores_cmi') || fuentes.disponibles.includes('determinantes_eas') ? 1 : 4,
            certeza: fuentes.disponibles.includes('indicadores_cmi') || fuentes.disponibles.includes('determinantes_eas') ? 'media-alta' : 'media-baja',
            justificacion: 'Conclusion del motor vigente reinterpretada como insumo, no como cierre epistemico.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'v3_como_insumo_contextual',
        });
    });

    if (lt1 && !lt1.error) {
        _v4_compactarTextos(lt1.observaciones, 8).forEach((texto, i) => _v4_push(salida.observaciones, {
            id: `obs_lt1_${i + 1}`, tipo: 'observacion', categoria: 'lt1', texto,
            fuentes: ['lt1'], nivelEvidencia: 4, certeza: 'media',
            justificacion: 'Observacion reconstruida desde la lectura territorial LT1 heredada.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'lt1_recuperada',
        }));
    }
}

function _v4_construirLecturas(contextoIA, analisisBase, lt1, salida, evidenciaMeta) {
    const textoBase = _v4_textosBase(contextoIA, analisisBase, lt1).toLowerCase();

    // Fuentes concretas disponibles: participacion real o LT1 sin error.
    const hayParticipacion = salida.fuentes.disponibles.includes('participacion');
    const hayLT1Valido = !!(lt1 && !lt1.error);

    // infer: inferencia territorial directa — solo si hay peso de evidencia suficiente (umbral 2).
    // Si no, degrada a hipótesis por evidencia insuficiente.
    const infer = (id, texto, patron, certeza = 'media-baja') => {
        if (!patron.test(textoBase)) return;
        if (evidenciaMeta.puedeInferir()) {
            _v4_push(salida.inferencias, {
                id, tipo: 'inferencia', categoria: 'dinamica_territorial', texto,
                fuentes: ['indicadores_cmi', 'determinantes_eas', 'participacion', 'lt1'].filter(f => salida.fuentes.disponibles.includes(f)),
                nivelEvidencia: 4, certeza,
                justificacion: 'Dinamica territorial inferida por convergencia de senales con soporte estructural suficiente.',
                habilitaRecomendacion: false, habilitaEPVSA: false,
                regla: 'territorialidad_prudente',
            });
        } else {
            _v4_push(salida.hipotesis, {
                id: `hip_${id}`, tipo: 'hipotesis', categoria: 'hipotesis_sin_evidencia_suficiente',
                texto: texto + ' (Hipotesis: peso de evidencia estructural insuficiente para inferir.)',
                fuentes: salida.fuentes.disponibles.filter(f => evidenciaMeta.clasificarFuente(f) <= 3),
                nivelEvidencia: 5, certeza: 'baja',
                justificacion: `Patron detectado pero evidenciaMeta.pesoTotal=${evidenciaMeta.pesoTotal} < umbral 2. Requiere al menos una fuente N1 o dos N2.`,
                habilitaRecomendacion: false, habilitaEPVSA: false,
                regla: 'hipotesis_por_evidencia_insuficiente',
            });
        }
    };

    // inferOrHipotesis: para señales genéricas — requiere además fuente concreta (participacion o LT1)
    // Y peso suficiente. Sin ambas condiciones → hipótesis exploratoria.
    const inferOrHipotesis = (id, texto, patron, certeza = 'media-baja') => {
        if (!patron.test(textoBase)) return;
        const tieneFuenteConcreta = hayParticipacion || hayLT1Valido;
        if (evidenciaMeta.puedeInferir() && tieneFuenteConcreta) {
            _v4_push(salida.inferencias, {
                id, tipo: 'inferencia', categoria: 'dinamica_territorial', texto,
                fuentes: ['participacion', 'lt1'].filter(f => salida.fuentes.disponibles.includes(f)),
                nivelEvidencia: 4, certeza,
                justificacion: 'Dinamica territorial inferida con respaldo de fuente participativa o LT1 y evidencia estructural suficiente.',
                habilitaRecomendacion: false, habilitaEPVSA: false,
                regla: 'territorialidad_con_fuente_concreta',
            });
        } else {
            const razon = !evidenciaMeta.puedeInferir()
                ? `evidenciaMeta.pesoTotal=${evidenciaMeta.pesoTotal} < umbral 2`
                : 'sin fuente participativa ni LT1 concretas';
            _v4_push(salida.hipotesis, {
                id: `hip_${id}`, tipo: 'hipotesis', categoria: 'hipotesis_exploratoria',
                texto: texto + ` (Hipotesis exploratoria: ${razon}.)`,
                fuentes: [],
                nivelEvidencia: 5, certeza: 'baja',
                justificacion: 'Patron detectado pero condiciones epistemologicas insuficientes. No debe leerse como lectura territorial fuerte.',
                habilitaRecomendacion: false, habilitaEPVSA: false,
                regla: 'hipotesis_exploratoria_sin_senal_concreta',
            });
        }
    };

    infer('inf_envejecimiento', 'Aparece una posible dinamica de envejecimiento o peso creciente de poblacion mayor que conviene leer junto a apoyos, cuidados y accesibilidad.', /envejec|mayores|personas\s+mayores|poblaci[oó]n\s+mayor/);
    infer('inf_vulnerabilidad_silenciosa', 'Puede existir vulnerabilidad silenciosa si las senales de desigualdad conviven con baja visibilidad participativa o con fuentes incompletas.', /vulnerab|desigual|inequidad|exclusi[oó]n|fragilidad/);
    inferOrHipotesis('inf_cohesion_redes', 'Hay senales de cohesion, redes de apoyo o participacion que pueden actuar como activo salutogenico del Plan Local de Salud.', /cohesi[oó]n|redes|apoyo\s+social|participaci[oó]n|asociativ|comunitari/);
    inferOrHipotesis('inf_potencial_salutogenico', 'El territorio muestra posibles capacidades salutogenicas que deben leerse junto a activos, redes y oportunidades, no solo como deficit.', /salutog|fortaleza|activo|resilien|sentido\s+de\s+coherencia|ibse|soc/);
    inferOrHipotesis('inf_capacidad_comunitaria', 'La capacidad comunitaria debe interpretarse como condicion de implementacion: puede facilitar o limitar la traduccion del diagnostico en actuaciones.', /participaci[oó]n|activo|gobernanza|asociaci|redes|comunitari/);

    if (lt1 && !lt1.error) {
        // LT1 solo refuerza inferencias existentes — no las autoriza por sí solo.
        // Requiere evidencia estructural fuerte (N1 o dos N2) para llegar a inferencias.
        const destinoLT1 = evidenciaMeta.puedeInferirFuerte() ? salida.inferencias : salida.hipotesis;
        const tipoLT1 = evidenciaMeta.puedeInferirFuerte() ? 'inferencia' : 'hipotesis';
        const categoriaLT1 = evidenciaMeta.puedeInferirFuerte() ? 'lt1' : 'hipotesis_exploratoria';
        const reglaLT1 = evidenciaMeta.puedeInferirFuerte() ? 'lt1_con_respaldo_estructural' : 'lt1_sin_soporte_degradado';
        const certezaLT1 = evidenciaMeta.puedeInferirFuerte() ? 'media' : 'baja';
        const justLT1 = evidenciaMeta.puedeInferirFuerte()
            ? 'Inferencia LT1 con respaldo de evidencia estructural N1/N2.'
            : 'LT1 sin soporte estructural suficiente: degradado a hipotesis exploratoria. LT1 no autoriza inferencia por si solo.';

        _v4_compactarTextos(lt1.interpretaciones || lt1.inferencias, 8).forEach((texto, i) => _v4_push(destinoLT1, {
            id: `inf_lt1_${i + 1}`, tipo: tipoLT1, categoria: categoriaLT1,
            texto: evidenciaMeta.puedeInferirFuerte() ? texto : texto + ' (LT1 sin evidencia estructural de respaldo.)',
            fuentes: ['lt1'], nivelEvidencia: evidenciaMeta.puedeInferirFuerte() ? 4 : 5, certeza: certezaLT1,
            justificacion: justLT1,
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: reglaLT1,
        }));
        _v4_compactarTextos(lt1.tensiones, 8).forEach((texto, i) => _v4_push(salida.tensiones, {
            id: `ten_lt1_${i + 1}`, tipo: 'tension', categoria: 'territorial', texto,
            fuentes: ['lt1'], nivelEvidencia: 4, certeza: 'media-baja',
            justificacion: 'Tension territorial util para deliberacion tecnica; requiere contraste antes de activar medidas.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'tension_no_es_recomendacion',
        }));
    }

    if (/cohesi[oó]n|redes|apoyo\s+social/.test(textoBase) && /envejec|mayores|aislamiento|soledad/.test(textoBase)) {
        _v4_push(salida.tensiones, {
            id: 'ten_cohesion_envejecimiento', tipo: 'tension', categoria: 'salutogenica',
            texto: 'La posible cohesion comunitaria debe contrastarse con el envejecimiento, la soledad o las necesidades de cuidados para no sobredimensionar la capacidad de apoyo informal.',
            fuentes: ['lt1', 'participacion', 'ibse'].filter(f => salida.fuentes.disponibles.includes(f)),
            nivelEvidencia: 4, certeza: 'media-baja',
            justificacion: 'Tension interpretativa entre activo comunitario y demanda de cuidados.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'tension_territorial_prudente',
        });
    }

    // Lectura institucional longitudinal — señales de gobernanza basadas en datos reales del ciclo.
    // No usa regex textual. Lee lecturaEvaluativaLongitudinal ya calculada por el sistema de evaluación.
    _v4_leerGobernanzaLongitudinal(salida);
}

// ── Lectura institucional longitudinal ───────────────────────────────────────
// Obtiene el snapshot evaluativo (preferentemente vía COMPAS_obtenerSnapshotEvaluacionActual;
// fallback a window.COMPAS.state._ultimoSnapshot) y añade señales de gobernanza a v4.
// Si no existe lecturaEvaluativaLongitudinal, no hace nada.
// No inventa longitudinalidad: solo lee clasificaciones ya etiquetadas por el sistema de evaluación.
function _v4_leerGobernanzaLongitudinal(salida) {
    if (typeof window === 'undefined') return;

    // Obtener snapshot: primero función pública, fallback a estado cacheado.
    var _snap = null;
    try {
        if (typeof window.COMPAS_obtenerSnapshotEvaluacionActual === 'function') {
            _snap = window.COMPAS_obtenerSnapshotEvaluacionActual();
        }
    } catch (e) {
        // silencioso — intentaremos fallback
    }
    if (!_snap) {
        _snap = window.COMPAS && window.COMPAS.state && window.COMPAS.state._ultimoSnapshot;
    }

    var _lel = _snap && _snap.lecturaEvaluativaLongitudinal;
    if (!_lel || !_lel.clasificaciones) return;  // guard: sin lectura longitudinal, no actúa

    var _clases    = _lel.clasificaciones;
    var _ejecucion = _clases.ejecucion && _clases.ejecucion.estado;
    var _arrastre  = (_clases.ejecucion && typeof _clases.ejecucion.tasaArrastre === 'number')
                     ? _clases.ejecucion.tasaArrastre : null;
    var _red       = _clases.redComunitaria && _clases.redComunitaria.estado;
    var _trazab    = _clases.trazabilidad && _clases.trazabilidad.estado;

    // Tensión: ejecución baja → capacidad de implementación insuficiente
    if (_ejecucion === 'baja') {
        _v4_push(salida.tensiones, {
            id: 'ten_capacidad_ejecucion_baja',
            tipo: 'tension', categoria: 'gobernanza_institucional',
            texto: 'La tasa de finalización dentro del ciclo registrada es baja. El plan requiere revisión de su capacidad de implementación, simplificación de acciones o acompañamiento externo antes de ampliar compromisos.',
            fuentes: ['agenda_evaluacion'], nivelEvidencia: 2, certeza: 'media-alta',
            justificacion: 'Clasificación lecturaEvaluativaLongitudinal.ejecucion = baja. Dato institucional real del ciclo evaluado, no inferencia textual.',
            habilitaRecomendacion: true, habilitaEPVSA: false,
            regla: 'gobernanza_ejecucion_insuficiente',
        });
    }

    // Fortaleza: ejecución sólida → capacidad institucional documentada
    if (_ejecucion === 'solida') {
        _v4_push(salida.fortalezas, {
            id: 'for_capacidad_ejecucion_solida',
            tipo: 'fortaleza', categoria: 'gobernanza_institucional',
            texto: 'La ejecución del ciclo evaluado es sólida: alta tasa de finalización y baja tasa de arrastre. El municipio muestra capacidad de implementación institucional documentada.',
            fuentes: ['agenda_evaluacion'], nivelEvidencia: 2, certeza: 'media-alta',
            justificacion: 'Clasificación lecturaEvaluativaLongitudinal.ejecucion = solida. Dato institucional real del ciclo evaluado.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'gobernanza_ejecucion_solida',
        });
    }

    // Tensión: arrastre cronificado → lectura organizacional diferenciada de causas posibles
    if (_arrastre !== null && _arrastre >= 50) {
        _v4_push(salida.tensiones, {
            id: 'ten_arrastre_cronificado',
            tipo: 'tension', categoria: 'fragilidad_institucional',
            // [2026-05-17] Lectura organizacional: el arrastre no implica fracaso por sí solo.
            // Introduce hipótesis interpretativas cautas sobre causas posibles en lugar de describir
            // el dato. Distingue: complejidad estructural, capacidad operativa, dependencia de actores,
            // exceso de carga estratégica, madurez insuficiente de la red de implementación.
            texto: 'El ' + Math.round(_arrastre) + '% de actuaciones del ciclo presenta arrastre. Este patrón puede responder a causas distintas — complejidad estructural de las acciones, capacidad operativa del equipo insuficiente para el volumen comprometido, dependencia de actores o recursos externos no asegurados, o exceso de carga estratégica respecto a la madurez institucional disponible — que conviene explorar antes de comprometer nuevos objetivos. No implica necesariamente fracaso: puede reflejar una transición de ciclo o una red de implementación en proceso de consolidación.',
            fuentes: ['agenda_evaluacion'], nivelEvidencia: 2, certeza: 'media',
            justificacion: 'tasaArrastre = ' + _arrastre + '% (>= 50%) en lecturaEvaluativaLongitudinal. Dato cuantitativo real del ciclo. Lectura organizacional: hipótesis de causa, no certeza diagnóstica.',
            habilitaRecomendacion: true, habilitaEPVSA: false,
            regla: 'fragilidad_arrastre_cronificado',
        });
    }

    // Fortaleza: red comunitaria activa → intersectorialidad operativa documentada
    if (_red === 'activa') {
        _v4_push(salida.fortalezas, {
            id: 'for_red_comunitaria_activa',
            tipo: 'fortaleza', categoria: 'activo_comunitario_institucional',
            texto: 'La red comunitaria de colaboración documentada está activa. El municipio registra intersectorialidad operativa con entidades colaboradoras y activos en ciclo.',
            fuentes: ['agenda_evaluacion'], nivelEvidencia: 2, certeza: 'media',
            justificacion: 'Clasificación lecturaEvaluativaLongitudinal.redComunitaria = activa. Entidades colaboradoras + activos detectados en ciclo.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'red_comunitaria_documentada_activa',
        });
    }

    // Hipótesis/limitación: trazabilidad no verificable → cautela metodológica
    if (_trazab === 'no_verificable') {
        _v4_push(salida.hipotesis, {
            id: 'hip_trazabilidad_insuficiente',
            tipo: 'hipotesis', categoria: 'limitacion_metodologica',
            texto: 'La trazabilidad de evidencias del ciclo es insuficiente. Las inferencias territoriales deben leerse con mayor cautela: el municipio no puede rendir cuentas verificables sobre los resultados del ciclo evaluado.',
            fuentes: ['agenda_evaluacion'], nivelEvidencia: 3, certeza: 'media',
            justificacion: 'Clasificación lecturaEvaluativaLongitudinal.trazabilidad = no_verificable. No es inferencia: es limitación metodológica del propio ciclo.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'limitacion_trazabilidad_ciclo',
        });
    }
}

// Patrón para detectar textos de capacidad analítica/metodológica que NO son fortalezas territoriales.
// Ej: "Se dispone de 6 determinantes", "la lectura incorpora X fuentes", etc.
const _V4_PATRON_NO_FORTALEZA_TERRITORIAL = /se\s+dispone\s+de\b|se\s+han\s+considerado\b|la\s+lectura\s+incorpora\b|el\s+an[aá]lisis\s+(se\s+encuadra|incorpora)\b|fuentes?\s+disponibles\b|\b\d+\s+(determinantes|fuentes|indicadores)\s+(eas|disponibles|considerados)/i;

function _v4_construirFortalezasVulnerabilidades(analisisBase, lt1, salida) {
    _v4_compactarTextos(analisisBase && analisisBase.fortalezas, 8).forEach((texto, i) => {
        // Textos metodológicos/de capacidad analítica no son fortalezas territoriales
        if (_V4_PATRON_NO_FORTALEZA_TERRITORIAL.test(texto)) return;
        _v4_push(salida.fortalezas, {
            id: `for_v3_${i + 1}`, tipo: 'fortaleza', categoria: 'salutogenica', texto,
            fuentes: salida.fuentes.disponibles.filter(f => f !== 'epvsa' && f !== 'estrategias_secundarias'),
            nivelEvidencia: 2, certeza: 'media',
            justificacion: 'Fortaleza del analisis vigente preservada como activo o capacidad potencial.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'lectura_salutogenica',
        });
    });
    _v4_compactarTextos(lt1 && lt1.activos, 10).forEach((texto, i) => _v4_push(salida.fortalezas, {
        id: `for_lt1_activo_${i + 1}`, tipo: 'fortaleza', categoria: 'activo_comunitario', texto,
        fuentes: ['lt1'], nivelEvidencia: 4, certeza: 'media',
        justificacion: 'Activo recuperado de LT1 como capacidad comunitaria a contrastar y movilizar.',
        habilitaRecomendacion: false, habilitaEPVSA: false,
        regla: 'activos_legacy_reintegrados',
    }));
    _v4_compactarTextos(analisisBase && analisisBase.oportunidades, 8).forEach((texto, i) => _v4_push(salida.vulnerabilidades, {
        id: `vul_oportunidad_v3_${i + 1}`, tipo: 'vulnerabilidad', categoria: 'area_mejora', texto,
        fuentes: salida.fuentes.disponibles.filter(f => f !== 'epvsa' && f !== 'estrategias_secundarias'),
        nivelEvidencia: 2, certeza: 'media',
        justificacion: 'Area de mejora reinterpretada como vulnerabilidad o brecha potencial, no como diagnostico cerrado.',
        habilitaRecomendacion: true, habilitaEPVSA: false,
        regla: 'deficit_con_cautela',
    }));
    _v4_compactarTextos(lt1 && lt1.vulnerabilidades, 8).forEach((texto, i) => _v4_push(salida.vulnerabilidades, {
        id: `vul_lt1_${i + 1}`, tipo: 'vulnerabilidad', categoria: 'lt1', texto,
        fuentes: ['lt1'], nivelEvidencia: 4, certeza: 'media-baja',
        justificacion: 'Vulnerabilidad heredada de LT1; requiere contraste con evidencia directa.',
        habilitaRecomendacion: false, habilitaEPVSA: false,
        regla: 'lt1_no_activa_sola',
    }));

    // Activos desde window.activosComunitarios (Localiza Salud)
    // REGLA EPISTEMOLÓGICA: activos registrados ≠ cobertura territorial.
    // Pocos activos ≠ baja capacidad comunitaria. No extrapolable.
    var _activosLS = (typeof window !== 'undefined' && Array.isArray(window.activosComunitarios))
        ? window.activosComunitarios : [];
    if (_activosLS.length > 0) {
        _v4_push(salida.fortalezas, {
            id: 'for_activos_ls_base',
            tipo: 'fortaleza', categoria: 'activo_comunitario_validado',
            texto: _activosLS.length + ' activo(s) comunitario(s) registrado(s) en Localiza Salud. Base parcial validada institucionalmente mediante participación ciudadana.',
            fuentes: ['LocalizaSalud'], nivelEvidencia: 3, certeza: 'media',
            justificacion: 'Los activos registrados representan recursos validados, no el conjunto total del municipio. Pocos activos ≠ baja capacidad comunitaria.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'activos_ls_base_parcial_no_extrapolable',
        });
        _activosLS.slice(0, 5).forEach(function(activo, i) {
            if (!activo.nombre) return;
            _v4_push(salida.fortalezas, {
                id: 'for_activo_ls_' + (i + 1),
                tipo: 'fortaleza', categoria: 'activo_comunitario_validado',
                texto: activo.nombre + (activo.descripcion ? ' \u2014 ' + String(activo.descripcion).slice(0, 80) : ''),
                fuentes: ['LocalizaSalud'], nivelEvidencia: 3, certeza: 'media',
                justificacion: 'Activo validado (Localiza Salud). Tipo: ' + (activo.tipo || 'puntual') + '. Sin inferencia de estructura comunitaria consolidada.',
                habilitaRecomendacion: false, habilitaEPVSA: false,
                regla: 'activo_ls_infraestructura_salutogenica_parcial',
            });
        });
    }
}

// Detecta recomendaciones generadas sobre áreas sin ningún indicador desfavorable.
// Ej: "Desarrollar acciones específicas en Consumo responsable (0 indicadores con tendencia desfavorable...)"
const _V4_PATRON_SIN_DESFAVORABLES = /\b0\s+indicadores?\s+(con\s+tendencia\s+)?desfavorabl/i;

function _v4_clasificarRecomendacion(rec, idx, textoBase, salida) {
    const texto = _v4_texto(rec);
    if (!texto) return;

    // Regla epistemológica: sin indicadores desfavorables → solo vigilancia, nunca acción específica.
    if (_V4_PATRON_SIN_DESFAVORABLES.test(texto)) {
        _v4_push(salida.recomendaciones.exploratorias, {
            id: `rec_vigilancia_${idx + 1}`,
            tipo: 'recomendacion',
            categoria: 'vigilancia_sin_senal',
            texto: texto.replace(/desarrollar\s+acciones\s+espec[ií]ficas\s+en\s+/i, 'Mantener vigilancia pasiva en '),
            fuentes: [],
            nivelEvidencia: 6,
            certeza: 'baja',
            justificacion: 'Sin indicadores desfavorables: no procede priorizar actuacion especifica. Se registra como vigilancia y posible revision futura.',
            habilitaRecomendacion: false,
            habilitaEPVSA: false,
            regla: 'sin_senal_no_hay_recomendacion',
        });
        return;
    }

    const estrategia = V4_ESTRATEGIAS_SECUNDARIAS.find(e => e.patron.test(texto));
    const tieneSoporteTerritorial = estrategia ? _v4_haySenalTerritorial(estrategia, textoBase) : true;
    const fuentesFuertes = salida.fuentes.disponibles.filter(f => ['indicadores_cmi', 'determinantes_eas', 'ibse', 'informe_salud', 'estudios_complementarios', 'participacion'].includes(f));
    const base = {
        id: `rec_v4_${idx + 1}`,
        tipo: 'recomendacion',
        categoria: 'territorial',
        texto,
        fuentes: fuentesFuertes,
        nivelEvidencia: fuentesFuertes.some(f => ['indicadores_cmi', 'determinantes_eas', 'ibse'].includes(f)) ? 1 : 4,
        certeza: fuentesFuertes.length >= 2 ? 'media' : 'media-baja',
        justificacion: 'Recomendacion del motor vigente reclasificada segun jerarquia de evidencia v4.',
        habilitaRecomendacion: true,
        habilitaEPVSA: false,
        regla: 'recomendacion_reclasificada',
    };

    if (estrategia && !tieneSoporteTerritorial) {
        _v4_push(salida.recomendaciones.exploratorias, {
            ...base,
            categoria: 'estrategia_secundaria_contextual',
            nivelEvidencia: 6,
            certeza: 'baja',
            justificacion: `${estrategia.label} no activa recomendacion por si sola; queda como contexto hasta que exista senal territorial previa.`,
            habilitaRecomendacion: false,
            habilitaEPVSA: false,
            regla: 'estrategia_secundaria_no_activadora',
        });
        return;
    }

    if (base.nivelEvidencia <= 3) _v4_push(salida.recomendaciones.territoriales, base);
    else _v4_push(salida.recomendaciones.exploratorias, { ...base, categoria: 'prudente_exploratoria', habilitaRecomendacion: false, regla: 'recomendacion_exploratoria' });
}

function _v4_construirRecomendaciones(contextoIA, analisisBase, lt1, salida) {
    const textoBase = _v4_textosBase(contextoIA, { ...analisisBase, recomendaciones: [] }, lt1);
    _v4_array(analisisBase && analisisBase.recomendaciones).forEach((rec, idx) => _v4_clasificarRecomendacion(rec, idx, textoBase, salida));

    _v4_push(salida.recomendaciones.estructuralesRELAS, {
        id: 'rec_mapeo_activos_relas_universal', tipo: 'recomendacion', categoria: 'estructural_relas',
        texto: 'Actualizar o iniciar el mapeo de activos comunitarios como infraestructura basica del Plan Local de Salud, adaptando su profundidad a las prioridades y a la capacidad municipal.',
        fuentes: ['relais', 'activos_comunitarios', 'epvsa'], nivelEvidencia: 5, certeza: 'estructural',
        justificacion: 'El mapeo de activos es condicion estructural RELAS para orientar, ejecutar y evaluar actuaciones; no depende de una senal tematica concreta.',
        habilitaRecomendacion: true, habilitaEPVSA: false,
        regla: 'activos_relas_universal',
    });

    _v4_compactarTextos(lt1 && lt1.orientaciones, 6).forEach((texto, i) => _v4_push(salida.recomendaciones.exploratorias, {
        id: `rec_lt1_orientacion_${i + 1}`, tipo: 'recomendacion', categoria: 'orientacion_comunitaria', texto,
        fuentes: ['lt1'], nivelEvidencia: 4, certeza: 'media-baja',
        justificacion: 'Orientacion LT1 recuperada como prudente; necesita contraste tecnico antes de planificar actuaciones.',
        habilitaRecomendacion: false, habilitaEPVSA: false,
        regla: 'orientacion_legacy_no_automatismo',
    }));
}

function _v4_construirPrioridades(analisisBase, salida) {
    _v4_array(analisisBase && analisisBase.propuestaEPVSA).forEach((p, idx) => {
        const texto = p && (p.justificacion || p.lineaNombre || p.lineaId || p.area || p.texto) || '';
        const fuentesSoporte = salida.fuentes.disponibles.filter(f => ['indicadores_cmi', 'determinantes_eas', 'ibse', 'informe_salud', 'estudios_complementarios', 'participacion'].includes(f));
        _v4_push(salida.prioridades, {
            id: `prio_epvsa_v3_${idx + 1}`, tipo: 'prioridad', categoria: 'epvsa_vigente', texto,
            fuentes: fuentesSoporte.concat(['epvsa']),
            nivelEvidencia: fuentesSoporte.length ? 3 : 5,
            certeza: fuentesSoporte.length >= 2 ? 'media' : 'baja',
            justificacion: 'Prioridad EPVSA de v3 preservada para compatibilidad; v4 solo evalua su soporte, no la sustituye.',
            habilitaRecomendacion: false,
            habilitaEPVSA: fuentesSoporte.length > 0,
            regla: fuentesSoporte.length > 0 ? 'epvsa_con_soporte_territorial' : 'epvsa_marco_no_evidencia',
        });
    });
}

function _v4_incertidumbre(salida) {
    const disponiblesFuertes = salida.fuentes.disponibles.filter(f => ['indicadores_cmi', 'determinantes_eas', 'ibse', 'informe_salud', 'estudios_complementarios', 'participacion'].includes(f));
    const vacios = salida.fuentes.inventario.filter(f => !f.disponible && f.nivelEvidencia <= 3).map(f => f.id);
    return {
        nivelGlobal: disponiblesFuertes.length >= 3 ? 'media' : disponiblesFuertes.length >= 1 ? 'media-alta' : 'alta',
        factores: [
            disponiblesFuertes.length < 2 ? 'Base territorial limitada: conviene no convertir inferencias en decisiones automaticas.' : 'Base territorial plural suficiente para lectura prudente.',
            salida.tensiones.length ? 'Hay tensiones que requieren deliberacion tecnica.' : 'No se han identificado tensiones explicitas con la informacion disponible.',
        ],
        vacios,
    };
}

// ── evidenciaMeta: jerarquía ponderada de fuentes para decisiones epistemológicas internas ──
// Pesos: N1 (indicadores/IBSE/determinantes) = 3 | N2 (informe/estudios) = 2
//        N3 (participacion/LT1) = 1 / 0.5 | N4 (narrativa) = 0
// API pública interna: puedeInferir(umbral?), puedeInferirFuerte(), clasificarFuente(id)
function _v4_construirEvidenciaMeta(fuentesObj) {
    const PESOS = {
        indicadores_cmi:          3,
        determinantes_eas:        3,
        ibse:                     3,
        informe_salud:            2,
        estudios_complementarios: 2,
        participacion:            1,
        lt1:                      0.5,
        epvsa:                    0,
        estrategias_secundarias:  0,
    };
    const disponibles = (fuentesObj && fuentesObj.disponibles) || [];
    const nivel1 = disponibles.filter(f => ['indicadores_cmi', 'determinantes_eas', 'ibse'].includes(f));
    const nivel2 = disponibles.filter(f => ['informe_salud', 'estudios_complementarios'].includes(f));
    const nivel3 = disponibles.filter(f => ['participacion', 'lt1'].includes(f));
    const nivel4 = []; // texto narrativo — no traza como fuente estructural
    const pesoTotal = disponibles.reduce((acc, f) => acc + (PESOS[f] || 0), 0);
    return {
        nivel1, nivel2, nivel3, nivel4, pesoTotal,
        // umbral por defecto = 2: necesita al menos una fuente N1 (3p) o dos N2 (4p) o N1+participacion (4p).
        // Un solo LT1 (0.5p) o solo participacion (1p) no alcanza el umbral → hipótesis.
        puedeInferir: function(umbral) {
            return pesoTotal >= (umbral !== undefined ? umbral : 2);
        },
        // inferencia fuerte: requiere al menos una fuente N1 o dos N2
        puedeInferirFuerte: function() {
            return nivel1.length > 0 || nivel2.length >= 2;
        },
        clasificarFuente: function(id) {
            if (['indicadores_cmi', 'determinantes_eas', 'ibse'].includes(id)) return 1;
            if (['informe_salud', 'estudios_complementarios'].includes(id)) return 2;
            if (['participacion', 'lt1'].includes(id)) return 3;
            return 4;
        },
    };
}

// ── FMC: Factor de Modulación Comunitaria ────────────────────────────────────
// Modulador interpretativo transversal. NO es fuente de evidencia ni altera inferencias.
// Solo añade etiqueta nivelLectura + advertencia a cada item ya construido.
// Fuentes: participacion en contexto, activos LT1, percepción ciudadana (IBSE/informe).
// Escala 0–1 por componente; total = media de tres componentes.
function _v4_construirFMC(contextoIA, lt1, salida) {
    // Componente participacion
    const partic = contextoIA && contextoIA.participacion;
    const nPartic = partic && (partic.nParticipantes || partic.totalParticipantes || 0);
    const vPartic = partic ? (nPartic > 0 ? 1 : 0.5) : 0;

    // Componente activos: LT1 o window.activosComunitarios (Localiza Salud) — el mayor
    // Pocos activos ≠ baja capacidad comunitaria; activos registrados = base parcial validada.
    var nActivosLT1 = (lt1 && !lt1.error) ? _v4_array(lt1.activos).length : 0;
    var nActivosLS  = (typeof window !== 'undefined' && Array.isArray(window.activosComunitarios))
        ? window.activosComunitarios.length : 0;
    const nActivos  = Math.max(nActivosLT1, nActivosLS);
    const vActivos  = nActivos >= 3 ? 1 : nActivos >= 1 ? 0.5 : 0;

    // Componente percepción ciudadana (IBSE como proxy, informe como señal parcial)
    const vPercepcion = salida.fuentes.disponibles.includes('ibse') ? 1
        : salida.fuentes.disponibles.includes('informe_salud') ? 0.5 : 0;

    const total = (vPartic + vActivos + vPercepcion) / 3;

    const modulaInferencia = function(item) {
        if (total < 0.3) {
            item.nivelLectura = 'tecnocratica';
            item.advertencia = 'baja sensibilidad comunitaria';
            item.validacionComunitaria = 'tecnocratica';
        } else if (total < 0.7) {
            item.nivelLectura = 'mixta';
            item.validacionComunitaria = 'mixta';
        } else {
            item.nivelLectura = 'comunitaria_enriquecida';
            item.enriquecidaPorFMC = true;
            item.validacionComunitaria = 'validada_comunitariamente';
        }
        return item;
    };

    return {
        participacion: vPartic,
        activos: vActivos,
        percepcion: vPercepcion,
        total,
        calcular: function() { return total; },
        modulaInferencia,
    };
}

// ── Señales estructurales: inequidad, vulnerabilidad y capacidad comunitaria ──
// Lee señales ya calculadas (alertasInequidad, perfilSFA, activosEnCiclo).
// No usa regex textual. No inventa causalidad. Solo combina clasificaciones estructuradas.
// Máximo: 3 tensiones + 2 fortalezas + 1 hipótesis.
function _v4_leerSeñalesEstructurales(contextoIA, analisisBase, salida, evidenciaMeta) {
    var _alertas    = (analisisBase && Array.isArray(analisisBase.alertasInequidad))
                      ? analisisBase.alertasInequidad : [];
    var _perfilSFA  = analisisBase && analisisBase.perfilSFA;
    var _d4Obj      = _perfilSFA && _perfilSFA.scorePorDimension && _perfilSFA.scorePorDimension['d4_inequidad'];
    var _d4Score    = (_d4Obj && typeof _d4Obj.score === 'number') ? _d4Obj.score : null;
    var _nDimsSFA   = (_perfilSFA && _perfilSFA.trazabilidad && typeof _perfilSFA.trazabilidad.nDimensionesDisponibles === 'number')
                      ? _perfilSFA.trazabilidad.nDimensionesDisponibles : null;

    // Obtener activosEnCiclo del snapshot (mismo patrón que _v4_leerGobernanzaLongitudinal)
    var _snap = null;
    if (typeof window !== 'undefined') {
        try {
            if (typeof window.COMPAS_obtenerSnapshotEvaluacionActual === 'function') {
                _snap = window.COMPAS_obtenerSnapshotEvaluacionActual();
            }
        } catch (e) { /* silencioso */ }
        if (!_snap) {
            _snap = window.COMPAS && window.COMPAS.state && window.COMPAS.state._ultimoSnapshot;
        }
    }
    // null = desconocido (sin snapshot); 0 = conocido, sin activos; >0 = activos presentes
    var _activosEnCiclo = (_snap && _snap.activosComunitariosEnCiclo &&
        typeof _snap.activosComunitariosEnCiclo.total === 'number')
        ? _snap.activosComunitariosEnCiclo.total : null;

    var _tieneInequidadSFA = _alertas.some(function(a) { return a && a.tipo === 'inequidad_sfa'; });
    var _tieneDetDesfav    = _alertas.some(function(a) { return a && a.tipo === 'determinantes_desfavorables'; });

    // ── TENSIONES (máx. 3) ────────────────────────────────────────────────────

    // T1: Convergencia de dos señales independientes de inequidad.
    // Condición doble: las dos alertas estructuradas deben coexistir, Y hay evidencia N1/N2.
    // No activa con una sola alerta.
    if (_tieneInequidadSFA && _tieneDetDesfav && evidenciaMeta.puedeInferirFuerte()) {
        _v4_push(salida.tensiones, {
            id: 'ten_inequidad_convergente',
            tipo: 'tension', categoria: 'vulnerabilidad_estructural',
            texto: 'Dos señales independientes de inequidad convergen en el territorio: score SFA elevado en la dimensión de desigualdad y alta proporción de determinantes sociales desfavorables. El perfil sugiere vulnerabilidad multidimensional que no puede abordarse con intervenciones temáticas únicas.',
            fuentes: ['indicadores_cmi', 'determinantes_eas'].filter(function(f) {
                return salida.fuentes.disponibles.includes(f);
            }),
            nivelEvidencia: 2, certeza: 'media-alta',
            justificacion: 'Convergencia de alertasInequidad tipo inequidad_sfa + determinantes_desfavorables. Señales cuantitativas independientes, no texto libre.',
            habilitaRecomendacion: true, habilitaEPVSA: false,
            regla: 'inequidad_convergente_multidimensional',
        });
    }

    // T2: Desigualdad sin activos comunitarios documentados.
    // Solo actúa si el snapshot confirma que activosEnCiclo es cero (null = no sabemos, no actúa).
    if (_alertas.length > 0 && _activosEnCiclo !== null && _activosEnCiclo === 0) {
        _v4_push(salida.tensiones, {
            id: 'ten_inequidad_sin_activos',
            tipo: 'tension', categoria: 'vulnerabilidad_sin_red',
            texto: 'Las señales de desigualdad territorial coexisten con ausencia de activos comunitarios documentados. La carga de necesidades no tiene aún una base de recursos comunitarios identificados que pueda contribuir a compensarla.',
            fuentes: ['agenda_evaluacion'].concat(
                ['indicadores_cmi', 'determinantes_eas'].filter(function(f) {
                    return salida.fuentes.disponibles.includes(f);
                })
            ),
            nivelEvidencia: 2, certeza: 'media',
            justificacion: 'alertasInequidad.length > 0 + activosComunitariosEnCiclo.total === 0 (confirmado en snapshot). Combinación estructurada.',
            habilitaRecomendacion: true, habilitaEPVSA: false,
            regla: 'inequidad_sin_red_comunitaria_documentada',
        });
    }

    // T3: Señal SFA de inequidad intensa (>0.5) — por encima del umbral de alerta estándar (0.4).
    // No duplica la alerta textual de v3. Añade tensión interpretativa para casos más graves.
    if (_d4Score !== null && _d4Score > 0.5) {
        _v4_push(salida.tensiones, {
            id: 'ten_inequidad_sfa_intensa',
            tipo: 'tension', categoria: 'desigualdad_persistente',
            texto: 'La dimensión SFA de inequidad registra un valor elevado (' + Math.round(_d4Score * 100) + '%). Las actuaciones deben contemplar explícitamente el gradiente social de riesgo y evitar intervenciones neutrales al contexto socioeconómico.',
            fuentes: ['indicadores_cmi', 'determinantes_eas'].filter(function(f) {
                return salida.fuentes.disponibles.includes(f);
            }),
            nivelEvidencia: 2, certeza: 'media',
            justificacion: 'SFA D4 score = ' + (_d4Score !== null ? _d4Score.toFixed(2) : '?') + ' (> 0.5). Valor cuantitativo estructurado.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'inequidad_sfa_intensa_gradiente_social',
        });
    }

    // ── FORTALEZAS (máx. 2) ───────────────────────────────────────────────────

    // F1: Activos documentados sin señales de inequidad.
    // Solo si el snapshot confirma activos > 0 Y no hay alertas de inequidad.
    if (_alertas.length === 0 && _activosEnCiclo !== null && _activosEnCiclo > 0) {
        _v4_push(salida.fortalezas, {
            id: 'for_capacidad_salutogenica_sin_carga',
            tipo: 'fortaleza', categoria: 'capacidad_salutogenica_territorial',
            texto: _activosEnCiclo + ' activo(s) comunitario(s) documentado(s) sin señales activas de inequidad estructural. Contexto propicio para intervenciones salutogénicas de mantenimiento y desarrollo de capacidades.',
            fuentes: ['agenda_evaluacion'],
            nivelEvidencia: 2, certeza: 'media',
            justificacion: 'activosComunitariosEnCiclo.total = ' + _activosEnCiclo + ' + alertasInequidad.length === 0. Combinación estructurada real.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'capacidad_salutogenica_sin_carga_inequidad',
        });
    }

    // F2: SFA D4 bajo (<0.25) con evidencia estructural — equidad territorial documentada.
    // Requiere puedeInferirFuerte: la afirmación de equidad necesita base cuantitativa sólida.
    if (_d4Score !== null && _d4Score < 0.25 && evidenciaMeta.puedeInferirFuerte()) {
        _v4_push(salida.fortalezas, {
            id: 'for_equidad_territorial_sfa',
            tipo: 'fortaleza', categoria: 'equidad_territorial',
            texto: 'El perfil SFA de inequidad es bajo (' + Math.round(_d4Score * 100) + '%). Los determinantes socioeconómicos no representan una carga dominante con la evidencia disponible. Contexto favorable para intervenciones universales.',
            fuentes: ['indicadores_cmi', 'determinantes_eas'].filter(function(f) {
                return salida.fuentes.disponibles.includes(f);
            }),
            nivelEvidencia: 2, certeza: 'media',
            justificacion: 'SFA D4 score = ' + (_d4Score !== null ? _d4Score.toFixed(2) : '?') + ' (< 0.25) con evidencia estructural N1/N2 confirmada.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'equidad_territorial_sfa_documentada',
        });
    }

    // ── HIPÓTESIS (máx. 1) ────────────────────────────────────────────────────

    // H1: Señal de inequidad con perfil SFA parcial — lectura limitada metodológicamente.
    // Solo si hay alertas de inequidad Y el perfil SFA tiene pocas dimensiones (<3).
    if (_alertas.length > 0 && _nDimsSFA !== null && _nDimsSFA < 3) {
        _v4_push(salida.hipotesis, {
            id: 'hip_inequidad_sfa_parcial',
            tipo: 'hipotesis', categoria: 'limitacion_metodologica',
            texto: 'Existen señales de inequidad pero el perfil SFA disponible es parcial (' + _nDimsSFA + '/8 dimensiones). La lectura de desigualdad puede ser incompleta. Conviene ampliar fuentes antes de priorizar intervenciones focalizadas.',
            fuentes: ['indicadores_cmi', 'determinantes_eas'].filter(function(f) {
                return salida.fuentes.disponibles.includes(f);
            }),
            nivelEvidencia: 3, certeza: 'media',
            justificacion: 'alertasInequidad presentes + nDimensionesDisponibles SFA = ' + _nDimsSFA + ' (< 3). Limitación metodológica real, no inferencia territorial.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'inequidad_con_sfa_parcial',
        });
    }
}

function _v4_construirSalida(contextoIA, analisisBase) {
    const lt1 = _v4_extraerLT1(analisisBase);
    const salida = {
        contrato: 'motor_sintesis_perfil_v4',
        version: V4_VERSION,
        modo: 'paralelo_no_sustitutivo',
        ambitoId: contextoIA && contextoIA.ambitoId || null,
        ambitoNombre: contextoIA && contextoIA.ambitoNombre || contextoIA && contextoIA.ambitoId || null,
        fechaGeneracion: new Date().toISOString(),
        fuentes: _v4_fuentes(contextoIA || {}, analisisBase || {}),
        observaciones: [],
        evidencia: { fuerte: [], secundaria: [], participativa: [], contextual: [], estrategica: [], estrategiasSecundarias: [] },
        inferencias: [],
        hipotesis: [],
        tensiones: [],
        fortalezas: [],
        vulnerabilidades: [],
        recomendaciones: { territoriales: [], exploratorias: [], estructuralesRELAS: [] },
        prioridades: [],
        incertidumbre: null,
        reglasEpistemologicas: V4_REGLAS_EPISTEMOLOGICAS.slice(),
        compatibilidad: {
            noSustituyeV3: true,
            noPersiste: true,
            propuestaEPVSA: _v4_array(analisisBase && analisisBase.propuestaEPVSA),
            seleccionEPVSA: typeof window !== 'undefined' ? (window.seleccionEPVSA || window.seleccionEPVSAActual || null) : null,
        },
        legacyReintegrado: {
            lt1: !!lt1 && !lt1.error,
            narrativaSalutogenica: true,
            activosComunitarios: true,
            orientacionComunitaria: !!lt1 && !lt1.error && _v4_array(lt1.orientaciones).length > 0,
        },
        auditoria: {
            lt1Error: lt1 && lt1.error ? lt1.error : null,
            estrategiasSecundariasNoActivadoras: V4_ESTRATEGIAS_SECUNDARIAS.map(e => e.id),
        },
    };

    _v4_construirObservaciones(contextoIA || {}, analisisBase || {}, lt1, salida);
    salida.evidencia.fuerte = salida.observaciones.filter(x => x.nivelEvidencia === 1);
    salida.evidencia.participativa = salida.observaciones.filter(x => x.fuentes.includes('participacion'));
    salida.evidencia.secundaria = salida.fuentes.inventario.filter(x => x.disponible && x.nivelEvidencia === 2);
    salida.evidencia.estrategica = [{ id: 'epvsa_2024_2030', tipo: 'marco_estrategico_principal', nivelEvidencia: 5, habilitaRecomendacion: false, habilitaEPVSA: false }];
    salida.evidencia.estrategiasSecundarias = V4_ESTRATEGIAS_SECUNDARIAS.map(e => ({ id: e.id, etiqueta: e.label, nivelEvidencia: 6, habilitaRecomendacion: false, habilitaEPVSA: false }));

    // evidenciaMeta: jerarquía ponderada para decisiones epistemológicas internas
    const evidenciaMeta = _v4_construirEvidenciaMeta(salida.fuentes);
    salida.evidenciaMeta = {
        nivel1: evidenciaMeta.nivel1,
        nivel2: evidenciaMeta.nivel2,
        nivel3: evidenciaMeta.nivel3,
        pesoTotal: evidenciaMeta.pesoTotal,
        puedeInferir: evidenciaMeta.puedeInferir,
        puedeInferirFuerte: evidenciaMeta.puedeInferirFuerte,
        clasificarFuente: evidenciaMeta.clasificarFuente,
    };

    _v4_construirLecturas(contextoIA || {}, analisisBase || {}, lt1, salida, evidenciaMeta);
    _v4_construirFortalezasVulnerabilidades(analisisBase || {}, lt1, salida);
    _v4_construirRecomendaciones(contextoIA || {}, analisisBase || {}, lt1, salida);
    _v4_construirPrioridades(analisisBase || {}, salida);
    // Señales estructurales: inequidad/vulnerabilidad/capacidad comunitaria basadas en datos reales.
    // Se ejecuta después de toda la construcción base para evitar duplicados y leer señales completas.
    _v4_leerSeñalesEstructurales(contextoIA || {}, analisisBase || {}, salida, evidenciaMeta);
    salida.incertidumbre = _v4_incertidumbre(salida);

    if (!salida.tensiones.length && salida.inferencias.length) {
        _v4_push(salida.hipotesis, {
            id: 'hipotesis_contraste_tecnico', tipo: 'hipotesis', categoria: 'contraste',
            texto: 'Las inferencias territoriales deben contrastarse en mesa tecnica y participativa antes de convertirse en agenda operativa.',
            fuentes: salida.fuentes.disponibles, nivelEvidencia: 4, certeza: 'prudente',
            justificacion: 'v4 evita que la lectura interpretativa actue como automatismo decisor.',
            habilitaRecomendacion: false, habilitaEPVSA: false,
            regla: 'hipotesis_no_decision',
        });
    }

    // FMC: aplicar modulación comunitaria sobre items ya construidos.
    // Solo añade nivelLectura / advertencia / enriquecidaPorFMC — no altera estructura ni lógica.
    const fmc = _v4_construirFMC(contextoIA || {}, lt1, salida);
    salida.fmc = {
        participacion: fmc.participacion,
        activos: fmc.activos,
        percepcion: fmc.percepcion,
        total: fmc.total,
        calcular: fmc.calcular,
        modulaInferencia: fmc.modulaInferencia,
    };
    salida.inferencias.forEach(item => fmc.modulaInferencia(item));
    salida.tensiones.forEach(item => fmc.modulaInferencia(item));
    salida.fortalezas.forEach(item => fmc.modulaInferencia(item));

    return salida;
}

export const motorSintesisPerfilV4 = Object.freeze({
    id: 'motor_sintesis_perfil_v4',
    version: V4_VERSION,
    descripcion: 'Capa interpretativa paralela para lectura territorial, jerarquia de evidencia e incertidumbre. No sustituye v3 ni persiste datos.',
    ejecutar(contextoIA, analisisBase = null) {
        return _v4_construirSalida(contextoIA, analisisBase);
    },
});
export const motorSintesisPerfil = crearMotor({
    id:          'motor_sintesis_perfil',
    version:     '3.0',
    descripcion: 'Síntesis del perfil de salud del territorio. ' +
                 'Ruta principal: cálculo modular desde CMI + determinantes + participación + SFA. ' +
                 'Fallback: motor salutogénico heredado (analizarDatosMunicipio). ' +
                 'No es decisor: produce propuestas para revisión técnica.',

    validarFn: validarContextoAnalitico,

    ejecutarFn(contextoIA) {
        // ── 1. Intentar ruta modular ───────────────────────────────────────
        const analisisModular = _calcularAnalisisModular(contextoIA);

        if (analisisModular && !analisisModular.sinDatos) {
            console.log('[motorSintesisPerfil v3.0] Ruta modular exitosa.',
                `CMI: ${contextoIA.cuadroMandos ? contextoIA.cuadroMandos.conDatos + '/50 ind.' : 'sin CMI'}`,
                `SFA: ${analisisModular.perfilSFA ? analisisModular.perfilSFA.trazabilidad.nDimensionesDisponibles + '/8 dims' : 'no calculado'}`
            );
            return _normalizarAnalisis(analisisModular, contextoIA);
        }

        // ── 2. Fallback: motor heredado ────────────────────────────────────
        console.warn('[motorSintesisPerfil v3.0] Ruta modular sin datos suficientes. Fallback a motor heredado.',
            analisisModular && analisisModular.razon);

        const analisisHeredado = _llamarMotorHeredado(contextoIA);

        if (!analisisHeredado) {
            return { sinDatos: true, mensaje: 'Sin datos suficientes para el análisis (ruta modular y heredada).' };
        }

        return _normalizarAnalisis(analisisHeredado, contextoIA);
    },

    calcularConfianzaFn: _calcularConfianza,
});

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN BRIDGE: SALIDA MODULAR → window.analisisActual
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforma la SalidaMotor normalizada al formato plano que espera
 * window.analisisActual y la UI heredada.
 *
 * La UI heredada (_adaptarAnalisisAFormatoUI) lee:
 *   analisis.conclusiones[]    → necesita { id, texto }
 *   analisis.recomendaciones[] → necesita { id, texto } | { area, texto }
 *   analisis.propuestaEPVSA[]  → necesita { lineaId, justificacion, relevancia }
 *   analisis.priorizacion[]    → necesita ser array
 *   analisis.fuentes{}         → mapa de disponibilidad de fuentes
 *
 * Añade campos de trazabilidad (_motorId, _trazabilidadId, etc.) para
 * que el código modular pueda identificar el origen del análisis.
 *
 * @param {Readonly<object>} salidaMotor  - SalidaMotor de motorBase.crearMotor()
 * @param {Readonly<object>} contextoIA   - ContextoIA usado en la ejecución
 * @returns {object|null}  Objeto plano compatible con window.analisisActual
 */
export function adaptarSalidaMotorAAnalisisActual(salidaMotor, contextoIA) {
    if (!salidaMotor || salidaMotor.sinDatos || !salidaMotor.datos) return null;

    const datos = salidaMotor.datos;
    const analisis = datos.analisis;   // objeto plano (modular o heredado)

    if (!analisis || analisis.sinDatos) return null;

    // Añadir metadatos de trazabilidad al objeto plano
    // sin romper la compatibilidad (campos prefijados con _)
    return {
        ...analisis,
        _motorId:           salidaMotor.motorId,
        _motorVersion:      salidaMotor.motorVersion,
        _trazabilidadId:    salidaMotor.trazabilidadId,
        _gradoConfianza:    salidaMotor.gradoConfianza,
        _gradoLabel:        salidaMotor.gradoConfianzaLabel,
        _estadoRevision:    salidaMotor.estadoRevisionHumana,
        _fechaGeneracion:   salidaMotor.fechaGeneracion,
        _fuentesUsadas:     salidaMotor.fuentesUsadas,
        _origenCalculo:     analisis.origenCalculo || 'motor_heredado',

        // Referencias EAS 2023 disponibles para motores/lecturas posteriores.
        // No calcula ni persiste datos locales; solo expone Andalucía/Granada ya cargadas en runtime.
        eas: (typeof window !== 'undefined' && window.referenciasEAS)
            ? window.referenciasEAS
            : {},
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// BRIDGE DE COMPATIBILIDAD (herencia de iteración 8)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea una SalidaMotor desde window.analisisActual ya existente.
 * Útil cuando el análisis ya fue ejecutado por el monolito.
 * estadoRevisionHumana: REVISADO (el monolito ya lo aplicó).
 *
 * @param {string} ambitoId
 * @returns {Promise<Readonly<object>|null>}
 */
export async function salidaDesdeAnalisisHeredado(ambitoId) {
    const analisisHeredado = window.analisisActual;
    if (!analisisHeredado || !ambitoId) return null;

    const { crearContextoIA } = await import('../contextoIA.js');
    const ctx = crearContextoIA({ ambitoId, fuentes: analisisHeredado.fuentes || {} });

    const { crearRegistroTrazabilidad, registrarEjecucion } = await import('../trazabilidadIA.js');
    const { normalizarSalidaMotor } = await import('../motorBase.js');

    const normalizado = _normalizarAnalisis(analisisHeredado, ctx);
    const confianza   = _calcularConfianza(normalizado, ctx);

    const traza = crearRegistroTrazabilidad({
        motorId:       'motor_sintesis_perfil',
        motorVersion:  '3.0',
        ambitoId,
        fuentesUsadas: Object.entries(analisisHeredado.fuentes || {})
            .filter(([, v]) => v).map(([k]) => k),
        gradoConfianza: confianza,
        duracionMs:    0,
        heredado:      true,
        resumenEntrada: { ambitoId, fuentes: analisisHeredado.fuentes },
        resumenSalida:  {
            nAreas: (normalizado.priorizacion || {}).nAreas || 0,
            nConclusiones: (normalizado.conclusiones || {}).nTotal || 0,
        },
    });
    registrarEjecucion(traza);

    return Object.freeze({
        ...normalizarSalidaMotor({ datos: normalizado }, traza),
        estadoRevisionHumana: ESTADOS_REVISION.REVISADO,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// SÍNTESIS TERRITORIAL INTERPRETATIVA (v1) + BRIDGE V4 → UI
// ─────────────────────────────────────────────────────────────────────────────
// Dos capas coordinadas activan en el hook COMPAS_postprocesarConclusionesRecomendaciones:
//
//   1. _v4_construirSintesisTerritorial: construye 2 párrafos institucionales compactos
//      a partir de señales clasificadas (sin regex sobre texto libre, sin causalidades
//      inventadas, sin relleno si los datos son pobres). Alimenta analisis._sintesisTerritorial
//      que _adaptarAnalisisAFormatoUI (index.html) expone como resultado.narrativa,
//      activando el modo científico del renderizador (paneles azul + gris).
//
//   2. Bridge de señales V4 → conclusiones: fallback cuando la síntesis no activa o
//      como reserva en _analisisCompleto. Las señales estructurales e institucionales
//      se inyectan al frente de analisis.conclusiones con deduplicación estricta.
//
// Categorías estructurales (tensiones): vulnerabilidad_estructural, vulnerabilidad_sin_red,
//   desigualdad_persistente, fragilidad_institucional, ejecucion_insuficiente.
// Categorías institucionales (fortalezas): gobernanza_institucional,
//   activo_comunitario_institucional, capacidad_salutogenica_territorial, equidad_territorial.
// Excluidas: salutogenica, area_mejora, lt1, activo_comunitario (texto V3 reempaquetado).
// ─────────────────────────────────────────────────────────────────────────────
var _V4_CAT_TENSION_ESTRUCTURAL = {
    vulnerabilidad_estructural:   true,
    vulnerabilidad_sin_red:       true,
    desigualdad_persistente:      true,
    fragilidad_institucional:     true,
    ejecucion_insuficiente:       true
};
var _V4_CAT_FORTALEZA_INSTITUCIONAL = {
    gobernanza_institucional:           true,
    activo_comunitario_institucional:   true,
    capacidad_salutogenica_territorial: true,
    equidad_territorial:                true
};

// Etiquetas legibles por categoría (para texto de síntesis — NO regex sobre texto libre)
var _V4_DESC_CAT_TENS = {
    vulnerabilidad_estructural:   'vulnerabilidad estructural multidimensional',
    vulnerabilidad_sin_red:       'desigualdad sin base comunitaria documentada',
    desigualdad_persistente:      'gradiente de desigualdad persistente',
    fragilidad_institucional:     'fragilidad en la ejecución del ciclo',
    ejecucion_insuficiente:       'capacidad de ejecución institucional limitada'
};
var _V4_DESC_CAT_FORT = {
    gobernanza_institucional:           'capacidad de ejecución institucional documentada',
    activo_comunitario_institucional:   'red comunitaria con actividad registrada',
    equidad_territorial:                'perfil de equidad territorial favorable',
    capacidad_salutogenica_territorial: 'capacidad salutogénica sin carga estructural de inequidad'
};

// ─────────────────────────────────────────────────────────────────────────────
// _v4_construirSintesisTerritorial(v4, analisis)
// ─────────────────────────────────────────────────────────────────────────────
// Construye 2 párrafos institucionales compactos desde señales clasificadas.
// Párrafo 1 (contexto): calidad de evidencia + patrón de señales + nota de gobernanza.
// Párrafo 2 (sintesis): cualificador prudencial + conclusión interpretativa.
// Retorna { narrativa: { contexto, sintesis } } | null.
// ─────────────────────────────────────────────────────────────────────────────
function _v4_construirSintesisTerritorial(v4, analisis) {
    if (!v4 || !v4.incertidumbre || !v4.fuentes) return null;

    // ── Lecturas estructuradas de entrada ────────────────────────────────────
    var _em   = v4.evidenciaMeta || {};
    var _inc  = v4.incertidumbre;
    var _disp = (v4.fuentes && Array.isArray(v4.fuentes.disponibles)) ? v4.fuentes.disponibles : [];
    var _peso = typeof _em.pesoTotal === 'number' ? _em.pesoTotal : 0;
    var _nN1  = Array.isArray(_em.nivel1) ? _em.nivel1.length : 0;
    var _nN2  = Array.isArray(_em.nivel2) ? _em.nivel2.length : 0;

    var _tieneCMI = _disp.indexOf('indicadores_cmi')   >= 0;
    var _tieneDET = _disp.indexOf('determinantes_eas') >= 0;
    var _tieneISS = _disp.indexOf('informe_salud')     >= 0;
    var _tienePAR = _disp.indexOf('participacion')     >= 0;

    // Filtrar tensiones estructurales y fortalezas institucionales
    var _tens = Array.isArray(v4.tensiones) ? v4.tensiones : [];
    var _tensEstr = [];
    for (var _i = 0; _i < _tens.length; _i++) {
        if (_tens[_i] && _V4_CAT_TENSION_ESTRUCTURAL[_tens[_i].categoria]) _tensEstr.push(_tens[_i]);
    }
    var _forts = Array.isArray(v4.fortalezas) ? v4.fortalezas : [];
    var _fortInst = [];
    for (var _j = 0; _j < _forts.length; _j++) {
        if (_forts[_j] && _V4_CAT_FORTALEZA_INSTITUCIONAL[_forts[_j].categoria]) _fortInst.push(_forts[_j]);
    }
    var _hips       = Array.isArray(v4.hipotesis) ? v4.hipotesis : [];
    var _nTens      = _tensEstr.length;
    var _nFort      = _fortInst.length;
    var _nHips      = _hips.length;
    var _nInequidad = (analisis && Array.isArray(analisis.alertasInequidad)) ? analisis.alertasInequidad.length : 0;

    // ── Gobernanza longitudinal desde snapshot ────────────────────────────────
    var _snap = null;
    if (typeof window !== 'undefined') {
        try {
            if (typeof window.COMPAS_obtenerSnapshotEvaluacionActual === 'function') {
                _snap = window.COMPAS_obtenerSnapshotEvaluacionActual();
            }
        } catch (e) { /* silencioso */ }
        if (!_snap) _snap = window.COMPAS && window.COMPAS.state && window.COMPAS.state._ultimoSnapshot;
    }
    var _lel    = _snap && _snap.lecturaEvaluativaLongitudinal;
    var _clases = _lel && _lel.clasificaciones;
    var _govEj  = _clases && _clases.ejecucion && _clases.ejecucion.estado;
    var _govArr = (_clases && _clases.ejecucion && typeof _clases.ejecucion.tasaArrastre === 'number')
                  ? _clases.ejecucion.tasaArrastre : null;
    var _govRed    = _clases && _clases.redComunitaria && _clases.redComunitaria.estado;
    var _govTrazab = _clases && _clases.trazabilidad && _clases.trazabilidad.estado;

    // ── PÁRRAFO 1: apertura de evidencia + patrón de señales + gobernanza ─────
    var _p1 = [];

    // 1a. Apertura según calidad de evidencia (basada en pesoTotal y niveles)
    var _menc = [];
    if (_tieneCMI) _menc.push('indicadores CMI');
    if (_tieneDET) _menc.push('determinantes estructurales');
    if (_tieneISS) _menc.push('informe de situación de salud');
    if (_tienePAR) _menc.push('priorización ciudadana');
    var _mencStr = _menc.length ? ' (' + _menc.join(', ') + ')' : '';

    var _apert;
    if (_peso >= 6 && _nN1 >= 2) {
        _apert = 'El análisis territorial se apoya en base múltiple de fuentes cuantitativas' + _mencStr + '.';
    } else if (_peso >= 3 && _nN1 >= 1) {
        _apert = 'El análisis dispone de fuentes cuantitativas directas' + _mencStr + '.';
    } else if (_peso >= 2 && _nN2 >= 1) {
        _apert = 'El análisis se construye principalmente sobre evidencia secundaria' + _mencStr + ', sin indicadores municipales directos.';
    } else if (_peso >= 1) {
        _apert = 'La base de información disponible es limitada' + (_menc.length ? _mencStr : '') + '; la lectura que sigue tiene carácter provisional.';
    } else {
        // Caso extremo: sin información suficiente → síntesis mínima de advertencia
        return {
            narrativa: {
                contexto: 'La información disponible es insuficiente para una lectura territorial consolidada.',
                sintesis: 'Se recomienda priorizar la obtención de fuentes cuantitativas directas (indicadores CMI, determinantes EAS, informe de situación de salud) antes de comprometer líneas de actuación.'
            }
        };
    }
    _p1.push(_apert);

    // 1b. Patrón dominante de señales (por prioridad de categoría, no por texto)
    var _PRIO_TENS = ['vulnerabilidad_estructural', 'vulnerabilidad_sin_red', 'desigualdad_persistente', 'fragilidad_institucional', 'ejecucion_insuficiente'];
    var _catTensDom = null;
    var _pi, _ti;
    for (_pi = 0; _pi < _PRIO_TENS.length && !_catTensDom; _pi++) {
        for (_ti = 0; _ti < _tensEstr.length; _ti++) {
            if (_tensEstr[_ti].categoria === _PRIO_TENS[_pi]) { _catTensDom = _PRIO_TENS[_pi]; break; }
        }
    }
    var _PRIO_FORT = ['gobernanza_institucional', 'activo_comunitario_institucional', 'equidad_territorial', 'capacidad_salutogenica_territorial'];
    var _catFortDom = null;
    var _pfi, _fi;
    for (_pfi = 0; _pfi < _PRIO_FORT.length && !_catFortDom; _pfi++) {
        for (_fi = 0; _fi < _fortInst.length; _fi++) {
            if (_fortInst[_fi].categoria === _PRIO_FORT[_pfi]) { _catFortDom = _PRIO_FORT[_pfi]; break; }
        }
    }

    var _fraSen;
    if (_nTens > 0 && _nFort === 0) {
        _fraSen = 'Las señales dominantes son de tensión estructural' +
                  (_catTensDom ? ' (' + (_V4_DESC_CAT_TENS[_catTensDom] || _catTensDom) + ')' : '') +
                  (_nTens > 1 ? '; se identifican ' + _nTens + ' tensiones concurrentes' : '') + '.';
    } else if (_nFort > 0 && _nTens === 0) {
        _fraSen = 'Las señales dominantes indican capacidad institucional' +
                  (_catFortDom ? ' (' + (_V4_DESC_CAT_FORT[_catFortDom] || _catFortDom) + ')' : '') + '.';
    } else if (_nTens > 0 && _nFort > 0) {
        _fraSen = 'El perfil es mixto: ' +
                  _nTens + ' tensión' + (_nTens > 1 ? 'es' : '') + ' estructural' + (_nTens > 1 ? 'es' : '') +
                  ' coexist' + (_nTens > 1 ? 'en' : 'e') + ' con ' +
                  _nFort + ' fortaleza' + (_nFort > 1 ? 's' : '') + ' institucional' + (_nFort > 1 ? 'es' : '') + '.';
    } else if (_nInequidad > 0) {
        _fraSen = 'Se detectan ' + _nInequidad + ' alerta' + (_nInequidad > 1 ? 's' : '') +
                  ' de inequidad que no alcanzan umbral de tensión estructural confirmada con la evidencia disponible.';
    } else {
        _fraSen = 'No emergen señales estructurales dominantes con la información disponible.';
    }
    _p1.push(_fraSen);

    // 1c. Nota de gobernanza longitudinal (solo si el snapshot está disponible)
    if (_govEj) {
        var _fraGov = '';
        if (_govEj === 'solida') {
            _fraGov = 'La ejecución del ciclo evaluado muestra solidez institucional';
            if (_govRed === 'activa') _fraGov += ' y la red comunitaria está activa';
            _fraGov += '. Esta capacidad de cierre es un activo institucional que conviene sostener y no sobrecargar con compromisos que excedan la red actual.';
        } else if (_govEj === 'baja') {
            // [2026-05-17] Hipótesis organizacional: distinguir causas posibles de baja ejecución
            // en lugar de describir el dato administrativamente.
            _fraGov = 'El ciclo muestra una tasa de finalización baja' +
                      (_govArr !== null && _govArr >= 50 ? ' (' + Math.round(_govArr) + '% de arrastre)' : '') +
                      '. Este patrón puede reflejar complejidad estructural de las acciones comprometidas, sobrecarga de la capacidad operativa disponible, o una red de implementación que aún no ha alcanzado madurez suficiente. Ampliar la agenda antes de resolver estas condiciones puede agravar el patrón.';
        } else if (_govEj === 'parcial') {
            // [2026-05-17] Distinguir arrastre significativo de moderado; introducir hipótesis
            // sobre condicionantes de la capacidad de cierre (densidad de agenda, dependencias).
            var _nivelArr = (_govArr !== null && _govArr > 35) ? 'significativo' : 'moderado';
            _fraGov = 'La ejecución del ciclo es parcial' +
                      (_govArr !== null && _govArr > 25 ? ' (' + Math.round(_govArr) + '% de arrastre, nivel ' + _nivelArr + ')' : '') +
                      '. La capacidad de cierre puede estar condicionada por la densidad de la agenda o por dependencias externas no aseguradas; conviene identificar cuáles actuaciones arrastradas son recuperables y cuáles requieren reformulación.';
        }
        if (_govTrazab === 'no_verificable') {
            _fraGov += (_fraGov ? ' ' : '') + 'La trazabilidad de evidencias del ciclo no es verificable, lo que limita la rendición de cuentas.';
        }
        if (_fraGov) _p1.push(_fraGov);
    }

    var _contexto = _p1.join(' ');

    // ── PÁRRAFO 2: cualificador prudencial + conclusión interpretativa ─────────
    var _p2 = [];
    var _nivelInc = _inc.nivelGlobal || 'alta';

    var _cualif;
    if (_nivelInc === 'alta') {
        _cualif = 'La densidad de evidencia es insuficiente para conclusiones consolidadas; las inferencias tienen carácter orientativo y requieren contraste técnico y participativo antes de traducirse en agenda operativa.';
    } else if (_nivelInc === 'media-alta') {
        _cualif = 'La lectura tiene carácter tentativo; la evidencia disponible permite orientar deliberación, pero no automatizar decisiones sin contraste previo.';
    } else {
        _cualif = 'La lectura es prudente e informada por evidencia estructurada; puede orientar deliberación técnica sin constituir por sí misma una decisión operativa.';
    }
    _p2.push(_cualif);

    // Conclusión interpretativa — adaptada al patrón de señales, calidad de evidencia y gobernanza.
    // [2026-05-17] Reescrita para eliminar universalidad genérica e introducir la dimensión
    // organizacional: la sostenibilidad del ciclo como condición de viabilidad, la madurez de
    // la red como variable, la cautela sobre ampliar compromisos sin resolver primero la capacidad.
    var _concl;
    var _hayArrastreAlto = (_govArr !== null && _govArr >= 50);
    var _hayEjecucionBaja = (_govEj === 'baja' || _govEj === 'parcial');
    if (_peso < 2) {
        _concl = 'La base de información es insuficiente para priorizar actuaciones con fundamento: completar las fuentes de evidencia directa es la primera acción metodológicamente justificada.';
    } else if (_nTens >= 2 && _nInequidad > 0) {
        _concl = _hayEjecucionBaja
            ? 'El territorio concentra tensiones estructurales y señales de inequidad, pero la capacidad de implementación del ciclo muestra limitaciones. Responder a necesidades complejas con una capacidad operativa debilitada puede reproducir el ciclo de arrastre: antes de ampliar compromisos, conviene evaluar qué red de implementación existe realmente.'
            : 'El perfil combina tensiones estructurales y señales de inequidad; la respuesta requiere sostenibilidad organizacional, no solo amplitud temática. Un abordaje integral que no asegure la capacidad de cierre del ciclo tiende a producir más arrastre, no más impacto.';
    } else if (_nTens > 0 && _nFort === 0) {
        _concl = _hayArrastreAlto
            ? 'El perfil muestra vulnerabilidades estructurales en un contexto de capacidad de ejecución limitada. Comprometer nuevas actuaciones sin resolver primero las condiciones de implementación puede agravar la brecha entre planificación y resultado real.'
            : 'El perfil identifica vulnerabilidades que merecen atención prioritaria. Antes de ampliar el alcance del ciclo, conviene verificar que la red de implementación disponible puede sostener las acciones comprometidas.';
    } else if (_nFort > 0 && _nTens === 0 && _peso >= 3) {
        _concl = 'El territorio muestra condiciones institucionales favorables. Esta capacidad es un activo que conviene sostener con continuidad, sin sobrecargar la agenda más allá de lo que la red puede implementar de forma efectiva.';
    } else if (_nTens > 0 && _nFort > 0) {
        _concl = 'El perfil es mixto: las capacidades institucionales identificadas pueden actuar como palanca para abordar las tensiones estructurales, pero solo si la planificación garantiza sostenibilidad operativa. Consolidar lo existente antes de ampliar puede ser más eficaz que diversificar la agenda.';
    } else if (_nHips > 0) {
        _concl = 'Las limitaciones metodológicas identificadas condicionan el alcance de la lectura. Invertir en mejorar la base de información —incluyendo fuentes participativas y evaluación local— es una condición previa para una planificación bien fundamentada.';
    } else {
        _concl = 'Con la información disponible no emerge un patrón territorial dominante. El análisis puede orientar vigilancia activa; no justifica priorización específica sin evidencia adicional.';
    }
    _p2.push(_concl);

    return {
        narrativa: {
            contexto: _contexto,
            sintesis: _p2.join(' ')
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: COMPAS_postprocesarConclusionesRecomendaciones
// ─────────────────────────────────────────────────────────────────────────────
// Llamado desde index.html línea 55377:
//   analisis = COMPAS_postprocesarConclusionesRecomendaciones(analisis) || analisis;
// Ejecuta las dos capas en orden:
//   1. Síntesis territorial → analisis._sintesisTerritorial (expuesta por _adaptarAnalisisAFormatoUI)
//   2. Bridge V4 señales → analisis.conclusiones (fallback si síntesis no activa en UI)
// No toca propuestaEPVSA, recomendaciones, Firebase, snapshots, compilador.
// ─────────────────────────────────────────────────────────────────────────────
function COMPAS_construirSintesisInstitucionalBloque07(analisis, analisisV4) {
    if (!analisis || !analisisV4) return analisis;

    function _arr(v) { return Array.isArray(v) ? v : []; }
    function _texto(o) { return String((o && (o.texto || o.titulo || o.orientacion || o.linea_accion_municipal || o.linea_accion)) || ''); }
    function _esVigilancia(o) {
        var t = _texto(o).toLowerCase();
        return /mantener\s+vigilancia\s+pasiva|sin\s+indicadores\s+desfavorables|no\s+procede\s+comprometer\s+actuaci[oó]n\s+espec/i.test(t);
    }
    function _dedup(lista) {
        var vistos = {};
        return _arr(lista).filter(function(item) {
            var clave = _texto(item).replace(/\s+/g, ' ').trim().toLowerCase();
            if (!clave || vistos[clave]) return false;
            vistos[clave] = true;
            return true;
        });
    }
    function _rec(item, idx, grupo) {
        if (!item || !_texto(item)) return null;
        return {
            id: item.id || ('rec_inst_' + grupo + '_' + (idx + 1)),
            titulo: item.categoria || item.tipo || grupo,
            area: item.area || item.categoria || grupo,
            texto: _texto(item),
            fuentes: _arr(item.fuentes),
            certeza: item.certeza || null,
            nivelEvidencia: item.nivelEvidencia || null,
            justificacion: item.justificacion || null,
            origen: 'bridge_v4_bloque07',
            grupo: grupo
        };
    }

    var rc = Object.assign({}, analisis.renderCientifico || {});
    var sint = analisis._sintesisTerritorial || {};
    var narrativaBase = rc.narrativa || analisis.narrativa || {};
    var narrativaSint = sint.narrativa || {};
    rc.narrativa = Object.assign({}, narrativaBase, {
        contexto: narrativaSint.contexto || narrativaBase.contexto || null,
        sintesis: narrativaSint.sintesis || narrativaBase.sintesis || null
    });

    var recV4 = analisisV4.recomendaciones || {};
    var territorialesRaw = _arr(recV4.territoriales).map(function(r, i) { return _rec(r, i, 'territorial'); }).filter(Boolean);
    var exploratoriasRaw = _arr(recV4.exploratorias).map(function(r, i) { return _rec(r, i, 'exploratoria'); }).filter(Boolean);
    var estructuralesRaw = _arr(recV4.estructuralesRELAS).map(function(r, i) { return _rec(r, i, 'estructural_relas'); }).filter(Boolean);
    var territoriales = territorialesRaw.filter(function(r) { return !_esVigilancia(r); });
    var exploratorias = exploratoriasRaw.filter(function(r) { return !_esVigilancia(r); });
    var estructurales = estructuralesRaw.filter(function(r) { return !_esVigilancia(r); });

    var tensionesInst = _arr(analisisV4.tensiones).filter(function(t) {
        return t && t.texto && t.habilitaRecomendacion !== false &&
            (_V4_CAT_TENSION_ESTRUCTURAL[t.categoria] || /gobernanza|institucional|arrastre|ejecuci[oó]n|desigualdad|activos|red/i.test(String(t.categoria || '') + ' ' + t.texto));
    }).slice(0, 3).map(function(t, i) { return _rec(t, i, 'orientacion_institucional'); }).filter(Boolean);

    var fortalezasInst = _arr(analisisV4.fortalezas).filter(function(f) {
        return f && f.texto && _V4_CAT_FORTALEZA_INSTITUCIONAL[f.categoria];
    }).slice(0, 3).map(function(f, i) { return _rec(f, i, 'capacidad_institucional'); }).filter(Boolean);

    var recomendacionesOriginales = _arr(analisis.recomendaciones);
    var vigilancias = recomendacionesOriginales.concat(territorialesRaw, exploratoriasRaw, estructuralesRaw).filter(_esVigilancia).map(function(r, i) {
        return Object.assign({}, r, {
            id: r.id || ('vig_no_prioritaria_' + (i + 1)),
            origen: r.origen || 'motor_base_reclasificado_bloque07',
            categoria: r.categoria || 'vigilancia_no_prioritaria'
        });
    });
    var recomendacionesNoVigilancia = recomendacionesOriginales.filter(function(r) { return !_esVigilancia(r); });
    var institucionales = _dedup(tensionesInst.concat(territoriales, estructurales, fortalezasInst));

    rc.recomendacionesInstitucionales = institucionales;
    rc.recomendacionesExploratorias = exploratorias;
    rc.recomendacionesEstructuralesRELAS = estructurales;
    rc.vigilanciasNoPrioritarias = vigilancias;
    rc._contratoBloque07 = 'sintesis_institucional_bloque07_v1';
    rc._fuenteBloque07 = 'analisisActualV4_bridge_semantico';

    if (vigilancias.length && institucionales.length) {
        analisis.recomendaciones = _dedup(recomendacionesNoVigilancia.concat(institucionales));
    }

    analisis.renderCientifico = rc;
    return analisis;
}

window.COMPAS_postprocesarConclusionesRecomendaciones = function(analisis) {
    if (typeof window === 'undefined') return analisis;
    var _v4 = window.analisisActualV4;
    if (!_v4) return analisis;
    if (!analisis || !Array.isArray(analisis.conclusiones)) return analisis;

    // ── Capa 1: síntesis territorial interpretativa ───────────────────────────
    var _sint = _v4_construirSintesisTerritorial(_v4, analisis);
    if (_sint) {
        analisis._sintesisTerritorial = _sint;
        console.log('[COMPAS síntesis territorial] Generada. Contexto (' +
            (_sint.narrativa && _sint.narrativa.contexto ? _sint.narrativa.contexto.length : 0) + ' chars), ' +
            'Síntesis (' + (_sint.narrativa && _sint.narrativa.sintesis ? _sint.narrativa.sintesis.length : 0) + ' chars).');
    }

    // ── Capa 2: señales V4 estructurales → conclusiones (bridge fallback) ─────
    var _ids = {};
    for (var _i = 0; _i < analisis.conclusiones.length; _i++) {
        var _c = analisis.conclusiones[_i];
        if (_c && _c.id) _ids[_c.id] = true;
    }
    var _nuevas = [];

    var _tensArr = Array.isArray(_v4.tensiones) ? _v4.tensiones : [];
    for (var _j = 0; _j < _tensArr.length; _j++) {
        var _t = _tensArr[_j];
        if (!_t || !_t.id || !_t.texto) continue;
        if (!_V4_CAT_TENSION_ESTRUCTURAL[_t.categoria]) continue;
        if (_ids[_t.id]) continue;
        _nuevas.push({ id: _t.id, texto: _t.texto });
        _ids[_t.id] = true;
    }
    var _hipsArr = Array.isArray(_v4.hipotesis) ? _v4.hipotesis : [];
    for (var _k = 0; _k < _hipsArr.length; _k++) {
        var _h = _hipsArr[_k];
        if (!_h || !_h.id || !_h.texto) continue;
        if (_ids[_h.id]) continue;
        _nuevas.push({ id: _h.id, texto: _h.texto });
        _ids[_h.id] = true;
    }
    var _fortsArr = Array.isArray(_v4.fortalezas) ? _v4.fortalezas : [];
    for (var _l = 0; _l < _fortsArr.length; _l++) {
        var _f = _fortsArr[_l];
        if (!_f || !_f.id || !_f.texto) continue;
        if (!_V4_CAT_FORTALEZA_INSTITUCIONAL[_f.categoria]) continue;
        if (_ids[_f.id]) continue;
        _nuevas.push({ id: _f.id, texto: _f.texto });
        _ids[_f.id] = true;
    }
    if (_nuevas.length > 0) {
        for (var _m = _nuevas.length - 1; _m >= 0; _m--) {
            analisis.conclusiones.unshift(_nuevas[_m]);
        }
        console.log('[COMPAS V4→UI bridge] ' + _nuevas.length + ' señal(es) estructural(es) en conclusiones:', _nuevas.map(function(n) { return n.id; }));
    }

    analisis = COMPAS_construirSintesisInstitucionalBloque07(analisis, _v4) || analisis;

    return analisis;
};
