'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCartStore } from '@/components/store/useCartStore';
import { useThemeStore } from '@/components/store/useThemeStore';
import { type Product } from '@/lib/schemas/product';
import { Button } from '@/components/ui/button';

// Dynamically load the R3F ScrollStory component (ssr safe)
const ScrollStory = dynamic(() => import('@/components/shop/ScrollStory'), {
	ssr: false,
	loading: () => (
		<div className="w-full h-screen flex items-center justify-center bg-background">
			<span className="text-xs uppercase tracking-[0.3em] text-luxury-terracotta animate-pulse font-medium">
				Loading Atelier Showroom...
			</span>
		</div>
	)
});

const readyProducts: Product[] = [
	{
		name: 'Aura Bouclé Lounge Chair',
		description: 'A low-slung, sculptural lounge chair engineered from a solid White Oak core. The body is wrapped in raw loop bouclé, highlighted by hand-stitched double-piped contrast seams.',
		material: 'French Loop Bouclé & White Oak',
		price: 2450,
		colorPalette: ['Crème White', 'Dusty Rose', 'Soft Sand'],
		materialOrigin: 'Alsace Forests, France',
		craftingTime: '42 Hours Hand-stitched',
		seamDetail: 'Double-piped contrast contours'
	},
	{
		name: 'Travertine Console Table',
		description: 'A minimalist geometric console crafted from unfilled Italian Travertine. Honed by hand, its monolithic slabs join seamlessly with zero-joint structural alignment.',
		material: 'Honed Italian Travertine Slabs',
		price: 3800,
		colorPalette: ['Warm Ivory', 'Sunset Amber'],
		materialOrigin: 'Tuscany Quarries, Italy',
		craftingTime: '28 Hours Masoned',
		seamDetail: 'Zero-joint stone slab joinery'
	},
	{
		name: 'Oasis Sunset Ottoman',
		description: 'A low-profile velvet seating block resting on a polished solid brass base. Dynamic terracotta piping details follow the clean outline structure.',
		material: 'Cotton Velvet & Brass Base',
		price: 1250,
		colorPalette: ['Apricot Orange', 'Marigold'],
		materialOrigin: 'Biella Mills, Italy',
		craftingTime: '18 Hours Tailored',
		seamDetail: 'Contrast accent piping threads'
	}
];

export default function Home() {
	const cart = useCartStore();
	const themeStore = useThemeStore();
	const [activeBagOpen, setActiveBagOpen] = useState(false);

	const handleAddProduct = (product: Product) => {
		cart.addItem(product);
		setActiveBagOpen(true);
	};

	return (
		<div className="min-h-screen bg-background text-foreground font-sans flex flex-col antialiased relative overflow-x-hidden selection:bg-luxury-terracotta/20">
			
			{/* Editorial Header */}
			<header className="fixed top-0 left-0 w-full z-40 bg-background/70 backdrop-blur-md border-b border-[#EAE1D9]/40 py-6 px-8 md:px-16 flex justify-between items-center transition-all duration-500">
				<div>
					<h1 className="font-serif text-xl tracking-tight text-foreground uppercase font-bold">
						Seam Salty
					</h1>
					<span className="text-[8px] font-mono tracking-[0.3em] text-[#88837E] uppercase block mt-1">
						Atelier & Showroom Index
					</span>
				</div>

				<div className="flex items-center gap-8">
					<button
						onClick={() => setActiveBagOpen(!activeBagOpen)}
						className="flex items-center gap-2 group cursor-pointer text-[10px] font-mono uppercase tracking-widest text-foreground hover:text-luxury-terracotta transition-colors duration-300"
					>
						<span className="w-1.5 h-1.5 rounded-full bg-luxury-terracotta group-hover:scale-125 transition-transform" />
						<span>Selection Bag</span>
						<span className="ml-1 bg-foreground text-background px-2 py-0.5 rounded-full text-[9px] font-bold">
							{cart.totalItems()}
						</span>
					</button>
				</div>
			</header>

			{/* 1. Cinematic Hero Section (Grid-breaker) */}
			<section className="relative min-h-screen flex flex-col justify-end pt-36 pb-20 px-8 md:px-16 select-none z-10 pointer-events-none">
				{/* Huge Floating Typographic Layer */}
				<div className="max-w-7xl w-full mx-auto relative">
					<div className="absolute -top-32 -left-6 opacity-[0.03] select-none pointer-events-none font-serif text-[18rem] md:text-[28rem] uppercase leading-none font-black text-foreground">
						Aura
					</div>

					<span className="text-[10px] font-mono tracking-[0.25em] text-[#88837E] uppercase block mb-6 font-bold">
						Interactive digital Atelier
					</span>
					
					<h2 className="text-7xl md:text-[11rem] lg:text-[14rem] font-extralight tracking-tighter leading-[0.85] text-foreground uppercase">
						Organic <span className="block font-bold text-luxury-terracotta -mt-2 md:-mt-6">Luxury</span>
					</h2>

					{/* Bleeding metadata description */}
					<div className="mt-12 max-w-sm pointer-events-auto md:ml-[30%]">
						<p className="text-xs md:text-sm text-[#55514E] leading-relaxed font-light">
							We do not manufacture furniture; we sculpt physical relationships. The seam is the contour where raw white oak base joinery meets the soft embrace of loop bouclé fabric.
						</p>
					</div>
				</div>
			</section>

			{/* 2. Synced Showroom Canvas and Storytelling (Scroll Story) */}
			<ScrollStory />

			{/* 3. The Atelier Story Section (Pull Quotes & Bleeding Text) */}
			<section className="py-32 px-8 md:px-16 max-w-7xl mx-auto w-full relative z-20">
				<div className="relative">
					{/* Bleeding background title */}
					<h3 className="absolute -top-16 left-0 opacity-[0.02] font-serif text-8xl md:text-[15rem] uppercase font-bold tracking-tighter pointer-events-none">
						Atelier
					</h3>

					<div className="max-w-3xl space-y-12 relative z-10 md:ml-24">
						<span className="text-[9px] font-mono tracking-[0.25em] text-luxury-forest font-bold uppercase block">
							02 / Philosophy
						</span>
						
						{/* Dramatic Pull Quote */}
						<blockquote className="text-3xl md:text-5xl lg:text-6xl font-serif font-extralight text-foreground tracking-tight leading-tight uppercase">
							"Texture is the shadow cast by structural detail."
						</blockquote>

						<p className="text-sm text-[#55514E] leading-relaxed font-light max-w-xl">
							Every contour of our collection is engineered in our Italian and French mills. Our master artisans hand-stitch contrast piping to outline the geometry cushion support structures, revealing the seam as a tactical highlight that catches light.
						</p>
					</div>
				</div>
			</section>

			{/* 4. The Ready Collection (3 product rows with heavy overlapping) */}
			<section className="py-24 px-8 md:px-16 max-w-7xl mx-auto w-full space-y-[20vh] relative z-20">
				
				<div className="space-y-4 max-w-md">
					<span className="text-[9px] font-mono tracking-[0.25em] text-[#88837E] font-bold uppercase block">
						Aura collection
					</span>
					<h3 className="text-5xl font-extralight tracking-tighter text-foreground uppercase">
						Ready <span className="font-bold text-luxury-terracotta">Ateliers</span>
					</h3>
				</div>

				<div className="space-y-48 lg:space-y-64">
					{readyProducts.map((product, idx) => (
						<div
							key={product.name}
							className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative ${
								idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
							}`}
						>
							{/* Large Editorial Offset Image Panel */}
							<div className="flex-1 w-full relative group">
								<div 
									className="w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden relative shadow-md bg-white border border-[#EAE1D9]/40 flex items-center justify-center pointer-events-auto transition-transform duration-700 hover:scale-[1.01]"
									onMouseEnter={() => themeStore.setCursorType('detail')}
									onMouseLeave={() => themeStore.setCursorType('default')}
								>
									{/* Luxury Sketch Silhouette */}
									<div className="w-72 h-72 rounded-full border border-dashed border-[#EAE1D9] flex items-center justify-center opacity-65 relative overflow-hidden">
										<div className="absolute inset-x-0 h-0.5 bg-luxury-terracotta/20 top-1/2 -translate-y-1/2"></div>
										<div className="absolute inset-y-0 w-0.5 bg-luxury-forest/20 left-1/2 -translate-x-1/2"></div>
										<span className="px-3 py-1 rounded bg-background text-[9px] uppercase tracking-widest font-extrabold text-[#88837E] border border-[#EAE1D9]">
											Variant swatch {idx + 1}
										</span>
									</div>
								</div>

								{/* floating background index number */}
								<span className="absolute -top-16 -left-8 md:-left-12 opacity-[0.03] font-serif text-[12rem] md:text-[18rem] uppercase font-black pointer-events-none select-none">
									0{idx + 1}
								</span>
							</div>

							{/* Overlapping Text Panel bleeding into the image frame */}
							<div 
								className={`flex-1 max-w-xl space-y-6 z-10 pointer-events-auto relative bg-[#F9F7F3] p-8 md:p-12 rounded-3xl border border-[#EAE1D9] shadow-lg ${
									idx % 2 === 1 ? 'lg:-mr-16' : 'lg:-ml-16'
								}`}
							>
								<div className="space-y-2">
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-serif text-2xl font-bold text-foreground uppercase tracking-tight">
											{product.name}
										</h4>
										<span className="text-base font-black text-luxury-terracotta">
											${product.price.toLocaleString()}
										</span>
									</div>
									<span className="text-[10px] font-mono tracking-widest text-luxury-forest uppercase block font-bold">
										{product.material}
									</span>
								</div>

								<p className="text-xs text-[#55514E] leading-relaxed font-light">
									{product.description}
								</p>

								{/* Blueprint metadata row */}
								<div className="grid grid-cols-2 gap-4 text-[9px] font-mono uppercase tracking-wider text-[#88837E] font-medium border-t border-[#EAE1D9]/40 pt-6">
									<div>
										<span className="block font-black text-foreground mb-0.5">Origin</span>
										<span>{product.materialOrigin}</span>
									</div>
									<div>
										<span className="block font-black text-foreground mb-0.5">Atelier</span>
										<span>{product.craftingTime}</span>
									</div>
									<div className="col-span-2">
										<span className="block font-black text-foreground mb-0.5">Detailing</span>
										<span>{product.seamDetail}</span>
									</div>
								</div>

								<div className="pt-4 flex items-center justify-between gap-4">
									<span className="text-[8px] font-mono uppercase tracking-wider text-[#88837E]">
										High contrast styling applies.
									</span>
									<Button
										onClick={() => handleAddProduct(product)}
										className="px-6 py-5 text-xs uppercase tracking-widest font-bold cursor-pointer"
									>
										Add to Selection
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Floating Selection Bag Sidebar (Zustand state controller) */}
			{activeBagOpen && (
				<div className="fixed inset-0 z-50 flex justify-end bg-[#2C2421]/15 backdrop-blur-sm pointer-events-auto">
					{/* Backdrop close bind */}
					<div className="absolute inset-0 cursor-pointer" onClick={() => setActiveBagOpen(false)} />

					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 22, stiffness: 160 }}
						className="w-full max-w-md h-full bg-[#F9F7F3] border-l border-[#EAE1D9] shadow-2xl p-8 relative flex flex-col justify-between"
					>
						<div className="space-y-6">
							<div className="flex justify-between items-center pb-4 border-b border-[#EAE1D9]">
								<div>
									<h3 className="font-serif text-lg font-bold uppercase tracking-tight">Selection Bag</h3>
									<span className="text-[8px] font-mono uppercase tracking-widest text-[#88837E]">Items registered</span>
								</div>
								<button
									onClick={() => setActiveBagOpen(false)}
									className="text-xs uppercase font-mono tracking-widest hover:text-luxury-terracotta cursor-pointer"
								>
									[ Close ]
								</button>
							</div>

							{cart.items.length === 0 ? (
								<div className="py-20 text-center space-y-2">
									<span className="text-xl">👜</span>
									<p className="text-xs text-[#88837E] font-light">Your selection bag is empty.</p>
								</div>
							) : (
								<div className="divide-y divide-[#EAE1D9]/40 max-h-[60vh] overflow-y-auto pr-2">
									{cart.items.map((item) => (
										<div key={item.product.name} className="py-4 flex justify-between items-center text-xs">
											<div>
												<span className="font-serif font-bold text-sm block text-foreground">{item.product.name}</span>
												<span className="text-[9px] font-mono text-[#88837E] block uppercase tracking-wider">{item.product.material}</span>
												<span className="text-[10px] text-[#88837E] mt-1 block">Quantity: {item.quantity}</span>
											</div>
											<div className="text-right space-y-2">
												<span className="block font-black text-luxury-terracotta">${(item.product.price * item.quantity).toLocaleString()}</span>
												<button
													onClick={() => cart.removeItem(item.product.name)}
													className="text-[9px] font-mono uppercase tracking-widest text-[#FF4A76] hover:underline cursor-pointer"
												>
													[ Remove ]
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="pt-6 border-t border-[#EAE1D9] space-y-4">
							<div className="flex justify-between items-center text-xs font-bold">
								<span className="font-mono uppercase tracking-widest text-[#88837E]">Total value</span>
								<span className="text-lg font-black text-luxury-terracotta">${cart.totalPrice().toLocaleString()}</span>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Button
									onClick={cart.clearCart}
									variant="outline"
									className="py-4 text-[9px] uppercase tracking-widest font-bold cursor-pointer"
								>
									Clear selection
								</Button>
								<Button
									onClick={() => alert('Proceeding to luxury commission checkout.')}
									className="py-4 text-[9px] uppercase tracking-widest font-bold cursor-pointer"
								>
									Submit commission
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Luxury Editorial Footer */}
			<footer className="bg-background border-t border-[#EAE1D9]/40 py-12 px-8 md:px-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 z-20 relative">
				<div className="space-y-1">
					<h4 className="font-serif text-sm uppercase tracking-wider font-bold text-foreground">Seam Salty</h4>
					<p className="text-[9px] font-mono uppercase tracking-widest text-[#88837E]">© {new Date().getFullYear()} Salty Seam Atelier. High Contrast WCAG design.</p>
				</div>
				<div className="flex gap-6 text-[9px] font-mono uppercase tracking-widest text-[#88837E]">
					<a href="#" className="editorial-link">Atelier</a>
					<a href="#" className="editorial-link">Collection</a>
					<a href="#" className="editorial-link">Commissions</a>
				</div>
			</footer>
		</div>
	);
}
