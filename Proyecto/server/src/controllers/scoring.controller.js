const { computeScore } = require('../services/scoring.service');

const scoreController = async (req, res) => {
  console.log("holaaaaa");
  // req.body fue validado para este punto
  const input = req.body;
  const result = await computeScore(input);
  console.log(result);
  res.json(result); // {score, breakdown}
};


module.exports = {scoreController};
