const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateAIClassification,
  normalizeAIClassification,
  classificationToSignals,
  shouldUseClassification
} = require('../src/ai-classification-example');

test('accepts a valid structured classification', () => {
  const valid = validateAIClassification({
    intent: 'buy',
    urgency: 'high',
    confidence: 0.91,
    summary: 'Lead quer automatizar atendimento e CRM.',
    signals: ['dor operacional', 'interesse em automação'],
    requestedSolution: 'automation'
  });

  assert.equal(valid, true);
});

test('rejects invalid confidence', () => {
  assert.throws(
    () => validateAIClassification({
      intent: 'buy',
      urgency: 'high',
      confidence: 1.4,
      summary: 'Resumo válido',
      signals: []
    }),
    /confidence must be between 0 and 1/
  );
});

test('normalizes structured output', () => {
  const result = normalizeAIClassification({
    intent: 'evaluate',
    urgency: 'medium',
    confidence: 0.876,
    summary: '  Lead está comparando soluções.  ',
    signals: ['  comparação de fornecedores  ', '', 'orçamento em análise'],
    requestedSolution: ' CRM '
  });

  assert.deepEqual(result, {
    intent: 'evaluate',
    urgency: 'medium',
    confidence: 0.88,
    summary: 'Lead está comparando soluções.',
    signals: ['comparação de fornecedores', 'orçamento em análise'],
    requestedSolution: 'crm'
  });
});

test('converts AI output into deterministic signals', () => {
  const result = classificationToSignals({
    intent: 'buy',
    urgency: 'high',
    confidence: 0.93,
    summary: 'Lead quer iniciar rapidamente.',
    signals: ['prazo curto'],
    requestedSolution: 'automation'
  });

  assert.equal(result.hasUrgency, true);
  assert.equal(result.problemClearlyDefined, true);
  assert.equal(result.requestedSolution, 'automation');
  assert.equal(result.aiConfidence, 0.93);
});

test('ignores low-confidence classification when threshold is not met', () => {
  assert.equal(
    shouldUseClassification({
      intent: 'unknown',
      urgency: 'low',
      confidence: 0.42,
      summary: 'Informação insuficiente.',
      signals: []
    }),
    false
  );
});
