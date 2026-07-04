'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { materialLabSchema, type MaterialLabFormValues } from '@/lib/validators'
import { useSelectionStore } from '@/store/use-selection-store'
import { fadeUp, staggerContainer } from '@/lib/motion'

const PROJECT_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'retail', label: 'Retail' },
  { value: 'installation', label: 'Installation' },
  { value: 'other', label: 'Other' },
]

const MATERIAL_DIRECTIONS = [
  'Bouclé & Soft Textiles',
  'Stone & Mineral',
  'Ceramic & Clay',
  'Natural Timber',
  'Mixed Materials',
  'Open to Direction',
]

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

function Field({ label, error, children, required }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <label style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.625rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: error ? 'var(--color-terracotta)' : 'var(--color-muted)',
        display: 'flex',
        gap: '0.25rem',
      }}>
        {label}
        {required && <span style={{ color: 'var(--color-terracotta)' }}>*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'var(--color-terracotta)',
            }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  backgroundColor: 'transparent',
  border: '1px solid var(--color-sand)',
  borderRadius: 0,
  fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem',
  color: 'var(--color-text)',
  outline: 'none',
  transition: 'border-color 0.25s ease',
  appearance: 'none',
}

const inputFocusStyle: React.CSSProperties = {
  borderColor: 'var(--color-terracotta)',
}

function Input({ onFocus, onBlur, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={(e) => { setFocused(true); onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); onBlur?.(e) }}
    />
  )
}

function Textarea({ onFocus, onBlur, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: 'vertical', minHeight: '120px', ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={(e) => { setFocused(true); onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); onBlur?.(e) }}
    />
  )
}

export function MaterialLabForm() {
  const [submitted, setSubmitted] = useState(false)
  const selected = useSelectionStore((s) => s.selected)
  const selectedProducts = Array.from(selected).join(', ')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MaterialLabFormValues>({
    resolver: zodResolver(materialLabSchema),
    defaultValues: {
      selectedProduct: selectedProducts || undefined,
    },
  })

  async function onSubmit(data: MaterialLabFormValues) {
    await new Promise((r) => setTimeout(r, 900))
    console.log('Material Lab inquiry:', data)
    setSubmitted(true)
    reset()
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.1, 1] }}
        style={{
          padding: 'clamp(3rem, 5vw, 5rem)',
          backgroundColor: 'var(--color-cream)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1.5px solid var(--color-terracotta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 7L6.5 12.5L17 1" stroke="#B85C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--color-text)',
        }}>
          Inquiry Received
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '42ch' }}>
          Thank you. A member of the atelier will be in touch within two working days to discuss your project and material direction.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6875rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-terracotta)',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Submit another inquiry
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(1.25rem, 2vw, 2rem)',
        }}
      >
        {/* Name */}
        <motion.div variants={fadeUp} style={{ gridColumn: '1 / 2' }}>
          <Field label="Name" error={errors.name?.message} required>
            <Input
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              {...register('name')}
            />
          </Field>
        </motion.div>

        {/* Email */}
        <motion.div variants={fadeUp} style={{ gridColumn: '2 / 3' }}>
          <Field label="Email" error={errors.email?.message} required>
            <Input
              type="email"
              autoComplete="email"
              placeholder="studio@example.com"
              {...register('email')}
            />
          </Field>
        </motion.div>

        {/* Project Type */}
        <motion.div variants={fadeUp} style={{ gridColumn: '1 / 2' }}>
          <Field label="Project Type" error={errors.projectType?.message} required>
            <div style={{ position: 'relative' }}>
              <select
                {...register('projectType')}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--color-muted)',
                fontSize: '0.625rem',
              }}>↓</span>
            </div>
          </Field>
        </motion.div>

        {/* Material Direction */}
        <motion.div variants={fadeUp} style={{ gridColumn: '2 / 3' }}>
          <Field label="Material Direction" error={errors.materialDirection?.message}>
            <div style={{ position: 'relative' }}>
              <select
                {...register('materialDirection')}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">No preference</option>
                {MATERIAL_DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-muted)', fontSize: '0.625rem' }}>↓</span>
            </div>
          </Field>
        </motion.div>

        {/* Selected Products */}
        {selectedProducts && (
          <motion.div variants={fadeUp} style={{ gridColumn: '1 / 3' }}>
            <Field label="Selected Pieces">
              <Input
                type="text"
                value={selectedProducts}
                readOnly
                style={{ color: 'var(--color-terracotta)', cursor: 'default' }}
                {...register('selectedProduct')}
              />
            </Field>
          </motion.div>
        )}

        {/* Message */}
        <motion.div variants={fadeUp} style={{ gridColumn: '1 / 3' }}>
          <Field label="Your Project" error={errors.message?.message} required>
            <Textarea
              placeholder="Describe your space, project scale, and what you're hoping to achieve..."
              rows={5}
              {...register('message')}
            />
          </Field>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp} style={{ gridColumn: '1 / 3', display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ opacity: isSubmitting ? 0.6 : 1, transition: 'opacity 0.3s ease, background 0.3s ease, color 0.3s ease' }}
          >
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
            {!isSubmitting && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5H11M7 1L11 5L7 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </motion.div>
      </motion.div>
    </form>
  )
}
