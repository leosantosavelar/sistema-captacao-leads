const test = require('node:test');
const assert = require('node:assert/strict');

const {
  handleLeadWebhook,
  normalizeLead,
  normalizePhone,
  validatePayload
} = require('../src/webhook-example');

test('normalizePhone keeps digits only', () => {
  assert.equal(normalizePhone('+55 (11) 99999-0000'), '5511999990000');
});

test('validatePayload rejects payload without event_id', () => {
  assert.throws(
    () => validatePayload({ lead: { full_name: 'Demo Lead' } }),
    /event_id is required/
  );
});

test('normalizeLead normalizes email, phone and source', () => {
  const lead = normalizeLead({
    event_id: 'evt_001',
    source: 'meta_ads',
    campaign: { id: 'cmp_123' },
    lead: {
      full_name: '  Demo Lead  ',
      email: 'DEMO@EXAMPLE.COM ',
      phone: '+55 (11) 98888-7777'
    }
  });

  assert.equal(lead.externalEventId, 'evt_001');
  assert.equal(lead.fullName, 'Demo Lead');
  assert.equal(lead.email, 'demo@example.com');
  assert.equal(lead.phone, '5511988887777');
  assert.equal(lead.source, 'meta_ads');
  assert.equal(lead.campaignId, 'cmp_123');
});

test('handleLeadWebhook creates lead and event when event is new', async () => {
  const events = [];
  const repository = {
    async findByExternalEventId() {
      return null;
    },
    async createLead(lead) {
      return { id: 'lead_001', ...lead };
    },
    async appendEvent(event) {
      events.push(event);
    }
  };

  const result = await handleLeadWebhook(
    {
      event_id: 'evt_001',
      source: 'google_ads',
      lead: { full_name: 'Demo Lead' }
    },
    repository
  );

  assert.deepEqual(result, { status: 'created', leadId: 'lead_001' });
  assert.equal(events.length, 1);
  assert.equal(events[0].eventType, 'lead_created');
});

test('handleLeadWebhook ignores duplicated external event', async () => {
  let createCalled = false;
  const repository = {
    async findByExternalEventId() {
      return { id: 'lead_existing' };
    },
    async createLead() {
      createCalled = true;
    },
    async appendEvent() {}
  };

  const result = await handleLeadWebhook(
    {
      event_id: 'evt_duplicate',
      lead: { full_name: 'Demo Lead' }
    },
    repository
  );

  assert.deepEqual(result, {
    status: 'duplicate_ignored',
    leadId: 'lead_existing'
  });
  assert.equal(createCalled, false);
});
