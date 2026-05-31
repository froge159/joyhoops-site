# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Run production server
pnpm lint       # Lint with Next.js ESLint
```

No test suite is configured.

## Architecture

JoyHoops is a Next.js 16 + Supabase app for a youth basketball nonprofit. Parents register, enroll children in classes, and pay via Stripe. Admins manage coaches and classes.

### Supabase client pattern

Three distinct clients are used depending on context:

- `app/clients/server.ts` — Server Components and Server Actions (uses `@supabase/ssr` cookie store, row-level security applies)
- `app/clients/client.ts` — Client Components (browser client, also used to invoke Edge Functions directly from the browser)
- `app/clients/admin.ts` — Server Actions and API routes that need to bypass RLS (uses `SUPABASE_SECRET_KEY`)

Always use the server client for data fetching in Server Components and actions, the admin client only when RLS needs to be bypassed (e.g., creating users, inserting into protected tables).

### Page/component split

Server Component pages (e.g., `app/user-home/page.tsx`) fetch data and pass it as props to a `*Component.tsx` Client Component. Keep data fetching in the page file; keep interactivity in the component file.

### Middleware and routing

`proxy.ts` is the Next.js middleware entry point (note: not `middleware.ts`). Auth logic lives in `lib/middleware.ts` (`updateSession`). Route protection rules:

- `/admin/*` — requires `user.email === ADMIN_EMAIL`
- `/user-home/*` — requires any authenticated user
- Logged-in non-admin users are redirected away from public pages back to `/user-home`
- `pendingEmail` cookie gates access to `/email-verify` during OAuth sign-up
- `isChangingPassword` cookie gates access to `/set-password`

### Supabase Edge Functions

Complex or privileged mutations go through Supabase Edge Functions (Deno, `supabase/functions/`):

- `checkout` — creates a Stripe Checkout session
- `charge-webhook` — Stripe webhook handler (no JWT verify)
- `create-class`, `update-class`, `delete-class` — class management
- `unenroll` — removes a child's enrollment

Next.js API routes in `app/api/` act as thin proxies that validate input and delegate to these Edge Functions via `adminClient.functions.invoke(...)`.

### Database tables (PascalCase in Supabase)

`User`, `Child`, `Coach`, `Class`, `Class_Coach` (join table)

### UI

shadcn/ui components live in `components/ui/`. Brand colors are `#3DA9FC` (primary blue) and `#FF6B35` (accent orange). Do not add a theme provider — there is no dark mode.

### Environment variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_OAUTH_SUPABASE_URL
NEXT_PUBLIC_BASE_URL
SUPABASE_SECRET_KEY
ADMIN_EMAIL
```
