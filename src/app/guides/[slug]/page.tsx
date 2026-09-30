import { notFound } from "next/navigation";
import { GUIDES, guideBySlug, guidePath } from "@/data/guides";
import { GuideArticle } from "@/components/content/GuideArticle";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
// Guides with their own hub path (g.path) are rendered there instead.
export const generateStaticParams = () => GUIDES.filter((g) => !g.path).map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  return pageMetadata({
    title: g.metaTitle,
    absoluteTitle: true,
    description: g.description,
    path: guidePath(g),
    keywords: g.keywords,
    type: "article",
    publishedTime: g.published,
    modifiedTime: g.updated,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g || g.path) notFound();
  return <GuideArticle g={g} crumbs={[{ name: "Guides", path: "/guides/" }]} />;
}
