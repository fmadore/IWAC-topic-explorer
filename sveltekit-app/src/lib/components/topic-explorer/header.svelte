<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    summary: { total_docs: number; unique_topics: number } | null;
  }

  let { summary }: Props = $props();

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  // Fullscreen toggle logic
  let isFullscreen = $state(false);

  function updateFullscreenState() {
    isFullscreen = Boolean(document.fullscreenElement);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (e) {
      // no-op if fullscreen is not supported or user agent blocks it
      console.warn('Fullscreen toggle failed', e);
    }
  }

  onMount(() => {
    updateFullscreenState();
    const handler = () => updateFullscreenState();
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  });
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
  <div class="flex items-center gap-2">
    <button
      onclick={toggleFullscreen}
      aria-pressed={isFullscreen}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      class="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md transition-colors duration-200 hover:bg-primary/90"
    >
      {#if isFullscreen}
        🗗 Exit Fullscreen
      {:else}
        🗖 Fullscreen
      {/if}
    </button>
    <button 
      onclick={toggleTheme}
      class="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md transition-colors duration-200 hover:bg-primary/90"
    >
      🌙 Toggle Theme
    </button>
  </div>
</header>
