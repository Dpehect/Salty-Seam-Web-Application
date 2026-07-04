'use client'

import { useEffect } from 'react'
import { useSelectionStore } from '@/store/use-selection-store'

const CHAPTERS = [
  { id: 'hero', selector: '#hero' },
  { id: 'atelier', selector: '#atelier' },
  { id: 'collection', selector: '#collection' },
  { id: 'showroom', selector: '#showroom' },
  { id: 'material-lab', selector: '#material-lab' },
]

export function useScrollChapter() {
  const setActiveChapter = useSelectionStore((s) => s.setActiveChapter)
  const setHeaderScrolled = useSelectionStore((s) => s.setHeaderScrolled)

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY
      setHeaderScrolled(scrollY > 80)

      for (const chapter of [...CHAPTERS].reverse()) {
        const el = document.querySelector(chapter.selector)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.5) {
          setActiveChapter(chapter.id)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setActiveChapter, setHeaderScrolled])
}
