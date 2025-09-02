<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { BarChart } from 'layerchart';
  import { scaleBand } from 'd3-scale';

  type CountryData = { country: string; docs: number };

  interface Props {
    data: CountryData[];
  }

  let { data }: Props = $props();

  // Chart config for countries
  const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
  const keyFor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const countryConfig = $derived(Object.fromEntries(
    data.map((d, i) => [keyFor(d.country), { label: d.country, color: palette[i % palette.length] }])
  ) as Chart.ChartConfig);
  
  const barFill = (d: { country: string }) => `var(--color-${keyFor(d.country)})`;
</script>

<div>
  <Card class="h-full border-l-4 border-l-chart-3 shadow-md">
    <CardHeader class="bg-gradient-to-r from-chart-3/10 to-transparent">
      <CardTitle class="text-base flex items-center gap-2 text-chart-3">
        🌍 By Country
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Chart.Container config={countryConfig} class="min-h-[240px] w-full">
        <BarChart 
          data={data}
          xScale={scaleBand().padding(0.25)}
          x="country"
          y="docs"
          axis="x"
          series={[{
            key: "docs",
            label: 'Documents',
            color: 'var(--chart-1)'
          }]}
          props={{
            bars: {
              fill: barFill as unknown as string,
              stroke: 'none',
              radius: 6,
              rounded: 'all'
            },
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
</div>
