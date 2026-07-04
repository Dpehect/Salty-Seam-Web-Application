"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, clipReveal, staggerContainer } from "@/lib/motion";
import { useSelectionStore } from "@/store/use-selection-store";
import { products, type Product } from "@/lib/products";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ProductId } from "@/store/use-selection-store";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────────── */

function MaterialSwatch({ color, name }: { color: string; name: string }) {
  return (
    <button
      title={name}
      aria-label={name}
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        backgroundColor: color,
        border: "1.5px solid rgba(44,36,33,0.15)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "scale(1.18)";
        el.style.borderColor = "var(--color-text)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "scale(1)";
        el.style.borderColor = "rgba(44,36,33,0.15)";
      }}
    />
  );
}

function SelectButton({ product }: { product: Product }) {
  const toggle = useSelectionStore((s) => s.toggle);
  const isSelected = useSelectionStore((s) =>
    s.isSelected(product.id as ProductId),
  );

  return (
    <motion.button
      onClick={() => toggle(product.id as ProductId)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.8rem 1.625rem",
        backgroundColor: isSelected ? "var(--color-terracotta)" : "transparent",
        color: isSelected ? "var(--color-warm-white)" : "var(--color-text)",
        border: `1px solid ${isSelected ? "var(--color-terracotta)" : "var(--color-sand)"}`,
        fontFamily: "var(--font-sans)",
        fontSize: "0.625rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.25,0.1,0.1,1)",
      }}
    >
      {isSelected ? "✓ Selected" : "Add to Selection"}
    </motion.button>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <span className="eyebrow">{label}</span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.8125rem",
          color: "var(--color-text)",
          lineHeight: 1.4,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Composition 1: LEFT DOMINANT
   Large 4:5 image left, text panel right, overlapping by ~1 column
───────────────────────────────────────────── */
function SpreadLeftDominant({ product }: { product: Product }) {
  const prefersReduced = usePrefersReducedMotion();
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced || !imageWrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageWrapRef.current!.querySelector(".parallax-inner"),
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "clamp(1rem, 2vw, 2rem)",
        alignItems: "center",
        paddingTop: "clamp(3.5rem, 7vw, 9rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 9rem)",
        position: "relative",
      }}
    >
      {/* Image — cols 1–7 */}
      <motion.div
        ref={imageWrapRef}
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        style={{
          gridColumn: "1 / 8",
          gridRow: "1",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          aspectRatio: "4/5",
        }}
      >
        <div
          className="parallax-inner"
          style={{ position: "absolute", inset: "-8% 0", height: "116%" }}
        >
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 50%, rgba(44,36,33,0.25) 100%)",
          }}
        />
        <div
          style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}
        >
          <span className="eyebrow" style={{ color: "rgba(244,241,236,0.85)" }}>
            {product.material}
          </span>
        </div>
      </motion.div>

      {/* Text panel — cols 7–13, sits on top of image's right edge */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        style={{
          gridColumn: "7 / 13",
          gridRow: "1",
          alignSelf: "center",
          position: "relative",
          zIndex: 2,
          backgroundColor: "var(--color-bg)",
          padding: "clamp(2rem, 3.5vw, 3.5rem)",
          boxShadow: "0 4px 48px rgba(44,36,33,0.07)",
        }}
      >
        <motion.div
          variants={fadeIn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.375rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3.5rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--color-sand)",
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
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.875rem, 3.5vw, 3.75rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
            marginBottom: "0.625rem",
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.9375rem",
            fontStyle: "italic",
            color: "var(--color-terracotta)",
            marginBottom: "1.5rem",
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.875rem, 1.1vw, 0.9375rem)",
            lineHeight: 1.85,
            color: "var(--color-muted)",
            marginBottom: "1.75rem",
          }}
        >
          {product.description}
        </motion.p>

        <motion.div variants={fadeUp} style={{ marginBottom: "1.75rem" }}>
          <hr
            className="hairline"
            style={{ marginBottom: "1rem", opacity: 0.5 }}
          />
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <MetaRow label="Origin" value={product.origin} />
            <MetaRow label="Edition" value={product.edition} />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
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
  );
}

/* ─────────────────────────────────────────────
   Composition 2: FULL BLEED
   16:9 image full width, info card overlaps from bottom-right
───────────────────────────────────────────── */
function SpreadFullBleed({ product }: { product: Product }) {
  return (
    <div
      style={{
        paddingTop: "clamp(3.5rem, 7vw, 9rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 9rem)",
      }}
    >
      {/* Full-width image */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        style={{
          width: "100%",
          aspectRatio: "16 / 7",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(44,36,33,0.15) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Info card — negative margin pulls it up over image */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 clamp(1.5rem, 5vw, 6rem)",
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            marginTop: "-clamp(4rem, 7vw, 8rem)",
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "var(--color-bg)",
            padding: "clamp(2rem, 3vw, 3.25rem)",
            position: "relative",
            zIndex: 2,
            boxShadow: "0 4px 48px rgba(44,36,33,0.08)",
          }}
        >
          <motion.div
            variants={fadeIn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <span className="eyebrow">{product.index}</span>
            <hr className="hairline" style={{ flex: 1 }} />
          </motion.div>

          <motion.h3
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.75rem, 3vw, 3.25rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              marginBottom: "0.625rem",
            }}
          >
            {product.name}
          </motion.h3>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--color-terracotta)",
              marginBottom: "1.25rem",
              fontSize: "0.9375rem",
            }}
          >
            {product.tagline}
          </motion.p>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              lineHeight: 1.85,
              color: "var(--color-muted)",
              marginBottom: "1.5rem",
            }}
          >
            {product.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {product.swatches.map((s) => (
              <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <MetaRow label="Edition" value={product.edition} />
              <MetaRow label="Origin" value={product.origin} />
            </div>
            <SelectButton product={product} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Composition 3: SPLIT VERTICAL
   Narrow image strip + wide image, text right
───────────────────────────────────────────── */
function SpreadSplitVertical({ product }: { product: Product }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "clamp(1rem, 2vw, 2rem)",
        alignItems: "stretch",
        paddingTop: "clamp(3.5rem, 7vw, 9rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 9rem)",
      }}
    >
      {/* Narrow accent strip — col 1–3 */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        style={{
          gridColumn: "1 / 4",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          minHeight: "480px",
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="25vw"
          style={{ objectFit: "cover", objectPosition: "left center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(44,36,33,0.12)",
          }}
        />
      </motion.div>

      {/* Wide main image — col 4–8 */}
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        transition={{ delay: 0.12 }}
        style={{
          gridColumn: "4 / 9",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          minHeight: "480px",
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="42vw"
          style={{ objectFit: "cover", objectPosition: "right center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 55%, rgba(44,36,33,0.3) 100%)",
          }}
        />
        <div
          style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}
        >
          <span className="eyebrow" style={{ color: "rgba(244,241,236,0.82)" }}>
            {product.materialNote}
          </span>
        </div>
      </motion.div>

      {/* Text — col 9–13 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          gridColumn: "9 / 13",
          paddingTop: "clamp(2rem, 5vw, 7rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <motion.span
          variants={fadeIn}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "4.5rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--color-sand)",
            lineHeight: 1,
            display: "block",
            marginBottom: "1rem",
          }}
        >
          {product.index}
        </motion.span>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.75rem, 2.8vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
            marginBottom: "0.625rem",
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: "var(--color-terracotta)",
            marginBottom: "1.375rem",
            fontSize: "0.9375rem",
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            lineHeight: 1.85,
            color: "var(--color-muted)",
            marginBottom: "1.75rem",
          }}
        >
          {product.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
          }}
        >
          {product.swatches.map((s) => (
            <MaterialSwatch key={s.name} color={s.hex} name={s.name} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <MetaRow label="Edition" value={product.edition} />
            <MetaRow label="Origin" value={product.origin} />
          </div>
          <SelectButton product={product} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Composition 4: FLOATING
   Square image centered, text left, meta right
───────────────────────────────────────────── */
function SpreadFloating({ product }: { product: Product }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "clamp(1rem, 2vw, 2rem)",
        alignItems: "center",
        paddingTop: "clamp(3.5rem, 7vw, 9rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 9rem)",
      }}
    >
      {/* Text — col 1–4 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        style={{ gridColumn: "1 / 5" }}
      >
        <motion.span
          variants={fadeIn}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "5rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--color-sand)",
            lineHeight: 1,
            display: "block",
            marginBottom: "1rem",
          }}
        >
          {product.index}
        </motion.span>

        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.75rem, 3vw, 3.25rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
            marginBottom: "0.625rem",
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: "var(--color-terracotta)",
            marginBottom: "1.375rem",
            fontSize: "0.9375rem",
          }}
        >
          {product.tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            lineHeight: 1.85,
            color: "var(--color-muted)",
            marginBottom: "1.75rem",
          }}
        >
          {product.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
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

      {/* Image — col 5–9, square with floating feel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.1, 1] }}
        style={{
          gridColumn: "5 / 10",
          position: "relative",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(44,36,33,0.12)",
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="40vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 60% 40%, transparent 40%, rgba(44,36,33,0.15) 100%)",
          }}
        />
      </motion.div>

      {/* Right metadata column — col 10–13 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          gridColumn: "10 / 13",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        {[
          { label: "Material", value: product.material },
          { label: "Origin", value: product.origin },
          { label: "Year", value: product.year },
          { label: "Edition", value: product.edition },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <MetaRow label={item.label} value={item.value} />
          </motion.div>
        ))}
        <motion.div variants={fadeUp}>
          <hr className="hairline" style={{ marginBottom: "0.75rem" }} />
          <span className="eyebrow">{product.materialNote}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Router + page-level export
───────────────────────────────────────────── */
function ProductSpreadByComposition({ product }: { product: Product }) {
  switch (product.composition) {
    case "left-dominant":
      return <SpreadLeftDominant product={product} />;
    case "full-bleed":
      return <SpreadFullBleed product={product} />;
    case "split-vertical":
      return <SpreadSplitVertical product={product} />;
    case "floating":
      return <SpreadFloating product={product} />;
  }
}

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
  );
}
