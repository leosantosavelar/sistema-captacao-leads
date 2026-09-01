# Sistema Integrado de Captação e Qualificação de Leads

Cobre a jornada completa de aquisição — do primeiro clique no anúncio até o registro no CRM — com automação entre todas as etapas.

> Este repositório documenta a **arquitetura** da solução. Não contém código proprietário, dados de clientes nem informações pessoais de leads.

## Objetivo do projeto

Empresas que investem em tráfego pago perdem leads no intervalo entre a campanha e a venda. O lead chega, demora a ser atendido, o contato não é registrado e o gestor não enxerga qual campanha gera retorno.

O objetivo foi eliminar esse intervalo: um fluxo único e rastreável em que cada lead é atendido, qualificado e registrado sem intervenção manual.

## Funcionalidades

- Sites de captação com rastreamento por pixel
- Campanhas em Meta Ads, Google, Bing, TikTok e Taboola
- Atendimento por agente de IA, com leitura de texto, áudio, imagem e PDF
- Funil de qualificação automatizado, com roteamento por critério
- CRM multi-tenant: cada licenciado com dados isolados e funil independente
- Dashboards de ganhos e perdas com atribuição por campanha

## Tecnologias utilizadas

| Camada | Stack |
|---|---|
| Backend e automação | Node.js, Python |
| Banco de dados | Supabase (PostgreSQL), SQL |
| Orquestração | n8n |
| Integrações | APIs REST, JSON, webhooks |
| IA | Agentes para atendimento e qualificação |
| Mensuração | Pixels de conversão e rastreamento de origem |

## Arquitetura

```text
Anúncio
   ↓
Site (pixel)  →  Captura do lead
   ↓
Agente de IA  →  Atendimento inicial
   ↓
Funil de qualificação  →  Roteamento por critério
   ↓
CRM  →  Registro e atribuição ao consultor
   ↓
Dashboard  →  Ganhos, perdas e origem
```

Cada etapa grava evento no banco, o que permite reconstruir o caminho de qualquer lead e medir onde ele parou.

## Automações implementadas

- **Follow-up de reativação** — recupera leads dos últimos 45 dias respeitando teto diário de envios, horário comercial e intervalos variáveis para evitar bloqueio de canal.
- **Notificação de lead qualificado** — a cada 10 minutos identifica leads atribuídos ainda não comunicados e avisa o consultor responsável, com limite por ciclo e janela de horário.
- **Retenção de mídias** — expurgo automático de arquivos após 45 dias.

## Escala

Mais de mil leads atendidos pelo agente em operações de clientes distintos, com taxa de qualificação em torno de 27%. O agente responde em menos de um minuto e usa um buffer de 14 segundos para agrupar mensagens fragmentadas — o lead escreve em três mensagens soltas e recebe uma resposta única e coerente.

## O que aprendi

**Sem identificador único, cada área olha um número diferente.** Encontrei uma divergência entre os leads atribuídos pela plataforma de anúncios e as conversas registradas no sistema. Não era perda: era definição diferente de "lead" em cada ponta. Rastreabilidade virou requisito, não relatório.

**Modelagem de dados vem antes de tudo.** Errar a estrutura no início custou mais retrabalho do que qualquer falha nos fluxos.

**Automação precisa de ponto de falha visível.** Fluxo que quebra em silêncio é pior que processo manual, porque ninguém percebe até o prejuízo aparecer. Log e alerta viraram parte da entrega.

**Métrica isolada não explica queda de resultado.** Atribuir uma queda a uma única etapa do funil, sem medir as anteriores e posteriores, leva a decisão errada.

## Status

Em operação e evolução contínua.
