"use client";

import { Sidebar } from "@/lib/docs-formatter/src";
import { useRouter, usePathname } from "next/navigation";
import { DocSection } from "@/lib/docs-utils";

interface ClientSidebarWrapperProps {
  sections: Record<string, DocSection[]>;
}

export function ClientSidebarWrapper({ sections }: ClientSidebarWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current slug from pathname
  const activeId = pathname.replace(/^\/docs\/?/, "") || "";

  // Convert DocSection to NavItem format expected by Sidebar
  const navSections: Record<string, { id: string; title: string }[]> = {};
  Object.entries(sections).forEach(([category, items]) => {
    navSections[category] = items.map((item) => ({
      id: item.slug,
      title: item.title,
    }));
  });

  return <Sidebar sections={navSections} activeId={activeId} />;
}
