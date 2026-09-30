import { notFound } from "next/navigation";
import { SegmentView } from "@/components/listing/SegmentView";
import { publishedSegments, segmentFor } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => publishedSegments("use-cases").map((p) => ({ slug: p.seg.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = segmentFor("use-cases", (await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.seg.h1} (${new Date().getFullYear()})`,
    description: p.seg.intro,
    path: p.path,
    keywords: [p.seg.keyword],
    noindex: p.gate !== "index",
  });
}

export default async function Page({ params }: Props) {
  const p = segmentFor("use-cases", (await params).slug);
  if (!p) notFound();
  return <SegmentView p={p} />;
}
