// Helper to create scenario objects
function makeScenario(id, name, condition, expectedOutcome, severity) {
    return {
      id,
      name,
      condition,
      expectedOutcome: expectedOutcome || undefined,
      severity: severity || "info" // "info" | "warning" | "contradiction"
    };
  }
  
  // Small starter set of example scenarios
  const scenarios = [
    // S01: Rent-to-income ratio too high must be flagged
    makeScenario(
      "S01",
      "High rent-to-income ratio is flagged",
      (input, result) => {
        const monthlyIncome = toNumber(input.monthlyIncome);
        const rentAmount = toNumber(input.rentAmount);
  
        if (!monthlyIncome || !rentAmount) return true;
  
        const ratio = (rentAmount / monthlyIncome) * 100;
  
        // Below or equal 60%: not "critical", always OK for this scenario
        if (ratio <= 60) return true;
  
        const concerns = (result.fixedBreakdown && result.fixedBreakdown.concerns) || [];
        const hasAffordabilityConcern = concerns.some(text =>
          /rent-to-income|affordability|rent to income|high rent share/i.test(String(text || ""))
        );
  
        // If ratio is > 60, we expect *some* concern mentioning affordability
        return hasAffordabilityConcern;
      },
      "affordability_should_be_flagged_when_ratio_is_high",
      "contradiction"
    ),
  
    // S02: Clean compliance checks should not give the very lowest band
    makeScenario(
      "S02",
      "Clean compliance but extremely low trust band",
      (input, result) => {
        const criminalBackground = input.criminalBackground;
        const sanctionsCheck = input.sanctionsCheck;
        const fraudCheck = input.fraudCheck;
  
        const allClean =
          criminalBackground === false &&
          sanctionsCheck === false &&
          fraudCheck === false;
  
        if (!allClean) return true;
  
        const band =
          (result && (result.trustBand || result.band || result.trust_level)) || null;
  
        if (!band) return true;
  
        const normalized = String(band).toLowerCase().trim();
        const isVeryLow = ["poor", "high_risk", "high risk"].includes(normalized);
  
        // If everything is clean, this scenario expects we are NOT in the very lowest trust band
        return !isVeryLow;
      },
      "avoid_extreme_low_trust_when_checks_are_clean",
      "warning"
    ),
  
    // S03: Missed payments should appear in concerns
    makeScenario(
      "S03",
      "Multiple missed payments produce payment concern",
      (input, result) => {
        const missedPayments = toNumber(input.missedPayments);
        if (missedPayments < 2) return true;
  
        const concerns = (result.fixedBreakdown && result.fixedBreakdown.concerns) || [];
        const mentionsPayments = concerns.some(text =>
          /payment|late|missed/i.test(String(text || ""))
        );
  
        return mentionsPayments;
      },
      "payment_history_should_be_flagged",
      "contradiction"
    ),
  
    // S04: High trust requires multiple verification checks
    makeScenario(
      "S04",
      "High trust band requires strong verification",
      (input, result) => {
        const verificationSignals = [
          input.oneIdVerified,
          input.phoneVerified,
          input.selfieVerified,
          input.documentIntegrityCheck
        ];
  
        const verifiedCount = verificationSignals.filter(v => v === true).length;
  
        const band =
          (result && (result.trustBand || result.trust_level || result.band)) || null;
        if (!band) return true;
  
        const normalized = String(band).toLowerCase().trim();
        const isHighTrust =
          ["high_trust", "high trust", "excellent", "very_good", "good"].includes(
            normalized
          );
  
        if (!isHighTrust) return true;
  
        // Expect at least 3 verification methods for "high trust"
        return verifiedCount >= 3;
      },
      "high_trust_should_have_strong_verification",
      "warning"
    )
  ];
  
  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  
  module.exports = {
    scenarios
  };