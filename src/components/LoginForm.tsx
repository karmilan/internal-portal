"use client";

import { StatusMessage } from "@/components/ui/status-message";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: { message?: string; details?: { email?: string; password?: string } } = {};

      try {
        data = (await response.json()) as {
          message?: string;
          details?: { email?: string; password?: string };
        };
      } catch {
        if (!response.ok) {
          setError("Unable to sign in. Please try again.");
          return;
        }
      }

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          setFieldErrors(data.details);
          setError(data.message ?? "Check your email and password.");
          return;
        }

        if (response.status === 401) {
          setError("Invalid email or password.");
          return;
        }

        if (response.status >= 500) {
          setError("Unable to sign in. Please try again.");
          return;
        }

        setError("Unable to sign in. Please try again.");
        return;
      }

      router.push("/portal");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "login-email-error" : "login-error"}
          className={fieldClassName}
        />
        {fieldErrors.email ? (
          <p id="login-email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isSubmitting}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "login-password-error" : "login-error"}
          className={fieldClassName}
        />
        {fieldErrors.password ? (
          <p id="login-password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>
      {error ? (
        <div id="login-error">
          <StatusMessage variant="error">{error}</StatusMessage>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-2 min-h-11 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
