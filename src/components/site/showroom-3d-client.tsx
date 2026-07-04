'use client'

import dynamic from 'next/dynamic'

const Showroom3DInner = dynamic(
  () => import('@/components/site/showroom-3d').then((m) => m.Showroom3D),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 'clamp(500px, 60vw, 750px)',
          backgroundColor: '#EDE9E1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.6875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#7A6E68',
          }}
        >
          Loading Showroom
        </span>
      </div>
    ),
  }
)

export function Showroom3DClient() {
  return <Showroom3DInner />
}
