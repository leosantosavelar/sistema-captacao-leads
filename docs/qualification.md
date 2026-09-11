# Qualificação e Roteamento de Leads

Este documento descreve uma versão pública e simplificada do raciocínio de qualificação usado em sistemas comerciais automatizados.

> O exemplo deste repositório é deliberadamente determinístico. Em produção, regras podem ser combinadas com contexto de conversa, dados do CRM e classificação por modelos de IA.

## Por que separar regra de IA

Nem toda decisão precisa de um modelo de linguagem.

Critérios objetivos, como presença de orçamento, urgência, autoridade de decisão e dados de contato, podem ser tratados por regras explícitas. Isso traz vantagens importantes:

- previsibilidade;
- auditabilidade;
- baixo custo;
- facilidade de teste;
- menor dependência externa.

A IA faz mais sentido quando é necessário interpretar linguagem natural, contexto, intenção, objeções ou informações não estruturadas.

## Fluxo demonstrativo

```text
Lead recebido
   ↓
Dados normalizados
   ↓
Critérios objetivos
   ↓
Score 0–100
   ↓
Prioridade
   ├── high
   ├── medium
   └── low
   ↓
Roteamento
   ├── especialista
   ├── fila comercial
   └── nutrição/follow-up
```

## Critérios usados no exemplo

O arquivo `src/qualification-example.js` usa cinco sinais públicos e genéricos:

| Critério | Peso demonstrativo |
|---|---:|
| orçamento disponível | 30 |
| urgência | 25 |
| poder de decisão | 20 |
| problema claramente definido | 15 |
| contato válido | 10 |

Esses valores existem apenas para demonstrar implementação e testes. Não representam a regra comercial de nenhuma operação real.

## Saída estruturada

A função retorna um objeto com formato previsível:

```json
{
  "score": 80,
  "priority": "high",
  "qualified": true,
  "route": "automation_specialist",
  "reasons": {
    "hasBudget": true,
    "hasUrgency": true,
    "isDecisionMaker": true,
    "problemClearlyDefined": false,
    "hasValidContact": true
  }
}
```

Esse tipo de contrato facilita integração com CRM, n8n, APIs, filas e dashboards.

## Onde a IA pode entrar

Uma camada de IA pode produzir ou enriquecer sinais como:

- intenção de compra;
- problema principal;
- urgência percebida;
- objeção dominante;
- solução de interesse;
- resumo da conversa;
- confiança da classificação.

O resultado deve continuar estruturado e validável antes de gerar efeitos no sistema.

## Princípio adotado

**IA interpreta; regras controlam efeitos críticos.**

Sempre que possível, uma resposta probabilística deve ser convertida em dados estruturados e passar por validações antes de alterar CRM, atribuir responsável ou disparar ações automáticas.
