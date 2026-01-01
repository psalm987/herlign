# Herlign FC Website - AI Coding Agent Instructions

## Architecture Overview

Next.js 15 App Router project with TypeScript, Tailwind CSS v4, and shadcn/ui. React Compiler enabled (`reactCompiler: true` in `next.config.ts`). Standard App Router structure with pages in `app/` directory.

## Brand System Implementation

### Custom Color Tokens

Five brand colors with full Tailwind scale (50-950 + DEFAULT):

- **grin** (`#4C7F0E`) - Primary green
- **peenk** (`#ECAFF2`) - Pink accent
- **ohrange** (`#EC661C`) - Orange accent
- **perple** (`#8048F7`) - Purple accent
- **lermorn** (`#B4C96E`) - Lime accent

Colors are defined as CSS variables in `app/globals.css` and referenced in `tailwind.config.ts`. Use full variant syntax: `bg-grin-500`, `text-perple-600`, `border-ohrange-300`.

**Example usage** (see `app/page.tsx`):

```tsx
<h1 className="font-heading text-6xl text-grin-600">Welcome</h1>
<p className="font-handwriting text-3xl text-perple-500">Subtitle</p>
```

### Custom Font System

Three locally-hosted fonts configured in `app/fonts.ts` with CSS variables:

- **Axiforma** - Body text with 13 weights (100-950), use `font-sans`
- **Clash Display** - Headings with 6 weights (200-700), use `font-heading`
- **Gochi Hand** - Decorative, single weight, use `font-handwriting`

Fonts applied globally in `app/layout.tsx` via `className={axiforma.variable}` pattern. All font files in `public/fonts/`.

## Development Workflow

### Starting Development

```bash
npm run dev  # Runs on http://localhost:3000
```

A VS Code task "dev" exists and can be run with the run_task tool.

### Adding shadcn/ui Components

Project configured with shadcn/ui "new-york" style. Use:

```bash
npx shadcn@latest add [component-name]
```

Components install to `@/components/ui` (alias configured in `components.json`). Use the `cn()` utility from `lib/utils.ts` for conditional classes.

## Project-Specific Conventions

### Styling Patterns

- Tailwind v4 with CSS-first approach (`@import "tailwindcss"` in `app/globals.css`)
- Animation utilities via `tw-animate-css` package
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- All theme tokens defined in `@theme inline` block in globals.css

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to project root
- Target ES2017 with module bundler resolution

### Component Structure

Currently minimal - just the homepage in `app/page.tsx`. When creating new components:

- Place reusable components in `components/` (not yet created)
- Use shadcn/ui components via `@/components/ui` alias
- Server components by default (App Router convention)

## Key Files

- `app/fonts.ts` - Font configuration exports (`axiforma`, `clashDisplay`, `gochiHand`)
- `app/globals.css` - Theme tokens, color variables, Tailwind v4 imports
- `tailwind.config.ts` - Color scale mapping and font family tokens
- `components.json` - shadcn/ui configuration
- `lib/utils.ts` - `cn()` utility for class merging
