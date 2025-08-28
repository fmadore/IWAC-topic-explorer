# SvelteKit + shadcn-svelte Starter

This app is configured for Tailwind + shadcn-svelte and deploys to GitHub Pages using static adapter.

## Setup

1. Install deps

```pwsh
npm i
```

2. Dev

```pwsh
npm run dev -- --open
```

3. Build (outputs to `docs/` for GitHub Pages)

```pwsh
$env:BASE_PATH = "/IWAC-topic-explorer" # set to repo name; blank for root
npm run build
```

4. Enable GitHub Pages in repo settings to serve from `docs/`.

## Add shadcn-svelte components

Install the CLI and generate components:

```pwsh
# one-time
npm i -D shadcn-svelte

# e.g., add Button component
npx shadcn-svelte add button
```

See https://www.shadcn-svelte.com/docs/installation/sveltekit

# IWAC SvelteKit (Svelte 5 + Tailwind 4 + shadcn-svelte)

This app exposes a Topic Explorer dashboard at `/explorer/` using shadcn-svelte components and Chart.js.

## Dev

```pwsh
cd sveltekit-app
npm i
npm run dev
```

For dev, ensure the dataset exists at `../topic-explorer/data`.

## Build for GitHub Pages

```pwsh
cd sveltekit-app
$env:BASE_PATH = '/IWAC-topic-explorer'
npm run build
```

Build output goes to `docs/`. The `postbuild` script copies `../topic-explorer/data/**` into `docs/topic-explorer/data/` so the explorer can fetch JSON at the same base.

## Deploy
Push `docs/` to the `gh-pages` (or default) branch with GitHub Pages enabled. The site will be available at `https://<user>.github.io/IWAC-topic-explorer/`.