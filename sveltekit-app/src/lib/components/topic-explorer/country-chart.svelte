<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { BarChart } from 'layerchart';
  import { scaleBand } from 'd3-scale';
  import { getCountryColor } from './colors';

  type CountryData = { country: string; docs: number };

  interface Props {
    data: CountryData[];
  }

  let { data }: Props = $props();

  const chartData = $derived(data.map((d) => ({
    ...d,
    color: getCountryColor(d.country)
  })));
  
  const countryConfig = $derived(Object.fromEntries([
    ['docs', { label: 'Documents' }],
    ...data.map((d) => [d.country, { 
      label: d.country, 
      color: getCountryColor(d.country)
    }])
  ]) as Chart.ChartConfig);
</script>

<div class="w-full min-w-0">
  <Card class="h-full border-l-4 border-l-accent/70 shadow-sm">
    <CardHeader class="bg-card">
      <CardTitle class="text-base flex items-center gap-2 text-foreground/90">
        🌍 By Country
      </CardTitle>
    </CardHeader>
    <CardContent class="p-4">
      <Chart.Container 
        config={countryConfig} 
        class="h-[240px] w-full [&_.lc-grid-x-rule]:stroke-border/40 [&_.lc-grid-y-rule]:stroke-border/40 [&_.lc-axis-tick-label]:fill-foreground"
      >
        <BarChart 
          data={chartData}
          xScale={scaleBand().padding(0.25)}
          x="country"
          y="docs"
          cRange={chartData.map((c) => c.color)}
          c="color"
          axis={true}
          highlight={false}
          props={{
            bars: {
              stroke: 'none',
              radius: 6,
              rounded: 'all'
            },
            highlight: { area: { fill: "none" } },
            xAxis: {
              format: (d: string) => d
            },
            yAxis: {
              format: (d: number) => new Intl.NumberFormat().format(d)
            }
          }}
        >
          {#snippet tooltip(ctx)}
            <Chart.Tooltip
              {...ctx}
              nameKey="country"
              formatter={(value) => typeof value === 'number' ? new Intl.NumberFormat().format(value) : value}
            />
          {/snippet}
        </BarChart>
      </Chart.Container>
    </CardContent>
  </Card>
</div>
