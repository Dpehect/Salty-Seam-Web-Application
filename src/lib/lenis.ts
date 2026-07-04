import Lenis from 'lenis'

let lenis: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenis
}

export function createLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  })
  return lenis
}

export function destroyLenis(): void {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}
