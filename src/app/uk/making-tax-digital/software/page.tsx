import { notFound } from "next/navigation";
import { guideBySlug, guidePath } from "@/data/guides";
import { GuideArticle } from "@/components/content/GuideArticle";
import { pageMetadata } from "@/lib/seo";

const SLUG = "making-tax-digital-ai-accounting-software";

export function generateMetadata() {
  const g = guideBySlug(SLUG)!;
  return pageMetadata({
    title: g.metaTitle, absoluteTitle: true, description: g.description, path: guidePath(g), keywords: g.keywords,
    type: "article", publishedTime: g.published, modifiedTime: g.updated,
  });
}

export default function MtdSoftware() {
  const g = guideBySlug(SLUG);
  if (!g) notFound();
  return <GuideArticle g={g} crumbs={[{ name: "UK", path: "/uk/" }, { name: "Making Tax Digital", path: "/uk/making-tax-digital/" }]} />;
}
