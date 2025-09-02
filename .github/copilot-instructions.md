# GitHub Copilot – Repository Instructions

Authoritative guidance for code completions and suggestions in this repo. Follow these conventions unless a file explicitly deviates.

## Tech stack and scope
- Framework: Svelte 5 with runes ($props, $bindable, $derived). TypeScript, strict.
- UI: shadcn-svelte conventions using Bits UI primitives where applicable. Tailwind CSS v4 for styling. Use tailwind-variants (tv) for variants.
- Charts: Use LayerChart with our local wrappers in `src/lib/components/ui/chart`. Do not add Chart.js.
- Build/hosting: Static site via `@sveltejs/adapter-static`. All routes must be prerendered. `trailingSlash = 'always'`. Target GitHub Pages with a base path.
- Data: Read-only JSON in `static/data`. No runtime network calls to external services.

## Routing and paths (GitHub Pages)
- Always build links and static asset URLs with `$app/paths`:
	- `import { base } from '$app/paths';`
	- Use `${base}` as the prefix for routes and fetches.
- Avoid absolute `/` paths; prefer relative or `${base}`.
- Keep trailing slashes in links due to `trailingSlash = 'always'`.

## Component conventions (shadcn-svelte style)
- Location: `src/lib/components/ui/<component>/`.
- Files:
	- One `.svelte` per primitive/part, e.g. `card.svelte`, `card-header.svelte`, `card-content.svelte`.
	- `index.ts` re-exports: default `Root`, aliases, and named parts (e.g., `Root as Card`, `Header as CardHeader`).
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

## Data access patterns
- Load static JSON from `static/data` via `${base}`:
	- `const DATA_BASE = `${base}/data`;`
	- `await fetch(`${DATA_BASE}/summary.json`)` or `topics/<id>.json`.
- No external fetches at runtime. If data needs to change, generate it ahead of time into `static/data`.

## Testing, quality, performance
- Typecheck with `svelte-check`; format with Prettier. Keep components small and focused.
- Prefer pure utilities in `src/lib` and tree-shakeable re-exports.
- Avoid large, untyped objects; annotate props and derived values.

## Do / Don’t
Do:
- Use Svelte 5 runes ($props, $bindable, $derived) and TypeScript.
- Use `cn()` for class merging and `WithElementRef` for refs.
- Keep components modular with one primitive per file; re-export in `index.ts` shadcn style.
- Use `tailwind-variants` for component variants.
- Use Bits UI primitives (Label, Tooltip) for a11y and consistency.
- Use `${base}` for links and fetches; keep trailing slashes.

Don’t:
- Add server endpoints, SSR-only features, or non-static adapters.
- Introduce Chart.js or heavyweight chart libs beyond LayerChart.
- Hardcode absolute `/` paths or omit `${base}` for assets/routes.
- Bypass `cn()` or drop `...restProps` on the root.

## Minimal templates

Component (variantable) skeleton:

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

These rules are the default for this repository. Prefer consistency with existing files under `src/lib/components/ui/` and `src/app.css`.

