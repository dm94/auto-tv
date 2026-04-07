# AGENTS.md

## Project Overview

Auto TV is a React + TypeScript + Vite frontend app that simulates a TV experience with:

- channel switching
- an on-screen display (OSD)
- an electronic program guide (EPG)

The app uses Zustand for global state and Tailwind CSS utilities on top of standard CSS.

## Tech Stack

- React 18
- TypeScript
- Vite 6
- Zustand (state management)
- Tailwind CSS (utility-first styling)
- ESLint 9 + typescript-eslint

## Package Manager

Use `pnpm` only.

### Setup

- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Build production bundle: `pnpm build`
- Preview production build: `pnpm preview`
- Type check: `pnpm check`
- Lint: `pnpm lint`

## Development Workflow

- Keep changes small, focused, and easy to review.
- Prefer editing existing files over creating new files.
- Run `pnpm lint`, `pnpm check`, and `pnpm build` before finishing changes.
- Keep the dependency set minimal; do not add libraries unless there is a clear, justified need.

## Code Style and Architecture Rules

- Use TypeScript everywhere.
- Use functional React components.
- Follow Clean Code principles.
- Keep components small and single-responsibility.
- Follow DRY: extract reusable logic into hooks or utilities.
- Prefer `for...of` over `forEach`.
- Prefer nullish coalescing (`??`) over logical OR (`||`) when handling defaults.
- Avoid magic values; extract constants with clear names.
- Use modern React patterns and avoid side effects in render.
- Optimize rendering where needed with `React.memo`, `useMemo`, and `useCallback`.
- Use English for variable names, function names, and comments.
- Add comments only when necessary.
- Always use curly braces for control structures.

## Styling Rules

- Prefer CSS and Tailwind utilities already present in the codebase.
- Keep styling consistent with existing patterns in `src/index.css` and component class usage.
- Prioritize accessibility (keyboard navigation, semantics, focus states, and contrast).

## Testing and Validation

There is currently no dedicated automated test script in `package.json`.

For every change, run:

- `pnpm lint`
- `pnpm check`
- `pnpm build`

If tests are introduced later, document and run them here as part of the default validation flow.

## File/Folder Orientation

- Entry point: `src/main.tsx`
- Main page: `src/pages/Home.tsx`
- UI components: `src/components/*`
- Global store: `src/store/useStore.ts`
- Shared types: `src/types/index.ts`
- Mock data: `src/data/mockData.ts`
- Global styles: `src/index.css`

## Pull Request Expectations

- Keep PRs focused and minimal in scope.
- Do not include unrelated refactors.
- Ensure lint, typecheck, and build pass locally with pnpm commands.
- Preserve existing UX behavior unless the task explicitly requires changes.
