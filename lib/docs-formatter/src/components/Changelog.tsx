"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "new" | "improved" | "fixed" | "breaking";
    content: string;
  }[];
}

interface ChangelogProps {
  content: string;
}

const TYPE_COLORS = {
  new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  improved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fixed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  breaking: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const TYPE_LABELS = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
  breaking: "Breaking",
};

export const Changelog: React.FC<ChangelogProps> = ({ content }) => {
  // Simple parser for :::changelog blocks
  // Expected format:
  // ## [1.2.0] - 2026-03-01
  // - [new] Added search support
  // - [fixed] Resolved crash in trie

  const entries: ChangelogEntry[] = React.useMemo(() => {
    const lines = content.split("\n");
    const result: ChangelogEntry[] = [];
    let currentEntry: ChangelogEntry | null = null;

    lines.forEach((line) => {
      const versionMatch = line.match(/##\s*\[(.*?)\]\s*-\s*(.*)/);
      if (versionMatch) {
        if (currentEntry) result.push(currentEntry);
        currentEntry = {
          version: versionMatch[1],
          date: versionMatch[2],
          changes: [],
        };
      } else {
        const changeMatch = line.match(/-\s*\[(.*?)\]\s*(.*)/);
        if (changeMatch && currentEntry) {
          currentEntry.changes.push({
            type: changeMatch[1].toLowerCase() as any,
            content: changeMatch[2],
          });
        }
      }
    });

    if (currentEntry) result.push(currentEntry);
    return result;
  }, [content]);

  return (
    <div className="relative space-y-24 py-4">
      {/* Central Timeline Line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-[2.5px]" />

      {entries.map((entry, i) => (
        <div key={i} className="relative pl-12 group">
          {/* Timeline Node */}
          <div className="absolute left-0 top-[10px] w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10" />

          {/* Entry Header: Date + Read More */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
              {entry.date}
            </span>
            <div className="w-px h-3 bg-white/10" />
          </div>

          {/* Title - Extracting from content or using version */}
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
            {entry.changes[0]?.content.split("**")[1] ||
              `Version ${entry.version} Release`}
          </h2>

          {/* Summary / Changes */}
          <div className="space-y-6 max-w-2xl mb-10">
            {entry.changes.map((change, j) => (
              <div key={j} className="flex gap-4 items-start">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider border shrink-0 mt-1.5",
                    TYPE_COLORS[change.type] || TYPE_COLORS.improved,
                  )}
                >
                  {TYPE_LABELS[change.type] || "Note"}
                </span>
                <p className="text-[17px] text-white/80 leading-relaxed font-medium">
                  {change.content.replace(/\*\*(.*?)\*\*:?\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
