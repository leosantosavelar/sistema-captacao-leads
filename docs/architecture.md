# Arquitetura da Solução

Este documento descreve uma versão pública e sanitizada da arquitetura do sistema de captação e qualificação de leads.

> O objetivo é demonstrar decisões de arquitetura e padrões técnicos. Nomes, credenciais, regras proprietárias, prompts, endpoints e dados reais foram removidos ou simplificados.

## Visão geral

```text
[Campanhas]
    |
    v
[Landing Page / Site]
    |
    | webhook + parâmetros de origem
    v
[API de Entrada]
    |
    +--> valida payload
    +--> normaliza telefone/origem
    +--> gera identificador único
    |
    v
[Banco / CRM]
    |
    +--> lead
    +--> eventos
    +--> origem/campanha
    |
    v
[Orquestração]
    |
    +--> agente de IA
    +--> qualificação
    +--> follow-up
    +--> roteamento
    |
    v
[Consultor / Operação Comercial]
    |
    v
[Dashboard e Atribuição]
```

## Princípios adotados

### 1. Identificador único desde a entrada

Cada lead recebe um identificador interno. Isso evita depender apenas de telefone, e-mail ou identificadores de plataformas externas para reconstruir sua jornada.

### 2. Eventos em vez de apenas estado final

Além do estado atual do lead, eventos importantes são registrados separadamente, por exemplo:

- `lead_created`
- `first_response_sent`
- `qualification_started`
- `lead_qualified`
- `lead_routed`
- `consultant_notified`
- `opportunity_won`
- `opportunity_lost`

Esse padrão melhora auditoria, mensuração e diagnóstico de falhas.

### 3. Separação entre entrada, regra e efeito

A captura do lead, a lógica de qualificação e as ações externas ficam desacopladas sempre que possível. Um webhook não deve concentrar toda a lógica do sistema.

### 4. Idempotência

Integrações podem reenviar eventos. O sistema deve evitar criar leads ou ações duplicadas quando a mesma entrada é processada mais de uma vez.

### 5. Falhas visíveis

Automações críticas devem registrar:

- execução iniciada;
- sucesso ou falha;
- motivo da falha;
- tentativa/reprocessamento;
- identificador do lead ou evento relacionado.

## Camadas

### Aquisição

Recebe tráfego de múltiplas fontes e preserva parâmetros de origem para atribuição posterior.

### Entrada

Valida, normaliza e registra os dados mínimos necessários antes de disparar automações.

### Dados

PostgreSQL/Supabase armazena leads, eventos, origem, status de qualificação e vínculos operacionais.

### Orquestração

n8n coordena chamadas entre serviços, webhooks, agente de IA, notificações e rotinas agendadas.

### Inteligência artificial

O agente atua em atendimento e qualificação. A lógica pública deste repositório não inclui prompts, regras comerciais ou conhecimento proprietário.

### CRM e operação

O lead qualificado é roteado conforme critérios de negócio e pode ser acompanhado por responsável, etapa e histórico.

### Observabilidade

Eventos e logs permitem responder perguntas como:

- Quantos leads entraram por campanha?
- Quantos receberam resposta?
- Onde ocorreu abandono?
- Quantos foram qualificados?
- Quanto tempo cada etapa levou?
- Houve falha silenciosa em algum fluxo?

## Segurança

Na implementação real, o acesso ao banco é controlado por autenticação, permissões e Row Level Security. Chaves de serviço nunca devem ser expostas no frontend nem versionadas em repositórios públicos.

## O que foi omitido

Este repositório não publica:

- credenciais;
- tokens;
- dados pessoais;
- números reais de telefone;
- prompts proprietários;
- regras comerciais completas;
- endpoints de produção;
- workflows integrais de clientes;
- segredos de infraestrutura.
