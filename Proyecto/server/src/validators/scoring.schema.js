const Joi = require('joi');
// ojo, configurar datos y parametrizar después (cuando descubra como)
exports.scoringInputSchema = Joi.object({
  rut: Joi.string().required(),
  edad: Joi.number().integer().min(18).required(),
  ingresoMensual: Joi.number().min(0).required(),
  mesesAntiguedadLaboral: Joi.number().integer().min(0).required(),
  cuotaEstimada: Joi.number().min(0).required(),
  deudasVigentes: Joi.number().min(0).required(),
  morosidad: Joi.boolean().required(),
  protestos: Joi.boolean().required(),
});
