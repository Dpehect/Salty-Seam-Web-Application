'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false
	};

	public static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('WebGL/R3F Render crash caught by Boundary:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Gorgeous, high-contrast, light-only static SVG fallback of the showroom item
			return (
				<div className="w-full h-[500px] bg-[#FAF6F0] rounded-2xl border border-[#EAE1D9] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-inner">
					{/* Abstract line representation of our luxury chair cushion/structure */}
					<svg className="w-40 h-40 text-luxury-pink/20 animate-pulse mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
						{/* Seat cushion */}
						<rect x="25" y="55" width="50" height="12" rx="4" />
						{/* Backrest */}
						<rect x="28" y="25" width="44" height="28" rx="6" />
						{/* Legs */}
						<line x1="33" y1="67" x2="28" y2="85" strokeLinecap="round" />
						<line x1="67" y1="67" x2="72" y2="85" strokeLinecap="round" />
						<line x1="42" y1="67" x2="42" y2="80" strokeLinecap="round" />
						<line x1="58" y1="67" x2="58" y2="80" strokeLinecap="round" />
					</svg>

					<div className="space-y-2">
						<span className="px-3 py-1 rounded-full bg-luxury-pink/10 text-luxury-pink text-[9px] uppercase tracking-widest font-extrabold">
							WebGL Safe Mode
						</span>
						<h3 className="text-lg font-bold text-[#22201F] tracking-tight uppercase">
							Aura Lounge Chair
						</h3>
						<p className="text-xs text-[#88837E] max-w-xs leading-relaxed font-light">
							Our interactive 3D atelier has experienced a graphics load failure. Reverting to static visual portfolio assets.
						</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
