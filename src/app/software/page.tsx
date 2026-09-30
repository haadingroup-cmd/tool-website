import { RootHub } from "@/components/listing/RootHub";
import { ROOTS } from "@/lib/listings";
import { toolsInRoot } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

const r = ROOTS["software"];

export const metadata = pageMetadata({
  title: `${r.title} (${new Date().getFullYear()})`,
  description: `${r.intro} ${toolsInRoot("software").length} products listed.`,
  path: "/software/",
});

export default function Page() {
  return <RootHub root="software" />;
}
