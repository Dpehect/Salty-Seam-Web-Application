import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

// Register plugins client-side to prevent SSR issues
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger, CustomEase);
	CustomEase.create('luxury', 'M0,0 C0.2,0 0.3,1 1,1');
}

export * from 'gsap';
export { ScrollTrigger, CustomEase };
