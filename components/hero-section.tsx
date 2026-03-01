"use client";

import React, { useState, useEffect } from "react";
import { Ripple } from "@/components/ui/ripple";
import { Button } from "@/components/ui/button";
import { Copy, Check, Github } from "lucide-react";
import Link from "next/link";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { cn } from "@/lib/utils";

const HeroTop = React.memo(function HeroTop() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 scale-200">
        <Ripple />
      </div>

      <div className="relative z-10 text-center select-none pointer-events-none animate-breath">
        <svg width="0" height="0" className="absolute">
          <filter
            id="engrave-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite
              operator="out"
              in="SourceGraphic"
              in2="offset-blur"
              result="inverse"
            />
            <feFlood floodColor="black" floodOpacity="1" result="color" />
            <feComposite
              operator="in"
              in="color"
              in2="inverse"
              result="shadow"
            />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </svg>

        <h1
          className="text-6xl md:text-8xl lg:text-[14rem] font-bold tracking-tighter leading-none uppercase font-heading"
          style={{
            color: "#080808",
            filter: "url(#engrave-filter)",
            textShadow: "0px 1px 1px rgba(255,255,255,0.15)",
            letterSpacing: "-0.02em",
          }}
        >
          Sirou
        </h1>
      </div>
    </section>
  );
});

export function HeroSection() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleCopy = (text: string, type: "install" | "example") => {
    navigator.clipboard.writeText(text);
    if (type === "install") {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  };

  const installCode = "npm install sirou";
  const exampleCode = `import { Grid } from 'sirou'

export function App() {
  return (
    <Grid
      columns={['Name', 'Email']}
      data={users}
    />
  )
}`;

  return (
    <>
      <HeroTop />

      {/* Installation & Setup Section */}
      <section className="relative w-full py-20 px-4 md:px-8 bg-black/50 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Installation & Description */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white font-heading">
                  Get Started with Sirou
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed font-sans">
                  Install Sirou and start building powerful React applications
                  with a flexible data grid that works seamlessly with any
                  framework.
                </p>
              </div>

              {/* Installation code with copy button */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-400 font-sans">
                  Install via npm
                </p>
                <div className="relative bg-[#0D0D0D] border border-white/10 rounded-xl p-5 font-mono text-sm overflow-hidden group">
                  <code className="text-white/90">
                    <span className="text-blue-400">npm</span> install sirou
                  </code>
                  <button
                    onClick={() => handleCopy(installCode, "install")}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    aria-label="Copy install command"
                  >
                    {copiedInstall ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Link href="/docs">
                  <Button className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 rounded-full text-base">
                    Read Documentation
                  </Button>
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 font-bold px-8 py-6 rounded-full text-base"
                  >
                    View on GitHub
                  </Button>
                </a>
              </div>
            </div>

            {/* Right side - Code block with syntax highlighting */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-400 font-sans">
                Quick Example
              </p>
              <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group">
                <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest ml-3">
                      typescript
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(exampleCode, "example")}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-90"
                    aria-label="Copy code example"
                  >
                    {copiedExample ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60" />
                    )}
                  </button>
                </div>
                <pre className="p-6 overflow-x-auto text-[14px] leading-relaxed language-typescript">
                  <code>{exampleCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase Section */}
      <section className="relative w-full py-24 px-4 md:px-8 bg-black/80 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left side - Main heading */}
            <div>
              <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight font-heading">
                Powerful features to help you control your world
              </h2>
            </div>

            {/* Right side - Description */}
            <div className="flex items-center">
              <p className="text-xl text-slate-300 leading-relaxed font-sans">
                Sirou provides enterprise-grade data management capabilities
                with intuitive APIs and comprehensive customization options for
                modern web applications.
              </p>
            </div>
          </div>

          {/* Feature grid - 2x3 layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚙️",
                title: "Control your devices",
                description:
                  "Manage all your application data with powerful filtering, sorting, and pagination capabilities built right in.",
              },
              {
                icon: "📅",
                title: "Scheduling",
                description:
                  "Organize tasks and workflows with intuitive scheduling features that integrate seamlessly with your data.",
              },
              {
                icon: "☁️",
                title: "Multi-tenancy",
                description:
                  "Build scalable applications with built-in support for multi-tenant architectures and data isolation.",
              },
              {
                icon: "👁️",
                title: "Scenario Creation",
                description:
                  "Create complex data scenarios and test cases to ensure your applications work perfectly in all situations.",
              },
              {
                icon: "📊",
                title: "Realtime Data visualisation",
                description:
                  "Visualize your data in real-time with dynamic updates and responsive performance across all devices.",
              },
              {
                icon: "🎨",
                title: "Custom branding",
                description:
                  "Customize every aspect of your data grid to match your brand identity and design requirements.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.04] group"
              >
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-heading">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        pre {
          background: transparent !important;
          margin: 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        code {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
        }
      `}</style>
    </>
  );
}
