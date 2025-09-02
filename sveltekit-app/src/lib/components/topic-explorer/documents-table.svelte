<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import { cn, type WithElementRef } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

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
</script>

<div bind:this={ref} class={cn("", className)} {...restProps}>
  <Card class="border-l-4 border-l-chart-4 shadow-md">
    <CardHeader class="bg-gradient-to-r from-chart-4/10 to-transparent">
      <CardTitle class="flex items-center gap-2 text-chart-4">
        📄 Documents
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="overflow-auto">
        <Table.Root>
          <Table.Header class="bg-gradient-to-r from-chart-4/10 to-transparent">
            <Table.Row>
              <Table.Head class="text-chart-4 font-semibold">📅 Date</Table.Head>
              <Table.Head class="text-chart-4 font-semibold">📰 Title</Table.Head>
              <Table.Head class="text-chart-4 font-semibold">🏢 Newspaper</Table.Head>
              <Table.Head class="text-chart-4 font-semibold">🌍 Country</Table.Head>
              <Table.Head class="text-chart-4 font-semibold">📊 Prob</Table.Head>
              <Table.Head class="text-chart-4 font-semibold">🤖 AI Polarité</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each documents as d, index}
              <Table.Row class="hover:bg-chart-4/5 transition-colors">
                <Table.Cell class="text-muted-foreground">
                  {d.date ?? d.pub_date ?? ''}
                </Table.Cell>
                <Table.Cell>
                  {#if d.url || d.source_url || d['o:source']}
                    <a 
                      class="text-chart-2 hover:text-chart-1 underline font-medium transition-colors" 
                      href={(d.url || d.source_url || d['o:source'])} 
                      target="_blank" 
                      rel="noopener"
                    >
                      {d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                    </a>
                  {:else}
                    <span class="font-medium">
                      {d.title || d.ocr_title || d['o:title'] || 'Untitled'}
                    </span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="text-muted-foreground">
                  {d.newspaper ?? d.source ?? ''}
                </Table.Cell>
                <Table.Cell>
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-chart-3 text-white">
                    {d.country ?? ''}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {#if d.topic_prob != null}
                    {#if Number(d.topic_prob) >= 0.7}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-chart-1 text-white">
                        {Number(d.topic_prob).toFixed(2)}
                      </span>
                    {:else if Number(d.topic_prob) >= 0.4}
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-chart-2 text-white">
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
                      <span class="px-2 py-1 rounded-full text-xs font-medium bg-chart-5 text-white">
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
