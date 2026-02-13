# Documentação da Página Home (Eventos)

Este documento descreve a estrutura, funcionalidades, segurança e fluxo de dados da página principal de eventos do aplicativo.

## 🎨 Estilização e Design (`home.page.scss`)

A interface segue um **Tema Escuro (Dark Mode)** focado em conteúdo, utilizando as seguintes diretrizes:

*   **Cores Principais**: Fundo `#0e0e11` (Preto Fosco) e Destaques `#8b5cff` (Roxo Neon).
*   **Responsividade**: Layout adaptável que alterna entre botões empilhados (mobile) e lado a lado (desktop/tablet).
*   **Componentes Customizados**: Inputs de data transparentes e cards de eventos com espaçamento uniforme.

---

## ⚙️ Funcionalidades da Página

As funções abaixo são inferidas com base nos componentes de interface presentes na página:

### 1. Gestão de Eventos
*   **`createEvent()`**: Acionada pelo botão "Criar Evento". Deve abrir um Modal ou navegar para a rota de criação de novo evento.
*   **`loadEvents()`**: Função inicial chamada no `ngOnInit` para buscar a lista de eventos da API.

### 2. Filtros e Pesquisa
*   **`onSearch(event)`**: Captura o input da `ion-searchbar`. Implementa *debounce* para filtrar a lista localmente ou fazer nova requisição à API baseada no termo digitado.
*   **`filterByDate(startDate, endDate)`**: Aplica filtros baseados nos inputs de data "De" e "Até".
*   **`filterByCategory(category)`**: Atualiza a lista baseada na seleção do `ion-select`.

### 3. Controle de Lista e UX
*   **`doRefresh(event)`**: Acionado pelo componente `ion-refresher`. Recarrega os dados da API e limpa o estado de carregamento.
*   **`loadData(event)`**: Acionado pelo `ion-infinite-scroll`. Busca a próxima página de dados (paginação) quando o usuário chega ao fim da lista.

---

## 🔒 Segurança

Medidas de segurança recomendadas e esperadas para esta página:

1.  **Autenticação de Rota (Guards)**:
    *   A página deve estar protegida por um `AuthGuard` (Angular CanActivate) para impedir acesso de usuários não logados.

2.  **Sanitização de Inputs**:
    *   Os valores inseridos na barra de busca e filtros devem ser tratados para evitar ataques de XSS (Cross-Site Scripting) antes de serem renderizados ou enviados ao backend.

3.  **Tratamento de Erros**:
    *   Falhas no carregamento da API não devem expor *stack traces* ao usuário final, exibindo apenas mensagens amigáveis (Toasts/Alerts).

---

## 💾 Esquema de Armazenamento de Dados

O fluxo de dados segue o padrão de arquitetura do Ionic/Angular:

### Fonte de Dados (Backend)
*   Os dados são consumidos de uma **API RESTful** ou **GraphQL**.
*   **Formato**: JSON.
*   **Endpoint Típico**: `GET /api/events`

### Modelagem de Dados (Interface TypeScript)
Exemplo da estrutura de dados esperada para um evento:

```typescript
interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  localizacao: string;
  imagemUrl?: string;
  categoria: string;
}
```

### Estado Local e Cache
*   **Variáveis Locais**: Os eventos são armazenados em um array `events: Evento[]` dentro do componente para renderização.
*   **Paginação**: Controle via variáveis `page` e `limit` para o Infinite Scroll.