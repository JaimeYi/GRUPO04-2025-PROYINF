const defaultConfig = require('../config/scoring.config');

// helpers genéricos
const clamp = (x, min, max) => Math.max(min, Math.min(x, max));
const safeDiv = (num, den) => (den === 0 ? 0 : num / den);

function deepMerge(target, source) {
  if (typeof source !== 'object' || source === null) return target;
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      target[key] = deepMerge(target[key] ? { ...target[key] } : {}, sv);
    } else {
      target[key] = sv;
    }
  }
  return target;
}

// Obtiene config efectiva combinando default y overrides
function getConfig(override) {
  const base = JSON.parse(JSON.stringify(defaultConfig)); // clonado simple
  return override ? deepMerge(base, override) : base;
}

// Reescala la suma de componentes al total
function rescaleToTotalMax(rawSum, weights, totalMax) {
  const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const factor = totalMax / sumWeights;
  return rawSum * factor;
}

// componentes parametrizables (usan cfg)
function capacidadPagoScore(input, cfg) {
  const w = cfg.weights.capacidadPago;
  const ratio = safeDiv(input.cuotaEstimada, Math.max(1, input.ingresoMensual));
  const { ratioGood, ratioBad } = cfg.capacidadPago;

  // Mapeo lineal
  let s01;
  if (ratio <= ratioGood) s01 = 1;
  else if (ratio >= ratioBad) s01 = 0;
  else s01 = 1 - (ratio - ratioGood) / (ratioBad - ratioGood);

  return Math.round(w * clamp(s01, 0, 1));
}

function antiguedadScore(input, cfg) {
  const w = cfg.weights.antiguedad;
  const monthsFull = cfg.antiguedad.monthsFull;
  const s01 = clamp(safeDiv(input.mesesAntiguedadLaboral, monthsFull), 0, 1);
  return Math.round(w * s01);
}

function endeudamientoScore(input, cfg) {
  const w = cfg.weights.endeudamiento;
  const ratio = safeDiv(input.deudasVigentes, Math.max(1, input.ingresoMensual));
  const { ratioGood, ratioBad } = cfg.endeudamiento;

  let s01;
  if (ratio <= ratioGood) s01 = 1;
  else if (ratio >= ratioBad) s01 = 0;
  else s01 = 1 - (ratio - ratioGood) / (ratioBad - ratioGood);

  return Math.round(w * clamp(s01, 0, 1));
}

function historialScore(input, cfg) {
  const wMax = cfg.weights.historial; // peso máximo si base=max
  const { base, penalty, min, max } = cfg.historial;

  // Puntaje interno del componente antes de pesar
  let internal = base;
  if (input.morosidad) internal -= penalty.morosidad || 0;
  if (input.protestos) internal -= penalty.protestos || 0;
  internal = clamp(internal, min, max);

  const span = max - min || 1;
  const s01 = (internal - min) / span;
  return Math.round(wMax * clamp(s01, 0, 1));
}

function edadScore(input, cfg) {
  const w = cfg.weights.edad;
  const { youngMin, idealMin, idealMax, ptsYoungBelow, ptsYoungBand, ptsIdeal, ptsSenior } = cfg.edad;

  let pts;
  const e = input.edad;
  if (e < youngMin) pts = ptsYoungBelow;
  else if (e < idealMin) pts = ptsYoungBand;
  else if (e <= idealMax) pts = ptsIdeal;
  else pts = ptsSenior;

  const maxTramo = Math.max(ptsYoungBelow, ptsYoungBand, ptsIdeal, ptsSenior) || 1;
  const s01 = clamp(pts / maxTramo, 0, 1);
  return Math.round(w * s01);
}

// ====================== API del servicio =======================

let runtimeOverride = null; // opcional override

/**
 * computeScore(input, cfgOverride?)
 * - input: datos del cliente
 * - cfgOverride: objeto parcial para sobrescribir parámetros SOLO en esta llamada
 * Retorna: { score, breakdown, usedConfig }
 */
exports.computeScore = async (input, cfgOverride) => {
  // Combina: defaultConfig + runtimeOverride (setRuntimeConfig) + cfgOverride (por llamada)
  const cfg = getConfig(runtimeOverride);
  const finalCfg = cfgOverride ? getConfig(deepMerge(cfg, cfgOverride)) : cfg;

  const comp = {
    capacidadPago: capacidadPagoScore(input, finalCfg),
    antiguedad:    antiguedadScore(input, finalCfg),
    endeudamiento: endeudamientoScore(input, finalCfg),
    historial:     historialScore(input, finalCfg),
    edad:          edadScore(input, finalCfg)
  };

  const rawSum = Object.values(comp).reduce((a, b) => a + b, 0);
  const sumWeights = Object.values(finalCfg.weights).reduce((a, b) => a + b, 0) || 1;

  let scaled = rescaleToTotalMax(rawSum, finalCfg.weights, finalCfg.totalMax);
  let score = Math.round(clamp(scaled, finalCfg.totalMin, finalCfg.totalMax));

  return {
    score,
    breakdown: comp,
    // ELIMINAR ANTES DE PRODUCCION
    usedConfig: finalCfg
  };
};

/**
 * setRuntimeConfig(partialCfg)
 * - Permite actualizar parámetros en memoria (sin reiniciar el server).
 * - Útil para crear un endpoint /api/score/config más adelante.
 */
exports.setRuntimeConfig = (partialCfg) => {
  runtimeOverride = runtimeOverride ? deepMerge(runtimeOverride, partialCfg) : deepMerge({}, partialCfg);
  return runtimeOverride;
};

/**
 * getRuntimeConfig()
 * - Para inspeccionar el override actual en memoria (debug/admin).
 */
exports.getRuntimeConfig = () => runtimeOverride;
