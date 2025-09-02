<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Header, TopicSidebar, TopicDetail } from '$lib/components/topic-explorer';

  type Summary = { 
    total_docs: number; 
    unique_topics: number; 
    topics: { id: number; label: string; count: number }[]; 
    ai_fields?: string[] 
  };
  
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

  let summary = $state<Summary | null>(null);
  let search = $state('');
  let minCount = $state(5);
  let filtered = $state<Summary['topics']>([]);
  let active = $state<TopicFile | null>(null);
  let activeId = $state<number | null>(null);

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

  function handleSearchChange(value: string) {
    search = value;
  }

  function handleMinCountChange(value: number) {
    minCount = value;
  }

  onMount(loadSummary);

  // Convert reactive statements to $derived runes
  $effect(() => {
    applyFilter();
  });
</script>

<main class="px-4 py-6 max-w-7xl mx-auto space-y-6">
  <Header {summary} />

  <section class="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
    <TopicSidebar 
      topics={filtered}
      {search}
      {minCount}
      {activeId}
      onSearchChange={handleSearchChange}
      onMinCountChange={handleMinCountChange}
      onTopicSelect={selectTopic}
    />

    <TopicDetail topic={active} />
  </section>
</main>

