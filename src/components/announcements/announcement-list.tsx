import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { StatusMessage } from "@/components/ui/status-message";
import type { Announcement } from "@/types/announcements";

type AnnouncementListProps = {
  announcements: Announcement[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  isRetrying: boolean;
};

function AnnouncementListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1].map((key) => (
        <div
          key={key}
          className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="h-5 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <div className="mt-4 h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      ))}
      <p className="sr-only">Loading announcements…</p>
    </div>
  );
}

export function AnnouncementList({
  announcements,
  isLoading,
  loadError,
  onRetry,
  isRetrying,
}: AnnouncementListProps) {
  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Loading announcements…</p>
        <AnnouncementListSkeleton />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <StatusMessage variant="error">
          {loadError}
          <span className="mt-1 block text-red-700/90 dark:text-red-100/90">Please try again.</span>
        </StatusMessage>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="min-h-11 w-fit rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          {isRetrying ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">No announcements yet.</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Be the first to share an update.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <AnnouncementCard announcement={announcement} />
        </li>
      ))}
    </ul>
  );
}
