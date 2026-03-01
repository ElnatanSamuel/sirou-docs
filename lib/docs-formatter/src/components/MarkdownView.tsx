"use client";

import React, { useMemo, useEffect } from "react";
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prism-svelte";
import "prismjs/themes/prism-tomorrow.css";
import { CodeBlock } from "./CodeBlock";
import { TabbedContent } from "./TabbedContent";
import { Mermaid } from "./Mermaid";
import { Changelog } from "./Changelog";

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const processedContent = useMemo(() => {
    // 1. Separate tabs, features, and changelog syntax
    const segments = content.split(
      /(:::tabs[\s\S]*?:::|:::features[\s\S]*?:::|:::changelog[\s\S]*?:::)/g,
    );

    return segments.map((seg, i) => {
      if (seg.startsWith(":::tabs")) {
        const inner = seg.replace(/:::tabs/g, "").replace(/:::/g, "");
        return <TabbedContent key={i} content={inner} />;
      }

      if (seg.startsWith(":::features")) {
        const inner = seg.replace(/:::features/g, "").replace(/:::/g, "");
        const tokens = marked.lexer(inner);

        // Extract features (h3 as title, p as description)
        const features: { title: string; description: string }[] = [];
        let currentFeature: { title: string; description: string } | null =
          null;

        tokens.forEach((token) => {
          if (token.type === "heading" && token.depth === 3) {
            if (currentFeature) features.push(currentFeature);
            currentFeature = { title: token.text, description: "" };
          } else if (token.type === "paragraph" && currentFeature) {
            currentFeature.description = token.text;
          }
        });
        if (currentFeature) features.push(currentFeature);

        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-[4px] bg-white/3 border border-white/10 transition-all"
              >
                <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                <p className="text-white/90 leading-relaxed text-[15px]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        );
      }

      if (seg.startsWith(":::changelog")) {
        const inner = seg.replace(/:::changelog/g, "").replace(/:::/g, "");
        return <Changelog key={i} content={inner} />;
      }

      // 2. Tokenize the remaining markdown
      const tokens = marked.lexer(seg);

      return (
        <React.Fragment key={i}>
          {tokens.map((token, index) => {
            if (token.type === "code") {
              if (token.lang === "mermaid") {
                return <Mermaid key={index} content={token.text} />;
              }
              return (
                <CodeBlock
                  key={index}
                  code={token.text}
                  language={token.lang || "typescript"}
                />
              );
            }

            // Fallback for other tokens (render as HTML)
            const html = marked.parser([token]);
            return (
              <div
                key={index}
                className="sirou-prose max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          })}
        </React.Fragment>
      );
    });
  }, [content]);

  return (
    <div className="sirou-markdown-view font-sans selection:bg-indigo-500/30 selection:text-white">
      <style jsx global>{`
        .sirou-markdown-view {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .sirou-prose p {
          font-family: var(--font-inter), sans-serif;
          font-size: 19px;
          line-height: 1.8;
          color: white;
          margin-bottom: 2rem;
          font-weight: 500;
        }
        .sirou-prose h1 {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: white;
          margin-top: 5rem;
          margin-bottom: 2.5rem;
          letter-spacing: -0.05em;
          line-height: 1.1;
        }
        .sirou-prose h2 {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 1rem;
        }
        .sirou-prose h3 {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .sirou-prose table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 3rem;
          font-size: 17px;
          border: 1px solid white;
        }
        .sirou-prose th,
        .sirou-prose td {
          border: 1px solid white;
          padding: 1.25rem;
          text-align: left;
        }
        .sirou-prose th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: 900;
          color: white;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.1em;
        }
        .sirou-prose td {
          color: white;
          font-family: var(--font-inter), sans-serif;
        }
        .sirou-prose ul,
        .sirou-prose ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        .sirou-prose li {
          font-family: var(--font-inter), sans-serif;
          font-size: 19px;
          color: white;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .sirou-prose li::marker {
          color: white;
        }
        .sirou-prose strong {
          color: white;
          font-weight: 800;
        }
        .sirou-prose code:not(pre code) {
          background: rgba(255, 255, 255, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.85em;
          color: white;
          font-weight: 700;
        }
        .sirou-prose blockquote {
          border-left: 4px solid white;
          padding-left: 1.5rem;
          margin-left: 0;
          margin-bottom: 2rem;
          font-style: normal;
          color: white;
          font-weight: 500;
        }
      `}</style>
      {processedContent}
    </div>
  );
};
