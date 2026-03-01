"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const RightNav: React.FC = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from the markdown view
  useEffect(() => {
    const extractHeadings = () => {
      const hTags = Array.from(
        document.querySelectorAll(
          ".sirou-markdown-view h2, .sirou-markdown-view h3",
        ),
      );
      const items = hTags.map((h, i) => {
        const id = h.id || `heading-${i}`;
        h.id = id;
        return {
          id,
          text: (h as HTMLElement).innerText,
          level: parseInt(h.tagName[1]),
        };
      });
      setHeadings(items);
      if (items.length > 0 && !activeId) {
        setActiveId(items[0].id);
      }
    };

    const timer = setTimeout(extractHeadings, 200);
    const mutationObserver = new MutationObserver(extractHeadings);
    const target = document.querySelector(".sirou-markdown-view");
    if (target) {
      mutationObserver.observe(target, { childList: true, subtree: true });
    }
    return () => {
      clearTimeout(timer);
      mutationObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection-based scroll spy — much more reliable than scroll events
  useEffect(() => {
    if (headings.length === 0) return;

    // Disconnect previous observer
    observerRef.current?.disconnect();

    const callback: IntersectionObserverCallback = (entries) => {
      // Find all headings currently intersecting
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        // Pick the one closest to viewport top
        visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        setActiveId(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    });

    observerRef.current = observer;
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-80 shrink-0 h-full overflow-y-auto p-10 hidden xl:block border-l border-white/20 sticky top-0 bg-black">
      <div className="text-[14px] font-black uppercase tracking-[0.3em] text-white mb-4">
        On this page
      </div>
      <nav className="space-y-1">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <button
              key={h.id}
              onClick={() =>
                document
                  .getElementById(h.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={cn(
                "block w-full text-left transition-all duration-200 rounded-md py-1.5 px-3",
                h.level === 3 ? "pl-6 text-[14px]" : "text-[14px]",
                isActive
                  ? "text-white font-bold"
                  : "text-white/70 font-medium hover:text-white/70",
              )}
            >
              {h.text}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
