import * as React from "react";
import { cn } from "@/lib/utils";

type Accent = "gold" | "green" | "alkan" | "red" | "none";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: Accent;
}

const accentColor: Record<Accent, string> = {
  gold: "var(--gold)",
  green: "var(--green)",
  alkan: "var(--alkan2)",
  red: "var(--red)",
  none: "transparent",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent = "gold", style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-[10px] overflow-hidden", className)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
        borderTop: accent === "none" ? "1px solid var(--border)" : `3px solid ${accentColor[accent]}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "AlkanCard";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn("px-5 pt-4 pb-2", className)} {...p} />
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn("px-5 py-4", className)} {...p} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div
    className={cn("px-5 py-3", className)}
    style={{ borderTop: "1px solid var(--border)", background: "var(--surface-warm)" }}
    {...p}
  />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, style, ...p }) => (
  <h3
    className={cn("text-[18px]", className)}
    style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "var(--ink)", ...style }}
    {...p}
  />
);