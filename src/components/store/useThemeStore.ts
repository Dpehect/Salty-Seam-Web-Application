import { create } from 'zustand';

export type AccentTheme = 'pink' | 'yellow' | 'orange';

interface ThemeState {
	accentColor: AccentTheme;
	performanceMode: boolean; // Controls Three.js/R3F render load (FPS vs fidelity)
	setAccentColor: (color: AccentTheme) => void;
	togglePerformanceMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
	accentColor: 'pink', // Default luxury primary accent
	performanceMode: false, // Default high fidelity rendering

	setAccentColor: (color) => set({ accentColor: color }),
	togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode }))
}));
