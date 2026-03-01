"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavItem {
  id: string | number;
  title: string;
  slug: string;
}

interface DocsNavProps {
  previous?: NavItem;
  next?: NavItem;
}

export function DocsNav({ previous, next }: DocsNavProps) {
  if (!previous && !next) return null;

  return (
    <div className="grid grid-cols-2 gap-4 pt-8 pb-10 border-t border-white/15">
      {previous ? (
        <Link
          href={`/docs/${previous.slug}`}
          className="group flex flex-col gap-2 p-5 rounded-[4px] border border-white/15 bg-white/3 hover:bg-white/5 transition-all text-left"
        >
          <span className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-[0.25em] text-white/70">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </span>
          <span className="font-bold text-[17px] text-white leading-tight group-hover:translate-x-0.5 transition-transform inline-block">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col gap-2 p-5 rounded-[4px] border border-white/15 bg-white/3 hover:bg-white/5 transition-all text-left"
        >
          <span className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-[0.25em] text-white/70">
            Next
            <ArrowRight className="w-4 h-4" />
          </span>
          <span className="font-bold text-[17px] text-white leading-tight group-hover:-translate-x-0.5 transition-transform inline-block">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
