"use client";

import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Zap,
  Monitor,
  Terminal,
  Lock,
  CloudLightning,
  Plus,
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  index: number;
  total: number;
}

function FeatureCard({
  title,
  subtitle,
  description,
  icon,
  className,
  index,
  total,
}: FeatureCardProps) {
  // Logic for grid markers (3-column layout)
  const isLastInRow = (index + 1) % 3 === 0;
  const isInLastRow = index >= total - 3;

  return (
    <div
      className={cn(
        "relative p-10 flex flex-col border-r border-b border-white/10",
        isLastInRow && "lg:border-r-0",
        isInLastRow && "lg:border-b-0",
        className,
      )}
    >
      {/* Corner Markers - Using top-left for everyone */}
      <div className="absolute -left-2.5 -top-2.5 z-20 text-white/40">
        <Plus className="w-5 h-5" strokeWidth={1} />
      </div>

      {/* Top-Right marker only for last items in row */}
      <div
        className={cn(
          "absolute -right-2.5 -top-2.5 z-20 text-white/40",
          !isLastInRow && "lg:hidden",
        )}
      >
        <Plus className="w-5 h-5" strokeWidth={1} />
      </div>

      {/* Bottom-Left marker only for last row items */}
      <div
        className={cn(
          "absolute -left-2.5 -bottom-2.5 z-20 text-white/40",
          !isInLastRow && "lg:hidden",
        )}
      >
        <Plus className="w-5 h-5" strokeWidth={1} />
      </div>

      {/* Bottom-Right marker only for the very last item */}
      {index === total - 1 && (
        <div className="absolute -right-2.5 -bottom-2.5 z-20 text-white/40">
          <Plus className="w-5 h-5" strokeWidth={1} />
        </div>
      )}

      <div className="mb-6 w-10 h-10 rounded-[4px] bg-white/10 flex items-center justify-center text-white/40">
        {icon}
      </div>

      <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-3 font-sans">
        {subtitle}
      </span>

      <h3 className="text-xl font-bold tracking-tight mb-4 text-white font-heading">
        {title} <span className="text-white/20">.</span>
      </h3>

      <p className="text-white/80 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

export function FeaturesGrid() {
  const features = [
    {
      subtitle: "Compile-Time Safety",
      title: "Zero Runtime Typos",
      description:
        "TypeScript catches typos in route names and params at compile time. Get full type safety across your entire routing system.",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      subtitle: "Universal Adapter",
      title: "Write Once, Run Anywhere",
      description:
        "One single router instance works identically across React, Next.js, Svelte, React Native, and Flutter projects.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      subtitle: "Visual Debugging",
      title: "Built-in DevTools",
      description:
        "Monitor navigation state, history, and metadata in real-time with an integrated visual developer console.",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      subtitle: "Zero Flicker",
      title: "Integrated Data Loaders",
      description:
        "Fetch data before a route renders. Eliminate loading spinners and content flicker for a premium user experience.",
      icon: <CloudLightning className="w-5 h-5" />,
    },
    {
      subtitle: "Navigation Guarding",
      title: "Async Route Protection",
      description:
        "Multi-layer protection (Auth, RBAC) that can block or redirect users before navigation even commits.",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      subtitle: "Infrastructure",
      title: "Next.js Edge Middleware",
      description:
        "Run your routing guards directly on the edge for zero-latency authorization and hyper-fast redirects.",
      icon: <Terminal className="w-5 h-5" />,
    },
  ];

  return (
    <section className="w-full bg-[#000] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-xl md:text-3xl font-black tracking-tight mb-4 font-heading text-white ">
            Why Sirou?
          </h2>
          <p className="text-base md:text-lg text-white font-medium max-w-2xl">
            Eliminate fragmented routing logic. Treat your routes as a{" "}
            <span className="text-white font-bold">Centralized Schema</span>{" "}
            that ensures consistency across your entire stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10 relative">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              {...feature}
              index={idx}
              total={features.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
