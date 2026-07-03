'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/canvas/ErrorBoundary';

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
		title: 'Sculptural Structure',
		subtitle: '01 / Anatomy',
		description: 'The Seam Lounge Chair features a massive, low-slung White Oak base configured to defy standard joinery bounds, bringing structural weight to luxury spaces.',
		specs: ['FSC Oak Core', 'Integrated Tenons', 'Textured End-grain']
	},
	{
		title: 'Bouclé Stitching',
		subtitle: '02 / Texture',
		description: 'Soft, raw loops of French Bouclé fabric highlight the curved seams. Every edge is highlighted by piping lines detailed in warm luxury accents.',
		specs: ['70% Wool Yarn', 'Hand-stitched Seams', 'Soft Cream Tint']
	},
	{
		title: 'Accent Details',
		subtitle: '03 / Highlight',
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

		// GSAP ScrollTrigger to pin left side and animate R3F rotation
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

		return () => {
			gsap.ticker.remove(tickHandler);
			lenis.destroy();
			pinTrigger.kill();
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [mouseX, mouseY]);

	// Framer Motion Animation Variants for Story cards
	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
				staggerChildren: 0.12
			}
		}
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 15 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<div ref={containerRef} className="relative w-full min-h-[300vh] bg-[#FAF8F5] pb-24">
			{/* Custom Playful Cursor (A11y & visual micro-interaction) */}
			<motion.div
				style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
				className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
			>
				{/* Pulsing Outer Accent Ring */}
				<motion.div
					animate={{
						scale: isHoveredOver3D ? 2.2 : 1.0,
						borderColor: isHoveredOver3D ? 'var(--color-luxury-pink)' : 'rgba(34, 32, 31, 0.25)'
					}}
					className="w-10 h-10 rounded-full border border-solid transition-colors duration-300 flex items-center justify-center"
				>
					{/* Inner Core Dot */}
					<motion.div
						animate={{
							scale: isHoveredOver3D ? 0.6 : 1.0,
							backgroundColor: isHoveredOver3D ? 'var(--color-luxury-orange)' : 'var(--color-luxury-pink)'
						}}
						className="w-2 h-2 rounded-full"
					/>
				</motion.div>
			</motion.div>

			{/* Split Screen Grid Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto px-6">
				
				{/* Pinned Left Pane: 3D Atelier Showroom */}
				<div 
					ref={stickyRef} 
					className="lg:col-span-6 h-screen flex items-center justify-center py-16 z-10"
					onMouseEnter={() => setIsHoveredOver3D(true)}
					onMouseLeave={() => setIsHoveredOver3D(false)}
				>
					<div className="w-full h-[70vh] rounded-3xl overflow-hidden border border-[#EAE1D9] bg-white shadow-xl relative">
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

				{/* Scrolling Right Pane: Brand Storytelling */}
				<div className="lg:col-span-6 space-y-[60vh] py-[30vh]">
					{storySteps.map((step, idx) => (
						<motion.div
							key={step.title}
							variants={cardVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: '-20%' }}
							className="glass-panel p-8 rounded-3xl shadow-sm bg-white border border-[#EAE1D9] space-y-6 relative"
						>
							{/* Badge */}
							<motion.span 
								variants={itemVariants} 
								className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-luxury-pink"
							>
								{step.subtitle}
							</motion.span>

							{/* Title */}
							<motion.h3 
								variants={itemVariants} 
								className="text-2xl font-light tracking-tight text-[#22201F] uppercase"
							>
								{step.title}
							</motion.h3>

							{/* Body Paragraph */}
							<motion.p 
								variants={itemVariants} 
								className="text-sm text-[#55514E] leading-relaxed font-light"
							>
								{step.description}
							</motion.p>

							{/* Staggered Specs List */}
							<motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-4 border-t border-[#EAE1D9]/65">
								{step.specs.map((spec) => (
									<span
										key={spec}
										className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EAE1D9] text-[10px] font-semibold text-[#88837E] uppercase tracking-wider"
									>
										{spec}
									</span>
								))}
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
