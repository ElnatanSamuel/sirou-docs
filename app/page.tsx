"use client";

import { NewHeader } from "@/components/new-header";
import { NewHero } from "@/components/new-hero";
import { FeaturesGrid } from "@/components/features-grid";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-foreground">
      <NewHeader />
      <NewHero />
      <div className="relative bg-black/40">
        <FeaturesGrid />
      </div>

      {/* Footer - Smaller & branded */}
      <footer className="py-6 px-6 border-t border-border/10 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-[120px] h-[120px]">
              <Image
                src="/image/siroumain.png"
                alt="Sirou Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] font-black text-white/80 uppercase tracking-[0.2em]">
            <a
              href="/docs"
              className="hover:text-white transition-all hover:scale-105"
            >
              Docs
            </a>
            <a
              href="https://github.com/ElnatanSamuel/sirou"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-all hover:scale-105"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/settings/sirou/packages"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-all hover:scale-105"
            >
              NPM
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
