'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/canvas/ErrorBoundary';
import { useThemeStore } from '@/components/store/useThemeStore';

// Dynamically import WebGL Canvas scene to prevent SSR issues
const ShowroomScene = dynamic(() => import('@/components/canvas/ShowroomScene'), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full flex items-center justify-center bg-[#FAF6F0] rounded-2xl border border-[#EAE1D9]">
			<span className="text-xs uppercase tracking-[0.25em] text-luxury-pink animate-pulse font-medium">
				Entering Showroom...
			</span>
		</div>
	)
});

interface StoryStep {
	title: string;
	subtitle: string;
	description: string;
	specs: string[];
}

const storySteps: StoryStep[] = [
	{
		title: 'Sculptural Base',
		subtitle: '01 / Anatomy',
		description: 'The Seam Lounge Chair features a massive, low-slung White Oak base configured to defy standard joinery bounds, bringing structural weight to luxury spaces.',
		specs: ['FSC Oak Core', 'Integrated Tenons', 'Textured End-grain']
	},
	{
		title: 'Bouclé Stitch',
		subtitle: '02 / Texture',
		description: 'Soft, raw loops of French Bouclé fabric highlight the curved seams. Every edge is highlighted by piping lines detailed in warm luxury accents.',
		specs: ['70% Wool Yarn', 'Hand-stitched Seams', 'Soft Cream Tint']
	},
	{
		title: 'Accent Highlight',
		subtitle: '03 / Detail',
		description: 'Pink, yellow, and orange color accents details transition dynamically under changing lighting angles, shifting visual focus across the organic contours.',
		specs: ['Custom HSL Pigment', 'Contrast Piping', 'Polished Brass Accents']
	}
];

export default function ScrollStory() {
	const containerRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);
	const [scrollRotation, setScrollRotation] = useState(0);
	const [isHoveredOver3D, setIsHoveredOver3D] = useState(false);

	// Custom Cursor Mouse Tracking using Framer Motion springs
	const mouseX = useMotionValue(-100);
	const mouseY = useMotionValue(-100);

	const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
	const cursorX = useSpring(mouseX, springConfig);
	const cursorY = useSpring(mouseY, springConfig);

	useEffect(() => {
		// Initialize Lenis scroll
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			infinite: false
		});

		// Synchronize Lenis frame ticks with GSAP
		lenis.on('scroll', ScrollTrigger.update);
		
		const tickHandler = (time: number) => {
			lenis.raf(time * 1000);
		};
		gsap.ticker.add(tickHandler);

		// GSAP ScrollTrigger to pin background 3D canvas and animate R3F rotation
		const pinTrigger = ScrollTrigger.create({
			trigger: containerRef.current,
			start: 'top top',
			end: 'bottom bottom',
			pin: stickyRef.current,
			pinSpacing: false,
			scrub: true,
			onUpdate: (self) => {
				// Rotate chair 360 degrees over the full scroll story height
				setScrollRotation(self.progress * Math.PI * 2.2);
			}
		});

		// Mouse move event for custom cursor tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
		};
		window.addEventListener('mousemove', handleMouseMove);

		// Trigger Easter Egg explosion when scroll reaches absolute page bottom
		const checkBottom = () => {
			const threshold = 18; // 18px from bottom
			const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
			const alreadyExploding = useThemeStore.getState().isExploding;
			
			if (isBottom && !alreadyExploding) {
				useThemeStore.getState().setIsExploding(true);
			}
		};
		window.addEventListener('scroll', checkBottom, { passive: true });

		return () => {
			gsap.ticker.remove(tickHandler);
			lenis.destroy();
			pinTrigger.kill();
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('scroll', checkBottom);
		};
	}, [mouseX, mouseY]);

	// Framer Motion Animation Variants for Story cards
	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 80,
				damping: 18,
				staggerChildren: 0.15
			}
		}
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<div ref={containerRef} className="relative w-full min-h-[300vh] bg-[#FAF8F5] pb-24 overflow-hidden">
			{/* Custom Playful Cursor (A11y & visual micro-interaction) */}
			<motion.div
				style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
				className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
			>
				{/* Pulsing Outer Accent Ring morphing to Detail Viewer with clip-path */}
				<motion.div
					animate={{
						scale: isHoveredOver3D ? 2.8 : 1.0,
						borderColor: isHoveredOver3D ? 'var(--color-luxury-pink)' : 'rgba(34, 32, 31, 0.25)',
						backgroundColor: isHoveredOver3D ? 'rgba(252, 250, 247, 0.15)' : 'transparent',
						backdropFilter: isHoveredOver3D ? 'blur(4px)' : 'blur(0px)'
					}}
					className="w-10 h-10 rounded-full border border-solid transition-all duration-300 flex items-center justify-center overflow-hidden relative"
					style={{
						clipPath: 'circle(50% at 50% 50%)'
					}}
				>
					{/* Inner Core Dot (disappears when magnified) */}
					<motion.div
						animate={{
							scale: isHoveredOver3D ? 0.0 : 1.0,
							backgroundColor: isHoveredOver3D ? 'transparent' : 'var(--color-luxury-pink)'
						}}
						className="w-2 h-2 rounded-full absolute"
					/>
					
					{isHoveredOver3D && (
						<motion.span
							initial={{ opacity: 0, scale: 0.7 }}
							animate={{ opacity: 1, scale: 1 }}
							className="text-[4px] font-mono tracking-[0.25em] text-[#22201F] uppercase font-black absolute"
						>
							Detail
						</motion.span>
					)}
				</motion.div>
			</motion.div>

			{/* Immersive Floating/Overlapping Grid Layout */}
			<div className="relative w-full z-10">
				
				{/* Pinned 3D Atelier Showroom in the Background (Scroll sync) */}
				<div 
					ref={stickyRef} 
					className="h-screen w-full flex items-center justify-center z-0 pointer-events-none"
				>
					<div 
						className="w-full max-w-5xl h-[75vh] md:h-[80vh] overflow-hidden relative pointer-events-auto transition-transform duration-700"
						onMouseEnter={() => setIsHoveredOver3D(true)}
						onMouseLeave={() => setIsHoveredOver3D(false)}
					>
						<ErrorBoundary>
							<ShowroomScene scrollRotation={scrollRotation} />
						</ErrorBoundary>

						{/* Interactive HUD indicator */}
						<div className="absolute bottom-6 left-6 pointer-events-none font-mono text-[9px] uppercase tracking-wider text-[#88837E] flex items-center gap-3">
							<span className="w-2 h-2 rounded-full bg-luxury-orange animate-ping"></span>
							<span>Live Showroom Rotation: {(scrollRotation * (180 / Math.PI)).toFixed(0)}°</span>
						</div>
					</div>
				</div>

				{/* Floating Storytelling Elements Overlapping the Background Canvas */}
				<div className="w-full relative z-10 pointer-events-none">
					{storySteps.map((step, idx) => (
						<motion.div
							key={step.title}
							variants={cardVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: '-25%' }}
							className={`max-w-2xl px-6 min-h-screen flex flex-col justify-center pointer-events-auto relative ${
								idx % 2 === 0 ? 'ml-auto mr-12 text-right items-end' : 'mr-auto ml-12 text-left items-start'
							}`}
						>
							<div className="space-y-6 max-w-xl">
								{/* Huge Overlapping Editorial Title */}
								<motion.h3 
									variants={itemVariants} 
									className="text-6xl md:text-[8rem] lg:text-[10rem] font-extralight tracking-tighter leading-none text-[#22201F] uppercase select-none -mb-6 md:-mb-12 font-sans"
								>
									{step.title.split(' ')[0]}
									<span className={`block font-bold text-luxury-pink text-5xl md:text-[6.5rem] lg:text-[7.5rem] tracking-tighter -mt-2`}>
										{step.title.split(' ')[1] || ''}
									</span>
								</motion.h3>

								<motion.span 
									variants={itemVariants} 
									className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#88837E] block pt-4"
								>
									{step.subtitle}
								</motion.span>

								<motion.p 
									variants={itemVariants} 
									className="text-xs md:text-sm text-[#55514E] leading-relaxed font-light backdrop-blur-sm bg-white/70 p-6 rounded-2xl border border-[#EAE1D9]/30 shadow-sm"
								>
									{step.description}
								</motion.p>

								{/* Staggered Specs List */}
								<motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
									{step.specs.map((spec) => (
										<span
											key={spec}
											className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE1D9] text-[9px] font-semibold text-[#88837E] uppercase tracking-wider"
										>
											{spec}
										</span>
									))}
								</motion.div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
