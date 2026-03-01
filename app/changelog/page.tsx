import { getDocBySlug } from "@/lib/docs-utils";
import { MarkdownView } from "@/lib/docs-formatter/src/components/MarkdownView";
import { notFound } from "next/navigation";
import { NewHeader } from "@/components/new-header";
import { Search, Twitter, Mail } from "lucide-react";

export default async function ChangelogPage() {
  const doc = await getDocBySlug("changelog");

  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-[#04040a] text-white selection:bg-blue-500/30">
      <NewHeader />

      <div className="max-w-[1200px] mx-auto pt-40 pb-20 px-6 flex flex-col md:flex-row gap-16 relative z-10">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <h1 className="text-6xl font-bold tracking-tighter mb-10 text-white">
            Changelog
          </h1>

          <div className="space-y-6">
            <a
              href="https://www.npmjs.com/package/@sirou/core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-white/90 active:scale-95"
            >
              <div className="flex flex-col leading-none items-start">
                <span className="text-[8px] opacity-60 mb-0.5">
                  Latest Version
                </span>
                <span>npm install @sirou/core</span>
              </div>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <MarkdownView content={doc.content} />
        </main>
      </div>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
