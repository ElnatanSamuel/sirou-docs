"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out px-4 md:px-8",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2"
          : "bg-transparent py-6",
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 smooth-transition",
              scrolled
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10 pointer-events-none",
            )}
          >
            <Image
              src="/image/siroumain.png"
              alt="Sirou Logo"
              width={160}
              height={160}
              className="rounded-md object-contain transition-all duration-500 grayscale"
            />
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/docs">
            <Button
              variant="ghost"
              className="text-base md:text-xl smooth-transition gap-3  p-6"
            >
              <BookOpen className="w-10 h-10" />
              DOCS
            </Button>
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-base md:text-xl smooth-transition"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">GITHUB</span>
            </Button>
          </a>
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="smooth-transition"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
