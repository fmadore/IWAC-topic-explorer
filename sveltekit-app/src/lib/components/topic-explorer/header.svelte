<script lang="ts">
  interface Props {
    summary: { total_docs: number; unique_topics: number } | null;
  }

  let { summary }: Props = $props();

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
</script>

<header class="flex items-end justify-between gap-4 p-6 bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl border">
  <div>
    <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
      IWAC Topic Explorer
    </h1>
    {#if summary}
      <p class="text-sm text-muted-foreground mt-1 flex items-center gap-2">
        <span class="inline-flex items-center gap-1 px-2 py-1 bg-chart-2 text-white rounded-full text-xs font-medium">
          📄 {fmt(summary.total_docs)} docs
        </span>
        <span class="inline-flex items-center gap-1 px-2 py-1 bg-chart-4 text-white rounded-full text-xs font-medium">
          🏷️ {summary.unique_topics} topics
        </span>
      </p>
    {/if}
  </div>
  <button 
    onclick={toggleTheme}
    class="px-3 py-2 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
  >
    🌙 Toggle Theme
  </button>
</header>
