import { SegmentIndex } from "@/components/listing/SegmentView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Software & AI Tools by Industry (UK)", description: "Shortlists for common UK small-business sectors, drawn from our directory and the UK rules that matter to each.", path: "/industries/" });

export default function Page() {
  return <SegmentIndex kind="industries" title="Software & AI Tools by Industry (UK)" lead="Shortlists for common UK small-business sectors, drawn from our directory and the UK rules that matter to each." />;
}
