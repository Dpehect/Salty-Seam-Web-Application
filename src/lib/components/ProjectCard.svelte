<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { shaderState } from '$lib/state/motion.svelte';

	interface Project {
		id: string;
		title: string;
		category: string;
		gradient: string;
		tag: string;
		year: string;
	}

	interface Props {
		project: Project;
		index: number;
	}

	let { project, index }: Props = $props();

	// Local springs for card elements
	const cardScale = new Spring(1, { stiffness: 0.1, damping: 0.28 });
	const arrowScale = new Spring(1, { stiffness: 0.15, damping: 0.3 });
	const arrowX = new Spring(0, { stiffness: 0.1, damping: 0.25 });
	const arrowY = new Spring(0, { stiffness: 0.1, damping: 0.25 });

	function handleMouseEnter() {
		cardScale.target = 1.02;
		// Trigger background wave distortion (uDistort uniform increases)
		shaderState.distort.target = 1.0;
	}

	function handleMouseLeave() {
		cardScale.target = 1.0;
		arrowScale.target = 1.0;
		arrowX.target = 0;
		arrowY.target = 0;
		// Reset background wave distortion (uDistort uniform goes back to 0)
		shaderState.distort.target = 0.0;
	}

	function handleArrowMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		arrowX.target = dx * 0.45; // 45% magnetic pull
		arrowY.target = dy * 0.45;
		arrowScale.target = 1.15;
	}

	function handleArrowMouseLeave() {
		arrowX.target = 0;
		arrowY.target = 0;
		arrowScale.target = 1.0;
	}
</script>

<div 
	role="presentation"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	style:transform="scale({cardScale.current})"
	class="group relative flex flex-col justify-between rounded-3xl glass-panel p-6 md:p-8 h-[450px] md:h-[500px] hover:shadow-2xl hover:border-accent-pink/40 transition-all duration-500 overflow-hidden cursor-pointer"
	class:md:translate-y-12={index % 2 === 1}
>
	<!-- Glowing Ambient backdrop for individual card -->
	<div class="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full bg-cream-200 group-hover:bg-accent-pink/5 blur-3xl transition-colors duration-500 z-0"></div>

	<!-- Top of Card: Numbers and Tags -->
	<div class="flex justify-between items-start z-10">
		<span class="font-display text-xl font-bold text-ink-400 group-hover:text-accent-pink transition-colors duration-300">
			{project.id}
		</span>
		<span class="px-3.5 py-1.5 rounded-full border border-ink-200 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-600 bg-cream-50 group-hover:bg-cream-100 transition-colors duration-300">
			{project.tag}
		</span>
	</div>

	<!-- Center: Custom Interactive 3D Mockup Container -->
	<div class="w-full flex-grow flex items-center justify-center relative my-6 z-10">
		<!-- Colored Glassmorphic Bubble visual representation of 3D asset -->
		<div class="w-48 h-48 rounded-full bg-gradient-to-tr {project.gradient} opacity-80 group-hover:scale-110 group-hover:rotate-12 blur-sm group-hover:blur-none transition-all duration-700 ease-out shadow-2xl relative">
			<!-- Secondary inner glass overlay -->
			<div class="absolute inset-2 rounded-full glass-panel border border-cream-100/50 backdrop-blur-md"></div>
		</div>
	</div>

	<!-- Bottom: Titles and Details -->
	<div class="flex justify-between items-end border-t border-ink-100/50 pt-6 z-10">
		<div>
			<h3 class="text-xl md:text-2xl font-display font-extrabold text-ink-950 group-hover:text-accent-orange transition-colors duration-300">
				{project.title}
			</h3>
			<p class="text-xs text-ink-600 uppercase tracking-widest font-medium mt-1">
				{project.category}
			</p>
		</div>
		<div class="flex items-center gap-3">
			<span class="text-xs text-ink-400 font-mono">{project.year}</span>
			<!-- Magnetic, Bouncy Link Arrow Icon -->
			<div 
				role="presentation"
				onmousemove={handleArrowMouseMove}
				onmouseleave={handleArrowMouseLeave}
				style:transform="translate3d({arrowX.current}px, {arrowY.current}px, 0) scale({arrowScale.current})"
				class="w-10 h-10 rounded-full border border-ink-200 flex items-center justify-center bg-cream-50 group-hover:bg-accent-pink group-hover:border-accent-pink group-hover:text-cream-50 transition-colors duration-300"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 transform group-hover:-rotate-45 transition-transform duration-300">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
				</svg>
			</div>
		</div>
	</div>
</div>
