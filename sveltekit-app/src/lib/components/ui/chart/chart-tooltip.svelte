<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { getPayloadConfigFromPayload, getPayloadProperty, useChart, type TooltipPayload } from "./chart-utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import type { Snippet } from "svelte";

	type Props = WithElementRef<
		WithoutChildren<HTMLAttributes<HTMLDivElement>> & {
			active?: boolean;
			payload?: TooltipPayload[];
			label?: string;
			labelKey?: string;
			nameKey?: string;
			labelFormatter?: (label: string, payload: TooltipPayload[]) => string;
			labelClassName?: string;
			formatter?: (
				value: string | number | (string | number)[],
				name: string,
				item: TooltipPayload,
				index: number,
				payload: TooltipPayload[]
			) => string | number | (string | number)[];
			color?: string;
			hideLabel?: boolean;
			hideIndicator?: boolean;
			indicator?: "line" | "dot" | "dashed" | "none";
			children?: Snippet<[{ payload: TooltipPayload[] | undefined; label: string | undefined }]>;
		}
	>;

	let {
		ref = $bindable(null),
		class: className,
		active,
		payload,
		label,
		labelKey,
		nameKey = "name",
		labelFormatter,
		labelClassName,
		formatter,
		color,
		hideLabel = false,
		hideIndicator = false,
		indicator = "dot",
		children,
		...restProps
	}: Props = $props();

	const { config } = useChart();

	const tooltipLabel = $derived(
		labelFormatter
			? labelFormatter(label || "", payload || [])
			: labelKey && payload?.[0]
			? getPayloadProperty(payload[0], labelKey)
			: label
	);

	const nestLabel = $derived(payload && payload.length && labelKey ? !!getPayloadProperty(payload[0], labelKey) : false);
</script>

{#snippet TooltipLabel()}
	{#if !hideLabel && tooltipLabel}
		<div class={cn("font-medium", labelClassName)}>
			{tooltipLabel}
		</div>
	{/if}
{/snippet}

{#if active && payload?.length}
	<div
		bind:this={ref}
		data-slot="chart-tooltip"
		class={cn(
			"min-w-32 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
			className
		)}
		{...restProps}
	>
		{#if children}
			{@render children({ payload, label })}
		{:else}
			<div class="grid gap-1.5">
				{#if nestLabel && tooltipLabel}
					{@render TooltipLabel()}
				{/if}
				<div class="grid gap-1.5">
					{#each payload as item, index}
						{@const itemConfig = getPayloadConfigFromPayload(config, item, nameKey)}
						{@const value = formatter
							? formatter(item.value, getPayloadProperty(item, nameKey), item, index, payload)
							: item.value}
						
						<div class="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground">
							{#if !hideIndicator}
								<div
									class={cn("shrink-0 rounded-[2px] border-border bg-(--color-bg)", {
										"h-2.5 w-2.5": indicator === "dot",
										"w-1": indicator === "line",
										"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
										hidden: indicator === "none"
									})}
									style="--color-bg: {itemConfig?.color || color}; --color-border: {itemConfig?.color || color}"
								></div>
							{/if}
							<div
								class={cn(
									"flex flex-1 justify-between leading-none",
									nestLabel ? "items-end" : "items-center"
								)}
							>
								<div class="grid gap-1.5">
									{#if !nestLabel && tooltipLabel}
										{@render TooltipLabel()}
									{/if}
									<span class="text-muted-foreground">
										{itemConfig?.label || getPayloadProperty(item, nameKey)}
									</span>
								</div>
								{#if value !== undefined && value !== null}
									<span class="font-mono font-medium tabular-nums text-foreground">
										{value}
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
