# Sistema Integrado de Captação e Qualificação de Leads

Cobre a jornada completa de aquisição — do primeiro clique no anúncio até o registro no CRM — com automação entre todas as etapas.

> Este repositório documenta a **arquitetura** da solução e inclui exemplos técnicos públicos e sanitizados. Não contém código proprietário, dados de clientes, credenciais, prompts internos nem informações pessoais de leads.

## Objetivo do projeto

Empresas que investem em tráfego pago perdem leads no intervalo entre a campanha e a venda. O lead chega, demora a ser atendido, o contato não é registrado e o gestor não enxerga qual campanha gera retorno.

O objetivo foi eliminar esse intervalo: um fluxo único e rastreável em que cada lead é atendido, qualificado e registrado sem intervenção manual.

## Funcionalidades

- Sites de captação com rastreamento por pixel
- Campanhas em Meta Ads, Google, Bing, TikTok e Taboola
- Atendimento por agente de IA, com leitura de texto, áudio, imagem e PDF
- Classificação estruturada por IA com saída JSON validada
- Funil de qualificação automatizado, com score e roteamento por critério
- CRM em Supabase com Row Level Security
- Infraestrutura baseada em PostgreSQL e serviços auxiliares
- Dashboards de ganhos e perdas com atribuição por campanha
- Registro de eventos para rastreabilidade do funil
- Testes automatizados e CI com GitHub Actions

## Tecnologias utilizadas

| Camada | Stack |
|---|---|
| Backend e automação | Node.js, Python |
| Banco de dados | Supabase (PostgreSQL), SQL |
| Orquestração | n8n |
| Integrações | APIs REST, JSON, webhooks |
| IA | Agentes para atendimento, classificação e qualificação |
| Mensuração | Pixels de conversão e rastreamento de origem |
| Qualidade | node:test, GitHub Actions |

## Arquitetura

```text
Anúncio
   ↓
Site (pixel)  →  Captura do lead
   ↓
API / Webhook  →  Validação, normalização e idempotência
   ↓
CRM / Banco  →  Lead + eventos + origem
   ↓
Agente de IA  →  Atendimento inicial
   ↓
Classificação IA  →  JSON estruturado + confiança
   ↓
Qualificação  →  Score + prioridade + roteamento
   ↓
Consultor  →  Atendimento comercial
   ↓
Dashboard  →  Ganhos, perdas e atribuição
```

Cada etapa grava dados que permitem reconstruir o caminho do lead e medir onde ele parou.

A documentação detalhada está em [`docs/architecture.md`](docs/architecture.md).

## Evidências técnicas públicas

Os arquivos abaixo são versões simplificadas e sanitizadas de padrões usados na solução real:

- [`src/webhook-example.js`](src/webhook-example.js) — validação, normalização e idempotência de uma entrada de lead em Node.js.
- [`src/ai-classification-example.js`](src/ai-classification-example.js) — contrato JSON, validação de saída e conversão da interpretação da IA em sinais estruturados.
- [`src/qualification-example.js`](src/qualification-example.js) — score, prioridade, qualificação e roteamento determinístico.
- [`test/ai-classification-example.test.js`](test/ai-classification-example.test.js) — testes do contrato de classificação por IA.
- [`test/qualification-example.test.js`](test/qualification-example.test.js) — testes automatizados da camada de qualificação.
- [`database/example-schema.sql`](database/example-schema.sql) — exemplo de modelagem PostgreSQL com leads e eventos.
- [`database/rls-example.sql`](database/rls-example.sql) — exemplo conceitual de Row Level Security no Supabase.
- [`examples/webhook-payload.json`](examples/webhook-payload.json) — payload demonstrativo de entrada de lead.
- [`docs/architecture.md`](docs/architecture.md) — decisões de arquitetura, observabilidade e segurança.
- [`docs/qualification.md`](docs/qualification.md) — separação entre regras determinísticas e interpretação por IA.
- [`docs/ai-classification.md`](docs/ai-classification.md) — contrato estruturado, confiança e fronteira entre IA e efeitos no sistema.

Esses exemplos existem para demonstrar raciocínio técnico sem publicar regras comerciais, prompts, credenciais ou infraestrutura proprietária.

## Qualificação: regras + IA

Nem toda decisão precisa de um modelo de linguagem. Critérios objetivos podem ser resolvidos por regras auditáveis, enquanto IA é mais útil na interpretação de linguagem natural, contexto e intenção.

O exemplo público segue este princípio:

> **IA interpreta; regras validam e controlam efeitos críticos.**

A camada de IA produz uma saída estruturada com intenção, urgência, confiança, resumo e sinais. Essa saída é validada antes de enriquecer a qualificação determinística. Classificações abaixo do limite de confiança podem ser ignoradas ou encaminhadas para revisão/follow-up.

O exemplo não depende de OpenAI, Anthropic, Gemini ou outro provedor. Assim, os contratos e testes permanecem locais, previsíveis e portáveis.

## Automações implementadas

- **Follow-up de reativação** — recupera leads dos últimos 45 dias respeitando teto diário de envios, horário comercial e intervalos variáveis para evitar bloqueio de canal.
- **Notificação de lead qualificado** — identifica leads atribuídos ainda não comunicados e avisa o consultor responsável dentro das regras operacionais.
- **Retenção de mídias** — expurgo automático de arquivos após o período definido pela operação.
- **Registro de eventos** — etapas relevantes são persistidas para auditoria, atribuição e diagnóstico.

## Escala

Mais de mil leads atendidos pelo agente em operações de clientes distintos, com taxa de qualificação em torno de 27%. O agente responde em menos de um minuto e usa um buffer para agrupar mensagens fragmentadas, permitindo transformar várias mensagens consecutivas em uma única entrada coerente para processamento.

## Decisões de engenharia

### Idempotência

Integrações podem reenviar o mesmo evento. Por isso, entradas externas precisam de uma chave que permita reconhecer e ignorar duplicidades antes de executar ações novamente.

### Eventos além do estado atual

Guardar apenas o status atual não explica como o lead chegou até ele. Eventos permitem reconstruir a jornada e medir tempo entre etapas.

### Backend como fronteira de confiança

Credenciais privilegiadas e regras sensíveis não pertencem ao frontend. Escritas administrativas e integrações críticas ficam em serviços controlados.

### IA como fonte não confiável até validação

A saída de um modelo é probabilística. Antes de alimentar score, CRM ou automações, ela é convertida em um contrato estruturado, validada e submetida a um limite de confiança.

### Observabilidade

Fluxos automatizados precisam registrar falhas, tentativas e contexto suficiente para diagnóstico. Automação que falha em silêncio cria risco operacional.

### Testabilidade

Regras de qualificação, normalização e contratos de IA são mantidos em funções pequenas e previsíveis para poderem ser verificados automaticamente antes de mudanças entrarem na branch principal.

## O que aprendi

**Sem identificador único, cada área olha um número diferente.** Encontrei uma divergência entre os leads atribuídos pela plataforma de anúncios e as conversas registradas no sistema. Não era perda: era definição diferente de "lead" em cada ponta. Rastreabilidade virou requisito, não relatório.

**Modelagem de dados vem antes de tudo.** Errar a estrutura no início custou mais retrabalho do que qualquer falha nos fluxos.

**Automação precisa de ponto de falha visível.** Fluxo que quebra em silêncio é pior que processo manual, porque ninguém percebe até o prejuízo aparecer. Log e alerta viraram parte da entrega.

**Métrica isolada não explica queda de resultado.** Atribuir uma queda a uma única etapa do funil, sem medir as anteriores e posteriores, leva a decisão errada.

## Segurança e privacidade

Este repositório não publica:

- credenciais ou tokens;
- dados pessoais de leads;
- números reais de telefone;
- prompts proprietários;
- regras comerciais completas;
- endpoints de produção;
- workflows integrais de clientes;
- segredos de infraestrutura.

## Status

Em operação e evolução contínua.
