<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Lenis from 'lenis';
	import { shaderState } from '$lib/state/motion.svelte';

	let { children } = $props();
	let lenisInstance = $state<Lenis | null>(null);

	onMount(async () => {
		// Dynamically import GSAP to prevent SSR issues
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		// Initialize Lenis Scroll with fine-tuned parameters for buttery smooth scrolling
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom exponential ease-out
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 1.5,
			infinite: false
		});

		lenisInstance = lenis;

		// Frame-rate independent requestAnimationFrame loop
		let rafId: number;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}
		rafId = requestAnimationFrame(raf);

		// Sync GSAP ScrollTrigger with Lenis scrolls
		lenis.on('scroll', () => {
			ScrollTrigger.update();
		});

		// GSAP timeline linked to scroll progress of the entire page
		const scrollColorShiftTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.2 // Smooth scrubbing
			}
		});

		// Interpolate the shared shader state colorShift uniform value
		scrollColorShiftTimeline.to(shaderState, {
			colorShift: 1.0,
			ease: 'none'
		});

		// Handle smooth scrolling for standard anchor links
		const handleAnchorClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');
			if (anchor && anchor.hash && anchor.origin === window.location.origin) {
				const targetElement = document.querySelector(anchor.hash);
				if (targetElement) {
					e.preventDefault();
					lenis.scrollTo(targetElement, {
						offset: 0,
						duration: 1.4,
						easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
					});
				}
			}
		};

		document.addEventListener('click', handleAnchorClick);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
			document.removeEventListener('click', handleAnchorClick);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});

	// Trigger scroll-to-top on route changes
	$effect(() => {
		const _pathname = page.url.pathname;
		if (lenisInstance) {
			lenisInstance.scrollTo(0, { immediate: true });
		}
	});
</script>

<svelte:head>
	<title>Aura — Awwwards Creative Portfolio</title>
	<meta name="description" content="A next-generation modular creative portfolio built with SvelteKit, Tailwind CSS, Lenis, and Threlte." />
</svelte:head>

<main class="min-h-screen relative w-full text-ink-900 bg-bg-cream antialiased selection:bg-accent-pink/20 selection:text-ink-950">
	{@render children()}
</main>
