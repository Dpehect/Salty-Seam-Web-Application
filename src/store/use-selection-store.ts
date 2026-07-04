import { create } from 'zustand'

export type ProductId = 'aura-boucle' | 'travertine-console' | 'oasis-ottoman' | 'tide-vessel'

interface SelectionStore {
  selected: Set<ProductId>
  activeChapter: string
  isHeaderScrolled: boolean
  toggle: (id: ProductId) => void
  isSelected: (id: ProductId) => boolean
  setActiveChapter: (chapter: string) => void
  setHeaderScrolled: (v: boolean) => void
  count: () => number
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selected: new Set(),
  activeChapter: 'hero',
  isHeaderScrolled: false,

  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selected)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selected: next }
    }),

  isSelected: (id) => get().selected.has(id),

  setActiveChapter: (chapter) => set({ activeChapter: chapter }),

  setHeaderScrolled: (v) => set({ isHeaderScrolled: v }),

  count: () => get().selected.size,
}))
