'use client'

import { useLenis } from '@/hooks/use-lenis'

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis()
  return <>{children}</>
}
