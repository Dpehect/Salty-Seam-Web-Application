'use client';

import dynamic from 'next/dynamic';
import { useCartStore } from '@/components/store/useCartStore';
import { useThemeStore } from '@/components/store/useThemeStore';
import { type Product } from '@/lib/schemas/product';
import { Button } from '@/components/ui/button';

// Dynamically import client components to prevent SSR conflicts
const ScrollStory = dynamic(() => import('@/components/shop/ScrollStory'), {
	ssr: false,
	loading: () => (
		<div className="w-full h-screen flex items-center justify-center bg-[#FAF8F5]">
			<span className="text-xs uppercase tracking-[0.25em] text-luxury-pink animate-pulse font-medium">
				Synchronizing Showroom...
			</span>
		</div>
	)
});

const ProductGallery = dynamic(() => import('@/components/shop/ProductGallery'), {
	ssr: false
});

const CustomOrderForm = dynamic(() => import('@/components/shop/CustomOrderForm'), {
	ssr: false
});

// Catalog catalog products
const catalogProducts: Product[] = [
	{
		name: 'Aura Bouclé Lounge Chair',
		description: 'A sculptural lounge chair wrapped in premium French bouclé, structured with a solid oak core.',
		material: 'French Bouclé & White Oak',
		price: 2450,
		colorPalette: ['Cream', 'Rose Tint', 'Soft Sand']
	},
	{
		name: 'Travertine Console Table',
		description: 'Minimalist geometric console table crafted from raw Italian travertine stone slabs.',
		material: 'Honed Italian Travertine',
		price: 3800,
		colorPalette: ['Warm Ivory', 'Sunset Amber']
	},
	{
		name: 'Oasis Sunset Ottoman',
		description: 'Low-profile velvet seating block featuring dynamic orange-toned piping details.',
		material: 'Cotton Velvet & Brass Base',
		price: 1250,
		colorPalette: ['Apricot Orange', 'Marigold']
	}
];

export default function Home() {
	const cart = useCartStore();
	const theme = useThemeStore();

	const handleAddProduct = (product: Product) => {
		cart.addItem(product);
	};

	return (
		<div className="min-h-screen bg-[#FAF8F5] text-[#22201F] font-sans flex flex-col antialiased">
			{/* Brand Header */}
			<header className="sticky top-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#EAE1D9] py-5 px-8 md:px-16 flex justify-between items-center transition-all duration-300">
				<div>
					<h1 className="font-extrabold uppercase tracking-[0.3em] text-sm text-[#22201F]">
						Seam Salty
					</h1>
					<p className="text-[9px] uppercase tracking-widest text-[#88837E] font-medium mt-0.5">
						Atelier & Furniture Showcase
					</p>
				</div>

				<div className="flex items-center gap-6">
					{/* Cart Badge Readout */}
					<div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAE1D9] bg-white text-xs font-semibold shadow-sm">
						<span className="w-1.5 h-1.5 rounded-full bg-luxury-pink"></span>
						<span className="uppercase tracking-wider text-[#55514E]">Cart</span>
						<span className="ml-1 bg-[#22201F] text-white px-2 py-0.5 rounded-full text-[10px]">
							{cart.totalItems()}
						</span>
					</div>
				</div>
			</header>

			{/* 1. Hero / Scroll Story Area (WebGL Chair rotating with scroll, story descriptions pinning) */}
			<section className="w-full">
				<div className="max-w-7xl mx-auto text-left px-8 md:px-16 pt-24 pb-8 space-y-6">
					<span className="text-[10px] uppercase tracking-[0.25em] text-[#88837E] font-bold block">
						Interactive Showroom
					</span>
					<h2 className="text-7xl md:text-[9rem] lg:text-[11rem] font-extralight tracking-tighter text-[#22201F] uppercase leading-none select-none">
						Salty <span className="block font-bold text-luxury-pink -mt-3 md:-mt-6">Seam</span>
					</h2>
					<p className="text-xs text-[#88837E] max-w-sm leading-relaxed font-light">
						A bespoke digital atelier. Scroll to spin the 3D white oak & bouclé lounge chair. The highlighted fabric contours react to scroll velocity in real-time.
					</p>
				</div>

				{/* Lenis, GSAP, and Framer synced component */}
				<ScrollStory />
			</section>

			{/* 2. Swiper Material Variant Gallery */}
			<ProductGallery />

			{/* 3. Catalog Catalog and Quick Order */}
			<section className="max-w-7xl mx-auto w-full px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
				{/* Catalog Product Grid */}
				<div className="lg:col-span-7 space-y-12">
					<div className="space-y-2">
						<span className="text-[10px] uppercase tracking-[0.25em] text-[#88837E] font-bold block">
							Ready collection
						</span>
						<h3 className="text-5xl font-extralight tracking-tighter text-[#22201F] uppercase">
							Quick <strong className="font-bold text-luxury-pink">Purchase</strong>
						</h3>
					</div>

					<div className="flex flex-col gap-12 lg:gap-16">
						{catalogProducts.map((product, idx) => (
							<div
								key={product.name}
								className={`p-8 rounded-3xl border border-[#EAE1D9] bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[320px] max-w-xl relative ${
									idx === 0 ? 'lg:translate-x-6' : idx === 1 ? 'lg:translate-x-16 lg:-mt-4' : 'lg:-translate-x-2'
								}`}
							>
								<div className="space-y-4">
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-bold text-base text-[#22201F] tracking-tight">{product.name}</h4>
										<span className="text-sm font-black text-luxury-pink">
											${product.price.toLocaleString()}
										</span>
									</div>
									<p className="text-[9px] uppercase tracking-wider text-[#88837E] font-extrabold">
										{product.material}
									</p>
									<p className="text-xs text-[#55514E] leading-relaxed font-light">
										{product.description}
									</p>
								</div>

								<div className="space-y-4 pt-6 border-t border-[#EAE1D9]/40 mt-6">
									<div className="flex flex-wrap gap-1.5">
										{product.colorPalette.map((color) => (
											<span
												key={color}
												className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE1D9] text-[8px] font-semibold text-[#88837E] uppercase tracking-wider"
											>
												{color}
											</span>
										))}
									</div>
									<Button
										onClick={() => handleAddProduct(product)}
										className="w-full text-xs uppercase tracking-widest font-bold cursor-pointer py-5"
									>
										Add to Selection
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Cart Sidebar panel */}
				<div className="lg:col-span-5 space-y-6">
					<div className="space-y-1">
						<span className="text-[10px] uppercase tracking-[0.25em] text-[#88837E] font-bold block">
							Your Selection
						</span>
						<h3 className="text-2xl font-light tracking-tight text-[#22201F] uppercase">
							Checkout <strong className="font-semibold text-luxury-pink">Bag</strong>
						</h3>
					</div>

					<div className="p-6 rounded-2xl border border-[#EAE1D9] bg-white shadow-sm space-y-4">
						{cart.items.length === 0 ? (
							<div className="text-center py-10 space-y-2">
								<span className="text-2xl block">👜</span>
								<p className="text-xs text-[#88837E] font-light">Your selection bag is empty.</p>
							</div>
						) : (
							<div className="space-y-4">
								<div className="divide-y divide-[#EAE1D9]/50">
									{cart.items.map((item) => (
										<div key={item.product.name} className="py-3 flex justify-between items-center text-xs">
											<div>
												<span className="font-semibold text-[#22201F]">{item.product.name}</span>
												<span className="text-[10px] text-[#88837E] ml-2">x{item.quantity}</span>
											</div>
											<button
												onClick={() => cart.removeItem(item.product.name)}
												className="text-[10px] font-bold uppercase tracking-wider text-[#FF4A76] hover:underline cursor-pointer"
											>
												Remove
											</button>
										</div>
									))}
								</div>
								<div className="pt-3 border-t border-[#EAE1D9] flex justify-between items-center font-bold text-xs text-[#22201F]">
									<span>SUBTOTAL</span>
									<span className="text-sm text-luxury-pink">${cart.totalPrice().toLocaleString()}</span>
								</div>
								<Button
									onClick={cart.clearCart}
									variant="outline"
									className="w-full text-[10px] uppercase tracking-wider font-bold cursor-pointer"
								>
									Clear Cart
								</Button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* 4. Custom Bespoke Order Form */}
			<CustomOrderForm />

			{/* Luxury Footer */}
			<footer className="bg-white border-t border-[#EAE1D9] py-8 text-center text-[10px] font-mono uppercase tracking-wider text-[#88837E]">
				<p>© {new Date().getFullYear()} Seam Salty Atelier. High Contrast WCAG Design.</p>
			</footer>
		</div>
	);
}
