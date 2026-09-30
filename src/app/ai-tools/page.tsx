import { RootHub } from "@/components/listing/RootHub";
import { ROOTS } from "@/lib/listings";
import { toolsInRoot } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

const r = ROOTS["ai-tools"];

export const metadata = pageMetadata({
  title: `${r.title} (${new Date().getFullYear()})`,
  description: `${r.intro} ${toolsInRoot("ai-tools").length} products listed.`,
  path: "/ai-tools/",
});

export default function Page() {
  return <RootHub root="ai-tools" />;
}
