import { notFound } from "next/navigation";
import { ListingView } from "@/components/listing/ListingView";
import { listingFor, publishedListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => publishedListings("software").map((l) => ({ slug: l.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const l = listingFor("software", (await params).slug);
  if (!l) return {};
  return pageMetadata({ title: l.title, description: l.description, path: l.path, keywords: [l.keyword], noindex: l.gate !== "index" });
}

export default async function Page({ params }: Props) {
  const l = listingFor("software", (await params).slug);
  if (!l) notFound();
  return <ListingView l={l} />;
}
