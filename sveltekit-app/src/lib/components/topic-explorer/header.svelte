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

<header class="flex items-end justify-between gap-4 p-6 bg-card rounded-xl border">
  <div>
  <h1 class="text-3xl font-semibold tracking-tight text-foreground">
      IWAC Topic Explorer
    </h1>
    {#if summary}
      <p class="text-sm text-muted-foreground mt-1 flex items-center gap-2">
    <span class="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
          📄 {fmt(summary.total_docs)} docs
        </span>
    <span class="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
          🏷️ {summary.unique_topics} topics
        </span>
      </p>
    {/if}
  </div>
  <button 
    onclick={toggleTheme}
  class="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md transition-colors duration-200 hover:bg-primary/90"
  >
    🌙 Toggle Theme
  </button>
</header>
