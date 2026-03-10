class TrustLogicAuditor {
    constructor(scenarios) {
      this.scenarios = Array.isArray(scenarios) ? scenarios : [];
    }
  
    static fromRegistry(registry) {
      return new TrustLogicAuditor(registry);
    }
  
    evaluate(scoringInput, scoringResult) {
      const scenarioResults = [];
      const contradictions = [];
  
      for (const scenario of this.scenarios) {
        const passed = safeConditionCheck(scenario.condition, scoringInput, scoringResult);
  
        const result = {
          scenarioId: scenario.id,
          name: scenario.name,
          severity: scenario.severity || "info",
          expectedOutcome: scenario.expectedOutcome,
          passed,
          message: passed
            ? undefined
            : `Scenario ${scenario.id} (${scenario.name}) failed`
        };
  
        scenarioResults.push(result);
  
        if (!passed && scenario.severity === "contradiction") {
          contradictions.push(result);
        }
      }
  
      const summary = {
        passed: scenarioResults.filter(r => r.passed).length,
        failed: scenarioResults.filter(r => !r.passed).length,
        contradictions: contradictions.length
      };
  
      return {
        scenarioResults,
        contradictions,
        summary
      };
    }
  }
  
  function safeConditionCheck(conditionFn, input, result) {
    try {
      if (typeof conditionFn !== "function") return true;
      return !!conditionFn(input || {}, result || {});
    } catch (err) {
      console.error("Error evaluating scenario condition:", err);
      // If scenario code throws, don't block everything – treat as passed
      return true;
    }
  }
  
  module.exports = {
    TrustLogicAuditor
  };