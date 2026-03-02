"use client";

import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import FloatingLines from "@/components/ui/floating-lines";

// ─── Code Block ───────────────────────────────────────────────────────────────
const CODE = `import { defineRoutes } from "@sirou/core";

export const routes = defineRoutes({
  home:      { path: "/" },
  dashboard: { path: "/dashboard" },
  admin: {
    path:   "/admin/:section",
    guards: [isAdmin],
  },
  profile: {
    path:   "/user/:id",
    params: { id: z.uuid() },
  },
});

router.go("profile", { id: user.id });`;

function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, []);

  return (
    <div className="relative w-full text-left">
      <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-[60px] pointer-events-none" />
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black">
          <div className="flex gap-2.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-full opacity-80 shadow-inner"
                style={{ background: c }}
              />
            ))}
          </div>
          <span className="text-[11px] text-white/80 font-mono tracking-[0.2em] pr-10 uppercase">
            router.ts
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(CODE);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-white hover:text-white/60 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="p-8 overflow-x-auto bg-black flex justify-start">
          <pre
            className="font-mono m-0 w-full text-left"
            style={{ background: "transparent" }}
          >
            <code
              ref={codeRef}
              className="language-typescript"
              style={{ fontSize: "14px", lineHeight: "1.7", textAlign: "left" }}
            >
              {CODE}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function NewHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#04040a]"
    >
      {/* ═══ BACKGROUND ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 opacity-[0.55]">
        <FloatingLines
          linesGradient={["#ffffff", "#826eff", "#ffffff"]}
          lineCount={2}
          animationSpeed={0.4}
          parallax={false}
          interactive={false}
        />
      </div>

      {/* Hero Fade Mask - Smooth transition to next section */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#000] via-[#04040a]/90 to-transparent z-[2]" />

      {/* ═══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full flex flex-col items-center text-center px-6 pt-36 pb-12 max-w-7xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1
            className="text-white tracking-tighter leading-none"
            style={{ fontSize: "clamp(60px, 12vw, 80px)" }}
          >
            Define routes once.
          </h1>
          <h1
            className="text-white  tracking-tighter leading-none"
            style={{ fontSize: "clamp(60px, 12vw, 80px)" }}
          >
            Navigate everywhere.
          </h1>
        </motion.div>

        {/* Sub headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/90 max-w-2xl text-base sm:text-lg font-medium leading-relaxed mb-16"
          style={{ letterSpacing: "-0.01em" }}
        >
          Sirou (Simple Router) is a framework-agnostic, universal routing and
          navigation engine for TypeScript. It provides a single source of truth
          for your application's architecture, ensuring type safety and
          consistent logic across Web, Mobile, and Server environments.
        </motion.p>

        {/* Bash + CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl mb-20"
        >
          <div className="flex-1 w-full bg-black rounded-[10px] p-2 flex items-center gap-4 shadow-2xl">
            <div className="bg-white/5 rounded-xl px-2 py-2 flex items-center gap-4 flex-1 overflow-hidden">
              <Terminal className="w-4 h-4 text-white shrink-0" />
              <code className="text-xs sm:text-base font-mono text-white truncate">
                $ npm install @sirou/core
              </code>
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText("npm install @sirou/core")
              }
              className="p-3.5 hover:bg-white/10 rounded-xl transition-colors text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {/* <a
            href="/docs/getting-started/introduction"
            className="w-full sm:w-auto px-14 py-6 bg-white text-black rounded-2xl text-xl font-bold transition-all hover:opacity-90 shadow-[0_0_60px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
            Get Started →
          </a> */}
        </motion.div>

        {/* Code Block Container - Widened */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <CodeBlock />
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        :global(html) {
          font-family:
            "Outfit",
            -apple-system,
            system-ui,
            sans-serif;
          letter-spacing: -0.01em;
        }
      `}</style>
    </section>
  );
}
