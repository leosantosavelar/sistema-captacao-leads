// Exemplo público e simplificado de qualificação de leads.
// A implementação real pode combinar regras de negócio, contexto da conversa
// e classificação por IA. Nenhuma regra proprietária está exposta aqui.

const VALID_PRIORITIES = ['low', 'medium', 'high'];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateLeadScore(input) {
  let score = 0;

  if (input.hasBudget === true) score += 30;
  if (input.hasUrgency === true) score += 25;
  if (input.isDecisionMaker === true) score += 20;
  if (input.problemClearlyDefined === true) score += 15;
  if (input.hasValidContact === true) score += 10;

  return clamp(score, 0, 100);
}

function priorityFromScore(score) {
  if (score >= 75) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

function routeFromQualification({ priority, requestedSolution }) {
  if (!VALID_PRIORITIES.includes(priority)) {
    throw new Error('invalid priority');
  }

  if (priority === 'high') {
    return requestedSolution === 'automation'
      ? 'automation_specialist'
      : 'senior_consultant';
  }

  if (priority === 'medium') return 'sales_queue';
  return 'nurture_flow';
}

function qualifyLead(input) {
  const score = calculateLeadScore(input);
  const priority = priorityFromScore(score);
  const route = routeFromQualification({
    priority,
    requestedSolution: input.requestedSolution
  });

  return {
    score,
    priority,
    qualified: score >= 45,
    route,
    reasons: {
      hasBudget: input.hasBudget === true,
      hasUrgency: input.hasUrgency === true,
      isDecisionMaker: input.isDecisionMaker === true,
      problemClearlyDefined: input.problemClearlyDefined === true,
      hasValidContact: input.hasValidContact === true
    }
  };
}

module.exports = {
  calculateLeadScore,
  priorityFromScore,
  routeFromQualification,
  qualifyLead
};
