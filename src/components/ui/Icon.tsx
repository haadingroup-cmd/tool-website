import {
  BadgeCheck, Boxes, Building2, Clapperboard, Code, CreditCard, FileText, Globe, GraduationCap, Handshake, HardHat, Headset,
  HeartPulse, Image, KanbanSquare, Landmark, LifeBuoy, LineChart, Mail, Megaphone, MessagesSquare, Mic, Music, Package, Palette,
  PenLine, Presentation, Receipt, Rocket, Scale, ScanSearch, SearchCheck, Share2, ShieldAlert, ShieldCheck, Sparkles, Store,
  Trophy, Users, UtensilsCrossed, Video, Wallet, Workflow, Zap, type LucideProps,
} from "lucide-react";

const ICONS = {
  BadgeCheck, Boxes, Building2, Clapperboard, Code, CreditCard, FileText, Globe, GraduationCap, Handshake, HardHat, Headset,
  HeartPulse, Image, KanbanSquare, Landmark, LifeBuoy, LineChart, Mail, Megaphone, MessagesSquare, Mic, Music, Package, Palette,
  PenLine, Presentation, Receipt, Rocket, Scale, ScanSearch, SearchCheck, Share2, ShieldAlert, ShieldCheck, Sparkles, Store,
  Trophy, Users, UtensilsCrossed, Video, Wallet, Workflow, Zap,
} as const;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = ICONS[name as keyof typeof ICONS] ?? Sparkles;
  return <C aria-hidden="true" {...props} />;
}
