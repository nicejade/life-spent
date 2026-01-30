---
description: Help collaborators understand the intent, stack, and practices of "LifeSpent"
alwaysApply: true
---

# AGENTS

## Product Intent
- LifeSpent is a web app that shows how much of your life is already spent — based on your age and your country’s median age (defaults: 73 for men, 79 for women). No motivation, no judgment. Just math.
- The goal is to use real data to remind people to cherish time and to break the “I am still young / still a kid” illusion.
- Use concise language to express this feeling. Every interface and interaction should make users feel a calm, reflective atmosphere about time.

## Tech Stack & Workflow
- Stack: Svelte + TypeScript + Vite + Tailwind CSS.
- Directory convention: split Svelte pages and components by feature inside `src/`, put reusable calculation tools and types in `lib/`, keep `styles/` for only essential Tailwind configuration or minimal global variables.
- Recommended naming: components and pages use PascalCase (e.g. `LifeSpentCard.svelte`), utility functions and plain modules use camelCase, constants use UPPER_SNAKE.
- Keep file names consistent with exported/component names. Organize module hierarchy by feature and avoid piling files at the top level.

## Common Commands
- `npm run dev`: start the development server (Vite).
- `npm run build`: build for production.

## Code & Naming Standards
- Each module must have a clear responsibility: view components only handle UI, calculation logic lives in `lib/` and should be covered by unit tests (even if not written yet, leave a test-ready spot).
- Do not write large amounts of custom CSS in Svelte components; prefer Tailwind utility classes for visuals. Only add minimal reusable styles via `@layer components` or `@layer utilities` when necessary.
- All interactive elements (buttons, inputs) must include semantic labels, accessible states, and `aria` descriptions. Add `cursor-pointer` to mouse-interactive elements and use Tailwind `transition` utilities for motion.

## Style & Visuals
- Tailwind is the first choice: use atomic classes for every layout, spacing, and color (e.g. `bg-slate-950/80`, `rounded-2xl`, `text-lg`). Avoid inline `<style>` and `.css` files.
- If custom CSS is necessary, keep it in `src/styles/` and only cover visuals that Tailwind cannot express (e.g. complex gradients, keyframes). Briefly record in `AGENTS` why the style is required.
- The overall tone should be calm, modern, and slightly ceremonial: use a dark background, glass-like cards, typography that highlights the percentage and time reminder, and concise, clear CTAs.

## Interaction Notes
- The results page must clearly show three key data points: birth date, current age, and the percentage of median life reached. Use a subtitle to remind users that “median age is not the endpoint—face the remaining time.”
- Keep copy restrained and steady; use warm contrast colors for buttons and tip cards (e.g. `bg-amber-500/20`) to balance the serious theme.
- Keep layouts responsive by default, following Tailwind `container mx-auto` and breakpoints. Ensure the reminder still feels strong on mobile, and avoid overly crowded or spinning animations.

## Additional Notes
- All new components, modules, and layouts should be as self-explanatory as possible; naming should reflect intent. Code comments are only for explaining complex business logic.
- Never replace Tailwind utility classes with CSS variables (unless Tailwind `@apply` cannot satisfy the need). If new color/spacing tokens are required, add extensions in `tailwind.config.ts`.
