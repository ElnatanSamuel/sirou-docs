import { NewHeader } from "@/components/new-header";
import { Sidebar } from "@/lib/docs-formatter/src";
import { getCategorizedDocs } from "@/lib/docs-utils";
import { redirect } from "next/navigation";
import { ClientSidebarWrapper } from "@/components/client-sidebar-wrapper";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categorizedDocs = await getCategorizedDocs();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <NewHeader />

      <div className="relative z-10 flex pt-[72px] h-screen overflow-hidden">
        {/* Sidebar wrapper to handle client-side navigation */}
        <ClientSidebarWrapper sections={categorizedDocs} />

        {/* Content area */}
        <main className="flex-1 relative min-w-0 overflow-y-auto overflow-x-hidden">
          {/* Subtle Grid Pattern - Content only */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
