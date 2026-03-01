"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/headings-utils";

export type { Heading };

interface Props {
  headings: Heading[];
}

export function DocsToc({ headings }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0.1 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:flex flex-col w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] px-8 py-12 border-l border-white/5 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        <span className="text-[10px] font-black text-white/25 uppercase tracking-[0.5em] mb-8">
          On this page
        </span>

        <nav className="space-y-4 flex-1">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={cn(
                "block text-[13px] py-0.5 transition-all duration-300 leading-normal",
                h.level === 3 ? "pl-5 text-white/20" : "font-medium",
                active === h.id
                  ? "text-white opacity-100 translate-x-1"
                  : "text-white/40 hover:text-white/80",
              )}
            >
              {h.text}
            </a>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-white/5">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-all group"
          >
            <div className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
            Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}
