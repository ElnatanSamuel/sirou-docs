"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  /** When true, hide the top header bar (e.g., when embedded inside TabbedContent which has its own header) */
  compact?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isTerminal =
    language === "bash" ||
    language === "sh" ||
    language === "none" ||
    language === "text";

  return (
    <div className={cn("relative group", compact ? "my-0" : "my-8")}>
      <div
        className={cn(
          "overflow-hidden bg-[#0D0D0D] shadow-2xl transition-all",
          compact ? "rounded-none border-none" : "rounded-2xl",
        )}
      >
        {!compact && (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              {isTerminal ? (
                <div className="flex items-center gap-2 text-white/60">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-bold tracking-tight">
                    Terminal
                  </span>
                </div>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  {language}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-[4px] hover:bg-white/10 transition-all active:scale-90"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60" />
              )}
            </button>
          </div>
        )}

        {compact && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-[4px] bg-white/5 hover:bg-white/15 transition-all opacity-0 group-hover:opacity-100 z-10 active:scale-90"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-white/40" />
            )}
          </button>
        )}

        <pre
          className={cn(
            "p-6 overflow-x-auto",
            `language-${language}`,
            isTerminal
              ? "font-mono text-[14px] leading-relaxed text-white/90"
              : "text-[12px] leading-7",
          )}
        >
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      </div>

      <style jsx>{`
        pre {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
          margin: 0;
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
