const express = require("express");
const { TrustLogicAuditor } = require("../auditor/trustLogicAuditor");
const { scenarios } = require("../auditor/scenarios");

const router = express.Router();
const auditor = TrustLogicAuditor.fromRegistry(scenarios);

// Basic validators (simple & readable; not strict schemas)
function validateScoringInput(data) {
  if (!data || typeof data !== "object") {
    return "scoringInput must be an object";
  }
  if (!data.pathway) {
    return "scoringInput.pathway is required";
  }
  return null;
}

function validateScoringResult(data) {
  if (!data || typeof data !== "object") {
    return "scoringResult must be an object";
  }
  if (typeof data.totalScore !== "number") {
    return "scoringResult.totalScore must be a number";
  }
  if (typeof data.fixedScore !== "number") {
    return "scoringResult.fixedScore must be a number";
  }
  if (!data.pathway) {
    return "scoringResult.pathway is required";
  }
  return null;
}

// POST /debug/audit
router.post("/audit", (req, res) => {
  const body = req.body || {};
  const scoringInput = body.scoringInput;
  const scoringResult = body.scoringResult;

  const inputError = validateScoringInput(scoringInput);
  const resultError = validateScoringResult(scoringResult);

  if (inputError || resultError) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: [inputError, resultError].filter(Boolean)
    });
  }

  const audit = auditor.evaluate(scoringInput, scoringResult);

  return res.status(200).json({
    message: "Audit completed",
    data: {
      scoringInput,
      scoringResult,
      audit
    }
  });
});

// POST /debug/batch-audit
router.post("/batch-audit", (req, res) => {
  const body = req.body || {};
  const cases = Array.isArray(body.cases) ? body.cases : null;

  if (!cases || cases.length === 0) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: ["cases must be a non-empty array"]
    });
  }

  const results = [];

  for (const item of cases) {
    const id = item && item.id ? String(item.id) : null;
    const scoringInput = item && item.scoringInput;
    const scoringResult = item && item.scoringResult;

    const inputError = validateScoringInput(scoringInput);
    const resultError = validateScoringResult(scoringResult);

    if (inputError || resultError) {
      results.push({
        id,
        error: [inputError, resultError].filter(Boolean)
      });
      continue;
    }

    const audit = auditor.evaluate(scoringInput, scoringResult);

    results.push({
      id,
      audit
    });
  }

  return res.status(200).json({
    message: "Batch audit completed",
    data: results
  });
});

module.exports = router;