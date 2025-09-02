import { getContext, setContext, type Component, type ComponentProps, type Snippet } from "svelte";
import * as Tooltip from "$lib/components/ui/tooltip";

export const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
	[k in string]: {
		label?: string;
		icon?: Component;
	} & (
		| { color?: string; theme?: never }
		| { color?: never; theme: Record<keyof typeof THEMES, string> }
	);
};

export type ExtractSnippetParams<T> = T extends Snippet<[infer P]> ? P : never;

// Keep payload flexible to work across chart versions
export type TooltipPayload = {
	value?: number | string;
	name?: string;
	key?: string;
	payload?: Record<string, unknown>;
	// allow extra fields used by LayerChart
	[k: string]: unknown;
};

// Helper to safely access dynamic properties on TooltipPayload
export function getPayloadProperty(payload: TooltipPayload, key: string): any {
	if (typeof payload !== "object" || payload === null) return undefined;
	// direct access
	if (key in (payload as any)) return (payload as any)[key];
	// nested payload payload
	if ((payload as any).payload && key in (payload as any).payload) {
		return (payload as any).payload[key];
	}
	return undefined;
}

// Helper to extract item config from a payload.
export function getPayloadConfigFromPayload(
	config: ChartConfig,
	payload: TooltipPayload,
	key: string
) {
	if (typeof payload !== "object" || payload === null) return undefined;

	const payloadPayload =
		"payload" in payload && typeof payload.payload === "object" && payload.payload !== null
			? payload.payload
			: undefined;

	let configLabelKey: string = key;

	if (payload.key === key) {
		configLabelKey = payload.key;
	} else if (payload.name === key) {
		configLabelKey = payload.name;
	} else if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
		configLabelKey = payload[key as keyof typeof payload] as string;
	} else if (
		payloadPayload !== undefined &&
		key in payloadPayload &&
		typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
	) {
		configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
	}

	return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

type ChartContextValue = {
	config: ChartConfig;
};

const chartContextKey = Symbol("chart-context");

export function setChartContext(value: ChartContextValue) {
	return setContext(chartContextKey, value);
}

export function useChart() {
	return getContext<ChartContextValue>(chartContextKey);
}
