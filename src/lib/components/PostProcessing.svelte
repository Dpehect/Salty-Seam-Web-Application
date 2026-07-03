<script lang="ts">
	import { onMount } from 'svelte';
	import { useThrelte, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
	import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';

	const { scene, camera, renderer, size, renderStage, invalidate } = useThrelte();

	let composer: EffectComposer | null = null;
	let renderPass: RenderPass | null = null;

	onMount(() => {
		composer = new EffectComposer(renderer);

		// Create render pass using the active camera or a fallback camera
		const activeCam = $camera || new THREE.PerspectiveCamera();
		renderPass = new RenderPass(scene, activeCam);
		composer.addPass(renderPass);

		// Unreal Bloom Pass for sophisticated, glowing accent colors
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2($size.width, $size.height),
			1.5,  // strength
			0.6,  // radius
			0.1   // threshold (low threshold makes colors glow beautifully)
		);
		composer.addPass(bloomPass);

		// Film Grain Pass for textured cinematic feel
		const filmPass = new FilmPass(
			0.14,  // noise intensity (grain strength)
			0.0,   // scanlines intensity (disabled for pure grain)
			0,     // scanlines count
			false  // grayscale (preserve the vibrant pink/yellow/orange colors)
		);
		composer.addPass(filmPass);

		return () => {
			composer?.dispose();
		};
	});

	// Reactively update the camera on the render pass if it changes
	$effect(() => {
		if (renderPass && $camera) {
			renderPass.camera = $camera;
			invalidate();
		}
	});

	// Reactively handle resizing
	$effect(() => {
		if (composer) {
			composer.setSize($size.width, $size.height);
			invalidate();
		}
	});

	// Render loop task - attaches to renderStage
	useTask(
		() => {
			if (composer && $camera) {
				composer.render();
			}
		},
		{
			stage: renderStage,
			autoInvalidate: false
		}
	);
</script>
