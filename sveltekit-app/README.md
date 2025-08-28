# IWAC Topic Explorer (SvelteKit + Tailwind 4 + shadcn-svelte)

A fully static, client-side topic-exploration UI for the Islam West Africa Collection (IWAC).
Built with SvelteKit (Svelte 5), Tailwind CSS v4, shadcn-svelte UI parts, and LayerChart for charts.
Deployed to GitHub Pages via the static adapter—no server required.

Demo (local)
npm i
npm run dev
# open http://localhost:5173

Features

Search & filter topics (by label / id, min count)

Per-topic dashboards: counts by country and over time (month)

Document table with links (title, outlet, country, topic probability, sentiment/polarity if present)

Dark/light theming via CSS variables mapped to Tailwind tokens

100% static hosting: data are JSON files under static/data/

# IWAC Topic Explorer (SvelteKit + Tailwind 4 + shadcn-svelte)

A fully static, client-side topic-exploration UI for the Islam West Africa Collection (IWAC).
Built with SvelteKit (Svelte 5), Tailwind CSS v4, shadcn-svelte UI parts, and LayerChart for charts.
Deployed to GitHub Pages via the static adapter — no server required.

## Demo (local)

Install dependencies and start the dev server:

```bash
npm install
npm run dev
# then open http://localhost:5173
```

## Features

- Search & filter topics (by label / id, min count)
- Per-topic dashboards: counts by country and over time (month)
- Document table with links (title, outlet, country, topic probability, sentiment/polarity if present)
- Dark/light theming via CSS variables mapped to Tailwind tokens
- 100% static hosting: data are JSON files under `static/data/`

## Tech stack

- SvelteKit 2 / Svelte 5 with `@sveltejs/adapter-static`
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- shadcn-svelte primitives (Button, Card, Input, Label, Table, Tooltip)
- LayerChart + `d3-scale` for charts
- Prettier + `prettier-plugin-svelte`

## Data model (static JSON)

The UI loads JSON from `static/data/`. Two kinds of files are expected.

`summary.json` (example):

```json
{
  "total_docs": 12345,
  "unique_topics": 200,
  "topics": [
    { "id": 12, "label": "Religious associations on campus", "count": 321 },
    { "id": 7,  "label": "Mosque construction",               "count": 275 }
  ],
  "ai_fields": ["gemini_polarite"]
}
```

`topics/{id}.json` (example):

```json
{
  "id": 12,
  "label": "Religious associations on campus",
  "count": 321,
  "avg_prob": 0.42,
  "counts_by_country": { "Benin": 88, "Togo": 70, "Côte d'Ivoire": 95, "Burkina Faso": 68 },
  "counts_by_month": { "1978-03": 2, "1978-04": 3 },
  "ai_fields": ["gemini_polarite"],
  "docs": [
    {
      "topic_id": 12,
      "topic_prob": 0.77,
      "topic_label": "Religious associations on campus",
      "pub_date": "1979-05-14",
      "date": "1979-05-14",
      "country": "Togo",
      "newspaper": "Togo-Presse",
      "title": "Associations étudiantes et religion",
      "url": "https://...",
      "sentiment_label": "neutral",
      "sentiment_score": 0.51,
      "gemini_polarite": "neutre"
    }
  ]
}
```

The UI is tolerant of missing fields. Dates are aggregated by `YYYY-MM`.

## Building the static data

A helper script prepares compact JSON directly from a Hugging Face dataset and writes into `sveltekit-app/static/data/` by default.

1. Install Python deps (recommended: create and activate a venv):

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r sveltekit-app/static/data/requirements.txt
```

2. Authenticate with Hugging Face (if private / rate limited):

PowerShell:

```powershell
$env:HF_TOKEN = "hf_..."
```

3. Run the exporter (example):

```bash
python sveltekit-app/static/data/build_topic_explorer_data.py \
  --repo fmadore/islam-west-africa-collection \
  --config-name articles \
  --out-dir sveltekit-app/static/data \
  --per-topic-docs 200 \
  --topic-min-count 5
```

Key options:

- `--repo`: HF dataset repo id
- `--config-name`: `articles` or `publications`
- `--out-dir`: where `summary.json` and `topics/*.json` are written
- `--max-docs`: quick sampling for tests
- `--per-topic-docs`: cap document rows per topic
- `--topic-min-count`: drop very small topics from the summary

## Project layout

```
sveltekit-app/
  src/
    routes/+page.svelte
    routes/+layout.{svelte,ts}
    lib/components/ui/
    lib/components/ui/chart/
    app.css
    app.html
  static/
    data/
      summary.json
      topics/{id}.json
      build_topic_explorer_data.py
      requirements.txt
  svelte.config.js
  vite.config.ts
  package.json
```

## Local development

```bash
npm install
npm run dev
```

The explorer is available at the root route (`/`). Ensure `static/data/summary.json` and `static/data/topics/*.json` exist.

## Build & deploy (GitHub Pages)

The static adapter emits into `docs/`. Set `BASE_PATH` before building when deploying under a repo subpath.

Bash example:

```bash
export BASE_PATH="/IWAC-topic-explorer"
npm run build
```

PowerShell example:

```powershell
$env:BASE_PATH = "/IWAC-topic-explorer"
npm run build
```

Output: `docs/` (both pages and assets). In GitHub Pages settings use the `docs/` folder of your default branch.

If deploying to a repository subpath, the site URL will be:

```
https://<user>.github.io/IWAC-topic-explorer/
```

Tip: If you see a blank page or missing assets, the base path is likely wrong. For root domains (e.g., `username.github.io`) build with `BASE_PATH=""`.

## Theming & UI notes

- Colors and chart palettes are defined as CSS custom properties in `src/app.css` and mapped to Tailwind tokens.
- Dark mode is applied by toggling the `.dark` class on `<html>` or `<body>`.
- Components come from shadcn-svelte; chart wrappers live under `lib/components/ui/chart/`.

## Scripts (package.json)

- `npm run dev` — start Vite dev server
- `npm run build` — build to `docs/` (respects `BASE_PATH`)
- `npm run preview` — preview production build
- `npm run check` — `svelte-check` (TypeScript)
- `npm run format` / `npm run lint` — Prettier
- `npm run deploy` — convenience PowerShell wrapper that sets `BASE_PATH` then builds

## Troubleshooting

- Blank UI / 404s on assets: set `BASE_PATH` to your repo name (e.g., `/IWAC-topic-explorer`) before `npm run build`.
- No topics displayed: ensure `static/data/summary.json` exists and topic counts meet the min-count filter.
- Dates not aggregating: the exporter normalizes `pub_date`/`date` to `YYYY-MM`; verify your dataset has parsable values.

---

README formatted and structured for readability.
