"use client";

import React, { useState, useEffect } from "react";
import { marked } from "marked";
import Prism from "prismjs";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabbedContentProps {
  content: string;
}

/**
 * Strips HTML tags and decodes entities to get plain text.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Build one unified code string from a mix of markdown tokens:
 * - `code` tokens → raw code lines
 * - everything else → `// comment` lines
 * Groups are separated by a blank line.
 */
function buildUnifiedCode(tokens: ReturnType<typeof marked.lexer>): {
  code: string;
  language: string;
  isBash: boolean;
} {
  const parts: string[] = [];
  let detectedLang = "typescript";
  let isBash = false;

  for (const token of tokens) {
    if (token.type === "code") {
      const lang = token.lang || "typescript";
      if (lang === "bash" || lang === "sh") {
        isBash = true;
        detectedLang = lang;
      } else if (detectedLang === "typescript") {
        detectedLang = lang;
      }
      parts.push(token.text.trim());
    } else {
      const html = (marked as any).parser([token]);
      const plain = htmlToPlainText(html);
      if (plain) {
        const commentLines = plain
          .split("\n")
          .filter(Boolean)
          .map((l) => `// ${l}`)
          .join("\n");
        parts.push(commentLines);
      }
    }
  }

  return {
    code: parts.join("\n\n"),
    language: isBash ? detectedLang : detectedLang,
    isBash,
  };
}

export const TabbedContent: React.FC<TabbedContentProps> = ({ content }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabs = content
    .split("@tab")
    .filter(Boolean)
    .map((part) => {
      const lines = part.trim().split("\n");
      const title = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();
      return { title, body };
    })
    .filter((tab) => tab.title.length > 0 && tab.body.length > 0);

  const safeIndex = Math.min(activeIndex, tabs.length - 1);

  const { code, language, isBash } = buildUnifiedCode(
    marked.lexer(tabs[safeIndex]?.body ?? ""),
  );

  useEffect(() => {
    Prism.highlightAll();
  }, [activeIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (tabs.length === 0) return null;

  return (
    <div className="my-10 rounded-2xl overflow-hidden bg-[#0D0D0D] shadow-2xl">
      {/* Tab bar */}
      <div className="flex bg-black/50 px-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative px-5 py-3.5 text-[14px] font-bold transition-all duration-200",
              safeIndex === i
                ? "text-white"
                : "text-white/30 hover:text-white/60",
            )}
          >
            {tab.title}
            {safeIndex === i && (
              <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-white rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Single unified code block */}
      <div className="relative group">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-[4px] bg-white/5 hover:bg-white/10 transition-all z-10 active:scale-90"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60" />
          )}
        </button>

        <pre
          className={cn(
            "p-6 overflow-x-auto",
            `language-${language}`,
            isBash
              ? "font-mono text-[14px] leading-relaxed text-white/90"
              : "text-[15px] leading-7",
          )}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>

      <style jsx>{`
        pre {
          margin: 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
        }
        pre::-webkit-scrollbar {
          height: 4px;
        }
        pre::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};
