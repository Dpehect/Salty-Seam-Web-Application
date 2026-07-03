<script lang="ts">
	import { browser } from '$app/environment';
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/Scene.svelte';
	import PostProcessing from '$lib/components/PostProcessing.svelte';
	import Slice from '$lib/components/Slice.svelte';
	import ArchitectConsole from '$lib/components/ArchitectConsole.svelte';
</script>

<div class="relative w-full overflow-hidden min-h-screen bg-bg-cream">
	<!-- Fixed Threlte 3D Background Canvas with on-demand rendering -->
	<div class="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-transparent">
		{#if browser}
			<Canvas autoRender={false} frameloop="demand">
				<Scene />
				<PostProcessing />
			</Canvas>
		{/if}
	</div>

	<!-- HTML Content Container on Top of 3D Canvas -->
	<div class="relative z-10 w-full flex flex-col items-center">
		<!-- 1. Hero Slice (Loaded and Hydrated on Page Mount) -->
		<Slice 
			loader={() => import('$lib/slices/Hero.svelte')} 
			fallbackHeight="100vh" 
		/>

		<!-- 2. Project Grid Slice (Hydrated when approaching viewport) -->
		<Slice 
			loader={() => import('$lib/slices/ProjectGrid.svelte')} 
			fallbackHeight="80vh" 
		/>

		<!-- 3. Contact Form Slice (Hydrated when approaching viewport) -->
		<Slice 
			loader={() => import('$lib/slices/Contact.svelte')} 
			fallbackHeight="80vh" 
		/>
	</div>

	<!-- Architect Collapsible Console Widget -->
	<ArchitectConsole />
</div>
