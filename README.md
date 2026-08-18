# Booking — Reserva de Salas de Reunião (Front-end)

Front-end da aplicação de reserva de salas de reunião. Este repositório contém **apenas o
cliente web**, construído em Next.js/React, que consome uma API REST desenvolvida separadamente
(repositório de back-end à parte).

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js `24.15.0` |
| Linguagem | TypeScript |
| Framework | Next.js `15.5` (App Router) + React `19` |
| Estilo | TailwindCSS `3.4` (mobile-first, breakpoints `md:`/`lg:`) |
| Lint / format | ESLint + Prettier |

## Pré-requisitos

- Node.js `24.15.0` (ou compatível)
- npm
- A API de back-end rodando em algum endereço acessível (por padrão, `http://localhost:3000`)

## Como rodar

```bash
# instalar dependências
npm install

# configurar variáveis de ambiente
cp .env.example .env.local
# edite .env.local se a API não estiver em http://localhost:3000

# subir o servidor de desenvolvimento
npm run dev
```

A aplicação sobe em **`http://localhost:3001`** (porta customizada nos scripts `dev`/`start`).

## Variáveis de ambiente

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base da API de back-end | `http://localhost:3000` |

## Docker

O repositório inclui um `Dockerfile` (imagem `node:24-alpine`, roda `npm install` e sobe o
servidor de desenvolvimento na porta `3001`). Não há `docker-compose.yml` — build e run são
feitos manualmente:

```bash
# build da imagem
docker build -t booking-front .

# run, publicando a porta e passando a URL da API
docker run -p 3001:3001 -e NEXT_PUBLIC_API_URL=http://localhost:3000 booking-front
```

Como o `.dockerignore` exclui os arquivos `.env*`, a variável `NEXT_PUBLIC_API_URL` não vai para
dentro da imagem — precisa ser passada no `docker run` (`-e` ou `--env-file .env.local`). Se a API
também rodar em Docker/localhost, ajuste o valor para o host acessível a partir do container (ex.:
`http://host.docker.internal:3000` no Docker Desktop).

## Integração com a API

Toda a comunicação com o back-end passa por `src/app/api/api.ts`, através de uma função central
`apiFetch` que injeta o header `Authorization: Bearer <token>` (quando há sessão) e trata erros
(a API retorna `{ message, error, statusCode }`, cujo `message` vira a mensagem de erro exibida
na tela).

Endpoints hoje consumidos:

| Método | Rota | Função em `api.ts` | Uso |
| --- | --- | --- | --- |
| POST | `/auth/login` | `login` | Autenticação, retorna tokens |
| POST | `/auth/logout` | `logout` | Invalida o refresh token |
| POST | `/user` | `createUser` | Cadastro de usuário |
| GET | `/user` | `allUsers` | Lista todos os usuários (admin) |
| GET | `/user/count` | `countUsers` | Indicador do painel admin |
| GET | `/user/:id` | `getUser` | Perfil de um usuário |
| GET | `/user/:id/reservations` | `getUserReservation` | Reservas do usuário logado |
| DELETE | `/user/:id` | `deleteUser` | Torna o usuário inativo |
| GET | `/room/active` | `getActiveRooms` | Salas disponíveis para reserva |
| GET | `/room` | `getAllRooms` | Todas as salas, inclusive removidas (admin) |
| GET | `/room/count` | `countRooms` | Indicador do painel admin |
| GET | `/room/:id/reservations` | `getRoomReservations` | Disponibilidade de uma sala |
| POST | `/room` | `createRoom` | Cadastro de sala (admin) |
| PATCH | `/room/:id` | `updateRoom` | Edição de sala (admin) |
| DELETE | `/room/:id` | `deleteRoom` | Remove a sala (soft delete → `RoomStatus.REMOVED`) |
| PATCH | `/room/:id/activate` | `activateRoom` | Reativa uma sala removida (admin) |
| POST | `/reservation` | `createReservation` | Cria uma reserva |
| DELETE | `/reservation/:id` | `deleteReservation` | Cancela uma reserva |
| PATCH | `/reservation/:id/complete` | `completeReservation` | Marca reserva como concluída |
| GET | `/reservation/count` | `countActiveReservations` | Indicador do painel admin |

## Autenticação e controle de acesso

- Login grava `accessToken`/`refreshToken` em cookies (`src/utils/lib/auth.ts`).
- `src/middleware.ts` protege as rotas: `/` e `/cadastro` são públicas (redirecionam pra
  `/platform` se já autenticado); qualquer outra rota exige um JWT válido (`accessToken` decodificado
  e não expirado), senão redireciona pra `/`.
- `/platform/admin_panel/*` exige adicionalmente `role === 'ADMIN'` no token — usuário comum é
  redirecionado de volta pra `/platform`.

## Estrutura de pastas

```
src/
├── app/
│   ├── page.tsx                 # Login
│   ├── cadastro/page.tsx        # Cadastro
│   ├── platform/
│   │   ├── layout.tsx           # Layout com Sidebar (drawer no mobile/tablet, fixo em lg:)
│   │   ├── page.tsx             # Listagem de salas disponíveis
│   │   ├── reservations/page.tsx# Minhas reservas (ativas + histórico)
│   │   └── admin_panel/page.tsx # Painel administrativo
│   ├── api/api.ts               # Cliente da API (todas as chamadas HTTP)
│   └── not-found.tsx
├── components/ui/                # Componentes reutilizáveis (cards, modais, tabelas, etc.)
├── utils/lib/
│   ├── auth.ts                  # Cookies, decode de JWT, usuário atual
│   ├── format.ts                # Formatação de datas/horas/iniciais
│   └── tailwind-merge.ts        # Helper `cn()` para mesclar classes Tailwind
└── middleware.ts                 # Guarda de rotas (auth + role)
```

## Design system

- Cores customizadas (`tailwind.config.ts`): `darkest-blue` (#00236F), `normal` (#444651, texto
  secundário), `border` (#C5C5D3).
- Componentes seguem um padrão único de props (`label`, `variant`, `onClick`, `disabled`,
  `className`) — ver `src/components/ui/Button.tsx` como referência.
- Todo layout é pensado mobile-first: classes base para mobile, `md:` para tablet, `lg:` para
  desktop (ex.: o menu lateral vira um drawer com hambúrguer abaixo de `lg:` e um sidebar fixo
  a partir daí).

## Principais funcionalidades

- **Autenticação**: login e cadastro de usuário.
- **Salas**: listagem com busca, filtro por capacidade/data, disponibilidade em grade semanal e
  reserva de horário.
- **Minhas reservas**: reservas ativas (cancelar/concluir) e histórico, com detalhes por reserva.
- **Painel administrativo** (`role: ADMIN`): indicadores (usuários ativos, salas cadastradas,
  reservas ativas, sala mais reservada), gestão de salas (criar/editar/remover/reativar) e de
  usuários (listar, tornar inativo).

## Lint, formatação e hooks

- `npm run lint` roda o ESLint (`eslint.config.mjs`, baseado em `eslint-config-next`).
- Prettier configurado em `.prettierrc` (`.prettierignore` define o que não formatar).
- Husky (`.husky/`) instalado automaticamente via script `prepare` no `npm install`: hook
  `pre-commit` roda `npm run lint` e bloqueia o commit se houver erro; hook `commit-msg` valida
  o formato da mensagem de commit.

## Licença

Ver [`LICENSE`](./LICENSE).
