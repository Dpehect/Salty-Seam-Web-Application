'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn, clipReveal, staggerContainer } from '@/lib/motion'
import { useSelectionStore } from '@/store/use-selection-store'
import { products, type Product } from '@/lib/products'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { ProductId } from '@/store/use-selection-store'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function MaterialSwatch({ color, name }: { color: string; name: string }) {
  return (
    <button
      title={name}
      aria-label={name}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: color,
        border: '1.5px solid rgba(44,36,33,0.15)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.transform = 'scale(1.15)'
        el.style.borderColor = 'var(--color-text)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.transform = 'scale(1)'
        el.style.borderColor = 'rgba(44,36,33,0.15)'
      }}
    />
  )
}

function SelectButton({ product }: { product: Product }) {
  const toggle = useSelectionStore((s) => s.toggle)
  const isSelected = useSelectionStore((s) => s.isSelected(product.id as ProductId))

  return (
    <motion.button
      onClick={() => toggle(product.id as ProductId)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.8125rem 1.75rem',
        backgroundColor: isSelected ? 'var(--color-terracotta)' : 'transparent',
        color: isSelected ? 'var(--color-warm-white)' : 'var(--color-text)',
        border: `1px solid ${isSelected ? 'var(--color-terracotta)' : 'var(--color-sand)'}`,
        fontFamily: 'var(--font-sans)',
        fontSize: '0.625rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.25,0.1,0.1,1)',
      }}
    >
      {isSelected ? 'Selected' : 'Add to Selection'}
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Composition 1: LEFT DOMINANT
// Large image left (cols 1–7), text overlaps from right (cols 7–13).
// GSAP scrub parallax on the image inner div.
// ---------------------------------------------------------------------------

function SpreadLeftDominant({ product }: { product: Product }) {
  const prefersReduced = usePrefersReducedMotion()
  const imageRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReduced || !imageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      )
    }, wrapperRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2rem',
        alignItems: 'start',
        padding: 'clamp(4rem, 8vw, 10rem) 0',
        position: 'relative',
      }}
    >
      {/* Large image — columns 1–7 */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        style={{
          gridColumn: '1 / 8',
          gridRow: '1',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
        }}
      >
        <div
          ref={imageRef}
          style={{
            aspectRatio: '4/5',
            background: `linear-gradient(145deg, ${product.gradientFrom} 0%, ${product.gradientTo} 60%, ${product.accentColor}22 100%)`,
            position: 'relative',
          }}
        >
          {/* Subtle light bloom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            }}
          />
          {/* Material label */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
            <span className="eyebrow" style={{ color: 'rgba(249,247,243,0.8)' }}>
              {product.material}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Text panel — overlaps image from right */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        style={{
          gridColumn: '7 / 13',
          gridRow: '1',
          alignSelf: 'center',
          paddingTop: 'clamp(2rem, 4vw, 5rem)',
          paddingLeft: 'clamp(2rem, 3vw, 3rem)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          variants={fadeIn}
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '4.5rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-sand)',
              lineHeight: 1,
            }}
          >
            {product.index}
          </span>
          <hr className="hairline" style={{ flex: 1 }} />
        </motion.div>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.25rem, 4vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'var(--color-terracotta)',
            marginBottom: '2rem',
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.875rem, 1.2vw, 0.9375rem)',
            lineHeight: 1.85,
            color: 'var(--color-muted)',
            maxWidth: '46ch',
            marginBottom: '2rem',
          }}
        >
          {product.description}
        </motion.p>

        <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
          <hr className="hairline" style={{ marginBottom: '1.25rem', opacity: 0.5 }} />
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Origin', value: product.origin },
              { label: 'Edition', value: product.edition },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
              >
                <span className="eyebrow">{item.label}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{
            display: 'flex',
            gap: '0.625rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {product.swatches.map((s) => (
            <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <SelectButton product={product} />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composition 2: FULL BLEED
// Full-width 16:7 image banner, text card floats up from bottom-right.
// ---------------------------------------------------------------------------

function SpreadFullBleed({ product }: { product: Product }) {
  return (
    <div style={{ padding: 'clamp(4rem, 8vw, 10rem) 0', position: 'relative' }}>
      {/* Full-width image banner */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        style={{
          width: '100%',
          aspectRatio: '16/7',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(120deg, ${product.gradientFrom} 0%, ${product.gradientTo} 40%, #9A8A72 70%, ${product.accentColor}33 100%)`,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(ellipse at 70% 40%, rgba(255,255,255,0.08) 0%, transparent 55%)`,
            }}
          />
        </div>
      </motion.div>

      {/* Text card — overlaps up from bottom-right */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          position: 'relative',
          marginTop: 'clamp(-10rem, -8vw, -4rem)',
          marginLeft: 'auto',
          maxWidth: '480px',
          marginRight: 'clamp(1.5rem, 5vw, 6rem)',
          backgroundColor: 'var(--color-bg)',
          padding: 'clamp(2rem, 3.5vw, 3.5rem)',
          zIndex: 2,
          boxShadow: '0 2px 40px rgba(44,36,33,0.06)',
        }}
      >
        <motion.div
          variants={fadeIn}
          style={{
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span className="eyebrow">{product.index}</span>
          <hr className="hairline" style={{ flex: 1 }} />
        </motion.div>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--color-terracotta)',
            marginBottom: '1.5rem',
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            lineHeight: 1.85,
            color: 'var(--color-muted)',
            marginBottom: '1.75rem',
          }}
        >
          {product.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
        >
          {product.swatches.map((s) => (
            <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="eyebrow">{product.edition}</span>
            <span className="eyebrow" style={{ color: 'var(--color-text)' }}>
              {product.origin}
            </span>
          </div>
          <SelectButton product={product} />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composition 3: SPLIT VERTICAL
// Two image strips left (cols 1–3 narrow, 4–8 wide), text right (cols 9–12).
// ---------------------------------------------------------------------------

function SpreadSplitVertical({ product }: { product: Product }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2rem',
        padding: 'clamp(4rem, 8vw, 10rem) 0',
        alignItems: 'stretch',
      }}
    >
      {/* Narrow image strip */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        style={{
          gridColumn: '1 / 4',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
          minHeight: '500px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-8% 0',
            background: `linear-gradient(175deg, ${product.gradientFrom} 0%, ${product.gradientTo} 100%)`,
          }}
        />
      </motion.div>

      {/* Wide image */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        transition={{ delay: 0.15 }}
        style={{
          gridColumn: '4 / 9',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            background: `linear-gradient(135deg, ${product.gradientTo} 0%, ${product.gradientFrom}88 60%, rgba(92,107,69,0.9) 100%)`,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            }}
          />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
            <span className="eyebrow" style={{ color: 'rgba(249,247,243,0.75)' }}>
              {product.materialNote}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Text — offset from top */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          gridColumn: '9 / 13',
          paddingTop: 'clamp(3rem, 6vw, 8rem)',
        }}
      >
        <motion.div variants={fadeIn} style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '5rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-sand)',
              lineHeight: 1,
              display: 'block',
            }}
          >
            {product.index}
          </span>
        </motion.div>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 3vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--color-terracotta)',
            marginBottom: '1.5rem',
            fontSize: '0.9375rem',
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            lineHeight: 1.85,
            color: 'var(--color-muted)',
            marginBottom: '2rem',
          }}
        >
          {product.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}
        >
          {product.swatches.map((s) => (
            <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="eyebrow">{product.edition}</span>
            <span className="eyebrow" style={{ color: 'var(--color-text)' }}>
              {product.origin}
            </span>
          </div>
          <SelectButton product={product} />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composition 4: FLOATING
// Text left (cols 1–4), large circular object center (cols 5–9),
// metadata column right (cols 10–12).
// ---------------------------------------------------------------------------

function SpreadFloating({ product }: { product: Product }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2rem',
        padding: 'clamp(4rem, 8vw, 10rem) 0',
        alignItems: 'center',
      }}
    >
      {/* Left text */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        style={{ gridColumn: '1 / 5' }}
      >
        <motion.span
          variants={fadeIn}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '6rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-sand)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          {product.index}
        </motion.span>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--color-terracotta)',
            marginBottom: '1.5rem',
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            lineHeight: 1.85,
            color: 'var(--color-muted)',
            marginBottom: '2rem',
          }}
        >
          {product.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
        >
          {product.swatches.map((s) => (
            <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <SelectButton product={product} />
        </motion.div>
      </motion.div>

      {/* Floating circular object — centered with negative space */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.1, 1] }}
        style={{
          gridColumn: '5 / 10',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 'clamp(200px, 28vw, 420px)',
            height: 'clamp(200px, 28vw, 420px)',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${product.gradientFrom}, ${product.gradientTo}, ${product.accentColor}44)`,
            position: 'relative',
            boxShadow: `0 20px 60px ${product.gradientTo}44`,
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              position: 'absolute',
              inset: '15%',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          {/* Material note caption */}
          <div style={{ position: 'absolute', bottom: '-2rem', right: '-1rem' }}>
            <span className="eyebrow">{product.materialNote}</span>
          </div>
        </div>
      </motion.div>

      {/* Right metadata column */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          gridColumn: '10 / 13',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {[
          { label: 'Material', value: product.material },
          { label: 'Origin', value: product.origin },
          { label: 'Year', value: product.year },
          { label: 'Edition', value: product.edition },
        ].map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
          >
            <span className="eyebrow">{item.label}</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--color-text)',
                lineHeight: 1.4,
              }}
            >
              {item.value}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composition router
// ---------------------------------------------------------------------------

function ProductSpreadByComposition({ product }: { product: Product }) {
  switch (product.composition) {
    case 'left-dominant':
      return <SpreadLeftDominant product={product} />
    case 'full-bleed':
      return <SpreadFullBleed product={product} />
    case 'split-vertical':
      return <SpreadSplitVertical product={product} />
    case 'floating':
      return <SpreadFloating product={product} />
  }
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export function ProductSpreads() {
  return (
    <div>
      {products.map((product, i) => (
        <div key={product.id}>
          <div className="editorial-container">
            <ProductSpreadByComposition product={product} />
          </div>
          {i < products.length - 1 && (
            <div className="editorial-container">
              <hr className="hairline" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
