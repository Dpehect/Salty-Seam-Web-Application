<script lang="ts">
	import { onMount } from 'svelte';
	import { useThrelte, useTask, T } from '@threlte/core';
	import * as THREE from 'three';
	import { shaderState } from '$lib/state/motion.svelte';

	const { invalidate, size } = useThrelte();

	// Controls how long the scene continues to render after interaction stops (seconds)
	let renderDecayTime = 0.0;

	// Invalidate the frame and reset the decay timer
	function triggerRenderBoost(duration = 2.5) {
		renderDecayTime = duration;
		invalidate();
	}

	// Shader Uniforms
	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) },
		uScroll: { value: 0 },
		uResolution: { value: new THREE.Vector2($size.width, $size.height) },
		uDistort: { value: 0 },
		uColorShift: { value: 0 },
		uFrequencyMultiplier: { value: 1.0 }
	};

	// Keep resolution uniform updated on canvas size changes
	$effect(() => {
		uniforms.uResolution.value.set($size.width, $size.height);
		triggerRenderBoost(1.5);
	});

	// Hook events to invalidate on interaction
	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const x = e.clientX / window.innerWidth;
			const y = 1.0 - (e.clientY / window.innerHeight); // Invert Y for WebGL
			
			// Set mouse uniform
			uniforms.uMouse.value.set(x, y);
			triggerRenderBoost(2.0); // Boost rendering on mouse move
		};

		const handleScroll = () => {
			const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollTop = window.scrollY;
			const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
			
			uniforms.uScroll.value = progress;
			triggerRenderBoost(2.5); // Boost rendering on scroll
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', handleScroll);
		
		// Initial render boost to paint the initial frame
		triggerRenderBoost(3.0);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Frame update stage task
	useTask((delta) => {
		const dt = Math.min(delta, 0.1);
		
		// Increment shader elapsed time uniform
		uniforms.uTime.value += dt;

		// Map shared Svelte motion springs/states directly into shader uniforms
		uniforms.uDistort.value = shaderState.distort.current;
		uniforms.uColorShift.value = shaderState.colorShift;
		uniforms.uFrequencyMultiplier.value = shaderState.frequencyMultiplier;

		// If the spring is moving, force continuous renders
		const isSpringMoving = Math.abs(shaderState.distort.current - shaderState.distort.target) > 0.001;

		// Tick down decay timer to put renderer to sleep when idle
		if (renderDecayTime > 0 || isSpringMoving) {
			if (renderDecayTime > 0) renderDecayTime -= dt;
			invalidate();
		}
	});

	const vertexShader = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1.0);
		}
	`;

	const fragmentShader = `
		uniform float uTime;
		uniform vec2 uMouse;
		uniform float uScroll;
		uniform vec2 uResolution;
		uniform float uDistort;
		uniform float uColorShift;
		uniform float uFrequencyMultiplier;
		varying vec2 vUv;

		// Hash and Noise functions for organic wave shapes
		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
					   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
		}

		// Fractional Brownian Motion (fBm)
		float fbm(vec2 p) {
			float value = 0.0;
			float amplitude = 0.5;
			float frequency = 1.0;
			for (int i = 0; i < 5; i++) {
				value += amplitude * noise(p * frequency);
				frequency *= 2.0;
				amplitude *= 0.5;
			}
			return value;
		}

		void main() {
			vec2 uv = vUv;
			vec2 aspectUv = uv;
			aspectUv.x *= uResolution.x / uResolution.y;

			// Drift velocity (Antigravity drift feel)
			float drift = uTime * 0.04;
			vec2 mouseOffset = (uMouse - 0.5) * 0.35;
			float scrollFactor = uScroll * 1.2;

			// Wave distortion dynamically boosted by uDistort (micro-interactions)
			float distortScale = 1.0 + uDistort * 3.5;
			float distortFreq = (1.5 + uDistort * 2.0) * uFrequencyMultiplier;

			// Domain warping for organic, fluid-like flow
			vec2 q = vec2(
				fbm(aspectUv * distortFreq + vec2(drift, drift * 0.25) + mouseOffset),
				fbm(aspectUv * distortFreq + vec2(-drift * 0.3, drift) - vec2(0.0, scrollFactor))
			);

			vec2 r = vec2(
				fbm(aspectUv * (1.2 * uFrequencyMultiplier) + q * (1.1 * distortScale) + vec2(drift * 0.15, -drift * 0.5)),
				fbm(aspectUv * (1.2 * uFrequencyMultiplier) + q * (1.3 * distortScale) + vec2(-drift * 0.25, drift * 0.3) + vec2(0.0, scrollFactor * 0.4))
			);

			float wave = fbm(aspectUv * (1.0 * uFrequencyMultiplier) + r * (1.8 * distortScale));

			// Sophisticated palette colors (Base: Cream, Accents: Pink, Yellow, Orange)
			vec3 cream = vec3(0.98, 0.976, 0.965);
			vec3 pink = vec3(1.0, 0.459, 0.561);     // #FF758F
			vec3 yellow = vec3(0.961, 0.773, 0.094); // #F5C518
			vec3 orange = vec3(1.0, 0.549, 0.0);     // #FF8C00

			// Blending factors
			float colorMix1 = clamp(wave * 2.0 - 0.2, 0.0, 1.0);
			float colorMix2 = clamp(length(q) * 1.4, 0.0, 1.0);
			float colorMix3 = clamp(r.x * 1.8, 0.0, 1.0);

			// Orchestrate color palette shift based on uColorShift (GSAP controlled)
			// At uColorShift = 0.0: Pink dominance
			// At uColorShift = 1.0: Yellow/Orange dominance
			vec3 activePink = mix(pink, yellow * 0.7 + pink * 0.3, uColorShift);
			vec3 activeYellow = mix(yellow, orange, uColorShift);
			vec3 activeOrange = mix(orange, yellow, uColorShift * 0.8);

			vec3 accentGrad = mix(activePink, activeOrange, colorMix3 + uScroll * 0.3);
			vec3 secondaryGrad = mix(activeYellow, accentGrad, colorMix1);
			vec3 finalColor = mix(cream, secondaryGrad, colorMix2 * 0.85);

			gl_FragColor = vec4(finalColor, 1.0);
		}
	`;
</script>

<!-- Screen-space Orthographic Camera mapping 1:1 to canvas quad -->
<T.OrthographicCamera makeDefault position={[0, 0, 1]} left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} />

<T.Mesh>
	<T.PlaneGeometry args={[2, 2]} />
	<T.ShaderMaterial
		{vertexShader}
		{fragmentShader}
		{uniforms}
		depthWrite={false}
		depthTest={false}
	/>
</T.Mesh>
