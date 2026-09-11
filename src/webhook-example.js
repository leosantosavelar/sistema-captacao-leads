// Exemplo público e simplificado de entrada de lead.
// Não contém endpoints, credenciais ou regras proprietárias de produção.

function normalizePhone(value = '') {
  return value.replace(/\D/g, '');
}

function validatePayload(payload) {
  if (!payload?.event_id) throw new Error('event_id is required');
  if (!payload?.lead?.full_name) throw new Error('lead.full_name is required');

  return true;
}

function normalizeLead(payload) {
  validatePayload(payload);

  return {
    externalEventId: payload.event_id,
    fullName: payload.lead.full_name.trim(),
    email: payload.lead.email?.trim().toLowerCase() || null,
    phone: normalizePhone(payload.lead.phone),
    source: payload.source || 'unknown',
    campaignId: payload.campaign?.id || null,
    receivedAt: new Date().toISOString()
  };
}

async function handleLeadWebhook(payload, repository) {
  const lead = normalizeLead(payload);

  // externalEventId funciona como chave de idempotência neste exemplo.
  const existing = await repository.findByExternalEventId(lead.externalEventId);

  if (existing) {
    return {
      status: 'duplicate_ignored',
      leadId: existing.id
    };
  }

  const created = await repository.createLead(lead);

  await repository.appendEvent({
    leadId: created.id,
    eventType: 'lead_created',
    metadata: {
      source: lead.source,
      campaignId: lead.campaignId
    }
  });

  return {
    status: 'created',
    leadId: created.id
  };
}

module.exports = {
  handleLeadWebhook,
  normalizeLead,
  normalizePhone,
  validatePayload
};
