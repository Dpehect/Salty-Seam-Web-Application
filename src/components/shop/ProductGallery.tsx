'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { gsap } from '@/lib/gsap';
import { useThemeStore } from '@/components/store/useThemeStore';

// Import Swiper styling directives directly
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface GallerySlide {
	title: string;
	material: string;
	color: string;
	hex: string;
	accent: string;
}

const gallerySlides: GallerySlide[] = [
	{
		title: 'Bouclé Classic',
		material: 'French Loop Bouclé',
		color: 'Crème White',
		hex: '#FCFAF7',
		accent: 'Rose Pink Piping'
	},
	{
		title: 'Desert Suede',
		material: 'Honed Nubuck Leather',
		color: 'Amber Gold',
		hex: '#F7E7C4',
		accent: 'Sunset Orange Seams'
	},
	{
		title: 'Salty Terracotta',
		material: 'Cotton Crushed Velvet',
		color: 'Ochré Amber',
		hex: '#EAA07A',
		accent: 'Golden Yellow Stitching'
	}
];

export default function ProductGallery() {
	const containerRef = useRef<HTMLDivElement>(null);
	const themeStore = useThemeStore();

	const handleSwatchHover = (index: number) => {
		let offset = 0;
		if (index === 0) offset = -0.55;
		else if (index === 1) offset = 0.55;
		else if (index === 2) offset = 1.25;
		themeStore.setGalleryRotationOffset(offset);
	};

	const handleSwatchLeave = () => {
		themeStore.setGalleryRotationOffset(0);
	};

	// Trigger high-end custom GSAP transitions on slide change
	const handleSlideChange = (swiper: any) => {
		const activeSlide = swiper.slides[swiper.activeIndex];
		if (!activeSlide) return;

		const title = activeSlide.querySelector('.slide-title');
		const meta = activeSlide.querySelector('.slide-meta');
		const card = activeSlide.querySelector('.slide-card');

		// Staggered layout reveal transitions
		gsap.fromTo(
			title,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
		);

		gsap.fromTo(
			meta,
			{ opacity: 0, y: 15 },
			{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.25 }
		);

		gsap.fromTo(
			card,
			{ scale: 0.94, filter: 'blur(2px)' },
			{ scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
		);
	};

	return (
		<div ref={containerRef} className="w-full py-16 bg-[#FAF8F5] border-t border-[#EAE1D9]">
			<div className="max-w-4xl mx-auto px-6 space-y-8">
				
				<div className="text-center space-y-2">
					<span className="text-[10px] uppercase tracking-[0.25em] text-[#88837E] font-bold block">
						Material Swatch Gallery
					</span>
					<h3 className="text-2xl font-light tracking-tight text-[#22201F] uppercase">
						Atelier <strong className="font-semibold text-luxury-pink">Variants</strong>
					</h3>
				</div>

				<Swiper
					modules={[Navigation, Pagination]}
					spaceBetween={30}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					onSlideChange={handleSlideChange}
					className="rounded-3xl overflow-hidden shadow-lg border border-[#EAE1D9] bg-white p-2"
				>
					{gallerySlides.map((slide, idx) => (
						<SwiperSlide 
							key={slide.title} 
							onMouseEnter={() => handleSwatchHover(idx)}
							onMouseLeave={handleSwatchLeave}
							className="p-8 md:p-16 flex flex-col md:flex-row gap-10 items-center justify-between"
						>
							{/* Left Column: Visual Swatch Silhouette */}
							<div className="flex-1 w-full flex justify-center">
								<div 
									className="slide-card w-64 h-64 rounded-full border border-[#EAE1D9] shadow-inner flex items-center justify-center relative overflow-hidden transition-all duration-500"
									style={{ backgroundColor: slide.hex }}
								>
									{/* Decorative vector seams */}
									<div className="absolute inset-0 border-t-2 border-dashed border-luxury-pink/40 top-1/2 -translate-y-1/2"></div>
									<div className="absolute inset-0 border-l-2 border-dashed border-luxury-orange/40 left-1/2 -translate-x-1/2"></div>
									
									<span className="px-3 py-1 rounded bg-white/95 text-[9px] uppercase tracking-widest font-extrabold shadow-sm border border-[#EAE1D9] z-10">
										{slide.color}
									</span>
								</div>
							</div>

							{/* Right Column: Descriptions */}
							<div className="flex-1 space-y-4 text-center md:text-left">
								<span className="text-[9px] uppercase tracking-widest font-bold text-luxury-pink">
									Swatch {idx + 1}
								</span>
								<h4 className="slide-title text-2xl font-light tracking-tight text-[#22201F] uppercase">
									{slide.title}
								</h4>
								<div className="slide-meta space-y-2 text-[#55514E] text-xs font-light">
									<p><strong>Texture Base:</strong> {slide.material}</p>
									<p><strong>Luxury Detailing:</strong> {slide.accent}</p>
									<p className="text-[10px] text-[#88837E] pt-3 uppercase tracking-wider font-semibold">
										High contrast pricing applies for custom orders.
									</p>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
