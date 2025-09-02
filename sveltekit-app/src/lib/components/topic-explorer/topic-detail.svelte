<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import CountryChart from './country-chart.svelte';
  import TimeChart from './time-chart.svelte';
  import DocumentsTable from './documents-table.svelte';
  import { cn } from '$lib/utils';

  type TopicFile = {
    id: number;
    label: string;
    count: number;
    counts_by_country?: Record<string, number>;
    counts_by_month?: Record<string, number>;
    ai_fields?: string[];
    docs: any[];
  };

  interface Props {
    topic: TopicFile | null;
  }

  let { topic }: Props = $props();

  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  const prettify = (label: string | null, id: number) => (label && label.trim() ? label : `Topic ${id}`);

  // Derived chart data
  const countryData = $derived(topic
    ? Object.entries(topic.counts_by_country || {}).map(([country, docs]) => ({
        country,
        docs: Number(docs) || 0
      }))
    : []);
  
  const monthData = $derived(topic
    ? Object.keys(topic.counts_by_month || {})
        .sort()
        .map((m) => ({ month: m, docs: Number((topic?.counts_by_month || {})[m]) || 0 }))
    : []);
</script>

<div class="space-y-4">
  <Card
    class={cn(
      'border-l-4 shadow-lg',
      topic ? 'border-l-chart-2' : 'border-l-border'
    )}
  >
    <CardHeader
      class={cn(
        'bg-gradient-to-r',
        topic ? 'from-chart-2/5 to-transparent' : 'from-muted/30'
      )}
    >
  <CardTitle class={cn('flex items-center gap-2', topic && 'text-chart-2')}>
        {#if topic}
          📊 {prettify(topic.label, topic.id)} · {fmt(topic.count)} docs
        {:else}
          🎯 Select a topic
        {/if}
      </CardTitle>
    </CardHeader>
    {#if topic}
      <CardContent>
        <div class="grid md:grid-cols-2 gap-4">
          <CountryChart data={countryData} />
          <TimeChart data={monthData} />
        </div>
      </CardContent>
    {/if}
  </Card>

  {#if topic}
    <DocumentsTable documents={topic.docs} />
  {/if}
</div>
