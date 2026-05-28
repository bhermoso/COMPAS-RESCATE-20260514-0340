# CIERRE-CAP-001 — Cierre Formal del Expediente CAP-001

**Artefacto:** CIERRE-CAP-001  
**Tipo:** Acta de cierre de expediente documental  
**Fecha de cierre:** 2026-05-27  
**Estado:** VALIDADO_CON_OBSERVACIONES  

---

## 1. Identificación del paquete cerrado

| Artefacto | Revisión | Ruta |
|-----------|----------|------|
| Cartografía principal | CAP-001-R5 | `cuaderno/CAP-001-R5.md` |
| Checklist operativo | CHK-001-R1 | `cuaderno/CHK-001-R1.md` |
| Árbol jerárquico | ARB-001-R1 | `cuaderno/ARB-001-R1.md` |
| Informe de derivabilidad | DERIVABILIDAD-CAP-001-R1 | `cuaderno/DERIVABILIDAD-CAP-001-R1.md` |

---

## 2. Rango cubierto

**Archivo:** index.html  
**Líneas:** 1–2000  
**Tipo de contenido dominante:** CSS (`<style>` abierto en l.43, sin cerrar en l.2000)  
**Límite inferior del siguiente expediente:** l.2001

---

## 3. Estado de cierre

```
VALIDADO_CON_OBSERVACIONES
```

El expediente CAP-001 queda cerrado con este estado. Los artefactos del paquete son estables y no se reabrirán salvo por las condiciones definidas en la Sección 6.

---

## 4. Evidencia de cierre

### 4.1 Derivados generados

Los cuatro artefactos del paquete fueron generados exclusivamente desde CAP-001-R5, sin acceso a index.html ni a ninguna fuente externa. La derivabilidad fue evaluada y documentada en DERIVABILIDAD-CAP-001-R1 con veredicto:

```
DERIVABLE_CON_LIMITACIONES
```

Las limitaciones son inherentes al rango auditado (l.1–2000) y no constituyen deficiencias del paquete.

### 4.2 Auditoría hostil realizada

Los derivados CHK-001, ARB-001 y DERIVABILIDAD-CAP-001 fueron sometidos a auditoría hostil. La auditoría identificó cinco correcciones (COR-01 a COR-05).

### 4.3 Correcciones R1 aplicadas

| Corrección | Descripción | Estado final |
|------------|-------------|--------------|
| COR-01 | Overclaim en CHK-C06 — afirmación de exclusividad de CON-001 | RESUELTO |
| COR-02 | Uso de NO_DERIVABLE_DESDE_CAP_001 como estado documental | RESUELTO |
| COR-03 | Contexto externo en DERIVABILIDAD (referencia a solicitud y versión inexistente) | RESUELTO |
| COR-04 | Incoherencias de conteo en FUNC/MOT | PARCIAL |
| COR-05 | Trazabilidad de correcciones | RESUELTO |

### 4.4 Auditoría final

La auditoría final sobre los derivados R1 concluyó:

- Veredicto: **DERIVADOS_R1_CON_OBSERVACIONES**
- Hallazgos bloqueantes verificables: **ninguno**
- COR-04 PARCIAL no constituye hallazgo bloqueante

---

## 5. Observaciones abiertas

### OBS-001 — COR-04 PARCIAL

**Artefacto afectado:** CHK-001-R1.md  
**Descripción:** El desglose de nodos FUERA_DEL_RANGO_AUDITADO en la sección de resumen enumera 13 de 14 elementos. MOT-004 (Firebase Realtime DB) queda implícito en la nota textual pero no integrado explícitamente en la enumeración numérica del desglose.  
**Naturaleza:** Imprecisión de presentación. No altera ningún dato técnico ni ningún recuento total (el total de 14 es correcto en todos los artefactos).  
**Bloqueante:** NO  
**Acción requerida:** Ninguna sobre el paquete cerrado. Puede incorporarse como criterio de redacción en expedientes futuros.

---

## 6. Regla de no reapertura

CAP-001 **no se reabre** por:

- mejoras metodológicas posteriores al cierre;
- cambios en GOV-001 o en la taxonomía de auditorías;
- nuevos hallazgos sobre l.2001+ que no contradigan directamente el contenido de l.1–2000;
- preferencias de formato o presentación.

CAP-001 **solo se reabre** si concurren simultáneamente las tres condiciones siguientes:

1. El error es **verificable** — puede demostrarse por lectura directa de los artefactos del paquete o del código fuente en l.1–2000.
2. El error es **bloqueante** — impide el uso correcto del paquete o genera una contradicción técnica no subsanable en el expediente siguiente.
3. El error es **localizado** — afecta a un elemento identificable del paquete, no a su estructura o metodología general.

---

## 7. Próximo expediente autorizado

**Identificador previsto:** CAP-002  
**Rango previsto:** index.html l.2001 en adelante  
**Estado:** PENDIENTE DE APERTURA  
**Condición de apertura:** orden expresa del responsable del proyecto  

CAP-002 no se abre por continuidad automática de este cierre.

---

*CIERRE-CAP-001 — Cuaderno de Gobierno del Código COMPÁS — 2026-05-27*
