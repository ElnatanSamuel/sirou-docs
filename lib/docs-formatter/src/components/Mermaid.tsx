"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  content: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        fontSize: "16px",
        fontFamily: "var(--font-inter)",
      },
      securityLevel: "loose",
    });

    const render = async () => {
      if (!containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, content);
        setSvg(renderedSvg);
        setIsError(false);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setIsError(true);
      }
    };

    // Use requestAnimationFrame to ensure the container is in the DOM
    const handle = requestAnimationFrame(render);
    return () => cancelAnimationFrame(handle);
  }, [content]);

  if (isError) {
    return (
      <div className="my-12 p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-center">
        <p className="text-red-400 font-mono text-sm">
          Diagram syntax error. Please check the markdown content.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container my-12 flex justify-center bg-[#0D0D0D] p-10 rounded-3xl border border-white/10 shadow-2xl transition-all hover:border-white/20 overflow-hidden"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
