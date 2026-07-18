# Taisa Ateliê — Frontend

SPA em React + TypeScript + Vite para o salão Taisa Ateliê: site público com catálogo de serviços, galeria e agendamento online, mais painel administrativo autenticado com agenda, clientes, serviços e KPIs.

Consome a API do repositório [`project-taisa-atelier`](https://github.com/samdouglask88/project-taisa-atelier).

## Sumário

- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Configuração (variáveis de ambiente)](#configuração-variáveis-de-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Scripts npm](#scripts-npm)
- [Rotas e páginas](#rotas-e-páginas)
- [Autenticação](#autenticação)
- [Design system](#design-system)
- [Dados de contato do salão](#dados-de-contato-do-salão)
- [CI](#ci)
- [Limitações conhecidas / próximos passos](#limitações-conhecidas--próximos-passos)

## Stack

- **React 19** + **TypeScript**
- **Vite 8** (build e dev server)
- **React Router 7**
- **Recharts** (gráficos do dashboard)
- **lucide-react** (ícones vetoriais)
- **CSS puro** com design system próprio em `src/index.css` — sem framework de CSS

## Arquitetura

```
src/
├── main.tsx                    # bootstrap React + import do design system
├── App.tsx                     # rotas, PrivateRoute, layout condicional
├── index.css                   # design system completo (variáveis, componentes, animações)
├── config/
│   └── site.ts                 # fonte única dos dados de contato do salão (ver seção)
├── context/
│   └── AuthContext.tsx         # sessão: login/logout, persistência em localStorage
├── services/
│   └── api.ts                  # apiFetch tipado: base URL, JSON e Bearer token automáticos
├── components/
│   ├── layout/                 # Header (navbar fixa) e Footer do site público
│   ├── PrivateRoute.tsx        # guarda de rota autenticada
│   ├── Reveal.tsx              # scroll-reveal via IntersectionObserver
│   └── WhatsAppFloat.tsx       # botão flutuante de WhatsApp (páginas públicas)
├── pages/
│   ├── Home.tsx                # hero, serviços em destaque, sobre, carrossel de depoimentos
│   ├── Servicos.tsx            # catálogo com filtro por categoria (dados da API + fallback)
│   ├── Agendamento.tsx         # fluxo de booking em etapas (serviço → data/hora → dados)
│   ├── Galeria.tsx             # galeria de fotos com filtro
│   ├── Contato.tsx             # formulário + informações de contato
│   ├── Login.tsx               # acesso ao painel
│   └── Dashboard.tsx           # painel: KPIs, gráficos, agendamentos, clientes, serviços
├── types/
│   ├── index.ts                # tipos internos (pt-BR) usados pelas telas
│   └── api.ts                  # shapes das respostas da API (inglês) consumidos pelos mappers
├── utils/
│   └── serviceIcons.tsx        # mapeia serviço/categoria → ícone lucide
└── assets/                     # fotos usadas na Home e na Galeria
```

Convenção: o backend fala inglês (`name`, `price`), as telas falam português (`nome`, `preco`). A conversão acontece em mappers locais de cada página, tipados com `types/api.ts` — nenhum `any` no projeto (ESLint zerado).

## Configuração (variáveis de ambiente)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | só em produção | URL base da API. Sem ela, usa `http://localhost:3333` (dev) |

Em produção, defina em `.env.production` ou no ambiente de build (Vercel/Netlify/CI).

## Instalação e execução

```bash
npm install

# a API precisa estar rodando (ver README do project-taisa-atelier)
npm run dev
```

O site sobe em `http://localhost:5173`. O painel fica em `/login` — contas são criadas pelo backend via `npm run create-admin`.

## Scripts npm

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server do Vite com HMR |
| `npm run build` | Typecheck (`tsc -b`) + build de produção em `dist/` |
| `npm run lint` | ESLint em todo o projeto |
| `npm run preview` | Serve o build de produção localmente |

## Rotas e páginas

| Rota | Acesso | Página |
|---|---|---|
| `/` | 🌐 | Home |
| `/servicos` | 🌐 | Catálogo de serviços (dados reais da API; fallback estático se ela estiver fora) |
| `/agendamento` | 🌐 | Booking em etapas — envia para `POST /appointments/book` |
| `/galeria` | 🌐 | Galeria com filtro por categoria |
| `/contato` | 🌐 | Formulário + contatos + atalho de WhatsApp |
| `/login` | 🌐 | Login do painel (sem Header/Footer) |
| `/dashboard` | 🔒 | Painel administrativo (KPIs, agenda, clientes, serviços) |
| `/admin` | — | Redireciona para `/dashboard` |
| `*` | — | Redireciona para `/` |

## Autenticação

- `AuthContext` guarda `{ user }` em estado e persiste sessão em `localStorage` (`taisa_token` + `taisa_user`), restaurada por inicialização lazy do `useState`
- `apiFetch` injeta `Authorization: Bearer <token>` automaticamente em toda chamada
- **Logout revoga o token no servidor** (`POST /auth/logout`) antes de limpar o storage — se a API estiver fora, o logout local acontece mesmo assim
- `PrivateRoute` redireciona para `/login` quando não autenticado

## Design system

Tudo em `src/index.css`, sem framework:

- **Variáveis CSS**: paleta (vinho `--wine`, dourado `--gold`, rosé `--rose`, creme `--cream`), sombras, raios, transições
- **Tipografia**: Cormorant Garamond (display) + Jost (corpo), via Google Fonts
- **Componentes de classe**: botões (`.btn-*`), cards, formulários, badges de status, navbar, sidebar do dashboard, calendário/slots do booking, galeria, carrossel de depoimentos
- **Animações**: `fadeUp`, `float`, `shimmer` + scroll-reveal (`.reveal` / `.is-visible`, com suporte a `prefers-reduced-motion`)

O scroll-reveal é aplicado pelo componente `Reveal` (IntersectionObserver, dispara uma vez, com `delay` opcional para stagger).

## Dados de contato do salão

`src/config/site.ts` é a **fonte única** de telefone, e-mail, endereço, Instagram, horários e número de WhatsApp — usado pelo Footer, Contato e botão flutuante.

> ⚠️ Telefone, e-mail e endereço atuais são **placeholders** marcados com `TODO(lançamento)`. Trocar pelos dados reais antes de publicar.

## CI

Workflow em `.github/workflows/ci.yml`: a cada push/PR na `main`, roda `lint` + `typecheck` + `build` em Node 22. O estágio de deploy será adicionado quando a hospedagem for definida.

## Limitações conhecidas / próximos passos

- As fotos da Galeria e da Home são **imagens de banco (stock)** — substituir por fotos reais do ateliê antes do lançamento
- Os números da Home ("500+ clientes", "4.9★", "5 anos") precisam ser confirmados com o salão
- O formulário de Contato é simulado no front (não envia para a API) — integrar quando houver canal de recebimento definido
- O bundle principal passa de 500 kB minificado (aviso do Vite) — code-splitting por rota é a melhoria natural quando a performance virar prioridade
- Deploy pendente da decisão de hospedagem (front estático: Vercel/Netlify)
