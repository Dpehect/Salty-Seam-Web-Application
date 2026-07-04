'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { createLenis, destroyLenis, getLenis } from '@/lib/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = createLenis()

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      destroyLenis()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return getLenis
}
