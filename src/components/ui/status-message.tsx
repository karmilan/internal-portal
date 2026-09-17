import type { ReactNode } from "react";

type StatusMessageProps = {
  variant: "error" | "success" | "info";
  children: ReactNode;
  live?: "polite" | "assertive";
};

const variantClasses: Record<StatusMessageProps["variant"], string> = {
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
  info: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300",
};

export function StatusMessage({ variant, children, live }: StatusMessageProps) {
  return (
    <p
      className={`rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={live ?? (variant === "error" ? "assertive" : "polite")}
    >
      {children}
    </p>
  );
}
