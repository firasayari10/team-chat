# Team Chat

Real-time team collaboration and messaging: workspaces, channels, direct conversations, threaded messages, reactions, and file attachments in a Slack-like interface. Built with Next.js and Convex.

<table>
<tr>
<td width="50%">

**Try the app**

Live deployment (Vercel):

**[team-chat-wheat.vercel.app](https://team-chat-wheat.vercel.app)**

</td>
<td width="50%">

**Run it locally**

Clone, install, set env vars, then:

`npx convex dev` and `npm run dev`

Details are in [Running the project](#running-the-project-on-a-new-machine) below.

</td>
</tr>
</table>

This readme explains what the project does, why it is structured the way it is, which technologies it uses and why, and how to run it on another machine. Reading it top to bottom gives you a full picture; the table of contents is there if you want to jump.

---

## Table of contents

| Section | What you'll get |
|--------|------------------|
| [Project goals](#project-goals) | What the app is built to achieve. |
| [Architecture advantages](#architecture-advantages) | How the codebase is organized and why it pays off. |
| [Advantages (product and stack)](#advantages-product-and-stack) | High-level benefits of the chosen stack. |
| [Tech stack and technology advantages](#tech-stack-and-technology-advantages) | Every technology used and the advantage each one brings. |
| [Repository structure](#repository-structure-high-level) | Where to find what in the repo. |
| [Prerequisites](#prerequisites) | What you need installed before running the app. |
| [Environment variables](#environment-variables) | Required env vars and what they do. |
| [Running the project on a new machine](#running-the-project-on-a-new-machine) | Step-by-step run guide. |
| [Common issues](#common-issues) | Frequent pitfalls and how to fix them. |
| [Scripts reference](#scripts-reference) | npm scripts and Convex CLI usage. |

---

## Project goals

The app is designed around a few clear objectives: workspace-centric collaboration, channel and DM communication, rich messaging, and a real-time, portable setup.

| Goal | Description |
|------|-------------|
| **Workspace-centric collaboration** | Organize teams into workspaces with join codes; each workspace has channels and supports direct messages between members. |
| **Channel and DM communication** | Public channel messaging and one-to-one conversations within a workspace, with consistent UX and real-time updates. |
| **Rich messaging** | Compose messages with a Quill-based rich text editor, inline images, and emoji support; view threads and react to messages. |
| **Authentication and access control** | Sign in via email/password or OAuth (GitHub, Google); protect routes and Convex functions by user and workspace membership; enforce admin vs member roles where needed. |
| **Real-time experience** | Use Convex for live queries and mutations so message lists, threads, and reactions update without manual refresh. |
| **Portable setup** | Run the full stack (Next.js app and Convex backend) on another machine using clear environment and CLI steps. |

---

## Architecture advantages

The project is structured to keep boundaries clear, reduce coupling, and make changes predictable. If you care about maintainability and onboarding, this section is the one to read.

- **Feature-based organization**  
  Code is grouped by domain under `src/features/` (auth, workspaces, channels, members, conversations, messages, reactions, upload). Each feature owns its components, API hooks (Convex `useQuery`/`useMutation` wrappers), and optional stores.  
  *Why it helps:* Locate all logic for a capability in one place; add or remove features without scattering edits; onboard new developers by feature rather than by layer.

- **Single backend surface**  
  Convex is the only backend. Database, auth, storage, and HTTP routes live there.  
  *Why it helps:* No separate API server to deploy or scale; one security and deployment model; real-time and request–response use the same data layer.

- **Type-safe data flow**  
  Convex schema and function args/returns drive generated TypeScript types; the frontend consumes them via typed hooks.  
  *Why it helps:* Refactors catch mismatches at compile time; API contracts are explicit; less reliance on runtime checks or manual types.

- **URL as source of truth for navigation**  
  Workspace, channel, and member context live in the URL (via nuqs).  
  *Why it helps:* Every view is shareable and bookmarkable; back/forward and refresh behave correctly; layout state (e.g. thread panel) can be encoded in query params.

- **Layered UI composition**  
  Shared primitives in `src/components/ui`, domain-agnostic pieces (editor, message list, modals) in `src/components`, and feature-specific UI in `src/features/*/components`.  
  *Why it helps:* Consistent look and behavior; reuse without duplication; easier to test and replace parts in isolation.

- **Centralized auth and route protection**  
  Convex Auth plus Next.js middleware handle sign-in, sessions, and redirects.  
  *Why it helps:* One place to enforce "logged in" and "public route"; OAuth and email/password share the same session model; no per-page auth boilerplate.

---

## Advantages (product and stack)

At a glance: what you get from the overall product and technology choices.

- **Single backend model** — Convex handles database, auth (via Convex Auth), file storage, and HTTP routes. No separate REST/GraphQL API or WebSocket server to run or scale.
- **Type-safe client–server boundary** — Convex generates TypeScript types from the schema and function definitions; frontend hooks get full type inference and autocomplete.
- **Real-time by default** — Convex queries are reactive; any change in the database propagates to subscribed clients, so no custom real-time layer is required.
- **Structured feature layout** — Frontend is organized by domain with shared hooks, API wrappers, and components, making it easier to extend or refactor.
- **Modern React and Next.js** — App Router, server and client components where appropriate, and middleware for auth-based redirects.
- **Reusable UI and state** — Radix UI primitives, Tailwind CSS, Jotai for local state, nuqs for URL state; layout and panels are shareable and bookmarkable.

---

## Tech stack and technology advantages

Below is every major technology used and the concrete advantage it provides. Useful when evaluating the stack or when deciding what to reuse in another project.

### Runtime and framework

| Technology | Role | Advantage |
|------------|------|------------|
| **Node.js** | JavaScript runtime (LTS 18.x or 20.x recommended). | One runtime for tooling and server; large ecosystem and hiring pool. |
| **Next.js 15** | React framework with App Router, server components, and middleware. | File-based routing and layouts; built-in optimizations (fonts, images, bundles); middleware for auth and redirects; deployment on [Vercel](https://vercel.com) where the app is hosted. |
| **React 19** | UI library with current hooks and concurrent features. | Stable patterns for async and composition; good fit for real-time UIs that update frequently. |

### Backend and data

| Technology | Role | Advantage |
|------------|------|------------|
| **Convex** | Document database, queries/mutations/actions, file storage (`_storage`), real-time subscriptions. | No WebSocket or polling code to maintain; schema and indexes define data shape and access patterns; one deployment for all backend concerns; scales without managing servers. |
| **Convex Auth** | Authentication and session management; Next.js middleware and Convex HTTP router for OAuth. | Sessions and user identity live in Convex; auth checks in Convex functions stay consistent with the frontend; multiple providers (email/password, GitHub, Google) through a single abstraction. |

### Frontend

| Technology | Role | Advantage |
|------------|------|------------|
| **TypeScript** | Typing across `src` and `convex`. | Fewer runtime type errors; better refactoring and IDE support; self-documenting APIs and data structures. |
| **Tailwind CSS 4** | Utility-first styling; `@theme` and custom variants in `globals.css`. | Consistent spacing, colors, and typography; small CSS payload; design tokens in one place. |
| **tw-animate-css** | Animation utilities with Tailwind. | Consistent, declarative animations without custom keyframes. |
| **Radix UI** | Accessible primitives (Avatar, Dialog, DropdownMenu, Popover, Separator, Slot, Tooltip). | Keyboard navigation, focus management, ARIA handled; unstyled and composable. |
| **Jotai** | Atomic state (modals, panel state, selected member/message). | Fine-grained updates; no single global store; easy to colocate state with usage. |
| **nuqs** | URL query state for Next.js App Router (workspace/channel/member, panel). | Shareable and bookmarkable URLs; correct history and refresh; type-safe query parsing. |
| **React Quill / Quill** | Rich text editor and Delta-based content; `Renderer` for message body. | Structured content (Delta/JSON); consistent editing and rendering; extensible toolbar and formats. |
| **Emoji picker** | `emoji-picker-react`, `@emoji-mart/react`, `@emoji-mart/data`. | Familiar, searchable emoji UX without building a picker from scratch. |
| **Lucide React / React Icons** | Icons across the app. | Consistent icon style and tree-shakeable imports. |
| **Sonner** | Toast notifications. | Minimal API for success/error feedback; good defaults and accessibility. |
| **date-fns** | Date formatting and manipulation. | Small, modular helpers; no heavy date library. |
| **react-resizable-panels** | Resizable sidebar, main content, thread/profile panel; layout persisted. | User-controlled layout that persists across sessions without custom persistence code. |
| **react-verification-input** | Six-character join code input. | Focused UX for code entry with minimal custom logic. |
| **cmdk** | Command palette (Radix-based). | Accessible, keyboard-driven navigation for commands. |
| **cva, clsx, tailwind-merge** | Component variants and class name composition. | Type-safe variant APIs; no duplicate or conflicting Tailwind classes; cleaner component APIs. |

### Tooling and fonts

| Technology | Role | Advantage |
|------------|------|------------|
| **ESLint** + `eslint-config-next` | Linting for Next.js and TypeScript. | Consistent style and common mistake prevention. |
| **TypeScript** (strict, `@/*` alias) | Compiler and path mapping. | Reliable imports and refactors across the repo. |
| **next/font** | Geist and Geist Mono in layout; CSS variables for Tailwind. | Optimized loading and no layout shift; single place to change font stack. |

---

## Repository structure (high level)

Quick map of where things live. Use this when navigating the codebase.

| Path | Contents |
|------|----------|
| **`convex/`** | Backend: schema (`schema.ts`), auth config and providers (`auth.config.ts`, `auth.ts`), HTTP router (`http.ts`), and Convex functions for workspaces, members, channels, conversations, messages, reactions, users, upload. Generated types in `convex/_generated/`. |
| **`src/app/`** | Next.js App Router: routes for `/`, `/auth`, `/workspace/[workspaceId]`, `/workspace/.../channel/[channelId]`, `/workspace/.../member/[memberId]`, `/join/[workspaceId]`. Layouts and pages; workspace layout includes toolbar, sidebar, resizable panels, thread/profile panel. |
| **`src/components/`** | Shared UI: editor, message list, message, thread bar, reactions, modals, Convex and Jotai providers, and `components/ui` (buttons, dialogs, inputs, etc.). |
| **`src/features/`** | Feature modules (auth, workspaces, channels, members, conversations, messages, reactions, upload): components, API hooks, and stores. |
| **`src/hooks/`** | Cross-cutting hooks (workspace/channel/member IDs from URL, panel state, confirm dialog). |
| **`src/lib/`** | Utilities (e.g. `cn` for class names). |
| **`src/middleware.ts`** | Convex Auth Next.js middleware: redirect unauthenticated users to `/auth`, authenticated users away from `/auth`. |

---

## Prerequisites

Before running the project, ensure you have:

- **Node.js** — LTS version (18.x or 20.x). Check with `node -v`.
- **npm** (or yarn/pnpm/bun) — For install and scripts; examples below use `npm`.
- **Convex account** — Sign up at [convex.dev](https://convex.dev) and use the Convex CLI to create or link a project and deploy functions.

---

## Environment variables

Create a `.env.local` in the project root. Convex CLI can also create or update env vars for the Convex deployment.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL. Provided after `npx convex dev` or when linking the project (e.g. `https://<deployment>.convex.cloud`). |
| `CONVEX_SITE_URL` | Yes (for auth) | Public URL of the Next.js app (e.g. `http://localhost:3000` in development). Used by Convex Auth for OAuth redirects. |

For OAuth providers (GitHub, Google), configure them in the Convex dashboard and set any provider-specific env vars Convex Auth expects. Local dev typically uses `CONVEX_SITE_URL=http://localhost:3000`.

---

## Running the project on a new machine

Follow these steps in order to get the app running locally.

### 1. Clone and install

```bash
git clone <repository-url>
cd team-chat
npm install
```

### 2. Convex setup

Log in and create or link a Convex project:

```bash
npx convex login
npx convex dev
```

On first run, `convex dev` will prompt to create a new Convex project or link an existing one. It will create and populate `.env.local` with `CONVEX_DEPLOYMENT` and output the deployment URL.

- Add **`NEXT_PUBLIC_CONVEX_URL`** to `.env.local` with that deployment URL (same as in the Convex dashboard).
- Set **`CONVEX_SITE_URL`** to the URL where the app runs (e.g. `CONVEX_SITE_URL=http://localhost:3000`). Required for Convex Auth (including OAuth).

### 3. Start the Next.js dev server

In a separate terminal (or after `convex dev` is running):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see a redirect to `/auth` if not logged in, or the home/workspace view if already authenticated.

### 4. Convex dev workflow

Keep `npx convex dev` running while developing. It pushes Convex function and schema changes to your deployment and watches for file changes. The Next.js app uses `NEXT_PUBLIC_CONVEX_URL` to talk to that deployment; no separate backend process is required.

### 5. Production build and run

```bash
npm run build
npm start
```

Use a process manager (e.g. systemd, PM2) in production. Set `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_SITE_URL` (and any OAuth-related env vars) to production values. Convex backend is already hosted; no extra server to run.

The project is deployed on [Vercel](https://vercel.com) at [https://team-chat-wheat.vercel.app](https://team-chat-wheat.vercel.app). For Vercel deployments, set the same environment variables in the project settings and connect the repository; configure Convex env vars in the Convex dashboard for the production deployment.

### 6. Linting

```bash
npm run lint
```

---

## Common issues

| Issue | What to do |
|-------|------------|
| **Blank or redirect loop** | Ensure `NEXT_PUBLIC_CONVEX_URL` is set and matches the deployment used by `convex dev`. Ensure `CONVEX_SITE_URL` matches the URL you use to open the app (e.g. `http://localhost:3000` in dev). |
| **OAuth not working** | Verify `CONVEX_SITE_URL` is correct and that GitHub/Google apps use the correct callback URL (see Convex Auth docs). In dev, callbacks often go to Convex's domain; the site URL is still used for redirects. |
| **"Unauthorized" in Convex** | User must be signed in and a member of the workspace. Check that auth middleware is not blocking the request and that the Convex Auth provider is configured correctly. |
| **Schema or function errors** | Run `npx convex dev` and fix any TypeScript or Convex validation errors in the terminal; the Convex dashboard also shows deployment logs. |

---

## Scripts reference

| Script | Command | Purpose |
|--------|---------|---------|
| dev | `npm run dev` | Start Next.js development server. |
| build | `npm run build` | Production build of the Next.js app. |
| start | `npm start` | Run the production build. |
| lint | `npm run lint` | Run ESLint. |

Convex is driven by the CLI: use `npx convex dev` during development and `npx convex deploy` for production deployments (see Convex docs for CI/CD).

---

## License and contribution

This project is private. For license and contribution rules, see the repository settings or maintainers.
