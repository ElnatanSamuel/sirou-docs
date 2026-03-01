"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  title: string;
  category?: string;
}

interface SidebarProps {
  sections: Record<string, NavItem[]>;
  activeId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeId }) => {
  // Normalize activeId for default selection
  const effectiveActiveId =
    !activeId || activeId === "docs" || activeId === "/" || activeId === "intro"
      ? "getting-started/introduction"
      : activeId;

  const [openSection, setOpenSection] = useState<string | null>("Get Started");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // On mount / effectiveActiveId change, auto-open the section containing the active item
  useEffect(() => {
    const activeCategory = Object.entries(sections).find(([, items]) =>
      items.some((item) => item.id === effectiveActiveId),
    )?.[0];
    if (activeCategory) {
      setOpenSection(activeCategory);
    }
  }, [sections, effectiveActiveId]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Enhanced search logic for "close matches"
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return null;

    const results: NavItem[] = [];
    Object.entries(sections).forEach(([category, items]) => {
      items.forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        ) {
          results.push({ ...item, category });
        }
      });
    });
    return results;
  }, [sections, searchQuery]);

  const toggleSection = (category: string) => {
    setOpenSection((prev) => (prev === category ? null : category));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 md:hidden z-60 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={cn(
          "fixed md:sticky top-[72px] left-0 h-[calc(100vh-72px)] w-[280px] sm:w-80 shrink-0 border-r border-white/5 overflow-y-auto bg-black transition-transform duration-300 ease-in-out z-50 md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {/* Search Header */}
        <div className="px-6 py-8 border-b border-white/5">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-white/5 border border-white/40 rounded-[4px] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white/10 focus:border-white/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Nav Content */}
        <nav className="flex-1 pb-20">
          {searchQuery.trim() ? (
            // Search Results Mode
            <div className="px-4 py-4 space-y-1">
              <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/90">
                Search Results
              </div>
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/docs/${item.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "block px-4 py-3 rounded-[4px] text-[14px] font-medium transition-all",
                      effectiveActiveId === item.id
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <div className="text-[10px] text-white/20 uppercase tracking-widest mb-0.5">
                      {item.category}
                    </div>
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-sm text-white/70">
                  No matches found for "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            // Normal Categorized Mode
            Object.entries(sections).map(([category, items], idx) => {
              const isExpanded = openSection === category;
              const isLast = idx === Object.entries(sections).length - 1;

              return (
                <div
                  key={category}
                  className={cn(!isLast && "border-b border-white/5")}
                >
                  <button
                    onClick={() => toggleSection(category)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/2 transition-colors"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
                      {category}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-1">
                      {items.map((item) => {
                        const isActive = effectiveActiveId === item.id;
                        return (
                          <Link
                            key={item.id}
                            href={`/docs/${item.id}`}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-4 py-2.5 rounded-[4px] text-[14px] font-medium transition-all",
                              isActive
                                ? "text-white bg-white/10 shadow-sm"
                                : "text-white/50 hover:text-white hover:bg-white/5",
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </aside>
    </>
  );
};
