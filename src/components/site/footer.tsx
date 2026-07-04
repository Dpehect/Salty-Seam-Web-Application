"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-text)",
        color: "var(--color-warm-white)",
        paddingTop: "clamp(4rem, 6vw, 7rem)",
        paddingBottom: "clamp(2rem, 3vw, 3rem)",
      }}
    >
      <div className="editorial-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
        >
          {/* Top row */}
          <motion.div
            variants={fadeIn}
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "clamp(1.5rem, 2.5vw, 2.5rem)",
              paddingBottom: "clamp(3rem, 5vw, 5rem)",
              borderBottom: "1px solid rgba(212,197,176,0.15)",
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            {/* Brand */}
            <div style={{ gridColumn: "1 / 5" }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 4vw, 4.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-warm-white)",
                  marginBottom: "1.5rem",
                }}
              >
                Seam Salty
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  lineHeight: 1.75,
                  color: "rgba(244,241,236,0.55)",
                  maxWidth: "32ch",
                }}
              >
                A coastal atelier composing organic luxury objects for refined
                interiors.
              </p>
            </div>

            {/* Navigation */}
            <div style={{ gridColumn: "6 / 9" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(244,241,236,0.4)",
                  display: "block",
                  marginBottom: "1.25rem",
                }}
              >
                Navigate
              </span>
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {["Atelier", "Collection", "Showroom", "Material Lab"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8125rem",
                        color: "rgba(244,241,236,0.65)",
                        textDecoration: "none",
                        transition: "color 0.25s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          "var(--color-warm-white)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(244,241,236,0.65)")
                      }
                    >
                      {item}
                    </a>
                  ),
                )}
              </nav>
            </div>

            {/* Collection */}
            <div style={{ gridColumn: "9 / 12" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(244,241,236,0.4)",
                  display: "block",
                  marginBottom: "1.25rem",
                }}
              >
                Collection
              </span>
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  "Aura Bouclé",
                  "Travertine Console",
                  "Oasis Ottoman",
                  "Tide Vessel",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.8125rem",
                      color: "rgba(244,241,236,0.65)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Bottom row */}
          <motion.div
            variants={fadeIn}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.625rem",
                letterSpacing: "0.12em",
                color: "rgba(244,241,236,0.35)",
              }}
            >
              © {year} Seam Salty. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(244,241,236,0.35)",
                    textDecoration: "none",
                    transition: "color 0.25s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(244,241,236,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(244,241,236,0.35)")
                  }
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
