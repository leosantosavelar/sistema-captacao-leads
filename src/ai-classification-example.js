// Exemplo público e sanitizado de classificação estruturada por IA.
// Não contém prompts, modelos, credenciais ou regras proprietárias de produção.

const ALLOWED_INTENTS = ['buy', 'evaluate', 'support', 'unknown'];
const ALLOWED_URGENCY = ['low', 'medium', 'high'];

function validateAIClassification(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('classification must be an object');
  }

  if (!ALLOWED_INTENTS.includes(input.intent)) {
    throw new Error('invalid intent');
  }

  if (!ALLOWED_URGENCY.includes(input.urgency)) {
    throw new Error('invalid urgency');
  }

  if (typeof input.confidence !== 'number' || input.confidence < 0 || input.confidence > 1) {
    throw new Error('confidence must be between 0 and 1');
  }

  if (typeof input.summary !== 'string' || input.summary.trim().length === 0) {
    throw new Error('summary is required');
  }

  if (!Array.isArray(input.signals)) {
    throw new Error('signals must be an array');
  }

  return true;
}

function normalizeAIClassification(input) {
  validateAIClassification(input);

  return {
    intent: input.intent,
    urgency: input.urgency,
    confidence: Number(input.confidence.toFixed(2)),
    summary: input.summary.trim(),
    signals: input.signals
      .filter((signal) => typeof signal === 'string')
      .map((signal) => signal.trim())
      .filter(Boolean),
    requestedSolution:
      typeof input.requestedSolution === 'string' && input.requestedSolution.trim()
        ? input.requestedSolution.trim().toLowerCase()
        : null
  };
}

function classificationToSignals(classification) {
  const normalized = normalizeAIClassification(classification);

  return {
    hasUrgency: normalized.urgency === 'high',
    problemClearlyDefined: normalized.intent === 'buy' || normalized.intent === 'evaluate',
    requestedSolution: normalized.requestedSolution,
    aiConfidence: normalized.confidence,
    aiSummary: normalized.summary,
    aiSignals: normalized.signals
  };
}

function shouldUseClassification(classification, minimumConfidence = 0.65) {
  const normalized = normalizeAIClassification(classification);
  return normalized.confidence >= minimumConfidence;
}

module.exports = {
  validateAIClassification,
  normalizeAIClassification,
  classificationToSignals,
  shouldUseClassification
};
