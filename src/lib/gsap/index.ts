import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger client-side to prevent SSR issues
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export * from 'gsap';
export { ScrollTrigger };
