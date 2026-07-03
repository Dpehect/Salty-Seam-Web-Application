<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

	let formSubmitted = $state(false);
	let name = $state('');
	let email = $state('');
	let message = $state('');

	// Svelte 5 Springs for Form Submit button (magnetic hover interaction)
	const submitScale = new Spring(1, { stiffness: 0.15, damping: 0.3 });
	const submitX = new Spring(0, { stiffness: 0.1, damping: 0.25 });
	const submitY = new Spring(0, { stiffness: 0.1, damping: 0.25 });

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		if (name && email) {
			formSubmitted = true;
		}
	};

	function handleSubmitMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		submitX.target = dx * 0.22; // Keep it subtle since the button is wide
		submitY.target = dy * 0.22;
		submitScale.target = 1.03;
	}

	function handleSubmitMouseLeave() {
		submitX.target = 0;
		submitY.target = 0;
		submitScale.target = 1.0;
	}
</script>

<section id="contact" class="py-24 md:py-36 w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
	<!-- Background glow blob specific to Contact slice -->
	<div class="absolute top-[30%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent-orange/10 blur-[140px] animate-drift-slow z-0"></div>

	<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
		<!-- Left: Text and Branding info -->
		<div class="lg:col-span-5 space-y-8">
			<span class="text-xs uppercase tracking-[0.3em] font-semibold text-accent-pink">Get in Touch</span>
			<h2 class="text-5xl md:text-7xl font-display font-extrabold uppercase text-ink-950 leading-[0.95]">
				Let's create <br /><span class="text-gradient-primary">Aura</span> together.
			</h2>
			<p class="text-ink-700 font-light text-base md:text-lg leading-relaxed max-w-md">
				Have an ambitious project in mind, or just want to chat about creative frontend technologies? Drop us a line. We are always open to new adventures.
			</p>

			<div class="space-y-6 pt-4">
				<div class="flex items-center gap-4">
					<div class="w-11 h-11 rounded-full border border-ink-200 flex items-center justify-center bg-cream-100">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-ink-700">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
						</svg>
					</div>
					<div>
						<p class="text-[10px] text-ink-400 font-light uppercase tracking-wider">Email Us</p>
						<a href="mailto:hello@aurastudio.design" class="text-sm font-semibold text-ink-800 hover:text-accent-pink transition-colors">hello@aurastudio.design</a>
					</div>
				</div>

				<div class="flex items-center gap-4">
					<div class="w-11 h-11 rounded-full border border-ink-200 flex items-center justify-center bg-cream-100">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-ink-700">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
						</svg>
					</div>
					<div>
						<p class="text-[10px] text-ink-400 font-light uppercase tracking-wider">Visit Us</p>
						<p class="text-sm font-semibold text-ink-800">Porto, Portugal</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Glassmorphic Contact Form -->
		<div class="lg:col-span-7 w-full">
			<div class="w-full glass-panel-heavy rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
				<!-- Light glow filter over the card -->
				<div class="absolute -top-1/4 -right-1/4 w-60 h-60 rounded-full bg-accent-pink/5 blur-3xl"></div>

				{#if formSubmitted}
					<div class="flex flex-col items-center justify-center text-center py-16 space-y-4">
						<div class="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-orange to-accent-pink flex items-center justify-center text-cream-50 shadow-lg">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
							</svg>
						</div>
						<h3 class="text-2xl font-display font-extrabold text-ink-950 uppercase mt-4">Message Sent</h3>
						<p class="text-ink-650 font-light max-w-sm">
							Thank you for reaching out, {name}. We will get back to your query within 24 hours.
						</p>
						<button 
							onclick={() => { formSubmitted = false; name = ''; email = ''; message = ''; }}
							class="mt-6 px-6 py-2.5 rounded-xl border border-ink-200 text-xs font-semibold uppercase tracking-wider text-ink-700 hover:border-accent-pink hover:text-accent-pink transition-colors bg-cream-50"
						>
							Send Another Message
						</button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-6 md:space-y-8">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Name Input -->
							<div class="space-y-2">
								<label for="name" class="text-xs uppercase tracking-widest font-semibold text-ink-600">Your Name</label>
								<input 
									type="text" 
									id="name" 
									bind:value={name} 
									required
									placeholder="John Doe"
									class="w-full px-5 py-4 rounded-xl border border-ink-200 bg-cream-100/50 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all font-medium"
								/>
							</div>
							<!-- Email Input -->
							<div class="space-y-2">
								<label for="email" class="text-xs uppercase tracking-widest font-semibold text-ink-600">Email Address</label>
								<input 
									type="email" 
									id="email" 
									bind:value={email} 
									required
									placeholder="john@example.com"
									class="w-full px-5 py-4 rounded-xl border border-ink-200 bg-cream-100/50 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all font-medium"
								/>
							</div>
						</div>

						<!-- Message textarea -->
						<div class="space-y-2">
							<label for="message" class="text-xs uppercase tracking-widest font-semibold text-ink-600">Project Details</label>
							<textarea 
								id="message" 
								rows="5"
								bind:value={message}
								placeholder="Tell us about your project vision, timeline, and goals..."
								class="w-full px-5 py-4 rounded-xl border border-ink-200 bg-cream-100/50 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all font-medium resize-none"
							></textarea>
						</div>

						<!-- Magnetic Submit Button -->
						<button 
							type="submit" 
							onmousemove={handleSubmitMouseMove}
							onmouseleave={handleSubmitMouseLeave}
							style:transform="translate3d({submitX.current}px, {submitY.current}px, 0) scale({submitScale.current})"
							class="w-full py-4.5 rounded-xl bg-gradient-to-r from-accent-orange via-accent-pink to-accent-yellow text-cream-50 font-semibold uppercase tracking-[0.2em] text-xs hover:shadow-2xl transition-shadow duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
						>
							Send Brief 
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
							</svg>
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<!-- Fine-print Footer -->
	<footer class="mt-24 md:mt-32 pt-8 border-t border-ink-100/50 flex flex-col md:flex-row items-center justify-between gap-4 text-ink-400 text-xs">
		<div class="flex items-center gap-2 font-mono">
			<span>&copy; {new Date().getFullYear()} Aura Studio. All rights reserved.</span>
		</div>
		<div class="flex items-center gap-6 font-semibold uppercase tracking-wider">
			<a href="#github" class="hover:text-accent-pink transition-colors">GitHub</a>
			<a href="#twitter" class="hover:text-accent-pink transition-colors">Twitter</a>
			<a href="#awwwards" class="hover:text-accent-pink transition-colors">Awwwards</a>
		</div>
	</footer>
</section>
