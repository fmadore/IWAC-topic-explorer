<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { LineChart } from 'layerchart';

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
</script>

<div>
  <Card class="h-full border-l-4 border-l-chart-5 shadow-md">
    <CardHeader class="bg-gradient-to-r from-chart-5/10 to-transparent">
      <CardTitle class="text-base flex items-center gap-2 text-chart-5">
        📈 Over Time
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Chart.Container config={timeConfig} class="min-h-[240px] w-full">
        <LineChart 
          data={data}
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
