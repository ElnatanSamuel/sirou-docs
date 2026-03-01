import { getDocSections, getDocBySlug } from "@/lib/docs-utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { DocsNav } from "@/components/docs-nav";
import { notFound } from "next/navigation";

interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const sections = await getDocSections();
  return sections.map((section) => ({
    slug: section.slug.split("/"),
  }));
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");
  const doc = await getDocBySlug(slug);

  if (!doc) notFound();

  return (
    <div className="flex w-full">
      {/* Main scrollable content — optimized for docs-formatter */}
      <article className="flex-1 min-w-0 px-5 md:px-8 max-w-6xl py-10 md:py-10">
        {/* Content using integrated MarkdownRenderer (which uses docs-formatter) */}
        <div className="mb-20">
          <MarkdownRenderer content={doc.content} />
        </div>

        {/* Navigation between pages */}
        <DocsNav previous={doc.previous} next={doc.next} />
      </article>
    </div>
  );
}
