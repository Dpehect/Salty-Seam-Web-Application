<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		loader: () => Promise<any>;
		fallbackHeight?: string;
		[key: string]: any;
	}

	let { loader, fallbackHeight = '50vh', ...restProps }: Props = $props();

	let component = $state<any>(null);
	let element = $state<HTMLElement | null>(null);
	let isIntersected = $state(false);

	onMount(() => {
		// Use IntersectionObserver to hydrate when approaching
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					isIntersected = true;
					observer.disconnect();
				}
			},
			{
				rootMargin: '200px' // Hydrate slightly before entering viewport
			}
		);

		if (element) {
			observer.observe(element);
		}

		return () => {
			observer.disconnect();
		};
	});

	// Trigger loading when intersecting
	$effect(() => {
		if (isIntersected && !component) {
			loader()
				.then((module) => {
					// In Svelte 5, dynamic components are evaluated directly
					component = module.default || module;
				})
				.catch((err) => {
					console.error('Failed to load slice dynamically:', err);
				});
		}
	});
</script>

<div bind:this={element} style:min-height={component ? 'auto' : fallbackHeight} class="w-full relative">
	{#if component}
		{@const Component = component}
		<Component {...restProps} />
	{:else}
		<!-- Awwwards-grade placeholder skeleton with custom brand gradients and pulse -->
		<div class="w-full flex items-center justify-center p-8" style:min-height={fallbackHeight}>
			<div class="w-full max-w-7xl h-[300px] rounded-3xl glass-panel animate-pulse flex items-center justify-center relative overflow-hidden">
				<!-- Sophisticated ambient gradient background inside placeholder -->
				<div class="absolute -top-1/2 -left-1/4 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl"></div>
				<div class="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl"></div>
				
				<div class="flex flex-col items-center gap-3 z-10">
					<div class="w-8 h-8 rounded-full border-2 border-ink-200 border-t-accent-pink animate-spin"></div>
					<span class="text-ink-400 text-xs tracking-[0.2em] font-medium uppercase mt-2">Hydrating Slice...</span>
				</div>
			</div>
		</div>
	{/if}
</div>
