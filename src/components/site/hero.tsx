"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/motion";
import Image from "next/image";

export function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: "640px",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Background image — right half, fades out to left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=80&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Strong left-to-right fade so text stays readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, var(--color-bg) 0%, var(--color-bg) 38%, rgba(249,247,243,0.82) 58%, rgba(249,247,243,0.25) 100%)",
          }}
        />
        {/* Bottom fade for metadata strip */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 55%, rgba(249,247,243,0.95) 100%)",
          }}
        />
      </div>

      {/* Decorative ring — subtle, top-right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "clamp(160px, 22vw, 360px)",
          height: "clamp(160px, 22vw, 360px)",
          borderRadius: "50%",
          border: "1px solid rgba(212,197,176,0.4)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Top metadata strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          position: "absolute",
          top: "72px",
          left: 0,
          right: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 6rem)",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <span className="eyebrow">Atelier No. 001</span>
          <span className="eyebrow">Alentejo, Portugal</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.4rem",
          }}
        >
          <span className="eyebrow">Collection 2024</span>
          <span className="eyebrow">Organic Luxury</span>
        </div>
      </motion.div>

      {/* Main heading block */}
      <motion.div
        style={{
          y: prefersReduced ? "0%" : headingY,
          opacity,
          position: "relative",
          zIndex: 2,
          paddingBottom: "clamp(5rem, 10vw, 9rem)",
        }}
        className="editorial-container"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeIn}
            style={{ marginBottom: "clamp(1rem, 2vw, 1.75rem)" }}
          >
            <span
              className="eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "2rem",
                  height: "1px",
                  backgroundColor: "var(--color-muted)",
                }}
              />
              Organic Luxury Atelier
            </span>
          </motion.div>

          {/* Giant heading */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3.25rem, 10vw, 11.5rem)",
              fontWeight: 400,
              lineHeight: 0.93,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              fontStyle: "italic",
            }}
          >
            <motion.span variants={fadeUp} style={{ display: "block" }}>
              Objects
            </motion.span>
            <motion.span
              variants={fadeUp}
              style={{
                display: "block",
                paddingLeft: "clamp(1.5rem, 7vw, 10rem)",
                color: "var(--color-terracotta)",
              }}
            >
              shaped
            </motion.span>
            <motion.span
              variants={fadeUp}
              style={{ display: "block", fontStyle: "normal", fontWeight: 400 }}
            >
              by salt air.
            </motion.span>
          </h1>

          {/* Sub copy */}
          <motion.p
            variants={fadeUp}
            style={{
              marginTop: "clamp(1.75rem, 3.5vw, 3.5rem)",
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.875rem, 1.15vw, 1rem)",
              lineHeight: 1.85,
              color: "var(--color-muted)",
              maxWidth: "40ch",
              marginLeft: "clamp(1.5rem, 7vw, 10rem)",
            }}
          >
            Softened edges, quiet intelligence of material.
            <br />A coastal atelier composing objects for rooms that breathe.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom metadata bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 3vw, 3rem)",
          left: 0,
          right: 0,
          zIndex: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 clamp(1.5rem, 5vw, 6rem)",
        }}
      >
        {/* Scroll cue */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div
            style={{
              width: "1px",
              height: "2.5rem",
              backgroundColor: "var(--color-sand)",
            }}
          />
          <span
            className="eyebrow"
            style={{ writingMode: "vertical-rl", letterSpacing: "0.25em" }}
          >
            Scroll to Enter
          </span>
        </div>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "clamp(1.25rem, 3vw, 3rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            <span className="eyebrow">Est. 2024</span>
            <span
              className="eyebrow"
              style={{ color: "var(--color-terracotta)" }}
            >
              4 Pieces
            </span>
          </div>
          {/* Animated dot */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "1.75rem",
                backgroundColor: "var(--color-muted)",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "var(--color-terracotta)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
