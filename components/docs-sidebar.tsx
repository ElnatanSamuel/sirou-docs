"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { DocSection } from "@/lib/docs-utils";

interface DocsSidebarProps {
  sections: DocSection[];
}

// Group sections by category
function groupSections(sections: DocSection[]) {
  const groups: { title: string; items: DocSection[] }[] = [];
  let currentGroup: { title: string; items: DocSection[] } | null = null;

  sections.forEach((section, index) => {
    // Check if this is a new group header (simplified logic)
    if (index % 2 === 0 && !section.slug.includes("/")) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { title: section.title, items: [] };
    } else {
      if (currentGroup) {
        currentGroup.items.push(section);
      }
    }
  });

  if (currentGroup) groups.push(currentGroup);
  return groups;
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Introduction"]),
  );

  const currentSlug = pathname.split("/").pop();
  const groups = useMemo(() => groupSections(sections), [sections]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return groups;

    return groups
      .map((group) => {
        const matchingItems = group.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            (item.category && item.category.toLowerCase().includes(query)),
        );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, searchQuery]);

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  // Auto-expand groups when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const allMatchingGroups = filteredGroups.map((g) => g.title);
      setExpandedGroups(new Set(allMatchingGroups));
    }
  }, [filteredGroups, searchQuery]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden p-2 rounded-md border border-white/10 bg-black/50 backdrop-blur-md hover:bg-white/5 smooth-transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] w-72 border-r border-white/5 bg-black smooth-transition z-35 md:translate-x-0 overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Search box */}
          <div className="sticky top-0 p-6 bg-black">
            <div className="relative group">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <Input
                placeholder="Search documentation..."
                className="pl-10 h-10 rounded-lg border-white/5 bg-white/5 focus:bg-white/10 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 pb-10 space-y-2">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-black text-white/40 uppercase tracking-[0.3em] hover:text-white transition-colors"
                  >
                    {group.title}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        expandedGroups.has(group.title) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedGroups.has(group.title) && (
                    <div className="space-y-1 mt-1">
                      {group.items.map((item) => {
                        const isActive = currentSlug === item.slug;
                        return (
                          <Link key={item.id} href={`/docs/${item.slug}`}>
                            <button
                              onClick={() => setIsOpen(false)}
                              className={`w-full text-left px-3 py-2 rounded-lg smooth-transition text-sm transition-all ${
                                isActive
                                  ? "bg-white/10 text-white font-bold"
                                  : "text-white/50 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {item.title}
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center pt-10 px-4 text-center">
                <p className="text-sm text-white/30">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
