# GitHub Copilot – Repository Instructions

Authoritative guidance for code completions and suggestions in this repo. Prefer consistency with existing files. If a file explicitly deviates, follow that file.

## Tech stack and scope
- Framework: SvelteKit 2 + Svelte 5 (runes: $props, $bindable, $derived, $effect). TypeScript strict.
- UI: shadcn-svelte conventions using Bits UI primitives where applicable. Tailwind CSS v4 (utilities-only). Use tailwind-variants (tv) for variants.
- Charts: LayerChart with our local wrappers in `src/lib/components/ui/chart`. Do not add Chart.js.
- Build/hosting: Static site via `@sveltejs/adapter-static` outputting to `docs/`. All routes are prerendered. `trailingSlash = 'always'`. Target GitHub Pages with a base path.
- Data: Read-only JSON in `static/data`. No runtime network calls to external services.

## Routing and paths (GitHub Pages)
- Always build links and static asset URLs with `$app/paths`:
	- `import { base } from '$app/paths';`
	- Use `${base}` as the prefix for routes and fetches.
- Keep trailing slashes in links due to `trailingSlash = 'always'`.
- Avoid absolute `/` paths; prefer relative or `${base}`.
- Base path is injected at build via env `BASE_PATH` (see `svelte.config.js` and CI). In dev it’s ""; in CI it’s `/IWAC-topic-explorer`.

## Build configuration
- Adapter: `@sveltejs/adapter-static` configured to emit to `docs/` (pages/assets).
- CI/CD: `.github/workflows/deploy-pages.yml` builds with Node 20, sets `BASE_PATH=/IWAC-topic-explorer`, runs `npm ci && npm run build`, and publishes `sveltekit-app/docs` to Pages.
- Local deploy helper: the `deploy` npm script sets `BASE_PATH` then runs `build`.

## Data access patterns
- Load static JSON from `static/data` via `${base}`:
	- `const DATA_BASE = `${base}/data`;`
	- `await fetch(`${DATA_BASE}/summary.json`)` or `topics/<id>.json`.
- All data lives under `sveltekit-app/static/data/`. Never fetch external services at runtime.

Example:
```ts
import { base } from '$app/paths';

const DATA_BASE = `${base}/data`;
const res = await fetch(`${DATA_BASE}/summary.json`);
if (!res.ok) throw new Error('Failed to load summary');
const summary = await res.json();
```

## Component conventions (shadcn-svelte style)
- Locations:
	- UI primitives: `src/lib/components/ui/<component>/`.
	- Feature components (topic explorer): `src/lib/components/topic-explorer/`.
- Files per primitive/part: one `.svelte` per part (e.g., `card.svelte`, `card-header.svelte`, `card-content.svelte`).
- `index.ts` re-exports default `Root`, aliases, and named parts (e.g., `Root as Card`, `Header as CardHeader`).
- Props & typing:
	- Define props with runes: `let { … }: Props = $props();` and bindables with `$bindable`.
	- Use `WithElementRef<T>` from `$lib/utils` to support `ref` on the root element and forward `...restProps`.
	- Merge `class` with `cn()` from `$lib/utils`. Preserve `data-slot` attributes for styling/contracts.
- Variants:
	- Use `tailwind-variants` (`tv`) to define variantable classes. Export the variant helper and `VariantProps`-derived types.
- Accessibility:
	- Use semantic HTML, wire `aria-*`. Favor Bits UI primitives (e.g., `Label`, `Tooltip`) to ensure keyboard navigation and a11y.

## Tailwind v4 usage
- Utilities only; prefer tokens defined in `src/app.css`. Use Tailwind color tokens (e.g., `bg-card`, `text-muted-foreground`).
- Keep classes small and composable; avoid inline styles except for necessary one-offs.
- Don’t add a Tailwind config unless absolutely required for a repo-wide need.

## Charts
- Wrap LayerChart primitives with our chart components in `src/lib/components/ui/chart`.
- Use `ChartContainer`, `ChartTooltip`, and helpers from `chart-utils.ts`.
- Style via CSS variables scoped by chart id; do not introduce external chart themes.
- Do not import or suggest Chart.js.

## Types and declarations
- Custom stubs live in `src/types/` (e.g., `d3-scale.d.ts`). Prefer proper types when available, but stubs are acceptable to keep builds green.

## Testing, quality, performance
- Typecheck with `svelte-check` (see `npm run check`); format with Prettier.
- Keep components small and focused. Prefer pure utilities in `src/lib` and tree-shakeable re-exports.
- Avoid large, untyped objects; annotate props and derived values.

## Do / Don’t
Do:
- Use Svelte 5 runes ($props, $bindable, $derived, $effect) and TypeScript strict.
- Use `cn()` for class merging and `WithElementRef` for refs.
- Keep components modular with one primitive per file; re-export in `index.ts` shadcn style.
- Use `tailwind-variants` for component variants.
- Use Bits UI primitives (Label, Tooltip) for a11y and consistency.
- Use `${base}` for links and fetches; keep trailing slashes; ensure all routes are prerendered.
- Keep output static (no server endpoints) and assets under `docs/` for Pages.

Don’t:
- Add server endpoints, SSR-only features, or non-static adapters.
- Introduce Chart.js or heavyweight chart libs beyond LayerChart.
- Hardcode absolute `/` paths or omit `${base}` for assets/routes.
- Bypass `cn()` or drop `...restProps` on the root.
- Fetch external services at runtime.

## Minimal templates

Variantable component skeleton:
```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { tv, type VariantProps } from "tailwind-variants";

	export const componentVariants = tv({
		base: "rounded-md",
		variants: {
			variant: { default: "bg-card", ghost: "bg-transparent" },
			size: { sm: "h-8 px-2", md: "h-10 px-4" }
		},
		defaultVariants: { variant: "default", size: "md" }
	});

	type Props = WithElementRef<
		HTMLAttributes<HTMLDivElement>
	> & VariantProps<typeof componentVariants>;

	let {
		ref = $bindable(null),
		class: className,
		variant,
		size,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	bind:this={ref}
	data-slot="component"
	class={cn(componentVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
	<!-- content -->
  
</div>
```

Index re-exports (shadcn style):
```ts
import Root, { componentVariants, type Props as ComponentProps } from "./component.svelte";

export {
	Root,
	Root as Component,
	componentVariants,
	type ComponentProps
};
```

Fetching from static data with base path:
```ts
import { base } from "$app/paths";

const DATA_BASE = `${base}/data`;
const res = await fetch(`${DATA_BASE}/summary.json`);
if (!res.ok) throw new Error("Failed to load summary");
const summary = await res.json();
```

---

These rules are the default for this repository. Prefer consistency with existing files under `src/lib/components/ui/` and `src/app.css`, and follow feature placement under `src/lib/components/topic-explorer/`. For Pages, ensure links include `${base}` and trailing slashes, and remember the build emits to `docs/`.
