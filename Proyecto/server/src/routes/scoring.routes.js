const { Router } = require('express');
const { scoreController } = require('../controllers/scoring.controller');
const { validate } = require('../validators/validate');
const { scoringInputSchema } = require('../validators/scoring.schema');

const router = Router();

// POST /api/score/compute
router.post('/compute', validate(scoringInputSchema), scoreController.compute);

module.exports = router;
