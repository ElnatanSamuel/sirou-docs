"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: ["400"] });

const NAV = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
];

export function NewHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDocsPage =
    pathname.startsWith("/docs") || pathname.startsWith("/changelog");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const headerBg = isDocsPage
    ? "#04040a"
    : scrolled
      ? "rgba(4,4,10,0.85)"
      : "transparent";
  const headerBorder =
    scrolled || isDocsPage ? "rgba(255,255,255,0.08)" : "transparent";

  return (
    <>
      <header
        className={anton.className}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: headerBg,
          backdropFilter: scrolled ? "blur(16px) saturate(1.8)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.8)" : "none",
          borderBottom: `1px solid ${headerBorder}`,
          transition:
            "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo Side */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{ position: "relative", width: "70px", height: "70px" }}
            >
              <Image
                src="/image/sirouwhite.png"
                alt="Sirou"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            {/* <span
              style={{
                color: "white",
                fontWeight: 400,
                letterSpacing: "0.02em",
                fontSize: "22px",
                textTransform: "uppercase",
              }}
            >
              Sirou
            </span> */}
          </Link>

          {/* Right Side Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <nav
              className="hidden-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
              }}
            >
              {NAV.map((link) => {
                const active =
                  pathname.startsWith(link.href) && link.href !== "#";
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "white",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      transition: "color 0.3s, opacity 0.3s",
                      textDecoration: "none",
                      opacity: active ? 1 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#826eff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "2px",
                  fontSize: "13px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "transform 0.2s, opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              style={{
                display: "none",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "8px",
                color: "white",
                cursor: "pointer",
              }}
              className="mobile-toggle"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={anton.className}
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              right: 0,
              zIndex: 49,
              background: "rgba(4,4,10,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {NAV.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  letterSpacing: "0.05em",
                }}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-white/20" />
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              onClick={() => setOpen(false)}
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 400,
                textTransform: "uppercase",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                letterSpacing: "0.05em",
              }}
            >
              GitHub
              <Github className="w-4 h-4 text-white/20" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
