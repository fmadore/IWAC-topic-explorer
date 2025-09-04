<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import { cn, type WithElementRef } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getCountryColor, getTextColorForBg } from './colors';

  type Document = {
    date?: string;
    pub_date?: string;
    title?: string;
    ocr_title?: string;
    'o:title'?: string;
    url?: string;
    source_url?: string;
    'o:source'?: string;
    newspaper?: string;
    source?: string;
    country?: string;
    topic_prob?: number;
    gemini_polarite?: string;
    chatgpt_polarite?: string;
  };

  interface Props {
    documents: Document[];
  }

  type RootProps = WithElementRef<HTMLAttributes<HTMLDivElement>>;

  let {
    ref = $bindable(null),
    class: className,
    documents,
    ...restProps
  }: Props & RootProps = $props();

  // Sorting
  type SortKey = 'date' | 'title' | 'newspaper' | 'country' | 'topic_prob' | 'polarity';
  let sortKey = $state<SortKey>('date');
  let sortDir = $state<'asc' | 'desc'>('desc');

  const getDate = (d: Document): number => {
    const s = d.date ?? d.pub_date ?? '';
    const t = Date.parse(s);
    return Number.isNaN(t) ? 0 : t;
  };

  const getTitle = (d: Document): string => (d.title || d.ocr_title || d['o:title'] || '').toLowerCase();
  const getNewspaper = (d: Document): string => (d.newspaper ?? d.source ?? '').toLowerCase();
  const getCountry = (d: Document): string => (d.country ?? '').toLowerCase();
  const getProb = (d: Document): number => (d.topic_prob != null ? Number(d.topic_prob) : Number.NEGATIVE_INFINITY);
  const getPolarityRaw = (d: Document): string => (d.gemini_polarite ?? d.chatgpt_polarite ?? '').toLowerCase();
  const polarityOrder: Record<string, number> = { negative: -1, neutral: 0, mixed: 0, positive: 1 };
  const getPolarity = (d: Document): number => {
    const p = getPolarityRaw(d);
    return polarityOrder[p] ?? 0;
  };

  function setSort(key: SortKey) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      // Sensible defaults: dates/probabilities desc, strings asc
      sortDir = key === 'date' || key === 'topic_prob' ? 'desc' : 'asc';
    }
  }

  let sortedDocuments: () => Document[] = $derived(() => {
    const arr = [...documents];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      switch (sortKey) {
        case 'date':
          va = getDate(a);
          vb = getDate(b);
          break;
        case 'title':
          va = getTitle(a);
          vb = getTitle(b);
          break;
        case 'newspaper':
          va = getNewspaper(a);
          vb = getNewspaper(b);
          break;
        case 'country':
          va = getCountry(a);
          vb = getCountry(b);
          break;
        case 'topic_prob':
          va = getProb(a);
          vb = getProb(b);
          break;
        case 'polarity':
          va = getPolarity(a);
          vb = getPolarity(b);
          break;
      }

  if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      // string compare
      return String(va).localeCompare(String(vb)) * dir;
    });
    return arr;
  });
</script>

<div bind:this={ref} class={cn("", className)} {...restProps}>
  <Card class="border-l-4 border-l-secondary/70 shadow-sm">
    <CardHeader class="bg-card">
      <CardTitle class="flex items-center gap-2 text-foreground">
        📄 Documents
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <Table.Root>
          <Table.Header class="bg-secondary/30">
            <Table.Row>
              <Table.Head
                class="text-foreground/80 font-semibold w-24 min-w-24"
                aria-sort={sortKey === 'date' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('date')}
                >
                  📅 Date
                  {#if sortKey === 'date'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
              <Table.Head
                class="text-foreground/80 font-semibold max-w-xs"
                aria-sort={sortKey === 'title' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('title')}
                >
                  📰 Title
                  {#if sortKey === 'title'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
              <Table.Head
                class="text-foreground/80 font-semibold w-32 min-w-32"
                aria-sort={sortKey === 'newspaper' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('newspaper')}
                >
                  🏢 Newspaper
                  {#if sortKey === 'newspaper'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
              <Table.Head
                class="text-foreground/80 font-semibold w-20 min-w-20"
                aria-sort={sortKey === 'country' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('country')}
                >
                  🌍 Country
                  {#if sortKey === 'country'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
              <Table.Head
                class="text-foreground/80 font-semibold w-16 min-w-16"
                aria-sort={sortKey === 'topic_prob' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('topic_prob')}
                >
                  📊 Prob
                  {#if sortKey === 'topic_prob'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
              <Table.Head
                class="text-foreground/80 font-semibold w-24 min-w-24"
                aria-sort={sortKey === 'polarity' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none"
                  onclick={() => setSort('polarity')}
                >
                  🤖 AI Polarité
                  {#if sortKey === 'polarity'}<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>{/if}
                </button>
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each sortedDocuments() as d, index}
              <Table.Row class="hover:bg-accent/40 transition-colors">
                <Table.Cell class="text-muted-foreground text-xs whitespace-nowrap">
                  {d.date ?? d.pub_date ?? ''}
                </Table.Cell>
                <Table.Cell class="max-w-xs">
                  {#if d.url || d.source_url || d['o:source']}
                    <a 
                      class="text-primary hover:opacity-90 underline font-medium transition-opacity block truncate" 
                      href={(d.url || d.source_url || d['o:source'])} 
                      target="_blank" 
                      rel="noopener"
                      title={d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                    >
                      {d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                    </a>
                  {:else}
                    <span class="font-medium block truncate" title={d.title || d.ocr_title || d['o:title'] || 'Untitled'}>
                      {d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                    </span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="text-muted-foreground text-sm truncate">
                  <span title={d.newspaper ?? d.source ?? ''}>
                    {d.newspaper ?? d.source ?? ''}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {#if d.country}
                    {@const bg = getCountryColor(d.country)}
                    {@const fg = getTextColorForBg(bg)}
                    <span class="px-2 py-1 rounded-full text-xs font-medium" style={`background-color:${bg};color:${fg}`}>
                      {d.country}
                    </span>
                  {:else}
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">—</span>
                  {/if}
                </Table.Cell>
                <Table.Cell>
                  {#if d.topic_prob != null}
                    {#if Number(d.topic_prob) >= 0.7}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        {Number(d.topic_prob).toFixed(2)}
                      </span>
                    {:else if Number(d.topic_prob) >= 0.4}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {Number(d.topic_prob).toFixed(2)}
                      </span>
                    {:else}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {Number(d.topic_prob).toFixed(2)}
                      </span>
                    {/if}
                  {:else}
                    <span class="text-muted-foreground">—</span>
                  {/if}
                </Table.Cell>
                <Table.Cell>
                  {#if d.gemini_polarite ?? d.chatgpt_polarite}
                    {#if (d.gemini_polarite ?? d.chatgpt_polarite) === 'positive'}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        {d.gemini_polarite ?? d.chatgpt_polarite}
                      </span>
                    {:else if (d.gemini_polarite ?? d.chatgpt_polarite) === 'negative'}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                        {d.gemini_polarite ?? d.chatgpt_polarite}
                      </span>
                    {:else}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {d.gemini_polarite ?? d.chatgpt_polarite}
                      </span>
                    {/if}
                  {:else}
                    <span class="text-muted-foreground">—</span>
                  {/if}
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    </CardContent>
  </Card>
</div>
