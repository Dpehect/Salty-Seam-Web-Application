'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { staggerContainer, fadeUp, fadeIn } from '@/lib/motion'

export function Hero() {
  const prefersReduced = usePrefersReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const headingY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const subY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '600px',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        paddingBottom: 'clamp(3rem, 6vw, 6rem)',
      }}
    >
      {/* Outer decorative circle */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          width: 'clamp(200px, 30vw, 480px)',
          height: 'clamp(200px, 30vw, 480px)',
          borderRadius: '50%',
          border: '1px solid var(--color-sand)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      {/* Inner decorative circle */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '18%',
          right: '14%',
          width: 'clamp(100px, 15vw, 240px)',
          height: 'clamp(100px, 15vw, 240px)',
          borderRadius: '50%',
          border: '1px solid var(--color-sand)',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Top metadata strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '0 clamp(1.5rem, 5vw, 6rem)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="eyebrow">Atelier No. 001</span>
          <span className="eyebrow">Alentejo, Portugal</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <span className="eyebrow">Collection 2024</span>
          <span className="eyebrow">Organic Luxury</span>
        </div>
      </motion.div>

      {/* Main heading block — parallax wrapper */}
      <motion.div
        style={{
          y: prefersReduced ? '0%' : headingY,
          opacity,
          position: 'relative',
          zIndex: 2,
        }}
        className="editorial-container"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeIn} style={{ marginBottom: 'clamp(1rem, 2vw, 2rem)' }}>
            <span
              className="eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '1px',
                  backgroundColor: 'var(--color-muted)',
                }}
              />
              Organic Luxury Atelier
            </span>
          </motion.div>

          {/* Hero display heading */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.5rem, 11vw, 13rem)',
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              fontStyle: 'italic',
              maxWidth: '14ch',
            }}
          >
            <motion.span variants={fadeUp} style={{ display: 'block' }}>
              Objects
            </motion.span>
            <motion.span
              variants={fadeUp}
              style={{
                display: 'block',
                paddingLeft: 'clamp(2rem, 8vw, 12rem)',
                color: 'var(--color-terracotta)',
              }}
            >
              shaped
            </motion.span>
            <motion.span
              variants={fadeUp}
              style={{ display: 'block', fontStyle: 'normal', fontWeight: 400 }}
            >
              by salt air.
            </motion.span>
          </h1>

          {/* Sub copy — has its own lighter parallax */}
          <motion.p
            variants={fadeUp}
            style={{
              y: prefersReduced ? '0%' : subY,
              marginTop: 'clamp(2rem, 4vw, 4rem)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              lineHeight: 1.8,
              color: 'var(--color-muted)',
              maxWidth: '42ch',
              marginLeft: 'clamp(2rem, 8vw, 12rem)',
            }}
          >
            Softened edges, quiet intelligence of material.
            <br />A coastal atelier composing objects for rooms that breathe.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 4vw, 4rem)',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 clamp(1.5rem, 5vw, 6rem)',
        }}
      >
        {/* Vertical text accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '1px',
              height: '3rem',
              backgroundColor: 'var(--color-sand)',
            }}
          />
          <span
            className="eyebrow"
            style={{ writingMode: 'vertical-rl' as const, letterSpacing: '0.25em' }}
          >
            Scroll to Enter
          </span>
        </div>

        {/* Right metadata + animated scroll dot */}
        <div style={{ display: 'flex', gap: 'clamp(1.5rem, 4vw, 4rem)', alignItems: 'flex-end' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.25rem',
            }}
          >
            <span className="eyebrow">Est. 2024</span>
            <span className="eyebrow" style={{ color: 'var(--color-terracotta)' }}>
              4 Pieces
            </span>
          </div>

          {/* Animated scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                width: '1px',
                height: '2rem',
                backgroundColor: 'var(--color-muted)',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-terracotta)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
