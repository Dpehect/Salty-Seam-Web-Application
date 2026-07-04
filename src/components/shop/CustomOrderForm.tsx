'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/components/store/useThemeStore';

// Zod Schema validating custom furniture orders
const customOrderSchema = z.object({
	customerName: z.string().min(2, 'Name must be at least 2 characters'),
	customerEmail: z.string().email('Please enter a valid email address'),
	woodFinish: z.enum(['white-oak', 'natural-walnut', 'ebonized-ash']),
	fabricType: z.enum(['boucle-cream', 'nubuck-amber', 'velvet-ochre']),
	customHeight: z.number().min(30, 'Minimum height is 30 inches').max(45, 'Maximum height is 45 inches'),
	specialRequests: z.string().optional()
});

type CustomOrderFormValues = z.infer<typeof customOrderSchema>;

export default function CustomOrderForm() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch
	} = useForm<CustomOrderFormValues>({
		resolver: zodResolver(customOrderSchema),
		defaultValues: {
			customHeight: 36,
			specialRequests: ''
		}
	});

	// Watch finish and fabric selections to sync reactively with Zustand store
	const watchedWoodFinish = watch('woodFinish');
	const watchedFabricType = watch('fabricType');
	const themeStore = useThemeStore();

	useEffect(() => {
		if (watchedWoodFinish) {
			themeStore.setWoodFinish(watchedWoodFinish);
		}
	}, [watchedWoodFinish]);

	useEffect(() => {
		if (watchedFabricType) {
			themeStore.setFabricType(watchedFabricType);
		}
	}, [watchedFabricType]);

	const onSubmit = async (data: CustomOrderFormValues) => {
		// Mock API submission latency
		await new Promise((resolve) => setTimeout(resolve, 800));
		console.log('Valid custom order submitted:', data);
		setIsSubmitted(true);
	};

	const handleReset = () => {
		reset();
		setIsSubmitted(false);
	};

	return (
		<div className="w-full py-16 bg-[#FAF8F5] border-t border-[#EAE1D9]">
			<div className="max-w-xl mx-auto px-6">
				
				<div className="text-center space-y-2 mb-10">
					<span className="text-[10px] uppercase tracking-[0.25em] text-[#88837E] font-bold block">
						Bespoke Commissions
					</span>
					<h3 className="text-2xl font-light tracking-tight text-[#22201F] uppercase">
						Custom <strong className="font-semibold text-luxury-pink">Order Form</strong>
					</h3>
				</div>

				<div className="glass-panel p-8 rounded-3xl bg-white border border-[#EAE1D9] shadow-md relative overflow-hidden">
					{isSubmitted ? (
						<div className="text-center py-8 space-y-4">
							<div className="w-12 h-12 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center mx-auto text-xl font-bold">
								✓
							</div>
							<h4 className="text-lg font-bold text-[#22201F] uppercase tracking-wide">
								Commission Registered
							</h4>
							<p className="text-xs text-[#55514E] leading-relaxed font-light max-w-xs mx-auto">
								Your bespoke specifications have been locked. An atelier architect will contact you shortly to review dimension details.
							</p>
							<Button
								onClick={handleReset}
								className="mt-4 text-[10px] uppercase tracking-wider font-bold cursor-pointer"
								variant="outline"
							>
								Submit Another Specification
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							
							{/* Name Field */}
							<div className="space-y-1">
								<label className="text-[10px] uppercase tracking-widest font-extrabold text-[#55514E] block">
									Full Name
								</label>
								<input
									type="text"
									{...register('customerName')}
									placeholder="e.g. Christian Liaigre"
									className="w-full px-4 py-3 rounded-xl border border-[#EAE1D9] bg-[#FAF8F5] text-xs font-medium text-[#22201F] focus:outline-none focus:border-luxury-pink/80 focus:ring-1 focus:ring-luxury-pink/30 transition-all placeholder:text-[#88837E]/60"
									aria-invalid={errors.customerName ? 'true' : 'false'}
								/>
								{errors.customerName && (
									<p className="text-[10px] text-[#FF4A76] font-bold uppercase tracking-wider pt-0.5">
										{errors.customerName.message}
									</p>
								)}
							</div>

							{/* Email Field */}
							<div className="space-y-1">
								<label className="text-[10px] uppercase tracking-widest font-extrabold text-[#55514E] block">
									Email Address
								</label>
								<input
									type="email"
									{...register('customerEmail')}
									placeholder="e.g. designer@atelier.com"
									className="w-full px-4 py-3 rounded-xl border border-[#EAE1D9] bg-[#FAF8F5] text-xs font-medium text-[#22201F] focus:outline-none focus:border-luxury-pink/80 focus:ring-1 focus:ring-luxury-pink/30 transition-all placeholder:text-[#88837E]/60"
									aria-invalid={errors.customerEmail ? 'true' : 'false'}
								/>
								{errors.customerEmail && (
									<p className="text-[10px] text-[#FF4A76] font-bold uppercase tracking-wider pt-0.5">
										{errors.customerEmail.message}
									</p>
								)}
							</div>

							{/* Custom Wood Finishes */}
							<div className="space-y-1.5">
								<label className="text-[10px] uppercase tracking-widest font-extrabold text-[#55514E] block">
									Base Wood Finish
								</label>
								<div className="grid grid-cols-3 gap-3">
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="white-oak"
											{...register('woodFinish')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">White Oak</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Bleached Matte</span>
									</label>
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="natural-walnut"
											{...register('woodFinish')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">Walnut</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Oiled Walnut</span>
									</label>
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="ebonized-ash"
											{...register('woodFinish')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">Ebonized</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Charcoal Matte</span>
									</label>
								</div>
								{errors.woodFinish && (
									<p className="text-[10px] text-[#FF4A76] font-bold uppercase tracking-wider pt-0.5">
										{errors.woodFinish.message}
									</p>
								)}
							</div>

							{/* Fabric Selection */}
							<div className="space-y-1.5">
								<label className="text-[10px] uppercase tracking-widest font-extrabold text-[#55514E] block">
									Upholstery Fabric
								</label>
								<div className="grid grid-cols-3 gap-3">
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="boucle-cream"
											{...register('fabricType')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">Bouclé</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Crème White</span>
									</label>
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="nubuck-amber"
											{...register('fabricType')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">Nubuck</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Amber Gold</span>
									</label>
									<label className="border border-[#EAE1D9] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-center hover:border-luxury-pink/40 transition-colors">
										<input
											type="radio"
											value="velvet-ochre"
											{...register('fabricType')}
											className="sr-only peer"
										/>
										<span className="text-[10px] font-bold text-[#22201F] uppercase tracking-wider">Velvet</span>
										<span className="text-[8px] text-[#88837E] mt-0.5">Ochré Orange</span>
									</label>
								</div>
								{errors.fabricType && (
									<p className="text-[10px] text-[#FF4A76] font-bold uppercase tracking-wider pt-0.5">
										{errors.fabricType.message}
									</p>
								)}
							</div>

							{/* Custom Height Slider */}
							<div className="space-y-2">
								<div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-extrabold text-[#55514E]">
									<span>Custom backrest Height</span>
									<span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#22201F]">
										Height selector
									</span>
								</div>
								<input
									type="range"
									min="30"
									max="45"
									step="1"
									{...register('customHeight', { valueAsNumber: true })}
									className="w-full h-1.5 bg-[#EAE1D9] rounded-lg appearance-none cursor-pointer accent-luxury-pink"
								/>
								<div className="flex justify-between text-[8px] text-[#88837E] font-bold uppercase">
									<span>30" (Compact)</span>
									<span>45" (High-back Lounge)</span>
								</div>
							</div>

							{/* Special Requests */}
							<div className="space-y-1">
								<label className="text-[10px] uppercase tracking-widest font-extrabold text-[#55514E] block">
									Special Requests & Directives
								</label>
								<textarea
									{...register('specialRequests')}
									rows={3}
									placeholder="Specify sizing tweaks, fabric preferences, or shipping requests..."
									className="w-full px-4 py-3 rounded-xl border border-[#EAE1D9] bg-[#FAF8F5] text-xs font-medium text-[#22201F] focus:outline-none focus:border-luxury-pink/80 focus:ring-1 focus:ring-luxury-pink/30 transition-all placeholder:text-[#88837E]/60 resize-none"
								/>
							</div>

							{/* Submit CTA */}
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full py-6 text-xs uppercase tracking-widest font-bold cursor-pointer transition-all duration-300"
							>
								{isSubmitting ? 'Locking Specifications...' : 'Register Custom Order'}
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
