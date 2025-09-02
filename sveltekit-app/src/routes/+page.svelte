<script lang="ts">
  import { onMount } from 'svelte';
  import * as Input from '$lib/components/ui/input';
  import * as Label from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import * as Chart from '$lib/components/ui/chart';
  import { BarChart, LineChart } from 'layerchart';
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { base } from '$app/paths';

  type Summary = { total_docs: number; unique_topics: number; topics: { id: number; label: string; count: number }[]; ai_fields?: string[] };
  type TopicFile = {
    id: number;
    label: string;
    count: number;
    counts_by_country?: Record<string, number>;
    counts_by_month?: Record<string, number>;
    ai_fields?: string[];
    docs: any[];
  };

  // Serve data from SvelteKit static assets (sveltekit-app/static/data)
  const DATA_BASE = `${base}/data`;

  let summary: Summary | null = null;
  let search = '';
  let minCount = 5;
  let filtered: Summary['topics'] = [];
  let active: TopicFile | null = null;
  let activeId: number | null = null;

  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  const prettify = (label: string | null, id: number) => (label && label.trim() ? label : `Topic ${id}`);

  async function loadSummary() {
    const res = await fetch(`${DATA_BASE}/summary.json`);
    if (!res.ok) throw new Error('Cannot load summary.json');
    summary = await res.json();
    applyFilter();
  }

  function applyFilter() {
    if (!summary) return;
    const q = search.toLowerCase().trim();
    filtered = summary.topics
      .filter((t) => t.id !== -1)
      .filter((t) => t.count >= (minCount || 0))
      .filter((t) => !q || t.label.toLowerCase().includes(q) || String(t.id).includes(q))
      .sort((a, b) => b.count - a.count)
      .slice(0, 500);
  }

  async function selectTopic(id: number) {
    active = null;
    activeId = id;
    const res = await fetch(`${DATA_BASE}/topics/${id}.json`);
    if (!res.ok) return;
    active = await res.json();
  }

  onMount(loadSummary);

  $: applyFilter();

  // Derived chart data for LayerChart
  $: countryData = active
    ? Object.entries(active.counts_by_country || {}).map(([country, docs]) => ({
        country,
        docs: Number(docs) || 0
      }))
    : [];
  $: monthData = active
    ? Object.keys(active.counts_by_month || {})
        .sort()
        .map((m) => ({ month: m, docs: Number((active?.counts_by_month || {})[m]) || 0 }))
    : [];

  // Chart configs (shadcn-svelte style)
  const countryConfig: Chart.ChartConfig = {
    docs: { 
      label: 'Documents', 
      color: 'var(--chart-1)'
    }
  };
  
  const timeConfig: Chart.ChartConfig = {
    docs: { 
      label: 'Documents', 
      color: 'var(--chart-2)'
    }
  };
</script>

<main class="px-4 py-6 max-w-7xl mx-auto space-y-6">
  <header class="flex items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold">IWAC Topic Explorer</h1>
      {#if summary}
        <p class="text-sm text-muted-foreground mt-1">{fmt(summary.total_docs)} docs · {summary.unique_topics} topics</p>
      {/if}
    </div>
  </header>

  <section class="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
    <Card class="md:sticky md:top-4 h-fit">
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="flex gap-2">
          <Input.Root placeholder="Search topics…" bind:value={search} />
        </div>
        <div class="flex items-center gap-2">
          <Label.Root for="minCount">Min count</Label.Root>
          <Input.Root id="minCount" type="number" min={0} bind:value={minCount} class="w-24" />
        </div>
        <div class="space-y-2 max-h-[60vh] overflow-auto pr-1">
          {#if filtered.length === 0}
            <p class="text-sm text-muted-foreground">No topics.</p>
          {/if}
          {#each filtered as t}
            <button
              class="w-full text-left rounded-md border border-border/60 hover:border-primary px-3 py-2"
              on:click={() => selectTopic(t.id)}
            >
              <div class="font-medium line-clamp-2">{prettify(t.label, t.id)}</div>
              <div class="text-xs text-muted-foreground">{fmt(t.count)}</div>
            </button>
          {/each}
        </div>
      </CardContent>
    </Card>

    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{active ? `${prettify(active.label, active.id)} · ${fmt(active.count)} docs` : 'Select a topic'}</CardTitle>
        </CardHeader>
        {#if active}
          <CardContent>
            <div class="grid md:grid-cols-2 gap-4">
              <Card class="h-full">
                <CardHeader><CardTitle class="text-base">By Country</CardTitle></CardHeader>
                <CardContent>
          <Chart.Container config={countryConfig} class="min-h-[240px] w-full">
                    <BarChart 
                      data={countryData}
                      xScale={scaleBand().padding(0.25)}
                      x="country"
                      y="docs"
                      axis="x"
                      series={[{
                        key: "docs",
                        label: countryConfig.docs.label,
                        color: countryConfig.docs.color
                      }]}
                      props={{
                        xAxis: {
                          format: (d) => d.slice(0, 3)
                        }
                      }}
                    >
            {#snippet tooltip()}
                        <Chart.Tooltip />
                      {/snippet}
                    </BarChart>
                  </Chart.Container>
                </CardContent>
              </Card>
              <Card class="h-full">
                <CardHeader><CardTitle class="text-base">Over Time</CardTitle></CardHeader>
                <CardContent>
          <Chart.Container config={timeConfig} class="min-h-[240px] w-full">
                    <LineChart 
                      data={monthData}
                      x="month"
                      y="docs"
                      axis="x"
                      series={[{
                        key: "docs",
                        label: timeConfig.docs.label,
                        color: timeConfig.docs.color
                      }]}
                      props={{
                        xAxis: {
                          format: (d) => d.slice(0, 7)
                        }
                      }}
                    >
            {#snippet tooltip()}
                        <Chart.Tooltip />
                      {/snippet}
                    </LineChart>
                  </Chart.Container>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        {/if}
      </Card>

      {#if active}
        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent>
            <div class="overflow-auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Date</Table.Head>
                    <Table.Head>Title</Table.Head>
                    <Table.Head>Newspaper</Table.Head>
                    <Table.Head>Country</Table.Head>
                    <Table.Head>Prob</Table.Head>
                    <Table.Head>AI Polarité</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each active.docs as d}
                    <Table.Row>
                      <Table.Cell>{d.date ?? d.pub_date ?? ''}</Table.Cell>
                      <Table.Cell>
                        {#if d.url || d.source_url || d['o:source']}
                          <a class="underline" href={(d.url || d.source_url || d['o:source'])} target="_blank" rel="noopener">{d.title || d.ocr_title || d['o:title'] || 'Untitled'}</a>
                        {:else}
                          {d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                        {/if}
                      </Table.Cell>
                      <Table.Cell>{d.newspaper ?? d.source ?? ''}</Table.Cell>
                      <Table.Cell>{d.country ?? ''}</Table.Cell>
                      <Table.Cell>{d.topic_prob != null ? Number(d.topic_prob).toFixed(2) : ''}</Table.Cell>
                      <Table.Cell>{d.gemini_polarite ?? d.chatgpt_polarite ?? ''}</Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            </div>
          </CardContent>
        </Card>
      {/if}
    </div>
  </section>
</main>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
  }
</style>

