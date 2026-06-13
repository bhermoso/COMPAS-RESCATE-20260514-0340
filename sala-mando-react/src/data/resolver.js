// Prueba mínima del resolutor COMPÁS — casos: "Agenda" y "PLS"
// No generalizar. No crear framework. Solo demostrar ejecución real.
import { panopticoNodes } from './salaData.js';

const CONSULTA_MAP = {
  agenda: 'pn-agenda-anual',
  pls:    'pn-plan-local-salud',
};

export function resolver(consulta) {
  const id = CONSULTA_MAP[consulta.trim().toLowerCase()];
  if (!id) return { estado: 'LIMITE', mensaje: `Sin nodo trazado para "${consulta}"` };

  const nodo = panopticoNodes.find(n => n.id === id);
  if (!nodo) return { estado: 'LIMITE', mensaje: `Nodo "${id}" ausente en panopticoNodes` };

  // ── Caso: Agenda ─────────────────────────────────────────────────────────
  if (id === 'pn-agenda-anual') {
    const riesgos = nodo.surgical?.specificRisks ?? nodo.risks.map(r => ({
      id: r.id, titulo: r.title, severidad: r.severity,
    }));
    return {
      consulta,
      estado: riesgos.length ? 'CON_RIESGOS_ACTIVOS' : 'OBSERVABLE',
      nodoIdentificado: { id: nodo.id, nombre: nodo.name },
      tipo: nodo.type,
      workObjects: nodo.workObjects.map(wo => ({
        id: wo.id, nombre: wo.name, criticidad: wo.criticality, funcion: wo.function,
      })),
      downstream: (nodo.surgical?.downstream ?? []).map(d => ({
        id: d.id, detalle: d.detail, riesgo: d.risk ?? null, evidencia: d.evidence,
      })),
      riesgos,
      limitesConocidos: nodo.pending ?? [],
    };
  }

  // ── Caso: PLS ─────────────────────────────────────────────────────────────
  if (id === 'pn-plan-local-salud') {
    const compilador = nodo.workObjects.find(wo => wo.id === 'wo-compilador');
    const riesgos = nodo.risks.map(r => ({
      id: r.id, titulo: r.title, severidad: r.severity, estado: r.status,
    }));
    return {
      consulta,
      estado: riesgos.length ? 'CON_RIESGOS_ACTIVOS' : 'OBSERVABLE',
      nodoIdentificado: { id: nodo.id, nombre: nodo.name },
      tipo: nodo.type,
      origen: compilador?.codeRefs.find(r => r.file === 'core/documentos/generarHTMLPlanLocal.js') ?? null,
      workObjectsAsociados: nodo.workObjects.map(wo => ({
        id: wo.id, nombre: wo.name, criticidad: wo.criticality,
      })),
      funcionesImplicadas: compilador?.codeRefs ?? [],
      dependencias: compilador?.consumes ?? [],
      riesgos,
      limitesConocidos: nodo.pending ?? [],
    };
  }

  return { estado: 'LIMITE', mensaje: `Nodo "${id}" sin extractor definido` };
}
