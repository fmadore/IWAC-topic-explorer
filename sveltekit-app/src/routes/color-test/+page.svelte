<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="text-4xl font-bold text-foreground">Color Test Page</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Background Colors -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Background Colors</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="p-4 bg-primary text-primary-foreground rounded">Primary</div>
        <div class="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
        <div class="p-4 bg-muted text-muted-foreground rounded">Muted</div>
        <div class="p-4 bg-accent text-accent-foreground rounded">Accent</div>
        <div class="p-4 bg-destructive text-destructive-foreground rounded">Destructive</div>
      </CardContent>
    </Card>

    <!-- Text Colors -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Text Colors</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <p class="text-foreground">Foreground text</p>
        <p class="text-muted-foreground">Muted foreground text</p>
        <p class="text-primary">Primary text</p>
        <p class="text-secondary">Secondary text</p>
        <p class="text-destructive">Destructive text</p>
      </CardContent>
    </Card>

    <!-- Buttons -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Button Variants</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <Button.Root variant="default">Default Button</Button.Root>
        <Button.Root variant="secondary">Secondary Button</Button.Root>
        <Button.Root variant="destructive">Destructive Button</Button.Root>
        <Button.Root variant="outline">Outline Button</Button.Root>
        <Button.Root variant="ghost">Ghost Button</Button.Root>
      </CardContent>
    </Card>

    <!-- Charts Colors -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Chart Colors</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="p-4 bg-chart-1 text-white rounded">Chart 1</div>
        <div class="p-4 bg-chart-2 text-white rounded">Chart 2</div>
        <div class="p-4 bg-chart-3 text-white rounded">Chart 3</div>
        <div class="p-4 bg-chart-4 text-white rounded">Chart 4</div>
        <div class="p-4 bg-chart-5 text-white rounded">Chart 5</div>
      </CardContent>
    </Card>

    <!-- Border and Ring -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Borders & Rings</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="p-4 border border-border rounded">Border</div>
        <div class="p-4 border-2 border-primary rounded">Primary Border</div>
        <div class="p-4 ring-2 ring-ring rounded">Ring</div>
        <input class="p-2 border border-input rounded" placeholder="Input border" />
      </CardContent>
    </Card>

    <!-- Dark Mode Test -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle>Dark Mode Toggle</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <button 
          onclick={() => document.documentElement.classList.toggle('dark')}
          class="p-2 bg-primary text-primary-foreground rounded"
        >
          Toggle Dark Mode
        </button>
        <p class="text-sm text-muted-foreground">
          Click to test dark mode colors
        </p>
      </CardContent>
    </Card>
  </div>
</div>
