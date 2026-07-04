import { create } from 'zustand';

export type AccentTheme = 'pink' | 'yellow' | 'orange';
export type WoodFinish = 'white-oak' | 'natural-walnut' | 'ebonized-ash';
export type FabricType = 'boucle-cream' | 'nubuck-amber' | 'velvet-ochre';

export type CursorTheme = 'default' | 'detail' | 'drag';

interface ThemeState {
	accentColor: AccentTheme;
	woodFinish: WoodFinish;
	fabricType: FabricType;
	galleryRotationOffset: number; // Rotates the 3D chair to face hovered variants
	isExploding: boolean; // Triggers interactive chair disassembly Easter Egg
	cursorType: CursorTheme; // Tracks custom cursor morph states
	performanceMode: boolean; // Controls Three.js/R3F render load (FPS vs fidelity)
	setAccentColor: (color: AccentTheme) => void;
	setWoodFinish: (finish: WoodFinish) => void;
	setFabricType: (fabric: FabricType) => void;
	setGalleryRotationOffset: (offset: number) => void;
	setIsExploding: (val: boolean) => void;
	setCursorType: (type: CursorTheme) => void;
	togglePerformanceMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
	accentColor: 'pink',
	woodFinish: 'white-oak',
	fabricType: 'boucle-cream',
	galleryRotationOffset: 0,
	isExploding: false,
	cursorType: 'default',
	performanceMode: false,

	setAccentColor: (color) => set({ accentColor: color }),
	setWoodFinish: (finish) => set({ woodFinish: finish }),
	setFabricType: (fabric) => set({ fabricType: fabric }),
	setGalleryRotationOffset: (offset) => set({ galleryRotationOffset: offset }),
	setIsExploding: (val) => set({ isExploding: val }),
	setCursorType: (type) => set({ cursorType: type }),
	togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode }))
}));
