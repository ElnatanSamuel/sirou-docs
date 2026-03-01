"use client";

import React from "react";
import { MarkdownView } from "@/lib/docs-formatter/src";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="sirou-docs-wrapper antialiased">
      <MarkdownView content={content} />
    </div>
  );
}
