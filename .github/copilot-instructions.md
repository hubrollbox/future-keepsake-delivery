# Copilot Instructions for Keepla Codebase

## Project Overview
**Keepla** (FuturoPresente) is a platform for scheduling and delivering future digital keepsakes—emotional time capsules with text, images, and metadata. The app uses React 18 + TypeScript frontend on Vite with Supabase (PostgreSQL + Edge Functions) backend, Stripe payments, and gamification features.

## Architecture

### Frontend Stack
- **Framework**: React 18 with React Router v6 for routing
- **Build**: Vite with TypeScript strict mode enabled
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context (Auth, Gamification, Cart) + TanStack Query for server state
- **Forms**: React Hook Form with custom validation in `src/validations/`

### Key Provider Pattern
All providers are stacked in [src/App.tsx](src/App.tsx#L38-L55):
```
QueryClientProvider → BrowserRouter → AuthProvider → GamificationProvider → CartProvider
```
Each context file has dedicated hook exports (e.g., `useAuthContext`, `useGamificationContext`).

### Backend Architecture
- **Database**: Supabase PostgreSQL via RLS policies for row-level security
- **Auth**: Supabase Auth with Supabase-specific flow (`flowType: 'pkce'`)
- **Security Middleware**: [src/middleware/security.ts](src/middleware/security.ts) enforces protected route checks and HTTPS redirect
- **Services Layer**: Each domain has service file: [src/services/gamificationService.ts](src/services/gamificationService.ts), [src/services/adminService.ts](src/services/adminService.ts), [src/services/capsuleService.ts](src/services/capsuleService.ts)

## Data Flow Patterns

### Authentication Flow
1. Supabase Auth session from [src/contexts/AuthProvider.tsx](src/contexts/AuthProvider.tsx) automatically checks protected/admin routes
2. Admin role determined by `admin_profiles` table query in `fetchProfile`
3. `ProtectedRoute` and `isAdminRoute` middleware redirect unauthenticated users to `/login`

### Keepsake Creation
Form state managed in [src/features/create-delivery/useDeliveryFormState.ts](src/features/create-delivery/useDeliveryFormState.ts):
- Delivery type: "digital" | "physical"
- Supports file attachments (digital field always starts as null)
- Date/time picker uses `date-fns` for Portuguese timezone awareness

### Gamification
[src/services/gamificationService.ts](src/services/gamificationService.ts) tracks user actions via `add_points` RPC in Supabase. Actions include: `daily_login`, `blog_visit`, `article_read`, `share_external`. Server validates point limits to prevent fraud.

## Development Commands

```bash
npm run dev              # Start Vite dev server on :8080
npm run build           # lint + test + build:prod (full pipeline)
npm run build:prod      # TypeScript check + sitemap generation + Vite production build
npm run lint            # ESLint (non-strict mode for unused disable directives)
npm run lint:fix        # Auto-fix linting issues
npm run test            # Vitest (jsdom environment, runs once)
npm run test:watch      # Vitest in watch mode
npm run test:coverage   # Coverage report (v8 provider)
```

**Build process order**: TypeScript → ESLint → Vitest → Vite build. All must pass for production release.

## Project-Specific Conventions

### Path Aliases
- `@/*` maps to `src/*` (configured in [tsconfig.json](tsconfig.json))
- Always use `@/` imports for internal modules to keep relative paths clean

### TypeScript Config
- Strict mode enabled with exact optional types, no unused locals/parameters
- JSX set to "react-jsx" (automatic runtime)
- `moduleDetection: force` and `isolatedModules: false` for proper ESM handling

### Component Organization
- Page components in `src/pages/` (route-level)
- Reusable components in `src/components/ui/` (shadcn) and `src/components/` (app-specific)
- Admin-specific UI in `src/components/admin/`
- Form validators in `src/validations/` (imported in form components)

### Blog System Architecture
- **Public view**: [src/pages/Blog.tsx](src/pages/Blog.tsx) lists articles, [src/pages/BlogPost.tsx](src/pages/BlogPost.tsx) displays slug-based articles
- **Admin create/edit**: Routed via query params inside [src/pages/admin/BlogAdmin.tsx](src/pages/admin/BlogAdmin.tsx) (not as separate top-level routes)
- **Content editing**: [src/admin/views/content/ContentEditor.tsx](src/admin/views/content/ContentEditor.tsx) uses React Quill rich text editor

### Error Handling & Logging
- Auth context includes detailed console debug logs prefixed with `[AuthContext]`
- Use `useToast()` hook from shadcn for user-facing errors
- Supabase session missing errors throw with descriptive messages

### Pricing & Service Data
- Pricing definitions centralized in [src/lib/pricingData.ts](src/lib/pricingData.ts) (public) and [src/lib/adminPricingData.ts](src/lib/adminPricingData.ts) (internal costs/margins)
- Services categorized: `storage`, `digital`, `physical`, `capsule`
- Lookup functions: `getPlanById()`, `getServiceById()`, `getServicesByCategory()`

## Critical Integration Points

### Supabase Client
Initialized in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) with environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Uses typed Database interface for RLS enforcement.

### Stripe Integration
Payments handled in checkout flow; service types mapped in pricing data. Webhook handlers process completion events.

### Resend for Email
Transactional emails sent via Resend API for delivery confirmations and notifications.

## Testing Strategy
- Unit tests in `src/__tests__/`; integration tests in `tests/integration/`
- Vitest configured with jsdom; setup file at [src/__tests__/setup.ts](src/__tests__/setup.ts)
- Coverage reporters: text, json, html (view at `coverage/index.html`)

## Deployment Notes
- Production build generates sitemap via [scripts/generate-sitemap.js](scripts/generate-sitemap.js)
- Vercel config in [vercel.json](vercel.json)
- Security headers set in Vite server config (X-Content-Type-Options)
- HTTPS enforced in production (SecurityProvider redirects non-HTTPS requests)

## Important Avoid Patterns
- ❌ Direct DOM manipulation; use React components and hooks
- ❌ Importing BlogAdmin's internal utilities at root App level (breaks encapsulation)
- ❌ Supabase queries outside service layer; always use abstraction layer
- ❌ User-facing text hardcoded in English; project is Portuguese-first (look for i18n structure if needed)
