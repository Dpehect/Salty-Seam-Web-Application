"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";

export function CollectionSection() {
  return (
    <section
      id="collection"
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        paddingTop: "var(--spacing-section)",
        paddingBottom: "clamp(2rem, 4vw, 4rem)",
      }}
    >
      <div className="editorial-container">
        {/* Responsive: flex-wrap so it doesn't crush on mobile */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: "clamp(1rem, 3vw, 3rem)",
            alignItems: "end",
          }}
        >
          {/* Chapter label */}
          <motion.div
            variants={fadeIn}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              alignSelf: "start",
              paddingTop: "0.5rem",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 4.5vw, 5rem)",
                fontWeight: 400,
                color: "var(--color-sand)",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              02
            </span>
            <span className="eyebrow">Chapter Two</span>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={fadeUp}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.25rem, 6vw, 6.5rem)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: "var(--color-text)",
              }}
            >
              The
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  color: "var(--color-terracotta)",
                }}
              >
                Collection
              </span>
            </h2>
          </motion.div>

          {/* Right metadata */}
          <motion.div
            variants={fadeIn}
            style={{
              alignSelf: "end",
              paddingBottom: "0.375rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.375rem",
              flexShrink: 0,
            }}
          >
            <span className="eyebrow">4 Objects</span>
            <span
              className="eyebrow"
              style={{ color: "var(--color-terracotta)" }}
            >
              2024
            </span>
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.hr
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
          className="hairline"
          style={{ marginTop: "clamp(2rem, 3.5vw, 4rem)" }}
        />
      </div>
    </section>
  );
}
