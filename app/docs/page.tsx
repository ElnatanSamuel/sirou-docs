import { getDocBySlug } from "@/lib/docs-utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { DocsNav } from "@/components/docs-nav";
import { notFound } from "next/navigation";

export default async function DocsIndexPage() {
  const doc = await getDocBySlug("getting-started/introduction");

  if (!doc) notFound();

  return (
    <div className="flex w-full">
      <article className="flex-1 min-w-0 px-5 md:px-8 max-w-6xl py-10 md:py-10 text-left">
        <div className="mb-6">
          <MarkdownRenderer content={doc.content} />
        </div>

        <DocsNav previous={doc.previous} next={doc.next} />
      </article>
    </div>
  );
}
