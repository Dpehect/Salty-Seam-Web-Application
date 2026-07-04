"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";
import { MaterialLabForm } from "@/components/forms/material-lab-form";

export function MaterialLab() {
  return (
    <section
      id="material-lab"
      style={{
        position: "relative",
        backgroundColor: "var(--color-cream)",
        paddingTop: "var(--spacing-section)",
        paddingBottom: "var(--spacing-section)",
        overflow: "hidden",
      }}
    >
      {/* Background texture lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${15 + i * 14}%`,
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "var(--color-sand)",
            }}
          />
        ))}
      </div>

      <div
        className="editorial-container"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "2rem",
            marginBottom: "clamp(4rem, 7vw, 8rem)",
            alignItems: "end",
          }}
        >
          <motion.div variants={fadeIn} style={{ gridColumn: "1 / 3" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--color-sand)",
                lineHeight: 1,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              04
            </span>
            <span className="eyebrow">Chapter Four</span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ gridColumn: "3 / 10" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: "var(--color-text)",
              }}
            >
              Material
              <br />
              <span
                style={{ fontStyle: "italic", color: "var(--color-forest)" }}
              >
                Lab
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeIn}
            style={{ gridColumn: "10 / 13", alignSelf: "end" }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                lineHeight: 1.75,
                color: "var(--color-muted)",
              }}
            >
              Begin a conversation about your project, your space, and the
              materials that might inhabit it.
            </p>
          </motion.div>
        </motion.div>

        {/* Two-column layout: editorial copy + form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "clamp(2rem, 4vw, 5rem)",
            alignItems: "start",
          }}
        >
          {/* Left: editorial copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ gridColumn: "1 / 5" }}
          >
            <motion.hr
              variants={fadeIn}
              className="hairline"
              style={{ marginBottom: "2rem" }}
            />

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.125rem, 2vw, 1.4375rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.55,
                color: "var(--color-text)",
                marginBottom: "2rem",
              }}
            >
              &ldquo;The Material Lab is where objects are matched to
              intention.&rdquo;
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                lineHeight: 1.85,
                color: "var(--color-muted)",
                marginBottom: "2rem",
              }}
            >
              Every project begins with a material conversation. Tell us about
              your space — its character, its light, its pace — and we will
              suggest combinations that belong there, not just fit there.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                lineHeight: 1.85,
                color: "var(--color-muted)",
                marginBottom: "2.5rem",
              }}
            >
              Response within two working days. All inquiries are treated with
              discretion and care.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                { label: "Studio", value: "Alentejo, Portugal" },
                { label: "Response", value: "2 Working Days" },
                { label: "Consultation", value: "Complimentary" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--color-sand)",
                  }}
                >
                  <span className="eyebrow">{item.label}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: [0.25, 0.1, 0.1, 1],
              delay: 0.2,
            }}
            style={{ gridColumn: "5 / 13" }}
          >
            <MaterialLabForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
