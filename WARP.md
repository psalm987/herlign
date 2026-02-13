# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and workflows

### Install and run the dev server

```bash
npm install
npm run dev   # Next.js dev server on http://localhost:3000
```

A VS Code task named `dev` also exists (from `.github/copilot-instructions.md`) and runs the same command.

### Build and production run

```bash
npm run build   # Next.js production build
npm start       # Run the built app
```

### Linting

ESLint is configured via `eslint.config.mjs` using `eslint-config-next` (core-web-vitals + TypeScript):

```bash
npm run lint
```

### Tests

There is currently no test script configured in `package.json`. Before trying to run tests, set up a test runner (e.g. Jest, Vitest, or Playwright) and add appropriate `test` / `test:*` scripts.

## High-level architecture

### Framework and tooling

- Next.js App Router project using TypeScript (`app/` directory drives routing).
- Tailwind CSS v4 with a CSS-first setup (`@import "tailwindcss";` in `app/globals.css`).
- shadcn/ui components configured via `components.json` ("new-york" style, RSC enabled, `lucide` icons).
- React Compiler is enabled in `next.config.ts` via `reactCompiler: true`.
- Path alias `@/*` is configured in `tsconfig.json` and used throughout (e.g. `@/components/...`, `@/lib/utils`).

### Routing and layout

- `app/layout.tsx` defines the root HTML shell and applies global fonts and `globals.css`.
- Primary routes are implemented as App Router pages under `app/`:
  - `app/page.tsx` → homepage (composes all home sections).
  - `app/about/page.tsx`, `app/contact/page.tsx`, `app/start-anyway/page.tsx` → simple content pages that share the same shell.
- Shared chrome lives in section components:
  - `components/sections/general/navigation.tsx` → sticky top navigation bar with mobile menu and animated logo.
  - `components/sections/general/footer.tsx` → site footer with quick links and copy.
- Pages typically follow the pattern: wrap content in `div.min-h-screen`, render `<Navigation />`, then page-specific `<main>` content, then `<Footer />`.

### Brand system (colors, typography, theming)

The brand system is implemented jointly in `app/globals.css` and `tailwind.config.ts`:

- **Colors**
  - Five brand color families are defined as CSS variables in `globals.css` and mapped to Tailwind color scales in `tailwind.config.ts`:
    - `grin`, `peenk`, `ohrange`, `perple`, `lermorn` each expose `50–950` plus `DEFAULT`.
  - Use standard Tailwind-style tokens such as `bg-grin-500`, `text-perple-600`, `border-ohrange-300`, etc.
  - Additional design tokens (`--background`, `--foreground`, `--card`, `--sidebar-*`, `--chart-*`, radii, etc.) are defined in the `@theme inline` block for both light (`:root`) and `.dark` modes.

- **Fonts**
  - Local fonts are configured in `app/fonts.ts` using `next/font/local` and exposed as CSS variables:
    - `axiforma` → body (`font-sans`).
    - `clashDisplay` → headings (`font-heading`).
    - `gochiHand` → decorative/handwriting (`font-handwriting`).
  - `app/layout.tsx` applies these variables on `<body>` so Tailwind’s `font-sans`, `font-heading`, and `font-handwriting` utilities use the correct faces.
  - Font files live under `public/fonts/` and should be added/updated there when extending typography.

### UI components and patterns

- **Utility functions**
  - `lib/utils.ts` exports `cn(...classes)` which wraps `clsx` and `tailwind-merge`. All components use `cn` to compose class names safely.

- **shadcn/ui primitives** (`components/ui`)
  - `button.tsx` defines a `Button` component and `buttonVariants` using `class-variance-authority`. Variants include `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` and multiple sizes (`sm`, `lg`, `xl`, `2xl`, icon sizes).
  - `card.tsx` defines `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` with `data-slot` attributes and layout classes.
  - `curved-text.tsx` is a custom SVG-based component that renders repeating text along a path.
    - It accepts props like `text`, `path` (an SVG path string), `width`, `height`, `count`, `fontSize`, and animation controls.
    - The actual path data for demo usage is stored in `components/constants/paths.ts`.
  - When adding new shadcn/ui components, follow `components.json`:
    - Use `npx shadcn@latest add <component>` and import from `@/components/ui/...`.
    - Use `cn` from `@/lib/utils` for any conditional Tailwind classes.

- **Sections** (`components/sections`)
  - `components/sections/general` contains layout-wide pieces (navigation and footer) used by all pages.
  - `components/sections/home` contains vertically stacked sections that together compose the homepage in `app/page.tsx`, for example:
    - `HeroSection` – top-of-page hero with CTA buttons.
    - `SafeSpaceSection`, `CommunityFeaturesSection`, `StartAnywaySection` – narrative sections promoting community and workshops.
    - `QuizSection` – uses brand background images from `public/images/...` and Tailwind animations (`tw-animate-css`).
    - `TestimonialsSection` – uses the `Card` UI primitive and Next `Image` to render testimonial cards.
    - `FounderSection`, `FinalCtaSection` – founder story and final call-to-action.
  - New marketing content should usually be implemented as additional section components under `components/sections` and then composed in the relevant `app/*/page.tsx`.

### Icons, images, and assets

- `components/svg/logo.tsx` renders the animated Herlign logo using two SVG paths (central mark + rotating curve text) and the `cn` utility.
- Brand imagery and patterns are stored in `public/images/...` and referenced from sections (e.g. quiz background patterns and testimonial bento images).
- `next.config.ts` configures remote images from `picsum.photos` (currently only used in commented-out testimonial avatars).

### shadcn/ui and Tailwind configuration

- `components.json` controls shadcn/ui behavior:
  - Uses the `new-york` style, RSC-compatible components, and `lucide` as the icon library.
  - Aliases: `components` → `@/components`, `ui` → `@/components/ui`, `utils` → `@/lib/utils`, etc.
- `tailwind.config.ts`:
  - Scans `./app`, `./components`, and `./pages` for class usage.
  - Extends the theme with brand color scales and font families bound to the CSS variables from `app/fonts.ts`.
  - Registers the `tailwindcss-animate` plugin; additional animation utilities also come from `tw-animate-css` imported in `globals.css`.

## AI-assistant-specific notes

- Prefer using the existing section + page composition pattern when adding new content or routes.
- When creating components:
  - Default to server components in `app/` unless client-side hooks (`useState`, `useEffect`, etc.) are required; mark those with `"use client"`.
  - Reuse shadcn/ui primitives from `components/ui` and the `cn` helper from `lib/utils.ts` instead of re-implementing layout primitives.
- When extending the brand system (new colors, fonts, or tokens), update both `app/globals.css` (CSS variables / `@theme inline`) and `tailwind.config.ts` (Tailwind `theme.extend`) to keep Tailwind utilities in sync with design tokens.
