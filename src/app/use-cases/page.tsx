import { SegmentIndex } from "@/components/listing/SegmentView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Software & AI Tools by Use Case", description: "Start from the job you need done — invoicing, sales, support, automation — and see the software that handles it, with UK considerations.", path: "/use-cases/" });

export default function Page() {
  return <SegmentIndex kind="use-cases" title="Software & AI Tools by Use Case" lead="Start from the job you need done — invoicing, sales, support, automation — and see the software that handles it, with UK considerations." />;
}
