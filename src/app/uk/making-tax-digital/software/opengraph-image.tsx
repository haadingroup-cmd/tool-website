import { ogImage, OG_SIZE } from "@/lib/og";
import { guideBySlug } from "@/data/guides";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Making Tax Digital software — SmarterBiz.uk";

export default async function Image() {
  const g = guideBySlug("making-tax-digital-ai-accounting-software");
  return ogImage({ kicker: g?.kicker ?? "Guide", title: g?.title ?? "Making Tax Digital software" });
}
