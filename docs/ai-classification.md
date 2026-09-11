# Classificação Estruturada por IA

Este exemplo mostra como usar uma camada de IA sem permitir que uma resposta probabilística altere diretamente o CRM ou dispare ações críticas.

## Princípio

**IA interpreta. Regras validam e decidem.**

A IA pode transformar conversa não estruturada em um contrato JSON previsível. Depois disso, o sistema valida os campos, verifica confiança mínima e converte o resultado em sinais usados pelas regras determinísticas.

## Contrato demonstrativo

```json
{
  "intent": "buy",
  "urgency": "high",
  "confidence": 0.91,
  "summary": "Lead quer automatizar atendimento e CRM.",
  "signals": [
    "dor operacional",
    "interesse em automação"
  ],
  "requestedSolution": "automation"
}
```

## Campos permitidos

- `intent`: `buy`, `evaluate`, `support` ou `unknown`
- `urgency`: `low`, `medium` ou `high`
- `confidence`: número entre 0 e 1
- `summary`: resumo textual obrigatório
- `signals`: lista de sinais extraídos da conversa
- `requestedSolution`: solução identificada, quando disponível

## Fluxo

```text
Conversa
   ↓
Modelo de IA
   ↓
JSON estruturado
   ↓
Validação de schema/contrato
   ↓
Confiança mínima
   ↓
Conversão em sinais
   ↓
Score e regras determinísticas
   ↓
Roteamento / CRM
```

## Por que validar a saída

Modelos podem produzir respostas inesperadas, campos ausentes ou classificações de baixa confiança. A validação impede que esse conteúdo seja tratado automaticamente como dado confiável.

No exemplo público:

- enums limitam intenção e urgência;
- confiança precisa estar entre 0 e 1;
- resumo não pode ser vazio;
- sinais precisam ser uma lista;
- classificações abaixo do limite de confiança podem ser ignoradas ou enviadas para revisão/follow-up.

## Integração com a qualificação

O arquivo `src/ai-classification-example.js` converte a interpretação em sinais como:

```json
{
  "hasUrgency": true,
  "problemClearlyDefined": true,
  "requestedSolution": "automation",
  "aiConfidence": 0.93
}
```

Esses sinais podem enriquecer o objeto consumido por `src/qualification-example.js`. Critérios objetivos, como orçamento disponível, autoridade de decisão e contato válido, continuam sendo tratados separadamente.

## Dependência de provedor

O exemplo não chama OpenAI, Anthropic, Gemini ou qualquer outro provedor. Isso é intencional: o contrato e os testes funcionam localmente e a integração externa pode ser substituída sem alterar a fronteira principal do sistema.

Em produção, um adaptador pode receber a resposta do provedor escolhido e entregá-la a esta camada de validação.

## Segurança

Nunca devem ser publicados neste repositório:

- API keys;
- prompts proprietários;
- dados pessoais de conversas reais;
- URLs privadas de webhooks;
- regras comerciais sensíveis;
- conteúdo confidencial de clientes.
