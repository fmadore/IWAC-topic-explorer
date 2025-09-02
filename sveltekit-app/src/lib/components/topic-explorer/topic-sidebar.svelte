<script lang="ts">
  import * as Input from '$lib/components/ui/input';
  import * as Label from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  type Topic = { id: number; label: string; count: number };

  interface Props {
    topics: Topic[];
    search: string;
    minCount: number;
    activeId: number | null;
    onSearchChange: (value: string) => void;
    onMinCountChange: (value: number) => void;
    onTopicSelect: (id: number) => void;
  }

  let {
    topics,
    search,
    minCount,
    activeId,
    onSearchChange,
    onMinCountChange,
    onTopicSelect
  }: Props = $props();

  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  const prettify = (label: string | null, id: number) => (label && label.trim() ? label : `Topic ${id}`);
</script>

<aside class="md:sticky md:top-4 h-fit">
  <Card class="border-l-4 border-l-primary/70 shadow-sm">
    <CardHeader class="bg-card">
      <CardTitle class="flex items-center gap-2 text-foreground">
        🏷️ Topics
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex gap-2">
        <Input.Root 
          placeholder="Search topics…" 
          value={search}
          oninput={(e) => onSearchChange(e.currentTarget.value)}
          class="focus:border-ring focus:ring-ring/20" 
        />
      </div>
      <div class="flex items-center gap-2">
        <Label.Root for="minCount" class="text-foreground/80 font-medium">Min count</Label.Root>
        <Input.Root 
          id="minCount" 
          type="number" 
          min={0} 
          value={minCount}
          oninput={(e) => onMinCountChange(Number(e.currentTarget.value))}
          class="w-24 focus:border-ring focus:ring-ring/20" 
        />
      </div>
      <div class="space-y-2 max-h-[60vh] overflow-auto pr-1">
        {#if topics.length === 0}
          <p class="text-sm text-muted-foreground">No topics.</p>
        {/if}
        {#each topics as t, index}
          <button
            class="w-full text-left rounded-lg border border-border/70 hover:border-primary hover:bg-accent/40 transition-colors duration-200 px-4 py-3 group"
            class:bg-primary={activeId === t.id}
            class:text-primary-foreground={activeId === t.id}
            class:border-primary={activeId === t.id}
            onclick={() => onTopicSelect(t.id)}
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="font-medium line-clamp-2 group-hover:text-primary" class:text-primary-foreground={activeId === t.id}>
                  {prettify(t.label, t.id)}
                </div>
                <div class="text-xs mt-1 flex items-center gap-2">
                  <span class="px-2 py-1 rounded-full text-xs font-medium"
                        class:bg-primary={activeId === t.id}
                        class:text-primary-foreground={activeId === t.id}
                        class:bg-accent={activeId !== t.id}
                        class:text-accent-foreground={activeId !== t.id}>
                    {fmt(t.count)} docs
                  </span>
                </div>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </CardContent>
  </Card>
</aside>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
  }
</style>
