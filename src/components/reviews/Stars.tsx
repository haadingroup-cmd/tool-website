import { Star } from "lucide-react";

/** Read-only star rating out of 5. */
export function Stars({ value, size = 16, label }: { value: number; size?: number; label?: string }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden="true"
          className={i <= rounded ? "fill-amber-400 text-amber-400" : i - 0.5 === rounded ? "fill-amber-200 text-amber-400" : "text-slate-300"}
        />
      ))}
    </span>
  );
}
