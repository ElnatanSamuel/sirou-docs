"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocSection } from "@/lib/docs-utils";

interface Props {
  sections: DocSection[];
}

const GROUPS = [
  { label: "Getting Started", ids: [1, 2, 3, 4] },
  { label: "API Reference", ids: [5, 6, 7, 8] },
  { label: "Adapters", ids: [9, 10, 11, 12, 13] },
  { label: "Advanced", ids: [14, 15, 16, 17, 18] },
];

export function NewDocsSidebar({ sections }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Getting Started"]),
  );

  const currentSlug = pathname.split("/").pop();

  const grouped = useMemo(() => {
    return GROUPS.map((group) => ({
      label: group.label,
      items: sections.filter((s) => group.ids.includes(s.id)),
    })).filter((g) => g.items.length > 0);
  }, [sections]);

  const toggleGroup = (label: string) => {
    const next = new Set(expandedGroups);
    next.has(label) ? next.delete(label) : next.add(label);
    setExpandedGroups(next);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col pt-10">
      {/* Sidebar header */}
      <div className="px-8 pb-8">
        <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] block mb-1">
          Documentation
        </span>
        <div className="h-0.5 w-6 bg-white/20 rounded-full" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pb-10 px-4 space-y-1">
        {grouped.map((group) => (
          <div key={group.label} className="mb-6">
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 py-2 mb-3 group"
            >
              <span className="text-[12px] font-black text-white/50 uppercase tracking-[0.15em] group-hover:text-white transition-colors">
                {group.label}
              </span>
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-white/20 transition-transform",
                  expandedGroups.has(group.label) && "rotate-90",
                )}
              />
            </button>

            {expandedGroups.has(group.label) && (
              <div className="space-y-1 mb-2">
                {group.items.map((item) => {
                  const isActive = currentSlug === item.slug;
                  return (
                    <Link
                      key={item.id}
                      href={`/docs/${item.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-4 w-full text-left px-5 py-2.5 text-[15px] font-medium rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-white/10 text-white font-bold"
                          : "text-white/60 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-[60px] left-4 z-40 md:hidden p-2 bg-black border border-white/10 rounded-lg text-white/60 hover:text-white"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar — Premium Wide (w-80) */}
      <aside className="hidden md:flex flex-col w-80 shrink-0 border-r border-white/5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden bg-black z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-80 bg-black border-r border-white/5 z-35 md:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
