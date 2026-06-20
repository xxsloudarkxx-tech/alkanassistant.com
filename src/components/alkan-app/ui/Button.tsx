import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-wider uppercase rounded-[8px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-10 px-5 text-[12px]",
  lg: "h-12 px-7 text-[13px]",
};

const variants: Record<Variant, string> = {
  primary:
    "text-[rgba(250,250,248,0.95)] hover:-translate-y-[1px] hover:shadow-[0_5px_14px_rgba(0,0,0,0.2)] active:translate-y-0",
  secondary:
    "bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-strong)] hover:bg-[var(--gold-pale)] hover:border-[var(--gold)]",
  ghost:
    "bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-warm)]",
  danger:
    "bg-[var(--red)] text-white hover:bg-[var(--red-text)]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, style, ...props }, ref) => {
    const isPrimary = variant === "primary";
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, sizes[size], variants[variant], "font-[var(--font-sans)]", className)}
        style={{
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.04em",
          ...(isPrimary ? { background: "var(--ink)" } : {}),
          ...style,
        }}
        {...props}
      >
        {isPrimary && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-light))" }}
          />
        )}
        {loading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        <span className="relative">{children}</span>
      </button>
    );
  }
);
Button.displayName = "AlkanButton";