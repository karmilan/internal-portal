"use client";

type PortalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PortalError({ reset }: PortalErrorProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Something went wrong</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        We could not load the portal. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}
