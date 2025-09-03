<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { LineChart } from 'layerchart';
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';

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

  // Aggregate by year; include zero-filled years so the line returns to 0 when no occurrences
  const chartData = $derived((() => {
    const acc = new Map<number, number>();
    for (const d of data || []) {
      const dt = toDateFromMonth(d.month);
      if (!dt) continue;
      const y = dt.getUTCFullYear();
      acc.set(y, (acc.get(y) || 0) + Number(d.docs || 0));
    }

    const years = Array.from(acc.keys());
    if (years.length === 0) return [] as Array<{ year: number; docs: number; date: Date }>;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    const rows: Array<{ year: number; docs: number; date: Date }> = [];
    for (let year = minYear; year <= maxYear; year++) {
      const docs = acc.get(year) ?? 0;
      rows.push({ year, docs, date: new Date(Date.UTC(year, 0, 1)) });
    }
    return rows;
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
        class="h-[260px] w-full
      [&_.lc-area-path]:fill-transparent [&_.lc-area-path]:stroke-0
          [&_.lc-line]:stroke-2
          [&_.lc-grid-x-rule]:stroke-border/40 [&_.lc-grid-y-rule]:stroke-border/40
      [&_.lc-spline-path]:stroke-[var(--color-docs)] [&_.lc-spline-path]:fill-transparent
        "
      >
        <LineChart
      points={false}
          data={chartData}
          x="date"
          y="docs"
          axis={true}
          xScale={scaleUtc()}
          series={[{
            key: 'docs',
            label: timeConfig.docs.label,
            color: 'var(--color-docs)'
          }]}
          props={{
            spline: { curve: curveNatural, motion: 'tween', strokeWidth: 2 },
            // no highlight points; keep just a clean line
            xAxis: {
              format: (d) => (d as Date).getUTCFullYear().toString()
            },
            yAxis: {
              format: (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)
            }
          }}
        >
          {#snippet tooltip(ctx)}
            <Chart.Tooltip {...ctx} hideLabel />
          {/snippet}
        </LineChart>
      </Chart.Container>
    </CardContent>
  </Card>
</div>
