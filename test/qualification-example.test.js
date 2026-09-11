const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateLeadScore,
  priorityFromScore,
  routeFromQualification,
  qualifyLead
} = require('../src/qualification-example');

test('calculates a high score for a strong lead', () => {
  const score = calculateLeadScore({
    hasBudget: true,
    hasUrgency: true,
    isDecisionMaker: true,
    problemClearlyDefined: true,
    hasValidContact: true
  });

  assert.equal(score, 100);
});

test('maps score to expected priority', () => {
  assert.equal(priorityFromScore(80), 'high');
  assert.equal(priorityFromScore(50), 'medium');
  assert.equal(priorityFromScore(20), 'low');
});

test('routes a high-priority automation lead to specialist', () => {
  assert.equal(
    routeFromQualification({ priority: 'high', requestedSolution: 'automation' }),
    'automation_specialist'
  );
});

test('qualifies and routes a medium-priority lead', () => {
  const result = qualifyLead({
    hasBudget: true,
    hasUrgency: false,
    isDecisionMaker: false,
    problemClearlyDefined: true,
    hasValidContact: true,
    requestedSolution: 'crm'
  });

  assert.equal(result.score, 55);
  assert.equal(result.priority, 'medium');
  assert.equal(result.qualified, true);
  assert.equal(result.route, 'sales_queue');
});

test('routes a weak lead to nurture flow', () => {
  const result = qualifyLead({
    hasBudget: false,
    hasUrgency: false,
    isDecisionMaker: false,
    problemClearlyDefined: false,
    hasValidContact: true,
    requestedSolution: 'automation'
  });

  assert.equal(result.score, 10);
  assert.equal(result.priority, 'low');
  assert.equal(result.qualified, false);
  assert.equal(result.route, 'nurture_flow');
});
