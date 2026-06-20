import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "gold" | "green" | "alkan" | "amber" | "red";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, { bg: string; text: string; border: string }> = {
  neutral: { bg: "var(--surface-warm)", text: "var(--ink-soft)", border: "var(--border-strong)" },
  gold:    { bg: "var(--gold-pale)",    text: "var(--amber-text)", border: "var(--gold)" },
  green:   { bg: "var(--green-bg)",     text: "var(--green-text)", border: "var(--green)" },
  alkan:   { bg: "var(--alkan-bg)",     text: "var(--alkan2)",     border: "var(--alkan)" },
  amber:   { bg: "var(--amber-bg)",     text: "var(--amber-text)", border: "var(--amber)" },
  red:     { bg: "var(--red-bg)",       text: "var(--red-text)",   border: "var(--red)" },
};

export const Badge: React.FC<BadgeProps> = ({ className, tone = "neutral", style, children, ...p }) => {
  const t = tones[tone];
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "2px 7px",
        borderRadius: 4,
        background: t.bg,
        color: t.text,
        border: `1px solid ${t.border}`,
        lineHeight: 1.4,
        ...style,
      }}
      {...p}
    >
      {children}
    </span>
  );
};