"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
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
        { y: 30 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: pullQuoteRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
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
          viewport={{ once: true, margin: "-10%" }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "flex-start",
            gap: "2rem",
            marginBottom: "clamp(4rem, 8vw, 9rem)",
          }}
        >
          <motion.div
            variants={fadeIn}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(4rem, 8vw, 8rem)",
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
                gap: "0.25rem",
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

          <motion.div
            variants={fadeIn}
            style={{
              alignSelf: "flex-end",
              paddingBottom: "0.5rem",
            }}
          >
            <hr
              className="hairline"
              style={{ width: "clamp(4rem, 12vw, 14rem)" }}
            />
          </motion.div>
        </motion.div>

        {/* Asymmetric body layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Left column: abstract material panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 1.3, ease: [0.25, 0.1, 0.1, 1] }}
            style={{
              gridColumn: "1 / 5",
              gridRow: "1 / 3",
              aspectRatio: "3/4",
              borderRadius: "2px",
              background:
                "linear-gradient(160deg, #D4C5A9 0%, #B8A882 35%, #C4956A 70%, #8C7058 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Texture overlay lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${(i + 1) * 11}%`,
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1.5rem",
                right: "1.5rem",
              }}
            >
              <span
                className="eyebrow"
                style={{ color: "rgba(249,247,243,0.7)" }}
              >
                Material Archive
              </span>
            </div>
          </motion.div>

          {/* Main body text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8%" }}
            style={{
              gridColumn: "5 / 11",
              paddingTop: "clamp(3rem, 6vw, 8rem)",
            }}
          >
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.75rem)",
                fontWeight: 400,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "var(--color-text)",
                marginBottom: "clamp(2rem, 3vw, 3.5rem)",
                maxWidth: "16ch",
              }}
            >
              Between softness and structure.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)",
                lineHeight: 1.9,
                color: "var(--color-muted)",
                maxWidth: "52ch",
                marginBottom: "1.75rem",
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
                fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)",
                lineHeight: 1.9,
                color: "var(--color-muted)",
                maxWidth: "52ch",
                marginBottom: "2.5rem",
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
                style={{ marginBottom: "1.5rem", opacity: 0.5 }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "clamp(2rem, 4vw, 4rem)",
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
                      gap: "0.35rem",
                    }}
                  >
                    <span className="eyebrow">{item.label}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.125rem",
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

          {/* Pull quote — floats with GSAP parallax */}
          <div
            style={{
              gridColumn: "8 / 13",
              marginTop: "clamp(4rem, 6vw, 6rem)",
            }}
          >
            <blockquote
              ref={pullQuoteRef}
              style={{
                borderLeft: "2px solid var(--color-terracotta)",
                paddingLeft: "clamp(1.25rem, 2vw, 2rem)",
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.125rem, 2vw, 1.625rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "var(--color-text)",
                  marginBottom: "1rem",
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
    </section>
  );
}
