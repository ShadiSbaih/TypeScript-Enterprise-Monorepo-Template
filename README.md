# TypeScript Enterprise Monorepo Template

A production-ready, full-stack TypeScript monorepo template built with **Turborepo**, **pnpm workspaces**, and modern enterprise standards across backend, frontend, mobile, AI, and infrastructure.

> **Note**: No dependencies have been pre-installed. Run `pnpm install` when you are ready to bootstrap the repository.

---

## Architecture Overview

```text
├── .github/
│   └── workflows/
│       └── ci.yml                 # Turborepo remote caching CI/CD pipeline
├── apps/
│   ├── ai-service/                # Fastify AI service (Google GenAI, Vercel AI SDK, LangChain, OpenAI)
│   ├── mobile/                    # React Native / Expo application
│   ├── server/                    # Fastify API (Prisma, Zod, Swagger, JWT, Pino)
│   └── web/                       # Next.js 14 App Router (Tailwind, TanStack Query, Zustand)
├── packages/
│   ├── database/                  # Prisma ORM & Drizzle schema, singleton DB client
│   ├── eslint-config/             # Shared ESLint rules for TypeScript, React, Next.js, and Node
│   ├── tsconfig/                  # Centralized TypeScript configurations (base, react, nextjs, node)
│   ├── types/                     # Shared Zod schemas and cross-boundary TypeScript DTOs
│   ├── ui/                        # Reusable component design system (Radix UI, CVA, Tailwind)
│   └── utils/                     # Shared utility helpers (clsx, nanoid, date-fns, tailwind-merge)
├── infra/
│   ├── ai/                        # Kubernetes AI service deployment manifest
│   ├── cloud/                     # Terraform IaC for AWS VPC and container services
│   └── docker/                    # Multi-container Docker Compose (Postgres 16, Redis 7, services)
├── .env.example                   # Master environment variable template
├── package.json                   # Root workspace scripts and developer tooling
├── pnpm-workspace.yaml            # pnpm workspace definition
├── turbo.json                     # Turborepo task pipeline and caching rules
└── README.md
```

---

## Included TypeScript Ecosystem Libraries

### 1. Developer Tooling & Monorepo Engine (Root)
| Library | Purpose |
| :--- | :--- |
| `turbo` | High-performance monorepo build system & task runner with remote caching |
| `typescript` | Static type checker across all packages and apps |
| `prettier` | Opinionated code formatter across JSON, TS, YAML, and Markdown |
| `eslint` | Pluggable linting utility |
| `husky` & `lint-staged` | Git hooks for automated pre-commit linting and formatting |
| `@changesets/cli` | Automated semantic versioning and changelog generator |
| `syncpack` | Consistency enforcement for dependencies across workspaces |

### 2. Apps

#### **[apps/server](file:///c:/Users/shadi/Desktop/New%20folder/apps/server)** (Backend API)
- **Runtime & Web Framework**: `fastify`, `fastify-plugin`
- **Security & Validation**: `@fastify/helmet`, `@fastify/cors`, `@fastify/jwt`, `@fastify/rate-limit`, `zod`, `bcryptjs`
- **Documentation**: `@fastify/swagger`, `@fastify/swagger-ui` (Live OpenAPI interactive docs at `/docs`)
- **Logging**: `pino`, `pino-pretty`
- **Data Access**: `@repo/database` (Prisma ORM)
- **Testing & Dev**: `tsx`, `vitest`, `supertest`

#### **[apps/web](file:///c:/Users/shadi/Desktop/New%20folder/apps/web)** (Web Frontend)
- **Framework**: `next` (Next.js 14 App Router)
- **UI & State**: `react`, `react-dom`, `zustand`, `framer-motion`, `sonner`
- **Data Fetching**: `@tanstack/react-query`, `@tanstack/react-table`, `axios`
- **Forms & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Styling**: `tailwindcss`, `postcss`, `autoprefixer`, `tailwind-merge`, `clsx`, `lucide-react`
- **Shared Components**: `@repo/ui`, `@repo/types`, `@repo/utils`

#### **[apps/mobile](file:///c:/Users/shadi/Desktop/New%20folder/apps/mobile)** (Mobile Client)
- **Framework**: `expo`, `react-native`
- **Navigation**: `@react-navigation/native`, `@react-navigation/stack`, `react-native-screens`, `react-native-safe-area-context`
- **Gestures**: `react-native-gesture-handler`
- **State & Data**: `zustand`, `@tanstack/react-query`, `zod`
- **Icons**: `lucide-react-native`

#### **[apps/ai-service](file:///c:/Users/shadi/Desktop/New%20folder/apps/ai-service)** (AI Inference Service)
- **AI SDKs**: `@google/genai`, `ai` (Vercel AI SDK), `@ai-sdk/google`, `@ai-sdk/openai`, `openai`
- **Agentic & Chaining**: `langchain`, `@langchain/core`, `@langchain/community`
- **Service Layer**: `fastify`, `@fastify/cors`, `zod`, `pino`

### 3. Shared Internal Packages

- **[@repo/database](file:///c:/Users/shadi/Desktop/New%20folder/packages/database)**: Prisma Client singleton, migration scripts, PostgreSQL driver (`pg`), Drizzle ORM definitions.
- **[@repo/ui](file:///c:/Users/shadi/Desktop/New%20folder/packages/ui)**: Radix UI primitives (`@radix-ui/react-slot`, `react-dialog`, `react-dropdown-menu`, `react-toast`), CVA variants (`class-variance-authority`), and Lucide icons.
- **[@repo/types](file:///c:/Users/shadi/Desktop/New%20folder/packages/types)**: Domain entities (User, Auth, AI Inference), generic API Response envelope, and Zod runtime schema validators.
- **[@repo/utils](file:///c:/Users/shadi/Desktop/New%20folder/packages/utils)**: Tailwind class merger (`cn`), ID generator (`nanoid`), date utilities (`date-fns`).
- **[@repo/tsconfig](file:///c:/Users/shadi/Desktop/New%20folder/packages/tsconfig)**: Strict type-checking rulesets for base, React, Next.js, and Node.
- **[@repo/eslint-config](file:///c:/Users/shadi/Desktop/New%20folder/packages/eslint-config)**: TypeScript and React ESLint configs with Prettier integration.

---

## Getting Started (When You Are Ready To Install)

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Initialize Local Services (PostgreSQL & Redis)**:
   ```bash
   pnpm docker:up
   ```

3. **Generate Database Client**:
   ```bash
   pnpm db:generate
   ```

4. **Start Development Environment**:
   ```bash
   pnpm dev
   ```
