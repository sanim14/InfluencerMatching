# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations proxy (`gpt-5-mini`)

## Project: Influencer Matching Platform ("Reach")

An AI-powered SaaS tool that helps brands discover and match with content creators.

### Frontend
- React + Vite app at `artifacts/influencer-platform/`
- Routes: `/` (input), `/results` (influencer cards + filtering)
- Features: influencer recommendations, client-side filtering, outreach generation, copy/Gmail export

### Backend
- Express API server at `artifacts/api-server/`
- `POST /api/recommend` — AI-powered influencer matching (top 5 from 13 hardcoded influencers)
- `POST /api/outreach` — personalized outreach message generation

### Key API Routes
- `GET /api/healthz` — health check
- `POST /api/recommend` — body: `{ product, audience }` → returns top 5 influencers with scores and reasoning
- `POST /api/outreach` — body: `{ influencer, product, audience }` → returns personalized outreach message

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
