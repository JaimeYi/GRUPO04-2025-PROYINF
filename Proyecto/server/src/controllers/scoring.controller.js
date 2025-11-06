const { computeScore } = require('../services/scoring.service');

exports.scoreController = {
  async compute(req, res) {
    // req.body fue validado para este punto
    const input = req.body;
    const result = await computeScore(input);
    res.json(result); // {score, breakdown}
  }
};
