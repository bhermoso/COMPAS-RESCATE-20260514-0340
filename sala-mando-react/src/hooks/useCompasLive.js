import { useState, useEffect, useRef } from 'react';
import {
  isAvailable,
  getMunicipioActivo,
  getDatosMunicipioActual,
  getPlanLocalSalud,
  subscribeToMunicipioChange,
} from '../services/compasObserver.js';

export function useCompasLive() {
  const [municipio,      setMunicipio]      = useState(() => getMunicipioActivo());
  const [datosMunicipio, setDatosMunicipio] = useState(() => getDatosMunicipioActual());
  const [planLocalSalud, setPlanLocalSalud] = useState(() => getPlanLocalSalud());
  const [source,         setSource]         = useState(() => isAvailable() ? 'window' : 'none');
  const dataPollRef     = useRef(null); // burst: captura datos Firebase tras cambio municipio
  const municipioPollRef = useRef(null); // continuo: detecta cambios de municipio en el DOM

  // Burst de 2s/30s para datosMunicipioActual y planLocalSalud,
  // que se populan asincrónicamente desde Firebase tras el cambio de municipio.
  function startDataPolling() {
    clearInterval(dataPollRef.current);
    let ticks = 0;
    dataPollRef.current = setInterval(() => {
      setDatosMunicipio(getDatosMunicipioActual());
      setPlanLocalSalud(getPlanLocalSalud());
      ticks++;
      if (ticks >= 15) clearInterval(dataPollRef.current); // para tras ~30 s
    }, 2000);
  }

  useEffect(() => {
    if (!isAvailable()) {
      setSource('none');
      return;
    }

    setSource('window');
    setMunicipio(getMunicipioActivo());
    setDatosMunicipio(getDatosMunicipioActual());
    setPlanLocalSalud(getPlanLocalSalud());

    // Suscripción reactiva — dispara si ambitoTerritorialActivo se actualiza.
    // En el flujo real actual ese campo está null, pero se mantiene por si
    // una iteración futura de COMPÁS lo popula.
    const unsuscribe = subscribeToMunicipioChange((nuevoAmbito) => {
      const key = nuevoAmbito?.key ?? null;
      if (key) setMunicipio(key);
      startDataPolling();
    });

    // Poll continuo a 1s: detecta cambios de municipio leyendo el DOM y
    // planLocalSalud, que son las fuentes reales observadas en el flujo actual.
    municipioPollRef.current = setInterval(() => {
      const m = getMunicipioActivo();
      if (m) setMunicipio(m);
    }, 1000);

    // Burst inicial para datos (puede que COMPÁS ya tenga municipio al montar).
    startDataPolling();

    return () => {
      unsuscribe();
      clearInterval(dataPollRef.current);
      clearInterval(municipioPollRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { municipio, datosMunicipio, planLocalSalud, source };
}
