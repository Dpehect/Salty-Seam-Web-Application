<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	interface Project {
		id: string;
		title: string;
		category: string;
		gradient: string;
		tag: string;
		year: string;
	}

	const projects: Project[] = [
		{
			id: '01',
			title: 'Aether Flow',
			category: 'Creative Engineering / WebGL',
			gradient: 'from-accent-orange via-accent-pink to-accent-yellow',
			tag: 'Interactive WebGL',
			year: '2026'
		},
		{
			id: '02',
			title: 'Kroma Studio',
			category: 'Generative Branding / Identity',
			gradient: 'from-accent-pink to-accent-yellow',
			tag: 'Generative Art',
			year: '2025'
		},
		{
			id: '03',
			title: 'Luminary Space',
			category: '3D E-Commerce Experience',
			gradient: 'from-accent-yellow to-accent-orange',
			tag: 'Threlte Development',
			year: '2026'
		},
		{
			id: '04',
			title: 'Echo System',
			category: 'Interactive Audio Visualizer',
			gradient: 'from-accent-orange via-accent-yellow to-accent-pink',
			tag: 'Audio WebAPI',
			year: '2025'
		}
	];
</script>

<section id="work" class="py-24 md:py-36 w-full max-w-7xl mx-auto px-6 md:px-12 relative bg-transparent z-10">
	<!-- Section Header -->
	<div class="flex flex-col md:flex-row md:items-end justify-between border-b border-ink-100/50 pb-10 mb-16">
		<div class="space-y-4">
			<span class="text-xs uppercase tracking-[0.3em] font-semibold text-accent-pink">Selected Work</span>
			<h2 class="text-4xl md:text-6xl font-display font-extrabold uppercase text-ink-950">
				Crafting <br />Digital Art
			</h2>
		</div>
		<p class="text-ink-600 font-light max-w-sm leading-relaxed mt-6 md:mt-0">
			A curated selection of experiments and client projects designed to push the boundaries of modern frontend interaction.
		</p>
	</div>

	<!-- Asymmetric Grid of Projects utilizing interactive modular ProjectCards -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
		{#each projects as project, index}
			<ProjectCard {project} {index} />
		{/each}
	</div>
</section>
