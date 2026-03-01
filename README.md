# Team Chat

A real-time team collaboration and messaging application built with Next.js and Convex. The application provides workspaces, channels, direct conversations, threaded messages, reactions, and file attachments in a Slack-like interface.

---

## Project Goals

- **Workspace-centric collaboration**: Organize teams into workspaces with join codes; each workspace has channels and supports direct messages between members.
- **Channel and DM communication**: Public channel messaging and one-to-one conversations within a workspace, with consistent UX and real-time updates.
- **Rich messaging**: Compose messages with a Quill-based rich text editor, inline images, and emoji support; view threads and react to messages.
- **Authentication and access control**: Sign in via email/password or OAuth (GitHub, Google); protect routes and Convex functions by user and workspace membership; enforce admin vs member roles where needed.
- **Real-time experience**: Use Convex for live queries and mutations so message lists, threads, and reactions update without manual refresh.
- **Portable setup**: Run the full stack (Next.js app and Convex backend) on another machine using clear environment and CLI steps.

---

## Advantages

- **Single backend model**: Convex handles database, auth (via Convex Auth), file storage, and HTTP routes. No separate REST/GraphQL API or WebSocket server to run or scale.
- **Type-safe client–server boundary**: Convex generates TypeScript types from the schema and function definitions; frontend hooks get full type inference and autocomplete.
- **Real-time by default**: Convex queries are reactive; any change in the database propagates to subscribed clients, so no custom real-time layer is required.
- **Structured feature layout**: Frontend is organized by domain (auth, workspaces, channels, members, messages, reactions, uploads) with shared hooks, API wrappers, and components, making it easier to extend or refactor.
- **Modern React and Next.js**: Uses the App Router, server and client components where appropriate, and middleware for auth-based redirects.
- **Reusable UI and state**: Radix UI primitives, Tailwind CSS, and Jotai for local state; nuqs for URL state (e.g. workspace/channel/member selection) so layout and panels are shareable and bookmarkable.

---

## Tech Stack and Technologies

### Runtime and framework

- **Node.js**: JavaScript runtime (use a current LTS version; 18.x or 20.x recommended).
- **Next.js 15**: React framework with App Router, server components, and middleware.
- **React 19**: UI library with current hooks and concurrent features.

### Backend and data

- **Convex**: Backend-as-a-service used for:
  - Document database with schema and indexes.
  - Queries, mutations, and actions (all used in this project).
  - Built-in file storage (`_storage`) for message images.
  - Real-time subscriptions from the client.
- **Convex Auth (`@convex-dev/auth`)**: Authentication and session management; integrates with Next.js middleware and Convex HTTP router for OAuth callbacks.

### Frontend

- **TypeScript**: Typed JavaScript across `src` and `convex`.
- **Tailwind CSS 4**: Utility-first styling with `@tailwindcss/postcss` and `postcss.config.mjs`; theme variables and dark mode via `@theme` and custom variants in `globals.css`.
- **tw-animate-css**: Animation utilities used with Tailwind.
- **Radix UI**: Accessible primitives: Avatar, Dialog, DropdownMenu, Popover, Separator, Slot, Tooltip; used in `src/components/ui` and feature components.
- **Jotai**: Atomic state (e.g. modals, panel state, selected member/message) via `JotaiProvider` in the root layout.
- **nuqs**: URL query state adapter for Next.js App Router (`NuqsAdapter`) for workspace/channel/member and panel state.
- **React Quill / Quill**: Rich text editor and Delta-based content; `Renderer` component displays stored message body as HTML.
- **Emoji picker**: `emoji-picker-react` and `@emoji-mart/react` + `@emoji-mart/data` for emoji selection in the composer.
- **Lucide React / React Icons**: Icon set used across the app.
- **Sonner**: Toast notifications.
- **date-fns**: Date formatting and manipulation where needed.
- **react-resizable-panels**: Resizable layout for sidebar, main content, and thread/profile panel; layout id persisted (e.g. `autoSaveId="ca-workspace-layout"`).
- **react-verification-input**: Six-character join code input on the workspace join page.
- **cmdk**: Command palette (if used) built on Radix.
- **class-variance-authority (cva), clsx, tailwind-merge**: Component variants and class name composition in `src/lib/utils.ts` and UI components.

### Tooling and quality

- **ESLint**: Linting with `eslint-config-next` (Next.js and TypeScript).
- **TypeScript**: Strict mode; path alias `@/*` -> `./src/*` in `tsconfig.json`.

### Fonts

- **next/font**: Geist and Geist Mono loaded in `src/app/layout.tsx` and exposed as CSS variables for Tailwind.

---

## Repository structure (high level)

- **`convex/`**: Backend. Schema (`schema.ts`), auth config and providers (`auth.config.ts`, `auth.ts`), HTTP router (`http.ts`), and Convex functions: `workspaces`, `members`, `channels`, `conversations`, `messages`, `reactions`, `users`, `upload`. Generated types live in `convex/_generated/`.
- **`src/app/`**: Next.js App Router. Routes: `/`, `/auth`, `/workspace/[workspaceId]`, `/workspace/[workspaceId]/channel/[channelId]`, `/workspace/[workspaceId]/member/[memberId]`, `/join/[workspaceId]`. Layouts and pages are here; workspace layout includes toolbar, sidebar, resizable panels, and thread/profile panel.
- **`src/components/`**: Shared UI: editor, message list, message, thread bar, reactions, modals, convex and Jotai providers, and `components/ui` (buttons, dialogs, inputs, etc.).
- **`src/features/`**: Feature-specific modules (auth, workspaces, channels, members, conversations, messages, reactions, upload) with components, API hooks (Convex `useQuery`/`useMutation` wrappers), and stores where applicable.
- **`src/hooks/`**: Cross-cutting hooks (e.g. workspace/channel/member IDs from URL, panel state, confirm dialog).
- **`src/lib/`**: Utilities (e.g. `cn` for class names).
- **`src/middleware.ts`**: Convex Auth Next.js middleware: redirect unauthenticated users to `/auth` and authenticated users away from `/auth`.

---

## Prerequisites

- **Node.js**: LTS version (18.x or 20.x). Check with `node -v`.
- **npm** (or yarn/pnpm/bun): Used for install and scripts; examples below use `npm`.
- **Convex account**: Sign up at [convex.dev](https://convex.dev) and install the Convex CLI so you can create a project and deploy functions.

---

## Environment variables

Create a `.env.local` in the project root (and optionally `.env` for non-secret defaults). Convex CLI will also create/update env vars for the Convex deployment.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL. Provided after `npx convex dev` or when linking the project (e.g. `https://<deployment>.convex.cloud`). |
| `CONVEX_SITE_URL` | Yes (for auth) | Public URL of the Next.js app (e.g. `http://localhost:3000` in development). Used by Convex Auth (e.g. in `convex/auth.config.ts`) for OAuth redirects. |

For OAuth providers (GitHub, Google), configure the providers in the Convex dashboard and set any provider-specific env vars Convex Auth expects (see Convex Auth docs). Local dev typically uses `CONVEX_SITE_URL=http://localhost:3000`.

---

## Running the project on a new machine

### 1. Clone and install

```bash
git clone <repository-url>
cd team-chat
npm install
```

### 2. Convex setup

- Log in and create or link a Convex project:

```bash
npx convex login
npx convex dev
```

- On first run, `convex dev` will prompt to create a new Convex project or link an existing one. It will create and populate `.env.local` with `CONVEX_DEPLOYMENT` and will output the deployment URL.
- Add `NEXT_PUBLIC_CONVEX_URL` to `.env.local` with the Convex deployment URL (the same one the Convex dashboard shows for your deployment).
- Set `CONVEX_SITE_URL` for the running Next.js app (e.g. `CONVEX_SITE_URL=http://localhost:3000`). This is required for Convex Auth (including OAuth) to work.

### 3. Start the Next.js dev server

In a separate terminal (or after `convex dev` is running):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the app redirect to `/auth` if not logged in, or to the home/workspace view if already authenticated.

### 4. Convex dev workflow

- Keep `npx convex dev` running while developing. It pushes Convex function and schema changes to your deployment and watches for file changes.
- The Next.js app uses `NEXT_PUBLIC_CONVEX_URL` to talk to that deployment; no separate backend process is required.

### 5. Production build and run

```bash
npm run build
npm start
```

Use a process manager (e.g. systemd, PM2) in production. Set `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_SITE_URL` (and any OAuth-related env vars) to production values. Convex backend is already hosted; no extra server to run.

### 6. Linting

```bash
npm run lint
```

---

## Common issues

- **Blank or redirect loop**: Ensure `NEXT_PUBLIC_CONVEX_URL` is set and matches the deployment used by `convex dev`. Ensure `CONVEX_SITE_URL` matches the URL you use to open the app (e.g. `http://localhost:3000` in dev).
- **OAuth not working**: Verify `CONVEX_SITE_URL` is correct and that GitHub/Google apps are configured with the correct callback URL (Convex Auth docs). In dev, callbacks often go to Convex’s domain; the site URL is still used for redirects.
- **"Unauthorized" in Convex**: User must be signed in and a member of the workspace. Check that auth middleware is not blocking the request and that the Convex Auth provider is configured correctly.
- **Schema or function errors**: Run `npx convex dev` and fix any TypeScript or Convex validation errors reported in the terminal; the dashboard also shows deployment logs.

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
