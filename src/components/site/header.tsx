"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSelectionStore } from "@/store/use-selection-store";
import { useScrollChapter } from "@/hooks/use-scroll-chapter";
import { getLenis } from "@/lib/lenis";

const NAV_ITEMS = [
  { label: "Atelier", href: "#atelier" },
  { label: "Collection", href: "#collection" },
  { label: "Showroom", href: "#showroom" },
  { label: "Material Lab", href: "#material-lab" },
];

export function Header() {
  useScrollChapter();
  const isScrolled = useSelectionStore((s) => s.isHeaderScrolled);
  const activeChapter = useSelectionStore((s) => s.activeChapter);
  const count = useSelectionStore((s) => s.count());

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    e.preventDefault();
    const lenis = getLenis();
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.6 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.1, 1], delay: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? "rgba(249,247,243,0.92)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        transition:
          "background-color 0.5s cubic-bezier(0.25,0.1,0.1,1), backdrop-filter 0.5s cubic-bezier(0.25,0.1,0.1,1)",
      }}
    >
      {/* Top hairline */}
      <div
        style={{
          height: "1px",
          backgroundColor: isScrolled
            ? "var(--color-sand)"
            : "rgba(212,197,176,0.3)",
          transition: "background-color 0.5s",
        }}
      />

      <div
        className="editorial-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.0625rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "var(--color-text)",
            textDecoration: "none",
            fontStyle: "italic",
          }}
        >
          Seam Salty
        </Link>

        {/* Nav */}
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1.5rem, 3vw, 3rem)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const chapterId = item.href.replace("#", "");
            const isActive = activeChapter === chapterId;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive
                    ? "var(--color-terracotta)"
                    : "var(--color-muted)",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  display: "none",
                }}
                className="md:block"
              >
                {item.label}
              </a>
            );
          })}

          {/* Selection count badge */}
          {count > 0 && (
            <motion.a
              href="#material-lab"
              onClick={(e) => handleNavClick(e, "#material-lab")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.625rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-terracotta)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-terracotta)",
                  color: "#F9F7F3",
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                }}
              >
                {count}
              </span>
              Selected
            </motion.a>
          )}

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
            className="md:hidden"
          >
            <span
              style={{
                display: "block",
                width: "20px",
                height: "1px",
                backgroundColor: "var(--color-text)",
              }}
            />
            <span
              style={{
                display: "block",
                width: "14px",
                height: "1px",
                backgroundColor: "var(--color-text)",
              }}
            />
          </button>
        </nav>
      </div>

      {/* Bottom hairline */}
      <div
        style={{
          height: "1px",
          backgroundColor: isScrolled ? "var(--color-sand)" : "transparent",
          transition: "background-color 0.5s",
        }}
      />
    </motion.header>
  );
}
