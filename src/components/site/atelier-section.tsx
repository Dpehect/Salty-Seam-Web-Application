"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AtelierSection() {
  const prefersReduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pullQuoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    if (prefersReduced || !pullQuoteRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pullQuoteRef.current,
        { y: 24 },
        {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: pullQuoteRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="atelier"
      ref={sectionRef}
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        paddingTop: "var(--spacing-section)",
        paddingBottom: "var(--spacing-section)",
        overflow: "hidden",
      }}
    >
      <div className="editorial-container">
        {/* Chapter label row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "clamp(3rem, 6vw, 7rem)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <motion.div
            variants={fadeIn}
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3.5rem, 7vw, 7rem)",
                fontWeight: 400,
                lineHeight: 1,
                color: "var(--color-sand)",
                fontStyle: "italic",
                userSelect: "none",
              }}
            >
              01
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              <span className="eyebrow">Chapter One</span>
              <span
                className="eyebrow"
                style={{ color: "var(--color-terracotta)" }}
              >
                The Atelier
              </span>
            </div>
          </motion.div>
          <motion.div variants={fadeIn}>
            <hr
              className="hairline"
              style={{ width: "clamp(3rem, 10vw, 12rem)" }}
            />
          </motion.div>
        </motion.div>

        {/* Main asymmetric layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "clamp(1.5rem, 2.5vw, 2.5rem)",
            alignItems: "start",
          }}
        >
          {/* Left: Real image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 1.3, ease: [0.25, 0.1, 0.1, 1] }}
            style={{
              gridColumn: "1 / 5",
              gridRow: "1 / 3",
              position: "relative",
              aspectRatio: "3/4",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=85&fit=crop"
              alt="Atelier — hands shaping organic textile material"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(44,36,33,0.35) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.25rem",
              }}
            >
              <span
                className="eyebrow"
                style={{ color: "rgba(244,241,236,0.8)" }}
              >
                Material Archive
              </span>
            </div>
          </motion.div>

          {/* Center: Body text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8%" }}
            style={{
              gridColumn: "5 / 10",
              paddingTop: "clamp(1.5rem, 4vw, 5rem)",
            }}
          >
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.875rem, 3.5vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "var(--color-text)",
                marginBottom: "clamp(1.5rem, 2.5vw, 3rem)",
                maxWidth: "16ch",
              }}
            >
              Between softness and structure.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.9rem, 1.25vw, 1.0625rem)",
                lineHeight: 1.9,
                color: "var(--color-muted)",
                marginBottom: "1.5rem",
              }}
            >
              Seam Salty works between softness and structure — where coastal
              restraint meets sculptural comfort. Each object is composed as a
              quiet interruption: tactile, grounded, and shaped for rooms that
              breathe.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.9rem, 1.25vw, 1.0625rem)",
                lineHeight: 1.9,
                color: "var(--color-muted)",
                marginBottom: "2.25rem",
              }}
            >
              The atelier is located in the interior of Alentejo, Portugal,
              where light arrives slowly and the pace of making is set by
              material rather than deadline. Every piece begins as a study in
              restraint — what can be removed, what insists on staying.
            </motion.p>

            <motion.div variants={fadeUp}>
              <hr
                className="hairline"
                style={{ marginBottom: "1.25rem", opacity: 0.5 }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "clamp(1.5rem, 3vw, 3.5rem)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Founded", value: "2024" },
                  { label: "Origin", value: "Alentejo, PT" },
                  { label: "Pieces", value: "4 Objects" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                    }}
                  >
                    <span className="eyebrow">{item.label}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.0625rem",
                        fontWeight: 400,
                        fontStyle: "italic",
                        color: "var(--color-text)",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Pull quote */}
          <div
            style={{
              gridColumn: "10 / 13",
              paddingTop: "clamp(4rem, 8vw, 9rem)",
            }}
          >
            <blockquote
              ref={pullQuoteRef}
              style={{
                borderLeft: "2px solid var(--color-terracotta)",
                paddingLeft: "clamp(1rem, 1.5vw, 1.75rem)",
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1rem, 1.75vw, 1.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "var(--color-text)",
                  marginBottom: "0.875rem",
                }}
              >
                &ldquo;Objects composed as quiet interruptions — tactile,
                grounded, shaped for rooms that breathe.&rdquo;
              </p>
              <cite
                className="eyebrow"
                style={{
                  fontStyle: "normal",
                  color: "var(--color-terracotta)",
                }}
              >
                Seam Salty Studio, 2024
              </cite>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Responsive: on mobile the pull quote goes below */}
      <style>{`
        @media (max-width: 900px) {
          #atelier .atelier-grid {
            display: flex !important;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
