# Teste Técnico — Desenvolvedor Full Stack

## Aplicativo de Feiras e Exposições (FeirApp)

**Prazo de entrega:** 7 dias corridos
**Repositório:** GitHub ou GitLab (público ou privado com acesso concedido)

---

## 1. Visão Geral do Projeto

Você deverá desenvolver uma plataforma chamada **FeirApp** — um aplicativo para que usuários de feiras e exposições possam consultar, se inscrever e gerenciar os eventos que estão acontecendo na cidade onde se encontram.

O projeto deve contemplar os seguintes componentes:

- **App Mobile + Web (mesmo codebase):** Ionic com Angular, compilando para Android/iOS via Capacitor e versão Web publicada no Firebase Hosting.
- **API Backend (REST):** Publicada no Google Cloud Run em container Docker.
- **Banco de Dados:** SQL (PostgreSQL ou MySQL) ou NoSQL (MongoDB), à escolha do candidato — justificar a decisão no README.
- **Autenticação:** Sistema de login/registro com sessão autenticada via JWT.
- **Push Notifications:** Alertas push disparados via cron job no backend.

---

## 2. Requisitos Funcionais

### 2.1 Autenticação e Perfil de Usuário

1. Registro de novo usuário com: nome completo, e-mail, senha e cidade atual.
2. Login por e-mail e senha, retornando um JWT válido.
3. Logout com invalidação do token (blacklist ou estratégia equivalente).
4. Tela de perfil com possibilidade de editar nome e cidade.
5. Middleware/guard de autenticação protegendo todas as rotas privadas da API e do app.

### 2.2 Catálogo de Eventos (Feiras e Exposições)

Os eventos devem ser pré-cadastrados via seed/migration ou painel admin (opcional). Cada evento deve conter:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID / Auto | Identificador único do evento |
| `titulo` | String | Nome da feira/exposição |
| `descricao` | Text | Descrição detalhada do evento |
| `imagemUrl` | String | URL do banner/imagem do evento |
| `dataInicio` | DateTime | Data e hora de início |
| `dataFim` | DateTime | Data e hora de encerramento |
| `local` | String | Endereço / nome do local |
| `cidade` | String | Cidade onde o evento ocorre |
| `categoria` | String/Enum | Ex: Tecnologia, Agronegócio, Moda, Arte, etc. |
| `lotacaoMax` | Integer | Número máximo de inscritos |
| `inscritosCount` | Integer | Contagem atual de inscritos |

Funcionalidades esperadas no catálogo:

1. Listagem dos eventos da cidade do usuário (filtro automático por cidade).
2. Busca textual por título ou descrição.
3. Filtros por categoria e por intervalo de datas.
4. Tela de detalhe do evento com todas as informações e botão de inscrição.
5. Indicação visual se o evento está lotado, se o usuário já está inscrito, ou se o evento já encerrou.

### 2.3 Inscrição e Cancelamento

1. Usuário autenticado pode se inscrever em um evento (desde que não esteja lotado e ainda esteja no futuro).
2. Usuário pode cancelar inscrição a qualquer momento antes do início do evento.
3. Tela **"Meus Eventos"** listando todos os eventos em que o usuário está inscrito, separados em **"Próximos"** e **"Passados"**.
4. A API deve impedir inscrição duplicada no mesmo evento.
5. A API deve impedir inscrição quando a lotação máxima for atingida, retornando erro apropriado.

### 2.4 Push Notifications via Cron Job

Implementar um sistema de notificações push com as seguintes regras:

- **Lembrete 24h antes:** Um cron job roda diariamente e verifica os eventos que começam nas próximas 24 horas. Envia push notification para todos os inscritos com a mensagem: *"Lembrete: [nome do evento] começa amanhã!"*
- **Novo evento na cidade:** Quando um novo evento é cadastrado, um job deve notificar todos os usuários cuja cidade corresponde à do evento: *"Novo evento na sua cidade: [nome do evento]."*
- **Evento lotando (80% da capacidade):** Quando um evento atinge 80% da lotação máxima, os usuários da cidade que ainda não estão inscritos devem receber: *"O evento [nome] está quase lotado! Garanta sua vaga."*

Requisitos técnicos das notificações:

- Usar Firebase Cloud Messaging (FCM) ou Web Push API.
- O cron job deve rodar na API backend (pode usar node-cron, Bull Queue, @nestjs/schedule ou equivalente).
- Tokens de push de cada dispositivo devem ser armazenados no banco, vinculados ao usuário.
- Implementar endpoint para o app registrar/atualizar o push token do dispositivo.
- Jobs devem ser **idempotentes** — rodar duas vezes não pode enviar notificação duplicada.
- Implementar logging de execução dos jobs (quando rodou, quantas notificações enviou, erros).

---

## 3. Requisitos Técnicos

### 3.1 Frontend — Ionic + Angular

- Versão mínima: Ionic 7+ com Angular 17+ (standalone components preferencialmente).
- Mesmo codebase para mobile (Capacitor) e web.
- Usar Ionic Components nativos (`ion-card`, `ion-list`, `ion-searchbar`, etc.).
- Implementar lazy loading de módulos/rotas.
- Implementar guards de rota para proteger telas autenticadas.
- Gerenciamento de estado via services com `BehaviorSubject`, NgRx, ou similar.
- Tratamento de erros com feedback visual ao usuário (toasts, alerts).

### 3.2 Backend — API REST

- Framework: Node.js com Express ou NestJS (TypeScript), ou outra tecnologia à escolha — justificar no README.
- Arquitetura em camadas: Controller/Route → Service → Repository/Model.
- Autenticação JWT com access token (validade curta) e opcionalmente refresh token.
- Validação de entrada (DTOs) em todos os endpoints.
- Tratamento de erros padronizado com códigos HTTP apropriados.
- Documentação da API via Swagger/OpenAPI ou coleção Postman/Insomnia.
- Migrations e Seeds para criar o schema e popular dados iniciais.
- **Dockerfile** funcional para build e execução do container.

### 3.3 Banco de Dados

O candidato pode escolher entre SQL ou NoSQL, desde que justifique no README:

- Modelar corretamente os relacionamentos (Usuário, Evento, Inscrição, PushToken).
- Implementar migrations versionadas.
- Seed com pelo menos **10 eventos** e **3 usuários de teste**.
- Índices apropriados para buscas frequentes (cidade, datas, full-text search).

### 3.4 Deploy e Infraestrutura (Free Tier do GCP)

Todo o deploy deve ser feito utilizando o **free tier do Google Cloud Platform**. Abaixo as opções recomendadas:

| Componente | Plataforma (Free Tier) | Detalhes do Free Tier |
|---|---|---|
| **Frontend Web** | Firebase Hosting | 10 GB de armazenamento, 360 MB/dia de transferência. Gratuito. |
| **Backend API** | Cloud Run | 2 milhões de requests/mês, 360.000 GiB-segundos de memória, 180.000 vCPU-segundos. |
| **Banco de Dados** | Firestore (NoSQL) | 1 GiB armazenamento, 50k leituras/dia, 20k escritas/dia. |
|  | *ou* Cloud SQL (PostgreSQL) | Instância `db-f1-micro` — free tier limitado a 30h/mês (*atenção ao custo se exceder*). |
|  | *ou* Supabase / Neon (externo) | Planos free generosos para PostgreSQL. Alternativa válida. |
|  | *ou* MongoDB Atlas (externo) | Cluster M0 gratuito (512 MB). Alternativa válida. |
| **Push** | Firebase Cloud Messaging (FCM) | Totalmente gratuito, sem limites de mensagens. |
| **Secrets** | Secret Manager | 6 versões ativas gratuitas. Usar para credenciais do banco e chaves JWT. |
| **Logs** | Cloud Logging | 50 GiB/mês de ingestão gratuita. |

> **Dica:** Para manter o custo **zero**, preferir Firestore ou um banco externo gratuito (Supabase, Neon, MongoDB Atlas) em vez do Cloud SQL, que pode gerar custos se a instância ficar ligada além do free tier.

Requisitos do deploy:

1. A versão web deve estar publicada e acessível via URL do Firebase Hosting.
2. A API deve estar rodando em um serviço do Cloud Run com endpoint HTTPS público.
3. O frontend web deve apontar para a API no Cloud Run (variável de ambiente ou `environment.ts`).
4. O README deve conter as **URLs de acesso** ao app e à API em ambiente de produção.
5. Incluir instruções para rodar o projeto localmente (desenvolvimento).
6. Documentar no README quais serviços do GCP free tier foram utilizados e como configurá-los.

---

## 4. Telas Esperadas no Aplicativo

| Tela | Descrição |
|---|---|
| **Login** | Formulário de e-mail e senha com validação. Link para registro. |
| **Registro** | Formulário com nome, e-mail, senha, confirmação de senha e cidade. Validações. |
| **Home / Feed** | Lista de eventos da cidade do usuário. Barra de busca, filtros por categoria e data. Pull-to-refresh. Infinite scroll ou paginação. |
| **Detalhe do Evento** | Imagem, título, descrição, data/hora, local, categoria, inscritos/lotação. Botão "Inscrever-se" ou "Cancelar Inscrição". |
| **Meus Eventos** | Abas/segmentos: "Próximos" e "Passados". Opção de cancelar inscrição nos próximos. |
| **Perfil** | Exibição e edição de nome e cidade. Botão de logout. |

---

## 5. Endpoints Mínimos da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Login, retorna JWT |
| `POST` | `/api/auth/logout` | Logout (invalida token) |
| `GET` | `/api/users/me` | Dados do usuário logado |
| `PATCH` | `/api/users/me` | Atualizar perfil |
| `GET` | `/api/events` | Listar eventos (query: cidade, categoria, busca, dataInicio, dataFim, page, limit) |
| `GET` | `/api/events/:id` | Detalhe de um evento |
| `POST` | `/api/events/:id/subscribe` | Inscrever-se no evento |
| `DELETE` | `/api/events/:id/subscribe` | Cancelar inscrição |
| `GET` | `/api/users/me/events` | Listar eventos inscritos do usuário |
| `POST` | `/api/push/register` | Registrar push token do dispositivo |

---

## 6. Critérios de Avaliação

| Critério | Peso | O que será avaliado |
|---|---|---|
| **Funcionalidade Completa** | 25% | Todos os requisitos funcionais implementados e funcionando. |
| **Qualidade do Código** | 20% | Clean Code, SOLID, separação de responsabilidades, nomeação. |
| **Arquitetura e Estrutura** | 15% | Organização de pastas, camadas, modularização, reutilização. |
| **Deploy Funcional** | 10% | App acessível no Firebase Hosting e API rodando no Cloud Run. |
| **UX e Interface** | 10% | Usabilidade, responsividade, feedback visual, uso correto dos componentes Ionic. |
| **API e Banco de Dados** | 10% | Modelagem correta, validações, tratamento de erros, migrations. |
| **Push Notifications + Cron** | 5% | Implementação funcional dos jobs e envio de push. |
| **Documentação e Testes** | 5% | README completo, doc da API, testes unitários/integração. |

---

## 7. Diferenciais (Bônus)

Os itens abaixo não são obrigatórios, mas agregam pontos extras:

- Docker Compose para rodar toda a stack localmente com um único comando.
- Painel administrativo para CRUD de eventos (role `admin`).
- Geolocalização real via Capacitor Geolocation para detectar a cidade automaticamente.
- Testes E2E com Cypress ou Playwright.
- CI/CD pipeline (GitHub Actions ou Cloud Build) fazendo deploy automático no Firebase Hosting e Cloud Run.
- Rate limiting e proteção contra brute force nos endpoints de autenticação.
- Refresh token com rotação.
- Cache com Redis ou Cloud Memorystore para listagens de eventos.
- Upload de imagem de perfil do usuário (Cloud Storage).
- Modo offline com sincronização.
- Dark mode funcional.
- Monitoramento com Cloud Logging / Cloud Monitoring integrado.

---

## 8. Entregáveis

1. **Repositório Git** com histórico de commits organizado e significativo (não entregar em um único commit).
2. **README.md** contendo: descrição do projeto, tecnologias utilizadas com justificativa, instruções de instalação e execução local, credenciais de teste, decisões arquiteturais, URLs de produção (Firebase Hosting e Cloud Run), e o que faria diferente com mais tempo.
3. **Documentação da API** (Swagger UI rodando ou coleção Postman/Insomnia exportada).
4. **Seed funcional:** ao rodar o projeto pela primeira vez, o banco deve conter dados de exemplo.
5. **Deploy funcional:** URLs acessíveis do app web (Firebase Hosting) e da API (Cloud Run).
6. **Dockerfile** do backend funcional e testado.

---

## 9. Ferramenta de Auxílio: Gemini CLI

O candidato é **encorajado** a utilizar o **Gemini CLI** como assistente de desenvolvimento durante o teste. O Gemini CLI é a ferramenta de linha de comando do Google que permite interagir com os modelos Gemini diretamente do terminal para auxiliar em tarefas de codificação.

### Instalação

```bash
npm install -g @google/gemini-cli

# verificar instalação
gemini --version
```

O free tier do Gemini CLI oferece **60 requests/min** e **1.000 requests/dia** com uma conta pessoal do Google, usando o **Gemini 2.5 Pro** com janela de contexto de 1M tokens.

> Documentação oficial: https://github.com/google-gemini/gemini-cli

### Sugestões de uso durante o teste

- **Scaffolding do projeto:** gerar a estrutura inicial do Ionic, NestJS, Dockerfile, etc.
- **Modelagem do banco:** pedir sugestões de schema, migrations e seeds.
- **Implementação de cron jobs:** auxiliar na lógica de agendamento e idempotência.
- **Configuração de deploy:** gerar os comandos `gcloud` para Cloud Run e configuração do Firebase Hosting.
- **Debugging:** colar erros no terminal e pedir ajuda para resolver.
- **Testes:** gerar testes unitários e de integração a partir do código implementado.
- **Documentação:** auxiliar na escrita do README e na configuração do Swagger.

### Importante

- O uso do Gemini CLI é **permitido e incentivado**, mas o candidato deve **entender e ser capaz de explicar** todo o código gerado.
- Na entrevista técnica que acompanha este teste, poderão ser feitas perguntas sobre decisões de implementação, e o candidato deve demonstrar domínio do que foi entregue.
- O objetivo não é avaliar se o candidato escreveu cada linha manualmente, mas sim sua capacidade de **conduzir o desenvolvimento, tomar decisões arquiteturais e entregar um produto funcional.**

---

## 10. Stack Tecnológica Sugerida

| Camada | Tecnologia |
|---|---|
| Frontend | Ionic 7 + Angular 17+ + Capacitor 5+ |
| Backend | Node.js + NestJS (ou Express) + TypeScript |
| Banco de Dados | PostgreSQL com Prisma/TypeORM, ou MongoDB com Mongoose |
| Autenticação | JWT (jsonwebtoken / @nestjs/jwt) |
| Push | Firebase Cloud Messaging (FCM) via firebase-admin |
| Cron Jobs | node-cron, @nestjs/schedule, ou Bull Queue |
| Doc da API | Swagger / @nestjs/swagger |
| Testes | Jest + Supertest (API) / Jasmine + Karma (Angular) |
| Deploy Web | Firebase Hosting (free tier) |
| Deploy API | Google Cloud Run (free tier) |
| Banco Cloud | Firestore (free tier), Supabase, Neon ou MongoDB Atlas (plano gratuito) |

> A stack acima é uma sugestão. O candidato pode usar tecnologias alternativas desde que justifique no README.

---

## 11. Cenário de Validação

Durante a avaliação, o seguinte fluxo será executado para validar a entrega:

1. Acessar a URL do Firebase Hosting e verificar que o app carrega corretamente.
2. Criar uma conta de usuário com cidade "São Paulo".
3. Verificar que a home exibe apenas eventos de São Paulo.
4. Buscar um evento por texto e filtrar por categoria.
5. Abrir o detalhe de um evento e se inscrever.
6. Verificar na tela "Meus Eventos" que o evento aparece em "Próximos".
7. Cancelar a inscrição e verificar que o evento some da lista.
8. Tentar se inscrever em um evento lotado e verificar a mensagem de erro.
9. Editar o perfil, mudar a cidade para "Rio de Janeiro" e verificar que a home atualiza.
10. Verificar os logs do Cloud Run para confirmar execução dos cron jobs.
11. Acessar a documentação da API (Swagger ou Postman) e testar endpoints diretamente.
12. Verificar que a mesma aplicação funciona no navegador desktop e mobile (responsividade).

---

**Boa sorte!** Em caso de dúvidas sobre o teste, entre em contato pelo e-mail fornecido.
