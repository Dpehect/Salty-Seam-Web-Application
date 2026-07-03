<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

	// Subtle entry animations
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	// Svelte 5 Springs for "Let's Talk" header primary button (magnetic interaction)
	const talkBtnScale = new Spring(1, { stiffness: 0.15, damping: 0.3 });
	const talkBtnX = new Spring(0, { stiffness: 0.1, damping: 0.25 });
	const talkBtnY = new Spring(0, { stiffness: 0.1, damping: 0.25 });

	// Local springs for Scroll Indicator hover
	const scrollScale = new Spring(1, { stiffness: 0.2, damping: 0.3 });
	const scrollY = new Spring(0, { stiffness: 0.15, damping: 0.2 });

	function handleTalkMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		talkBtnX.target = dx * 0.4; // 40% magnetic pull
		talkBtnY.target = dy * 0.4;
		talkBtnScale.target = 1.08;
	}

	function handleTalkMouseLeave() {
		talkBtnX.target = 0;
		talkBtnY.target = 0;
		talkBtnScale.target = 1.0;
	}
</script>

<section class="min-h-screen w-full relative flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-transparent">
	<!-- Ambient Background Glow Elements -->
	<div class="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-accent-yellow/10 blur-[100px] animate-drift-slow z-0"></div>
	<div class="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent-pink/10 blur-[120px] animate-drift-medium z-0"></div>

	<!-- Floating Navbar with high-fidelity glassmorphism -->
	<header 
		class="w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-4 rounded-2xl glass-panel-heavy z-20 transition-all duration-1000 transform"
		class:opacity-0={!mounted}
		class:-translate-y-4={!mounted}
		class:opacity-100={mounted}
		class:translate-y-0={mounted}
	>
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded-full bg-gradient-to-r from-accent-orange to-accent-pink"></div>
			<span class="font-display font-extrabold tracking-widest text-ink-900 text-lg uppercase">AURA</span>
		</div>
		
		<nav class="hidden md:flex items-center gap-10">
			<a href="#work" class="text-xs uppercase tracking-[0.2em] font-medium text-ink-700 hover:text-accent-pink transition-colors duration-300">Work</a>
			<a href="#about" class="text-xs uppercase tracking-[0.2em] font-medium text-ink-700 hover:text-accent-pink transition-colors duration-300">About</a>
			<a href="#contact" class="text-xs uppercase tracking-[0.2em] font-medium text-ink-700 hover:text-accent-pink transition-colors duration-300">Contact</a>
		</nav>

		<div>
			<a 
				href="#contact" 
				onmousemove={handleTalkMouseMove}
				onmouseleave={handleTalkMouseLeave}
				style:transform="translate3d({talkBtnX.current}px, {talkBtnY.current}px, 0) scale({talkBtnScale.current})"
				class="inline-block px-5 py-2.5 rounded-xl border border-ink-200 text-xs font-semibold uppercase tracking-[0.15em] text-ink-800 hover:border-accent-pink hover:text-ink-950 transition-shadow duration-300 bg-cream-50 hover:bg-cream-100 hover:shadow-lg shadow-sm"
			>
				Let's Talk
			</a>
		</div>
	</header>

	<!-- Hero Typography Block -->
	<div class="w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center relative z-10 my-16 md:my-0">
		<div class="space-y-4 text-left max-w-5xl">
			<!-- Animated Tagline -->
			<div 
				class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-ink-100 bg-cream-100/50 text-xs uppercase tracking-[0.3em] text-ink-600 transition-all duration-1000 transform delay-300"
				class:opacity-0={!mounted}
				class:translate-y-4={!mounted}
				class:opacity-100={mounted}
				class:translate-y-0={mounted}
			>
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-pink opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-accent-pink"></span>
				</span>
				Awwwards Portfolio '26
			</div>

			<!-- Giant Awwwards-grade typography using combinations of fonts -->
			<h1 
				class="text-[12vw] sm:text-[9vw] lg:text-[8vw] leading-[0.9] font-display font-extrabold uppercase tracking-tighter text-ink-950 transition-all duration-1000 transform delay-500"
				class:opacity-0={!mounted}
				class:translate-y-8={!mounted}
				class:opacity-100={mounted}
				class:translate-y-0={mounted}
			>
				We Shape <br />
				<span class="text-gradient-primary">Digital</span> <span class="font-serif italic font-light lowercase text-ink-800">Aura</span>
			</h1>

			<!-- Subtitle / Bio info -->
			<p 
				class="text-base sm:text-lg md:text-xl font-light text-ink-700 max-w-xl leading-relaxed pt-4 transition-all duration-1000 transform delay-700"
				class:opacity-0={!mounted}
				class:translate-y-8={!mounted}
				class:opacity-100={mounted}
				class:translate-y-0={mounted}
			>
				We design and engineer bespoke, high-performance digital experiences that elevate brand presence through immersive, interactive aesthetics.
			</p>
		</div>
	</div>

	<!-- Footer of Hero: scroll indicator and credentials -->
	<div 
		class="w-full max-w-7xl mx-auto flex justify-between items-end border-t border-ink-100/50 pt-8 z-10 transition-all duration-1000 transform delay-900"
		class:opacity-0={!mounted}
		class:translate-y-4={!mounted}
		class:opacity-100={mounted}
		class:translate-y-0={mounted}
	>
		<div class="flex items-center gap-12 text-ink-600 text-xs tracking-wider uppercase font-medium">
			<div>
				<p class="text-[10px] text-ink-400 font-light mb-1">Based In</p>
				<p class="text-ink-800 font-semibold">Porto, Portugal</p>
			</div>
			<div class="hidden sm:block">
				<p class="text-[10px] text-ink-400 font-light mb-1">Focus</p>
				<p class="text-ink-800 font-semibold">Creative Engineering</p>
			</div>
		</div>

		<!-- Animated Scroll Down Prompt with Svelte Spring -->
		<a 
			href="#work" 
			onmouseenter={() => { scrollScale.target = 1.1; scrollY.target = 5; }}
			onmouseleave={() => { scrollScale.target = 1.0; scrollY.target = 0; }}
			style:transform="scale({scrollScale.current}) translate3d(0, {scrollY.current}px, 0)"
			class="flex flex-col items-center gap-3 group transition-transform duration-100"
		>
			<span class="text-[10px] tracking-[0.25em] text-ink-600 group-hover:text-accent-pink uppercase font-semibold transition-colors duration-300">
				Scroll to Explore
			</span>
			<div class="w-6 h-10 rounded-full border border-ink-300 flex justify-center p-1.5 group-hover:border-accent-pink transition-colors duration-300">
				<div class="w-1.5 h-2.5 rounded-full bg-accent-pink animate-bounce"></div>
			</div>
		</a>
	</div>
</section>
