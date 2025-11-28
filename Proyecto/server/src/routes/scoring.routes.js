const { Router } = require('express');
const { scoreController } = require('../controllers/scoring.controller.js');
const { validate } = require('../validators/validate');
const { scoringInputSchema } = require('../validators/scoring.schema');

const router = Router();

// POST /api/score/compute
router.post('/api/score/compute', (req, res) => {
    console.log("entre")
    scoreController(req, res);
})

module.exports = router;
