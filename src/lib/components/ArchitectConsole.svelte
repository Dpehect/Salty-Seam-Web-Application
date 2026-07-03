<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { shaderState } from '$lib/state/motion.svelte';

	let isOpen = $state(false);
	let activeTab = $state<'monitor' | 'controls' | 'code'>('monitor');
	let isHighContrast = $state(false);

	// Salty Seam Monitor bars using Svelte 5 Tween class
	const monitorBars = Array.from(
		{ length: 8 },
		(_, i) => new Tween(30 + i * 8, { duration: 500, easing: cubicOut })
	);

	// Tweened mock traffic delta values
	const trafficDelta = new Tween(0, { duration: 400, easing: cubicOut });
	const renderTime = new Tween(16.67, { duration: 400, easing: cubicOut });

	let intervalId: any;
	onMount(() => {
		// Periodically update graph data with smooth Svelte 5 Tweens
		intervalId = setInterval(() => {
			monitorBars.forEach((bar) => {
				bar.target = Math.floor(Math.random() * 85) + 15;
			});
			trafficDelta.target = Math.floor(Math.random() * 950) + 50;
			renderTime.target = parseFloat((Math.random() * 3.5 + 13.5).toFixed(2));
		}, 700);

		return () => {
			clearInterval(intervalId);
		};
	});

	// Toggle high contrast accessibility styling
	$effect(() => {
		if (isHighContrast) {
			document.body.classList.add('high-contrast');
		} else {
			document.body.classList.remove('high-contrast');
		}
	});

	const glslCode = `// GLSL Fragment Shader - Wave Background
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">float</span> uTime;
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">vec2</span> uMouse;
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">float</span> uScroll;
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">vec2</span> uResolution;
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">float</span> uDistort;
<span class="text-accent-pink">uniform</span> <span class="text-accent-yellow">float</span> uFrequencyMultiplier;

<span class="text-ink-400">// Fractional Brownian Motion (fBm)</span>
<span class="text-accent-yellow">float</span> fbm(<span class="text-accent-yellow">vec2</span> p) {
    <span class="text-accent-yellow">float</span> value = 0.0;
    <span class="text-accent-yellow">float</span> amplitude = 0.5;
    <span class="text-accent-pink">for</span>(int i=0; i&lt;5; i++) {
        value += amplitude * noise(p);
        p *= 2.0; amplitude *= 0.5;
    }
    <span class="text-accent-pink">return</span> value;
}

<span class="text-accent-yellow">void</span> main() {
    <span class="text-accent-yellow">vec2</span> uv = vUv;
    <span class="text-accent-yellow">float</span> drift = uTime * 0.04;
    <span class="text-accent-yellow">float</span> distortScale = 1.0 + uDistort * 3.5;
    <span class="text-accent-yellow">float</span> distortFreq = (1.5 + uDistort * 2.0) * uFrequencyMultiplier;
    
    <span class="text-ink-400">// Warp space</span>
    <span class="text-accent-yellow">vec2</span> q = <span class="text-accent-yellow">vec2</span>(fbm(uv * distortFreq), fbm(uv * distortFreq));
    <span class="text-accent-yellow">vec2</span> r = <span class="text-accent-yellow">vec2</span>(fbm(uv + q * distortScale), fbm(uv + q * distortScale));
    <span class="text-accent-yellow">float</span> wave = fbm(uv + r * distortScale);
    
    <span class="text-ink-400">// Cream & vibrant sunset accents</span>
    <span class="text-accent-yellow">vec3</span> finalColor = mix(cream, secondaryGrad, wave);
    gl_FragColor = <span class="text-accent-yellow">vec4</span>(finalColor, 1.0);
}`;
</script>

<!-- Floating Toggle Button -->
<div class="fixed bottom-6 right-6 z-50 gpu-accelerated">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="px-5 py-3 rounded-full glass-panel-heavy shadow-2xl text-xs font-semibold uppercase tracking-[0.2em] text-ink-800 hover:text-accent-pink hover:border-accent-pink/50 transition-all duration-300 flex items-center gap-3 active:scale-95 cursor-pointer"
	>
		<div class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-yellow {isOpen ? 'animate-ping' : ''}"></div>
		{isOpen ? 'Close Console' : 'Architect Console'}
	</button>
</div>

<!-- Expandable Drawer Panel -->
{#if isOpen}
	<div
		role="dialog"
		aria-label="Architect Console"
		class="fixed top-6 bottom-6 right-6 w-full max-w-md glass-panel-heavy rounded-3xl z-40 p-6 shadow-2xl flex flex-col justify-between overflow-hidden gpu-accelerated border border-ink-200"
		class:opacity-100={isOpen}
		class:translate-x-0={isOpen}
	>
		<div>
			<!-- Drawer Header -->
			<div class="flex justify-between items-center border-b border-ink-100/50 pb-4 mb-6">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-accent-pink"></div>
					<h2 class="font-display font-extrabold tracking-wider text-ink-950 uppercase text-sm">System Diagnostics</h2>
				</div>
				
				<!-- High Contrast Toggle (Accessibility Layer) -->
				<label class="flex items-center gap-2 cursor-pointer select-none">
					<span class="text-[10px] uppercase tracking-wider font-semibold text-ink-600">High Contrast</span>
					<input 
						type="checkbox" 
						bind:checked={isHighContrast}
						class="sr-only peer"
					/>
					<div class="relative w-9 h-5 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cream-50 after:border-ink-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-pink"></div>
				</label>
			</div>

			<!-- Navigation Tabs -->
			<div class="grid grid-cols-3 gap-2 bg-cream-100/50 p-1 rounded-xl mb-6">
				<button
					onclick={() => (activeTab = 'monitor')}
					class="py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
					class:bg-cream-50={activeTab === 'monitor'}
					class:text-ink-950={activeTab === 'monitor'}
					class:text-ink-600={activeTab !== 'monitor'}
				>
					Monitor
				</button>
				<button
					onclick={() => (activeTab = 'controls')}
					class="py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
					class:bg-cream-50={activeTab === 'controls'}
					class:text-ink-950={activeTab === 'controls'}
					class:text-ink-600={activeTab !== 'controls'}
				>
					Controls
				</button>
				<button
					onclick={() => (activeTab = 'code')}
					class="py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
					class:bg-cream-50={activeTab === 'code'}
					class:text-ink-950={activeTab === 'code'}
					class:text-ink-600={activeTab !== 'code'}
				>
					Shader GLSL
				</button>
			</div>

			<!-- Tab Contents -->
			{#if activeTab === 'monitor'}
				<!-- Salty Seam Monitor Panel -->
				<div class="space-y-6">
					<div class="glass-panel p-4 rounded-2xl bg-cream-50/50 relative overflow-hidden">
						<span class="text-[9px] uppercase tracking-widest text-ink-600 font-bold block mb-1">Salty Seam Data Vis</span>
						<h3 class="text-xl font-display font-black text-ink-950">LIVE RENDER CLOCK</h3>
						
						<!-- Realtime Graph using smooth Svelte 5 Tweens -->
						<div class="h-28 flex items-end gap-2.5 mt-4 border-b border-ink-100/50 pb-2">
							{#each monitorBars as bar}
								<div 
									style:height="{bar.current}%" 
									class="flex-1 bg-gradient-to-t from-accent-orange via-accent-pink to-accent-yellow rounded-t-md opacity-85 hover:opacity-100 transition-opacity"
								></div>
							{/each}
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="glass-panel p-4 rounded-2xl bg-cream-50/50">
							<span class="text-[9px] uppercase tracking-widest text-ink-400 font-bold">FRAME TIME</span>
							<p class="text-2xl font-display font-black text-ink-950 mt-1">{renderTime.current.toFixed(2)} ms</p>
						</div>
						<div class="glass-panel p-4 rounded-2xl bg-cream-50/50">
							<span class="text-[9px] uppercase tracking-widest text-ink-400 font-bold">DATA DEVIATION</span>
							<p class="text-2xl font-display font-black text-ink-950 mt-1">+{trafficDelta.current.toFixed(0)} kb</p>
						</div>
					</div>
				</div>
			{:else if activeTab === 'controls'}
				<!-- Controls: Wave Frequency Slider -->
				<div class="space-y-6">
					<div class="glass-panel p-5 rounded-2xl bg-cream-50/50 space-y-4">
						<div class="flex justify-between items-center">
							<div>
								<h3 class="text-xs uppercase tracking-widest text-ink-950 font-extrabold">Wave Frequency</h3>
								<p class="text-[10px] text-ink-600 font-light mt-0.5">Real-time GLSL uniform control</p>
							</div>
							<span class="px-2.5 py-1 rounded bg-cream-200 text-[10px] font-mono font-bold text-ink-800">
								{shaderState.frequencyMultiplier.toFixed(2)}x
							</span>
						</div>

						<input
							type="range"
							min="0.2"
							max="3.0"
							step="0.05"
							bind:value={shaderState.frequencyMultiplier}
							class="w-full h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-accent-pink"
						/>

						<div class="flex justify-between items-center text-[10px] text-ink-400 font-semibold uppercase">
							<span>0.2x (Calm)</span>
							<span>3.0x (Intense)</span>
						</div>
					</div>

					<button
						onclick={() => (shaderState.frequencyMultiplier = 1.0)}
						class="w-full py-3.5 rounded-xl border border-ink-200 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-800 hover:border-accent-pink hover:text-accent-pink transition-colors bg-cream-50 cursor-pointer"
					>
						Reset Shader Frequency
					</button>
				</div>
			{:else if activeTab === 'code'}
				<!-- Architect's View: Syntax Highlighted Code -->
				<div class="glass-panel p-4 rounded-2xl bg-ink-950 text-cream-50 text-[10px] font-mono overflow-auto h-80 border border-ink-900 shadow-inner">
					<pre class="whitespace-pre"><code class="text-cream-300">{@html glslCode}</code></pre>
				</div>
			{/if}
		</div>

		<!-- Footer diagnostics -->
		<div class="border-t border-ink-100/50 pt-4 flex justify-between items-center text-[9px] font-mono text-ink-600 uppercase tracking-wider">
			<span>Render Pipeline: Active</span>
			<span>Framerate: 60 FPS</span>
		</div>
	</div>
{/if}
