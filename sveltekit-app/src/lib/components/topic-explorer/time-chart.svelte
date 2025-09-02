<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { LineChart } from 'layerchart';
  import { scaleUtc } from 'd3-scale';

  type TimeData = { month: string; docs: number };

  interface Props {
    data: TimeData[];
  }

  let { data }: Props = $props();

  const timeConfig: Chart.ChartConfig = {
    docs: { 
      label: 'Documents', 
      color: 'var(--chart-2)'
    }
  };

  // Convert YYYY-MM to a Date so we can use a time scale
  function toDateFromMonth(m: string): Date | null {
    if (!m) return null;
    // Normalize separators
    const s = m.replace('/', '-').trim();
    const match = s.match(/^(\d{4})-(\d{1,2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const monthIdx = Math.max(0, Math.min(11, Number(match[2]) - 1));
    return new Date(Date.UTC(year, monthIdx, 1));
  }

  // Aggregate by year for a cleaner timeline
  const chartData = $derived((() => {
    const acc = new Map<number, number>();
    for (const d of data || []) {
      const dt = toDateFromMonth(d.month);
      if (!dt) continue;
      const y = dt.getUTCFullYear();
      acc.set(y, (acc.get(y) || 0) + Number(d.docs || 0));
    }
    const rows = Array.from(acc.entries())
      .map(([year, docs]) => ({ year, docs, date: new Date(Date.UTC(year, 0, 1)) }))
      .sort((a, b) => a.year - b.year);
    return rows as Array<{ year: number; docs: number; date: Date }>;
  })());

  const formatMonth = (dt: Date) => `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
</script>

<div class="w-full min-w-0">
  <Card class="h-full border-l-4 border-l-accent/70 shadow-sm">
    <CardHeader class="bg-card">
      <CardTitle class="text-base flex items-center gap-2 text-foreground/90">
        📈 Over Time
      </CardTitle>
    </CardHeader>
    <CardContent class="p-4">
      <Chart.Container
        config={timeConfig}
        class="h-[240px] w-full [&_.lc-area-path]:fill-transparent [&_.lc-line]:stroke-2 [&_.lc-grid-x-rule]:stroke-border/40 [&_.lc-grid-y-rule]:stroke-border/40"
      >
        <LineChart 
      data={chartData}
      x="date"
          y="docs"
          axis="x"
      xScale={scaleUtc()}
          series={[{
            key: "docs",
            label: timeConfig.docs.label,
            color: 'var(--color-docs)'
          }]}
          props={{
            xAxis: {
              format: (d) => (d as Date).getUTCFullYear().toString()
            }
          }}
        >
          {#snippet tooltip(ctx)}
            <Chart.Tooltip {...ctx} />
          {/snippet}
        </LineChart>
      </Chart.Container>
    </CardContent>
  </Card>
</div>
