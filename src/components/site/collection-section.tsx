'use client'

import { motion } from 'framer-motion'
import { fadeUp, fadeIn, staggerContainer } from '@/lib/motion'

export function CollectionSection() {
  return (
    <section
      id="collection"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg)',
        paddingTop: 'var(--spacing-section)',
        paddingBottom: 'clamp(3rem, 5vw, 5rem)',
      }}
    >
      <div className="editorial-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
            alignItems: 'end',
          }}
        >
          {/* Chapter label */}
          <motion.div
            variants={fadeIn}
            style={{
              gridColumn: '1 / 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignSelf: 'start',
              paddingTop: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3rem, 5vw, 5rem)',
                fontWeight: 400,
                color: 'var(--color-sand)',
                fontStyle: 'italic',
                lineHeight: 1,
              }}
            >
              02
            </span>
            <span className="eyebrow">Chapter Two</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} style={{ gridColumn: '3 / 11' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 6vw, 6.5rem)',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
              }}
            >
              The
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--color-terracotta)' }}>
                Collection
              </span>
            </h2>
          </motion.div>

          {/* Right column metadata */}
          <motion.div
            variants={fadeIn}
            style={{
              gridColumn: '11 / 13',
              alignSelf: 'end',
              paddingBottom: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.4rem',
            }}
          >
            <span className="eyebrow">4 Objects</span>
            <span className="eyebrow" style={{ color: 'var(--color-terracotta)' }}>
              2024
            </span>
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.hr
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
          className="hairline"
          style={{ marginTop: 'clamp(2.5rem, 4vw, 4rem)' }}
        />
      </div>
    </section>
  )
}
