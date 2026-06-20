import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, style, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--ink-muted)",
            }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-10 px-3 rounded-[8px] w-full transition-colors outline-none",
            "focus:border-[var(--alkan2)]",
            className,
          )}
          style={{
            background: "var(--surface-card)",
            border: `1px solid ${error ? "var(--red)" : "var(--border-strong)"}`,
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            ...style,
          }}
          {...props}
        />
        {error ? (
          <span style={{ fontSize: 11, color: "var(--red-text)", fontFamily: "var(--font-sans)" }}>{error}</span>
        ) : hint ? (
          <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-sans)" }}>{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "AlkanInput";